/* grill_ignition.jsx — hero controls + the reveal video.
   GrillWindow now hosts the <video> (poweron.mp4). During the dashboard it
   plays muted behind the honeycomb mesh; at the reveal, app.jsx scales
   `.pz-grill__inner` to fill the canvas while the mesh / blueprint / frame fade,
   leaving only the video — a "camera push through the grill." */

const ASSET = '../../assets';

function GrillWindow({ innerRef, videoRef, videoOn, revealing, onVideoEnded }) {
  return (
    <div className="pz-grill">
      <div className={'pz-grill__inner' + (revealing ? ' is-revealing' : '')} ref={innerRef}>
        <div className="pz-grill__glow pz-fade-grill" />
        <video
          ref={videoRef}
          className={'pz-grill__video' + (videoOn ? ' is-on' : '')}
          src="poweron.mp4"
          muted playsInline preload="auto"
          onEnded={onVideoEnded}
        />
        <div className={'pz-grill__gen pz-fade-grill' + (videoOn ? ' is-hidden' : '')} />
        <img className="pz-grill__mesh pz-fade-grill" src={`${ASSET}/mesh-grill.png`} alt="" draggable="false" />
        <div className="pz-grill__scan pz-fade-grill" />
      </div>
      <div className="pz-grill__tag pz-fade-out">
        <span className="pz-grill__model">PZ&nbsp;·&nbsp;PZPT&nbsp;750</span>
        <span className="pz-grill__sub">Standby Genset</span>
      </div>
    </div>
  );
}

function IgnitionButton({ armed, running, onPress }) {
  const state = running ? 'running' : armed ? 'armed' : 'idle';
  return (
    <div className="pz-ign">
      <button
        className={`pz-ign__btn is-${state}`}
        onClick={onPress}
        aria-label="Initiate transfer"
      >
        <img className="pz-ign__plate" src={`${ASSET}/button-initiate-transfer.png`} alt="" draggable="false" />
        <span className="pz-ign__lit" />
        <span className="pz-ign__ring" />
      </button>
      <div className="pz-ign__caption">
        {running
          ? <span className="pz-ign__cap pz-ign__cap--on">Transfer complete · Power online</span>
          : armed
            ? <span className="pz-ign__cap pz-ign__cap--arm">Arming sequence… stand clear</span>
            : <span className="pz-ign__cap">Reliable power. Engineered to perform.</span>}
      </div>
    </div>
  );
}

function Schematic({ active }) {
  return (
    <div className="pz-schematic">
      <div className="pz-schematic__grid" />
      <img
        className={'pz-schematic__img' + (active ? ' is-active' : '')}
        src={`${ASSET}/generator-blueprint.png`} alt="Diesel genset schematic" draggable="false"
      />
      <div className="pz-schematic__label pz-label">System Overview</div>
      <div className="pz-schematic__readout pz-mono">
        FPT&nbsp;C13&nbsp;TE3A · 6-CYL · 12.9L · 415kVA
      </div>
    </div>
  );
}

window.GrillWindow = GrillWindow;
window.IgnitionButton = IgnitionButton;
window.Schematic = Schematic;
