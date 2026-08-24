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
    '@id': 'https://codelura.com/locations/gurugram/ecommerce-development/#localbusiness',
    name: `${COMPANY_DETAILS.name} - Ecommerce Development Company in Gurugram`,
    url: 'https://codelura.com/locations/gurugram/ecommerce-development',
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
    serviceType: 'Ecommerce Website Development Services in Gurugram',
    provider: { '@type': 'LocalBusiness', name: COMPANY_DETAILS.name },
    areaServed: { '@type': 'City', name: 'Gurugram' },
    description: 'Custom Headless Next.js e-commerce development, WooCommerce, Multi-Vendor Marketplaces, and B2B Portals in Gurugram (Gurgaon).'
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
      { '@type': 'ListItem', position: 4, name: 'Ecommerce Website Development Gurugram', item: 'https://codelura.com/locations/gurugram/ecommerce-development' }
    ]
  };

  return { organizationSchema, localBusinessSchema, serviceSchema, faqSchema, breadcrumbSchema };
}
