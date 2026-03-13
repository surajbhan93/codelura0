"use client";

import { useState,  useRef } from "react";
import { motion, AnimatePresence,  useInView } from "framer-motion";
import {
  BookOpen,
  Layers,
  UserCheck,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface Feature {
  title: string;
  tagline: string;
  desc: string;
  details: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  accentBg: string;
  visual: React.ReactNode;
}

/* ─── Feature Visuals (SVG animated illustrations) ───────────── */
function LearningVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      {/* Notebook / Blog UI simulation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c1a] overflow-hidden shadow-2xl"
      >
        <div className="h-8 flex items-center gap-1.5 px-4 bg-white/4 border-b border-white/5">
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
          <span className="ml-3 text-[10px] text-white/25 font-mono">blog.codelura.com</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="h-3 w-3/4 rounded-full bg-violet-500/40 animate-pulse" />
          <div className="h-2 w-full rounded-full bg-white/10" />
          <div className="h-2 w-5/6 rounded-full bg-white/8" />
          <div className="h-2 w-4/6 rounded-full bg-white/6" />
          <div className="mt-4 flex gap-2">
            {["React","Next.js","AI"].map((tag) => (
              <span key={tag} className="rounded-full bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 text-[10px] text-violet-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-2 space-y-2">
            {[85, 60, 75].map((w, i) => (
              <motion.div
                key={i}
                className="h-1.5 rounded-full bg-gradient-to-r from-violet-500/50 to-cyan-500/30"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: w / 100 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 right-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 font-semibold backdrop-blur"
      >
        ✦ New Article
      </motion.div>
    </div>
  );
}

function ResourcesVisual() {
  const items = [
    { label: "DSA Notes", type: "FREE", color: "#22c55e" },
    { label: "System Design", type: "PRO", color: "#a78bfa" },
    { label: "DevOps Guide", type: "FREE", color: "#22c55e" },
    { label: "AI/ML Roadmap", type: "PRO", color: "#a78bfa" },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur"
          >
            <div className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white/40" />
            </div>
            <span className="flex-1 text-sm text-white/70 font-medium">{item.label}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold border"
              style={{ color: item.color, borderColor: item.color + "40", background: item.color + "15" }}
            >
              {item.type}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MentorshipVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        {/* Chat bubbles */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-3 items-end">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">M</div>
          <div className="rounded-2xl rounded-bl-sm bg-white/8 border border-white/8 px-4 py-3 text-sm text-white/70 max-w-[220px]">
            Your portfolio is solid. Let&apos;s work on negotiation strategy.
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="flex gap-3 items-end flex-row-reverse">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">Y</div>
          <div className="rounded-2xl rounded-br-sm bg-violet-500/20 border border-violet-500/25 px-4 py-3 text-sm text-white/80 max-w-[220px]">
            I got an offer from Google! 🎉
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
          className="flex gap-3 items-end">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">M</div>
          <div className="rounded-2xl rounded-bl-sm bg-white/8 border border-white/8 px-4 py-3 text-sm text-white/70 max-w-[220px]">
            Knew you&apos;d crush it 💪 Next: Senior roles.
          </div>
        </motion.div>
        {/* Typing indicator */}
        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="ml-11 flex gap-1 items-center">
          {[0,1,2].map(i => (
            <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ delay: i * 0.15, duration: 0.8, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-white/30" />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c1a] overflow-hidden shadow-2xl"
      >
        <div className="h-8 flex items-center gap-1.5 px-4 bg-white/4 border-b border-white/5">
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        {/* Hero section mockup */}
        <div className="p-4 space-y-2">
          <div className="h-20 rounded-xl bg-gradient-to-br from-violet-900/50 to-fuchsia-900/30 border border-white/5 flex items-center justify-center">
            <span className="text-xs text-white/40 font-mono">Hero Section</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Features","Pricing","Contact"].map(s => (
              <div key={s} className="h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                <span className="text-[9px] text-white/30">{s}</span>
              </div>
            ))}
          </div>
          <div className="h-2 w-3/4 rounded-full bg-white/8" />
          <div className="h-2 w-1/2 rounded-full bg-white/5" />
          <motion.div
            className="mt-2 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 0px #a855f7", "0 0 20px #a855f740", "0 0 0px #a855f7"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[10px] font-bold text-white">Deploy →</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Features Data ──────────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    title: "Premium Learning Content",
    tagline: "Learn from Real Production Experience",
    desc: "Industry-grade blogs, notes, and practical materials curated by working developers — not textbook authors.",
    details: [
      "Real-world projects & case studies",
      "Updated weekly with new content",
      "Covers DSA, System Design, AI/ML & more",
    ],
    icon: BookOpen,
    accent: "from-violet-400 to-fuchsia-400",
    accentBg: "bg-violet-500/10 border-violet-500/20",
    visual: <LearningVisual />,
  },
  {
    title: "Free & Paid Resources",
    tagline: "Everything a Developer Needs in One Place",
    desc: "Carefully curated tools, courses, roadmaps and libraries — saving you weeks of scattered research.",
    details: [
      "500+ free resources available instantly",
      "Premium deep-dive courses & notes",
      "Structured roadmaps by role & stack",
    ],
    icon: Layers,
    accent: "from-cyan-400 to-blue-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/20",
    visual: <ResourcesVisual />,
  },
  {
    title: "1-on-1 Mentorship",
    tagline: "Personal Guidance That Actually Works",
    desc: "Direct sessions with industry experts focused on your resume, projects, interview prep and career clarity.",
    details: [
      "Book sessions with vetted senior devs",
      "Resume, portfolio & interview prep",
      "Long-term career roadmap support",
    ],
    icon: UserCheck,
    accent: "from-emerald-400 to-teal-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/20",
    visual: <MentorshipVisual />,
  },
  {
    title: "Website Development",
    tagline: "Professional Websites for Your Business",
    desc: "End-to-end website delivery for startups, creators & businesses — design, dev, deployment & support included.",
    details: [
      "Custom design, not templates",
      "Next.js / React with full SEO setup",
      "Delivery in 7–14 days with support",
    ],
    icon: Globe,
    accent: "from-rose-400 to-orange-400",
    accentBg: "bg-rose-500/10 border-rose-500/20",
    visual: <WebsiteVisual />,
  },
];

/* ─── Main Section ───────────────────────────────────────────── */
export default function FeaturesSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const activeFeature = FEATURES[active];
  const Icon = activeFeature.icon;

  return (
    <section
      ref={sectionRef}
      aria-label="Codelura Platform Features"
      className="relative overflow-hidden bg-[#07060f] py-10 md:py-14"
    >
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Codelura Platform Features",
            itemListElement: FEATURES.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: f.title,
              description: f.desc,
            })),
          }),
        }}
      />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-700/8 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <Sparkles className="h-3 w-3" />
            Everything You Need
          </span>
          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            Why Developers Choose{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Codelura
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/40 leading-relaxed">
            One platform packed with everything — learning, resources, mentorship,
            and professional services.
          </p>
        </motion.div>

        {/* ── Tab Pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 flex flex-wrap justify-center gap-3"
          role="tablist"
          aria-label="Feature categories"
        >
          {FEATURES.map((f, i) => {
            const TabIcon = f.icon;
            const isActive = active === i;
            return (
              <button
                key={f.title}
                role="tab"
                aria-selected={isActive}
                aria-controls={`feature-panel-${i}`}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300
                  ${isActive
                    ? `bg-gradient-to-r ${f.accent} border-transparent text-white shadow-lg`
                    : "border-white/10 bg-white/4 text-white/45 hover:border-white/20 hover:text-white/70"
                  }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                {f.title.split(" ").slice(0, 2).join(" ")}
              </button>
            );
          })}
        </motion.div>

        {/* ── Content Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id={`feature-panel-${active}`}
            role="tabpanel"
            aria-label={activeFeature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-8 lg:grid-cols-2 lg:items-center"
          >
            {/* LEFT — Text Content */}
            <div className="space-y-6">
              {/* Icon + Tag */}
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${activeFeature.accentBg}`}>
                  <Icon className={`h-5 w-5 bg-gradient-to-r ${activeFeature.accent} bg-clip-text`}
                    style={{ color: "transparent", filter: "drop-shadow(0 0 8px rgba(167,139,250,0.5))" }}
                  />
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-bold bg-gradient-to-r ${activeFeature.accent} bg-clip-text text-transparent ${activeFeature.accentBg}`}>
                  {activeFeature.tagline}
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-2xl font-black text-white md:text-3xl leading-tight">
                {activeFeature.title}
              </h3>

              {/* Description */}
              <p className="text-base text-white/50 leading-relaxed">
                {activeFeature.desc}
              </p>

              {/* Checklist */}
              <ul className="space-y-3" aria-label={`${activeFeature.title} features`}>
                {activeFeature.details.map((detail) => (
                  <motion.li
                    key={detail}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 text-sm text-white/65"
                  >
                    <CheckCircle2 className={`h-4 w-4 shrink-0 bg-gradient-to-r ${activeFeature.accent}`}
                      style={{ color: "transparent", filter: "drop-shadow(0 0 6px rgba(167,139,250,0.4))" }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ x: 4 }}
                className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${activeFeature.accent} px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl`}
                aria-label={`Learn more about ${activeFeature.title}`}
              >
                Explore Feature
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* RIGHT — Animated Visual */}
            <div className="relative h-[360px] rounded-3xl border border-white/8 bg-white/3 overflow-hidden backdrop-blur-xl shadow-2xl">
              {/* Inner glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12), transparent 70%)",
                }}
              />
              {activeFeature.visual}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom Feature Mini Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {FEATURES.map((f, i) => {
            const CardIcon = f.icon;
            return (
              <motion.button
                key={f.title}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`group rounded-2xl border p-4 text-left transition-all duration-300
                  ${active === i
                    ? `border-white/20 bg-white/8`
                    : "border-white/6 bg-white/3 hover:bg-white/6"
                  }`}
                aria-label={`View ${f.title}`}
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${f.accentBg}`}>
                  <CardIcon className="h-4 w-4 text-white/60" />
                </div>
                <p className="text-sm font-semibold text-white/75 leading-tight">{f.title}</p>
                <p className="mt-1 text-xs text-white/35 leading-snug line-clamp-2">{f.desc}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}