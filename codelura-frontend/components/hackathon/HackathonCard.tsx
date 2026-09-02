"use client";

import Link from "next/link";
import Image from "next/image";
import ParticipateButton from "./ParticipateButton";

interface Hackathon {
  id?: string;
  _id?: string;
  slug?: string;
  title: string;
  shortDescription: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "active" | "completed" | "draft" | "ended";
  prizePool: string | number;
  participantsCount: number;
  maxParticipants?: number;
  submissionsCount?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  tracks?: { _id?: string; title?: string; name?: string }[];
  isPublished?: boolean;
  registrationDeadline?: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  ongoing:   { label: "Live Now",  dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/20 border-emerald-500/40" },
  active:    { label: "Live Now",  dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-500/20 border-emerald-500/40" },
  upcoming:  { label: "Upcoming",  dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-500/20 border-amber-500/40"   },
  draft:     { label: "Draft",     dot: "bg-slate-400",   text: "text-slate-400",   bg: "bg-slate-500/20 border-slate-500/30"   },
  completed: { label: "Ended",     dot: "bg-rose-400",    text: "text-rose-300",    bg: "bg-rose-500/20 border-rose-500/30"    },
  ended:     { label: "Ended",     dot: "bg-rose-400",    text: "text-rose-300",    bg: "bg-rose-500/20 border-rose-500/30"    },
};

function fmt(dateStr: string) {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysLeft(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const targetId = hackathon.slug || hackathon.id || hackathon._id;
  const cfg = STATUS_CONFIG[hackathon.status] ?? STATUS_CONFIG.upcoming;
  const dl = hackathon.registrationDeadline ? daysLeft(hackathon.registrationDeadline) : null;
  const maxP = hackathon.maxParticipants || 500;
  const currP = hackathon.participantsCount || 0;
  const pct = Math.min(100, Math.round((currP / maxP) * 100));

  const prizePoolFormatted = typeof hackathon.prizePool === "number"
    ? `₹${hackathon.prizePool.toLocaleString("en-IN")}`
    : hackathon.prizePool || "₹1,00,000";

  return (
    <div className="group relative bg-[#0e1026] hover:bg-[#121430] border border-white/10 hover:border-violet-500/40 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-violet-600/20 hover:-translate-y-1.5">

      {/* Banner Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
        <Image
          src={hackathon.bannerImage || "https://images.unsplash.com/photo-1518770660439-4636190af475"}
          alt={hackathon.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1026] via-[#0e1026]/40 to-transparent" />

        {/* Top Badges Overlaid */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${cfg.text} ${cfg.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {dl !== null && dl > 0 && (
          <div className="absolute bottom-3.5 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 backdrop-blur-md">
              ⏳ {dl}d left to register
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">

        {/* Title & Short Description */}
        <div className="space-y-1.5">
          <Link href={`/hackathons/${targetId}`}>
            <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-violet-300 transition line-clamp-2 leading-snug">
              {hackathon.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {hackathon.shortDescription}
          </p>
        </div>

        {/* Tracks Tags */}
        {hackathon.tracks && hackathon.tracks.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tracks.slice(0, 3).map((t, idx) => (
              <span key={t._id || idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {t.title || t.name}
              </span>
            ))}
            {hackathon.tracks.length > 3 && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10">
                +{hackathon.tracks.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="h-px bg-white/10" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-black/30 border border-white/5 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Prize Pool</span>
            <span className="text-sm sm:text-base font-black text-amber-400 block">{prizePoolFormatted}</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Participants</span>
            <span className="text-sm sm:text-base font-black text-indigo-300 block">
              {currP} <span className="text-[10px] text-slate-500 font-normal">/ {maxP}</span>
            </span>
          </div>
        </div>

        {/* Seat Fill Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
            <span>Slots filled</span>
            <span className="font-bold text-violet-400">{pct}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-400 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Schedule Date Row */}
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pt-1">
          <span>📅</span> {fmt(hackathon.startDate)} → {fmt(hackathon.endDate)}
        </div>

        {/* Actions Footer */}
        <div className="pt-2 mt-auto space-y-2">
          <ParticipateButton
            hackathon={{
              id: hackathon.id || hackathon._id || "",
              title: hackathon.title,
              tracks: hackathon.tracks?.map((t) => ({ _id: t._id, title: t.title || t.name || "Track" })),
              registrationClosed: hackathon.registrationDeadline
                ? new Date() > new Date(hackathon.registrationDeadline)
                : false,
              isRegistered: false,
            }}
          />

          <Link
            href={`/hackathons/${targetId}`}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            View Event Details →
          </Link>
        </div>

      </div>
    </div>
  );
}