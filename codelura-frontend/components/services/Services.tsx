"use client";

import Link from "next/link";
import { Globe, Bot, MapPin, ArrowRight } from "lucide-react";


/* ─── 3 CORE SERVICES ─── */
const SERVICES = [
  {
    id: "website",
    icon: Globe,
    title: "Website Development",
    dividerColor: "from-cyan-500 to-blue-600",
    lines: [
      "Next.js 15 & React — built for speed.",
      "Core Web Vitals 99+. Conversions maximized.",
    ],
    link: "/services/Enquiries?service=Website%20Development",
  },
  {
    id: "ai-bot",
    icon: Bot,
    title: "Custom AI Bot",
    dividerColor: "from-purple-500 to-pink-600",
    lines: [
      "RAG-trained on your business data.",
      "24/7 lead capture on WhatsApp & Web.",
    ],
    link: "/services/Enquiries?service=AI%20Solutions",
  },
  {
    id: "gbp-audit",
    icon: MapPin,
    title: "GBP Audit & Local SEO",
    dividerColor: "from-amber-500 to-emerald-500",
    lines: [
      "100+ point Google Business Profile audit.",
      "Rank in Google Maps 3-Pack. Get more calls.",
    ],
    link: "https://vyaparsetiai.codelura.com/",
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
    <section className="bg-[#050714] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Section Label ── */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-slate-500 mb-4">
            What We Deliver
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Our Core Services
          </h2>
        </div>

        {/* ── 3 Primary Dark Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-800/60 mb-10">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className="group relative flex flex-col items-center text-center bg-[#0a0b14] px-8 py-14 transition-colors duration-300 hover:bg-[#0e0f1f]"
              >
                {/* Icon */}
                <div className="mb-7 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                  <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  {svc.title}
                </h3>

                {/* Gradient Divider */}
                <div className={`h-px w-16 rounded-full bg-gradient-to-r ${svc.dividerColor} mb-6 transition-all duration-300 group-hover:w-24`} />

                {/* Description lines */}
                <div className="space-y-2 mb-8">
                  {svc.lines.map((line, idx) => (
                    <p key={idx} className="text-slate-400 text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={svc.link}
                  target={svc.link.startsWith("http") ? "_blank" : "_self"}
                  rel={svc.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors group-hover:text-slate-300"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>

              </div>
            );
          })}
        </div>

        {/* ── Secondary Services Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-800/40">
          {SECONDARY.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col bg-[#0a0b14] px-6 py-7 transition-colors hover:bg-[#0e0f1f]"
            >
              <h4 className="text-sm sm:text-base font-semibold text-white/80 group-hover:text-white transition-colors mb-1.5">
                {s.title}
              </h4>
              <p className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors font-mono">
                {s.tag}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}