import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Power Zone Engineering & Services',
  description:
    'Privacy policy for Power Zone Engineering & Services (PZES). Learn how we collect, use, and protect your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F4EFE7]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex h-20 items-center border-b border-white/10 bg-black/40 px-6 backdrop-blur-md md:px-12">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-on-dark.png"
            alt="Power Zone"
            draggable={false}
            className="h-10 w-auto select-none"
          />
        </Link>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-[800px] px-6 py-16 md:px-8 md:py-24">
        <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-red-600">
          Legal
        </p>
        <h1 className="mt-4 text-[clamp(32px,5vw,56px)] font-bold leading-[1.05] tracking-tight text-black">
          Privacy Policy
        </h1>
        <p className="mt-4 text-[14px] text-black/50">
          Effective Date: 15 September 2025
        </p>

        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-black/75">
          <p>
            At Power Zone Engineering &amp; Services (PZES), we respect your
            privacy. This policy explains how we handle your information when
            you use our website.
          </p>

          {/* What We Collect */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              What We Collect
            </h2>
            <ul className="space-y-2 pl-5">
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                Basic details you share (like name, email, phone) through
                forms.
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                Website usage data (such as pages visited, IP address, browser
                type).
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                Cookies to improve your browsing experience.
              </li>
            </ul>
          </section>

          {/* How We Use It */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              How We Use It
            </h2>
            <ul className="space-y-2 pl-5">
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                To respond to inquiries and provide services.
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                To share updates, proposals, and offers (only if you opt-in).
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                To improve our website and customer experience.
              </li>
            </ul>
          </section>

          {/* Sharing */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Sharing of Information
            </h2>
            <p>
              We do not sell your data. We may share limited information with
              trusted partners (e.g., hosting, analytics) or if required by
              law.
            </p>
          </section>

          {/* Third-Party Advertising */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Third-Party Advertising and Your Choices
            </h2>
            <p className="mb-4">
              This section is added to comply with Google Ads policies,
              particularly for personalized advertising (remarketing).
            </p>

            <h3 className="mb-3 text-[16px] font-semibold text-black">
              Use of Third-Party Vendors
            </h3>
            <p className="mb-6">
              We use third-party vendors, including Google, to serve our
              advertisements on websites across the Internet. These third-party
              vendors use cookies, device identifiers, or similar technologies
              to serve ads to you based on your past visits to our website (a
              practice commonly known as remarketing or personalized
              advertising).
            </p>

            <h3 className="mb-3 text-[16px] font-semibold text-black">
              Data Collection for Advertising
            </h3>
            <p className="mb-6">
              These third-party vendors, including Google, collect data
              regarding your browsing behavior on our website to analyze and
              create audience segments. This enables us to serve more relevant
              and personalized advertisements to you.
            </p>

            <h3 className="mb-3 text-[16px] font-semibold text-black">
              Your Opt-Out Rights
            </h3>
            <p className="mb-3">
              You have the right to control how your data is used for
              personalized advertising. You can opt out through the following
              methods:
            </p>
            <ul className="space-y-2 pl-5">
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                <strong>Google Ad Settings:</strong> You can opt out of
                Google&apos;s use of cookies for personalized advertising by
                visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline underline-offset-2 hover:text-red-500"
                >
                  Google&apos;s Ad Settings
                </a>
                .
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                <strong>Industry Opt-Out:</strong> Alternatively, you can opt
                out via the{' '}
                <a
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 underline underline-offset-2 hover:text-red-500"
                >
                  Network Advertising Initiative opt-out page
                </a>
                .
              </li>
            </ul>
          </section>

          {/* Your Choices */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Your Choices
            </h2>
            <ul className="space-y-2 pl-5">
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                You can ask us to update or delete your personal data anytime.
              </li>
              <li className="relative before:absolute before:left-[-1.1rem] before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-600">
                You can disable cookies in your browser, but some site features
                may not work fully.
              </li>
            </ul>
          </section>

          {/* Security */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Security
            </h2>
            <p>
              We use standard measures to keep your information safe, though no
              method is 100% secure.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Updates
            </h2>
            <p>
              We may update this policy when needed. The revised date will
              always be shown at the top.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-black/10 bg-white p-8">
            <h2 className="mb-4 text-[20px] font-semibold text-black">
              Contact
            </h2>
            <p className="mb-4">
              If you have any questions, please contact us:
            </p>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-black">Email:</span>{' '}
                <a
                  href="mailto:info@powerzone.com.pk"
                  className="text-red-600 hover:text-red-500"
                >
                  info@powerzone.com.pk
                </a>
              </li>
              <li>
                <span className="font-semibold text-black">Phone:</span>{' '}
                <a
                  href="tel:042111111087"
                  className="text-red-600 hover:text-red-500"
                >
                  042-111-111-087
                </a>
              </li>
              <li>
                <span className="font-semibold text-black">Address:</span>{' '}
                1P, 1KM, Defence off, Raiwind Road, Bhobtian Chowk, Adjacent
                University Of Lahore, Lahore, Pakistan.
              </li>
            </ul>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-black/50 transition-colors hover:text-red-600"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path d="M13 8H3M7 4L3 8 7 12" />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
