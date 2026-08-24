import { COMPANY_DETAILS, FAQS } from './constants';

export function generateSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://codelura.com/#organization',
    name: COMPANY_DETAILS.name,
    url: 'https://codelura.com'
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://codelura.com/locations/gurugram/app-development/#localbusiness',
    name: `${COMPANY_DETAILS.name} - App Development Company in Gurugram`,
    url: 'https://codelura.com/locations/gurugram/app-development',
    telephone: COMPANY_DETAILS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'DLF Cyber City, Phase 2, Near Cyber City Metro Station',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122002',
      addressCountry: 'IN'
    }
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Mobile App Development Services in Gurugram',
    provider: { '@type': 'LocalBusiness', name: COMPANY_DETAILS.name },
    areaServed: { '@type': 'City', name: 'Gurugram' },
    description: 'Custom Android and iOS mobile app development, Flutter & React Native cross-platform engineering, App Store publishing, and enterprise mobile solutions in Gurugram (Gurgaon).'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codelura.com' },
      { '@type': 'ListItem', position: 2, name: 'Locations', item: 'https://codelura.com/locations' },
      { '@type': 'ListItem', position: 3, name: 'Gurugram', item: 'https://codelura.com/locations/gurugram' },
      { '@type': 'ListItem', position: 4, name: 'App Development Company in Gurugram', item: 'https://codelura.com/locations/gurugram/app-development' }
    ]
  };

  return { organizationSchema, localBusinessSchema, serviceSchema, faqSchema, breadcrumbSchema };
}
