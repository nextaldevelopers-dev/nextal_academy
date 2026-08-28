import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const faqs = [
    {
      q: "Do I need prior editing experience?",
      a: "No. This course is 100% beginner-friendly and suitable for anyone interested in learning video editing from scratch."
    },
    {
      q: "Which software will I learn?",
      a: "You will receive practical training in Adobe Premiere Pro, Adobe After Effects, Adobe Audition basics, CapCut, Canva Video Editor, and cutting-edge AI-powered video editing tools."
    },
    {
      q: "Will I build a professional portfolio?",
      a: "Yes. Throughout the course, you'll work on real-world editing projects to create a complete video portfolio that showcases your skills to employers and clients."
    },
    {
      q: "Is placement assistance available?",
      a: "Yes. We provide resume support, interview preparation, internship opportunities, and placement assistance with partner agencies and companies."
    },
    {
      q: "Will I receive a certificate?",
      a: "Yes. Upon successful completion, you'll receive an official Video Editing Course Completion Certificate from Nextal Academy."
    }
  ];

  // Auto-play removed for better UX and to fix index misalignment on mobile

  return (
    <section id="faq" className="section" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="text-center mx-auto">
          <h2 className="section-title anim-text delay-2">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto anim-text delay-3" style={{ color: '#888888', maxWidth: '100%' }}>
            Here are answers to the most common questions<br />
            about our Video Editing Course in Nagercoil.
          </p>
        </div>

        <div 
          className="faq-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {faqs.map((faq, idx) => {
            const isActive = activeIndex === idx;
            return (
              <div key={idx} className={`faq-card anim-card ${isActive ? 'active' : ''}`} style={{ '--card-index': idx + 3 }}>
                <button 
                  className="faq-header" 
                  onClick={() => setActiveIndex(isActive ? -1 : idx)}
                  aria-expanded={isActive}
                  aria-controls={`faq-answer-${idx}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: 'inherit'
                  }}
                >
                  <span>{faq.q}</span>
                  <div className="faq-icon">
                    <ChevronDown size={18} />
                  </div>
                </button>
                <div 
                  id={`faq-answer-${idx}`}
                  className="faq-body"
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
