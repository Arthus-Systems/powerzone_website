'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';

type SolutionCardData = {
  title: string;
  description: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
};

/* Cards land in a clean vertical stack — all straight (no rotation) for max
 * title legibility. Each card sits 80 px below the previous one so the top
 * 80 px of every back card peeks above the next, exposing its title. The
 * last card (z = 13) sits lowest and is the most prominent. Cards are
 * horizontally centered.
 */
const SOLUTION_CARDS: SolutionCardData[] = [
  {
    title: 'Engineered for Reliability',
    description:
      "Whether it's our rugged diesel generators or our industrial-grade battery systems, every Power Zone solution is built for long-term durability and high uptime — even in extreme conditions.",
    rotation: 0,
    offsetX: 0,
    offsetY: -120,
  },
  {
    title: 'Stable, High Quality Power',
    description:
      'Power Zone delivers consistent power output — with stable frequency and voltage — through both gensets and advanced BESS solutions, ideal for mission-critical applications like hospitals, telecom, and data centers.',
    rotation: 0,
    offsetX: 0,
    offsetY: -40,
  },
  {
    title: 'Rapid Response Startup',
    description:
      'Our diesel gensets and BESS systems are equipped with smart auto-start and synchronization capabilities, ensuring fast backup power during outages or grid instability — minimizing operational disruption.',
    rotation: 0,
    offsetX: 0,
    offsetY: 40,
  },
  {
    title: 'Real Bill Savings',
    description:
      'Fuel-efficient engines, smart battery dispatch, and optimized maintenance cycles make Power Zone systems cost-effective. Our hybrid setups help reduce fuel consumption and extend generator life, cutting your energy expenses over time.',
    rotation: 0,
    offsetX: 0,
    offsetY: 120,
  },
];

// "Off-screen below" — 1500 px is far enough that the card is below the
// viewport on any normal screen. Using a plain number (px) avoids the
// mixed-unit interpolation quirks of strings like '100vh' → '-90px' which
// were causing cards to skip the slide-in animation.
const OFF_SCREEN_Y = 500;

// ───────────────────────────────────────────────────────────────────────────
// SCROLL SPEED KNOB
// ───────────────────────────────────────────────────────────────────────────
// How many viewport heights of scroll each card consumes.
//
//   Higher = SLOWER (more scrolling per card transition)
//   Lower  = FASTER (less scrolling per card transition)
//
// Examples:
//   50  → very snappy   (~2 wheel clicks per card on a 800 px viewport)
//   75  → balanced
//   100 → leisurely     (the original, "scroll a lot" pacing)
//   120 → very slow
//
// This is the ONE value to tweak when iterating on transition pacing.
const SECTION_VH_PER_CARD = 100;

export default function SolutionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#181818]"
      style={{ height: `${SOLUTION_CARDS.length * SECTION_VH_PER_CARD}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Background image — sits inside the sticky container so it's pinned
         * to the viewport for the entire scroll, never moves with the cards.
         * The dark fallback bg on the <section> shows underneath so the page
         * never flashes white if the image is still loading. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
        {/* Subtle dark overlay so the white cards + headline stay readable
         * regardless of what the image looks like. Bump the alpha (e.g. 0.65)
         * if the photo is bright; drop to 0.25 if you want it more vivid. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-black/45"
        />

        {/* Section header */}
        <div className="relative z-10 px-8 pt-24 text-center">
          <p className="text-[17px] font-medium uppercase tracking-[0.32em] text-white-500">
            Why Power Zone
          </p>
          <h2 className="mt-4 text-[clamp(28px,3.8vw,52px)] font-semibold leading-[1.05] tracking-tight text-white">
            What sets Power Zone&apos;s
            <br />
            Solutions Apart?
          </h2>
        </div>

        {/* Cards stack — each card layer absolute-fills this container */}
        <div className="relative z-10 flex-1">
          {SOLUTION_CARDS.map((card, i) => (
            <SolutionCard
              key={card.title}
              card={card}
              index={i}
              total={SOLUTION_CARDS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: SolutionCardData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each card animates over 85% of its segment, with a brief 15% rest before
  // the next card starts — keeps the chain feeling continuous.
  const start = index / total;
  const end = (index + 0.85) / total;

  // Tiny epsilon prevents duplicate input keys when start === 0 (card 0).
  const safeStart = start > 0 ? start : 0.0001;

  // Four-keyframe input range pins the card explicitly:
  //   [0      → safeStart]: stays off-screen
  //   [safeStart → end]:    animates from off-screen to landing
  //   [end    → 1]:         stays landed
  // This is bulletproof regardless of useTransform clamp default.
  const y = useTransform(
    scrollYProgress,
    [0, safeStart, end, 1],
    [OFF_SCREEN_Y, OFF_SCREEN_Y, card.offsetY, card.offsetY],
  );
  const x = useTransform(
    scrollYProgress,
    [0, safeStart, end, 1],
    [0, 0, card.offsetX, card.offsetX],
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, safeStart, end, 1],
    [0, 0, card.rotation, card.rotation],
  );

  return (
    <motion.div
      initial={{ y: OFF_SCREEN_Y, x: 0, rotate: 0 }}
      style={{ y, x, rotate, zIndex: 10 + index }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        className="
          pointer-events-auto
          w-[90vw] max-w-[40rem]
          rounded-3xl
          bg-white
          shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_10px_30px_-10px_rgba(0,0,0,0.4),0_0_60px_-15px_rgba(220,38,38,0.18)]
          p-10 md:p-14 pt-6 md:pt-8
          flex flex-col gap-6
        "
      >
        <h3 className="text-2xl md:text-[32px] font-bold uppercase leading-tight tracking-tight text-black">
          {card.title}
        </h3>
        <p className="text-sm md:text-base leading-relaxed text-black/70">
          {card.description}
        </p>
        <div className="mt-auto flex items-center gap-3">
          <span aria-hidden className="h-px w-10 bg-red-600" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-600">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
