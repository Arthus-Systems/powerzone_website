"use client";

/* -----------------------------------------------------------------------------
 * MobileProductShowcase — mobile-rotated mirror of the desktop ProductExperience
 * showcase (cinematic split-screen + center card + scroll-driven wipe).
 *
 * Desktop layout (for reference):
 *   ┌──────────────────────────────────────┐
 *   │       │              │               │
 *   │ Photo │  ProductCard │  Description  │   ← left | center | right
 *   │ (left)│   (center)   │    (right)    │
 *   │       │              │               │
 *   └──────────────────────────────────────┘
 *   Scroll wipes photo+card upward (clip from bottom) and description
 *   downward (clip from top), revealing the next product underneath.
 *
 * Mobile layout (this component):
 *   ┌──────────────────────┐
 *   │        Photo         │  ← TOP
 *   ├──────────────────────┤
 *   │     ProductCard      │  ← CENTER (overlaps the seam)
 *   ├──────────────────────┤
 *   │     Description      │  ← BOTTOM
 *   └──────────────────────┘
 *   Scroll wipes photo+card leftward (clip from LEFT — left edge advances)
 *   and description rightward (clip from RIGHT — right edge advances),
 *   revealing the next product underneath.
 *
 * Clip-path mapping (desktop → mobile is essentially a 90° CCW rotation):
 *   Desktop left (photo)        : inset(0% 0% pct% 0%)  → wipe from bottom
 *   Mobile  top   (photo)       : inset(0% 0% 0% pct%)  → wipe from left
 *   Desktop right (description) : inset(pct% 0% 0% 0%)  → wipe from top
 *   Mobile  bottom (description): inset(0% pct% 0% 0%)  → wipe from right
 *   Desktop center card         : inset(0% 0% pct% 0%)
 *   Mobile  center card         : inset(0% 0% 0% pct%)  → wipes with the photo
 *
 * Reuses ImageReel + SpecReel + ProductCard components unchanged — they each
 * render stacked absolute-positioned panels filling their parent. The mobile
 * layout differs only in WHERE each reel is positioned (top/bottom halves
 * vs left/right halves) and the clip-path math inside this file's
 * setupShowcase onUpdate.
 *
 * Click-into-detail: the active product card opens a full-screen overlay
 * (MobileProductDetail) using the same rotated clip-path trick — the
 * overlay slides in from the right while the card wipes off to the left
 * via the same `inset(0% 0% 0% pct%)` mechanism the showcase uses.
 *
 * No Lenis here — mobile uses native scroll. ScrollTrigger picks up window
 * scroll events natively without the Lenis ticker wiring.
 * -------------------------------------------------------------------------- */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/data/products";
import ImageReel from "./ImageReel";
import SpecReel from "./SpecReel";
import ProductCard from "./ProductCard";
import MobileProductDetail from "./MobileProductDetail";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Less vertical scroll per product on mobile so phones with short touch-
// scroll affordance can still traverse the catalog quickly. Desktop uses
// 220vh per transition; mobile feels better at ~140vh.
const SHOWCASE_TRANSITION_VH = 140;
const SHOWCASE_CYCLES = 30;
const SHOWCASE_ST_ID = "pz-mobile-showcase";

type Props = {
  products: Product[];
  initialIdx?: number;
  onActiveChange?: (idx: number) => void;
};

export default function MobileProductShowcase({
  products,
  initialIdx = 0,
  onActiveChange,
}: Props) {
  const N = products.length;
  const safeInitialIdx = Math.min(Math.max(initialIdx, 0), N - 1);

  const [currentVisibleIdx, setCurrentVisibleIdx] = useState(safeInitialIdx);
  const currentVisibleIdxRef = useRef(safeInitialIdx);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const showcasePinRef = useRef<HTMLDivElement | null>(null);
  const topPanelsRef = useRef<(HTMLElement | null)[]>([]);
  const bottomPanelsRef = useRef<(HTMLElement | null)[]>([]);
  const cardPanelsRef = useRef<(HTMLElement | null)[]>([]);

  // Append the first product again so the modular wrap visually returns to
  // product 0 at the end of a cycle without a discontinuity.
  const displayProducts = [...products, products[0]];

  const setupShowcase = useCallback(() => {
    ScrollTrigger.getById(SHOWCASE_ST_ID)?.kill();

    const totalTransitions = N * SHOWCASE_CYCLES;
    const totalVH = totalTransitions * SHOWCASE_TRANSITION_VH;

    const allPanels = [
      ...topPanelsRef.current,
      ...bottomPanelsRef.current,
      ...cardPanelsRef.current,
    ].filter((el): el is HTMLElement => el !== null);
    gsap.set(allPanels, { clipPath: "inset(0% 0% 0% 0%)" });

    ScrollTrigger.create({
      id: SHOWCASE_ST_ID,
      trigger: showcasePinRef.current,
      start: "top top",
      end: () =>
        `+=${(totalVH * window.innerHeight) / 100}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (N * SHOWCASE_CYCLES),
        duration: { min: 0.3, max: 0.8 },
        ease: "power2.inOut",
        delay: 0.12,
        directional: false,
      },
      onUpdate: (self) => {
        const t = self.progress * totalTransitions;
        const cyclePos = ((t % N) + N) % N;

        for (let i = 0; i < N; i++) {
          const localProgress = Math.max(0, Math.min(1, cyclePos - i));
          let pct = localProgress * 100;
          if (pct > 99.5) pct = 100;
          else if (pct < 0.5) pct = 0;

          // MOBILE-ROTATED clip-paths:
          //   top    panel (photo)       — wipe from LEFT
          //   bottom panel (description) — wipe from RIGHT
          //   center panel (card)        — wipe from LEFT (synced with photo)
          const topPanel = topPanelsRef.current[i];
          if (topPanel) {
            topPanel.style.clipPath = `inset(0% 0% 0% ${pct}%)`;
          }
          const bottomPanel = bottomPanelsRef.current[i];
          if (bottomPanel) {
            bottomPanel.style.clipPath = `inset(0% ${pct}% 0% 0%)`;
          }
          const cardPanel = cardPanelsRef.current[i];
          if (cardPanel) {
            cardPanel.style.clipPath = `inset(0% 0% 0% ${pct}%)`;
          }
        }

        const visibleIdx = Math.round(cyclePos) % N;
        if (visibleIdx !== currentVisibleIdxRef.current) {
          currentVisibleIdxRef.current = visibleIdx;
          setCurrentVisibleIdx(visibleIdx);
        }
      },
    });
  }, [N]);

  // INITIAL MOUNT — set up the ScrollTrigger, then scroll to the middle of
  // the modular wrap so the user can traverse the catalog in both
  // directions before hitting an edge.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      setupShowcase();

      requestAnimationFrame(() => {
        const st = ScrollTrigger.getById(SHOWCASE_ST_ID);
        if (!st) return;
        const totalTransitions = N * SHOWCASE_CYCLES;
        const initialT =
          Math.floor(SHOWCASE_CYCLES / 2) * N + safeInitialIdx;
        const targetProgress = initialT / totalTransitions;
        const targetScroll =
          st.start + targetProgress * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: "auto" });
      });
    }, containerRef);

    return () => {
      ScrollTrigger.getById(SHOWCASE_ST_ID)?.kill();
      ctx.revert();
    };
  }, [setupShowcase, N, safeInitialIdx]);

  // Notify the parent every time the visible product changes so it can
  // persist a per-category memory across category switches.
  useEffect(() => {
    onActiveChange?.(currentVisibleIdx);
  }, [currentVisibleIdx, onActiveChange]);

  // Card click → open the rotated-cinematic detail overlay for the
  // currently-visible product. The overlay handles its own slide-in
  // animation (clip-path from the right edge) so the visual handoff
  // mirrors what the desktop ProductExperience does (from the bottom).
  const handleCardClick = useCallback((idx: number) => {
    setDetailIdx(idx);
  }, []);

  const handleDetailClose = useCallback(() => {
    setDetailIdx(null);
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="lg:hidden relative w-screen overflow-hidden"
        style={{ backgroundColor: "#EFEAE0" }}
      >
        <section
          ref={showcasePinRef}
          className="relative h-screen w-full overflow-hidden"
        >
          {/* TOP HALF — Photo (ImageReel reused as-is; positioned to
              cover the top 45% of the viewport instead of the desktop
              left half). */}
          <div className="absolute inset-x-0 top-0 h-[45%] overflow-hidden">
            <ImageReel
              products={displayProducts}
              panelRefs={topPanelsRef}
            />
          </div>

          {/* BOTTOM HALF — Description (SpecReel reused as-is; covers
              the bottom 55% of the viewport instead of the desktop right
              half). The internal pt-[18vh] in SpecReel is relative to
              this container, not the full viewport. */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
            <SpecReel
              products={displayProducts}
              panelRefs={bottomPanelsRef}
            />
          </div>

          {/* CENTER — ProductCard, sitting on the seam between top and
              bottom halves. ProductCard's own w-[58vw] sizing makes it
              fit a phone width comfortably. */}
          <div className="pointer-events-auto absolute left-1/2 top-[45%] z-30 -translate-x-1/2 -translate-y-1/2">
            <ProductCard
              products={displayProducts}
              panelRefs={cardPanelsRef}
              currentIndex={currentVisibleIdx}
              onCardClick={handleCardClick}
            />
          </div>
        </section>
      </div>

      {/* Click-into-detail overlay. Mounted only when a card click happens. */}
      {detailIdx !== null && (
        <MobileProductDetail
          product={products[detailIdx]}
          onClose={handleDetailClose}
        />
      )}
    </>
  );
}
