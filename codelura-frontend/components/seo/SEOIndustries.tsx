import type { SEOFeature } from '@/app/seo/seoConfig';

interface SEOIndustriesProps {
  industries?: SEOFeature[];
  title?: string;
}

export default function SEOIndustries({ industries, title = 'Industries We Serve & Workflows Supported' }: SEOIndustriesProps) {
  if (!industries || industries.length === 0) return null;

  return (
    <section className="py-14 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Tailored digital solutions for diverse domain requirements and operational models.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {industries.map((ind, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                Domain Solution {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {ind.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {ind.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
