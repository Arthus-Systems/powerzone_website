import type { Metadata } from "next";
import {
  Commissioner,
  Geist_Mono,
  Saira_Semi_Condensed,
} from "next/font/google";
import localFont from "next/font/local";
import GlobalTransitions from "@/components/GlobalTransitions";
import "./globals.css";

// Headings / titles — Sansation. Friendly geometric sans with a
// distinctive double-storey "a" that reads as branded display copy
// without feeling generic. Hosted from /public/fonts/ via
// next/font/local because Google Fonts doesn't publish CLS-reduction
// metric data for Sansation (caused the noisy "Failed to find font
// override values" warning every dev compile). Self-hosting bypasses
// the metric lookup entirely.
const display = localFont({
  variable: "--font-display",
  src: [
    { path: "../public/fonts/Sansation-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Sansation-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Sansation-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  adjustFontFallback: false,
});

// Body + subheadings — Commissioner. Variable humanist sans with a
// generous weight range, premium feel, pairs cleanly with Sansation
// for paragraphs, captions, and spec copy.
const body = Commissioner({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

// Action buttons — Saira Semi Condensed. Narrower, slightly technical
// face that visually distinguishes CTAs from body text at a glance.
// Applied site-wide to <button> elements via a default rule in
// globals.css; explicit `font-action` utility available for any other
// CTA-like element.
const action = Saira_Semi_Condensed({
  variable: "--font-action",
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
      className={`${display.variable} ${body.variable} ${action.variable} ${mono.variable} h-full antialiased`}
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
