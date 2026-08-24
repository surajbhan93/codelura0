import Link from 'next/link';
import type { SEOPageData } from '@/app/seo/seoConfig';

interface SEORelatedPagesProps {
  pages?: SEOPageData[];
}

export function SEORelatedPages({ pages }: SEORelatedPagesProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <section className="py-14 px-6 sm:px-8 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Related Resources & Directory Pages
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Explore closely aligned services, regional hubs, and technical topics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/seo/${page.slug}`}
              className="group p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="text-xs font-semibold text-blue-600 uppercase mb-1">
                {page.category}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 text-sm mb-2 transition-colors">
                {page.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                {page.metaDescription}
              </p>
              <div className="mt-3 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-block">
                View Page →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SEORelatedPages;
