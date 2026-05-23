import type { Metadata } from 'next';
import Link from 'next/link';
import GoalsSection from '@/components/GoalsSection';

export const metadata: Metadata = {
  title: 'Applications — Power Zone',
  description:
    'Discover how Power Zone systems meet key operational goals across industries — from power quality to emissions reduction.',
};

const NAV_LINKS = [
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function ApplicationsPage() {
  return (
    <div className="relative bg-[#F4EFE7]">
      {/* Sticky nav — persists across all scroll sections */}
      <nav className="sticky top-0 z-50 h-24 border-b border-black/10 bg-[#F4EFE7]/90 backdrop-blur-md">
        {/* Top-left logo */}
        <Link
          href="/"
          aria-label="Power Zone home"
          className="absolute left-8 top-1/2 -translate-y-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-on-light.png"
            alt="Power Zone"
            draggable={false}
            className="pointer-events-none h-14 w-auto select-none"
          />
        </Link>

        <div
          className="
            flex h-full items-center justify-center gap-3
            text-sm font-bold uppercase tracking-[0.24em] text-black
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
                  transition-colors duration-300
                  ${isActive ? 'bg-red-500/20 text-red-600' : 'hover:bg-black/8'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Hero section — fills the viewport below the sticky nav */}
      <section className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center px-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-red-500">
          Power Zone
        </p>
        <h1
          className="
            mx-auto mt-5 max-w-[56rem]
            text-[clamp(48px,6.5vw,96px)] font-semibold
            leading-[0.96] tracking-[-0.025em] text-black
          "
        >
          Applications
        </h1>
        <p className="mx-auto mt-7 max-w-[40rem] text-[15px] leading-relaxed text-black/55 md:text-[17px]">
          Real-world energy challenges demand proven solutions. Scroll to
          explore how Power Zone systems meet your operational goals.
        </p>
        {/* Scroll cue */}
        <div className="mt-14 flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-black/35">
            Scroll
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 animate-bounce text-black/35"
            aria-hidden
          >
            <path d="M12 5v14" />
            <path d="M18 13l-6 6-6-6" />
          </svg>
        </div>
      </section>

      {/* Operational Goals section — scroll-animated, follows hero */}
      <GoalsSection />
    </div>
  );
}
