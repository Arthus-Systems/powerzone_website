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
      <div className="pz-grill__tag">
        <span className="pz-grill__model">PZ&nbsp;·&nbsp;PZPT&nbsp;750</span>
        <span className="pz-grill__sub">Standby Genset</span>
      </div>
    </div>
  );
}
