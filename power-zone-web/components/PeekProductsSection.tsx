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
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F4EFE7] px-6 md:px-12 py-[clamp(48px,8vh,120px)]">
      {/* Soft brand-accent glow in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 100% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center">
        {/* Header — dark text on the cream surface */}
        <div className="text-center mb-[clamp(40px,6vh,80px)]">
          <p className="text-[clamp(13px,1.6vh,17px)] font-medium uppercase tracking-[0.32em] text-red-600">
            Explore
          </p>
          <h2 className="mt-[clamp(8px,1.8vh,18px)] text-[clamp(28px,4.6vh,60px)] font-semibold leading-[1.05] tracking-tight text-black">
            Peek Our Products
          </h2>
          <p className="mx-auto mt-[clamp(12px,2vh,24px)] max-w-[40rem] text-[clamp(13px,1.7vh,16px)] leading-relaxed text-black/55">
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
              imageSrc="/images/fpt_product_1.png"
              altText="FPT diesel generator"
              containerHeight="clamp(380px, 64vh, 620px)"
              containerWidth="clamp(300px, 38vw, 480px)"
              imageHeight="clamp(380px, 64vh, 620px)"
              imageWidth="clamp(300px, 38vw, 480px)"
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
                    <p className="text-white text-xl md:text-2xl font-semibold leading-tight tracking-tight">
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
            className="hidden md:block w-px h-[clamp(280px,52vh,520px)] bg-black/15"
          />

          <Link
            href="/products?category=bess"
            aria-label="View our battery energy storage solutions"
            className="block cursor-pointer"
          >
            <TiltedCard
              imageSrc="/images/bess_product_1.png"
              altText="Power Zone battery energy storage cabinet"
              containerHeight="clamp(380px, 64vh, 620px)"
              containerWidth="clamp(300px, 38vw, 480px)"
              imageHeight="clamp(380px, 64vh, 620px)"
              imageWidth="clamp(300px, 38vw, 480px)"
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
                    <p className="text-white text-xl md:text-2xl font-semibold leading-tight tracking-tight">
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
      </div>
    </section>
  );
}
