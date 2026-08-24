import { COMPANY_DETAILS, NOIDA_SERVICES, NOIDA_FAQS } from './constants';

export function generateSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://codelura.com/#organization',
    name: 'Codelura Technologies',
    legalName: 'Codelura Technologies Private Limited',
    url: 'https://codelura.com',
    logo: 'https://codelura.com/logo.png',
    description:
      'Codelura Technologies is a premier software development company, web design agency, mobile app developer, and IT engineering firm in Noida (NCR), India.',
    email: COMPANY_DETAILS.email,
    telephone: COMPANY_DETAILS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 62, Near Electronic City Metro Station',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201309',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://twitter.com/codelura',
      'https://www.linkedin.com/company/codelura',
      'https://github.com/codelura'
    ]
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://codelura.com/locations/noida/#localbusiness',
    name: 'Codelura Technologies - Software & IT Company Noida',
    image: 'https://res.cloudinary.com/dqaucdncd/image/upload/v1785998869/ChatGPT_Image_Aug_6_2026_12_10_21_PM_d8rsgc.png',
    url: 'https://codelura.com/locations/noida',
    telephone: COMPANY_DETAILS.phone,
    priceRange: '₹₹ - ₹₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_DETAILS.address,
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201309',
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
        closes: '20:00'
      }
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Noida' },
      { '@type': 'AdministrativeArea', name: 'Greater Noida' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 62' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 18' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 63' },
      { '@type': 'AdministrativeArea', name: 'Noida Expressway' },
      { '@type': 'AdministrativeArea', name: 'Greater Noida West' },
      { '@type': 'AdministrativeArea', name: 'Knowledge Park Greater Noida' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT & Software Development Services Noida',
      itemListElement: NOIDA_SERVICES.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.fullDesc,
          url: `https://codelura.com${service.url}`
        },
        position: index + 1
      }))
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: NOIDA_FAQS.map((faq) => ({
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
        name: 'Software Company in Noida',
        item: 'https://codelura.com/locations/noida'
      }
    ]
  };

  return {
    organizationSchema,
    localBusinessSchema,
    faqSchema,
    breadcrumbSchema
  };
}
