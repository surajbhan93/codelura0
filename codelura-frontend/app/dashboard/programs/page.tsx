"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { GraduationCap, Sparkles, BookOpen, ArrowUpRight, Search } from "lucide-react";

export default function MyProgramsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "CareerTrack" | "Program">("all");

  useEffect(() => {
    api
      .get("/enrollments/my-enrollments")
      .then((res) => {
        if (res.data.success) {
          setEnrollments(res.data.data || []);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch enrollments:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredEnrollments = enrollments.filter((en) => {
    const title = en.itemTitle || en.itemRef?.title || en.itemRef?.name || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || en.itemType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0B0D17] text-white p-6 sm:p-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3.5 py-1 text-xs font-bold text-purple-300 mb-2">
              <GraduationCap size={14} />
              STUDENT LEARNING PORTAL
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Enrolled Programs &amp; Tracks
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Access your active courses, learning paths, and unlocked programs in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/career/learning/career-tracks"
              className="rounded-xl border border-purple-500/30 bg-purple-950/40 px-4 py-2.5 text-xs font-bold text-purple-200 transition hover:bg-purple-900/50"
            >
              Browse Career Tracks
            </Link>
            <Link
              href="/career/learning/programs"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110"
            >
              Browse Programs
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/10 bg-[#111428] p-2">
          <div className="relative flex-1 w-full flex items-center">
            <Search size={16} className="absolute left-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your enrolled programs or tracks..."
              className="w-full rounded-xl bg-transparent pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`flex-1 sm:flex-none rounded-xl px-4 py-2 text-xs font-bold transition ${
                filterType === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              All ({enrollments.length})
            </button>

            <button
              onClick={() => setFilterType("CareerTrack")}
              className={`flex-1 sm:flex-none rounded-xl px-4 py-2 text-xs font-bold transition ${
                filterType === "CareerTrack"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              Career Tracks
            </button>

            <button
              onClick={() => setFilterType("Program")}
              className={`flex-1 sm:flex-none rounded-xl px-4 py-2 text-xs font-bold transition ${
                filterType === "Program"
                  ? "bg-purple-600 text-white"
                  : "bg-transparent text-slate-400 hover:text-white"
              }`}
            >
              Programs
            </button>
          </div>
        </div>

        {/* Enrollments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-36 w-full animate-pulse rounded-2xl border border-white/10 bg-[#111428]"
              />
            ))}
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-white/10 bg-[#111428] p-8">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-base font-bold text-white mb-1">
              No Enrolled Programs Found
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              {search || filterType !== "all"
                ? "No programs match your search criteria. Try clearing filters."
                : "You haven't enrolled in any programs or career tracks yet. Explore our production tech courses to get started!"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/career/learning/career-tracks"
                className="rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition"
              >
                Explore Career Tracks
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEnrollments.map((en) => {
              const item = en.itemRef || {};
              const isCareerTrack = en.itemType === "CareerTrack";
              const isUnlocked = en.unlockedViaCareerTrack;
              const slug = item.slug || "";
              const href = isCareerTrack
                ? `/career/learning/career-tracks/${slug}`
                : `/career/learning/programs/${slug}`;

              return (
                <div
                  key={en._id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111428] p-5 transition duration-300 hover:border-purple-500/40 hover:bg-[#141832] hover:-translate-y-0.5 shadow-lg"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold border ${
                          isCareerTrack
                            ? "border-purple-500/40 bg-purple-950/60 text-purple-300"
                            : isUnlocked
                            ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-300"
                            : "border-indigo-500/40 bg-indigo-950/60 text-indigo-300"
                        }`}
                      >
                        {isCareerTrack
                          ? "🎯 Career Track"
                          : isUnlocked
                          ? "✨ Unlocked via Career Track"
                          : "🚀 Program"}
                      </span>

                      <span className="text-[10px] text-slate-400 font-medium">
                        Active Access
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                      {en.itemTitle || item.name || item.title}
                    </h3>

                    {/* Subtitle / Details */}
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.subtitle || item.description || item.shortDescription || "Full production curriculum with 1:1 mentorship."}
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Enrolled: {new Date(en.enrolledAt || en.createdAt).toLocaleDateString("en-IN")}
                    </span>

                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105"
                    >
                      Start Learning
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
