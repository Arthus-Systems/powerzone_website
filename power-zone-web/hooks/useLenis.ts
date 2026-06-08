"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type UseLenisOptions = {
  /** When true, Lenis intercepts touch (mobile) scroll and smooths
   *  the momentum, taming "fling" gestures that would otherwise zoom
   *  past scroll-driven animations. Off by default to keep desktop-
   *  only callers (like the products page) unaffected. */
  syncTouch?: boolean;
};

export function useLenis(options: UseLenisOptions = {}) {
  const { syncTouch = false } = options;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Mobile-touch smoothing (opt-in via the hook arg). When on,
      // Lenis lerps touch scroll position, which prevents fast
      // swipes from blasting through pinned sections (SolutionsSection
      // GSAP, GoalsSection sticky, ProcessSection sticky) faster than
      // the user can see the animations resolve.
      syncTouch,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [syncTouch]);

  return lenisRef;
}
