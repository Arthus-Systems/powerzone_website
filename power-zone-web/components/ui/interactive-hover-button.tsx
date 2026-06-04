'use client';

/* -----------------------------------------------------------------------------
 * InteractiveHoverButton — shared site-wide CTA.
 *
 * Adapted from the MagicUI component of the same name. On hover the original
 * label slides off to the right while a duplicate label + arrow slides in
 * from the right, and a small red dot in the corner explodes out to fill the
 * pill (the dot is the brand red so the fill always reads as "Power Zone").
 *
 * Renders as a <button> by default, or as a Next.js <Link> when `href` is
 * passed — both forms get the same look + animation, so anchor-flavoured
 * CTAs (navigating to /contact, /blog, etc.) still benefit from the global
 * page-transition interceptor in GlobalTransitions.
 *
 * Font is forced to Commissioner (`font-body`) per the brand spec — overrides
 * the global `button { font-family: var(--font-action) }` rule from
 * app/globals.css.
 * -------------------------------------------------------------------------- */

import Link from 'next/link';
import React from 'react';
import { cn } from '@/lib/utils';

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

type AsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
    href?: undefined;
  };

type AsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & {
    href: string;
  };

export type InteractiveHoverButtonProps = AsButton | AsLink;

// `pl-9` (36px) leaves room for the 8px dot at left-3 (12px) plus a
// 16px gap before the label starts — so the dot reads as a bullet
// preceding the text, never overlapping it.
//
// Outline uses `ring-1 ring-inset ring-current` instead of `border`
// so the 1px stroke is a box-shadow drawn ON TOP of any fill — the
// hover-state dot can therefore expand to fill the entire button
// without eating the outline (an actual `border` was getting painted
// over at sub-pixel rounding, leaving the top edge missing on dark
// surfaces).
const SHARED_CLASS = cn(
  '!font-tiny',
  'group relative inline-flex items-center cursor-pointer overflow-hidden',
  'rounded-full ring-1 ring-inset ring-current bg-transparent',
  'pl-9 pr-7 py-3',
  'text-[12px] font-semibold uppercase tracking-[0.2em]',
  'no-underline',
);

function Inner({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The dot. Idle: small bullet at the start of the label. Hover:
       * grows edge-to-edge so the hover label reads white-on-red. The
       * outline above is a `ring` (box-shadow) drawn on top of any
       * fill, so the dot can safely cover the full pill without eating
       * the outline. */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute left-3 top-1/2 z-10
          h-2 w-2 -translate-y-1/2 rounded-full
          bg-red-600
          transition-all duration-300 ease-out
          group-hover:left-0 group-hover:top-0
          group-hover:h-full group-hover:w-full
          group-hover:translate-y-0
        "
      />

      {/* Resting label — slides out to the right and fades on hover. */}
      <span
        className="
          relative z-20 inline-block
          transition-all duration-300 ease-out
          group-hover:translate-x-12 group-hover:opacity-0
        "
      >
        {children}
      </span>

      {/* Hover label + arrow — flies in from the right, ends centered. */}
      <span
        className="
          pointer-events-none absolute inset-0 z-20
          flex items-center justify-center gap-2
          translate-x-12 opacity-0 text-white
          transition-all duration-300 ease-out
          group-hover:translate-x-0 group-hover:opacity-100
        "
      >
        <span>{children}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </>
  );
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  InteractiveHoverButtonProps
>(({ children, className, ...rest }, ref) => {
  const merged = cn(SHARED_CLASS, className);

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...anchorProps } = rest as AsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={merged}
        {...anchorProps}
      >
        <Inner>{children}</Inner>
      </Link>
    );
  }

  const buttonProps = rest as AsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={merged}
      {...buttonProps}
    >
      <Inner>{children}</Inner>
    </button>
  );
});
InteractiveHoverButton.displayName = 'InteractiveHoverButton';
