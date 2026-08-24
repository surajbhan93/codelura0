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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central commercial sector where high-end apparel boutiques, jewelry brands, and corporate retail chains launch custom e-commerce stores." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Polyclinics", description: "Healthcare sector where pharmaceutical distributors and health supplement brands launch D2C online shopping stores." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational market where competitive book publishers and stationery sellers build high-volume e-commerce stores." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Services & Boutiques", description: "Vibrant neighborhood where specialty boutiques and artisan creators require custom Next.js e-commerce portals." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and retail area requiring mobile-first e-commerce platforms for fast local order fulfillment." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Wholesale commercial district where hardware suppliers and textile traders require B2B e-commerce portals." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Primary manufacturing center of Allahabad where industrial factories require custom B2B e-commerce platforms." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding township area where home decor and lifestyle brands build online shopping stores." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing manufacturing units needing custom online product catalog platforms." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upscale mixed district where organic food and health supplement brands launch fast e-commerce stores." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Cultural tourism hub where local religious artifact and brass handicraft artisans sell products worldwide." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing residential suburb where electronic accessory and sports gear sellers launch online stores." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "custom-nextjs-ecommerce",
    title: "Custom Next.js 15 Full-Stack E-Commerce",
    shortDesc: "Sub-second Next.js 15 e-commerce platforms with custom database schemas, API microservices & zero bloat.",
    fullDesc: "For high-growth Prayagraj brands that demand ultimate speed and complete code ownership. We engineer custom full-stack e-commerce platforms using Next.js 15, React 19, TypeScript, Node.js, and PostgreSQL for sub-200ms page loads.",
    iconName: "Zap",
    tag: "Sub-200ms Speed"
  },
  {
    id: "woocommerce-e-commerce",
    title: "WooCommerce Online Store Development",
    shortDesc: "Custom WordPress WooCommerce stores with fast Gutenberg product layouts, UPI payments & GST billing.",
    fullDesc: "Transform your WordPress website into an online retail store. Features custom WooCommerce theme design, 1-click Razorpay/Paytm UPI checkout, automated stock alerts, customer account dashboards, and GST invoicing.",
    iconName: "Globe",
    tag: "WordPress Store"
  },
  {
    id: "shopify-store-engineering",
    title: "Shopify & Shopify Plus Store Development",
    shortDesc: "High-converting Shopify OS 2.0 storefronts with custom Liquid code, COD OTP verification & Shiprocket APIs.",
    fullDesc: "Build a robust Shopify store engineered for scaling online sales. We code custom Liquid OS 2.0 themes, set up Cash on Delivery (COD) OTP verification, integrate Shiprocket logistics, and optimize mobile UX.",
    iconName: "ShoppingCart",
    tag: "Shopify OS 2.0"
  },
  {
    id: "multi-vendor-marketplace",
    title: "Multi-Vendor E-Commerce Marketplace Development",
    shortDesc: "Amazon/Flipkart-style multi-vendor marketplaces with vendor dashboards, commission splits & payouts.",
    fullDesc: "Launch a regional e-commerce marketplace in UP. Multiple merchants can register, list products, manage inventory, and receive automated payout split commissions while you control the master admin portal.",
    iconName: "Users",
    tag: "Marketplace"
  },
  {
    id: "b2b-ecommerce-portals",
    title: "B2B E-Commerce Portals & Wholesale Systems",
    shortDesc: "Wholesale e-commerce portals with tiered quantity pricing, minimum order quantities (MOQ) & credit terms.",
    fullDesc: "Empower wholesalers and manufacturers in Naini and Lukerganj. Features customer group pricing, bulk quick-order forms, GST credit invoices, purchase order (PO) uploads, and credit limit management.",
    iconName: "Briefcase",
    tag: "B2B Wholesale"
  },
  {
    id: "b2c-online-store-development",
    title: "B2C Retail E-Commerce Website Development",
    shortDesc: "Direct-to-Consumer (D2C) retail shopping websites optimized for high conversion rates and mobile buyers.",
    fullDesc: "Designed for fashion, jewelry, health, and consumer goods brands in Civil Lines and Chowk. Includes variant color/size swatches, product video previews, slide-out cart drawers, cart upsells, and coupon engines.",
    iconName: "ShoppingBag",
    tag: "D2C Retail"
  },
  {
    id: "payment-gateway-integration",
    title: "Razorpay, Paytm, PhonePe & Stripe Integration",
    shortDesc: "1-click UPI checkout with GPay, PhonePe, Paytm, net banking, credit cards & COD OTP fraud protection.",
    fullDesc: "Eliminate checkout abandonment. We integrate Indian payment gateways (Razorpay, Paytm, Cashfree) supporting 1-click UPI payments, EMI options, and Cash on Delivery (COD) phone OTP verification to prevent fake orders.",
    iconName: "CreditCard",
    tag: "1-Click UPI"
  },
  {
    id: "inventory-order-management",
    title: "Real-Time Inventory & Multi-Warehouse Sync",
    shortDesc: "Automated stock tracking, multi-warehouse sync, low stock alerts & Tally ERP integration.",
    fullDesc: "Keep your inventory synced across physical stores and online channels. Our e-commerce systems update stock counts automatically upon order placement, trigger low stock alerts, and sync data with Tally ERP.",
    iconName: "Layers",
    tag: "Inventory Sync"
  },
  {
    id: "shipping-logistics-integration",
    title: "Automated Shipping & Order Tracking Integration",
    shortDesc: "Connect Shiprocket, Delhivery, Pickrr & Bluedart for 1-click shipping labels & WhatsApp tracking alerts.",
    fullDesc: "Automate logistics for your Prayagraj store. We integrate Shiprocket and Delhivery APIs to generate courier shipping labels automatically in 1 click, assign couriers, and dispatch WhatsApp tracking alerts to buyers.",
    iconName: "Truck",
    tag: "Logistics Setup"
  },
  {
    id: "ecommerce-mobile-commerce-pwa",
    title: "Progressive Web Apps (PWA) & Mobile Commerce",
    shortDesc: "App-like mobile shopping experience with offline caching, push notifications & home screen install.",
    fullDesc: "Over 85% of online shopping in India happens on mobile. We build Progressive Web Apps (PWAs) that load instantly on smartphones, send mobile push notifications for flash sales, and work even on slow 3G networks.",
    iconName: "Smartphone",
    tag: "Mobile PWA"
  },
  {
    id: "ecommerce-seo-cro",
    title: "E-Commerce Technical SEO & Conversion Rate Optimization",
    shortDesc: "Product Schema markup, category SEO, automated XML sitemaps & cart conversion rate optimization.",
    fullDesc: "Drive organic search traffic and boost average order value (AOV). We implement Product & Offer JSON-LD Schemas, optimize collection page titles, build sticky add-to-cart buttons, and run cart exit-intent popups.",
    iconName: "Search",
    tag: "Rank & Convert"
  },
  {
    id: "ecommerce-maintenance-sla",
    title: "Dedicated E-Commerce Maintenance & Technical SLA",
    shortDesc: "24/7 technical monitoring, security audits, database cleanups, festive sale prep & platform updates.",
    fullDesc: "Ensure your e-commerce store operates smoothly during peak festive sales (Diwali, Dhanteras, Kumbh Mela). Our Prayagraj engineering team provides 24/7 server monitoring, security patching, and catalog updates.",
    iconName: "Headphones",
    tag: "24/7 SLA Support"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Starter E-Commerce Store Package",
    price: "₹19,999",
    popular: false,
    description: "Ideal for small local stores, artisans, and new retail startups in Prayagraj starting online.",
    features: [
      "Mobile-Optimized E-Commerce Store (Up to 50 Products)",
      "Fast WooCommerce or Shopify OS 2.0 Storefront Engine",
      "Razorpay / Paytm Payment Gateway Integration (UPI & Net Banking)",
      "Shiprocket / Delhivery Automated Shipping & Tracking Setup",
      "Product & Category Schema Markup for Google Shopping",
      "Free Domain Name, SSL Certificate & High-Speed Hosting",
      "Fast 7 to 10 Days Store Launch"
    ]
  },
  {
    name: "Growth D2C E-Commerce Suite",
    price: "₹39,999",
    popular: true,
    description: "Best for established Prayagraj saree, apparel, jewelry, ayurvedic, and retail brands scaling online sales.",
    features: [
      "Custom Full-Stack Next.js 15 or Shopify Custom Liquid Store",
      "Up to 250 Product Listings with Custom Color/Size Swatches",
      "Razorpay 1-Click UPI + Cash on Delivery (COD) OTP Verification",
      "Automated WhatsApp Shipping & Order Tracking Alerts",
      "95+ Google PageSpeed Core Web Vitals Optimization",
      "Abandoned Cart Recovery Drip & Cart Upsell Popups",
      "Real-Time Sales Analytics Dashboard & Tally Integration",
      "1 Year Dedicated Maintenance & Technical Support SLA"
    ]
  },
  {
    name: "Enterprise Multi-Vendor / B2B Portal",
    price: "₹79,999+",
    popular: false,
    description: "Comprehensive multi-vendor marketplace or B2B wholesale platform for regional enterprises.",
    features: [
      "Amazon-Style Multi-Vendor Marketplace or B2B Wholesale Portal",
      "Vendor / Buyer Admin Dashboards with Automated Commission Splits",
      "Sub-200ms Ultra-Fast Next.js 15 & Node.js Microservices Architecture",
      "Multi-Warehouse Inventory Tracking & Tiered Quantity Pricing",
      "Dedicated Senior Software Architect & Priority SLA Support",
      "Enterprise Encryption, DDoS Protection & Auto Daily Cloud Backups"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Next.js 15 & React 19", category: "Full-Stack Engine", desc: "Sub-Second App Router Architecture for Custom E-Commerce" },
  { name: "WooCommerce 9+", category: "WordPress CMS", desc: "Open-Source E-Commerce Engine with Custom Gutenberg Blocks" },
  { name: "Shopify OS 2.0 & Liquid", category: "Cloud SaaS", desc: "Liquid Template Engine with Dynamic OS 2.0 Section Blocks" },
  { name: "Node.js & PostgreSQL", category: "Backend & DB", desc: "ACID-Compliant Relational Database & High-Throughput REST APIs" },
  { name: "Razorpay & Paytm SDKs", category: "Payments API", desc: "1-Click UPI (GPay, PhonePe) & Automated COD Verification" },
  { name: "Shiprocket & Delhivery", category: "Shipping APIs", desc: "Automated Shipping Labels & WhatsApp Order Tracking Alerts" },
  { name: "Tailwind CSS v4", category: "UI System", desc: "Utility-First Glassmorphic & Modern Mobile E-Commerce Design" },
  { name: "GraphQL Storefront API", category: "Data Layer", desc: "High-Throughput Queries for Instant Product & Cart Data" },
  { name: "Cloudflare & Redis", category: "Speed & Caching", desc: "Sub-Millisecond In-Memory Caching & Edge CDN Infrastructure" },
  { name: "Tally ERP & WhatsApp APIs", category: "Integrations", desc: "Automated Accounting Data Sync & WhatsApp Bot Notifications" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Fashion, Sarees & Textiles", location: "Chowk, Civil Lines", count: "40+ E-Commerce Stores Built", description: "Enabling local Prayagraj handloom and saree merchants in Chowk to sell premium apparel across India." },
  { name: "Jewelry, Handicrafts & Artifacts", location: "Daraganj, Katra", count: "28+ Online Artifact Stores", description: "Helping Daraganj religious artifact and brass handicraft artisans sell authentic crafts globally." },
  { name: "Ayurveda, Health & Cosmetics", location: "George Town, Ashok Nagar", count: "22+ D2C Health Stores", description: "Building high-converting D2C supplement and herbal skin care e-commerce platforms in George Town." },
  { name: "Books, Publishing & Stationery", location: "Katra, Tagore Town", count: "32+ Book E-Commerce Sites", description: "Empowering Katra book publishers to sell competitive exam guides, printed books, and PDF notes online." },
  { name: "Home Decor & Furnishings", location: "Civil Lines, Jhunsi", count: "20+ Lifestyle Portals", description: "Showcasing home decor, furniture, and curtain products with high-resolution image galleries and variant selectors." },
  { name: "Hardware & Industrial Equipment", location: "Lukerganj, Naini", count: "25+ B2B Wholesale Stores", description: "Connecting Lukerganj hardware and Naini industrial suppliers with nationwide retail buyers via B2B e-commerce." },
  { name: "Organic Food & Specialty Sweets", location: "Ashok Nagar, Allahpur", count: "16+ Food E-Commerce Sites", description: "Setting up subscription and local delivery e-commerce stores for organic farm produce and famous Prayagraj sweets." },
  { name: "Sports Gear & Electronics", location: "Rajrooppur, Phaphamau", count: "14+ Retail E-Stores", description: "Building robust e-commerce stores for sports gear retailers and electronic accessory sellers in Prayagraj." }
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
    quote: "Codelura is the best e-commerce website development company in Prayagraj! They transformed our saree retail shop in Chowk into a nationwide D2C e-commerce brand. We process online orders daily from across India!",
    author: "Harish Chandra Rastogi",
    role: "Founder",
    company: "Rastogi Handlooms & Silks",
    location: "Chowk, Prayagraj",
    rating: 5
  },
  {
    quote: "We needed a custom e-commerce store for our book publication house in Katra. Codelura delivered a fast Next.js store integrated with Razorpay UPI and Shiprocket. Ordering and shipping are 100% automated!",
    author: "Sunil Kumar Tripathi",
    role: "Managing Director",
    company: "Tripathi Academic Publications",
    location: "Katra, Allahabad",
    rating: 5
  },
  {
    quote: "Codelura built a custom e-commerce store for our organic supplement brand in George Town. Page load speeds are sub-second, payment gateway works smoothly, and customer response has been incredible!",
    author: "Dr. Alok Nath Keshari",
    role: "Co-Founder",
    company: "Keshari Organics & Ayurveda",
    location: "George Town, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top e-commerce development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading e-commerce development company in Prayagraj because we engineer custom, high-speed online shopping platforms (Next.js 15, WooCommerce, Shopify OS 2.0) tailored to your exact business model. We eliminate slow page bloat, integrate Indian payment gateways (Razorpay, Paytm, PhonePe UPI), setup automated shipping (Shiprocket/Delhivery), and optimize for 95+ Google PageSpeed scores."
  },
  {
    question: "How much does custom e-commerce website development cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, e-commerce development packages in Prayagraj start at ₹19,999 for standard Starter online stores (up to 50 products). Growth D2C E-Commerce Suites (with custom themes, COD OTP verification, and shipping automation) range between ₹39,999 to ₹55,000, while enterprise Multi-Vendor Marketplaces or B2B Wholesale Portals start at ₹79,999. Every quote is fully itemized with zero hidden fees."
  },
  {
    question: "How long does it take to build and launch an online e-commerce store in Prayagraj?",
    answer: "Standard e-commerce websites (using WooCommerce or Shopify) with custom theme setup are launched within 7 to 10 business days. Complex full-stack Next.js e-commerce platforms, multi-vendor marketplaces, or B2B wholesale portals take 3 to 6 weeks depending on customized feature requirements."
  },
  {
    question: "Which platform is best for my business: Custom Next.js, WooCommerce, or Shopify?",
    answer: "Our Senior E-Commerce Architects guide you based on your needs: Shopify is ideal for fast D2C brand launches with zero server management; WooCommerce is great for budget-conscious WordPress users who want complete content flexibility; and Custom Next.js 15 Full-Stack is the ultimate choice for high-volume brands seeking sub-200ms ultra-fast speeds and 100% custom code ownership."
  },
  {
    question: "Can Codelura integrate 1-click UPI payments and Cash on Delivery (COD) on our store?",
    answer: "100%! We integrate all top Indian payment gateways, including Razorpay, Paytm, Cashfree, and PhonePe for instant 1-click UPI payments (GPay, PhonePe, Paytm). We also set up Cash on Delivery (COD) with automated OTP phone verification to drastically reduce RTO (Return to Origin) cancellation losses."
  },
  {
    question: "How do you handle shipping carrier integrations and automated order tracking?",
    answer: "We seamlessly connect your e-commerce store with leading logistics aggregator APIs like Shiprocket, Delhivery, Pickrr, and Bluedart. When a customer orders, shipping labels are generated automatically in 1 click, courier pickups are scheduled, and tracking links are sent to customers via WhatsApp and SMS."
  },
  {
    question: "Why do saree and apparel merchants in Chowk and Civil Lines need an e-commerce website?",
    answer: "Chowk and Katra are famous textile centers. An e-commerce website allows local Prayagraj saree and fashion merchants to bypass regional physical counter limitations and sell authentic handloom products directly to millions of online buyers across India with automated UPI payment collection."
  },
  {
    question: "Can you build an Amazon or Flipkart-style Multi-Vendor Marketplace?",
    answer: "Yes! Codelura specializes in multi-vendor marketplace development. Multiple independent sellers can register, manage their own product listings and stock, while the system automatically calculates commission splits and processes automated vendor payouts."
  },
  {
    question: "Can you build a B2B wholesale e-commerce portal for manufacturers in Naini?",
    answer: "Yes, we engineer specialized B2B wholesale e-commerce portals for manufacturers and distributors in Naini and Lukerganj. Features include customer group pricing, minimum order quantities (MOQs), purchase order (PO) uploads, GST credit invoices, and credit limit tracking."
  },
  {
    question: "Will my e-commerce website rank high on Google for product keywords?",
    answer: "Yes! Every e-commerce platform engineered by Codelura includes advanced technical SEO setup: Product & Offer JSON-LD Schema markup, category page keyword optimization, canonical URL setup, Google Search Console XML sitemap submission, and fast Core Web Vitals loading speeds."
  },
  {
    question: "How do you ensure data security and customer payment safety on e-commerce sites?",
    answer: "We enforce bank-grade security standards, including SSL/TLS encryption, PCI-DSS payment compliance, role-based admin security access, automated daily cloud backups, database sanitization, and Web Application Firewall (WAF) protection."
  },
  {
    question: "Can Codelura migrate our existing store from Magento or old software with zero data loss?",
    answer: "Yes! We specialize in zero-downtime e-commerce platform migrations. We safely transfer all existing product SKUs, variant images, customer accounts, past orders, 301 URL redirects, and SEO meta tags without losing your search rankings or interrupting live sales."
  },
  {
    question: "Do you provide post-launch maintenance and technical support in Prayagraj?",
    answer: "Codelura provides comprehensive post-launch e-commerce maintenance, including 24/7 server monitoring, festive sale preparation, database optimization, security patching, new collection launches, and priority technical assistance."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for E-Commerce Development?",
    answer: "We serve businesses across all key localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do we get started with Codelura for e-commerce website development in Prayagraj?",
    answer: "Getting started is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or submit our online inquiry form. Our Prayagraj e-commerce team will conduct a free consultation, workflow audit, and project quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
  { title: "Software Development Prayagraj", href: "/locations/prayagraj/software-development" },
  { title: "WordPress Development Prayagraj", href: "/locations/prayagraj/wordpress-development" },
  { title: "Shopify Development Prayagraj", href: "/locations/prayagraj/shopify-development" },
  { title: "Digital Marketing Prayagraj", href: "/locations/prayagraj/digital-marketing" },
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
