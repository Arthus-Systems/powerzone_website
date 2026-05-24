import type { Metadata } from 'next';
import Link from 'next/link';
import GoalsSection from '@/components/GoalsSection';
import ApplicationsIndustries from '@/components/ApplicationsIndustries';

export const metadata: Metadata = {
  title: 'Applications — Power Zone',
  description:
    'Discover how Power Zone systems meet key operational goals across industries — from power quality to emissions reduction.',
};

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function ApplicationsPage() {
  return (
    <div className="relative bg-[#F4EFE7]">
      {/* Sticky nav — persists across all scroll sections */}
      <nav className="sticky top-0 z-50 h-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
        {/* Top-left logo */}
        <Link
          href="/"
          aria-label="Power Zone home"
          className="absolute left-8 top-1/2 -translate-y-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-on-dark.png"
            alt="Power Zone"
            draggable={false}
            className="pointer-events-none h-12 w-auto select-none"
          />
        </Link>

        <div
          className="
            flex h-full items-center justify-center gap-3
            text-sm font-bold uppercase tracking-[0.24em]
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/applications';
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  cursor-pointer rounded-full px-5 py-2
                  transition-colors duration-300 text-white
                  ${isActive ? 'bg-red-500/70' : 'hover:bg-red-500/55'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Hero section — fills the viewport below the sticky nav */}
      <section className="relative flex h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-8 text-center">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/background_application.png"
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
              text-[clamp(48px,7.5vw,120px)] font-semibold
              leading-[0.96] tracking-[-0.025em] text-white
            "
          >
            Applications
          </h1>
          <p className="mx-auto mt-7 max-w-[40rem] text-[15px] leading-relaxed text-white/65 md:text-[18px]">
            Real-world energy challenges demand proven solutions. <br></br> 
            Scroll to explore how Power Zone systems meet your operational goals.
          </p>
          {/* Scroll cue */}
          <div className="mt-14 flex flex-col items-center gap-2">
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
          </div>
        </div>
      </section>

      {/* Operational Goals section — scroll-animated, follows hero */}
      <GoalsSection />

      {/* Industry-specific sections */}
      <ApplicationsIndustries />
    </div>
  );
}
