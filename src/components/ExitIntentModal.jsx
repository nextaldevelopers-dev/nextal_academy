import React, { useEffect } from 'react';
import { X, Gift } from 'lucide-react';

export default function ExitIntentModal({ isOpen, onClose, onClaimOffer }) {
  useEffect(() => {
    if (isOpen) {
      let count = parseInt(document.body.dataset.modalCount || '0', 10);
      if (count === 0) {
        document.body.dataset.originalOverflow = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
      }
      document.body.dataset.modalCount = count + 1;
      
      return () => {
        let currentCount = parseInt(document.body.dataset.modalCount || '1', 10) - 1;
        document.body.dataset.modalCount = currentCount;
        if (currentCount <= 0) {
          document.body.style.overflow = document.body.dataset.originalOverflow || '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757', marginBottom: '1.25rem' }}>
            <Gift size={32} />
          </div>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: '#fff' }}>Wait! Before You Go...</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.6', fontSize: '1.05rem' }}>
            Don't miss out on mastering Creative AI. Apply today and secure your spot with a <span style={{ color: '#00C896', fontWeight: 'bold' }}>special priority discount</span> on your admission fee!
          </p>
          
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} 
            onClick={() => {
              onClose();
              onClaimOffer();
            }}
          >
            Claim My Offer & Enroll Now
          </button>
          
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', marginTop: '1rem', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
          >
            No thanks, I'll pass on this opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
