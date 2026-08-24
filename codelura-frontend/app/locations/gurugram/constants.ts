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
  tagline: "Top Software Company & IT Engineering Hub in Gurugram (Gurgaon)",
  primaryKeyword: "Software Development Company in Gurugram",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "gurugram@codelura.com",
  contactEmail: "contact@codelura.com",
  address: "Codelura Tech Center, Cyber City, DLF Phase 2, Near Cyber City Metro Station, Gurugram (Gurgaon), Haryana 122002, India",
  coordinates: {
    lat: 28.4950,
    lng: 77.0890
  },
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.562341234567!2d77.0890!3d28.4950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d190000000001%3A0x123456789abcdef!2sDLF%20Cyber%20City%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const NEARBY_AREAS: NearbyArea[] = [
  { name: "Cyber City (DLF Cyber City)", zipCode: "122002", landmark: "Cyber Hub & Rapid Metro Station", description: "Global corporate hub housing Fortune 500 tech MNCs, enterprise SaaS firms, and IT software development labs." },
  { name: "Golf Course Road (Sector 53, 54, 55)", zipCode: "122003", landmark: "One Horizon Center & Genpact Chowk", description: "Premium corporate corridor housing luxury D2C brand headquarters, financial consultancies, and high-end software houses." },
  { name: "Udyog Vihar (Phase 1, 2, 3, 4, 5)", zipCode: "122016", landmark: "NH-48 Border & IT Industrial Zone", description: "Densely populated software engineering & B2B manufacturing hub deploying custom ERP, CRM, and Next.js web applications." },
  { name: "Sohna Road (Sector 47, 48, 49, 50)", zipCode: "122018", landmark: "Spaze iTech Park & JMD Megapolis", description: "Major tech park hub housing AI startups, healthcare polyclinics, and e-commerce platforms requiring custom software & AEO/SEO." },
  { name: "Golf Course Extension Road (Sector 62, 65, 66)", zipCode: "122102", landmark: "M3M Urbanwear & Corporate Parks", description: "Rapidly growing corporate & residential real estate hub deploying custom builder web apps, 3D property portals, and local search SEO." },
  { name: "DLF Phase 1, 2, 3, 4, 5", zipCode: "122002", landmark: "Galleria Market & Sikanderpur Metro", description: "Upscale residential & commercial retail district home to boutique D2C stores, medical clinics, and digital agencies using mobile apps." },
  { name: "MG Road (Sector 25, 28)", zipCode: "122002", landmark: "MGF Metropolitan & Sahara Mall", description: "Central commercial shopping & business hub requiring high-converting Shopify e-commerce stores, performance marketing, and PPC ads." },
  { name: "IMT Manesar", zipCode: "122051", landmark: "Industrial Model Township & NH-48", description: "Primary auto manufacturing and supply chain hub where factories deploy custom inventory ERP software, IoT tracking, and B2B portals." },
  { name: "Sector 44 & Sector 32", zipCode: "122003", landmark: "Institutional Area & Fortis Hospital", description: "Corporate institutional zone housing software R&D centers, healthcare polyclinics, and training academies deploying custom HMS software." },
  { name: "Sector 14 & 31", zipCode: "122001", landmark: "Old Delhi Road & Central Market", description: "Traditional commercial hub where coaching centers, retail merchants, and local doctors deploy mobile apps, Next.js sites, and local SEO." },
  { name: "Dwarka Expressway (Sector 102, 106, 110, 113)", zipCode: "122017", landmark: "Delhi-Gurugram Border Corridor", description: "Rapidly expanding township corridor where real estate developers, logistics warehouses, and schools deploy custom web portals." },
  { name: "Cyber Hub (Sector 24)", zipCode: "122002", landmark: "Premier Dining & Corporate Showcase", description: "High-visibility retail and corporate event space where brands deploy interactive mobile apps, QR web experiences, and performance ads." }
];

export const GURUGRAM_SERVICES: ServiceCardItem[] = [
  {
    id: "software-development",
    title: "Software Development Company in Gurugram",
    shortDesc: "Enterprise SaaS products, custom ERP, CRM systems & cloud microservices for Cyber City tech firms.",
    fullDesc: "Codelura Technologies builds enterprise-grade software applications for Gurugram tech firms. Features multi-tenant SaaS architecture, cloud microservices, custom CRM/ERP, and sub-second API performance.",
    iconName: "Code",
    tag: "Enterprise SaaS & ERP",
    url: "/locations/gurugram/software-development"
  },
  {
    id: "app-development",
    title: "App Development Company in Gurugram",
    shortDesc: "High-performance Flutter, React Native, iOS & Android mobile apps engineered for startups & enterprises.",
    fullDesc: "Engineering 60fps cross-platform and native mobile apps in Cyber City & Golf Course Road. Features offline sync, biometric security, Play Store publishing, and Razorpay/Stripe UPI integrations.",
    iconName: "Smartphone",
    tag: "Flutter & React Native",
    url: "/locations/gurugram/app-development"
  },
  {
    id: "website-development",
    title: "Website Development Company in Gurugram",
    shortDesc: "Custom Next.js 15, React 19 & Tailwind CSS v4 responsive business websites built for sub-second page speed.",
    fullDesc: "We build ultra-fast corporate websites and web apps for Gurugram brands. Features sub-200ms TTFB speeds, 95+ PageSpeed score, Product Schema, and AI Overviews search optimization.",
    iconName: "Globe",
    tag: "Sub-Second Speed",
    url: "/locations/gurugram/website-development"
  },
  {
    id: "seo-services",
    title: "SEO Services in Gurugram",
    shortDesc: "Rank #1 on Google Maps 3-Pack and dominate AI Overviews search results across Gurugram & Gurgaon.",
    fullDesc: "Dominate local & global search results. We optimize Google Business Profiles (GBP), technical Entity SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and local citations.",
    iconName: "Search",
    tag: "AEO & GEO Search Rank",
    url: "/locations/gurugram/seo-services"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Agency in Gurugram",
    shortDesc: "ROI-driven Google Ads (PPC), Meta Ads (FB & IG), LinkedIn B2B lead generation & performance marketing.",
    fullDesc: "Accelerate your pipeline with performance marketing campaigns in Gurugram. We manage high-ROAS PPC campaigns, social media ads, WhatsApp automation, and B2B lead generation for Cyber City & Udyog Vihar firms.",
    iconName: "TrendingUp",
    tag: "High-ROAS Lead Gen",
    url: "/locations/gurugram/digital-marketing"
  },
  {
    id: "ecommerce-development",
    title: "Ecommerce Website Development Gurugram",
    shortDesc: "Headless Next.js e-commerce portals, multi-vendor marketplaces, B2B portals & custom online stores.",
    fullDesc: "Scale your digital sales with custom headless e-commerce solutions built on Next.js, Stripe, Razorpay, and Shiprocket API integrations. Includes COD verification & real-time inventory sync.",
    iconName: "ShoppingBag",
    tag: "Headless E-Commerce",
    url: "/locations/gurugram/ecommerce-development"
  },
  {
    id: "shopify-development",
    title: "Shopify Store Development Gurugram",
    shortDesc: "Shopify OS 2.0 theme development, Headless Shopify Next.js stores, D2C brand design & migration.",
    fullDesc: "Build custom Shopify stores for D2C brands on Golf Course Road & MG Road. Custom Liquid themes, sub-second mobile store speed, app integrations, and conversion rate optimization.",
    iconName: "ShoppingCart",
    tag: "Shopify OS 2.0 & D2C",
    url: "/locations/gurugram/shopify-development"
  },
  {
    id: "wordpress-development",
    title: "WordPress Development Company in Gurugram",
    shortDesc: "Custom Gutenberg themes, zero-bloat corporate CMS sites, 95+ PageSpeed score & speed optimization.",
    fullDesc: "Enterprise WordPress development for Gurugram corporate portals and consultancies in Cyber City. High-security PHP architectures, speed optimization, and custom Elementor/Gutenberg builds.",
    iconName: "Layout",
    tag: "95+ PageSpeed CMS",
    url: "/locations/gurugram/wordpress-development"
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

export const GURUGRAM_FAQS: FAQItem[] = [
  {
    question: "Why is Codelura Technologies recognized as the top software company in Gurugram (Gurgaon)?",
    answer: "Codelura Technologies stands out in Gurugram due to our Google Senior Engineer-led team, deep expertise in Next.js 15, React 19, Flutter, Python AI pipelines, and cloud microservices. Located near Cyber City & Udyog Vihar, we engineer custom software, web apps, and mobile solutions engineered for speed, sub-second PageSpeed scores, security, and high conversion rates."
  },
  {
    question: "What commercial areas in Gurugram does Codelura Technologies cover?",
    answer: "We serve businesses across all major business sectors of Gurugram, including Cyber City (DLF Cyber City), Golf Course Road, Udyog Vihar (Phases 1-5), Sohna Road (Spaze iTech Park), Golf Course Extension Road, MG Road, DLF Phases 1-5, IMT Manesar, and Dwarka Expressway."
  },
  {
    question: "How does Codelura implement AEO, SEO, and GEO for Gurugram businesses?",
    answer: "Our search strategy combines three layers: SEO (Search Engine Optimization for Google Map 3-Pack and traditional keyword rankings), AEO (Answer Engine Optimization structured for voice queries & Google Assistant), and GEO (Generative Engine Optimization structured for AI search engines like ChatGPT Search, Perplexity AI, Gemini, and Claude). This ensures your brand dominates both traditional Google search and modern AI answers."
  },
  {
    question: "How long does a typical software or mobile app development project take in Gurugram?",
    answer: "Standard corporate websites and landing pages are completed in 1 to 2 weeks. Custom mobile apps (Flutter/React Native) and e-commerce stores take 3 to 6 weeks. Enterprise software systems (ERP, CRM, SaaS products) typically take 6 to 12 weeks depending on modular scope."
  },
  {
    question: "Does Codelura Technologies offer NDA and IP protection for Gurugram startups & enterprises?",
    answer: "Yes, 100%. Before project commencement, we execute a legally binding Non-Disclosure Agreement (NDA) and Intellectual Property (IP) Transfer Agreement. All source code repositories, design assets, and database schemas remain your exclusive property."
  }
];
