// app/seo/page.tsx — SEO Hub Index Page
// Lists all SEO pages organized by category

import type { Metadata } from "next";
import Link from "next/link";
import { getSEOPagesByCategory } from "@/app/seo/seoConfig";

export const metadata: Metadata = {
  title: "Digital Services, Mentorship & Tech Resources — Codelura",
  description:
    "Explore all Codelura services: web development, app development, AI products, tech mentorship, hackathons, jobs, and more. India & worldwide.",
  alternates: { canonical: "https://codelura.com/seo" },
};

const categories = [
  {
    key: "service" as const,
    label: "Digital Services",
    desc: "Web, app, AI, and e-commerce development",
    icon: "⚡",
    color: "#00F5FF",
  },
  {
    key: "location" as const,
    label: "Location Pages",
    desc: "India cities + International markets",
    icon: "📍",
    color: "#FF6B35",
  },
  {
    key: "guidance" as const,
    label: "1:1 Guidance",
    desc: "Personalized mentorship & career help",
    icon: "🎯",
    color: "#22C55E",
  },
  {
    key: "topic" as const,
    label: "Topics & Community",
    desc: "Hackathons, jobs, blogs & more",
    icon: "💡",
    color: "#A855F7",
  },
  {
    key: "product" as const,
    label: "AI Products",
    desc: "Cutting-edge AI-powered solutions",
    icon: "🤖",
    color: "#F59E0B",
  },
];

export default function SEOHubPage() {
  return (
    <main className="min-h-screen bg-[#050810] text-white px-6 py-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <p className="text-xs uppercase tracking-widest text-cyan-400 mb-4 font-semibold">
          Everything on Codelura
        </p>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
          All Services & Resources
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          From web development in Mumbai to AI product development for US clients —
          Codelura has the service, guidance, and community you need.
        </p>
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const pages = getSEOPagesByCategory(cat.key);
        if (!pages.length) return null;

        return (
          <section key={cat.key} className="max-w-5xl mx-auto mb-16">
            {/* Category header */}
            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h2 className="text-xl font-black text-white">{cat.label}</h2>
                <p className="text-gray-500 text-sm">{cat.desc}</p>
              </div>
            </div>

            {/* Pages grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/seo/${page.slug}`}
                  className="group p-5 rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <h3
                    className="font-bold text-white mb-2 group-hover:underline text-sm"
                    style={{ textDecorationColor: cat.color }}
                  >
                    {page.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {page.metaDescription}
                  </p>
                  <div
                    className="mt-3 text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block"
                    style={{ color: cat.color }}
                  >
                    Explore →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <div className="max-w-3xl mx-auto text-center mt-20 p-12 rounded-3xl border border-white/10"
        style={{ background: "rgba(0,245,255,0.05)" }}>
        <h2 className="text-3xl font-black text-white mb-4">
          Not Sure Where to Start?
        </h2>
        <p className="text-gray-400 mb-8">
          Talk to a Codelura expert for free — we&apos;ll point you in the right direction.
        </p>
        <Link
          href="/contact"
          className="px-10 py-4 rounded-xl font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all text-base"
          style={{ boxShadow: "0 0 30px rgba(0,245,255,0.35)" }}
        >
          Get Free Consultation →
        </Link>
      </div>
    </main>
  );
}