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
    '@id': 'https://codelura.com/locations/noida/digital-marketing/#localbusiness',
    name: `${COMPANY_DETAILS.name} - Digital Marketing Agency in Noida`,
    url: 'https://codelura.com/locations/noida/digital-marketing',
    telephone: COMPANY_DETAILS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 62, Near Electronic City Metro Station',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201309',
      addressCountry: 'IN'
    }
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Digital Marketing & Performance PPC Services in Noida',
    provider: { '@type': 'LocalBusiness', name: COMPANY_DETAILS.name },
    areaServed: { '@type': 'City', name: 'Noida' },
    description: 'High-ROAS Google Ads, Meta Ads, B2B Lead Generation, WhatsApp Automation, and Performance Marketing services in Noida & Greater Noida.'
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
      { '@type': 'ListItem', position: 3, name: 'Noida', item: 'https://codelura.com/locations/noida' },
      { '@type': 'ListItem', position: 4, name: 'Digital Marketing Agency in Noida', item: 'https://codelura.com/locations/noida/digital-marketing' }
    ]
  };

  return { organizationSchema, localBusinessSchema, serviceSchema, faqSchema, breadcrumbSchema };
}
