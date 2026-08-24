import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import api from "@/lib/api";
import CareerTrackCard from "@/components/career/CareerTrackCard";
import type { CareerTrack, Pagination } from "@/components/admin/careerTrack";

export const metadata: Metadata = {
  title: "Career Tracks - Find Your Perfect Learning Path | Codelura Careers",
  description:
    "Discover structured career tracks with real projects, 1:1 mentor support, and certificates. Land software engineering jobs at top tech companies.",
  keywords:
    "career tracks, learning paths, tech careers, full stack, dsa, machine learning, codelura",
  robots: "index, follow",
};

interface CareerTracksPageProps {
  searchParams: {
    page?: string;
    search?: string;
    level?: string;
  };
}

async function getCareerTracks(page: number = 1, search: string = "", level: string = "") {
  try {
    const { data } = await api.get<{
      data: CareerTrack[];
      pagination: Pagination;
    }>("/career-tracks", {
      params: {
        page,
        limit: 12,
        search: search || undefined,
        level: level || undefined,
      },
    });

    return {
      tracks: data.data || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Failed to fetch career tracks:", error);
    return {
      tracks: [],
      pagination: null,
    };
  }
}

function CareerTracksSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-80 w-full animate-pulse rounded-2xl border border-purple-500/20 bg-[#0C0F28]"
        />
      ))}
    </div>
  );
}

const CATEGORY_PILLS = [
  { name: "Full Stack Development", icon: "💻", border: "border-blue-500/40 bg-blue-950/20 text-blue-300 hover:border-blue-400" },
  { name: "AI & Machine Learning", icon: "🧠", border: "border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-400" },
  { name: "DevOps & Cloud", icon: "☁️", border: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400" },
  { name: "Cybersecurity", icon: "🛡️", border: "border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-400" },
  { name: "Mobile Development", icon: "📱", border: "border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-400" },
  { name: "Data Science", icon: "📊", border: "border-yellow-500/40 bg-yellow-950/20 text-yellow-300 hover:border-yellow-400" },
];

const HIRING_PARTNERS = ["Amazon", "Microsoft", "Adobe", "Flipkart", "Swiggy", "Uber", "Zomato"];

const TRUST_BADGES = [
  { icon: "🎓", title: "10,000+ Enrolled", desc: "Active tech learners" },
  { icon: "⭐", title: "4.9/5 Rating", desc: "Top student feedback" },
  { icon: "🏅", title: "Verifiable Certificate", desc: "Share on LinkedIn" },
  { icon: "🧑‍🏫", title: "1:1 Mentorship", desc: "Direct code reviews" },
];

export default async function CareerTracksPage({ searchParams }: CareerTracksPageProps) {
  const page = parseInt(searchParams.page || "1", 10);
  const search = searchParams.search || "";
  const level = searchParams.level || "";

  const { tracks, pagination } = await getCareerTracks(page, search, level);

  return (
    <div className="min-h-screen bg-[#040612] text-white">
      {/* ─── HERO SECTION (simplified, single column, clean & readable) ─── */}
      <section className="relative overflow-hidden border-b border-purple-500/20 bg-gradient-to-b from-[#0B0E28] via-[#07091B] to-[#040612] px-4 py-12 lg:px-8 lg:py-16">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[150px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-purple-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
            🚀 Accelerated Career Tracks
          </div>

          {/* Main Headline */}
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-5xl tracking-tight">
            Master Production Tech &amp; Land{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Your Dream Job
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm text-slate-300 md:text-base max-w-2xl mx-auto leading-relaxed">
            Structured, step-by-step career tracks led by senior engineers from Amazon, Microsoft &amp; Adobe. Build 8+ production projects with 1:1 mentorship.
          </p>

          {/* Feature Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400 font-mono font-bold text-xs">&lt;/&gt;</span>
              <span>Real-world Projects</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300 text-xs">👥</span>
              <span>1:1 Expert Mentorship</span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 text-xs">💼</span>
              <span>Placement Support</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-purple-500/20 pt-6 max-w-lg mx-auto">
            <div>
              <div className="text-xl font-black text-white md:text-2xl">10,000+</div>
              <div className="text-[11px] font-medium text-slate-400">Students Enrolled</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-400 md:text-2xl">4.9 / 5</div>
              <div className="text-[11px] font-medium text-slate-400">Average Rating</div>
            </div>
            <div>
              <div className="text-xl font-black text-amber-400 md:text-2xl">100+</div>
              <div className="text-[11px] font-medium text-slate-400">Hiring Partners</div>
            </div>
          </div>

          {/* Search & Filter Form */}
          <form action="/career/learning/career-tracks" method="GET" className="mt-8">
            <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-purple-500/30 bg-[#0A0D24] p-2 shadow-xl">
              <div className="relative flex-1 w-full flex items-center">
                <span className="absolute left-4 text-slate-400 text-sm">🔍</span>
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search career tracks (e.g. Full Stack, AI, DevOps)..."
                  className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <select
                name="level"
                defaultValue={level}
                className="w-full sm:w-36 rounded-xl border border-purple-500/20 bg-[#0F1334] px-4 py-3 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-purple-600/40 hover:brightness-110 transition active:scale-95 whitespace-nowrap"
              >
                Search Tracks →
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="mt-8 pt-6 border-t border-purple-500/15">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-purple-400">
              Popular Learning Tracks &amp; Domains
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {CATEGORY_PILLS.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/career/learning/career-tracks?search=${encodeURIComponent(cat.name)}`}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105 ${cat.border}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIRING PARTNERS LOGO STRIP ─── */}
      <section className="border-b border-purple-500/10 bg-[#07091B] py-8 px-4 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-400">
            Top Tech Companies Hiring From Codelura Career Tracks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-80">
            {HIRING_PARTNERS.map((company) => (
              <span
                key={company}
                className="rounded-xl border border-purple-500/20 bg-purple-950/30 px-5 py-2 text-xs font-bold text-slate-200"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        {/* Results Header */}
        <div className="mb-6 flex items-center justify-between border-b border-purple-500/10 pb-4">
          <p className="text-sm font-semibold text-slate-300">
            Showing <span className="text-purple-400 font-bold">{tracks.length}</span> Career Tracks
          </p>
          {(search || level) && (
            <Link
              href="/career/learning/career-tracks"
              className="text-xs font-bold text-purple-400 hover:underline"
            >
              ✕ Clear Filters
            </Link>
          )}
        </div>

        {/* Career Tracks Grid */}
        <Suspense fallback={<CareerTracksSkeleton />}>
          {tracks.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-purple-500/20 bg-[#0C0F28]">
              <div className="mb-3 text-5xl">🔍</div>
              <h3 className="text-lg font-bold text-white mb-1">No Career Tracks Found</h3>
              <p className="text-xs text-slate-400">Try adjusting your search query or level filters.</p>
              <Link
                href="/career/learning/career-tracks"
                className="mt-4 inline-block rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-500"
              >
                View All Tracks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((track) => (
                <CareerTrackCard key={track._id} track={track} />
              ))}
            </div>
          )}
        </Suspense>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <Link
              href={`/career/learning/career-tracks?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ""}${level ? `&level=${level}` : ""}`}
              className={`rounded-xl border border-purple-500/20 bg-[#0C0F28] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0F1334] ${
                page === 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              ← Previous
            </Link>

            <span className="text-xs text-slate-400 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Link
              href={`/career/learning/career-tracks?page=${Math.min(pagination.totalPages, page + 1)}${search ? `&search=${search}` : ""}${level ? `&level=${level}` : ""}`}
              className={`rounded-xl border border-purple-500/20 bg-[#0C0F28] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#0F1334] ${
                page === pagination.totalPages ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Next →
            </Link>
          </div>
        )}

        {/* Trust Badges Strip */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_BADGES.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-5 text-center"
            >
              <div className="mb-2 text-3xl">{item.icon}</div>
              <h4 className="font-bold text-white text-sm">{item.title}</h4>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}