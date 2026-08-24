"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  BookOpen,
  Calculator,
  FileText,
  UserCircle,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const SECTIONS = [
  {
    badge: "🚀 Free Career Tools",
    title: "Everything You Need To Land Your Dream Job",
    description:
      "Boost your career with AI-powered tools, mentorship, learning programs, and curated job opportunities—all in one place.",
    cta: "Explore Career Hub",
    href: "/career",
    items: [
      {
        title: "ATS Resume Checker",
        desc: "Get your resume past automated screening systems.",
        href: "/career/tools/ats-resume-checker",
        icon: FileText,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        title: "Resume Builder",
        desc: "Create ATS-friendly resumes in minutes.",
        href: "/career/tools/resume-builder",
        icon: UserCircle,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        title: "Salary Calculator",
        desc: "Know your market worth instantly.",
        href: "/career/tools/salary-calculator",
        icon: Calculator,
        gradient: "from-green-500 to-emerald-500",
      },
    ],
  },
  {
    badge: "⭐ Career Mentorship",
    title: "Learn From Industry Experts",
    description:
      "Get personalized guidance, interview preparation, resume reviews, and mock interviews from experienced professionals.",
    cta: "View Mentorship",
    href: "/career/mentorship/one-on-one",
    items: [
      {
        title: "One-on-One Mentorship",
        desc: "Private sessions with experienced mentors.",
        href: "/career/mentorship/one-on-one",
        icon: Users,
        gradient: "from-orange-500 to-red-500",
      },
      {
        title: "Career Guidance",
        desc: "Personal roadmap for placements & internships.",
        href: "/career/mentorship/career-guidance",
        icon: GraduationCap,
        gradient: "from-violet-500 to-fuchsia-500",
      },
      {
        title: "Mock Interviews",
        desc: "Practice interviews with real professionals.",
        href: "/career/mentorship/mock-interviews",
        icon: Sparkles,
        gradient: "from-sky-500 to-indigo-500",
      },
    ],
  },
  {
    badge: "📚 Learning",
    title: "Master Skills Companies Actually Hire For",
    description:
      "Follow structured learning paths designed by professionals and crack your next interview with confidence.",
    cta: "Browse Programs",
    href: "/career/learning/career-tracks",
    items: [
      {
        title: "Career Tracks",
        desc: "Structured learning roadmap.",
        href: "/career/learning/career-tracks",
        icon: GraduationCap,
        gradient: "from-indigo-500 to-violet-500",
      },
      {
        title: "Courses",
        desc: "Hands-on practical programs.",
        href: "/career/learning/programs",
        icon: BookOpen,
        gradient: "from-pink-500 to-rose-500",
      },
      {
        title: "Latest Jobs",
        desc: "Curated openings updated daily.",
        href: "/career/jobs/latest",
        icon: Briefcase,
        gradient: "from-cyan-500 to-blue-500",
      },
    ],
  },
];

type Props = {
  section?: number;
};

export default function CareerPromo({ section = 0 }: Props) {
  const data = SECTIONS[section];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 md:p-8 lg:p-12 text-white shadow-2xl">
      {/* Background Blobs */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative z-10">
        {/* Badge */}
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
          {data.badge}
        </span>

        {/* Title */}
        <h2 className="mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          {data.title}
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-300">
          {data.description}
        </p>

        {/* Grid Items */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                {/* Icon */}
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg shadow-${item.gradient.split(' ')[1]}/20`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg sm:text-xl font-semibold">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 sm:leading-7 text-slate-300">
                  {item.desc}
                </p>

                {/* Explore Link */}
                <div className="mt-6 flex items-center gap-2 font-semibold text-cyan-400 transition group-hover:gap-3">
                  Explore
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="w-full lg:flex-1">
              <h3 className="text-xl sm:text-2xl font-bold">
                Take the Next Step in Your Career 🚀
              </h3>

              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-300">
                Whether you're preparing for interviews, improving your
                resume, learning new skills, or searching for your next job,
                we've got everything you need in one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                {[
                  "AI Career Tools",
                  "Expert Mentorship",
                  "Interview Preparation",
                  "Curated Jobs",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium"
                    style={{
                      background:
                        tag === "AI Career Tools"
                          ? "rgba(6, 182, 212, 0.1)"
                          : tag === "Expert Mentorship"
                          ? "rgba(16, 185, 129, 0.1)"
                          : tag === "Interview Preparation"
                          ? "rgba(139, 92, 246, 0.1)"
                          : "rgba(251, 146, 60, 0.1)",
                      color:
                        tag === "AI Career Tools"
                          ? "#67e8f9"
                          : tag === "Expert Mentorship"
                          ? "#6ee7b7"
                          : tag === "Interview Preparation"
                          ? "#a78bfa"
                          : "#fdba74",
                    }}
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={data.href}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3.5 sm:px-8 sm:py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
            >
              {data.cta}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {[
            { value: "50K+", label: "Career Community" },
            { value: "500+", label: "Industry Mentors" },
            { value: "1,200+", label: "Active Jobs" },
            { value: "12+", label: "Career Tools" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 text-center backdrop-blur transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/10"
            >
              <h4 className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-2xl sm:text-3xl font-bold text-transparent">
                {stat.value}
              </h4>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}