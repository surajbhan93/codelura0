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
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-10 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          The numbers
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          Placements are climbing every year
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Placements area chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Learners placed per year</p>
              <p className="text-xs text-slate-500">Across all hiring partners</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
              +44% YoY
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementData}>
                <defs>
                  <linearGradient id="placementFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                    background: "white",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="placements"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fill="url(#placementFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill demand bar chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-slate-900">Fastest-growing skills</p>
          <p className="mb-6 text-xs text-slate-500">Demand growth, last 12 months</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillDemand} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="skill"
                  tick={{ fontSize: 12, fill: "#334155", fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 13,
                    background: "white",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value}%`, "Growth"]}
                />
                <Bar dataKey="growth" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}