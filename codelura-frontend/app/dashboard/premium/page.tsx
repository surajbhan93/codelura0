"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

/* ================= TYPES ================= */
type Subscription = {
  _id: string;
  status: "pending" | "approved" | "rejected" | "expired" | "suspended";
  startDate?: string;
  endDate?: string;
  createdAt: string;
  finalAmount: number;
  premiumService: {
    title: string;
    price: number;
    description?: string;
  };
};

/* ================= STATUS CONFIG ================= */
const STATUS_CONFIG = {
  approved: {
    label: "Active",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  expired: {
    label: "Expired",
    bg: "bg-gray-50",
    text: "text-gray-500",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
  suspended: {
    label: "Suspended",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
};

/* ================= BADGE COMPONENT ================= */
function StatusBadge({ status }: { status: Subscription["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${accent ?? "text-gray-800"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function PremiumPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── FETCH ── */
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await api.get("/premium/my-subscriptions");
        setSubs(res.data.subs || []);
      } catch {
        setError("Subscriptions load nahi ho sakin. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, []);

  /* ── DERIVED ── */
  const active = subs.find((s) => s.status === "approved");
  const pending = subs.filter((s) => s.status === "pending");
  const totalSpent = subs
    .filter((s) => s.status === "approved")
    .reduce((acc, s) => acc + s.finalAmount, 0);

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading your subscriptions…</p>
        </div>
      </div>
    );
  }

  /* ── ERROR STATE ── */
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            Premium Dashboard
            <span className="text-yellow-400 text-xl">👑</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Apne premium plans aur history dekhen
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/premium")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Plan
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Subscriptions"
          value={String(subs.length)}
          sub="All time"
        />
        <StatCard
          label="Total Spent"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          sub="Approved plans"
          accent="text-indigo-600"
        />
        <StatCard
          label="Pending"
          value={String(pending.length)}
          sub="Awaiting approval"
          accent={pending.length > 0 ? "text-amber-600" : "text-gray-800"}
        />
      </div>

      {/* ── ACTIVE PLAN CARD ── */}
      {active ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
          {/* Decorative ring */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-indigo-200 text-xs font-medium uppercase tracking-widest">
                Current Plan
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm border border-white/20">
                Active ✓
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-1">
              {active.premiumService?.title}
            </h2>

            <p className="text-2xl font-bold mt-2">
              ₹{active.finalAmount.toLocaleString("en-IN")}
              <span className="text-sm font-normal text-indigo-200 ml-1">paid</span>
            </p>

            {/* Expiry & days left */}
            <div className="mt-4 flex items-center gap-4 flex-wrap">
              {active.startDate && (
                <div>
                  <p className="text-indigo-200 text-xs">Start</p>
                  <p className="text-sm font-medium">
                    {new Date(active.startDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {active.endDate && (
                <div>
                  <p className="text-indigo-200 text-xs">Expiry</p>
                  <p className="text-sm font-medium">
                    {new Date(active.endDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {daysLeft !== null && (
                <div
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
                    urgency === "critical"
                      ? "bg-red-400/30 text-red-100"
                      : urgency === "warning"
                      ? "bg-yellow-400/30 text-yellow-100"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                </div>
              )}
            </div>

            {/* Progress bar for days remaining */}
            {active.startDate && active.endDate && daysLeft !== null && (
              <div className="mt-5">
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      urgency === "critical"
                        ? "bg-red-300"
                        : urgency === "warning"
                        ? "bg-yellow-300"
                        : "bg-white"
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
            <div className="mt-5 flex gap-3 flex-wrap">
              {daysLeft !== null && daysLeft > 0 && daysLeft <= 5 && (
                <button
                  onClick={() => (window.location.href = "/premium")}
                  className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  🔄 Renew Plan
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/premium")}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
              >
                🚀 Upgrade
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── NO ACTIVE PLAN ── */
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </div>
          <h3 className="text-gray-700 font-semibold text-lg mb-1">
            Koi Active Plan Nahi
          </h3>
          <p className="text-gray-400 text-sm mb-5">
            Premium benefits unlock karein — aaj hi plan lein
          </p>
          <button
            onClick={() => (window.location.href = "/premium")}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            🚀 Premium Lein
          </button>
        </div>
      )}

      {/* ── SUBSCRIPTION HISTORY ── */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Subscription History
        </h2>

        {subs.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Abhi tak koi subscription nahi hai.
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => (
              <div
                key={sub._id}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 010 3.204 3.745 3.745 0 01-3.204 3.204 3.745 3.745 0 01-3.068 1.593 3.745 3.745 0 01-3.068-1.593 3.746 3.746 0 01-3.204-3.204 3.745 3.745 0 01-1.593-3.068 3.745 3.745 0 011.593-3.068 3.745 3.745 0 013.204-3.204 3.745 3.745 0 013.068-1.593 3.745 3.745 0 013.068 1.593A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {sub.premiumService?.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    ₹{sub.finalAmount.toLocaleString("en-IN")}
                  </p>
                  <StatusBadge status={sub.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}