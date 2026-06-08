'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

// ───────────────────────────────────────────────────────────────────────────
// PROCESS STEPS — EDIT THIS ARRAY TO CHANGE TEXT AND IMAGES
// ───────────────────────────────────────────────────────────────────────────
//   • titlePrimary : sans-serif uppercase part of the title (e.g. "Upload Your")
//   • titleAccent  : italic serif part of the title rendered on its own line
//                    below `titlePrimary` (e.g. "Artwork")
//   • description  : supporting paragraph below the title
//   • imageSrc     : path to right-side image. Leave as '' for an empty
//                    placeholder. Once you drop a file into /public/images/
//                    set this to e.g. '/images/step-1.webp'.
// ───────────────────────────────────────────────────────────────────────────
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
// SCROLL SPEED KNOB
// ───────────────────────────────────────────────────────────────────────────
// How many viewport heights of scroll each step consumes.
// Higher = SLOWER (more scrolling per card transition).
// Lower  = FASTER (less scrolling per card transition).
//   60  → snappy
//   100 → balanced
//   150 → slow / cinematic
//   240 → very slow (current — feedback said 150 was still too quick;
//          combined with the lower-stiffness spring below this gives a
//          much more deliberate, glassy-smooth card-to-card transition)
const SECTION_VH_PER_STEP = 240;

// ───────────────────────────────────────────────────────────────────────────
// LOOK / DEPTH KNOBS
// ───────────────────────────────────────────────────────────────────────────
// "Off-screen below" — how far below center each card waits before its turn.
// Plain pixels (avoids the mixed-unit interpolation issue strings can hit).
const OFF_SCREEN_Y = 1000;

// As newer cards arrive, older cards "recede into the background". All three
// are 0 so the front card always FULLY covers the receded stack behind it —
// previously `RECEDE_SCALE: 0.05` shrunk receded cards by 5% per level,
// which revealed the cream section background around their edges and made
// the front card look semi-transparent during the 4th → 5th transition
// (and made it appear to "shift back to the first card" once the
// scroll passed the last checkpoint, because the small clamped scale 0.80
// of card 0 was visible past the front card's smaller-than-area bounds).
const RECEDE_Y = 0;
const RECEDE_SCALE = 0;
const RECEDE_OPACITY = 0.0;

// Global card scale — applied to every checkpoint so the cards land 15%
// smaller than the available carousel area. Lets the cream surface
// breathe around the dark card instead of edge-to-edge filling.
const BASE_SCALE = 0.85;

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Bullet-proof clamp on the scroll progress. framer-motion's
  // `useScroll` can return values outside [0, 1] as the page scrolls
  // past the section bottom (during the natural exit AFTER sticky
  // unsticks), which made the last card's `motion` opacity drift even
  // though every keyframe was 1.0 — that's the "fifth card becomes
  // translucent the more you scroll" bug. Clamping here means every
  // downstream useTransform sees a value strictly in [0, 1] and snaps
  // to its boundary keyframes.
  const clampedProgress = useTransform(scrollYProgress, (v) =>
    Math.max(0, Math.min(1, v)),
  );

  // SMOOTHING LAYER — feed the clamped scroll progress through a spring
  // so the cards' y / scale tweens follow scroll position with smooth
  // physics-driven momentum rather than 1:1 snap-tracking.
  //
  // Tuning:
  //   stiffness: 110  → fast enough to catch up before the user exits
  //                     the section on a hard fast scroll (was 40 — the
  //                     spring lagged so far behind on fast wheels that
  //                     the first/last card "skipped" because the user
  //                     was past the section's boundary before the
  //                     spring reached its target)
  //   damping:   28   → still no bounce/overshoot
  //   restDelta: 0.0002 → tight settle so the cards land exactly on
  //                     their checkpoint values
  // 110 still feels glassy because the inputs themselves are spread
  // over SECTION_VH_PER_STEP = 240 vh per card — the spring smooths
  // the within-checkpoint linear interp without lagging far behind
  // scroll. Net: cards move smoothly AND a fast wheel still lands you
  // on the last (or first) card at the section boundaries.
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.0002,
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F4EFE7]"
      style={{ height: `${PROCESS_STEPS.length * SECTION_VH_PER_STEP}vh`, scrollSnapAlign: 'start' }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section header. vh-aware padding shrinks on short laptops
         * (16:9 / 16:10) so the card area below has enough room for
         * the step number + title + description without clipping. */}
        <div className="px-6 pt-[clamp(40px,5vh,80px)] pb-[clamp(6px,1vh,16px)] text-center">
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

        {/* Cards container — `flex-1 min-h-0` so the cards' absolute
         * `inset-0` resolves to the remaining viewport (not the full
         * sticky height, which would overlap the header on short
         * screens). */}
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
  // Build keyframes for this card. We sample one checkpoint per card
  // ("active=i" at progress i/(total-1)) and at each checkpoint figure out
  // this card's "level" — how many cards have entered AFTER this one.
  //   level < 0  → hasn't entered yet (sits below screen)
  //   level == 0 → at the front
  //   level > 0  → receded behind (smaller, fainter, slightly higher)
  const transformConfig = useMemo(() => {
    const inputs: number[] = [];
    const yValues: number[] = [];
    const scaleValues: number[] = [];
    const opacityValues: number[] = [];

    // Reserve dwell time at BOTH ends of the scroll range so the
    // first/last cards have settle room at the section boundaries:
    //   - INTRO_FRACTION (top dwell) — gives the spring time to land
    //     on card-0's "active" target after a hard fast scroll into the
    //     section from above. Without this, the first card's active
    //     checkpoint sits at progress=0 (the exact frame the section
    //     becomes sticky), and a fast spring lag would skip it.
    //   - DWELL_FRACTION (bottom dwell) — same logic for the last card
    //     on a hard fast scroll out the bottom. The last card's
    //     "active" checkpoint sits at (1 - DWELL_FRACTION) instead of
    //     1.0, so the section's last DWELL_FRACTION-worth of scroll is
    //     pure settle time for the spring to land on it.
    // Bumped both to 0.22 (was 0.15 / 0) so even at hard fast wheels
    // the spring has comfortable buffer to reach the boundary cards.
    const INTRO_FRACTION = 0.22;
    const DWELL_FRACTION = 0.22;
    const transitionStart = INTRO_FRACTION;
    const transitionEnd = 1 - DWELL_FRACTION;
    const transitionSpan = transitionEnd - transitionStart;

    for (let i = 0; i < total; i++) {
      inputs.push(transitionStart + (i / (total - 1)) * transitionSpan);
      const level = i - index;

      if (level < 0) {
        // Hasn't entered at this checkpoint. Y parks the card OFF_SCREEN_Y
        // px below center (clipped by the section's overflow-hidden), so
        // it's invisible regardless of opacity. We keep opacity = 1 here
        // (instead of 0) so that as the card slides up into view, it's
        // already fully opaque — its solid bg immediately covers the card
        // behind it instead of letting that card bleed through during the
        // fade-in interpolation.
        yValues.push(OFF_SCREEN_Y);
        scaleValues.push(BASE_SCALE);
        opacityValues.push(1);
      } else {
        // Front (level 0) or receded (level > 0). With RECEDE_SCALE = 0
        // every level lands at the same BASE_SCALE so the front card
        // covers receded ones perfectly via z-index alone — no edges
        // peeking around a shrunken front card.
        yValues.push(-level * RECEDE_Y);
        scaleValues.push(BASE_SCALE - level * RECEDE_SCALE);
        opacityValues.push(Math.max(0, 1 - level * RECEDE_OPACITY));
      }
    }

    return { inputs, yValues, scaleValues, opacityValues };
  }, [index, total]);

  const y = useTransform(
    scrollYProgress,
    transformConfig.inputs,
    transformConfig.yValues,
  );
  const scale = useTransform(
    scrollYProgress,
    transformConfig.inputs,
    transformConfig.scaleValues,
  );
  // Opacity is no longer driven by useTransform — every keyframe was
  // 1.0 anyway, and removing it eliminates any chance of a float drift
  // turning the front card translucent when the section exits.

  return (
    <motion.div
      initial={{
        y: index === 0 ? 0 : OFF_SCREEN_Y,
        scale: BASE_SCALE,
      }}
      style={{ y, scale, zIndex: 10 + index }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 py-[clamp(6px,1vh,16px)] md:px-8"
    >
      {/* Mobile: tall portrait rectangle — bumped to 84vh so the card
          actually fills the available vertical space instead of feeling
          condensed. Width capped at 92vw (small horizontal margin) so
          the aspect stays clearly portrait on any phone. Image gets
          45% of the height, text gets 55%. Desktop unchanged — keeps
          full sticky-height side-by-side text|image layout. */}
      <div
        className="
          pointer-events-auto
          relative grid w-full max-w-[1400px]
          h-auto max-h-[84vh] max-w-[92vw] grid-rows-[45%_55%]
          md:h-full md:max-h-none md:max-w-[1400px] md:grid-rows-1 md:grid-cols-2
          overflow-hidden rounded-[2rem]
          border border-white/10
          bg-[#1A1A1A]
        "
      >
        {/* Image side — shown on mobile too (top row); side-by-side on md+. */}
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

        {/* Text side. Sizes bumped so the type fills the card properly
         * (was visibly too small inside the 15%-shrunk card — the card
         * looked half empty). Padding tightened slightly to give the
         * larger type more breathing room. */}
        <div className="flex min-h-0 flex-col justify-between p-4 sm:p-[clamp(18px,2.6vh,48px)] md:p-[clamp(22px,3vh,56px)]">
          {/* Step number — italic serif. Smaller on mobile so it doesn't
              dominate the shorter card. */}
          <div className="font-heading italic leading-none text-white/65 text-[32px] sm:text-[clamp(56px,9vh,140px)]">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Title + description sit at the bottom */}
          <div className="max-w-[36rem]">
            <h3
              className="font-heading font-bold uppercase leading-[1.05] tracking-tight text-white text-[20px] sm:text-[clamp(30px,6.5vh,72px)] sm:leading-[1.02]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {step.titlePrimary}
              <br />
              <span className="font-heading italic font-normal">
                {step.titleAccent}
              </span>
            </h3>
            <p className="font-body mt-2 text-[12px] leading-snug text-white/75 sm:mt-[clamp(14px,3vh,35px)] sm:text-[clamp(16px,2.8vh,25px)] sm:leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
