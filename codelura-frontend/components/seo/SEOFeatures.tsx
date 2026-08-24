import type { SEOFeature } from '@/app/seo/seoConfig';

interface SEOFeaturesProps {
  features?: SEOFeature[];
  title?: string;
}

export default function SEOFeatures({ features, title = 'Technical Features & Architecture' }: SEOFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-20 px-6 sm:px-8 bg-white overflow-hidden">
      {/* Subtle decorative accent for consistency with other sections */}
      <div
        className="absolute top-0 right-0 w-[420px] h-[280px] bg-blue-50/60 rounded-full blur-3xl -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center sm:text-left mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
            Features
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Engineered with high code quality, security, and developer standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}