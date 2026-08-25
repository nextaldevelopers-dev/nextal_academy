import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Placement({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="observe-root" style={{ minHeight: 'calc(100vh - 400px)', paddingBlock: 'var(--section-spacing-md)', backgroundColor: '#ffffff' }}>
      <div className="container-fluid">
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            className="btn btn-secondary back-btn" 
            onClick={onBack}
            style={{ color: 'var(--text-primary)', borderColor: 'var(--text-primary)' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <section className="placement-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 'var(--space-xl)', alignItems: 'start' }}>
          <div className="anim-text delay-1">
            <h1 className="section-title">Placement</h1>
            <p className="placement-body" style={{ fontSize: 'var(--text-base)', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              Many IT professionals face unexpected job losses due to layoffs, automation, and changing market demands. 
              Staying updated with the latest technologies is essential to remain competitive in the industry. 
              Continuous upskilling and hands-on project experience significantly improve career opportunities. 
              The right training can help transform uncertainty into a successful new career path.
            </p>

            <h3 className="placement-subheading" style={{ fontSize: 'var(--text-xl)', color: 'var(--navy-deep)', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)', fontWeight: '700' }}>
              What They Lack
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Industry-Ready Training',
                'Hands-on Live Projects',
                'Placement Assistance',
                'AI-Powered Career Development'
              ].map((point, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>
                  <CheckCircle size={20} className="placement-bullet-icon" style={{ flexShrink: 0, color: 'var(--accent-coral)' }} />
                  <span className="placement-bullet-text" style={{ fontWeight: '500' }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="anim-image delay-2 placement-image-wrapper">
            <img src="/placement.webp" alt="Placement and Career Opportunities" loading="lazy" decoding="async" style={{ maxWidth: '450px', width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)' }} />
          </div>
        </section>

        {/* Placed Students Category */}
        <section style={{ paddingBlock: 'var(--section-spacing-md)', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title animated-heading-shimmer anim-text delay-1" style={{ marginTop: '0.75rem', marginBottom: '0' }}>Our Successors</h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem',
            width: '100%',
            margin: '0' 
          }}>
            {[
              'Adhul', 'Arun', 'Dinesh', 'Nihal', 'Rahul', 'Renisha', 'Reshma', 'Vijin', 'Vinisha'
            ].map((name, idx) => (
              <div key={idx} className={`anim-card delay-${(idx % 4) + 1}`} style={{ 
                borderRadius: 'var(--radius-lg)', 
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--bg-surface)'
              }}>
                <img loading="lazy" decoding="async" 
                  src={`/placement/${name}.webp`} 
                  alt={`${name} Placement`} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
