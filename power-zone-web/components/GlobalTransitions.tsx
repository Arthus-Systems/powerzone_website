'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Three transition routes, auto-detected per click:
 *
 *   • Link href === '/'        →  CURTAIN FROM LEFT
 *       Logos and any "Home" link (Footer column, etc.). Panel
 *       sweeps in from the LEFT edge, covers, sweeps back left.
 *
 *   • Link inside any <nav>    →  CURTAIN FROM RIGHT
 *       Top navbar items going to non-home pages. Panel sweeps in
 *       from the RIGHT edge, covers, sweeps back right. (Pattern
 *       from https://codepen.io/thecalicoder.)
 *
 *   • Link anywhere else       →  RADIAL CLIP REVEAL
 *       In-page CTAs (PeekProducts cards, Footer non-home links).
 *       A solid disc expands from the click point until it covers,
 *       then collapses back to the same point — revealing the new
 *       page from outside in, around the cursor.
 *
 * Per-link opt-out via `data-no-transition` (e.g. ProductExperience
 * logo in detail mode, which has its own click handler).
 *
 * Same-URL clicks (already on this route) bail out before any
 * transition starts — clicking the currently-active nav button is a
 * no-op, no flash of overlay.
 */

type Idle = { kind: 'idle' };
type CurtainState = {
  kind: 'curtain';
  phase: 'covering' | 'uncovering';
  from: 'left' | 'right';
};
type RadialState = {
  kind: 'radial';
  phase: 'covering' | 'uncovering';
  x: number;
  y: number;
};
type State = Idle | CurtainState | RadialState;

const CURTAIN_MS = 550;
const RADIAL_MS = 650;

// Both overlays share a near-black surface so they read as a single
// branded transition language even though the motion shapes differ.
const OVERLAY_BG = '#0F0F0F';

const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const; // codepen original
const RADIAL_EASE = [0.65, 0, 0.35, 1] as const; // easeInOutQuart

export default function GlobalTransitions({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const lockedRef = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (lockedRef.current) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = (e.target as HTMLElement | null)?.closest('a');
      if (!link) return;
      if (link.dataset.noTransition !== undefined) return;

      const href = link.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      )
        return;
      if (link.target === '_blank') return;
      if (link.hasAttribute('download')) return;

      const url = new URL(href, window.location.href);
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        // Clicking the already-active nav button: no transition. Still
        // preventDefault so Next.js doesn't do its own no-op navigation
        // that might re-mount client state.
        e.preventDefault();
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();

      const isHome = url.pathname === '/';
      const isNavbar = link.closest('nav') !== null;
      lockedRef.current = true;

      if (isHome) {
        // Logo (and any other "Home" link) — curtain from LEFT.
        runCurtain(router, href, 'left', setState, () => {
          lockedRef.current = false;
        });
      } else if (isNavbar) {
        // Navbar item heading to a non-home page — curtain from RIGHT.
        runCurtain(router, href, 'right', setState, () => {
          lockedRef.current = false;
        });
      } else {
        // In-page CTA — radial clip reveal centered on the click.
        runRadial(
          router,
          href,
          e.clientX,
          e.clientY,
          setState,
          () => {
            lockedRef.current = false;
          },
        );
      }
    };

    document.addEventListener('click', handler, { capture: true });
    return () =>
      document.removeEventListener('click', handler, { capture: true });
  }, [router]);

  return (
    <>
      {children}
      {state.kind === 'curtain' && (
        <CurtainOverlay phase={state.phase} from={state.from} />
      )}
      {state.kind === 'radial' && (
        <RadialOverlay phase={state.phase} x={state.x} y={state.y} />
      )}
    </>
  );
}

// ─── Transition orchestrators ──────────────────────────────────────────

type RouterPush = Pick<ReturnType<typeof useRouter>, 'push'>;

function runCurtain(
  router: RouterPush,
  href: string,
  from: 'left' | 'right',
  setState: (s: State) => void,
  done: () => void,
) {
  setState({ kind: 'curtain', phase: 'covering', from });
  window.setTimeout(() => {
    router.push(href);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        setState({ kind: 'curtain', phase: 'uncovering', from });
        window.setTimeout(() => {
          setState({ kind: 'idle' });
          done();
        }, CURTAIN_MS + 60);
      });
    });
  }, CURTAIN_MS + 40);
}

function runRadial(
  router: RouterPush,
  href: string,
  x: number,
  y: number,
  setState: (s: State) => void,
  done: () => void,
) {
  setState({ kind: 'radial', phase: 'covering', x, y });
  window.setTimeout(() => {
    router.push(href);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        setState({ kind: 'radial', phase: 'uncovering', x, y });
        window.setTimeout(() => {
          setState({ kind: 'idle' });
          done();
        }, RADIAL_MS + 60);
      });
    });
  }, RADIAL_MS + 40);
}

// ─── Overlays ──────────────────────────────────────────────────────────

function CurtainOverlay({
  phase,
  from,
}: {
  phase: 'covering' | 'uncovering';
  from: 'left' | 'right';
}) {
  // Off-screen resting position depends on which edge the curtain
  // enters from. The covering target is always 0% (full viewport);
  // the uncovering target retreats back to the same edge it came from.
  const offX = from === 'left' ? '-100%' : '100%';
  return (
    <motion.div
      initial={{ x: offX }}
      animate={{ x: phase === 'covering' ? '0%' : offX }}
      transition={{ duration: CURTAIN_MS / 1000, ease: CURTAIN_EASE }}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ backgroundColor: OVERLAY_BG }}
      aria-hidden
    />
  );
}

function RadialOverlay({
  phase,
  x,
  y,
}: {
  phase: 'covering' | 'uncovering';
  x: number;
  y: number;
}) {
  // Final radius = furthest viewport corner from click point, so the
  // disc always covers fully regardless of where the user clicked.
  const maxR =
    typeof window === 'undefined'
      ? 2000
      : Math.max(
          Math.hypot(x, y),
          Math.hypot(window.innerWidth - x, y),
          Math.hypot(x, window.innerHeight - y),
          Math.hypot(window.innerWidth - x, window.innerHeight - y),
        );

  return (
    <motion.div
      initial={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
      animate={{
        clipPath:
          phase === 'covering'
            ? `circle(${maxR}px at ${x}px ${y}px)`
            : `circle(0px at ${x}px ${y}px)`,
      }}
      transition={{ duration: RADIAL_MS / 1000, ease: RADIAL_EASE }}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ backgroundColor: OVERLAY_BG }}
      aria-hidden
    />
  );
}
