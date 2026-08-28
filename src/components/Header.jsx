import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

export default function Header({ onOpenEnrollModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileSubDropdownOpen, setMobileSubDropdownOpen] = useState(null);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Small delay to ensure CSS transitions trigger
    setTimeout(() => setMounted(true), 50);
  }, []);

  // Reset header visibility on every route change (popstate)
  useEffect(() => {
    const onRouteChange = () => {
      setIsHidden(false);
      setScrolled(false);
      lastScrollY.current = 0;
    };
    window.addEventListener('popstate', onRouteChange);
    return () => window.removeEventListener('popstate', onRouteChange);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          setScrolled(currentScrollY > 40);

          if (currentScrollY < 50) {
            // Always show when near top
            setIsHidden(false);
          } else if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
            // Hide on scroll down, show on scroll up
            setIsHidden(currentScrollY > lastScrollY.current);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeNav = () => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setMobileNavOpen(false);
    setMobileDropdownOpen(false);
    setMobileSubDropdownOpen(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileNavOpen) {
        closeNav();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen]);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}${isHidden ? ' hidden' : ''}`}>
      <div className="header-container">
        <div className="header-inner">

          {/* Brand Logo */}
          <a href="#home" className="brand-logo">
            <img
                src="/academy_logo-150.webp"
                srcSet="/academy_logo-150.webp 1x, /academy_logo-300.webp 2x"
                alt="Nextal Academy"
                width="150"
                height="150"
                style={{ height: '150px', width: 'auto', objectFit: 'contain' }}
                fetchpriority="high"
                decoding="async"
              />
          </a>

          {/* Navigation */}
          <nav id="main-nav-menu" className={`nav-menu${mobileNavOpen ? ' active' : ''}`}>
            <a href="#home"    className="nav-link" onClick={closeNav}>Home</a>
            <a href="#why-us"  className="nav-link" onClick={closeNav}>Why Us</a>

            <div className={`nav-dropdown ${mobileDropdownOpen ? 'mobile-open' : ''}`}>
              <a href="#" className="nav-link dropdown-toggle" onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth < 1024) {
                  e.stopPropagation();
                  setMobileDropdownOpen(!mobileDropdownOpen);
                }
              }}>
                Lectures <ChevronDown size={14} style={{ marginLeft: '4px', transform: mobileDropdownOpen && window.innerWidth < 1024 ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </a>
              <div className="dropdown-menu" style={{ minWidth: '240px' }}>
                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'digital' ? 'mobile-open' : ''}`}>
                  <div className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileSubDropdownOpen(mobileSubDropdownOpen === 'digital' ? null : 'digital');
                    }
                  }}>
                    Digital Marketing <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'digital' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div className="dropdown-menu">
                    <a href="/course/ai-digital-marketing" className="dropdown-item" onClick={closeNav}>AI Integrated Digital Marketing</a>
                    <a href="/course/diploma-digital-marketing" className="dropdown-item" onClick={closeNav}>Diploma in Digital Marketing</a>
                  </div>
                </div>
                
                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'design' ? 'mobile-open' : ''}`}>
                  <div className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileSubDropdownOpen(mobileSubDropdownOpen === 'design' ? null : 'design');
                    }
                  }}>
                    Design & Creative <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'design' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div className="dropdown-menu">
                    <a href="/course/ui-ux" className="dropdown-item" onClick={closeNav}>UI/UX Design</a>
                    <a href="/course/graphic-design" className="dropdown-item" onClick={closeNav}>Graphic Design</a>
                    <a href="/course/designer-pro" className="dropdown-item" onClick={closeNav}>Designer Pro</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'software' ? 'mobile-open' : ''}`}>
                  <div className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      setMobileSubDropdownOpen(mobileSubDropdownOpen === 'software' ? null : 'software');
                    }
                  }}>
                    Software Development <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'software' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div className="dropdown-menu">
                    <a href="/course/web-development" className="dropdown-item" onClick={closeNav}>Web Development</a>
                    <a href="/course/app-development" className="dropdown-item" onClick={closeNav}>App Development</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'video' ? 'mobile-open' : ''}`}>
                  <div className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileSubDropdownOpen(mobileSubDropdownOpen === 'video' ? null : 'video');
                    }
                  }}>
                    Video Editing <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'video' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div className="dropdown-menu">
                    <a href="/course/basic-video-editing" className="dropdown-item" onClick={closeNav}>Basic Video Editing</a>
                    <a href="/course/motion-graphics" className="dropdown-item" onClick={closeNav}>Motion Graphics</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'ai' ? 'mobile-open' : ''}`}>
                  <div className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      setMobileSubDropdownOpen(mobileSubDropdownOpen === 'ai' ? null : 'ai');
                    }
                  }}>
                    Generative AI <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'ai' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div className="dropdown-menu">
                    <a href="/course/adv-gen-ai" className="dropdown-item" onClick={closeNav}>Advanced Certification in Gen AI</a>
                  </div>
                </div>
              </div>
            </div>

            <a href="/placement" className="nav-link" onClick={closeNav}>Placement</a>
            <a href="/blogs"     className="nav-link" onClick={closeNav}>Blogs</a>
            <a href="#faq"       className="nav-link" onClick={closeNav}>FAQ</a>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={onOpenEnrollModal}>
              <Sparkles size={16} /> Enroll Now
            </button>
            <button
              className="mobile-toggle"
              onClick={() => setMobileNavOpen(prev => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={mobileNavOpen}
              aria-controls="main-nav-menu"
            >
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
