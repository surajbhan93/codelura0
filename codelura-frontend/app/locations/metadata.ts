import type { Metadata } from 'next';

export const locationsMasterMetadata: Metadata = {
  title: 'Locations We Serve | Codelura Software & Digital Agency India',
  description:
    'Explore Codelura software development, website development, SEO, AI, mobile app development, and digital marketing services across multiple cities in India including Prayagraj, Noida, Lucknow, Kanpur, Varanasi, Gurugram, Delhi, Agra, and Meerut.',
  keywords: [
    'Locations We Serve Codelura',
    'Software Development Services Across India',
    'Website Development Company Prayagraj',
    'IT Company Noida',
    'Software Development Lucknow',
    'Digital Marketing Kanpur',
    'Shopify Development Varanasi',
    'AI Development Gurugram',
    'App Development Delhi',
    'SEO Services Agra',
    'Software Company Meerut'
  ],
  alternates: {
    canonical: 'https://codelura.com/locations'
  },
  openGraph: {
    title: 'Locations We Serve | Codelura Digital Engineering Hub India',
    description:
      'Discover Codelura enterprise software, custom website development, AI solution, and performance marketing across Prayagraj, Noida, Lucknow, Kanpur, Varanasi, Gurugram & Delhi.',
    url: 'https://codelura.com/locations',
    siteName: 'Codelura',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/codelura/image/upload/v1/codelura/locations/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Locations We Serve - Codelura Digital Engineering Across India'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locations We Serve | Codelura Enterprise Engineering',
    description:
      'Find Codelura software development, Next.js web applications, mobile apps, and SEO services in your city.',
    images: ['https://res.cloudinary.com/codelura/image/upload/v1/codelura/locations/hero.webp'],
    creator: '@codelura'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  authors: [{ name: 'Codelura Engineering Leadership Team', url: 'https://codelura.com' }]
};
