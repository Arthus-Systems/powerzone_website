'use client';

import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';

// ───────────────────────────────────────────────────────────────────────────
// PROCESS STEPS — EDIT THIS ARRAY TO CHANGE TEXT AND IMAGES
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

/* -----------------------------------------------------------------------------
 * ProcessSection ("Our Solutions")
 *
 * The cards are stacked via the open-source <ScrollStack /> component
 * (components/ui/ScrollStack.tsx). On both mobile and desktop the
 * stacking math is identical:
 *   - itemStackDistance = 0  → every new card pins at the EXACT same
 *     position as the previous one (no vertical peek). Combined with
 *     baseScale=1 / itemScale=0 below, each card completely covers
 *     the one behind it as it stacks.
 *   - useWindowScroll       → page scroll drives the animation (so the
 *     user can wheel/swipe through naturally and continue out the
 *     bottom into the Footer reveal). No internal scroll trap.
 *   - useLenis={false}      → ScrollStack does NOT install a Lenis
 *     instance. Without this, ScrollStack would install Lenis on the
 *     window (since useWindowScroll=true), which would smooth-scroll
 *     the ENTIRE homepage and could interfere with the other scroll-
 *     driven sections above (SolutionsSection GSAP, GoalsSection
 *     useScroll). Native scroll is used here; cards animate per-event
 *     instead of through Lenis's RAF lerp.
 *
 * Card layout is responsive INSIDE each item:
 *   - mobile (<md): image on top (38%), text below (62%) — portrait
 *   - desktop (md+): image on left, text on right — landscape
 * Same ScrollStack component drives the stacking for both shapes;
 * only the card body's grid changes via Tailwind breakpoints.
 *
 * Footer hand-off:
 *   The inner padding bottom of the ScrollStack (.pz-process-stack
 *   .scroll-stack-inner) is intentionally small so that once the last
 *   card has reached its pinned position, the .scroll-stack-end
 *   spacer arrives in the viewport quickly. The cards release pin,
 *   the page continues scrolling, and the Footer's own sticky-reveal
 *   mechanic kicks in immediately below.
 * -------------------------------------------------------------------------- */
export default function ProcessSection() {
  return (
    <section className="relative bg-[#F4EFE7]" style={{ scrollSnapAlign: 'start' }}>
      {/* Section header — sits above the ScrollStack as part of the
          natural document flow. */}
      <div className="px-6 pt-[clamp(40px,6vh,96px)] pb-[clamp(10px,2vh,24px)] text-center">
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

      <div className="pz-process-stack relative w-full">
        <ScrollStack
          useWindowScroll
          useLenis={false}
          itemDistance={120}
          itemScale={0}
          itemStackDistance={0}
          stackPosition="10%"
          scaleEndPosition="6%"
          baseScale={1}
          rotationAmount={0}
          blurAmount={0}
        >
          {PROCESS_STEPS.map((step, i) => (
            <ScrollStackItem key={`${step.titlePrimary}-${i}`}>
              <ProcessCardContent step={step} index={i} />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}

/* ── ProcessCardContent ────────────────────────────────────────────────
 * The visual contents of a single process step card. Responsive grid:
 *   - mobile (<md): grid-rows-[38%_62%] image on top, text below
 *   - desktop (md+): grid-cols-2 image on left, text on right
 * The outer .scroll-stack-card (from ScrollStack) provides the card's
 * dimensions / border-radius / shadow via the .pz-process-stack CSS
 * overrides in globals.css. */
function ProcessCardContent({ step, index }: { step: ProcessStep; index: number }) {
  return (
    <div
      className="
        relative grid h-full w-full
        grid-rows-[38%_62%]
        md:grid-rows-1 md:grid-cols-2
        overflow-hidden rounded-[2rem]
        border border-white/10
        bg-[#1A1A1A]
      "
    >
      {/* Image side — fills the top half (mobile) or left half (desktop). */}
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

      {/* Text side. Mobile stacks number/title/description tightly at the
          top of the text area; desktop uses justify-between to push the
          step number to the top and the title block to the bottom of the
          dramatic side-by-side card. */}
      <div className="flex min-h-0 flex-col justify-start gap-2 p-4 sm:p-[clamp(18px,2.6vh,48px)] md:justify-between md:gap-0 md:p-[clamp(22px,3vh,56px)]">
        {/* Step number — italic serif. */}
        <div className="font-heading italic leading-none text-white/65 text-[28px] md:text-[clamp(56px,9vh,140px)]">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Title + description */}
        <div className="max-w-[36rem]">
          <h3
            className="font-heading font-bold uppercase leading-[1.05] tracking-tight text-white text-[18px] md:text-[clamp(30px,6.5vh,72px)] md:leading-[1.02]"
            style={{ letterSpacing: '-0.01em' }}
          >
            {step.titlePrimary}
            <br />
            <span className="font-heading italic font-normal">
              {step.titleAccent}
            </span>
          </h3>
          <p className="font-body mt-1.5 text-[12px] leading-snug text-white/75 md:mt-[clamp(14px,3vh,35px)] md:text-[clamp(16px,2.8vh,25px)] md:leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}
