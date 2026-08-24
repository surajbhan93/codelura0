// ═══════════════════════════════════════════════════════════════
// components/seo/SEOServices.tsx
// ═══════════════════════════════════════════════════════════════
import type { SEOPageData } from "@/seo/seoConfig";

const serviceFeatures: Record<string, { icon: string; features: string[] }> = {
  service: {
    icon: "⚡",
    features: [
      "Custom solution tailored to your needs",
      "Fast delivery & agile development",
      "Dedicated project manager",
      "Post-launch support & maintenance",
      "Scalable architecture",
      "SEO-ready from day one",
    ],
  },
  location: {
    icon: "🌍",
    features: [
      "Local market understanding",
      "Regional language support",
      "Timezone-compatible communication",
      "Local payment gateway integration",
      "GST invoicing for Indian clients",
      "GDPR/compliance for international",
    ],
  },
  guidance: {
    icon: "🎯",
    features: [
      "1:1 personalized sessions",
      "Senior developer mentors (5–15 yrs exp)",
      "Flexible scheduling",
      "Code review & feedback",
      "Interview & career prep",
      "Ongoing support on Slack/WhatsApp",
    ],
  },
  topic: {
    icon: "💡",
    features: [
      "Curated & up-to-date content",
      "Beginner to advanced coverage",
      "Community-driven insights",
      "Expert-authored material",
      "Practical examples & projects",
      "Regular updates",
    ],
  },
  product: {
    icon: "🤖",
    features: [
      "Cutting-edge AI/ML integration",
      "GPT-4, Claude, Gemini APIs",
      "Custom model fine-tuning",
      "Scalable cloud deployment",
      "Data security & privacy",
      "Performance monitoring",
    ],
  },
};

export function SEOServices({ page }: { page: SEOPageData }) {
  const cfg = serviceFeatures[page.category];

  return (
    <section
      id="content"
      className="py-24 px-6"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-cyan-400 mb-3 font-semibold">
            Why Codelura
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            What You Get with Codelura
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Everything you need for {page.title.toLowerCase()}, all under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cfg.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-2xl border border-white/8 hover:border-cyan-500/30 transition-all duration-300 group"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                ✦
              </span>
              <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "500+", label: "Projects Delivered" },
            { num: "40+", label: "Countries Served" },
            { num: "4.9★", label: "Average Rating" },
            { num: "24/7", label: "Support Available" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl border border-white/8"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-3xl font-black text-cyan-400 mb-1">{stat.num}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
