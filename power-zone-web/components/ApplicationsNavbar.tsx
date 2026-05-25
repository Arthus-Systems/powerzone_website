'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export default function ApplicationsNavbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide once the user scrolls past 80% of the viewport height (the hero).
      // Reappear when they scroll back up into the hero.
      setHidden(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed left-0 right-0 top-0 z-50 h-24
        border-b border-white/10 bg-black/30 backdrop-blur-md
        transition-transform duration-300 ease-in-out
        ${hidden ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      {/* Logo */}
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
          text-[13px] font-bold uppercase tracking-[0.24em]
          [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]
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
  );
}
