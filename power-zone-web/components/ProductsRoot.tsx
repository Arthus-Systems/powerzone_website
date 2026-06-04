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

/** Discreet "switch to the other catalog" affordance. Renders as a
 * thin mono-spaced label in the bottom-right corner, much quieter
 * than the old top-center pill. Clicking it plays the same radial
 * transition a CTA button does (via the imperative API
 * `GlobalTransitions` registers on `window.__pzRadial`), so the
 * catalog swap feels like a page navigation rather than an in-place
 * toggle. The radial fully covers the screen at the moment we flip
 * `categoryId`, so the showcase's GSAP teardown/rebuild happens out
 * of sight. */
function CategoryToggle({
  categoryId,
  onChange,
}: {
  categoryId: string;
  onChange: (id: string) => void;
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

  const other = CATEGORIES.find((c) => c.id !== categoryId) ?? CATEGORIES[1];

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    // Hand off to GlobalTransitions via custom event. It plays the
    // same radial reveal a CTA navigation would and calls back at
    // peak coverage so we can flip the category invisibly.
    window.dispatchEvent(
      new CustomEvent("pz:runRadial", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          onCovered: () => onChange(other.id),
        },
      }),
    );
  };

  const label = `View ${other.label}`;

  return (
    <motion.div
      animate={{ y: hidden ? "100vh" : "0%" }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      className="fixed bottom-[clamp(20px,3vh,40px)] right-[clamp(20px,3vw,48px)] z-40 text-black"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Switch to ${other.label}`}
        className="!font-tiny group relative inline-flex items-center cursor-pointer overflow-hidden rounded-full ring-1 ring-inset ring-current bg-transparent pl-9 pr-7 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] no-underline"
      >
        {/* Brand-red dot — idle bullet, expands to full pill on hover. */}
        <span
          aria-hidden
          className="
            pointer-events-none absolute left-3 top-1/2 z-10
            h-2 w-2 -translate-y-1/2 rounded-full
            bg-[#e8302a]
            transition-all duration-300 ease-out
            group-hover:left-0 group-hover:top-0
            group-hover:h-full group-hover:w-full
            group-hover:translate-y-0
          "
        />

        {/* Resting label — slides out + fades on hover. */}
        <span
          className="
            relative z-20 inline-block
            transition-all duration-300 ease-out
            group-hover:translate-x-12 group-hover:opacity-0
          "
        >
          {label}
        </span>

        {/* Hover label + arrow — flies in from the right. */}
        <span
          className="
            pointer-events-none absolute inset-0 z-20
            flex items-center justify-center gap-2
            translate-x-12 opacity-0 text-white
            transition-all duration-300 ease-out
            group-hover:translate-x-0 group-hover:opacity-100
          "
        >
          <span>{label}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0"
            aria-hidden
          >
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </motion.div>
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

      {/* Bottom-left category toggle. Styled as a full InteractiveHover
       * pill (matches the contact page's "Send Message" CTA), pinned to
       * the viewport bottom-left via fixed positioning. z-40 keeps it
       * below the page-transition radial curtain. `mix-blend-difference`
       * on the wrapper inverts the white ring/text against whatever
       * product accent color is currently behind it.
       *
       * Hides during the detail phase by sliding DOWN (`+100vh`) since
       * the toggle is anchored to the bottom edge — sliding up would
       * leave it visible mid-viewport. */}
      <CategoryToggle
        categoryId={categoryId}
        onChange={setCategoryId}
      />

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
    </>
  );
}
