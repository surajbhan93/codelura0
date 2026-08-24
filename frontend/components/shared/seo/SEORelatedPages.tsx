
// ═══════════════════════════════════════════════════════════════
// components/seo/SEORelatedPages.tsx
// ═══════════════════════════════════════════════════════════════
import Link from "next/link";
import type { SEOPageData } from "@/seo/seoConfig";
export function SEORelatedPages({ pages }: { pages: SEOPageData[] }) {
  if (!pages.length) return null;

  const categoryColors: Record<string, string> = {
    service: "#00F5FF",
    location: "#FF6B35",
    topic: "#A855F7",
    guidance: "#22C55E",
    product: "#F59E0B",
  };

  return (
    <section className="py-24 px-6 border-t border-white/8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Explore Related Services
          </h2>
          <p className="text-gray-500 mt-3 text-sm">
            Everything you need is on Codelura
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((p) => (
            <Link
              key={p.slug}
              href={`/seo/${p.slug}`}
              className="group p-6 rounded-2xl border border-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: categoryColors[p.category] }}
              >
                {p.category}
              </div>
              <h3 className="font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {p.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                {p.metaDescription}
              </p>
              <div className="mt-4 text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}