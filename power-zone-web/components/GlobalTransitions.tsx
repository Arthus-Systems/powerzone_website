'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Two transition routes, auto-detected per click:
 *
 *   • Link inside any <nav>    →  CURTAIN, direction by relative index
 *       Direction is chosen by comparing the clicked link's index
 *       within its parent <nav> to the index of the currently-active
 *       link in the same nav. Clicking a link to the LEFT of the
 *       active one sweeps the curtain in from the LEFT; clicking one
 *       to the RIGHT sweeps it in from the RIGHT. (Pattern from
 *       https://codepen.io/thecalicoder.) When the active index can't
 *       be resolved (e.g. on a page whose route isn't in the nav) we
 *       default to RIGHT so the motion still feels intentional.
 *
 *   • Link anywhere else       →  RADIAL CLIP REVEAL
 *       In-page CTAs (PeekProducts cards, Footer non-home links).
 *       A solid disc expands from the click point until it covers,
 *       then collapses back to the same point — revealing the new
 *       page from outside in, around the cursor.
 *
 * Per-link opt-out via `data-no-transition`.
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

      const nav = link.closest('nav');
      lockedRef.current = true;

      if (nav) {
        // Compute curtain direction from the clicked link's order
        // within the nav vs the currently-active link. Target to the
        // LEFT of current → curtain from LEFT; target to the RIGHT →
        // curtain from RIGHT. Unknown active falls back to RIGHT.
        const navLinks = Array.from(nav.querySelectorAll('a'));
        const targetIdx = navLinks.indexOf(link);
        const currentIdx = navLinks.findIndex((a) => {
          const aHref = a.getAttribute('href');
          if (!aHref) return false;
          try {
            return (
              new URL(aHref, window.location.href).pathname ===
              window.location.pathname
            );
          } catch {
            return false;
          }
        });

        const direction: 'left' | 'right' =
          currentIdx !== -1 && targetIdx < currentIdx ? 'left' : 'right';

        runCurtain(router, href, direction, setState, () => {
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

  // Imperative API — in-page interactions that aren't real navigations
  // (e.g. the Generators ↔ BESS catalog switch on the products page)
  // dispatch a `pz:runRadial` event with `{ x, y, onCovered }`; we play
  // the same radial reveal a CTA click would and run `onCovered` while
  // the overlay fully covers the screen, so the caller can flip state
  // out of sight.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        x: number;
        y: number;
        onCovered: () => void;
        onDone?: () => void;
      }>;
      const detail = ce.detail;
      if (!detail) return;
      if (lockedRef.current) return;
      lockedRef.current = true;
      runRadialCallback(detail.x, detail.y, detail.onCovered, setState, () => {
        lockedRef.current = false;
        detail.onDone?.();
      });
    };
    window.addEventListener('pz:runRadial', handler);
    return () => window.removeEventListener('pz:runRadial', handler);
  }, []);

  // Imperative API — directional CURTAIN variant. Same flavour as the
  // navbar curtain (enters from a chosen edge, covers, retreats to the
  // same edge), but for in-page state swaps that should feel directional
  // instead of radial — e.g. Generators ↔ BESS on the products page,
  // where the direction encodes which catalog is taking over.
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{
        from: 'left' | 'right';
        onCovered: () => void;
        onDone?: () => void;
      }>;
      const detail = ce.detail;
      if (!detail) return;
      if (lockedRef.current) return;
      lockedRef.current = true;
      runCurtainCallback(
        detail.from,
        detail.onCovered,
        setState,
        () => {
          lockedRef.current = false;
          detail.onDone?.();
        },
      );
    };
    window.addEventListener('pz:runCurtain', handler);
    return () => window.removeEventListener('pz:runCurtain', handler);
  }, []);

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

/** Variant for in-page state swaps that should feel like a navigation.
 * Covers the screen with the same radial disc, runs `onCovered` while
 * the screen is fully obscured, then uncovers — revealing whatever new
 * state the callback put in place. No router.push, no scroll reset. */
function runRadialCallback(
  x: number,
  y: number,
  onCovered: () => void,
  setState: (s: State) => void,
  done: () => void,
) {
  setState({ kind: 'radial', phase: 'covering', x, y });
  window.setTimeout(() => {
    onCovered();
    requestAnimationFrame(() => {
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

/** Directional curtain variant for in-page state swaps. Curtain enters
 * from the given edge, fully covers the viewport, runs `onCovered` (so
 * the caller can flip state out of sight), then retreats to the same
 * edge — mirroring the navbar's curtain motion. */
function runCurtainCallback(
  from: 'left' | 'right',
  onCovered: () => void,
  setState: (s: State) => void,
  done: () => void,
) {
  setState({ kind: 'curtain', phase: 'covering', from });
  window.setTimeout(() => {
    onCovered();
    requestAnimationFrame(() => {
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
