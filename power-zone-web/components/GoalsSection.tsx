'use client';

import { useState } from 'react';

// ───────────────────────────────────────────────────────────────────────────
// GOALS — edit text, icons, and back-card content here
// ───────────────────────────────────────────────────────────────────────────
type IconKey = 'power' | 'time' | 'chart' | 'cloud';

type Goal = {
  title: string;
  description: string;
  icon: IconKey;
  // ── BACK CARD CONTENT ─────────────────────────────────────────────────────
  // Set these two fields for each goal to fill in the card's back face.
  //   backPoints → array of bullet-point strings shown on the LEFT side
  //   backImage  → image path shown on the RIGHT side, e.g. '/images/power-quality.webp'
  backPoints: string[];
  backImage: string;
};

const GOALS: Goal[] = [
  {
    title: 'Improve Power Quality',
    description:
      'Our generator sets and battery energy storage systems deliver reliable, uninterrupted power—supporting grid stability, preventing downtime, and safeguarding vital operations.',
    icon: 'power',
    backPoints: [
      'Corrects voltage, frequency & harmonic imbalances for stable, clean power',
      'Rapid charge/discharge response supports grid infrastructure at every level — transmission, distribution & behind the meter',
      'Seamlessly integrates with solar, wind & chemical storage to improve compatibility',
      'Power Factor Correction reduces reactive power charges & increases system efficiency',
      'Voltage Regulation protects critical equipment, minimizing failure risk & extending lifespan',
      'Harmonic distortion mitigation reduces overheating & improves overall efficiency',
      'Safeguards critical loads against outages, equipment stress & rising energy costs',
    ],
    backImage: '/images/applications_1.webp',
  },
  {
    title: 'Prevent Downtime',
    description:
      'Our systems combine generator sets and battery energy storage to offer a cleaner, more reliable source of outage protection—while reducing electricity bills by up to 30%.',
    icon: 'time',
    backPoints: [
      'Responds within milliseconds during outages — zero interruptions, shutdowns, or costly restarts',
      'Operates intelligently 24/7, not just during emergencies — optimizing energy & correcting power quality continuously',
      'Seamlessly switches to backup mode, keeping servers & critical equipment running without delays',
      'Battery + generator combination delivers continuous backup for the full duration of any outage',
      'Reduces emissions by up to 90% compared to conventional standby generators',
      'Proven 20+ year lifespan — reliable, scalable, and built for long-term value',
    ],
    backImage: '/images/applications_2.webp',
  },
  {
    title: 'Lower Energy Costs',
    description:
      'Our systems integrate advanced generator sets and battery storage to help lower electricity bills in the short term and create sustained savings over time. These savings can fully offset the system\'s initial investment, delivering strong long-term return on investment for your operation.',
    icon: 'chart',
    backPoints: [
      'Hybrid generator + battery storage systems cut electricity bills by up to 30%',
      'Energy Arbitrage — stores energy or runs generators during low-rate periods, deploys during peak-cost windows',
      'Peak Shaving — reduces maximum demand charges by supplying stored energy during heavy usage',
      'Offsets grid reliance by integrating renewables, protecting against future price hikes',
      'Real-time monitoring provides clear visibility into system efficiency and savings',
      'Engineered for long-term durability, maximizing ROI while minimizing operational costs',
    ],
    backImage: '/images/applications_3.webp',
  },
  {
    title: 'Reduce Emissions',
    description:
      'We integrate solar energy with advanced inverters, storage, and smart management to power buildings efficiently, lowering energy costs and reducing carbon footprint through clean, sustainable power.',
    icon: 'cloud',
    backPoints: [
      'Reduces reliance on fossil-fuel generators by integrating solar energy and smart battery storage',
      'Peak load shifting and intelligent energy management lower overall carbon footprint',
      'Extended product lifespans and reduced energy waste minimize environmental impact',
      'CHINT BESS systems actively reduce diesel and grid dependency during peak demand',
      'Partner FPT Industrial has offset 16,500+ tons of CO2, with a fully carbon-neutral ePowertrain facility powered by solar and wind',
      'Supports your sustainability goals without compromising performance or reliability',
    ],
    backImage: '/images/applications_4.webp',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SCROLL SPEED
// ───────────────────────────────────────────────────────────────────────────
export default function GoalsSection() {
  return (
    <section
      className="relative flex h-screen flex-col overflow-hidden bg-[#F4EFE7]"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* flex-col + justify-center keeps the block centred in the viewport
          regardless of screen height — no content from adjacent sections
          is ever visible. */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 md:px-10 lg:px-14">
        {/* Header */}
        <div className="text-center">
          <p className="font-tiny text-[20px] font-medium uppercase tracking-[0.32em] text-red-600">
            Operational Goals
          </p>
          <h2 className="font-heading mx-auto mt-4 max-w-[64rem] text-[clamp(28px,3.6vw,52px)] font-semibold leading-[1.08] tracking-tight text-black">
            Meet Key Operational Goals
            <span className="font-heading ml-3 italic font-normal text-black/85">
              with Power Zone
            </span>
          </h2>
        </div>

        {/* 4-column card grid. Each card has an explicit clamp() height so
            the absolute-positioned faces always have a reliable containing
            block, independent of any ancestor min-height. */}
        <div className="mx-auto mt-8 grid w-full max-w-[1400px] grid-cols-4 gap-5 lg:gap-6">
          {GOALS.map((goal) => (
            <GoalCard key={goal.title} goal={goal} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GoalCard({
  goal,
}: {
  goal: Goal;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    // clamp() gives every card an explicit height the absolute-positioned
    // faces can resolve against — not taller than needed on small screens,
    // not too short on large ones.
    <div style={{ height: 'clamp(340px, 46vh, 500px)' }}>
      {/* Perspective wrapper enables the 3-D flip */}
      <div className="h-full" style={{ perspective: '1200px' }}>
        {/* Flip container — click anywhere on the card to flip */}
        <div
          className="relative h-full cursor-pointer transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
          onClick={() => setIsFlipped((f) => !f)}
        >

          {/* ── FRONT FACE ─────────────────────────────────────────────── */}
          <div
            className="
              absolute inset-0 flex flex-col gap-4
              rounded-2xl bg-white p-7 md:p-8
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
            "
            style={{ backfaceVisibility: 'hidden' }}
          >
            <GoalIcon type={goal.icon} />

            <div className="flex-1">
              <h3 className="font-heading text-[clamp(18px,1.8vw,28px)] font-semibold leading-[1.15] tracking-tight text-black">
                {goal.title}
              </h3>
              <p className="font-body mt-3 text-[13px] leading-relaxed text-black/65 md:text-[16px]">
                {goal.description}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="
                font-tiny mt-auto inline-flex items-center gap-2
                text-[12px] font-semibold uppercase tracking-[0.18em] text-black
                transition-colors hover:text-red-600
              "
            >
              Flip to see more
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
                aria-hidden
              >
                <path d="M13 8H3" />
                <path d="M9 4L13 8 9 12" />
              </svg>
            </button>
          </div>

          {/* ── BACK FACE ──────────────────────────────────────────────────
              Full-bleed background image with a dark overlay for readability;
              all copy (eyebrow, bullets, flip-back) sits in white over the
              image. Bullets are intentionally short (4 max) so the back fits
              the card without scrolling. */}
          <div
            className="
              absolute inset-0 overflow-hidden rounded-2xl
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
            "
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Background image */}
            {goal.backImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={goal.backImage}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* Dark gradient overlay — heavier at the top where most of the
                text lives, fades toward a still-readable bottom. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.72) 100%)',
              }}
            />

            {/* Content — full original text restored. The bullet list gets
                `overflow-y-auto` so verbose entries scroll within the card
                instead of being clipped; tight font size + leading keeps
                most goals fitting without any scroll on standard viewports. */}
            <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
              <p className="font-tiny shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-400">
                {goal.title}
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1">
                {goal.backPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-red-500"
                    />
                    <span className="font-body text-[11px] leading-snug text-white/90 md:text-[12px]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                className="
                  font-tiny mt-3 inline-flex shrink-0 items-center gap-2
                  text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70
                  transition-colors hover:text-red-400
                "
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden
                >
                  <path d="M3 8H13" />
                  <path d="M7 4L3 8 7 12" />
                </svg>
                Flip back
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function GoalIcon({ type }: { type: IconKey }) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: 'h-8 w-8 text-black',
  };

  switch (type) {
    // Clean sine waveform — the visual shorthand for clean, regulated power.
    case 'power':
      return (
        <svg {...common}>
          <path d="M3 16 q3 -7 6 0 t6 0 t6 0 t6 0" />
          <path d="M3 24 H29" />
        </svg>
      );
    // Shield + checkmark — protection / uptime guarantee.
    case 'time':
      return (
        <svg {...common}>
          <path d="M16 3 L27 7 V16 c0 7 -5 12 -11 13 c-6 -1 -11 -6 -11 -13 V7 Z" />
          <polyline points="11 16 14.5 19.5 21 12.5" />
        </svg>
      );
    // Dollar sign — direct shorthand for cost savings.
    case 'chart':
      return (
        <svg {...common}>
          <line x1="16" y1="3" x2="16" y2="29" />
          <path d="M22 9 c-1.5 -1.5 -3.5 -2 -6 -2 c-3.5 0 -5 2 -5 4 c0 5 11 3 11 8 c0 2 -1.5 4 -5 4 c-2.5 0 -4.5 -0.5 -6 -2" />
        </svg>
      );
    // Leaf — emissions reduction / sustainability.
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M5 27 c0 -13 9 -22 22 -22 c0 13 -9 22 -22 22 z" />
          <line x1="5" y1="27" x2="22" y2="10" />
        </svg>
      );
  }
}
