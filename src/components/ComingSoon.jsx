import React, { useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ComingSoon({ title, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="coming-soon-page observe-root" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '4rem 1rem',
      backgroundColor: '#f8f9fa'
    }}>
      <div className="container text-center">
        <div className="anim-image delay-1" style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--accent-coral-light)',
          color: 'var(--accent-coral)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem auto'
        }}>
          <Clock size={40} />
        </div>
        <h1 className="anim-text delay-2" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', marginBottom: '1rem', color: '#000' }}>{title}</h1>
        <p className="anim-text delay-3" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          We're currently working hard on this page. It will be available very soon. Please check back later!
        </p>
        <button onClick={onBack} className="btn btn-primary anim-button delay-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    </div>
  );
}
