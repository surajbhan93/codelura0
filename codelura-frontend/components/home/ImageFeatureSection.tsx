"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Code2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

/* ─── Types ──────────────────────────────────────────────────── */
interface CheckItem {
  text: string;
}

interface PillarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bg: string;
}

interface StatItem {
  value: string;
  label: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const CHECKS: CheckItem[] = [
  { text: "Practical tutorials based on real industry problems" },
  { text: "Interview-oriented backend & frontend preparation" },
  { text: "Free + premium content by working engineers" },
  { text: "Mentorship, referrals & hiring opportunities" },
];

const PILLARS: PillarItem[] = [
  { icon: Code2, label: "Build Projects", color: "text-violet-400", bg: "bg-violet-500/12 border-violet-500/20" },
  { icon: GraduationCap, label: "Learn by Doing", color: "text-fuchsia-400", bg: "bg-fuchsia-500/12 border-fuchsia-500/20" },
  { icon: Briefcase, label: "Get Hired", color: "text-emerald-400", bg: "bg-emerald-500/12 border-emerald-500/20" },
];

const STATS: StatItem[] = [
  { value: "25K+", label: "Learners" },
  { value: "98%", label: "Satisfaction" },
  { value: "500+", label: "Resources" },
];

/* ─── Dashboard Visual (replaces image) ─────────────────────── */
function LearningDashboard() {
  const courses = [
    { title: "System Design Masterclass", progress: 78, tag: "PRO", tagColor: "text-violet-300 border-violet-500/30 bg-violet-500/10" },
    { title: "React Advanced Patterns", progress: 55, tag: "FREE", tagColor: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
    { title: "DSA for Interviews", progress: 91, tag: "PRO", tagColor: "text-violet-300 border-violet-500/30 bg-violet-500/10" },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-[#0a0915] overflow-hidden shadow-2xl">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-white/6 bg-white/3 px-5 py-3">
        {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
          <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
        ))}
        <span className="ml-3 text-[11px] text-white/25 font-mono">codelura.com/dashboard</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Welcome bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/35 font-mono">Good morning 👋</p>
            <p className="text-sm font-bold text-white/80 mt-0.5">Continue Learning</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold text-amber-300">PRO Member</span>
          </div>
        </div>

        {/* Progress ring summary */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Streak", val: "14d", color: "#f59e0b" },
            { label: "Completed", val: "23", color: "#22c55e" },
            { label: "XP Points", val: "840", color: "#a78bfa" },
          ].map(({ label, val, color }) => (
            <div key={label} className="rounded-xl border border-white/6 bg-white/4 px-3 py-2.5 text-center">
              <p className="text-base font-black" style={{ color }}>{val}</p>
              <p className="text-[9px] text-white/35 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Course cards */}
        <div className="space-y-2.5">
          {courses.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl border border-white/6 bg-white/4 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-white/70 truncate flex-1 mr-2">{c.title}</p>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${c.tagColor}`}>{c.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${c.progress}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="text-[10px] text-white/35 font-mono">{c.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI suggestion chip */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/8 px-4 py-2.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <p className="text-[11px] text-violet-300/80">
            AI suggests: <span className="font-semibold text-violet-200">System Design next →</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function ImageFeatureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <SectionWrapper bg="bg-[#07060f]">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Real-World Developer Learning — Codelura",
            description:
              "Codelura provides practical tutorials, interview prep, mentorship and hiring opportunities for developers seeking real skills.",
            provider: {
              "@type": "Organization",
              name: "Codelura",
              url: "https://codelura.com",
            },
          }),
        }}
      />

      <div ref={sectionRef} className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-violet-600/12 blur-[150px]" />
          <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        </div>

        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* ── LEFT CONTENT ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
              <TrendingUp className="h-3 w-3" />
              Real Skills. Real Jobs.
            </span>

            {/* Headline — SEO H2 */}
            <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
              Learn with{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                Real-World
              </span>{" "}
              Content
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/45">
              Codelura is built for developers who don&apos;t want certificates —
              they want{" "}
              <span className="font-semibold text-white/80">
                real skills, real projects, and real jobs.
              </span>
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3.5" aria-label="Platform benefits">
              {CHECKS.map((item, i) => (
                <motion.li
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.09, duration: 0.45 }}
                  className="flex items-start gap-3 text-sm text-white/60"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {item.text}
                </motion.li>
              ))}
            </ul>

            {/* Pillars */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {PILLARS.map(({ icon: Icon, label, color, bg }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 + i * 0.1 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  className={`rounded-2xl border ${bg} px-3 py-4 text-center transition-all duration-300 cursor-default`}
                >
                  <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} />
                  <p className="text-[11px] font-semibold text-white/60 leading-tight">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.65 }}
              className="mt-8 flex items-center gap-6"
            >
              {STATS.map(({ value, label }, i) => (
                <div key={label} className={`${i !== 0 ? "border-l border-white/10 pl-6" : ""}`}>
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-xs text-white/35 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <motion.a
                href="/learn"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-700/30 transition-all duration-300 hover:shadow-violet-700/50"
                aria-label="Start learning on Codelura"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="/jobs"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/4 px-7 py-3 text-sm font-bold text-white/75 backdrop-blur transition-all duration-300 hover:border-white/25 hover:text-white"
                aria-label="View job programs on Codelura"
              >
                View Job Programs
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ── RIGHT VISUAL ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 blur-2xl" />

            {/* Floating top badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 z-10 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-[#0a0915] px-4 py-2.5 shadow-xl backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300">AI-Powered Learning</span>
            </motion.div>

            {/* Floating bottom badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 z-10 flex items-center gap-2 rounded-2xl border border-violet-500/25 bg-[#0a0915] px-4 py-2.5 shadow-xl backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-bold text-violet-300">25K+ Developers</span>
            </motion.div>

            <LearningDashboard />
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}