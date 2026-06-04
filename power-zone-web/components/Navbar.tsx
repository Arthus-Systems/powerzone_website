'use client';

/* -----------------------------------------------------------------------------
 * Navbar — single source of truth for the site nav.
 *
 * Auto-color uses `mix-blend-difference` — the same compositor effect
 * that drives the PowerZone logo in the products-page detail view.
 * Every pixel of the navbar (text + logo) is inverted against the
 * pixel directly behind it, so a glyph straddling a light/dark seam
 * picks up the correct contrast on both halves with no JS sampling.
 * Pure white text + white-pixel logo art give the cleanest inversion
 * (white on dark → white, white on light → black). The nav element
 * MUST NOT introduce `isolation: isolate`, and no fixed-positioned
 * ancestor should create a stacking context that traps the blend
 * against itself — otherwise the inversion samples against the
 * transparent wrapper instead of the page underneath.
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

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export default function Navbar({ className = '' }: { className?: string }) {
  const pathname = usePathname() || '/';

  // A link is "active" when the user is on its route, or — for non-home
  // routes — when they're on a sub-route of it (e.g. /blog/some-post).
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  // Routes that need the high-contrast halo treatment: white text with a
  // multi-layer text-shadow so the nav stays readable over arbitrary photo
  // / video backgrounds without an opaque navbar background.
  const isHaloNavRoute =
    pathname === '/products' ||
    pathname.startsWith('/products/') ||
    pathname === '/applications' ||
    pathname.startsWith('/applications/');
  const isBlackTextRoute =
    pathname === '/blog' ||
    pathname.startsWith('/blog/') ||
    pathname === '/contact' ||
    pathname.startsWith('/contact/') ||
    pathname === '/privacy' ||
    pathname.startsWith('/privacy/') ||
    pathname === '/privacy-policy' ||
    pathname.startsWith('/privacy-policy/');

  return (
    <nav
      aria-label="Site navigation"
      className={`
        relative h-[62px] w-full
        ${isHaloNavRoute ? '' : isBlackTextRoute ? 'text-black' : 'text-white mix-blend-difference'}
        ${className}
      `.trim()}
    >
      {/* Logo — visual only. Sits inside the mix-blend-difference scope
       * so its light pixels invert against whatever page surface is
       * behind, matching how the detail-view logo behaves. */}
      <div
        aria-hidden
        className="absolute left-8 top-1/2 -translate-y-1/2 select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-on-dark.webp"
          alt=""
          draggable={false}
          className="pointer-events-none h-12 w-auto select-none"
        />
      </div>

      <ul
        className={`
          flex h-full items-center justify-center gap-8
          font-tiny text-[14px] font-bold uppercase tracking-[0.24em]
          ${isHaloNavRoute ? 'text-white [text-shadow:0_0_10px_rgba(0,0,0,0.95),_0_0_3px_rgba(0,0,0,1),_0_2px_6px_rgba(0,0,0,0.7)]' : ''}
        `.trim()}
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`
                  relative inline-block py-1
                  after:pointer-events-none after:absolute after:left-0 after:right-0 after:-bottom-0.5
                  after:h-px after:origin-left after:scale-x-0
                  after:bg-current
                  ${isHaloNavRoute ? 'after:[box-shadow:0_0_8px_rgba(0,0,0,0.9),_0_0_2px_rgba(0,0,0,1)]' : ''}
                  after:transition-transform after:duration-300 after:ease-out
                  hover:after:scale-x-100
                  ${active ? 'after:scale-x-100' : ''}
                `}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
