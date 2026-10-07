"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Sparkles,
  Plus,
  Search,
  Building2,
  MapPin,
  Coins,
  Pencil,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminReferralCommentsManager from "@/components/admin/AdminReferralCommentsManager";

interface ReferralJob {
  _id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  creditCost?: number;
  recruiterEmail?: string;
  recruiterPhone?: string;
  referralLink?: string;
  applyInstructions?: string;
  isFeatured: boolean;
  isExpired: boolean;
  postedAt?: string;
  createdAt?: string;
}

export default function AdminPremiumReferralsPage() {
  const [jobs, setJobs] = useState<ReferralJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ReferralJob | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs?type=premium-referral&admin=true&limit=100");
      setJobs(res.data.jobs || []);
    } catch {
      toast.error("Failed to load referral jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/jobs/${deleteTarget.slug}`);
      toast.success("Referral job deleted ✅");
      setDeleteTarget(null);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Coins className="w-3.5 h-3.5 fill-amber-400" /> Admin Referral Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Premium Referral Jobs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage credit-locked job referral opportunities and recruiter contacts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchJobs}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/premium-referrals/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-violet-600 hover:from-amber-400 hover:to-violet-500 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Post New Referral Job
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Referral Jobs</p>
          <p className="text-2xl font-black text-white mt-1">{jobs.length}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Active Referrals</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {jobs.filter((j) => !j.isExpired).length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Avg Unlock Cost</p>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {jobs.length > 0
              ? Math.round(
                  jobs.reduce((acc, j) => acc + (j.creditCost || 10), 0) / jobs.length
                )
              : 10}{" "}
            <span className="text-xs font-normal text-slate-400">Credits</span>
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Referral Opportunity</th>
              <th className="py-3 px-4">Cost</th>
              <th className="py-3 px-4">Protected Recruiter Details</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Loading referral jobs...
                </td>
              </tr>
            ) : filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No referral jobs found. Click &quot;Post New Referral Job&quot; to create one.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job._id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-sm text-white">{job.title}</span>
                      <p className="text-xs text-violet-300 font-medium flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" /> {job.company} · 📍 {job.location}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-extrabold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      <Coins className="w-3 h-3 fill-amber-400" /> {job.creditCost || 10}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 text-[11px] font-mono text-slate-400">
                      {job.recruiterEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-violet-400" /> {job.recruiterEmail}
                        </div>
                      )}
                      {job.recruiterPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-violet-400" /> {job.recruiterPhone}
                        </div>
                      )}
                      {job.referralLink && (
                        <a
                          href={job.referralLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" /> Apply Link
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {job.isExpired ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                        <Clock className="w-3 h-3" /> Expired
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/jobs?edit=${job.slug}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Edit Job"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                        title="Delete Job"
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

      {/* Student Reviews & Comments Manager */}
      <div className="pt-6 border-t border-slate-800">
        <AdminReferralCommentsManager />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 font-bold">
              <AlertCircle className="w-6 h-6" /> Delete Referral Job
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white">{deleteTarget.title}</strong> at {deleteTarget.company}? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
