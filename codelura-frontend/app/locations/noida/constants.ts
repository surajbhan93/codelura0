export interface ServiceCardItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tag: string;
  url: string;
}

export interface TechItem {
  name: string;
  category: string;
  desc: string;
}

export interface IndustryItem {
  name: string;
  location: string;
  count: string;
  description: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  metric: string;
  desc: string;
  imageUrl: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
  rating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NearbyArea {
  name: string;
  zipCode: string;
  landmark: string;
  description: string;
}

export const COMPANY_DETAILS = {
  name: "Codelura Technologies",
  tagline: "Top Software Company & IT Engineering Hub in Noida (NCR)",
  primaryKeyword: "Software Development Company in Noida",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "noida@codelura.com",
  contactEmail: "contact@codelura.com",
  address: "Codelura Tech Center, Sector 62, Near Electronic City Metro Station, Noida, Uttar Pradesh 201309, India",
  coordinates: {
    lat: 28.6280,
    lng: 77.3649
  },
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562341234567!2d77.3649!3d28.6280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce50000000001%3A0x123456789abcdef!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const NEARBY_AREAS: NearbyArea[] = [
  { name: "Sector 62", zipCode: "201309", landmark: "Stellar IT Park & Electronic City Metro", description: "Primary IT & Software hub housing major corporate towers, software engineering firms, and cloud data centers." },
  { name: "Sector 18", zipCode: "201301", landmark: "DLF Mall of India & Atta Market", description: "Major commercial, retail & D2C brand center requiring high-performance e-commerce platforms, iOS/Android apps, and performance marketing." },
  { name: "Sector 63", zipCode: "201307", landmark: "Electronic City Industrial Corridor", description: "High-density industrial & software development corridor where B2B companies deploy custom ERP software, CRM portals, and web apps." },
  { name: "Noida Expressway (Sector 125, 126, 127, 132, 142)", zipCode: "201313", landmark: "Corporate Tech Parks & MNC Campuses", description: "Modern IT corridor housing global tech MNCs, SaaS product startups, and real estate developers using Next.js enterprise web platforms." },
  { name: "Greater Noida West (Noida Extension)", zipCode: "201306", landmark: "Gaur City & Commercial Townships", description: "Rapidly expanding township hub where retail brands, private academies, and healthcare polyclinics deploy custom web apps & Local SEO." },
  { name: "Electronic City", zipCode: "201309", landmark: "Metro Station & Tech Hub", description: "Tech hardware & software hub requiring cloud microservices, sub-second Next.js web portals, and AI integration services." },
  { name: "Film City (Sector 16A)", zipCode: "201301", landmark: "Media & Broadcast Studio Hub", description: "National news networks, media broadcast houses, and digital agencies using high-traffic WordPress & media web portals." },
  { name: "Knowledge Park (Greater Noida)", zipCode: "201310", landmark: "KP 1, 2, 3, 4, 5 Educational Corridor", description: "Educational campus corridor housing engineering colleges and business schools deploying EdTech portals, LMS software, and student mobile apps." },
  { name: "Sector 15 & 16", zipCode: "201301", landmark: "Metro Station & Corporate Offices", description: "Transit commercial district where legal firms, financial consultancies, and digital agencies deploy web portals & Google Ads." },
  { name: "Sector 50 & 76/78", zipCode: "201301", landmark: "Spectrum Mall & Residential Towers", description: "Upscale residential & commercial retail hub where specialized medical clinics, boutique stores, and schools deploy mobile apps & SEO." },
  { name: "Pari Chowk (Greater Noida)", zipCode: "201310", landmark: "Commercial Expressway Gateway", description: "Commercial gateway where real estate builders, logistics warehouses, and industrial suppliers deploy custom B2B software portals." },
  { name: "Phase 2 & Sector 80/81", zipCode: "201305", landmark: "Industrial Manufacturing Zone", description: "Manufacturing & export zone where factories deploy custom inventory management software, supply chain ERP, and B2B portals." }
];

export const NOIDA_SERVICES: ServiceCardItem[] = [
  {
    id: "software-development",
    title: "Software Development Company in Noida",
    shortDesc: "Enterprise SaaS products, custom ERP, CRM systems & cloud microservices for Noida corporate tech parks.",
    fullDesc: "Codelura Technologies builds enterprise-grade software applications for Noida tech firms. Features multi-tenant SaaS architecture, cloud microservices, custom CRM/ERP, and sub-second API performance.",
    iconName: "Code",
    tag: "Enterprise SaaS & ERP",
    url: "/locations/noida/software-development"
  },
  {
    id: "app-development",
    title: "App Development Company in Noida",
    shortDesc: "High-performance Flutter, React Native, iOS & Android mobile apps engineered for startups & enterprises.",
    fullDesc: "Engineering 60fps cross-platform and native mobile apps in Sector 62 & Sector 18. Features offline sync, biometric security, Play Store publishing, and Razorpay/Stripe UPI integrations.",
    iconName: "Smartphone",
    tag: "Flutter & React Native",
    url: "/locations/noida/app-development"
  },
  {
    id: "website-development",
    title: "Website Development Company in Noida",
    shortDesc: "Custom Next.js 15, React 19 & Tailwind CSS v4 responsive business websites built for sub-second page speed.",
    fullDesc: "We build ultra-fast corporate websites and web apps for Noida brands. Features sub-200ms TTFB speeds, 95+ PageSpeed score, Product Schema, and AI Overviews search optimization.",
    iconName: "Globe",
    tag: "Sub-Second Speed",
    url: "/locations/noida/website-development"
  },
  {
    id: "seo-services",
    title: "SEO Services in Noida",
    shortDesc: "Rank #1 on Google Maps 3-Pack and dominate AI Overviews search results across Noida & Greater Noida.",
    fullDesc: "Dominate local & global search results. We optimize Google Business Profiles (GBP), technical Entity SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and local citations.",
    iconName: "Search",
    tag: "AEO & GEO Search Rank",
    url: "/locations/noida/seo-services"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Agency in Noida",
    shortDesc: "ROI-driven Google Ads (PPC), Meta Ads (FB & IG), LinkedIn B2B lead generation & performance marketing.",
    fullDesc: "Accelerate your pipeline with performance marketing campaigns in Noida. We manage high-ROAS PPC campaigns, social media ads, WhatsApp automation, and B2B lead generation for Sector 62 & 18 firms.",
    iconName: "TrendingUp",
    tag: "High-ROAS Lead Gen",
    url: "/locations/noida/digital-marketing"
  },
  {
    id: "ecommerce-development",
    title: "Ecommerce Website Development Noida",
    shortDesc: "Headless Next.js e-commerce portals, multi-vendor marketplaces, B2B portals & custom online stores.",
    fullDesc: "Scale your digital sales with custom headless e-commerce solutions built on Next.js, Stripe, Razorpay, and Shiprocket API integrations. Includes COD verification & real-time inventory sync.",
    iconName: "ShoppingBag",
    tag: "Headless E-Commerce",
    url: "/locations/noida/ecommerce-development"
  },
  {
    id: "shopify-development",
    title: "Shopify Store Development Noida",
    shortDesc: "Shopify OS 2.0 theme development, Headless Shopify Next.js stores, D2C brand design & migration.",
    fullDesc: "Build custom Shopify stores for D2C brands in Sector 18 & Greater Noida. Custom Liquid themes, sub-second mobile store speed, app integrations, and conversion rate optimization.",
    iconName: "ShoppingCart",
    tag: "Shopify OS 2.0 & D2C",
    url: "/locations/noida/shopify-development"
  },
  {
    id: "wordpress-development",
    title: "WordPress Development Company in Noida",
    shortDesc: "Custom Gutenberg themes, zero-bloat corporate CMS sites, 95+ PageSpeed score & speed optimization.",
    fullDesc: "Enterprise WordPress development for Noida corporate portals and media agencies in Film City. High-security PHP architectures, speed optimization, and custom Elementor/Gutenberg builds.",
    iconName: "Layout",
    tag: "95+ PageSpeed CMS",
    url: "/locations/noida/wordpress-development"
  }
];

export const TECH_STACK: TechItem[] = [
  { name: "Next.js 15", category: "Frontend", desc: "App Router, Server Components & Sub-Second SSR" },
  { name: "React 19", category: "Frontend", desc: "Modern Hooks, Suspense & Concurrent UI State" },
  { name: "TypeScript", category: "Frontend", desc: "Strict Type Safety & Zero Runtime Type Error Engineering" },
  { name: "Tailwind CSS v4", category: "Frontend", desc: "Utility-First Responsive UI & Custom Design Systems" },
  { name: "Flutter", category: "Mobile", desc: "Single-Codebase 60fps iOS & Android Cross-Platform Apps" },
  { name: "React Native", category: "Mobile", desc: "Native iOS & Android Mobile Apps with Bridge Architecture" },
  { name: "Node.js / Express", category: "Backend", desc: "High-Throughput Microservice APIs & Event Loops" },
  { name: "Python / FastAPI", category: "Backend", desc: "AI / ML Integration, RAG Pipelines & Data Processing" },
  { name: "PostgreSQL & MongoDB", category: "Database", desc: "ACID Compliant Relational Data & Flexible NoSQL Vaults" },
  { name: "AWS & Vercel", category: "DevOps", desc: "99.99% Uptime Cloud Hosting, Serverless & Edge CDN" }
];

export const NOIDA_FAQS: FAQItem[] = [
  {
    question: "Why is Codelura Technologies recognized as the top software company in Noida?",
    answer: "Codelura Technologies stands out in Noida due to our Google Senior Engineer-led team, deep expertise in Next.js 15, React 19, Flutter, Python AI pipelines, and cloud microservices. Located near Sector 62 & 63 IT corridors, we engineer custom software, web apps, and mobile solutions engineered for speed, sub-second PageSpeed scores, security, and high conversion rates."
  },
  {
    question: "What areas in Noida & Greater Noida does Codelura Technologies cover?",
    answer: "We serve businesses across all sectors of Noida and Greater Noida, including Sector 62 (Stellar IT Park), Sector 18 (Commercial Hub), Sector 63 (Industrial & Tech Corridor), Noida Expressway (Sectors 125, 126, 132, 142), Greater Noida West (Noida Extension), Electronic City, Film City Sector 16A, and Knowledge Park 1 to 5."
  },
  {
    question: "How does Codelura implement AEO, SEO, and GEO for Noida businesses?",
    answer: "Our search strategy combines three layers: SEO (Search Engine Optimization for Google Map 3-Pack and traditional keyword rankings), AEO (Answer Engine Optimization structured for voice queries & Google Assistant), and GEO (Generative Engine Optimization structured for AI search engines like ChatGPT Search, Perplexity AI, Gemini, and Claude). This ensures your brand dominates both traditional Google search and modern AI answers."
  },
  {
    question: "How long does a typical software or mobile app development project take in Noida?",
    answer: "Standard business websites and landing pages are completed in 1 to 2 weeks. Custom mobile apps (Flutter/React Native) and e-commerce stores take 3 to 6 weeks. Enterprise software systems (ERP, CRM, SaaS products) typically take 6 to 12 weeks depending on modular scope."
  },
  {
    question: "Does Codelura Technologies offer NDA and IP protection for Noida startups & enterprises?",
    answer: "Yes, 100%. Before project commencement, we execute a legally binding Non-Disclosure Agreement (NDA) and Intellectual Property (IP) Transfer Agreement. All source code repositories, design assets, and database schemas remain your exclusive property."
  }
];
