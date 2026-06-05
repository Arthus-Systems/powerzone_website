'use client';

import Link from 'next/link';
import TiltedCard from './ui/TiltedCard';

// Cream background matches the GoalsSection further down so the upper
// half of the page (after the dark hero) reads as one continuous warm
// canvas. Section is min-h-screen + flex centered so it occupies the
// full viewport when scrolled into — the cards land mid-screen rather
// than crowding the section header.
export default function PeekProductsSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#F4EFE7] px-4 sm:px-6 md:px-12 py-12 lg:py-[clamp(28px,5vh,72px)]">
      {/* Soft brand-accent glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 100% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center gap-[clamp(24px,4.5vh,56px)]">
        {/* Header — dark text on the cream surface */}
        <div className="text-center">
          <h2 className="font-heading text-[clamp(28px,4.6vh,60px)] font-semibold leading-[1.05] tracking-tight text-black">
            Peek Our Products
          </h2>
          <p className="font-body mx-auto mt-[clamp(12px,2vh,24px)] max-w-[40rem] text-[clamp(13px,1.7vh,16px)] leading-relaxed text-black/55">
            Diesel generators and battery storage systems engineered for the
            grid Pakistan actually has. Tap a card to explore the lineup.
          </p>
        </div>

        {/* Cards — taller so the section fills the viewport, kept centered
         * in a flex row (with a thin vertical divider between cards on
         * md+ screens) that stacks on mobile. */}
        <div className="flex w-full flex-col items-center justify-center gap-12 md:flex-row md:gap-16 lg:gap-20">
          <Link
            href="/products?category=generators"
            aria-label="View our diesel generators"
            className="block cursor-pointer"
          >
            <TiltedCard
              imageSrc="/images/fpt_product_1.webp"
              altText="FPT diesel generator"
              containerHeight="clamp(320px, 52vh, 520px)"
              containerWidth="clamp(260px, 34vw, 420px)"
              imageHeight="clamp(320px, 52vh, 520px)"
              imageWidth="clamp(260px, 34vw, 420px)"
              rotateAmplitude={11}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex h-full w-full flex-col justify-end">
                  <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pt-24 pb-7">
                    {/* <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-400 mb-3">
                      Generators
                    </p> */}
                    <p className="font-body text-white text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                      Learn more about
                      <br />
                      our generators
                      <span className="ml-2 inline-block translate-y-[1px]">
                        →
                      </span>
                    </p>
                  </div>
                </div>
              }
            />
          </Link>

          {/* Thin vertical separator between the two product cards.
           * Hidden on mobile (where the layout stacks); height roughly
           * matches the cards so the line reads as a deliberate seam. */}
          <div
            aria-hidden
            className="hidden md:block w-px h-[clamp(240px,42vh,420px)] bg-black/15"
          />

          <Link
            href="/products?category=bess"
            aria-label="View our battery energy storage solutions"
            className="block cursor-pointer"
          >
            <TiltedCard
              imageSrc="/images/bess_product_1.webp"
              altText="Power Zone battery energy storage cabinet"
              containerHeight="clamp(320px, 52vh, 520px)"
              containerWidth="clamp(260px, 34vw, 420px)"
              imageHeight="clamp(320px, 52vh, 520px)"
              imageWidth="clamp(260px, 34vw, 420px)"
              rotateAmplitude={11}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex h-full w-full flex-col justify-end">
                  <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pt-24 pb-7">
                    {/* <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red-400 mb-3">
                      Battery Storage
                    </p> */}
                    <p className="font-body text-white text-xl md:text-2xl font-semibold leading-tight tracking-tight">
                      Learn more about our
                      <br />
                      battery storage solutions
                      <span className="ml-2 inline-block translate-y-[1px]">
                        →
                      </span>
                    </p>
                  </div>
                </div>
              }
            />
          </Link>
        </div>

        {/* ── Authorized Partner credentials ──────────────────────────────
         * Sits below the product cards. Two substantial cards side-by-side,
         * each surfacing the full credential statement at rest (no hover
         * reveal needed). Uses the vertical space freed by dropping the
         * "Explore" eyebrow so the strip reads as part of the section
         * rather than an afterthought. */}
        <div className="flex w-full max-w-[1280px] flex-col items-center">
          <p className="font-tiny mb-[clamp(12px,1.8vh,22px)] text-[clamp(13px,1.6vh,16px)] uppercase tracking-[0.34em] text-black/55">
            Authorized Partner Of
          </p>
          <div className="grid w-full gap-3 md:grid-cols-2 md:gap-4">
            <CredentialCard
              brand="Cummins"
              credential="GOEM · Pakistan"
              tagline="Official GOEM of Cummins in Pakistan — powering the country with globally trusted Cummins engines, delivering unmatched performance, durability, and dependable support."
            />
            <CredentialCard
              brand="FPT"
              credential="Distributor · Pakistan"
              tagline="Official FPT Distributor in Pakistan — delivering world-class Italian-engineered power solutions with full authenticity, support, and reliability."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CredentialCard ──────────────────────────────────────────────────────
 * Substantial credential card: brand wordmark + credential type + full
 * trust statement all visible at rest. Subtle lift + border darken on
 * hover. Brand-red dot for visual anchor. */
function CredentialCard({
  brand,
  credential,
  tagline,
}: {
  brand: string;
  credential: string;
  tagline: string;
}) {
  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 rounded-2xl border border-black/15 bg-black/[0.02] px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/[0.04] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
      <div className="flex shrink-0 flex-col items-start gap-1.5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 shrink-0 rounded-full bg-red-600 transition-transform duration-200 group-hover:scale-125"
          />
          <h3 className="font-heading text-[clamp(16px,2.1vh,22px)] font-semibold leading-none tracking-tight text-black">
            {brand}
          </h3>
        </div>
        <span className="font-tiny text-[9px] uppercase tracking-[0.22em] text-red-600">
          {credential}
        </span>
      </div>
      <div aria-hidden className="hidden sm:block h-9 w-px shrink-0 bg-black/15" />
      <p className="font-body text-[12px] sm:text-[clamp(11px,1.4vh,13px)] leading-snug text-black/65">
        {tagline}
      </p>
    </div>
  );
}
