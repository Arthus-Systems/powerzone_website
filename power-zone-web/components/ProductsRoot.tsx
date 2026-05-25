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
 * -------------------------------------------------------------------------- */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  bessProducts,
  products as generators,
  type Product,
} from "@/data/products";
import ProductExperience from "./ProductExperience";
import ProductNav from "./ProductNav";

const SITE_NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Applications", href: "/applications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const CATEGORIES: ReadonlyArray<{
  id: string;
  label: string;
  items: Product[];
}> = [
  { id: "generators", label: "Generators", items: generators },
  { id: "bess", label: "BESS", items: bessProducts },
];

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
      <nav
        aria-label="Site navigation"
        className="fixed left-0 right-0 top-0 z-[90] flex h-24 items-center border-b border-white/10 bg-black/30 backdrop-blur-md"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Power Zone home"
          className="absolute left-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-on-dark.png"
            alt="Power Zone"
            draggable={false}
            className="pointer-events-none h-12 w-auto select-none"
          />
        </Link>

        {/* Center links */}
        <div className="flex w-full items-center justify-center gap-3 text-[13px] font-bold uppercase tracking-[0.24em] [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]">
          {SITE_NAV.map((link) => {
            const isActive = link.href === "/products";
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  cursor-pointer rounded-full px-5 py-2
                  transition-colors duration-300 text-white
                  ${isActive ? "bg-red-500/70" : "hover:bg-red-500/55"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Top-center category toggle. Pill background sits above the
       * showcase so it's visible against any product accent color.
       * top-[5.5rem] = 20px below the 80px (h-20) site nav. */}
      <nav
        aria-label="Product category"
        className="fixed left-1/2 top-[6.5rem] z-[80] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/35 p-1 backdrop-blur-md ring-1 ring-white/10"
      >
        {CATEGORIES.map((c) => {
          const selected = c.id === categoryId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              aria-pressed={selected}
              className={`
                rounded-full px-5 py-2
                font-mono text-[11px] uppercase tracking-[0.28em]
                transition-colors
                ${
                  selected
                    ? "bg-white text-black"
                    : "text-white/75 hover:text-white"
                }
              `}
            >
              {c.label}
            </button>
          );
        })}
      </nav>

      {/* Brand quick-links — keyed on category so the buttons re-mount
       * when the active catalog changes. */}
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
