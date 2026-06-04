'use client';

/* eslint-disable @next/next/no-img-element */
import type { RefObject } from 'react';

export type GrillWindowProps = {
  innerRef: RefObject<HTMLDivElement | null>;
  meshSrc?: string;
  /** Generator blueprint PNG painted as the pre-press grill backdrop. Optional —
   * the CSS layer has a fallback gradient if the asset hasn't loaded yet. */
  blueprintSrc?: string;
};

export default function GrillWindow({
  innerRef,
  meshSrc,
  blueprintSrc,
}: GrillWindowProps) {
  return (
    <div className="pz-grill">
      <div className="pz-grill__inner" ref={innerRef}>
        <div className="pz-grill__glow" />
        <div
          className="pz-grill__gen"
          style={
            blueprintSrc
              ? ({ '--pz-gen-bp': `url(${blueprintSrc})` } as React.CSSProperties)
              : undefined
          }
        />
        <img
          className="pz-grill__mesh"
          src={meshSrc}
          alt=""
          draggable={false}
        />
        <div className="pz-grill__scan" />
      </div>
      {/* Matches the schematic readout below — same physical machine
          (FPT C13 TE3A, 442 kVA ESP) referenced from both spots. */}
      <div className="pz-grill__tag">
        <span className="pz-grill__model">PZ&nbsp;·&nbsp;FPT&nbsp;C13&nbsp;TE3A</span>
        <span className="pz-grill__sub">442&nbsp;kVA Standby Genset</span>
      </div>
    </div>
  );
}
