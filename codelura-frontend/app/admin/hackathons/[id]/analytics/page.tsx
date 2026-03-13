"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Analytics {
  title: string;
  participants: number;
  submissions: number;
  maxParticipants: number;
  status: string;
  prizePool?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  tracksCount?: number;
  judgesCount?: number;
}

function StatCard({
  icon, label, value, sub, borderColor,
}: {
  icon: string; label: string; value: string | number; sub?: string; borderColor: string;
}) {
  return (
    <div className={`bg-slate-800 border ${borderColor} rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft:    "bg-slate-700/50 text-slate-400 border-slate-600/30",
    active:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    ongoing:  "bg-blue-500/10   text-blue-400   border-blue-500/20",
    ended:    "bg-red-500/10    text-red-400    border-red-500/20",
    upcoming: "bg-amber-500/10  text-amber-400  border-amber-500/20",
  };
  const cls = map[status?.toLowerCase()] ?? map.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status ?? "Unknown"}
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl h-32" />
      ))}
    </div>
  );
}

function formatDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function HackathonAnalyticsPage() {
  const params  = useParams();
  const id      = params.id as string;

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/admin/hackathons/${id}/analytics`);
        setAnalytics(res.data.data);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const fillPct = analytics?.maxParticipants
    ? Math.round((analytics.participants / analytics.maxParticipants) * 100)
    : 0;

  const submissionRate = analytics?.participants
    ? Math.round((analytics.submissions / analytics.participants) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Sticky header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/hackathons" className="text-slate-500 hover:text-slate-300 text-sm transition flex-shrink-0">
              ← Back
            </Link>
            <span className="text-slate-700">|</span>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-100 truncate">
                {loading ? "Loading…" : (analytics?.title ?? "Analytics")}
              </h1>
              <p className="text-xs text-slate-500">Hackathon Analytics</p>
            </div>
          </div>
          {analytics && <StatusBadge status={analytics.status} />}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {loading ? (
          <>
            <SkeletonGrid />
            <div className="bg-slate-800 border border-slate-700 rounded-2xl h-40 animate-pulse" />
          </>
        ) : analytics ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon="👥" label="Participants"  value={analytics.participants}
                sub={`of ${analytics.maxParticipants} max`}
                borderColor="border-violet-500/25"
              />
              <StatCard
                icon="📬" label="Submissions"   value={analytics.submissions}
                sub={`${submissionRate}% submission rate`}
                borderColor="border-blue-500/25"
              />
              <StatCard
                icon="🎯" label="Capacity"      value={`${fillPct}%`}
                sub={`${analytics.maxParticipants - analytics.participants} spots left`}
                borderColor="border-amber-500/25"
              />
              <StatCard
                icon="🏆" label="Prize Pool"    value={analytics.prizePool ?? "—"}
                borderColor="border-emerald-500/25"
              />
            </div>

            {/* Progress bars */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress Overview</h2>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Participant Fill Rate</span>
                  <span className="font-semibold text-slate-200">{analytics.participants} / {analytics.maxParticipants}</span>
                </div>
                <ProgressBar value={analytics.participants} max={analytics.maxParticipants} color="bg-violet-500" />
                <p className="text-xs text-slate-500">{fillPct}% capacity used</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Submission Rate</span>
                  <span className="font-semibold text-slate-200">{analytics.submissions} / {analytics.participants}</span>
                </div>
                <ProgressBar value={analytics.submissions} max={analytics.participants} color="bg-blue-500" />
                <p className="text-xs text-slate-500">{submissionRate}% of participants submitted</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</h2>
                {[
                  { label: "Registration Closes", value: formatDate(analytics.registrationDeadline) },
                  { label: "Start Date",           value: formatDate(analytics.startDate) },
                  { label: "End Date",             value: formatDate(analytics.endDate) },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-slate-700/40 pb-3 last:border-0 last:pb-0">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-semibold text-slate-200">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Details</h2>
                {[
                  { label: "Status",  value: <StatusBadge status={analytics.status} /> },
                  { label: "Tracks",  value: analytics.tracksCount ?? "—" },
                  { label: "Judges",  value: analytics.judgesCount ?? "—" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-center text-sm border-b border-slate-700/40 pb-3 last:border-0 last:pb-0">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="font-semibold text-slate-200">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3 flex-wrap">
              <Link href={`/admin/hackathons/${id}/edit`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition">
                ✏️ Edit Hackathon
              </Link>
              <Link href={`/admin/hackathons/${id}/participants`}
                className="px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/25 text-violet-400 text-sm font-semibold hover:bg-violet-500/20 transition">
                👥 View Participants
              </Link>
              <Link href={`/admin/hackathons/${id}/submissions`}
                className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 transition">
                📬 View Submissions
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-slate-400 font-semibold text-lg">No analytics data found</p>
            <p className="text-slate-500 text-sm mt-1">This hackathon may not exist or has no data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}