'use client';

import type { Readings } from './types';

type MetricRowProps = {
  label: string;
  value: number;
  unit: string;
};

function MetricRow({ label, value, unit }: MetricRowProps) {
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

export type LiveMetricsProps = {
  readings: Readings;
};

export default function LiveMetrics({ readings }: LiveMetricsProps) {
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
