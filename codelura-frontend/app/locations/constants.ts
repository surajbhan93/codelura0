export interface CityLocation {
  id: string;
  name: string;
  state: string;
  slug: string;
  shortDesc: string;
  serviceCount: number;
  popularServices: string[];
  isPrimary: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  hubUrl: string;
  services: {
    title: string;
    slug: string;
    url: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  iconName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const COMPANY_DETAILS = {
  name: "Codelura",
  tagline: "India's Premier Digital Engineering & Software Agency",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "contact@codelura.com",
  hqAddress: "Codelura Tech Center, Civil Lines, Near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001, India",
  websiteUrl: "https://codelura.com"
};

export const CITIES_LIST: CityLocation[] = [
  {
    id: "prayagraj",
    name: "Prayagraj (Allahabad)",
    state: "Uttar Pradesh",
    slug: "prayagraj",
    shortDesc: "Primary software engineering & digital transformation hub in Eastern UP serving coaching centers, healthcare clinics & retail merchants.",
    serviceCount: 10,
    popularServices: ["Website Development", "SEO Services", "App Development", "Software Development", "Ecommerce Development"],
    isPrimary: true,
    coordinates: { lat: 25.4520, lng: 81.8349 },
    hubUrl: "/locations/prayagraj",
    services: [
      { title: "Website Development Company in Prayagraj", slug: "website-development", url: "/locations/prayagraj/website-development" },
      { title: "SEO Services in Prayagraj", slug: "seo-services", url: "/locations/prayagraj/seo-services" },
      { title: "App Development Company in Prayagraj", slug: "app-development", url: "/locations/prayagraj/app-development" },
      { title: "Software Development Company in Prayagraj", slug: "software-development", url: "/locations/prayagraj/software-development" },
      { title: "WordPress Development Company in Prayagraj", slug: "wordpress-development", url: "/locations/prayagraj/wordpress-development" },
      { title: "Shopify Development Company in Prayagraj", slug: "shopify-development", url: "/locations/prayagraj/shopify-development" },
      { title: "Digital Marketing Company in Prayagraj", slug: "digital-marketing", url: "/locations/prayagraj/digital-marketing" },
      { title: "Ecommerce Website Development Prayagraj", slug: "ecommerce-development", url: "/locations/prayagraj/ecommerce-development" }
    ]
  },
  {
    id: "noida",
    name: "Noida",
    state: "Uttar Pradesh (NCR)",
    slug: "noida",
    shortDesc: "Major IT & SaaS hub delivering enterprise Next.js web applications, cloud microservices, and AI solutions for IT parks.",
    serviceCount: 10,
    popularServices: ["Software Development", "App Development", "SEO Services", "Website Development", "Digital Marketing", "Ecommerce Development"],
    isPrimary: true,
    coordinates: { lat: 28.5355, lng: 77.3910 },
    hubUrl: "/locations/noida",
    services: [
      { title: "Software Development Company in Noida", slug: "software-development", url: "/locations/noida/software-development" },
      { title: "App Development Company in Noida", slug: "app-development", url: "/locations/noida/app-development" },
      { title: "Website Development Company in Noida", slug: "website-development", url: "/locations/noida/website-development" },
      { title: "SEO Services in Noida", slug: "seo-services", url: "/locations/noida/seo-services" },
      { title: "Digital Marketing Agency in Noida", slug: "digital-marketing", url: "/locations/noida/digital-marketing" },
      { title: "Ecommerce Website Development Noida", slug: "ecommerce-development", url: "/locations/noida/ecommerce-development" },
      { title: "Shopify Development Company in Noida", slug: "shopify-development", url: "/locations/noida/shopify-development" },
      { title: "WordPress Development Company in Noida", slug: "wordpress-development", url: "/locations/noida/wordpress-development" }
    ]
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    slug: "lucknow",
    shortDesc: "State capital digital center empowering government portals, healthcare polyclinics, real estate builders, and D2C brands.",
    serviceCount: 10,
    popularServices: ["SEO Services", "Website Development", "Software Development", "Digital Marketing"],
    isPrimary: true,
    coordinates: { lat: 26.8467, lng: 80.9462 },
    hubUrl: "/locations/lucknow",
    services: [
      { title: "Website Development Company in Lucknow", slug: "website-development", url: "/locations/lucknow/website-development" },
      { title: "SEO Services in Lucknow", slug: "seo-services", url: "/locations/lucknow/seo-services" },
      { title: "Software Development Company in Lucknow", slug: "software-development", url: "/locations/lucknow/software-development" }
    ]
  },
  {
    id: "kanpur",
    name: "Kanpur",
    state: "Uttar Pradesh",
    slug: "kanpur",
    shortDesc: "Industrial manufacturing powerhouse requiring B2B ERP software, supply chain portals, and commercial e-commerce platforms.",
    serviceCount: 10,
    popularServices: ["Software Development", "Ecommerce Development", "Shopify Development"],
    isPrimary: true,
    coordinates: { lat: 26.4499, lng: 80.3319 },
    hubUrl: "/locations/kanpur",
    services: [
      { title: "Website Development Company in Kanpur", slug: "website-development", url: "/locations/kanpur/website-development" },
      { title: "Ecommerce Development in Kanpur", slug: "ecommerce-development", url: "/locations/kanpur/ecommerce-development" }
    ]
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    slug: "varanasi",
    shortDesc: "Global cultural & tourism hub empowering saree handlooms, hotel booking portals, and international artisan Shopify stores.",
    serviceCount: 10,
    popularServices: ["Shopify Development", "WordPress Development", "SEO Services"],
    isPrimary: true,
    coordinates: { lat: 25.3176, lng: 82.9739 },
    hubUrl: "/locations/varanasi",
    services: [
      { title: "Website Development Company in Varanasi", slug: "website-development", url: "/locations/varanasi/website-development" },
      { title: "Shopify Development in Varanasi", slug: "shopify-development", url: "/locations/varanasi/shopify-development" }
    ]
  },
  {
    id: "gurugram",
    name: "Gurugram (Gurgaon)",
    state: "Haryana (NCR)",
    slug: "gurugram",
    shortDesc: "Financial & Tech corporate center building high-scale Headless Next.js e-commerce, cloud SaaS, and AI automation.",
    serviceCount: 10,
    popularServices: ["Software Development", "App Development", "SEO Services", "Website Development", "Digital Marketing", "Ecommerce Development"],
    isPrimary: true,
    coordinates: { lat: 28.4595, lng: 77.0266 },
    hubUrl: "/locations/gurugram",
    services: [
      { title: "Software Development Company in Gurugram", slug: "software-development", url: "/locations/gurugram/software-development" },
      { title: "App Development Company in Gurugram", slug: "app-development", url: "/locations/gurugram/app-development" },
      { title: "Website Development Company in Gurugram", slug: "website-development", url: "/locations/gurugram/website-development" },
      { title: "SEO Services in Gurugram", slug: "seo-services", url: "/locations/gurugram/seo-services" },
      { title: "Digital Marketing Agency in Gurugram", slug: "digital-marketing", url: "/locations/gurugram/digital-marketing" },
      { title: "Ecommerce Website Development Gurugram", slug: "ecommerce-development", url: "/locations/gurugram/ecommerce-development" },
      { title: "Shopify Development Company in Gurugram", slug: "shopify-development", url: "/locations/gurugram/shopify-development" },
      { title: "WordPress Development Company in Gurugram", slug: "wordpress-development", url: "/locations/gurugram/wordpress-development" }
    ]
  },
  {
    id: "delhi",
    name: "Delhi (NCR)",
    state: "National Capital Territory",
    slug: "delhi",
    shortDesc: "Capital business ecosystem powering D2C brands, corporate portals, mobile apps, and performance growth marketing.",
    serviceCount: 10,
    popularServices: ["Digital Marketing", "App Development", "SEO Services", "Website Development"],
    isPrimary: true,
    coordinates: { lat: 28.6139, lng: 77.2090 },
    hubUrl: "/locations/delhi",
    services: [
      { title: "Digital Marketing Agency in Delhi", slug: "digital-marketing", url: "/locations/delhi/digital-marketing" },
      { title: "App Development Company in Delhi", slug: "app-development", url: "/locations/delhi/app-development" }
    ]
  },
  {
    id: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    slug: "agra",
    shortDesc: "Tourism & handicraft retail hub driving footwear export portals, hotel reservation systems, and local search SEO.",
    serviceCount: 10,
    popularServices: ["SEO Services", "Ecommerce Development", "WordPress Development"],
    isPrimary: false,
    coordinates: { lat: 27.1767, lng: 78.0081 },
    hubUrl: "/locations/agra",
    services: [
      { title: "Website Development in Agra", slug: "website-development", url: "/locations/agra/website-development" },
      { title: "SEO Services in Agra", slug: "seo-services", url: "/locations/agra/seo-services" }
    ]
  },
  {
    id: "meerut",
    name: "Meerut",
    state: "Uttar Pradesh",
    slug: "meerut",
    shortDesc: "Sports manufacturing and medical distribution center requiring custom inventory software and web portals.",
    serviceCount: 10,
    popularServices: ["Software Development", "Website Development", "SEO Services"],
    isPrimary: false,
    coordinates: { lat: 28.9845, lng: 77.7064 },
    hubUrl: "/locations/meerut",
    services: [
      { title: "Website Development in Meerut", slug: "website-development", url: "/locations/meerut/website-development" }
    ]
  }
];

export const MASTER_SERVICES: ServiceCategory[] = [
  {
    id: "website-development",
    title: "Website Development",
    slug: "website-development",
    shortDesc: "Custom Next.js 15, React 19 & Tailwind CSS v4 responsive business websites built for sub-second page speed.",
    iconName: "Globe"
  },
  {
    id: "seo-services",
    title: "SEO Services & Local Search",
    slug: "seo-services",
    shortDesc: "Entity SEO, Google Maps 3-Pack rank, AI Overviews optimization, and technical audit search dominance.",
    iconName: "Search"
  },
  {
    id: "app-development",
    title: "Mobile App Development",
    slug: "app-development",
    shortDesc: "High-performance Flutter, React Native, iOS Swift & Android Kotlin mobile apps ready for store launch.",
    iconName: "Smartphone"
  },
  {
    id: "software-development",
    title: "Custom Software Development",
    slug: "software-development",
    shortDesc: "Enterprise CRM, ERP, Hospital HMS, Institute Management & Business Automation software engineering.",
    iconName: "Code"
  },
  {
    id: "wordpress-development",
    title: "WordPress Development",
    slug: "wordpress-development",
    shortDesc: "Custom PHP Gutenberg themes, zero-bloat CMS sites, speed optimization (95+ PageSpeed), and maintenance.",
    iconName: "Layout"
  },
  {
    id: "shopify-development",
    title: "Shopify Store Development",
    slug: "shopify-development",
    shortDesc: "Shopify OS 2.0 Liquid themes, Headless Next.js e-commerce, Razorpay UPI & Shiprocket logistics automation.",
    iconName: "ShoppingCart"
  },
  {
    id: "ecommerce-development",
    title: "Ecommerce Website Development",
    slug: "ecommerce-development",
    shortDesc: "Full-stack Next.js online shopping portals, multi-vendor marketplaces, B2B wholesale, and COD OTP verification.",
    iconName: "ShoppingBag"
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design",
    slug: "ui-ux",
    shortDesc: "Human-centered Figma UI design, interactive wireframing, micro-animations, and conversion rate design.",
    iconName: "Palette"
  },
  {
    id: "ai-development",
    title: "AI & Machine Learning",
    slug: "ai-development",
    shortDesc: "Custom LLM integrations, OpenAI/Claude API bots, automated workflow scripts, and predictive data models.",
    iconName: "Cpu"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing & PPC",
    slug: "digital-marketing",
    shortDesc: "ROI-driven Google Ads (PPC), Meta Ads (Facebook & Instagram), WhatsApp automation, and performance marketing.",
    iconName: "TrendingUp"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why does Codelura maintain city-specific location hubs across India?",
    answer: "Every city in India has distinct commercial ecosystems, target consumer behaviors, regional search patterns, and industry dynamics. Our city-specific pages allow local business directors in Prayagraj, Noida, Lucknow, Kanpur, Varanasi, Gurugram, Delhi, Agra, and Meerut to connect with tailored software engineering solutions, local SEO strategies, and dedicated technical support teams who understand their specific market context."
  },
  {
    question: "Does Codelura have local engineering teams available for on-site meetings?",
    answer: "Yes! Our headquarters and primary engineering lab are located in Civil Lines, Prayagraj (Allahabad), serving Eastern UP and surrounding districts. We also deploy technical consultants and solution architects across NCR (Noida, Gurugram, Delhi) and Lucknow for in-person project discovery, system audits, and team onboarding."
  },
  {
    question: "How do I choose the right location hub for my business?",
    answer: "Select the city where your primary operational office, target customer base, or commercial market is situated. For example, if you run a coaching center in Katra or a clinic in George Town, explore our Prayagraj hub. If you operate an IT enterprise in Sector 62 Noida or a corporate house in Cyber City Gurugram, select their respective location hubs."
  },
  {
    question: "Are your software and web development services uniform across all cities?",
    answer: "Yes. All Codelura location hubs adhere to the exact same Google Senior Engineer-grade coding standards: Next.js 15 App Router, React 19, TypeScript, sub-second PageSpeed optimization, 99.99% cloud uptime, enterprise security protocols, and transparent itemized pricing."
  },
  {
    question: "Can Codelura develop multi-location digital solutions for expanding regional brands?",
    answer: "Absolutely! We specialize in multi-branch CRM software, multi-warehouse inventory systems, multi-location Google Business Profile (GMB) SEO, and localized landing page architectures designed to dominate search engine results across multiple target cities simultaneously."
  },
  {
    question: "How do I get started with Codelura for a project in my city?",
    answer: "Getting started is effortless! Simply click on your city card above or call us directly at +91 98765 43210. You can also send a message on WhatsApp or submit our online inquiry form. Our regional solution architect will provide a free technical consultation, workflow audit, and project quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Prayagraj Hub", href: "/locations/prayagraj" },
  { title: "Noida Hub", href: "/locations/noida" },
  { title: "Lucknow Hub", href: "/locations/lucknow" },
  { title: "Kanpur Hub", href: "/locations/kanpur" },
  { title: "Varanasi Hub", href: "/locations/varanasi" },
  { title: "Gurugram Hub", href: "/locations/gurugram" },
  { title: "Delhi Hub", href: "/locations/delhi" },
  { title: "Agra Hub", href: "/locations/agra" },
  { title: "Meerut Hub", href: "/locations/meerut" },
  { title: "Prayagraj Web Dev", href: "/locations/prayagraj/website-development" },
  { title: "Prayagraj SEO", href: "/locations/prayagraj/seo-services" },
  { title: "Prayagraj App Dev", href: "/locations/prayagraj/app-development" },
  { title: "Prayagraj Software", href: "/locations/prayagraj/software-development" },
  { title: "Prayagraj WordPress", href: "/locations/prayagraj/wordpress-development" },
  { title: "Prayagraj Shopify", href: "/locations/prayagraj/shopify-development" },
  { title: "Prayagraj Digital Marketing", href: "/locations/prayagraj/digital-marketing" },
  { title: "Prayagraj Ecommerce", href: "/locations/prayagraj/ecommerce-development" },
  { title: "All Services", href: "/services" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Contact Us", href: "/contact" }
];
