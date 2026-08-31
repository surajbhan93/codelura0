"use client";

import Link from "next/link";
import { Globe, Bot, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

/* ─── 3 CORE SERVICES (FLIP CARD WITH NO GAP GRID) ─── */
const SERVICES = [
  {
    id: "website",
    icon: Globe,
    titleFront: "Websites & Web Apps",
    titleBack: "High-Performance Websites & Web Apps",
    descFrontLines: [
      "Next.js 15 & React — built for speed.",
      "Core Web Vitals 99+. Conversions maximized.",
    ],
    descBack: "Sub-second Next.js 15 & React platforms with 99+ Core Web Vitals, conversion-first UX, and payment integrations.",
    stats: [
      { val: "99+", label: "PageSpeed" },
      { val: "<0.8s", label: "Load Time" },
      { val: "+140%", label: "Conversion" },
    ],
    features: [
      "Next.js 15 & React 19",
      "E-Commerce & SaaS Portals",
      "SEO & Speed 99+",
    ],
    link: "/services/Enquiries?service=Website%20Development",
    theme: {
      accent: "text-cyan-400",
      badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      dividerColor: "from-cyan-500 to-blue-600",
      backBg: "from-[#051c27] via-[#030e15] to-[#020205]",
      textGrad: "from-cyan-400 to-blue-300",
      btnClass: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white",
    },
  },
  {
    id: "ai-bot",
    icon: Bot,
    titleFront: "Custom AI Bots & Workflow Automation",
    titleBack: "Custom AI Bots & Workflow Automation",
    descFrontLines: [
      "RAG-trained on your business data.",
      "24/7 lead capture on WhatsApp & Web.",
    ],
    descBack: "Intelligent RAG AI bots trained on your business data. Deploy 24/7 lead capture and support on WhatsApp and Web.",
    stats: [
      { val: "85%", label: "Auto-Resolved" },
      { val: "0.2s", label: "Response" },
      { val: "3.8x", label: "More Leads" },
    ],
    features: [
      "Custom Data Training",
      "WhatsApp & Web Chat",
      "CRM & Lead Auto-Sync",
    ],
    link: "/services/Enquiries?service=AI%20Solutions",
    theme: {
      accent: "text-purple-400",
      badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      dividerColor: "from-purple-500 to-pink-600",
      backBg: "from-[#100d2b] via-[#090717] to-[#020205]",
      textGrad: "from-purple-400 to-pink-300",
      btnClass: "bg-gradient-to-r from-violet-600 to-indigo-600 border-none hover:opacity-90 text-white shadow-lg shadow-purple-600/30",
    },
  },
  {
    id: "gbp-audit",
    icon: MapPin,
    titleFront: "GBP Audit & Local SEO",
    titleBack: "Google Business Profile Audit & Local SEO",
    descFrontLines: [
      "100+ point Google Business Profile audit.",
      "Rank in Google Maps 3-Pack. Get more calls.",
    ],
    descBack: "100+ point technical GBP audits and hyper-local SEO campaigns that push your local business into Google Maps top rank.",
    stats: [
      { val: "Top 3", label: "Maps Rank" },
      { val: "+320%", label: "Call Growth" },
      { val: "100%", label: "Citations" },
    ],
    features: [
      "100+ Point Audit",
      "Geo-Grid Rank Boost",
      "5-Star Review Automation",
    ],
    link: "https://vyaparsetiai.codelura.com/dental-audit",
    theme: {
      accent: "text-amber-400",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      dividerColor: "from-amber-500 to-emerald-500",
      backBg: "from-[#2b1002] via-[#150801] to-[#020205]",
      textGrad: "from-amber-400 to-orange-300",
      btnClass: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white",
    },
  },
];

/* ─── SECONDARY QUICK TILES ─── */
const SECONDARY = [
  { title: "Mobile App Development", tag: "Flutter & React Native", slug: "mobile-app-development" },
  { title: "SaaS & Enterprise Software", tag: "ERP · CRM · Automation", slug: "software-development" },
  { title: "Google Ads & Meta PPC", tag: "ROI-Driven Performance", slug: "google-ads" },
  { title: "Shopify & Ecommerce Stores", tag: "Razorpay · Shiprocket", slug: "ecommerce" },
  { title: "WordPress Development", tag: "95+ PageSpeed · WooCommerce", slug: "wordpress-development" },
  { title: "Social Media Marketing", tag: "Instagram · LinkedIn · YouTube", slug: "social-media-marketing" },
];

export default function Services() {
  return (
    <section className="bg-black text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-900/5 blur-[150px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-cyan-900/5 blur-[150px]" />

      <div className="mx-auto max-w-7xl">

        {/* ── Section Label ── */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-slate-500 mb-4">
            What We Deliver
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Our Core Services
          </h2>
        </div>

        {/* ── 3 Primary 3D Flip Cards Grid (Unified Box with Zero spacing - gap-0) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16">
          {SERVICES.map((svc, idx) => {
            const Icon = svc.icon;
            const t = svc.theme;

            // Determine rounded corners dynamically
            const roundedClass =
              idx === 0
                ? "rounded-t-3xl rounded-b-none md:rounded-l-3xl md:rounded-r-none"
                : idx === 2
                ? "rounded-b-3xl rounded-t-none md:rounded-r-3xl md:rounded-l-none"
                : "rounded-none";

            // Determine borders dynamically to form a seamless unified box
            const borderFrontClass =
              idx === 0
                ? "border border-white/10"
                : "border-x border-b md:border-x-0 md:border-y md:border-r border-white/10";

            const borderBackClass =
              idx === 0
                ? "border"
                : "border-x border-b md:border-x-0 md:border-y md:border-r";

            return (
              <div
                key={svc.id}
                className="group w-full h-[450px] [perspective:1000px] cursor-pointer"
              >
                {/* 3D Flip Container */}
                <div className="relative w-full h-full duration-700 transition-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                  {/* ── FRONT SIDE (Original Minimal Design) ── */}
                  <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-between p-8 bg-black [backface-visibility:hidden] shadow-2xl transition-all duration-500 hover:bg-neutral-950/80 ${roundedClass} ${borderFrontClass} ${t.glowColor}`}>
                    
                    {/* Index Top Left Removed */}
                    <div className="w-full flex justify-between" />

                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      {/* Centered Circle Icon */}
                      <div className="mb-7 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                        <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                        {svc.titleFront}
                      </h3>

                      {/* Gradient Divider */}
                      <div className={`h-px w-16 rounded-full bg-gradient-to-r ${t.dividerColor} mb-6 transition-all duration-300 group-hover:w-24`} />

                      {/* Description lines */}
                      <div className="space-y-2 mb-8">
                        {svc.descFrontLines.map((line, idx) => (
                          <p key={idx} className="text-slate-400 text-sm leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Bottom CTA Text */}
                    <div className="w-full text-center pt-2 border-t border-white/5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                        Get Started
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* ── BACK SIDE (Detailed Specs Sheets) ── */}
                  <div
                    className={`absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br ${roundedClass} ${borderBackClass} ${t.backBg}`}
                  >
                    <div>
                      {/* Top Row: Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${t.badgeColor}`}>
                          {svc.badge}
                        </span>
                      </div>

                      {/* Title (Uses front title on back side too) */}
                      <h3 className="text-xl sm:text-2xl font-black text-white mt-5 leading-tight">
                        {svc.titleFront}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-xs text-slate-300 leading-relaxed font-semibold">
                        {svc.descBack}
                      </p>

                      {/* Stats Panel */}
                      <div className="mt-5 grid grid-cols-3 gap-1 border border-white/5 bg-white/[0.02] rounded-2xl p-3 text-center">
                        {svc.stats.map((stat, idx) => (
                          <div key={idx} className="flex flex-col justify-center border-r border-white/5 last:border-none">
                            <span className="text-xs sm:text-sm font-black text-white leading-none">
                              {stat.val}
                            </span>
                            <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Feature Checklist */}
                      <ul className="mt-5 space-y-2">
                        {svc.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-200">
                            <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ${t.accent}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-4 border-t border-white/10">
                      <a
                        href={svc.link}
                        target={svc.link.startsWith("http") ? "_blank" : "_self"}
                        rel={svc.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${t.btnClass}`}
                      >
                        <span>Explore Solution</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* ── Secondary Services Label ── */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            More Offerings
          </span>
        </div>

        {/* ── Secondary Services Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-800/25 rounded-3xl overflow-hidden border border-slate-800/40">
          {SECONDARY.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col bg-black px-6 py-7 transition-all duration-300 hover:bg-neutral-950/80"
            >
              <h4 className="text-sm sm:text-base font-semibold text-white/80 group-hover:text-white transition-colors mb-1.5">
                {s.title}
              </h4>
              <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors font-mono">
                {s.tag}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}