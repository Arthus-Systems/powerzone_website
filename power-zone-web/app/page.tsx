'use client';

/* -----------------------------------------------------------------------------
 * Home — landing page.
 *
 * The intro is fully owned by <ControlPanel/> (state machine, value ramp, video,
 * camera push, hero overlay — all internal). The only thing this page does is:
 *   1. Render the intro on first visit, the static post-intro homepage afterwards.
 *   2. Persist a sessionStorage flag so the cinematic doesn't replay when the
 *      user navigates back from /products etc.
 * -------------------------------------------------------------------------- */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ControlPanel from '@/components/ControlPanel';
import SolutionsSection from '@/components/SolutionsSection';
import GoalsSection from '@/components/GoalsSection';
import ProcessSection from '@/components/ProcessSection';
import PeekProductsSection from '@/components/PeekProductsSection';
import CustomerLogos from '@/components/CustomerLogos';
import Footer from '@/components/Footer';
import ContactFloatingCTA from '@/components/ContactFloatingCTA';
import { useLenis } from '@/hooks/useLenis';

// Pre-rendered final frame of /poweron.mp4 — painted as the hero
// background for return visits that skip the intro.
const INTRO_END_FRAME = '/poweron_final_frame.webp';
const INTRO_SEEN_KEY = 'pz:introSeen';

const HERO_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.5 },
  },
};

const HERO_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Home() {
  // Lenis on the homepage — tuned to CAP MAX SCROLL VELOCITY without
  // over-throttling. Previous syncTouchLerp:0.06 + touchMultiplier:0.85
  // felt sluggish on a normal scroll. New values let normal scrolls
  // feel near-native while still dampening fast flings:
  //   - syncTouchLerp:0.12 → catches up roughly 2× faster than 0.06
  //   - touchMultiplier:0.95 → only ~5% reduction from native distance
  useLenis({ syncTouch: true, syncTouchLerp: 0.12, touchMultiplier: 0.95 });

  // `introDone` defaults to TRUE so the server renders the post-intro hero
  // (real marketing copy in the SSR HTML — SEO, view-source, no-JS users).
  // The fresh-desktop-visit case flips it to false in useEffect below, which
  // mounts the cinematic ControlPanel. The .pz-init-overlay rendered at the
  // bottom of this return masks the brief gap between hydration and that
  // decision so the user never perceives the hero before the cinematic.
  const [introDone, setIntroDone] = useState(true);
  // Drives the JS-fast-fade of the init overlay. The overlay's CSS has a
  // safety-net keyframe so it always disappears even if this state never
  // flips (e.g. JS error); when this flag goes true the overlay fades in
  // ~350ms instead of waiting for the 1500ms safety delay.
  const [overlayHiding, setOverlayHiding] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
    // Mobile + tablet (<lg) bypass the cinematic — ControlPanel was
    // designed at 16:9 with mouse-driven interactions and doesn't
    // translate well to phones. Mobile users land straight on the hero.
    const isMobile = window.innerWidth < 1024;

    if (!seen && !isMobile) {
      setIntroDone(false);
    } else {
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
      } catch {
        /* sessionStorage unavailable — non-fatal */
      }
    }

    requestAnimationFrame(() => setOverlayHiding(true));
  }, []);

  // NO scroll-snap on the homepage. The previous `scroll-snap-type:
  // y proximity` + `scrollSnapAlign: 'start'` on GoalsSection and
  // ProcessSection was the root of the "jittery / laggy scroll from
  // GoalsSection to Footer" complaint — entering either of those
  // sticky-pin sections, the browser would fight the user's scroll
  // input trying to snap the section's start to viewport top,
  // producing stop-go stutter. With snap disabled at the document
  // level, the per-section scrollSnapAlign declarations no-op and
  // scroll feels natural.

  // Called by ControlPanel once it lands on phase==='hero'. We stamp
  // sessionStorage so any subsequent navigation back to / skips the intro.
  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      /* sessionStorage unavailable — non-fatal */
    }
    setIntroDone(true);
  };

  // First-visit (desktop) path: ControlPanel owns the entire viewport,
  // including the post-intro hero overlay it fades in once the reveal
  // completes. Other paths: static hero atop the end-frame, with the
  // regular site Navbar and the downstream marketing sections.
  // ContactFloatingCTA renders unconditionally as a top-level sibling — its
  // own internal scroll-visibility gate handles when to appear.
  return (
    <>
      {!introDone ? (
        <ControlPanel onHero={handleIntroComplete} />
      ) : (
        <>
      {/* Hero → CustomerLogos slide-up cinematic. Same pattern on all
          breakpoints but the wrapper HEIGHT differs:
            mobile  (<md): h-[200vh] → no dwell — hero reveals
                            CustomerLogos in 100vh, then 100vh of un-stick
                            so PeekProducts arrives immediately after.
            desktop (md+): h-[280vh] → 80vh dwell on CustomerLogos
                            sandwiched between the reveal and the un-stick.

          Desktop budget:
            0   →100vh : hero scrolls up, CustomerLogos is revealed
            100→180vh : DWELL — CustomerLogos pinned, nothing else moves
            180→280vh : CustomerLogos un-sticks; PeekProducts enters
          Mobile budget:
            0   →100vh : hero scrolls up, CustomerLogos is revealed
            100→200vh : CustomerLogos un-sticks; PeekProducts enters
                         (no scroll-break / dwell — per design ask) */}
      <div className="relative h-[200vh] md:h-[280vh]">
        <div className="sticky top-0 z-0 h-screen">
          <CustomerLogos />
        </div>
        <div className="absolute inset-x-0 top-0 z-10 h-screen w-screen overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={INTRO_END_FRAME}
            alt=""
            draggable={false}
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={{ opacity: 0.6 }}
          />

          <motion.div
            initial={{ opacity: 0, y: -48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-0 z-[90]"
          >
            <Navbar />
          </motion.div>

          <motion.div
            variants={HERO_CONTAINER_VARIANTS}
            initial="hidden"
            animate="show"
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center md:px-8"
          >
            <motion.h1
              variants={HERO_ITEM_VARIANTS}
              className="font-heading mt-5 font-semibold leading-[1.05] text-[clamp(40px,11vw,72px)] tracking-[-0.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] md:leading-[1.02] md:text-[clamp(36px,5vw,78px)]"
            >
              Diesel Generators
              <br />
              by Power Zone
            </motion.h1>
            <motion.p
              variants={HERO_ITEM_VARIANTS}
              className="font-tiny mt-5 text-[12px] font-bold uppercase tracking-[0.28em] text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)] sm:text-[14px] md:mt-7 md:text-[18px] md:tracking-[0.34em]"
            >
              Reliable Backup Power
            </motion.p>
          </motion.div>

          {/* Floor-anchored body paragraph — pinned near the bottom edge. */}
          <motion.p
            variants={HERO_ITEM_VARIANTS}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.95 }}
            className="
              font-body
              pointer-events-none absolute left-1/2 bottom-[clamp(32px,8vh,96px)]
              -translate-x-1/2 z-20
              w-[min(36rem,92vw)] px-4 text-center
              text-[12px] leading-relaxed text-white/75
              [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]
              sm:text-[14px]
              md:w-[min(40rem,90vw)] md:bottom-[clamp(40px,10vh,160px)] md:px-6 md:text-[18px]
            "
          >
            Power Zone delivers high performance diesel generators and
            advanced battery energy storage systems, ensuring uninterrupted
            power for industries across Pakistan.
          </motion.p>
        </div>
      </div>
      {/* PeekProductsSection enters in normal flow after the cinematic
          wrapper above. Same on mobile + desktop. */}
      <PeekProductsSection />
      <SolutionsSection />
      <GoalsSection />
      <ProcessSection />
      <Footer />
        </>
      )}
      <ContactFloatingCTA />

      {/* SSR-side mask. Lives in the HTML so a fresh desktop visitor never
          sees the hero "leak through" between hydration and the moment
          ControlPanel mounts — the overlay covers everything until the
          useEffect above has decided which branch to show. Has a CSS
          safety-net keyframe (see globals.css .pz-init-overlay) so it
          dissolves even if this state setter never fires. aria-hidden +
          inert so it never traps focus or screen readers even at opacity 1. */}
      <div
        aria-hidden
        className={`pz-init-overlay${overlayHiding ? ' is-hiding' : ''}`}
      />
    </>
  );
}
