"use client";

import Link from "next/link";
import {
  Globe,
  Smartphone,
  Code2,
  Search,
  Megaphone,
  Share2,
  ArrowRight,
  ShieldCheck,
  Cloud,
} from "lucide-react";

type Service = {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  accent: "blue" | "indigo" | "cyan" | "violet";
};

const accentStyles: Record<
  Service["accent"],
  { iconBg: string; iconHover: string; ring: string; chip: string }
> = {
  blue: {
    iconBg: "bg-blue-50 text-blue-600",
    iconHover: "group-hover:bg-blue-600 group-hover:text-white",
    ring: "hover:border-blue-300 hover:shadow-[0_20px_60px_-20px_rgba(37,99,235,0.3)]",
    chip: "bg-blue-50 text-blue-700",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600",
    iconHover: "group-hover:bg-indigo-600 group-hover:text-white",
    ring: "hover:border-indigo-300 hover:shadow-[0_20px_60px_-20px_rgba(79,70,229,0.3)]",
    chip: "bg-indigo-50 text-indigo-700",
  },
  cyan: {
    iconBg: "bg-cyan-50 text-cyan-600",
    iconHover: "group-hover:bg-cyan-600 group-hover:text-white",
    ring: "hover:border-cyan-300 hover:shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)]",
    chip: "bg-cyan-50 text-cyan-700",
  },
  violet: {
    iconBg: "bg-violet-50 text-violet-600",
    iconHover: "group-hover:bg-violet-600 group-hover:text-white",
    ring: "hover:border-violet-300 hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.3)]",
    chip: "bg-violet-50 text-violet-700",
  },
};

const services: Service[] = [
  {
    title: "Website Development",
    slug: "website-development",
    icon: Globe,
    accent: "blue",
    description:
      "Professional business websites, landing pages and enterprise web applications.",
    features: ["Responsive", "SEO Ready", "Fast Loading"],
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    icon: Smartphone,
    accent: "indigo",
    description:
      "Android, iOS and cross-platform mobile applications for startups and enterprises.",
    features: ["Android", "iOS", "Flutter"],
  },
  {
    title: "Software Development",
    slug: "software-development",
    icon: Code2,
    accent: "cyan",
    description:
      "Custom CRM, ERP, SaaS and enterprise software development solutions.",
    features: ["CRM", "ERP", "SaaS"],
  },
  {
    title: "SEO Services",
    slug: "seo-services",
    icon: Search,
    accent: "violet",
    description:
      "Increase your rankings with technical SEO, local SEO and content marketing.",
    features: ["Local SEO", "Technical SEO", "Backlinks"],
  },
  {
    title: "Google Ads",
    slug: "google-ads",
    icon: Megaphone,
    accent: "blue",
    description:
      "Generate qualified leads and sales through Google Search and Display Ads.",
    features: ["PPC", "Lead Generation", "ROI Focused"],
  },
  {
    title: "Social Media Marketing",
    slug: "social-media-marketing",
    icon: Share2,
    accent: "indigo",
    description:
      "Build your brand with content creation and paid social media campaigns.",
    features: ["Instagram", "Facebook", "LinkedIn"],
  },
  {
    title: "Cloud Solutions",
    slug: "cloud-solutions",
    icon: Cloud,
    accent: "cyan",
    description:
      "Scalable cloud infrastructure, deployment and DevOps solutions.",
    features: ["AWS", "Azure", "DevOps"],
  },
  {
    title: "Cyber Security",
    slug: "cyber-security",
    icon: ShieldCheck,
    accent: "violet",
    description:
      "Security audits, penetration testing and enterprise security solutions.",
    features: ["VAPT", "Monitoring", "Protection"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 md:py-24 lg:py-28"
    >
      {/* Background Effects */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px] sm:h-96 sm:w-96 sm:blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-3.5 py-1.5 text-xs font-semibold text-blue-600 sm:px-4 sm:py-2 sm:text-sm">
            Our Services
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
            End-to-End Digital Solutions
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:mt-5 sm:text-lg">
            We help businesses build, scale and grow with websites,
            mobile apps, software development and digital marketing services.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:grid-cols-4">
          {[
            ["150+", "Projects Delivered"],
            ["100+", "Happy Clients"],
            ["40+", "Industries Served"],
            ["24/7", "Support Available"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm sm:p-6"
            >
              <h3 className="text-2xl font-bold text-blue-600 sm:text-3xl">
                {value}
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 sm:mt-2 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7">
          {services.map((service) => {
            const Icon = service.icon;
            const accent = accentStyles[service.accent];

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-500 active:scale-[0.98] sm:p-8 sm:hover:-translate-y-2 lg:hover:-translate-y-3 ${accent.ring}`}
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-current opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.07]" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all sm:h-16 sm:w-16 ${accent.iconBg} ${accent.iconHover}`}
                    >
                      <Icon size={26} className="sm:hidden" />
                      <Icon size={30} className="hidden sm:block" />
                    </div>

                    <ArrowRight
                      size={18}
                      className="text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-3">
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${accent.chip}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600 sm:mt-6">
                    Learn More
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white sm:mt-20 sm:p-10">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Ready to Build Your Next Project?
          </h3>

          <p className="mx-auto mt-3 max-w-3xl text-sm text-blue-100 sm:mt-4 sm:text-base">
            Whether you need a website, mobile app, software solution,
            SEO campaign or digital marketing strategy, our experts are
            ready to help.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-6 py-3 text-center font-semibold text-blue-600 transition hover:scale-105"
            >
              Get Free Consultation
            </Link>

            <Link
              href="/portfolio"
              className="rounded-xl border border-white/30 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              View Portfolio
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border border-white/30 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Pricing Plans
            </Link>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mx-auto mt-12 max-w-5xl text-center sm:mt-16">
          <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Codelura Technologies provides professional website development,
            mobile app development, custom software development, SEO services,
            Google Ads management, cloud solutions and cyber security services
            for startups, SMEs and enterprises across India.
          </p>
        </div>
      </div>
    </section>
  );
}