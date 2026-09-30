import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { CheckCircle2, Award, Bot, Send, BookOpen, Clapperboard, Video, Cpu, Film, Figma, MapPin, Briefcase, GraduationCap } from 'lucide-react';

import { lazyWithReload } from '../utils/lazyWithReload';
import { onFirstInteraction } from '../utils/onFirstInteraction';
import { SafeSuspense } from '../ErrorBoundary';

const HeroScene = lazyWithReload(() => import('./HeroScene'));

export default function Hero({ onOpenEnrollModal, onOpenLeadModal }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [speechStep, setSpeechStep] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeechStep(1);
      setTimeout(() => {
        setSpeechStep(2);
        setTimeout(() => setSpeechStep(0), 4000);
      }, 2500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3D robot (Three.js, ~250 KB + model) loads on the visitor's first mouse move, touch,
  // scroll or key press. On desktop that is almost immediate; it keeps the heavy 3D work
  // out of the initial page load that PageSpeed measures.
  useEffect(() => onFirstInteraction(() => setShouldLoad3D(true)), []);

  // GSAP Parallax & Zoom Effects — loaded dynamically post-paint so the
  // ~45KB gzip gsap+ScrollTrigger chunk never blocks Hero's initial render
  // (the parallax only matters once the user starts scrolling).
  useEffect(() => {
    let ctx;
    let cancelled = false;

    const stopWaiting = onFirstInteraction(() => Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Robot parallax & subtle zoom
          gsap.to('.hero-media-wrapper', {
            scale: 1.08,
            y: 40,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });

          // Text parallax (moves up slightly faster)
          gsap.to('.hero-content', {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }, heroRef);
      }
    ));

    return () => {
      cancelled = true;
      stopWaiting();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section id="home" className="hero-section" ref={heroRef}>
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            
            {isMobile && (
              <div className="hero-eyebrow">
                <span className="eyebrow-dot"></span> THE FUTURE STARTS HERE
              </div>
            )}

            <h1 className="hero-title lcp-element" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
              Master <span className="accent">Creative AI</span> &amp;{' '}
              <br className="desktop-br-only" />
              Build Your Future
            </h1>

            <div className="hero-evolution-steps anim-text delay-3" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'clamp(0.4rem, 2vw, 0.8rem)', 
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#ffffff'
            }}>
              <span>Learn</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span>Practise</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span>Build</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span>Grow</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span>Evolve</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ fontSize: '1.2em', fontWeight: '900', letterSpacing: '0.15em' }}>BECOME</span>
            </div>

            {!isMobile && (
              <>
                <p className="hero-subtitle lcp-element" style={{ color: '#d3d3d3' }}>
                  Premium Job-Oriented Academy in Nagercoil. Master Video Editing, Motion Graphics, Full Stack Development, and Advanced Generative AI to launch your dream career.
                </p>

                <div className="hero-actions anim-button delay-5">
                  <button className="btn btn-primary" onClick={onOpenEnrollModal}>
                    <Send size={16} /> Apply For Admission
                  </button>
                  <button onClick={() => {
                    if (window.gtag) window.gtag('event', 'syllabus_cta_click', { event_category: 'engagement', source: 'hero_desktop' });
                    onOpenLeadModal();
                  }} className="btn btn-secondary">
                    <BookOpen size={16} /> Download Syllabus
                  </button>
                </div>

                <div className="hero-trust">
                  <div className="trust-item"><Briefcase size={14} /> Placement support</div>
                  <div className="trust-dot">•</div>
                  <div className="trust-item"><Award size={14} /> Hands-on real projects</div>
                  <div className="trust-dot">•</div>
                  <div className="trust-item"><MapPin size={14} /> Nagercoil campus</div>
                </div>
              </>
            )}


          </div>

        <div className="hero-media-wrapper">
            {/* Decorative orbit behind the 3D robot + course chips on its edge (styles: end of responsive.css) */}
            <div className="hero-orbit-ring hero-deco" aria-hidden="true"></div>
            <div className="hero-orbit-chips hero-deco" aria-hidden="true">
              <div className="hero-chip chip-left"><Video size={16} /> Video Editing</div>
              <div className="hero-chip chip-top-right"><Cpu size={16} /> Generative AI</div>
              <div className="hero-chip chip-bottom-left"><Film size={16} /> Motion Graphics</div>
              <div className="hero-chip chip-right"><Figma size={16} /> UI/UX Design</div>
            </div>

            <div className="hero-image-frame anim-image delay-5" style={{ position: 'relative', background: 'transparent', padding: '0', boxShadow: 'none', border: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
              {/* Static Speech Bubble Overlay */}
              <div style={{
                position: 'absolute',
                top: isMobile ? '15%' : '18%',
                left: isMobile ? '10%' : '15%',
                zIndex: 10,
                opacity: speechStep > 0 ? 1 : 0,
                transform: `translateY(${speechStep > 0 ? '0' : '15px'}) scale(${speechStep > 0 ? 1 : 0.5})`,
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                pointerEvents: 'none',
              }}>
                <div className="robot-bubble">
                  <span style={{ 
                    fontSize: isMobile ? '0.9rem' : '1.25rem', 
                    fontWeight: 700, 
                    color: '#4B1D95', 
                    whiteSpace: isMobile ? 'normal' : 'nowrap',
                    maxWidth: isMobile ? '130px' : 'none',
                    display: 'inline-block',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}>
                    {speechStep === 1 ? 'Hi!!' : 'Welcome To Nextal'}
                  </span>
                </div>
              </div>

              {shouldLoad3D ? (
                <SafeSuspense fallback={
                  <div style={{ width: '100%', height: '100%', borderRadius: '20px', background: 'radial-gradient(circle at center, rgba(142, 68, 173, 0.15) 0%, rgba(0, 0, 0, 0) 70%)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                }>
                  <HeroScene isMobile={isMobile} />
                </SafeSuspense>
              ) : (
                <div style={{ width: '100%', height: '100%', borderRadius: '20px', background: 'radial-gradient(circle at center, rgba(142, 68, 173, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' }} />
              )}
            </div>
          </div>

          {isMobile && (
            <div className="hero-mobile-bottom-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p className="hero-subtitle lcp-element" style={{ maxWidth: '600px', color: '#d3d3d3' }}>
                Learn creative AI skills, build real projects, and grow your career.
              </p>

              <div className="hero-actions anim-button delay-5">
                <button className="btn btn-primary" onClick={onOpenEnrollModal}>
                  <Send size={16} /> Apply For Admission
                </button>
                <button onClick={() => {
                  if (window.gtag) window.gtag('event', 'syllabus_cta_click', { event_category: 'engagement', source: 'hero_mobile' });
                  onOpenLeadModal();
                }} className="btn btn-secondary">
                  <BookOpen size={16} /> Download Syllabus
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
