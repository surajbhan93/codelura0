import api from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearch from "@/components/blog/BlogSearch";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  readingTime: string;
  tags: string[];
  isFeatured: boolean;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
}

export default async function BlogsPage() {
  const { data } = await api.get("/blogs");

  const blogs: Blog[] = data.blogs || [];

  const featuredBlogs = blogs.filter((b) => b.isFeatured);
  const normalBlogs = blogs.filter((b) => !b.isFeatured);

  return (
    <>
      {/* ───────────── Global Styles ───────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --ink:        #0d0d0d;
          --paper:      #f9f5ef;
          --paper-2:    #f2ede4;
          --accent:     #c8410a;
          --accent-2:   #e8a87c;
          --muted:      #7a7065;
          --border:     #ddd5c8;
          --card-bg:    #ffffff;
          --featured-bg:#1a1208;
        }

        .blogs-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--paper);
          min-height: 100vh;
          color: var(--ink);
        }

        /* ── Hero Header ── */
        .blogs-hero {
          position: relative;
          background: var(--featured-bg);
          overflow: hidden;
          padding: 80px 24px 70px;
        }

        .blogs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 50%, #c8410a22 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 10% 80%, #e8a87c18 0%, transparent 60%);
          pointer-events: none;
        }

        .blogs-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .blogs-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent-2);
          margin-bottom: 20px;
        }

        .blogs-hero-eyebrow span {
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--accent-2);
        }

        .blogs-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 900;
          line-height: 0.95;
          color: #f9f5ef;
          letter-spacing: -2px;
        }

        .blogs-hero-title em {
          font-style: italic;
          color: var(--accent-2);
        }

        .blogs-hero-subtitle {
          margin-top: 20px;
          font-size: 16px;
          font-weight: 300;
          color: #a89d8e;
          max-width: 420px;
          line-height: 1.7;
        }

        .blogs-hero-search-wrap {
          margin-top: 36px;
          max-width: 540px;
        }

        .blogs-hero-stats {
          display: flex;
          gap: 36px;
          margin-top: 44px;
          padding-top: 32px;
          border-top: 1px solid #2e2618;
        }

        .blogs-hero-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #f9f5ef;
        }

        .blogs-hero-stat-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b5f50;
          margin-top: 2px;
        }

        /* ── Page Body ── */
        .blogs-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px 100px;
        }

        /* ── Section Labels ── */
        .section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }

        .section-header-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }

        .section-title-accent {
          color: var(--accent);
        }

        /* ── Featured Grid ── */
        .featured-section {
          margin-bottom: 72px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .featured-grid > *:first-child {
          grid-row: 1 / span 2;
        }

        /* ── Blog Grid ── */
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* ── Blog Card Overrides (wrapper) ── */
        .blog-card-wrap {
          background: var(--card-bg);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          cursor: pointer;
        }

        .blog-card-wrap:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px -8px rgba(0,0,0,0.14);
          border-color: var(--accent-2);
        }

        /* featured card wraps inside mosaic */
        .featured-card-wrap {
          background: var(--card-bg);
          transition: opacity 0.2s ease;
        }

        .featured-card-wrap:hover {
          opacity: 0.9;
        }

        /* ── Empty State ── */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 24px;
          color: var(--muted);
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        .empty-state-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: var(--ink);
          margin-bottom: 8px;
        }

        /* ── Decorative Divider ── */
        .ornament-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 60px 0;
          color: var(--border);
          font-size: 18px;
        }

        .ornament-divider::before,
        .ornament-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .featured-grid {
            grid-template-columns: 1fr 1fr;
          }
          .featured-grid > *:first-child {
            grid-row: auto;
            grid-column: 1 / span 2;
          }
          .blogs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .blogs-hero {
            padding: 52px 20px 48px;
          }
          .featured-grid {
            grid-template-columns: 1fr;
          }
          .featured-grid > *:first-child {
            grid-column: auto;
          }
          .blogs-grid {
            grid-template-columns: 1fr;
          }
          .blogs-hero-stats {
            gap: 24px;
            flex-wrap: wrap;
          }
          .blogs-body {
            padding: 36px 16px 72px;
          }
        }
      `}</style>

      <div className="blogs-root">
        {/* ─────────── HERO HEADER ─────────── */}
        <header className="blogs-hero">
          <div className="blogs-hero-inner">
            <p className="blogs-hero-eyebrow">
              <span /> The Knowledge Hub <span />
            </p>

            <h1 className="blogs-hero-title">
              Craft &amp; <em>Code</em><br />Perspectives
            </h1>

            <p className="blogs-hero-subtitle">
              Deep dives into backend architecture, frontend craft, and system
              design — written for builders, by builders.
            </p>

            {/* AI Semantic Search */}
            <div className="blogs-hero-search-wrap">
              <BlogSearch />
            </div>

            <div className="blogs-hero-stats">
              <div>
                <div className="blogs-hero-stat-value">{blogs.length}</div>
                <div className="blogs-hero-stat-label">Articles</div>
              </div>
              <div>
                <div className="blogs-hero-stat-value">{featuredBlogs.length}</div>
                <div className="blogs-hero-stat-label">Featured</div>
              </div>
              <div>
                <div className="blogs-hero-stat-value">
                  {[...new Set(blogs.flatMap((b) => b.tags))].length}
                </div>
                <div className="blogs-hero-stat-label">Topics</div>
              </div>
            </div>
          </div>
        </header>

        {/* ─────────── PAGE BODY ─────────── */}
        <main className="blogs-body">

          {/* ── FEATURED SECTION ── */}
          {featuredBlogs.length > 0 && (
            <section className="featured-section">
              <div style={{ marginBottom: 24 }}>
                <div className="section-header">
                  <span className="section-label">Editors Picks</span>
                  <div className="section-header-line" />
                </div>
                <h2 className="section-title">
                  🌟 Featured{" "}
                  <span className="section-title-accent">Stories</span>
                </h2>
              </div>

              <div className="featured-grid">
                {featuredBlogs.map((blog) => (
                  <div key={blog._id} className="featured-card-wrap">
                    <BlogCard blog={blog} featured />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── ORNAMENT ── */}
          {featuredBlogs.length > 0 && normalBlogs.length > 0 && (
            <div className="ornament-divider">✦</div>
          )}

          {/* ── ALL BLOGS SECTION ── */}
          <section>
            <div style={{ marginBottom: 24 }}>
              <div className="section-header">
                <span className="section-label">Latest Articles</span>
                <div className="section-header-line" />
              </div>
              <h2 className="section-title">
                All{" "}
                <span className="section-title-accent">Blogs</span>
              </h2>
            </div>

            {normalBlogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p className="empty-state-title">No articles yet</p>
                <p style={{ fontSize: 14 }}>Check back soon for fresh content.</p>
              </div>
            ) : (
              <div className="blogs-grid">
                {normalBlogs.map((blog) => (
                  <div key={blog._id} className="blog-card-wrap">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </>
  );
}