"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ShoppingCart,
  LayoutDashboard,
  Globe,
  Rocket,
  Code2,
  Star,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";

/* ─── Types ──────────────────────────────────────────────────── */
interface Service {
  title: string;
  desc: string;
  perks: string[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
  border: string;
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

/* ─── Data ───────────────────────────────────────────────────── */
const SERVICES: Service[] = [
  {
    title: "E-Commerce Websites",
    desc: "High-performance online stores with payment gateway, cart, admin & order management.",
    perks: ["Stripe & Razorpay", "Admin Dashboard", "Mobile-First"],
    icon: ShoppingCart,
    gradient: "from-orange-500 to-rose-500",
    glow: "rgba(249,115,22,0.3)",
    border: "border-orange-500/20",
  },
  {
    title: "SaaS Dashboards",
    desc: "Scalable SaaS products with auth, subscriptions, analytics and multi-tenancy.",
    perks: ["Auth & Billing", "Analytics Panel", "API Ready"],
    icon: LayoutDashboard,
    gradient: "from-violet-500 to-indigo-500",
    glow: "rgba(139,92,246,0.3)",
    border: "border-violet-500/20",
  },
  {
    title: "Startup Landing Pages",
    desc: "Conversion-focused landing pages engineered for startup launches and growth.",
    perks: ["SEO Optimised", "Fast Load", "A/B Ready"],
    icon: Rocket,
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16,185,129,0.3)",
    border: "border-emerald-500/20",
  },
  {
    title: "Admin Panels",
    desc: "Secure role-based admin panels with data tables, filters and bulk operations.",
    perks: ["Role Access", "Data Tables", "Export CSV"],
    icon: Code2,
    gradient: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
    border: "border-amber-500/20",
  },
  {
    title: "Portfolio Websites",
    desc: "Modern personal & business portfolios that build credibility and global visibility.",
    perks: ["Custom Domain", "CMS Blog", "Dark Mode"],
    icon: Globe,
    gradient: "from-pink-500 to-fuchsia-500",
    glow: "rgba(236,72,153,0.3)",
    border: "border-pink-500/20",
  },
  {
    title: "Full-Stack Projects",
    desc: "End-to-end full-stack solutions using Next.js, Node, Prisma & cloud infra.",
    perks: ["Next.js 14", "PostgreSQL", "Deployed"],
    icon: LayoutDashboard,
    gradient: "from-cyan-500 to-blue-500",
    glow: "rgba(6,182,212,0.3)",
    border: "border-cyan-500/20",
  },
];

const TRUST_STATS: TrustStat[] = [
  {
    icon: Star,
    value: "200+",
    label: "Websites Delivered",
    iconColor: "text-amber-400",
    bg: "bg-amber-500/8",
    border: "border-amber-500/20",
  },
  {
    icon: Calendar,
    value: "4+ Yrs",
    label: "Industry Experience",
    iconColor: "text-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/20",
  },
  {
    icon: Users,
    value: "Global",
    label: "Clients Worldwide",
    iconColor: "text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/20",
  },
  {
    icon: Rocket,
    value: "48hrs",
    label: "Average First Draft",
    iconColor: "text-rose-400",
    bg: "bg-rose-500/8",
    border: "border-rose-500/20",
  },
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

/* ─── Service Card ───────────────────────────────────────────── */
function ServiceCard({ s, i }: { s: Service; i: number }) {
  const Icon = s.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="group relative flex flex-col"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className={`relative h-full overflow-hidden rounded-3xl border ${s.border} bg-white/4 p-7 backdrop-blur-xl transition-all duration-300`}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 48px ${s.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Top glow line on hover */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg,transparent,${s.glow},transparent)` }}
        />

        {/* Icon */}
        <div
          className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} shadow-lg`}
          style={{ width: 52, height: 52 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Title & desc */}
        <h3 className="mb-2 text-base font-black text-white">{s.title}</h3>
        <p className="text-sm leading-relaxed text-white/45">{s.desc}</p>

        {/* Perks */}
        <div className="mt-5 flex flex-wrap gap-2">
          {s.perks.map((p) => (
            <span
              key={p}
              className={`inline-flex items-center gap-1 rounded-full border ${s.border} bg-white/4 px-2.5 py-1 text-[10px] font-semibold text-white/50`}
            >
              <CheckCircle2 className="h-2.5 w-2.5 text-white/40" />
              {p}
            </span>
          ))}
        </div>

        {/* Arrow CTA */}
        <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-white/30 transition-all duration-300 group-hover:text-white/70">
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

        {/* Watermark icon */}
        <div
          className="pointer-events-none absolute -bottom-3 -right-3 opacity-[0.04] transition-opacity duration-300 group-hover:opacity-[0.07]"
          aria-hidden="true"
        >
          <Icon className="h-24 w-24 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Marquee Logos ──────────────────────────────────────────── */
function LogoMarquee() {
  const doubled = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <div className="mt-24">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/25">
        Trusted by startups, brands &amp; global clients
      </p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#07060f] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#07060f] to-transparent" />

        <motion.div
          className="flex gap-6 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
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
              <span className="text-sm font-semibold text-white/45 whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <SectionWrapper bg="bg-[#07060f]">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Website Development Services — Codelura",
            description:
              "Codelura offers e-commerce, SaaS dashboards, landing pages, admin panels, portfolios and full-stack development services.",
            provider: { "@type": "Organization", name: "Codelura", url: "https://codelura.com" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Web Development Services",
              itemListElement: SERVICES.map((s, i) => ({
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
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
          <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-700/8 blur-[140px]" />
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />
        </div>

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <Zap className="h-3 w-3 fill-violet-400" />
            Professional Development
          </span>

          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            Website Development{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="mt-4 mx-auto max-w-2xl text-base text-white/40 leading-relaxed">
            We design and develop high-quality websites, SaaS platforms and
            e-commerce solutions — trusted by clients worldwide.
          </p>
        </motion.div>

        {/* ── Services Grid ── */}
        <div
          className="grid gap-5 sm:grid-cols-2 md:grid-cols-3"
          aria-label="Web development service offerings"
        >
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} s={s} i={i} />
          ))}
        </div>

        {/* ── Trust Stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
          aria-label="Service trust statistics"
        >
          {TRUST_STATS.map(({ icon: Icon, value, label, iconColor, bg, border }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`flex flex-col items-center gap-2 rounded-2xl border ${border} ${bg} p-6 text-center backdrop-blur`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/40 font-medium">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Logo Marquee ── */}
        <LogoMarquee />

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <p className="text-sm text-white/30">
            Ready to build something great?
          </p>
          <Link href="/services" aria-label="View all Codelura web development services">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-9 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-700/30 transition-all duration-300 hover:shadow-violet-700/55"
            >
              <Sparkles className="h-4 w-4" />
              View All Services
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}