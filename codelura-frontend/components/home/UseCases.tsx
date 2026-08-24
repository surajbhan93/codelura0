import {
  GraduationCap,
  Code2,
  Briefcase,
  Rocket,
  BookOpen,
  Laptop,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   PURE SERVER COMPONENT. No "use client", no hooks, no
   framer-motion — zero client JS shipped.

   What changed vs the original:
   - useInView scroll-triggered fades → CSS animation playing
     once on load with a per-card stagger delay.
   - useState(hovered) + inline boxShadow → CSS custom property
     (--glow) + Tailwind hover: + arbitrary shadow value. No
     re-render on hover at all now, purely browser-native.
   - whileHover card lift / button nudge → CSS transitions.
   - Pill stagger + CTA hover/tap → CSS keyframes + hover/active
     scale utilities.
   ──────────────────────────────────────────────────────────── */

interface UseCase {
  title: string;
  desc: string;
  perks: string[];
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  border: string;
  accentBg: string;
  emoji: string;
}

const USE_CASES: UseCase[] = [
  {
    title: "Students & Freshers",
    desc: "Preparing for tech jobs with structured learning, projects and interview-ready material.",
    perks: ["DSA & System Design", "Resume Building", "Mock Interviews"],
    cta: "Start Learning Free",
    icon: GraduationCap,
    gradient: "from-violet-500 to-indigo-500",
    glow: "rgba(139,92,246,0.28)",
    border: "border-violet-500/20",
    accentBg: "bg-violet-500/10",
    emoji: "🎓",
  },
  {
    title: "Working Developers",
    desc: "Upskilling in backend, frontend, system design and real-world production architectures.",
    perks: ["Advanced Patterns", "System Design", "AI Integration"],
    cta: "Explore Courses",
    icon: Code2,
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.28)",
    border: "border-cyan-500/20",
    accentBg: "bg-cyan-500/10",
    emoji: "💻",
  },
  {
    title: "Freelancers",
    desc: "Building strong portfolios, landing global clients and delivering professional projects.",
    perks: ["Portfolio Website", "Client Proposals", "Project Templates"],
    cta: "Build Your Profile",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.28)",
    border: "border-emerald-500/20",
    accentBg: "bg-emerald-500/10",
    emoji: "🧑‍💼",
  },
  {
    title: "Startup Founders",
    desc: "Getting MVPs, landing pages, admin panels and scalable web solutions shipped fast.",
    perks: ["MVP in 14 Days", "Admin Panels", "SaaS Ready"],
    cta: "Get a Quote",
    icon: Rocket,
    gradient: "from-orange-500 to-rose-500",
    glow: "rgba(249,115,22,0.28)",
    border: "border-orange-500/20",
    accentBg: "bg-orange-500/10",
    emoji: "🚀",
  },
  {
    title: "Self Learners",
    desc: "Accessing blogs, case studies and practical tutorials curated from real industry experience.",
    perks: ["Free Content", "Case Studies", "Weekly Updates"],
    cta: "Browse Resources",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-400",
    glow: "rgba(245,158,11,0.28)",
    border: "border-amber-500/20",
    accentBg: "bg-amber-500/10",
    emoji: "📚",
  },
  {
    title: "Hiring Companies",
    desc: "Finding skilled developers trained with real-world projects and production mindset.",
    perks: ["Vetted Talent", "Project Portfolio", "Quick Hire"],
    cta: "Post a Role",
    icon: Laptop,
    gradient: "from-pink-500 to-fuchsia-500",
    glow: "rgba(236,72,153,0.28)",
    border: "border-pink-500/20",
    accentBg: "bg-pink-500/10",
    emoji: "🏢",
  },
];

function UseCaseStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes ucFadeUp { from { opacity:0; transform:translateY(36px);} to { opacity:1; transform:translateY(0);} }
          @keyframes ucPop { from { opacity:0; transform:scale(0.85);} to { opacity:1; transform:scale(1);} }

          .uc-card { opacity:0; animation: ucFadeUp 0.5s ease-out forwards; }
          .uc-pill { opacity:0; animation: ucPop 0.4s ease-out forwards; }
        `,
      }}
    />
  );
}

function UseCaseCard({ u, i }: { u: UseCase; i: number }) {
  const Icon = u.icon;

  return (
    <div className="group relative flex flex-col">
      <div
        className={`uc-card relative flex h-full flex-col overflow-hidden rounded-3xl border ${u.border} bg-white/4 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-[7px] hover:scale-[1.02] hover:shadow-[0_16px_56px_var(--glow)]`}
        style={{ animationDelay: `${i * 0.08}s`, ["--glow" as string]: u.glow }}
      >
        {/* Top glow line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg,transparent,${u.glow},transparent)` }}
        />

        {/* Emoji + Icon row */}
        <div className="mb-5 flex items-center justify-between">
          <div
            className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${u.gradient} shadow-lg`}
            style={{ width: 52, height: 52 }}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl" aria-hidden="true">{u.emoji}</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-black text-white">{u.title}</h3>

        {/* Desc */}
        <p className="mb-5 text-sm leading-relaxed text-white/45 flex-1">{u.desc}</p>

        {/* Perks */}
        <ul className="mb-6 space-y-2" aria-label={`${u.title} benefits`}>
          {u.perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-white/55">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-white/30" />
              {p}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className={`mt-auto inline-flex w-fit items-center gap-2 rounded-full ${u.accentBg} border ${u.border} px-4 py-2 text-xs font-bold text-white/60 transition-all duration-300 hover:translate-x-[3px] group-hover:text-white/90`}
          aria-label={`${u.cta} — ${u.title}`}
        >
          {u.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Watermark icon */}
        <div
          className="pointer-events-none absolute -bottom-2 -right-2 opacity-[0.035] transition-opacity duration-300 group-hover:opacity-[0.07]"
          aria-hidden="true"
        >
          <Icon className="h-24 w-24 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function UseCases() {
  return (
    <section
      aria-label="Who is Codelura for — Use Cases"
      className="relative overflow-hidden bg-[#07060f] py-10 md:py-14 text-white"
    >
      <UseCaseStyles />

      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Who is Codelura For",
            description:
              "Codelura serves students, developers, freelancers, startup founders, self-learners and hiring companies.",
            itemListElement: USE_CASES.map((u, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: u.title,
              description: u.desc,
            })),
          }),
        }}
      />

      {/* Ambient glow — hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden sm:block">
        <div className="absolute left-1/2 top-0 h-[400px] w-[560px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-fuchsia-700/8 blur-[110px]" />
        <div className="absolute left-0 top-1/2 h-[240px] w-[240px] rounded-full bg-cyan-700/6 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="uc-card mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <Sparkles className="h-3 w-3" />
            Built for Everyone
          </span>

          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            Who Is{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Codelura
            </span>{" "}
            For?
          </h2>

          <p className="mt-4 mx-auto max-w-xl text-base text-white/40 leading-relaxed">
            From fresh graduates to startup founders — Codelura is built for
            every developer who believes in real skills, real projects and real outcomes.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3" aria-label="Use case categories">
          {USE_CASES.map((u, i) => (
            <UseCaseCard key={u.title} u={u} i={i} />
          ))}
        </div>

        {/* Bottom Tagline */}
        <div className="uc-card mt-20 flex flex-col items-center gap-5 text-center" style={{ animationDelay: "0.4s" }}>
          {/* Pill row */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Learn", "Build", "Get Hired"].map((label, i) => (
              <span
                key={label}
                className="uc-pill rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white/60 backdrop-blur"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                {label}
              </span>
            ))}
          </div>

          <p className="text-base font-semibold text-white/40">
            That&apos;s the{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent font-black">
              Codelura
            </span>{" "}
            way.
          </p>

          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-700/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-violet-700/50 active:scale-[0.97]"
            aria-label="Join Codelura platform"
          >
            Join the Platform
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}