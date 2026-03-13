"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Stats = {
  totalRequests: number;
  cacheSize: number;
  rateLimitRemaining: number;
  config: {
    MAX_AI_CALLS_PER_DAY: number;
    MIN_RULE_SCORE_FOR_AI: number;
    RATE_LIMIT_PER_MINUTE: number;
  };
};

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  icon: string;
}) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm bg-white flex items-start gap-4`}>
      <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-gray-900 mt-0.5">{value}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{value} used</span>
        <span>{pct.toFixed(1)}% of {max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AIUsageStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hackathons/ai/usage-stats");
      setStats(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Usage Stats Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dailyUsagePct = stats
    ? Math.min((stats.totalRequests / stats.config.MAX_AI_CALLS_PER_DAY) * 100, 100)
    : 0;

  const rateLimitPct = stats
    ? Math.min(
        (stats.rateLimitRemaining / stats.config.RATE_LIMIT_PER_MINUTE) * 100,
        100
      )
    : 0;

  const dailyBarColor =
    dailyUsagePct >= 90 ? "bg-red-500" : dailyUsagePct >= 60 ? "bg-yellow-400" : "bg-emerald-500";

  const rateLimitBarColor =
    rateLimitPct <= 20 ? "bg-red-500" : rateLimitPct <= 50 ? "bg-yellow-400" : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Usage Statistics</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Real-time AI call tracking & rate limit monitoring
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>
        )}

        {loading && !stats ? (
          <div className="text-center py-16 text-gray-400 animate-pulse">Loading AI Usage Stats...</div>
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Requests"
                value={stats.totalRequests}
                sub="Since system start"
                color="bg-blue-50 text-blue-500"
                icon="📊"
              />
              <StatCard
                label="Cache Size"
                value={stats.cacheSize}
                sub="Cached AI responses"
                color="bg-purple-50 text-purple-500"
                icon="💾"
              />
              <StatCard
                label="Rate Limit Left"
                value={stats.rateLimitRemaining}
                sub="Calls left this minute"
                color={stats.rateLimitRemaining <= 5 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}
                icon="⚡"
              />
            </div>

            {/* Daily Usage */}
            <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <h2 className="font-semibold text-gray-800">Daily AI Call Usage</h2>
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                  dailyUsagePct >= 90
                    ? "bg-red-100 text-red-600"
                    : dailyUsagePct >= 60
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {dailyUsagePct >= 90 ? "Critical" : dailyUsagePct >= 60 ? "High" : "Normal"}
                </span>
              </div>
              <ProgressBar
                value={stats.totalRequests}
                max={stats.config.MAX_AI_CALLS_PER_DAY}
                color={dailyBarColor}
              />
            </div>

            {/* Rate Limit This Minute */}
            <div className="bg-white rounded-xl border p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <h2 className="font-semibold text-gray-800">Rate Limit (Per Minute)</h2>
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                  rateLimitPct <= 20
                    ? "bg-red-100 text-red-600"
                    : rateLimitPct <= 50
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {stats.rateLimitRemaining} / {stats.config.RATE_LIMIT_PER_MINUTE} remaining
                </span>
              </div>
              <ProgressBar
                value={stats.rateLimitRemaining}
                max={stats.config.RATE_LIMIT_PER_MINUTE}
                color={rateLimitBarColor}
              />
            </div>

            {/* AI Config */}
            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚙️</span>
                <h2 className="font-semibold text-gray-800">AI Configuration</h2>
              </div>
              <div className="divide-y">
                {[
                  {
                    label: "Max AI Calls Per Day",
                    value: stats.config.MAX_AI_CALLS_PER_DAY,
                    desc: "Hard limit on total AI API calls allowed in 24 hours",
                  },
                  {
                    label: "Min Rule Score For AI",
                    value: stats.config.MIN_RULE_SCORE_FOR_AI,
                    desc: "Submission must score at least this much before AI judging is triggered",
                  },
                  {
                    label: "Rate Limit Per Minute",
                    value: stats.config.RATE_LIMIT_PER_MINUTE,
                    desc: "Max AI calls allowed per minute to prevent burst usage",
                  },
                ].map((item) => (
                  <div key={item.label} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">Failed to load stats. Try refreshing.</div>
        )}

      </div>
    </div>
  );
}