import { COMPANY_DETAILS, FAQS, TESTIMONIALS } from './constants';

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

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://codelura.com/locations/prayagraj/ecommerce-development/#localbusiness',
    name: `${COMPANY_DETAILS.name} - Ecommerce Website Development Company in Prayagraj`,
    url: 'https://codelura.com/locations/prayagraj/ecommerce-development',
    logo: 'https://codelura.com/logo.png',
    image: 'https://res.cloudinary.com/dqaucdncd/image/upload/v1784790373/ecomerce_dovelopment-og_ehbd5g.png',
    telephone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    priceRange: '₹₹ - ₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Civil Lines Tech Zone, Near Subhash Chouraha',
      addressLocality: 'Prayagraj',
      addressRegion: 'Uttar Pradesh',
      postalCode: '211001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_DETAILS.coordinates.lat,
      longitude: COMPANY_DETAILS.coordinates.lng
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00'
      }
    ],
    areaServed: [
      { '@type': 'City', name: 'Prayagraj' },
      { '@type': 'City', name: 'Allahabad' },
      { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '168',
      bestRating: '5',
      worstRating: '1'
    },
    review: TESTIMONIALS.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.author },
      datePublished: '2026-03-12',
      reviewBody: t.quote,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5'
      }
    }))
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Ecommerce Website Development Services in Prayagraj',
    provider: {
      '@type': 'LocalBusiness',
      name: COMPANY_DETAILS.name
    },
    areaServed: {
      '@type': 'City',
      name: 'Prayagraj'
    },
    description:
      'Custom e-commerce website development, Next.js full-stack storefronts, WooCommerce, Shopify OS 2.0, multi-vendor marketplace, and B2B wholesale portals in Prayagraj (Allahabad).',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '19999',
      eligibleRegion: {
        '@type': 'City',
        name: 'Prayagraj'
      }
    }
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Prayagraj',
        item: 'https://codelura.com/locations/prayagraj'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Ecommerce Website Development Prayagraj',
        item: 'https://codelura.com/locations/prayagraj/ecommerce-development'
      }
    ]
  };

  return {
    organizationSchema,
    localBusinessSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema
  };
}
