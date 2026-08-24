'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface SEOFAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  /** How many FAQs to show before the "Show more" toggle. Default 5. */
  initialVisible?: number;
}

// Fallback FAQs shown when no custom faqs are passed in
const DEFAULT_FAQS: FAQItem[] = [
  {
    q: 'What is the typical project timeline?',
    a: 'Most engagements are scoped between 2-8 weeks depending on complexity, with weekly check-ins and clear milestones so you always know where things stand.',
  },
  {
    q: 'Which tech stacks do you work with?',
    a: 'We primarily build with modern TypeScript stacks — React, Next.js, Node.js — but we adapt to your existing stack when needed.',
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer flexible post-launch support and maintenance plans, from bug fixes to feature iterations, billed monthly or per-sprint.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Pricing depends on scope — we offer both fixed-price project quotes and hourly/retainer arrangements. You get a clear estimate before any work begins.',
  },
  {
    q: 'Can you work with our in-house team?',
    a: 'Absolutely. We regularly embed with existing engineering teams, following your workflows, code review process, and tooling.',
  },
  {
    q: 'Do you sign NDAs before discussing project details?',
    a: 'Yes, we\'re happy to sign an NDA before any detailed discussion. Client confidentiality and IP protection are standard practice for us.',
  },
  {
    q: 'What does the onboarding process look like?',
    a: 'We start with a discovery call, followed by a scoping document outlining deliverables, timeline, and cost. Once approved, we kick off with sprint planning.',
  },
  {
    q: 'Can you help with an existing, partially-built product?',
    a: 'Definitely. We regularly take over or extend existing codebases — we start with a technical audit before proposing next steps.',
  },
  {
    q: 'Do you provide design (UI/UX) services as well?',
    a: 'Yes, we offer UI/UX design either as a standalone engagement or bundled with development, depending on your needs.',
  },
  {
    q: 'What happens if we need to scale the team mid-project?',
    a: 'We can flex team size up or down within a couple of weeks\' notice, so you\'re never stuck with a fixed headcount that no longer fits the project.',
  },
];

export function SEOFAQSection({
  faqs,
  title = 'Frequently Asked Questions',
  initialVisible = 5,
}: SEOFAQSectionProps) {
  const allItems = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const [showAll, setShowAll] = useState(false);

  const items = showAll ? allItems : allItems.slice(0, initialVisible);
  const hasMore = allItems.length > initialVisible;

  // SEO: FAQPage structured data for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <section className="relative py-16 sm:py-20 px-6 sm:px-8 bg-white border-t border-slate-200 overflow-hidden">
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Subtle decorative background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-50/60 rounded-full blur-3xl -z-0"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></span>
            FAQ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Common questions regarding technical execution, scope, and process.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((faq, index) => (
            <details
              key={index}
              className="group bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-blue-200 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition-colors duration-200 [&_summary::-webkit-details-marker]:hidden open:bg-white open:border-blue-300 open:shadow-sm"
            >
              <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 cursor-pointer text-sm sm:text-base select-none">
                <span className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5 group-open:bg-blue-600 group-open:text-white transition-colors duration-200">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-snug">{faq.q}</span>
                </span>
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 group-open:bg-blue-600 group-open:border-blue-600 group-open:text-white transition-all duration-200">
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 pl-9 text-slate-600 text-sm leading-relaxed border-t border-slate-200/60 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* Show more / less toggle */}
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors duration-200"
            >
              {showAll ? 'Show fewer questions' : `Show ${allItems.length - initialVisible} more questions`}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom CTA nudge */}
        <p className="text-center text-sm text-slate-500 mt-10">
          Still have questions?{' '}
          <a href="/contact" className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
}

export default SEOFAQSection;