"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  RefreshCw,
  ShieldCheck,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

/* ================= TYPES ================= */
type Subscription = {
  _id: string;
  status: "pending" | "approved" | "rejected" | "expired" | "suspended";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  finalAmount: number;
  premiumService?: {
    title?: string;
    price?: number;
    description?: string;
  };
};

/* ================= STATUS CONFIG ================= */
const STATUS_CONFIG = {
  approved: {
    label: "Active",
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
  expired: {
    label: "Expired",
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    border: "border-slate-500/30",
    dot: "bg-slate-400",
  },
  suspended: {
    label: "Suspended",
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    border: "border-orange-500/30",
    dot: "bg-orange-400",
  },
};

/* ================= BADGE COMPONENT ================= */
function StatusBadge({ status }: { status: Subscription["status"] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.expired;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#12152d]/90 p-5 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-violet-500/30 hover:bg-[#151936]">
      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1 font-mono">
        {label}
      </p>
      <p className={`text-2xl sm:text-3xl font-black tracking-tight ${accent ?? "text-white"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function PremiumPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── FETCH ── */
  const fetchSubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/premium/my-subscriptions");
      setSubs(res.data.subs || []);
    } catch {
      setError("Unable to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  /* ── DERIVED ── */
  const active = subs.find((s) => s.status === "approved");
  const pending = subs.filter((s) => s.status === "pending");
  const totalSpent = subs
    .filter((s) => s.status === "approved")
    .reduce((acc, s) => acc + (s.finalAmount || 0), 0);

  let daysLeft: number | null = null;
  if (active?.endDate) {
    daysLeft = Math.ceil(
      (new Date(active.endDate).getTime() - Date.now()) / 86_400_000
    );
  }

  const urgency =
    daysLeft !== null && daysLeft <= 3
      ? "critical"
      : daysLeft !== null && daysLeft <= 7
      ? "warning"
      : "safe";

  /* ── LOADING STATE ── */
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
            Loading Premium Subscriptions...
          </p>
        </div>
      </div>
    );
  }

  /* ── ERROR STATE ── */
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm rounded-3xl border border-red-500/20 bg-[#12152d] p-8 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-white font-bold text-sm mb-2">{error}</p>
          <button
            onClick={fetchSubs}
            className="mt-4 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-violet-600/30"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070814] text-white p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Premium ambient glows */}
      <div className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wider mb-1 font-mono">
              <Crown size={15} className="text-amber-400 fill-amber-400" />
              MEMBERSHIP HUB
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Premium <span className="bg-gradient-to-r from-amber-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your active premium membership, unlock benefits, and view billing history.
            </p>
          </div>

          <Link
            href="/premium"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-violet-600/30 border border-violet-400/30 shrink-0"
          >
            <Plus size={16} />
            Explore Premium Plans
          </Link>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Subscriptions"
            value={String(subs.length)}
            sub="All-time membership records"
          />
          <StatCard
            label="Total Invested"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            sub="Approved membership payments"
            accent="text-emerald-400"
          />
          <StatCard
            label="Pending Approvals"
            value={String(pending.length)}
            sub="Subscriptions awaiting activation"
            accent={pending.length > 0 ? "text-amber-400" : "text-slate-300"}
          />
        </div>

        {/* ── ACTIVE PLAN CARD ── */}
        {active ? (
          <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-950/80 via-indigo-950/90 to-[#0c0e24] p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl">
            {/* Ambient decorative glow circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  <Zap size={13} className="text-yellow-400 fill-yellow-400" /> Current Active Plan
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-3.5 py-1 rounded-full font-bold border border-emerald-500/30">
                  <CheckCircle2 size={13} /> Active &amp; Verified
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {active.premiumService?.title || "Codelura Premium Access"}
                </h2>
                {active.premiumService?.description && (
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {active.premiumService.description}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{active.finalAmount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  / Full Term Paid
                </span>
              </div>

              {/* Expiry & Duration Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {active.startDate && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Activated On</p>
                    <p className="text-xs font-extrabold text-slate-200 mt-0.5">
                      {new Date(active.startDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {active.endDate && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Valid Until</p>
                    <p className="text-xs font-extrabold text-slate-200 mt-0.5">
                      {new Date(active.endDate).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {daysLeft !== null && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Remaining Days</p>
                    <div
                      className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-lg text-xs font-black ${
                        urgency === "critical"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : urgency === "warning"
                          ? "bg-amber-500/20 text-yellow-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      <Clock size={12} />
                      {daysLeft > 0 ? `${daysLeft} Days Remaining` : "Expired Today"}
                    </div>
                  </div>
                )}
              </div>

              {/* Days Progress Bar */}
              {active.startDate && active.endDate && daysLeft !== null && (
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        urgency === "critical"
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : urgency === "warning"
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                      }`}
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (daysLeft /
                              Math.ceil(
                                (new Date(active.endDate).getTime() -
                                  new Date(active.startDate).getTime()) /
                                  86_400_000
                              )) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                  <Link
                    href="/premium"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-5 py-2.5 rounded-xl text-xs font-black transition shadow-lg shadow-amber-500/20"
                  >
                    <RefreshCw size={14} /> Renew Plan Now
                  </Link>
                )}
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition backdrop-blur-md"
                >
                  <Sparkles size={14} className="text-yellow-400" /> Upgrade Membership
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── NO ACTIVE PLAN CARD ── */
          <div className="rounded-3xl border border-dashed border-violet-500/30 bg-[#111428]/80 p-8 sm:p-12 text-center shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-lg shadow-violet-600/20">
              <Crown size={32} className="fill-amber-400/20" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              No Active Premium Plan
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              Unlock 1-on-1 mentorship, exclusive study tracks, priority code reviews, and premium campus ambassador perks today.
            </p>

            <Link
              href="/premium"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-7 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-xl shadow-violet-600/30 border border-violet-400/30 hover:scale-105"
            >
              <Zap size={16} className="text-yellow-400 fill-yellow-400" />
              Explore Premium Plans
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* ── SUBSCRIPTION HISTORY ── */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <ShieldCheck size={18} className="text-violet-400" />
              Subscription History
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Total {subs.length} Record{subs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {subs.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#111428]/60 p-10 text-center text-slate-400 text-xs font-medium">
              No past subscription records found.
            </div>
          ) : (
            <div className="space-y-3">
              {subs.map((sub) => (
                <div
                  key={sub._id}
                  className="rounded-2xl border border-white/10 bg-[#12152d] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg transition-all duration-200 hover:border-violet-500/30 hover:bg-[#151936]"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <Crown size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">
                        {sub.premiumService?.title || "Codelura Premium Service"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        Requested: {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Right info */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    <p className="font-black text-emerald-400 text-base">
                      ₹{(sub.finalAmount || 0).toLocaleString("en-IN")}
                    </p>
                    <StatusBadge status={sub.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}