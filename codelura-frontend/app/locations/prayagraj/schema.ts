import { COMPANY_DETAILS, PRAYAGRAJ_SERVICES, FAQS, TESTIMONIALS } from './constants';

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
    '@id': 'https://codelura.com/locations/prayagraj/#localbusiness',
    name: `${COMPANY_DETAILS.name} - Software Company in Prayagraj`,
    url: 'https://codelura.com/locations/prayagraj',
    logo: 'https://codelura.com/logo.png',
    image: 'https://res.cloudinary.com/codelura/image/upload/v1/codelura/locations/prayagraj/hero.webp',
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
      reviewCount: '195',
      bestRating: '5',
      worstRating: '1'
    },
    review: TESTIMONIALS.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.author },
      datePublished: '2026-03-15',
      reviewBody: t.quote,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating.toString(),
        bestRating: '5'
      }
    }))
  };

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://codelura.com/locations/prayagraj/#collectionpage',
    url: 'https://codelura.com/locations/prayagraj',
    name: 'Software Company & Digital Engineering Services in Prayagraj (Allahabad)',
    description: 'Parent hub for all Codelura software, website, SEO, app development, and digital marketing services in Prayagraj.',
    isPartOf: {
      '@id': 'https://codelura.com/#website'
    }
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': 'https://codelura.com/locations/prayagraj/#itemlist',
    name: 'Codelura Digital Services in Prayagraj',
    numberOfItems: PRAYAGRAJ_SERVICES.length,
    itemListElement: PRAYAGRAJ_SERVICES.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: svc.title,
      url: `https://codelura.com${svc.url}`
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Software Company in Prayagraj',
        item: 'https://codelura.com/locations/prayagraj'
      }
    ]
  };

  return {
    organizationSchema,
    localBusinessSchema,
    collectionPageSchema,
    itemListSchema,
    faqSchema,
    breadcrumbSchema
  };
}
