"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";

/* ─── Types ──────────────────────────────────────────────────── */
interface StatsData {
  developers: number;
  resources: number;
  sessions: number;
  websites: number;
}

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

interface CodeLine {
  indent: number;
  tokens: Array<{ text: string; color: string }>;
}

/* ─── SEO Structured Data ────────────────────────────────────── */
function StatsSEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codelura",
    description:
      "AI-powered developer platform with 25,000+ developers, 1,200+ resources, mentorship sessions and websites built.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "3500",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/* ─── Mock API ───────────────────────────────────────────────── */
async function fetchStats(): Promise<StatsData> {
  return {
    developers: 25000,
    resources: 1200,
    sessions: 3500,
    websites: 400,
  };
}

/* ─── Count Up Hook ──────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = target / 70;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return count;
}

/* ─── Single Stat Counter ────────────────────────────────────── */
function StatCounter({ item, index, inView }: { item: StatItem; index: number; inView: boolean }) {
  const count = useCountUp(item.value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ scale: 1.04 }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/6 cursor-default"
    >
      {/* Glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 0%,rgba(16,185,129,0.08),transparent 70%)" }}
      />

      {/* Icon */}
      <span className="mb-4 block text-2xl" aria-hidden="true">{item.icon}</span>

      {/* Number */}
      <p className="text-4xl font-black tabular-nums text-white md:text-5xl">
        {count.toLocaleString()}
        <span className="text-emerald-400">{item.suffix ?? "+"}</span>
      </p>

      {/* Label */}
      <p className="mt-2 text-sm font-medium tracking-wide text-white/45">{item.label}</p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-400"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.7 }}
      />
    </motion.div>
  );
}

/* ─── Inline Live Code Editor ────────────────────────────────── */
const CODE_LINES: CodeLine[] = [
  { indent: 0, tokens: [{ text: "// 🚀 Codelura AI Platform", color: "#6b7280" }] },
  { indent: 0, tokens: [{ text: "import", color: "#a78bfa" }, { text: " { ", color: "#e5e7eb" }, { text: "Codelura", color: "#34d399" }, { text: " } ", color: "#e5e7eb" }, { text: "from", color: "#a78bfa" }, { text: " '@/sdk'", color: "#fbbf24" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "const", color: "#a78bfa" }, { text: " ai ", color: "#e5e7eb" }, { text: "=", color: "#a78bfa" }, { text: " new ", color: "#a78bfa" }, { text: "Codelura", color: "#34d399" }, { text: "({", color: "#e5e7eb" }] },
  { indent: 2, tokens: [{ text: "services", color: "#93c5fd" }, { text: ": [", color: "#e5e7eb" }, { text: "'notes'", color: "#fbbf24" }, { text: ", ", color: "#e5e7eb" }, { text: "'mentor'", color: "#fbbf24" }, { text: ", ", color: "#e5e7eb" }, { text: "'career'", color: "#fbbf24" }, { text: "]", color: "#e5e7eb" }] },
  { indent: 2, tokens: [{ text: "hackathons", color: "#93c5fd" }, { text: ": ", color: "#e5e7eb" }, { text: "true", color: "#34d399" }] },
  { indent: 2, tokens: [{ text: "aiMode", color: "#93c5fd" }, { text: ": ", color: "#e5e7eb" }, { text: "'turbo'", color: "#fbbf24" }] },
  { indent: 0, tokens: [{ text: "})", color: "#e5e7eb" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "// Launch your developer journey", color: "#6b7280" }] },
  { indent: 0, tokens: [{ text: "await", color: "#a78bfa" }, { text: " ai.", color: "#e5e7eb" }, { text: "launch", color: "#34d399" }, { text: "()", color: "#e5e7eb" }] },
];

function LiveCodeEditor() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorLine, setCursorLine] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        const next = prev + 1;
        setCursorLine(next);
        if (next >= CODE_LINES.length) clearInterval(interval);
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="relative h-full min-h-[260px] md:min-h-[380px] sss rounded-2xl border border-white/10 bg-[#0a0a14] overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/3 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-xs text-white/30 font-mono">codelura.sdk.ts</span>
        <span className="ml-auto text-[10px] text-emerald-400/60 font-mono">● TypeScript</span>
      </div>

      {/* Line numbers + code */}
      <div className="p-5 font-mono text-sm leading-7 overflow-auto">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex group">
            <span className="mr-5 w-5 shrink-0 select-none text-right text-xs text-white/20 leading-7">
              {i + 1}
            </span>
            <span style={{ paddingLeft: `${line.indent * 12}px` }} className="flex flex-wrap items-center gap-x-[2px]">
              {line.tokens.length === 0 ? (
                <span className="text-transparent">_</span>
              ) : (
                line.tokens.map((tok, j) => (
                  <span key={j} style={{ color: tok.color }}>{tok.text}</span>
                ))
              )}
              {i === visibleLines - 1 && cursorLine < CODE_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="inline-block w-[2px] h-4 bg-emerald-400 ml-0.5 align-middle"
                />
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-between border-t border-white/5 bg-[#06060f] px-4 py-1.5 text-[10px] font-mono text-white/25">
        <span>Ln {visibleLines}, Col 1</span>
        <span className="text-emerald-400/50">✓ No errors</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

/* ─── Trusted Logos ──────────────────────────────────────────── */
const TRUSTED = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Stripe"];

function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-2 text-center"
      aria-label="Trusted by developers at leading companies"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
        Trusted by developers at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {TRUSTED.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="text-base font-bold tracking-tight text-white/20 transition-colors duration-300 hover:text-white/50 cursor-default select-none"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<StatsData | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Fetch only when in view
  useEffect(() => {
    if (inView && !data) {
      fetchStats().then(setData);
    }
  }, [inView, data]);

  // Scroll progress for animated timeline line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const statItems: StatItem[] = data
    ? [
        { label: "Developers Helped", value: data.developers, icon: "👨‍💻" },
        { label: "Premium Resources", value: data.resources, icon: "📚" },
        { label: "1-on-1 Sessions", value: data.sessions, icon: "🎯" },
        { label: "Websites Built", value: data.websites, icon: "🌐" },
      ]
    : [];

  return (
    <>
      <StatsSEO />
      <SectionWrapper bg="bg-gradient-to-b from-[#06050f] via-[#080814] to-[#0a0a18]" >
        <div ref={sectionRef} className="space-y-8 md:space-y-10">

          {/* ── Section Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform Impact
            </span>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
              Numbers That{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
            <p className="mt-4 text-white/45 max-w-xl mx-auto text-base leading-relaxed">
              Thousands of developers trust Codelura every day to learn faster,
              build smarter, and grow their careers with AI.
            </p>
          </motion.div>

          {/* ── Stats Grid + Code Editor ── */}
          <div className="grid gap-2 lg:grid-cols-2 lg:items-start">

            {/* LEFT — Stats Grid */}
            <div>
              {data ? (
                <div className="grid grid-cols-2 gap-4" aria-label="Platform statistics">
                  {statItems.map((item, i) => (
                    <StatCounter key={item.label} item={item} index={i} inView={inView} />
                  ))}
                </div>
              ) : (
                /* Skeleton loader */
                <div className="grid grid-cols-2 gap-4" aria-busy="true" aria-label="Loading statistics">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-36 rounded-2xl bg-white/4 animate-pulse border border-white/5"
                    />
                  ))}
                </div>
              )}

              {/* Timeline Progress Indicator */}
              <div className="mt-8 flex items-center gap-3">
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    style={{ scaleX: lineScaleY, originX: 0 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  />
                </div>
                <span className="text-xs text-white/30 font-mono whitespace-nowrap">
                  Growing daily
                </span>
              </div>
            </div>

            {/* RIGHT — Code Editor */}
            <LiveCodeEditor />
          </div>

          {/* ── Trust Strip ── */}
          <TrustStrip />

        </div>
      </SectionWrapper>
    </>
  );
}