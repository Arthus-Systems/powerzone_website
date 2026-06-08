'use client';

/* -----------------------------------------------------------------------------
 * Navbar — single source of truth for the site nav.
 *
 * Desktop (md+): inline horizontal nav with logo + 5 links + auto-color
 * (mix-blend-difference / halo / black-text per route).
 *
 * Mobile (<md): the StaggeredMenu component takes over — an animated
 * slide-in panel with staggered red/blue underlay layers (PowerZone brand
 * red + accent blue). The desktop nav row stays mounted but is visually
 * hidden via `md:flex` / `hidden` on the inline `<ul>` and the logo is
 * preserved via the StaggeredMenu's own header.
 * -------------------------------------------------------------------------- */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StaggeredMenu, { type StaggeredMenuItem } from '@/components/ui/StaggeredMenu';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const;

// PowerZone brand colors used as the StaggeredMenu's slide-in underlay
// layers. Red = the primary brand red; blue = the accent glow color used
// in the cinematic intro's footer badge.
const PZ_RED = '#ff070f';
const PZ_BLUE = '#4f8dff';

const STAGGERED_ITEMS: StaggeredMenuItem[] = NAV_LINKS.map((l) => ({
  label: l.label,
  ariaLabel: `Navigate to ${l.label}`,
  link: l.href,
}));

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

  // For the StaggeredMenu's toggle button color, pick a sensible default
  // per route. Halo routes get white (with the mix-blend-difference scope
  // handling inversion); black-text routes get black; default white.
  const menuToggleColor = isBlackTextRoute ? '#000' : '#fff';

  return (
    <nav
      aria-label="Site navigation"
      /* IMPORTANT: NO blend mode / route color on the root anymore.
         Previously this was where the mix-blend-difference + text color
         lived, which caused the StaggeredMenu (a child of <nav>) to
         render with INVERTED colors on the homepage — the white panel
         and the dark menu items got composited through the difference
         blend against whatever page surface sat behind. The blend mode
         now applies only to the desktop-content wrapper below, leaving
         the mobile StaggeredMenu free of any blend influence; its
         colors come straight from its own props. */
      className={`relative h-[62px] w-full ${className}`.trim()}
    >
      {/* DESKTOP scope — logo + horizontal link row. Route-based
          color/blend treatment is scoped to THIS wrapper so it never
          touches the mobile menu. */}
      <div
        className={`
          absolute inset-0 hidden md:block
          ${isHaloNavRoute ? '' : isBlackTextRoute ? 'text-black' : 'text-white mix-blend-difference'}
        `.trim()}
      >
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
      </div>

      {/* Mobile StaggeredMenu (<md) — SIBLING of the desktop wrapper
          above, so the mix-blend-difference scope never reaches it.
          `displayItemNumbering={false}` removes the 01/02/03 superscripts.
          `closeOnItemClick` triggers the menu's slide-out animation the
          moment a link is tapped so the close + page transition overlap. */}
      <div className="md:hidden">
        <StaggeredMenu
          isFixed
          position="right"
          items={STAGGERED_ITEMS}
          socialItems={[]}
          displaySocials={false}
          displayItemNumbering={false}
          closeOnItemClick
          logoUrl="/images/logo-on-dark.webp"
          /* When the menu opens its panel is white — swap to the
             dark-on-light logo asset so the logo stays as itself
             instead of color-flipping via CSS invert. */
          openLogoUrl="/images/logo-on-light.webp"
          menuButtonColor={menuToggleColor}
          openMenuButtonColor="#000"
          changeMenuColorOnOpen
          colors={[PZ_RED, PZ_BLUE]}
          accentColor={PZ_RED}
        />
      </div>
    </nav>
  );
}
