"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  MapPin, Clock, Building2, ArrowRight, Sparkles,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface RelatedJob {
  _id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  type: "internship" | "full-time" | "part-time" | "contract";
  salary?: string;
  tags?: string[];
  postedAt?: string;
  createdAt?: string;
  isFeatured?: boolean;
  isExpired?: boolean;
}

interface RelatedJobsProps {
  currentSlug: string;   // slug of currently-viewed job (to exclude it)
  tags?: string[];       // current job's tags for similarity matching
  company?: string;      // current job's company
  limit?: number;        // how many cards to show (default 4)
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const TYPE_META: Record<string, { label: string; color: string; glow: string }> = {
  internship:  { label: "Internship", color: "#3b82f6", glow: "rgba(59,130,246,0.25)"  },
  "full-time": { label: "Full-Time",  color: "#10b981", glow: "rgba(16,185,129,0.25)"  },
  "part-time": { label: "Part-Time",  color: "#f59e0b", glow: "rgba(245,158,11,0.25)"  },
  contract:    { label: "Contract",   color: "#a855f7", glow: "rgba(168,85,247,0.25)"  },
};

function timeAgo(d?: string) {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
export default function RelatedJobs({
  currentSlug,
  tags = [],
  company = "",
  limit = 4,
}: RelatedJobsProps) {
  const router = useRouter();
  const [jobs, setJobs]       = useState<RelatedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSlug) return;

    const params = new URLSearchParams({
      exclude: currentSlug,
      limit:   String(limit),
      ...(tags.length ? { tags: tags.join(",") } : {}),
      ...(company     ? { company }              : {}),
    });

    api
      .get(`/jobs/related?${params.toString()}`)
      .then(({ data }) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [currentSlug, tags.join(","), company, limit]);

  // Don't render the section at all if no results
  if (!loading && jobs.length === 0) return null;

  return (
    <>
      <style>{styles}</style>

      <section className="rj-root">

        {/* ── Section header ── */}
        <div className="rj-header">
          <div className="rj-header-left">
            <span className="rj-icon-wrap">
              <Sparkles size={14} />
            </span>
            <h2 className="rj-heading">Related Jobs</h2>
          </div>
          <button
            className="rj-browse-all"
            onClick={() => router.push("/jobs-Alerts")}
          >
            Browse All <ArrowRight size={13} />
          </button>
        </div>

        {/* ── Skeleton loader ── */}
        {loading ? (
          <div className="rj-grid">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className="rj-skeleton"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="rj-skel-line" style={{ width: "50%", height: 12, marginBottom: 10 }} />
                <div className="rj-skel-line" style={{ width: "30%", height: 10, marginBottom: 18 }} />
                <div className="rj-skel-line" style={{ width: "85%", height: 16, marginBottom: 8 }} />
                <div className="rj-skel-line" style={{ width: "65%", height: 12, marginBottom: 16 }} />
                <div style={{ display: "flex", gap: 6 }}>
                  <div className="rj-skel-line" style={{ width: 48, height: 20, borderRadius: 6 }} />
                  <div className="rj-skel-line" style={{ width: 48, height: 20, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rj-grid">
            {jobs.map((job, i) => {
              const tm = TYPE_META[job.type] ?? {
                label: job.type, color: "#94a3b8", glow: "rgba(148,163,184,0.2)",
              };
              const isHov = hovered === job._id;

              return (
                <article
                  key={job._id}
                  className="rj-card"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    "--glow": tm.glow,
                  } as React.CSSProperties}
                  onMouseEnter={() => setHovered(job._id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => router.push(`/jobs-Alerts/${job.slug}`)}
                >
                  {/* Type + featured */}
                  <div className="rj-card-top">
                    <span
                      className="rj-type-badge"
                      style={{
                        color: tm.color,
                        background: `${tm.color}18`,
                        border: `1px solid ${tm.color}40`,
                      }}
                    >
                      <span className="rj-dot" style={{ background: tm.color }} />
                      {tm.label}
                    </span>
                    {job.isFeatured && (
                      <span className="rj-featured-badge">⭐ Featured</span>
                    )}
                    {job.isExpired && (
                      <span className="rj-expired-badge">Expired</span>
                    )}
                  </div>

                  {/* Company */}
                  <p className="rj-company">
                    <Building2 size={10} /> {job.company}
                  </p>

                  {/* Title */}
                  <h3 className="rj-title">{job.title}</h3>

                  {/* Location + time */}
                  <div className="rj-meta-row">
                    <span className="rj-meta-item">
                      <MapPin size={10} /> {job.location}
                    </span>
                    <span className="rj-meta-item">
                      <Clock size={10} /> {timeAgo(job.postedAt || job.createdAt)}
                    </span>
                    {job.salary && (
                      <span className="rj-salary">{job.salary}</span>
                    )}
                  </div>

                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div className="rj-tags-wrap">
                      {job.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rj-tag">#{tag}</span>
                      ))}
                      {job.tags.length > 3 && (
                        <span className="rj-tag rj-tag-more">+{job.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Hover arrow */}
                  <div className={`rj-arrow ${isHov ? "rj-arrow-vis" : ""}`}>
                    <ArrowRight size={14} />
                  </div>

                  {/* Glow overlay */}
                  <div className="rj-card-glow" />
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  .rj-root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px 80px;
    position: relative;
    z-index: 1;
    font-family: 'Inter', sans-serif;
  }

  /* Header */
  .rj-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .rj-header-left { display: flex; align-items: center; gap: 10px; }
  .rj-icon-wrap {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: rgba(124,58,237,0.12);
    border: 1px solid rgba(124,58,237,0.25);
    color: #a78bfa;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rj-heading {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #f1f5f9; letter-spacing: -0.4px; margin: 0;
  }
  .rj-browse-all {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #64748b;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: color 0.18s; padding: 0;
  }
  .rj-browse-all:hover { color: #a78bfa; }

  /* Grid */
  .rj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(255px, 1fr));
    gap: 14px;
  }

  /* Card */
  .rj-card {
    position: relative;
    padding: 20px 20px 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    cursor: pointer; overflow: hidden;
    transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
    animation: rj-fadein 0.45s ease both;
  }
  .rj-card:hover {
    border-color: rgba(124,58,237,0.3);
    transform: translateY(-3px);
    box-shadow: 0 18px 44px rgba(0,0,0,0.38);
  }
  @keyframes rj-fadein {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* Glow */
  .rj-card-glow {
    position: absolute; inset: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(ellipse 70% 55% at 50% 0%, var(--glow, rgba(124,58,237,0.2)), transparent 70%);
    transition: opacity 0.3s; border-radius: 16px;
  }
  .rj-card:hover .rj-card-glow { opacity: 1; }

  /* Card top */
  .rj-card-top {
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 10px; flex-wrap: wrap;
  }
  .rj-type-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
    font-family: 'Inter', sans-serif;
  }
  .rj-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .rj-featured-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 20px;
    background: linear-gradient(90deg,rgba(245,158,11,0.15),rgba(249,115,22,0.15));
    color: #fbbf24; border: 1px solid rgba(245,158,11,0.25);
    font-family: 'Inter', sans-serif;
  }
  .rj-expired-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 20px;
    background: rgba(239,68,68,0.1); color: #f87171;
    border: 1px solid rgba(239,68,68,0.22); font-family: 'Inter', sans-serif;
  }

  /* Company */
  .rj-company {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: #475569;
    text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;
  }

  /* Title */
  .rj-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 800; color: #e2e8f0;
    line-height: 1.3; margin: 0 0 12px; letter-spacing: -0.2px;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Meta row */
  .rj-meta-row {
    display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
    margin-bottom: 12px;
  }
  .rj-meta-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 500; color: #475569;
  }
  .rj-salary {
    font-size: 11px; font-weight: 700; color: #6ee7b7;
    background: rgba(16,185,129,0.08); padding: 2px 8px;
    border-radius: 5px; border: 1px solid rgba(16,185,129,0.18);
  }

  /* Tags */
  .rj-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
  .rj-tag {
    font-size: 10px; font-weight: 600; color: #334155;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 2px 8px; border-radius: 5px; transition: all 0.18s;
  }
  .rj-card:hover .rj-tag { border-color: rgba(124,58,237,0.2); color: #64748b; }
  .rj-tag-more {
    color: #818cf8; background: rgba(99,102,241,0.08);
    border-color: rgba(99,102,241,0.2);
  }

  /* Arrow */
  .rj-arrow {
    position: absolute; bottom: 16px; right: 16px;
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.25);
    color: #a78bfa; display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(0.8);
    transition: opacity 0.2s, transform 0.2s;
  }
  .rj-arrow-vis { opacity: 1; transform: scale(1); }

  /* Skeleton */
  .rj-skeleton {
    padding: 20px;
    background: rgba(255,255,255,0.015);
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 16px;
    animation: rj-pulse 1.6s ease-in-out infinite;
  }
  @keyframes rj-pulse { 0%,100%{opacity:0.45;} 50%{opacity:0.9;} }
  .rj-skel-line { border-radius: 6px; background: rgba(255,255,255,0.05); }

  /* Responsive */
  @media (max-width: 640px) {
    .rj-root { padding: 0 16px 60px; }
    .rj-grid { grid-template-columns: 1fr; }
  }
`;