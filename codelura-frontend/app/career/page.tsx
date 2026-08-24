// app/career/page.tsx (Server Component)
import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy } from "react";
import { Metadata } from "next";
import {
  Briefcase,
  GraduationCap,
  Users,
  Wrench,
  ArrowUpRight,
  Star,
  TrendingUp,
  Building2,
  FileText,
  Calculator,
  UserCircle,
  BookOpen,
  Award,
  Rocket,
  CheckCircle,
  Clock,
  Sparkles,
  Shield,
  Target,
} from "lucide-react";

// ─── Metadata ───
export const metadata: Metadata = {
  title: "Career Hub - Jobs, Mentorship & Career Tools | Codelura",
  description:
    "Find jobs, get mentorship, use career tools like ATS resume checker, salary calculator, and more. Start your career journey with Codelura.",
  keywords:
    "career, jobs, mentorship, resume builder, salary calculator, ATS checker, learning, placement",
  openGraph: {
    title: "Career Hub - Jobs, Mentorship & Career Tools | Codelura",
    description:
      "Find jobs, get mentorship, use career tools to accelerate your growth.",
    url: "https://codelura.com/career",
    siteName: "Codelura",
    images: [
      {
        url: "https://codelura.com/og-career.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Hub - Codelura",
    description: "Jobs, mentorship & career tools at one place",
    images: ["https://codelura.com/og-career.jpg"],
  },
};

// ─── Lazy Load Components ───
const LazyCharts = lazy(() => import("@/components/career/Charts"));

// ─── Static Data ───
const STATS = [
  { label: "Learners placed", value: "24,600+", icon: Briefcase, change: "+12%" },
  { label: "Hiring partners", value: "310+", icon: Building2, change: "+8%" },
  { label: "Avg. salary hike", value: "42%", icon: TrendingUp, change: "+5%" },
  { label: "Mentor rating", value: "4.8 / 5", icon: Star, change: "★" },
];

const TOOLS = [
  {
    title: "ATS Resume Checker",
    desc: "Get your resume past automated screening systems",
    icon: FileText,
    href: "/career/tools/ats-resume-checker",
    color: "from-blue-500 to-cyan-500",
    popular: true,
  },
  {
    title: "Resume Builder",
    desc: "Create ATS-friendly resumes in minutes",
    icon: UserCircle,
    href: "/career/tools/resume-builder",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Salary Calculator",
    desc: "Know your market worth with real data",
    icon: Calculator,
    href: "/career/tools/salary-calculator",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Mentorship",
    desc: "Connect with industry experts 1:1",
    icon: Users,
    href: "/career/mentorship/one-on-one",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Courses",
    desc: "Learn skills that recruiters actually want",
    icon: BookOpen,
    href: "/career/learning/programs",
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Jobs",
    desc: "Curated openings from top companies",
    icon: Briefcase,
    href: "/career/jobs/latest",
    color: "from-rose-500 to-pink-500",
  },
];

const PILLARS = [
  {
    title: "Jobs",
    desc: "Fresh openings, off-campus drives and alerts, updated daily",
    icon: Briefcase,
    href: "/career/jobs/latest",
    count: "1,200+",
    metric: "new openings this week",
  },
  {
    title: "Learning",
    desc: "Courses and paths mapped to what recruiters actually ask for",
    icon: GraduationCap,
    href: "/career/learning/career-tracks",
    count: "150+",
    metric: "expert-led courses",
  },
  {
    title: "Career Guidance",
    desc: "1:1 guidance, mock interviews, and resume reviews",
    icon: Users,
    href: "/career/mentorship/career-guidance",
    count: "500+",
    metric: "experienced mentors",
  },
  {
    title: "ATS checker",
    desc: "ATS checker, resume builder, salary calculator, and more",
    icon: Wrench,
    href: "/career/tools/ats-resume-checkers",
    count: "12+",
    metric: "free career tools",
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "SDE-1 at Fintech Startup",
    quote: "The mock interviews felt harder than my real one, so the real one felt easy.",
    rating: 5,
    company: "Fintech",
  },
  {
    name: "Rohit Verma",
    role: "Data Analyst",
    quote: "Went from zero interview calls to three offers in six weeks.",
    rating: 5,
    company: "Analytics",
  },
  {
    name: "Priya Nair",
    role: "Product Designer",
    quote: "The resume review alone doubled my callback rate.",
    rating: 5,
    company: "Design",
  },
];

const COMPANIES = [
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&h=50&fit=crop&crop=center&q=80",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=100&h=50&fit=crop&crop=center&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=50&fit=crop&crop=center&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=100&h=50&fit=crop&crop=center&q=80",
];

// ─── Helper Components ───

// Stats Section (Server)
function StatsSection() {
  return (
    <section className="relative border-y border-purple-500/20 bg-[#07091B] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="group flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-4 transition-all hover:border-purple-500/40 hover:bg-[#0F1334]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-950/60 text-purple-400 border border-purple-500/30 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-white tracking-tight">
                    {s.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-slate-400">
                      {s.label}
                    </p>
                    {s.change && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {s.change}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Tools Section (Server)
function ToolsSection() {
  return (
    <section className="py-20 bg-[#050714] text-white">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-bold text-purple-300">
              <Wrench size={14} />
              Free Tools
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
              Everything you need to <span className="text-purple-400">succeed</span>
            </h2>
            <p className="mt-2 text-slate-400">
              12+ tools to accelerate your career growth
            </p>
          </div>
          <Link
            href="/career/tools/ats-resume-checker"
            className="inline-flex items-center gap-1 text-sm font-bold text-purple-400 hover:text-purple-300"
          >
            View all tools
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group relative rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-6 transition-all hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/50"
              >
                {tool.popular && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-orange-400/20">
                    Popular
                  </span>
                )}
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg transition-transform group-hover:scale-105`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">
                  {tool.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-400">{tool.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Get started <ArrowUpRight size={13} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pillars Section (Server)
function PillarsSection() {
  return (
    <section className="bg-gradient-to-br from-[#0B0E28] via-[#07091B] to-[#050714] py-20 text-white border-t border-purple-500/10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-bold text-purple-300">
            <Target size={14} />
            Four Pillars
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Your complete <span className="text-purple-400">career ecosystem</span>
          </h2>
          <p className="mt-2 text-slate-400">Everything you need, all in one place</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className="group relative rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-6 transition-all hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-950/60 text-purple-300 border border-purple-500/30 transition-all group-hover:bg-purple-600 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <p className="mt-4 text-lg font-bold text-white">{p.title}</p>
                <p className="mt-1.5 text-sm text-slate-400">{p.desc}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-purple-400">
                    {p.count}
                  </span>
                  <span className="text-xs text-slate-500">{p.metric}</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Explore <ArrowUpRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section (Server)
function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#050714] text-white">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-bold text-purple-300">
            <Award size={14} />
            Success Stories
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Real learners, <span className="text-purple-400">real results</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group rounded-2xl border border-purple-500/20 bg-[#0C0F28] p-6 transition-all hover:border-purple-500/40 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-purple-500/10 pt-4">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-medium text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                    {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Companies Section (Server)
function CompaniesSection() {
  return (
    <section className="py-12 bg-[#07091B] border-y border-purple-500/10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-purple-400 mb-6">
          Trusted by hiring partners from top companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-80">
          {["Amazon", "Microsoft", "Adobe", "Flipkart", "Swiggy", "Uber", "Zomato"].map((company) => (
            <span
              key={company}
              className="rounded-xl border border-purple-500/20 bg-purple-950/30 px-5 py-2 text-xs font-bold text-slate-200"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section (Server)
function CTASection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-20 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 px-8 py-14 text-center border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/60 border border-purple-500/30 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-sm mb-4">
            <Rocket size={14} />
            Free consultation
          </div>
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            Not sure where to start?
          </h3>
          <p className="mt-2 text-purple-200 max-w-md mx-auto text-sm">
            Book a free 20-minute call with a career mentor. Get personalized guidance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:from-purple-500 hover:to-indigo-500 hover:scale-[1.02] shadow-lg shadow-purple-600/30"
            >
              Book free consultation
              <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/career/tools/ats-resume-checker"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-950/60 border border-purple-500/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-purple-900/60"
            >
              Explore tools
              <Wrench size={16} />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-purple-300">
            <span className="flex items-center gap-1">
              <CheckCircle size={14} />
              No credit card
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              20 min session
            </span>
            <span className="flex items-center gap-1">
              <Shield size={14} />
              100% free
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE (Server Component) ───
export default function CareerHomePage() {
  return (
    <div className="min-h-screen bg-[#040612] text-white">
      {/* ─── Hero Section ─── */}
      <HeroSection />

      {/* ─── Stats ─── */}
      <StatsSection />

      {/* ─── Charts (Lazy Loaded) ─── */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-[#0C0F28] rounded-2xl mx-4 lg:mx-8 border border-purple-500/20" />}>
        <LazyCharts />
      </Suspense>

      {/* ─── Tools ─── */}
      <ToolsSection />

      {/* ─── Pillars ─── */}
      <PillarsSection />

      {/* ─── Testimonials ─── */}
      <TestimonialsSection />

      {/* ─── Companies ─── */}
      <CompaniesSection />

      {/* ─── CTA ─── */}
      <CTASection />
    </div>
  );
}

// ─── Hero Section MATCHING DESIGN MOCKUP ───
function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-purple-500/20 bg-gradient-to-b from-[#0B0E28] via-[#07091B] to-[#040612] px-4 py-10 lg:px-8 lg:py-14">
      {/* Ambient Glow Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Hero Content (6 Cols) */}
          <div className="space-y-6 lg:col-span-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/40 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-purple-300 backdrop-blur-md shadow-lg shadow-purple-950/50">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              🚀 ACCELERATED CAREER HUB
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-[3.4rem] tracking-tight">
              Master Production <br />
              Tech &amp; Land{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Your
              </span>{" "}
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-slate-300 md:text-base max-w-xl leading-relaxed">
              Jobs, learning paths, mentors, and tools — all in one place, so every step actually moves you toward an offer.
            </p>

            {/* 3 Feature Highlights Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400 font-mono font-bold text-xs">
                  &lt;/&gt;
                </span>
                <span>Real-world Projects</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300 text-xs">
                  👥
                </span>
                <span>1:1 Expert Mentorship</span>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-purple-500/20 bg-purple-950/30 px-3.5 py-2 text-xs font-semibold text-slate-200">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 text-xs">
                  💼
                </span>
                <span>Placement Support</span>
              </div>
            </div>

            {/* Stats Bar Row */}
            <div className="grid grid-cols-3 gap-4 border-t border-purple-500/20 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-lg">
                  👤
                </div>
                <div>
                  <div className="text-xl font-black text-white md:text-2xl">
                    24,600+
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Learners Placed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-lg">
                  ⭐
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-400 md:text-2xl">
                    4.8 / 5
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Mentor Rating
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-lg">
                  💼
                </div>
                <div>
                  <div className="text-xl font-black text-amber-400 md:text-2xl">
                    310+
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    Hiring Partners
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/career/jobs/latest"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-purple-600/40 hover:brightness-110 transition active:scale-95 whitespace-nowrap"
              >
                Explore Jobs →
              </Link>
              <Link
                href="/career/mentorship/one-on-one"
                className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/40 px-6 py-3.5 text-xs font-bold text-slate-200 backdrop-blur-md transition hover:bg-purple-900/50"
              >
                Talk to a Mentor 👥
              </Link>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {[
                {
                  name: "Full Stack Development",
                  icon: "💻",
                  border:
                    "border-blue-500/40 bg-blue-950/20 text-blue-300 hover:border-blue-400",
                },
                {
                  name: "AI & Machine Learning",
                  icon: "🧠",
                  border:
                    "border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-400",
                },
                {
                  name: "DevOps & Cloud",
                  icon: "☁️",
                  border:
                    "border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:border-emerald-400",
                },
                {
                  name: "Cybersecurity",
                  icon: "🛡️",
                  border:
                    "border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-400",
                },
                {
                  name: "Mobile Development",
                  icon: "📱",
                  border:
                    "border-amber-500/40 bg-amber-950/20 text-amber-300 hover:border-amber-400",
                },
                {
                  name: "Data Science",
                  icon: "📊",
                  border:
                    "border-yellow-500/40 bg-yellow-950/20 text-yellow-300 hover:border-yellow-400",
                },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/career/learning/career-tracks?search=${encodeURIComponent(cat.name)}`}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:scale-105 ${cat.border}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Hero Image Showcase (6 Cols - Larger & More Attractive) */}
          <div className="relative flex items-center justify-center lg:col-span-6">
            <div className="relative w-full">
              {/* Glow ring behind the image */}
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-purple-600/30 via-indigo-500/20 to-pink-500/20 blur-2xl" />

              {/* Gradient border frame */}
              <div className="relative rounded-[2rem] bg-gradient-to-br from-purple-500/60 via-indigo-400/40 to-pink-500/60 p-[2px] shadow-2xl shadow-purple-900/80">
                <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-[#07091B]">
                  <img
                    src="https://res.cloudinary.com/dbezxtffm/image/upload/v1786802957/ChatGPT_Image_Aug_15_2026_07_38_52_PM_janrnt.png"
                    alt="Codelura Career Showcase"
                    className="w-full h-auto max-h-[720px] object-cover transition duration-500 hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040612]/30 via-transparent to-purple-500/10" />
                </div>
              </div>

              {/* Floating accent badge */}
              <div className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-2xl border border-emerald-400/40 bg-[#07091B]/90 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-xl shadow-emerald-900/40 backdrop-blur-md sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}