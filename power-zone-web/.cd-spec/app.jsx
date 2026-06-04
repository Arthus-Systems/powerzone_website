/* app.jsx — PowerZone control panel + cinematic reveal.

   FIXED 1760×990 (16:9) canvas, scaled to fit (never reflows).

   Sequence (all auto after one button press):
     idle → arming (chevron sweep ~1.9s)
          → online (values ramp; grill video starts playing)
          → revealing (camera pushes THROUGH the grill: the grill scales up to
            fill the canvas while mesh/blueprint/frame fade, leaving the video)
          → hero (video ends on the fully-lit hall; homepage hero fades in). */

const { useState, useEffect, useRef, useCallback } = React;

const CW = 1760, CH = 990;
const REVEAL_DELAY = 3400;   // ms online before the camera push begins

const NOMINAL = { power: 332, voltage: 400, current: 480, frequency: 50,
                  fuel: 78, load: 72, coolant: 84 };
const ZEROS = { power: 0, voltage: 0, current: 0, frequency: 0, fuel: 0, load: 0, coolant: 0 };

function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / CW, window.innerHeight / CH));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return scale;
}

function lucideRefresh() {
  if (window.lucide?.createIcons) window.lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
}

function ControlPanel() {
  const scale = useStageScale();
  const [phase, setPhase] = useState('idle');   // idle | arming | online | revealing | hero
  const [chevrons, setChevrons] = useState(0);
  const [readings, setReadings] = useState(ZEROS);
  const timers = useRef([]);
  const canvasRef = useRef(null);
  const grillInnerRef = useRef(null);
  const videoRef = useRef(null);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  /* value ramp — timer based so it advances even when not painting */
  useEffect(() => {
    if (phase !== 'online') return;
    const start = performance.now(), dur = 2400;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const id = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / dur), e = ease(t);
      const next = {};
      for (const k in NOMINAL) next[k] = +(NOMINAL[k] * e).toFixed(k === 'frequency' ? 1 : 0);
      setReadings(next);
      if (t >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [phase]);

  /* on power-online: start the grill video and schedule the camera push */
  useEffect(() => {
    if (phase !== 'online') return;
    const vid = videoRef.current;
    if (vid) { try { vid.currentTime = 0; } catch (e) {} vid.play().catch(() => {}); }
    const id = setTimeout(() => startReveal(), REVEAL_DELAY);
    timers.current.push(id);
  }, [phase]);

  const startReveal = useCallback(() => {
    const canvas = canvasRef.current, inner = grillInnerRef.current;
    if (!canvas || !inner) return;
    const cr = canvas.getBoundingClientRect(), ir = inner.getBoundingClientRect();
    const sc = cr.width / CW;                       // live scale of the canvas
    const gx = (ir.left - cr.left) / sc, gy = (ir.top - cr.top) / sc;
    const w = ir.width / sc, h = ir.height / sc;
    const s = Math.max(CW / w, CH / h) * 1.06;      // cover the canvas (+overscan)
    const dx = CW / 2 - (gx + w / 2), dy = CH / 2 - (gy + h / 2);
    inner.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
    setPhase('revealing');
  }, []);

  const arm = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('arming');
    [0, 1, 2, 3, 4].forEach((i) => {
      timers.current.push(setTimeout(() => setChevrons(i + 1), 250 + i * 300));
    });
    timers.current.push(setTimeout(() => setPhase('online'), 1950));
  }, [phase]);

  const reset = useCallback(() => {
    clearTimers();
    const vid = videoRef.current;
    if (vid) { vid.pause(); try { vid.currentTime = 0; } catch (e) {} }
    const inner = grillInnerRef.current;
    if (inner) { inner.style.transition = 'none'; inner.style.transform = ''; }
    requestAnimationFrame(() => { if (inner) inner.style.transition = ''; });
    setPhase('idle'); setChevrons(0); setReadings(ZEROS);
  }, []);

  const skip = useCallback(() => {
    const vid = videoRef.current;
    if (vid && vid.duration) vid.currentTime = Math.max(0, vid.duration - 0.08);
  }, []);

  useEffect(() => () => clearTimers(), []);
  useEffect(() => { lucideRefresh(); });

  const online = phase === 'online';
  const revealing = phase === 'revealing' || phase === 'hero';
  const lit = online || revealing;
  const status = lit ? 'ONLINE' : phase === 'arming' ? 'ARMING' : 'OFFLINE';
  const tone = lit ? 'on' : phase === 'arming' ? 'warn' : 'off';
  const standby = lit ? 'POWER ONLINE' : phase === 'arming' ? 'TRANSFER IN PROGRESS' : 'STANDBY MODE';

  return (
    <div className="pz-stage">
      <div
        ref={canvasRef}
        className={'pz-canvas' + (revealing ? ' is-revealing' : '')}
        style={{ width: CW, height: CH, transform: `scale(${scale})` }}
      >
        <div className={'pz-vignette' + (lit ? ' is-on' : '')} />

        <Header status={status} tone={tone} standby={standby} chevronsLit={chevrons} />

        <div className="pz-grid">
          {/* TOP ROW */}
          <section className="pz-row pz-row--top">
            <div className="pz-col-grill">
              <GrillWindow
                innerRef={grillInnerRef}
                videoRef={videoRef}
                videoOn={lit}
                revealing={revealing}
                onVideoEnded={() => setPhase('hero')}
              />
            </div>
            <div className="pz-col-ign pz-fade-out">
              <IgnitionButton armed={phase === 'arming'} running={online} onPress={arm} />
            </div>
            <div className="pz-col-data pz-panel pz-fade-out">
              <LiveMetrics readings={readings} />
              <div className="pz-col-data__divider" />
              <SystemHealth health={{ grid: false, backup: lit, autostart: lit }} />
            </div>
          </section>

          {/* MIDDLE ROW — gauges */}
          <section className="pz-row pz-row--gauges pz-panel pz-fade-out">
            <Gauge label="Voltage" unit="V" value={readings.voltage} max={500} />
            <Gauge label="Frequency" unit="Hz" value={readings.frequency} min={45} max={65} />
            <FuelGauge value={readings.fuel} />
            <Gauge label="Load" unit="%" value={readings.load} max={100} />
            <Gauge label="Coolant Temp" unit="°C" value={readings.coolant} max={120} />
          </section>

          {/* BOTTOM ROW */}
          <section className="pz-row pz-row--bottom pz-fade-out">
            <Schematic active={lit} />
            <div className="pz-panel pz-panel--pad">
              <div className="pz-panel__head pz-label">Subsystem Status</div>
              <Subsystems online={lit} />
            </div>
          </section>
        </div>

        <div className="pz-fade-out"><Footer /></div>

        {online && (
          <button className="pz-reset" onClick={reset}>
            <i data-lucide="rotate-ccw"></i> Reset to standby
          </button>
        )}
        {phase === 'revealing' && (
          <button className="pz-skip" onClick={skip}>Skip&nbsp;intro <i data-lucide="chevrons-right"></i></button>
        )}

        <HeroSection show={phase === 'hero'} onReplay={reset} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ControlPanel />);
setTimeout(lucideRefresh, 60);
