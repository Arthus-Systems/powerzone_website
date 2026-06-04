'use client';

import type { CSSProperties } from 'react';
import { Fuel } from 'lucide-react';

export type FuelGaugeProps = {
  value?: number;
  label?: string;
};

export default function FuelGauge({ value = 0, label = 'Fuel Level' }: FuelGaugeProps) {
  const segs = 28;
  const lit = Math.round((value / 100) * segs);
  return (
    <div className="pz-fuel">
      <div className="pz-fuel__head">
        <Fuel className="pz-fuel__icon" />
      </div>
      <div className="pz-fuel__bar">
        <span className="pz-fuel__end">E</span>
        <div className="pz-fuel__track">
          {Array.from({ length: segs }).map((_, i) => (
            <span
              key={i}
              className={'pz-fuel__seg' + (i < lit ? ' is-lit' : '')}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </div>
        <span className="pz-fuel__end">F</span>
      </div>
      <div className="pz-fuel__pct">
        {Math.round(value)}
        <span>%</span>
      </div>
      <div className="pz-gauge__label">{label}</div>
    </div>
  );
}
