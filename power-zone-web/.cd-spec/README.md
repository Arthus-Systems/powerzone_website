# UI Kit — Control Panel (PowerZone initial page)

A pixel-faithful, **fully responsive**, interactive recreation of PowerZone's
pre-homepage "Emergency Power Management System." Built from `ControlPanel.tsx`
(layout truth) + the concept art (visual truth) + the real PNG assets.

Open **`index.html`**. Press **INITIATE TRANSFER** once and the whole cinematic
plays automatically:

1. **STANDBY → ARMING** — chevron strip sweeps, button glows amber (~1.9s).
2. **POWER ONLINE** — values ramp, gauges sweep, subsystems light green, and the
   **`poweron.mp4`** video starts playing inside the grill (a dark substation
   hall behind the honeycomb).
3. **CAMERA PUSH** (~3.4s after online) — the grill scales up to fill the canvas
   while the mesh / blueprint / dashboard fade, so the "camera" appears to move
   *through the grill* into the video. The hall lights up.
4. **HOMEPAGE HERO** — the video ends on the fully-lit hall, which becomes the
   background of the homepage hero (nav + headline + CTAs fade in).

Controls: **Skip intro** (during the push) jumps to the end; **Replay sequence**
(on the hero) and **Reset to standby** (while online) return to idle.

### The video reveal — how it works (single video, no sync)
One `<video>` lives inside `.pz-grill__inner`. The push is a FLIP-style transform
computed in `app.jsx` (`startReveal`): it measures the grill's rect in canvas
coordinates and applies `translate(...) scale(...)` so the grill inner grows to
cover the full 1760×990 canvas. Because the canvas itself fills the viewport,
"cover the canvas" reads as fullscreen. The honeycomb mesh, red blueprint, panel
frame and the rest of the dashboard carry `pz-fade-out` / `pz-fade-grill` and
cross-fade to 0 during the push — leaving only the video. No second video, no
playback syncing. Swap `poweron.mp4` for any 16:9 clip whose last frame is your
hero background. Tune timing with `REVEAL_DELAY` in `app.jsx`.

## Why it doesn't "flop" across aspect ratios
The entire dashboard is authored on a **fixed 1760×990 (16:9) canvas** and
scaled by one `transform: scale()` (`useStageScale` in `app.jsx`) to fit any
viewport, letterboxing on black. **Nothing reflows** — it just resizes.

> ⚠️ The canvas element must have `flex: none` (it's a flex child of the stage).
> Without it, flexbox shrinks the 1760px layout width down to the viewport
> *before* the transform scales it, squishing everything. This was the single
> biggest layout bug while building — keep `flex: none` on `.pz-canvas`.

## Files
| File | Role |
|---|---|
| `index.html` | Loads fonts, tokens, styles, React/Babel, Lucide; mounts the app. Script order matters: `gauges → panels → grill_ignition → app`. |
| `app.jsx` | State machine (`idle → arming → online`), value-ramp (timer-based, not rAF — survives non-painting frames), and the canvas scaler. |
| `panels.jsx` | `Header`, `StatusPill`, `ChevronStrip`, `LiveMetrics`, `SystemHealth`, `Subsystems`, `Footer`. |
| `gauges.jsx` | `Gauge` (radial SVG) + `FuelGauge` (segmented linear). No deps. |
| `grill_ignition.jsx` | `GrillWindow` (now hosts the reveal `<video>`), `IgnitionButton`, `Schematic`. |
| `hero.jsx` | `HeroSection` + top nav — the homepage hero the cinematic lands on. |
| `poweron.mp4` | The reveal video (dark substation hall → fully lit). 1920×1080, ~10s. |
| `styles.css` | All component styling, authored in canvas px. |

## Component notes
- **GrillWindow** layers a red-tinted genset (the blueprint used as a CSS
  **mask**, recolored red) behind the honeycomb `mesh-grill.png`, over a red
  radial glow. No fake "generator render" needed.
- **IgnitionButton** is the real `button-initiate-transfer.png` plate with a
  software glow overlay (`.pz-ign__lit`) that pulses amber while arming and
  turns green online — so one asset covers every state.
- **Gauges** are pure SVG (270° sweep, glowing red needle + progress arc).
- **Icons** are Lucide (1.5px stroke, red). See root README → ICONOGRAPHY.

## Known substitutions / notes
- Fonts: Saira / Saira Condensed / JetBrains Mono (brand fonts not provided).
- Icons: Lucide (bespoke set not provided).
- **Hero copy is placeholder** (`hero.jsx`) — headline, CTAs, nav links, and
  stats are on-brand stand-ins. Replace with real homepage content.
- The original `useIntroTimeline` (GSAP) drove the same idea; this kit
  reimplements the push with a CSS transform so it has no GSAP dependency.
