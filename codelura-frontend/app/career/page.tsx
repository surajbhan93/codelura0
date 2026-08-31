// app/career/page.tsx (Server Component)
import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy } from "react";
import { Metadata } from "next";
import StarryBackground from "@/components/career/StarryBackground";
import StatsSection from "@/components/career/StatsSection";
import {
  Briefcase,


  GraduationCap,
  Users,
  Wrench,
  ArrowUpRight,
  ArrowRight,
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


const TOOLS = [
  {
    index: "01",
    category: "FREE TOOL",
    title: "ATS Resume Checker",
    desc: "Instantly score your resume against automated ATS filters. Fix keywords and formatting to double your interview callbacks.",
    icon: FileText,
    href: "/career/tools/ats-resume-checker",
    cta: "Verify Score →",
    backBg: "bg-gradient-to-br from-[#1e1b4b] via-[#0f0e26] to-[#040612] border-indigo-500/40",
    textGrad: "from-indigo-400 to-cyan-300",
    badgeColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
  },
  {
    index: "02",
    category: "CREATOR",
    title: "Resume Builder",
    desc: "Create single-page, ATS-friendly Markdown resumes. Pre-loaded with action-verb bullet points approved by senior recruiters.",
    icon: UserCircle,
    href: "/career/tools/resume-builder",
    cta: "Build Resume →",
    backBg: "bg-gradient-to-br from-[#3b0764] via-[#1b0a2a] to-[#040612] border-purple-500/40",
    textGrad: "from-purple-400 to-pink-300",
    badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10"
  },
  {
    index: "03",
    category: "ANALYTICS",
    title: "Salary Calculator",
    desc: "Analyze stock options, cash components, and cost-of-living metrics to negotiate the package you truly deserve.",
    icon: Calculator,
    href: "/career/tools/salary-calculator",
    cta: "Calculate Hike →",
    backBg: "bg-gradient-to-br from-[#022c22] via-[#021f18] to-[#040612] border-emerald-500/40",
    textGrad: "from-emerald-400 to-teal-300",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  },
  {
    index: "04",
    category: "GUIDANCE",
    title: "1:1 Mentorship",
    desc: "Book live mock calls with SDE leaders from Amazon, Meta, and Google for real DSA and system design feedback.",
    icon: Users,
    href: "/career/mentorship/one-on-one",
    cta: "Book Free Call →",
    backBg: "bg-gradient-to-br from-[#451a03] via-[#240e02] to-[#040612] border-amber-500/40",
    textGrad: "from-amber-400 to-orange-300",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10"
  },
  {
    index: "05",
    category: "PLACEMENT",
    title: "Job Hub",
    desc: "Fresh off-campus drives, direct corporate referrals, and hiring alerts updated daily by our placement team.",
    icon: Briefcase,
    href: "/career/jobs/latest",
    cta: "Explore Openings →",
    backBg: "bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#040612] border-blue-500/40",
    textGrad: "from-blue-400 to-indigo-300",
    badgeColor: "text-blue-400 border-blue-500/30 bg-blue-500/10"
  },
  {
    index: "06",
    category: "CURRICULUM",
    title: "Career Tracks",
    desc: "Placement-focused learning paths mapped to tech recruiter requests. Build real-world capstone projects live.",
    icon: GraduationCap,
    href: "/career/learning/career-tracks",
    cta: "Start Roadmap →",
    backBg: "bg-gradient-to-br from-[#4c0519] via-[#1f030a] to-[#040612] border-rose-500/40",
    textGrad: "from-rose-400 to-pink-300",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10"
  },
  {
    index: "07",
    category: "RESOURCES",
    title: "Study Notes",
    desc: "Ditch boring lectures. Access hand-written DSA sheets, System Design visual blueprints, and interview cheat codes.",
    icon: BookOpen,
    href: "https://career.codelura.com/career/learning/study-material",
    cta: "Get Notes →",
    external: true,
    backBg: "bg-gradient-to-br from-[#083344] via-[#041a24] to-[#040612] border-cyan-500/40",
    textGrad: "from-cyan-400 to-teal-300",
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
  },
  {
    index: "08",
    category: "ACADEMY",
    title: "Premium Batches",
    desc: "Guaranteed 1:1 mentorship calls, mock interviews, and dedicated career coach support for placements.",
    icon: Rocket,
    href: "/career/learning/programs",
    cta: "Join Cohort →",
    backBg: "bg-gradient-to-br from-[#831843] via-[#380b1d] to-[#040612] border-pink-500/40",
    textGrad: "from-pink-400 to-purple-300",
    badgeColor: "text-pink-400 border-pink-500/30 bg-pink-500/10"
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




// Tools Section (Server)
function ToolsSection() {
  return (
    <section className="py-24 bg-[#040612] text-white border-t border-white/5 relative overflow-hidden">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[150px]" />

      <div className="mx-auto max-w-[1536px] px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* LEFT SIDE TEXT & STATS (4 Cols - Fusion Ventures Style) */}
          <div className="lg:col-span-4 space-y-8 sticky top-28">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400">
                OUR ECOSYSTEM
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.15] tracking-tight text-white">
                Tools &amp; Programs <br />
                built for your <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">growth.</span>
              </h2>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md font-medium">
              We build category-defining career tools, ATS checkers, placement roadmaps, and study notes to launch your tech career into top-tier companies.
            </p>

            <div>
              <Link
                href="/career/tools/ats-resume-checker"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest"
              >
                <span>Explore all resources</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Bottom Indicators Row */}
            <div className="pt-8 border-t border-white/10 flex items-center gap-10">
              <div>
                <div className="text-3xl font-black text-amber-400 font-mono">08</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  TOOLS &amp; TRACKS
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div>
                <div className="text-3xl font-black font-mono text-amber-400">04</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  CORE CATEGORIES
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FLIP CARDS GRID (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.title}
                    className="group w-full h-[370px] [perspective:1000px] cursor-pointer"
                  >
                    {/* 3D Flip Card Inner Container */}
                    <div 
                      className="relative w-full h-full duration-700 transition-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                    >
                      {/* FRONT SIDE (Sleek Dark Frame with Centered Light Box) */}
                      <div 
                        className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-[#07091b] backdrop-blur-md [backface-visibility:hidden] shadow-xl group-hover:border-amber-400/40 transition-colors duration-300"
                      >
                        {/* Index Top Left */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-amber-400/80">
                            {tool.index}
                          </span>
                        </div>

                        {/* Centered White Graphic Box */}
                        <div className="flex-1 flex items-center justify-center py-4">
                          <div className="flex h-24 w-40 items-center justify-center rounded-2xl bg-white border border-white/10 shadow-xl shadow-black/30 transition-transform duration-300 group-hover:scale-105">
                            <Icon className="h-10 w-10 text-slate-900" />
                          </div>
                        </div>

                        {/* Bottom Category */}
                        <div className="text-center pt-2 border-t border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      {/* BACK SIDE (Vibrant Colored Theme on Flip) */}
                      <div 
                        className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 rounded-2xl border shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${tool.backBg}`}
                      >
                        <div>
                          {/* Top Label Badge */}
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                              {tool.category}
                            </span>
                            <span className="text-xs font-bold font-mono text-white/50">
                              {tool.index}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="mt-4 text-xl font-extrabold text-white leading-tight">
                            {tool.title}
                          </h3>

                          {/* Description */}
                          <p className="mt-3 text-xs text-slate-300 leading-relaxed font-medium">
                            {tool.desc}
                          </p>
                        </div>

                        {/* Bottom Action CTA */}
                        <div className="pt-4 border-t border-white/10">
                          {tool.external ? (
                            <a
                              href={tool.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 text-xs font-extrabold transition-transform group-hover:translate-x-1 bg-gradient-to-r ${tool.textGrad} bg-clip-text text-transparent`}
                            >
                              <span>{tool.cta}</span>
                            </a>
                          ) : (
                            <Link
                              href={tool.href}
                              className={`inline-flex items-center gap-2 text-xs font-extrabold transition-transform group-hover:translate-x-1 bg-gradient-to-r ${tool.textGrad} bg-clip-text text-transparent`}
                            >
                              <span>{tool.cta}</span>
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

// ─── Hero Section WITH STARRY SKY BACKGROUND & PREMIUM CENTERED LAYOUT ───
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-4 py-16 sm:py-24">
      {/* Starry sky canvas animation */}
      <StarryBackground />

      {/* Soft dark vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(4,6,18,0.85)_90%)]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Subtle Label */}
        <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-purple-400 mb-2">
          Codelura Academy
        </span>

        {/* Minimal Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white tracking-tight">
          Skills. Placement. / <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
            Land Your Offer.
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
          Courses. Job Alerts. Mentor Support.
        </p>

        {/* Single Call To Action */}
        <div className="flex justify-center pt-4">
          <Link
            href="/career/jobs/latest"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
          >
            <span>Explore Jobs</span>
            <ArrowRight size={15} className="ml-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}