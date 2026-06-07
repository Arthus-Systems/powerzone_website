"use client";

/* -----------------------------------------------------------------------------
 * ProductsRoot
 *
 * Top-level client wrapper for the products page. Owns the category
 * state ("Generators" vs "BESS"), renders the top-center category
 * toggle, and mounts a ProductExperience for the active catalog.
 *
 * The `key={categoryId}` on ProductExperience is intentional — it
 * unmounts and remounts the experience on category change so the
 * showcase ScrollTrigger, Lenis instance, refs, and panel timeline all
 * reset cleanly. Trying to swap the products array in-place would
 * leave behind stale ScrollTriggers and pin spacers sized for the
 * previous catalog's N.
 *
 * Per-category memory: the last-viewed product index per category is
 * tracked here, so swapping from Generators → BESS → Generators lands
 * back on the same generator the user was looking at.
 *
 * Top-chrome swipe (navbar + category toggle + progress bar): handled
 * by `PhaseSwipeWrapper`, which subscribes to the `pz:phaseChange`
 * event ProductExperience emits. Each chrome element subscribes on its
 * own — ProductsRoot itself does NOT hold phase state, because a
 * re-render of ProductsRoot mid-transition causes ProductExperience to
 * re-render too, which dropped state and crashed the detail → next-
 * product handoff.
 * -------------------------------------------------------------------------- */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import {
  bessProducts,
  products as generators,
  type Product,
} from "@/data/products";
import Navbar from "./Navbar";
import ProductExperience from "./ProductExperience";
import ProductNav from "./ProductNav";
import MobileProductShowcase from "./MobileProductShowcase";

const CATEGORIES: ReadonlyArray<{
  id: string;
  label: string;
  items: Product[];
}> = [
  { id: "generators", label: "Generators", items: generators },
  { id: "bess", label: "BESS", items: bessProducts },
];

/** Wrap top-chrome elements so they animate up off-screen while the
 * user is inside a product detail layer. Each instance owns its own
 * phase state — that way none of them force ProductsRoot to re-render
 * mid-transition (re-rendering ProductsRoot also re-renders
 * ProductExperience, which corrupts the GSAP detail → showcase
 * handoff). */
function PhaseSwipeWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ phase: "showcase" | "detail" }>;
      setHidden(ce.detail?.phase === "detail");
    };
    window.addEventListener("pz:phaseChange", handler);
    return () => window.removeEventListener("pz:phaseChange", handler);
  }, []);

  return (
    <motion.div
      animate={{ y: hidden ? "-130%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Compact segmented switch sitting just below the site navbar.
 * Two pill-shaped segments — Generators / BESS — inside a frosted-dark
 * container. The active segment is filled white-on-black for a clean
 * neutral look; the inactive segment is muted-white and lights up on
 * hover.
 *
 * Switching catalogs dispatches a `pz:runCurtain` event the same way a
 * navbar link does — a directional dark curtain sweeps across the
 * screen, the catalog flips invisibly while it covers, and the curtain
 * retreats to the same edge. Direction encodes the swap:
 *   • Generators → curtain enters from the LEFT
 *   • BESS       → curtain enters from the RIGHT
 *
 * Uses the same `pz:phaseChange` listener as the navbar wrapper so it
 * slides upward off-screen with the navbar when a product card is
 * clicked (showcase → detail), and slides back into place on the way
 * back. */
function CategorySwitch({
  categoryId,
  onChange,
}: {
  categoryId: string;
  onChange: (id: string) => void;
}) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    // Below lg we render MobileProductsList instead of the cinematic
    // ProductExperience — there's no detail phase to react to, so don't
    // subscribe (and don't risk this transform hiding the switch on mobile).
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ phase: "showcase" | "detail" }>;
      setHidden(ce.detail?.phase === "detail");
    };
    window.addEventListener("pz:phaseChange", handler);
    return () => window.removeEventListener("pz:phaseChange", handler);
  }, []);

  const handleClick = (
    _e: ReactMouseEvent<HTMLButtonElement>,
    nextId: string,
  ) => {
    if (nextId === categoryId) return;
    // Direction is decided by the catalog being switched TO, not the
    // click point — so the motion stays consistent regardless of where
    // the switch sits on screen. Generators slide in from the left;
    // BESS slides in from the right.
    const from: "left" | "right" = nextId === "generators" ? "left" : "right";
    window.dispatchEvent(
      new CustomEvent("pz:runCurtain", {
        detail: {
          from,
          onCovered: () => onChange(nextId),
        },
      }),
    );
  };

  return (
    // Outer fixed wrapper positions the switch top-centered below the
    // navbar. Pointer events disabled at the wrapper so the empty side
    // area doesn't intercept clicks meant for the page underneath.
    <div className="pointer-events-none fixed left-0 right-0 top-[64px] z-[85] flex justify-center">
      <motion.div
        animate={{ y: hidden ? -160 : 0 }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-auto"
      >
        <div
          role="group"
          aria-label="Switch product category"
          className="
            flex items-center gap-1 rounded-full
            border border-white/15 bg-black/55 p-1
            shadow-[0_4px_18px_rgba(0,0,0,0.35)]
            backdrop-blur-md
          "
        >
          {CATEGORIES.map((cat) => {
            const active = cat.id === categoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => handleClick(e, cat.id)}
                aria-pressed={active}
                aria-label={`Switch to ${cat.label}`}
                className={
                  "font-tiny cursor-pointer rounded-full px-5 py-1.5 " +
                  "text-[11px] font-semibold uppercase tracking-[0.2em] " +
                  "transition-colors duration-300 " +
                  (active
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white")
                }
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export default function ProductsRoot() {
  const [categoryId, setCategoryId] = useState<string>(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];

  // Honour a `?category=bess|generators` URL param so the "Peek Our
  // Products" cards on the landing page land directly on the right
  // catalog. Read once on mount via window.location to avoid the
  // Suspense/static-rendering interactions of next/navigation's
  // useSearchParams — once mounted, the toggle button owns category state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("category");
    if (param && CATEGORIES.some((c) => c.id === param)) {
      setCategoryId(param);
    }
  }, []);

  // Per-category memory of the last-visible product index. A ref (not
  // state) so updates don't trigger a re-render of ProductsRoot — only
  // the next mount of ProductExperience reads it.
  const memoryRef = useRef<Record<string, number>>({});

  const handleActiveChange = useCallback(
    (idx: number) => {
      memoryRef.current[categoryId] = idx;
    },
    [categoryId],
  );

  const initialIdx = memoryRef.current[categoryId] ?? 0;

  return (
    <>
      {/* ── Site-wide nav ─────────────────────────────────────────────── */}
      {/* On the products page the showcase is GSAP-pinned, so a page-
       * relative (absolute) nav would scroll away the moment the wipe
       * starts. We pin it to the viewport here, and the swipe wrapper
       * lifts it off-screen while the user is inside a product detail
       * layer. */}
      <PhaseSwipeWrapper className="fixed left-0 right-0 top-0 z-[90]">
        <Navbar />
      </PhaseSwipeWrapper>

      {/* Category switch sits just below the navbar (top-centered) and
       * follows the navbar's slide-off on entering a product detail view.
       * Replaces the old bottom-right "View BESS"/"View Generators" pill. */}
      <CategorySwitch
        categoryId={categoryId}
        onChange={setCategoryId}
      />

      {/* Desktop (lg+) — the cinematic, wheel-driven split-screen showcase
       * plus the GSAP horizontal-scroll detail layer. Wrapped in a
       * `hidden lg:block` so it never mounts on touch viewports (where
       * the wheel choreography is hostile to use). ProductNav is folded
       * into the same wrapper because it's coupled to the showcase. */}
      <div className="hidden lg:block">
        {/* Brand quick-links — keyed on category so the buttons re-mount
         * when the active catalog changes. ProductNav handles its own
         * phase-driven swipe internally so it doesn't need a wrapper. */}
        <ProductNav key={`nav-${categoryId}`} products={active.items} />

        <ProductExperience
          key={categoryId}
          products={active.items}
          initialIdx={initialIdx}
          onActiveChange={handleActiveChange}
        />
      </div>

      {/* Mobile (<lg) — the rotated cinematic. Photo on top, ProductCard
       * centered, description on bottom; scrolling wipes photo+card from
       * the LEFT while the description wipes from the RIGHT, revealing
       * the next product underneath. Click into a product opens the
       * MobileProductDetail overlay, which slides in from the right
       * using the same rotated clip-path trick. */}
      <div className="lg:hidden">
        <MobileProductShowcase
          key={`mobile-${categoryId}`}
          products={active.items}
          initialIdx={initialIdx}
          onActiveChange={handleActiveChange}
        />
      </div>
    </>
  );
}
