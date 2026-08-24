import { COMPANY_DETAILS, GURUGRAM_SERVICES, GURUGRAM_FAQS } from './constants';

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
      'Codelura Technologies is a premier software development company, web design agency, mobile app developer, and IT engineering firm in Gurugram (Gurgaon), Haryana, India.',
    email: COMPANY_DETAILS.email,
    telephone: COMPANY_DETAILS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'DLF Cyber City, Phase 2, Near Cyber City Metro Station',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122002',
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
    '@id': 'https://codelura.com/locations/gurugram/#localbusiness',
    name: 'Codelura Technologies - Software & IT Company Gurugram',
    image: 'https://res.cloudinary.com/dqaucdncd/image/upload/v1785998869/ChatGPT_Image_Aug_6_2026_12_10_21_PM_d8rsgc.png',
    url: 'https://codelura.com/locations/gurugram',
    telephone: COMPANY_DETAILS.phone,
    priceRange: '₹₹ - ₹₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_DETAILS.address,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122002',
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
      { '@type': 'AdministrativeArea', name: 'Gurugram' },
      { '@type': 'AdministrativeArea', name: 'Gurgaon' },
      { '@type': 'AdministrativeArea', name: 'Cyber City Gurugram' },
      { '@type': 'AdministrativeArea', name: 'Golf Course Road' },
      { '@type': 'AdministrativeArea', name: 'Udyog Vihar' },
      { '@type': 'AdministrativeArea', name: 'Sohna Road' },
      { '@type': 'AdministrativeArea', name: 'MG Road Gurugram' },
      { '@type': 'AdministrativeArea', name: 'IMT Manesar' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT & Software Development Services Gurugram',
      itemListElement: GURUGRAM_SERVICES.map((service, index) => ({
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
    mainEntity: GURUGRAM_FAQS.map((faq) => ({
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
        name: 'Software Company in Gurugram',
        item: 'https://codelura.com/locations/gurugram'
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
