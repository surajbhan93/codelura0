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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central commercial district where boutique fashion brands and retail corporate firms require custom Shopify storefronts." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Corridor & Polyclinics", description: "Healthcare and wellness sector where pharmaceutical and ayurvedic brands require Shopify online stores." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Education and book merchant district where stationery sellers and coaching academies launch Shopify stores." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Services & Boutiques", description: "Upscale residential neighborhood where designer jewelry and apparel creators launch custom Shopify Plus stores." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and retail area requiring mobile-optimized Shopify stores for fast local deliveries." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Wholesale commercial hub where textile traders and hardware suppliers need B2B Shopify wholesale portals." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Primary manufacturing center of Allahabad where industrial suppliers need D2C & B2B Shopify e-commerce setups." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding township area where home decor and lifestyle brands set up Shopify online stores." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing manufacturing units needing custom Shopify storefronts with automated shipping." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upscale mixed district where organic food and health supplement brands launch Shopify stores." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Cultural tourism hub where local religious artifact and handicraft artisans sell products worldwide via Shopify." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing residential suburb where electronic accessory and sports gear sellers launch Shopify e-commerce." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "custom-shopify-store-development",
    title: "Custom Shopify Store Development Prayagraj",
    shortDesc: "Tailor-made Shopify store engineering with custom Liquid themes, sub-second speed & conversion design.",
    fullDesc: "We engineer bespoke Shopify e-commerce stores designed to maximize online sales for Prayagraj brands. Includes custom Liquid theme coding, mobile-first UX design, custom product options, and high-speed checkout flows.",
    iconName: "ShoppingCart",
    tag: "Custom Liquid"
  },
  {
    id: "shopify-theme-development",
    title: "Shopify Theme Development & Customization",
    shortDesc: "Pixel-perfect Shopify Online Store 2.0 theme engineering built using JSON templates & OS 2.0 blocks.",
    fullDesc: "Stand out from competitors with custom Shopify Online Store 2.0 themes. We build modular section blocks, custom product landing page templates, slide-out cart drawers, and filterable collection pages.",
    iconName: "Layout",
    tag: "OS 2.0 Themes"
  },
  {
    id: "shopify-migration-services",
    title: "WooCommerce & Magento to Shopify Migration",
    shortDesc: "Zero-downtime migration of products, customer accounts, order history, and SEO rankings to Shopify.",
    fullDesc: "Migrate your existing e-commerce store to Shopify effortlessly. We safely transfer all product SKUs, inventory counts, customer databases, past orders, 301 URL redirects, and SEO metadata with zero sales interruption.",
    iconName: "Globe",
    tag: "Zero Downtime"
  },
  {
    id: "shopify-plus-development",
    title: "Enterprise Shopify Plus Solutions",
    shortDesc: "Scalable enterprise e-commerce architecture for high-volume brands in Prayagraj & Uttar Pradesh.",
    fullDesc: "Empower high-volume D2C and B2B brands. Features custom Shopify Checkout Extensions, automated wholesale pricing tiers, multi-currency localization, dedicated launch engineering, and high-concurrency event handling.",
    iconName: "Zap",
    tag: "Shopify Plus"
  },
  {
    id: "payment-gateway-integration",
    title: "Razorpay, Paytm & UPI Checkout Integration",
    shortDesc: "Seamless 1-click Indian mobile payment integration with GPay, PhonePe, Paytm, and COD fraud verification.",
    fullDesc: "Maximize completed checkout rates in India. We integrate Razorpay, Paytm, Cashfree, and PhonePe payment gateways, combined with Cash on Delivery (COD) OTP verification to reduce RTO (Return to Origin) losses.",
    iconName: "CreditCard",
    tag: "1-Click UPI"
  },
  {
    id: "shipping-carrier-integration",
    title: "Automated Shipping & Order Tracking Integration",
    shortDesc: "Connect Shiprocket, Delhivery, Pickrr & Bluedart for automated shipping label & WhatsApp tracking.",
    fullDesc: "Automate logistics operations for your Prayagraj store. We integrate Shiprocket, Delhivery, and Pickrr APIs for 1-click shipping label generation, automated courier assignment, and real-time WhatsApp order tracking alerts.",
    iconName: "Truck",
    tag: "Logistics Automation"
  },
  {
    id: "shopify-speed-optimization",
    title: "Shopify Speed Optimization & Core Web Vitals",
    shortDesc: "Achieve 95+ PageSpeed scores on mobile & desktop by auditing app scripts, images & Liquid code.",
    fullDesc: "Slow Shopify stores lose buyers. We audit and remove redundant third-party app scripts, implement lazy loading, compress product WebP images, optimize Liquid code loops, and fix Core Web Vitals (LCP, CLS, INP).",
    iconName: "Cpu",
    tag: "95+ PageSpeed"
  },
  {
    id: "shopify-app-integration",
    title: "Custom Shopify App Development & API Setup",
    shortDesc: "Bespoke private Shopify apps developed using Node.js & Remix to extend store functionality.",
    fullDesc: "When standard Shopify App Store apps fall short, Codelura builds custom private Shopify apps. Connect custom ERP software, inventory databases, loyalty programs, or specialized product bundlers seamlessly.",
    iconName: "Code",
    tag: "Custom Apps"
  },
  {
    id: "headless-shopify-development",
    title: "Headless Shopify Development with Next.js 15",
    shortDesc: "Decoupled Headless Shopify storefronts powered by Next.js 15 App Router & GraphQL Storefront API.",
    fullDesc: "The pinnacle of e-commerce speed and design freedom. We pair Shopify’s powerful backend engine with a custom Next.js 15 React frontend, rendering web pages instantly in under 200 milliseconds.",
    iconName: "Zap",
    tag: "Headless Next.js"
  },
  {
    id: "shopify-seo-cro",
    title: "Shopify Technical SEO & Conversion Rate Optimization",
    shortDesc: "Rank #1 on Google for product keywords and optimize cart conversion funnels for maximum revenue.",
    fullDesc: "Drive organic search traffic and boost average order value (AOV). We implement Product Schema markup, collection page SEO, automated XML sitemaps, cart upsell popups, and sticky add-to-cart buttons.",
    iconName: "Search",
    tag: "Rank & Convert"
  },
  {
    id: "fashion-apparel-shopify",
    title: "Fashion & Apparel Shopify Stores Civil Lines",
    shortDesc: "Stunning fashion brand storefronts with size guides, color swatches, Instagram feeds & lookbooks.",
    fullDesc: "Designed for boutique apparel, saree, and jewelry brands in Civil Lines, Katra, and Chowk. Includes variant color swatches, interactive size charts, shoppable Instagram feeds, and customer review widgets.",
    iconName: "ShoppingBag",
    tag: "Fashion D2C"
  },
  {
    id: "shopify-maintenance-sla",
    title: "Dedicated Shopify Maintenance & Support SLA",
    shortDesc: "Monthly catalog updates, theme maintenance, app auditing, security checks & 24/7 technical help.",
    fullDesc: "Keep your online store running smoothly without downtime. Our Prayagraj Shopify engineering team handles new product launches, flash sale preparation, app updates, theme tweaks, and emergency support.",
    iconName: "Headphones",
    tag: "24/7 Support SLA"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Shopify Starter Store Package",
    price: "₹18,999",
    popular: false,
    description: "Ideal for new D2C brands, local artisans, and small retail stores in Prayagraj starting online.",
    features: [
      "Complete Shopify Store Setup on OS 2.0 Architecture",
      "Mobile-Optimized Responsive Theme Customization",
      "Up to 25 Product Listings with Categories & Collections",
      "Razorpay, Paytm & UPI Payment Gateway Integration",
      "Shiprocket / Delhivery Automated Shipping Setup",
      "Domain Setup, SSL Certificate & Basic SEO Markup",
      "Fast 7 to 10 Days Store Launch"
    ]
  },
  {
    name: "Growth D2C Shopify Store",
    price: "₹34,999",
    popular: true,
    description: "Best for established Prayagraj apparel, jewelry, ayurvedic, and retail brands scaling online sales.",
    features: [
      "Custom Shopify Theme Engineering (Zero Page Bloat)",
      "Up to 100 Product Listings with Custom Color Swatches",
      "Razorpay UPI + Cash on Delivery (COD) OTP Verification",
      "Automated Shipping Labels & WhatsApp Order Tracking",
      "90+ Google PageSpeed Core Web Vitals Optimization",
      "Product & Collection JSON-LD Schema Markup",
      "Cart Upsell & Abandoned Cart Recovery Setup",
      "1 Year Dedicated Maintenance & Technical Support"
    ]
  },
  {
    name: "Enterprise Shopify Plus / Headless",
    price: "₹69,999+",
    popular: false,
    description: "Comprehensive Shopify Plus or Headless Next.js storefront for high-volume regional brands.",
    features: [
      "Bespoke Liquid / Next.js 15 Headless Storefront",
      "Unlimited Product Catalogs & Multi-Warehouse Sync",
      "Custom Private Shopify App & ERP Integration",
      "B2B Wholesale Portal & Tiered Volume Pricing",
      "Sub-200ms Ultra-Fast Speed Engineering",
      "Dedicated Senior Shopify Architect & Priority SLA Support",
      "Advanced Conversion Rate Optimization (CRO) Funnel"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Shopify OS 2.0 & Liquid", category: "Storefront Core", desc: "Native Liquid Template Engine with Dynamic OS 2.0 Sections" },
  { name: "Next.js 15 & React 19", category: "Headless Engine", desc: "Sub-Second Decoupled Storefront Powered by Storefront API" },
  { name: "Shopify GraphQL API", category: "Data Layer", desc: "High-Throughput GraphQL Queries for Instant Product Data" },
  { name: "Tailwind CSS v4", category: "Styling System", desc: "Utility-First Glassmorphic & Modern Mobile E-Commerce UI" },
  { name: "Razorpay & Paytm SDKs", category: "Payments API", desc: "1-Click UPI (GPay, PhonePe) & Automated COD Verification" },
  { name: "Shiprocket & Delhivery", category: "Shipping APIs", desc: "Automated Shipping Labels & Real-Time WhatsApp Order Alerts" },
  { name: "Node.js & Remix", category: "Custom Apps", desc: "Custom Private Shopify App Backend Microservices" },
  { name: "Klaviyo & WhatsApp Bots", category: "Marketing Automation", desc: "Automated Abandoned Cart Flows & Order Notification Bots" },
  { name: "Cloudflare Edge CDN", category: "Speed & Security", desc: "Global Content Delivery Network & DDoS Asset Protection" },
  { name: "Google Merchant Center", category: "Shopping Feed", desc: "Automated Product Feed Sync for Google Shopping Ads" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Fashion, Apparel & Sarees", location: "Civil Lines, Chowk", count: "35+ Shopify Stores Built", description: "Enabling local Prayagraj handloom and saree boutiques in Chowk to sell premium apparel across India with Razorpay UPI." },
  { name: "Jewelry, Handicrafts & Artifacts", location: "Daraganj, Katra", count: "25+ Shopify Stores Built", description: "Helping Daraganj religious artifact and handicraft artisans sell authentic brass and wooden crafts globally." },
  { name: "Ayurveda, Health & Cosmetics", location: "George Town, Ashok Nagar", count: "20+ D2C Health Stores", description: "Building high-converting D2C supplement and herbal skin care Shopify stores for wellness brands in George Town." },
  { name: "Books, Stationery & Coaching Notes", location: "Katra, Tagore Town", count: "30+ Edu-Storefronts", description: "Empowering Katra book publishers and coaching academies to sell test series, printed books, and PDF study guides online." },
  { name: "Home Decor & Furnishings", location: "Civil Lines, Jhunsi", count: "18+ Lifestyle Stores", description: "Showcasing home decor, furniture, and curtain products with high-resolution image galleries and variant selectors." },
  { name: "Electronic Accessories & Hardware", location: "Lukerganj, Rajrooppur", count: "22+ Electronics Stores", description: "Connecting Lukerganj hardware and gadget distributors with nationwide retail buyers via B2B & D2C Shopify portals." },
  { name: "Organic Food & Grocery", location: "Ashok Nagar, Allahpur", count: "15+ Food E-Commerce Stores", description: "Setting up subscription and local delivery Shopify stores for organic farm produce and specialty sweets." },
  { name: "Sports Equipment & Fitness Gear", location: "Rajrooppur, Phaphamau", count: "12+ Sports Stores", description: "Building robust Shopify stores for sports academies and fitness gear retailers in Prayagraj." }
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
    quote: "Codelura is the absolute best Shopify development company in Prayagraj! They transformed our saree shop in Chowk into an online D2C Shopify store. We now receive orders daily from Delhi, Mumbai, and Bangalore!",
    author: "Shyam Sundar Tandon",
    role: "Founder",
    company: "Tandon Handlooms & Silks",
    location: "Chowk, Prayagraj",
    rating: 5
  },
  {
    quote: "We migrated our book publication store from WooCommerce to Shopify with Codelura. The store loads instantly, shipping is automated via Shiprocket, and UPI payments work flawlessly. Outstanding team!",
    author: "Deepak Kumar Jaiswal",
    role: "Managing Director",
    company: "Katra Academic Publications",
    location: "Katra, Allahabad",
    rating: 5
  },
  {
    quote: "Our herbal supplement brand in George Town needed a custom Shopify store. Codelura built a fast, beautiful site integrated with Razorpay and WhatsApp tracking. Our conversion rates doubled!",
    author: "Dr. Ananya Upadhyay",
    role: "Co-Founder",
    company: "Sangam Organic Herbals",
    location: "George Town, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top Shopify development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading Shopify agency in Prayagraj because we engineer custom, ultra-fast Shopify stores built on Online Store 2.0 architecture and Headless Next.js. We eliminate slow third-party app bloat, integrate Indian payment gateways (Razorpay, Paytm, PhonePe UPI), setup automated shipping (Shiprocket/Delhivery), and optimize for 95+ PageSpeed scores."
  },
  {
    question: "How much does custom Shopify store development cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, Shopify store packages in Prayagraj start at ₹18,999 for standard Shopify Starter stores. Professional Growth D2C Shopify stores (with custom Liquid themes, COD OTP verification, and shipping automation) range between ₹34,999 to ₹50,000, while enterprise Shopify Plus or Headless Next.js stores start at ₹69,999. Every quote is transparent with zero hidden charges."
  },
  {
    question: "How long does it take to launch a complete Shopify e-commerce store in Prayagraj?",
    answer: "Standard Shopify stores with custom theme setup and product catalog upload are launched within 7 to 10 business days. Complex D2C stores with custom Liquid features, multi-warehouse integrations, or platform migrations take 2 to 3 weeks."
  },
  {
    question: "Can Codelura integrate Indian UPI payments and Cash on Delivery (COD) on Shopify?",
    answer: "100%! We integrate all leading Indian payment gateways, including Razorpay, Paytm, Cashfree, and PhonePe for instant 1-click UPI payments (GPay, PhonePe, Paytm). We also set up Cash on Delivery (COD) with automated OTP phone verification to drastically reduce RTO (Return to Origin) cancellation losses."
  },
  {
    question: "How do you handle automated shipping and order tracking for Prayagraj sellers?",
    answer: "We seamlessly connect your Shopify store with leading logistics aggregator APIs like Shiprocket, Delhivery, Pickrr, and Bluedart. When a customer orders, shipping labels are generated automatically in 1 click, courier pickups are scheduled, and tracking links are sent to customers via WhatsApp and SMS."
  },
  {
    question: "Can you migrate our existing store from WooCommerce, Magento, or Wix to Shopify?",
    answer: "Yes! Codelura specializes in zero-downtime store migrations. We safely transfer all existing product SKUs, variant images, customer data, historical orders, 301 URL redirects, and SEO meta tags without losing your search rankings or interrupting sales."
  },
  {
    question: "Why do saree and fashion merchants in Chowk and Civil Lines prefer Shopify over WordPress?",
    answer: "Shopify provides a 99.99% uptime cloud infrastructure that never crashes during heavy festive flash sales (such as Diwali or Dhanteras). It offers effortless product inventory management, built-in mobile checkout security, and instant shipping integrations tailored for fashion D2C brands."
  },
  {
    question: "Will my Shopify store rank high on Google for product keywords?",
    answer: "Yes! Every Shopify store engineered by Codelura includes advanced technical SEO setup: Product & Organization JSON-LD Schema markup, optimized image alt tags, canonical tag setup, clean URL structures, Google Search Console XML sitemap submission, and fast loading speeds."
  },
  {
    question: "What is Headless Shopify development with Next.js 15?",
    answer: "Headless Shopify decouples the front-end display from Shopify's back-end database. We build the user interface using Next.js 15 React framework, fetching product data via Shopify's GraphQL Storefront API. This delivers sub-200ms instant page loads and infinite custom design possibilities."
  },
  {
    question: "Can I manage product inventory, pricing, and orders easily myself?",
    answer: "Absolutely! Shopify is the world’s most user-friendly e-commerce management platform. You can easily add new products, adjust inventory counts, change prices, and view sales revenue reports directly from your smartphone or laptop using the Shopify app."
  },
  {
    question: "Do you build custom private Shopify apps when standard apps are insufficient?",
    answer: "Yes, our Senior Node.js & Remix Engineers build custom private Shopify apps to add unique business logic, connect proprietary ERP software, or create custom product configurators without paying monthly third-party app subscriptions."
  },
  {
    question: "Can Codelura optimize a slow existing Shopify store to load faster?",
    answer: "Yes! We audit your current Shopify theme, remove unused third-party app scripts, convert images to lightweight WebP format, clean Liquid code loops, and optimize Core Web Vitals to achieve 90+ PageSpeed scores."
  },
  {
    question: "What post-launch technical support and maintenance SLA do you provide in Prayagraj?",
    answer: "Codelura provides ongoing Shopify maintenance, including monthly theme tweaks, new product collection launches, promotional banner updates, security audits, and 24/7 technical support for Prayagraj store owners."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for Shopify Development?",
    answer: "We serve businesses across all key localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do I get started with Codelura for Shopify development in Prayagraj?",
    answer: "Getting started is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or submit our online contact form. Our Prayagraj Shopify engineering team will provide a free consultation, design blueprint, and project quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
  { title: "Software Development Prayagraj", href: "/locations/prayagraj/software-development" },
  { title: "WordPress Development Prayagraj", href: "/locations/prayagraj/wordpress-development" },
  { title: "All Services", href: "/services" },
  { title: "Website Development", href: "/services/website-development" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "App Development", href: "/services/app-development" },
  { title: "SEO Services", href: "/services/seo" },
  { title: "UI / UX Design", href: "/services/ui-ux" },
  { title: "AI Development", href: "/services/ai-development" },
  { title: "Our Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
