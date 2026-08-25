import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Scissors,
  Sparkles,
  Share2,
  Camera,
  Bot,
  CheckCircle2,
  Play,
  BookOpen,
  Sliders,
  FileVideo,
  Mic,
  Workflow,
  Folder,
  HardDrive,
  Video,
  Volume2,
  Palette,
  Sun,
  Type,
  Share,
  Activity,
  Aperture,
  Brain,
  Database,
  Code,
  Terminal,
  Server,
  Users,
  Flag,
  Wand2,
  Sparkle,
  Target,
  PlaySquare,
  Layout,
  Instagram,
  Facebook,
  Youtube,
  Smartphone,
  Linkedin,
  BadgePercent,
  Megaphone,
  Captions,
  Zap,
  Headphones,
  Music,
  Clock,
  Gauge,
  VolumeX,
  Subtitles,
  Image,
  Repeat,
  AlignLeft,
  Cpu,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Star
} from 'lucide-react';
import gsap from 'gsap';

const AnimatedCounter = ({ target, suffix, delay, color = '#000000' }) => {
  const [count, setCount] = React.useState(0);
  const [isCounting, setIsCounting] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(target);
      setIsFinished(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          setTimeout(() => {
            setIsCounting(true);
            let startTime = null;
            const duration = 2000;

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = timestamp - startTime;
              const t = Math.min(progress / duration, 1);
              
              const currentCount = Math.floor(easeOutCubic(t) * target);
              setCount(currentCount);

              if (t < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(target);
                setIsCounting(false);
                setIsFinished(true);
              }
            };
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, delay]);

  return (
    <h3 ref={ref} className={`stat-number ${isCounting ? 'counting' : ''} ${isFinished ? 'finished' : ''}`}>
      <span className="stat-value">{count}</span>
      <span style={{ display: 'inline-block', color: color }}>
        {suffix}
      </span>
    </h3>
  );
};

export default function Syllabus() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef();
  const startTimeRef = useRef(null);
  const SLIDE_DURATION = 5000;

  const modules = [
    {
      id: 'ai-digital-marketing',
      title: <>AI Integrated<br/>Digital Marketing</>,
      tabLabel: '1. AI Marketing',
      image: '/course page images/AI Integrated Digital Marketing.webp',
      icon: <Megaphone size={18} />,
      desc: 'Master the future of marketing with our comprehensive AI Integrated Digital Marketing course.',
      highlights: ['AI Tools for Marketing', 'Advanced SEO & SMO', 'Meta & Google Ads'],
      topics: [
        { label: 'Module 1: Introduction to Digital Marketing', icon: <BookOpen size={16} /> },
        { label: 'Module 2: Content Marketing', icon: <Type size={16} /> },
        { label: 'Module 3: AI Tools for Digital Marketing', icon: <Sparkles size={16} /> },
        { label: 'Module 4: Social Media Marketing (SMO)', icon: <Instagram size={16} /> },
        { label: 'Module 5: Search Engine Optimization (SEO)', icon: <Target size={16} /> },
        { label: 'Module 6: Meta Ads (Facebook & Instagram Ads)', icon: <Facebook size={16} /> },
        { label: 'Module 7: Google Ads (PPC)', icon: <Megaphone size={16} /> },
        { label: 'Module 8: Email Marketing & Automation', icon: <Mail size={16} /> },
        { label: 'Module 9: Analytics & Reporting', icon: <Activity size={16} /> }
      ]
    },
    {
      id: 'diploma-digital-marketing',
      title: <>Diploma in<br/>Digital Marketing</>,
      tabLabel: '2. Diploma DM',
      image: '/course page images/diplomo in digital marketing.webp',
      icon: <BadgePercent size={18} />,
      desc: 'Master the complete spectrum of digital marketing from organic social media to advanced analytics and e-commerce.',
      highlights: ['15 Comprehensive Modules', 'E-commerce & Analytics', 'Personal Branding'],
      topics: [
        { label: 'Module 1: Introduction to Digital Marketing', icon: <BookOpen size={16} /> },
        { label: 'Module 2: Content Marketing & Copywriting', icon: <Type size={16} /> },
        { label: 'Module 3: AI Tools for Digital Marketing', icon: <Sparkles size={16} /> },
        { label: 'Module 4: Social Media Marketing (SMO)', icon: <Instagram size={16} /> },
        { label: 'Module 5: Social Media Marketing (Organic)', icon: <Share size={16} /> },
        { label: 'Module 6: Search Engine Optimization (SEO)', icon: <Target size={16} /> },
        { label: 'Module 7: Meta Ads (Facebook & Instagram Ads)', icon: <Facebook size={16} /> },
        { label: 'Module 8: Google Ads (PPC)', icon: <Megaphone size={16} /> },
        { label: 'Module 9: Email Marketing & Marketing Automation', icon: <Zap size={16} /> },
        { label: 'Module 10: Website Development', icon: <Code size={16} /> },
        { label: 'Module 11: Google Analytics & Tag Manager', icon: <Activity size={16} /> },
        { label: 'Module 12: E-commerce Marketing', icon: <BadgePercent size={16} /> },
        { label: 'Module 13: Affiliate, Influencer & Mobile Marketing', icon: <Users size={16} /> },
        { label: 'Module 14: AI-Powered Market Research & Competitor Intelligence', icon: <Brain size={16} /> },
        { label: 'Module 15: Personal Branding', icon: <Star size={16} /> }
      ]
    },
    {
      id: 'ui-ux',
      title: 'UI/UX Design',
      tabLabel: '3. UI/UX',
      image: '/course page images/UIUX Design.webp',
      icon: <Palette size={18} />,
      desc: 'A comprehensive Six-Month Mastery Course covering everything from Graphic Design fundamentals to advanced UI/UX, Prototyping, and AI tools.',
      highlights: ['6-Month Mastery', 'Figma & Prototyping', 'AI Tools Integration'],
      topics: [
        { label: 'Module 1: Introduction to UI/UX Principles', icon: <BookOpen size={16} /> },
        { label: 'Module 2: User Research & Empathy Mapping', icon: <Users size={16} /> },
        { label: 'Module 3: Wireframing & Information Architecture', icon: <AlignLeft size={16} /> },
        { label: 'Module 4: Advanced Figma & Design Systems', icon: <Layout size={16} /> },
        { label: 'Module 5: Interactive Prototyping', icon: <PlaySquare size={16} /> },
        { label: 'Module 6: Usability Testing & Iteration', icon: <Activity size={16} /> },
        { label: 'Module 7: AI Tools for Design Workflow', icon: <Sparkles size={16} /> },
        { label: 'Module 8: Portfolio Building', icon: <Folder size={16} /> }
      ]
    },
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      tabLabel: '4. Graphics',
      image: '/course page images/Graphic Design.webp',
      icon: <Image size={18} />,
      desc: 'Learn industry-standard graphic design tools and techniques to create stunning visual content for brands.',
      highlights: ['Adobe Creative Suite', 'Branding & Identity', '3-Month Plan'],
      topics: [
        { label: 'Module 1: Graphic Design Fundamentals', icon: <BookOpen size={16} /> },
        { label: 'Module 2: Color Theory & Typography', icon: <Type size={16} /> },
        { label: 'Module 3: Adobe Photoshop Masterclass', icon: <Image size={16} /> },
        { label: 'Module 4: Adobe Illustrator Essentials', icon: <Palette size={16} /> },
        { label: 'Module 5: Layout & Composition in InDesign', icon: <Layout size={16} /> },
        { label: 'Module 6: Branding & Logo Design', icon: <Star size={16} /> },
        { label: 'Module 7: Social Media Creatives', icon: <Instagram size={16} /> },
        { label: 'Module 8: Print Design & Publishing', icon: <Folder size={16} /> }
      ]
    },
    {
      id: 'designer-pro',
      title: 'Designer Pro',
      tabLabel: '5. Designer Pro',
      image: '/course page images/Designer Pro.webp',
      icon: <Wand2 size={18} />,
      desc: 'An advanced mastery course combining Graphic Design, UI/UX, and creative branding to build a complete design portfolio.',
      highlights: ['Advanced UI/UX', 'Complete Graphic Design', 'AI Design Tools'],
      topics: [
        { label: 'Module 1: Principles of Visual Design', icon: <Palette size={16} /> },
        { label: 'Module 2: Typography & Color Theory', icon: <Type size={16} /> },
        { label: 'Module 3: Adobe Photoshop & Illustrator Mastery', icon: <Image size={16} /> },
        { label: 'Module 4: UI/UX Fundamentals & Wireframing', icon: <Layout size={16} /> },
        { label: 'Module 5: Figma Advanced Prototyping', icon: <Wand2 size={16} /> },
        { label: 'Module 6: Branding & Identity Design', icon: <Star size={16} /> },
        { label: 'Module 7: AI Tools in Design Workflow', icon: <Sparkles size={16} /> },
        { label: 'Module 8: Freelancing & Agency Work', icon: <Target size={16} /> }
      ]
    },
    {
      id: 'web-development',
      title: 'Web Development',
      tabLabel: '6. Web Dev',
      image: '/course page images/Web Development.webp',
      icon: <Code size={18} />,
      desc: 'Become a full-stack developer by mastering frontend and backend technologies like React, Node.js, and databases with a 6-month mastery plan.',
      highlights: ['React & Node.js', 'Database Management', 'AI-Powered Development'],
      topics: [
        { label: 'Module 1: HTML5, CSS3 & JavaScript Essentials', icon: <Code size={16} /> },
        { label: 'Module 2: Frontend Development with React.js', icon: <Layout size={16} /> },
        { label: 'Module 3: State Management & Redux', icon: <Activity size={16} /> },
        { label: 'Module 4: Backend with Node.js & Express', icon: <Server size={16} /> },
        { label: 'Module 5: Database Design with MongoDB & SQL', icon: <Database size={16} /> },
        { label: 'Module 6: RESTful APIs & GraphQL', icon: <Workflow size={16} /> },
        { label: 'Module 7: Authentication & Security', icon: <HardDrive size={16} /> },
        { label: 'Module 8: Deployment & CI/CD', icon: <Target size={16} /> }
      ]
    },
    {
      id: 'app-development',
      title: 'App Development',
      tabLabel: '7. App Dev',
      image: '/course page images/App Development.webp',
      icon: <Smartphone size={18} />,
      desc: 'Master full stack cross-platform mobile app development with Flutter, Firebase, and AI integration for iOS and Android.',
      highlights: ['Flutter & Firebase', 'State Management', 'App Deployment'],
      topics: [
        { label: 'Module 1: Introduction to Dart & Flutter', icon: <Smartphone size={16} /> },
        { label: 'Module 2: Building Responsive UI', icon: <Layout size={16} /> },
        { label: 'Module 3: State Management (Provider/Riverpod)', icon: <Activity size={16} /> },
        { label: 'Module 4: Firebase Integration & Auth', icon: <Database size={16} /> },
        { label: 'Module 5: API Integration & Local Storage', icon: <HardDrive size={16} /> },
        { label: 'Module 6: Device Features (Camera, Location)', icon: <Camera size={16} /> },
        { label: 'Module 7: App Performance Optimization', icon: <Zap size={16} /> },
        { label: 'Module 8: Publishing to App Store & Play Store', icon: <Target size={16} /> }
      ]
    },
    {
      id: 'basic-video-editing',
      title: 'Basic Video Editing',
      tabLabel: '8. Video Basics',
      image: '/course page images/basic video editing.webp',
      icon: <Film size={18} />,
      desc: 'Learn the fundamentals of video editing to create engaging content for YouTube, Instagram Reels, and corporate videos with a complete 3-month curriculum.',
      highlights: ['Premiere & After Effects', 'Audio & Color Grading', 'AI-Powered Editing'],
      topics: [
        { label: 'Module 1: Introduction to Video Editing', icon: <BookOpen size={16} /> },
        { label: 'Module 2: Adobe Premiere Pro Interface', icon: <Layout size={16} /> },
        { label: 'Module 3: Cutting & Transitions', icon: <Scissors size={16} /> },
        { label: 'Module 4: Basic Audio Mixing', icon: <Volume2 size={16} /> },
        { label: 'Module 5: Color Correction Fundamentals', icon: <Palette size={16} /> },
        { label: 'Module 6: Titles & Simple Graphics', icon: <Type size={16} /> },
        { label: 'Module 7: Exporting for Different Platforms', icon: <Share size={16} /> },
        { label: 'Module 8: AI Tools for Video Creators', icon: <Bot size={16} /> }
      ]
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics',
      tabLabel: '9. Motion VFX',
      image: '/course page images/Motion Graphics.webp',
      icon: <Scissors size={18} />,
      desc: 'A complete six-month mastery course to learn After Effects, VFX, 3D integration, and professional motion graphics from beginner to advanced level.',
      highlights: ['VFX & 3D Integration', 'Professional Color Grading', 'Animation Workflow'],
      topics: [
        { label: 'Module 1: After Effects Interface & Workflow', icon: <Layout size={16} /> },
        { label: 'Module 2: Keyframing & Animation Principles', icon: <Activity size={16} /> },
        { label: 'Module 3: Masking & Rotoscope', icon: <Scissors size={16} /> },
        { label: 'Module 4: Kinetic Typography', icon: <Type size={16} /> },
        { label: 'Module 5: VFX & Compositing', icon: <Sparkles size={16} /> },
        { label: 'Module 6: 3D Camera & Lighting', icon: <Camera size={16} /> },
        { label: 'Module 7: Expressions & Advanced Animation', icon: <Code size={16} /> },
        { label: 'Module 8: Industry Projects & Reel Creation', icon: <Film size={16} /> }
      ]
    },
    {
      id: 'adv-gen-ai',
      title: <>Advanced&nbsp;Certification<br/>in Gen AI</>,
      tabLabel: '10. Gen AI',
      image: '/genai&agenai.webp',
      icon: <Brain size={18} />,
      desc: 'Master Generative AI, Large Language Models (LLMs), RAG, AI Agents, LangChain, LangGraph, CrewAI, MCP, Fine-Tuning, and production-ready AI application development through hands-on projects and real-world engineering practices.',
      highlights: [
        'OpenAI API, Prompting & LangChain',
        'RAG, Vector DBs & Local LLMs',
        'Multi-Agent Systems & Fine-Tuning'
      ],
      topics: [
        { label: 'Introduction to Generative AI', icon: <Sparkles size={16} /> },
        { label: 'Prompt Engineering', icon: <Type size={16} /> },
        { label: 'OpenAI API', icon: <Code size={16} /> },
        { label: 'Ollama & Local LLMs', icon: <Terminal size={16} /> },
        { label: 'LangChain', icon: <Workflow size={16} /> },
        { label: 'LangGraph', icon: <Activity size={16} /> },
        { label: 'CrewAI', icon: <Users size={16} /> },
        { label: 'RAG', icon: <Database size={16} /> },
        { label: 'Vector Databases', icon: <Database size={16} /> },
        { label: 'Embeddings', icon: <Activity size={16} /> },
        { label: 'Tool Calling', icon: <Zap size={16} /> },
        { label: 'AI Agents', icon: <Brain size={16} /> },
        { label: 'Multi-Agent Systems', icon: <Workflow size={16} /> },
        { label: 'MCP (Model Context Protocol)', icon: <Server size={16} /> },
        { label: 'Hugging Face', icon: <Sparkles size={16} /> },
        { label: 'Fine-Tuning (SFT & QLoRA)', icon: <Cpu size={16} /> },
        { label: 'OpenAI Agents SDK', icon: <Code size={16} /> },
        { label: 'FastAPI', icon: <Server size={16} /> },
        { label: 'React AI Dashboard', icon: <Layout size={16} /> },
        { label: 'Production Deployment', icon: <Target size={16} /> },
        { label: 'Final Capstone Project', icon: <Flag size={16} /> }
      ]
    }
  ];

  useEffect(() => {
    if (isHovered) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      startTimeRef.current = null;
      return;
    }

    const animate = (time) => {
      if (!startTimeRef.current) {
        startTimeRef.current = time - (progress / 100) * SLIDE_DURATION;
      }
      const elapsed = time - startTimeRef.current;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      
      setProgress(currentProgress);

      if (currentProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        handleNext();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [currentIndex, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % modules.length);
    setProgress(0);
    if (startTimeRef) startTimeRef.current = null;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + modules.length) % modules.length);
    setProgress(0);
    startTimeRef.current = null;
  };

  return (
    <section id="syllabus" className="section" style={{ position: 'relative', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <div className="text-center mx-auto anim-text delay-2" style={{ marginBottom: '3rem' }}>
        <h2 className="section-title" style={{ background: 'linear-gradient(to right, #F62477, #5E086B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>What You Will Learn</h2>
      </div>
      <div className="syllabus-grid-wrapper">

        {/* Slider Column */}
        <div className="slider-column">
          <div className="premium-slider-container anim-image delay-4">
            {/* Left Content Area */}
            <div className="slider-content-area">
              {modules.map((m, idx) => (
                <div 
                  key={m.id} 
                  className={`slider-content-slide ${idx === currentIndex ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 className="slide-title" style={{ margin: 0 }}>{m.title}</h3>
                    <p className="slide-desc" style={{ margin: '16px 0 0 0' }}>{m.desc}</p>
                    
                    <div className="slide-highlights" style={{ margin: '20px 0 0 0' }}>
                      {m.highlights.map((h, i) => (
                        <div className="slide-highlight-item" key={i}>
                          <CheckCircle2 size={18} style={{ color: '#10B981' }} /> {h}
                        </div>
                      ))}
                    </div>
                  </div>

                  <a href={`/course/${m.id}`} className="btn btn-primary slide-cta" style={{ marginTop: '86px' }} aria-label={`Explore ${m.id.split('-').join(' ')} module`}>
                    Explore Module <ArrowRight size={16} />
                  </a>
                </div>
              ))}
              
              <div className="slider-navigation" style={{ paddingRight: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                  <div className="slider-arrows">
                    <button className="slider-arrow" onClick={handlePrev} aria-label="Previous Module">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="slider-arrow" onClick={handleNext} aria-label="Next Module">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="slider-dots" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '200px' }}>
                    {modules.map((_, idx) => {
                      const isActive = idx === currentIndex;
                      return (
                        <button 
                          key={idx} 
                          className={`slider-dot ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setProgress(0);
                            if (startTimeRef) startTimeRef.current = null;
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                          style={{
                            width: isActive ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? '#F62477' : 'rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image Area */}
            <div className="slider-media-wrapper">
              
              <div 
                className="slider-media-area"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {modules.map((m, idx) => (
                  <div 
                    key={m.id} 
                    className={`slider-media-slide ${idx === currentIndex ? 'active' : ''}`}
                  >
                    <img src={m.image} alt={m.title} loading={idx === 0 ? "eager" : "lazy"} decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 📊 CLEAN MINIMALIST STATS SECTION */}
      <div className="stats-clean-wrapper">
        <div className="stats-clean-container">
          
          <div className="stat-clean-item anim-card delay-1">
            <AnimatedCounter target={100} suffix="%" delay={100} color="#000000" />
            <p>Practical Training</p>
          </div>

          <div className="stat-clean-item anim-card delay-2">
            <AnimatedCounter target={10} suffix="+" delay={250} color="#000000" />
            <p>Live Projects</p>
          </div>

          <div className="stat-clean-item anim-card delay-3">
            <AnimatedCounter target={6} suffix="+" delay={400} color="#000000" />
            <p>Editing Tools</p>
          </div>

          <div className="stat-clean-item anim-card delay-4">
            <AnimatedCounter target={100} suffix="%" delay={550} color="#000000" />
            <p>Placement Support</p>
          </div>

        </div>
      </div>

    </section>
  );
}
