// app/seo/page.tsx — SEO Hub Index Page
// Modern White / Light UI — Complete Codelura Directory

import type { Metadata } from 'next';
import Link from 'next/link';
import { getSEOPagesByCategory } from '@/app/seo/seoConfig';

export const metadata: Metadata = {
  title: 'Digital Services, Regional Solutions & Tech Resources — Codelura',
  description:
    'Explore Codelura directory resources: web development, mobile apps, AI software engineering, developer mentorship, regional hubs, and technical guides.',
  alternates: { canonical: 'https://codelura.com/seo' },
  robots: {
    index: true,
    follow: true,
  },
};

const categories = [
  {
    key: 'service' as const,
    label: 'Digital Services',
    desc: 'Custom web, mobile app, and e-commerce software engineering',
    icon: '⚡',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    key: 'product' as const,
    label: 'AI & Software Products',
    desc: 'LLM integration, RAG systems, and AI-assisted workflows',
    icon: '🤖',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    key: 'location' as const,
    label: 'Regional Engineering',
    desc: 'Solutions tailored for India hubs and international clients',
    icon: '📍',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    key: 'guidance' as const,
    label: '1-on-1 Mentorship',
    desc: 'Personalized developer guidance, code reviews, and roadmap planning',
    icon: '🎯',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    key: 'topic' as const,
    label: 'Topics & Developer Guides',
    desc: 'Hackathon strategies, technical articles, and career paths',
    icon: '💡',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
];

export default function SEOHubPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-16 sm:py-20 antialiased">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
        <span className="inline-block text-xs uppercase tracking-widest text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
          Codelura Directory & Hub
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight mb-6">
          Services, Solutions & Technical Resources
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          From custom web software and mobile app engineering to AI product integrations, regional hubs, and developer mentorship.
        </p>
      </div>

      {/* Categories Sections */}
      <div className="space-y-16 max-w-6xl mx-auto">
        {categories.map((cat) => {
          const pages = getSEOPagesByCategory(cat.key);
          if (!pages.length) return null;

          return (
            <section key={cat.key} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <span className="text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-200">{cat.icon}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{cat.label}</h2>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${cat.badgeColor}`}>
                      {pages.length} Pages
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{cat.desc}</p>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/seo/${page.slug}`}
                    className="group p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 text-base transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {page.metaDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Explore Directory →
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="max-w-3xl mx-auto text-center mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-black mb-4">
          Need a Custom Engineering Solution?
        </h2>
        <p className="text-blue-100 mb-8 text-sm sm:text-base max-w-xl mx-auto">
          Consult with a Codelura technical engineer to discuss your web, mobile, or AI application specs for free.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold bg-white text-blue-900 hover:bg-blue-50 transition-all text-base shadow-sm"
        >
          Get Free Consultation →
        </Link>
      </div>
    </main>
  );
}
