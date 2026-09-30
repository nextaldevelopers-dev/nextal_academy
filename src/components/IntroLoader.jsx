import React, { useState, useEffect } from 'react';

export default function IntroLoader() {
  // Check session storage synchronously on initial state evaluation
  const [shouldRender] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (window.sessionStorage.getItem('nextal_intro_shown')) {
          return false;
        }
        window.sessionStorage.setItem('nextal_intro_shown', 'true');
        return true;
      }
    } catch {
      // Fallback if sessionStorage is disabled/blocked
    }
    return true;
  });

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(shouldRender);

  useEffect(() => {
    if (!shouldRender) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setIsMounted(false), 150);
      }, 100);
      return () => clearTimeout(quickTimer);
    }

    // Normal smooth intro timing:
    // ~400ms visual presence -> 350ms fade-out transition -> complete unmount at ~750ms
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 400);

    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 750);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [shouldRender]);

  if (!shouldRender || !isMounted) return null;

  return (
    <div
      className={`intro-loader ${isFadingOut ? 'intro-fade-out' : ''}`}
      aria-hidden="true"
    >
      <div className="intro-content">
        <div className="intro-logo-wrap">
          <img
            src="/academy_logo.webp"
            alt=""
            width="64"
            height="64"
            className="intro-logo"
            decoding="async"
          />
        </div>
        <p className="intro-brand">NEXTAL ACADEMY</p>
        <div className="intro-track">
          <div className="intro-line" />
        </div>
        <p className="intro-status">PREPARING EXPERIENCE</p>
      </div>
    </div>
  );
}
