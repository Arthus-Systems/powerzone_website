'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import TiltedFrame from '@/components/ui/TiltedFrame';

// ───────────────────────────────────────────────────────────────────────────
// CONTENT
// ───────────────────────────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'Applications', href: '/applications' },
  { label: 'Contact Us', href: '/contact' },
];

const MAIN_PAGES = [
  { label: 'Generators', href: '/products?category=generators' },
  { label: 'Li-ion Batteries', href: '/products?category=bess' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '#' },
];

const SUBSCRIBE_BULLETS = [
  'Power Zone product updates and launches',
  'Energy education from experts in the field',
  'Op-Eds and insights from our leadership',
];

// Lahore warehouse — same address as ContactExperience.tsx (OFFICES[0]).
// Maps URLs use a plain search query so the embed renders without an API key.
const LAHORE_ADDRESS =
  '1P, 1KM, Defence Off, Raiwind Road, Bhobtian Chowk, Adjacent University of Lahore.';
// Exact coordinates of the Lahore warehouse (resolved from the canonical
// Google Maps short link https://maps.app.goo.gl/5XnbehmhK9fcLJdA7 →
// "Powerzone Generators Pakistan"). Using lat/lng for the embed locks the
// map to the actual marker rather than relying on a fuzzy text search.
const LAHORE_LAT = 31.3930372;
const LAHORE_LNG = 74.240753;
const LAHORE_MAPS_LINK = 'https://maps.app.goo.gl/5XnbehmhK9fcLJdA7';
const LAHORE_MAPS_EMBED = `https://www.google.com/maps?q=loc:${LAHORE_LAT},${LAHORE_LNG}&hl=en&z=16&output=embed`;

// ───────────────────────────────────────────────────────────────────────────
// STICKY REVEAL MECHANIC
// ───────────────────────────────────────────────────────────────────────────
//
// Structure (preserved from the original — gives the footer a "slide up
// from below" feel as the user reaches the bottom of the page):
//
//   <div h-[90vh]>                              ← outer, takes 90vh in flow
//     <div h-[190vh] -top-[100vh]>              ← inner extends 100vh above
//       <div h-[90vh] sticky top-[10vh]>        ← sticky child pins at 10vh
//         <footer>… real footer content …</footer>
//       </div>
//     </div>
//   </div>
//
// Bumped from 70vh → 90vh to give the revamped 3-column layout enough
// breathing room for the warehouse map without packing content too tightly.

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Frontend-only for now — wire to a real endpoint when ready.
    console.log('Footer subscribe', email);
    setSubmitted(true);
  };

  // The actual footer surface — shared between mobile (plain flow) and
  // desktop (sticky-reveal). Both renders pass the same children; only the
  // outer wrapper differs.
  const footerInner = (
    <footer className="relative h-full w-full overflow-hidden bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 py-[clamp(24px,4vh,56px)] md:px-12">
        {/* ─── MAIN GRID — 3 columns ─────────────────────────────
            Left   (1.5fr) : Subscribe form + benefit bullets
            Middle (1.1fr) : Lahore warehouse map + address
            Right  (1.0fr) : Quick Links + Main Pages + Legal stacked
        */}
        <div className="grid flex-1 grid-cols-1 gap-10 md:grid-cols-[1.5fr_1.1fr_1fr] md:gap-12 lg:gap-16">
          {/* COL 1 — Subscribe */}
          <div className="flex flex-col">
            <h2 className="font-heading text-[clamp(24px,3vh,34px)] font-semibold leading-[1.1] tracking-tight">
              Stay in touch
            </h2>
            <p className="font-tiny mt-3 max-w-md text-[13px] leading-relaxed text-white/65 md:text-[14px]">
              Be the first to hear about new installations, product
              launches, and energy insights from Power Zone.
            </p>

            {submitted ? (
              <div className="mt-5 max-w-md rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3">
                <p className="font-tiny text-[13px] text-white/85">
                  Thanks — you’re on the list.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="
                  mt-5 flex max-w-md items-center
                  rounded-2xl border border-white/15 bg-white/[0.04]
                  p-1.5
                "
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="
                    font-body min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px]
                    text-white placeholder:text-white/45
                    focus:outline-none md:px-4
                  "
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="
                    font-tiny shrink-0 cursor-pointer rounded-xl bg-red-600 px-4 py-2
                    text-[13px] font-semibold text-white
                    transition-colors duration-200 hover:bg-red-500 md:px-5
                  "
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* What you'll get */}
            <p className="font-tiny mt-6 text-[11px] uppercase tracking-[0.22em] text-white/45">
              What you’ll get
            </p>
            <ul className="mt-3 space-y-2">
              {SUBSCRIBE_BULLETS.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      d="M8 12l3 3 5-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-tiny text-[12px] leading-snug text-white/75 md:text-[13px]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTAs sit at the bottom of the subscribe column on
                desktop, and naturally fall after the bullets on
                mobile. */}
            <div className="mt-auto flex flex-wrap gap-3 pt-[clamp(16px,2.5vh,32px)] text-white">
              <InteractiveHoverButton href="/blog">
                From the Power Room
              </InteractiveHoverButton>
              <InteractiveHoverButton href="/contact">
                Let&apos;s Power Your Project
              </InteractiveHoverButton>
            </div>
          </div>

          {/* COL 2 — Lahore warehouse map (tilted card) */}
          <div className="flex flex-col">
            <h3 className="font-tiny text-[14px] font-semibold text-white md:text-[15px]">
              Visit Our Warehouse
            </h3>
            {/* TiltedFrame applies the same hover-tilt mechanic the
                PeekProducts cards use, scaled gently (rotateAmplitude
                8, scaleOnHover 1.03) since this is a small footer
                element rather than a hero card. flex-1 lets the
                wrapper grow to fill the column's vertical space. */}
            <TiltedFrame
              className="mt-3 flex-1"
              rotateAmplitude={8}
              scaleOnHover={1.03}
            >
              <a
                href={LAHORE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex h-full flex-col overflow-hidden rounded-xl
                  border border-white/15 bg-white/[0.03]
                  shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)]
                  transition-colors duration-200
                  hover:border-white/35
                "
                aria-label="Open Power Zone Lahore warehouse in Google Maps"
              >
                {/* Map fills all available vertical space inside the
                    column — flex-1 keeps the address strip pinned at
                    the bottom regardless of the column's actual height. */}
                <div className="relative min-h-[160px] flex-1 bg-black/40 md:min-h-[140px]">
                  <iframe
                    src={LAHORE_MAPS_EMBED}
                    title="Power Zone Lahore warehouse location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="
                      pointer-events-none absolute inset-0 h-full w-full
                      opacity-90 transition-opacity duration-200
                      group-hover:opacity-100
                    "
                    style={{ border: 0, filter: 'grayscale(0.15)' }}
                  />
                </div>
                <div className="flex items-start gap-2.5 border-t border-white/10 px-3.5 py-3">
                  <svg
                    aria-hidden
                    viewBox="0 0 12 16"
                    fill="currentColor"
                    className="mt-[3px] h-3 w-3 shrink-0 text-red-500"
                  >
                    <path d="M6 0C3.79 0 2 1.79 2 4c0 2.5 4 8 4 8s4-5.5 4-8c0-2.21-1.79-4-4-4Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="font-tiny text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85">
                      Lahore
                    </p>
                    <p className="font-tiny mt-1 text-[11px] leading-snug text-white/60 md:text-[12px]">
                      {LAHORE_ADDRESS}
                    </p>
                  </div>
                </div>
              </a>
            </TiltedFrame>
          </div>

          {/* COL 3 — Link columns, stacked vertically for a tidy
              sitemap look on desktop; 2-up on small screens. */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 sm:grid-cols-3 md:grid-cols-1 md:gap-y-6">
            <LinkColumn title="Quick Links" links={QUICK_LINKS} />
            <LinkColumn title="Main Pages" links={MAIN_PAGES} />
            <LinkColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-[clamp(20px,3vh,40px)] h-px w-full bg-white/15" />

        {/* ─── BRAND STRIP ─────────────────────────────────────────
            Compact bottom row: brand lockup (PZ + FPT) on the left,
            social icons centered, copyright on the right. Wraps on
            narrow viewports. */}
        <div className="mt-[clamp(16px,2.4vh,32px)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-on-dark.webp"
              alt="Power Zone — Engineering & Services"
              draggable={false}
              className="h-10 w-auto select-none md:h-12"
            />
            <span
              aria-hidden
              className="block h-7 w-px shrink-0 bg-white/20 md:h-8"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/fpt_logo.webp"
              alt="FPT Powertrain Technologies — Authorized Distributor"
              draggable={false}
              className="h-7 w-auto select-none md:h-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <SocialIcon
              href="https://pk.linkedin.com/company/powerzone-engineering-and-services"
              label="LinkedIn"
              path="M5 4a1 1 0 100 2 1 1 0 000-2zm-1 4h2v12H4V8zm6 0h2v2c.7-1.3 2.2-2 4-2 3 0 4 2 4 5v7h-2v-6c0-2-1-3-3-3s-3 1-3 3v6h-2V8z"
            />
            <SocialIcon
              href="https://www.facebook.com/powerzone.com.pk/"
              label="Facebook"
              path="M13 22v-8h3l1-4h-4V8c0-1 .5-2 2-2h2V2h-3c-3 0-5 2-5 5v3H6v4h3v8h4z"
            />
            <SocialIcon
              href="https://www.instagram.com/powerzone.official/"
              label="Instagram"
              path="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6a4 4 0 100 8 4 4 0 000-8zm5-1a1 1 0 100 2 1 1 0 000-2z"
            />
          </div>

          <p className="font-tiny text-[11px] uppercase tracking-[0.18em] text-white/50">
            © Powerzone 2025 — All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );

  // Two render modes:
  //   MOBILE (<md): plain block, natural height. The footer content
  //     (subscribe + map + 3 link columns + brand strip with PowerZone
  //     + FPT logos) is dense and stacks tall on phone widths — the
  //     sticky-reveal h-[90vh] mode clipped the brand strip off the
  //     bottom because `overflow-hidden` on the inner <footer> cut
  //     anything past the sticky container. Plain block lets every
  //     row land on screen as the user scrolls.
  //   DESKTOP (md+): sticky-reveal mechanic preserved — the footer
  //     slides up from below as the user reaches the page bottom, on
  //     a fixed 90vh stage where all content fits comfortably.
  return (
    <>
      {/* MOBILE — plain block. The [&>footer]:h-auto override lets the
          inner <footer>'s h-full give up its full-height constraint so
          natural content height takes over. */}
      <div className="block w-full bg-black md:hidden">
        <div className="min-h-fit w-full [&>footer]:h-auto [&>footer]:overflow-visible">
          {footerInner}
        </div>
      </div>

      {/* DESKTOP — sticky-reveal mechanic. */}
      <div
        className="relative hidden h-[90vh] w-full md:block"
        style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      >
        <div className="relative h-[calc(100vh+90vh)] -top-[100vh]">
          <div className="sticky top-[10vh] h-[90vh]">{footerInner}</div>
        </div>
      </div>
    </>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-tiny text-[14px] font-semibold text-white md:text-[15px]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                font-tiny text-[13px] text-white/65 transition-colors duration-200
                hover:text-white md:text-[14px]
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  path,
}: {
  href: string;
  label: string;
  path: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex h-8 w-8 items-center justify-center rounded-md
        border border-white/20 text-white/70
        transition-colors duration-200
        hover:border-white/40 hover:text-white
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <path d={path} />
      </svg>
    </a>
  );
}
