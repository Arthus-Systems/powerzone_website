'use client';

import type { Tone } from './types';

export type StatusPillProps = {
  state: string;
  tone?: Tone;
};

export default function StatusPill({ state, tone = 'off' }: StatusPillProps) {
  return (
    <div className={`pz-pill pz-pill--${tone}`}>
      <span className="pz-pill__dot" />
      <span className="pz-pill__label">System Status</span>
      <span className="pz-pill__state">{state}</span>
    </div>
  );
}
