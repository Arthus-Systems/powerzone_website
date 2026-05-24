import type { Metadata } from "next";
import {
  Commissioner,
  Geist_Mono,
  Saira_Semi_Condensed,
  Sansation,
} from "next/font/google";
import "./globals.css";

// Headings / titles — Sansation. Friendly geometric sans with a
// distinctive double-storey "a" that reads as branded display copy
// without feeling generic.
const display = Sansation({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

// Body + subheadings — Commissioner. Variable humanist sans with a
// generous weight range, premium feel, pairs cleanly with Sansation
// for paragraphs, captions, and spec copy.
const body = Commissioner({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
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
});

// Mono labels (readouts, counters, eyebrow text).
const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power Zone — Generators & Energy Storage",
  description:
    "Power Zone Pakistan — diesel generators and battery energy storage solutions for industrial, commercial, and residential power.",
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
        {children}
      </body>
    </html>
  );
}
