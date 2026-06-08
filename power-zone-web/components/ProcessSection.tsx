'use client';

/* -----------------------------------------------------------------------------
 * ProcessSection ("Our Solutions")
 *
 * Sticky-pinned card stack. The mechanic:
 *   - section is tall (N * SECTION_VH_PER_STEP)
 *   - inside, a `sticky top-0 h-screen` child is glued to the viewport
 *     for the entire section's scroll range (so the user sees the
 *     header + cards area STATIC while they scroll through this
 *     section — page does NOT scroll relative to the section)
 *   - inside the sticky child, cards are absolute-positioned with
 *     framer-motion translating each card's Y based on scroll
 *     progress: card 0 sits visible at rest; card 1 starts off-screen
 *     below and slides up to cover card 0 at its entry checkpoint;
 *     card 2 slides up to cover card 1; etc.
 *   - z-index ordering (10 + index) ensures the newest card always
 *     paints ON TOP of the older ones it covers
 *
 * This is intentionally NOT ScrollStack — ScrollStack moves the page
 * naturally while translating cards to LOOK pinned, which read as
 * "page and cards both scrolling at different speeds" on the user's
 * setup. Sticky-pin gives the actual "section is static, cards
 * come in" behavior.
 *
 * Card content (ProcessCardContent) keeps the responsive shape split:
 *   - mobile (<md): image-top / text-bottom (portrait)
 *   - desktop (md+): image-left / text-right (landscape)
 * -------------------------------------------------------------------------- */

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

type ProcessStep = {
  titlePrimary: string;
  titleAccent: string;
  description: string;
  imageSrc: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    titlePrimary: 'Utility',
    titleAccent: 'Companies',
    description:
      'Power Zone modernizes utility energy networks with hybrid diesel, battery storage, and intelligent dispatch solutions. Built for sub-transmission and distribution systems, they stabilize frequency, ease grid stress, manage peaks, integrate renewables, ramp quickly, and provide localized backup without overloading central infrastructure.',
    imageSrc: '/images/utility.webp',
  },
  {
    titlePrimary: 'Data',
    titleAccent: 'Centers',
    description:
      "Power Zone provides integrated diesel, lithium battery, smart control, and service solutions for mission-critical data centers. Deployable on-site or via utility agreements, its platforms unify grid, solar, and generator power while cybersecurity, 24/7 monitoring, and predictive maintenance maximize uptime, scalability, reliability, and compliance.",
    imageSrc: '/images/datacenter.webp',
  },
  {
    titlePrimary: 'Commercial',
    titleAccent: 'Buildings',
    description:
      'Power Zone delivers tailored commercial building power systems combining energy storage, intelligent management, diesel generation, and backup automation. Solutions reduce energy costs up to 30%, lower carbon footprint, ensure outage resilience, and include full design, permitting, installation, monitoring, and maintenance support for long-term returns.',
    imageSrc: '/images/commercial.webp',
  },
  {
    titlePrimary: 'Government',
    titleAccent: 'Solutions',
    description:
      'Power Zone provides scalable energy storage and backup systems for public institutions and essential services. Its solutions integrate with existing infrastructure to ensure uninterrupted, clean power during outages and peak demand, helping operators improve resilience, reduce risk, and maintain critical service continuity.',
    imageSrc: '/images/government.webp',
  },
  {
    titlePrimary: 'Residential',
    titleAccent: 'Developers',
    description:
      'Power Zone’s residential platform combines storage, hybrid inverters, C&I BESS, and FPT generators to deliver clean, resilient power for community housing. It lowers costs and emissions, supports grid stability, offsets energy needs, and includes monitoring plus long-term technical support.',
    imageSrc: '/images/residential.webp',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// SCROLL BUDGET
// ───────────────────────────────────────────────────────────────────────────
// Total section height = N * SECTION_VH_PER_STEP. Sticky range = section
// height − sticky child height = (N * STEP − 100)vh. Inside that range,
// each card entry is uniformly distributed.
//
// 170vh per step → 850vh total section, 750vh sticky range. Each card
// transition spans ~170vh of scroll (~17 wheel ticks on a typical
// mouse) — deliberate and slow.
const SECTION_VH_PER_STEP = 170;

// Fraction of total scroll progress reserved for "dwell" at the end —
// after the last card has slid in, the section keeps it pinned for
// this fraction of scroll before unpinning. 0.13 × 850vh ≈ 110vh of
// dwell, which is just over one viewport of scroll where the last
// card sits static at the front of the stack — a deliberate "tiny
// pause" before the section releases and the footer arrives.
const END_DWELL_FRACTION = 0.13;

// Per-card entry animation span (in scroll-progress units). Each card
// slides from off-screen-below to in-place over this fraction of total
// section scroll. 0.14 × 850vh = 119vh per slide-in — wide enough that
// a single wheel tick only advances the animation a small amount
// (smooth, not snap), AND wide enough that a fast wheel still leaves
// the spring's smoothed value INSIDE the entry range so the card lands
// at its final 0% position cleanly. Widened from 0.10 to 0.14 to add
// extra buffer against fast-scroll skips on the first/last cards.
const ENTRY_SPAN = 0.14;

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Clamp to [0, 1] — useScroll can briefly emit out-of-range values as
  // the section unpins.
  const clampedProgress = useTransform(scrollYProgress, (v) =>
    Math.max(0, Math.min(1, v)),
  );

  // SMOOTHING — feed the clamped progress through a spring so cards
  // don't snap-track raw wheel input. Without this, a single wheel
  // tick could yank a card from 110% to 0% in one frame (no animation
  // visible at all). With the spring, the card's Y interpolates over
  // multiple frames, producing a visible glide.
  //
  // Tuning:
  //   stiffness 170 → catches up to a hard wheel input within ~150ms.
  //                    Combined with the widened ENTRY_SPAN=0.14
  //                    above, the spring's smoothed value passes
  //                    through every card's entry range even on a
  //                    fast scroll-out, so the first/last card
  //                    doesn't get skipped.
  //   damping   30  → no bounce at the higher stiffness
  //   restDelta 0.0003 → tight settle so cards land exactly at 0%
  //
  // This is the SINGLE smoothing layer on the scroll position. The
  // previous jitter was caused by Lenis adding ANOTHER smoothing
  // layer on top of this on the homepage — that's been removed (see
  // app/page.tsx), so this spring runs cleanly off the raw native
  // scroll feed and behaves correctly.
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 170,
    damping: 30,
    restDelta: 0.0003,
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F4EFE7]"
      style={{
        height: `${PROCESS_STEPS.length * SECTION_VH_PER_STEP}vh`,
        scrollSnapAlign: 'start',
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section header — stays visible inside the sticky child while
            cards stack below. */}
        <div className="shrink-0 px-6 pt-[clamp(40px,5vh,80px)] pb-[clamp(6px,1vh,16px)] text-center">
          <p className="font-tiny text-[clamp(13px,1.8vh,20px)] font-medium uppercase tracking-[0.32em] text-red-500">
            Our Solutions
          </p>
          <h2 className="font-heading mx-auto mt-[clamp(8px,1.5vh,16px)] max-w-[60rem] text-[clamp(26px,4.3vh,56px)] font-semibold leading-[1.1] tracking-tight text-black">
            Power &amp; Backup Solutions for Industry-Specific Demands
          </h2>
          <p className="font-tiny mx-auto mt-[clamp(8px,1.5vh,20px)] max-w-[44rem] text-[clamp(12px,1.6vh,15px)] leading-relaxed text-black/60">
            Engineered to perform, trusted by industries across Pakistan and
            beyond. Discover resilient power systems tailored to your
            operational needs — with support you can count on.
          </p>
          <div className="mt-[clamp(12px,4vh,35px)] flex justify-center text-black">
            <InteractiveHoverButton href="/applications">
              See more Applications
            </InteractiveHoverButton>
          </div>
        </div>

        {/* Card stage — `flex-1 min-h-0` so the cards' absolute inset-0
            resolves to the remaining viewport (under the header), not
            the full sticky height. */}
        <div className="relative flex-1 min-h-0">
          {PROCESS_STEPS.map((step, i) => (
            <ProcessCard
              key={`${step.titlePrimary}-${i}`}
              step={step}
              index={i}
              total={PROCESS_STEPS.length}
              scrollYProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── ProcessCard ────────────────────────────────────────────────────────
 * One card in the stack. Translates its Y position from "off-screen
 * below" (110% so card is fully past viewport bottom) to "in place" (0%)
 * over a small scroll span around its entry checkpoint. Card 0 sits at
 * rest visible from the start. Later cards stack on top via z-index. */
function ProcessCard({
  step,
  index,
  total,
  scrollYProgress,
}: {
  step: ProcessStep;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Entry checkpoint for this card. Distributed uniformly across the
  // section's transition range (everything before END_DWELL_FRACTION).
  // Card 0: 0, Card 1: 1/(N-1) * transitionEnd, etc.
  const entryPoint = useMemo(() => {
    if (index === 0) return 0;
    const transitionEnd = 1 - END_DWELL_FRACTION;
    return (index / (total - 1)) * transitionEnd;
  }, [index, total]);

  // Y position: starts at 110% (fully below viewport), animates to 0%
  // when scroll passes entryPoint. Card 0 is always at 0%.
  const y = useTransform(
    scrollYProgress,
    index === 0
      ? [0, 1]
      : [Math.max(0, entryPoint - ENTRY_SPAN), entryPoint],
    index === 0 ? ['0%', '0%'] : ['110%', '0%'],
  );

  return (
    <motion.div
      style={{ y, zIndex: 10 + index }}
      initial={false}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-[clamp(6px,1vh,16px)] md:px-8"
    >
      <ProcessCardContent step={step} index={index} />
    </motion.div>
  );
}

/* ── ProcessCardContent ────────────────────────────────────────────────
 * Visual contents of one card. Responsive shape:
 *   - mobile (<md): grid-rows-[40%_60%] image-top / text-bottom (portrait)
 *   - desktop (md+): grid-cols-2 image-left / text-right (landscape) */
function ProcessCardContent({
  step,
  index,
}: {
  step: ProcessStep;
  index: number;
}) {
  return (
    <div
      /* Card size — explicit caps so the card doesn't fill the entire
         cards stage (which made it feel oversized on both mobile and
         desktop). Mobile: 88vw × 60vh portrait. Desktop: 1100px ×
         60vh landscape, with a 540px floor so it doesn't get tiny on
         short laptops. */
      className="
        pointer-events-auto
        relative grid
        w-[88vw] h-full
        grid-rows-[40%_60%]
        md:w-full md:max-w-[1100px] md:h-[60vh] md:max-h-[560px] md:min-h-[440px]
        md:grid-rows-1 md:grid-cols-2
        overflow-hidden rounded-[2rem]
        border border-white/10
        bg-[#1A1A1A]
        shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]
      "
    >
      {/* Image side — top half on mobile, left half on desktop. */}
      <div className="relative bg-[#0E0E0E]">
        {step.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={step.imageSrc}
            alt={`${step.titlePrimary} ${step.titleAccent}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* Text side — bottom half on mobile, right half on desktop.
          Desktop text clamps capped at sensible MAX values (not vh-
          relative ceilings) so on a maximized 1440p+ display the text
          stack doesn't outgrow the card's max-h. Was:
            step #  clamp(56px, 9vh,    140px)  → 140px at fullscreen
            title   clamp(30px, 6.5vh,  72px)   → 72px  at fullscreen
            body    clamp(16px, 2.8vh,  25px)   → 25px  at fullscreen
          Now (caps lowered):
            step #  clamp(48px, 6.5vh,  88px)
            title   clamp(28px, 4.2vh,  48px)
            body    clamp(15px, 2.0vh,  18px)
          Total max text stack now fits comfortably inside max-h-[560px]
          with breathing room on every monitor size. */}
      <div className="flex min-h-0 flex-col justify-start gap-2 p-4 sm:p-[clamp(18px,2.6vh,48px)] md:justify-between md:gap-0 md:p-[clamp(22px,3vh,42px)]">
        <div className="font-heading italic leading-none text-white/65 text-[28px] md:text-[clamp(48px,6.5vh,88px)]">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="max-w-[34rem]">
          <h3
            className="font-heading font-bold uppercase leading-[1.05] tracking-tight text-white text-[18px] md:text-[clamp(28px,4.2vh,48px)] md:leading-[1.04]"
            style={{ letterSpacing: '-0.01em' }}
          >
            {step.titlePrimary}
            <br />
            <span className="font-heading italic font-normal">
              {step.titleAccent}
            </span>
          </h3>
          <p className="font-body mt-1.5 text-[12px] leading-snug text-white/75 md:mt-[clamp(12px,2.2vh,22px)] md:text-[clamp(15px,2.0vh,18px)] md:leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}
