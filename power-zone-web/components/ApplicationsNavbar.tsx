'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

/**
 * Thin Applications-page wrapper around the shared Navbar. Only role left
 * is to scope `scroll-snap-type: y proximity` to the document while this
 * page is mounted — the navbar itself stays in place on scroll.
 */
export default function ApplicationsNavbar() {
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y proximity';
    return () => {
      document.documentElement.style.scrollSnapType = '';
    };
  }, []);

  return (
    <div className="absolute left-0 right-0 top-0 z-50">
      <Navbar />
    </div>
  );
}
