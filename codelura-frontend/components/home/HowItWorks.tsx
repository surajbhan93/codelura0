"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Lock, Users, Rocket, ArrowRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface Step {
  step: string;
  title: string;
  desc: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  border: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const STEPS: Step[] = [
  {
    step: "01",
    title: "Explore Content",
    desc: "Read high-quality blogs, guides & learning material crafted by real developers.",
    detail: "DSA, System Design, AI/ML & more",
    icon: BookOpen,
    gradient: "from-violet-500 to-indigo-500",
    glow: "rgba(139,92,246,0.35)",
    border: "border-violet-500/25",
  },
  {
    step: "02",
    title: "Upgrade Access",
    desc: "Unlock premium resources, advanced courses and exclusive developer tools.",
    detail: "500+ resources, zero ads",
    icon: Lock,
    gradient: "from-fuchsia-500 to-pink-500",
    glow: "rgba(217,70,239,0.35)",
    border: "border-fuchsia-500/25",
  },
  {
    step: "03",
    title: "Get Mentored",
    desc: "Book 1-on-1 guidance sessions with vetted senior developers and experts.",
    detail: "Resume, interview & career clarity",
    icon: Users,
    gradient: "from-emerald-500 to-cyan-500",
    glow: "rgba(16,185,129,0.35)",
    border: "border-emerald-500/25",
  },
  {
    step: "04",
    title: "Build & Earn",
    desc: "Launch projects, monetise your skills or hire us to grow your business.",
    detail: "Websites, SaaS & beyond",
    icon: Rocket,
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.35)",
    border: "border-amber-500/25",
  },
];

/* ─── Step Card ──────────────────────────────────────────────── */
function StepCard({ s, i, total }: { s: Step; i: number; total: number }) {
  const Icon = s.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.13 }}
      className="group relative flex flex-col"
    >
      {/* Connector line (desktop) */}
      {i < total - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: i * 0.13 + 0.4 }}
          className="absolute right-0 top-[52px] hidden h-px w-[calc(100%-60px)] origin-left bg-gradient-to-r from-white/15 to-transparent md:block"
          style={{ left: "calc(50% + 30px)", right: "unset", width: "calc(100% - 60px)" }}
        />
      )}

      {/* Card */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className={`relative h-full overflow-hidden rounded-3xl border ${s.border} bg-white/4 p-7 backdrop-blur-xl`}
        style={{ boxShadow: `0 0 0px ${s.glow}` }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${s.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0px ${s.glow}`;
        }}
      >
        {/* Top glow on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${s.glow}, transparent)` }}
        />

        {/* Step badge */}
        <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${s.gradient} px-3 py-1`}>
          <span className="text-xs font-black text-white tracking-widest">STEP {s.step}</span>
        </div>

        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 0.5 }}
          className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>

        {/* Text */}
        <h3 className="mb-2 text-lg font-black text-white">{s.title}</h3>
        <p className="text-sm leading-relaxed text-white/45">{s.desc}</p>

        {/* Detail chip */}
        <div className={`mt-5 inline-flex items-center gap-1.5 rounded-full border ${s.border} bg-white/4 px-3 py-1.5 text-xs font-medium text-white/50`}>
          <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${s.gradient}`} />
          {s.detail}
        </div>

        {/* Bottom number watermark */}
        <span
          className="pointer-events-none absolute -bottom-4 -right-2 select-none text-[80px] font-black leading-none text-white/4"
          aria-hidden="true"
        >
          {s.step}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function HowItWorks() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      aria-label="How Codelura Works"
      className="relative overflow-hidden bg-[#06050f] py-10 md:py-14"
    >
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Get Started with Codelura",
            description:
              "A simple 4-step process to learn, grow and build your developer career with Codelura.",
            step: STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.desc,
            })),
          }),
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/12 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Simple 4-Step Process
          </span>

          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            How{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Codelura
            </span>{" "}
            Works
          </h2>

          <p className="mt-4 mx-auto max-w-xl text-base text-white/40 leading-relaxed">
            A structured, powerful journey to learn, build and grow — from
            your first blog post to landing your dream role.
          </p>
        </motion.div>

        {/* ── Steps Grid ── */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <StepCard key={s.step} s={s} i={i} total={STEPS.length} />
          ))}
        </div>

        {/* ── CTA Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-white/35">
            Join <span className="text-white/70 font-semibold">25,000+</span> developers already on the platform
          </p>
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-700/30 transition-all duration-300 hover:shadow-violet-700/50"
            aria-label="Start your journey on Codelura"
          >
            Start Your Journey
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}