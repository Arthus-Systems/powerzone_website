'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
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
//   150 → slow / cinematic (current — cards were flicking past at 100)
const SECTION_VH_PER_STEP = 150;

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

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F4EFE7]"
      style={{ height: `${PROCESS_STEPS.length * SECTION_VH_PER_STEP}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section header. vh-aware padding shrinks on short laptops
         * (16:9 / 16:10) so the card area below has enough room for
         * the step number + title + description without clipping. */}
        <div className="px-6 pt-[clamp(40px,5vh,80px)] pb-[clamp(6px,1vh,16px)] text-center">
          <p className="text-[clamp(13px,1.8vh,20px)] font-medium uppercase tracking-[0.32em] text-red-500">
            Our Solutions
          </p>
          <h2 className="mx-auto mt-[clamp(8px,1.5vh,16px)] max-w-[60rem] text-[clamp(22px,3.6vh,46px)] font-semibold leading-[1.1] tracking-tight text-black">
            Power &amp; Backup Solutions for Industry-Specific Demands
          </h2>
          <p className="mx-auto mt-[clamp(8px,1.5vh,20px)] max-w-[44rem] text-[clamp(12px,1.6vh,15px)] leading-relaxed text-black/60">
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
              scrollYProgress={clampedProgress}
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

    // Reserve the last DWELL_FRACTION of progress as dwell time for the
    // final card. Without this, the last card's "active" checkpoint sits at
    // progress=1.0 (the exact frame the section unsticks), so the user
    // never sees it before Section 4 takes over. With dwell, all the
    // transitions complete by progress=(1 - DWELL_FRACTION), and the final
    // card stays at the front for the remaining scroll thanks to
    // useTransform's automatic clamping past the last input keyframe.
    const DWELL_FRACTION = 0.15;
    const transitionEnd = 1 - DWELL_FRACTION;

    for (let i = 0; i < total; i++) {
      inputs.push((i / (total - 1)) * transitionEnd);
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
      <div
        className="
          pointer-events-auto
          relative grid h-full w-full max-w-[1400px]
          grid-cols-1 md:grid-cols-2
          overflow-hidden rounded-[2rem]
          border border-white/10
          bg-[#1A1A1A]
        "
      >
        {/* Text side. Sizes bumped so the type fills the card properly
         * (was visibly too small inside the 15%-shrunk card — the card
         * looked half empty). Padding tightened slightly to give the
         * larger type more breathing room. */}
        <div className="flex min-h-0 flex-col justify-between p-[clamp(18px,2.6vh,48px)] md:p-[clamp(22px,3vh,56px)]">
          {/* Step number — italic serif */}
          <div className="font-serif italic leading-none text-white/65 text-[clamp(56px,9vh,140px)]">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Title + description sit at the bottom */}
          <div className="max-w-[36rem]">
            <h3
              className="font-bold uppercase leading-[1.02] tracking-tight text-white text-[clamp(30px,6.5vh,72px)]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {step.titlePrimary}
              <br />
              <span className="font-serif italic font-normal">
                {step.titleAccent}
              </span>
            </h3>
            <p className="mt-[clamp(14px,3vh,35px)] text-[clamp(16px,2.8vh,25px)] leading-relaxed text-white/75">
              {step.description}
            </p>
          </div>
        </div>

        {/* Image side — empty until imageSrc is set on the step above */}
        <div className="relative hidden bg-[#0E0E0E] md:block">
          {step.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={step.imageSrc}
              alt={`${step.titlePrimary} ${step.titleAccent}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
