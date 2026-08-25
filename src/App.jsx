import React, { useState, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import useFPSMonitor from './hooks/useFPSMonitor';
import LoadingScreen from './components/LoadingScreen';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Lazy load below-fold & route-only components ──────────────────────────
const WhyUs       = React.lazy(() => import('./components/WhyUs'));
const Syllabus    = React.lazy(() => import('./components/Syllabus'));
const Highlights  = React.lazy(() => import('./components/Highlights'));
const Faq         = React.lazy(() => import('./components/Faq'));
const CtaBanner   = React.lazy(() => import('./components/CtaBanner'));
const Footer      = React.lazy(() => import('./components/Footer'));
const EnrollModal = React.lazy(() => import('./components/EnrollModal'));
const ServiceDetail = React.lazy(() => import('./components/ServiceDetail'));
const CourseDetail  = React.lazy(() => import('./components/CourseDetail'));
const Blogs         = React.lazy(() => import('./components/Blogs'));
const Placement     = React.lazy(() => import('./components/Placement'));
const ComingSoon    = React.lazy(() => import('./components/ComingSoon'));

// Minimal inline fallback — no extra render cost
// Premium Fallback
const PageFallback = () => <LoadingScreen isFadingOut={false} />;


export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Start FPS Monitor
  useFPSMonitor();

  // Initialize Lenis smooth scrolling AFTER loading screen fades (post-FCP)
  // Deferring prevents 4+ seconds of GSAP/Lenis CPU work from blocking LCP
  useEffect(() => {
    if (initialLoading) return; // Wait until loading screen is gone

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
    
    window.lenis = lenis;

    // Add scroll velocity hook for dynamic animation durations
    lenis.on('scroll', (e) => {
      const velocity = Math.abs(e.velocity || 0);
      let duration = 1.2 - (velocity * 0.2);
      duration = Math.max(0.3, Math.min(duration, 1.2));
      document.documentElement.style.setProperty('--reveal-duration', `${duration.toFixed(2)}s`);
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker for Lenis RAF to avoid double-RAF issues
    const rafCallback = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      if (window.lenis === lenis) delete window.lenis;
      lenis.destroy();
    };
  }, [initialLoading]);

  useEffect(() => {
    let timeoutMs = 800; // Standard connection
    if (navigator.connection) {
      const { effectiveType, downlink } = navigator.connection;
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g' || downlink < 1.5) {
        timeoutMs = 2500;
        document.documentElement.setAttribute('data-low-performance', 'true'); // Pre-emptive low-perf mode for slow nets
      }
    }

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setInitialLoading(false), 600); // 600ms fade transition
    }, timeoutMs);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Recalculate GSAP positions when navigating (only after loading is done)
  useEffect(() => {
    if (initialLoading) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => clearTimeout(timer);
  }, [currentPath, initialLoading]);

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

    const applyObserver = () => {
      const elements = document.querySelectorAll('.anim-text:not(.is-visible), .anim-image:not(.is-visible), .anim-card:not(.is-visible), .anim-button:not(.is-visible)');
      elements.forEach((el) => observer.observe(el));
    };

    applyObserver();

    let mutationTimeout;
    const handleMutations = () => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        applyObserver();
        ScrollTrigger.refresh(); // Still refresh GSAP for other components that might use it
      }, 50);
    };

    const mutationObserver = new MutationObserver(handleMutations);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(mutationTimeout);
    };
  }, [currentPath]);

  // Global anchor interceptor
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;

      if (href.startsWith('/services/') || href.startsWith('/course/') || href === '/blogs' || href === '/placement' || href === '/terms' || href === '/privacy') {
        e.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('popstate'));
        window.scrollTo({ top: 0, behavior: 'instant' }); // instant so new page doesn't scroll-animate in from bottom
        return;
      }

      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        
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
  const isPlacementRoute = normalizedPath === '/placement';
  const isTermsRoute     = normalizedPath === '/terms';
  const isPrivacyRoute   = normalizedPath === '/privacy';

  return (
    <div className="app">
      <Header onOpenEnrollModal={() => setModalOpen(true)} />

      <Suspense fallback={<PageFallback />}>
        {isServiceRoute ? (
          <ServiceDetail slug={serviceSlug} onBack={handleBackToHome} onOpenEnrollModal={() => setModalOpen(true)} />
        ) : isCourseRoute ? (
          <CourseDetail slug={courseSlug} onBack={handleBackToHome} onOpenEnrollModal={() => setModalOpen(true)} />
        ) : isBlogsRoute ? (
          <Blogs onBack={handleBackToHome} />
        ) : isPlacementRoute ? (
          <Placement onBack={handleBackToHome} />
        ) : isTermsRoute ? (
          <ComingSoon title="Terms & Conditions" onBack={handleBackToHome} />
        ) : isPrivacyRoute ? (
          <ComingSoon title="Privacy Policy" onBack={handleBackToHome} />
        ) : (
          <main>
            <Hero onOpenEnrollModal={() => setModalOpen(true)} />
            <WhyUs onSelectService={handleSelectService} />
            <Syllabus />
            <Highlights />
            <Faq />
            <CtaBanner onOpenEnrollModal={() => setModalOpen(true)} />
          </main>
        )}

        <Footer />
        <EnrollModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </Suspense>

      {initialLoading && <LoadingScreen isFadingOut={isFadingOut} />}
    </div>
  );
}
