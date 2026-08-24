// components/stats/StatsSection.tsx
"use client";

import { useEffect, useState, useRef, memo } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import StatsSEO from "./stats/StatsSEO";
import LiveCodeEditor from "./stats/LiveCodeEditor";
import TrustStrip from "./stats/TrustStrip";

/* ─── Types ──────────────────────────────────────────────────── */
export interface StatsData {
  developers: number;
  resources: number;
  sessions: number;
  websites: number;
}

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: string;
}

/* ─── Mock API with caching ──────────────────────────────────── */
async function fetchStats(): Promise<StatsData> {
  const response = await fetch('/api/stats', {
    next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  
  return response.json();
}

/* ─── Count Up Hook with performance optimizations ──────────── */
function useCountUp(target: number, inView: boolean): number {
  const [count, setCount] = useState(0);
 const animationRef = useRef<number | null>(null);
const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    if (!inView || target === 0) return;

    const duration = 2000; // 2 seconds
    const startValue = 0;
    const endValue = target;

    const updateCount = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setCount(Math.floor(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    animationRef.current = requestAnimationFrame(updateCount);

  return () => {
  if (animationRef.current !== null) {
    cancelAnimationFrame(animationRef.current);
  }

  animationRef.current = null;
  startTimeRef.current = null;
};
  }, [inView, target]);

  return count;
}

/* ─── Single Stat Counter (memoized) ────────────────────────── */
const StatCounter = memo(function StatCounter({ 
  item, 
  index, 
  inView 
}: { 
  item: StatItem; 
  index: number; 
  inView: boolean;
}) {
  const count = useCountUp(item.value, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/6 cursor-default"
      role="listitem"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08), transparent 70%)" }}
      />

      <span className="mb-4 block text-2xl" aria-hidden="true">{item.icon}</span>

      <p className="text-4xl font-black tabular-nums text-white md:text-5xl">
        {count.toLocaleString()}
        <span className="text-emerald-400">{item.suffix ?? "+"}</span>
      </p>

      <p className="mt-2 text-sm font-medium tracking-wide text-white/45">{item.label}</p>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-400"
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.7 }}
      />
    </motion.div>
  );
});

StatCounter.displayName = 'StatCounter';

/* ─── Main Component ─────────────────────────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Scroll progress for animated timeline line
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  // Fetch data with error handling and caching
  useEffect(() => {
    if (!inView) return;

    let mounted = true;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        const stats = await fetchStats();
        if (mounted) {
          setData(stats);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load stats');
          console.error('Stats fetch error:', err);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [inView]);

  const statItems: StatItem[] = data
    ? [
        { label: "Developers Helped", value: data.developers, icon: "👨‍💻" },
        { label: "Premium Resources", value: data.resources, icon: "📚" },
        { label: "1-on-1 Sessions", value: data.sessions, icon: "🎯" },
        { label: "Websites Built", value: data.websites, icon: "🌐" },
      ]
    : [];

  return (
    <>
      <StatsSEO />
      <SectionWrapper bg="bg-gradient-to-b from-[#06050f] via-[#080814] to-[#0a0a18]">
        <div ref={sectionRef} className="space-y-8 md:space-y-10">

          {/* ── Section Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform Impact
            </span>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
              Numbers That{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Speak for Themselves
              </span>
            </h2>
            <p className="mt-4 text-white/45 max-w-xl mx-auto text-base leading-relaxed">
              Thousands of developers trust Codelura every day to learn faster,
              build smarter, and grow their careers with AI.
            </p>
          </motion.div>

          {/* ── Stats Grid + Code Editor ── */}
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">

            {/* LEFT — Stats Grid */}
            <div>
              {error ? (
                <div className="text-center text-white/50 p-8 border border-red-500/20 rounded-2xl bg-red-500/5">
                  <p>Unable to load statistics</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoading || !data ? (
                <div className="grid grid-cols-2 gap-4" aria-busy="true" aria-label="Loading statistics">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-36 rounded-2xl bg-white/4 animate-pulse border border-white/5"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4" role="list" aria-label="Platform statistics">
                  {statItems.map((item, i) => (
                    <StatCounter key={item.label} item={item} index={i} inView={inView} />
                  ))}
                </div>
              )}

              {/* Timeline Progress Indicator */}
              <div className="mt-8 flex items-center gap-3">
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    style={{ scaleX: lineScaleY, originX: 0 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  />
                </div>
                <span className="text-xs text-white/30 font-mono whitespace-nowrap">
                  Growing daily
                </span>
              </div>
            </div>

            {/* RIGHT — Code Editor */}
            <LiveCodeEditor />
          </div>

          {/* ── Trust Strip ── */}
          <TrustStrip />

        </div>
      </SectionWrapper>
    </>
  );
}