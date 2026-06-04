'use client';

import type { CSSProperties } from 'react';

export type ChevronStripProps = {
  count?: number;
  lit?: number;
};

export default function ChevronStrip({ count = 5, lit = 0 }: ChevronStripProps) {
  return (
    <div className="pz-chevrons" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={'pz-chevrons__c' + (i < lit ? ' is-lit' : '')}
          style={{ '--i': i } as CSSProperties}
        />
      ))}
    </div>
  );
}
