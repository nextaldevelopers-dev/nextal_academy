import { UserPlus } from 'lucide-react';
export default function CtaBanner({ onOpenEnrollModal }) {
  return (
    <section className="section" style={{ padding: '0 0 5rem 0', backgroundColor: '#ffffff', transition: 'color 0.3s ease' }}>
      <div className="container-fluid">
        <div id="enroll" className="cta-banner" style={{ borderRadius: 'var(--radius-lg)', margin: '3rem 0' }}>
          <div className="cta-content anim-text delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <h2 style={{ color: 'inherit' }}>
              Master In-Demand Digital Skills at Nextal Academy
            </h2>
            <p style={{ color: 'inherit', opacity: 0.85, marginTop: '1rem', marginBottom: '2rem' }}>
              Launch your career in Development, AI, UI/UX, Motion Graphics, and Marketing. Transform your passion into professional skills with our expert-led training.
            </p>
            <div className="cta-button-wrapper">
              <button className="btn btn-secondary" onClick={onOpenEnrollModal} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                <UserPlus size={20} /> Join Nextal Academy Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
