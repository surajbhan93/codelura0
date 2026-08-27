"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, Building2, Star, TrendingUp } from "lucide-react";

/* ─── Stat data ─── */
const stats = [
  {
    value: 250,
    suffix: "+",
    label: "Happy Clients",
    sublabel: "Across India",
    icon: Users,
    grad: "from-violet-500 to-purple-700",
    glow: "rgba(139,92,246,0.4)",
    numColor: "from-violet-300 to-purple-400",
  },
  {
    value: 500,
    suffix: "+",
    label: "Projects Delivered",
    sublabel: "On time, on budget",
    icon: Briefcase,
    grad: "from-cyan-400 to-blue-600",
    glow: "rgba(6,182,212,0.4)",
    numColor: "from-cyan-300 to-blue-400",
  },
  {
    value: 50,
    suffix: "+",
    label: "Industries Served",
    sublabel: "Nationwide reach",
    icon: Building2,
    grad: "from-fuchsia-500 to-pink-700",
    glow: "rgba(217,70,239,0.4)",
    numColor: "from-fuchsia-300 to-pink-400",
  },
  {
    value: 99,
    suffix: "%",
    label: "Client Satisfaction",
    sublabel: "4.9 / 5.0 avg rating",
    icon: Star,
    grad: "from-amber-400 to-orange-500",
    glow: "rgba(251,191,36,0.4)",
    numColor: "from-amber-300 to-orange-400",
  },
];

/* ─── Animated counter using IntersectionObserver ─── */
function Counter({ end, suffix, colorClass }: { end: number; suffix: string; colorClass: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref} className={`bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#04040a] py-12 sm:py-16 text-white">
      {/* Background glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-indigo-950/20 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            Our Achievements
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Trusted By Businesses
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Across Industries
            </span>
          </h2>
          <p className="mt-5 text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
            Delivering software, websites and digital growth with measurable, real-world results.
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: "linear-gradient(145deg, #09090f 0%, #07070d 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 50px ${stat.glow}, 0 0 15px ${stat.glow}`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = stat.glow;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
                }}
              >
                {/* Icon with gradient border ring */}
                <div className="relative mb-6 self-start">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.grad} p-[1.5px]`}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#09090f]">
                      <Icon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  {/* Glow behind icon */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    style={{ background: stat.glow }}
                  />
                </div>

                {/* Big number */}
                <div className="text-5xl sm:text-6xl font-black tracking-tight mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} colorClass={stat.numColor} />
                </div>

                {/* Label */}
                <p className="text-white/80 font-bold text-base mb-1">
                  {stat.label}
                </p>
                <p className="text-slate-600 text-xs font-mono group-hover:text-slate-400 transition-colors">
                  {stat.sublabel}
                </p>

                {/* Bottom gradient divider — grows on hover */}
                <div
                  className={`mt-6 h-[2px] w-10 rounded-full bg-gradient-to-r ${stat.grad} transition-all duration-500 group-hover:w-full`}
                />
              </div>
            );
          })}
        </div>

        {/* ── Bottom trust strip ── */}
        <div className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-6 text-center">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl mx-auto">
            Codelura Technologies has successfully delivered custom software, business websites, eCommerce solutions,
            mobile applications, SEO campaigns and digital marketing services for startups, enterprises and local
            businesses across multiple industries.
          </p>
        </div>
      </div>
    </section>
  );
}