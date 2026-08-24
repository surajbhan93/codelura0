export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tag: string;
}

export interface PackageItem {
  name: string;
  price: string;
  popular: boolean;
  description: string;
  features: string[];
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
  tagline: "Premier Website Development Company in Prayagraj",
  primaryKeyword: "Website Development Company in Prayagraj",
  phone: "+91-9336289192",
  whatsappPhone: "919336289192",
  email: "codelura@gmail.com",
  prayagrajEmail: "prayagraj@codelura.com",
  address: "Serving businesses across Prayagraj (Allahabad), Uttar Pradesh, India. Meetings available by appointment only.",
  coordinates: {
    lat: 25.4520,
    lng: 81.8349
  },
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3638176.8763885195!2d79.94982635000001!3d27.064680000000003!2m3!1f0!2f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaffd137a4606f611%3A0x3b99bb2bbe4701ec!2sCodelura%20Technologies%20%7C%20Website%20Development%20%26%20Software%20Solutions%20in%20Prayagraj!5e0!3m2!1sen!2sin!4v1784703949201!5m2!1sen!2sin"
};
export const NEARBY_AREAS: NearbyArea[] = [
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central business sector where corporate houses, law firms, and consultancy agencies require custom WordPress corporate websites." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Corridor & Polyclinics", description: "Healthcare sector where multi-specialty hospitals and clinics need easy-to-update WordPress medical websites." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center of UP where competitive exam coaching institutes need custom WordPress student blogs and lead portals." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Services & Academies", description: "Vibrant neighborhood where CA firms, academies, and private consultants require custom WordPress websites." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and retail area requiring mobile-optimized WordPress sites with fast loading speeds." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Commercial district where retail merchants and wholesalers need WooCommerce online shopping stores." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Industrial zone of Allahabad where B2B factories require product catalog WordPress websites and RFQ lead portals." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Expanding township area where real estate developers require dynamic property listing WordPress sites." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing manufacturing units and colleges seeking customized WordPress CMS solutions." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upscale mixed district with specialist medical centers and finance firms seeking fast WordPress web design." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Pilgrimage hub where hotels, travel agencies, and boat tour operators require WordPress tourism booking sites." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing suburb where fitness centers, local shops, and private clinics need affordable WordPress websites." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "custom-wordpress-development",
    title: "Custom WordPress Theme & Gutenberg Development",
    shortDesc: "Bespoke custom WordPress theme engineering with zero bloat and lightning-fast loading speeds.",
    fullDesc: "We craft unique, lightweight WordPress websites tailored to your brand identity in Prayagraj. We eliminate heavy pre-made themes, developing custom Gutenberg block layouts and bespoke PHP code for sub-second performance.",
    iconName: "Layout",
    tag: "Custom Gutenberg"
  },
  {
    id: "woocommerce-development",
    title: "WooCommerce E-Commerce Store Development",
    shortDesc: "High-converting online shopping stores built on WooCommerce with Razorpay UPI & GST invoice setup.",
    fullDesc: "Transform your retail shop in Chowk or Katra into an online e-commerce engine. Includes custom WooCommerce theme design, 1-click Razorpay/Paytm UPI checkout, stock inventory tracking, automated shipping alerts, and GST billing.",
    iconName: "ShoppingCart",
    tag: "WooCommerce Sales"
  },
  {
    id: "wordpress-speed-optimization",
    title: "WordPress Speed Optimization & Core Web Vitals",
    shortDesc: "Achieve 95+ PageSpeed scores on Google Lighthouse with advanced caching, image compression & DB cleanup.",
    fullDesc: "Is your WordPress site slow? We fix performance bottlenecks by setting up Redis/Object caching, WebP image compression, CSS/JS minification, database query optimization, and CDN edge caching to ensure sub-second loads.",
    iconName: "Zap",
    tag: "95+ PageSpeed"
  },
  {
    id: "wordpress-security-hardening",
    title: "WordPress Security Hardening & Malware Removal",
    shortDesc: "Bank-grade security hardening, malware cleanup, firewall installation, and automated daily cloud backups.",
    fullDesc: "Protect your WordPress site from hackers and malware. We implement strict security headers, login rate limiting, 2FA authentication, malware vulnerability scanning, database sanitization, and automated daily AWS cloud backups.",
    iconName: "ShieldCheck",
    tag: "Bank Security"
  },
  {
    id: "wordpress-migration-services",
    title: "Seamless WordPress Migration & Server Setup",
    shortDesc: "Zero-downtime website migration from static HTML, Wix, Squarespace, or old hosting to fast cloud servers.",
    fullDesc: "Migrate your business website with 100% data safety. We transfer files, MySQL databases, SSL certificates, and domain DNS settings to high-speed cloud VPS hosting with zero downtime or lost search rankings.",
    iconName: "Globe",
    tag: "Zero Downtime"
  },
  {
    id: "coaching-wordpress-sites",
    title: "Coaching & Institute WordPress Websites Katra",
    shortDesc: "Student registration portals, test series updates, downloadable notes, and batch schedule pages.",
    fullDesc: "Prayagraj is UP's coaching capital. We equip Katra competitive exam coaching academies with fast, easy-to-update WordPress sites featuring batch announcements, downloadable PDF study notes, online student forms, and WhatsApp lead bots.",
    iconName: "GraduationCap",
    tag: "EdTech WordPress"
  },
  {
    id: "hospital-wordpress-sites",
    title: "Hospital & Medical Clinic WordPress Sites",
    shortDesc: "Medical websites with doctor profiles, online appointment booking forms, and department pages.",
    fullDesc: "Engineered for polyclinics, hospitals, and private practitioners in George Town and Ashok Nagar. Features doctor schedules, patient booking forms, emergency helpline triggers, and diagnostic lab report access.",
    iconName: "Stethoscope",
    tag: "Healthcare Site"
  },
  {
    id: "realestate-wordpress-portals",
    title: "Real Estate Property Listing WordPress Sites",
    shortDesc: "Property showcase sites with high-res photo carousels, floor plans, interactive maps & WhatsApp leads.",
    fullDesc: "Tailored for real estate builders and brokers in Civil Lines and Jhalwa. Showcase residential flats, commercial plots, and township projects with dynamic filterable listings, floor plan popups, and instant WhatsApp inquiry buttons.",
    iconName: "Home",
    tag: "Real Estate Portal"
  },
  {
    id: "corporate-wordpress-development",
    title: "Corporate & Enterprise WordPress Development",
    shortDesc: "High-level corporate portals with multi-author publishing, investor relations, and team directories.",
    fullDesc: "Designed for corporate houses, law firms, and financial consultancies in Civil Lines. Built with multi-role editor permissions, secure document repositories, team profiles, corporate newsrooms, and multi-language support.",
    iconName: "Building2",
    tag: "Corporate CMS"
  },
  {
    id: "landing-page-development",
    title: "High-Converting WordPress Landing Pages",
    shortDesc: "Fast-loading sales landing pages built using Elementor / Gutenberg for Google Ads & Facebook Ads.",
    fullDesc: "Maximize paid campaign conversion rates. We build ultra-fast WordPress landing pages engineered for high click-through rates, clear visual CTAs, lead capture form routing, and Google Ads conversion tracking.",
    iconName: "Search",
    tag: "Max Ads Conversion"
  },
  {
    id: "custom-plugin-development",
    title: "Custom WordPress Plugin Development",
    shortDesc: "Tailor-made PHP WordPress plugins developed to add custom functionality without site bloat.",
    fullDesc: "When existing plugins fall short, Codelura builds custom PHP plugins. Whether you need custom payment gateways, API integrations, automated calculators, or booking engines, we write clean, secure plugin code.",
    iconName: "Code",
    tag: "Plugin Engineering"
  },
  {
    id: "wordpress-maintenance-sla",
    title: "Dedicated WordPress Maintenance & Support SLA",
    shortDesc: "Monthly core updates, plugin testing, security audits, backups, and 24/7 technical help.",
    fullDesc: "Keep your WordPress site operating smoothly. Our dedicated support team in Prayagraj performs weekly plugin updates, database optimization, broken link checks, content updates, and emergency technical assistance.",
    iconName: "Headphones",
    tag: "24/7 SLA Support"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Starter WordPress Package",
    price: "₹11,999",
    popular: false,
    description: "Ideal for small local shops, individual doctors, advocates, and new startups in Prayagraj.",
    features: [
      "5 Custom Designed Mobile Responsive Pages",
      "Fast Custom Gutenberg / Lightweight Theme Setup",
      "Free Domain (.com or .in) for 1 Year",
      "High-Speed Web Hosting & SSL Certificate",
      "WhatsApp Chat Widget & Click-to-Call Buttons",
      "Basic SEO & Meta Tag Optimization",
      "Fast 5 to 7 Days Delivery"
    ]
  },
  {
    name: "Professional Business Package",
    price: "₹21,999",
    popular: true,
    description: "Best for coaching institutes, schools, clinics, real estate, and growing Prayagraj SMBs.",
    features: [
      "Up to 12 Premium Mobile-Optimized Pages",
      "Custom Theme Engineering (Zero Bloat)",
      "WooCommerce E-Commerce or Lead Portal Setup",
      "Razorpay, Paytm & UPI Payment Gateway Integration",
      "Google Search Console & Local SEO Schema Setup",
      "90+ Google PageSpeed Speed Optimization",
      "1 Year Technical Support & Maintenance SLA"
    ]
  },
  {
    name: "Enterprise WooCommerce Suite",
    price: "₹39,999+",
    popular: false,
    description: "Comprehensive e-commerce or corporate portal for multi-location brands and major institutions.",
    features: [
      "Unlimited Custom Pages & Product Catalogs",
      "Full WooCommerce Setup with Inventory & GST Billing",
      "Automated WhatsApp Invoice & Order Tracking Alerts",
      "Custom Plugin Development & API Integrations",
      "Advanced Security Hardening & Malware Defense",
      "Redis Caching & Edge CDN Speed Engineering",
      "Priority 24/7 SLA Technical Maintenance"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "WordPress 6.7+", category: "Core CMS Engine", desc: "Latest Full Site Editing (FSE) & Block API Architecture" },
  { name: "WooCommerce 9+", category: "E-Commerce", desc: "High-Volume Online Retail Merchant Infrastructure" },
  { name: "PHP 8.3+", category: "Server Language", desc: "Fast Engine Execution & Secure Custom Plugin Logic" },
  { name: "MySQL / MariaDB", category: "Database Layer", desc: "Indexed Database Queries & Optimized Database Tables" },
  { name: "Tailwind CSS v4", category: "Styling System", desc: "Utility-First Glassmorphic & Modern Responsive UI Styling" },
  { name: "Gutenberg & Elementor", category: "Visual Editors", desc: "Intuitive Drag-and-Drop Page Building for Non-Tech Users" },
  { name: "Redis Object Cache", category: "Caching Layer", desc: "Sub-Second In-Memory Caching Eliminating DB Overhead" },
  { name: "Razorpay & UPI SDKs", category: "Payment Gateways", desc: "Instant 1-Click Indian Mobile Payment & Invoice Checkout" },
  { name: "Cloudflare & LiteSpeed", category: "Speed & Security", desc: "Global Edge CDN, Web Application Firewall & DDoS Defense" },
  { name: "Next.js 15 (Headless)", category: "Headless CMS", desc: "Decoupled Headless WordPress with Next.js Frontend Rendering" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "40+ WordPress Sites Built", description: "Enabling Katra IAS and NEET coaching centers to publish batch timetables, downloadable PDF notes, and student results." },
  { name: "Hospitals & Diagnostic Clinics", location: "George Town, Ashok Nagar", count: "28+ Medical Sites Built", description: "Helping multi-specialty hospitals and clinics in George Town display doctor profiles, online appointment forms, and lab reports." },
  { name: "Real Estate & Housing Builders", location: "Civil Lines, Jhalwa", count: "22+ Property Portals Built", description: "Showcasing residential apartments and commercial projects in Civil Lines with filterable property listings and WhatsApp routing." },
  { name: "Retail Shops & Merchants", location: "Chowk, Katra, Lukerganj", count: "45+ WooCommerce Stores Built", description: "Powering WooCommerce online shopping stores for local saree merchants, jewelers, and handicraft sellers in Chowk." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi Sector", count: "18+ School Websites Built", description: "Building ICSE, CBSE, and UP Board school sites with online admission forms, event galleries, and fee payment links." },
  { name: "Manufacturing & Industrial Factories", location: "Naini Industrial Area", count: "15+ B2B Catalog Sites", description: "Connecting industrial equipment factories in Naini with national B2B buyers via product catalog WordPress sites." },
  { name: "Law Firms & CA Practices", location: "High Court, Civil Lines", count: "14+ Professional Corporate Sites", description: "Establishing digital authority for advocates and chartered accountants near High Court with clean corporate WordPress design." },
  { name: "Hotels & Tourism Agencies", location: "Daraganj, Sangam Area", count: "20+ Hotel Booking Sites", description: "Promoting hotel room reservations and tour packages during Mahakumbh and Magh Mela festival seasons." }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: "Prayagraj Premier EduPortal",
    category: "Educational Web Platform",
    metric: "320% Increase in Online Student Inquiries",
    desc: "Built a high-performance Next.js student portal for a leading competitive exam institute in Katra, featuring downloadable mock tests and batch registration.",
    imageUrl: "https://res.cloudinary.com/dqaucdncd/image/upload/v1784702876/ChatGPT_Image_Jul_22_2026_12_17_13_PM_syggbn.png"
  },
  {
    title: "George Town Heart Clinic",
    category: "Healthcare Medical Website",
    metric: "4.9 Star Rating with 200+ Monthly Appointments",
    desc: "Engineered a patient booking platform for a multi-specialty clinic in George Town, featuring doctor schedules, tele-consultation links, and emergency triggers.",
    imageUrl: "https://res.cloudinary.com/dqaucdncd/image/upload/v1784703160/20260722_1222_image_hsevxc.png"
  },
  {
    title: "Civil Lines Commercial Plaza",
    category: "Real Estate Property Portal",
    metric: "450+ High-Intent Property Leads",
    desc: "Designed an interactive property showcase for a major real estate builder in Civil Lines, complete with virtual walk-throughs and instant WhatsApp routing.",
    imageUrl: "https://res.cloudinary.com/dqaucdncd/image/upload/v1784703113/ChatGPT_Image_Jul_22_2026_12_21_27_PM_vgkj5d.png"
  },
  {
    title: "Sangam Craft Handloom E-Commerce",
    category: "D2C Shopify Retail Store",
    metric: "₹18 Lakhs Monthly Online Sales",
    desc: "Launched a fast Shopify store for local Prayagraj textile artisans, delivering authentic handloom sarees and crafts to customers across India and abroad.",
    imageUrl: "https://res.cloudinary.com/dqaucdncd/image/upload/v1784703496/20260722_1228_image_zx8bpp.png"
  }
];


export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Codelura is hands down the best WordPress development company in Prayagraj! They built a custom, lightning-fast WordPress site for our Katra coaching institute. Updating batch timetables and notes takes just seconds!",
    author: "Satish Chandra Mishra",
    role: "Director",
    company: "Mishra Competitive Classes, Katra",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We wanted a WooCommerce store for our retail shop in Chowk. Codelura delivered a fast, secure website integrated with Razorpay UPI payment gateway. Online sales have grown steadily every month!",
    author: "Manish Agrawal",
    role: "Owner",
    company: "Agrawal Retail & Handloom",
    location: "Chowk, Allahabad",
    rating: 5
  },
  {
    quote: "Our medical clinic website in George Town was outdated and slow. Codelura redesigned it on WordPress, improved speed, and added doctor booking forms. Patient feedback has been fantastic!",
    author: "Dr. Ritu Srivastava",
    role: "Chief Consultant",
    company: "Srivastava Health Care Polyclinic",
    location: "George Town, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top WordPress development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading WordPress agency in Prayagraj because we engineer custom, lightweight WordPress websites without relying on slow pre-made templates or bloated plugins. We build custom Gutenberg blocks, write clean PHP code, optimize for 95+ Google PageSpeed scores, integrate Razorpay UPI payments, and deliver complete local SEO optimization for Prayagraj businesses."
  },
  {
    question: "How much does custom WordPress website development cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, custom WordPress website packages start at ₹11,999 for standard 5-page business websites. Professional corporate, educational institute, or clinic websites range between ₹21,999 to ₹35,000, while full-featured WooCommerce e-commerce stores start at ₹39,999. Every quote is transparent with zero hidden fees."
  },
  {
    question: "How long does it take to design and launch a custom WordPress website in Prayagraj?",
    answer: "Standard business websites and landing pages are completed within 5 to 7 business days. Custom corporate portals, educational institute sites, or WooCommerce e-commerce stores typically take 2 to 3 weeks depending on custom features, content readiness, and payment gateway approvals."
  },
  {
    question: "Will my WordPress website load fast and rank on Google?",
    answer: "Yes! Every WordPress website engineered by Codelura is optimized for 90+ Core Web Vitals speed scores and built-in with local SEO, Schema structured data markup (LocalBusiness, FAQ), Google Search Console sitemap indexing, and responsive mobile rendering."
  },
  {
    question: "Can I easily update text, photos, and blog posts myself without coding knowledge?",
    answer: "100%! WordPress is the world’s most intuitive Content Management System (CMS). We provide visual drag-and-drop block editors (Gutenberg or Elementor) and provide video training so you or your staff can easily update text, upload images, add blogs, or change prices anytime."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh prefer WordPress development?",
    answer: "Katra coaching institutes need to publish daily batch announcements, exam alerts, downloadable PDF study notes, and student results. WordPress allows institute staff to publish new content in seconds without technical knowledge while ranking on Google."
  },
  {
    question: "What features do you offer for WooCommerce e-commerce stores in Chowk and Civil Lines?",
    answer: "We build complete WooCommerce online stores equipped with instant UPI (GPay, PhonePe, Paytm), credit card, and net banking payment gateways (Razorpay/Paytm), automated stock inventory alerts, customer invoice downloads, and WhatsApp order notifications."
  },
  {
    question: "Can Codelura fix a slow or hacked WordPress website in Prayagraj?",
    answer: "Yes, we specialize in WordPress speed optimization and malware cleanup. We clean infected database files, remove malware, install security firewalls, implement LiteSpeed/Redis caching, compress images, and boost PageSpeed scores above 90+."
  },
  {
    question: "Do your WordPress packages include free domain, hosting, and SSL certificates?",
    answer: "Yes, all our primary WordPress development packages include 1 year of domain registration (.com or .in), high-speed cloud web hosting, free SSL security encryption, professional domain business emails, and full Google Search Console setup."
  },
  {
    question: "Can you migrate our website from Wix, Squarespace, or static HTML to WordPress?",
    answer: "Yes! We provide zero-downtime website migrations. We transfer all existing text, images, blog posts, pages, and SEO meta tags to a clean custom WordPress setup without losing your existing Google search rankings."
  },
  {
    question: "What post-launch maintenance and technical support do you provide?",
    answer: "Codelura provides ongoing WordPress support, including weekly core & plugin updates, automated daily cloud backups, security vulnerability scans, speed checks, and 24/7 technical assistance for Prayagraj business owners."
  },
  {
    question: "Can you build custom medical booking WordPress sites for hospitals in George Town?",
    answer: "Yes, we build customized healthcare WordPress websites featuring doctor profile directories, real-time appointment booking forms, emergency click-to-call buttons, and patient diagnostic report download portals."
  },
  {
    question: "Do you build custom plugins if a feature is not available in standard WordPress?",
    answer: "Yes, our Senior PHP Engineers write custom, lightweight WordPress plugins for specialized calculators, custom booking logic, multi-branch inventory tracking, or third-party API integrations without adding site bloat."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for WordPress Development?",
    answer: "We serve businesses across all key localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do I get started with Codelura for WordPress development in Prayagraj?",
    answer: "Starting is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or fill out our online contact form. Our Prayagraj web team will provide a free consultation, design blueprint, and quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
  { title: "Software Development Prayagraj", href: "/locations/prayagraj/software-development" },
  { title: "All Services", href: "/services" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "App Development", href: "/services/app-development" },
  { title: "SEO Services", href: "/services/seo" },
  { title: "UI / UX Design", href: "/services/ui-ux" },
  { title: "AI Development", href: "/services/ai-development" },
  { title: "Our Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
