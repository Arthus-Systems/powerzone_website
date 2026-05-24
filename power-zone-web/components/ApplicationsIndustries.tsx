'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from 'framer-motion';

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
    imageSrc: '/images/applications_2_1.png',
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
    imageSrc: '/images/applications_2_2.png',
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
    imageSrc: '/images/applications_2_3.png',
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
    imageSrc: '/images/applications_2_4.png',
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
    imageSrc: '/images/applications_2_5.png',
    tint: 'rgba(30,27,75,0.04)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function ApplicationsIndustries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>(Array(INDUSTRIES.length).fill(null));

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = sectionRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const handleRef = useCallback(
    (i: number) => (el: HTMLElement | null) => { sectionRefs.current[i] = el; },
    [],
  );

  const scrollToSection = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {INDUSTRIES.map((industry, i) => (
        <IndustrySection
          key={industry.id}
          industry={industry}
          onRef={handleRef(i)}
        />
      ))}

      {/* ── Vertical dot navigation ────────────────────────────────────── */}
      <nav
        aria-label="Industry sections"
        className="fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col gap-3.5 md:flex"
      >
        {INDUSTRIES.map((industry, i) => (
          <div key={industry.id} className="group relative flex items-center justify-end">
            {/* Tooltip */}
            <span className="
              pointer-events-none absolute right-full mr-3 whitespace-nowrap
              rounded-full bg-[#1A1A1A]/85 px-3 py-1.5
              text-[10px] font-semibold uppercase tracking-[0.2em] text-white
              opacity-0 transition-all duration-200
              group-hover:opacity-100
            ">
              {industry.label}
            </span>
            {/* Dot */}
            <button
              type="button"
              onClick={() => scrollToSection(i)}
              aria-label={`Go to ${industry.label}`}
              className={`
                block rounded-full transition-all duration-300
                ${activeIndex === i
                  ? 'h-3.5 w-3.5 bg-red-600 shadow-[0_0_0_3px_rgba(220,38,38,0.18)]'
                  : 'h-2.5 w-2.5 bg-black/20 hover:bg-black/45'
                }
              `}
            />
          </div>
        ))}
      </nav>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IndustrySection
// ─────────────────────────────────────────────────────────────────────────────

function IndustrySection({
  industry,
  onRef,
}: {
  industry: Industry;
  onRef: (el: HTMLElement | null) => void;
}) {
  const shouldReduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Forward ref to parent after mount
  useEffect(() => {
    onRef(sectionRef.current);
    return () => onRef(null);
  }, [onRef]);

  // Parallax — image moves at ~60% of normal scroll speed
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduce ? [0, 0] : [80, -80],
  );

  // Staggered content reveal
  const isInView = useInView(contentRef, { once: true, amount: 0.25 });

  const anim = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduce ? 0 : 22 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      ref={sectionRef}
      id={industry.id}
      aria-label={industry.label}
      // Mobile: stacked (image then content). Desktop: side-by-side.
      className="relative flex h-auto flex-col-reverse overflow-hidden md:h-screen md:flex-row"
      style={{ backgroundColor: '#F4EFE7' }}
    >
      {/* Subtle per-industry tint on the left panel region */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full md:w-[45%]"
        style={{ backgroundColor: industry.tint }}
      />

      {/* ── Left panel (content) ──────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="
          relative z-10 flex w-full flex-col justify-center
          px-6 py-12
          md:w-[45%] md:px-10 md:py-14
          lg:px-16 lg:py-16
        "
      >
        {/* Label */}
        <motion.p
          {...anim(0)}
          className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-600"
        >
          {industry.label}
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...anim(0.1)}
          className="mt-4 max-w-[30rem] text-[clamp(24px,2.8vw,38px)] font-bold leading-[1.1] tracking-tight text-[#1A1A1A]"
        >
          {industry.headline}
        </motion.h2>

        {/* Description */}
        <motion.p
          {...anim(0.2)}
          className="mt-4 max-w-[30rem] text-[clamp(13px,1.4vw,15px)] leading-relaxed text-[#555]"
        >
          {industry.description}
        </motion.p>

        {/* Benefit cards */}
        <div className="mt-6 flex flex-col gap-2.5">
          {industry.benefits.map((benefit, bi) => (
            <motion.div
              key={bi}
              {...anim(0.3 + bi * 0.1)}
              className="
                flex items-center gap-4 rounded-xl bg-white
                px-4 py-3.5
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]
              "
            >
              {/* Icon */}
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
              {/* Text */}
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

        {/* CTA */}
        <motion.div {...anim(0.6)} className="mt-8">
          <Link
            href="/contact"
            className="
              inline-flex items-center gap-2.5
              rounded-full bg-red-600
              px-7 py-3
              text-[11px] font-semibold uppercase tracking-[0.22em] text-white
              transition-all duration-300
              hover:bg-red-500 hover:shadow-[0_6px_24px_-6px_rgba(220,38,38,0.55)]
            "
          >
            Contact Sales
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 shrink-0"
              aria-hidden
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* ── Right panel (parallax image) ──────────────────────────────── */}
      {/* On mobile: fixed height, parallax off. On desktop: fills remaining width. */}
      <div className="relative h-[45vw] w-full overflow-hidden md:h-auto md:flex-1">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-x-0 -top-[10%] bottom-[-10%] will-change-transform"
        >
          {/* Grey placeholder — swap for <img> once images are ready */}
          {/* <div className="flex h-full w-full items-center justify-center bg-zinc-200/80">
            <span className="select-none text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-400">
              {industry.placeholder}
            </span>
          </div> */}
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
