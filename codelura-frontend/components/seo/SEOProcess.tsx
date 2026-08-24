import type { SEOProcessStep } from '@/app/seo/seoConfig';

interface SEOProcessProps {
  process?: SEOProcessStep[];
  title?: string;
}

export default function SEOProcess({ process, title = 'Development & Delivery Workflow' }: SEOProcessProps) {
  if (!process || process.length === 0) return null;

  return (
    <section className="py-14 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Structured milestone execution for transparent project progression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-black tracking-wider text-blue-600 uppercase mb-2 block">
                  Step {step.step || `0${idx + 1}`}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
