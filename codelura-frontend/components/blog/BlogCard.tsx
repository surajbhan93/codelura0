import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  authorName?: string;
  readingTime?: string;
  tags?: string[];
  isFeatured?: boolean;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
}

export default function BlogCard({
  blog,
  featured = false,
}: {
  blog: Blog;
  featured?: boolean;
}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Short format: "2 Mar 26"
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const displayDate = blog.publishedAt || blog.createdAt;

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,600&family=Inter:wght@300;400;500;600;700&display=swap');

        .bcp {
          font-family: 'Inter', sans-serif;
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #ece6de;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(.22,.68,0,1.18), box-shadow 0.3s ease, border-color 0.3s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
        }
        .bcp:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px -8px rgba(0,0,0,0.12), 0 8px 20px -4px rgba(0,0,0,0.06);
          border-color: #d4a887;
        }
        .bcp--featured { border-color: rgba(200,65,10,0.2); background: #fffcfa; }
        .bcp--featured:hover { border-color: rgba(200,65,10,0.65); }

        .bcp__stripe { height: 3px; background: linear-gradient(90deg,#c8410a,#e8865c,#f5c4a0); flex-shrink:0; }

        /* Image */
        .bcp__img-zone {
          position: relative;
          overflow: hidden;
          height: 180px;
          flex-shrink: 0;
          background: #f4ede4;
        }
        .bcp--featured .bcp__img-zone { height: 200px; }
        .bcp__img-zone img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.55s cubic-bezier(.22,.68,0,1.1); }
        .bcp:hover .bcp__img-zone img { transform:scale(1.05); }
        .bcp__img-zone::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,transparent 50%,rgba(10,6,2,0.3) 100%); pointer-events:none; }
        .bcp__img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#f4ede4,#ece2d4); font-size:34px; opacity:0.4; }

        .bcp__badges { position:absolute; top:10px; left:10px; display:flex; gap:6px; z-index:3; }
        .bcp__badge { font-size:9px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; padding:3px 10px; border-radius:50px; line-height:1; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
        .bcp__badge--featured { background:rgba(200,65,10,0.92); color:#fff; box-shadow:0 2px 10px rgba(200,65,10,0.35); }
        .bcp__badge--category { background:rgba(255,255,255,0.84); color:#4a3c2e; border:1px solid rgba(255,255,255,0.5); }

        /* Body */
        .bcp__body { padding:14px 16px 16px; display:flex; flex-direction:column; flex:1; }

        .bcp__title {
          font-family:'Fraunces',serif;
          font-size:15.5px;
          font-weight:700;
          line-height:1.35;
          color:#100c06;
          margin:0 0 7px;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
          letter-spacing:-0.2px;
          transition:color 0.2s;
        }
        .bcp--featured .bcp__title { font-size:18px; font-weight:900; }
        .bcp:hover .bcp__title { color:#b83a08; }

        .bcp__excerpt {
          font-size:12px;
          line-height:1.65;
          color:#7a7062;
          margin:0 0 10px;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }

        .bcp__tags { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }
        .bcp__tag { font-size:9px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:3px 8px; border-radius:6px; background:#f5efe8; color:#8a7a68; border:1px solid #e8dfd2; transition:background 0.2s,color 0.2s,border-color 0.2s; }
        .bcp:hover .bcp__tag { background:#fff3ec; color:#c8410a; border-color:#f0bfa4; }

        /* Footer — key fix: nowrap everything */
        .bcp__footer {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:6px;
          padding-top:11px;
          border-top:1px solid #f0ebe2;
          margin-top:auto;
          flex-wrap:nowrap;
        }

        .bcp__author-block { display:flex; align-items:center; gap:7px; min-width:0; flex:1; overflow:hidden; }

        .bcp__avatar {
          width:28px;
          height:28px;
          min-width:28px;
          border-radius:50%;
          background:linear-gradient(135deg,#c8410a,#e8855a);
          color:#fff;
          font-size:9.5px;
          font-weight:700;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
          box-shadow:0 2px 8px rgba(200,65,10,0.25);
        }

        .bcp__author-info { display:flex; flex-direction:column; gap:2px; min-width:0; overflow:hidden; }

        .bcp__author-name {
          font-size:11px;
          font-weight:600;
          color:#1e180e;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          display:flex;
          align-items:center;
          gap:3px;
          line-height:1;
        }
        .bcp__author-prefix { font-weight:400; color:#b0a490; font-size:10px; flex-shrink:0; }

        /* Meta: date + reading time — always single line */
        .bcp__meta-sub {
          display:flex;
          align-items:center;
          gap:4px;
          font-size:10px;
          color:#b5a896;
          line-height:1;
          white-space:nowrap;
          overflow:hidden;
        }
        .bcp__dot { width:3px; height:3px; border-radius:50%; background:#d0c4b4; display:inline-block; flex-shrink:0; }

        /* Read button — fixed size, never wraps */
        .bcp__read-btn {
          display:inline-flex;
          align-items:center;
          gap:4px;
          text-decoration:none;
          font-family:'Inter',sans-serif;
          font-size:9.5px;
          font-weight:700;
          letter-spacing:0.08em;
          text-transform:uppercase;
          color:#c8410a;
          background:#fff5ef;
          border:1.5px solid #edcab5;
          border-radius:9px;
          padding:6px 10px;
          white-space:nowrap;
          flex-shrink:0;
          transition:background 0.22s,color 0.22s,border-color 0.22s,box-shadow 0.22s,gap 0.22s;
        }
        .bcp__read-btn:hover { background:#c8410a; color:#fff; border-color:#c8410a; box-shadow:0 4px 14px rgba(200,65,10,0.3); gap:7px; }
        .bcp__arrow { font-size:11px; transition:transform 0.22s; display:inline-block; }
        .bcp__read-btn:hover .bcp__arrow { transform:translateX(3px); }
      `}</style>

      <article className={`bcp${featured ? " bcp--featured" : ""}`}>
        {featured && <div className="bcp__stripe" />}

        <div className="bcp__img-zone">
          <div className="bcp__badges">
            {featured && <span className="bcp__badge bcp__badge--featured">✦ Featured</span>}
            {blog.category && <span className="bcp__badge bcp__badge--category">{blog.category}</span>}
          </div>
          {blog.coverImage ? (
            <img src={blog.coverImage} alt={blog.title} />
          ) : (
            <div className="bcp__img-placeholder">✍️</div>
          )}
        </div>

        <div className="bcp__body">
          <h2 className="bcp__title">{blog.title}</h2>
          <p className="bcp__excerpt">{blog.excerpt}</p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="bcp__tags">
              {blog.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="bcp__tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="bcp__footer">
            <div className="bcp__author-block">
              <div className="bcp__avatar" aria-hidden="true">{getInitials(blog.authorName)}</div>
              <div className="bcp__author-info">
                <span className="bcp__author-name">
                  <span className="bcp__author-prefix">By</span>
                  {blog.authorName ?? "Unknown"}
                </span>
                <span className="bcp__meta-sub">
                  {displayDate && <span>{formatDate(displayDate)}</span>}
                  {displayDate && blog.readingTime && <span className="bcp__dot" />}
                  {blog.readingTime && <span>{blog.readingTime}</span>}
                </span>
              </div>
            </div>

            <Link href={`/blogs/${blog.slug}`} className="bcp__read-btn">
              Read <span className="bcp__arrow">→</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}