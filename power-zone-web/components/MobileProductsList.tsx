"use client";

/* -----------------------------------------------------------------------------
 * MobileProductsList
 *
 * Mobile (<lg) fallback for the Products page. The desktop ProductExperience
 * is a cinematic wheel-driven split-screen with GSAP horizontal scroll detail
 * — none of that translates well to touch. On phones we instead render a
 * simple vertical list of product cards: image, eyebrow (origin), title,
 * tagline, and a CTA out to powerzone.com.pk (or /contact as a fallback).
 *
 * The CategorySwitch from ProductsRoot stays mounted at the top, so users
 * can still flip between Generators and BESS — that's why this component
 * takes a `products` array rather than picking one itself.
 * -------------------------------------------------------------------------- */

import Image from "next/image";
import type { Product } from "@/data/products";

type Props = {
  products: Product[];
};

export default function MobileProductsList({ products }: Props) {
  return (
    <div
      className="lg:hidden min-h-screen w-full bg-[#EFEAE0] pt-[140px] pb-16"
    >
      <header className="px-6 pb-6 sm:px-10">
        <p className="font-tiny text-[10px] uppercase tracking-[0.3em] text-black/55">
          Catalog
        </p>
        <h1 className="font-heading mt-1 text-3xl leading-tight text-black sm:text-4xl">
          Our Products
        </h1>
        <p className="font-body mt-2 max-w-prose text-sm text-black/70 sm:text-base">
          Browse the full lineup. Tap a card to view more on powerzone.com.pk.
        </p>
      </header>

      <ul className="flex flex-col gap-6 px-4 sm:gap-8 sm:px-8">
        {products.map((product) => {
          const href = product.url || "/contact";
          const external = href.startsWith("http");
          return (
            <li
              key={product.id}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              style={{ backgroundColor: product.descriptionBgColor }}
            >
              <div
                className="relative w-full"
                style={{ backgroundColor: product.leftColor }}
              >
                <div className="relative h-[42vh] max-h-[50vh] w-full sm:h-[45vh]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 90vw"
                    className="object-contain"
                    priority={product.id === 1}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 px-5 py-5 sm:px-7 sm:py-6">
                <p className="font-tiny text-[10px] uppercase tracking-[0.28em] text-black/60">
                  {product.origin}
                </p>
                <h2 className="font-heading text-2xl leading-tight text-black sm:text-3xl">
                  {product.title}
                </h2>
                <p className="font-body text-sm text-black/75 sm:text-base">
                  {product.tagline}
                </p>
                <p className="font-body text-sm text-black/65 sm:text-[15px]">
                  {product.overview}
                </p>

                {product.features?.length ? (
                  <ul className="mt-1 flex flex-col gap-1.5">
                    {product.features.slice(0, 3).map((f) => (
                      <li
                        key={f}
                        className="font-body text-[13px] leading-snug text-black/70 sm:text-sm"
                      >
                        <span className="mr-2 text-black/40">—</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="font-tiny inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-black/85"
                  >
                    View on powerzone.com.pk
                  </a>
                  <a
                    href="/contact"
                    className="font-tiny inline-flex items-center justify-center rounded-full border border-black/30 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black transition-colors hover:bg-black hover:text-white"
                  >
                    Contact Sales
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
