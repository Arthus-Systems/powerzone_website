import type { CSSProperties, ReactNode } from 'react';

/* -----------------------------------------------------------------------------
 * InfiniteSlider
 *
 * Horizontally-scrolling marquee container that loops its children forever.
 * Children are rendered twice so the loop seams together cleanly; the track
 * translates from 0 → -50% over `speed` seconds via the `pz-marquee`
 * keyframe declared in globals.css. Hover behavior is pure CSS —
 * `.pz-marquee-wrapper:hover .pz-marquee-track` pauses the animation in
 * place, then unpauses cleanly on mouseleave (no position jump).
 *
 * Replaces an earlier React-state approach that swapped animation-duration
 * on hover; that caused a visible position shift because changing
 * animation-duration mid-animation makes the browser recompute the cycle
 * position relative to the new total length.
 * -------------------------------------------------------------------------- */

type Props = {
  children: ReactNode;
  gap?: number;
  speed?: number;
  reverse?: boolean;
  /** Negative animation-delay (in seconds) — starts the marquee at that
   *  offset into its own cycle. Use to stagger multiple rows so they
   *  show different content at any given moment even though they share
   *  the same children. */
  delay?: number;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 40,
  speed = 50,
  reverse = false,
  delay = 0,
  className = '',
}: Props) {
  return (
    <div className={`pz-marquee-wrapper ${className}`.trim()}>
      <div
        className="pz-marquee-track"
        style={
          {
            gap: `${gap}px`,
            paddingRight: `${gap}px`,
            animationDuration: `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
            // Negative delay starts the animation that-many seconds into
            // its cycle, effectively offsetting the visible start position.
            animationDelay: `${delay}s`,
          } as CSSProperties
        }
      >
        {/* Rendered twice so the -50% translate loops seamlessly. */}
        {children}
        {children}
      </div>
    </div>
  );
}
