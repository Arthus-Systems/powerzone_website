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
  const idle = !armed && !running;
  const [pressedFlash, setPressedFlash] = useState(false);

  const handleClick = () => {
    if (!idle) return;
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
            Press to initiate transfer
            <span className="pz-ign__arrow">↓</span>
          </>
        ) : (
          'Transfer in progress'
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
