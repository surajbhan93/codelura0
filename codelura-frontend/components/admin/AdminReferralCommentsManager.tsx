"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  User,
  Clock,
  Sparkles,
  Calendar,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  getAdminReferralComments,
  adminAddReferralComment,
  adminToggleApprovedReferralComment,
  adminDeleteReferralComment,
  ReferralCommentItem,
} from "@/lib/referralCommentApi";
import toast from "react-hot-toast";

export default function AdminReferralCommentsManager() {
  const [comments, setComments] = useState<ReferralCommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State for Adding Student Review
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    userAvatar: "",
    userRole: "Verified Candidate",
    rating: 5,
    comment: "",
    createdAt: new Date().toISOString().slice(0, 16), // YYYY-MM-THH:mm format for datetime-local
    isFeatured: true,
  });

  // Action State
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminReferralComments();
      setComments(data);
    } catch {
      toast.error("Failed to load referral comments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userName.trim() || !form.comment.trim()) {
      toast.error("Please enter student name and comment.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminAddReferralComment({
        userName: form.userName.trim(),
        userAvatar: form.userAvatar.trim(),
        userRole: form.userRole.trim(),
        rating: Number(form.rating) || 5,
        comment: form.comment.trim(),
        createdAt: form.createdAt ? new Date(form.createdAt).toISOString() : new Date().toISOString(),
        isFeatured: form.isFeatured,
      });

      if (res.success) {
        toast.success(res.message || "Student review added by Admin!");
        setShowAddModal(false);
        setForm({
          userName: "",
          userAvatar: "",
          userRole: "Verified Candidate",
          rating: 5,
          comment: "",
          createdAt: new Date().toISOString().slice(0, 16),
          isFeatured: true,
        });
        fetchComments();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add student review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleApproved = async (id: string) => {
    try {
      setActingId(id);
      const res = await adminToggleApprovedReferralComment(id);
      if (res.success) {
        toast.success(res.message);
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, isApproved: res.comment.isApproved } : c))
        );
      }
    } catch (err: any) {
      toast.error("Failed to update approval status.");
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student review?")) return;
    try {
      setActingId(id);
      const res = await adminDeleteReferralComment(id);
      if (res.success) {
        toast.success("Review deleted!");
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      toast.error("Failed to delete review.");
    } finally {
      setActingId(null);
    }
  };

  const filteredComments = comments.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.userName.toLowerCase().includes(q) ||
      c.comment.toLowerCase().includes(q) ||
      (c.userRole && c.userRole.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Admin Reviews & Comments Portal
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Manage Student Reviews & Referral Comments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add custom student reviews, approve or hide feedback, and moderate public comments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchComments}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Comments"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Add Student Review
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, role, or review comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Comments Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Student Candidate</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Comment Content</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Loading student comments...
                </td>
              </tr>
            ) : filteredComments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No comments found. Click &quot;Add Student Review&quot; to post a new review.
                </td>
              </tr>
            ) : (
              filteredComments.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/30 transition">
                  {/* Student Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {item.userAvatar ? (
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-8 h-8 rounded-full object-cover border border-violet-500/40 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 text-xs flex-shrink-0">
                          {item.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-sm text-white">{item.userName}</span>
                        <p className="text-[11px] text-violet-300">{item.userRole || "Student"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating || 5}.0</span>
                    </div>
                  </td>

                  {/* Comment */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="line-clamp-2 text-slate-300 text-xs">{item.comment}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatDate(item.createdAt)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {item.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                        <XCircle className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleApproved(item._id)}
                        disabled={actingId === item._id}
                        className={`p-1.5 rounded-lg border transition text-xs font-semibold ${
                          item.isApproved
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                        title={item.isApproved ? "Hide Comment" : "Approve Comment"}
                      >
                        {item.isApproved ? "Hide" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={actingId === item._id}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Add Student Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Add Student Review (Admin)
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Create a custom student testimonial with avatar, rating, and date/time.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Sharma"
                  value={form.userName}
                  onChange={(e) => setForm({ ...form, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Student Role / Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. SDE Intern at Amazon · Placed Candidate"
                  value={form.userRole}
                  onChange={(e) => setForm({ ...form, userRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Profile Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={form.userAvatar}
                  onChange={(e) => setForm({ ...form, userAvatar: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0)</option>
                    <option value={3}>⭐⭐⭐ (3.0)</option>
                    <option value={2}>⭐⭐ (2.0)</option>
                    <option value={1}>⭐ (1.0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.createdAt}
                    onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Review Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write the student's review content..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
