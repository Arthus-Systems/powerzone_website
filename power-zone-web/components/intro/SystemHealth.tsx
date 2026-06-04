'use client';

type HealthRowProps = {
  label: string;
  online: boolean;
};

function HealthRow({ label, online }: HealthRowProps) {
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

export type SystemHealthProps = {
  health: {
    grid: boolean;
    backup: boolean;
    autostart: boolean;
  };
};

export default function SystemHealth({ health }: SystemHealthProps) {
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
