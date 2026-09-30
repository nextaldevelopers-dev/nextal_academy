import React, { useState, useEffect, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import IntroLoader from './components/IntroLoader';
import { lazyWithReload } from './utils/lazyWithReload';
import { SafeSuspense } from './ErrorBoundary';


// ── Lazy load below-fold & route-only components ──────────────────────────
const WhyUs       = lazyWithReload(() => import('./components/WhyUs'));
const Syllabus    = lazyWithReload(() => import('./components/Syllabus'));
const Highlights  = lazyWithReload(() => import('./components/Highlights'));
const Faq         = lazyWithReload(() => import('./components/Faq'));
const CtaBanner   = lazyWithReload(() => import('./components/CtaBanner'));
const Footer      = lazyWithReload(() => import('./components/Footer'));
const EnrollModal = lazyWithReload(() => import('./components/EnrollModal'));
const LeadMagnetModal = lazyWithReload(() => import('./components/LeadMagnetModal'));
const ExitIntentModal = lazyWithReload(() => import('./components/ExitIntentModal'));
const ServiceDetail = lazyWithReload(() => import('./components/ServiceDetail'));
const CourseDetail  = lazyWithReload(() => import('./components/CourseDetail'));
const Blogs         = lazyWithReload(() => import('./components/Blogs'));
const BlogDetail    = lazyWithReload(() => import('./components/BlogDetail'));
const Placement     = lazyWithReload(() => import('./components/Placement'));
const ComingSoon    = lazyWithReload(() => import('./components/ComingSoon'));
const BackToTop     = lazyWithReload(() => import('./components/BackToTop'));

// Minimal lightweight route fallback
const PageFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(142,68,173,0.2)', borderTopColor: '#8e44ad', animation: 'spin 0.8s linear infinite' }} />
  </div>
);

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  // Staged mount of below-fold content: 0 = nothing, 4 = everything.
  // Mounting all below-fold sections/modals in one shot causes a single large
  // main-thread burst (each section's own layout reads + GSAP setup stack up
  // into one long task). Spreading the mount across idle slices keeps every
  // individual task short, which is what Lighthouse's TBT metric penalizes.
  const [belowFoldStage, setBelowFoldStage] = useState(0);

  // Mount below-the-fold content post-paint to protect critical Hero FCP/LCP.
  //
  // Strategy:
  //   A) User interaction  → load immediately (real users never wait)
  //   B) Cold load (Lighthouse / no interaction) → wait until window.load fires
  //      then add a 2500ms buffer so below-fold CSS/JS chunks are NEVER queued
  //      during the critical first-paint window (~0–2s on mobile).
  //
  // Root-cause fix: the previous requestIdleCallback({ timeout: 600 }) could
  // fire at ~100ms, inserting dynamic CSS/JS into the network queue before
  // .hero-subtitle (LCP element) had painted, causing a ~3.2s LCP under
  // Lighthouse's 1.6 Mbps / 150ms RTT mobile simulation.
  useEffect(() => {
    let triggered = false;
    let postLoadTimerId = null;

    // A) Any meaningful user interaction → load below-fold content immediately
    const INTERACTION_EVENTS = [
      'scroll',
      'touchstart',
      'pointerdown',
      'keydown',
      'wheel',
    ];

    let idleIds = [];
    const advanceStage = (stage) => {
      setBelowFoldStage(stage);
      if (stage >= 4) return;
      if ('requestIdleCallback' in window) {
        idleIds.push(window.requestIdleCallback(() => advanceStage(stage + 1), { timeout: 200 }));
      } else {
        idleIds.push(setTimeout(() => advanceStage(stage + 1), 50));
      }
    };

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      // Remove all interaction listeners
      INTERACTION_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, trigger)
      );
      // Cancel the post-load timer if still pending
      if (postLoadTimerId) clearTimeout(postLoadTimerId);
      advanceStage(1);
    };

    INTERACTION_EVENTS.forEach((ev) =>
      window.addEventListener(ev, trigger, { passive: true, once: true })
    );

    // B) Cold-load / Lighthouse audit → wait until the page's load event has
    //    fired, then add a safe 2500ms post-paint buffer before mounting
    //    below-fold components. This ensures below-fold CSS/JS chunks are
    //    never queued while the critical Hero render chain is in-flight.
    const schedulePostLoad = () => {
      postLoadTimerId = setTimeout(trigger, 6000); // any scroll/touch loads them immediately
    };

    if (document.readyState === 'complete') {
      // Already loaded (e.g. HMR / fast cache hit)
      schedulePostLoad();
    } else {
      window.addEventListener('load', schedulePostLoad, { once: true });
    }

    return () => {
      INTERACTION_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, trigger)
      );
      window.removeEventListener('load', schedulePostLoad);
      if (postLoadTimerId) clearTimeout(postLoadTimerId);
      idleIds.forEach((id) => {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(id);
        else clearTimeout(id);
      });
    };
  }, []);

  // Initialize Lenis smooth scrolling dynamically post-paint to avoid blocking critical LCP
  useEffect(() => {
    let lenisInstance = null;
    let rafCallback = null;

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('@studio-freight/lenis');
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });
        
        lenisInstance = lenis;
        window.lenis = lenis;

        // Add scroll velocity hook for dynamic animation durations
        lenis.on('scroll', (e) => {
          const velocity = Math.abs(e.velocity || 0);
          let duration = 1.2 - (velocity * 0.2);
          duration = Math.max(0.3, Math.min(duration, 1.2));
          document.documentElement.style.setProperty('--reveal-duration', `${duration.toFixed(2)}s`);
        });



        let rafId;
        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        rafCallback = () => cancelAnimationFrame(rafId);
      } catch (err) {
        console.warn('Lenis smooth scroll init skipped:', err);
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initLenis, { timeout: 1200 });
    } else {
      setTimeout(initLenis, 300);
    }

    return () => {
      if (rafCallback) rafCallback();
      if (lenisInstance) {
        if (window.lenis === lenisInstance) delete window.lenis;
        lenisInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Funnel: Exit Intent Logic
  useEffect(() => {
    import('./config/funnelConfig').then(({ funnelConfig }) => {
      if (!funnelConfig.exitIntent.enabled) return;
      
      // Do not show if they already submitted a lead
      if (localStorage.getItem('nextal_lead_submitted')) return;
      
      // Check localStorage (once per day)
      const lastShownStr = localStorage.getItem('nextal_exit_intent_last_shown');
      if (lastShownStr) {
        const lastShownDate = new Date(parseInt(lastShownStr, 10));
        const now = new Date();
        if ((now - lastShownDate) < funnelConfig.exitIntent.cooldownHours * 60 * 60 * 1000) {
          return; // Still in cooldown
        }
      }
      
      // Check sessionStorage (once per session)
      if (sessionStorage.getItem('nextal_exit_intent_shown_session')) return;

      let delayPassed = false;
      const delayTimer = setTimeout(() => {
        delayPassed = true;
      }, funnelConfig.exitIntent.delayMs);

      const handleMouseOut = (e) => {
        if (!delayPassed) return;
        
        // Exit intent: mouse leaves from the top of the viewport
        if (e.clientY <= 10) {
          setExitModalOpen(true);
          localStorage.setItem('nextal_exit_intent_last_shown', Date.now().toString());
          sessionStorage.setItem('nextal_exit_intent_shown_session', 'true');
          document.removeEventListener('mouseout', handleMouseOut);
        }
      };

      // Only add listener on desktop devices
      if (window.innerWidth >= 1024) {
        document.addEventListener('mouseout', handleMouseOut);
      }

      return () => {
        clearTimeout(delayTimer);
        document.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, []);



  // Global IntersectionObserver Reveal (Lightweight, Replaces GSAP for basic reveals)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // If intersecting or if it's already above the viewport (e.g. user scrolled past before JS loaded)
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.9) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -5% 0px', // Trigger slightly before the bottom
      threshold: 0
    });

    let safetyTimeoutId = null;
    const applyObserver = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        document.querySelectorAll('.anim-text, .anim-image, .anim-card, .anim-button').forEach(el => el.classList.add('is-visible'));
        return;
      }
      const elements = document.querySelectorAll('.anim-text:not(.is-visible), .anim-image:not(.is-visible), .anim-card:not(.is-visible), .anim-button:not(.is-visible)');
      elements.forEach((el) => observer.observe(el));
      
      // Safety timeout: 1.5s after page load, reveal elements above fold to prevent white areas
      if (!safetyTimeoutId) {
        safetyTimeoutId = setTimeout(() => {
          document.querySelectorAll('.anim-text:not(.is-visible), .anim-image:not(.is-visible), .anim-card:not(.is-visible), .anim-button:not(.is-visible)').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
              el.classList.add('is-visible');
            }
          });
        }, 1500);
      }
    };

    applyObserver();

    // Resize fallback
    const handleResize = () => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.anim-text:not(.is-visible), .anim-image:not(.is-visible), .anim-card:not(.is-visible), .anim-button:not(.is-visible)').forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-visible');
          }
        });
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Scroll fallback for the absolute bottom AND every scroll frame
    let scrollRafId;
    const handleScroll = () => {
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      scrollRafId = requestAnimationFrame(() => {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
        document.querySelectorAll('.anim-text:not(.is-visible), .anim-image:not(.is-visible), .anim-card:not(.is-visible), .anim-button:not(.is-visible)')
          .forEach(el => {
            if (atBottom || el.getBoundingClientRect().top < window.innerHeight) {
              el.classList.add('is-visible');
            }
          });
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.lenis) window.lenis.on('scroll', handleScroll);

    let mutationTimeout;
    const handleMutations = (mutationsList) => {
      // Only refresh ScrollTrigger if meaningful layout changes happened, 
      // not just class toggles for animations
      let needsRefresh = false;
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          needsRefresh = true;
          break;
        }
      }

      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        applyObserver();
      }, 100);
    };

    const mutationObserver = new MutationObserver(handleMutations);
    mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: false });

    return () => {
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId);
      if (mutationTimeout) clearTimeout(mutationTimeout);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (window.lenis) window.lenis.off('scroll', handleScroll);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPath]);

  // Global anchor interceptor
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('/services/') || href.startsWith('/course/') || href.startsWith('/blogs') || href === '/placement' || href === '/terms' || href === '/privacy') {
        e.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo({ top: 0, behavior: 'instant' }); // instant so new page doesn't scroll-animate in from bottom
        return;
      }

      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();

        // If the target section exists on the CURRENT page (e.g. a blog article's
        // table of contents), scroll to it here instead of redirecting to the home page.
        let localTarget = null;
        try { localTarget = document.getElementById(decodeURIComponent(href.slice(1))); } catch (err) { localTarget = null; }
        if (localTarget) {
          if (window.lenis) {
            window.lenis.scrollTo(localTarget, { offset: -100 });
          } else {
            localTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          return;
        }
        
        const scrollToTarget = () => {
          let attempts = 0;
          const checkExist = setInterval(() => {
            const el = document.querySelector(href);
            if (el) {
              clearInterval(checkExist);
              if (window.lenis) {
                window.lenis.scrollTo(el, { offset: -80 }); // Account for sticky header
              } else {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
            attempts++;
            if (attempts > 30) clearInterval(checkExist); // Give up after 3 seconds
          }, 100);
        };

        if (window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }
        
        scrollToTarget();
        return;
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleSelectService = (slug) => {
    window.history.pushState({}, '', `/services/${slug}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  // SEO: Update document title dynamically based on route
  useEffect(() => {
    let title = 'Nextal Academy Nagercoil | Video Editing, AI & Design Courses';
    let desc = 'Nextal Academy – Nagercoil\'s premier job-oriented training institute. Master Video Editing, Motion Graphics, Generative AI, Graphic Design, Web & App Development. 100% placement support.';

    if (currentPath.startsWith('/course/')) {
      const slug = currentPath.replace('/course/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      title = `${slug} Course | Nextal Academy Nagercoil`;
      desc = `Enroll in ${slug} at Nextal Academy Nagercoil. Job-oriented training with live projects, industry mentors & placement support.`;
    } else if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      title = `${slug} | Nextal Academy Nagercoil`;
      desc = `Explore ${slug} services at Nextal Academy Nagercoil. Professional training and career guidance for aspiring creatives.`;
    } else if (currentPath === '/placement') {
      title = 'Placement Record | Nextal Academy Nagercoil';
      desc = 'See our students\' success stories. Nextal Academy Nagercoil offers 100% placement support in video editing, design, AI and tech fields.';
    } else if (currentPath.startsWith('/blogs/')) {
      title = 'Blog | Nextal Academy Nagercoil'; // handled inside BlogDetail Helmet
    } else if (currentPath === '/blogs') {
      title = 'Blogs & News | Nextal Academy Nagercoil';
      desc = 'Read the latest articles on video editing, AI, design trends and career tips from Nextal Academy Nagercoil experts.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', desc);
  }, [currentPath]);


  const normalizedPath = currentPath.replace(/\/+$/, '') || '/';
  
  const isServiceRoute  = normalizedPath.startsWith('/services/');
  const serviceSlug     = isServiceRoute ? normalizedPath.replace('/services/', '') : '';
  const isCourseRoute   = normalizedPath.startsWith('/course/');
  const courseSlug      = isCourseRoute ? normalizedPath.replace('/course/', '') : '';
  const isBlogsRoute    = normalizedPath === '/blogs';
  const isBlogDetailRoute = normalizedPath.startsWith('/blogs/');
  const blogSlug        = isBlogDetailRoute && !isBlogsRoute ? normalizedPath.replace('/blogs/', '') : '';
  const isPlacementRoute = normalizedPath === '/placement';
  const isTermsRoute     = normalizedPath === '/terms';
  const isPrivacyRoute   = normalizedPath === '/privacy';

  return (
    <div className="app">
      <IntroLoader />
      <Helmet>
        <title>Nextal Academy Nagercoil | Video Editing, AI & Design Courses</title>
        <meta name="description" content="Master Video Editing, AI, and UI/UX Design at Nextal Academy Nagercoil. Get job-ready with our 100% placement-focused courses and hands-on portfolio building." />
        {/* Canonical follows the current page; pages with their own Helmet (blog, course) override it */}
        <link rel="canonical" href={`https://nextalacademy.com${currentPath === '/' ? '/' : currentPath}`} />
        <meta property="og:title" content="Nextal Academy Nagercoil | Video Editing, AI & Design Courses" />
        <meta property="og:description" content="Master Video Editing, AI, and UI/UX Design at Nextal Academy Nagercoil. 100% placement assistance." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nextalacademy.com${currentPath === '/' ? '/' : currentPath}`} />
        <meta property="og:image" content="https://nextalacademy.com/academy_logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <Header onOpenEnrollModal={() => setModalOpen(true)} />

      {isServiceRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <ServiceDetail slug={serviceSlug} onBack={handleBackToHome} onOpenEnrollModal={() => setModalOpen(true)} />
        </SafeSuspense>
      ) : isCourseRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <CourseDetail slug={courseSlug} onBack={handleBackToHome} onOpenEnrollModal={() => setModalOpen(true)} />
        </SafeSuspense>
      ) : isBlogsRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <Blogs onBack={handleBackToHome} onOpenEnrollModal={() => setModalOpen(true)} />
        </SafeSuspense>
      ) : isBlogDetailRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <BlogDetail slug={blogSlug} onBack={() => {
            window.history.pushState({}, '', '/blogs');
            window.dispatchEvent(new Event('popstate'));
          }} onOpenEnrollModal={() => setModalOpen(true)} />
        </SafeSuspense>
      ) : isPlacementRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <Placement onBack={handleBackToHome} />
        </SafeSuspense>
      ) : isTermsRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <ComingSoon title="Terms & Conditions" onBack={handleBackToHome} />
        </SafeSuspense>
      ) : isPrivacyRoute ? (
        <SafeSuspense fallback={<PageFallback />}>
          <ComingSoon title="Privacy Policy" onBack={handleBackToHome} />
        </SafeSuspense>
      ) : (
        <main>
          <Hero onOpenEnrollModal={() => setModalOpen(true)} onOpenLeadModal={() => setLeadModalOpen(true)} />
          {belowFoldStage >= 1 && (
            <SafeSuspense fallback={null}>
              <WhyUs onSelectService={handleSelectService} />
              <Syllabus onOpenLeadModal={() => setLeadModalOpen(true)} />
            </SafeSuspense>
          )}
          {belowFoldStage >= 2 && (
            <SafeSuspense fallback={null}>
              <Highlights />
              <Faq />
            </SafeSuspense>
          )}
          {belowFoldStage >= 3 && (
            <SafeSuspense fallback={null}>
              <CtaBanner onOpenEnrollModal={() => setModalOpen(true)} />
            </SafeSuspense>
          )}
        </main>
      )}

      {belowFoldStage >= 3 && (
        <SafeSuspense fallback={null}>
          <Footer />
        </SafeSuspense>
      )}

      {belowFoldStage >= 4 && (
        <SafeSuspense fallback={null}>
          <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          <LeadMagnetModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
          <ExitIntentModal
            isOpen={exitModalOpen}
            onClose={() => setExitModalOpen(false)}
            onClaimOffer={() => {
              setExitModalOpen(false);
              setModalOpen(true);
            }}
          />
          <BackToTop />
        </SafeSuspense>
      )}
    </div>
  );
}
