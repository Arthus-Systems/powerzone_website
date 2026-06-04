'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type TargetAndTransition } from 'framer-motion';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────────────────────

type Benefit = { stat: string; label: string; iconPath: string };

type Industry = {
  id: string;
  label: string;
  headline: string;
  description: string;
  benefits: Benefit[];
  placeholder: string;
  imageSrc: string;
  tint: string;
};

const INDUSTRIES: Industry[] = [
  {
    id: 'warehouses',
    label: 'Warehouses & Logistics',
    headline: 'Keep Operations on Track and Offset Energy Costs',
    description:
      'Power outages can disrupt logistics chains and damage sensitive inventory. Power Zone provides reliable backup power while lowering electricity costs and reducing building emissions across your warehouse facilities.',
    benefits: [
      {
        stat: 'Up to 30%',
        label: 'Reduction in electricity costs through smart energy arbitrage and peak shaving',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        stat: '250ms',
        label: 'Switchover time ensures conveyor belts, climate control, and inventory systems stay uninterrupted',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Up to 90%',
        label: 'Lower CO₂ emissions compared to conventional standby generators',
        iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z',
      },
    ],
    placeholder: 'WAREHOUSE IMAGE',
    imageSrc: '/images/applications_2_1.webp',
    tint: 'rgba(251,191,36,0.05)',
  },
  {
    id: 'schools',
    label: 'Schools & Universities',
    headline: 'Reliable Power for Uninterrupted Learning',
    description:
      'Educational institutions depend on consistent power for classrooms, labs, server rooms, and campus infrastructure. Power Zone ensures academic operations continue without disruption while supporting institutional sustainability goals.',
    benefits: [
      {
        stat: 'Zero Downtime',
        label: 'Instant backup activation keeps classrooms, labs, and admin systems running',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Lower Bills',
        label: 'Smart energy management reduces operational costs for budget-conscious institutions',
        iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Green Campus',
        label: 'Supports sustainability certifications and reduces institutional carbon footprint',
        iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
    ],
    placeholder: 'SCHOOL IMAGE',
    imageSrc: '/images/applications_2_2.webp',
    tint: 'rgba(59,130,246,0.04)',
  },
  {
    id: 'factories',
    label: 'Factories & Plants',
    headline: 'Industrial-Grade Power for Non-Stop Production',
    description:
      'Manufacturing downtime costs more than just electricity. Power Zone protects production lines, CNC machinery, and critical industrial processes with stable, high-quality power delivery and instant backup when the grid fails.',
    benefits: [
      {
        stat: '99.9% Uptime',
        label: 'Reliable power for continuous production runs and shift operations',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Power Quality',
        label: 'Voltage regulation, harmonic filtering, and power factor correction built-in',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        stat: 'Scalable',
        label: 'From small workshops to large-scale industrial plants, systems grow with your needs',
        iconPath: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4',
      },
    ],
    placeholder: 'FACTORY IMAGE',
    imageSrc: '/images/applications_2_3.webp',
    tint: 'rgba(107,114,128,0.05)',
  },
  {
    id: 'offices',
    label: 'Offices & Retail Spaces',
    headline: 'Smart Energy for Modern Workspaces',
    description:
      'From corporate headquarters to retail chains, Power Zone delivers clean, efficient power that reduces energy costs, eliminates outage risks, and helps commercial spaces meet their ESG and sustainability commitments.',
    benefits: [
      {
        stat: 'Cost Control',
        label: 'Peak shaving and energy arbitrage reduce monthly electricity bills significantly',
        iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Always On',
        label: 'Servers, POS systems, HVAC, and security systems stay powered during outages',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'ESG Ready',
        label: 'Align your commercial operations with modern environmental and governance standards',
        iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      },
    ],
    placeholder: 'OFFICE IMAGE',
    imageSrc: '/images/applications_2_4.webp',
    tint: 'rgba(139,92,246,0.04)',
  },
  {
    id: 'arenas',
    label: 'Arenas & Venues',
    headline: 'Uninterrupted Power for World-Class Events',
    description:
      'Large venues demand massive, stable power for lighting, AV systems, HVAC, and crowd safety infrastructure. Power Zone delivers reliable, high-capacity energy solutions that keep events running smoothly from setup to teardown.',
    benefits: [
      {
        stat: 'High Capacity',
        label: 'Generator and BESS systems scaled for large-load, high-demand environments',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      },
      {
        stat: 'Instant Response',
        label: 'Millisecond-level backup activation protects live events and broadcast systems',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      },
      {
        stat: 'Quiet & Clean',
        label: 'Reduced noise and emissions compared to conventional generator banks',
        iconPath: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14.243A2 2 0 0017 9.757',
      },
    ],
    placeholder: 'ARENA IMAGE',
    imageSrc: '/images/applications_2_5.webp',
    tint: 'rgba(30,27,75,0.04)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Animation config
// ─────────────────────────────────────────────────────────────────────────────

// Ease curves
const PANEL_EASE:   [number, number, number, number] = [0.76, 0, 0.24, 1];   // panel enter
const EXIT_EASE:    [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]; // panel recede
const CONTENT_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]; // inner stagger

// Full-panel slide variants.
//
// dir = 1  → scroll down: entering panel rises from bottom (y: 100% → 0%),
//            exiting panel recedes upward (y: 0% → -15%) and shrinks.
// dir = -1 → scroll up: mirror — entering from top, exiting recedes downward.
//
// The exit does NOT do a full 100% exit — it shrinks and fades so it appears
// to recede into the background while the new slide comes in on top. The
// entering slide is naturally above the exiting one because AnimatePresence
// appends the new child after the exiting child in the DOM.
//
// `transition` is embedded per-variant so enter and exit can have
// independently-tuned durations/easing.
const PANEL_VARIANTS = {
  enter: (dir: 1 | -1) => ({
    y: dir > 0 ? '100%' : '-100%',
    scale: 1,
    opacity: 1,
  }),
  center: {
    y: '0%',
    scale: 1,
    opacity: 1,
    transition: {
      y:       { duration: 0.8, ease: PANEL_EASE },
      scale:   { duration: 0.8, ease: PANEL_EASE },
      opacity: { duration: 0.8, ease: PANEL_EASE },
    },
  },
  exit: (dir: 1 | -1) => ({
    y: dir > 0 ? '-15%' : '15%',
    scale: 0.95,
    opacity: 0.6,
    transition: {
      duration: 0.7,
      ease: EXIT_EASE,
    },
  }),
};

// Minimum ms between two navigations. Must comfortably exceed the enter
// animation duration (0.8 s) so macOS trackpad momentum events (which fire
// for 1–3 s after a swipe) cannot trigger a second section jump the instant
// the animation completes.
const NAV_COOLDOWN_MS = 1200;

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ApplicationsIndustries() {
  const N = INDUSTRIES.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState<1 | -1>(1);
  const [dotsVisible, setDotsVisible] = useState(false);
  // Controls whether IndustrySlide plays its enter stagger. False until the
  // first navigation fires — keeps the first visible slide static on load.
  const [hasNavigated, setHasNavigated] = useState(false);

  const outerRef  = useRef<HTMLDivElement>(null);
  // Refs shadow live state so the wheel handler is never stale.
  const activeRef = useRef(0);
  // True while the exit animation is running. Cleared by onExitComplete.
  const animating = useRef(false);
  // Timestamp of the last navigation (ms). Guards against momentum scroll
  // firing a second transition the instant animating becomes false.
  const lastNav   = useRef(-Infinity);
  // Whether we should eat the very first wheel event after the sticky range
  // becomes active. Without this, scrolling down from GoalsSection fires a
  // wheel event the same frame the section activates, immediately advancing
  // past panel 0 to panel 1.
  const justActivated = useRef(true);
  // Tracks the previous in-range state so we can detect the boundary cross.
  const wasActive = useRef(false);

  // ── navigate ──────────────────────────────────────────────────────────────
  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = activeRef.current + dir;
      // At an edge — let the page scroll naturally past this section.
      if (next < 0 || next >= N) return;

      animating.current = true;
      activeRef.current = next;
      lastNav.current = Date.now();
      setHasNavigated(true);
      setDirection(dir);
      setActiveIndex(next);

      // NOTE: We intentionally do NOT call window.scrollBy here. The wheel
      // handler preventDefaults the event when it actually drives a panel
      // change, so the page scroll stays pinned at the sticky-range entry.
      // Calling scrollBy here was causing overshoot when navigating up from
      // a middle panel — it would push the page out of the sticky range and
      // cause subsequent wheel events to bail (skipping panels 0-2).
    },
    [N],
  );

  // ── Wheel interception ────────────────────────────────────────────────────
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onWheel = (e: WheelEvent) => {
      const rect = outer.getBoundingClientRect();
      const vh   = window.innerHeight;

      // Determine whether the sticky zone is active this frame:
      //   container top has reached (or passed) viewport top
      //   AND container bottom is still on-screen.
      const isActive = rect.top <= 0 && rect.bottom >= vh;

      // Boundary cross: section just became active. Eat this first wheel
      // event so the same gesture that brought us into the section doesn't
      // immediately fire a panel advance (skipping panel 0).
      if (isActive && !wasActive.current) {
        wasActive.current = true;
        justActivated.current = true;
        return;
      }
      if (!isActive) {
        wasActive.current = false;
        return;
      }
      if (justActivated.current) {
        justActivated.current = false;
        return;
      }

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const next = activeRef.current + dir;

      if (next >= 0 && next < N) {
        // Block browser scroll while inside the section so the page scroll
        // stays pinned at the sticky-range entry. This is what makes the
        // wheel handler the sole driver of panel changes within the section.
        e.preventDefault();

        // Dual gate: animation must be complete AND cooldown must have elapsed.
        // animating alone isn't enough — trackpad momentum keeps firing after
        // onExitComplete (0.7 s). lastNav alone isn't enough — it doesn't
        // prevent a stacked navigate call during the brief window between
        // onExitComplete and the cooldown expiring.
        if (animating.current) return;
        if (Date.now() - lastNav.current < NAV_COOLDOWN_MS) return;

        navigate(dir);
      }
      // At first/last boundary (next out of range): fall through so the
      // browser's natural scroll carries the user out of the section.
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [navigate, N]);

  // ── Dot visibility via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setDotsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Dot click ─────────────────────────────────────────────────────────────
  const goToDot = (i: number) => {
    if (i === activeRef.current || animating.current) return;
    const el = outerRef.current;
    if (!el) return;

    // Sync main-page scroll so the sticky section is properly positioned.
    const containerTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: containerTop + i * window.innerHeight, behavior: 'smooth' });

    const dir: 1 | -1 = i > activeRef.current ? 1 : -1;
    animating.current = true;
    activeRef.current = i;
    setHasNavigated(true);
    setDirection(dir);
    setActiveIndex(i);
  };

  return (
    // Outer container provides N × 100vh of scroll budget for the sticky
    // section. scrollSnapAlign ensures the viewport snaps cleanly to the top
    // of this section when transitioning from the section above.
    <div
      ref={outerRef}
      style={{ height: `${N * 100}vh`, scrollSnapAlign: 'start' }}
      className="relative"
    >
      {/* Sticky viewport — overflow:hidden clips both the entering and exiting
          panels so nothing bleeds outside the visible area. */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <AnimatePresence
          initial={false}
          custom={direction}
          onExitComplete={() => { animating.current = false; }}
        >
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={PANEL_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 will-change-transform"
          >
            <IndustrySlide
              industry={INDUSTRIES[activeIndex]}
              direction={direction}
              animated={hasNavigated}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Scroll indicators (left side, same visual style as Products page) ─────── */}
      <nav
        aria-label="Industry sections"
        className={`
          pointer-events-auto fixed left-7 top-1/2 z-[70] -translate-y-1/2
          hidden flex-col items-center gap-2.5
          mix-blend-difference
          md:flex
          transition-opacity duration-300
          ${dotsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {INDUSTRIES.map((industry, i) => {
          const active = activeIndex === i;
          return (
            <button
              key={industry.id}
              type="button"
              onClick={() => goToDot(i)}
              aria-label={`Go to ${industry.label}`}
              className={`
                block rounded-full
                transition-all duration-500 ease-out
                ${active
                  ? 'h-3 w-[3px] bg-white'
                  : 'h-[3px] w-[3px] bg-white/35'
                }
              `}
            />
          );
        })}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IndustrySlide — purely presentational, no scroll logic
// ─────────────────────────────────────────────────────────────────────────────
//
// `animated` is false only for the first slide (no stagger on initial load).
// After the first navigation it becomes true and all subsequent slides play
// the full choreographed enter animation.
//
// `direction` determines the axis of the inner stagger:
//   dir =  1 (entering from below) → elements rise  upward   (y: +N → 0)
//   dir = -1 (entering from above) → elements settle downward (y: -N → 0)
// ─────────────────────────────────────────────────────────────────────────────

function IndustrySlide({
  industry,
  direction,
  animated,
}: {
  industry: Industry;
  direction: 1 | -1;
  animated: boolean;
}) {
  // dir > 0 → elements start below (+y) and rise to 0
  // dir < 0 → elements start above (-y) and settle to 0
  const d = direction > 0 ? 1 : -1;

  // When `animated` is false (first slide), pass `false` as `initial` so
  // Framer Motion starts the element in its `animate` (final) state
  // with no transition — the slide appears static on load.
  const init = (props: TargetAndTransition): TargetAndTransition | false =>
    animated ? props : false;

  return (
    <section
      aria-label={industry.label}
      className="relative flex h-full w-full flex-col md:flex-row"
      style={{ backgroundColor: '#F4EFE7' }}
    >
      {/* Per-industry colour tint on the content side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[45%]"
        style={{ backgroundColor: industry.tint }}
      />

      {/* ── Left panel (text + benefits) ────────────────────────────────── */}
      <div
        className="
          relative z-10 flex w-full flex-col justify-center
          bg-[#F4EFE7]
          px-6 py-12
          md:w-[45%] md:px-10 md:py-14
          lg:px-16 lg:py-16
        "
      >
        {/* Category label */}
        <motion.p
          initial={init({ opacity: 0, y: d * 20 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: CONTENT_EASE }}
          className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-600"
        >
          {industry.label}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={init({ opacity: 0, y: d * 28 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: CONTENT_EASE }}
          className="mt-4 max-w-[30rem] text-[clamp(24px,2.8vw,38px)] font-bold leading-[1.1] tracking-tight text-[#1A1A1A]"
        >
          {industry.headline}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={init({ opacity: 0, y: d * 18 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: CONTENT_EASE }}
          className="mt-4 max-w-[30rem] text-[clamp(13px,1.4vw,15px)] leading-relaxed text-[#555]"
        >
          {industry.description}
        </motion.p>

        {/* Benefit cards — staggered */}
        <div className="mt-6 flex flex-col gap-2.5">
          {industry.benefits.map((benefit, bi) => (
            <motion.div
              key={bi}
              initial={init({ opacity: 0, y: d * 14 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 + bi * 0.06, ease: CONTENT_EASE }}
              className="
                flex items-center gap-4 rounded-xl bg-white
                px-4 py-3.5
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]
              "
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D93025"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden
                >
                  <path d={benefit.iconPath} />
                </svg>
              </div>
              <div>
                <p className="text-[15px] font-bold leading-tight text-[#1A1A1A]">
                  {benefit.stat}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-[#888]">
                  {benefit.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA — last to arrive */}
        <motion.div
          initial={init({ opacity: 0, y: d * 12 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.48, ease: CONTENT_EASE }}
          className="mt-8 text-black"
        >
          <InteractiveHoverButton href="/contact">
            Contact Sales
          </InteractiveHoverButton>
        </motion.div>
      </div>

      {/* ── Right panel (image with zoom-settle) ────────────────────────── */}
      {/* overflow:hidden on the parent clips the 1.06→1.0 scale so edges
          never peek outside the panel boundary. */}
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <motion.div
          initial={animated ? { scale: 1.06 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, delay: 0, ease: CONTENT_EASE }}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: 'center center' }}
        >
          {industry.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={industry.imageSrc}
              alt={industry.label}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-200/80">
              <span className="select-none text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-400">
                {industry.placeholder}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
