"use client";

import { Trophy, Rocket, Clock3 } from "lucide-react";

export default function HackathonPage() {
  return (
    <div className="min-h-screen bg-[#0b0d17] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">

        {/* Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Trophy size={42} className="text-indigo-400" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Hackathon Portal
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
          We’re building something exciting for developers, creators, and innovators.
          Soon you'll be able to join live hackathons, compete with teams,
          track leaderboards, and win rewards.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

          <div
            className="rounded-2xl p-5 bg-white/5 border border-white/10"
          >
            <Rocket className="mx-auto text-indigo-400 mb-3" size={26} />
            <h3 className="font-semibold mb-1">Live Events</h3>
            <p className="text-sm text-gray-400">
              Participate in exciting coding competitions.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 bg-white/5 border border-white/10"
          >
            <Trophy className="mx-auto text-yellow-400 mb-3" size={26} />
            <h3 className="font-semibold mb-1">Leaderboards</h3>
            <p className="text-sm text-gray-400">
              Compete with top developers and rank globally.
            </p>
          </div>

          <div
            className="rounded-2xl p-5 bg-white/5 border border-white/10"
          >
            <Clock3 className="mx-auto text-pink-400 mb-3" size={26} />
            <h3 className="font-semibold mb-1">Coming Soon</h3>
            <p className="text-sm text-gray-400">
              New challenges and rewards launching shortly.
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Under Development
        </div>
      </div>
    </div>
  );
}