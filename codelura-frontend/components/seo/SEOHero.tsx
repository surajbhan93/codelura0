// components/seo/SEOHero.tsx
"use client";

import Link from "next/link";
import { type SEOPageData } from "@/app/seo/seoConfig";

const categoryConfig = {
  service: {
    badge: "🚀 Digital Service",
    accent: "#00F5FF",
    glow: "rgba(0,245,255,0.15)",
    cta: "Get a Free Quote",
    ctaHref: "/contact",
  },
  location: {
    badge: "📍 Local Expertise",
    accent: "#FF6B35",
    glow: "rgba(255,107,53,0.15)",
    cta: "Work With Us",
    ctaHref: "/contact",
  },
  topic: {
    badge: "💡 Explore",
    accent: "#A855F7",
    glow: "rgba(168,85,247,0.15)",
    cta: "Explore Now",
    ctaHref: "#content",
  },
  guidance: {
    badge: "🎯 1:1 Guidance",
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.15)",
    cta: "Book a Session",
    ctaHref: "/contact",
  },
  product: {
    badge: "🤖 AI Product",
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.15)",
    cta: "Start Building",
    ctaHref: "/contact",
  },
};

export default function SEOHero({ page }: { page: SEOPageData }) {
  const cfg = categoryConfig[page.category];

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 text-center overflow-hidden"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${cfg.glow}, transparent 70%), #050810`,
      }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${cfg.accent}22 1px, transparent 1px), linear-gradient(90deg, ${cfg.accent}22 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: cfg.accent }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ background: cfg.accent }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 border"
          style={{
            borderColor: `${cfg.accent}44`,
            background: `${cfg.accent}11`,
            color: cfg.accent,
          }}
        >
          {cfg.badge}
        </div>

        {/* H1 */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight"
          style={{ fontFamily: "'Sora', 'Space Grotesk', sans-serif" }}
        >
          <span className="text-white">{page.h1.split(" ").slice(0, -2).join(" ")}</span>{" "}
          <span style={{ color: cfg.accent }}>
            {page.h1.split(" ").slice(-2).join(" ")}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {page.heroSubtitle}
        </p>

        {/* Keywords pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {page.keywords.slice(0, 5).map((kw) => (
            <span
              key={kw}
              className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={cfg.ctaHref}
            className="px-8 py-4 rounded-xl font-bold text-black text-base transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            style={{ background: cfg.accent, boxShadow: `0 0 30px ${cfg.accent}55` }}
          >
            {cfg.cta}
          </Link>
          <Link
            href="#faq"
            className="px-8 py-4 rounded-xl font-semibold text-white text-base border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            Learn More ↓
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
        <div
          className="w-px h-10 animate-pulse"
          style={{ background: `linear-gradient(to bottom, ${cfg.accent}, transparent)` }}
        />
      </div>
    </section>
  );
}