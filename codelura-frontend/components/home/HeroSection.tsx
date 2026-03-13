"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
// import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Code2,
  Rocket,
  BarChart3,
  Terminal,
  GraduationCap,
  Play,
  BookOpen,
  Trophy,
  Briefcase,
  Brain,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

/* ─── SEO Meta ──────────────────────────────────────────────── */
function SEOMeta() {
  return (
    <Head>
      {/* Primary */}
      <title>Codelura – AI Developer Platform | Software, Mentorship & Career Growth</title>
      <meta
        name="description"
        content="Codelura is your all-in-one AI-powered developer platform. Access software notes, hackathons, career guidance, mentorship, SaaS tools, and professional portfolio websites — all in one ecosystem."
      />
      <meta
        name="keywords"
        content="AI developer platform, software notes, hackathon, career guidance, mentorship, SaaS tools, coding platform, learn programming, developer ecosystem"
      />
      <link rel="canonical" href="https://codelura.com/" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://codelura.com/" />
      <meta property="og:title" content="Codelura – AI Developer Platform" />
      <meta
        property="og:description"
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship & more."
      />
      <meta property="og:image" content="https://codelura.com/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Codelura – AI Developer Platform" />
      <meta
        name="twitter:description"
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship & more."
      />
      <meta name="twitter:image" content="https://codelura.com/og-image.png" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Codelura",
            applicationCategory: "DeveloperApplication",
            description:
              "AI-powered developer platform offering software notes, hackathons, career guidance, mentorship and SaaS tools.",
            url: "https://codelura.com",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </Head>
  );
}

/* ─── Typing Animation ───────────────────────────────────────── */
const WORDS = ["Scale You", "Build Faster", "Ship Better", "Grow Smarter"];

function TypingText() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const current = WORDS[wordIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => {
        setText((prev) => prev + current[charIdx]);
        setCharIdx(charIdx + 1);
      }, 85);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setText("");
      setCharIdx(0);
      setWordIdx((wordIdx + 1) % WORDS.length);
    }, 1600);
    return () => clearTimeout(t);
  }, [charIdx, wordIdx]);

  return (
    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
      {text}
      <span className="animate-pulse text-violet-400">|</span>
    </span>
  );
}

/* ─── Magnetic Button Wrapper ────────────────────────────────── */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.28);
        y.set((e.clientY - r.top - r.height / 2) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      transition={{ type: "spring", stiffness: 130, damping: 12 }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating Service Card ──────────────────────────────────── */
interface FloatingCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  className: string;
  delay?: number;
}

function FloatingCard({ icon: Icon, title, className, delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
      transition={{
        opacity: { delay, duration: 0.4 },
        scale: { delay, duration: 0.4 },
        y: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute z-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl backdrop-blur-2xl ${className}`}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <Icon className="h-3.5 w-3.5 text-white" />
        </span>
        {title}
      </div>
    </motion.div>
  );
}

/* ─── Services Grid ──────────────────────────────────────────── */
const SERVICES = [
  {
    icon: BookOpen,
    label: "Software Notes",
    desc: "Curated, AI-enhanced study material",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Trophy,
    label: "Hackathons",
    desc: "Compete, collaborate & win prizes",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Briefcase,
    label: "Career Guidance",
    desc: "Roadmaps, resume & interview prep",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: GraduationCap,
    label: "Mentorship",
    desc: "1-on-1 with industry experts",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Code2,
    label: "SaaS Tools",
    desc: "Developer-grade productivity tools",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Brain,
    label: "AI Services",
    desc: "Smart automation & AI integrations",
    color: "from-indigo-500 to-blue-500",
  },
];

function ServicesBar() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SERVICES.map(({ icon: Icon, label, desc, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          whileHover={{ scale: 1.04, y: -3 }}
          className="group flex items-start gap-3 rounded-2xl border border-white/8 bg-white/4 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/8 cursor-pointer"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white/90 leading-tight">{label}</p>
            <p className="mt-0.5 text-[11px] text-white/45 leading-tight">{desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Stats Row ──────────────────────────────────────────────── */
const STATS = [
  { value: "50K+", label: "Developers" },
  { value: "200+", label: "AI Tools" },
  { value: "98%", label: "Satisfaction" },
];

/* ─── Hero ───────────────────────────────────────────────────── */
export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <SEOMeta />

     <section
  aria-label="Hero – AI Developer Platform"
  className="relative min-h-[60vh] md:min-h-[75vh] overflow-hidden bg-[#06050f]"
>
        {/* ── Ambient Glow ── */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-[15%] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[160px]" />
          <div className="absolute right-[5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[140px]" />
          <div className="absolute bottom-[10%] left-[40%] h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[130px]" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-4 lg:py-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* ── LEFT ── */}
            <div className="text-center lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 backdrop-blur"
              >
                <Zap className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
                <span>AI-Powered Developer Ecosystem</span>
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              </motion.div>

              {/* Headline — H1 for SEO */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-[3.8rem] xl:text-[4.2rem]"
              >
                Your AI Platform
                <span className="block mt-1">
                  Built to <TypingText />
                </span>
              </motion.h1>

              {/* Sub-headline — SEO rich description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 max-w-lg text-lg leading-relaxed text-white/55 lg:mx-0"
              >
                One platform. Infinite possibilities. Software notes, hackathons,
                AI tools, career guidance, expert mentorship &amp; SaaS services —
                everything a modern developer needs to grow.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-9 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Magnetic>
                  <Link href="/pricing" aria-label="Get started with Codelura">
                    <Button className="group h-13 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-semibold text-white shadow-xl shadow-violet-700/40 hover:shadow-violet-700/60 transition-all duration-300 hover:scale-[1.03]">
                      <Rocket className="mr-2 h-4 w-4 transition-transform group-hover:-rotate-12" />
                      Get Started Free
                      <ChevronRight className="ml-1 h-4 w-4 opacity-70" />
                    </Button>
                  </Link>
                </Magnetic>

                <Magnetic>
                  <Button
                    variant="outline"
                    onClick={() => setOpen(true)}
                    aria-label="Watch Codelura demo video"
                    className="h-13 rounded-full border-white/15 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <Play className="mr-2 h-4 w-4 fill-white/80" />
                    Watch Demo
                  </Button>
                </Magnetic>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex justify-center gap-8 lg:justify-start"
              >
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-xs text-white/40 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Services */}
              <ServicesBar />
            </div>

            {/* ── RIGHT (Dashboard Visual) ── */}
            <motion.div
              style={{ y: imageY }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="relative hidden lg:block"
            >
              {/* Main card */}
              <motion.div
                whileHover={{ scale: 1.015 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl"
              >
                {/* Simulated Dashboard UI (replace with real Image when available) */}
                <div className="h-[380px] w-full rounded-2xl bg-gradient-to-br from-[#0f0d1f] to-[#1a1040] p-5 overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    <div className="ml-4 flex-1 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/30">
                      codelura.com/dashboard
                    </div>
                  </div>

                  {/* Dashboard content simulation */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {["AI Tools", "Hackathons", "Mentors"].map((t, i) => (
                      <div
                        key={t}
                        className="rounded-xl bg-white/5 p-3 border border-white/5"
                      >
                        <div
                          className={`h-1.5 w-8 rounded-full mb-2 ${
                            ["bg-violet-400", "bg-fuchsia-400", "bg-cyan-400"][i]
                          }`}
                        />
                        <p className="text-[10px] text-white/50">{t}</p>
                        <p className="text-lg font-bold text-white">
                          {["200+", "48", "120+"][i]}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Activity chart simulation */}
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-3">
                    <p className="text-[10px] text-white/40 mb-3">Learning Activity</p>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-600 to-fuchsia-400 opacity-70"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent courses */}
                  <div className="space-y-2">
                    {["React Advanced Patterns", "System Design for Devs"].map((c) => (
                      <div
                        key={c}
                        className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 border border-white/5"
                      >
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                        <p className="text-[11px] text-white/60">{c}</p>
                        <div className="ml-auto h-1.5 w-12 rounded-full bg-white/10">
                          <div className="h-full w-3/4 rounded-full bg-violet-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code snippet overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-10 left-4 hidden w-[220px] rounded-xl border border-white/10 bg-black/70 p-4 text-xs text-emerald-400 backdrop-blur xl:block"
                >
                  <pre className="leading-relaxed">{`const ai = new Codelura({
              services: ["notes","mentor",
                "hackathon","career"],
              mode: "turbo" 🚀
            })`}</pre>
                            </motion.div>
              </motion.div>

              {/* Floating Cards */}
              <FloatingCard
                icon={BarChart3}
                title="Live Analytics"
                className="-top-5 left-6"
                delay={0.8}
              />
              <FloatingCard
                icon={Terminal}
                title="Code Playground"
                className="top-1/3 -right-6"
                delay={1.0}
              />
              <FloatingCard
                icon={Trophy}
                title="Win Hackathons"
                className="-bottom-5 right-10"
                delay={1.2}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Video Modal ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="modal-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
            >
              <motion.div
                key="modal-box"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-[92%] max-w-3xl rounded-2xl border border-white/10 bg-[#0d0c1a] p-4 shadow-2xl"
              >
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close video modal"
                  className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition"
                >
                  <X className="h-4 w-4" />
                </button>
                <iframe
                  className="h-[320px] w-full rounded-xl md:h-[420px]"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Codelura Platform Demo"
                  allowFullScreen
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}