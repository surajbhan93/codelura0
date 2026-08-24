"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import RelatedJobs from "@/components/jobs/RelatedJobs";
import {
  Clock, Calendar, MapPin, ArrowLeft, ChevronUp,
  ExternalLink, DollarSign, Tag, Building2, Eye, Briefcase,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPE
───────────────────────────────────────── */
interface Job {
  _id: string;
  title: string;
  slug: string;
  company: string;
  bannerImage?: string;
  location: string;
  type: "internship" | "full-time" | "part-time" | "contract";
  salary?: string;
  description: string;
  content?: string;
  tags?: string[];
  careerPageUrl: string;
  isFeatured: boolean;
  isExpired: boolean;
  views?: number;
  postedAt?: string;
  deadline?: string;
  createdAt?: string;
}

const TYPE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  internship:  { label: "Internship", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)"  },
  "full-time": { label: "Full-Time",  color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  "part-time": { label: "Part-Time",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  contract:    { label: "Contract",   color: "#a855f7", bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.3)"  },
};

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug   = params?.slug as string;

  const [job,            setJob]           = useState<Job | null>(null);
  const [loading,        setLoading]       = useState(true);
  const [scrollProgress, setScrollProgress]= useState(0);
  const [showTop,        setShowTop]       = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    if (!slug) return;
    api.get(`/jobs/${slug}`)
      .then(({ data }) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Scroll progress ── */
  useEffect(() => {
    const fn = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(dh > 0 ? (st / dh) * 100 : 0);
      setShowTop(st > 300);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Code highlight ── */
  useEffect(() => {
    if (!job?.content) return;

    // highlight code blocks
    document.querySelectorAll(".job-content pre").forEach((block) => {
      if (block.querySelector("code")) return;
      const code = document.createElement("code");
      code.className = `language-${block.getAttribute("data-language") || "javascript"}`;
      code.textContent = block.textContent || "";
      block.innerHTML = "";
      block.appendChild(code);
      hljs.highlightElement(code);
    });

    // add copy buttons (blog detail style)
    document.querySelectorAll(".job-content pre").forEach((block) => {
      if (block.parentElement?.classList.contains("code-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper";

      const header = document.createElement("div");
      header.className = "code-header";

      const lang = block.getAttribute("data-language") || "javascript";

      const dots = document.createElement("div");
      dots.className = "code-dots";
      dots.innerHTML = `
        <span style="background:#ff5f57"></span>
        <span style="background:#febc2e"></span>
        <span style="background:#28c840"></span>
      `;

      const right = document.createElement("div");
      right.style.cssText = "display:flex;align-items:center;gap:10px";

      const langBadge = document.createElement("span");
      langBadge.className = "code-lang";
      langBadge.innerText = lang.toUpperCase();

      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy";
      copyBtn.innerText = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(block.textContent || "");
        copyBtn.innerText = "✓ Copied";
        copyBtn.style.color = "#6ee7b7";
        setTimeout(() => {
          copyBtn.innerText = "Copy";
          copyBtn.style.color = "";
        }, 2000);
      };

      right.appendChild(langBadge);
      right.appendChild(copyBtn);
      header.appendChild(dots);
      header.appendChild(right);
      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(header);
      wrapper.appendChild(block);
    });
  }, [job?.content]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="jd-loading">
          <div className="jd-loader" />
          <p>Loading job details…</p>
        </div>
      </>
    );
  }

  /* ── NOT FOUND ── */
  if (!job) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="jd-notfound">
          <div style={{ fontSize: 56, marginBottom: 8, opacity: 0.35 }}>💼</div>
          <h1>Job Not Found</h1>
          <p>This listing may have been removed or expired.</p>
          <button onClick={() => router.push("/jobs-Alerts")} className="jd-back-big">
            <ArrowLeft size={15} /> Browse All Jobs
          </button>
        </div>
      </>
    );
  }

  const tm = TYPE_META[job.type] ?? { label: job.type, color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" };

  /* ── MAIN ── */
  return (
    <>
      <style>{globalStyles}</style>

      {/* Progress bar */}
      <div className="jd-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Back to top */}
      {showTop && (
        <button className="jd-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ChevronUp size={18} />
        </button>
      )}

      <div className="jd-root">
        <div className="jd-ambient" />

        <article className="jd-article">

          {/* ── Back button ── */}
          <button className="jd-back-btn" onClick={() => router.back()}>
            <span className="jd-back-icon"><ArrowLeft size={14} /></span>
            Back to Jobs
          </button>

          {/* ── Banner image ── */}
          {job.bannerImage && (
            <div className="jd-banner">
              <img src={job.bannerImage} alt={job.title} />
              {job.isFeatured && <span className="jd-featured-ribbon">⭐ Featured</span>}
            </div>
          )}

          {/* ── Header ── */}
          <div className="jd-header">
            {/* Status badges */}
            <div className="jd-badges-row">
              <span className="jd-type-badge"
                style={{ color: tm.color, background: tm.bg, border: `1px solid ${tm.border}` }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: tm.color, display: "inline-block" }} />
                {tm.label}
              </span>
              {job.isExpired ? (
                <span className="jd-expired-badge">⏰ Expired</span>
              ) : (
                <span className="jd-active-badge">
                  <span className="jd-pulse" /> Active
                </span>
              )}
            </div>

            {/* Company */}
            <p className="jd-company">
              <Building2 size={12} /> {job.company}
            </p>

            {/* Title */}
            <h1 className="jd-title">{job.title}</h1>

            {/* Description */}
            <p className="jd-desc">{job.description}</p>

            {/* Meta cards */}
            <div className="jd-meta-grid">
              <div className="jd-meta-card">
                <div className="jd-meta-icon" style={{ background: "rgba(59,130,246,0.12)" }}>
                  <MapPin size={14} color="#3b82f6" />
                </div>
                <div>
                  <p className="jd-meta-label">Location</p>
                  <p className="jd-meta-val">{job.location}</p>
                </div>
              </div>

              {job.salary && (
                <div className="jd-meta-card">
                  <div className="jd-meta-icon" style={{ background: "rgba(16,185,129,0.12)" }}>
                    <DollarSign size={14} color="#10b981" />
                  </div>
                  <div>
                    <p className="jd-meta-label">Salary</p>
                    <p className="jd-meta-val">{job.salary}</p>
                  </div>
                </div>
              )}

              <div className="jd-meta-card">
                <div className="jd-meta-icon" style={{ background: "rgba(245,158,11,0.12)" }}>
                  <Calendar size={14} color="#f59e0b" />
                </div>
                <div>
                  <p className="jd-meta-label">Posted</p>
                  <p className="jd-meta-val">{formatDate(job.postedAt || job.createdAt)}</p>
                </div>
              </div>

              {job.deadline && (
                <div className="jd-meta-card">
                  <div className="jd-meta-icon" style={{ background: "rgba(239,68,68,0.12)" }}>
                    <Clock size={14} color="#ef4444" />
                  </div>
                  <div>
                    <p className="jd-meta-label">Apply Before</p>
                    <p className="jd-meta-val">{formatDate(job.deadline)}</p>
                  </div>
                </div>
              )}

              {typeof job.views === "number" && (
                <div className="jd-meta-card">
                  <div className="jd-meta-icon" style={{ background: "rgba(168,85,247,0.12)" }}>
                    <Eye size={14} color="#a855f7" />
                  </div>
                  <div>
                    <p className="jd-meta-label">Views</p>
                    <p className="jd-meta-val">{job.views.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Rich Content (ReactQuill HTML) ── */}
          {job.content && (
            <div className="job-content" dangerouslySetInnerHTML={{ __html: job.content }} />
          )}

          {/* ── Tags ── */}
          {job.tags && job.tags.length > 0 && (
            <div className="jd-tags-section">
              <p className="jd-tags-label">
                <Tag size={11} /> Skills & Technologies
              </p>
              <div className="jd-tags-wrap">
                {job.tags.map((tag) => (
                  <span key={tag} className="jd-tag">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="jd-divider" />

          {/* ── APPLY CTA ── */}
          <div className="jd-apply-block">
            <div>
              <h3 className="jd-apply-title">
                {job.isExpired ? "This listing has expired" : "Ready to apply?"}
              </h3>
              <p className="jd-apply-sub">
                {job.isExpired
                  ? "The application deadline for this role has passed."
                  : `Apply directly on ${job.company}'s official career page.`
                }
              </p>
            </div>
            {!job.isExpired && (
              <a
                href={job.careerPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="jd-apply-btn"
              >
                Apply Now
                <ExternalLink size={15} />
              </a>
            )}
          </div>
<RelatedJobs
  currentSlug={job.slug}
  tags={job.tags}
  company={job.company}
  limit={4}
/>
        </article>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

  .jd-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
  .jd-root h1,.jd-root h2,.jd-root h3 { font-family: 'Syne', sans-serif; }

  .jd-root {
    min-height: 100vh;
    background: #060609;
    color: #e2e8f0;
    position: relative;
  }

  .jd-ambient {
    position: fixed; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 90% 80%, rgba(16,185,129,0.04) 0%, transparent 60%);
  }

  /* Progress */
  .jd-progress {
    position: fixed; top: 0; left: 0; height: 2px; z-index: 100;
    background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899);
    box-shadow: 0 0 12px rgba(168,85,247,0.6);
    transition: width 0.1s linear;
  }

  /* Back to top */
  .jd-top-btn {
    position: fixed; bottom: 28px; right: 28px; z-index: 40;
    width: 42px; height: 42px; border-radius: 12px;
    background: rgba(15,15,23,0.9); border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; backdrop-filter: blur(12px);
  }
  .jd-top-btn:hover { color: #fff; border-color: rgba(124,58,237,0.5); background: rgba(124,58,237,0.1); }

  /* Article */
//   .jd-article { max-width: 860px; margin: 0 auto; padding: 40px 20px 100px; position: relative; z-index: 1; }

.jd-article {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 32px 100px;
}



  /* Back btn */
  .jd-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    color: #475569; background: none; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; margin-bottom: 32px; padding: 0;
    transition: color 0.18s; font-family: 'Inter', sans-serif;
  }
  .jd-back-btn:hover { color: #e2e8f0; }
  .jd-back-icon {
    width: 30px; height: 30px; border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s;
  }
  .jd-back-btn:hover .jd-back-icon { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.07); }

  /* Banner */
  .jd-banner {
    margin-bottom: 36px; border-radius: 18px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5); position: relative;
  }
  .jd-banner img { width: 100%; height: 320px; object-fit: cover; display: block; }
  .jd-featured-ribbon {
    position: absolute; top: 16px; left: 16px;
    background: linear-gradient(90deg, #f59e0b, #f97316); color: #fff;
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    padding: 5px 14px; border-radius: 20px;
  }

  /* Header */
  .jd-header { margin-bottom: 40px; }

  .jd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }

  .jd-type-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
  }
  .jd-expired-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25);
  }
  .jd-active-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(16,185,129,0.1); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.25);
  }
  .jd-pulse {
    width: 6px; height: 6px; border-radius: 50%; background: #10b981;
    animation: pulse-anim 2s ease-in-out infinite;
  }
  @keyframes pulse-anim { 0%,100%{opacity:1;}50%{opacity:0.3;} }

  .jd-company {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
  }
  .jd-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 5vw, 48px); font-weight: 900;
    color: #f1f5f9; line-height: 1.1; letter-spacing: -1px; margin-bottom: 16px;
  }
  .jd-desc { font-size: 16px; color: #94a3b8; line-height: 1.7; margin-bottom: 28px; max-width: 700px; }

  /* Meta cards */
  .jd-meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
  .jd-meta-card {
    display: flex; align-items: center; gap: 12px; padding: 14px 16px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; transition: border-color 0.2s;
  }
  .jd-meta-card:hover { border-color: rgba(255,255,255,0.1); }
  .jd-meta-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .jd-meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #334155; margin-bottom: 3px; }
  .jd-meta-val   { font-size: 13px; font-weight: 600; color: #e2e8f0; }

  /* ── Rich Content ── */
  .job-content {
    font-size: 16px; line-height: 1.85; color: #94a3b8;
    margin-bottom: 40px; word-break: break-word;
  }
  .job-content h1 { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; color:#f1f5f9; margin:48px 0 20px; letter-spacing:-0.5px; }
  .job-content h2 { font-family:'Syne',sans-serif; font-size:26px; font-weight:700; color:#f1f5f9; margin:40px 0 16px; }
  .job-content h3 { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#e2e8f0; margin:32px 0 12px; }
  .job-content p  { margin-bottom: 20px; }
  .job-content ul { list-style:none; padding:0; margin-bottom:20px; }
  .job-content ul li { position:relative; padding-left:20px; margin-bottom:8px; }
  .job-content ul li::before { content:'▸'; position:absolute; left:0; color:#7c3aed; font-size:12px; top:3px; }
  .job-content ol { padding-left:24px; margin-bottom:20px; }
  .job-content ol li { margin-bottom:8px; }
  .job-content strong { color:#f1f5f9; font-weight:700; }
  .job-content a { color:#a78bfa; text-decoration:underline; text-underline-offset:3px; }
  .job-content a:hover { color:#c4b5fd; }
  .job-content blockquote {
    border-left:2px solid #7c3aed; background:rgba(124,58,237,0.05);
    padding:16px 20px; margin:24px 0; border-radius:0 12px 12px 0;
    color:#a5b4fc; font-style:italic;
  }
  .job-content img { width:100%; border-radius:12px; margin:24px 0; border:1px solid rgba(255,255,255,0.06); }
  .job-content pre {
    background:#0a0a12; border:1px solid rgba(255,255,255,0.06);
    border-radius:12px; padding:20px; overflow-x:auto; margin:24px 0;
  }
  .job-content code {
    background:rgba(124,58,237,0.1); color:#a78bfa; padding:2px 6px;
    border-radius:5px; font-size:13px; border:1px solid rgba(124,58,237,0.2);
  }
  .job-content pre code { background:transparent; border:none; padding:0; color:inherit; font-size:13px; }
  .job-content table { width:100%; border-collapse:collapse; margin:24px 0; border:1px solid rgba(255,255,255,0.06); border-radius:12px; overflow:hidden; }
  .job-content th { background:#0d0d1a; border-bottom:1px solid rgba(255,255,255,0.06); padding:10px 16px; text-align:left; font-weight:700; color:#f1f5f9; font-size:13px; }
  .job-content td { border-bottom:1px solid rgba(255,255,255,0.04); padding:10px 16px; font-size:13px; }
  .job-content tr:last-child td { border-bottom:none; }

  /* Code wrapper */
  .code-wrapper { margin:24px 0; border-radius:14px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); box-shadow:0 8px 32px rgba(0,0,0,0.4); }
  .code-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 16px; background:#0d0d0d; border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .code-dots { display:flex; gap:6px; }
  .code-dots span { width:11px; height:11px; border-radius:50%; display:block; }
  .code-lang { font-size:10px; font-weight:700; letter-spacing:0.15em; color:#6ee7b7; opacity:0.7; text-transform:uppercase; }
  .code-copy {
    font-size:11px; font-weight:600; background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.08); color:#94a3b8;
    padding:3px 10px; border-radius:6px; cursor:pointer;
    transition:all 0.18s; font-family:'Inter',sans-serif;
  }
  .code-copy:hover { color:#fff; background:rgba(255,255,255,0.1); }
  .code-wrapper pre { background:#080810 !important; margin:0 !important; border-radius:0 !important; border:none !important; }

  /* Tags */
  .jd-tags-section { margin-bottom: 36px; }
  .jd-tags-label { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.12em; color:#334155; margin-bottom:12px; }
  .jd-tags-wrap  { display:flex; flex-wrap:wrap; gap:8px; }
  .jd-tag {
    font-size:12px; font-weight:600; color:#64748b;
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    padding:4px 12px; border-radius:6px; transition:all 0.18s;
  }
  .jd-tag:hover { border-color:rgba(124,58,237,0.4); color:#a5b4fc; }

  /* Divider */
  .jd-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent); margin:40px 0; }

  /* Apply block */
  .jd-apply-block {
    display:flex; align-items:center; justify-content:space-between; gap:24px;
    background:rgba(99,102,241,0.05); border:1px solid rgba(99,102,241,0.15);
    border-radius:18px; padding:28px 32px; flex-wrap:wrap;
  }
  .jd-apply-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#f1f5f9; margin-bottom:6px; }
  .jd-apply-sub   { font-size:14px; color:#64748b; line-height:1.6; }
  .jd-apply-btn {
    display:inline-flex; align-items:center; gap:10px;
    background:linear-gradient(135deg, #7c3aed, #4f46e5); color:#fff;
    font-size:15px; font-weight:700; padding:14px 28px; border-radius:12px;
    text-decoration:none; white-space:nowrap;
    box-shadow:0 8px 24px rgba(124,58,237,0.3);
    transition:opacity 0.18s, transform 0.18s; font-family:'Inter',sans-serif;
  }
  .jd-apply-btn:hover { opacity:0.9; transform:translateY(-2px); }

  /* Loading */
  .jd-loading {
    min-height:100vh; background:#060609;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:16px; color:#475569; font-family:'Inter',sans-serif;
    font-size:13px; letter-spacing:0.1em; text-transform:uppercase;
  }
  .jd-loader {
    width:32px; height:32px; border:2px solid rgba(124,58,237,0.15);
    border-top-color:#7c3aed; border-radius:50%;
    animation:jd-spin 0.7s linear infinite;
  }
  @keyframes jd-spin { to { transform:rotate(360deg); } }

  /* Not found */
  .jd-notfound {
    min-height:100vh; background:#060609;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:12px; text-align:center; padding:24px; font-family:'Inter',sans-serif;
  }
  .jd-notfound h1 { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:#f1f5f9; }
  .jd-notfound p  { font-size:14px; color:#475569; }
  .jd-back-big {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(124,58,237,0.12); border:1px solid rgba(124,58,237,0.3);
    color:#a78bfa; font-size:14px; font-weight:600; padding:10px 22px;
    border-radius:10px; cursor:pointer; margin-top:8px;
    transition:background 0.18s; font-family:'Inter',sans-serif;
  }
  .jd-back-big:hover { background:rgba(124,58,237,0.22); }

  /* Scrollbar */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(124,58,237,0.3); border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(124,58,237,0.5); }
  ::selection { background:rgba(124,58,237,0.3); color:#fff; }

  @media(max-width:640px) {
    .jd-article { padding:28px 16px 80px; }
    .jd-banner img { height:200px; }
    .jd-apply-block { padding:20px; flex-direction:column; }
    .jd-apply-btn { width:100%; justify-content:center; }
  }
`;