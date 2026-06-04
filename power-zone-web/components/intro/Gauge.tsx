'use client';

import { useId } from 'react';

/* polar helper — angle in degrees, 0° = 3 o'clock, clockwise positive */
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export type GaugeProps = {
  label: string;
  unit: string;
  value?: number;
  min?: number;
  max?: number;
  size?: number;
};

export default function Gauge({
  label,
  unit,
  value = 0,
  min = 0,
  max = 100,
  size = 188,
}: GaugeProps) {
  const uid = useId().replace(/:/g, '');
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 6; // bezel outer
  const faceR = R - 10; // face radius
  const tickR = faceR - 6; // tick ring
  const numR = faceR - 24; // number ring
  const START = 225;
  const SWEEP = 270; // degrees
  const frac = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const needleDeg = START + frac * SWEEP;

  // major ticks
  const majors = 6;
  const ticks: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    nx: number;
    ny: number;
    val: number;
    hot: boolean;
  }[] = [];
  for (let i = 0; i <= majors; i++) {
    const t = i / majors;
    const deg = START + t * SWEEP;
    const [x1, y1] = polar(cx, cy, tickR, deg);
    const [x2, y2] = polar(cx, cy, tickR - 9, deg);
    const [nx, ny] = polar(cx, cy, numR, deg);
    const val = Math.round(min + t * (max - min));
    ticks.push({ x1, y1, x2, y2, nx, ny, val, hot: t > 0.82 });
  }

  // minor ticks
  const minors: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= majors * 4; i++) {
    if (i % 4 === 0) continue;
    const t = i / (majors * 4);
    const deg = START + t * SWEEP;
    const [x1, y1] = polar(cx, cy, tickR, deg);
    const [x2, y2] = polar(cx, cy, tickR - 5, deg);
    minors.push({ x1, y1, x2, y2 });
  }

  const [nx, ny] = polar(cx, cy, faceR - 14, needleDeg);
  const [tailx, taily] = polar(cx, cy, 12, needleDeg + 180);

  // arc path for the lit progress
  const arcStart = polar(cx, cy, tickR + 2, START);
  const arcEnd = polar(cx, cy, tickR + 2, needleDeg);
  const largeArc = frac * SWEEP > 180 ? 1 : 0;

  return (
    <div className="pz-gauge">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ display: 'block' }}>
        <defs>
          <radialGradient id={`face${uid}`} cx="50%" cy="42%" r="62%">
            <stop offset="0%" stopColor="#16181b" />
            <stop offset="62%" stopColor="#0b0c0d" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <linearGradient id={`bezel${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3f45" />
            <stop offset="48%" stopColor="#16181b" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <filter id={`glow${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* bezel + face */}
        <circle cx={cx} cy={cy} r={R} fill={`url(#bezel${uid})`} />
        <circle
          cx={cx}
          cy={cy}
          r={faceR}
          fill={`url(#face${uid})`}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
        />

        {/* progress arc */}
        <path
          d={`M ${arcStart[0]} ${arcStart[1]} A ${tickR + 2} ${tickR + 2} 0 ${largeArc} 1 ${arcEnd[0]} ${arcEnd[1]}`}
          fill="none"
          stroke="#ff070f"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={frac > 0.001 ? 0.9 : 0}
          filter={`url(#glow${uid})`}
        />

        {/* minor ticks */}
        {minors.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
        ))}

        {/* major ticks + numbers */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.hot ? '#ff3b30' : 'rgba(255,255,255,0.5)'}
              strokeWidth="2"
            />
            <text
              x={t.nx}
              y={t.ny}
              fill={t.hot ? '#ff3b30' : '#9aa0a6'}
              fontFamily="var(--pz-font-label)"
              fontSize="11"
              fontWeight="500"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {t.val}
            </text>
          </g>
        ))}

        {/* needle */}
        <g filter={`url(#glow${uid})`}>
          <line
            x1={tailx}
            y1={taily}
            x2={nx}
            y2={ny}
            stroke="#ff070f"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        {/* hub */}
        <circle cx={cx} cy={cy} r="9" fill="#0c0d0e" stroke="#2a2e33" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="3" fill="#ff070f" />

        {/* value + unit */}
        <text
          x={cx}
          y={cy + faceR * 0.42}
          fill="#f4f5f6"
          fontFamily="var(--pz-font-display)"
          fontSize="22"
          fontWeight="700"
          textAnchor="middle"
        >
          {Math.round(value)}
        </text>
        <text
          x={cx}
          y={cy + faceR * 0.62}
          fill="#7d8288"
          fontFamily="var(--pz-font-label)"
          fontSize="11"
          fontWeight="500"
          letterSpacing="0.1em"
          textAnchor="middle"
        >
          {unit}
        </text>
      </svg>
      <div className="pz-gauge__label">{label}</div>
    </div>
  );
}
