'use client';

import Link from 'next/link';
import TiltedCard from './ui/TiltedCard';

/* -----------------------------------------------------------------------------
 * PeekProductsSection
 *
 * Single-viewport "Explore Our Products" surface. Three stacks fit inside
 * exactly 100vh so the section can serve as the sticky-reveal underneath
 * layer for the hero (see app/page.tsx) without any content getting clipped:
 *
 *   - eyebrow heading + intro line          (~14vh)
 *   - two TiltedCards (Generators / BESS)    (~52vh)
 *   - "Authorized Partner Of" credentials    (~22vh)
 *
 * The partner credentials live inside this section (not as a separate
 * sibling) per the customer ask — they should read as one continuous
 * "products" beat, not two separate beats.
 *
 * The Since-2003 company-credibility cards (Founded 2003 ·
 * Engineer-Supervised Coupling · Nationwide Service Vans) and the
 * company-behind-the-product tagline live in SolutionsSection's "Why
 * Power Zone" carousel — they're stronger as scroll-paced trust signals
 * there than as a credentials strip stacked here.
 * -------------------------------------------------------------------------- */

export default function PeekProductsSection() {
  return (
    <section className="relative flex h-screen flex-col items-center overflow-hidden bg-[#F4EFE7] px-4 sm:px-6 md:px-12 py-[clamp(28px,5vh,72px)]">
      {/* Soft brand-accent glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 100% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 65%)',
        }}
      />

      {/* justify-between distributes the three stacks (heading, cards,
          partners) across the full flex height instead of clumping them
          centered with empty space top/bottom. This was leaving the
          section visibly shorter than the viewport. */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-between gap-[clamp(16px,3vh,40px)]">
        {/* Header — dark text on the cream surface */}
        <div className="text-center">
          <h2 className="font-heading text-[clamp(28px,4.6vh,60px)] font-semibold leading-[1.04] tracking-tight text-black">
            Explore Our Products
          </h2>
          <p className="font-body mx-auto mt-[clamp(8px,1.4vh,18px)] max-w-[42rem] text-[clamp(12px,1.5vh,15px)] leading-relaxed text-black/55">
            Diesel generators and battery storage systems engineered for the
            grid Pakistan actually has. Tap a card to explore the lineup.
          </p>
        </div>

        {/* Product cards — trimmed slightly from clamp(360,62vh,620) so the
         * partner credentials fit underneath inside the same 100vh. */}
        <div className="flex w-full flex-col items-center justify-center gap-8 md:flex-row md:gap-16 lg:gap-20">
          <Link
            href="/products?category=generators"
            aria-label="View our diesel generators"
            className="pz-peek-card-mobile-half block cursor-pointer"
          >
            <TiltedCard
              imageSrc="/images/fpt_product_1.webp"
              altText="FPT diesel generator"
              containerHeight="clamp(280px, 48vh, 460px)"
              containerWidth="clamp(240px, 30vw, 380px)"
              imageHeight="clamp(280px, 48vh, 460px)"
              imageWidth="clamp(240px, 30vw, 380px)"
              rotateAmplitude={11}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              priority
              overlayContent={
                <div className="flex h-full w-full flex-col justify-end">
                  <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pt-24 pb-7">
                    <p className="font-body text-white text-[13px] sm:text-base md:text-2xl font-semibold leading-tight tracking-tight">
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

          <div
            aria-hidden
            className="hidden md:block w-px h-[clamp(220px,40vh,400px)] bg-black/15"
          />

          <Link
            href="/products?category=bess"
            aria-label="View our battery energy storage solutions"
            className="pz-peek-card-mobile-half block cursor-pointer"
          >
            <TiltedCard
              imageSrc="/images/bess_product_1.webp"
              altText="Power Zone battery energy storage cabinet"
              containerHeight="clamp(280px, 48vh, 460px)"
              containerWidth="clamp(240px, 30vw, 380px)"
              imageHeight="clamp(280px, 48vh, 460px)"
              imageWidth="clamp(240px, 30vw, 380px)"
              rotateAmplitude={11}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div className="flex h-full w-full flex-col justify-end">
                  <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent px-6 pt-24 pb-7">
                    <p className="font-body text-white text-[13px] sm:text-base md:text-2xl font-semibold leading-tight tracking-tight">
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

        {/* Authorized Partner credentials — full-substance cards
         * (not skinny pills) so they balance the visual weight of the
         * enlarged product cards above. */}
        <div className="flex w-full max-w-[1280px] flex-col items-center">
          <p className="font-tiny mb-[clamp(10px,1.6vh,18px)] text-[clamp(11px,1.5vh,15px)] uppercase tracking-[0.34em] text-black/55">
            Authorized Partner Of
          </p>
          <div className="grid w-full gap-3 md:grid-cols-2 md:gap-4">
            <CredentialCard
              brand="Cummins"
              credential="GOEM · Pakistan"
              tagline="Official GOEM of Cummins in Pakistan — powering the country with globally trusted Cummins engines, delivering unmatched performance, durability, and dependable factory-backed support."
            />
            <CredentialCard
              brand="FPT"
              credential="Distributor · Pakistan"
              tagline="Official FPT Distributor in Pakistan — delivering world-class Italian-engineered power solutions with full authenticity, factory support, and the reliability FPT Industrial is known for."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* AuthorizedPartnersStrip retained as a named export for backwards
 * compatibility in case any other route imports it; renders nothing now
 * that the credentials live inside PeekProductsSection itself. */
export function AuthorizedPartnersStrip() {
  return null;
}

/* ── CredentialCard ──────────────────────────────────────────────────────
 * Full-substance partner credential card — brand wordmark + credential
 * type + trust statement. Sized to read as a meaningful card alongside
 * the enlarged product cards above. */
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
