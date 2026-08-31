import Link from "next/link";
import {
  BookOpen,
  Layers,
  UserCheck,
  Globe,
  ArrowRight,
  Sparkles,
  Trophy,
  Code2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   PURE SERVER COMPONENT — no "use client", no hooks.
   Left-text + Right-flip-cards layout (Fusion Ventures style).
   Stylized Vector Logo Badges represent premium company brands.
   ──────────────────────────────────────────────────────────── */

interface FeatureCard {
  index: string;
  category: string;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
  cta: string;
  backBg: string;
  textGrad: string;
  badgeColor: string;
  glowColor: string;
  logo: React.ReactNode;
}

const FEATURES: FeatureCard[] = [
  {
    index: "01",
    category: "LEARNING",
    title: "Premium Content",
    desc: "Industry-grade blogs, DSA notes, and real-world project tutorials curated by working developers — not textbook authors.",
    href: "https://career.codelura.com/career/learning/study-material",
    external: true,
    cta: "Start Learning →",
    backBg: "bg-gradient-to-br from-[#100d2b] via-[#090717] to-[#020205] border-violet-500/40",
    textGrad: "from-violet-400 to-fuchsia-300",
    badgeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    glowColor: "shadow-violet-500/20 group-hover:border-violet-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-violet-600">
          <BookOpen className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">DEV</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">notes.io</span>
      </div>
    ),
  },
  {
    index: "02",
    category: "RESOURCES",
    title: "Free & Paid Tools",
    desc: "500+ curated resources, structured roadmaps, and premium deep-dive courses — saving you weeks of scattered research.",
    href: "https://career.codelura.com/career/learning/career-tracks",
    external: true,
    cta: "Browse Resources →",
    backBg: "bg-gradient-to-br from-[#051c27] via-[#030e15] to-[#020205] border-cyan-500/40",
    textGrad: "from-cyan-400 to-blue-300",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    glowColor: "shadow-cyan-500/20 group-hover:border-cyan-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-cyan-500">
          <Layers className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">TOOL</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">deck.co</span>
      </div>
    ),
  },
  {
    index: "03",
    category: "GUIDANCE",
    title: "1-on-1 Mentorship",
    desc: "Direct sessions with senior devs from Google, Amazon & Meta — resume review, mock interviews, and career clarity.",
    href: "https://career.codelura.com/career/mentorship/one-on-one",
    external: true,
    cta: "Book Session →",
    backBg: "bg-gradient-to-br from-[#011b15] via-[#010e0b] to-[#020205] border-emerald-500/40",
    textGrad: "from-emerald-400 to-teal-300",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    glowColor: "shadow-emerald-500/20 group-hover:border-emerald-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-emerald-500">
          <UserCheck className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">MNT</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">ora.app</span>
      </div>
    ),
  },
  {
    index: "04",
    category: "SERVICES",
    title: "Website Development",
    desc: "End-to-end custom website delivery for startups and businesses — Next.js, React, full SEO setup, 7–14 day turnaround.",
    href: "https://build.codelura.com/services",
    external: true,
    cta: "Get a Quote →",
    backBg: "bg-gradient-to-br from-[#2f0310] via-[#170208] to-[#020205] border-rose-500/40",
    textGrad: "from-rose-400 to-orange-300",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    glowColor: "shadow-rose-500/20 group-hover:border-rose-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-rose-500">
          <Globe className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">WEB</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">setu.dev</span>
      </div>
    ),
  },
  {
    index: "05",
    category: "COMPETE",
    title: "Hackathons",
    desc: "Compete in real hackathons, collaborate with developers worldwide, win prizes, and build portfolio-worthy projects live.",
    href: "/hackathons",
    cta: "Join Hackathon →",
    backBg: "bg-gradient-to-br from-[#2b1002] via-[#150801] to-[#020205] border-amber-500/40",
    textGrad: "from-amber-400 to-orange-300",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    glowColor: "shadow-amber-500/20 group-hover:border-amber-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-amber-500">
          <Trophy className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">CUP</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">code.gg</span>
      </div>
    ),
  },
  {
    index: "06",
    category: "SAAS",
    title: "AI-Powered Tools",
    desc: "Developer-grade productivity tools — smart automation, AI code review, portfolio generators, and career analytics.",
    href: "/services",
    cta: "Explore Tools →",
    backBg: "bg-gradient-to-br from-[#0d1633] via-[#060b1b] to-[#020205] border-blue-500/40",
    textGrad: "from-blue-400 to-indigo-300",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    glowColor: "shadow-blue-500/20 group-hover:border-blue-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-blue-500">
          <Code2 className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">AI</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">turbo.dev</span>
      </div>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section
      aria-label="Platform Features"
      className="relative overflow-hidden bg-black py-24 border-t border-white/5"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[120px]" />

      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 items-start">

          {/* ═══ LEFT SIDE TEXT (4 cols — sticky) ═══ */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400">
                WHY DEVELOPERS CHOOSE US
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.15] tracking-tight text-white">
                Everything you need
                <span className="block mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  in one platform.
                </span>
              </h2>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md font-medium">
              Learning, resources, mentorship, hackathons, and professional
              services — one ecosystem packed with everything a modern developer
              needs to grow.
            </p>

            <div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest"
              >
                <span>Explore all features</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Bottom indicators */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-10">
              <div>
                <div className="text-3xl font-black text-amber-400 font-mono">06</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  KEY FEATURES
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div>
                <div className="text-3xl font-black font-mono text-amber-400">10K+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  DEVELOPERS TRUST US
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT SIDE — 3D FLIP CARDS GRID (8 cols) ═══ */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => {
                return (
                  <div
                    key={f.title}
                    className="group w-full h-[370px] [perspective:1000px] cursor-pointer"
                  >
                    {/* 3D Flip Container */}
                    <div className="relative w-full h-full duration-700 transition-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                      {/* ── FRONT (Dark Black, Stylized Brand Box) ── */}
                      <div className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-[#0a0a0f] [backface-visibility:hidden] shadow-2xl transition-all duration-500 hover:shadow-2xl ${f.glowColor}`}>
                        {/* Index */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-amber-400/80">
                            {f.index}
                          </span>
                        </div>

                        {/* Centered Graphic Brand Logo */}
                        <div className="flex-1 flex items-center justify-center py-4">
                          <div className="flex h-24 w-40 items-center justify-center rounded-2xl bg-white border border-white/10 shadow-xl shadow-black/40 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                            {f.logo}
                          </div>
                        </div>

                        {/* Bottom Category */}
                        <div className="text-center pt-2 border-t border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                            {f.category}
                          </span>
                        </div>
                      </div>

                      {/* ── BACK (Detailed Interactive Specs) ── */}
                      <div
                        className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-2xl border shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${f.backBg}`}
                      >
                        <div>
                          {/* Badge + Index */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border ${f.badgeColor}`}>
                              {f.category}
                            </span>
                            <span className="text-xs font-bold font-mono text-white/50">
                              {f.index}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="mt-5 text-2xl font-black text-white tracking-tight leading-none">
                            {f.title}
                          </h3>

                          {/* Description */}
                          <p className="mt-3.5 text-xs text-slate-300 leading-relaxed font-semibold">
                            {f.desc}
                          </p>
                        </div>

                        {/* CTA Redirect with Hover Shift */}
                        <div className="pt-4 border-t border-white/10">
                          {f.external ? (
                            <a
                              href={f.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${f.textGrad} bg-clip-text text-transparent transition-transform duration-300 group-hover:translate-x-1`}
                            >
                              <span>{f.cta}</span>
                            </a>
                          ) : (
                            <Link
                              href={f.href}
                              className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${f.textGrad} bg-clip-text text-transparent transition-transform duration-300 group-hover:translate-x-1`}
                            >
                              <span>{f.cta}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}