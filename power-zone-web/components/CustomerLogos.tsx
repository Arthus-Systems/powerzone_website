import { InfiniteSlider } from './ui/infinite-slider';

/* -----------------------------------------------------------------------------
 * CustomerLogos
 *
 * Trust-builder strip rendered between the hero and PeekProducts section.
 * Three horizontally-scrolling logo rows — each carries ALL 20 customer
 * logos from /public/images/customer_logos/. The rows differ only by
 * direction and starting offset (animation-delay), so at any given moment
 * each row shows a different slice of the same logo set — the user
 * perceives three distinct moving streams rather than three copies of the
 * same row.
 *
 * Stagger choice:
 *   Row 1 — LTR, speed 70s, delay 0      (starts at logo 1)
 *   Row 2 — RTL, speed 70s, delay -23s   (≈1/3 into cycle ⇒ starts at logo ~7)
 *   Row 3 — LTR, speed 70s, delay -47s   (≈2/3 into cycle ⇒ starts at logo ~14)
 *
 * Hover behavior (per row):
 *   - The row pauses (CSS .pz-marquee-wrapper:hover rule)
 *   - All logos in that row simultaneously color in (Tailwind group-hover)
 *   - The other two rows stay muted and keep moving
 * -------------------------------------------------------------------------- */

// All 20 logo numbers — every row uses the full set. Visual differentiation
// comes from direction + delay, not from splitting the array.
const ALL_LOGOS = Array.from({ length: 20 }, (_, i) => i + 1);

const EDGE_FADE_MASK: React.CSSProperties = {
  maskImage:
    'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
};

// All three rows share the same speed so the relative stagger stays
// constant — different speeds would slowly drift the rows into and out of
// alignment, which can look messy.
const ROW_SPEED = 70;

export default function CustomerLogos() {
  return (
    /* h-screen self-contained block — the parent (a sticky-pin wrapper in
       app/page.tsx) provides the scroll-break dwell, while this section
       simply fills exactly one viewport with centered content. The bg fills
       the full pinned viewport so the hero on desktop can slide cleanly
       up over it during the reveal. */
    <section className="relative flex h-screen w-full flex-col justify-center overflow-hidden bg-[#F4EFE7] py-[clamp(48px,7vh,96px)]">
      {/* Header */}
      <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
        <p className="font-tiny text-[11px] font-medium uppercase tracking-[0.32em] text-red-600 md:text-[13px]">
          Trusted Across Pakistan
        </p>
        <h2 className="font-heading mt-3 text-[clamp(26px,3vw,42px)] font-semibold leading-[1.08] tracking-tight text-black">
          Our trusted customers
        </h2>
        <p className="font-body mx-auto mt-3 max-w-[40rem] text-[13px] leading-relaxed text-black/60 md:text-[15px]">
          Powering hospitals, data centers, industrial facilities, and
          institutions that can&apos;t afford downtime.
        </p>
      </div>

      {/* Staggered rows. Desktop renders 3 rows; mobile (<md) gets a 4th
          row to fill the larger visual footprint of the section on tall
          phone aspect ratios. `group` on each row scopes hover so
          touching any logo in a row colors EVERY logo in that row. */}
      <div className="mt-[clamp(32px,5vh,64px)] flex flex-col gap-[clamp(16px,2.4vh,32px)]">
        <div className="group" style={EDGE_FADE_MASK}>
          <InfiniteSlider gap={72} speed={ROW_SPEED} delay={0}>
            {ALL_LOGOS.map((n) => (
              <LogoChip key={`r1-${n}`} n={n} />
            ))}
          </InfiniteSlider>
        </div>

        <div className="group" style={EDGE_FADE_MASK}>
          <InfiniteSlider gap={72} speed={ROW_SPEED} delay={-23} reverse>
            {ALL_LOGOS.map((n) => (
              <LogoChip key={`r2-${n}`} n={n} />
            ))}
          </InfiniteSlider>
        </div>

        <div className="group" style={EDGE_FADE_MASK}>
          <InfiniteSlider gap={72} speed={ROW_SPEED} delay={-47}>
            {ALL_LOGOS.map((n) => (
              <LogoChip key={`r3-${n}`} n={n} />
            ))}
          </InfiniteSlider>
        </div>

        {/* Mobile-only 4th row. Quartile offset (~−58s) so it doesn't sync
            with row 3; reversed direction so adjacent rows always alternate
            visually. */}
        <div className="group md:hidden" style={EDGE_FADE_MASK}>
          <InfiniteSlider gap={72} speed={ROW_SPEED} delay={-58} reverse>
            {ALL_LOGOS.map((n) => (
              <LogoChip key={`r4-${n}`} n={n} />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

/* One logo chip. Desaturated + dimmed at rest so the rows read as a cohesive
 * band; group-hover (not hover) means hovering ANY logo in the row colors
 * ALL logos in that row.
 *
 * Image performance hardening:
 *   - Source files are pre-sized to a 200×200 max box at WebP q=80 (~6 KB
 *     average) — see public/images/customer_logos/. Originals preserved as
 *     .original.webp.
 *   - loading="lazy": these sit below the fold for both mobile and desktop,
 *     so the browser defers them until they approach the viewport.
 *   - decoding="async": decode happens off the main thread; the marquee
 *     keeps animating at 60fps while logos decode in the background.
 *   - fetchPriority="low": explicit deprioritization vs higher-priority
 *     hero / LCP images. The browser already infers this from loading=lazy
 *     but being explicit shaves a tick on slow connections.
 *   - 200×200 dims as DOM attrs give the browser the intrinsic aspect ratio
 *     so it can compute layout boxes before the bytes arrive (avoids CLS).
 *     The CSS h-14…h-24 + w-auto take over for the actual display size. */
function LogoChip({ n }: { n: number }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/images/customer_logos/logo_${n}.webp`}
      alt={`Customer logo ${n}`}
      width={200}
      height={200}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      draggable={false}
      className="
        pointer-events-none h-14 w-auto shrink-0 select-none object-contain
        opacity-65 grayscale
        transition duration-300 ease-out
        group-hover:opacity-100 group-hover:grayscale-0
        sm:h-16 md:h-20 lg:h-24
      "
    />
  );
}
