"use client";

/* -----------------------------------------------------------------------------
 * ProductNav — discreet position indicator pinned to the right edge.
 *
 * One small dot per product, stacked vertically. The active product's
 * dot is taller and brighter; the others are short and faded. No
 * numbers, no bar — the shape itself communicates "you are here, here
 * are the rest." `mix-blend-difference` keeps the dots legible against
 * both the dark image half and the light spec half of the showcase
 * without per-product colour wiring.
 *
 * Subscribes to the same `pz:productIndexChange` event the previous
 * progress-bar version did, and to `pz:phaseChange` so the indicator
 * lifts away when the user dives into a product detail layer.
 * -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
};

export default function ProductNav({ products }: Props) {
  const total = products.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ index: number }>;
      const idx = ce.detail?.index;
      if (typeof idx === "number") setCurrentIdx(idx);
    };
    window.addEventListener("pz:productIndexChange", handler);
    return () => window.removeEventListener("pz:productIndexChange", handler);
  }, []);

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
      aria-hidden
      animate={{ y: hidden ? "-150vh" : "-50%" }}
      transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
      className="
        pointer-events-none fixed right-7 top-1/2 z-[70]
        hidden flex-col items-center gap-2.5
        mix-blend-difference
        md:flex
      "
    >
      {Array.from({ length: total }, (_, i) => {
        const active = i === currentIdx;
        return (
          <span
            key={i}
            className={`
              block rounded-full
              transition-all duration-500 ease-out
              ${
                active
                  ? "h-3 w-[3px] bg-white"
                  : "h-[3px] w-[3px] bg-white/35"
              }
            `}
          />
        );
      })}
    </motion.div>
  );
}
