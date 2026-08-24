// constants.ts — for /location/* components

export const COMPANY_DETAILS = {
  name: "Codelura",
  tagline: "India's Premier Digital Engineering & Software Agency",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "contact@codelura.com",
  prayagrajEmail: "prayagraj@codelura.com",
  hqAddress:
    "Codelura Tech Center, Civil Lines, Near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001, India",
  address:
    "Codelura Tech Center, Civil Lines, Near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001, India",
  websiteUrl: "https://codelura.com",
  googleMapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.3!2d81.8349!3d25.4520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI3JzA3LjIiTiA4McKwNTAnMDUuNiJF!5e0!3m2!1sen!2sin!4v1234567890",
  coordinates: { lat: 25.452, lng: 81.8349 },
};

export const NEARBY_AREAS = [
  { name: "Civil Lines", zipCode: "211001", landmark: "Near High Court" },
  { name: "George Town", zipCode: "211002", landmark: "Bank Road Area" },
  { name: "Allahpur", zipCode: "211006", landmark: "Tagore Town" },
  { name: "Katra", zipCode: "211002", landmark: "Katra Bazar" },
  { name: "Naini", zipCode: "211008", landmark: "Naini Bridge" },
  { name: "Jhunsi", zipCode: "211019", landmark: "Sector Road" },
  { name: "Phaphamau", zipCode: "211013", landmark: "NH 30" },
  { name: "Kareli", zipCode: "211016", landmark: "Kareli Market" },
  { name: "Mumfordganj", zipCode: "211002", landmark: "Sadar Bazar" },
  { name: "Baghambari", zipCode: "211002", landmark: "Near Hanuman Mandir" },
  { name: "Rajapur", zipCode: "211010", landmark: "Rajapur Chauraha" },
  { name: "Lukerganj", zipCode: "211001", landmark: "Lukerganj Naka" },
  { name: "Daraganj", zipCode: "211006", landmark: "Ganga Ghat" },
  { name: "Soraon", zipCode: "212507", landmark: "Tehsil Road" },
  { name: "Kidwai Nagar", zipCode: "211003", landmark: "Stanley Road" },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Ashok Nagar Colony" },
  { name: "Hastings Road", zipCode: "211001", landmark: "Cantonment Area" },
  { name: "Colonelganj", zipCode: "211002", landmark: "Near Railway Station" },
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
  { title: "Contact Us", href: "/contact" },
];

export const FAQS = [
  {
    question: "Why should I choose a local digital agency for my business?",
    answer:
      "A local agency understands the regional market dynamics, consumer behaviour, and competitive landscape unique to your city. Codelura's city-specific teams deliver hyper-local SEO, on-site consultations, and faster turnaround times that generic remote agencies cannot match.",
  },
  {
    question: "What services does Codelura offer?",
    answer:
      "We offer full-stack web development (Next.js, React), custom software & ERP, mobile app development, SEO & local search, Shopify & ecommerce, WordPress, UI/UX design, digital marketing (Google Ads, Meta), and AI integrations.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A standard business website is delivered in 4–6 weeks. Custom software or mobile apps range from 8–20 weeks depending on complexity. We follow agile sprints with weekly progress updates and transparent delivery milestones.",
  },
  {
    question: "Do you offer post-launch maintenance and support?",
    answer:
      "Yes. All projects include a 30-day post-launch bug warranty. We also offer monthly retainer plans covering security patches, performance monitoring, content updates, and feature enhancements.",
  },
  {
    question: "How do I get a project quote?",
    answer:
      "Contact us via the form on this page, call +91-98765-43210, or send a WhatsApp message. Our solution architect will schedule a free 30-minute discovery call within 24 hours and provide a detailed scope and cost proposal.",
  },
];

// ✅ Fields match exactly what Industries.tsx expects: name, location, description, count
export const INDUSTRIES = [
  {
    name: "Coaching & Education",
    location: "Katra, Civil Lines, Allahpur",
    description: "ERP, LMS, admission portals, attendance tracking, and fee management systems for coaching centres.",
    count: "40+ Institutes Served",
  },
  {
    name: "Healthcare & Clinics",
    location: "George Town, Kidwai Nagar",
    description: "Patient booking, HMS, telemedicine portals, lab report systems, and clinic management software.",
    count: "30+ Clinics Served",
  },
  {
    name: "Retail & Ecommerce",
    location: "Katra Bazar, Mumfordganj",
    description: "Shopify stores, custom cart systems, multi-vendor marketplaces, COD OTP, and UPI checkout.",
    count: "60+ Retailers Served",
  },
  {
    name: "Real Estate",
    location: "Civil Lines, Naini",
    description: "Property listing portals, lead CRM, builder websites, and virtual site tour integrations.",
    count: "20+ Builders Served",
  },
  {
    name: "Manufacturing & Industrial",
    location: "Naini Industrial Area",
    description: "B2B inventory software, supply chain portals, GST-ready billing, and wholesale order management.",
    count: "15+ Factories Served",
  },
  {
    name: "Hospitality & Travel",
    location: "Jhunsi, Daraganj, Phaphamau",
    description: "Hotel booking engines, travel itinerary portals, review management, and event management platforms.",
    count: "25+ Hotels Served",
  },
  {
    name: "Finance & NBFC",
    location: "Civil Lines, George Town",
    description: "Loan management portals, NBFC software, payment gateways, and KYC onboarding automation.",
    count: "10+ FinTech Clients",
  },
  {
    name: "Legal & Consulting",
    location: "High Court Road, Civil Lines",
    description: "Client portals, document management, case tracking CRM, and billing automation for law firms.",
    count: "12+ Law Firms Served",
  },
];

// ✅ Fields match exactly what Packages.tsx expects: popular (boolean), description, name, price, features
export const PACKAGES = [
  {
    name: "Starter",
    price: "₹24,999",
    description: "Perfect for solopreneurs, freelancers, and local shops getting online.",
    popular: false,
    features: [
      "5-page responsive website",
      "Mobile-first design",
      "Basic on-page SEO",
      "Contact form integration",
      "Google Maps embed",
      "30-day post-launch support",
    ],
  },
  {
    name: "Growth",
    price: "₹59,999",
    description: "Ideal for SMEs, coaching centres, and clinics scaling their digital presence.",
    popular: true,
    features: [
      "15-page Next.js website",
      "CMS / blog integration",
      "Advanced on-page SEO",
      "Lead capture & CRM",
      "Google Analytics 4",
      "WhatsApp chatbot",
      "3-month post-launch support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Built for hospitals, universities, and large businesses requiring custom systems.",
    popular: false,
    features: [
      "Unlimited pages & features",
      "Custom software / ERP",
      "Full-stack development",
      "API & third-party integrations",
      "Dedicated project manager",
      "SLA-backed 12-month support",
    ],
  },
];

// ✅ Fields match exactly what Services.tsx expects: id, title, iconName, tag, fullDesc
export const SERVICES_LIST = [
  {
    id: "website-development",
    title: "Website Development",
    iconName: "Globe",
    tag: "Core Service",
    fullDesc:
      "Next.js & React responsive business websites with sub-second load times, Core Web Vitals compliance, and conversion-first design.",
  },
  {
    id: "seo-services",
    title: "SEO Services",
    iconName: "Zap",
    tag: "Growth",
    fullDesc:
      "Local SEO, Google Maps 3-Pack dominance, entity SEO, and AI Overviews optimization to drive organic traffic from Prayagraj searches.",
  },
  {
    id: "app-development",
    title: "App Development",
    iconName: "Building2",
    tag: "Mobile",
    fullDesc:
      "Flutter, React Native, iOS Swift, and Android Kotlin mobile apps ready for Google Play and App Store launch.",
  },
  {
    id: "software-development",
    title: "Custom Software",
    iconName: "Code",
    tag: "Enterprise",
    fullDesc:
      "Custom CRM, ERP, HMS, institute management, and business automation software built for Indian SMEs.",
  },
  {
    id: "ecommerce-development",
    title: "Ecommerce Development",
    iconName: "ShoppingCart",
    tag: "Ecommerce",
    fullDesc:
      "Full-stack online stores with multi-vendor support, Razorpay/UPI payment gateways, and COD OTP verification.",
  },
  {
    id: "wordpress-development",
    title: "WordPress Development",
    iconName: "Layout",
    tag: "CMS",
    fullDesc:
      "Custom Gutenberg themes, WooCommerce, and 95+ PageSpeed optimized WordPress websites with full-stack PHP expertise.",
  },
  {
    id: "shopify-development",
    title: "Shopify Development",
    iconName: "Store",
    tag: "Shopify",
    fullDesc:
      "Shopify OS 2.0 themes, Headless commerce with Next.js, Razorpay & Shiprocket logistics integration.",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    iconName: "GraduationCap",
    tag: "Marketing",
    fullDesc:
      "Google Ads, Meta Ads (Facebook & Instagram), WhatsApp automation, and performance marketing for measurable ROI.",
  },
];

// ✅ Fields match exactly what Testimonials.tsx expects: quote, author, role, company, location, rating
export const TESTIMONIALS = [
  {
    quote:
      "Codelura built our complete student management system and website. Admissions increased by 40% in the first semester. Outstanding team!",
    author: "Rajesh Gupta",
    role: "Director",
    company: "Pioneer Coaching Centre",
    location: "Katra, Prayagraj",
    rating: 5,
  },
  {
    quote:
      "Our patient booking portal has reduced front-desk calls by 60%. The HMS integration with our lab is seamless. Highly recommended.",
    author: "Dr. Priya Sharma",
    role: "Orthopaedic Surgeon",
    company: "Medicity Clinic",
    location: "George Town, Allahabad",
    rating: 5,
  },
  {
    quote:
      "From Shopify store setup to Razorpay integration and WhatsApp order automation — Codelura delivered everything on time and within budget.",
    author: "Ankit Agarwal",
    role: "Founder",
    company: "SwadeshiMart",
    location: "Katra Bazar, Prayagraj",
    rating: 5,
  },
  {
    quote:
      "Our real estate portal with property listings, lead forms, and CRM is generating 20+ quality leads per week. Great ROI!",
    author: "Suresh Verma",
    role: "Managing Director",
    company: "Verma Construction",
    location: "Civil Lines, Prayagraj",
    rating: 5,
  },
  {
    quote:
      "The ERP system Codelura built for our factory handles GST billing, stock, and vendor payments all in one place. Game changer!",
    author: "Manoj Tiwari",
    role: "Operations Head",
    company: "Tiwari Industries",
    location: "Naini, Prayagraj",
    rating: 5,
  },
  {
    quote:
      "Website speed went from 32 to 96 on PageSpeed after Codelura's optimization. Our Google ranking improved significantly.",
    author: "Neha Srivastava",
    role: "Marketing Manager",
    company: "Hotel Sangam View",
    location: "Daraganj, Prayagraj",
    rating: 5,
  },
];
