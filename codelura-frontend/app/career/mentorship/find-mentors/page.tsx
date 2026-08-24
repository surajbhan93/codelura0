"use client";

import { useState, useCallback } from "react";

type TabId = "explore" | "resume" | "session" | "build";

const TABS: { id: TabId; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "resume", label: "Resume" },
  { id: "session", label: "Book Session" },
  { id: "build", label: "Build" },
];

// Yahan apna actual 1:1 booking link daal dena (Calendly / Topmate / apna form etc.)
const SURAJ_SESSION_LINK = "https://your-booking-link.com/suraj";

export default function FindMentorPage() {
  const [activeTab, setActiveTab] = useState<TabId>("explore");

  const handleBookSuraj = useCallback(() => {
    window.open(SURAJ_SESSION_LINK, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 px-6 py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200 backdrop-blur-sm">
            🚧 Mentor matching — coming soon
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Find a Mentor
          </h1>
          <p className="mt-3 max-w-xl text-indigo-100">
            We&apos;re building a full mentor-matching experience. Meanwhile, you
            can already explore, get your resume reviewed, book a 1:1 session,
            or build your resume below.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Tabs */}
        <div className="mb-8 flex w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Explore tab — mentor browsing, coming soon */}
        {activeTab === "explore" && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
              🧑‍🤝‍🧑
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Mentor directory is coming soon
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You&apos;ll soon be able to browse mentors by skill, industry, and
              availability. Until then, book a 1:1 session directly from the
              &quot;Book Session&quot; tab.
            </p>
          </div>
        )}

        {/* Resume tab */}
        {activeTab === "resume" && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8">
            <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
              Free tool
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Get your resume reviewed
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Upload your resume and get expert feedback within 24 hours —
              free.
            </p>
            <a
              href="/career/mentorship/resume-review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Get Free Resume Review
            </a>
          </div>
        )}

        {/* Session tab — Suraj 1:1 session */}
        {activeTab === "session" && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
            <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              1:1 mentorship
            </span>
            <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                S
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Book a session with Suraj
                </h2>
                <p className="mt-1 max-w-md text-sm text-slate-600">
                  Talk 1:1 about your career goals, resume, and interview prep.
                </p>
              </div>
            </div>
            <button
              onClick={handleBookSuraj}
              className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Book 1:1 Session
            </button>
          </div>
        )}

        {/* Build tab — resume builder */}
        {activeTab === "build" && (
          <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-blue-50 p-8">
            <span className="inline-block rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              Build in minutes
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Try the Resume Builder
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-600">
              Turn your skills and experience into a polished, ATS-friendly
              resume.
            </p>
            <a
              href="/career/tools/resume-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Build My Resume
            </a>
          </div>
        )}
      </div>
    </div>
  );
}