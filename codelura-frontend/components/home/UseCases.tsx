import Link from "next/link";
import {
  GraduationCap,
  Code2,
  Briefcase,
  Rocket,
  BookOpen,
  Laptop,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   PURE SERVER COMPONENT — no "use client", no hooks.
   Left-text + Right-flip-cards layout (Fusion Ventures style).
   Stylized Vector Logo Badges represent premium company brands.
   ──────────────────────────────────────────────────────────── */

interface UseCaseCard {
  index: string;
  category: string;
  title: string;
  desc: string;
  perks: string[];
  href: string;
  cta: string;
  backBg: string;
  textGrad: string;
  badgeColor: string;
  glowColor: string;
  logo: React.ReactNode;
}

const USE_CASES: UseCaseCard[] = [
  {
    index: "01",
    category: "ACADEMY",
    title: "Students & Freshers",
    desc: "Structured roadmaps, DSA cheat sheets, and mock interviewer feedback to crack your first tech job callback.",
    perks: ["DSA & System Design", "Interactive Templates", "Mock Interviews"],
    href: "/career/learning/study-material",
    cta: "Start Learning →",
    backBg: "bg-gradient-to-br from-[#100d2b] via-[#090717] to-[#020205] border-violet-500/40",
    textGrad: "from-violet-400 to-fuchsia-300",
    badgeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    glowColor: "shadow-violet-500/20 group-hover:border-violet-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-violet-600">
          <GraduationCap className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">GRAD</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">base.io</span>
      </div>
    ),
  },
  {
    index: "02",
    category: "ENGINEERING",
    title: "Working Developers",
    desc: "Upskill with advanced design patterns, system design blueprints, and production deployment templates.",
    perks: ["Advanced Patterns", "System Design", "Cloud Architecture"],
    href: "/career/learning/career-tracks",
    cta: "Explore Courses →",
    backBg: "bg-gradient-to-br from-[#051c27] via-[#030e15] to-[#020205] border-cyan-500/40",
    textGrad: "from-cyan-400 to-blue-300",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    glowColor: "shadow-cyan-500/20 group-hover:border-cyan-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-cyan-500">
          <Code2 className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">DEV</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">rise.co</span>
      </div>
    ),
  },
  {
    index: "03",
    category: "GIG ECONOMY",
    title: "Freelancers",
    desc: "Build highly attractive portfolios, leverage pre-made project contracts, and land global client mandates.",
    perks: ["Portfolio Hosting", "Client Contracts", "Project Outlines"],
    href: "/career/mentorship/one-on-one",
    cta: "Build Profile →",
    backBg: "bg-gradient-to-br from-[#011b15] via-[#010e0b] to-[#020205] border-emerald-500/40",
    textGrad: "from-emerald-400 to-teal-300",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    glowColor: "shadow-emerald-500/20 group-hover:border-emerald-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-emerald-500">
          <Briefcase className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">SOLO</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">work.net</span>
      </div>
    ),
  },
  {
    index: "04",
    category: "FOUNDERS",
    title: "Startup Founders",
    desc: "Ship landing pages, customer MVPs, admin dashboards, and scalable database integrations in record time.",
    perks: ["MVP in 14 Days", "Admin Panels", "SEO Setup"],
    href: "https://build.codelura.com/services",
    cta: "Ship MVP →",
    backBg: "bg-gradient-to-br from-[#2f0310] via-[#170208] to-[#020205] border-rose-500/40",
    textGrad: "from-rose-400 to-orange-300",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    glowColor: "shadow-rose-500/20 group-hover:border-rose-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-rose-500">
          <Rocket className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">MVP</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">ship.xyz</span>
      </div>
    ),
  },
  {
    index: "05",
    category: "SELF-STUDY",
    title: "Self Learners",
    desc: "Master system architectures and coding hacks at your own pace with curated developer guides.",
    perks: ["Curated Guides", "Interactive Labs", "Weekly Drops"],
    href: "/career/learning/study-material",
    cta: "Browse Guides →",
    backBg: "bg-gradient-to-br from-[#2b1002] via-[#150801] to-[#020205] border-amber-500/40",
    textGrad: "from-amber-400 to-orange-300",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    glowColor: "shadow-amber-500/20 group-hover:border-amber-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-amber-500">
          <BookOpen className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">AUTO</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">didact.io</span>
      </div>
    ),
  },
  {
    index: "06",
    category: "Hiring",
    title: "Hiring Companies",
    desc: "Gain instant access to job-ready software developers trained with active production frameworks.",
    perks: ["Vetted Developers", "Code Portfolios", "Direct Hiring"],
    href: "https://build.codelura.com/services",
    cta: "Find Talent →",
    backBg: "bg-gradient-to-br from-[#0d1633] via-[#060b1b] to-[#020205] border-blue-500/40",
    textGrad: "from-blue-400 to-indigo-300",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    glowColor: "shadow-blue-500/20 group-hover:border-blue-500/40",
    logo: (
      <div className="flex flex-col items-center gap-1 font-sans">
        <div className="flex items-center gap-1.5 text-blue-500">
          <Laptop className="h-5 w-5" />
          <span className="font-mono text-xs font-black tracking-widest">TALENT</span>
        </div>
        <span className="text-[14px] font-black tracking-tight text-slate-800">pool.tech</span>
      </div>
    ),
  },
];

export default function UseCases() {
  return (
    <section
      aria-label="Who Is Codelura For"
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
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400">
                BUILT FOR EVERYONE
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.15] tracking-tight text-white">
                Who is
                <span className="block mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Codelura for?
                </span>
              </h2>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md font-medium">
              From fresh graduates seeking structured roadmaps to startup founders building out core software architectures in record time.
            </p>

            <div>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-widest"
              >
                <span>Join the platform</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Bottom indicators */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-10">
              <div>
                <div className="text-3xl font-black text-violet-400 font-mono">06</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  USE CASES
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div>
                <div className="text-3xl font-black font-mono text-violet-400">10K+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  GLOBAL USERS
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT SIDE — 3D FLIP CARDS GRID (8 cols) ═══ */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {USE_CASES.map((f) => {
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
                          <span className="text-xs font-bold font-mono text-violet-400/80">
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

                      {/* ── BACK (Detailed Specs) ── */}
                      <div
                        className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-2xl border shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${f.backBg}`}
                      >
                        <div className="space-y-4">
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
                          <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                            {f.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                            {f.desc}
                          </p>

                          {/* Perks */}
                          <ul className="space-y-1.5 pt-1">
                            {f.perks.map((p) => (
                              <li key={p} className="flex items-center gap-2 text-[11px] font-semibold text-slate-200/80">
                                <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${f.textGrad}`} />
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Redirect with Hover Shift */}
                        <div className="pt-4 border-t border-white/10">
                          <Link
                            href={f.href}
                            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${f.textGrad} bg-clip-text text-transparent transition-transform duration-300 group-hover:translate-x-1`}
                          >
                            <span>{f.cta}</span>
                          </Link>
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