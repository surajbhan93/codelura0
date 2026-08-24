"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  Building2,
  Star,
} from "lucide-react";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
};

const stats: Stat[] = [
  {
    value: 100,
    suffix: "+",
    label: "Happy Clients",
    icon: Users,
  },
  {
    value: 150,
    suffix: "+",
    label: "Projects Delivered",
    icon: Briefcase,
  },
  {
    value: 15,
    suffix: "+",
    label: "Industries Served",
    icon: Building2,
  },
  {
    value: 99,
    suffix: "%",
    label: "Client Satisfaction",
    icon: Star,
  },
];

function Counter({
  end,
  suffix,
}: {
  end: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-24 bg-[#030712]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.20),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Our Achievements
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
            Trusted By Businesses
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Across Industries
            </span>
          </h2>

          <p className="mt-5 text-lg text-slate-400">
            Delivering high-quality software, websites and digital growth
            solutions with measurable business results.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-5xl font-extrabold text-white">
                    <Counter
                      end={stat.value}
                      suffix={stat.suffix}
                    />
                  </h3>

                  <p className="mt-3 text-slate-400 font-medium">
                    {stat.label}
                  </p>

                  <div className="mt-5 h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 group-hover:w-24" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Content */}
        <div className="mt-20 text-center">
          <p className="mx-auto max-w-4xl text-slate-400 leading-8">
            Codelura Technologies has successfully delivered custom software,
            business websites, eCommerce solutions, mobile applications,
            SEO campaigns and digital marketing services for startups,
            enterprises and local businesses across multiple industries.
          </p>
        </div>
      </div>
    </section>
  );
}