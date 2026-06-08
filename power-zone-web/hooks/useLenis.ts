"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type UseLenisOptions = {
  /** When true, Lenis intercepts touch scrolls and lerps them. Combined
   *  with a small `touchMultiplier`, this CAPS the max velocity of a
   *  fast mobile swipe — slow scrolls catch up to their tiny target
   *  instantly while fast scrolls glide-in over the lerp window. */
  syncTouch?: boolean;
  /** Multiplier on touch-input scroll distance. <1 reduces the pixel
   *  distance per swipe (effectively a velocity cap), 1 = native. */
  touchMultiplier?: number;
  /** Touch lerp factor. Lower = heavier dampening on fast swipes. */
  syncTouchLerp?: number;
};

export function useLenis(options: UseLenisOptions = {}) {
  const {
    syncTouch = false,
    touchMultiplier = 1,
    syncTouchLerp = 0.075,
  } = options;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch,
      syncTouchLerp,
      touchMultiplier,
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
  }, [syncTouch, touchMultiplier, syncTouchLerp]);

  return lenisRef;
}
