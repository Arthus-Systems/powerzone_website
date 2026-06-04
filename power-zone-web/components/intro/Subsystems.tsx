'use client';

import type { ComponentType } from 'react';
import {
  BatteryCharging,
  Cog,
  Cpu,
  Fan,
  Fuel,
  Wind,
  Zap,
} from 'lucide-react';

type LucideIcon = ComponentType<{ size?: number | string; className?: string }>;

type SubsystemDef = {
  Icon: LucideIcon;
  label: string;
};

const SUBSYSTEMS: SubsystemDef[] = [
  { Icon: Cog, label: 'Engine' },
  { Icon: Zap, label: 'Alternator' },
  { Icon: Cpu, label: 'Control System' },
  { Icon: Fan, label: 'Cooling System' },
  { Icon: Fuel, label: 'Fuel System' },
  { Icon: Wind, label: 'Exhaust System' },
  { Icon: BatteryCharging, label: 'Battery System' },
];

export type SubsystemsProps = {
  online: boolean;
};

export default function Subsystems({ online }: SubsystemsProps) {
  return (
    <div className="pz-subsys">
      {SUBSYSTEMS.map(({ Icon, label }) => (
        <div className="pz-subsys__row" key={label}>
          <Icon size={19} className="pz-subsys__icon" />
          <span className="pz-subsys__label pz-field-label">{label}</span>
          <span className={'pz-status ' + (online ? 'pz-status--on' : 'pz-status--off')}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      ))}
    </div>
  );
}
