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
import Footer from '@/components/Footer';
import ContactFloatingCTA from '@/components/ContactFloatingCTA';

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
  // Render-gate. Until we've checked sessionStorage we don't know whether the
  // intro should play, so we paint pure black to avoid flashing the wrong state.
  const [firstVisitChecked, setFirstVisitChecked] = useState(false);
  // `introDone` is true when EITHER the user already saw the intro on this
  // session OR the cinematic has just finished — both paths converge on the
  // post-intro homepage hero.
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY) === 'true';
    if (seen) setIntroDone(true);
    setFirstVisitChecked(true);
  }, []);

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

  if (!firstVisitChecked) {
    return <div className="w-screen h-screen bg-black" />;
  }

  // First-visit path: ControlPanel owns the entire viewport, including the
  // post-intro hero overlay it fades in once the reveal completes.
  // Return-visit path (or post-intro): static hero atop the end-frame, with
  // the regular site Navbar and the downstream marketing sections.
  // ContactFloatingCTA renders unconditionally as a top-level sibling — its
  // own internal scroll-visibility gate handles when to appear.
  return (
    <>
      {!introDone ? (
        <ControlPanel onHero={handleIntroComplete} />
      ) : (
        <>
      {/* Hero + PeekProducts share a 200vh wrapper. PeekProducts is
          sticky-pinned (z-0) so it stays "behind" the hero for the full
          100vh sticky range. The hero (z-10) is absolutely positioned at
          the wrapper's top, so it scrolls upward naturally with the page,
          appearing to slide off and reveal PeekProducts. At scroll 100vh,
          PeekProducts unsticks and continues into normal flow — meaning
          the user genuinely lands ON PeekProducts (not past it) before
          scrolling further into SolutionsSection. */}
      <div className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 z-0 h-screen">
          <PeekProductsSection />
        </div>
        <div
          className="absolute inset-x-0 top-0 z-10 h-screen w-screen overflow-hidden bg-black"
        >
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
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-8 text-center"
        >
          <motion.h1
            variants={HERO_ITEM_VARIANTS}
            className="font-heading mt-5 font-semibold leading-[1.02] text-[clamp(36px,5vw,78px)] tracking-[-0.02em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
          >
            Diesel Generators
            <br />
            by Power Zone
          </motion.h1>
          <motion.p
            variants={HERO_ITEM_VARIANTS}
            className="font-tiny mt-6 md:mt-7 text-[15px] md:text-[18px] font-bold uppercase tracking-[0.34em] text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]"
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
            pointer-events-none absolute left-1/2 bottom-[clamp(40px,10vh,160px)]
            -translate-x-1/2 z-20
            w-[min(40rem,90vw)] px-6 text-center
            text-[13px] md:text-[18px] leading-relaxed text-white/75
            [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]
          "
        >
          Power Zone delivers high performance diesel generators and
          advanced battery energy storage systems, ensuring uninterrupted
          power for industries across Pakistan.
        </motion.p>
        </div>
      </div>
      <SolutionsSection />
      <GoalsSection />
      <ProcessSection />
      <Footer />
        </>
      )}
      <ContactFloatingCTA />
    </>
  );
}
