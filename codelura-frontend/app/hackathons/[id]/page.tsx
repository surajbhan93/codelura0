import ParticipateButton from "@/components/hackathon/ParticipateButton";
import JudgeCard from "@/components/hackathon/JudgeCard";
import SponsorChip from "@/components/hackathon/SponsorChip";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────
interface Track {
  _id: string;
  title: string;
  description: string;
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
  _id: string;
  title: string;
  weightage: number;
}

interface Hackathon {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  bannerImage: string;
  prizePool: string;
  prizeDetails: string;
  rules: string;
  tracks: Track[];
  teamSizeMin: number;
  teamSizeMax: number;
  judges: Judge[];
  sponsors: Sponsor[];
  faqs: FAQ[];
  judgingCriteria: JudgingCriteria[];
  discordLink?: string;
  websiteLink?: string;
  registrationStart: string;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  participantsCount: number;
  submissionsCount: number;
  status: "draft" | "upcoming" | "active" | "ended";
  isPublished: boolean;
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
    return res.json() as Promise<Hackathon>;
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
  return {
    title: `${hackathon.title} | Codelura Hackathon`,
    description: hackathon.shortDescription,
    openGraph: {
      title: hackathon.title,
      description: hackathon.shortDescription,
      images: [hackathon.bannerImage],
    },
  };
}

// ── Tiny server-safe helpers ────────────────────────────────────────────────
function StatusBadge({ status }: { status: Hackathon["status"] }) {
  const colors: Record<Hackathon["status"], string> = {
    draft:    "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30",
    active:   "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30",
    upcoming: "bg-sky-400/20 text-sky-300 border border-sky-400/30",
    ended:    "bg-gray-400/20 text-gray-300 border border-gray-400/30",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest ${colors[status]}`}>
      {status}
    </span>
  );
}

function StatPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">📡</div>
          <h1 className="text-2xl font-bold text-white">Connection Error</h1>
          <p className="text-gray-400">We&apos;re having trouble reaching our servers. Please try again.</p>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const regStart  = new Date(hackathon.registrationStart);
  const regEnd    = new Date(hackathon.registrationDeadline);
  const startDate = new Date(hackathon.startDate);
  const endDate   = new Date(hackathon.endDate);

  const timeline: { label: string; date: Date }[] = [
    { label: "Registration Opens",  date: regStart  },
    { label: "Registration Closes", date: regEnd    },
    { label: "Hackathon Starts",    date: startDate },
    { label: "Hackathon Ends",      date: endDate   },
  ];

  const quickStats: { label: string; value: number }[] = [
    { label: "Max Slots",   value: hackathon.maxParticipants   },
    { label: "Registered",  value: hackathon.participantsCount },
    { label: "Submissions", value: hackathon.submissionsCount  },
    { label: "Tracks",      value: hackathon.tracks.length     },
  ];

  return (
    <main
      className="min-h-screen bg-[#080810] text-white pb-24"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Syne:wght@600;700;800&display=swap');

        .hero-gradient { background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(109,40,217,.38) 0%, transparent 70%); }
        .glow-line     { height: 1px; background: linear-gradient(90deg, transparent, rgba(139,92,246,.45), transparent); }

        .card        { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 20px; }
        .accent-card { background: linear-gradient(135deg, rgba(109,40,217,.15), rgba(56,189,248,.08));
                       border: 1px solid rgba(139,92,246,.22); border-radius: 20px; }
        .sidebar-card{ background: linear-gradient(160deg, #1a103a 0%, #0d0d20 100%);
                       border: 1px solid rgba(139,92,246,.28); border-radius: 24px; }

        .track-card  { background: rgba(139,92,246,.06); border: 1px solid rgba(139,92,246,.16);
                       border-radius: 14px; transition: background .2s, border-color .2s; }
        .track-card:hover { background: rgba(139,92,246,.13); border-color: rgba(139,92,246,.38); }

        .judge-card  { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
                       border-radius: 16px; transition: border-color .2s; }
        .judge-card:hover { border-color: rgba(139,92,246,.35); }

        .sponsor-chip{ background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
                       border-radius: 12px; transition: background .2s, border-color .2s; }
        .sponsor-chip:hover { background: rgba(255,255,255,.09); border-color: rgba(255,255,255,.22); }

        .faq-item    { border-bottom: 1px solid rgba(255,255,255,.06); }

        .criteria-bar  { background: rgba(255,255,255,.06); border-radius: 99px; overflow: hidden; height: 6px; }
        .criteria-fill { background: linear-gradient(90deg, #7c3aed, #38bdf8); border-radius: 99px; height: 100%; }

        .timeline-dot{ width: 10px; height: 10px; border-radius: 50%; background: #7c3aed;
                       box-shadow: 0 0 0 3px rgba(124,58,237,.22); flex-shrink: 0; margin-top: 3px; }

        .sec-title   { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.25rem; letter-spacing: -.02em; }

        @media (max-width: 640px) {
          .card, .accent-card { border-radius: 16px; }
          .sidebar-card       { border-radius: 18px; }
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div className="relative h-72 md:h-[420px] w-full overflow-hidden">
        <Image
          src={hackathon.bannerImage}
          alt={hackathon.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/55 to-transparent" />
        <div className="absolute inset-0 hero-gradient" />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 md:px-8 pb-8 md:pb-12">
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition mb-4"
          >
            ← All Hackathons
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={hackathon.status} />
            {!hackathon.isPublished && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-400/20 text-orange-300 border border-orange-400/30 uppercase tracking-widest">
                Unpublished
              </span>
            )}
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold leading-tight mb-5 max-w-3xl"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-.03em" }}
          >
            {hackathon.title}
          </h1>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <StatPill icon="🏆" label={hackathon.prizePool} />
            <StatPill icon="👥" label={`${hackathon.participantsCount} / ${hackathon.maxParticipants} Joined`} />
            <StatPill icon="📋" label={`${hackathon.submissionsCount} Submissions`} />
            <StatPill icon="🧑‍💻" label={`Team: ${hackathon.teamSizeMin}–${hackathon.teamSizeMax}`} />
          </div>
        </div>
      </div>

      <div className="glow-line" />

      {/* ══ MAIN GRID ═════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

        {/* ── LEFT ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Overview */}
          <section className="card p-8">
            <h2 className="sec-title text-white mb-5">Overview</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">
              {hackathon.fullDescription}
            </p>
          </section>

          {/* Tracks */}
          {hackathon.tracks.length > 0 && (
            <section className="card p-8">
              <h2 className="sec-title text-white mb-5">🎯 Tracks</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {hackathon.tracks.map((track, i) => (
                  <div key={track._id} className="track-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-7 h-7 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-white text-sm">{track.title}</h3>
                    </div>
                    <p className="text-gray-400 text-[13px] leading-relaxed">{track.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Judging Criteria */}
          {hackathon.judgingCriteria.length > 0 && (
            <section className="card p-8">
              <h2 className="sec-title text-white mb-6">⚖️ Judging Criteria</h2>
              <div className="space-y-5">
                {hackathon.judgingCriteria.map((c) => (
                  <div key={c._id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-200">{c.title}</span>
                      <span className="text-sm font-bold text-violet-400">{c.weightage}%</span>
                    </div>
                    <div className="criteria-bar">
                      <div className="criteria-fill" style={{ width: `${c.weightage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prizes */}
          <section className="accent-card p-8">
            <h2 className="sec-title text-white mb-4">🥇 Prizes</h2>
            <p
              className="text-3xl font-bold text-violet-300 mb-3"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {hackathon.prizePool}
            </p>
            <p className="text-gray-300 text-[15px] whitespace-pre-wrap">{hackathon.prizeDetails}</p>
          </section>

          {/* Rules */}
          <section className="card p-8">
            <h2 className="sec-title text-white mb-5">📜 Rules &amp; Guidelines</h2>
            <p className="text-gray-300 text-[15px] whitespace-pre-wrap leading-relaxed">
              {hackathon.rules}
            </p>
          </section>

          {/* Judges — Client Component handles onError */}
          {hackathon.judges.length > 0 && (
            <section className="card p-8">
              <h2 className="sec-title text-white mb-6">👨‍⚖️ Judges</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {hackathon.judges.map((judge) => (
                  <JudgeCard key={judge._id} judge={judge} />
                ))}
              </div>
            </section>
          )}

          {/* Sponsors — Client Component handles onError */}
          {hackathon.sponsors.length > 0 && (
            <section className="card p-8">
              <h2 className="sec-title text-white mb-6">🤝 Sponsors</h2>
              <div className="flex flex-wrap gap-4">
                {hackathon.sponsors.map((s) => (
                  <SponsorChip key={s._id} sponsor={s} />
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {hackathon.faqs.length > 0 && (
            <section className="card p-8">
              <h2 className="sec-title text-white mb-6">❓ FAQs</h2>
              <div>
                {hackathon.faqs.map((faq, i) => (
                  <div key={faq._id} className={`faq-item py-5 ${i === 0 ? "pt-0" : ""}`}>
                    <p className="font-semibold text-white text-sm mb-2">{faq.question}</p>
                    <p className="text-gray-400 text-[14px] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="space-y-6">

          <div className="sidebar-card p-7 lg:sticky lg:top-6">
            <h3
              className="text-lg font-bold text-white mb-1"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Ready to compete?
            </h3>
            <p className="text-sm text-indigo-300/70 mb-7">
              Join and showcase your skills to win exciting prizes!
            </p>

            {/* Timeline */}
            <div className="space-y-3 mb-7">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="timeline-dot" />
                  <div className="flex-1 flex justify-between items-start border-b border-white/5 pb-3">
                    <span className="text-xs text-indigo-300/60">{item.label}</span>
                    <span className="text-xs font-semibold text-white ml-2 text-right">
                      {fmt(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {/* <ParticipateButton hackathon={hackathon} /> */}
              <ParticipateButton
                hackathon={{
                  id: hackathon._id,
                  registrationClosed: new Date() > new Date(hackathon.registrationDeadline),
                  isRegistered: false
                }}
              />
              <Button
                variant="outline"
                className="w-full bg-transparent border-indigo-600/40 text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-500 rounded-xl text-sm h-11"
              >
                📊 View Leaderboard
              </Button>

              <Link href={`/hackathons/${hackathon._id}/submission`}>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Submit Project
          </button>
        </Link>
            </div>

            {(hackathon.discordLink || hackathon.websiteLink) && (
              <div className="mt-6 pt-5 border-t border-white/5 flex gap-3">
                {hackathon.discordLink && (
                  <a
                    href={hackathon.discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-700/30 rounded-xl py-2.5 transition"
                  >
                    💬 Discord
                  </a>
                )}
                {hackathon.websiteLink && (
                  <a
                    href={hackathon.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-900/30 hover:bg-indigo-800/40 border border-indigo-700/30 rounded-xl py-2.5 transition"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="bg-white/[0.03] rounded-2xl p-4 text-center">
                  <p
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}