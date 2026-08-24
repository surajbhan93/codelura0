"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import type { Job } from "../JobsPageClient";
import JobSearch from "@/components/jobs/JobSearch";
import type { Job } from "@/components/career/JobsPageClient";

const TABS = [
  { key: "off-campus", label: "🏢 Off-Campus", color: "#7a5c00" },
  { key: "expired",    label: "⏰ Expired",     color: "#8a1a1a" },
] as const;

type TabKey = typeof TABS[number]["key"];
const JOBS_PER_PAGE = 6;

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ─────────────────────────────────────────
   JOB CARD
───────────────────────────────────────── */
function JobCardUI({ job, expired = false }: { job: Job; expired?: boolean }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/jobs-Alerts/${job.slug}`);
  };

  return (
    <div
      className={`job-card${expired ? " expired" : ""}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {expired && <span className="expired-badge">EXPIRED</span>}
      {job.isFeatured && !expired && <span className="featured-badge">⭐ Featured</span>}

      <div className="job-card-top">
        <div className="job-logo">
          {job.bannerImage
            ? <img src={job.bannerImage} alt={job.company} />
            : <span>{job.company.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="job-info">
          <p className="job-company">{job.company}</p>
          <h3 className="job-title">{job.title}</h3>
        </div>
      </div>

      <div className="job-badges">
        <span className="jb badge-offcampus">Off-Campus</span>
        <span className="jb badge-loc">📍 {job.location}</span>
        {job.salary && <span className="jb badge-sal">💰 {job.salary}</span>}
      </div>

      {job.description && (
        <p className="job-desc">{job.description}</p>
      )}

      {job.tags.length > 0 && (
        <div className="job-tags">
          {job.tags.slice(0, 5).map((t) => (
            <span key={t} className="job-tag">{t}</span>
          ))}
          {job.tags.length > 5 && (
            <span className="job-tag">+{job.tags.length - 5}</span>
          )}
        </div>
      )}

      <div className="job-footer">
        <span className="job-date">
          {expired
            ? `Expired · ${formatDate(job.deadline)}`
            : `Posted ${formatDate(job.postedAt)}`}
        </span>
        {!expired && (
          <span className="view-btn">
            View Details →
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ tab }: { tab: TabKey }) {
  const map: Record<TabKey, { icon: string; title: string; sub: string }> = {
    "off-campus": { icon: "🏢", title: "No off-campus drives yet", sub: "We'll list them here as soon as they open up." },
    expired:      { icon: "⏰", title: "No expired listings",      sub: "All current off-campus listings are still active." },
  };
  const { icon, title, sub } = map[tab];
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="empty-title">{title}</p>
      <p className="empty-sub">{sub}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGINATION
───────────────────────────────────────── */
function Pagination({
  page, total, perPage, onChange,
}: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button className="pg-btn pg-arrow" disabled={page === 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="pg-ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`pg-btn${page === p ? " active" : ""}`}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button className="pg-btn pg-arrow" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next →
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE CLIENT (OFF-CAMPUS ONLY)
───────────────────────────────────────── */
export default function OffCampusJobsClient({ jobs }: { jobs: Job[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("off-campus");
  const [pages, setPages] = useState<Record<TabKey, number>>({
    "off-campus": 1, expired: 1,
  });

  // 🔒 Hard filter: sirf "off-campus" type jobs, koi bhi internship/full-time/walk-in yahan nahi aayegi
  const offCampusOnly = jobs.filter((j) => j.type === "off-campus");

  const activeOffCampus  = offCampusOnly.filter((j) => !j.isExpired);
  const expiredOffCampus = offCampusOnly.filter((j) => j.isExpired);

  const tabData: Record<TabKey, Job[]> = {
    "off-campus": activeOffCampus,
    expired:      expiredOffCampus,
  };

  const counts: Record<TabKey, number> = {
    "off-campus": activeOffCampus.length,
    expired:      expiredOffCampus.length,
  };

  const currentPage = pages[activeTab];
  const allForTab   = tabData[activeTab];
  const paginated   = allForTab.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  const handlePageChange = (p: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: p }));
    window.scrollTo({ top: 420, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --ink:      #0d0d0d;
          --paper:    #f9f5ef;
          --paper-2:  #f2ede4;
          --accent:   #b8860b;
          --accent-2: #e6c168;
          --muted:    #7a7065;
          --border:   #ddd5c8;
          --card-bg:  #ffffff;
          --hero-bg:  #1a1608;
        }
        * { box-sizing: border-box; }

        .jobs-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--paper);
          min-height: 100vh;
          color: var(--ink);
        }

        .jobs-hero {
          position: relative;
          background: var(--hero-bg);
          overflow: hidden;
          padding: 80px 24px 70px;
        }
        .jobs-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 50%, #b8860b22 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 10% 80%, #e6c16818 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--accent-2); margin-bottom: 20px;
        }
        .hero-eyebrow span { display: inline-block; width: 28px; height: 1px; background: var(--accent-2); }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(44px, 7vw, 84px); font-weight: 900;
          line-height: 0.95; color: #f9f5ef; letter-spacing: -2px; margin-bottom: 20px;
        }
        .hero-title em { font-style: italic; color: var(--accent-2); }
        .hero-sub {
          font-size: 16px; font-weight: 300; color: #a89d8e;
          max-width: 460px; line-height: 1.7; margin-bottom: 36px;
        }
        .hero-stats { display: flex; gap: 36px; padding-top: 32px; border-top: 1px solid #2e2618; flex-wrap: wrap; }
        .hero-stat-val { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #f9f5ef; }
        .hero-stat-lbl { font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: #6b5f50; margin-top: 2px; }

        .tab-strip-wrap { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 30; }
        .tab-strip { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; overflow-x: auto; scrollbar-width: none; }
        .tab-strip::-webkit-scrollbar { display: none; }
        .tab-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 22px; font-size: 13px; font-weight: 600;
          color: var(--muted); background: none; border: none;
          border-bottom: 2px solid transparent; cursor: pointer;
          white-space: nowrap; transition: color 0.18s;
          position: relative; bottom: -1px; font-family: 'DM Sans', sans-serif;
        }
        .tab-btn:hover { color: var(--ink); }
        .tab-btn.active { color: var(--ink); border-bottom-color: var(--tab-color, #b8860b); }
        .tab-count {
          font-size: 10px; font-weight: 700; padding: 1px 7px;
          border-radius: 20px; background: var(--paper-2); color: var(--muted);
          transition: background 0.18s, color 0.18s;
        }
        .tab-btn.active .tab-count { background: var(--tab-color, #b8860b); color: #fff; }

        .jobs-body { max-width: 1200px; margin: 0 auto; padding: 48px 24px 100px; }

        .section-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .section-heading h2 { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 700; color: var(--ink); }
        .section-result-count { font-size: 12px; color: var(--muted); font-weight: 500; }

        .jobs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
        @media (max-width: 1024px) { .jobs-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 640px)  { .jobs-grid { grid-template-columns: 1fr; } }

        .job-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 20px 18px;
          display: flex; flex-direction: column; gap: 12px;
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
          position: relative; overflow: hidden;
        }
        .job-card:not(.expired):hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px -8px rgba(0,0,0,0.13);
          border-color: var(--accent-2);
        }
        .job-card.expired { opacity: 0.58; background: var(--paper-2); }

        .expired-badge {
          position: absolute; top: 12px; right: 12px;
          font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
          background: #f9e6e6; color: #8a1a1a;
          padding: 3px 8px; border-radius: 20px; border: 1px solid #e0b0b0;
        }
        .featured-badge {
          position: absolute; top: 0; left: 0;
          font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
          background: linear-gradient(90deg, #b8860b, #e6c168);
          color: #fff; padding: 4px 12px 4px 10px; border-bottom-right-radius: 10px;
        }

        .job-card-top { display: flex; align-items: flex-start; gap: 13px; margin-top: 4px; }
        .job-logo {
          width: 48px; height: 48px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--paper-2);
          flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: 700; color: var(--muted); overflow: hidden;
        }
        .job-logo img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
        .job-info { min-width: 0; }
        .job-company { font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.06em; }
        .job-title { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: var(--ink); line-height: 1.3; }

        .job-badges { display: flex; flex-wrap: wrap; gap: 7px; }
        .jb { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
        .badge-offcampus { background: #fef2e0; color: #8a5a00; }
        .badge-loc       { background: var(--paper-2); color: var(--muted); border: 1px solid var(--border); }
        .badge-sal       { background: #e6f9ef; color: #1a6640; border: 1px solid #b3e6cc; }

        .job-desc { font-size: 13px; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .job-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .job-tag { font-size: 10px; font-weight: 500; color: var(--muted); background: var(--paper-2); border: 1px solid var(--border); padding: 2px 8px; border-radius: 4px; }

        .job-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 12px; border-top: 1px solid var(--paper-2); }
        .job-date { font-size: 11px; color: #a89d8e; }

        .view-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--accent); color: #fff;
          font-size: 12px; font-weight: 600;
          padding: 7px 16px; border-radius: 8px;
          transition: background 0.18s, transform 0.18s;
        }
        .job-card:hover .view-btn { background: #96700a; transform: translateY(-1px); }

        .empty-state { grid-column: 1/-1; text-align: center; padding: 72px 24px; background: var(--paper-2); border: 1px dashed var(--border); border-radius: 16px; }
        .empty-icon  { font-size: 44px; margin-bottom: 14px; opacity: 0.4; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink); margin-bottom: 6px; font-weight: 700; }
        .empty-sub   { font-size: 14px; color: var(--muted); }

        .pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
        .pg-btn {
          min-width: 38px; height: 38px; padding: 0 10px; border-radius: 9px;
          border: 1px solid var(--border); background: #fff; color: var(--muted);
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: all 0.18s; display: inline-flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }
        .pg-btn:hover:not(:disabled) { border-color: var(--accent-2); color: var(--ink); }
        .pg-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
        .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pg-arrow { padding: 0 16px; font-size: 12px; }
        .pg-ellipsis { color: var(--muted); font-size: 14px; padding: 0 4px; user-select: none; }

        @media (max-width: 640px) {
          .jobs-hero { padding: 52px 20px 48px; }
          .jobs-body { padding: 32px 16px 80px; }
          .tab-btn   { padding: 14px 16px; font-size: 12px; }
        }
      `}</style>

      <div className="jobs-root">

        <header className="jobs-hero">
          <div className="hero-inner">
            <p className="hero-eyebrow"><span /> Codelura Jobs Alert <span /></p>
            <h1 className="hero-title">Off-Campus <em>Drives</em><br />Near You</h1>
            <p className="hero-sub">
              Off-campus hiring drives from top companies — curated by the Codelura
              team so you can apply directly, no campus placement required.
            </p>
            <div className="hero-stats">
              {[
                { val: activeOffCampus.length,  lbl: "Active Drives" },
                { val: expiredOffCampus.length, lbl: "Expired"       },
              ].map(({ val, lbl }) => (
                <div key={lbl}>
                  <div className="hero-stat-val">{val}</div>
                  <div className="hero-stat-lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="tab-strip-wrap">
          <div className="tab-strip">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
                style={{ "--tab-color": tab.color } as React.CSSProperties}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className="tab-count">{counts[tab.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="jobs-body">
          <div className="section-heading">
            <h2>
              {activeTab === "off-campus" && <><em style={{ color: "#7a5c00" }}>Off-Campus</em> Drives</>}
              {activeTab === "expired"    && <><em style={{ color: "#8a1a1a" }}>Expired</em> Off-Campus Listings</>}
            </h2>
            {allForTab.length > 0 && (
              <span className="section-result-count">
                Showing {Math.min((currentPage - 1) * JOBS_PER_PAGE + 1, allForTab.length)}–
                {Math.min(currentPage * JOBS_PER_PAGE, allForTab.length)} of {allForTab.length} jobs
              </span>
            )}
          </div>

          <div className="jobs-grid">
            {paginated.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              paginated.map((job) => (
                <JobCardUI key={job._id} job={job} expired={activeTab === "expired"} />
              ))
            )}
          </div>

          <Pagination
            page={currentPage}
            total={allForTab.length}
            perPage={JOBS_PER_PAGE}
            onChange={handlePageChange}
          />
        </main>

      </div>
    </>
  );
}