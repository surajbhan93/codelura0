"use client";

import Link from "next/link";

export interface Job {
  _id: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "internship" | "full-time" | "part-time" | "contract";
  salary?: string;
  tags: string[];
  careerPageUrl: string;
  description: string;
  isFeatured: boolean;
  isExpired: boolean;
  postedAt?: string;
  deadline?: string;
}

interface JobCardProps {
  job: Job;
  expired?: boolean;
  featured?: boolean;
}

const TYPE_BADGE: Record<string, { cls: string; label: string }> = {
  internship:  { cls: "badge-internship", label: "Internship" },
  "full-time": { cls: "badge-fulltime",   label: "Full-Time"  },
  "part-time": { cls: "badge-parttime",   label: "Part-Time"  },
  contract:    { cls: "badge-contract",   label: "Contract"   },
};

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobCard({ job, expired = false, featured = false }: JobCardProps) {
  const badge = TYPE_BADGE[job.type] ?? { cls: "", label: job.type };

  return (
    <>
      <style>{`
        .jc-wrap {
          background: #ffffff;
          border: 1px solid #ddd5c8;
          border-radius: 14px;
          padding: 22px 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .jc-wrap:not(.jc-expired):hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px -8px rgba(0,0,0,0.12);
          border-color: #e8a87c;
        }
        .jc-wrap.jc-featured {
          border-color: #e8a87c;
          box-shadow: 0 4px 24px -4px rgba(200,65,10,0.10);
        }
        .jc-wrap.jc-featured::before {
          content: '⭐ Featured';
          position: absolute;
          top: 0; left: 0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          background: linear-gradient(90deg, #c8410a, #e8a87c);
          color: #fff;
          padding: 4px 14px 4px 10px;
          border-bottom-right-radius: 10px;
        }
        .jc-wrap.jc-expired {
          opacity: 0.60;
          background: #f2ede4;
          cursor: not-allowed;
        }
        .jc-wrap.jc-expired::after {
          content: 'EXPIRED';
          position: absolute;
          top: 12px; right: 12px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          background: #f9e6e6;
          color: #8a1a1a;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid #e0b0b0;
        }

        /* ── Top row ── */
        .jc-top {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: ${featured ? "18px" : "0"};
        }
        .jc-logo {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid #ddd5c8;
          background: #f2ede4;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          color: #7a7065;
          overflow: hidden;
        }
        .jc-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        .jc-company {
          font-size: 12px;
          font-weight: 500;
          color: #7a7065;
          margin-bottom: 3px;
        }
        .jc-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          color: #0d0d0d;
          line-height: 1.3;
        }

        /* ── Badges ── */
        .jc-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .jc-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
        }
        .badge-internship { background: #e6edf9; color: #1a4a8a; }
        .badge-fulltime   { background: #e6f5ed; color: #1a7a4a; }
        .badge-parttime   { background: #fef9e6; color: #7a5c00; }
        .badge-contract   { background: #f3e6f9; color: #5c1a8a; }
        .badge-location   { background: #f2ede4; color: #7a7065; border: 1px solid #ddd5c8; }
        .badge-salary     { background: #e6f9ef; color: #1a6640; border: 1px solid #b3e6cc; }

        /* ── Description ── */
        .jc-desc {
          font-size: 13px;
          color: #7a7065;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Tags ── */
        .jc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .jc-tag {
          font-size: 10px;
          font-weight: 500;
          color: #7a7065;
          background: #f2ede4;
          border: 1px solid #ddd5c8;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* ── Footer ── */
        .jc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f2ede4;
        }
        .jc-date {
          font-size: 11px;
          color: #a89d8e;
        }
        .jc-apply {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #c8410a;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .jc-apply:hover {
          background: #a8330a;
          transform: translateY(-1px);
        }
        .jc-apply svg {
          width: 12px;
          height: 12px;
          flex-shrink: 0;
        }
      `}</style>

      <div className={`jc-wrap${expired ? " jc-expired" : ""}${featured ? " jc-featured" : ""}`}>

        {/* Logo + Company + Title */}
        <div className="jc-top">
          <div className="jc-logo">
            {job.companyLogo
              ? <img src={job.companyLogo} alt={job.company} />
              : job.company.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <div className="jc-company">{job.company}</div>
            <div className="jc-title">{job.title}</div>
          </div>
        </div>

        {/* Badges */}
        <div className="jc-badges">
          <span className={`jc-badge ${badge.cls}`}>{badge.label}</span>
          <span className="jc-badge badge-location">📍 {job.location}</span>
          {job.salary && (
            <span className="jc-badge badge-salary">💰 {job.salary}</span>
          )}
        </div>

        {/* Short description */}
        {job.description && (
          <p className="jc-desc">{job.description}</p>
        )}

        {/* Skill tags */}
        {job.tags.length > 0 && (
          <div className="jc-tags">
            {job.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="jc-tag">{tag}</span>
            ))}
            {job.tags.length > 5 && (
              <span className="jc-tag">+{job.tags.length - 5} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="jc-footer">
          <span className="jc-date">
            {expired
              ? `Expired · ${formatDate(job.deadline)}`
              : `Posted ${formatDate(job.postedAt)}`
            }
          </span>
          {!expired && (
            <a
              href={job.careerPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="jc-apply"
            >
              Apply Now
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </>
  );
}