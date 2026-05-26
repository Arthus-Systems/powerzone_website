'use client';

/* -----------------------------------------------------------------------------
 * Navbar — single source of truth for the site nav.
 *
 * Auto-color is per-CHARACTER: each glyph in every link, plus the logo
 * image, samples the page background under its own centre and snaps
 * to either white (on dark) or black (on light) independently. So if
 * a single link straddles a light/dark seam, half the letters can go
 * white and the other half black, and the bar stays readable end-to-
 * end. Sampling is throttled with rAF and re-runs on scroll, resize,
 * and the `pz:productIndexChange`/`pz:phaseChange` events the
 * products page emits when its background shifts without the page
 * actually scrolling.
 *
 * The bar is purely text + logo (no background, no border, no blur),
 * short (≈62px), with an animated underline for hover + active.
 * Logo is decorative (no click handler) — the Home nav link handles
 * going back to /.
 *
 * Direction of the page-transition curtain is decided by
 * GlobalTransitions based on the clicked link's index relative to
 * the currently-active one within this <nav>, so no extra props
 * needed here.
 * -------------------------------------------------------------------------- */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const;

type SampleTheme = 'light' | 'dark';

/** Sample the rendered page bg directly under (x, y). Returns 'dark'
 * if the closest opaque ancestor's background is dark enough to need
 * light text, otherwise 'light'. Skips the nav itself so it doesn't
 * sample its own (transparent) box. */
function sampleAt(x: number, y: number): SampleTheme {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (el.closest('nav[aria-label="Site navigation"]')) continue;
    let cur: Element | null = el;
    while (cur) {
      const bg = getComputedStyle(cur).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const m = bg.match(/(\d+(?:\.\d+)?)/g);
        if (m && m.length >= 3) {
          const r = +m[0];
          const g = +m[1];
          const b = +m[2];
          // YIQ luminance — matches the existing `textOn()` helper.
          const lum = (r * 299 + g * 587 + b * 114) / 1000;
          return lum < 140 ? 'dark' : 'light';
        }
      }
      cur = cur.parentElement;
    }
  }
  return 'light';
}

/** Subscribe a list of refs to background-aware colour updates. The
 * hook returns one theme per ref, matching index order. Each ref is
 * sampled at its bounding-rect centre. Re-samples on scroll, resize,
 * and products-page chrome events. */
function usePerElementTheme(
  refs: React.RefObject<HTMLElement | null>[],
): SampleTheme[] {
  const [themes, setThemes] = useState<SampleTheme[]>(() =>
    refs.map(() => 'light'),
  );

  const sample = useCallback(() => {
    if (typeof document === 'undefined') return;
    const next: SampleTheme[] = refs.map((ref) => {
      const el = ref.current;
      if (!el) return 'light';
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return 'light';
      const x = Math.round(rect.left + rect.width / 2);
      const y = Math.round(rect.top + rect.height / 2);
      return sampleAt(x, y);
    });
    setThemes((prev) => {
      if (
        prev.length === next.length &&
        prev.every((v, i) => v === next[i])
      ) {
        return prev;
      }
      return next;
    });
  }, [refs]);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        sample();
      });
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pz:productIndexChange', schedule);
    window.addEventListener('pz:phaseChange', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pz:productIndexChange', schedule);
      window.removeEventListener('pz:phaseChange', schedule);
    };
  }, [sample]);

  return themes;
}

/** A single nav link with per-character colour sampling. Each glyph
 * is its own `<span>` with its own ref, sampled independently. */
function AutoColorLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const chars = useMemo(() => Array.from(label), [label]);
  const refs = useMemo(
    () => chars.map(() => ({ current: null as HTMLSpanElement | null })),
    [chars],
  );
  const themes = usePerElementTheme(
    refs as React.RefObject<HTMLElement | null>[],
  );

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`
        relative inline-flex py-1
        after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5
        after:h-px after:origin-left after:scale-x-0 after:bg-current
        after:transition-transform after:duration-300 after:ease-out
        hover:after:scale-x-100
        ${active ? 'after:scale-x-100' : ''}
      `}
    >
      {chars.map((char, i) => {
        const theme = themes[i] ?? 'light';
        const style: CSSProperties = {
          color: theme === 'dark' ? '#ffffff' : '#000000',
          transition: 'color 180ms ease-out',
        };
        return (
          <span
            key={i}
            ref={(el) => {
              refs[i].current = el;
            }}
            style={style}
            className="inline-block whitespace-pre"
          >
            {char === ' ' ? ' ' : char}
          </span>
        );
      })}
    </Link>
  );
}

/** Logo image with bg-aware variant swap. */
function AutoColorLogo() {
  const ref = useRef<HTMLImageElement | null>(null);
  const refs = useMemo(() => [ref], []);
  const [theme] = usePerElementTheme(
    refs as unknown as React.RefObject<HTMLElement | null>[],
  );
  const isDark = theme === 'dark';
  return (
    <div
      aria-hidden
      className="absolute left-8 top-1/2 -translate-y-1/2 select-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={isDark ? '/images/logo-on-dark.webp' : '/images/logo-on-light.webp'}
        alt=""
        draggable={false}
        className="pointer-events-none h-12 w-auto select-none transition-opacity duration-200"
      />
    </div>
  );
}

export default function Navbar({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/';

  // A link is "active" when the user is on its route, or — for non-home
  // routes — when they're on a sub-route of it (e.g. /blog/some-post).
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Site navigation"
      className={`
        relative h-[62px] w-full
        ${className}
      `.trim()}
    >
      <AutoColorLogo />

      <ul
        className="
          flex h-full items-center justify-center gap-8
          text-[12px] font-bold uppercase tracking-[0.24em]
        "
      >
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <AutoColorLink
              href={link.href}
              label={link.label}
              active={isActive(link.href)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
