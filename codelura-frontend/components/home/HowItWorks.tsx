import { BookOpen, Lock, Users, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";
/* ────────────────────────────────────────────────────────────
   PURE SERVER COMPONENT. No "use client", no hooks, no
   framer-motion, no JS shipped to the browser at all.

   What changed vs the original:
   - useInView (scroll-triggered fade-in) → CSS animation that
     plays once on load with a per-card stagger delay. Can't
     detect scroll position without JS, so this is the
     necessary trade-off for zero-JS.
   - onMouseEnter/onMouseLeave inline box-shadow → CSS custom
     property (--glow) + Tailwind's hover: + arbitrary shadow
     value. Same visual glow-on-hover, browser-native, no
     re-render on every mouse event.
   - whileHover icon wiggle → CSS keyframe triggered by
     group-hover.
   - Connector line growth → CSS keyframe with animation-delay
     instead of useInView + scaleX motion value.
   ──────────────────────────────────────────────────────────── */

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

function StepStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes stepFadeUp { from { opacity:0; transform:translateY(40px);} to { opacity:1; transform:translateY(0);} }
          @keyframes growLine { from { transform:scaleX(0);} to { transform:scaleX(1);} }
          @keyframes wiggle { 0%,100% { transform:rotate(0deg);} 25% { transform:rotate(-8deg);} 75% { transform:rotate(8deg);} }

          .step-card { opacity:0; animation: stepFadeUp 0.55s ease-out forwards; }
          .step-connector { transform: scaleX(0); transform-origin:left; animation: growLine 0.7s ease-out forwards; }
          .step-card:hover .step-icon { animation: wiggle 0.5s ease-in-out; }
        `,
      }}
    />
  );
}

function StepCard({ s, i, total }: { s: Step; i: number; total: number }) {
  const Icon = s.icon;

  return (
    <div className="group relative flex flex-col">
      {/* Connector line (desktop) */}
      {i < total - 1 && (
        <div
          className="step-connector absolute top-[52px] hidden h-px bg-gradient-to-r from-white/15 to-transparent md:block"
          style={{
            left: "calc(50% + 30px)",
            width: "calc(100% - 60px)",
            animationDelay: `${i * 0.13 + 0.4}s`,
          }}
        />
      )}

      {/* Card */}
      <div
        className={`step-card relative h-full overflow-hidden rounded-3xl border ${s.border} bg-white/4 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_8px_40px_var(--glow)]`}
        style={{ animationDelay: `${i * 0.13}s`, ["--glow" as string]: s.glow }}
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
        <div className={`step-icon mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>

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
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      aria-label="How Codelura Works"
      className="relative overflow-hidden bg-[#06050f] py-10 md:py-14"
    >
      <StepStyles />

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

      {/* Ambient glow — hidden on mobile, blur is expensive to paint on low-power GPUs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden sm:block">
        <div className="absolute left-1/2 top-0 h-[400px] w-[560px] -translate-x-1/2 rounded-full bg-violet-600/12 blur-[110px]" />
        <div className="absolute right-0 bottom-0 h-[280px] w-[280px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="step-card mb-20 text-center">
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
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <StepCard key={s.step} s={s} i={i} total={STEPS.length} />
          ))}
        </div>

        {/* CTA Row */}
        <div
          className="step-card mt-16 flex flex-col items-center gap-4 text-center"
          style={{ animationDelay: "0.6s" }}
        >
          <p className="text-sm text-white/35">
            Join <span className="text-white/70 font-semibold">10,000+</span> developers already on the platform
          </p>
         <Link
  href="https://career.codelura.com/"
  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-700/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-violet-700/50 active:scale-[0.97]"
  aria-label="Start your journey on Codelura"
>
  Start Your Journey
  <ArrowRight className="h-4 w-4" />
</Link>
        </div>
      </div>
    </section>
  );
}