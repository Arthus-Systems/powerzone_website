"use client";

import { useId, type MutableRefObject } from "react";
import { textOn, type Product } from "@/data/products";
import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
} from "@/components/ui/text-stagger-hover";

type Props = {
  products: Product[];
  panelRefs: MutableRefObject<(HTMLElement | null)[]>;
  cardRef?: MutableRefObject<HTMLElement | null>;
  /** Index of the product currently visible at the top of the wipe stack. */
  currentIndex: number;
  /** Click handler — receives the index of the currently-visible product. */
  onCardClick: (index: number) => void;
};

type EmbossedPZProps = {
  accentColor: string;
  idBase: string;
  index: number;
};

function EmbossedPZ({ accentColor, idBase, index }: EmbossedPZProps) {
  const surfaceColor = accentColor || "#8f1d22";
  const shadowFilterId = `${idBase}-shadow-${index}`;
  const highlightFilterId = `${idBase}-highlight-${index}`;

  // Anchored to the SVG viewBox center; the wrapping <g> below adds a
  // small downward translate so the rendered PZ sits at the visual
  // middle of the card (dominantBaseline="middle" lands the em-box
  // middle on the y coord, which for caps-only text reads slightly
  // high). preserveAspectRatio="xMidYMid meet" on the SVG keeps the
  // (1000, 260) coord system centered for every viewport aspect.
  const sharedTextProps = {
    x: "50%",
    y: "50%",
    dy: "0",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontSize: 183,
    fontWeight: 700,
    letterSpacing: -17,
  };

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full select-none overflow-visible"
      viewBox="0 0 1000 260"
      preserveAspectRatio="xMidYMid meet"
      // Render the embossed PZ in Sansation (the site's display face)
      // so it visually matches the rest of the brand display copy.
      style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
    >
      <defs>
        <filter
          id={shadowFilterId}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter
          id={highlightFilterId}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/*
        Blind-emboss stack:
        1) blurred dark layer offset down/right = cast depth
        2) blurred light layer offset up/left = soft surface highlight
        3) crisp dark + crisp light offsets = beveled rim
        4) exact same-color fill covers the shifted layers' interiors
        5) very faint white fill gives the raised face a tiny light catch

        The final letter body uses the card's own accent color, so the PZ
        reads as molded card material rather than printed ink.
      */}
      <g transform="translate(0 12)">
        <text
          {...sharedTextProps}
          fill="#000000"
          opacity="0.17"
          transform="translate(9 9)"
          filter={`url(#${shadowFilterId})`}
        >
          PZ
        </text>
        <text
          {...sharedTextProps}
          fill="#ffffff"
          opacity="0.13"
          transform="translate(-7 -7)"
          filter={`url(#${highlightFilterId})`}
        >
          PZ
        </text>
        <text
          {...sharedTextProps}
          fill="#000000"
          opacity="0.28"
          transform="translate(3 3)"
        >
          PZ
        </text>
        <text
          {...sharedTextProps}
          fill="#ffffff"
          opacity="0.22"
          transform="translate(-2.5 -2.5)"
        >
          PZ
        </text>
        <text {...sharedTextProps} fill={surfaceColor}>
          PZ
        </text>
        <text {...sharedTextProps} fill="#ffffff" opacity="0.045">
          PZ
        </text>
      </g>
    </svg>
  );
}

export default function ProductCard({
  products,
  panelRefs,
  cardRef,
  currentIndex,
  onCardClick,
}: Props) {
  const currentProduct = products[currentIndex] ?? products[0];

  // Unique SVG ids per instance — multiple ProductCards can coexist in the DOM
  // during the live showcase + static hand-off states.
  const uid = useId().replace(/:/g, "");
  const grainId = `pz-card-grain-${uid}`;
  const embossId = `pz-card-emboss-${uid}`;

  return (
    // The article itself is the click target — putting the handler on
    // an inner full-card <button> overlay (a previous iteration) ate
    // mouse events, which broke the title's hover-stagger animation.
    // Now hover events reach the h2's TextStaggerHover wrapper while
    // click + keyboard activation are still handled at the article level.
    <article
      ref={(el) => {
        if (cardRef) cardRef.current = el;
      }}
      onClick={() => onCardClick(currentIndex)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(currentIndex);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${currentProduct?.title ?? "product"} detail`}
      className="
        relative overflow-hidden cursor-pointer
        w-[58vw] md:w-[28vw]
        h-[17vh]
        rounded-[2px]
        ring-1 ring-white/10
        shadow-[0_2px_4px_-1px_rgba(0,0,0,0.35),0_24px_55px_-12px_rgba(0,0,0,0.6),0_8px_18px_-6px_rgba(0,0,0,0.4)]
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-white/70 focus-visible:ring-inset
      "
      style={{ isolation: "isolate" }}
    >

      {/* Card-scoped grain texture. It sits above the colored panels, so both
       * the flat surface and the embossed PZ share the same material noise. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[10] opacity-[0.075] mix-blend-overlay"
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <filter id={grainId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.95"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>

      {/* Arrow — visual indicator only; the whole-card button handles clicks. */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute top-3 right-3 z-50
          h-8 w-8
          flex items-center justify-center
          text-white
        "
      >
        <svg
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M4 12 L12 4" strokeLinecap="round" />
          <path d="M6 4 L12 4 L12 10" strokeLinecap="round" />
        </svg>
      </div>

      {/* Stacked card panels — top peels up to reveal next. */}
      {products.map((product, i) => {
        const surfaceColor = product.accentColor || "#8f1d22";

        return (
          <section
            key={`${product.slug}-${i}`}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            // Title and subtitle now anchor to opposite corners
            // (top-left / bottom-left) via absolute positioning rather
            // than flex alignment — that way each one holds its corner
            // consistently regardless of card height (the old flex
            // approach drifted on 16:10 because the available row
            // height changed with viewport aspect).
            className="absolute inset-0 overflow-hidden will-change-transform"
            style={{
              backgroundColor: surfaceColor,
              zIndex: products.length - i,
            }}
          >
            <EmbossedPZ
              accentColor={surfaceColor}
              idBase={embossId}
              index={i}
            />

            {/* Subtle material lighting. Kept inside each panel so the text can
             * stay above it while the PZ remains integrated into the surface. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.025) 42%, rgba(0,0,0,0.11) 100%)",
                mixBlendMode: "soft-light",
                opacity: 0.78,
              }}
            />

            {/* Title — pinned tight to TOP-LEFT. Multi-word titles
             * (e.g. "Li-ion Battery", "Hybrid Inverter") render with
             * each whitespace-separated word on its own line via one
             * TextStaggerHover per word (the underlying component only
             * accepts string children, so we can't put block spans
             * inside a single instance). Single-word titles stay on
             * one line. */}
            <h2
              className="
                absolute top-2 left-3 md:top-3 md:left-4
                z-10 max-w-[60%] text-left
                font-semibold leading-[0.95]
                text-[clamp(17px,2.2vw,28px)]
                font-display
              "
              style={{ color: textOn(surfaceColor), letterSpacing: "-0.02em" }}
            >
              {product.title.split(/\s+/).map((word, idx) => (
                <TextStaggerHover
                  key={`t-${idx}`}
                  as="span"
                  className="block whitespace-nowrap"
                >
                  <TextStaggerHoverActive
                    animation="top"
                    className="opacity-90 origin-top"
                  >
                    {word}
                  </TextStaggerHoverActive>
                  <TextStaggerHoverHidden
                    animation="bottom"
                    className="origin-bottom"
                  >
                    {word}
                  </TextStaggerHoverHidden>
                </TextStaggerHover>
              ))}
            </h2>

            {/* Bottom-left — short type label (Diesel / Storage / Hybrid). */}
            <p
              className="
                absolute bottom-2 left-3 md:bottom-3 md:left-4
                z-10 max-w-[40%] text-left
                text-[9px] md:text-[10px] uppercase tracking-[0.14em]
                opacity-80 whitespace-nowrap font-body
              "
              style={{ color: textOn(surfaceColor) }}
            >
              {product.subtitle}
            </p>

            {/* Bottom-right — origin, rendered with each whitespace-
             * separated word stacked on its own line (e.g. "Italian"
             * over "Engineering", "Pakistan" over "Engineered"). */}
            <p
              className="
                absolute bottom-2 right-3 md:bottom-3 md:right-4
                z-10 max-w-[40%] text-right
                text-[9px] md:text-[10px] uppercase tracking-[0.14em] leading-[1.15]
                opacity-80 font-body
              "
              style={{ color: textOn(surfaceColor) }}
            >
              {product.origin.split(/\s+/).map((word, idx) => (
                <span key={`o-${idx}`} className="block">
                  {word}
                </span>
              ))}
            </p>
          </section>
        );
      })}
    </article>
  );
}
