
// ═══════════════════════════════════════════════════════════════
// components/seo/SEOCTASection.tsx
// ═══════════════════════════════════════════════════════════════
import Link from "next/link";
import type { SEOPageData } from "@/seo/seoConfig";
export function SEOCTASection({ page }: { page: SEOPageData }) {
  return (
    <section className="py-24 px-6">
      <div
        className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-white/10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.12), transparent 70%), rgba(255,255,255,0.03)",
        }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#00F5FF22 1px, transparent 1px), linear-gradient(90deg, #00F5FF22 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-cyan-400 mb-4 font-semibold">
            Ready to Start?
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Let's Build Something{" "}
            <span className="text-cyan-400">Amazing Together</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join 500+ businesses who chose Codelura for {page.title.toLowerCase()}. 
            Get a free consultation today — no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-4 rounded-xl font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 hover:scale-105 text-base"
              style={{ boxShadow: "0 0 40px rgba(0,245,255,0.4)" }}
            >
              Get Free Consultation →
            </Link>
            <Link
              href="/premium"
              className="px-10 py-4 rounded-xl font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200 text-base"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
