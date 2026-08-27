import Link from "next/link";
import {
  Globe,
  Bot,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Star,
  Calendar,
  Users,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Layers,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

interface PrimaryService {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string;
  perks: string[];
  metrics: { val: string; label: string }[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  border: string;
  link: string;
}

interface TrustStat {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  iconColor: string;
  bg: string;
  border: string;
}

interface ClientLogo {
  name: string;
  initials: string;
  color: string;
}

/* ─── 3 CORE HERO SERVICES ─── */
const PRIMARY_SERVICES: PrimaryService[] = [
  {
    id: "website",
    badge: "Fast Web Platforms",
    badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    title: "High-Performance Websites & Web Apps",
    desc: "Sub-second Next.js 15 & React platforms with 99+ Core Web Vitals, conversion-first UX, and payment integrations.",
    perks: ["Next.js 15 & React 19", "E-Commerce & SaaS Portals", "SEO & Speed 99+"],
    metrics: [
      { val: "99+", label: "PageSpeed" },
      { val: "<0.8s", label: "Load Time" },
      { val: "+140%", label: "Conversion" },
    ],
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.35)",
    border: "border-cyan-500/30",
    link: "/services/Enquiries?service=Website%20Development",
  },
  {
    id: "ai-bot",
    badge: "Autonomous AI Agents",
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    title: "Custom AI Bots & Workflow Automation",
    desc: "Intelligent RAG AI bots trained on your business data. Deploy 24/7 lead capture and support on WhatsApp and Web.",
    perks: ["Custom Data Training", "WhatsApp & Web Chat", "CRM & Lead Auto-Sync"],
    metrics: [
      { val: "85%", label: "Auto-Resolved" },
      { val: "0.2s", label: "Response" },
      { val: "3.8x", label: "More Leads" },
    ],
    icon: Bot,
    gradient: "from-purple-500 to-pink-600",
    glow: "rgba(168,85,247,0.35)",
    border: "border-purple-500/30",
    link: "/services/Enquiries?service=AI%20Solutions",
  },
  {
    id: "gbp-audit",
    badge: "Google 3-Pack Maps",
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    title: "Google Business Profile Audit & Local SEO",
    desc: "100+ point technical GBP audits and hyper-local SEO campaigns that push your local business into Google Maps top rank.",
    perks: ["100+ Point Audit", "Geo-Grid Rank Boost", "5-Star Review Automation"],
    metrics: [
      { val: "Top 3", label: "Maps Rank" },
      { val: "+320%", label: "Call Growth" },
      { val: "100%", label: "Citations" },
    ],
    icon: MapPin,
    gradient: "from-amber-500 to-emerald-600",
    glow: "rgba(245,158,11,0.35)",
    border: "border-amber-500/30",
    link: "/services/Enquiries?service=GBP%20Audit%20SEO",
  },
];

const TRUST_STATS: TrustStat[] = [
  { icon: Star, value: "250+", label: "Websites Delivered", iconColor: "text-amber-400", bg: "bg-amber-500/8", border: "border-amber-500/20" },
  { icon: Bot, value: "50M+", label: "AI Interactions Handled", iconColor: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20" },
  { icon: MapPin, value: "100+", label: "GBP Audits Completed", iconColor: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
  { icon: Rocket, value: "99.8%", label: "Client Satisfaction", iconColor: "text-rose-400", bg: "bg-rose-500/8", border: "border-rose-500/20" },
];

const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Fiverr", initials: "FV", color: "#1dbf73" },
  { name: "StartupHub", initials: "SH", color: "#6366f1" },
  { name: "CreativeAgency", initials: "CA", color: "#f59e0b" },
  { name: "SaaSCo", initials: "SC", color: "#06b6d4" },
  { name: "ShopBrand", initials: "SB", color: "#ec4899" },
  { name: "TechLabs", initials: "TL", color: "#22c55e" },
  { name: "PixelStudio", initials: "PS", color: "#8b5cf6" },
  { name: "CloudBase", initials: "CB", color: "#f97316" },
];

function ServiceStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes svcFadeUp { from { opacity:0; transform:translateY(36px);} to { opacity:1; transform:translateY(0);} }
          @keyframes marqueeScroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }

          .svc-card { opacity:0; animation: svcFadeUp 0.5s ease-out forwards; }
          .svc-marquee-track {
            animation: marqueeScroll 28s linear infinite;
            will-change: transform;
          }
        `,
      }}
    />
  );
}

function LogoMarquee() {
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <div className="mt-20">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
        Trusted by startups, local brands &amp; high-growth enterprises
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#07060f] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#07060f] to-transparent" />

        <div className="svc-marquee-track flex gap-6 items-center w-max">
          {doubled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-white/8 bg-white/4 px-5 py-3 backdrop-blur"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-black text-white"
                style={{ background: logo.color + "30", color: logo.color }}
              >
                {logo.initials}
              </span>
              <span className="text-sm font-semibold text-white/50 whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <SectionWrapper bg="bg-[#07060f]">
      <ServiceStyles />

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Digital Engineering Services — Codelura",
            description:
              "Codelura delivers high-speed Next.js websites, custom AI bots, and Google Business Profile (GBP) local SEO audits.",
            provider: { "@type": "Organization", name: "Codelura", url: "https://codelura.com/services" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Core Digital Services",
              itemListElement: PRIMARY_SERVICES.map((s, i) => ({
                "@type": "Offer",
                position: i + 1,
                itemOffered: { "@type": "Service", name: s.title, description: s.desc },
              })),
            },
          }),
        }}
      />

      <div className="relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden sm:block">
          <div className="absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-[130px]" />
          <div className="absolute right-0 bottom-0 h-[350px] w-[350px] rounded-full bg-cyan-700/10 blur-[120px]" />
        </div>

        {/* Header */}
        <div className="svc-card mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-purple-300">
            <Zap className="h-3 w-3 fill-purple-400" />
            OUR 3 CORE PILLARS
          </span>

          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl lg:text-6xl tracking-tight">
            Websites, AI Bots &amp;{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              GBP Local Dominance
            </span>
          </h2>

          <p className="mt-4 mx-auto max-w-2xl text-base text-slate-400 leading-relaxed">
            We focus on the 3 fundamental engines that directly increase inquiries, automate operations, and generate revenue for modern businesses.
          </p>
        </div>

        {/* 3 Core Services Grid */}
        <div className="grid gap-7 lg:grid-cols-3" aria-label="Core digital service offerings">
          {PRIMARY_SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`svc-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${s.border} bg-slate-900/60 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_var(--glow)]`}
                style={{ animationDelay: `${i * 0.1}s`, ["--glow" as string]: s.glow }}
              >
                {/* Top glow line on hover */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg,transparent,${s.glow},transparent)` }}
                />

                <div>
                  {/* Badge & Icon Row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.badgeColor}`}>
                      <Sparkles className="w-3 h-3" />
                      {s.badge}
                    </span>

                    <div
                      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg shadow-black/40`}
                      style={{ width: 48, height: 48 }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 mb-6">
                    {s.desc}
                  </p>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-3 mb-6 text-center">
                    {s.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className="text-base font-black text-white">{m.val}</div>
                        <div className="text-[10px] text-slate-400">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Perks list */}
                  <div className="space-y-2 mb-8">
                    {s.perks.map((p) => (
                      <div key={p} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Link */}
                <Link
                  href={s.link}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600"
                >
                  <span>Explore Solution</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Watermark icon */}
                <div
                  className="pointer-events-none absolute -bottom-4 -right-4 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
                  aria-hidden="true"
                >
                  <Icon className="h-32 w-32 text-white" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <div
          className="svc-card mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
          style={{ animationDelay: "0.2s" }}
          aria-label="Service trust statistics"
        >
          {TRUST_STATS.map(({ icon: Icon, value, label, iconColor, bg, border }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2 rounded-2xl border ${border} ${bg} p-6 text-center backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.04]`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/50 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Logo Marquee */}
        <LogoMarquee />

        {/* CTA */}
        <div className="svc-card mt-16 flex flex-col items-center gap-4" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-slate-400">Ready to build your next digital asset?</p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-9 py-4 text-sm font-bold text-white shadow-xl shadow-purple-700/30 transition-all duration-300 hover:scale-[1.04] hover:shadow-purple-700/50 active:scale-[0.97]"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            Explore All Services &amp; Free Audits
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}