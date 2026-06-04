/* panels.jsx — PowerZone control-panel chrome & data panels.
   Header (logo + chevrons + standby tag + status pill), LiveMetrics,
   SystemHealth, Subsystems checklist, Footer. Lucide icons throughout. */

const ASSET_P = '../../assets';

function StatusPill({ state, tone = 'off' }) {
  return (
    <div className={`pz-pill pz-pill--${tone}`}>
      <span className="pz-pill__dot" />
      <span className="pz-pill__label">System Status</span>
      <span className="pz-pill__state">{state}</span>
    </div>
  );
}

function ChevronStrip({ count = 5, lit = 0 }) {
  return (
    <div className="pz-chevrons" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={'pz-chevrons__c' + (i < lit ? ' is-lit' : '')} style={{ '--i': i }} />
      ))}
    </div>
  );
}

function Header({ status, tone, standby, chevronsLit }) {
  return (
    <header className="pz-header">
      <img className="pz-header__logo" src={`${ASSET_P}/logo-on-dark.png`} alt="Power Zone" draggable="false" />
      <ChevronStrip count={5} lit={chevronsLit} />
      <h1 className="pz-header__mode pz-status pz-status--off">{standby}</h1>
      <div className="pz-header__pill">
        <StatusPill state={status} tone={tone} />
      </div>
    </header>
  );
}

/* ── LIVE METRICS ───────────────────────────────────────────────────────── */
function MetricRow({ label, value, unit }) {
  return (
    <div className="pz-metric">
      <span className="pz-metric__label pz-field-label">{label}</span>
      <span className="pz-metric__value">
        <span className="pz-readout">{value}</span>
        <span className="pz-unit">{unit}</span>
      </span>
    </div>
  );
}

function LiveMetrics({ readings }) {
  return (
    <div className="pz-subpanel">
      <div className="pz-panel__head pz-label">Live Metrics</div>
      <div className="pz-metrics">
        <MetricRow label="Power Output" value={readings.power} unit="kW" />
        <MetricRow label="Voltage" value={readings.voltage} unit="V" />
        <MetricRow label="Current" value={readings.current} unit="A" />
        <MetricRow label="Frequency" value={readings.frequency} unit="Hz" />
      </div>
    </div>
  );
}

/* ── SYSTEM HEALTH ──────────────────────────────────────────────────────── */
function HealthRow({ label, online }) {
  return (
    <div className="pz-health">
      <span className={'pz-health__dot' + (online ? ' is-on' : '')} />
      <span className="pz-health__label pz-field-label">{label}</span>
      <span className={'pz-status ' + (online ? 'pz-status--on' : 'pz-status--off')}>
        {online ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}

function SystemHealth({ health }) {
  return (
    <div className="pz-subpanel">
      <div className="pz-panel__head pz-label">System Health</div>
      <div className="pz-healthlist">
        <HealthRow label="Grid Supply" online={health.grid} />
        <HealthRow label="Backup System" online={health.backup} />
        <HealthRow label="Auto-Start Sequence" online={health.autostart} />
      </div>
    </div>
  );
}

/* ── SUBSYSTEMS ─────────────────────────────────────────────────────────── */
const SUBSYSTEMS = [
  { icon: 'cog', label: 'Engine' },
  { icon: 'zap', label: 'Alternator' },
  { icon: 'cpu', label: 'Control System' },
  { icon: 'fan', label: 'Cooling System' },
  { icon: 'fuel', label: 'Fuel System' },
  { icon: 'wind', label: 'Exhaust System' },
  { icon: 'battery-charging', label: 'Battery System' },
];

function Subsystems({ online }) {
  return (
    <div className="pz-subsys">
      {SUBSYSTEMS.map((s) => (
        <div className="pz-subsys__row" key={s.label}>
          <i data-lucide={s.icon} className="pz-subsys__icon"></i>
          <span className="pz-subsys__label pz-field-label">{s.label}</span>
          <span className={'pz-status ' + (online ? 'pz-status--on' : 'pz-status--off')}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="pz-footer">
      <div className="pz-footer__left">
        <span className="pz-footer__badge">PZ</span>
        <div className="pz-footer__txt">
          <div className="pz-caption" style={{ color: 'var(--pz-fg-2)', letterSpacing: '0.14em' }}>
            POWER ZONE EMERGENCY MANAGEMENT SYSTEM
          </div>
          <div className="pz-mono">VERSION 2.4.0</div>
        </div>
      </div>
      <div className="pz-footer__right">
        <div className="pz-caption" style={{ color: 'var(--pz-fg-2)', letterSpacing: '0.14em' }}>
          INDUSTRIAL POWER SOLUTIONS
        </div>
        <div className="pz-mono">BUILT FOR CRITICAL APPLICATIONS</div>
      </div>
    </footer>
  );
}

Object.assign(window, { StatusPill, ChevronStrip, Header, LiveMetrics, SystemHealth, Subsystems, Footer });
