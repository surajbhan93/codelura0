"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  MessageSquare,
  Send,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ThumbsUp,
  Clock,
  User as UserIcon,
} from "lucide-react";
import {
  getPublicReferralComments,
  postStudentReferralComment,
  ReferralCommentItem,
  ReferralCommentStats,
} from "@/lib/referralCommentApi";
import toast from "react-hot-toast";

export default function ReferralCommentsSection() {
  const [comments, setComments] = useState<ReferralCommentItem[]>([]);
  const [stats, setStats] = useState<ReferralCommentStats>({
    totalReviews: 0,
    averageRating: 5.0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [userRole, setUserRole] = useState("Student Candidate");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPublicReferralComments();
      setComments(data.comments || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      toast.error("Failed to load student reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please log in to post a student review.");
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please enter a comment or review text.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await postStudentReferralComment({
        rating,
        comment: commentText.trim(),
        userRole: userRole.trim() || "Student Candidate",
      });

      if (res.success) {
        toast.success(res.message || "Review posted successfully!", { icon: "🎉" });
        setCommentText("");
        setRating(5);
        fetchComments();
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      } else {
        toast.error(err?.response?.data?.message || "Failed to post comment.");
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="mt-16 pt-12 border-t border-slate-800 space-y-10 max-w-7xl mx-auto">
      {/* Title & Stats Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" /> Verified Student Experience
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Student Reviews & Referral Feedback
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Read authentic reviews from students and candidates who unlocked recruiter contacts and secured interview opportunities.
          </p>
        </div>

        {/* Overall Rating Box */}
        <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 p-5 rounded-2xl flex-shrink-0">
          <div className="text-center">
            <span className="text-4xl font-black text-amber-400 leading-none">
              {stats.averageRating || "5.0"}
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.averageRating || 5)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {stats.totalReviews} Total Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Add Comment Form Section */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" /> Share Your Experience
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Interactive Rating Stars */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= activeRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2">
                  {activeRating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Role Input */}
            <div className="w-full sm:w-64">
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                Your Role / Status
              </label>
              <input
                type="text"
                placeholder="e.g. Student, SDE Aspirant"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
              Your Review / Comment
            </label>
            <textarea
              rows={3}
              placeholder="Write your feedback about unlocking referrals, recruiter responses, or career support..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Post Student Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Public Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" /> Recent Student Reviews ({comments.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-500 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading reviews...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No reviews posted yet. Be the first student to leave a comment!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 transition hover:border-slate-700 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top User Info & Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-violet-600/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-white">{comment.userName}</h4>
                          <span title="Verified Review"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /></span>
                        </div>
                        <span className="text-[11px] text-violet-300 font-medium">
                          {comment.userRole || "Student"}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{comment.rating || 5}.0</span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {comment.comment}
                  </p>
                </div>

                {/* Footer Date & Time */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatDate(comment.createdAt)}
                  </span>
                  {comment.isAdminAdded && (
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-semibold">
                      Verified Candidate Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
