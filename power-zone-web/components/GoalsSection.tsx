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
  //   backPoints → array of bullet-point strings (5 each — tightened from the
  //                original 6–7 so the back face fits without scrolling on
  //                any aspect ratio, while preserving every distinct point)
  //   backImage  → image path painted full-bleed behind the back face
  backPoints: string[];
  backImage: string;
};

const GOALS: Goal[] = [
  {
    title: 'Improve Power Quality',
    description:
      'Reliable, uninterrupted power that protects sensitive equipment and prevents downtime. Our generators and battery systems deliver clean, stable output that supports grid stability across every load condition.',
    icon: 'power',
    backPoints: [
      'Corrects voltage, frequency & harmonic imbalances for stable, clean power',
      'Rapid charge/discharge supports the grid — transmission, distribution & behind the meter',
      'Power Factor Correction + voltage regulation cut reactive charges and protect equipment',
      'Integrates seamlessly with solar, wind & chemical storage for higher compatibility',
      'Safeguards critical loads against outages, equipment stress and rising energy costs',
    ],
    backImage: '/images/applications_1.webp',
  },
  {
    title: 'Prevent Downtime',
    description:
      'Generator + battery storage combined for cleaner, faster outage protection. Millisecond switchover keeps servers and critical equipment online while cutting electricity bills by up to 30%.',
    icon: 'time',
    backPoints: [
      'Millisecond response during outages — zero interruptions, shutdowns or costly restarts',
      'Battery + generator combo delivers continuous backup for the full outage duration',
      'Runs intelligently 24/7 — optimizing energy and power quality, not only in emergencies',
      'Reduces emissions by up to 90% vs conventional standby generators',
      'Proven 20+ year lifespan — reliable, scalable and built for long-term value',
    ],
    backImage: '/images/applications_2.webp',
  },
  {
    title: 'Lower Energy Costs',
    description:
      'Hybrid generator + storage that lowers bills today and creates sustained savings over time. Energy arbitrage, peak shaving, and renewable integration combine to offset the initial investment and deliver strong long-term ROI.',
    icon: 'chart',
    backPoints: [
      'Hybrid generator + battery storage cuts electricity bills by up to 30%',
      'Energy Arbitrage — store at low rates, deploy during peak-cost windows',
      'Peak Shaving reduces maximum-demand charges during heavy usage',
      'Renewable integration hedges against future grid price hikes',
      'Real-time monitoring + long-term durability maximize ROI over the system\'s life',
    ],
    backImage: '/images/applications_3.webp',
  },
  {
    title: 'Reduce Emissions',
    description:
      'Solar, inverters, storage and smart energy management combined for cleaner power without compromising reliability. Reduces fossil-fuel reliance and shrinks your carbon footprint while supporting long-term sustainability goals.',
    icon: 'cloud',
    backPoints: [
      'Solar + smart battery storage replaces fossil-fuel generator reliance',
      'Peak load shifting and intelligent energy management cut carbon footprint',
      'CHINT BESS actively reduces diesel and grid dependency during peak demand',
      'Partner FPT Industrial has offset 16,500+ tons of CO₂ via carbon-neutral facilities',
      'Extended product lifespans + reduced energy waste minimize environmental impact',
    ],
    backImage: '/images/applications_4.webp',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SECTION LAYOUT
// ───────────────────────────────────────────────────────────────────────────
// The section is taller than the viewport (SECTION_VH) and its inner content
// is `position: sticky` for the first viewport height — so once the cards
// scroll into view they pin to the top of the screen and stay there while
// the user keeps scrolling, giving a dedicated "dwell" before the page
// continues to ProcessSection. Mirrors the PeekProducts pause but tuned to
// this section's information density.
//
//   0  → 100vh   : section scrolls in, content pins at the top
//   100 → SECTION_VH−100  : DWELL — cards stay in place, nothing else moves
//                            (this is the scroll break the user asked for)
//   SECTION_VH−100 → SECTION_VH : sticky releases, content scrolls up out
//                                  of the way, ProcessSection enters from below
const SECTION_VH = 180; // ⇒ 80vh of dwell after pin engages
export default function GoalsSection() {
  return (
    <section
      className="relative bg-[#F4EFE7]"
      style={{ height: `${SECTION_VH}vh`, scrollSnapAlign: 'start' }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Inner padding container — `justify-center` keeps the header +
            grid block centred vertically within the pinned viewport
            regardless of aspect ratio. */}
        <div className="flex flex-1 flex-col justify-center gap-[clamp(20px,3.5vh,48px)] px-6 py-[clamp(20px,3vh,40px)] md:px-10 lg:px-14">
          {/* Header */}
          <div className="text-center">
            <p className="font-tiny text-[clamp(13px,1.3vw,18px)] font-medium uppercase tracking-[0.32em] text-red-600">
              Operational Goals
            </p>
            <h2 className="font-heading mx-auto mt-3 max-w-[64rem] text-[clamp(28px,3.4vw,50px)] font-semibold leading-[1.08] tracking-tight text-black">
              Meet Key Operational Goals
              <span className="font-heading ml-3 italic font-normal text-black/85">
                with Power Zone
              </span>
            </h2>
          </div>

          {/* Card grid — responsive at narrow widths, fixed 4-up on lg+.
              Each card carries its own height clamp so the absolute-
              positioned faces always have a concrete containing block. */}
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {GOALS.map((goal) => (
              <GoalCard key={goal.title} goal={goal} />
            ))}
          </div>
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
    // Card height adapts: not too tall on short windows, not too short on
    // tall ones, and capped so very tall monitors don't make the cards
    // feel sparse. min ≈ phone-comfortable, max ≈ premium-monitor-friendly.
    <div style={{ height: 'clamp(360px, 48vh, 500px)' }}>
      <div className="h-full" style={{ perspective: '1200px' }}>
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
              absolute inset-0 flex flex-col
              rounded-2xl bg-white p-6 md:p-7
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
            "
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Icon badge — solid rounded-square in brand red so the icon
                always reads at any aspect ratio (the earlier bare-SVG
                rendering disappeared into the white background on some
                screens). */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 md:h-14 md:w-14">
              <GoalIcon type={goal.icon} className="h-6 w-6 text-red-600 md:h-7 md:w-7" />
            </div>

            <div className="mt-5 md:mt-6">
              <h3 className="font-heading text-[clamp(18px,1.5vw,26px)] font-semibold leading-[1.15] tracking-tight text-black">
                {goal.title}
              </h3>
              <p className="font-body mt-2.5 text-[13px] leading-relaxed text-black/65 md:text-[14px] lg:text-[15px]">
                {goal.description}
              </p>
            </div>

            {/* Flex spacer so the flip-button stays anchored to the bottom
                of the card; description sits naturally above it without the
                bullet block in between. */}
            <div className="flex-1" />

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
              className="
                font-tiny mt-5 inline-flex items-center gap-2
                text-[11px] font-semibold uppercase tracking-[0.18em] text-black
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
              Full-bleed background image, dark gradient overlay, all copy
              in white over the photo. Bullet count tightened to 5 in the
              GOALS data so the list fits without `overflow-y` scrolling
              even on shorter aspect ratios. */}
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
            {goal.backImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={goal.backImage}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.62) 55%, rgba(0,0,0,0.78) 100%)',
              }}
            />

            <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
              <p className="font-tiny shrink-0 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-400">
                {goal.title}
              </p>
              <ul className="mt-3 flex-1 space-y-2">
                {goal.backPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-red-500"
                    />
                    <span className="font-body text-[12px] leading-snug text-white/90 md:text-[13px]">
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
                  text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70
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

// ───────────────────────────────────────────────────────────────────────────
// ICONS
// ───────────────────────────────────────────────────────────────────────────
// All four icons render at the same 32×32 grid; line caps + joins rounded,
// stroke width 1.75 so they read clearly when scaled down to the 24–28 px
// final size inside the icon badge.
function GoalIcon({
  type,
  className = 'h-7 w-7 text-red-600',
}: {
  type: IconKey;
  className?: string;
}) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };

  switch (type) {
    // Sine wave above a baseline — the canonical "clean, regulated power"
    // visual. Two full cycles for visual rhythm.
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
    // Dollar sign — direct visual for cost savings.
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
