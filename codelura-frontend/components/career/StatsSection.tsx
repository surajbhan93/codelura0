"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Building2, TrendingUp, Star } from "lucide-react";

const STATS_DATA = [
  { 
    label: "Learners placed", 
    value: 24600, 
    suffix: "+",
    icon: Briefcase, 
    change: "+12%", 
    grad: "from-blue-400 to-indigo-500",
    glow: "rgba(99, 102, 241, 0.15)"
  },
  { 
    label: "Hiring partners", 
    value: 310, 
    suffix: "+",
    icon: Building2, 
    change: "+8%", 
    grad: "from-purple-400 to-pink-500",
    glow: "rgba(236, 72, 153, 0.15)"
  },
  { 
    label: "Avg. salary hike", 
    value: 42, 
    suffix: "%",
    icon: TrendingUp, 
    change: "+5%", 
    grad: "from-emerald-400 to-teal-500",
    glow: "rgba(20, 184, 166, 0.15)"
  },
  { 
    label: "Mentor rating", 
    value: 4.8, 
    suffix: " / 5",
    icon: Star, 
    change: "★", 
    grad: "from-amber-400 to-orange-500",
    glow: "rgba(245, 158, 11, 0.15)"
  },
];

function AnimatedCounter({ 
  value, 
  suffix, 
  duration = 1500 
}: { 
  value: number; 
  suffix: string; 
  duration?: number; 
}) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = value;
    const isFloat = !Number.isInteger(end);
    const totalFrames = 60;
    const frameDuration = duration / totalFrames;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * end;

      if (frame >= totalFrames) {
        clearInterval(counter);
        setCount(end);
      } else {
        setCount(isFloat ? Math.round(currentVal * 10) / 10 : Math.round(currentVal));
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [hasStarted, value, duration]);

  // Format with commas if greater than 1000
  const formatNumber = (num: number) => {
    if (Number.isInteger(num)) {
      return num.toLocaleString();
    }
    return num.toFixed(1);
  };

  return (
    <span ref={elementRef}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative border-y border-white/5 bg-[#040612] py-16 text-white overflow-hidden">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-indigo-950/10 blur-[120px]" />
      
      <div className="relative mx-auto max-w-[1536px] px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_DATA.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                style={{
                  animationDelay: `${idx * 100}ms`,
                  boxShadow: `0 0 40px rgba(0,0,0,0.2)`
                }}
                className="group relative flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10 hover:bg-white/[0.03] overflow-hidden"
              >
                {/* Glowing hover background trail */}
                <div 
                  className="absolute -inset-x-20 -top-20 -bottom-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-[40px]"
                  style={{ background: `radial-gradient(circle, ${s.glow} 0%, transparent 70%)` }}
                />

                {/* Animated Icon Container */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/[0.02] text-slate-400 border border-white/5 transition-all duration-300 group-hover:scale-110 group-hover:border-purple-500/20 group-hover:bg-purple-600/10 group-hover:text-white">
                  <Icon size={24} className="transition-transform group-hover:rotate-[8deg]" />
                </div>

                {/* Stat texts */}
                <div className="relative z-10 space-y-1">
                  <div className={`text-3xl font-black bg-gradient-to-r ${s.grad} bg-clip-text text-transparent tracking-tight`}>
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-500 group-hover:text-slate-400 transition-colors">
                      {s.label}
                    </p>
                    {s.change && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {s.change}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom line animation accent */}
                <div 
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
