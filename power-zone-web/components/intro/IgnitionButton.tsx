'use client';

import { useState } from 'react';

type Props = {
  armed: boolean;
  running: boolean;
  onPress: () => void;
  offSrc: string;
  pressedSrc: string;
  onSrc: string;
};

export default function IgnitionButton({ armed, running, onPress, offSrc, pressedSrc, onSrc }: Props) {
  const [pressedFlash, setPressedFlash] = useState(false);
  // Latched once the button is pressed and never reset by parent phase
  // transitions. Without this, the prompt would flip back from
  // "Initiating…" to "Press to initiate transfer" once the parent moves
  // past 'online' into 'revealing' (where both armed + running are false).
  const [hasBeenPressed, setHasBeenPressed] = useState(false);
  const idle = !hasBeenPressed && !armed && !running;

  const handleClick = () => {
    if (!idle) return;
    setHasBeenPressed(true);
    setPressedFlash(true);
    onPress();
    window.setTimeout(() => setPressedFlash(false), 500);
  };

  const src = idle ? offSrc : pressedFlash ? pressedSrc : onSrc;
  const stateClass = idle ? 'is-idle' : 'is-on';

  return (
    <div className="pz-ign">
      <div className={`pz-ign__prompt ${idle ? 'pz-ign__prompt--idle' : 'pz-ign__prompt--active'}`} aria-hidden="true">
        {idle ? (
          <>
            Press to Enter Website
            <span className="pz-ign__arrow">↓</span>
          </>
        ) : (
          'Initiating…'
        )}
      </div>
      <button type="button" className={`pz-ign__btn ${stateClass}`} onClick={handleClick} aria-label="Initiate transfer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pz-ign__plate" src={src} alt="" draggable={false} />
        <span className="pz-ign__lit" />
        <span className="pz-ign__ring" />
      </button>
    </div>
  );
}
