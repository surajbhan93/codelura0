"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { MapPin, Clock, BookOpen, ArrowRight, Sparkles } from "lucide-react";

/* ─────────────────────────────────────
   TYPES
───────────────────────────────────── */
interface RelatedCourse {
  _id: string;
  title: string;
  slug?: string;
  category?: string;
  language?: string;
  level?: string;
  price: number;
  isPaid: boolean;
  tags?: string[];
  bannerImage?: string;
  createdAt?: string;
  isFeatured?: boolean;
  previewPages?: number;
}

interface RelatedCoursesProps {
  currentId: string;
  tags?: string[];
  category?: string;
  limit?: number;
}

/* ─────────────────────────────────────
   HELPERS
───────────────────────────────────── */
const LEVEL_META: Record<string, { color: string; bg: string; border: string }> = {
  beginner:     { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)"  },
  intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)"  },
  advanced:     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)"   },
};

function timeAgo(d?: string) {
  if (!d) return "";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ─────────────────────────────────────
   COMPONENT
───────────────────────────────────── */
export default function RelatedCourses({
  currentId,
  tags = [],
  category = "",
  limit = 4,
}: RelatedCoursesProps) {
  const router  = useRouter();
  const [courses, setCourses] = useState<RelatedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    if (!currentId) return;

    const params = new URLSearchParams({
      exclude:  currentId,
      limit:    String(limit),
      ...(tags.length ? { tags: tags.join(",") } : {}),
      ...(category    ? { category }             : {}),
    });

    api
      .get(`/courses/related?${params.toString()}`)
      .then(({ data }) => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [currentId, tags.join(","), category, limit]);

  if (!loading && courses.length === 0) return null;

  return (
    <section className="rc-root">
      <style>{styles}</style>

      {/* Header */}
      <div className="rc-header">
        <div className="rc-header-left">
          <span className="rc-icon-wrap"><Sparkles size={14} /></span>
          <h2 className="rc-heading">More Like This</h2>
        </div>
        <button className="rc-browse-all" onClick={() => router.push("/courses")}>
          All Courses <ArrowRight size={13} />
        </button>
      </div>

      {/* Skeleton */}
      {loading ? (
        <div className="rc-grid">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="rc-skeleton" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="rc-skel-banner" />
              <div className="rc-skel-body">
                <div className="rc-skel-line" style={{ width: "45%", height: 11, marginBottom: 10 }} />
                <div className="rc-skel-line" style={{ width: "85%", height: 16, marginBottom: 8 }} />
                <div className="rc-skel-line" style={{ width: "60%", height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rc-grid">
          {courses.map((course, i) => {
            const lm = LEVEL_META[course.level ?? ""] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" };
            const isHov = hovered === course._id;

            return (
              <article
                key={course._id}
                className="rc-card"
                style={{ animationDelay: `${i * 0.07}s`, "--glow": lm.bg } as React.CSSProperties}
                onMouseEnter={() => setHovered(course._id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/courses/${course._id}`)}
              >
                {/* Banner */}
                <div className="rc-banner">
                  {course.bannerImage ? (
                    <img src={course.bannerImage} alt={course.title} className="rc-banner-img" />
                  ) : (
                    <div className="rc-banner-placeholder">
                      <BookOpen size={28} color="rgba(255,255,255,0.15)" />
                    </div>
                  )}
                  {course.isFeatured && (
                    <span className="rc-featured-pill">⭐ Featured</span>
                  )}
                  <span className="rc-price-pill">
                    {course.isPaid ? `₹${course.price}` : "Free"}
                  </span>
                </div>

                {/* Body */}
                <div className="rc-body">
                  {/* Badges */}
                  <div className="rc-badges">
                    {course.level && (
                      <span className="rc-level-badge" style={{ color: lm.color, background: lm.bg, border: `1px solid ${lm.border}` }}>
                        {course.level}
                      </span>
                    )}
                    {course.category && (
                      <span className="rc-cat-badge">{course.category}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="rc-title">{course.title}</h3>

                  {/* Meta */}
                  <div className="rc-meta-row">
                    {course.language && (
                      <span className="rc-meta-item">
                        <MapPin size={10} /> {course.language}
                      </span>
                    )}
                    <span className="rc-meta-item">
                      <Clock size={10} /> {timeAgo(course.createdAt)}
                    </span>
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div className="rc-tags-wrap">
                      {course.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rc-tag">#{t}</span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="rc-tag rc-tag-more">+{course.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Hover arrow */}
                <div className={`rc-arrow ${isHov ? "rc-arrow-vis" : ""}`}>
                  <ArrowRight size={14} />
                </div>

                {/* Glow */}
                <div className="rc-glow" />
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────
   STYLES
───────────────────────────────────── */
const styles = `
  .rc-root {
    font-family: 'Outfit', sans-serif;
    position: relative; z-index: 1;
  }

  /* Header */
  .rc-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  .rc-header-left { display: flex; align-items: center; gap: 10px; }
  .rc-icon-wrap {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    color: #fbbf24; display: flex; align-items: center; justify-content: center;
  }
  .rc-heading {
    font-family: 'Instrument Serif', serif;
    font-size: 20px; font-weight: 700; color: #f1f5f9;
    letter-spacing: -0.3px; margin: 0;
  }
  .rc-browse-all {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 600; color: #64748b;
    background: none; border: none; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: color 0.18s; padding: 0;
  }
  .rc-browse-all:hover { color: #fbbf24; }

  /* Grid */
  .rc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }

  /* Card */
  .rc-card {
    position: relative;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 18px; cursor: pointer; overflow: hidden;
    transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
    animation: rc-fadein 0.45s ease both;
    padding-bottom: 16px;
  }
  .rc-card:hover {
    border-color: rgba(245,158,11,0.25);
    transform: translateY(-3px);
    box-shadow: 0 18px 44px rgba(0,0,0,0.4);
  }
  @keyframes rc-fadein {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Banner */
  .rc-banner {
    position: relative; height: 130px; overflow: hidden;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .rc-banner-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
  .rc-card:hover .rc-banner-img { transform: scale(1.04); }
  .rc-banner-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, rgba(245,158,11,0.05), rgba(251,191,36,0.02));
  }
  .rc-featured-pill {
    position: absolute; top: 10px; left: 10px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 20px;
    background: linear-gradient(90deg, rgba(245,158,11,0.9), rgba(249,115,22,0.9));
    color: #fff; font-family: 'Outfit', sans-serif;
  }
  .rc-price-pill {
    position: absolute; top: 10px; right: 10px;
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(0,0,0,0.6); color: #fbbf24;
    border: 1px solid rgba(245,158,11,0.25);
    font-family: 'Outfit', sans-serif; backdrop-filter: blur(6px);
  }

  /* Body */
  .rc-body { padding: 14px 16px 0; }

  .rc-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
  .rc-level-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 2px 8px; border-radius: 20px;
    font-family: 'Outfit', sans-serif;
  }
  .rc-cat-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 2px 8px; border-radius: 20px;
    background: rgba(99,102,241,0.1); color: #818cf8;
    border: 1px solid rgba(99,102,241,0.2); font-family: 'Outfit', sans-serif;
  }

  .rc-title {
    font-family: 'Instrument Serif', serif;
    font-size: 15px; font-weight: 700; color: #e2e8f0;
    line-height: 1.35; margin: 0 0 10px;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  .rc-meta-row {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
  }
  .rc-meta-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 500; color: #475569;
    font-family: 'Outfit', sans-serif;
  }

  .rc-tags-wrap { display: flex; flex-wrap: wrap; gap: 5px; }
  .rc-tag {
    font-size: 10px; font-weight: 600; color: #334155;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 2px 7px; border-radius: 5px; transition: all 0.18s;
    font-family: 'Outfit', sans-serif;
  }
  .rc-card:hover .rc-tag { border-color: rgba(245,158,11,0.2); color: #64748b; }
  .rc-tag-more {
    color: #fbbf24; background: rgba(245,158,11,0.07);
    border-color: rgba(245,158,11,0.18);
  }

  /* Arrow */
  .rc-arrow {
    position: absolute; bottom: 14px; right: 14px;
    width: 26px; height: 26px; border-radius: 7px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2);
    color: #fbbf24; display: flex; align-items: center; justify-content: center;
    opacity: 0; transform: scale(0.8);
    transition: opacity 0.2s, transform 0.2s;
  }
  .rc-arrow-vis { opacity: 1; transform: scale(1); }

  /* Glow */
  .rc-glow {
    position: absolute; inset: 0; pointer-events: none; opacity: 0;
    background: radial-gradient(ellipse 70% 50% at 50% 0%, var(--glow, rgba(245,158,11,0.1)), transparent 70%);
    transition: opacity 0.3s; border-radius: 18px;
  }
  .rc-card:hover .rc-glow { opacity: 1; }

  /* Skeleton */
  .rc-skeleton {
    border-radius: 18px; overflow: hidden;
    background: rgba(255,255,255,0.015);
    border: 1px solid rgba(255,255,255,0.04);
    animation: rc-pulse 1.6s ease-in-out infinite;
  }
  .rc-skel-banner { height: 130px; background: rgba(255,255,255,0.04); }
  .rc-skel-body { padding: 14px 16px; }
  .rc-skel-line { border-radius: 6px; background: rgba(255,255,255,0.05); }
  @keyframes rc-pulse { 0%,100%{opacity:0.45;} 50%{opacity:0.9;} }

  @media (max-width: 640px) {
    .rc-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 400px) {
    .rc-grid { grid-template-columns: 1fr; }
  }
`;