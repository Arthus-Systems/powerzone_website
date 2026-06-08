"use client";

/* -----------------------------------------------------------------------------
 * MobileProductDetail — full-screen product detail overlay for the mobile
 * showcase. Renders the same content the desktop detail layer shows (image,
 * title, story, engineering, capabilities, applications, external CTA)
 * stacked vertically for a phone aspect.
 *
 * Entry / exit animations use the same rotated clip-path trick as the
 * showcase. Desktop enterDetail wipes the showcase card BOTTOM-UP via
 * clip-path inset(0% 0% pct% 0%) and reveals the detail layer from the
 * opposite edge; here the overlay wipes IN from the RIGHT via
 * clip-path inset(0% 0% 0% pct%) (pct: 100 → 0) and OUT in reverse
 * (pct: 0 → 100). Conceptually a 90° CCW rotation of the desktop trick.
 *
 * The "back to showcase" button + browser back button + Escape key all
 * trigger the same exit animation. No Lenis — native scroll within the
 * overlay panel.
 * -------------------------------------------------------------------------- */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { textOn } from "@/data/products";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

type Props = {
  product: Product;
  onClose: () => void;
};

const ENTRY_DURATION_MS = 520;

export default function MobileProductDetail({ product, onClose }: Props) {
  // entry state machine:
  //   "entering" → CSS transitions clip-path from inset-100%-left to 0
  //   "open"     → fully visible, scrollable
  //   "exiting"  → CSS transitions clip-path back to 100% before unmount
  const [phase, setPhase] = useState<"entering" | "open" | "exiting">(
    "entering",
  );
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  // Trigger the entry animation on next frame (clip-path needs to be
  // observed at initial value, then transitioned to the open value).
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("open"));
    });

    // Lock body scroll while the overlay is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Push a history entry so the browser back button maps to "close
  // overlay" instead of leaving /products.
  useEffect(() => {
    try {
      window.history.pushState({ pz: "mobile-detail" }, "");
    } catch {
      /* SSR or restricted iframe — non-fatal */
    }
    const onPop = () => triggerExit();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerExit = useCallback(() => {
    setPhase("exiting");
    window.setTimeout(() => {
      onClose();
    }, ENTRY_DURATION_MS);
  }, [onClose]);

  // Clip-path per phase. The mobile-rotated trick: wipe in from the
  // RIGHT edge (clip-path inset starts with 100% from left → reduces to
  // 0). On exit it transitions back to 100% from left, sliding the
  // overlay off to the right.
  const clipPath =
    phase === "entering"
      ? "inset(0% 0% 0% 100%)"
      : phase === "exiting"
        ? "inset(0% 0% 0% 100%)"
        : "inset(0% 0% 0% 0%)";

  const fg = textOn(product.descriptionBgColor);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} details`}
      className="lg:hidden fixed inset-0 z-[200] overflow-y-auto"
      style={{
        backgroundColor: product.descriptionBgColor,
        color: fg,
        clipPath,
        transition: `clip-path ${ENTRY_DURATION_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      }}
    >
      {/* Top bar — Back affordance (same rotation: slides off to right
          when the overlay exits). */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 backdrop-blur-md"
        style={{ backgroundColor: `${product.descriptionBgColor}cc` }}
      >
        <button
          type="button"
          onClick={triggerExit}
          aria-label="Back to products"
          className="font-tiny inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: fg }}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M13 8H3" />
            <path d="M7 4 3 8l4 4" />
          </svg>
          Back
        </button>
        <span
          className="font-tiny text-[10px] uppercase tracking-[0.3em]"
          style={{ color: fg, opacity: 0.6 }}
        >
          {product.origin}
        </span>
      </div>

      {/* Hero image */}
      <div
        className="relative h-[40vh] w-full overflow-hidden"
        style={{ backgroundColor: product.leftColor }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Content */}
      <div className="px-6 pt-6 pb-12 font-body">
        {/* Title eyebrow */}
        <p
          className="font-tiny text-[11px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: fg, opacity: 0.65 }}
        >
          {product.subtitle} · {product.category}
        </p>
        <h1
          className="font-heading mt-2 font-bold uppercase leading-[0.95] tracking-tight"
          style={{
            color: fg,
            letterSpacing: "-0.02em",
            fontSize: "clamp(40px, 12vw, 64px)",
          }}
        >
          {product.title}
        </h1>

        <p
          className="font-body mt-5 text-[14px] font-medium uppercase tracking-[0.22em]"
          style={{ color: fg, opacity: 0.75 }}
        >
          {product.tagline}
        </p>

        <p
          className="mt-6 text-[14px] leading-relaxed"
          style={{ color: fg, opacity: 0.82 }}
        >
          {product.descriptionLong}
        </p>

        {/* Engineering */}
        <h2
          className="font-heading mt-10 text-[20px] font-semibold tracking-tight"
          style={{ color: fg }}
        >
          What&apos;s in the box
        </h2>
        <p
          className="mt-3 text-[14px] leading-relaxed"
          style={{ color: fg, opacity: 0.82 }}
        >
          {product.engineering}
        </p>

        {/* Capabilities */}
        {product.features.length > 0 && (
          <>
            <h2
              className="font-heading mt-10 text-[20px] font-semibold tracking-tight"
              style={{ color: fg }}
            >
              Capabilities
            </h2>
            <ul className="mt-4 space-y-2">
              {product.features.map((f, i) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[14px] leading-snug"
                  style={{ color: fg, opacity: 0.85 }}
                >
                  <span
                    aria-hidden
                    className="font-mono shrink-0 text-[11px] tabular-nums"
                    style={{ color: fg, opacity: 0.4 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Gallery — second photo */}
        {product.gallery[0] && product.gallery[0] !== product.image && (
          <div
            className="relative mt-10 h-[30vh] w-full overflow-hidden rounded-2xl"
            style={{ backgroundColor: product.leftColor }}
          >
            <Image
              src={product.gallery[0]}
              alt={`${product.title} — supporting view`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}

        {/* Applications */}
        {product.applications.length > 0 && (
          <>
            <h2
              className="font-heading mt-10 text-[20px] font-semibold tracking-tight"
              style={{ color: fg }}
            >
              Applications
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.applications.map((a) => (
                <li
                  key={a}
                  className="rounded-xl border px-3 py-2 text-[13px]"
                  style={{
                    borderColor: `${fg}22`,
                    color: fg,
                  }}
                >
                  {a}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* CTA — exact same component as Applications page Contact
            Sales (InteractiveHoverButton: dot-fill radial animation).
            Wrapped in a div with `transform: translateZ(0)` + `isolation`
            so the button gets its OWN compositor layer — the overlay's
            heavy content (clip-path, image, dense text) was forcing
            paint composition every frame of the hover animation,
            producing the lag. Promoting the button to its own layer
            lets the radial dot-fill animate against an empty buffer.
            onClick removed — letting the click flow naturally lets
            the radial animation play uninterrupted before navigation;
            the overlay gets cleared by Next.js route change anyway. */}
        <div
          className="mt-10"
          style={{
            color: fg,
            transform: 'translateZ(0)',
            isolation: 'isolate',
            willChange: 'transform',
          }}
        >
          <InteractiveHoverButton href="/contact">
            Contact Sales
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}
