import type { SEOPageData } from '@/app/seo/seoConfig';

interface SEOOverviewProps {
  intro?: string;
  overview?: SEOPageData['overview'];
}

export default function SEOOverview({ intro, overview }: SEOOverviewProps) {
  if (!intro && !overview) return null;

  return (
    <section className="py-12 px-6 sm:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {intro && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8">
            <h2 className="text-xs uppercase tracking-widest text-blue-700 font-bold mb-2">
              Overview
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {intro}
            </p>
          </div>
        )}

        {overview && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {overview.title}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {overview.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
