import type { Metadata } from 'next';
import GoalsSection from '@/components/GoalsSection';
import ApplicationsIndustries from '@/components/ApplicationsIndustries';
import ApplicationsNavbar from '@/components/ApplicationsNavbar';

export const metadata: Metadata = {
  title: 'Applications — Power Zone',
  description:
    'Discover how Power Zone systems meet key operational goals across industries — from power quality to emissions reduction.',
};

export default function ApplicationsPage() {
  return (
    <div className="relative bg-[#F4EFE7]">
      <ApplicationsNavbar />

      {/* Hero section — full viewport height, nav floats above it */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-8 text-center">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/background_application.webp"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55" aria-hidden />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[18px] font-medium uppercase tracking-[0.38em] text-red-400">
            Power Zone
          </p>
          <h1
            className="
              mx-auto mt-5 max-w-[56rem]
              text-[clamp(48px,7.5vw,100px)] font-semibold
              leading-[0.96] tracking-[-0.025em] text-white
            "
          >
            Built for Every Industry.
          </h1>
          <p className="mx-auto mt-7 max-w-[40rem] text-[15px] leading-relaxed text-white/65 md:text-[18px]">
            Real-world energy challenges demand proven solutions. <br></br> 
            Scroll to explore how Power Zone systems meet your operational goals.
          </p>
          {/* Scroll cue */}
          {/* <div className="mt-14 flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/40">
              Scroll
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 animate-bounce text-white/40"
              aria-hidden
            >
              <path d="M12 5v14" />
              <path d="M18 13l-6 6-6-6" />
            </svg>
          </div> */}
        </div>
      </section>

      {/* Operational Goals section — scroll-animated, follows hero */}
      <GoalsSection />

      {/* Industry-specific sections */}
      <ApplicationsIndustries />
    </div>
  );
}
