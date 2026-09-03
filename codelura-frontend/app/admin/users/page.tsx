"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Search, Trash2, Shield, ShieldOff, RefreshCw,
  ChevronLeft, ChevronRight, Users, CheckCircle2,
  AlertCircle, Loader2, UserCheck, UserX, Crown,
  Calendar, Mail,
} from "lucide-react";

/* ── Types ── */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  walletBalance?: number;
  purchasedCourses?: string[];
  createdAt?: string;
}

interface Stats {
  total: number;
  verified: number;
  unverified: number;
  admins: number;
  thisMonth: number;
}

const USERS_PER_PAGE = 10;

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/* ─────────────────────────────────────────
   CONFIRM MODAL
───────────────────────────────────────── */
function ConfirmModal({ open, onConfirm, onCancel, loading, title, message, confirmLabel = "Confirm", confirmColor = "#ef4444" }: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
  loading: boolean; confirmLabel?: string; confirmColor?: string;
}) {
  if (!open) return null;
  return (
    <div className="aau-overlay">
      <motion.div className="aau-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="aau-modal-icon"><AlertCircle size={26} color={confirmColor} /></div>
        <h3 className="aau-modal-title">{title}</h3>
        <p className="aau-modal-msg">{message}</p>
        <div className="aau-modal-actions">
          <button className="aau-modal-cancel" onClick={onCancel} disabled={loading}>Cancel</button>
          <button
            className="aau-modal-confirm"
            style={{ borderColor: `${confirmColor}55`, color: confirmColor, background: `${confirmColor}18` }}
            onClick={onConfirm} disabled={loading}
          >
            {loading ? <><Loader2 size={13} className="spin" /> Processing…</> : confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function AdminUsersPage() {
  const [users,         setUsers]         = useState<User[]>([]);
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [actionId,      setActionId]      = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<User | null>(null);
  const [roleTarget,    setRoleTarget]    = useState<User | null>(null);
  const [confirmLoading,setConfirmLoading]= useState(false);
  const [search,        setSearch]        = useState("");
  const [roleFilter,    setRoleFilter]    = useState("all");
  const [verifiedFilter,setVerifiedFilter]= useState("all");
  const [page,          setPage]          = useState(1);
  const [spinning,      setSpinning]      = useState(false);

  const getHeaders = () => ({
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  });

  /* ── Fetch Stats ── */
  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/admin/users/stats", { headers: getHeaders() });
      setStats(data);
    } catch {
      // silent
    }
  }, []);

  /* ── Fetch Users ── */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ limit: "500" });
      if (roleFilter !== "all")     params.set("role",     roleFilter);
      if (verifiedFilter !== "all") params.set("verified", verifiedFilter);
      const { data } = await api.get(`/auth/admin/users?${params}`, { headers: getHeaders() });
      setUsers(data.users || []);
      setPage(1);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [roleFilter, verifiedFilter]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [fetchStats, fetchUsers]);

  const handleRefresh = async () => {
    setSpinning(true);
    await Promise.all([fetchStats(), fetchUsers()]);
    setSpinning(false);
  };

  /* ── Filtered + Paginated ── */
  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setConfirmLoading(true);
      await api.delete(`/auth/admin/users/${deleteTarget._id}`, { headers: getHeaders() });
      toast.success("User deleted ✅");
      setUsers((p) => p.filter((u) => u._id !== deleteTarget._id));
      setStats((s) => s ? { ...s, total: s.total - 1 } : s);
      setDeleteTarget(null);
    } catch { toast.error("Delete failed"); }
    finally { setConfirmLoading(false); }
  };

  /* ── Toggle Role ── */
  const handleRoleToggle = async () => {
    if (!roleTarget) return;
    const newRole = roleTarget.role === "admin" ? "user" : "admin";
    try {
      setConfirmLoading(true);
      await api.put(`/auth/admin/users/${roleTarget._id}/role`, { role: newRole }, { headers: getHeaders() });
      setUsers((p) => p.map((u) => u._id === roleTarget._id ? { ...u, role: newRole } : u));
      toast.success(newRole === "admin" ? "Promoted to Admin ⭐" : "Demoted to User");
      setRoleTarget(null);
    } catch { toast.error("Role update failed"); }
    finally { setConfirmLoading(false); }
  };

  /* ══════════════════════════════ RENDER ══════════════════════════════ */
  return (
    <>
      <style>{styles}</style>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User?"
        message={`"${deleteTarget?.name}" (${deleteTarget?.email}) will be permanently removed.`}
        confirmLabel="Delete"
        confirmColor="#ef4444"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={confirmLoading}
      />

      {/* Role Confirm */}
      <ConfirmModal
        open={!!roleTarget}
        title={roleTarget?.role === "admin" ? "Demote to User?" : "Promote to Admin?"}
        message={
          roleTarget?.role === "admin"
            ? `"${roleTarget?.name}" will lose admin access.`
            : `"${roleTarget?.name}" will get full admin access.`
        }
        confirmLabel={roleTarget?.role === "admin" ? "Demote" : "Promote"}
        confirmColor={roleTarget?.role === "admin" ? "#f59e0b" : "#10b981"}
        onConfirm={handleRoleToggle}
        onCancel={() => setRoleTarget(null)}
        loading={confirmLoading}
      />

      <div className="aau-root">

        {/* ── Page Header ── */}
        <div className="aau-header">
          <div>
            <h1 className="aau-title">All <span>Users</span></h1>
            <p className="aau-sub">Manage registered users and their permissions</p>
          </div>
          <button className={`aau-refresh-btn ${spinning ? "spinning" : ""}`} onClick={handleRefresh}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="aau-stats">
          {[
            { val: stats?.total     ?? "—", lbl: "Total Users",    icon: <Users size={16} />,       color: "#6366f1", bg: "rgba(99,102,241,0.12)"   },
            { val: stats?.verified  ?? "—", lbl: "Verified",       icon: <UserCheck size={16} />,   color: "#10b981", bg: "rgba(16,185,129,0.12)"   },
            { val: stats?.unverified?? "—", lbl: "Unverified",     icon: <UserX size={16} />,       color: "#ef4444", bg: "rgba(239,68,68,0.12)"    },
            { val: stats?.admins    ?? "—", lbl: "Admins",         icon: <Crown size={16} />,       color: "#f59e0b", bg: "rgba(245,158,11,0.12)"   },
            { val: stats?.thisMonth ?? "—", lbl: "Joined This Month", icon: <Calendar size={16} />, color: "#a855f7", bg: "rgba(168,85,247,0.12)"   },
          ].map(({ val, lbl, icon, color, bg }) => (
            <div className="aau-stat" key={lbl}>
              <div className="aau-stat-icon" style={{ background: bg, color }}>{icon}</div>
              <div>
                <div className="aau-stat-val">{val}</div>
                <div className="aau-stat-lbl">{lbl}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="aau-toolbar">
          <div className="aau-search-wrap">
            <Search size={15} />
            <input
              className="aau-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="aau-select" value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select className="aau-select" value={verifiedFilter}
            onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        <p className="aau-result-info">
          Showing <strong>{Math.min((page-1)*USERS_PER_PAGE+1, filtered.length)}–{Math.min(page*USERS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> users
        </p>

        {/* ── Table ── */}
        {loading ? (
          <div className="aau-loading"><Loader2 size={28} className="spin" /><p>Loading users…</p></div>
        ) : paginated.length === 0 ? (
          <div className="aau-empty">
            <div className="aau-empty-icon">👤</div>
            <p className="aau-empty-title">No users found</p>
            <p className="aau-empty-sub">Try changing the filters.</p>
          </div>
        ) : (
          <div className="aau-table-wrap">
            <table className="aau-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <motion.tr key={user._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}>

                    {/* Name + Avatar */}
                    <td>
                      <div className="aau-user-cell">
                        <div className="aau-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="aau-user-name">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <div className="aau-email">
                        <Mail size={11} />
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`aau-role-pill ${user.role}`}>
                        {user.role === "admin" ? <><Crown size={10} /> Admin</> : "User"}
                      </span>
                    </td>

                    {/* Verified */}
                    <td>
                      {user.isEmailVerified
                        ? <span className="aau-verified yes"><CheckCircle2 size={12} /> Verified</span>
                        : <span className="aau-verified no"><AlertCircle size={12} /> Unverified</span>
                      }
                    </td>

                    {/* Joined */}
                    <td><span className="aau-date">{formatDate(user.createdAt)}</span></td>

                    {/* Actions */}
                    <td>
                      <div className="aau-actions">
                        {/* Toggle Role */}
                        <button
                          className={`aau-act-btn ${user.role === "admin" ? "demote" : "promote"}`}
                          title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                          onClick={() => setRoleTarget(user)}
                        >
                          {user.role === "admin" ? <ShieldOff size={13} /> : <Shield size={13} />}
                        </button>

                        {/* Delete */}
                        <button
                          className="aau-act-btn delete"
                          title="Delete User"
                          onClick={() => setDeleteTarget(user)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="aau-pagination">
            <button className="aau-pg" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={14} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`aau-pg${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="aau-pg" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
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

  .aau-root {
    font-family: 'DM Sans', sans-serif;
    background: #07080f;
    min-height: 100vh;
    color: #e2e8f0;
    padding: 32px 24px 80px;
    background-image:
      radial-gradient(ellipse 60% 40% at 15% 0%, rgba(99,102,241,0.07) 0%, transparent 55%),
      radial-gradient(ellipse 50% 35% at 85% 100%, rgba(16,185,129,0.05) 0%, transparent 55%);
  }
  .aau-root * { box-sizing: border-box; }
  .aau-root h1 { font-family: 'Syne', sans-serif; }

  /* Header */
  .aau-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
  .aau-title  { font-size: clamp(22px, 3vw, 30px); font-weight: 900; color: #f1f5f9; }
  .aau-title span { color: #a78bfa; }
  .aau-sub    { font-size: 13px; color: #475569; margin-top: 4px; }
  .aau-refresh-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    color: #64748b; font-size: 13px; font-weight: 600;
    padding: 9px 18px; border-radius: 10px; cursor: pointer;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .aau-refresh-btn:hover { color: #94a3b8; border-color: rgba(255,255,255,0.15); }
  .aau-refresh-btn.spinning svg { animation: spin 0.8s linear infinite; }

  /* Stats */
  .aau-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
  @media (max-width: 1024px) { .aau-stats { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 640px)  { .aau-stats { grid-template-columns: repeat(2, 1fr); } }
  .aau-stat {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    transition: border-color 0.2s;
  }
  .aau-stat:hover { border-color: rgba(255,255,255,0.12); }
  .aau-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .aau-stat-val  { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #f1f5f9; }
  .aau-stat-lbl  { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }

  /* Toolbar */
  .aau-toolbar { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
  .aau-search-wrap { flex: 1; min-width: 220px; position: relative; display: flex; align-items: center; }
  .aau-search-wrap svg { position: absolute; left: 12px; color: #475569; pointer-events: none; }
  .aau-search {
    width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 9px 14px 9px 36px; color: #e2e8f0; font-size: 13px;
    font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .aau-search::placeholder { color: #334155; }
  .aau-search:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 3px rgba(139,92,246,0.12); }
  .aau-select {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; padding: 9px 14px; color: #94a3b8; font-size: 13px;
    font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; min-width: 130px;
    transition: border-color 0.2s;
  }
  .aau-select option { background: #1e1b2e; }
  .aau-select:focus  { border-color: rgba(139,92,246,0.5); }

  .aau-result-info { font-size: 12px; color: #334155; margin-bottom: 14px; }
  .aau-result-info strong { color: #64748b; }

  /* Table */
  .aau-table-wrap {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; overflow: hidden; overflow-x: auto;
  }
  .aau-table { width: 100%; border-collapse: collapse; min-width: 680px; }
  .aau-table thead tr { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .aau-table th {
    padding: 11px 16px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; color: #334155;
    text-align: left; white-space: nowrap;
  }
  .aau-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  .aau-table tbody tr { transition: background 0.15s; }
  .aau-table tbody tr:hover { background: rgba(255,255,255,0.025); }
  .aau-table tbody tr:last-child td { border-bottom: none; }

  /* User cell */
  .aau-user-cell { display: flex; align-items: center; gap: 10px; }
  .aau-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .aau-user-name { font-size: 13px; font-weight: 600; color: #e2e8f0; }
  .aau-email { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }

  /* Role pill */
  .aau-role-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px;
  }
  .aau-role-pill.admin { background: rgba(245,158,11,0.12); color: #fcd34d; border: 1px solid rgba(245,158,11,0.3); }
  .aau-role-pill.user  { background: rgba(100,116,139,0.12); color: #94a3b8; border: 1px solid rgba(100,116,139,0.2); }

  /* Verified */
  .aau-verified { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
  .aau-verified.yes { background: rgba(16,185,129,0.1); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.25); }
  .aau-verified.no  { background: rgba(239,68,68,0.1);  color: #f87171; border: 1px solid rgba(239,68,68,0.25);  }

  .aau-date { font-size: 12px; color: #475569; white-space: nowrap; }

  /* Action buttons */
  .aau-actions { display: flex; gap: 6px; align-items: center; }
  .aau-act-btn {
    width: 30px; height: 30px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03); color: #475569;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s;
  }
  .aau-act-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
  .aau-act-btn.promote:hover { border-color: rgba(16,185,129,0.5);  color: #6ee7b7; }
  .aau-act-btn.demote:hover  { border-color: rgba(245,158,11,0.5);  color: #fcd34d; }
  .aau-act-btn.delete:hover  { border-color: rgba(239,68,68,0.5);   color: #f87171; background: rgba(239,68,68,0.08); }

  /* Loading/Empty */
  .aau-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 24px; gap: 14px; color: #475569; font-size: 13px; }
  .aau-empty   { text-align: center; padding: 80px 24px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.07); border-radius: 16px; margin-top: 14px; }
  .aau-empty-icon  { font-size: 48px; opacity: 0.3; margin-bottom: 14px; }
  .aau-empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; }
  .aau-empty-sub   { font-size: 14px; color: #475569; }

  /* Pagination */
  .aau-pagination { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 24px; flex-wrap: wrap; }
  .aau-pg {
    min-width: 36px; height: 36px; padding: 0 10px; border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
    color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .aau-pg:hover:not(:disabled) { border-color: rgba(139,92,246,0.4); color: #a78bfa; }
  .aau-pg.active { background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5); color: #c4b5fd; }
  .aau-pg:disabled { opacity: 0.35; cursor: not-allowed; }

  /* Modal */
  .aau-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
  }
  .aau-modal {
    background: #0f0f1a; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px; padding: 32px; max-width: 400px; width: 100%; text-align: center;
  }
  .aau-modal-icon   { margin-bottom: 14px; }
  .aau-modal-title  { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #f1f5f9; margin-bottom: 8px; }
  .aau-modal-msg    { font-size: 14px; color: #64748b; margin-bottom: 24px; line-height: 1.6; }
  .aau-modal-actions { display: flex; gap: 10px; justify-content: center; }
  .aau-modal-cancel {
    padding: 9px 22px; border-radius: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    color: #64748b; font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif;
  }
  .aau-modal-cancel:hover { color: #94a3b8; }
  .aau-modal-confirm {
    padding: 9px 22px; border-radius: 10px; font-size: 13px; font-weight: 600;
    cursor: pointer; display: inline-flex; align-items: center; gap: 7px;
    transition: all 0.18s; font-family: 'DM Sans', sans-serif; border-width: 1px; border-style: solid;
  }
  .aau-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

  .spin { animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 640px) {
    .aau-root    { padding: 24px 16px 60px; }
    .aau-toolbar { flex-direction: column; }
    .aau-search-wrap { width: 100%; }
  }
`;