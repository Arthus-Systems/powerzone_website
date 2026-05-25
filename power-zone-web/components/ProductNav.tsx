"use client";

import type { Product } from "@/data/products";

type Props = {
  products: Product[];
};

export default function ProductNav({ products }: Props) {
  const handleClick = (index: number) => {
    window.dispatchEvent(
      new CustomEvent("pz:scrollToProduct", { detail: { index } }),
    );
  };

  return (
    <nav
      aria-label="Product list"
      className="fixed right-6 top-[6.5rem] z-[70] hidden md:block"
    >
      <div className="flex flex-col overflow-hidden rounded-2xl bg-black/45 backdrop-blur-md ring-1 ring-white/10">
        {products.map((product, i) => (
          <button
            key={product.slug}
            type="button"
            onClick={() => handleClick(i)}
            className="
              group flex items-center gap-3 px-5 py-3 text-left
              transition-colors duration-200 hover:bg-white/10
              [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/8
            "
          >
            <span className="font-mono text-[10px] text-white/30 transition-colors group-hover:text-white/55">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70 transition-colors group-hover:text-white">
              {product.slug}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
