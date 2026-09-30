import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function EnrollModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: '',
    batch: 'weekday'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const textMessage = `New Enrollment Application\n\nName: ${formData.fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCourse: ${formData.course}\nBatch: ${formData.batch}`;
    const encodedMessage = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/919487167617?text=${encodedMessage}`;
    
    // Send event to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'enrollment_whatsapp_click', {
        'event_category': 'conversion',
        'event_label': 'WhatsApp Enrollment',
        'course': formData.course
      });
    }

    window.open(whatsappUrl, '_blank');
    
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {!submitted ? (
          <div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', textAlign: 'center' }}>Enrollment Application</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              Fill out the form below to reserve your seat in the upcoming batch at Nextal Academy.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="e.g. +91 98765 43210"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="e.g. name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="course">Course Interested In</label>
                <select
                  id="course"
                  className="form-control"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="" disabled>Select a course</option>
                  <optgroup label="Digital Marketing">
                    <option value="AI Integrated Digital Marketing">AI Integrated Digital Marketing</option>
                    <option value="Diploma in Digital Marketing">Diploma in Digital Marketing</option>
                  </optgroup>
                  <optgroup label="Design & Creative">
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Designer Pro">Designer Pro</option>
                  </optgroup>
                  <optgroup label="Software Development">
                    <option value="Web Development">Web Development</option>
                    <option value="App Development">App Development</option>
                  </optgroup>
                  <optgroup label="Video Editing">
                    <option value="Basic Video Editing">Basic Video Editing</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                  </optgroup>
                  <optgroup label="Generative AI">
                    <option value="Advanced Certification in Gen AI">Advanced Certification in Gen AI</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="batch">Preferred Batch</label>
                <select
                  id="batch"
                  className="form-control"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                >
                  <option value="weekday">Weekday Regular Batch (Mon - Fri)</option>
                  <option value="weekend">Weekend Special Batch (Sat - Sun)</option>
                  <option value="online">Online / Hybrid Batch</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--accent-coral-light)', color: 'var(--accent-coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Application Received!</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Thank you for registering. Our academic counseling team at Nextal Academy Nagercoil will call you shortly with batch schedules and fee details.
            </p>
            <button className="btn btn-outline-navy" style={{ marginTop: '1.5rem' }} onClick={handleClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
