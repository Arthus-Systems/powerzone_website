'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';

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
  //   backText  → the paragraph shown on the LEFT side of the back face
  //   backImage → the image shown on the RIGHT side, e.g. '/images/power-quality.png'
  backText: string;
  backImage: string;
};

const GOALS: Goal[] = [
  {
    title: 'Improve Power Quality',
    description:
      'Our generator sets and battery energy storage systems deliver reliable, uninterrupted power—supporting grid stability, preventing downtime, and safeguarding vital operations.',
    icon: 'power',
    backText: '',      // ← INSERT BACK TEXT HERE for "Improve Power Quality"
    backImage: '',     // ← INSERT IMAGE PATH HERE, e.g. '/images/power-quality.png'
  },
  {
    title: 'Prevent Downtime',
    description:
      'Our systems combine generator sets and battery energy storage to offer a cleaner, more reliable source of outage protection—while reducing electricity bills by up to 30%.',
    icon: 'time',
    backText: '',      // ← INSERT BACK TEXT HERE for "Prevent Downtime"
    backImage: '',     // ← INSERT IMAGE PATH HERE, e.g. '/images/prevent-downtime.png'
  },
  {
    title: 'Lower Energy Costs',
    description:
      'Our systems integrate advanced generator sets and battery storage to help lower electricity bills in the short term and create sustained savings over time. These savings can fully offset the system’s initial investment, delivering strong long-term return on investment for your operation.',
    icon: 'chart',
    backText: '',      // ← INSERT BACK TEXT HERE for "Lower Energy Costs"
    backImage: '',     // ← INSERT IMAGE PATH HERE, e.g. '/images/lower-costs.png'
  },
  {
    title: 'Reduce Emissions',
    description:
      'We integrate solar energy with advanced inverters, storage, and smart management to power buildings efficiently, lowering energy costs and reducing carbon footprint through clean, sustainable power.',
    icon: 'cloud',
    backText: '',      // ← INSERT BACK TEXT HERE for "Reduce Emissions"
    backImage: '',     // ← INSERT IMAGE PATH HERE, e.g. '/images/reduce-emissions.png'
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SCROLL SPEED
// ───────────────────────────────────────────────────────────────────────────
const SECTION_VH_PER_CARD = 75; // total = 4 × 75 = 300vh

// All four cards reveal simultaneously over this scroll-progress window.
// Adjust REVEAL_END to control how quickly they all appear.
const REVEAL_START = 0.05;
const REVEAL_END = 1.00;

export default function GoalsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F4EFE7]"
      style={{ height: `${GOALS.length * SECTION_VH_PER_CARD}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-20 text-center md:pt-24">
          <p className="text-[20px] font-medium uppercase tracking-[0.32em] text-red-600">
            Operational Goals
          </p>
          <h2 className="mx-auto mt-4 max-w-[64rem] text-[clamp(28px,3.6vw,52px)] font-semibold leading-[1.08] tracking-tight text-black">
            Meet Key Operational Goals
            <span className="ml-3 font-serif italic font-normal text-black/85">
              with Power Zone
            </span>
          </h2>
        </div>

        {/* 2 × 2 card grid */}
        <div className="flex flex-1 items-stretch px-6 pb-10 pt-6 md:px-10 lg:px-14">
          <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-2 grid-rows-2 gap-5 lg:gap-6">
            {GOALS.map((goal) => (
              <GoalCard
                key={goal.title}
                goal={goal}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GoalCard({
  goal,
  scrollYProgress,
}: {
  goal: Goal;
  scrollYProgress: MotionValue<number>;
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  // All cards share the same reveal window — no per-card stagger
  const reveal = useTransform(scrollYProgress, [REVEAL_START, REVEAL_END], [0, 1]);

  const clipPath = useTransform(
    reveal,
    (v) => `inset(0 ${(1 - v) * 100}% 0 0)`,
  );
  const x = useTransform(reveal, [0, 1], [36, 0]);
  const opacity = useTransform(reveal, [0, 1], [0.35, 1]);

  return (
    <motion.div style={{ clipPath, x, opacity }} className="h-full min-h-0">
      {/* Perspective wrapper enables the 3-D flip */}
      <div className="h-full" style={{ perspective: '1200px' }}>
        {/* Flip container — rotates the whole card on button press */}
        <div
          className="relative h-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
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
              <h3 className="text-[clamp(18px,1.8vw,28px)] font-semibold leading-[1.15] tracking-tight text-black">
                {goal.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-black/65 md:text-[16px]">
                {goal.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="
                mt-auto inline-flex items-center gap-2
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

          {/* ── BACK FACE ──────────────────────────────────────────────── */}
          {/*
            CONTENT GUIDE — fill in the GOALS array at the top of this file:
              • backText  → shown in the LEFT section below
              • backImage → shown in the RIGHT section below (image path)
          */}
          <div
            className="
              absolute inset-0 flex gap-5
              rounded-2xl bg-white p-7 md:p-8
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
            "
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* LEFT — text content
                ↳ Edit `backText` in the GOALS array for this card's paragraph */}
            <div className="flex flex-1 flex-col justify-between overflow-hidden">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-500">
                  {goal.title}
                </p>
                {/* ↓ backText value comes from GOALS[n].backText above */}
                <p className="mt-3 text-[13px] leading-relaxed text-black/70 md:text-[14px]">
                  {goal.backText}
                </p>
              </div>

              {/* Flip-back button */}
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="
                  inline-flex items-center gap-2
                  text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45
                  transition-colors hover:text-red-600
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

            {/* RIGHT — image content
                ↳ Edit `backImage` in the GOALS array for this card's image path
                   e.g. backImage: '/images/power-quality.png' */}
            <div className="w-[38%] shrink-0 overflow-hidden rounded-xl bg-black/5">
              {goal.backImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={goal.backImage}
                  alt={goal.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                /* Placeholder — disappears once backImage is set */
                <div className="flex h-full items-center justify-center">
                  <span className="text-[9px] uppercase tracking-widest text-black/20">
                    Image
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
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
    case 'power':
      return (
        <svg {...common}>
          <rect x="3" y="10" width="22" height="12" rx="1.5" />
          <path d="M25 14v4" />
          <path d="M28 15v2" />
          <path d="M13 13l-2 3h3l-2 3" />
        </svg>
      );
    case 'time':
      return (
        <svg {...common}>
          <path d="M27 16a11 11 0 1 1-3-7.5" />
          <path d="M27 5v6h-6" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <polyline points="4 22 12 14 17 19 28 8" />
          <polyline points="20 8 28 8 28 16" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...common}>
          <path d="M22 22H8.5A5.5 5.5 0 0 1 8.5 11h.7A6.5 6.5 0 0 1 21 13.5 4.5 4.5 0 0 1 22 22Z" />
          <path d="M5 27 27 5" />
        </svg>
      );
  }
}
