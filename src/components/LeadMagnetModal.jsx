import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Download } from 'lucide-react';
import { funnelConfig } from '../config/funnelConfig';

export default function LeadMagnetModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });

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

  const validatePhone = (phone) => {
    // Basic Indian 10-digit validation. Accepts with or without +91
    const stripped = phone.replace(/\D/g, '');
    if (stripped.length === 10) {
        return /^[6-9]\d{9}$/.test(stripped);
    } else if (stripped.length === 12 && stripped.startsWith('91')) {
        return /^[6-9]\d{9}$/.test(stripped.substring(2));
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      source: 'syllabus_download',
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    // Send data to PHP mailer in the background
    fetch('/lead_mailer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Silent lead capture error:', err));

    // Send event to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'download_syllabus', {
        'event_category': 'engagement',
        'event_label': 'Syllabus Download',
        'course': formData.course || 'Not specified'
      });
    }

    // Simulate brief processing, then download
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      localStorage.setItem('nextal_lead_submitted', 'true');
      
      // Graceful fallback: check if PDF exists
      fetch(funnelConfig.syllabusUrl, { method: 'HEAD' })
        .then(res => {
          const contentType = res.headers.get('content-type');
          if (res.ok && contentType && contentType.includes('application/pdf')) {
            const link = document.createElement('a');
            link.href = funnelConfig.syllabusUrl;
            link.download = funnelConfig.syllabusUrl.split('/').pop() || 'syllabus.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            setErrorMsg('The syllabus PDF is currently being updated and will be available shortly.');
            setSubmitted(false);
          }
        })
        .catch(() => {
          setErrorMsg('Failed to initiate download. Please try again later.');
          setSubmitted(false);
        });
    }, 600);
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitted(false);
      setFormData({ fullName: '', phone: '' });
      setErrorMsg('');
      onClose();
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal" disabled={loading}>
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(142,68,173,0.1)', color: '#8e44ad', marginBottom: '1rem' }}>
                 <Download size={24} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Download Syllabus</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Enter your details to instantly receive the complete course curriculum PDF.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="lm-fullName">Full Name</label>
                <input
                  type="text"
                  id="lm-fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lm-phone">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  id="lm-phone"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              {errorMsg && (
                <div style={{ color: '#ff4757', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Processing...' : 'Get Syllabus Now'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={64} color="#00C896" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Success!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Your syllabus download should begin automatically. If it doesn't, click the button below.
            </p>
            <a href={funnelConfig.syllabusUrl} download className="btn btn-primary" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center' }}>
              Download PDF Again
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
