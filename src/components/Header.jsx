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

  const toggleSubCategory = (categoryKey) => {
    setMobileSubDropdownOpen(prev =>
      prev === categoryKey ? null : categoryKey
    );
  };

  useEffect(() => {
    // Small delay to ensure CSS transitions trigger
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
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
  }, [mobileNavOpen]);

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

  // Reset dropdown accordion states whenever mobile nav closes
  useEffect(() => {
    if (!mobileNavOpen) {
      setMobileDropdownOpen(false);
      setMobileSubDropdownOpen(null);
    }
  }, [mobileNavOpen]);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}${isHidden ? ' hidden' : ''}`}>
      <div className="header-container">
        <div className="header-inner">

          {/* Brand Logo */}
          <a href="#home" className="brand-logo">
            <img
                src="/academy_logo.webp"
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
              <a href="#" role="button" aria-expanded={mobileDropdownOpen} aria-controls="lectures-dropdown" className="nav-link dropdown-toggle" onClick={(e) => {
                e.preventDefault();
                if (window.innerWidth < 1024) {
                  e.stopPropagation();
                  setMobileDropdownOpen(prev => {
                    const next = !prev;
                    if (!next) {
                      setMobileSubDropdownOpen(null);
                    }
                    return next;
                  });
                }
              }}>
                Lectures <ChevronDown size={14} style={{ marginLeft: '4px', transform: mobileDropdownOpen && window.innerWidth < 1024 ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </a>
              <div id="lectures-dropdown" className="dropdown-menu" style={{ minWidth: '240px' }}>
                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'digital' ? 'mobile-open' : ''}`}>
                  <div role="button" tabIndex={0} aria-expanded={mobileSubDropdownOpen === 'digital'} aria-controls="digital-dropdown" className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubCategory('digital');
                    }
                  }} onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 1024) {
                      e.preventDefault();
                      toggleSubCategory('digital');
                    }
                  }}>
                    Digital Marketing <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'digital' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div id="digital-dropdown" className="dropdown-menu">
                    <a href="/course/ai-digital-marketing" className="dropdown-item" onClick={closeNav}>AI Integrated Digital Marketing</a>
                    <a href="/course/diploma-digital-marketing" className="dropdown-item" onClick={closeNav}>Diploma in Digital Marketing</a>
                  </div>
                </div>
                
                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'design' ? 'mobile-open' : ''}`}>
                  <div role="button" tabIndex={0} aria-expanded={mobileSubDropdownOpen === 'design'} aria-controls="design-dropdown" className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubCategory('design');
                    }
                  }} onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 1024) {
                      e.preventDefault();
                      toggleSubCategory('design');
                    }
                  }}>
                    Design & Creative <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'design' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div id="design-dropdown" className="dropdown-menu">
                    <a href="/course/ui-ux" className="dropdown-item" onClick={closeNav}>UI/UX Design</a>
                    <a href="/course/graphic-design" className="dropdown-item" onClick={closeNav}>Graphic Design</a>
                    <a href="/course/designer-pro" className="dropdown-item" onClick={closeNav}>Designer Pro</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'software' ? 'mobile-open' : ''}`}>
                  <div role="button" tabIndex={0} aria-expanded={mobileSubDropdownOpen === 'software'} aria-controls="software-dropdown" className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubCategory('software');
                    }
                  }} onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 1024) {
                      e.preventDefault();
                      toggleSubCategory('software');
                    }
                  }}>
                    Software Development <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'software' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div id="software-dropdown" className="dropdown-menu">
                    <a href="/course/web-development" className="dropdown-item" onClick={closeNav}>Web Development</a>
                    <a href="/course/app-development" className="dropdown-item" onClick={closeNav}>App Development</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'video' ? 'mobile-open' : ''}`}>
                  <div role="button" tabIndex={0} aria-expanded={mobileSubDropdownOpen === 'video'} aria-controls="video-dropdown" className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubCategory('video');
                    }
                  }} onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 1024) {
                      e.preventDefault();
                      toggleSubCategory('video');
                    }
                  }}>
                    Video Editing <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'video' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div id="video-dropdown" className="dropdown-menu">
                    <a href="/course/basic-video-editing" className="dropdown-item" onClick={closeNav}>Basic Video Editing</a>
                    <a href="/course/motion-graphics" className="dropdown-item" onClick={closeNav}>Motion Graphics</a>
                  </div>
                </div>

                <div className={`nav-sub-dropdown ${mobileSubDropdownOpen === 'ai' ? 'mobile-open' : ''}`}>
                  <div role="button" tabIndex={0} aria-expanded={mobileSubDropdownOpen === 'ai'} aria-controls="ai-dropdown" className="dropdown-item sub-dropdown-toggle" onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleSubCategory('ai');
                    }
                  }} onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 1024) {
                      e.preventDefault();
                      toggleSubCategory('ai');
                    }
                  }}>
                    Generative AI <ChevronRight size={14} style={{ transform: mobileSubDropdownOpen === 'ai' && window.innerWidth < 1024 ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                  </div>
                  <div id="ai-dropdown" className="dropdown-menu">
                    <a href="/course/adv-gen-ai" className="dropdown-item" onClick={closeNav}>Advanced Certification in Gen AI</a>
                  </div>
                </div>
              </div>
            </div>

            <a href="/placement" className="nav-link" onClick={closeNav}>Placement</a>
            <a href="/blogs"     className="nav-link" onClick={closeNav}>Blogs</a>
            <a href="#faq"       className="nav-link" onClick={closeNav}>FAQ</a>

            {/* Enroll Now inside mobile nav — only visible when nav is open */}
            <button
              className="btn btn-primary mobile-nav-enroll"
              onClick={() => { onOpenEnrollModal(); closeNav(); }}
            >
              <Sparkles size={16} /> Enroll Now
            </button>
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Enroll Now — hidden on mobile; appears inside mobile nav menu instead */}
            <button className="btn btn-primary header-enroll-desktop" onClick={onOpenEnrollModal}>
              <Sparkles size={16} /> Enroll Now
            </button>
            <button
              className="mobile-toggle"
              onClick={() => {
                setMobileNavOpen(prev => {
                  const next = !prev;
                  if (next) {
                    setMobileDropdownOpen(false);
                    setMobileSubDropdownOpen(null);
                  }
                  return next;
                });
              }}
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
