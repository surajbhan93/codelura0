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
    }
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://codelura.com/locations/noida/app-development/#localbusiness',
    name: `${COMPANY_DETAILS.name} - App Development Company in Noida`,
    url: 'https://codelura.com/locations/noida/app-development',
    logo: 'https://codelura.com/logo.png',
    image: 'https://res.cloudinary.com/dqaucdncd/image/upload/v1784790372/app-development-og_gomoyt.png',
    telephone: COMPANY_DETAILS.phone,
    email: COMPANY_DETAILS.email,
    priceRange: '₹₹ - ₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 62, Near Electronic City Metro Station',
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
    areaServed: [
      { '@type': 'City', name: 'Noida' },
      { '@type': 'City', name: 'Greater Noida' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 62' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 18' },
      { '@type': 'AdministrativeArea', name: 'Noida Sector 63' }
    ]
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Mobile App Development Services in Noida',
    provider: {
      '@type': 'LocalBusiness',
      name: COMPANY_DETAILS.name
    },
    areaServed: {
      '@type': 'City',
      name: 'Noida'
    },
    description:
      'Custom Android and iOS mobile app development, Flutter & React Native cross-platform engineering, App Store publishing, and enterprise mobile solutions in Noida & Greater Noida.',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '24999',
      eligibleRegion: {
        '@type': 'City',
        name: 'Noida'
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
        name: 'Noida',
        item: 'https://codelura.com/locations/noida'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'App Development Company in Noida',
        item: 'https://codelura.com/locations/noida/app-development'
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
