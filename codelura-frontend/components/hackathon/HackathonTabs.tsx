"use client";

import { useEffect, useState } from "react";
import HackathonCard from "./HackathonCard";
import api from "@/lib/api";

const tabs = ["upcoming", "ongoing", "completed"] as const;
type TabStatus = typeof tabs[number];

// Singleton cache with TTL (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;
const singletonCache = new Map<string, { data: any[]; timestamp: number }>();

export default function HackathonTabs() {
  const [activeTab, setActiveTab] = useState<TabStatus>("upcoming");
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHackathons = async (status: string) => {
    const now = Date.now();
    const cached = singletonCache.get(status);

    if (cached && now - cached.timestamp < CACHE_TTL) {
      setHackathons(cached.data);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/hackathons?status=${status}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setHackathons(data);

      singletonCache.set(status, { data, timestamp: now });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons(activeTab);
  }, [activeTab]);

  return (
    <div id="hackathon-tabs" className="space-y-8">
      {/* Tabs Menu */}
      <div className="flex gap-8 border-b border-white/10 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm sm:text-base font-extrabold capitalize transition-all relative whitespace-nowrap ${
              activeTab === tab
                ? "text-violet-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "upcoming" ? "⚡ Upcoming Hackathons" : tab === "ongoing" ? "🔴 Live Hackathons" : "🏆 Past Winners & Concluded"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full shadow-lg shadow-violet-500/50" />
            )}
          </button>
        ))}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-900/60 rounded-3xl border border-white/10 overflow-hidden space-y-4 p-5 animate-pulse">
              <div className="h-48 bg-slate-800/60 rounded-2xl" />
              <div className="h-6 bg-slate-800/60 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800/40 rounded" />
                <div className="h-4 bg-slate-800/40 rounded w-5/6" />
              </div>
              <div className="h-10 bg-slate-800/60 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-16 bg-rose-500/10 rounded-3xl border border-rose-500/20 text-rose-300">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold">Unable to load hackathons</h3>
          <p className="text-xs text-rose-400 mt-1 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchHackathons(activeTab)}
            className="mt-6 bg-rose-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && hackathons.length === 0 && (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-dashed border-white/10">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white">No {activeTab} hackathons found</h3>
          <p className="text-slate-400 text-sm mt-2">Check back soon for new coding challenges and rewards!</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && !error && hackathons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id || hackathon._id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
}