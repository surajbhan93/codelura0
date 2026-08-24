"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import RelatedJobs from "@/components/jobs/RelatedJobs";
import {
  Clock, Calendar, MapPin, ArrowLeft, ChevronUp,
  ExternalLink, DollarSign, Tag, Building2, Eye,
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

  /* ── Scroll progress (throttled with rAF to avoid jank) ── */
  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const st = window.scrollY;
        const dh = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(dh > 0 ? (st / dh) * 100 : 0);
        setShowTop(st > 300);
        ticking = false;
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── Code highlight + copy buttons ── */
  useEffect(() => {
    if (!job?.content) return;

    document.querySelectorAll(".job-content pre").forEach((block) => {
      if (block.querySelector("code")) return;
      const code = document.createElement("code");
      code.className = `language-${block.getAttribute("data-language") || "javascript"}`;
      code.textContent = block.textContent || "";
      block.innerHTML = "";
      block.appendChild(code);
      hljs.highlightElement(code);
    });

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
          <div style={{ fontSize: 52, marginBottom: 8, opacity: 0.35 }}>💼</div>
          <h1>Job Not Found</h1>
          <p>This listing may have been removed or has expired.</p>
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
        <button
         type="button"
        aria-label="Back to top"
        title="Back to top"
        className="jd-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ChevronUp size={18} />
        </button>
      )}

      <div className="jd-root">
        <article className="jd-article">

          {/* ── Back button ── */}
          <button className="jd-back-btn" onClick={() => router.back()}>
            <ArrowLeft size={14} />
            Back to Jobs
          </button>

          {/* ── Banner image ── */}
          {job.bannerImage && (
            <div className="jd-banner">
              <img src={job.bannerImage} alt={job.title} loading="lazy" />
              {job.isFeatured && <span className="jd-featured-ribbon">⭐ Featured</span>}
            </div>
          )}

          {/* ── Header ── */}
          <div className="jd-header">
            {/* Status badges */}
            <div className="jd-badges-row">
              <span className="jd-type-badge"
                style={{ color: tm.color, background: tm.bg, border: `1px solid ${tm.border}` }}>
                {tm.label}
              </span>
              {job.isExpired ? (
                <span className="jd-expired-badge">Expired</span>
              ) : (
                <span className="jd-active-badge">Active</span>
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

            {/* Static overview note */}
            <p className="jd-overview-note">
              Below you&apos;ll find the full role details, required skills, and how to apply.
              Read through the description carefully before applying — it takes just a
              couple of minutes and helps you understand if this role is the right fit.
            </p>

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

          {/* ── Resume tools CTA ── */}
          <div className="career-card" onClick={() => router.push("/career/tools/ats-resume-checker")}>
            <div className="career-icon">🤖</div>
            <div className="career-content">
              <h3>Check Your ATS Score</h3>
              <p>Before applying, see how well your resume matches this role.</p>
              <button>Check Score →</button>
            </div>
          </div>

          {/* ── Rich Content (ReactQuill HTML) ── */}
          {job.content && (
            <div className="job-content" dangerouslySetInnerHTML={{ __html: job.content }} />
          )}

          {/* ── Resume review CTA ── */}
          <div className="career-card" onClick={() => router.push("/career/mentorship/resume-review")}>
            <div className="career-icon">📄</div>
            <div className="career-content">
              <h3>Resume Review Session</h3>
              <p>Get personalized feedback from experts before applying.</p>
              <button>Book Session →</button>
            </div>
          </div>

          {/* ── Why this role section (static text) ── */}
          <div className="jd-info-block">
            <h2>What to expect in this role</h2>
            <p>
              This position was posted directly by {job.company} and is open to
              candidates who meet the requirements listed above. Roles like this
              typically involve close collaboration with a small team, hands-on
              ownership of real projects, and regular feedback as you grow into
              the position.
            </p>
            <p>
              Make sure your resume highlights relevant projects and skills before
              you apply — recruiters usually spend under a minute on a first pass,
              so clarity matters more than length.
            </p>
          </div>

          {/* ── Application tips (static text) ── */}
          <div className="jd-info-block">
            <h2>Before you apply</h2>
            <ul className="jd-tips-list">
              <li>Tailor your resume to the skills and tags listed on this job.</li>
              <li>Double check the application deadline before you start.</li>
              <li>Prepare a short note on why you&apos;re a good fit for {job.company}.</li>
              <li>Keep your portfolio or GitHub links up to date and easy to find.</li>
            </ul>
          </div>

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

          {/* ── Career resources (single condensed box) ── */}
          <div className="career-resource-box">
            <h2>Career Resources</h2>
            <p className="jd-overview-note" style={{ marginBottom: 16 }}>
              A few free tools to help you prep beyond this one listing.
            </p>
            <div className="career-links">
              <button onClick={() => router.push("/career/learning/courses")}>Free Courses</button>
              <button onClick={() => router.push("/career/learning/career-tracks")}>Career Roadmaps</button>
              <button onClick={() => router.push("/career/learning/study-material")}>Study material</button>
              <button onClick={() => router.push("/career/mentorship/one-on-one")}>1:1 Mentorship</button>
              <button onClick={() => router.push("/career/tools/resume-builder")}>Resume Builder</button>
              <button onClick={() => router.push("/career/mentorship/mock-interview")}>Mock Interview</button>
            </div>
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
   (Note: move the @font-face/Google Fonts import to
   your root layout with next/font for real perf gains —
   an @import inside a component blocks first paint.)
───────────────────────────────────────── */
const globalStyles = `
  .jd-root * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
  .jd-root h1, .jd-root h2, .jd-root h3 { font-family: 'Inter', system-ui, sans-serif; font-weight: 800; }

  .jd-root {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e2e8f0;
  }

  /* Progress */
  .jd-progress {
    position: fixed; top: 0; left: 0; height: 2px; z-index: 100;
    background: #7c3aed;
    transition: width 0.1s linear;
  }

  /* Back to top */
  .jd-top-btn {
    position: fixed; bottom: 24px; right: 24px; z-index: 40;
    width: 40px; height: 40px; border-radius: 10px;
    background: #16161f; border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: color 0.15s, border-color 0.15s;
  }
  .jd-top-btn:hover { color: #fff; border-color: rgba(124,58,237,0.5); }

  /* Article */
  .jd-article {
    max-width: 1040px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  @media (min-width: 1024px) {
    .jd-article { max-width: 1180px; padding: 40px 32px 100px; }
  }

  @media (min-width: 1440px) {
    .jd-article { max-width: 1320px; }
  }

  /* Static info blocks */
  .jd-info-block {
    margin: 32px 0;
    padding: 24px 0;
  }
  .jd-info-block h2 {
    font-size: 19px;
    font-weight: 800;
    color: #f1f5f9;
    margin-bottom: 12px;
  }
  .jd-info-block p {
    font-size: 14.5px;
    line-height: 1.75;
    color: #94a3b8;
    margin-bottom: 12px;
  }
  .jd-tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .jd-tips-list li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
  }
  .jd-tips-list li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #7c3aed;
    font-size: 13px;
    top: 1px;
  }

  /* Reusable CTA card */
  .career-card {
    display: flex;
    gap: 16px;
    align-items: center;
    background: #14141d;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 18px;
    margin: 24px 0;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .career-card:hover { border-color: #7c3aed; }

  .career-icon {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: #1e293b;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .career-content { flex: 1; min-width: 0; }
  .career-content h3 { color: #fff; margin-bottom: 6px; font-size: 15px; }
  .career-content p { color: #94a3b8; margin-bottom: 10px; font-size: 13px; line-height: 1.5; }
  .career-content button {
    background: #7c3aed;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  .career-content button:hover { background: #6d28d9; }

  .career-resource-box {
    margin: 44px 0;
    padding: 24px;
    border-radius: 14px;
    background: #14141d;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .career-resource-box h2 { font-size: 18px; color: #f1f5f9; margin-bottom: 6px; }

  .career-links { display: flex; flex-wrap: wrap; gap: 10px; }
  .career-links button {
    background: #1e293b;
    color: #e2e8f0;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
  }
  .career-links button:hover { background: #7c3aed; }

  /* Back btn */
  .jd-back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    color: #64748b; background: none; border: none; cursor: pointer;
    font-size: 13px; font-weight: 600; margin-bottom: 24px; padding: 0;
  }
  .jd-back-btn:hover { color: #e2e8f0; }

  /* Banner */
  .jd-banner {
    margin-bottom: 28px; border-radius: 14px; overflow: hidden;
    border: 1px solid rgba(255,255,255,0.06);
    position: relative;
  }
  .jd-banner img { width: 100%; height: 260px; object-fit: cover; display: block; }
  @media (min-width: 640px) { .jd-banner img { height: 320px; } }
  .jd-featured-ribbon {
    position: absolute; top: 14px; left: 14px;
    background: #f59e0b; color: #0a0a0f;
    font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    padding: 5px 12px; border-radius: 20px;
  }

  /* Header */
  .jd-header { margin-bottom: 32px; }

  .jd-badges-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }

  .jd-type-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
  }
  .jd-expired-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25);
  }
  .jd-active-badge {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 20px;
    background: rgba(16,185,129,0.1); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.25);
  }

  .jd-company {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
  }
  .jd-title {
    font-size: clamp(24px, 5vw, 40px); font-weight: 800;
    color: #f1f5f9; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 14px;
  }
  .jd-desc { font-size: 15px; color: #94a3b8; line-height: 1.7; margin-bottom: 12px; }
  .jd-overview-note {
    font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 24px;
    border-left: 2px solid rgba(124,58,237,0.4); padding-left: 12px;
  }

  /* Meta cards */
  .jd-meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 640px) { .jd-meta-grid { grid-template-columns: repeat(3, 1fr); } }
  .jd-meta-card {
    display: flex; align-items: center; gap: 10px; padding: 12px 14px;
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
  }
  .jd-meta-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .jd-meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin-bottom: 2px; }
  .jd-meta-val   { font-size: 13px; font-weight: 600; color: #e2e8f0; }

  /* ── Rich Content ── */
  .job-content {
    font-size: 15.5px; line-height: 1.8; color: #94a3b8;
    margin-bottom: 32px; word-break: break-word;
  }
  .job-content h1 { font-size: 28px; font-weight: 800; color: #f1f5f9; margin: 40px 0 16px; }
  .job-content h2 { font-size: 22px; font-weight: 700; color: #f1f5f9; margin: 32px 0 14px; }
  .job-content h3 { font-size: 18px; font-weight: 700; color: #e2e8f0; margin: 26px 0 10px; }
  .job-content p  { margin-bottom: 18px; }
  .job-content ul { list-style:none; padding:0; margin-bottom:18px; }
  .job-content ul li { position:relative; padding-left:18px; margin-bottom:8px; }
  .job-content ul li::before { content:'▸'; position:absolute; left:0; color:#7c3aed; font-size:12px; top:3px; }
  .job-content ol { padding-left:22px; margin-bottom:18px; }
  .job-content ol li { margin-bottom:8px; }
  .job-content strong { color:#f1f5f9; font-weight:700; }
  .job-content a { color:#a78bfa; text-decoration:underline; text-underline-offset:3px; }
  .job-content a:hover { color:#c4b5fd; }
  .job-content blockquote {
    border-left:2px solid #7c3aed; background:rgba(124,58,237,0.05);
    padding:14px 18px; margin:20px 0; border-radius:0 10px 10px 0;
    color:#a5b4fc; font-style:italic;
  }
  .job-content img { width:100%; border-radius:10px; margin:20px 0; border:1px solid rgba(255,255,255,0.06); }
  .job-content pre {
    background:#0d0d14; border:1px solid rgba(255,255,255,0.06);
    border-radius:10px; padding:18px; overflow-x:auto; margin:20px 0;
  }
  .job-content code {
    background:rgba(124,58,237,0.1); color:#a78bfa; padding:2px 6px;
    border-radius:5px; font-size:13px; border:1px solid rgba(124,58,237,0.2);
  }
  .job-content pre code { background:transparent; border:none; padding:0; color:inherit; font-size:13px; }
  .job-content table { width:100%; border-collapse:collapse; margin:20px 0; border:1px solid rgba(255,255,255,0.06); border-radius:10px; overflow:hidden; }
  .job-content th { background:#111119; border-bottom:1px solid rgba(255,255,255,0.06); padding:10px 14px; text-align:left; font-weight:700; color:#f1f5f9; font-size:13px; }
  .job-content td { border-bottom:1px solid rgba(255,255,255,0.04); padding:10px 14px; font-size:13px; }
  .job-content tr:last-child td { border-bottom:none; }

  /* Code wrapper */
  .code-wrapper { margin:20px 0; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.05); }
  .code-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:10px 14px; background:#0d0d0d; border-bottom:1px solid rgba(255,255,255,0.05);
  }
  .code-dots { display:flex; gap:6px; }
  .code-dots span { width:10px; height:10px; border-radius:50%; display:block; }
  .code-lang { font-size:10px; font-weight:700; letter-spacing:0.1em; color:#6ee7b7; opacity:0.7; text-transform:uppercase; }
  .code-copy {
    font-size:11px; font-weight:600; background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.08); color:#94a3b8;
    padding:3px 10px; border-radius:6px; cursor:pointer;
  }
  .code-copy:hover { color:#fff; background:rgba(255,255,255,0.1); }
  .code-wrapper pre { background:#08080e !important; margin:0 !important; border-radius:0 !important; border:none !important; }

  /* Tags */
  .jd-tags-section { margin-bottom: 32px; }
  .jd-tags-label { display:flex; align-items:center; gap:6px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin-bottom:10px; }
  .jd-tags-wrap  { display:flex; flex-wrap:wrap; gap:8px; }
  .jd-tag {
    font-size:12px; font-weight:600; color:#64748b;
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    padding:4px 12px; border-radius:6px;
  }

  /* Divider */
  .jd-divider { height:1px; background:rgba(255,255,255,0.06); margin:32px 0; }

  /* Apply block */
  .jd-apply-block {
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    background:rgba(99,102,241,0.05); border:1px solid rgba(99,102,241,0.15);
    border-radius:14px; padding:22px 24px; flex-wrap:wrap;
  }
  .jd-apply-title { font-size:18px; font-weight:800; color:#f1f5f9; margin-bottom:4px; }
  .jd-apply-sub   { font-size:13px; color:#64748b; line-height:1.5; }
  .jd-apply-btn {
    display:inline-flex; align-items:center; gap:8px;
    background: #7c3aed; color:#fff;
    font-size:14px; font-weight:700; padding:12px 22px; border-radius:10px;
    text-decoration:none; white-space:nowrap;
  }
  .jd-apply-btn:hover { background: #6d28d9; }

  /* Loading */
  .jd-loading {
    min-height:100vh; background:#0a0a0f;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:16px; color:#64748b;
    font-size:13px; letter-spacing:0.08em; text-transform:uppercase;
  }
  .jd-loader {
    width:28px; height:28px; border:2px solid rgba(124,58,237,0.15);
    border-top-color:#7c3aed; border-radius:50%;
    animation:jd-spin 0.7s linear infinite;
  }
  @keyframes jd-spin { to { transform:rotate(360deg); } }

  /* Not found */
  .jd-notfound {
    min-height:100vh; background:#0a0a0f;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:10px; text-align:center; padding:24px;
  }
  .jd-notfound h1 { font-size:26px; font-weight:800; color:#f1f5f9; }
  .jd-notfound p  { font-size:14px; color:#64748b; }
  .jd-back-big {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(124,58,237,0.12); border:1px solid rgba(124,58,237,0.3);
    color:#a78bfa; font-size:14px; font-weight:600; padding:10px 20px;
    border-radius:10px; cursor:pointer; margin-top:6px;
  }
  .jd-back-big:hover { background:rgba(124,58,237,0.22); }

  ::selection { background:rgba(124,58,237,0.3); color:#fff; }

  @media(max-width:640px) {
    .career-card { flex-direction: column; text-align: center; }
    .jd-apply-block { padding:18px; flex-direction:column; align-items: flex-start; }
    .jd-apply-btn { width:100%; justify-content:center; }
  }
`;