import type { SEOPageData } from '@/app/seo/seoConfig';

interface SEOSchemaScriptProps {
  page: SEOPageData;
}

export default function SEOSchemaScript({ page }: SEOSchemaScriptProps) {
  const canonicalUrl = `https://codelura.com/seo/${page.slug}`;

  // Base Organization Schema
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Codelura',
    url: 'https://codelura.com',
    logo: 'https://codelura.com/logo.png',
    description:
      'Codelura is a modern software engineering platform and agency offering web development, mobile apps, and AI solutions.',
  };

  // Specific Schema based on page type
  let specificSchema: Record<string, unknown> = {};

  if (page.schema === 'Service') {
    specificSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.title,
      description: page.metaDescription,
      provider: {
        '@type': 'Organization',
        name: 'Codelura',
        url: 'https://codelura.com',
      },
      url: canonicalUrl,
    };
  } else if (page.schema === 'Article') {
    specificSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.metaDescription,
      author: {
        '@type': 'Organization',
        name: 'Codelura',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Codelura',
        logo: {
          '@type': 'ImageObject',
          url: 'https://codelura.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    };
  } else {
    // Default Organization / WebPage
    specificSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.metaDescription,
      url: canonicalUrl,
    };
  }

  // FAQ Schema if FAQs exist
  let faqSchema: Record<string, unknown> | null = null;
  if (page.faqs && page.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(specificSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
