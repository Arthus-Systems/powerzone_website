'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

/**
 * Thin Applications-page wrapper around the shared Navbar. Scopes
 * `scroll-snap-type: y proximity` to the document for the duration of this
 * page, and pins the navbar to the viewport (fixed) so it stays in view
 * across all the snap-scrolled industry sections.
 */
export default function ApplicationsNavbar() {
  useEffect(() => {
    // Snap is only useful for the lg+ wheel cinematic. On mobile the
    // industries render as a plain vertical list with no snap targets,
    // so scope this to desktop widths only.
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => {
      document.documentElement.style.scrollSnapType = mq.matches
        ? 'y proximity'
        : '';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-[90]">
      <Navbar />
    </div>
  );
}
