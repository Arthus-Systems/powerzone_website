"use client";

/* -----------------------------------------------------------------------------
 * RatingTable — manufacturer model/rating reference table, shown in the
 * product detail panels. One product may carry multiple tables (Cummins
 * has AOSIF + UAE manufacturer variants), so this component handles
 * either a single table or a stack of titled tables.
 *
 * Color is data-driven: parent passes BOTH the foreground color (text,
 * borders, row-tint via opacity) AND the surface bg (solid header
 * background so scrolled rows don't bleed through the sticky thead).
 *
 * Two layout modes:
 *   fillParent=false (default) — each table caps at a fixed max-h and
 *     they stack in normal flow. Used on mobile where the whole page
 *     scrolls vertically and the table can pick its own height.
 *   fillParent=true — outer uses flex-col h-full; for multi-table cases
 *     each table block gets `min-h-0 flex-1` so they SHARE the
 *     available height equally. Used on desktop's panel-1 right side
 *     where the parent provides a bounded box and a 2-table Cummins
 *     case would otherwise overflow that 100vh panel.
 *
 * Scroll behaviour: the table has a native scrollbar (always visible
 * for the columns that overflow). Wheel/touchpad gestures over the
 * table do NOT scroll the table — they continue to drive the page
 * (Lenis catches them via the global wheel handler, since this
 * component does NOT set data-lenis-prevent). The ONLY way to scroll
 * the table internally is by clicking + dragging the scrollbar. This
 * matches the customer ask: "make it only scrollable through the
 * scroll bar nothing else."
 * -------------------------------------------------------------------------- */

import type { RatingTable as RatingTableType } from "@/data/products";

type Props = {
  tables: RatingTableType[];
  /** Foreground color — drives text, borders, row tint via opacity.
   *  Typically textOn(parentBg). Pass #000000 or #FFFFFF. */
  fg: string;
  /** Solid surface background color — used as the sticky thead's
   *  background so rows scrolling underneath the header don't show
   *  through. Pass the same color the parent panel is painted with. */
  bg: string;
  /** When true, the component fills its parent's height; for multi-
   *  table products each table shares the available height equally. */
  fillParent?: boolean;
  className?: string;
};

export default function RatingTable({
  tables,
  fg,
  bg,
  fillParent = false,
  className,
}: Props) {
  if (!tables || tables.length === 0) return null;

  const stripHash = (c: string) => (c.startsWith("#") ? c.slice(1) : c);
  const fgHex = stripHash(fg);
  const borderColor = `#${fgHex}22`;
  const rowAltBg = `#${fgHex}06`;
  const headerColor = `#${fgHex}AA`;

  const isMulti = tables.length > 1;

  // Layout root: in fillParent mode it's a flex column that owns the
  // available height; otherwise it's a plain block in document flow.
  const rootClass = [
    fillParent ? "flex h-full flex-col gap-4" : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {tables.map((table, ti) => {
        const blockClass = [
          // In fillParent + multi-table mode, each block stretches to
          // share the available height (flex-1 + min-h-0 so the inner
          // scroll container can actually constrain).
          fillParent && isMulti ? "flex min-h-0 flex-1 flex-col" : undefined,
          // In document-flow mode, separate stacked tables with mt-8.
          !fillParent && ti > 0 ? "mt-8" : undefined,
          // In fillParent + single-table mode, just let the inner
          // scroll container own the full flex height.
          fillParent && !isMulti ? "flex min-h-0 flex-1 flex-col" : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        const scrollClass = [
          "overflow-y-scroll overflow-x-hidden rounded-md",
          fillParent ? "min-h-0 flex-1" : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        const scrollStyle: React.CSSProperties = {
          border: `1px solid ${borderColor}`,
          // overscrollBehavior:contain still scoped here so even if
          // someone tries wheeling (Lenis catches it instead but as
          // belt-and-suspenders), no chain to page.
          overscrollBehavior: "contain",
        };
        if (!fillParent) {
          // Page-flow mode (mobile): cap per-table height so a 60-row
          // table doesn't dominate the page. Multi-table uses a smaller
          // cap so both tables can fit on-screen together.
          scrollStyle.maxHeight = isMulti ? "44vh" : "62vh";
        }

        return (
          <div key={ti} className={blockClass}>
            {table.title && (
              <p
                className="font-mono mb-3 text-[10px] uppercase tracking-[0.32em]"
                style={{ color: headerColor }}
              >
                {table.title}
              </p>
            )}
            {/* No data-lenis-prevent on purpose: Lenis intercepts ALL
                wheel events globally, so wheels over the table go to
                the page instead of scrolling the table. The only way
                to scroll the table is by dragging the native scrollbar
                (Lenis doesn't intercept scrollbar drag events — the
                browser routes those directly to the scroll container). */}
            <div className={scrollClass} style={scrollStyle}>
              <table
                className="w-full border-collapse text-left"
                style={{ tableLayout: "fixed" }}
              >
                <thead
                  /* SOLID bg + explicit z-index so scrolled rows can't
                     show through the sticky header. Previously the
                     header was a translucent #fgHex10 overlay and rows
                     bled through during scroll. */
                  className="sticky top-0 z-10"
                  style={{ backgroundColor: bg, color: headerColor }}
                >
                  <tr>
                    {table.headers.map((h, hi) => (
                      <th
                        key={hi}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] px-3 py-2.5 md:px-4 md:py-3"
                        style={{
                          borderBottom: `1px solid ${borderColor}`,
                          whiteSpace: "nowrap",
                          backgroundColor: bg,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ color: fg }}>
                  {table.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      style={{
                        backgroundColor: ri % 2 === 1 ? rowAltBg : undefined,
                      }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="font-body text-[11px] md:text-[12px] px-2.5 py-2 md:px-3 md:py-2.5"
                          style={{
                            borderBottom: `1px solid ${borderColor}`,
                            opacity: 0.85,
                            fontVariantNumeric: "tabular-nums",
                            /* No more whiteSpace:nowrap — engine model
                               strings (e.g. "6CTAA8.3-G9/231KW") get a
                               break opportunity at the slash and can
                               wrap if the column is tight. Combined
                               with table-layout:fixed (above) this
                               keeps the Cummins AOSIF 3-col table from
                               forcing a horizontal scrollbar inside
                               the panel. */
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
