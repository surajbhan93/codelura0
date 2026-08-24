// constants.ts for /location/* components
// All generic location page data — used by location/CTA.tsx, Hero.tsx, FAQ.tsx, etc.

export const COMPANY_DETAILS = {
  name: "Codelura",
  tagline: "India's Premier Digital Engineering & Software Agency",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "contact@codelura.com",
  hqAddress: "Codelura Tech Center, Civil Lines, Near Subhash Chouraha, Prayagraj (Allahabad), Uttar Pradesh 211001, India",
  websiteUrl: "https://codelura.com",
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

export const INDUSTRIES = [
  { name: "Coaching & Education", icon: "🎓", desc: "ERP, LMS, admission portals, attendance tracking." },
  { name: "Healthcare & Clinics", icon: "🏥", desc: "Patient booking, HMS, telemedicine, lab portals." },
  { name: "Retail & Ecommerce", icon: "🛒", desc: "Shopify, custom cart, multi-vendor, COD OTP." },
  { name: "Real Estate", icon: "🏠", desc: "Property listings, lead CRM, builder portals." },
  { name: "Manufacturing", icon: "🏭", desc: "Inventory, B2B wholesale, supply chain systems." },
  { name: "Hospitality & Travel", icon: "✈️", desc: "Hotel booking, itinerary, review management." },
  { name: "Finance & FinTech", icon: "💳", desc: "Loan portals, payment gateways, NBFC software." },
  { name: "Legal & Consulting", icon: "⚖️", desc: "Client portals, document management, CRM." },
];

export const PACKAGES = [
  {
    name: "Starter",
    price: "₹24,999",
    desc: "Perfect for solopreneurs, freelancers, and local shops.",
    features: [
      "5-page responsive website",
      "Mobile-first design",
      "Basic on-page SEO",
      "Contact form integration",
      "Google Maps embed",
      "30-day support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "₹59,999",
    desc: "Ideal for SMEs and coaching centres scaling digitally.",
    features: [
      "15-page Next.js website",
      "CMS / blog integration",
      "Advanced on-page SEO",
      "Lead capture & CRM",
      "Google Analytics 4",
      "WhatsApp chatbot",
      "3-month support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Built for hospitals, universities, and large businesses.",
    features: [
      "Unlimited pages & features",
      "Custom software / ERP",
      "Full-stack development",
      "API & third-party integrations",
      "Dedicated project manager",
      "SLA-backed 12-month support",
    ],
    highlight: false,
  },
];

export const SERVICES_LIST = [
  { title: "Website Development", slug: "website-development", icon: "🌐", desc: "Next.js & React responsive business websites with sub-second load times." },
  { title: "SEO Services", slug: "seo-services", icon: "🔍", desc: "Local SEO, Google Maps 3-Pack, entity SEO, and AI Overviews optimization." },
  { title: "App Development", slug: "app-development", icon: "📱", desc: "Flutter, React Native, iOS Swift, and Android Kotlin mobile apps." },
  { title: "Software Development", slug: "software-development", icon: "💻", desc: "Custom CRM, ERP, HMS, and business automation software." },
  { title: "Ecommerce Development", slug: "ecommerce-development", icon: "🛒", desc: "Full-stack online stores with multi-vendor support and payment gateways." },
  { title: "WordPress Development", slug: "wordpress-development", icon: "📝", desc: "Custom themes, WooCommerce, and 95+ PageSpeed optimized WordPress sites." },
  { title: "Shopify Development", slug: "shopify-development", icon: "🏪", desc: "Shopify OS 2.0 themes, Headless commerce, Razorpay & Shiprocket integration." },
  { title: "Digital Marketing", slug: "digital-marketing", icon: "📣", desc: "Google Ads, Meta Ads, WhatsApp automation, and performance marketing." },
];

export const TESTIMONIALS = [
  {
    name: "Rajesh Gupta",
    role: "Director, Pioneer Coaching Centre, Prayagraj",
    text: "Codelura built our complete student management system and website. Admissions increased by 40% in the first semester. Outstanding team!",
    rating: 5,
  },
  {
    name: "Dr. Priya Sharma",
    role: "Orthopaedic Surgeon, Medicity Clinic, Allahabad",
    text: "Our patient booking portal has reduced front-desk calls by 60%. The HMS integration with our lab is seamless. Highly recommended.",
    rating: 5,
  },
  {
    name: "Ankit Agarwal",
    role: "Founder, SwadeshiMart Ecommerce",
    text: "From Shopify store setup to Razorpay integration and WhatsApp order automation — Codelura delivered everything on time and within budget.",
    rating: 5,
  },
  {
    name: "Suresh Verma",
    role: "MD, Verma Construction, Prayagraj",
    text: "Our real estate portal with property listings, lead forms, and CRM is generating 20+ quality leads per week. Great ROI!",
    rating: 5,
  },
];
