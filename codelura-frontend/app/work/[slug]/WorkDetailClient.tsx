"use client";

import { useState } from "react";
import { Work } from "./page";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import type { Variants } from "framer-motion";
import Link from "next/link";
import { ExternalLink, RefreshCw, Monitor, Globe, Code, Camera, Eye } from "lucide-react";

/* ─── fade-up variant helper ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ─── section header ─── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 via-white/10 to-transparent" />
    </div>
  );
}

/* ─── Live Browser Preview Mockup (Hybrid: Iframe + Screenshot Capture + Fallback) ─── */
function LiveBrowserPreview({ url, fallbackImage, title }: { url?: string; fallbackImage?: string; title: string }) {
  const [key, setKey] = useState(0);
  const [mode, setMode] = useState<"iframe" | "snapshot">("iframe");

  const cleanUrl = url ? (url.startsWith("http") ? url : `https://${url}`) : "";
  const displayUrl = cleanUrl || "https://codelura.com/work/preview";

  // Thum.io / Microlink screenshot generator for sites that block iframe
  const generatedSnapshotUrl = cleanUrl
    ? `https://image.thum.io/get/width/1200/crop/800/${cleanUrl}`
    : fallbackImage;

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#0a0a14] shadow-2xl shadow-indigo-500/10 transition-all duration-300 hover:border-indigo-500/40">
      {/* Top Browser Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#121222] border-b border-white/10">
        {/* Window controls (red, yellow, green dots) */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* URL Bar */}
        <div className="flex-1 min-w-[160px] max-w-xs px-3 py-1 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <Globe className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{displayUrl}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider">LIVE</span>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setMode("iframe")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              mode === "iframe"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Interactive Iframe Mode"
          >
            <Eye className="w-3 h-3" />
            <span>Interactive</span>
          </button>
          <button
            onClick={() => setMode("snapshot")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              mode === "snapshot"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Live Screenshot Capture Mode (Works for all sites)"
          >
            <Camera className="w-3 h-3" />
            <span>Snapshot</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {cleanUrl && (
            <button
              onClick={() => setKey((k) => k + 1)}
              title="Refresh View"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          {cleanUrl && (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Site in New Tab"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Browser Viewport */}
      <div className="relative w-full h-[360px] sm:h-[420px] bg-black/90 flex items-center justify-center overflow-hidden">
        {cleanUrl ? (
          mode === "iframe" ? (
            <iframe
              key={key}
              src={cleanUrl}
              title={`Live Preview - ${title}`}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                key={key}
                src={generatedSnapshotUrl || fallbackImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (fallbackImage && e.currentTarget.src !== fallbackImage) {
                    e.currentTarget.src = fallbackImage;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4">
                <span className="text-xs text-white/80 font-mono flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" /> Live Capture Snapshot
                </span>
                <a
                  href={cleanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Visit Live Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )
        ) : fallbackImage ? (
          <div className="relative w-full h-full">
            <img src={fallbackImage} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white/70 font-mono">Project Screenshot</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
            <Monitor className="w-12 h-12 text-indigo-400/50" />
            <p className="text-xs font-semibold text-slate-400">Live preview will appear here</p>
            <p className="text-[11px] text-slate-600 max-w-xs">Provide a live URL to render real-time interactive preview or website capture.</p>
          </div>
        )}
      </div>

      {/* Bottom helper bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#0d0d1a] border-t border-white/5 text-[10px] text-slate-500 font-mono gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {mode === "iframe" ? "Interactive Webview" : "Live Web Snapshot"}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-slate-600 hidden sm:inline">Blocked by site? Click Snapshot button above</span>
          {cleanUrl && (
            <a href={cleanUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
              Open Site <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorkDetailClient({ work }: { work: Work }) {
  /* ── Meta items ── */
  const metaItems = [
    { label: "Client", value: work.clientName, icon: "🏢", color: "from-violet-500/20 to-indigo-500/5" },
    { label: "Category", value: work.category, icon: "📂", color: "from-cyan-500/20 to-blue-500/5" },
    { label: "Industry", value: work.industry, icon: "🏭", color: "from-emerald-500/20 to-teal-500/5" },
    { label: "Role", value: work.role, icon: "👤", color: "from-amber-500/20 to-orange-500/5" },
    { label: "Duration", value: work.duration, icon: "🗓️", color: "from-rose-500/20 to-pink-500/5" },
  ].filter((item) => Boolean(item.value));

  /* ── Case study rows ── */
  const caseRows = [
    {
      title: "Problem",
      content: work.caseStudy?.problem,
      color: "from-rose-500/20 to-orange-500/5",
      borderColor: "border-l-rose-500",
      tag: "bg-rose-500/15 text-rose-400 border-rose-500/25",
      icon: "⚠️",
    },
    {
      title: "Solution",
      content: work.caseStudy?.solution,
      color: "from-indigo-500/20 to-violet-500/5",
      borderColor: "border-l-indigo-500",
      tag: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
      icon: "💡",
    },
    {
      title: "Result",
      content: work.caseStudy?.result,
      color: "from-emerald-500/20 to-teal-500/5",
      borderColor: "border-l-emerald-500",
      tag: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      icon: "✅",
    },
  ].filter((row) => Boolean(row.content));

  /* ── Metric items ── */
  const metricItems = [
    { label: "Users", value: work.metrics?.users, icon: "👥", grad: "from-violet-400 to-indigo-400" },
    { label: "Performance", value: work.metrics?.performanceGain, icon: "⚡", grad: "from-cyan-400 to-blue-400" },
    { label: "Revenue", value: work.metrics?.revenueImpact, icon: "📈", grad: "from-emerald-400 to-teal-400" },
  ].filter((item) => Boolean(item.value));

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050510 0%, #080818 50%, #040410 100%)" }}
    >
      {/* ── Background grid + blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-60 -left-40 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-60 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-60 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">

        {/* ══ HERO SECTION (2-COLUMN WITH HYBRID LIVE PREVIEW ON RIGHT) ══ */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Column: Details & Copy */}
          <div className="lg:col-span-6 space-y-6">
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
              <Link href="/work" className="hover:text-indigo-400 transition-colors">
                Work
              </Link>
              <span className="text-white/15">/</span>
              <span className="text-white/50 truncate max-w-[300px]">{work.title}</span>
            </div>

            {/* badges */}
            <div className="flex flex-wrap items-center gap-3">
              {work.isFeatured && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-lg shadow-indigo-500/30"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  ✦ Featured Project
                </span>
              )}
              {work.category && (
                <span className="text-[11px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full text-white/60 bg-white/[0.04] border border-white/10">
                  {work.category}
                </span>
              )}
            </div>

            {/* title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight">
              {work.title}
            </h1>

            {/* short desc */}
            {work.shortDescription && (
              <p className="text-white/45 text-base sm:text-lg leading-relaxed">
                {work.shortDescription}
              </p>
            )}

            {/* CTA buttons */}
            {(work.liveUrl || work.githubUrl) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {work.liveUrl && (
                  <a
                    href={work.liveUrl.startsWith("http") ? work.liveUrl : `https://${work.liveUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/40"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                  >
                    <Globe className="w-4 h-4" />
                    Live Preview ↗
                  </a>
                )}
                {work.githubUrl && (
                  <a
                    href={work.githubUrl.startsWith("http") ? work.githubUrl : `https://${work.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white/80 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-all hover:-translate-y-0.5"
                  >
                    <Code className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Hybrid Live Browser Preview */}
          <div className="lg:col-span-6">
            <LiveBrowserPreview
              url={work.liveUrl}
              fallbackImage={work.thumbnail}
              title={work.title}
            />
          </div>
        </motion.section>

        {/* ══ THUMBNAIL (IF DIFFERENT OR ADDITIONAL VISUAL) ══ */}
        {work.thumbnail && !work.liveUrl && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="group relative rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50"
          >
            <img src={work.thumbnail} alt={work.title} className="w-full max-h-[560px] object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          </motion.div>
        )}

        {/* ══ META CARDS ══ */}
        {metaItems.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.15}>
            <SectionHeading>Project Details</SectionHeading>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {metaItems.map((item) => (
                <div
                  key={item.label}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.color} border border-white/[0.06] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/10`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-white font-bold text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══ OVERVIEW ══ */}
        {work.description && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1} className="max-w-4xl">
            <SectionHeading>Overview</SectionHeading>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <p className="text-white/50 leading-[1.9] text-base sm:text-lg">
                {work.description}
              </p>
            </div>
          </motion.section>
        )}

        {/* ══ TECH STACK ══ */}
        {work.techStack && work.techStack.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
            <SectionHeading>Tech Stack</SectionHeading>
            <div className="flex flex-wrap gap-2.5">
              {work.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white/80 bg-white/[0.05] border border-white/10 transition-all duration-200 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-white hover:shadow-md hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══ CASE STUDY ══ */}
        {work.caseStudy && caseRows.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
            <SectionHeading>Case Study</SectionHeading>
            <div className="grid gap-5">
              {caseRows.map((row) => (
                <div
                  key={row.title}
                  className={`rounded-2xl border border-white/[0.06] overflow-hidden bg-gradient-to-br ${row.color} border-l-[3px] ${row.borderColor} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <div className="p-6 sm:p-8">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border mb-4 ${row.tag}`}>
                      {row.icon} {row.title}
                    </span>
                    <p className="text-white/60 leading-relaxed text-sm sm:text-base">{row.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══ METRICS ══ */}
        {work.metrics && metricItems.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
            <SectionHeading>Impact & Results</SectionHeading>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {metricItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent border border-indigo-500/20 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-500/35"
                >
                  <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/60 mb-3 flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>{item.label}
                  </p>
                  <p className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${item.grad} bg-clip-text text-transparent`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══ GALLERY ══ */}
        {work.images && work.images.length > 0 && (
          <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
            <SectionHeading>Screenshots</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {work.images.map((img, i) => (
                <motion.div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden border border-white/[0.06] h-56 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ══ SEPARATOR ══ */}
        <Separator className="bg-white/[0.06]" />

        {/* ══ CTA BOTTOM ══ */}
        <motion.section variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
          <div
            className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9, #7c3aed)" }}
          >
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative z-10 space-y-5 max-w-lg mx-auto">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-200/70">
                Let&apos;s Collaborate
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
                Like what you see?
              </h2>
              <p className="text-indigo-200/60 text-sm leading-relaxed max-w-md mx-auto">
                Let&apos;s work together to build something amazing for your business.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-3">
                {work.liveUrl && (
                  <a
                    href={work.liveUrl.startsWith("http") ? work.liveUrl : `https://${work.liveUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-indigo-700 bg-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                  >
                    View Live →
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:-translate-y-0.5 transition-all"
                >
                  Start a Project →
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}