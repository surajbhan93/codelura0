import type { SEOContentSection } from '@/app/seo/seoConfig';

interface SEOContentSectionsProps {
  sections?: SEOContentSection[];
}

export default function SEOContentSections({ sections }: SEOContentSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <section className="py-12 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto space-y-8">
        {sections.map((sec, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              {sec.heading}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
              {sec.content}
            </p>
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="space-y-2 mt-4">
                {sec.bullets.map((b, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
