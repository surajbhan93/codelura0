import type { SEOTechCategory } from '@/app/seo/seoConfig';

interface SEOTechStackProps {
  techStack?: SEOTechCategory[];
  title?: string;
}

export default function SEOTechStack({ techStack, title = 'Core Technology Stack' }: SEOTechStackProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <section className="py-14 px-6 sm:px-8 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Modern, maintainable frameworks and cloud infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techStack.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-4 pb-2 border-b border-slate-200">
                {cat.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
