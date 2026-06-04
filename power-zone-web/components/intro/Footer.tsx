'use client';

export type FooterProps = Record<string, never>;

export default function Footer(_props?: FooterProps) {
  return (
    <footer className="pz-footer">
      <div className="pz-footer__left">
        <span className="pz-footer__badge">PZ</span>
        <div className="pz-footer__txt">
          <div
            className="pz-caption"
            style={{ color: 'var(--pz-fg-2)', letterSpacing: '0.14em' }}
          >
            POWER ZONE EMERGENCY MANAGEMENT SYSTEM
          </div>
          <div className="pz-mono">VERSION 2.4.0</div>
        </div>
      </div>
      <div className="pz-footer__right">
        <div
          className="pz-caption"
          style={{ color: 'var(--pz-fg-2)', letterSpacing: '0.14em' }}
        >
          INDUSTRIAL POWER SOLUTIONS
        </div>
        <div className="pz-mono">BUILT FOR CRITICAL APPLICATIONS</div>
      </div>
    </footer>
  );
}
