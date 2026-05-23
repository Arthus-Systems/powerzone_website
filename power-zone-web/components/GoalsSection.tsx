'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';

// ───────────────────────────────────────────────────────────────────────────
// GOALS — EDIT TEXT / ICONS HERE
// ───────────────────────────────────────────────────────────────────────────
type IconKey = 'power' | 'time' | 'chart' | 'cloud';

type Goal = {
  title: string;
  description: string;
  icon: IconKey;
};

const GOALS: Goal[] = [
  {
    title: 'Improve Power Quality',
    description:
      'Get customized plans designed to align with your unique business goals.',
    icon: 'power',
  },
  {
    title: 'Prevent Downtime',
    description:
      'Leverage data-driven insights to make smarter decisions and stay ahead.',
    icon: 'time',
  },
  {
    title: 'Lower Energy Costs',
    description:
      'Work closely with our team for a hands-on, personalized consulting experience.',
    icon: 'chart',
  },
  {
    title: 'Reduce Emissions',
    description:
      'Implement practical strategies that deliver measurable and lasting results.',
    icon: 'cloud',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SCROLL SPEED KNOB
// ───────────────────────────────────────────────────────────────────────────
// How many viewport-heights of scroll the section consumes per card.
//   50  → snappy
//   75  → balanced (current)
//   100 → leisurely
const SECTION_VH_PER_CARD = 75;

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

        {/* Cards row — sweeping clip-path reveal sequence */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12 md:px-12 lg:px-16">
          <div className="grid w-full max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
            {GOALS.map((goal, i) => (
              <GoalCard
                key={goal.title}
                goal={goal}
                index={i}
                total={GOALS.length}
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
  index,
  total,
  scrollYProgress,
}: {
  goal: Goal;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each card's reveal window is 0.4 of progress wide. The starting point
  // shifts by (1 / total) * 0.7 per card so the windows OVERLAP — instead of
  // strict one-then-the-next, you get a continuous wave of reveals sweeping
  // left-to-right across the row.
  //
  //   Card 0:  0.000 → 0.400
  //   Card 1:  0.175 → 0.575
  //   Card 2:  0.350 → 0.750
  //   Card 3:  0.525 → 0.925
  const start = (index / total) * 0.7;
  const end = start + 0.4;

  // 0 = card invisible (clipped + offset + faded)
  // 1 = card fully revealed (clip open, in place, full opacity)
  const reveal = useTransform(scrollYProgress, [start, end], [0, 1]);

  // Clip-path opens from the left edge as the right inset (100% → 0%) shrinks
  const clipPath = useTransform(
    reveal,
    (v) => `inset(0 ${(1 - v) * 100}% 0 0)`,
  );
  // Slight horizontal nudge for a parallax feel
  const x = useTransform(reveal, [0, 1], [36, 0]);
  // Opacity ramp keeps the card from feeling like it pops in suddenly
  const opacity = useTransform(reveal, [0, 1], [0.35, 1]);

  return (
    <motion.article
      style={{ clipPath, x, opacity }}
      className="
        relative flex h-full flex-col gap-5
        rounded-2xl bg-white
        p-7 md:p-8
        shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(0,0,0,0.10)]
      "
    >
      <GoalIcon type={goal.icon} />

      <div>
        <h3 className="text-[20px] md:text-[22px] font-semibold leading-[1.2] tracking-tight text-black">
          {goal.title}
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-black/65">
          {goal.description}
        </p>
      </div>

      <a
        href="#"
        className="
          mt-auto inline-flex items-center gap-2
          text-[12px] font-semibold uppercase tracking-[0.18em] text-black
          transition-colors hover:text-red-600
        "
      >
        Learn More
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M3 8 L13 8" strokeLinecap="round" />
          <path
            d="M9 4 L13 8 L9 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </motion.article>
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
    className: 'h-9 w-9 text-black',
  };

  switch (type) {
    case 'power':
      // Battery + lightning bolt — power quality
      return (
        <svg {...common}>
          <rect x="3" y="10" width="22" height="12" rx="1.5" />
          <path d="M25 14v4" />
          <path d="M28 15v2" />
          <path d="M13 13l-2 3h3l-2 3" />
        </svg>
      );
    case 'time':
      // Circular arrow — uptime / refresh
      return (
        <svg {...common}>
          <path d="M27 16a11 11 0 1 1-3-7.5" />
          <path d="M27 5v6h-6" />
        </svg>
      );
    case 'chart':
      // Trending up — energy cost reduction
      return (
        <svg {...common}>
          <polyline points="4 22 12 14 17 19 28 8" />
          <polyline points="20 8 28 8 28 16" />
        </svg>
      );
    case 'cloud':
      // Cloud with diagonal slash — emissions reduction
      return (
        <svg {...common}>
          <path d="M22 22H8.5A5.5 5.5 0 0 1 8.5 11h.7A6.5 6.5 0 0 1 21 13.5 4.5 4.5 0 0 1 22 22Z" />
          <path d="M5 27 27 5" />
        </svg>
      );
  }
}
