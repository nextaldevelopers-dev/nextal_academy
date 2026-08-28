import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  GraduationCap, Wrench, Briefcase, FolderOpen, Clapperboard, 
  Bot, FileText, MessageSquare, Building2, Award, Medal
} from 'lucide-react';
import './Highlights.css';

const baseItems = [
  { id: '01', label: 'Beginner to Advanced Training', icon: <GraduationCap size={16} strokeWidth={2.5} /> },
  { id: '02', label: 'Hands-on Practical Sessions', icon: <Wrench size={16} strokeWidth={2.5} /> },
  { id: '03', label: 'Live Client Projects', icon: <Briefcase size={16} strokeWidth={2.5} /> },
  { id: '04', label: 'Portfolio & Resume Building', icon: <FolderOpen size={16} strokeWidth={2.5} /> },
  { id: '05', label: 'AI Video Editing Tools', icon: <Bot size={16} strokeWidth={2.5} /> },
  { id: '06', label: 'Interview Preparation', icon: <MessageSquare size={16} strokeWidth={2.5} /> },
  { id: '07', label: 'Internship Opportunities', icon: <Building2 size={16} strokeWidth={2.5} /> },
  { id: '08', label: 'Placement Assistance', icon: <Award size={16} strokeWidth={2.5} /> },
  { id: '09', label: 'Industry Recognized Certificate', icon: <Medal size={16} strokeWidth={2.5} /> }
];

// Duplicate items twice (18 total) to form a complete 360-degree circle with 20-degree spacing (18 * 20 = 360).
// This enables a perfect, gapless, continuous loop.
const carouselItems = [...baseItems, ...baseItems];
const ANGLE_SPACING = 20;

export default function Highlights() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const arcRef = useRef(null);
  const nodesRef = useRef([]);
  const tlRef = useRef(null);
  const proxyRef = useRef({ rotation: 0 });

  const staticRingRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let radius = 0;
      let centerX = 0;
      let centerY = 0;
      
      const updateGeometry = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.offsetWidth;
        
        // Dynamically calculate node size based on CSS breakpoints to ensure nodes don't overflow
        const nodeSize = window.innerWidth > 480 ? Math.min(200, window.innerWidth * 0.16) : 130;
        
        // Calculate safe diameter for desktop, but force massive radius on mobile/tablet to spread nodes
        let calculatedRadius;
        if (window.innerWidth > 1024) {
          calculatedRadius = Math.max(w * 0.7, 700) / 2;
        } else if (window.innerWidth > 768) {
          calculatedRadius = Math.max(w * 1.5, 650) / 2;
        } else {
          // Mobile: Force massive radius to flatten curve and prevent overlap with central ring
          calculatedRadius = Math.max(w * 3.2, 1200) / 2; 
        }
        radius = calculatedRadius;
        
        centerX = w / 2;
        // Push center down so the full ring sits inside the wrapper
        // Since radius is massive on mobile, vertical offset keeps the top of the arc in view
        const verticalOffset = window.innerWidth > 768 ? 175 : 120;
        centerY = radius + verticalOffset;

        // Update the visual background arc path
        if (arcRef.current) {
          gsap.set(arcRef.current, {
            width: radius * 2,
            height: radius * 2,
            top: centerY - radius,
          });
        }
        
        // Position static ring exactly at the top center (-90 deg)
        if (staticRingRef.current) {
          gsap.set(staticRingRef.current, {
            x: centerX,
            y: centerY - radius,
            xPercent: -50,
            yPercent: -50,
          });
        }
      };
      
      const updateNodes = (rotationOffset) => {
        nodesRef.current.forEach((node, idx) => {
           if (!node) return; // Fix for null reading crash

           // We have 18 steps, exactly filling 360 degrees. (18 * 20 = 360).
           // Top center is -90 degrees.
           const baseAngles = carouselItems.map((_, i) => -90 + (i * ANGLE_SPACING));
           let currentAngle = baseAngles[idx] + rotationOffset;
           
           // Wrap logic to keep the nodes within the -180 to 180 visual range around -90
           let relativeAngle = (currentAngle - (-90)) % 360;
           if (relativeAngle > 180) relativeAngle -= 360;
           if (relativeAngle < -180) relativeAngle += 360;
           let finalAngle = relativeAngle - 90;
           
           const rad = finalAngle * (Math.PI / 180);
           const x = centerX + radius * Math.cos(rad);
           const y = centerY + radius * Math.sin(rad);
           
           // Calculate distance from active top center (-90)
           let diff = Math.abs(finalAngle - (-90));
           
           // Calculate scaling based on closeness to center (visible range is roughly +/- 80 degrees)
           let progressToCenter = Math.max(0, 1 - (diff / 80)); 
           
           let scale = 0.5 + (0.5 * progressToCenter);
           let opacity = diff > 80 ? 0 : 0.4 + (0.6 * progressToCenter);
           
           gsap.set(node, {
             x: x,
             y: y,
             xPercent: -50,
             yPercent: -50,
             scale: scale,
             opacity: opacity,
             zIndex: progressToCenter > 0.8 ? 10 : 5,
             display: diff > 85 ? 'none' : 'flex' // Hide nodes completely wrapped around bottom
           });
           
           if (progressToCenter > 0.95) {
             node.classList.add('sl-active');
           } else {
             node.classList.remove('sl-active');
           }
        });
      };
      
      const buildTimeline = () => {
        if (tlRef.current) tlRef.current.kill();
        
        // The timeline will step infinitely through all 18 items, rotating by -360 degrees
        tlRef.current = gsap.timeline({ repeat: -1, paused: true });
        
        for(let i = 1; i <= carouselItems.length; i++) {
           tlRef.current.to(proxyRef.current, {
             rotation: i * -ANGLE_SPACING,
             duration: 0.4,
             ease: 'power2.inOut',
             onUpdate: () => {
               updateNodes(proxyRef.current.rotation);
             }
           }, `+=${0.6}`); // 0.6s hold time
        }
      };

      // Initialization
      updateGeometry();
      updateNodes(proxyRef.current.rotation);
      buildTimeline();
      
      // Play animation only when visible
      const scrollObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (tlRef.current) tlRef.current.play();
        } else {
          if (tlRef.current) tlRef.current.pause();
        }
      }, { threshold: 0.2 });
      
      if (sectionRef.current) {
        scrollObserver.observe(sectionRef.current);
      }
      
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          updateGeometry();
          updateNodes(proxyRef.current.rotation);
        }, 150);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleResize);
        if (tlRef.current) tlRef.current.kill();
        scrollObserver.disconnect();
      };
    });
    
    // Reduced motion fallback
    mm.add("(prefers-reduced-motion: reduce)", () => {
       if (!containerRef.current) return;
       const w = containerRef.current.offsetWidth;
       const nodeSize = window.innerWidth > 480 ? Math.min(200, window.innerWidth * 0.16) : 130;
       const safeDiameter = Math.max(w - nodeSize - 20, 240); 
       const radius = window.innerWidth > 1024 ? Math.max(w * 0.7, 700) / 2 : safeDiameter / 2;
       
       const centerX = w / 2;
       const verticalOffset = window.innerWidth > 768 ? 175 : 120;
       const centerY = radius + verticalOffset;
       
       if (arcRef.current) {
          gsap.set(arcRef.current, { width: radius * 2, height: radius * 2, top: centerY - radius });
       }
       
       if (staticRingRef.current) {
          gsap.set(staticRingRef.current, {
            x: centerX,
            y: centerY - radius,
            xPercent: -50,
            yPercent: -50,
          });
       }

       nodesRef.current.forEach((node, idx) => {
         if(idx === 0) { // Keep just the first node
           const rad = -90 * (Math.PI / 180);
           gsap.set(node, {
             x: centerX + radius * Math.cos(rad),
             y: centerY + radius * Math.sin(rad),
             xPercent: -50,
             yPercent: -50,
             scale: 1,
             opacity: 1,
             zIndex: 10,
             display: 'flex'
           });
           node.classList.add('sl-active');
         } else {
           gsap.set(node, { display: 'none' });
         }
       });
    });
    
    return () => mm.revert();
  }, []);

  return (
    <section className="section highlights-section" ref={sectionRef}>

      <div className="hero-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="text-center">
          <h2 className="highlights-heading anim-text delay-2">Course Highlights</h2>
        </div>
      </div>

      <div className="spotlight-carousel-wrapper anim-image delay-3" ref={containerRef}>
        <div className="spotlight-container">
          <div className="spotlight-arc-track" ref={arcRef}></div>
          
          <div className="spotlight-static-ring" ref={staticRingRef}>
             <div className="sl-ring-gradient"></div>
             <div className="sl-ring-dashed"></div>
          </div>

          <div className="spotlight-track" ref={trackRef}>
            {carouselItems.map((step, idx) => (
              <div 
                key={idx} 
                className="spotlight-node" 
                ref={el => nodesRef.current[idx] = el}
              >
                <div className="spotlight-node-inner">
                  <div className="sl-content">
                    <div className="sl-id">{step.id}</div>
                    <div className="sl-label">{step.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
