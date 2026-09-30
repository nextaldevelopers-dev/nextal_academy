import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, ArrowUpRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogs } from '../data/blogs';
import '../styles/blogs.css';

export default function Blogs({ onBack, onOpenEnrollModal }) {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredBlog = blogs[0];
  const allCategories = ['All', ...new Set(blogs.map(b => b.category))];
  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(b => b.category === activeCategory);

  return (
    <div className="blog-listing-page observe-root">
      <Helmet>
        <title>Blog | Nextal Academy</title>
        <meta name="description" content="Guides, explainers and career tips from the Nextal Academy team — written to help you learn faster and stay ahead in AI and digital marketing." />
      </Helmet>
      
      {/* a) Page header */}
      <header className="blog-listing-header anim-text">
        <div className="page-container">
          <div className="pill-tag">● Nextal Blog</div>
          <div className="header-grid">
            <h1 className="header-title">Latest articles on AI, marketing &amp; tech careers</h1>
            <p className="header-desc">
              Guides, explainers and career tips from the Nextal Academy team — written to help you learn faster and stay ahead in AI and digital marketing.
            </p>
          </div>
        </div>
      </header>

      {/* b) Featured post (latest article) */}
      <section className="featured-section anim-image delay-1">
        <div className="page-container">
          <div className="featured-label">Featured Article</div>
          <a href={`/blogs/${featuredBlog.slug}`} className="featured-card">
            <div className="fc-image">
              <img src={featuredBlog.coverImage} alt={featuredBlog.title} loading="eager" fetchpriority="high" width="600" height="337" />
            </div>
            <div className="fc-content">
              <div className="meta-line">
                <span className="date">{featuredBlog.date}</span>
                <span className="separator">•</span>
                <span className="category">{featuredBlog.category}</span>
              </div>
              <h2 className="fc-title">{featuredBlog.title}</h2>
              <p className="fc-excerpt">{featuredBlog.excerpt}</p>
              <button className="btn-read-full">
                Read Article →
              </button>
            </div>
          </a>
        </div>
      </section>

      {/* c) Explore our more blogs */}
      <section className="explore-section anim-text delay-2">
        <div className="page-container">
          <h2 className="explore-heading">Browse All Articles</h2>
          
          <div className="category-tabs">
            {allCategories.map(cat => (
              <button 
                key={cat} 
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' ? 'All Articles' : cat}
              </button>
            ))}
          </div>

          <div className="blog-grid">
            {filteredBlogs.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0', color: 'var(--text-muted)' }}>
                No articles in this category yet — check back soon.
              </div>
            ) : (
              filteredBlogs.map((blog, idx) => (
                <a 
                  href={`/blogs/${blog.slug}`}
                  key={blog.slug} 
                  className="blog-card" 
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="bc-image">
                    <img src={blog.coverImage} alt={blog.title} loading="lazy" width="400" height="300" />
                  </div>
                  <div className="bc-content">
                    <div className="meta-line">
                      <span className="date">{blog.date}</span>
                      <span className="separator">•</span>
                      <span className="category">{blog.category}</span>
                      <span className="separator">•</span>
                      <span className="read-time">{blog.readTime || '5 min read'}</span>
                    </div>
                    <h3 className="bc-title">{blog.title}</h3>
                    <div className="bc-read-more">Read more →</div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* d) CTA band before the footer */}
      <section className="blog-cta-band anim-card">
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

    </div>
  );
}
