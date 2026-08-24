import type { SEOFeature } from '@/app/seo/seoConfig';

interface SEOServicesProps {
  solutions?: SEOFeature[];
  title?: string;
}

export function SEOServices({ solutions, title = 'Key Solutions & Engineering Capabilities' }: SEOServicesProps) {
  if (!solutions || solutions.length === 0) return null;

  return (
    <section className="py-14 px-6 sm:px-8 bg-slate-50 border-y border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Tailored software architecture and execution for complex digital requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 border border-blue-100">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SEOServices;
