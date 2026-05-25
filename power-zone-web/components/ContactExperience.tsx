'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Applications', href: '/applications' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

type Office = { city: string; address: string };

const OFFICES: Office[] = [
  {
    city: 'Lahore',
    address:
      '1P, 1KM, Defence Off, Raiwind Road, Bhobtian Chowk, Adjacent University of Lahore.',
  },
  {
    city: 'Islamabad',
    address: 'House #63, Street #2, I-11/2, Islamabad.',
  },
  {
    city: 'Faisalabad',
    address: 'House No. 1, Extension 2, Rachna Town, Faisalabad.',
  },
  {
    city: 'Karachi',
    address:
      'House No. 4G, P.E.C.H.S. Block 6, Near Dehli Sweets, Nursery, Shahra-e-Faisal.',
  },
  {
    city: 'Multan',
    address: 'House No. 727, J Block, Shahrukn-e-Alam Colony, Multan.',
  },
];

export default function ContactExperience() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4EFE7] text-black lg:h-screen">
      {/* Top navbar */}
      <nav
        className="
          absolute left-0 right-0 top-0 z-30 h-24
          border-b border-white/10 bg-black/30 backdrop-blur-md
        "
      >
        {/* Top-left logo */}
        <Link
          href="/"
          aria-label="Power Zone home"
          className="absolute left-8 top-1/2 -translate-y-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-on-dark.webp"
            alt="Power Zone"
            draggable={false}
            className="pointer-events-none h-12 w-auto select-none"
          />
        </Link>

        <div
          className="
            flex h-full items-center justify-center gap-3
            text-[13px] font-bold uppercase tracking-[0.24em]
            [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]
          "
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/contact';
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  cursor-pointer rounded-full px-5 py-2
                  transition-colors duration-300 text-white
                  ${isActive ? 'bg-red-500/70' : 'hover:bg-red-500/55'}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main
        className="
          relative z-10 flex min-h-screen flex-col
          px-6 pb-10 pt-32 md:px-10
          lg:h-screen lg:px-16 lg:pb-12 lg:pt-32
        "
      >
        <div
          className="
            mx-auto grid w-full max-w-[1400px] flex-1
            grid-cols-1 items-center gap-10
            lg:grid-cols-12 lg:gap-16
          "
        >
          {/* Left column — headline, description, dial-in info, offices */}
          <section className="flex flex-col gap-7 lg:col-span-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
                Contact Sales
              </p>
              <h1
                className="
                  mt-4 text-[clamp(34px,4vw,56px)] font-semibold
                  leading-[1.04] tracking-tight text-black
                "
                style={{ letterSpacing: '-0.01em' }}
              >
                See how Power Zone can
                <span className="mt-1 block font-serif italic font-normal text-black/70">
                  power your project.
                </span>
              </h1>
            </div>

            <p className="max-w-md text-[14px] leading-relaxed text-black/65 md:text-[15px]">
              Learn more about our products, explore use cases, or request a
              customized quote — built around your operational requirements.
            </p>

            {/* Quick dial-in details */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
              <ContactDetail
                label="Hotline"
                value="042-111-111-087"
                href="tel:+924211111087"
              />
              <ContactDetail
                label="Telephone"
                value="+92 331 111 0187"
                href="tel:+923311110187"
              />
              <ContactDetail
                label="Email"
                value="info@powerzone.com.pk"
                href="mailto:info@powerzone.com.pk"
              />
            </div>

            {/* Offices — pills + revealed address */}
            <OfficesSection />
          </section>

          {/* Right column — form */}
          <section className="lg:col-span-7">
            <ContactForm />
          </section>
        </div>
      </main>
    </div>
  );
}

function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a href={href} className="group block">
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
        {label}
      </p>
      <p className="mt-1 text-[15px] text-black transition-colors group-hover:text-red-600 md:text-[16px]">
        {value}
      </p>
    </a>
  );
}

function OfficesSection() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-black/40">
        Our Offices
      </p>

      {/* City pills */}
      <div className="flex flex-wrap gap-2">
        {OFFICES.map((office, i) => {
          const isActive = i === active;
          return (
            <button
              key={office.city}
              type="button"
              onClick={() => setActive(i)}
              className={`
                cursor-pointer rounded-full border px-4 py-1.5
                text-[11px] font-medium uppercase tracking-[0.18em]
                transition-colors duration-200
                ${
                  isActive
                    ? 'border-red-500/60 bg-red-500/20 text-red-700'
                    : 'border-black/15 bg-black/[0.04] text-black/65 hover:bg-black/[0.08] hover:text-black'
                }
              `}
            >
              {office.city}
            </button>
          );
        })}
      </div>

      {/* Selected city's address */}
      <div className="mt-3 flex max-w-md items-start gap-2.5 text-[12px] leading-relaxed text-black/55 md:text-[13px]">
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="mt-[3px] h-3 w-3 flex-shrink-0 text-red-500/80"
          fill="currentColor"
        >
          <path d="M6 0C3.79 0 2 1.79 2 4c0 2.5 4 8 4 8s4-5.5 4-8c0-2.21-1.79-4-4-4Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        </svg>
        <span>{OFFICES[active].address}</span>
      </div>
    </div>
  );
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function ContactForm() {
  const [data, setData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof FormState) => (value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Frontend-only for now — wire to a backend / form endpoint when ready.
    console.log('Contact form submitted', data);
    setSubmitted(true);
  };

  if (submitted) {
    return <SuccessPanel onReset={() => setSubmitted(false)} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative rounded-[28px]
        border border-black/10 bg-white
        p-7 backdrop-blur-sm
        md:p-10
      "
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
        Get in Touch
      </p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-black md:text-[26px]">
        Send us a message
      </h2>

      <div className="mt-7 grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
        <FormField
          label="Name"
          value={data.name}
          onChange={update('name')}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={data.email}
          onChange={update('email')}
          required
        />
        <FormField
          label="Phone Number"
          type="tel"
          value={data.phone}
          onChange={update('phone')}
          optional
          className="md:col-span-2"
        />
        <FormField
          label="Message"
          value={data.message}
          onChange={update('message')}
          required
          textarea
          rows={3}
          className="md:col-span-2"
        />
      </div>

      <button
        type="submit"
        className="
          group mt-7 inline-flex items-center gap-3 rounded-full
          bg-red-500 px-7 py-3
          text-[12px] font-bold uppercase tracking-[0.22em] text-white
          transition-all duration-300
          hover:bg-red-600
          hover:shadow-[0_8px_24px_-8px_rgba(220,38,38,0.6)]
        "
      >
        Send Message
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        >
          <path d="M3 8 H13" strokeLinecap="round" />
          <path
            d="M9 4 L13 8 L9 12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  optional,
  textarea,
  rows,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  optional?: boolean;
  textarea?: boolean;
  rows?: number;
  className?: string;
}) {
  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(e.target.value);

  const fieldClasses = `
    mt-1.5 w-full bg-transparent
    border-b border-black/20
    py-2 text-[15px] text-black placeholder-black/30
    transition-colors duration-200
    focus:border-red-500 focus:outline-none
  `;

  return (
    <div className={className}>
      <label className="block text-[10px] font-medium uppercase tracking-[0.24em] text-black/55">
        {label}
        {optional && (
          <span className="ml-2 normal-case text-black/30">(optional)</span>
        )}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={handle}
          required={required}
          rows={rows ?? 3}
          className={`${fieldClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={handle}
          required={required}
          className={fieldClasses}
          autoComplete={
            type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'name'
          }
        />
      )}
    </div>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="
        relative flex flex-col items-center rounded-[28px]
        border border-red-500/25 bg-red-500/[0.06]
        p-10 text-center
        md:p-14
      "
    >
      <div
        className="
          flex h-14 w-14 items-center justify-center rounded-full
          bg-red-500/20
          ring-1 ring-red-500/40
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-7 w-7 text-red-500"
          aria-hidden
        >
          <path
            d="M5 12 L10 17 L19 8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="mt-6 text-[26px] font-semibold tracking-tight text-black">
        Message sent.
      </h2>
      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-black/65 md:text-[15px]">
        Thanks for reaching out. A member of our sales team will get back to
        you within 24 hours.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="
          mt-8 inline-flex items-center gap-2 rounded-full
          border border-black/20 px-6 py-2.5
          text-[11px] font-bold uppercase tracking-[0.22em] text-black/70
          transition-colors duration-200
          hover:border-black/40 hover:text-black
        "
      >
        Send another message
      </button>
    </div>
  );
}
