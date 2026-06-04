'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* -----------------------------------------------------------------------------
 * ContactFloatingCTA — circle phone icon that expands to a labelled pill on
 * hover. Pinned to the lower-right corner of the viewport via `position:
 * fixed`. Visibility gated by window.scrollY > 80 so it stays hidden during
 * the fixed-canvas intro phase and appears the moment the user starts
 * scrolling through the homepage sections.
 *
 * Hover behavior: pure CSS width transition. The Link is `w-12` (a circle)
 * by default and `hover:w-[180px]` (a pill). The icon stays anchored to the
 * left in a w-12 slot; the text fades in via an opacity transition slightly
 * delayed so the width has time to begin opening before the label appears.
 *
 * The CTA also slides UP and fades out as the site Footer enters the
 * viewport, so it never overlaps the footer's CTAs. An IntersectionObserver
 * watches the single `<footer>` element on the page; a small retry loop
 * handles the case where the footer mounts after this component (e.g.
 * the homepage renders it late on first visit).
 *
 * z-index sits at `z-40` — above ordinary section content but BELOW the
 * page-transition curtain (`z-[100]`), so navigations cover it cleanly.
 * -------------------------------------------------------------------------- */
export default function ContactFloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [footerNear, setFooterNear] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Find the footer once it mounts. Use a small retry loop if it's not
    // present immediately (the homepage renders the footer late on first visit).
    let observer: IntersectionObserver | null = null;
    let attempt = 0;
    const tryAttach = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        if (attempt++ < 30) window.setTimeout(tryAttach, 300);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setFooterNear(entry.isIntersecting),
        { rootMargin: '0px 0px -10% 0px' },
      );
      observer.observe(footer);
    };
    tryAttach();
    return () => {
      observer?.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={false}
      animate={
        visible && !footerNear
          ? { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' }
          : footerNear
            ? { opacity: 0, y: -60, scale: 0.92, pointerEvents: 'none' } /* slide UP as footer arrives */
            : { opacity: 0, y: 24, scale: 0.92, pointerEvents: 'none' } /* initial hidden state, below */
      }
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-[clamp(20px,3vh,40px)] right-[clamp(20px,3vw,48px)] z-40"
    >
      <Link
        href="/contact"
        aria-label="Contact us"
        className="group flex h-12 w-12 items-center overflow-hidden rounded-full bg-[#e8302a] text-white shadow-[0_10px_28px_rgba(232,48,42,0.45)] ring-1 ring-white/15 transition-[width,box-shadow] duration-300 ease-out hover:w-[180px] hover:shadow-[0_14px_34px_rgba(232,48,42,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="flex h-12 w-12 flex-none items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span className="pr-5 whitespace-nowrap font-tiny text-[12px] font-bold uppercase tracking-[0.18em] opacity-0 transition-opacity duration-200 delay-75 group-hover:opacity-100">
          Contact Us
        </span>
      </Link>
    </motion.div>
  );
}
