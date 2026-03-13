"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Hackathon {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  participantsCount: number;
  submissionsCount: number;
  isPublished: boolean;
  startDate: string;
  endDate: string;
  prizePool: string;
}

function StatusBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        isPublished
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-400" : "bg-slate-500"}`} />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function StatPill({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400">
      <span>{icon}</span>
      <span className="font-semibold text-slate-300">{value}</span>
      {label && <span>{label}</span>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-700 rounded-lg w-2/5" />
          <div className="h-3 bg-slate-700/60 rounded w-3/5" />
          <div className="flex gap-3 mt-4">
            <div className="h-6 bg-slate-700/60 rounded-full w-20" />
            <div className="h-6 bg-slate-700/60 rounded-full w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-700 rounded-xl" />
          <div className="h-9 w-16 bg-slate-700 rounded-xl" />
          <div className="h-9 w-20 bg-slate-700 rounded-xl" />
          <div className="h-9 w-16 bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function AdminHackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchHackathons = async () => {
    try {
      const res = await api.get("/admin/hackathons");
      setHackathons(res.data.data);
    } catch {
      toast.error("Failed to load hackathons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const deleteHackathon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hackathon?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/hackathons/${id}`);
      toast.success("Hackathon deleted");
      setHackathons((prev) => prev.filter((h) => h._id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublish = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await api.patch(`/admin/hackathons/${id}/publish`);
      toast.success("Status updated");
      setHackathons((prev) =>
        prev.map((h) =>
          h._id === id ? { ...h, isPublished: res.data.data.isPublished } : h
        )
      );
    } catch {
      toast.error("Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const filtered = hackathons.filter((h) =>
    h.title.toLowerCase().includes(search.toLowerCase())
  );

  const publishedCount = hackathons.filter((h) => h.isPublished).length;
  const totalParticipants = hackathons.reduce((s, h) => s + (h.participantsCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Sticky header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Hackathons</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage all hackathon events</p>
          </div>
          <Link
            href="/admin/hackathons/create-hackathon"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition"
          >
            <span className="text-base leading-none">＋</span> New Hackathon
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total", value: hackathons.length, icon: "🗂️", border: "border-slate-700" },
            { label: "Published", value: publishedCount, icon: "🟢", border: "border-emerald-500/25" },
            { label: "Participants", value: totalParticipants, icon: "👥", border: "border-violet-500/25" },
          ].map((s) => (
            <div key={s.label} className={`bg-slate-800/60 border ${s.border} rounded-2xl px-5 py-4`}>
              <p className="text-2xl font-bold text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>{s.icon}</span>{s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            placeholder="Search hackathons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-500">
              <p className="text-5xl mb-4">🗂️</p>
              <p className="font-semibold text-slate-400 text-lg">No hackathons found</p>
              <p className="text-sm mt-1">Create your first hackathon to get started.</p>
            </div>
          ) : (
            filtered.map((h) => (
              <div
                key={h._id}
                className="bg-slate-800 hover:bg-slate-800/70 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">

                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h2 className="font-bold text-slate-100 text-base">{h.title}</h2>
                      <StatusBadge isPublished={h.isPublished} />
                    </div>
                    {h.shortDescription && (
                      <p className="text-sm text-slate-400 truncate mb-3 max-w-md">{h.shortDescription}</p>
                    )}
                    <div className="flex items-center gap-5 flex-wrap">
                      <StatPill icon="👥" value={h.participantsCount ?? 0} label="participants" />
                      <StatPill icon="📬" value={h.submissionsCount ?? 0} label="submissions" />
                      {h.prizePool && <StatPill icon="🏆" value={h.prizePool} label="" />}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => togglePublish(h._id)}
                      disabled={togglingId === h._id}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition disabled:opacity-50 ${
                        h.isPublished
                          ? "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                          : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                    >
                      {togglingId === h._id ? "…" : h.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <Link
                      href={`/admin/hackathons/${h._id}/edit`}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 transition"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/admin/hackathons/${h._id}/analytics`}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 border border-violet-500/25 text-violet-400 hover:bg-violet-500/20 transition"
                    >
                      Analytics
                    </Link>

                    <Link
                      href={`/admin/hackathons/ai-panel/${h._id}`}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 transition"
                    >
                      AI Panel
                    </Link>

                    <button
                      onClick={() => deleteHackathon(h._id)}
                      disabled={deletingId === h._id}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                    >
                      {deletingId === h._id ? "…" : "Delete"}
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}