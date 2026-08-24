// app/seo/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────
// Codelura — Dynamic SEO Page (Next.js App Router)
// Covers: Services | Locations (India+Global) | Topics | Guidance
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSEOPage, getAllSlugs, allSEOPages, type SEOPageData } from "@/seo/seoConfig";
import SEOHero from "@/components/seo/SEOHero";
import {SEOServices} from "@/components/seo/SEOServices";
import {SEOFAQSection} from "@/components/seo/SEOFAQSection";
import {SEORelatedPages} from "@/components/seo/SEORelatedPages";
// import {SEOSchemaScript} from "@/components/seo/SEOSchemaScript";
import SEOSchemaScript from "@/components/seo/SEOSchemaScript";
import {SEOCTASection} from "@/components/seo/SEOCTASection";

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
  if (!page) return { title: "Not Found" };

  const canonical = `https://codelura.com/seo/${page.slug}`;

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
      siteName: "Codelura",
      type: "website",
      images: [
        {
          url: `https://codelura.com/og/${page.slug}.png`,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [`https://codelura.com/og/${page.slug}.png`],
      site: "@codelura",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
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

  const relatedPages = page.relatedSlugs
    .map((s) => allSEOPages.find((p) => p.slug === s))
    .filter(Boolean) as SEOPageData[];

  return (
    <>
      {/* JSON-LD Schema */}
      <SEOSchemaScript page={page} />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://codelura.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: page.category.charAt(0).toUpperCase() + page.category.slice(1),
                item: `https://codelura.com/seo`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.title,
                item: `https://codelura.com/seo/${page.slug}`,
              },
            ],
          }),
        }}
      />

      {/* Page Content */}
      <main className="min-h-screen bg-[#050810] text-white overflow-hidden">
        <SEOHero page={page} />
        <SEOServices page={page} />
        <SEOFAQSection faqs={page.faqs} title={page.title} />
        <SEOCTASection page={page} />
        <SEORelatedPages pages={relatedPages} />
      </main>
    </>
  );
}