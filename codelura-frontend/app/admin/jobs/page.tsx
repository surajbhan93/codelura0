"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Plus, Search, Trash2, Pencil, CheckCircle2, Clock,
  Star, StarOff, RefreshCw, ChevronLeft, ChevronRight,
  Briefcase, AlertCircle, ExternalLink,
  Loader2, Eye,
} from "lucide-react";

/* ── Types ── */
interface Job {
  _id: string; title: string; slug: string;
  company: string; bannerImage?: string;
  location: string;
type:
  | "internship"
  | "full-time"
  | "part-time"
  | "contract"
  | "off-campus"
  | "walk-in"
  | "codelura";
  salary?: string; tags: string[];
  careerPageUrl: string; description: string;
  isFeatured: boolean; isExpired: boolean;
  views?: number; postedAt?: string; deadline?: string; createdAt?: string;
}

const JOBS_PER_PAGE = 10;

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  internship:  { label: "Internship", color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  "full-time": { label: "Full-Time",  color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  "part-time": { label: "Part-Time",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  contract:    { label: "Contract",   color: "#a855f7", bg: "rgba(168,85,247,0.1)"  },
  "off-campus": {
  label: "Off Campus",
  color: "#06b6d4",
  bg: "rgba(6,182,212,0.1)",
},

"walk-in": {
  label: "Walk-In",
  color: "#ef4444",
  bg: "rgba(239,68,68,0.1)",
},

codelura: {
  label: "Codelura",
  color: "#8b5cf6",
  bg: "rgba(139,92,246,0.1)",
},
};

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

/* ─────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────── */
function ConfirmModal({ open, onConfirm, onCancel, loading, title, message }: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="aaj-overlay">
      <motion.div className="aaj-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="aaj-modal-icon"><AlertCircle size={26} color="#ef4444" /></div>
        <h3 className="aaj-modal-title">{title}</h3>
        <p className="aaj-modal-msg">{message}</p>
        <div className="aaj-modal-actions">
          <button className="aaj-modal-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="aaj-modal-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? <><Loader2 size={13} className="spin" /> Deleting…</> : <><Trash2 size={13} /> Delete</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function AdminAllJobsPage() {
  const router = useRouter();
  const [jobs,          setJobs]          = useState<Job[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [actionId,      setActionId]      = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<Job | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search,        setSearch]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState("all");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [page,          setPage]          = useState(1);
  const [spinning,      setSpinning]      = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  });

  /* ── Fetch ── */
// FIX ✅ — "all" mein dono active + expired fetch karo
const fetchJobs = useCallback(async () => {
  try {
    setLoading(true);

    if (statusFilter === "all" || statusFilter === "featured") {
      // Active + Expired dono parallel fetch karo
      const baseParams = new URLSearchParams({ limit: "200" });
      if (typeFilter !== "all")        baseParams.set("type",     typeFilter);
      if (statusFilter === "featured") baseParams.set("featured", "true");

      const expiredParams = new URLSearchParams({ limit: "200", expired: "true" });
      if (typeFilter !== "all") expiredParams.set("type", typeFilter);

      const [activeRes, expiredRes] = await Promise.all([
        api.get(`/jobs?${baseParams}`,  { headers: getHeaders() }),
        // featured filter mein expired nahi chahiye
        statusFilter === "all"
          ? api.get(`/jobs?${expiredParams}`, { headers: getHeaders() })
          : Promise.resolve({ data: { jobs: [] } }),
      ]);

      const active  = activeRes.data.jobs  || [];
      const expired = expiredRes.data.jobs || [];
      setJobs([...active, ...expired]);

    } else if (statusFilter === "expired") {
      const params = new URLSearchParams({ limit: "200", expired: "true" });
      if (typeFilter !== "all") params.set("type", typeFilter);
      const { data } = await api.get(`/jobs?${params}`, { headers: getHeaders() });
      setJobs(data.jobs || []);
    }

    setPage(1);
  } catch {
    toast.error("Failed to load jobs");
  } finally {
    setLoading(false);
  }
}, [typeFilter, statusFilter]);
  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleRefresh = async () => {
    setSpinning(true);
    await fetchJobs();
    setSpinning(false);
  };

  /* ── Filtered + paginated ── */
  const filtered = jobs.filter((j) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  /* ── Stats ── */
  const stats = {
    total:    jobs.length,
    active:   jobs.filter((j) => !j.isExpired).length,
    expired:  jobs.filter((j) => j.isExpired).length,
    featured: jobs.filter((j) => j.isFeatured).length,
  };

  /* ── Actions ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/jobs/${deleteTarget.slug}`, { headers: getHeaders() });
      toast.success("Job deleted ✅");
      setJobs((p) => p.filter((j) => j._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch { toast.error("Delete failed"); }
    finally { setDeleteLoading(false); }
  };

  const toggleExpire = async (job: Job) => {
    try {
      setActionId(job._id);
      if (job.isExpired) {
        await api.put(`/jobs/${job.slug}`, { isExpired: false }, { headers: getHeaders() });
      } else {
        await api.patch(`/jobs/${job.slug}/expire`, {}, { headers: getHeaders() });
      }
      setJobs((p) => p.map((j) => j._id === job._id ? { ...j, isExpired: !j.isExpired } : j));
      toast.success(job.isExpired ? "Re-activated ✅" : "Marked expired");
    } catch { toast.error("Failed"); }
    finally { setActionId(null); }
  };

  const toggleFeatured = async (job: Job) => {
    try {
      setActionId(job._id);
      await api.put(`/jobs/${job.slug}`, { isFeatured: !job.isFeatured }, { headers: getHeaders() });
      setJobs((p) => p.map((j) => j._id === job._id ? { ...j, isFeatured: !j.isFeatured } : j));
      toast.success(job.isFeatured ? "Removed from featured" : "Featured ⭐");
    } catch { toast.error("Failed"); }
    finally { setActionId(null); }
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <>
      <style>{styles}</style>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Job?"
        message={`"${deleteTarget?.title}" will be permanently removed.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      <div className="aaj-root">
        {/* ── Page Header ── */}
        <div className="aaj-header">
          <div>
            <h1 className="aaj-title">All <span>Jobs</span></h1>
            <p className="aaj-sub">Manage and moderate all job listings</p>
          </div>
          <button className="aaj-add-btn" onClick={() => router.push("/admin/jobs/create")}>
            <Plus size={15} /> Post New Job
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="aaj-stats">
          {[
            { val: stats.total,    lbl: "Total",    icon: <Briefcase size={16} />,    color: "#6366f1", bg: "rgba(99,102,241,0.12)"  },
            { val: stats.active,   lbl: "Active",   icon: <CheckCircle2 size={16} />, color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
            { val: stats.expired,  lbl: "Expired",  icon: <Clock size={16} />,        color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
            { val: stats.featured, lbl: "Featured", icon: <Star size={16} />,         color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
          ].map(({ val, lbl, icon, color, bg }) => (
            <div className="aaj-stat" key={lbl}>
              <div className="aaj-stat-icon" style={{ background: bg, color }}>{icon}</div>
              <div>
                <div className="aaj-stat-val">{val}</div>
                <div className="aaj-stat-lbl">{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="aaj-toolbar">
          <div className="aaj-search-wrap">
            <Search size={15} />
            <input className="aaj-search" placeholder="Search jobs, companies, skills…"
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="aaj-select" value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="off-campus">Off Campus</option>
            <option value="walk-in">Walk-In</option>
            <option value="codelura">Codelura</option>
          </select>
          <select className="aaj-select" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="expired">Expired</option>
            <option value="featured">Featured</option>
          </select>
          <button className={`aaj-refresh ${spinning ? "spinning" : ""}`} onClick={handleRefresh}>
            <RefreshCw size={14} />
          </button>
        </div>

        <p className="aaj-result-info">
          Showing <strong>{Math.min((page-1)*JOBS_PER_PAGE+1, filtered.length)}–{Math.min(page*JOBS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> jobs
        </p>

        {/* ── Table ── */}
        {loading ? (
          <div className="aaj-loading"><Loader2 size={28} className="spin" /><p>Loading…</p></div>
        ) : paginated.length === 0 ? (
          <div className="aaj-empty">
            <div className="aaj-empty-icon">📭</div>
            <p className="aaj-empty-title">No jobs found</p>
            <p className="aaj-empty-sub">Try changing the filters or add a new job.</p>
          </div>
        ) : (
          <div className="aaj-table-wrap">
            <table className="aaj-table">
              <thead>
                <tr>
                  <th>Job / Company</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Posted</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((job) => {
                  const tm = TYPE_META[job.type] ?? { label: job.type, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };
                  const isActing = actionId === job._id;
                  return (
                    <motion.tr key={job._id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}>

                      {/* Job title + company */}
                      <td>
                        <div className="aaj-job-cell">
                          <div className="aaj-job-logo">
                            {job.bannerImage
                              ? <img src={job.bannerImage} alt={job.company} />
                              : <span>{job.company.charAt(0)}</span>
                            }
                          </div>
                          <div>
                            <p className="aaj-job-title">{job.title}</p>
                            <p className="aaj-job-company">{job.company}</p>
                            {job.isFeatured && <span className="aaj-featured-pill">⭐ Featured</span>}
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className="aaj-type-pill"
                          style={{ color: tm.color, background: tm.bg, border: `1px solid ${tm.color}33` }}>
                          {tm.label}
                        </span>
                      </td>

                      {/* Location */}
                      <td><span className="aaj-location">{job.location}</span></td>

                      {/* Posted */}
                      <td><span className="aaj-date">{formatDate(job.postedAt || job.createdAt)}</span></td>

                      {/* Views */}
                      <td>
                        <div className="aaj-views">
                          <Eye size={12} />
                          {(job.views ?? 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`aaj-status ${job.isExpired ? "expired" : "active"}`}>
                          {job.isExpired ? "Expired" : "Active"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="aaj-actions">
                          {/* Edit */}
                          <button className="aaj-act-btn edit" title="Edit"
                            onClick={() => router.push(`/admin/jobs/edit/${job.slug}`)}>
                            <Pencil size={13} />
                          </button>

                          {/* Career page */}
                          <a className="aaj-act-btn link" title="Career Page"
                            href={job.careerPageUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={13} />
                          </a>

                          {/* Toggle featured */}
                          <button
                            className={`aaj-act-btn ${job.isFeatured ? "unfeature" : "feature"}`}
                            title={job.isFeatured ? "Unfeature" : "Feature"}
                            disabled={isActing}
                            onClick={() => toggleFeatured(job)}>
                            {isActing ? <Loader2 size={13} className="spin" />
                              : job.isFeatured ? <StarOff size={13} /> : <Star size={13} />}
                          </button>

                          {/* Toggle expire */}
                          <button
                            className={`aaj-act-btn ${job.isExpired ? "activate" : "expire"}`}
                            title={job.isExpired ? "Re-activate" : "Expire"}
                            disabled={isActing}
                            onClick={() => toggleExpire(job)}>
                            {isActing ? <Loader2 size={13} className="spin" />
                              : job.isExpired ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          </button>

                          {/* Delete */}
                          <button className="aaj-act-btn delete" title="Delete"
                            onClick={() => setDeleteTarget(job)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="aaj-pagination">
            <button className="aaj-pg" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={14} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`aaj-pg${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="aaj-pg" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .aaj-root { font-family:'DM Sans',sans-serif; background:#07080f; min-height:100vh; color:#e2e8f0; padding:32px 24px 80px;
    background-image: radial-gradient(ellipse 60% 40% at 15% 0%,rgba(109,40,217,0.07) 0%,transparent 55%),
                      radial-gradient(ellipse 50% 35% at 85% 100%,rgba(16,185,129,0.05) 0%,transparent 55%); }
  .aaj-root * { box-sizing:border-box; }
  .aaj-root h1 { font-family:'Syne',sans-serif; }

  /* Header */
  .aaj-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
  .aaj-title { font-size:clamp(22px,3vw,30px); font-weight:900; color:#f1f5f9; }
  .aaj-title span { color:#a78bfa; }
  .aaj-sub { font-size:13px; color:#475569; margin-top:4px; }
  .aaj-add-btn {
    display:inline-flex; align-items:center; gap:8px;
    background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff;
    font-size:13px; font-weight:700; padding:10px 20px; border-radius:10px;
    border:none; cursor:pointer; box-shadow:0 4px 16px rgba(124,58,237,0.3);
    transition:opacity 0.18s,transform 0.18s; white-space:nowrap;
    font-family:'DM Sans',sans-serif;
  }
  .aaj-add-btn:hover { opacity:0.9; transform:translateY(-1px); }

  /* Stats */
  .aaj-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
  @media(max-width:768px) { .aaj-stats { grid-template-columns:repeat(2,1fr); } }
  .aaj-stat {
    background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    border-radius:14px; padding:18px 20px; display:flex; align-items:center; gap:14px;
    transition:border-color 0.2s;
  }
  .aaj-stat:hover { border-color:rgba(255,255,255,0.12); }
  .aaj-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .aaj-stat-val { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#f1f5f9; }
  .aaj-stat-lbl { font-size:11px; color:#475569; text-transform:uppercase; letter-spacing:0.08em; margin-top:2px; }

  /* Toolbar */
  .aaj-toolbar { display:flex; gap:10px; margin-bottom:14px; flex-wrap:wrap; align-items:center; }
  .aaj-search-wrap { flex:1; min-width:200px; position:relative; display:flex; align-items:center; }
  .aaj-search-wrap svg { position:absolute; left:12px; color:#475569; pointer-events:none; }
  .aaj-search {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; padding:9px 14px 9px 36px; color:#e2e8f0; font-size:13px;
    font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s;
  }
  .aaj-search::placeholder { color:#334155; }
  .aaj-search:focus { border-color:rgba(139,92,246,0.5); box-shadow:0 0 0 3px rgba(139,92,246,0.12); }
  .aaj-select {
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:10px; padding:9px 14px; color:#94a3b8; font-size:13px;
    font-family:'DM Sans',sans-serif; outline:none; cursor:pointer; min-width:120px;
    transition:border-color 0.2s;
  }
  .aaj-select option { background:#1e1b2e; }
  .aaj-select:focus { border-color:rgba(139,92,246,0.5); }
  .aaj-refresh {
    width:38px; height:38px; border-radius:10px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    color:#64748b; display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s;
  }
  .aaj-refresh:hover { color:#94a3b8; border-color:rgba(255,255,255,0.15); }
  .aaj-refresh.spinning svg { animation:spin 0.8s linear infinite; }

  .aaj-result-info { font-size:12px; color:#334155; margin-bottom:14px; }
  .aaj-result-info strong { color:#64748b; }

  /* Table */
  .aaj-table-wrap {
    background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07);
    border-radius:16px; overflow:hidden; overflow-x:auto;
  }
  .aaj-table { width:100%; border-collapse:collapse; min-width:700px; }
  .aaj-table thead tr { border-bottom:1px solid rgba(255,255,255,0.06); }
  .aaj-table th {
    padding:11px 16px; font-size:10px; font-weight:700;
    letter-spacing:0.12em; text-transform:uppercase; color:#334155;
    text-align:left; white-space:nowrap;
  }
  .aaj-table td { padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
  .aaj-table tbody tr { transition:background 0.15s; }
  .aaj-table tbody tr:hover { background:rgba(255,255,255,0.025); }
  .aaj-table tbody tr:last-child td { border-bottom:none; }

  /* Job cell */
  .aaj-job-cell { display:flex; align-items:center; gap:12px; }
  .aaj-job-logo {
    width:40px; height:40px; border-radius:10px;
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:700; color:#64748b; overflow:hidden; flex-shrink:0;
  }
  .aaj-job-logo img { width:100%; height:100%; object-fit:cover; }
  .aaj-job-title { font-size:13px; font-weight:600; color:#e2e8f0; margin-bottom:2px; }
  .aaj-job-company { font-size:11px; color:#475569; }
  .aaj-featured-pill {
    font-size:9px; font-weight:700; letter-spacing:0.1em;
    background:rgba(245,158,11,0.1); color:#fcd34d;
    border:1px solid rgba(245,158,11,0.25); padding:1px 7px; border-radius:20px;
    margin-top:4px; display:inline-block;
  }

  .aaj-type-pill { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; white-space:nowrap; }
  .aaj-location  { font-size:12px; color:#64748b; }
  .aaj-date      { font-size:12px; color:#475569; white-space:nowrap; }
  .aaj-views     { display:flex; align-items:center; gap:5px; font-size:12px; color:#475569; }
  .aaj-status {
    font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
    padding:3px 10px; border-radius:20px;
  }
  .aaj-status.active  { background:rgba(16,185,129,0.1); color:#6ee7b7; border:1px solid rgba(16,185,129,0.25); }
  .aaj-status.expired { background:rgba(239,68,68,0.1);  color:#f87171; border:1px solid rgba(239,68,68,0.25); }

  /* Action buttons */
  .aaj-actions { display:flex; gap:6px; align-items:center; }
  .aaj-act-btn {
    width:30px; height:30px; border-radius:7px; border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.03); color:#475569;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:all 0.18s; text-decoration:none;
  }
  .aaj-act-btn:hover { background:rgba(255,255,255,0.08); color:#e2e8f0; }
  .aaj-act-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .aaj-act-btn.edit:hover     { border-color:rgba(99,102,241,0.5); color:#818cf8; }
  .aaj-act-btn.link:hover     { border-color:rgba(59,130,246,0.5); color:#93c5fd; }
  .aaj-act-btn.feature:hover  { border-color:rgba(245,158,11,0.5); color:#fcd34d; }
  .aaj-act-btn.unfeature:hover{ border-color:rgba(245,158,11,0.5); color:#f59e0b; }
  .aaj-act-btn.expire:hover   { border-color:rgba(239,68,68,0.4);  color:#f87171; }
  .aaj-act-btn.activate:hover { border-color:rgba(16,185,129,0.5); color:#6ee7b7; }
  .aaj-act-btn.delete:hover   { border-color:rgba(239,68,68,0.5);  color:#f87171; background:rgba(239,68,68,0.08); }

  /* Loading/empty */
  .aaj-loading {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:80px 24px; gap:14px; color:#475569; font-size:13px;
  }
  .aaj-empty {
    text-align:center; padding:80px 24px;
    background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.07);
    border-radius:16px; margin-top:14px;
  }
  .aaj-empty-icon { font-size:48px; opacity:0.3; margin-bottom:14px; }
  .aaj-empty-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#f1f5f9; margin-bottom:6px; }
  .aaj-empty-sub { font-size:14px; color:#475569; }

  /* Pagination */
  .aaj-pagination { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:24px; flex-wrap:wrap; }
  .aaj-pg {
    min-width:36px; height:36px; padding:0 10px; border-radius:9px;
    border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03);
    color:#64748b; font-size:13px; font-weight:600; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center; gap:4px;
    transition:all 0.18s; font-family:'DM Sans',sans-serif;
  }
  .aaj-pg:hover:not(:disabled) { border-color:rgba(139,92,246,0.4); color:#a78bfa; }
  .aaj-pg.active { background:rgba(124,58,237,0.2); border-color:rgba(124,58,237,0.5); color:#c4b5fd; }
  .aaj-pg:disabled { opacity:0.35; cursor:not-allowed; }

  /* Modal */
  .aaj-overlay {
    position:fixed; inset:0; z-index:100;
    background:rgba(0,0,0,0.7); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .aaj-modal {
    background:#0f0f1a; border:1px solid rgba(255,255,255,0.1);
    border-radius:18px; padding:32px; max-width:400px; width:100%; text-align:center;
  }
  .aaj-modal-icon { margin-bottom:14px; }
  .aaj-modal-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:#f1f5f9; margin-bottom:8px; }
  .aaj-modal-msg { font-size:14px; color:#64748b; margin-bottom:24px; line-height:1.6; }
  .aaj-modal-actions { display:flex; gap:10px; justify-content:center; }
  .aaj-modal-cancel {
    padding:9px 22px; border-radius:10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    color:#64748b; font-size:13px; font-weight:600; cursor:pointer;
    transition:all 0.18s; font-family:'DM Sans',sans-serif;
  }
  .aaj-modal-cancel:hover { color:#94a3b8; }
  .aaj-modal-confirm {
    padding:9px 22px; border-radius:10px;
    background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.35);
    color:#f87171; font-size:13px; font-weight:600; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px;
    transition:all 0.18s; font-family:'DM Sans',sans-serif;
  }
  .aaj-modal-confirm:hover { background:rgba(239,68,68,0.25); color:#fca5a5; }
  .aaj-modal-confirm:disabled { opacity:0.5; cursor:not-allowed; }

  .spin { animation:spin 0.8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  @media(max-width:640px) {
    .aaj-root { padding:24px 16px 60px; }
    .aaj-toolbar { flex-direction:column; }
    .aaj-search-wrap { width:100%; }
  }
`;