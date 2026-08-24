"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [saved, setSaved] = useState([]);
  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        const res = await api.get("/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSaved(res.data.savedCourses || []);
        setPurchased(res.data.purchasedCourses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#555] font-medium tracking-wide">Loading your courses…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-[#E5E3DC] px-6 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#9b8f7c] mb-0.5">
            Student Portal
          </p>
          <h1
            className="text-2xl font-extrabold text-[#1a1a1a] leading-none"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }}
          >
            My Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-[#555]">
          <StatPill label="Saved" count={saved.length} color="#f0a500" />
          <StatPill label="Purchased" count={purchased.length} color="#22c55e" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* ── Saved Courses ── */}
        <section>
          <SectionHeading icon="🛒" title="Saved Courses" count={saved.length} accent="#f0a500" />

          {saved.length === 0 ? (
            <EmptyState
              icon="📂"
              message="No saved courses yet"
              sub="Browse courses and save ones you like!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {saved.map((c: any) => (
                <CourseCard
                  key={c._id}
                  course={c}
                  onClick={() => router.push(`/courses/${c._id}`)}
                  variant="saved"
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Purchased Courses ── */}
        <section>
          <SectionHeading icon="✅" title="Purchased Courses" count={purchased.length} accent="#22c55e" />

          {purchased.length === 0 ? (
            <EmptyState
              icon="🎓"
              message="No purchased courses yet"
              sub="Unlock a course to start learning!"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {purchased.map((c: any) => (
                <CourseCard key={c._id} course={c} variant="purchased" />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ──────────── Sub-components ──────────── */

function StatPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#F7F6F2] border border-[#E5E3DC] rounded-full px-3 py-1">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
      <span className="font-semibold text-[#1a1a1a]">{count}</span>
      <span className="text-[#9b8f7c]">{label}</span>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  count,
  accent,
}: {
  icon: string;
  title: string;
  count: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl leading-none">{icon}</span>
      <h2
        className="text-xl font-bold text-[#1a1a1a]"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {title}
      </h2>
      <span
        className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full text-white"
        style={{ backgroundColor: accent }}
      >
        {count}
      </span>
      <div className="flex-1 h-px bg-[#E5E3DC] ml-2" />
    </div>
  );
}

function EmptyState({ icon, message, sub }: { icon: string; message: string; sub: string }) {
  return (
    <div className="mt-5 flex flex-col items-center justify-center bg-white border border-dashed border-[#D5D2C9] rounded-2xl py-14 text-center gap-2">
      <span className="text-4xl">{icon}</span>
      <p className="text-[#1a1a1a] font-semibold text-base mt-2">{message}</p>
      <p className="text-sm text-[#9b8f7c]">{sub}</p>
    </div>
  );
}

function CourseCard({
  course: c,
  onClick,
  variant,
}: {
  course: any;
  onClick?: () => void;
  variant: "saved" | "purchased";
}) {
  const isPurchased = variant === "purchased";

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg" : ""
      } ${isPurchased ? "border-green-200" : "border-[#E5E3DC]"}`}
    >
      {/* Banner */}
      <div className="relative w-full h-36 overflow-hidden bg-[#EEE]">
        <img
          src={c.bannerImage || "/placeholder.png"}
          alt={c.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full shadow ${
            isPurchased
              ? "bg-green-500 text-white"
              : c.isPaid
              ? "bg-[#1a1a1a] text-white"
              : "bg-[#f0a500] text-white"
          }`}
        >
          {isPurchased ? "✓ Purchased" : c.isPaid ? `₹${c.price}` : "Free"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-[#1a1a1a] text-base leading-snug line-clamp-2">
          {c.title}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {c.category && (
            <span className="text-xs bg-[#F7F6F2] border border-[#E5E3DC] text-[#555] px-2 py-0.5 rounded-full">
              {c.category}
            </span>
          )}
          {c.level && (
            <span className="text-xs text-[#9b8f7c] font-medium">{c.level}</span>
          )}
          {c.language && (
            <span className="text-xs text-[#9b8f7c]">🌐 {c.language}</span>
          )}
        </div>

        {/* Tags */}
        {c.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {c.tags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="text-[10px] font-medium bg-[#F0EEE9] text-[#6b6358] px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isPurchased && onClick && (
        <div className="px-4 pb-4">
          <button className="w-full text-xs font-semibold text-center py-2 rounded-xl bg-[#1a1a1a] text-white hover:bg-[#333] transition">
            View Course →
          </button>
        </div>
      )}

      {isPurchased && (
        <div className="px-4 pb-4">
          <button className="w-full text-xs font-semibold text-center py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition">
            Continue Learning →
          </button>
        </div>
      )}
    </div>
  );
}