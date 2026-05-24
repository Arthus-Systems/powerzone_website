'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

// Link columns — keyed to the routes that actually exist on the site.
// Product links land on `/products?category=…` which `ProductsRoot`
// reads on mount to pre-select the right catalog tab.
const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/applications' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Hybrid Inverters', href: '/products?category=bess' },
  { label: 'Chint Power Inverters', href: '/products?category=bess' },
];

const MAIN_PAGES = [
  { label: 'FPT Generator', href: '/products?category=generators' },
  { label: 'Yuchai Generator', href: '/products?category=generators' },
  { label: 'Perkins Generator', href: '/products?category=generators' },
  { label: 'Cummins Generator', href: '/products?category=generators' },
  { label: 'Li-ion Batteries', href: '/products?category=bess' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
];

const SUBSCRIBE_BULLETS = [
  'Power Zone product updates and launches',
  'Energy education from experts in the field',
  'Op-Eds and insights from our leadership',
];

// Entrance animation. Plays once when the footer scrolls into view —
// children stagger in for a polished arrival.
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut' as const,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ───────────────────────────────────────────────────────────────────────────
// STICKY REVEAL MECHANIC
// ───────────────────────────────────────────────────────────────────────────
//
// The structure (from the reference prompt):
//
//   <div h-[70vh]>                              ← outer, takes 70vh in flow
//     <div h-[170vh] -top-[100vh]>              ← inner, extends 100vh above
//       <div h-[70vh] sticky top-[30vh]>        ← sticky child, pins at 30vh
//         <footer>… real footer content …</footer>
//       </div>
//     </div>
//   </div>
//
// Effect: the footer "slides up" from the bottom of the viewport as the
// user approaches the bottom of the page, pinning at the bottom 70vh
// once it lands. When the user has scrolled all the way through the
// outer 70vh, the sticky un-sticks and the footer scrolls naturally
// off the top with the rest of the page.
export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Frontend-only for now — wire to a real endpoint when ready.
    console.log('Footer subscribe', email);
    setSubmitted(true);
  };

  return (
    <div
      className="relative h-[70vh]"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <div className="relative h-[calc(100vh+70vh)] -top-[100vh]">
        <div className="sticky top-[calc(100vh-70vh)] h-[70vh]">
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={containerVariants}
            className="relative h-full w-full overflow-hidden bg-black text-white"
          >
            <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col justify-between px-6 py-[clamp(24px,4vh,56px)] md:px-12">
              {/* ─── Top: Stay in touch + Keep up-to-date ─── */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12"
              >
                {/* Stay in touch */}
                <div>
                  <h2 className="text-[clamp(22px,3.2vh,36px)] font-semibold leading-[1.08] tracking-tight">
                    Stay in touch
                  </h2>
                  <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/65 md:text-[14px]">
                    Be the first to hear about new installations, product
                    launches, and energy insights from Power Zone.
                  </p>

                  {submitted ? (
                    <div className="mt-5 max-w-md rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3">
                      <p className="text-[13px] text-white/85">
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
                          flex-1 bg-transparent px-4 py-2 text-[14px]
                          text-white placeholder:text-white/45
                          focus:outline-none
                        "
                        aria-label="Email address"
                      />
                      <button
                        type="submit"
                        className="
                          cursor-pointer rounded-xl bg-red-600 px-5 py-2
                          text-[13px] font-semibold text-white
                          transition-colors duration-200 hover:bg-red-500
                        "
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>

                {/* Keep up-to-date */}
                <div>
                  <h2 className="text-[clamp(22px,3.2vh,36px)] font-semibold leading-[1.08] tracking-tight">
                    Keep up-to-date with the future of energy
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {SUBSCRIBE_BULLETS.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          className="mt-0.5 h-5 w-5 shrink-0 text-white/55"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path
                            d="M8 12l3 3 5-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-[13px] text-white/80 md:text-[14px]">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="my-[clamp(16px,2.4vh,32px)] h-px w-full bg-white/15"
              />

              {/* ─── Bottom: brand + columns ─── */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1.6fr] md:gap-12"
              >
                {/* Brand block. `items-start` on the column stops the
                 * logo <img> from stretching horizontally — without it
                 * the default flex `align-items: stretch` overrides
                 * `w-auto` on the image and warps the logo wide. */}
                <div className="flex flex-col items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-on-dark.png"
                    alt="Power Zone — Engineering & Services"
                    draggable={false}
                    className="h-12 w-auto select-none md:h-14"
                  />
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                    © Powerzone 2025 — All Rights Reserved
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <SocialIcon
                      href="#"
                      label="Twitter"
                      path="M18 4l-6 8 6 8h-3l-5-6.5L4 20H2l6.5-8.5L2 4h3l4.5 6L14 4h4z"
                    />
                    <SocialIcon
                      href="#"
                      label="LinkedIn"
                      path="M5 4a1 1 0 100 2 1 1 0 000-2zm-1 4h2v12H4V8zm6 0h2v2c.7-1.3 2.2-2 4-2 3 0 4 2 4 5v7h-2v-6c0-2-1-3-3-3s-3 1-3 3v6h-2V8z"
                    />
                    <SocialIcon
                      href="#"
                      label="Facebook"
                      path="M13 22v-8h3l1-4h-4V8c0-1 .5-2 2-2h2V2h-3c-3 0-5 2-5 5v3H6v4h3v8h4z"
                    />
                    <SocialIcon
                      href="#"
                      label="Instagram"
                      path="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6a4 4 0 100 8 4 4 0 000-8zm5-1a1 1 0 100 2 1 1 0 000-2z"
                    />
                  </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
                  <LinkColumn title="Quick Links" links={QUICK_LINKS} />
                  <LinkColumn title="Main Pages" links={MAIN_PAGES} />
                  <LinkColumn title="Legal" links={LEGAL_LINKS} />
                </div>
              </motion.div>
            </div>
          </motion.footer>
        </div>
      </div>
    </div>
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
      <h3 className="text-[14px] font-semibold text-white md:text-[15px]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                text-[13px] text-white/65 transition-colors duration-200
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
