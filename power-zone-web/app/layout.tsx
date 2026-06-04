import type { Metadata } from "next";
import {
  Commissioner,
  Geist_Mono,
  Sansation,
  Saira_Semi_Condensed,
} from "next/font/google";
import GlobalTransitions from "@/components/GlobalTransitions";
import "./globals.css";

// Headings / titles — Sansation. Friendly geometric sans with a
// distinctive double-storey "a" that reads as branded display copy
// without feeling generic. Loaded via next/font/google and exposed as
// --font-heading for Tailwind's font-heading utility.
const heading = Sansation({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Body + subheadings — Commissioner. Variable humanist sans with a
// generous weight range, premium feel, pairs cleanly with Sansation
// for paragraphs, captions, and spec copy.
const body = Commissioner({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

// Tiny / CTA / labels — Saira Semi Condensed. Narrower, slightly
// technical face that visually distinguishes CTAs, eyebrows, and
// micro-copy from body text at a glance. Exposed as --font-tiny;
// applied site-wide to <button> elements via a default rule in
// globals.css.
const tiny = Saira_Semi_Condensed({
  variable: "--font-tiny",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
});

// Mono labels (readouts, counters, eyebrow text).
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power Zone — Generators & Batteries",
  description:
    "Power Zone Pakistan — diesel generators and battery energy storage solutions for industrial, commercial, and residential power.",
  icons: {
    icon: '/images/logo-on-light.webp',
    shortcut: '/images/logo-on-light.webp',
    apple: '/images/logo-on-light.webp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Suppresses the React hydration warning when browser extensions
      // (Grammarly, Qbasis, password managers, etc.) inject attributes
      // onto the <html>/<body> before hydration. The mismatch is in
      // those extension-added attributes, not in our markup.
      suppressHydrationWarning
      className={`${heading.variable} ${body.variable} ${tiny.variable} ${mono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-body"
      >
        <GlobalTransitions>{children}</GlobalTransitions>
      </body>
    </html>
  );
}
