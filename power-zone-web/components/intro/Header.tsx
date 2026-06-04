'use client';

/* eslint-disable @next/next/no-img-element */
import ChevronStrip from './ChevronStrip';
import StatusPill from './StatusPill';
import type { Tone } from './types';

export type HeaderProps = {
  status: string;
  tone: Tone;
  standby: string;
  chevronsLit: number;
  logoSrc?: string;
};

export default function Header({
  status,
  tone,
  standby,
  chevronsLit,
  logoSrc = '/images/logo-on-dark.webp',
}: HeaderProps) {
  return (
    <header className="pz-header">
      <div className="pz-header__logoWrap">
        <img
          className="pz-header__logo"
          src={logoSrc}
          alt="Power Zone"
          width={156}
          height={48}
          draggable={false}
        />
      </div>
      <ChevronStrip count={5} lit={chevronsLit} />
      <h1 className="pz-header__mode pz-status pz-status--off">{standby}</h1>
      <div className="pz-header__pill">
        <StatusPill state={status} tone={tone} />
      </div>
    </header>
  );
}
