// app/seo/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────
// Codelura — Dynamic SEO Landing Page (Next.js App Router)
// Modern White / Light UI — Industry-Specific & High-Converting
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getSEOPage,
  getAllSlugs,
  allSEOPages,
  type SEOPageData,
} from '@/app/seo/seoConfig';

import SEOHero from '@/components/seo/SEOHero';
import SEOOverview from '@/components/seo/SEOOverview';
import SEOServices from '@/components/seo/SEOServices';
import SEOFeatures from '@/components/seo/SEOFeatures';
import SEOIndustries from '@/components/seo/SEOIndustries';
import SEOProcess from '@/components/seo/SEOProcess';
import SEOTechStack from '@/components/seo/SEOTechStack';
import SEOContentSections from '@/components/seo/SEOContentSections';
import SEOFAQSection from '@/components/seo/SEOFAQSection';
import SEOCTASection from '@/components/seo/SEOCTASection';
import SEORelatedPages from '@/components/seo/SEORelatedPages';
import SEOSchemaScript from '@/components/seo/SEOSchemaScript';

// ─── Static Params for SSG ────────────────────────────────────
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ─── Dynamic Metadata ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = getSEOPage(params.slug);
  if (!page) return { title: 'Not Found — Codelura' };

  const canonical = `https://codelura.com/seo/${page.slug}`;
  const defaultOgImage = 'https://codelura.com/og-image.png';

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: 'Codelura',
      type: 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: [defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ─── Page Component ───────────────────────────────────────────
export default function SEODynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getSEOPage(params.slug);
  if (!page) notFound();

  // Safely map related pages ensuring they exist
  const relatedPages = (page.relatedSlugs ?? [])
    .map((s) => allSEOPages.find((p) => p.slug === s))
    .filter((p): p is SEOPageData => Boolean(p));

  return (
    <>
      {/* Structured JSON-LD Schema */}
      <SEOSchemaScript page={page} />

      {/* Breadcrumb List Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://codelura.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'SEO Directory',
                item: 'https://codelura.com/seo',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: page.title,
                item: `https://codelura.com/seo/${page.slug}`,
              },
            ],
          }),
        }}
      />

      {/* Main Container - Light Theme */}
      <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <SEOHero page={page} />
        
        <SEOOverview intro={page.intro} overview={page.overview} />
        
        {page.solutions && page.solutions.length > 0 && (
          <SEOServices solutions={page.solutions} />
        )}

        {page.features && page.features.length > 0 && (
          <SEOFeatures features={page.features} />
        )}

        {page.industries && page.industries.length > 0 && (
          <SEOIndustries industries={page.industries} />
        )}

        {page.process && page.process.length > 0 && (
          <SEOProcess process={page.process} />
        )}

        {page.techStack && page.techStack.length > 0 && (
          <SEOTechStack techStack={page.techStack} />
        )}

        {page.contentSections && page.contentSections.length > 0 && (
          <SEOContentSections sections={page.contentSections} />
        )}

        <SEOFAQSection faqs={page.faqs} title={page.title} />

        <SEOCTASection page={page} />

        <SEORelatedPages pages={relatedPages} />
      </main>
    </>
  );
}
