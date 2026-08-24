import Link from 'next/link';
import type { SEOPageData } from '@/app/seo/seoConfig';

interface SEOCTASectionProps {
  page?: SEOPageData;
}

export function SEOCTASection({ page }: SEOCTASectionProps) {
  const isTopic = page?.category === 'topic' || page?.category === 'guidance';

  return (
    <section className="py-16 px-6 sm:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
            {isTopic
              ? 'Ready to Advance Your Technical Journey?'
              : 'Have a Project Requirement in Mind?'}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            {isTopic
              ? 'Explore 1-on-1 mentorship, code reviews, and developer resources with Codelura.'
              : 'Discuss your application architecture, timeline, and scope with our technical team for free.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white text-blue-900 hover:bg-blue-50 transition-all text-sm shadow-md"
            >
              {isTopic ? 'Book 1-on-1 Session' : 'Get Free Consultation'} →
            </Link>
            <Link
              href="/seo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-blue-700/50 hover:bg-blue-700 text-white border border-blue-400/30 transition-all text-sm"
            >
              Explore All Directory Pages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SEOCTASection;
