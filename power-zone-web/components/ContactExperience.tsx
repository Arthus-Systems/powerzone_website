'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Navbar from '@/components/Navbar';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

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
      <div className="absolute left-0 right-0 top-0 z-30">
        <Navbar />
      </div>

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
              <p className="font-tiny text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
                Contact Sales
              </p>
              <h1
                className="
                  font-heading
                  mt-4 text-[clamp(34px,4vw,56px)] font-semibold
                  leading-[1.04] tracking-tight text-black
                "
                style={{ letterSpacing: '-0.01em' }}
              >
                See how Power Zone can{' '}
                {/* font-serif removed — italic stays as a style modifier
                    but the family is now Sansation (font-heading) per the
                    "only three fonts" rule. `inline` (not block) so the
                    headline flows as one sentence and only wraps if the
                    column genuinely runs out of room. */}
                <span className="font-heading inline italic font-normal text-black/70">
                  power your project.
                </span>
              </h1>
            </div>

            <p className="font-body max-w-md text-[14px] leading-relaxed text-black/65 md:text-[15px]">
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
      <p className="font-tiny text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
        {label}
      </p>
      <p className="font-body mt-1 text-[15px] text-black transition-colors group-hover:text-red-600 md:text-[16px]">
        {value}
      </p>
    </a>
  );
}

function OfficesSection() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <p className="font-tiny mb-3 text-[10px] font-medium uppercase tracking-[0.32em] text-black/40">
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
                font-tiny
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

      {/* Selected city's address — fixed-height container so switching
          between offices (each address is a different length) doesn't
          change the column height and shift the form card on the right.
          min-h reserves space for the longest 3-line address (Karachi). */}
      <div
        className="mt-3 flex max-w-md items-start gap-2.5 text-[12px] leading-relaxed text-black/55 md:text-[13px]"
        style={{ minHeight: '4em' }}
      >
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="mt-[3px] h-3 w-3 flex-shrink-0 text-red-500/80"
          fill="currentColor"
        >
          <path d="M6 0C3.79 0 2 1.79 2 4c0 2.5 4 8 4 8s4-5.5 4-8c0-2.21-1.79-4-4-4Zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        </svg>
        <span className="font-body">{OFFICES[active].address}</span>
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
      <p className="font-tiny text-[11px] font-medium uppercase tracking-[0.32em] text-red-500">
        Get in Touch
      </p>
      <h2 className="font-heading mt-2 text-[22px] font-semibold tracking-tight text-black md:text-[26px]">
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

      <div className="mt-7 text-black">
        <InteractiveHoverButton type="submit">
          Send Message
        </InteractiveHoverButton>
      </div>
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
    font-body
    mt-1.5 w-full bg-transparent
    border-b border-black/20
    py-2 text-[15px] text-black placeholder-black/30
    transition-colors duration-200
    focus:border-red-500 focus:outline-none
  `;

  return (
    <div className={className}>
      <label className="font-tiny block text-[10px] font-medium uppercase tracking-[0.24em] text-black/55">
        {label}
        {optional && (
          <span className="font-tiny ml-2 normal-case text-black/30">(optional)</span>
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

      <h2 className="font-heading mt-6 text-[26px] font-semibold tracking-tight text-black">
        Message sent.
      </h2>
      <p className="font-body mt-2 max-w-sm text-[14px] leading-relaxed text-black/65 md:text-[15px]">
        Thanks for reaching out. A member of our sales team will get back to
        you within 24 hours.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="
          font-tiny
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
