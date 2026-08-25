import React, { useState, useEffect, useRef } from 'react';
import { Video, Wand2, Smartphone, Database, Brain, Network, Briefcase, Handshake } from 'lucide-react';
import gsap from 'gsap';

const services = [
  { id: 0, icon: Video, title: "Video Editing", subtitle: "Adobe Premiere Pro", desc: "Cinematic cuts & professional grading", slug: "video-editing", label: "PRO", bgColor: "#ffe8e8", color: "#d32f2f" },
  { id: 1, icon: Wand2, title: "Motion Graphics", subtitle: "Adobe After Effects", desc: "Dynamic logo stings & particle VFX", slug: "motion-graphics", label: "VFX", bgColor: "#f3e5f5", color: "#7b1fa2" },
  { id: 2, icon: Smartphone, title: "Social Media Reels", subtitle: "CapCut & Canva", desc: "High-retention hooks & viral pacing", slug: "social-reels", label: "REEL", bgColor: "#e3f2fd", color: "#1976d2" },
  { id: 3, icon: Brain, title: "Generative AI", subtitle: "Prompt Engineering", desc: "AI art & text generation at scale", slug: "generative-ai", label: "GEN", bgColor: "#fff3e0", color: "#f57c00" },
  { id: 4, icon: Network, title: "Agentic AI", subtitle: "Autonomous Workflows", desc: "Automate complex multi-step tasks", slug: "agentic-ai", label: "AGNT", bgColor: "#e8eaf6", color: "#303f9f" },
  { id: 5, icon: Briefcase, title: "Live Portfolio", subtitle: "Client Briefs", desc: "Real commercial projects", slug: "live-portfolio", label: "LIVE", bgColor: "#fce4ec", color: "#c2185b" },
  { id: 6, icon: Handshake, title: "Placement Support", subtitle: "Career Assistance", desc: "Mock interviews & placement help", slug: "placement-support", label: "JOB", bgColor: "#f1f8e9", color: "#689f38" }
];

const headlines = [
  { title: 'Explore Our Academy', sub: 'Verticals & Careers' },
  { title: 'Master Video Editing', sub: 'From Beginner to Pro' },
  { title: 'Learn Motion Graphics', sub: 'VFX & After Effects' },
  { title: 'Dive Into Generative AI', sub: 'Prompt Engineering & Tools' },
  { title: 'Build Your Creative Career', sub: 'Placement & Portfolio' },
];

export default function WhyUs({ onSelectService }) {
  const [slots, setSlots] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [introStarted, setIntroStarted] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  const whyusSectionRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const lineRefs = useRef([]);
  const requestRef = useRef(null);
  const prevTimeRef = useRef(null);

  // Physics state refs for 8 cards
  const posRef = useRef(services.map(() => ({ x: 0, y: 0 })));
  const velRef = useRef(services.map(() => ({ x: 0, y: 0 })));
  const scaleRef = useRef(services.map(() => 0)); // Start at 0 for page load animation
  const scaleVelRef = useRef(services.map(() => 0));

  // Staggered launch control for cinematic page load
  const launchDelayRef = useRef(services.map((_, i) => i * 150)); // Stagger by 150ms

  // Orbit rotation variables
  const angleOffsetRef = useRef(0);
  const targetRadiusRef = useRef(370);
  const responsiveFactorRef = useRef(1);

  // Responsive radius and scale factor
  useEffect(() => {
    let timeoutId;
    const updateLayout = () => {
      const width = window.innerWidth;
      
      // Fluid radius calculation
      targetRadiusRef.current = Math.min(440, Math.max(130, width * 0.35));
      
      // Responsive scale factor for cards
      if (width < 380) {
        responsiveFactorRef.current = 0.5;
      } else if (width < 480) {
        responsiveFactorRef.current = 0.6;
      } else if (width < 768) {
        responsiveFactorRef.current = 0.75;
      } else if (width < 992) {
        responsiveFactorRef.current = 0.85;
      } else {
        responsiveFactorRef.current = 1;
      }
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateLayout, 200);
    };

    updateLayout(); // Initial layout calc on mount
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Interactive 3D Tilt refs
  const tiltRef = useRef(services.map(() => ({ x: 0, y: 0 })));
  const targetTiltRef = useRef(services.map(() => ({ x: 0, y: 0 })));
  const shinyRef = useRef(services.map(() => ({ x: 50, y: 50 })));

  // Auto swap interval for orbit cards
  useEffect(() => {
    if (!introStarted) return;
    const interval = setInterval(() => {
      setSlots((prev) => prev.map((slot) => (slot + 1) % services.length));
    }, 3800);

    return () => clearInterval(interval);
  }, [introStarted]);

  // Headline quote cycling with fade animation
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      // Fade out
      setQuoteVisible(false);
      // After fade-out, switch quote and fade back in
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % headlines.length);
        setQuoteVisible(true);
      }, 450);
    }, 3500);

    return () => clearInterval(cycleInterval);
  }, []);

  // Removed duplicate handleResize useEffect that was overwriting updateRadius

  // Trigger intro scale-in after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroStarted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Frame animation loop with spring physics and dynamic 3D depth effects
  useEffect(() => {
    // Respect prefers-reduced-motion — skip physics loop entirely
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Set all cards to their final static positions immediately, no animation
      scaleRef.current = services.map(() => 1);
      return;
    }

    const animate = (time) => {
      if (prevTimeRef.current !== undefined) {
        const dt = Math.min((time - prevTimeRef.current) / 1000, 0.1); // Cap delta time at 100ms

        // Increment rotation offset slowly
        if (!isPaused && introStarted) {
          angleOffsetRef.current += 0.085 * dt;
        }

        // Spring constants (Adjusted for slower, graceful entry)
        const kPos = 120;
        const cPos = 16;
        const kScale = 80;   // Lowered from 180 for slower scaling
        const cScale = 14;   // Lowered from 18 for smoother damping
        const kTilt = 240;
        const cTilt = 22;

        services.forEach((service) => {
          const idx = service.id;
          const slot = slots[idx];
          const isCenter = slot === 0;

          // Target values
          let tx = 0;
          let ty = 0;
          let targetScale = 0;

          // Introduce staggered launch during page load
          if (introStarted) {
            const factor = responsiveFactorRef.current;
            if (isCenter) {
              targetScale = 1.45 * factor;
            } else {
              targetScale = 0.85 * factor;
            }
          }

          if (!isCenter) {
            const angle = angleOffsetRef.current + (2 * Math.PI * (slot - 1)) / 6;
            tx = targetRadiusRef.current * Math.cos(angle);
            ty = targetRadiusRef.current * Math.sin(angle);
          }

          // 1. Position Spring Integration
          const fx_pos = -kPos * (posRef.current[idx].x - tx) - cPos * velRef.current[idx].x;
          const fy_pos = -kPos * (posRef.current[idx].y - ty) - cPos * velRef.current[idx].y;

          velRef.current[idx].x += fx_pos * dt;
          velRef.current[idx].y += fy_pos * dt;
          posRef.current[idx].x += velRef.current[idx].x * dt;
          posRef.current[idx].y += velRef.current[idx].y * dt;

          // 2. Scale Spring Integration
          const f_scale = -kScale * (scaleRef.current[idx] - targetScale) - cScale * scaleVelRef.current[idx];
          scaleVelRef.current[idx] += f_scale * dt;
          scaleRef.current[idx] += scaleVelRef.current[idx] * dt;

          // 3. Tilt Spring Integration
          const fx_tilt = -kTilt * (tiltRef.current[idx].x - targetTiltRef.current[idx].x) - cTilt * (tiltRef.current[idx].x - targetTiltRef.current[idx].x) * 0.1;
          const fy_tilt = -kTilt * (tiltRef.current[idx].y - targetTiltRef.current[idx].y) - cTilt * (tiltRef.current[idx].y - targetTiltRef.current[idx].y) * 0.1;
          
          tiltRef.current[idx].x += fx_tilt * dt * 0.4;
          tiltRef.current[idx].y += fy_tilt * dt * 0.4;

          // Calculate continuous 3D depth based on Y coordinate
          let depthScale = 1.0;
          let depthOpacity = 1.0;
          
          if (!isCenter) {
            const normalizedY = posRef.current[idx].y / targetRadiusRef.current; // -1 at top, 1 at bottom
            // Scale goes from 1.0 (top) down to 0.88 (bottom)
            depthScale = 1.0 - (normalizedY + 1.0) * 0.06;
            // Brightness (opacity) goes from 1.0 (top) down to 0.72 (bottom)
            depthOpacity = 1.0 - (normalizedY + 1.0) * 0.14;
          }

          // Update DOM directly for max performance (avoid re-render reflows)
          const el = cardRefs.current[idx];
          if (el) {
            // Apply scale combined with depth scale
            const finalScale = scaleRef.current[idx] * (isCenter ? 1.0 : depthScale);
            el.style.transform = `translate3d(-50%, -50%, 0) translate3d(${posRef.current[idx].x}px, ${posRef.current[idx].y}px, 0) scale(${finalScale})`;
            el.style.zIndex = isCenter ? 25 : 2;
            el.style.opacity = depthOpacity;
            el.style.filter = 'none';

            // Set text color for orbit title
            const orbitTitle = el.querySelector('.orbit-title');
            if (orbitTitle) orbitTitle.style.color = '#000000';

            // Removed dynamic card lighting & glow interpolation to stick to CSS defaults

            // Apply 3D Tilt & Light Reflection to the center card content
            const inner = el.querySelector('.orbit-card-inner');
            if (inner) {
              if (isCenter) {
                inner.style.transform = `perspective(1000px) rotateX(${tiltRef.current[idx].y}deg) rotateY(${tiltRef.current[idx].x}deg)`;
              } else {
                inner.style.transform = 'none';
              }
            }

            const glassReflect = el.querySelector('.orbit-card-glass-reflection');
            if (glassReflect) {
              glassReflect.style.background = 'none';
            }
          }

          // Update connection line elements
          const line = lineRefs.current[idx];
          if (line) {
            if (isCenter) {
              line.setAttribute('stroke-opacity', '0');
            } else {
              line.setAttribute('x1', '0');
              line.setAttribute('y1', '0');
              line.setAttribute('x2', posRef.current[idx].x.toString());
              line.setAttribute('y2', posRef.current[idx].y.toString());
              
              // Set line opacity matching card depth opacity and hover states
              const isCardHovered = hoveredIdx === idx;
              const lineBaseOpacity = depthOpacity * 0.22;
              line.setAttribute('stroke-opacity', isCardHovered ? '0.85' : lineBaseOpacity.toString());
              line.setAttribute('stroke-width', isCardHovered ? '2.5' : '1.2');
              line.setAttribute('stroke', isCardHovered ? 'var(--accent-coral)' : 'rgba(94, 8, 107, 0.28)');
            }
          }
        });
      }
      prevTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [slots, isPaused, introStarted, hoveredIdx]);

  // Center card Mouse Move interaction (3D Tilt & Shiny light reflection)
  const handleMouseMove = (idx, e) => {
    const slot = slots[idx];
    if (slot !== 0) return; // Only apply to center card

    const el = cardRefs.current[idx];
    if (!el) return;

    const inner = el.querySelector('.orbit-card-inner');
    if (!inner) return;

    const rect = inner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = (x - rect.width / 2) / (rect.width / 2);
    const dy = (y - rect.height / 2) / (rect.height / 2);

    targetTiltRef.current[idx] = { x: dx * 6.5, y: -dy * 6.5 }; // Max tilt ~6.5 degrees
    shinyRef.current[idx] = { x: (x / rect.width) * 100, y: (y / rect.height) * 100 };
  };

  const handleMouseLeave = (idx) => {
    targetTiltRef.current[idx] = { x: 0, y: 0 };
    shinyRef.current[idx] = { x: 50, y: 50 };
  };

  const handleCardClick = (service, e) => {
    const cardIdx = service.id;
    const currentSlot = slots[cardIdx];

    // If already in center, navigate to details
    if (currentSlot === 0) {
      if (onSelectService) {
        e.preventDefault();
        onSelectService(service.slug);
      }
      return;
    }

    // Orbit card clicked: bring it to center first and stop navigation propagation
    e.preventDefault();
    e.stopPropagation();

    setSlots((prev) => {
      const centerIdx = prev.indexOf(0);
      const nextSlots = [...prev];
      nextSlots[centerIdx] = currentSlot;
      nextSlots[cardIdx] = 0;
      return nextSlots;
    });
  };

  const TextBlock = ({ color }) => (
    <div className="text-center mx-auto anim-text delay-2" style={{ marginBottom: '10rem' }}>
        <h2
          className={`section-title`}
          style={{
            display: 'inline-block',
            fontSize: '3.5rem',
            lineHeight: '1.2',
            color: '#000000',
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
        {headlines[quoteIdx].title}<br/>{headlines[quoteIdx].sub}
      </h2>
    </div>
  );

  return (
    <section id="why-us" className="section why-us-interactive-section" ref={whyusSectionRef} style={{ position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      {/* Background Ambience / Subtle Glowing Nodes & Blobs */}
      <div className="orbit-ambient-dots">
        <div className="ambient-dot p1"></div>
        <div className="ambient-dot p2"></div>
        <div className="ambient-dot p3"></div>
        <div className="ambient-particles"></div>
      </div>

      <div className="container" style={{ zIndex: 2 }}>
        
        {/* Base Text Wrapper */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <TextBlock color="#000000" />
        </div>

        {/* Circular Orbit Carousel Container */}
        <div 
          className="orbit-carousel-container" 
          ref={containerRef} 
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/* Background Rotating Ring Rings (Single Orbit Ring) */}
          <div className="orbit-bg-ring outer"></div>

          {/* SVG Connector Lines Container */}
          <svg className="orbit-connect-lines-svg" style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible', width: 0, height: 0, zIndex: 1 }}>
            {services.map((service) => (
              <line
                key={service.id}
                ref={(el) => (lineRefs.current[service.id] = el)}
                className="orbit-connect-line"
                strokeWidth="1.2"
                stroke="rgba(94, 8, 107, 0.28)"
                strokeDasharray="6 6"
              />
            ))}
          </svg>

          {/* Wrapper inside containing the elements */}
          <div className="orbit-interactive-area anim-image delay-4" style={{ position: 'absolute', width: 0, height: 0 }}>
            
            {/* Center Background Glowing Energy rings */}
            <div className="center-card-energy-halo"></div>
            <div className="center-card-energy-ring"></div>

            {services.map((service) => {
              const slotIdx = slots[service.id];
              const isCenter = slotIdx === 0;

              return (
                <div
                  key={service.id}
                  ref={(el) => (cardRefs.current[service.id] = el)}
                  className={`orbit-slot-wrapper ${isCenter ? 'center-active' : 'orbit-active'}`}
                  onMouseMove={(e) => handleMouseMove(service.id, e)}
                  onMouseLeave={() => handleMouseLeave(service.id)}
                  onMouseEnter={() => !isCenter && setHoveredIdx(service.id)}
                  onMouseOver={() => !isCenter && setHoveredIdx(service.id)}
                  onMouseOut={() => setHoveredIdx(null)}
                  style={{ position: 'absolute' }}
                >
                  <div className="orbit-card-rotator">
                    <a
                      href={`/services/${service.slug}`}
                      className="orbit-card-inner"
                      onClick={(e) => handleCardClick(service, e)}
                    >
                      {/* Icon container box */}
                      <div className="orbit-card-image-box" style={{ justifyContent: 'center', backgroundColor: isCenter ? '#fff' : service.bgColor, borderColor: isCenter ? '' : service.color }}>
                        <service.icon size={46} color={isCenter ? '#000053' : service.color} strokeWidth={1.5} className="orbit-card-icon" />
                        
                        {/* Dynamic shininess element overlay (3D reflection) */}
                        <div className="orbit-card-glass-reflection"></div>

                        {/* Hover Overlay with Short Labels */}
                        {!isCenter && (
                          <div className="orbit-card-hover-overlay">
                            <span className="orbit-card-hover-label">{service.label}</span>
                          </div>
                        )}
                      </div>

                      {/* Info structure toggleable by CSS classes based on center status */}
                      <div className="orbit-card-meta">
                        {isCenter ? (
                          <div className="center-card-content">
                            <span className="center-subtitle">{service.subtitle}</span>
                            <span className="center-title">{service.title}</span>
                          </div>
                        ) : (
                          <div className="orbit-card-content">
                            <span className="orbit-title">{service.title}</span>
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

