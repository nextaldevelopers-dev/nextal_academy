import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Twitter, Linkedin, MessageCircle, Link2, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { blogs } from '../data/blogs';
import '../styles/blogs.css';

export default function BlogDetail({ slug, onBack, onOpenEnrollModal }) {
  const blog = blogs.find(b => b.slug === slug);
  const [activeId, setActiveId] = useState('');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  
  const articleRef = useRef(null);

  useEffect(() => {
    if (!blog) return;
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (!articleRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blog]);

  // TOC Intersection Observer
  useEffect(() => {
    if (!blog) return;
    const headings = Array.from(document.querySelectorAll('h2[id]'));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin: '-100px 0px -80% 0px' });

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [blog]);

  if (!blog) {
    return (
      <div className="blog-not-found">
        <div className="page-container" style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h1 style={{ color: 'var(--blog-indigo)', fontSize: '3rem', marginBottom: '20px' }}>404 - Article Not Found</h1>
          <p style={{ color: 'var(--blog-muted)', marginBottom: '40px' }}>The blog post you are looking for does not exist or has been moved.</p>
          <a href="/blogs" className="btn btn-secondary btn-back-outline">← Back to Blogs</a>
        </div>
      </div>
    );
  }

  const tocItems = blog.sections.filter(s => s.type === 'h2' && s.id);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blog.title;
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderSection = (section, idx) => {
    switch(section.type) {
      case 'p':
        // Render bold text formatting natively if string contains **
        let content = section.content;
        if (content.includes('**')) {
          const parts = content.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx}>
              {parts.map((p, i) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return <strong key={i}>{p.slice(2, -2)}</strong>;
                }
                return p;
              })}
            </p>
          );
        }
        return <p key={idx}>{section.content}</p>;
      case 'h2':
        return <h2 key={idx} id={section.id}>{section.content}</h2>;
      case 'h3':
        return <h3 key={idx}>{section.content}</h3>;
      case 'list':
        return (
          <ul key={idx} className="custom-bullet-list">
            {section.items.map((item, i) => {
              if (item.includes('**')) {
                const parts = item.split(/(\*\*.*?\*\*)/g);
                return (
                  <li key={i}>
                    {parts.map((p, j) => {
                      if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
                      return p;
                    })}
                  </li>
                );
              }
              return <li key={i}>{item}</li>;
            })}
          </ul>
        );
      case 'image':
        return (
          <figure key={idx} className="article-image-wrap">
            <img src={section.src} alt={section.alt} loading="lazy" width="800" height="450" />
            {section.alt && <figcaption>{section.alt}</figcaption>}
          </figure>
        );
      case 'benefits':
        return (
          <div key={idx} className="benefits-list">
            {section.items.map((item, i) => (
              <div key={i} className="benefit-item">
                <strong>{item.label}:</strong> {item.text}
              </div>
            ))}
          </div>
        );
      case 'cards':
        return (
          <div key={idx} className="article-cards-grid">
            {section.items.map((item, i) => (
              <div key={i} className="article-card-small">
                <strong>{item.label}</strong> {item.text}
              </div>
            ))}
          </div>
        );
      case 'formula':
        return (
          <div key={idx} className="formula-box">
            <code>{section.content}</code>
          </div>
        );
      case 'stepper':
        return (
          <div key={idx} className="stepper-list">
            {section.items.map((item, i) => (
              <div key={i} className="stepper-item">
                <div className="step-num">{i + 1}</div>
                <div className="step-content">
                  {item.label && <strong>{item.label} </strong>}
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const relatedBlogs = blogs.filter(b => b.slug !== slug).slice(0, 3);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": blog.faqs?.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [
      `https://nextalacademy.com${blog.coverImage}`
    ],
    "datePublished": "2026-09-21T00:00:00+00:00",
    "dateModified": "2026-09-21T00:00:00+00:00",
    "author": [{
      "@type": "Organization",
      "name": blog.author
    }]
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Nextal Academy Blog</title>
        <meta name="description" content={blog.metaDescription} />
        <meta name="keywords" content={blog.keywords} />
        <link rel="canonical" href={`https://nextalacademy.com/blogs/${blog.slug}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.metaDescription} />
        <meta property="og:image" content={`https://nextalacademy.com${blog.coverImage}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://nextalacademy.com/blogs/${blog.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.metaDescription} />
        <meta name="twitter:image" content={`https://nextalacademy.com${blog.coverImage}`} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        {blog.faqs && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      {/* f) Reading progress bar */}
      <div className="reading-progress" style={{ width: `${scrollProgress}%` }} />

      <div className="blog-detail-page">
        <div className="page-container">
          
          <button className="btn-back-outline" onClick={onBack}>
            ← All Articles
          </button>

          {/* a) Hero */}
          <div className="bd-hero">
            <div className="bd-pill-row">
              <span className="pill-tag">● Article · {blog.readTime} read</span>
            </div>
            <div className="category-label">{blog.category}</div>
            <h1 className="bd-title">{blog.title}</h1>
            <p className="bd-meta-author">Written by {blog.author} · Published {blog.date}</p>
            <div className="bd-cover-wrap">
              <img src={blog.coverImage} alt={blog.title} loading="eager" fetchpriority="high" width="1000" height="428" />
            </div>
          </div>

          {/* b) Two-column body */}
          <div className="bd-body-layout" ref={articleRef}>
            
            {/* Sidebar */}
            <aside className="bd-sidebar">
              <div className="sidebar-meta">
                <div className="meta-row">
                  <span className="meta-label">WRITTEN BY</span>
                  <span className="meta-val flex-val">
                    <img src="/academy_logo-320.webp" alt="Nextal" className="author-avatar" />
                    {blog.author}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">CATEGORY</span>
                  <span className="meta-val category-color">{blog.category}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">PUBLISHED</span>
                  <span className="meta-val">{blog.date}</span>
                </div>
                <div className="meta-row share-row">
                  <span className="meta-label">SHARE THIS ARTICLE</span>
                  <div className="share-buttons">
                    {/* Instagram */}
                    <a href="https://www.instagram.com/nextal_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    {/* Facebook */}
                    <a href="https://www.facebook.com/profile.php?id=61581030963089&mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/showcase/nextal-academy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    {/* Copy link */}
                    <button className="copy-btn-wrap" onClick={() => handleShare('copy')} aria-label="Copy link">
                      <Link2 size={16} />
                      {copied && <span className="copy-toast">Link copied!</span>}
                    </button>
                  </div>
                </div>
              </div>

              {tocItems.length > 0 && (
                <div className="bd-toc desktop-only">
                  <div className="toc-title">IN THIS ARTICLE</div>
                  <ul>
                    {tocItems.map(item => (
                      <li key={item.id}>
                        <a 
                          href={`#${item.id}`} 
                          className={activeId === item.id ? 'active' : ''}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // keep the global #hash handler from sending us to the home page
                            const target = document.getElementById(item.id);
                            if (!target) return;
                            if (window.lenis) {
                              window.lenis.scrollTo(target, { offset: -100 });
                            } else {
                              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            setActiveId(item.id);
                          }}
                        >
                          {item.content}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Content */}
            <article className="bd-content">
              {blog.sections.map((sec, idx) => renderSection(sec, idx))}
              
              {/* d) FAQ section */}
              {blog.faqs && blog.faqs.length > 0 && (
                <div className="bd-faqs">
                  <h2>Frequently Asked Questions</h2>
                  <div className="faq-accordion">
                    {blog.faqs.map((faq, i) => (
                      <div className={`faq-item ${openFaqIndex === i ? 'open' : ''}`} key={i}>
                        <button className="faq-q" onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}>
                          {faq.question}
                          {openFaqIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                        </button>
                        <div className="faq-a" style={{ height: openFaqIndex === i ? 'auto' : 0, overflow: 'hidden' }}>
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

          </div>
        </div>
      </div>

      {/* e) Bottom of article */}
      <div className="related-articles-sec">
        <div className="page-container">
          <h2>Keep Reading</h2>
          <div className="blog-grid related-grid">
            {relatedBlogs.map(rb => (
              <a href={`/blogs/${rb.slug}`} key={rb.slug} className="blog-card">
                <div className="bc-image">
                  <img src={rb.coverImage} alt={rb.title} loading="lazy" width="400" height="300" />
                </div>
                <div className="bc-content">
                  <div className="meta-line">
                    <span className="date">{rb.date}</span>
                    <span className="separator">•</span>
                    <span className="category">{rb.category}</span>
                  </div>
                  <h3 className="bc-title">{rb.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA band */}
      <section className="blog-cta-band">
        <div className="page-container">
          <div className="cta-content">
            <h2>Turn what you read into real skills</h2>
            <p>Learn AI, automation and digital marketing with hands-on projects and placement support at Nextal Academy.</p>
            <button className="btn btn-primary cta-btn" onClick={onOpenEnrollModal}>
              Enroll Now <ArrowUpRight size={20} />
            </button>
          </div>
        </div>
      </section>

    </>
  );
}
