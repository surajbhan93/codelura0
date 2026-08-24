import { COMPANY_DETAILS, CITIES_LIST, FAQS } from './constants';

export function generateSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://codelura.com/#organization',
    name: COMPANY_DETAILS.name,
    url: 'https://codelura.com',
    logo: 'https://codelura.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_DETAILS.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    },
sameAs: [
  'https://www.facebook.com/codelura',
  'https://www.instagram.com/codelura',
  'https://www.linkedin.com/company/codelura/',
  'https://x.com/codelura',
  'https://www.youtube.com/@Codelura'
]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://codelura.com/#website',
    url: 'https://codelura.com',
    name: 'Codelura',
    description: 'Enterprise Software, Custom Web Development, Mobile Apps & SEO Agency in India',
    publisher: {
      '@id': 'https://codelura.com/#organization'
    }
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://codelura.com/locations/#collectionpage',
    url: 'https://codelura.com/locations',
    name: 'Locations We Serve | Codelura Software & Digital Agency India',
    description: 'Explore Codelura software development, website development, SEO, AI, mobile app development, and digital marketing services across multiple cities in India.',
    isPartOf: {
      '@id': 'https://codelura.com/#website'
    }
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://codelura.com/locations/#itemlist',
    name: 'Codelura City Locations Serviced in India',
    numberOfItems: CITIES_LIST.length,
    itemListElement: CITIES_LIST.map((city, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `Codelura ${city.name} Software & Digital Hub`,
      url: `https://codelura.com${city.hubUrl}`
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codelura.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Locations',
        item: 'https://codelura.com/locations'
      }
    ]
  };

  return {
    organizationSchema,
    websiteSchema,
    collectionPageSchema,
    itemListSchema,
    faqSchema,
    breadcrumbSchema
  };
}
