// app/services/page.tsx (Server Component)

import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";
import Stats from "@/components/services/Stats";
import Services from "@/components/services/Services";
import Industries from "@/components/services/Industries";
import HeroBackground from "@/components/services/HeroBackground";
import { ArrowRight, Search, Settings2, Code2, Rocket } from "lucide-react";



export const metadata: Metadata = {
  title: "Services | Codelura - Websites, AI Bots & GBP Audit Services",
  description:
    "Explore Codelura's premium digital engineering services: High-speed Next.js websites, custom LLM AI bots, and Google Business Profile (GBP) 3-Pack local SEO audits.",
  keywords:
    "website development, AI bot development, Google Business Profile audit, GBP local SEO, Next.js web apps, AI automation, Codelura",
};

const processSteps = [
  {
    num: "01",
    icon: Search,
    title: "Discovery",
    badge: "Day 1–2",
    description: "Deep-dive into your business DNA. Audit digital presence, funnel leaks, speed benchmarks and local search footprint.",
    grad: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.45)",
    active: false,
  },
  {
    num: "02",
    icon: Settings2,
    title: "Strategy",
    badge: "Day 3–7",
    description: "Architect a custom roadmap — UI/UX prototypes, AI bot flows and local SEO schema blueprints.",
    grad: "from-cyan-400 to-blue-600",
    glow: "rgba(6,182,212,0.55)",
    active: true,
  },
  {
    num: "03",
    icon: Code2,
    title: "Execution",
    badge: "Sprint Phase",
    description: "Rapid deployment of zero-bloat code with 99+ Core Web Vitals, RAG bot training and GBP citation verification.",
    grad: "from-fuchsia-500 to-pink-700",
    glow: "rgba(217,70,239,0.45)",
    active: false,
  },
  {
    num: "04",
    icon: Rocket,
    title: "Optimization",
    badge: "Go-Live",
    description: "Seamless production launch, Google Maps 3-Pack rank tracking, and 24/7 automated lead capturing.",
    grad: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.45)",
    active: false,
  },
];



function ProcessSection() {
  return (
    <section className="relative overflow-hidden bg-[#04040a] py-12 sm:py-16 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-80 w-[800px] rounded-full bg-indigo-950/25 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-5">
            Execution Roadmap
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Our{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Strategic Process
            </span>
          </h2>
          <p className="mt-4 text-slate-500 text-sm">
            Every milestone itemized, tracked and delivered on time. No surprises.
          </p>
        </div>

        {/* ── Cards row ── */}
        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="group relative flex flex-col items-center text-center rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: step.active
                    ? "linear-gradient(135deg, #0d0d1a 0%, #0a0a16 100%)"
                    : "#07070d",
                  border: step.active
                    ? "1px solid rgba(99,102,241,0.35)"
                    : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: step.active
                    ? `0 0 60px ${step.glow}, 0 0 20px ${step.glow}`
                    : "none",
                }}
              >
                {/* ── Glowing icon circle ── */}
                <div className="relative mb-7">
                  {/* Outer glow ring */}
                  <div
                    className="absolute inset-0 rounded-full blur-lg transition-all duration-300 group-hover:blur-xl"
                    style={{
                      background: `radial-gradient(circle, ${step.glow} 0%, transparent 70%)`,
                      transform: "scale(1.5)",
                    }}
                  />
                  {/* Gradient border circle */}
                  <div
                    className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${step.grad} p-[2px]`}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full"
                      style={{ background: step.active ? "#0d0d1f" : "#080810" }}
                    >
                      <Icon
                        className="w-8 h-8 transition-all duration-300 group-hover:scale-110"
                        style={{
                          color: step.active ? "white" : "rgba(255,255,255,0.55)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Connector line — desktop only (shown between cards via pseudo positioning) */}
                {idx < processSteps.length - 1 && (
                  <div
                    className="pointer-events-none hidden lg:block absolute top-[5.5rem] left-[calc(100%-4px)] w-5 z-20"
                    style={{ height: "2px" }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        background: `linear-gradient(90deg, ${step.glow}, rgba(255,255,255,0.05))`,
                      }}
                    />
                  </div>
                )}

                {/* Step label */}
                <p className="text-[11px] font-mono tracking-widest text-slate-600 mb-2 uppercase">
                  {step.num}.
                </p>

                {/* Title */}
                <h3
                  className="text-lg font-extrabold mb-3 transition-colors duration-300"
                  style={{ color: step.active ? "white" : "rgba(255,255,255,0.75)" }}
                >
                  {step.title}
                </h3>

                {/* Divider */}
                <div
                  className={`h-px w-10 rounded-full bg-gradient-to-r ${step.grad} mb-4 transition-all duration-300 group-hover:w-16`}
                />

                {/* Description */}
                <p className="text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed transition-colors">
                  {step.description}
                </p>

                {/* Badge */}
                <span
                  className={`mt-5 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors`}
                  style={{
                    background: step.active ? `${step.glow}` : "rgba(255,255,255,0.04)",
                    color: step.active ? "white" : "rgba(255,255,255,0.3)",
                    border: step.active ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {step.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#050714] py-20 sm:py-28 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          Ready to Start Your Project?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Book a free discovery call. Get a custom demo and technical proposal in 24 hours.
        </p>

        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
          <Link
            href="/services/Enquiries?service=Custom%20Software"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-600/30 transition-transform hover:scale-105"
          >
            <span>Start Your Project</span>
            <ArrowRight size={17} />
          </Link>
          <Link
            href="https://wa.me/919336289192"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-slate-800"
          >
            <span>Chat on WhatsApp</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomePageSkeleton() {
  return (
    <main className="bg-[#050714] min-h-screen text-white animate-pulse">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="h-8 w-48 bg-purple-950 rounded-full" />
        <div className="mt-6 h-16 w-3/4 bg-purple-950 rounded-2xl" />
      </div>
    </main>
  );
}

export default async function ServicesPage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <main className="bg-[#050714] min-h-screen text-white">
        {/* ============ HERO — MINIMAL LIKE EEG TECHNOGEEKS ============ */}
        <HeroSection />

        {/* ============ SERVICES CARDS (DARK MINIMAL LIKE CODEKOSHA) ============ */}
        <div id="services">
          <Services />
        </div>

        {/* ============ INDUSTRIES ============ */}
        <Industries />

        {/* ============ PROCESS ============ */}
        <ProcessSection />

        {/* ============ STATS ============ */}
        <Stats />

        {/* ============ CTA ============ */}
        <CTASection />
      </main>
    </Suspense>
  );
}

// ─── HERO SECTION — MINIMAL / CLEAN ───
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* ── Premium Aurora Background ── */}
      <HeroBackground />

      {/* ── Content ── */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-8">
          <span className="text-white">Intelligence</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Drives Results.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
          Websites. AI Bots. Google Dominance.
        </p>

        <Link
          href="#services"
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-transparent px-8 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-purple-600/20 hover:border-purple-400"
        >
          Explore Services
        </Link>
      </div>
    </section>
  );
}
