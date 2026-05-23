'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SolutionsSection from '@/components/SolutionsSection';
import ProcessSection from '@/components/ProcessSection';
import GoalsSection from '@/components/GoalsSection';

const LOGO_ON_DARK = '/images/logo-on-dark.png';
const BUTTON_IMG = '/images/button.png';
const DIESEL_SFX = '/diesel-start.mp3';

// ─── INTRO TIMING (mirrors the reference index.html) ──────────────────────
// Click → meters ramp 0 → target with jitter over STARTUP_DURATION.
// After a short settle pause, the intro panel clip-paths away top-to-bottom
// while a single-pixel transmission line descends in sync (REVEAL_DURATION).
// When the reveal completes the video begins playing.
const STARTUP_DURATION = 2500;
const REVEAL_START_AT = STARTUP_DURATION + 400; // 2900
const REVEAL_DURATION = 4000;
const VIDEO_START_AT = REVEAL_START_AT + REVEAL_DURATION; // 6900
// Engine fade is intentionally LONGER than the reveal so the diesel-start
// recording naturally tails off across the whole transition.
const DIESEL_FADE_DURATION = REVEAL_DURATION + 2500; // 6500ms, begins at REVEAL_START_AT

// Status-line cascade — Backup → ONLINE, Auto-Start → COMPLETE, evenly spaced
// across the meter ramp.
const BACKUP_ONLINE_AT = 600;
const AUTOSTART_COMPLETE_AT = 1300;

const COLOR_RED = '#ff3b30';
const COLOR_AMBER = '#ffbf3a';
const COLOR_GREEN = '#3bd67a';
const COLOR_MUTED = 'rgba(255, 255, 255, 0.28)';

const READOUT_TARGET = { power: 412, voltage: 415, ampere: 716 };

type StatusLineState = { state: string; color: string };

const HERO_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.5 },
  },
};

const HERO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

const INTRO_SEEN_KEY = 'pz:introSeen';

export default function Home() {
  // Initialize all state to "intro complete" by default; on the first
  // visit we override to false in a useEffect below. This lets us SSR
  // a stable initial render and only deviate on the client where we can
  // actually read sessionStorage. The trade-off is the very first paint
  // shows the post-video hero for one frame before flipping back to the
  // ignition state on a fresh visit; mitigated by `firstVisitChecked`
  // which keeps everything hidden until we know.
  const [firstVisitChecked, setFirstVisitChecked] = useState(false);
  const [introSeen, setIntroSeen] = useState(true);
  const [hasPressed, setHasPressed] = useState(true);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasLitUp, setHasLitUp] = useState(true);
  const [videoEnded, setVideoEnded] = useState(true);
  const [readings, setReadings] = useState({
    power: READOUT_TARGET.power,
    voltage: READOUT_TARGET.voltage,
    ampere: READOUT_TARGET.ampere,
  });
  const [backupStatus, setBackupStatus] = useState<StatusLineState>({
    state: 'ONLINE',
    color: COLOR_GREEN,
  });
  const [autoStartStatus, setAutoStartStatus] = useState<StatusLineState>({
    state: 'COMPLETE',
    color: COLOR_GREEN,
  });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dieselAudioRef = useRef<HTMLAudioElement | null>(null);
  const timersRef = useRef<number[]>([]);

  // Decide whether to play the intro on this mount. If the user has
  // never seen it (sessionStorage), reset to ignition-button state and
  // let them press it; otherwise leave the post-video hero visible. The
  // sessionStorage key is set once they hit the ignition button — we
  // don't want to replay the whole sequence if they navigate away and
  // come back mid-intro.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
    if (!seen) {
      setIntroSeen(false);
      setHasPressed(false);
      setIsRevealing(false);
      setHasLitUp(false);
      setVideoEnded(false);
      setReadings({ power: 0, voltage: 0, ampere: 0 });
      setBackupStatus({ state: 'STANDBY', color: COLOR_AMBER });
      setAutoStartStatus({ state: 'READY', color: COLOR_AMBER });
    }
    setFirstVisitChecked(true);
  }, []);

  // Start the video as soon as the reveal begins so it's already playing
  // beneath the descending transmission line. Skip entirely for returning
  // visitors (introSeen) — they see the static poster as a background.
  useEffect(() => {
    if (!isRevealing || introSeen) return;
    const video = videoRef.current;
    if (!video) return;
    const result = video.play();
    if (result && typeof result.then === 'function') {
      result.catch(() => {
        console.warn(
          'PowerZone intro: video autoplay was blocked (possible iOS Low Power Mode).',
        );
      });
    }
  }, [isRevealing, introSeen]);

  useEffect(() => {
    const diesel = new Audio(DIESEL_SFX);
    diesel.preload = 'auto';
    dieselAudioRef.current = diesel;
    return () => {
      diesel.pause();
    };
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (!hasPressed) return;
    const startTime = performance.now();
    let rafId = 0;
    // easeOutCubic ramp with subtle jitter in the first 70% so the meters
    // feel like a real genset spooling up — voltage/RPM never rise linearly.
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / STARTUP_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const jitterMag = t < 0.7 ? (1 - t) * 0.12 : 0;
      const j = (target: number) =>
        (Math.random() - 0.5) * target * jitterMag;
      setReadings({
        power: Math.max(
          0,
          Math.round(READOUT_TARGET.power * eased + j(READOUT_TARGET.power)),
        ),
        voltage: Math.max(
          0,
          Math.round(
            READOUT_TARGET.voltage * eased + j(READOUT_TARGET.voltage),
          ),
        ),
        ampere: Math.max(
          0,
          Math.round(
            READOUT_TARGET.ampere * eased + j(READOUT_TARGET.ampere),
          ),
        ),
      });
      if (t < 1) rafId = requestAnimationFrame(step);
      else
        setReadings({
          power: READOUT_TARGET.power,
          voltage: READOUT_TARGET.voltage,
          ampere: READOUT_TARGET.ampere,
        });
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasPressed]);

  // Smoothly ramps the diesel-start clip to silence over `durationMs` and
  // then stops it. We restore the original volume on the audio element so a
  // subsequent re-trigger (e.g. dev hot reload) starts from full volume.
  const fadeOutDiesel = (durationMs: number) => {
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
    timersRef.current.push(id);
  };

  const handleIgnition = () => {
    if (hasPressed) return;
    setHasPressed(true);

    // Once the user pulls the trigger we consider the intro "seen" —
    // bouncing to /products and back shouldn't replay it.
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      /* sessionStorage unavailable — non-fatal */
    }

    // Diesel-start kicks in immediately and runs through the full intro.
    // The fade begins at the same instant the clip-path reveal starts so
    // the engine sound naturally tails off across the transition.
    const diesel = dieselAudioRef.current;
    if (diesel) {
      diesel.currentTime = 0;
      diesel.volume = 1;
      diesel.play().catch(() => {
        console.warn('PowerZone intro: diesel sound blocked by browser.');
      });
    }

    // Status lines update mid-ramp.
    const backupTimer = window.setTimeout(() => {
      setBackupStatus({ state: 'ONLINE', color: COLOR_GREEN });
    }, BACKUP_ONLINE_AT);
    timersRef.current.push(backupTimer);

    const autoStartTimer = window.setTimeout(() => {
      setAutoStartStatus({ state: 'COMPLETE', color: COLOR_GREEN });
    }, AUTOSTART_COMPLETE_AT);
    timersRef.current.push(autoStartTimer);

    // Reveal phase — clip-path animation + transmission line descent +
    // diesel fade-out all start in lockstep.
    const revealTimer = window.setTimeout(() => {
      setIsRevealing(true);
      fadeOutDiesel(DIESEL_FADE_DURATION);
    }, REVEAL_START_AT);
    timersRef.current.push(revealTimer);

    // After the reveal finishes the intro panel is fully clipped — drop it
    // from the DOM and let the video take over.
    const handoff = window.setTimeout(
      () => setHasLitUp(true),
      VIDEO_START_AT,
    );
    timersRef.current.push(handoff);
  };

  // Render-gate. While `firstVisitChecked` is false we don't yet know
  // whether to play the intro or skip to the post-video hero — show a
  // black screen so the wrong state doesn't flash for a frame.
  if (!firstVisitChecked) {
    return <div className="w-screen h-screen bg-black" />;
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        {/* Layer 1 — Video. Always rendered so it's visible underneath the
         * intro panel as it clip-paths away. Plays only after isRevealing
         * fires (so the first frame shows as soon as the line starts moving).
         * When introSeen, no src is set — the poster acts as a static bg. */}
        <video
          ref={videoRef}
          className="absolute inset-0 z-0 w-full h-full object-cover [transition:opacity_1200ms_ease-out]"
          style={{ opacity: videoEnded ? 0.6 : 1 }}
          src={introSeen ? undefined : '/poweron.mp4'}
          poster="/images/intro-poster.jpg"
          muted
          playsInline
          preload={introSeen ? 'none' : 'auto'}
          onEnded={() => setVideoEnded(true)}
        />

        {/* Persistent top-left logo for the post-video state */}
        {hasLitUp && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={LOGO_ON_DARK}
            alt="PowerZone"
            draggable={false}
            className="pointer-events-none absolute left-[clamp(12px,2vw,32px)] top-[clamp(8px,1.5vh,20px)] z-40 h-[clamp(40px,6vh,72px)] w-auto select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
          />
        )}

        {/* Layer 2 — Intro panel. Sits above the video and clip-paths away
         * from top to bottom over REVEAL_DURATION (linear). Once VIDEO_START_AT
         * fires it's removed entirely so the video takes the screen. */}
        {!hasLitUp && (
          <div
            className="absolute inset-0 z-20 bg-black"
            style={{
              clipPath: isRevealing ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)',
              transition: isRevealing
                ? `clip-path ${REVEAL_DURATION}ms linear`
                : 'none',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
              }}
            />

            {/* Top-left logo (hidden until ignition is pressed) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={LOGO_ON_DARK}
              alt="PowerZone — Engineering & Services"
              draggable={false}
              initial={false}
              animate={{ opacity: hasPressed ? 1 : 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="pointer-events-none absolute left-[clamp(16px,2.5vw,40px)] top-[clamp(16px,2.5vw,40px)] z-30 h-[clamp(72px,11vh,128px)] w-auto select-none"
            />

            {/* Top-right grid status */}
            <div className="absolute right-[clamp(16px,2.5vw,40px)] top-[clamp(20px,2.8vh,48px)] z-30 flex items-center gap-3 font-mono text-[clamp(9px,1.1vh,11px)] uppercase tracking-[0.3em]">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: COLOR_RED,
                  boxShadow: `0 0 10px ${COLOR_RED}99`,
                }}
              />
              <span style={{ color: COLOR_RED }}>Grid Status: Offline</span>
            </div>

            {/* Ignition button + readout panel */}
            <div className="absolute inset-0 flex items-center justify-center gap-[clamp(32px,8vw,80px)]">
              <IgnitionButton
                onPress={handleIgnition}
                disabled={hasPressed}
              />
              <ReadoutPanel
                power={readings.power}
                voltage={readings.voltage}
                ampere={readings.ampere}
              />
            </div>

            {/* Bottom-center status lines */}
            <div className="absolute bottom-[clamp(72px,12vh,112px)] left-1/2 z-30 -translate-x-1/2 space-y-2.5">
              <StatusLine
                label="Grid Supply"
                state="FAILED"
                color={COLOR_RED}
              />
              <StatusLine
                label="Backup System"
                state={backupStatus.state}
                color={backupStatus.color}
              />
              <StatusLine
                label="Auto-Start Sequence"
                state={autoStartStatus.state}
                color={autoStartStatus.color}
              />
            </div>

            {/* Footer */}
            <div className="absolute bottom-[clamp(20px,3.5vh,32px)] left-1/2 z-30 -translate-x-1/2 font-mono text-[clamp(8px,1vh,10px)] uppercase tracking-[0.3em] text-white/25">
              Power Zone Emergency Management System v2.4
            </div>
          </div>
        )}

        {/* Layer 3 — Transmission line. A 1px amber bar that descends from the
         * top edge to the bottom of the viewport in lockstep with the clip-path
         * reveal, then quickly fades out. Mirrors the reference exactly. */}
        {isRevealing && !hasLitUp && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 z-30 h-px"
            style={{
              backgroundColor: COLOR_AMBER,
              boxShadow: `0 0 8px ${COLOR_AMBER}`,
            }}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: '100vh', opacity: [1, 1, 0] }}
            transition={{
              y: { duration: REVEAL_DURATION / 1000, ease: 'linear' },
              opacity: {
                duration: (REVEAL_DURATION + 300) / 1000,
                times: [0, REVEAL_DURATION / (REVEAL_DURATION + 300), 1],
                ease: 'linear',
              },
            }}
          />
        )}

        {/* Hero punchline — appears only after the video finishes. */}
        {videoEnded && (
          <>
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                absolute left-0 right-0 top-0 z-30 h-24
                bg-black/30 backdrop-blur-md
                border-b border-white/10
              "
            >
              <div
                className="
                  flex h-full items-center justify-center gap-3
                  text-sm font-bold uppercase tracking-[0.24em]
                  text-white
                  [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]
                "
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="
                      cursor-pointer
                      rounded-full px-5 py-2
                      transition-colors duration-300
                      hover:bg-red-500/55
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>

            <motion.div
              variants={HERO_CONTAINER_VARIANTS}
              initial="hidden"
              animate="show"
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
            >
              <motion.h1
                variants={HERO_ITEM_VARIANTS}
                className="mt-5 font-semibold leading-[0.95] text-[clamp(40px,5.5vw,84px)] tracking-[-0.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
              >
                Diesel Generators
                <br />
                by Power Zone
              </motion.h1>
              <motion.p
                variants={HERO_ITEM_VARIANTS}
                className="mt-5 text-[12px] md:text-[14px] font-medium uppercase tracking-[0.34em] text-white/85 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
              >
                Reliable Backup Power
              </motion.p>
            </motion.div>

            {/* Floor-anchored body paragraph — pinned near the bottom edge. */}
            <motion.p
              variants={HERO_ITEM_VARIANTS}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.95 }}
              className="
                pointer-events-none absolute left-1/2 bottom-[23vh]
                -translate-x-1/2 z-20
                w-[min(40rem,90vw)] px-6 text-center
                text-[14px] md:text-[20px] leading-relaxed text-white/75
                [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]
              "
            >
              Power Zone delivers high performance diesel generators and
              advanced battery energy storage systems, ensuring uninterrupted
              power for industries across Pakistan.
            </motion.p>
          </>
        )}
      </div>
      {videoEnded && <SolutionsSection />}
      {videoEnded && <ProcessSection />}
      {videoEnded && <GoalsSection />}
    </>
  );
}

function IgnitionButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className="cursor-pointer select-none disabled:cursor-default"
      aria-label="Start engine"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BUTTON_IMG}
        alt=""
        draggable={false}
        className="pointer-events-none h-[clamp(140px,26vh,208px)] w-auto select-none drop-shadow-[0_10px_30px_rgba(220,38,38,0.28)]"
      />
    </motion.button>
  );
}

function ReadoutPanel({
  power,
  voltage,
  ampere,
}: {
  power: number;
  voltage: number;
  ampere: number;
}) {
  return (
    <div
      className="relative px-[clamp(20px,3vw,40px)] py-[clamp(14px,2.5vh,28px)] font-mono"
      style={{
        border: `1px solid ${COLOR_AMBER}66`,
        boxShadow: `0 0 26px ${COLOR_AMBER}14, inset 0 0 24px rgba(0, 0, 0, 0.35)`,
        backgroundColor: 'rgba(30, 22, 6, 0.35)',
      }}
    >
      <ReadoutRow label="Power" value={power.toString()} unit="kW" />
      <ReadoutRow label="Voltage" value={voltage.toString()} unit="V" />
      <ReadoutRow label="Ampere" value={ampere.toString()} unit="A" last />
    </div>
  );
}

function ReadoutRow({
  label,
  value,
  unit,
  last,
}: {
  label: string;
  value: string;
  unit: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-[clamp(28px,5vw,56px)] ${
        last ? '' : 'mb-5'
      }`}
    >
      <span
        className="text-[11px] font-medium uppercase tracking-[0.32em]"
        style={{ color: `${COLOR_AMBER}cc` }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="text-[clamp(20px,3.6vh,30px)] font-bold tabular-nums"
          style={{
            color: COLOR_AMBER,
            textShadow: `0 0 14px ${COLOR_AMBER}66`,
          }}
        >
          {value}
        </span>
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ color: `${COLOR_AMBER}99` }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function StatusLine({
  label,
  state,
  color,
}: {
  label: string;
  state: string;
  color: string;
}) {
  return (
    <div className="flex w-[clamp(280px,38vw,460px)] items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em]">
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 shrink-0"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}99`,
          transition:
            'background-color 600ms ease-out, box-shadow 600ms ease-out',
        }}
      />
      <span className="text-white/80">{label}</span>
      <span
        aria-hidden
        className="flex-1 translate-y-[-3px] border-b border-dotted"
        style={{ borderColor: COLOR_MUTED }}
      />
      <span style={{ color, transition: 'color 600ms ease-out' }}>
        {state}
      </span>
    </div>
  );
}
