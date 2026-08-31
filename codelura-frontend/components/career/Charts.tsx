// components/Charts.tsx
"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const placementData = [
  { year: "2021", placements: 1200 },
  { year: "2022", placements: 2400 },
  { year: "2023", placements: 4100 },
  { year: "2024", placements: 6800 },
  { year: "2025", placements: 9800 },
];

const skillDemand = [
  { skill: "AI / ML", growth: 92 },
  { skill: "Cloud", growth: 78 },
  { skill: "Data Science", growth: 74 },
  { skill: "Frontend", growth: 61 },
  { skill: "DevOps", growth: 55 },
];

export default function Charts() {
  return (
    <section className="relative mx-auto max-w-[1536px] px-4 sm:px-8 md:px-12 lg:px-16 py-20 text-white overflow-hidden bg-[#040612]">
      {/* GPU-efficient ambient glows (Zero JS overhead) */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-1/3 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-indigo-500/5 blur-[130px]" />

      <div className="relative z-10 mb-10 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
          The numbers
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          Placements are climbing every year
        </h2>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Placements area chart */}
        <div className="rounded-2xl border border-white/5 bg-[#0a0c1e]/40 p-6 shadow-2xl hover:-translate-y-1 hover:border-purple-500/20 hover:bg-[#0d0f28]/60 transition-all duration-300 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Learners placed per year</p>
              <p className="text-xs text-slate-400">Across all hiring partners</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              +44% YoY
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementData}>
                <defs>
                  <linearGradient id="placementFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: 12,
                    background: "#0d0f28",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#a855f7", fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="placements"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#placementFill)"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill demand bar chart */}
        <div className="rounded-2xl border border-white/5 bg-[#0a0c1e]/40 p-6 shadow-2xl hover:-translate-y-1 hover:border-indigo-500/20 hover:bg-[#0d0f28]/60 transition-all duration-300">
          <p className="text-sm font-bold text-white">Fastest-growing skills</p>
          <p className="mb-6 text-xs text-slate-400">Demand growth, last 12 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemand} layout="vertical" margin={{ left: 10 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="skill"
                  tick={{ fontSize: 11, fill: "#cbd5e1", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: 12,
                    background: "#0d0f28",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#6366f1", fontWeight: 700 }}
                  formatter={(value) => [`${value}%`, "Growth"]}
                />
                <Bar 
                  dataKey="growth" 
                  fill="url(#barFill)" 
                  radius={[0, 6, 6, 0]} 
                  barSize={14} 
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}