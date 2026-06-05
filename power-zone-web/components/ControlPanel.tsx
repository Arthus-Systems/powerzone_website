'use client';

/* -----------------------------------------------------------------------------
 * ControlPanel — PowerZone pre-hero cinematic.
 *
 * Fluid stage that fills 100vw x 100vh at any aspect ratio. No more fixed
 * 1760x990 canvas with transform:scale() — the .pz-canvas owns its own size
 * via CSS, and every internal metric is fluid (clamp()/fr).
 *
 * 5-step state machine (unchanged):
 *
 *   idle -> arming (~1.9s chevron sweep)
 *         -> online (value ramp settles to nominal)
 *         -> revealing (dashboard clip-paths upward to reveal viewport video)
 *         -> hero (homepage hero overlay fades in)
 *
 * Refs:
 *   canvasRef         — the fluid stage; kept for layout / future hooks.
 *   grillInnerRef     — the grill window's inner box; kept for layout parity.
 *   viewportVideoRef  — the full-bleed reveal <video> behind the dashboard.
 * -------------------------------------------------------------------------- */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';

import './ControlPanel.css';

import Header from './intro/Header';
import GrillWindow from './intro/GrillWindow';
import IgnitionButton from './intro/IgnitionButton';
import LiveMetrics from './intro/LiveMetrics';
import SystemHealth from './intro/SystemHealth';
import Subsystems from './intro/Subsystems';
import Schematic from './intro/Schematic';
import Gauge from './intro/Gauge';
import FuelGauge from './intro/FuelGauge';
import Footer from './intro/Footer';
import type { Phase, Readings, Tone } from './intro/types';

const HERO_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.22, delayChildren: 1.1 },
  },
};

const HERO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── Timing constants ────────────────────────────────────────────────────── */
const REVEAL_DELAY = 3400; // ms online before the camera push begins

const DIESEL_SFX = '/diesel-start.mp3';
// Engine fade intentionally longer than the 1.9s slide so the diesel-start
// recording naturally tails off across the whole transition.
const DIESEL_FADE_DURATION = 4500;

/* Operating point for an FPT C13 TE3A (12.9L inline-6, 1500 rpm @ 50 Hz,
 * 442 kVA standby / 354 kWe ESP) running at ~72% load. All seven values
 * are internally consistent at this operating point and within realistic
 * operating bands for a healthy diesel genset:
 *   - power     = 0.72 × 354 kWe ≈ 255 kW
 *   - voltage   = 400 V (3-phase line-to-line, standard genset output)
 *   - current   = 0.72 × (442 kVA / (√3 × 400 V)) ≈ 460 A
 *   - frequency = 50.0 Hz (1500 rpm)
 *   - fuel      = 92% (typical, slightly below full)
 *   - load      = 72%
 *   - coolant   = 85°C (normal operating range is 82–95°C) */
const NOMINAL: Readings = {
  power: 255,
  voltage: 400,
  current: 460,
  frequency: 50,
  fuel: 92,
  load: 72,
  coolant: 85,
};
const ZEROS: Readings = {
  power: 0,
  voltage: 0,
  current: 0,
  frequency: 0,
  fuel: 0,
  load: 0,
  coolant: 0,
};

/* ── Asset paths (mapped to /public per project conventions) ─────────────── */
const LOGO_SRC = '/images/logo-on-dark.webp';
const BLUEPRINT_SRC = '/images/fpt_generator_blueprint.webp';
const MESH_SRC = '/images/mesh_grill.webp';

export type ControlPanelProps = {
  onHero?: () => void;
};

export default function ControlPanel({ onHero }: ControlPanelProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [chevrons, setChevrons] = useState<number>(0);
  const [readings, setReadings] = useState<Readings>(ZEROS);
  const [videoEnded, setVideoEnded] = useState<boolean>(false);

  const timers = useRef<number[]>([]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const grillInnerRef = useRef<HTMLDivElement | null>(null);
  const viewportVideoRef = useRef<HTMLVideoElement | null>(null);
  const heroShownRef = useRef<boolean>(false);
  const dieselAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup-only: pause whatever Audio object exists when the cinematic
  // unmounts. Construction is deferred to `arm()` below so users who never
  // press the ignition never download the ~700KB MP3.
  useEffect(() => {
    return () => {
      dieselAudioRef.current?.pause();
    };
  }, []);

  const clearTimers = useCallback((): void => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  /* Value ramp — timer-based so it still advances when the tab is paused on
   * paint. 16ms cadence matches a 60fps redraw without rAF coupling. */
  useEffect(() => {
    if (phase !== 'online') return;
    const start = performance.now();
    const dur = 2400;
    const ease = (t: number): number => 1 - Math.pow(1 - t, 3);
    const id = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const e = ease(t);
      const next: Readings = {
        power: +(NOMINAL.power * e).toFixed(0),
        voltage: +(NOMINAL.voltage * e).toFixed(0),
        current: +(NOMINAL.current * e).toFixed(0),
        frequency: +(NOMINAL.frequency * e).toFixed(1),
        fuel: +(NOMINAL.fuel * e).toFixed(0),
        load: +(NOMINAL.load * e).toFixed(0),
        coolant: +(NOMINAL.coolant * e).toFixed(0),
      };
      setReadings(next);
      if (t >= 1) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [phase]);

  const fadeOutDiesel = (durationMs: number): void => {
    const audio = dieselAudioRef.current;
    if (!audio) return;
    const startVol = audio.volume;
    const steps = 24;
    const stepMs = Math.max(20, durationMs / steps);
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      audio.volume = Math.max(0, startVol * (1 - i / steps));
      if (i >= steps) {
        window.clearInterval(id);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVol;
      }
    }, stepMs);
    timers.current.push(id);
  };

  /* Kick off the viewport video and flip the phase. The dashboard panel
   * clip-paths upward via CSS — no more FLIP transform math. */
  const startReveal = useCallback((): void => {
    // No more camera-zoom transform. The dashboard clip-paths upward via CSS;
    // here we just kick off the viewport video and flip the phase.
    fadeOutDiesel(DIESEL_FADE_DURATION);
    const heroV = viewportVideoRef.current;
    if (heroV) {
      try { heroV.currentTime = 0; } catch {}
      // Play the reveal video at 1.5x for a snappier handoff into the hero.
      heroV.playbackRate = 1.5;
      heroV.play().catch(() => {});
    }
    setPhase('revealing');
  }, []);

  /* On entering 'online': schedule the reveal. */
  useEffect(() => {
    if (phase !== 'online') return;
    const id = window.setTimeout(() => startReveal(), REVEAL_DELAY);
    timers.current.push(id);
  }, [phase, startReveal]);

  /* Notify the parent when we land on the hero phase. */
  useEffect(() => {
    if (phase === 'hero' && onHero) onHero();
  }, [phase, onHero]);

  /* Ignition press — only valid from idle. Schedules the 5 chevron lights
   * (250ms then +300ms each), then promotes to 'online' at 1950ms. */
  const arm = useCallback((): void => {
    if (phase !== 'idle') return;
    // Lazy-construct the diesel Audio on first press so we don't ship the
    // ~700KB MP3 on mount. Subsequent presses (e.g. after reset) re-use it.
    let diesel = dieselAudioRef.current;
    if (!diesel) {
      diesel = new Audio(DIESEL_SFX);
      diesel.preload = 'auto';
      dieselAudioRef.current = diesel;
    }
    diesel.currentTime = 0;
    diesel.volume = 1;
    diesel.play().catch(() => {
      /* Browser autoplay policy or Low Power Mode may block this — non-fatal. */
    });
    setPhase('arming');
    [0, 1, 2, 3, 4].forEach((i) => {
      timers.current.push(
        window.setTimeout(() => setChevrons(i + 1), 250 + i * 300),
      );
    });
    timers.current.push(window.setTimeout(() => setPhase('online'), 1950));
  }, [phase]);

  /* Skip the cinematic by jumping the viewport video near its end. */
  const skip = useCallback((): void => {
    const vid = viewportVideoRef.current;
    if (vid && vid.duration) {
      vid.currentTime = Math.max(0, vid.duration - 0.08);
    }
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (heroShownRef.current) return;
    heroShownRef.current = true;
    setVideoEnded(true);
    setPhase((p) => (p === 'revealing' || p === 'online' ? 'hero' : p));
  }, []);

  /* Cleanup any in-flight timers on unmount. */
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  /* Derived state — matches the spec's variable names. */
  const online = phase === 'online';
  const revealing = phase === 'revealing' || phase === 'hero';
  const lit = online || revealing;
  const status: string = lit ? 'ONLINE' : phase === 'arming' ? 'ARMING' : 'OFFLINE';
  const tone: Tone = lit ? 'on' : phase === 'arming' ? 'warn' : 'off';
  const standby: string = lit
    ? 'POWER ONLINE'
    : phase === 'arming'
      ? 'TRANSFER IN PROGRESS'
      : 'STANDBY MODE';

  return (
    <div className="pz-stage">
      <div
        ref={canvasRef}
        className={'pz-canvas' + (revealing ? ' is-revealing' : '') + (phase === 'hero' ? ' is-hero' : '')}
      >
        {/* viewport video at z-0, behind the dashboard */}
        {/* preload="metadata" downloads only the MP4 header (~10KB) so the
            browser knows duration/dimensions for instant playability
            decisions, but defers the ~740KB body until startReveal() calls
            heroV.play(). The cinematic's ~3.4s value-ramp + arming window
            (REVEAL_DELAY) before play kicks off gives the browser ample
            time to buffer enough video for smooth playback. */}
        <video
          ref={viewportVideoRef}
          className="pz-viewport-video absolute inset-0 z-0 w-full h-full object-cover [transition:opacity_2000ms_ease-out]"
          style={{ opacity: videoEnded ? 0.6 : 1 }}
          src="/poweron.mp4"
          poster="/poweron_final_frame.webp"
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnded}
          aria-hidden="true"
        />

        {/* dashboard panel that clip-paths away on reveal */}
        <div className="pz-dashboard">
          <div className={'pz-vignette' + (lit ? ' is-on' : '')} />

          <Header
            status={status}
            tone={tone}
            standby={standby}
            chevronsLit={chevrons}
            logoSrc={LOGO_SRC}
          />

          <div className="pz-grid">
            {/* TOP ROW */}
            <section className="pz-row pz-row--top">
              <div className="pz-col-grill">
                <GrillWindow
                  innerRef={grillInnerRef}
                  meshSrc={MESH_SRC}
                  blueprintSrc={BLUEPRINT_SRC}
                />
              </div>
              <div className="pz-col-ign pz-fade-out">
                <IgnitionButton
                  armed={phase === 'arming'}
                  running={online}
                  onPress={arm}
                  offSrc="/images/initiate_transfer_button_off.webp"
                  pressedSrc="/images/initiate_transfer_button_pressed.webp"
                  onSrc="/images/initiate_transfer_button_on.webp"
                />
              </div>
              <div className="pz-col-data pz-panel pz-fade-out">
                <LiveMetrics readings={readings} />
                <div className="pz-col-data__divider" />
                <SystemHealth
                  health={{ grid: false, backup: lit, autostart: lit }}
                />
              </div>
            </section>

            {/* MIDDLE ROW — gauges. Ranges match the FPT C13 TE3A operating
                envelope: 0–500 V on a 400 V genset, 47–53 Hz around 50 Hz
                nominal, 0–100% load, 0–120°C coolant (normal band 82–95°C). */}
            <section className="pz-row pz-row--gauges pz-panel pz-fade-out">
              <Gauge label="Voltage" unit="V" value={readings.voltage} max={500} />
              <Gauge
                label="Frequency"
                unit="Hz"
                value={readings.frequency}
                min={47}
                max={53}
              />
              <FuelGauge value={readings.fuel} />
              <Gauge label="Load" unit="%" value={readings.load} max={100} />
              <Gauge
                label="Coolant Temp"
                unit="°C"
                value={readings.coolant}
                max={120}
              />
            </section>

            {/* BOTTOM ROW */}
            <section className="pz-row pz-row--bottom pz-fade-out">
              <Schematic active={lit} blueprintSrc={BLUEPRINT_SRC} />
              <div className="pz-panel pz-panel--pad">
                <div className="pz-panel__head pz-label">Subsystem Status</div>
                <Subsystems online={lit} />
              </div>
            </section>
          </div>

          <div className="pz-fade-out">
            <Footer />
          </div>

          {phase === 'revealing' && (
            <button type="button" className="pz-skip" onClick={skip}>
              Skip&nbsp;intro <ChevronsRight strokeWidth={1.5} />
            </button>
          )}
        </div>

        {videoEnded && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 right-0 top-0 z-[100] mix-blend-difference text-white"
            >
              <Navbar />
            </motion.div>

            <motion.div
              variants={HERO_CONTAINER_VARIANTS}
              initial="hidden"
              animate="show"
              className="pointer-events-none absolute inset-0 z-[95] flex flex-col items-center justify-center px-8 text-center"
            >
              <motion.h1
                variants={HERO_ITEM_VARIANTS}
                className="font-heading mt-5 font-semibold leading-[1.02] text-[clamp(36px,5vw,78px)] tracking-[-0.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
              >
                Diesel Generators
                <br />
                by Power Zone
              </motion.h1>
              <motion.p
                variants={HERO_ITEM_VARIANTS}
                className="font-tiny mt-6 md:mt-7 text-[15px] md:text-[18px] font-bold uppercase tracking-[0.34em] text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
              >
                Reliable Backup Power
              </motion.p>
            </motion.div>

            <motion.p
              variants={HERO_ITEM_VARIANTS}
              initial="hidden"
              animate="show"
              transition={{ delay: 1.8 }}
              className="font-body pointer-events-none absolute left-1/2 bottom-[clamp(40px,10vh,160px)] -translate-x-1/2 z-[95] w-[min(40rem,90vw)] px-6 text-center text-[13px] md:text-[18px] leading-relaxed text-white/75 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
            >
              Power Zone delivers high performance diesel generators and advanced battery energy storage systems, ensuring uninterrupted power for industries across Pakistan.
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}
