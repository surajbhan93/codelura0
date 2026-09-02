import ParticipateButton from "@/components/hackathon/ParticipateButton";
import JudgeCard from "@/components/hackathon/JudgeCard";
import SponsorChip from "@/components/hackathon/SponsorChip";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  ListChecks,
  Scale,
  Gift,
  ShieldAlert,
  Globe,
  Clock,
  ChevronRight,
  Send,
  Zap,
  Code2,
  FileCode2,
  Rocket,
  Flame,
  Milestone,
  CheckCheck,
} from "lucide-react";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────
interface Track {
  _id?: string;
  name?: string;
  title?: string;
  slug?: string;
  description: string;
}

interface Prize {
  rank: number;
  title?: string;
  cashPrize?: number;
  benefits?: string[];
}

interface Judge {
  _id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
}

interface Sponsor {
  _id: string;
  name: string;
  logo?: string;
  website: string;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

interface JudgingCriteria {
  _id?: string;
  criteria?: string;
  title?: string;
  weight?: number;
  weightage?: number;
}

interface Hackathon {
  _id: string;
  title: string;
  slug: string;
  theme?: string;
  mode?: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage?: string;
  bannerImageUrl?: string;
  prizePool: string | number;
  prizeDetails?: string;
  prizes?: Prize[];
  rules?: string | string[];
  tracks?: Track[];
  teamSizeMin?: number;
  teamSizeMax?: number;
  teamSize?: { min: number; max: number };
  eligibility?: string[];
  submissionRequirements?: string[];
  benefits?: string[];
  judges?: Judge[];
  sponsors?: Sponsor[];
  faqs?: FAQ[];
  judgingCriteria?: JudgingCriteria[];
  discordLink?: string;
  websiteLink?: string;
  registrationStart?: string;
  registrationStartDate?: string;
  registrationDeadline?: string;
  registrationEndDate?: string;
  startDate?: string;
  hackathonStartDate?: string;
  endDate?: string;
  hackathonEndDate?: string;
  submissionDeadline?: string;
  winnerAnnouncementDate?: string;
  maxParticipants?: number;
  participantsCount?: number;
  submissionsCount?: number;
  status: "draft" | "upcoming" | "active" | "ended";
  isPublished?: boolean;
}

// ── Data Fetching ───────────────────────────────────────────────────────────
async function getHackathon(id: string): Promise<Hackathon | "NOT_FOUND" | "ERROR"> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
    const res = await fetch(`${baseUrl}/hackathons/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.status === 404) return "NOT_FOUND";
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return (data.data || data) as Hackathon;
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    return "ERROR";
  }
}

// ── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const hackathon = await getHackathon(id);
  if (!hackathon || typeof hackathon === "string") return { title: "Hackathon | Codelura" };
  const banner = hackathon.bannerImageUrl || hackathon.bannerImage || "";
  return {
    title: `${hackathon.title} | Codelura Hackathon`,
    description: hackathon.shortDescription,
    openGraph: {
      title: hackathon.title,
      description: hackathon.shortDescription,
      images: banner ? [banner] : [],
    },
  };
}

function StatusBadge({ status }: { status: Hackathon["status"] }) {
  const colors: Record<Hackathon["status"], string> = {
    draft:    "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
    active:   "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-bold animate-pulse",
    upcoming: "bg-sky-400/20 text-sky-300 border border-sky-400/30",
    ended:    "bg-rose-400/20 text-rose-300 border border-rose-400/30",
  };
  return (
    <span className={`text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider ${colors[status] || colors.upcoming}`}>
      ● {status}
    </span>
  );
}

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hackathon = await getHackathon(id);

  if (hackathon === "NOT_FOUND") notFound();

  if (hackathon === "ERROR" || !hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070712] px-4 text-white">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">📡</div>
          <h1 className="text-2xl font-bold">Connection Error</h1>
          <p className="text-slate-400 text-sm">We could not connect to hackathon servers. Please try again.</p>
          <Button className="bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6">Retry</Button>
        </div>
      </div>
    );
  }

  const fmt = (dStr?: string) => {
    if (!dStr) return "TBA";
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? dStr : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const regStart = hackathon.registrationStartDate || hackathon.registrationStart;
  const regEnd   = hackathon.registrationEndDate || hackathon.registrationDeadline;
  const hStart   = hackathon.hackathonStartDate || hackathon.startDate;
  const hEnd     = hackathon.hackathonEndDate || hackathon.endDate;
  const subDead  = hackathon.submissionDeadline;
  const winnerDate = hackathon.winnerAnnouncementDate;

  const banner = hackathon.bannerImageUrl || hackathon.bannerImage || "https://images.unsplash.com/photo-1518770660439-4636190af475";
  const prizePoolFormatted = typeof hackathon.prizePool === "number" ? `₹${hackathon.prizePool.toLocaleString("en-IN")}` : hackathon.prizePool;
  const minTeam = hackathon.teamSize?.min ?? hackathon.teamSizeMin ?? 1;
  const maxTeam = hackathon.teamSize?.max ?? hackathon.teamSizeMax ?? 4;

  const isRegClosed = regEnd ? new Date() > new Date(regEnd) : false;

  const rulesList: string[] = Array.isArray(hackathon.rules)
    ? hackathon.rules
    : hackathon.rules ? [hackathon.rules] : [];

  // Timeline flowchart phases
  const timelinePhases = [
    {
      stepNumber: "01",
      phaseTitle: "PHASE 01 • REGISTRATION & TEAM BUILDING",
      durationBadge: "⏰ Registration Window",
      datesText: `${fmt(regStart)} → ${fmt(regEnd)}`,
      heading: "Registration, Track Selection & Team Setup",
      description: "Sign up individually or form a team of up to 4 members. Pick your preferred track and access exclusive Discord builder channels.",
      tags: ["Slot Reservation", "Track Choice", "Team Invite", "Discord Orientation"],
      milestoneProject: "🚀 Official Registration & Team Verification",
    },
    {
      stepNumber: "02",
      phaseTitle: "PHASE 02 • LIVE BUILD & WORKSHOPS",
      durationBadge: "⚡ 48-Hour Hackathon",
      datesText: `${fmt(hStart)} → ${fmt(hEnd)}`,
      heading: "48-Hour Non-stop Code & Mentorship Sessions",
      description: "Build your AI-powered prototype with technical guidance from industry experts and AI mentors. Live Q&A and architecture validation available.",
      tags: ["GenAI APIs", "AI Agents", "LLM Pipelines", "1:1 Mentorship"],
      milestoneProject: "💻 Working Prototype & Functional Demo",
    },
    {
      stepNumber: "03",
      phaseTitle: "PHASE 03 • SUBMISSION ROUND",
      durationBadge: "📌 Hard Deadline",
      datesText: fmt(subDead || hEnd),
      heading: "Project Submission & Automated AI Inspection",
      description: "Submit your GitHub repository, live demo link, 2-3 minute video walkthrough, and pitch presentation before the countdown ends.",
      tags: ["GitHub Repo", "Live Demo URL", "2-Min Video", "Pitch Presentation"],
      milestoneProject: "🔍 Automated AI Plagiarism & Quality Check",
    },
    {
      stepNumber: "04",
      phaseTitle: "PHASE 04 • EVALUATION & GRAND FINALE",
      durationBadge: "🏆 Winner Reveal",
      datesText: fmt(winnerDate),
      heading: "Grand Jury Deliberation & Winner Announcement",
      description: "Jury judges evaluate submissions based on Innovation, AI Implementation, Impact, and Technical Execution. Winners announced live!",
      tags: ["Jury Scoring", "Winner Reveal", "Internship Hiring", "Certificates"],
      milestoneProject: `🥇 ${prizePoolFormatted} Cash + Internship Distribution`,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070817] text-white pb-32 font-sans selection:bg-violet-600 selection:text-white">

      {/* ── HERO BANNER (FULL WIDTH CONTAINER) ── */}
      <div className="relative w-full bg-[#0b0d22] border-b border-violet-500/20 overflow-hidden pt-6 pb-12">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={banner}
            alt={hackathon.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070817]/60 via-[#070817]/90 to-[#070817]" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-6 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10"
          >
            ← Back to All Hackathons
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge status={hackathon.status || "upcoming"} />
                {hackathon.mode && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                    🌐 {hackathon.mode}
                  </span>
                )}
                {hackathon.theme && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 text-slate-200 border border-slate-700">
                    ✨ {hackathon.theme}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-xl">
                {hackathon.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
                {hackathon.shortDescription}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 text-amber-300 text-sm font-black shadow-lg">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Prize Pool: {prizePoolFormatted}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-sm font-semibold text-slate-200">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{hackathon.participantsCount || 0} / {hackathon.maxParticipants || 500} Participants</span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-sm font-semibold text-slate-200">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Team: {minTeam}–{maxTeam} Members</span>
                </div>
              </div>
            </div>

            {/* Top Right Quick Action Box */}
            <div className="lg:col-span-4 bg-[#121430]/90 border border-violet-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Registration Status</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Open Now</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400">Submission Deadline</p>
                <p className="text-lg font-extrabold text-white font-mono">{fmt(subDead || hEnd)}</p>
              </div>

              <ParticipateButton
                hackathon={{
                  id: hackathon._id,
                  title: hackathon.title,
                  tracks: hackathon.tracks?.map((tr) => ({
                    _id: tr._id,
                    title: tr.name || tr.title || "General",
                    description: tr.description,
                  })),
                  registrationClosed: isRegClosed,
                  isRegistered: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── BALANCED FULL-WIDTH GRID (MAX-W-[1440PX]) ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* LEFT MAIN COLUMN (8 COLS ON LG, 9 COLS ON XL) */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-10">

            {/* OVERVIEW CARD */}
            <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center font-bold">
                  📋
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Event Overview</h2>
                  <p className="text-xs text-slate-400">Detailed guidelines and description</p>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                {hackathon.fullDescription}
              </p>
            </section>

            {/* ── VISUAL FLOWCHART ROADMAP TIMELINE ── */}
            <section className="bg-[#0b0d22] border border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
                    📖 VISUAL LEARNING & EVENT ROADMAP
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Your Complete Hackathon Flowchart
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Structured step-by-step roadmap showing every stage, deadline & milestone output.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    4 Stage Milestones
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    🎯 1:1 Mentors
                  </span>
                </div>
              </div>

              {/* Flowchart Steps */}
              <div className="relative pl-4 sm:pl-8 space-y-8">
                {/* Dashed vertical line */}
                <div className="absolute left-[20px] sm:left-[35px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-violet-500/40 pointer-events-none" />

                {timelinePhases.map((phase) => (
                  <div key={phase.stepNumber} className="relative flex items-start gap-4 sm:gap-6 group">
                    {/* Number Circle Badge */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 border-2 border-[#0b0d22] text-white font-black flex items-center justify-center text-sm sm:text-base shrink-0 shadow-lg shadow-violet-600/30 z-10">
                      {phase.stepNumber}
                    </div>

                    {/* Stage Card */}
                    <div className="flex-1 bg-[#10132e] border border-violet-500/25 hover:border-violet-500/50 rounded-2xl p-5 sm:p-6 space-y-4 transition-all shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                          {phase.phaseTitle}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            {phase.durationBadge}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {phase.datesText}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-extrabold text-white group-hover:text-violet-300 transition">
                          {phase.heading}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                          {phase.description}
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">KEY SKILLS & HIGHLIGHTS</span>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.tags.map((tag) => (
                              <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-black/40 text-slate-300 border border-white/10">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Milestone Output Box (Green highlight) */}
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-right shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">🚀 MILESTONE OUTPUT</span>
                          <span className="text-xs font-extrabold text-emerald-300 mt-0.5 block">{phase.milestoneProject}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CASH PRIZES CARDS GRID (3-COLUMN CARDS FILLING WIDTH) */}
            <section className="bg-gradient-to-br from-violet-950/30 via-[#0e1026] to-indigo-950/30 border border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    🏆 Cash Prizes & Rewards
                  </h2>
                  <p className="text-xs text-slate-400">Total prize pool distributed among top winning teams</p>
                </div>
                <span className="text-xl font-black text-amber-400">{prizePoolFormatted}</span>
              </div>

              {hackathon.prizes && hackathon.prizes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {hackathon.prizes.map((p, idx) => (
                    <div key={idx} className="bg-black/50 border border-amber-500/30 rounded-2xl p-6 space-y-4 hover:border-amber-400/60 transition shadow-lg flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {p.title || `Rank ${p.rank}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block uppercase font-bold">Cash Prize</span>
                          <p className="text-3xl font-black text-white">₹{(p.cashPrize || 0).toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      {p.benefits && p.benefits.length > 0 && (
                        <div className="space-y-2 pt-3 border-t border-white/10">
                          {p.benefits.map((b, bIdx) => (
                            <p key={bIdx} className="text-xs text-slate-200 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {b}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-black/40 rounded-2xl p-5 border border-white/10 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {hackathon.prizeDetails || `Total Prize Pool: ${prizePoolFormatted}`}
                </div>
              )}
            </section>

            {/* TRACKS GRID */}
            {hackathon.tracks && hackathon.tracks.length > 0 && (
              <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    🎯 Official Hackathon Tracks ({hackathon.tracks.length})
                  </h2>
                  <p className="text-xs text-slate-400">Choose one track for your team project submission</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hackathon.tracks.map((tr, idx) => (
                    <div key={idx} className="bg-[#121432] border border-violet-500/20 hover:border-violet-500/40 rounded-2xl p-5 space-y-3 transition">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-violet-600/30 text-violet-300 text-xs font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-white text-base">{tr.name || tr.title}</h3>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{tr.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ELIGIBILITY & CHECKLIST */}
            {(hackathon.eligibility?.length || hackathon.submissionRequirements?.length) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hackathon.eligibility && hackathon.eligibility.length > 0 && (
                  <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      👥 Eligibility Criteria
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hackathon.eligibility.map((el, i) => (
                        <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                          ✓ {el}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {hackathon.submissionRequirements && hackathon.submissionRequirements.length > 0 && (
                  <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-indigo-400" /> Submission Checklist
                    </h3>
                    <div className="space-y-2">
                      {hackathon.submissionRequirements.map((req, i) => (
                        <p key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" /> {req}
                        </p>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* WEIGHTED JUDGING CRITERIA */}
            {hackathon.judgingCriteria && hackathon.judgingCriteria.length > 0 && (
              <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    ⚖️ Weighted Judging Criteria
                  </h2>
                  <p className="text-xs text-slate-400">Projects will be evaluated according to these weightages</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hackathon.judgingCriteria.map((c, i) => {
                    const title = c.criteria || c.title;
                    const weight = c.weight || c.weightage || 0;
                    return (
                      <div key={i} className="space-y-2 bg-black/40 p-4.5 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-200">{title}</span>
                          <span className="text-violet-400">{weight}% Weight</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full rounded-full" style={{ width: `${weight}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* OFFICIAL RULES */}
            {rulesList.length > 0 && (
              <section className="bg-[#0e1026] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  📜 Official Rules & Guidelines
                </h2>
                <div className="space-y-3">
                  {rulesList.map((r, i) => (
                    <p key={i} className="text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                      <span className="font-bold text-violet-400 shrink-0">{i + 1}.</span>
                      <span>{r}</span>
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* FREQUENTLY ASKED QUESTIONS (FAQS) */}
            <section className="bg-gradient-to-br from-[#0e1026] via-[#10132f] to-[#0b0c1e] border border-violet-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-2">
                  💬 GOT QUESTIONS?
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  Frequently Asked Questions (FAQs)
                </h2>
                <p className="text-xs text-slate-400 mt-1">Everything you need to know about participating, team setup, and submissions.</p>
              </div>

              <div className="space-y-3">
                {(hackathon.faqs && hackathon.faqs.length > 0 ? hackathon.faqs : [
                  {
                    question: "Who can participate in this hackathon?",
                    answer: "Students, developers, designers, data scientists, and AI enthusiasts from across India are welcome to join!"
                  },
                  {
                    question: "Is there any registration fee?",
                    answer: "No! Participation in Codelura AI Innovation Hackathons is 100% free of charge."
                  },
                  {
                    question: "Can I participate individually or in a team?",
                    answer: "You can participate individually as a solo builder or form a team of up to 4 members."
                  },
                  {
                    question: "What are the project submission requirements?",
                    answer: "You must submit a GitHub repository link, live demo URL, 2-3 minute video walkthrough, and project description before the deadline."
                  },
                  {
                    question: "Are AI tools and third-party APIs allowed?",
                    answer: "Yes! You are encouraged to leverage Generative AI tools, LLM APIs, automation agents, and modern frameworks."
                  },
                  {
                    question: "How are winners selected and prizes distributed?",
                    answer: "Submissions undergo automated AI quality & plagiarism inspection followed by evaluation by expert jury judges according to weighted criteria rules."
                  }
                ]).map((faq: any, idx: number) => (
                  <details key={idx} className="group bg-black/40 border border-white/10 hover:border-violet-500/40 rounded-2xl p-4.5 transition-all shadow-md">
                    <summary className="font-extrabold text-sm text-white cursor-pointer flex items-center justify-between list-none gap-4">
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-violet-600/20 text-violet-300 text-xs flex items-center justify-center font-black shrink-0">
                          ?
                        </span>
                        <span>{faq.question}</span>
                      </span>
                      <span className="text-violet-400 group-open:rotate-180 transition-transform duration-200 text-xs">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 pt-3 border-t border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT SIDEBAR (4 COLS - STICKY AND BALANCED) */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">

            <div className="bg-gradient-to-b from-[#181538] via-[#121029] to-[#0c0d1e] border border-violet-500/40 rounded-3xl p-6 lg:sticky lg:top-6 space-y-6 shadow-2xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 block mb-1">REGISTRATION ACTIVE</span>
                <h3 className="text-2xl font-black text-white">Join Hackathon</h3>
                <p className="text-xs text-slate-300 mt-1">Reserve your slot, submit project entries, and compete for {prizePoolFormatted}!</p>
              </div>

              {/* SCHEDULE CARD */}
              <div className="space-y-3 bg-black/50 border border-white/10 rounded-2xl p-4 text-xs font-medium">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-2">Key Dates & Deadlines</p>

                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Registration Start</span>
                  <span className="font-bold text-white">{fmt(regStart)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Registration End</span>
                  <span className="font-bold text-slate-200">{fmt(regEnd)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Hackathon Start</span>
                  <span className="font-bold text-indigo-300">{fmt(hStart)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-slate-400">Hackathon End</span>
                  <span className="font-bold text-indigo-300">{fmt(hEnd)}</span>
                </div>
                {subDead && (
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-slate-400">Submission Deadline</span>
                    <span className="font-bold text-rose-300">{fmt(subDead)}</span>
                  </div>
                )}
                {winnerDate && (
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">Winner Announcement</span>
                    <span className="font-bold text-amber-300">🏆 {fmt(winnerDate)}</span>
                  </div>
                )}
              </div>

              {/* PARTICIPATE BUTTON & EASY APPLY MODAL */}
              <ParticipateButton
                hackathon={{
                  id: hackathon._id,
                  title: hackathon.title,
                  tracks: hackathon.tracks?.map((tr) => ({
                    _id: tr._id,
                    title: tr.name || tr.title || "General",
                    description: tr.description,
                  })),
                  registrationClosed: isRegClosed,
                  isRegistered: false,
                }}
              />

              {(hackathon.discordLink || hackathon.websiteLink) && (
                <div className="pt-4 border-t border-white/10 flex gap-3">
                  {hackathon.discordLink && (
                    <a
                      href={hackathon.discordLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-700/30 rounded-xl py-2.5 transition"
                    >
                      💬 Discord
                    </a>
                  )}
                  {hackathon.websiteLink && (
                    <a
                      href={hackathon.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-700/30 rounded-xl py-2.5 transition"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}