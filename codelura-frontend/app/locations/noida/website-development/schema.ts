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
    '@id': 'https://codelura.com/locations/noida/website-development/#localbusiness',
    name: `${COMPANY_DETAILS.name} - Website Development Company in Noida`,
    url: 'https://codelura.com/locations/noida/website-development',
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
    serviceType: 'Website Development Services in Noida',
    provider: { '@type': 'LocalBusiness', name: COMPANY_DETAILS.name },
    areaServed: { '@type': 'City', name: 'Noida' },
    description: 'Custom Next.js 15, React 19, and Tailwind CSS responsive website development, corporate web design, and web portal engineering in Noida & Greater Noida.'
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
      { '@type': 'ListItem', position: 4, name: 'Website Development Company in Noida', item: 'https://codelura.com/locations/noida/website-development' }
    ]
  };

  return { organizationSchema, localBusinessSchema, serviceSchema, faqSchema, breadcrumbSchema };
}
