'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ───────────────────────────────────────────────────────────────────────────
// SOLUTION CARDS — portrait coverflow carousel slides
// ───────────────────────────────────────────────────────────────────────────
type SolutionCardData = {
  title: string;
  description: string;
};

const SOLUTION_CARDS: SolutionCardData[] = [
  {
    title: 'Engineered for Reliability',
    description:
      "Whether it's our rugged diesel generators or our industrial-grade battery systems, every Power Zone solution is built for long-term durability and high uptime — even in extreme conditions.",
  },
  {
    title: 'Stable, High Quality Power',
    description:
      'Power Zone delivers consistent power output — with stable frequency and voltage — through both gensets and advanced BESS solutions, ideal for mission-critical applications like hospitals, telecom, and data centers.',
  },
  {
    title: 'Rapid Response Startup',
    description:
      'Our diesel gensets and BESS systems are equipped with smart auto-start and synchronization capabilities, ensuring fast backup power during outages or grid instability — minimizing operational disruption.',
  },
  {
    title: 'Real Bill Savings',
    description:
      'Fuel-efficient engines, smart battery dispatch, and optimized maintenance cycles make Power Zone systems cost-effective. Our hybrid setups help reduce fuel consumption and extend generator life, cutting your energy expenses over time.',
  },
];

// ───────────────────────────────────────────────────────────────────────────
// CAROUSEL TUNING
// ───────────────────────────────────────────────────────────────────────────
//
// The carousel runs through (N + 1) transitions:
//   state 0     → cards off-screen right (initial, just after image zoom-in)
//   state 1..N  → each card centred in turn
//   state N+1   → cards off-screen left (exit, then section unpins)
//
// `STATE_VH` is how many viewport-heights of scroll each transition
// consumes. Section height = 100vh (entry) + STATE_VH * (N+1)vh
// (carousel). Bumped to slow the snap pace down — at the previous
// 35vh the cards flicked past the centre too quickly to read.
const STATE_VH = 65;

// Coverflow scale curve. `SCALE_DROP_PER_CARD_WIDTH` is how much scale
// is subtracted for each card-width of distance from viewport centre.
// `MIN_SCALE` clamps the smallest visible card (state ±2).
const SCALE_DROP_PER_CARD_WIDTH = 0.13;
const MIN_SCALE = 0.55;

export default function SolutionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const N = SOLUTION_CARDS.length;

      // ─── Phase 1: zoom-in entry — image, overlay, header, and the
      // carousel track all scrub in together from `top bottom → top top`.
      // Use fromTo so the scrub has an explicit start value regardless
      // of when GSAP first samples the element.
      const entryTrigger = {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.6,
      } as const;

      gsap.fromTo(
        bgImageRef.current,
        { scale: 0, opacity: 1, transformOrigin: 'center center' },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: entryTrigger,
        },
      );
      // Overlay no longer scrubs independently — it lives INSIDE the
      // image div now so it scales with the picture. Outside the
      // growing image, the cream surface stays untouched (no more
      // shadow tint over where the image will eventually sit).
      gsap.fromTo(
        headerRef.current,
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: entryTrigger,
        },
      );
      gsap.fromTo(
        trackRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.out', scrollTrigger: entryTrigger },
      );

      // ─── Phase 2: coverflow carousel, scroll-driven, snap-stopped.
      //
      // We deliberately AVOID GSAP `pin: true` here. Pin wraps the
      // section in a spacer div which React doesn't know about, and on
      // navigation it causes a "Failed to execute 'removeChild' on
      // 'Node': The node to be removed is not a child of this node"
      // error. Instead the section uses plain CSS `position: sticky`
      // for the inner pane and we use ScrollTrigger purely for the
      // snap + per-frame `onUpdate` that drives translation & scale.
      let positions: number[] = [];

      const measure = () => {
        const track = trackRef.current;
        if (!track) return;
        const cards = track.querySelectorAll<HTMLElement>('.pz-sol-card');
        if (cards.length < 1) return;

        const cardW = cards[0].offsetWidth;
        const gap =
          cards.length > 1
            ? cards[1].offsetLeft - (cards[0].offsetLeft + cardW)
            : 0;
        const vw = window.innerWidth;

        // Padding so the FIRST card sits just past the right edge of
        // the viewport when track translateX is 0 — the user sees an
        // empty carousel area until they scroll, at which point card 0
        // slides in from the right.
        track.style.paddingLeft = `${vw}px`;
        track.style.paddingRight = `${vw}px`;

        // X positions (positive numbers — we apply them as `x: -X`).
        //   state 0           : track at 0           → cards off-screen right
        //   state 1..N        : card i-1 centred
        //   state N+1 (exit)  : last card just off-screen left
        positions = [0];
        const X_0 = vw / 2 + cardW / 2; // X that lands card 0 in centre
        for (let i = 0; i < N; i++) {
          positions.push(X_0 + i * (cardW + gap));
        }
        positions.push(vw + (N - 1) * (cardW + gap) + cardW);
      };

      measure();

      // Per-frame: translate the track AND apply coverflow scale to
      // every card based on its visual distance from the viewport
      // centre. Center card → scale 1, ±1 → ~0.87, ±2 → ~0.74.
      let lastProgress = 0;
      const updateVisual = (progress: number) => {
        lastProgress = progress;
        // Bail-out guard at the top — ScrollTrigger can fire one last
        // onUpdate during a page navigation, after React has nulled
        // the ref but before ctx.revert() has killed the trigger.
        // Without this, gsap.set(null, …) throws "GSAP target null
        // not found" into the console on every cross-page click.
        const track = trackRef.current;
        if (!track) return;

        const t = progress * (N + 1); // 0 → N+1
        const i = Math.min(Math.floor(t), N);
        const f = t - i;
        const startX = positions[i] ?? 0;
        const endX = positions[i + 1] ?? startX;
        const x = startX + (endX - startX) * f;
        gsap.set(track, { x: -x });

        const vwCenter = window.innerWidth / 2;
        const cards = track.querySelectorAll<HTMLElement>('.pz-sol-card');
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const baseW = card.offsetWidth || 1;
          const normDist = Math.abs(cardCenter - vwCenter) / baseW;
          const scale = Math.max(
            MIN_SCALE,
            1 - normDist * SCALE_DROP_PER_CARD_WIDTH,
          );
          gsap.set(card, {
            scale,
            transformOrigin: 'center center',
            force3D: true,
          });
        });
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        snap: {
          snapTo: 1 / (N + 1),
          duration: { min: 0.25, max: 0.6 },
          delay: 0.08,
          ease: 'power2.inOut',
        },
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          // Re-paint the current state so the carousel doesn't briefly
          // desync from the new card dimensions after a resize.
          updateVisual(lastProgress);
        },
        onUpdate: (self) => updateVisual(self.progress),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#F4EFE7]"
      // Section height = 100vh (entry runway, image zoom-in) +
      //                  STATE_VH * (N+1) (sticky carousel duration).
      // With STATE_VH=35 and N=4 the section is 275vh tall, of which
      // the inner pane is sticky for 175vh.
      style={{
        height: `${100 + STATE_VH * (SOLUTION_CARDS.length + 1)}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Background image — initial state (scale 0) set inline so
         * SSR / first paint doesn't flash the full image before the
         * entry tween takes over. The dark legibility overlay lives
         * INSIDE this div so it scales with the image — without that
         * nesting, an overlay at z-0 inset-0 would tint the whole
         * cream surface during the zoom-in, creating a "shadow"
         * shaped like the future image bounds. */}
        <div
          ref={bgImageRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url('/images/background.webp')",
            transform: 'scale(0)',
            transformOrigin: 'center center',
          }}
        >
          <div
            ref={bgOverlayRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/45"
          />
        </div>

        {/* Section header — scales in alongside the image. */}
        <div
          ref={headerRef}
          className="absolute inset-x-0 top-0 z-20 px-8 pt-[clamp(48px,7vh,96px)] pb-[clamp(8px,2vh,24px)] text-center will-change-transform"
          style={{
            transform: 'scale(0)',
            transformOrigin: 'center center',
            opacity: 0,
          }}
        >
          <p className="font-tiny text-[clamp(16px,1.9vh,20px)] font-medium uppercase tracking-[0.32em] text-white">
            Why Power Zone
          </p>
          <h2 className="font-heading mt-[clamp(8px,1.8vh,18px)] text-[clamp(29px,4.8vh,62px)] font-semibold leading-[1.05] tracking-tight text-white">
            What sets Power Zone&apos;s
            <br />
            Solutions Apart?
          </h2>
        </div>

        {/* Carousel viewport. Track has `100vw` padding on each side so
         * the cards start off-screen right at x=0 and finish off-screen
         * left at x=-positions[N+1]. */}
        <div className="absolute inset-x-0 bottom-0 top-[clamp(180px,28vh,280px)] z-10 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-[clamp(14px,2.4vw,40px)] will-change-transform"
            style={{
              opacity: 0,
              paddingLeft: '100vw',
              paddingRight: '100vw',
            }}
          >
            {SOLUTION_CARDS.map((card, i) => (
              <article
                key={card.title}
                /* Mobile (<sm): cap width at 78vw so a 375px phone's card
                   stays comfortably inside the viewport (the GSAP track
                   measures cards[0].offsetWidth at runtime so the
                   centring math automatically adapts to the smaller
                   size). Height shrinks too so the card still feels
                   proportional, not stretched.
                   sm+: original clamp values — desktop look unchanged. */
                className="pz-sol-card relative flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_10px_30px_-10px_rgba(0,0,0,0.4),0_0_60px_-15px_rgba(220,38,38,0.18)] w-[clamp(240px,78vw,300px)] h-[clamp(360px,52vh,440px)] sm:w-[clamp(280px,25vw,460px)] sm:h-[clamp(440px,55vh,720px)]"
              >
                <div className="flex h-full flex-col p-5 sm:p-[clamp(26px,3.6vh,52px)]">
                  {/* Counter pill at the top */}
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="h-px w-10 bg-red-600 sm:w-14" />
                    <span className="font-tiny text-[10px] uppercase tracking-[0.3em] text-red-600 sm:text-[12px] sm:tracking-[0.32em]">
                      {String(i + 1).padStart(2, '0')} /{' '}
                      {String(SOLUTION_CARDS.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title — sized smaller on mobile so it doesn't crowd
                      the narrower card. */}
                  <h3 className="font-heading mt-4 font-bold uppercase leading-[1.06] tracking-tight text-black text-[20px] sm:mt-[clamp(24px,3.6vh,48px)] sm:text-[clamp(28px,3.8vh,44px)]">
                    {card.title}
                  </h3>

                  {/* Description — readable on mobile, full size on sm+. */}
                  <p className="font-body mt-3 text-[13px] leading-relaxed text-black/72 sm:mt-[clamp(18px,3.6vh,32px)] sm:text-[clamp(17px,2.2vh,21px)]">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
