'use client';

/* eslint-disable @next/next/no-img-element */

export type SchematicProps = {
  active: boolean;
  /** Genset blueprint PNG painted as the schematic art. */
  blueprintSrc: string;
};

export default function Schematic({ active, blueprintSrc }: SchematicProps) {
  return (
    <div className="pz-schematic">
      <div className="pz-schematic__grid" />
      <img
        className={'pz-schematic__img' + (active ? ' is-active' : '')}
        src={blueprintSrc}
        alt="Diesel genset schematic"
        draggable={false}
      />
      <div className="pz-schematic__label pz-label">System Overview</div>
      {/* Real FPT C13 TE3A spec sheet: inline-6, 12.882 L displacement,
          ESP rating 442 kVA / 354 kWe at 1500 rpm (50 Hz). */}
      <div className="pz-schematic__readout pz-mono">
        FPT&nbsp;C13&nbsp;TE3A · 6-CYL · 12.9L · 442&nbsp;kVA
      </div>
    </div>
  );
}
