"use client";

import Link from "next/link";
import Image from "next/image";
import ParticipateButton from "./ParticipateButton";

interface Hackathon {
  id?: string;
  _id?: string;
  title: string;
  shortDescription: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "active" | "completed" | "draft" | "ended";
  prizePool: string;
  participantsCount: number;
  maxParticipants?: number;
  submissionsCount?: number;
  teamSizeMin?: number;
  teamSizeMax?: number;
  tracks?: { _id: string; title: string }[];
  isPublished?: boolean;
  registrationDeadline?: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  ongoing:   { label: "Live Now",  dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10 border-emerald-400/20" },
  active:    { label: "Live Now",  dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10 border-emerald-400/20" },
  upcoming:  { label: "Upcoming",  dot: "bg-amber-400",   text: "text-amber-300",   bg: "bg-amber-400/10 border-amber-400/20"   },
  draft:     { label: "Draft",     dot: "bg-gray-400",    text: "text-gray-400",    bg: "bg-gray-400/10 border-gray-400/20"    },
  completed: { label: "Ended",     dot: "bg-rose-400",    text: "text-rose-300",    bg: "bg-rose-400/10 border-rose-400/20"    },
  ended:     { label: "Ended",     dot: "bg-rose-400",    text: "text-rose-300",    bg: "bg-rose-400/10 border-rose-400/20"    },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysLeft(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const id     = hackathon.id || hackathon._id;
  const cfg    = STATUS_CONFIG[hackathon.status] ?? STATUS_CONFIG.upcoming;
  const dl     = hackathon.registrationDeadline ? daysLeft(hackathon.registrationDeadline) : null;
  const pct    = hackathon.maxParticipants
    ? Math.min(100, Math.round((hackathon.participantsCount / hackathon.maxParticipants) * 100))
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        .hk-card {
          font-family: 'Outfit', sans-serif;
          background: #0e0e16;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease, border-color 0.3s ease;
        }
        .hk-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          background: radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.4s;
          opacity: 0;
        }
        .hk-card:hover::before { opacity: 1; }
        .hk-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.25);
          border-color: rgba(139,92,246,0.3);
        }

        .hk-img-wrap { position: relative; height: 200px; width: 100%; overflow: hidden; }
        .hk-img-wrap img { transition: transform 0.6s cubic-bezier(.22,.68,0,1.2) !important; }
        .hk-card:hover .hk-img-wrap img { transform: scale(1.07) !important; }
        .hk-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, #0e0e16 0%, rgba(14,14,22,0.4) 45%, transparent 100%);
        }

        .hk-status {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 11px; border-radius: 99px; border: 1px solid;
        }
        .hk-status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .hk-status-dot.live { animation: pulse-dot 1.6s ease-in-out infinite; }
        @keyframes pulse-dot {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50%      { opacity: .7; box-shadow: 0 0 0 4px transparent; }
        }

        .hk-body { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 16px; flex: 1; position: relative; z-index: 1; }

        .hk-title {
          font-size: 1.2rem; font-weight: 800; line-height: 1.25; color: #fff;
          transition: color 0.2s;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .hk-card:hover .hk-title { color: #c4b5fd; }

        .hk-desc {
          font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .hk-divider { height: 1px; background: rgba(255,255,255,0.06); }

        .hk-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .hk-stat {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 12px 14px;
        }
        .hk-stat-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 4px; }
        .hk-stat-value { font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1; }

        .hk-prize { color: #a78bfa; }
        .hk-participants { color: #38bdf8; }

        .hk-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .hk-tag {
          font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
          background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.2);
          color: #c4b5fd; padding: 3px 10px; border-radius: 99px;
        }

        .hk-date-row {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 500; color: rgba(255,255,255,0.4);
          font-family: 'Space Mono', monospace;
        }
        .hk-date-row svg { flex-shrink: 0; opacity: 0.5; }

        .hk-progress-wrap { display: flex; flex-direction: column; gap: 5px; }
        .hk-progress-label { display: flex; justify-content: space-between; font-size: 10.5px; font-weight: 600; color: rgba(255,255,255,0.35); }
        .hk-progress-bar { height: 4px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
        .hk-progress-fill { height: 100%; background: linear-gradient(90deg, #7c3aed, #38bdf8); border-radius: 99px; transition: width 0.6s ease; }

        .hk-deadline-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; padding: 4px 11px;
          background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2);
          color: #fbbf24; border-radius: 99px; letter-spacing: 0.04em;
        }

        .hk-footer { margin-top: auto; padding-top: 4px; }
      `}</style>

      <div className="hk-card">
        {/* Banner Image */}
        <div className="hk-img-wrap">
          <Image
            src={hackathon.bannerImage}
            alt={hackathon.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="hk-img-overlay" />

          {/* Status badge — overlaid on image */}
          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 2 }}>
            <span className={`hk-status ${cfg.text} ${cfg.bg}`}>
              <span className={`hk-status-dot ${cfg.dot} ${hackathon.status === "ongoing" || hackathon.status === "active" ? "live" : ""}`} style={{ background: cfg.dot.replace("bg-", "").replace("-400", ""), backgroundColor: "currentColor", color: "inherit" }} />
              {cfg.label}
            </span>
          </div>

          {/* Days left badge */}
          {dl !== null && dl > 0 && (
            <div style={{ position: "absolute", bottom: 14, left: 14, zIndex: 2 }}>
              <span className="hk-deadline-badge">
                ⏳ {dl}d to register
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="hk-body">

          {/* Title + desc */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Link href={`/hackathons/${id}`}>
              <div className="hk-title">{hackathon.title}</div>
            </Link>
            <div className="hk-desc">{hackathon.shortDescription}</div>
          </div>

          {/* Tracks */}
          {hackathon.tracks && hackathon.tracks.length > 0 && (
            <div className="hk-tags">
              {hackathon.tracks.slice(0, 3).map((t) => (
                <span key={t._id} className="hk-tag">{t.title}</span>
              ))}
              {hackathon.tracks.length > 3 && (
                <span className="hk-tag">+{hackathon.tracks.length - 3} more</span>
              )}
            </div>
          )}

          <div className="hk-divider" />

          {/* Stats grid */}
          <div className="hk-stats">
            <div className="hk-stat">
              <div className="hk-stat-label">Prize Pool</div>
              <div className={`hk-stat-value hk-prize`}>{hackathon.prizePool}</div>
            </div>
            <div className="hk-stat">
              <div className="hk-stat-label">Participants</div>
              <div className={`hk-stat-value hk-participants`}>
                {hackathon.participantsCount}
                {hackathon.maxParticipants ? (
                  <span style={{ fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.3)", marginLeft: 3 }}>
                    /{hackathon.maxParticipants}
                  </span>
                ) : null}
              </div>
            </div>
            {hackathon.teamSizeMin != null && hackathon.teamSizeMax != null && (
              <div className="hk-stat">
                <div className="hk-stat-label">Team Size</div>
                <div className="hk-stat-value" style={{ color: "#f0abfc" }}>
                  {hackathon.teamSizeMin}–{hackathon.teamSizeMax}
                </div>
              </div>
            )}
            {hackathon.submissionsCount != null && (
              <div className="hk-stat">
                <div className="hk-stat-label">Submissions</div>
                <div className="hk-stat-value" style={{ color: "#6ee7b7" }}>
                  {hackathon.submissionsCount}
                </div>
              </div>
            )}
          </div>

          {/* Participant progress bar */}
          {pct !== null && (
            <div className="hk-progress-wrap">
              <div className="hk-progress-label">
                <span>Seats filled</span>
                <span>{pct}%</span>
              </div>
              <div className="hk-progress-bar">
                <div className="hk-progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="hk-date-row">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {fmt(hackathon.startDate)} → {fmt(hackathon.endDate)}
          </div>

          {/* CTA */}
          <div className="hk-footer">
            {/* <ParticipateButton hackathon={hackathon} /> */}
            <ParticipateButton
                  hackathon={{
                    id: hackathon.id || hackathon._id || "",
                    registrationClosed: hackathon.registrationDeadline
                      ? new Date() > new Date(hackathon.registrationDeadline)
                      : false,
                    isRegistered: false
                  }}
                />
          </div>
        </div>
      </div>
    </>
  );
}