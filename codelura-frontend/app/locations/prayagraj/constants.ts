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
  name: "Codelura",
  tagline: "Top Software Company & IT Engineering Hub in Prayagraj",
  primaryKeyword: "Software Company in Prayagraj",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "contact@codelura.com",
  prayagrajEmail: "prayagraj@codelura.com",
  address: "Codelura Tech Center, Civil Lines, Near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001, India",
  coordinates: {
    lat: 25.4520,
    lng: 81.8349
  },
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57639.73456728032!2d81.800000!3d25.450000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398534c000000001%3A0x123456789abcdef!2sCivil%20Lines%2C%20Prayagraj%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const NEARBY_AREAS: NearbyArea[] = [
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central commercial business district housing legal consultancies, real estate offices, and corporate firms requiring custom software solutions." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Polyclinics", description: "Healthcare sector where multi-specialty hospitals, polyclinics, and diagnostic centers use Codelura custom HMS software & local SEO." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center of UP where competitive exam coaching institutes use custom student lead apps and online exam portals." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Academies & Consultancies", description: "Vibrant neighborhood home to educational academies, wealth consultancies, and digital agencies seeking full-stack web solutions." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and retail area requiring mobile-first e-commerce apps and local Instagram lead generation." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Wholesale commercial district where hardware traders and textile suppliers deploy B2B e-commerce software and inventory ERP." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Primary industrial manufacturing hub of Allahabad where factories deploy custom ERP software, IoT tracking, and B2B portals." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding township area where real estate builders and modern lifestyle brands deploy custom Next.js websites." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing colleges and manufacturing units seeking custom web applications and IT infrastructure." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upscale mixed district where private medical clinics and corporate consultancies deploy high-converting web apps." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Cultural tourism hub where local religious artifact and handicraft artisans deploy international Shopify e-commerce stores." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing residential suburb where fitness centers, local merchants, and private schools deploy mobile apps and web portals." }
];

export const PRAYAGRAJ_SERVICES: ServiceCardItem[] = [
  {
    id: "website-development",
    title: "Website Development Company in Prayagraj",
    shortDesc: "Custom Next.js 15, React 19 & Tailwind CSS v4 responsive business websites built for sub-second page speed.",
    fullDesc: "We build ultra-fast, high-converting business landing pages and enterprise web applications for Prayagraj brands. Features sub-200ms TTFB speeds, 95+ PageSpeed score, and Product Schema setup.",
    iconName: "Globe",
    tag: "Sub-Second Speed",
    url: "/locations/prayagraj/website-development"
  },
  {
    id: "seo-services",
    title: "SEO Services in Prayagraj",
    shortDesc: "Rank #1 on Google Maps 3-Pack and dominate AI Overviews search results across Prayagraj & Allahabad.",
    fullDesc: "Dominate local organic search results. We optimize Google Business Profiles (GMB), build local UP directory citations, generate authentic Google reviews, and optimize technical Entity SEO.",
    iconName: "Search",
    tag: "Map 3-Pack Rank",
    url: "/locations/prayagraj/seo-services"
  },
  {
    id: "app-development",
    title: "App Development Company in Prayagraj",
    shortDesc: "High-performance Flutter, React Native, iOS & Android mobile apps engineered for Play Store & App Store.",
    fullDesc: "Transform your business idea into a native-quality mobile app. We engineer secure iOS & Android apps with real-time push notifications, offline mode, Razorpay UPI payment SDK, and biometrics.",
    iconName: "Smartphone",
    tag: "iOS & Android",
    url: "/locations/prayagraj/app-development"
  },
  {
    id: "software-development",
    title: "Software Development Company in Prayagraj",
    shortDesc: "Custom ERP, CRM, Hospital HMS, Coaching Student Portals & Automation software engineered for local enterprises.",
    fullDesc: "Eliminate manual business friction with bespoke cloud software. We build microservices backends, SQL databases, role-based admin portals, and Tally ERP integrations tailored for Prayagraj firms.",
    iconName: "Code",
    tag: "Enterprise ERP",
    url: "/locations/prayagraj/software-development"
  },
  {
    id: "wordpress-development",
    title: "WordPress Development Company in Prayagraj",
    shortDesc: "Custom PHP Gutenberg themes, zero-bloat CMS sites, speed optimization (95+ PageSpeed), and maintenance.",
    fullDesc: "We build custom WordPress websites engineered with custom Liquid/PHP Gutenberg blocks, security hardening, Elementor replacement, and sub-second page rendering without heavy plugin bloat.",
    iconName: "Layout",
    tag: "Zero-Bloat CMS",
    url: "/locations/prayagraj/wordpress-development"
  },
  {
    id: "shopify-development",
    title: "Shopify Development Company in Prayagraj",
    shortDesc: "High-converting Shopify OS 2.0 storefronts with custom Liquid code, COD OTP verification & Shiprocket APIs.",
    fullDesc: "Scale your online retail sales with a high-converting Shopify store. Features custom Liquid theme design, Cash on Delivery (COD) phone OTP verification, 1-click Razorpay UPI, and WhatsApp tracking.",
    iconName: "ShoppingCart",
    tag: "Shopify OS 2.0",
    url: "/locations/prayagraj/shopify-development"
  },
  {
    id: "ecommerce-development",
    title: "Ecommerce Website Development Prayagraj",
    shortDesc: "Full-stack Next.js online shopping portals, multi-vendor marketplaces, B2B wholesale, and COD OTP verification.",
    fullDesc: "For high-volume online retailers and multi-vendor marketplaces in Chowk & Katra. Features sub-200ms Next.js e-commerce architecture, Razorpay 1-click UPI, inventory sync, and Shiprocket logistics.",
    iconName: "ShoppingBag",
    tag: "Full-Stack Store",
    url: "/locations/prayagraj/ecommerce-development"
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing Company in Prayagraj",
    shortDesc: "ROI-focused Google Ads (PPC), Meta Ads (Facebook & Instagram), WhatsApp automation, and performance marketing.",
    fullDesc: "Generate qualified customer and student leads. We engineer high-ROAS Google Search campaigns, Meta Lead Ads, automated WhatsApp broadcast bots, and GA4 event conversion tracking.",
    iconName: "TrendingUp",
    tag: "High ROAS Leads",
    url: "/locations/prayagraj/digital-marketing"
  },
  {
    id: "ai-development",
    title: "AI Development Company in Prayagraj",
    shortDesc: "Custom LLM integrations, OpenAI/Claude API bots, automated workflow scripts, and predictive data models.",
    fullDesc: "Automate repetitive customer support and business operations with custom artificial intelligence software, fine-tuned RAG chatbots, and automated document extraction APIs.",
    iconName: "Cpu",
    tag: "AI & Chatbots",
    url: "/services/ai-development"
  },
  {
    id: "ui-ux-design",
    title: "UI / UX Design Company in Prayagraj",
    shortDesc: "Human-centered Figma UI design, interactive wireframing, micro-animations, and conversion rate design.",
    fullDesc: "Create intuitive, visually breathtaking digital experiences. We design modern Figma component systems, interactive mobile prototypes, user journey flows, and high-conversion landing page layouts.",
    iconName: "Palette",
    tag: "Figma UI Systems",
    url: "/services/ui-ux"
  }
];

export const PACKAGES = [
  {
    name: "Starter Business Web Package",
    price: "₹14,999",
    popular: false,
    description: "Ideal for local shops, advocates, doctors, and new business startups in Prayagraj starting digital presence.",
    features: [
      "Custom 5-Page Next.js 15 Fast Website",
      "Google Business Profile (GMB) & Local SEO Setup",
      "Mobile Responsive Layout & SSL Security Certificate",
      "Click-to-Call & WhatsApp Chat Widget Integration",
      "Sub-Second Page Load Speed (95+ Core Web Vitals)",
      "Free 1 Year High-Speed Cloud Hosting & Domain"
    ]
  },
  {
    name: "Growth Enterprise & E-Commerce Suite",
    price: "₹34,999",
    popular: true,
    description: "Best for coaching institutes, polyclinics, real estate builders, and growing retail D2C stores.",
    features: [
      "Custom Full-Stack Website or E-Commerce Store (Up to 100 Products)",
      "Razorpay / Paytm 1-Click UPI Payment Gateway + COD OTP Setup",
      "Shiprocket Courier Shipping & Automated WhatsApp Tracking",
      "Custom Lead Capture Portal / Student Admission Form System",
      "Targeted Meta Ads (Facebook/Instagram) & Google Ads Setup",
      "1 Year Dedicated Maintenance & Priority Technical SLA"
    ]
  },
  {
    name: "Custom Software & AI Portal Suite",
    price: "₹69,999+",
    popular: false,
    description: "Comprehensive enterprise software, custom mobile app, or multi-vendor marketplace platform.",
    features: [
      "Custom ERP / CRM / Hospital HMS / Multi-Vendor Marketplace",
      "Native iOS & Android Mobile Apps (Flutter / React Native)",
      "Sub-200ms Next.js 15 & Microservice Backend Architecture",
      "Dedicated Senior Software Architect & On-Site Consultation",
      "Tally ERP Integration & Automated BI Analytics Dashboard",
      "Enterprise DDoS Protection, WAF & Automated Cloud Backups"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Next.js 15 & React 19", category: "Web Framework", desc: "Sub-Second App Router Architecture for Custom Websites" },
  { name: "TypeScript & Node.js", category: "Language & Backend", desc: "Strict Type-Safe Microservices & High-Throughput REST APIs" },
  { name: "Flutter & React Native", category: "Mobile Engines", desc: "Cross-Platform Native iOS & Android App Development" },
  { name: "WordPress & Shopify OS 2.0", category: "CMS & E-Commerce", desc: "Zero-Bloat CMS Themes & High-Converting Online Shopping Stores" },
  { name: "PostgreSQL & MongoDB", category: "Databases", desc: "ACID-Compliant Relational & Document Cloud Databases" },
  { name: "Google & Meta Ads Engine", category: "Growth Marketing", desc: "High-ROAS PPC, Lead Gen Ads & WhatsApp API Automation" },
  { name: "Semrush & Ahrefs", category: "SEO Suite", desc: "Entity Keyword Mapping, Local Citations & Competitor Audits" },
  { name: "Tailwind CSS v4 & Framer", category: "Styling & Motion", desc: "Glassmorphic Modern Design & Smooth Micro-Animations" },
  { name: "Razorpay & Paytm SDKs", category: "Payments API", desc: "1-Click UPI (GPay, PhonePe) & Automated COD OTP Verification" },
  { name: "Shiprocket & Delhivery", category: "Logistics APIs", desc: "Automated Shipping Labels & Real-Time WhatsApp Tracking Alerts" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "45+ Institutes Scaled", description: "Empowering IAS, NEET, and JEE coaching academies in Katra with student lead apps, online test portals, and Meta ads." },
  { name: "Hospitals & Diagnostic Polyclinics", location: "George Town, Ashok Nagar", count: "30+ Healthcare Clients", description: "Building custom Hospital Management Systems (HMS), doctor appointment apps, and Google Call Ads for polyclinics." },
  { name: "Real Estate Builders & Developers", location: "Civil Lines, Jhalwa, Jhunsi", count: "25+ Property Projects", description: "Designing high-converting property showcase web apps, WhatsApp virtual tour bots, and buyer lead campaigns in Civil Lines." },
  { name: "Saree & Fashion D2C Merchants", location: "Chowk, Katra, Civil Lines", count: "50+ Retail Stores Online", description: "Helping local Chowk handloom and saree merchants launch online shopping stores with 1-click Razorpay UPI." },
  { name: "Academic Book Publishers", location: "Katra, Tagore Town", count: "35+ Book E-Commerce Portals", description: "Building high-throughput book e-commerce platforms with instant PDF note downloads and Shiprocket courier integration." },
  { name: "Factories & Industrial Plants", location: "Naini Industrial Area, Lukerganj", count: "20+ Manufacturing Clients", description: "Engineered custom B2B inventory ERP software, supply chain tracking, and industrial lead generation for factories in Naini." },
  { name: "Law Firms & CA Practices", location: "High Court, Civil Lines", count: "15+ Professional Practices", description: "Positioning advocates and chartered accountants near Allahabad High Court with authority websites and Local SEO." },
  { name: "Hotels & Kumbh Tourism Agencies", location: "Daraganj, Sangam Ghats", count: "25+ Hospitality Brands", description: "Driving hotel room bookings, boat tour reservations, and international pilgrim booking portals during Mahakumbh." }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: "Katra Competitive Exam Institute Lead Portal",
    category: "EdTech & Student Lead Generation",
    metric: "4,500+ Student Leads & 2x Admissions",
    desc: "Engineered a high-converting student admission portal and mobile app for a premier IAS academy in Katra, integrated with automated WhatsApp brochure sending.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio1.webp"
  },
  {
    title: "Chowk Handloom Saree D2C Store",
    category: "Full-Stack Next.js 15 E-Commerce",
    metric: "4.5x Sales Growth & ₹22 Lakhs Monthly GMV",
    desc: "Built a fast custom online shopping portal for a renowned saree merchant in Chowk, featuring variant color swatches, 1-click Razorpay UPI, and automated shipping.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio2.webp"
  },
  {
    title: "George Town Hospital Management & SEO",
    category: "Healthcare HMS & Local Patient Ads",
    metric: "320+ Monthly OPD Doctor Appointments",
    desc: "Developed a custom web application and managed Google Local Search Ads for a multi-specialty polyclinic in George Town, filling doctor schedules.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio3.webp"
  },
  {
    title: "Civil Lines Real Estate Housing Launch",
    category: "Property Showcase & Lead Ads",
    metric: "₹12 Cr Property Sales Generated",
    desc: "Created a modern Next.js property showcase portal and targeted Facebook lead ads for a premier residential builder in Civil Lines.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio4.webp"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Codelura is undisputed as the #1 software company in Prayagraj! They built a custom student lead app and Next.js website for our Katra coaching institute. Admissions doubled in 60 days!",
    author: "Rakesh Nath Pandey",
    role: "Managing Director",
    company: "Pandey IAS & State PSC Academy",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We hired Codelura to build an e-commerce website for our saree retail shop in Chowk. Their team delivered a fast Next.js store integrated with Razorpay UPI and Shiprocket. We now sell sarees nationwide!",
    author: "Harish Chandra Rastogi",
    role: "Founder",
    company: "Rastogi Handlooms & Silks",
    location: "Chowk, Prayagraj",
    rating: 5
  },
  {
    quote: "Codelura engineered a custom Hospital Management System and optimized Google Local SEO for our clinic in George Town. Doctor appointment bookings surged 200%! Outstanding team in Civil Lines.",
    author: "Dr. Sunita Keshari",
    role: "Chief Medical Officer",
    company: "Keshari Care Hospital",
    location: "George Town, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top software company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading IT and software development company in Prayagraj because we engineer custom, high-performance digital solutions (Next.js 15, React 19, Flutter apps, custom ERPs, Local SEO, and Google/Meta Ads) tailored to Prayagraj's unique business landscape. We operate directly from Civil Lines, providing senior Google-grade software engineering with transparent itemized pricing."
  },
  {
    question: "What digital services does Codelura offer in Prayagraj?",
    answer: "Codelura provides complete end-to-end IT services in Prayagraj, including Website Development, Search Engine Optimization (SEO), Mobile App Development (iOS & Android), Custom Enterprise Software Development (ERP/CRM/HMS), WordPress Development, Shopify Store Engineering, E-Commerce Website Development, AI & Chatbot Automation, UI/UX Design, and Performance Digital Marketing."
  },
  {
    question: "Where is Codelura’s office located in Prayagraj?",
    answer: "Our tech center and engineering laboratory are located at Civil Lines Tech Center, near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001. Clients are welcome to visit our office for in-person project consultations, technical audits, and team onboarding."
  },
  {
    question: "How much does website and software development cost in Prayagraj?",
    answer: "At Codelura, pricing is 100% transparent: Starter Business Website packages start at ₹14,999; Growth E-Commerce & Lead Generation Suites range between ₹34,999 to ₹45,000; and Enterprise Software / Mobile App portals start at ₹69,999. Every project includes a detailed scope document and explicit deliverables."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh partner with Codelura?",
    answer: "Katra is UP's competitive exam coaching hub. We build custom student lead generation portals, online mock test applications, WhatsApp brochure bots, and run targeted Meta/Google Ads that help Katra coaching centers capture student enrollments before competitors."
  },
  {
    question: "How do you help multi-specialty hospitals and doctors in George Town?",
    answer: "We develop custom Hospital Management Systems (HMS), OPD doctor appointment booking portals, and execute Google Local Call Ads and Google Maps 3-Pack Local SEO campaigns that fill clinic appointment schedules in George Town and Ashok Nagar."
  },
  {
    question: "Can Codelura help retail saree and fashion shops in Chowk sell online across India?",
    answer: "Yes! We build high-converting e-commerce storefronts (using Next.js 15, Shopify OS 2.0, or WooCommerce) for Chowk saree and textile merchants, complete with 1-click Razorpay UPI, Cash on Delivery (COD) OTP fraud protection, and automated Shiprocket shipping."
  },
  {
    question: "Do you provide native iOS and Android mobile app development in Prayagraj?",
    answer: "Yes! Our mobile engineering team builds cross-platform Flutter and React Native apps as well as native Swift & Kotlin mobile applications complete with biometrics, real-time push notifications, payment gateways, and Play Store / App Store deployment."
  },
  {
    question: "Will my website rank #1 on Google in Prayagraj?",
    answer: "Yes! Every web project engineered by Codelura includes advanced Local SEO and Entity Schema setup: Google Business Profile (GMB) optimization, local directory citations, Product & LocalBusiness JSON-LD Schema markup, and 95+ Core Web Vitals performance."
  },
  {
    question: "How fast can Codelura deliver a completed website or software project?",
    answer: "Standard business landing pages are launched within 5 to 7 business days. Custom e-commerce stores and mobile apps take 2 to 3 weeks, while complex enterprise software portals take 4 to 6 weeks depending on custom feature requirements."
  },
  {
    question: "Do you offer ongoing website maintenance and 24/7 technical support in Prayagraj?",
    answer: "Yes! We provide comprehensive post-launch maintenance SLAs, including 24/7 server monitoring, security patching, festive traffic preparation (Diwali, Kumbh Mela), catalog updates, and priority developer support."
  },
  {
    question: "What nearby areas in Prayagraj does Codelura serve?",
    answer: "We serve businesses across all major localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do we get started with Codelura for a software or web project in Prayagraj?",
    answer: "Getting started is effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or visit our Civil Lines tech hub. Our team will conduct a free consultation, workflow audit, and project quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
  { title: "Software Development Prayagraj", href: "/locations/prayagraj/software-development" },
  { title: "WordPress Development Prayagraj", href: "/locations/prayagraj/wordpress-development" },
  { title: "Shopify Development Prayagraj", href: "/locations/prayagraj/shopify-development" },
  { title: "Ecommerce Development Prayagraj", href: "/locations/prayagraj/ecommerce-development" },
  { title: "Digital Marketing Prayagraj", href: "/locations/prayagraj/digital-marketing" },
  { title: "All Services", href: "/services" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
