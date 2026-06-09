'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      'Generator + battery storage combined for cleaner, faster outage protection. 250ms switchover keeps servers and critical equipment online while cutting electricity bills by up to 30%.',
    icon: 'time',
    backPoints: [
      '250ms response during outages — zero interruptions, shutdowns or costly restarts',
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

          {/* Card grid — 2-up on phones so the user can see two cards in
              the same viewport, scales to 4-up on lg+. Each card carries
              its own height clamp so the absolute-positioned faces always
              have a concrete containing block. */}
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
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

  // Enlarge-on-flip now runs on EVERY breakpoint — mobile gets a
  // portrait-rectangle enlarged card, desktop gets a landscape one.
  // (Previously this was gated to desktop only; mobile used in-place
  // flip, which was hard to read.)
  const isEnlarged = isFlipped;

  // Body-scroll lock + Escape close while enlarged. Applies on every
  // breakpoint now since the morph runs on mobile too.
  useEffect(() => {
    if (!isEnlarged) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFlipped(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isEnlarged]);

  // SHARED flip inner — the same DOM regardless of whether the card
  // is in its grid slot or morphed to fullscreen. rotateY is driven by
  // isFlipped; the front face hides via backface-visibility when the
  // card is past 90deg, exposing the back face. When enlarged on
  // desktop, the back-face content scales its typography up via
  // .pz-goal-enlarged scoped classes so the bullets read at full size.
  const flipInner = (
    <div
      className={`pz-goal-flip-stage h-full w-full ${isEnlarged ? 'pz-goal-enlarged' : ''}`}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {/* FRONT FACE — same as before. Hidden by backface-visibility
            when the card has flipped past 90deg. */}
        <div
          className="
            absolute inset-0 flex flex-col
            rounded-2xl bg-white p-4 sm:p-6 md:p-7
            shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
          "
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 sm:h-12 sm:w-12 sm:rounded-xl md:h-14 md:w-14">
            <GoalIcon type={goal.icon} className="h-5 w-5 text-red-600 sm:h-6 sm:w-6 md:h-7 md:w-7" />
          </div>

          <div className="mt-3 sm:mt-5 md:mt-6">
            <h3 className="font-heading text-[14px] font-semibold leading-[1.18] tracking-tight text-black sm:text-[clamp(18px,1.5vw,26px)] sm:leading-[1.15]">
              {goal.title}
            </h3>
            <p className="font-body mt-1.5 text-[11px] leading-snug text-black/65 sm:mt-2.5 sm:text-[13px] sm:leading-relaxed md:text-[14px] lg:text-[15px]">
              {goal.description}
            </p>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
            className="
              font-tiny mt-3 inline-flex items-center gap-1.5
              text-[9px] font-semibold uppercase tracking-[0.14em] text-black
              transition-colors hover:text-red-600
              sm:mt-5 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]
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

        {/* BACK FACE — content + sizing scale up automatically when the
            parent has the .pz-goal-enlarged class. */}
        <div
          className="
            pz-goal-back
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

          <div className="pz-goal-back-content relative z-10 flex h-full flex-col p-3 sm:p-5 md:p-6">
            <p className="pz-goal-back-title font-tiny shrink-0 text-[8px] font-semibold uppercase tracking-[0.2em] text-red-400 sm:text-[11px] sm:tracking-[0.22em]">
              {goal.title}
            </p>
            <ul className="pz-goal-back-list mt-2 flex-1 space-y-1 sm:mt-3 sm:space-y-2">
              {goal.backPoints.map((point) => (
                <li key={point} className="flex items-start gap-1.5 sm:gap-2">
                  <span
                    aria-hidden
                    className="pz-goal-back-dot mt-[5px] h-[3px] w-[3px] shrink-0 rounded-full bg-red-500 sm:mt-[7px] sm:h-1 sm:w-1"
                  />
                  <span className="pz-goal-back-text font-body text-[9px] leading-[1.25] text-white/90 sm:text-[12px] sm:leading-snug md:text-[13px]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="
                pz-goal-back-flipbtn
                font-tiny mt-2 inline-flex shrink-0 items-center gap-1
                text-[8px] font-semibold uppercase tracking-[0.14em] text-white/70
                transition-colors hover:text-red-400
                sm:mt-3 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]
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
      </motion.div>
    </div>
  );

  return (
    // Outer grid item — fixed clamp height so the grid slot never collapses
    // when the card is "lifted" to position:fixed on desktop. Position
    // relative gives `absolute inset-0` a containing block.
    <div className="relative h-[clamp(260px,40vh,340px)] sm:h-[clamp(360px,48vh,500px)]">
      {/* Desktop-only backdrop. Appears below the enlarged card to dim
          the rest of the page and provide a click-to-close target. */}
      <AnimatePresence>
        {isEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFlipped(false)}
            className="fixed inset-0 z-[140] bg-black/65 backdrop-blur-sm cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* THE ONE CARD. Stays mounted across the morph — `layout` makes
          framer-motion FLIP-animate the bbox change from "absolute
          inset-0 inside the grid slot" to "fixed inset-0 m-auto
          centered + viewport-sized" (and back on close). The rotateY
          flip happens simultaneously via the inner motion.div, so
          enlarge + flip read as a single coordinated gesture.

          inset-0 + m-auto + explicit w/h centers a fixed element via
          margin auto — no translate transform needed (translate would
          fight with the layout-driven transform that drives the FLIP). */}
      <motion.div
        layout
        initial={false}
        transition={{ layout: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
        onClick={() => setIsFlipped((f) => !f)}
        /* Enlarged dimensions are responsive:
             mobile (<md): portrait rectangle — w-min(340px,90vw) ×
                            h-min(560px,82vh). Matches the in-grid
                            card's portrait aspect, just larger.
             desktop (md+): landscape rectangle — w-min(880px,88vw) ×
                            h-min(640px,85vh). Larger horizontal
                            surface where the back-face content reads
                            well at the bumped typography. */
        className={`cursor-pointer ${
          isEnlarged
            ? 'fixed inset-0 m-auto w-[min(340px,90vw)] h-[min(560px,82vh)] z-[150] md:w-[min(880px,88vw)] md:h-[min(640px,85vh)]'
            : 'absolute inset-0'
        }`}
      >
        {flipInner}
      </motion.div>
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
