import Link from 'next/link';
import type { SEOPageData } from '@/app/seo/seoConfig';

interface SEOHeroProps {
  page: SEOPageData;
}

const categoryLabels: Record<SEOPageData['category'], string> = {
  service: 'Digital Service',
  location: 'Regional Engineering',
  topic: 'Developer Resource',
  guidance: '1-on-1 Mentorship',
  product: 'AI Software',
};

// Internal career target
const CAREER_URL = '/career';

// Visual panel image (Unsplash - free to use)
const HERO_PANEL_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';

const STATS = [
  { value: '120+', label: 'Projects shipped' },
  { value: '98%', label: 'Client retention' },
  { value: '4.9/5', label: 'Avg. rating' },
];

export default function SEOHero({ page }: SEOHeroProps) {
  const categoryLabel = categoryLabels[page.category] || 'Resource';

  return (
    <section className="relative bg-white border-b border-slate-200 pt-10 pb-16 sm:pt-14 sm:pb-20 px-6 sm:px-8 overflow-hidden">
      {/* Ambient background accents */}
      <div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-blue-100/50 rounded-full blur-3xl -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-32 w-[380px] h-[380px] bg-indigo-100/40 rounded-full blur-3xl -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 font-medium flex-wrap gap-y-1">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="text-slate-400">/</span>
            </li>
            <li>
              <Link href="/seo" className="hover:text-blue-600 transition-colors">
                SEO Directory
              </Link>
            </li>
            <li>
              <span className="text-slate-400">/</span>
            </li>
            <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              {page.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-8 items-center">
          {/* Left: content */}
          <div>
            {/* Category Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
              {categoryLabel}
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-[1.1] mb-6">
              {page.h1}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
              {page.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 text-center"
              >
                Get Free Consultation
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/seo"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all duration-200 text-center"
              >
                Explore All Services
              </Link>
              <a
                href={CAREER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all duration-200 text-center"
              >
                View Portfolio
                <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-200 max-w-lg">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual panel */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/5]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${HERO_PANEL_IMAGE}')` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

              {/* Bottom caption on the image */}
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-bold text-lg leading-snug">
                  Built for teams that ship fast
                </p>
                <p className="text-white/80 text-sm mt-1">
                  Engineering, design, and delivery — under one roof.
                </p>
              </div>
            </div>

            {/* Floating trust card */}
            <div className="absolute -top-5 -left-6 bg-white rounded-2xl border border-slate-200 shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white" />
                <span className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white" />
                <span className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">Trusted by 80+ teams</p>
                <p className="text-xs text-slate-500 mt-1">across 12 countries</p>
              </div>
            </div>

            {/* Floating badge list */}
            <div className="absolute -bottom-5 -right-4 bg-white rounded-2xl border border-slate-200 shadow-lg px-4 py-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Delivery focus</p>
              <ul className="space-y-1.5">
                {['Modern Tech Stacks', 'Clean TypeScript Code', 'Production Ready'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}