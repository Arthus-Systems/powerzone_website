/* hero.jsx — the homepage hero that the cinematic lands on.
   Fades in over the video's final (fully-lit) frame. Copy is on-brand
   PLACEHOLDER — adjust headline / CTAs / nav to taste. */

const ASSET_H = '../../assets';

function HeroNav() {
  return (
    <nav className="pz-hnav">
      <img className="pz-hnav__logo" src={`${ASSET_H}/logo-on-dark.png`} alt="Power Zone" draggable="false" />
      <div className="pz-hnav__links">
        <a className="pz-hnav__link" href="#">Generators</a>
        <a className="pz-hnav__link" href="#">Power Systems</a>
        <a className="pz-hnav__link" href="#">Service</a>
        <a className="pz-hnav__link" href="#">About</a>
      </div>
      <a className="pz-hnav__cta" href="#">Request a Quote</a>
    </nav>
  );
}

function HeroSection({ show, onReplay }) {
  return (
    <div className={'pz-hero' + (show ? ' is-show' : '')} aria-hidden={!show}>
      <div className="pz-hero__scrim" />
      <HeroNav />
      <div className="pz-hero__body">
        <div className="pz-hero__eyebrow pz-label pz-label--muted">Critical Power Solutions</div>
        <h1 className="pz-hero__title">
          When the grid goes dark,<br />we keep you running.
        </h1>
        <p className="pz-hero__sub">
          Industrial diesel generators and automatic transfer systems engineered for
          hospitals, data centers, and utilities that cannot afford to stop.
        </p>
        <div className="pz-hero__cta">
          <a className="pz-btn pz-btn--primary" href="#">Explore Generators</a>
          <a className="pz-btn pz-btn--ghost" href="#">Talk to an Engineer</a>
        </div>
        <div className="pz-hero__stats">
          <div className="pz-hero__stat"><span className="pz-hero__statN">10&nbsp;s</span><span className="pz-hero__statL">Auto-start transfer</span></div>
          <div className="pz-hero__stat"><span className="pz-hero__statN">99.999%</span><span className="pz-hero__statL">Uptime delivered</span></div>
          <div className="pz-hero__stat"><span className="pz-hero__statN">24/7</span><span className="pz-hero__statL">Field service</span></div>
        </div>
      </div>
      <button className="pz-hero__replay" onClick={onReplay}>
        <i data-lucide="rotate-ccw"></i> Replay sequence
      </button>
    </div>
  );
}

window.HeroSection = HeroSection;
