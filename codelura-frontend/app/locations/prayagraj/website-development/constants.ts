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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "The central business and commercial heart of Prayagraj, home to top corporate offices, law firms, and high-end retail brands." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Commercial Complex", description: "Premier medical sector in Allahabad featuring leading hospitals, nursing homes, and diagnostic laboratories requiring online doctor scheduling." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "The educational powerhouse of UP, packed with competitive exam coaching institutes, hostels, and academic book centers." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Residential & Commercial Sector", description: "Vibrant neighborhood with premier educational academies, boutique law firms, and professional consultancy practices." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road & Student Zone", description: "Dense student housing and retail district requiring localized mobile-friendly websites and quick online ordering." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial & Retail Area", description: "Historic commercial corridor witnessing rapid modernization of retail stores and manufacturing enterprises." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Major industrial estate of Allahabad hosting manufacturing factories, logistics warehouses, and engineering institutions." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding urban zone along the Ganges with new real estate developments and township projects." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Key northern gateway to Prayagraj housing manufacturing units, brick kilns, and educational campuses." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Hub", description: "Upscale mixed-use district with specialist healthcare clinics, chartered accountancy firms, and IT services." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Cultural and pilgrimage epicenter driving spiritual tourism websites, hotel bookings, and boat tour portals." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Area", description: "Growing residential and local shopping district requiring localized business websites and service listings." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "business-website",
    title: "Business Website Development Prayagraj",
    shortDesc: "High-converting custom business websites engineered for small and medium enterprises across Prayagraj and Allahabad.",
    fullDesc: "Our custom business website development service in Prayagraj empowers local entrepreneurs to build trust, rank higher on Google search results, and generate a steady stream of phone calls and web inquiries. We build semantic, ultra-fast sites with Next.js 15 and Tailwind CSS.",
    iconName: "Building2",
    tag: "High Conversion"
  },
  {
    id: "corporate-website",
    title: "Corporate Website Development Allahabad",
    shortDesc: "Enterprise-grade web portals for corporations, financial institutions, and law firms in Civil Lines.",
    fullDesc: "Designed for corporate houses and major enterprises in Uttar Pradesh. Built with enterprise architecture, role-based admin access, investor portals, team directories, and bank-grade SSL security infrastructure.",
    iconName: "Globe",
    tag: "Enterprise Grade"
  },
  {
    id: "landing-page",
    title: "High-Converting Landing Page Design",
    shortDesc: "Performance-tuned landing pages for Google Ads and social media marketing in Uttar Pradesh.",
    fullDesc: "Stop wasting ad spend on slow websites. Our high-converting landing pages load in under 1 second, leverage psychological call-to-actions, and maximize lead capture rates for local campaigns in Prayagraj.",
    iconName: "Zap",
    tag: "Max ROI"
  },
  {
    id: "ecommerce-website",
    title: "Ecommerce Website Development Prayagraj",
    shortDesc: "Full-stack online stores integrated with UPI, Razorpay, Paytm, and WhatsApp order alerts.",
    fullDesc: "Transform your physical retail store in Chowk or Katra into an online e-commerce powerhouse. Includes inventory management, multi-currency support, local delivery radius tracking, and instant WhatsApp invoice dispatch.",
    iconName: "ShoppingCart",
    tag: "Online Sales"
  },
  {
    id: "wordpress-development",
    title: "WordPress Website Development Prayagraj",
    shortDesc: "Custom theme development and light-weight WordPress builds with zero bloat.",
    fullDesc: "Custom WordPress design tailored to your specific workflow. We eliminate heavy pre-made themes and bloated plugins, engineering custom block layouts for seamless content management by non-technical teams.",
    iconName: "Layout",
    tag: "Easy Content CMS"
  },
  {
    id: "shopify-development",
    title: "Shopify Storefront Development",
    shortDesc: "High-conversion Shopify store setups for D2C brands and retailers expanding across India.",
    fullDesc: "Scale your retail business nationwide with custom Shopify themes, optimized checkout flows, speed optimization, and seamless integration with logistics partners like Shiprocket and Delhivery.",
    iconName: "Store",
    tag: "D2C Scaling"
  },
  {
    id: "custom-web-app",
    title: "Custom Web Application Development",
    shortDesc: "Bespoke SaaS, booking engines, and internal ERP platforms powered by React 19 & Node.js.",
    fullDesc: "When off-the-shelf software falls short, Codelura engineers custom web applications. We build interactive student portals, clinic scheduling systems, and workflow automation platforms tailored to Prayagraj businesses.",
    iconName: "Code",
    tag: "Tailored Logic"
  },
  {
    id: "coaching-website",
    title: "Coaching & Institute Websites Katra",
    shortDesc: "Student registration portals, test series systems, and batch schedules for institutes in Katra & Rambagh.",
    fullDesc: "Prayagraj is the educational capital of UP. We equip competitive exam coaching centers with lead generation pages, student batch timetables, downloadable study material portals, and online fee collection.",
    iconName: "GraduationCap",
    tag: "EduTech"
  },
  {
    id: "hospital-website",
    title: "Hospital & Doctor Website Development",
    shortDesc: "Medical websites with online doctor appointment scheduling and emergency helpline integrations.",
    fullDesc: "Engineered specifically for polyclinics, multi-specialty hospitals, and private practitioners in George Town and Ashok Nagar. Features doctor profiles, department details, patient testimonials, and appointment booking.",
    iconName: "Stethoscope",
    tag: "Healthcare"
  },
  {
    id: "realestate-website",
    title: "Real Estate Portal Development",
    shortDesc: "Property listing portals with interactive floor plans, map views, and direct WhatsApp routing.",
    fullDesc: "Designed for real estate developers and property consultants in Civil Lines and Jhalwa. Showcase residential townships, commercial plots, and luxury apartments with high-res galleries and virtual tour links.",
    iconName: "Home",
    tag: "Real Estate"
  },
  {
    id: "restaurant-website",
    title: "Restaurant & Cafe Website Development",
    shortDesc: "Tempting food ordering sites with digital QR menus and table reservation triggers.",
    fullDesc: "Capture food lovers in Civil Lines and Chowk. Showcase digital menus, highlight signature dishes, collect Google customer reviews, and integrate direct table booking triggers without third-party commission fees.",
    iconName: "Utensils",
    tag: "Hospitality"
  },
  {
    id: "industrial-website",
    title: "Industrial & Manufacturing Websites Naini",
    shortDesc: "B2B catalog sites and Request for Quote (RFQ) forms for factories in Naini & Phaphamau.",
    fullDesc: "Position your manufacturing factory or industrial enterprise for national B2B buyers. Features machinery specifications, product catalogs, ISO certification showcases, and instant RFQ forms.",
    iconName: "Factory",
    tag: "B2B Manufacturing"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Starter Business Package",
    price: "₹9,999",
    popular: false,
    description: "Ideal for small local shops, individual doctors, advocates, and new startups in Prayagraj.",
    features: [
      "5 Custom Designed Mobile Responsive Pages",
      "Free Domain (.com or .in) for 1 Year",
      "High-Speed Edge Cloud Hosting Included",
      "Free SSL Security Certificate Setup",
      "Google Maps Location & Local SEO Setup",
      "WhatsApp Chat & Direct Click-to-Call",
      "Contact Form with Email Notifications",
      "Fast 5-Day Guaranteed Delivery"
    ]
  },
  {
    name: "Professional Growth Package",
    price: "₹18,999",
    popular: true,
    description: "Best for coaching institutes, schools, clinics, real estate, and growing Prayagraj SMBs.",
    features: [
      "Up to 12 Custom Mobile-Optimized Pages",
      "Next.js 15 or WordPress Custom CMS Build",
      "Full Local SEO & Schema Structured Data Setup",
      "Dynamic Photo Gallery & Video Showcase",
      "Blog / Notice Board Management Dashboard",
      "Lead Capture Forms & Inquiry Routing",
      "Google Search Console & Analytics 4 Setup",
      "1 Year Technical Support & Maintenance"
    ]
  },
  {
    name: "Enterprise & Ecommerce Portal",
    price: "₹34,999+",
    popular: false,
    description: "For multi-location corporate brands, online shopping stores, and major educational networks.",
    features: [
      "Unlimited Dynamic Pages & Custom Database",
      "Full E-Commerce / Student Portal System",
      "Razorpay, Paytm, Cashfree & UPI Payments",
      "Automated WhatsApp & SMS Notifications",
      "Customer / Student Dashboard Accounts",
      "Sub-Second Core Web Vitals Optimization",
      "Competitor Local SEO Domination Plan",
      "Priority 24/7 Dedicated Technical Support"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Next.js 15", category: "Frontend Engine", desc: "App Router, React Server Components & Lightning Speeds" },
  { name: "React 19", category: "UI Framework", desc: "Reactive UI with Concurrent Rendering Capabilities" },
  { name: "TypeScript", category: "Code Quality", desc: "100% Type-Safe Architecture Preventing Runtime Errors" },
  { name: "Tailwind CSS v4", category: "Styling System", desc: "Modern, Utility-First Glassmorphism & Responsive Aesthetics" },
  { name: "Framer Motion", category: "Animation Engine", desc: "Hardware-Accelerated Smooth 60fps Transitions" },
  { name: "Node.js & Express", category: "Backend Logic", desc: "Scalable REST APIs & Real-Time Microservices" },
  { name: "WordPress & WooCommerce", category: "CMS Ecosystem", desc: "Tailored Custom Themes & Lightweight Content Management" },
  { name: "Shopify", category: "Ecommerce Platform", desc: "High-Volume Retail Merchant Operations" },
  { name: "PostgreSQL & MongoDB", category: "Database Architecture", desc: "Enterprise Data Storage & Sub-Millisecond Queries" },
  { name: "Vercel & AWS Edge", category: "Cloud Hosting", desc: "99.99% Global Uptime Edge CDN Infrastructure" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "45+ Websites Delivered", description: "Enabling IAS, NEET, JEE, and State PSC coaching centers in Katra to register students online and broadcast test schedules." },
  { name: "Hospitals & Medical Specialists", location: "George Town, Ashok Nagar", count: "30+ Websites Delivered", description: "Helping doctors and polyclinics in George Town streamline online patient appointments and health department details." },
  { name: "Real Estate & Housing Builders", location: "Civil Lines, Jhalwa", count: "25+ Websites Delivered", description: "Showcasing residential projects, luxury apartments, and commercial plazas in Civil Lines with interactive floor plans." },
  { name: "Restaurants, Cafes & Hotels", location: "Civil Lines, Chowk", count: "35+ Websites Delivered", description: "Powering digital menus, online food delivery links, and hotel room reservations near Sangam and Railway Junction." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi", count: "20+ Websites Delivered", description: "Building ICSE, CBSE, and UP Board school portals with online fee payment gateways and student notice boards." },
  { name: "Manufacturing & Industrial Units", location: "Naini Industrial Area", count: "18+ Websites Delivered", description: "Connecting industrial equipment manufacturers in Naini with national and international B2B buyers via RFQ portals." },
  { name: "Law Firms & High Court Advocates", location: "High Court, Civil Lines", count: "15+ Websites Delivered", description: "Establishing authoritative digital presences for senior advocates and corporate law firms near Allahabad High Court." },
  { name: "Tourism & Kumbh Hospitality", location: "Daraganj, Sangam", count: "22+ Websites Delivered", description: "Promoting hotel bookings, boat tours, and spiritual tourism during Mahakumbh and annual Magh Mela festivals." }
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
    quote: "Codelura is hands down the best website development company in Prayagraj. They delivered our coaching institute website in just 6 days, and our student inquiries jumped dramatically!",
    author: "Alok Kumar Srivastava",
    role: "Managing Director",
    company: "Srivastava Classes, Katra Prayagraj",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We needed a medical website that looked professional and ranked on Google for patients in George Town and Ashok Nagar. Codelura exceeded our expectations in speed and design.",
    author: "Dr. Meenakshi Agarwal",
    role: "Senior Consultant Dentist",
    company: "Agarwal Dental Hospital, George Town",
    location: "George Town, Allahabad",
    rating: 5
  },
  {
    quote: "Our real estate project in Civil Lines required a premium website with interactive maps. Codelura’s Next.js development gave us a massive competitive edge over other builders.",
    author: "Siddharth Pandey",
    role: "CEO",
    company: "Sangam Heights & Infrastructure",
    location: "Civil Lines, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top website development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading web engineering agency in Prayagraj because we combine modern software engineering (Next.js 15, React 19, TypeScript) with deep local SEO expertise. Unlike traditional agencies that use slow, heavy templates, we build ultra-fast, mobile-responsive, and conversion-optimized websites specifically designed to rank #1 on Google searches in Prayagraj, Allahabad, and Uttar Pradesh."
  },
  {
    question: "What is the cost of website development in Prayagraj?",
    answer: "At Codelura, our transparent website development packages in Prayagraj start at ₹9,999 for standard 5-page business websites. Feature-rich corporate or educational institute websites range between ₹18,999 to ₹35,000, while custom e-commerce platforms and complex web portals start at ₹34,999. We provide explicit, itemized quotes with zero hidden fees."
  },
  {
    question: "How long does it take to design and launch a business website in Prayagraj?",
    answer: "Standard business websites and landing pages are completed within 5 to 7 business days. Custom corporate portals, educational institute websites, or e-commerce platforms typically require 2 to 4 weeks depending on customized functionality, API integrations, and content approval timelines."
  },
  {
    question: "Will my website rank on Google search for Prayagraj and Allahabad local searches?",
    answer: "Yes! Every website engineered by Codelura comes built-in with foundational Technical SEO, Local GEO targeting, Schema structured data markup (LocalBusiness, Service, FAQ), Google Search Console sitemap indexing, and Google Maps 3-Pack optimization to maximize local client acquisition."
  },
  {
    question: "Why is custom website development essential for coaching institutes in Katra and Rambagh?",
    answer: "Prayagraj is the educational hub of UP. Coaching centers in Katra, Rambagh, and Tagore Town face fierce competition. A custom website equipped with student lead forms, batch schedules, downloadable study materials, and Google ranking capabilities helps you outshine competitors and capture thousands of student admissions."
  },
  {
    question: "Do you build mobile responsive websites for Prayagraj businesses?",
    answer: "Yes, 100% of our websites are mobile-first and fluidly responsive. Over 80% of web traffic in Allahabad originates from mobile smartphones. We test every website across iOS, Android, tablets, and desktop resolutions to ensure sub-second loading speeds and seamless user experiences."
  },
  {
    question: "Can Codelura redesign our old, slow, or outdated business website?",
    answer: "Absolutely. We specialize in complete website modernizations. We migrate outdated WordPress or static HTML websites to high-speed Next.js platforms, refresh visual aesthetics with modern Tailwind CSS styling, improve Core Web Vitals, and rewrite copy to dominate local search rankings."
  },
  {
    question: "Do your web development packages include free domain, hosting, and SSL certificates?",
    answer: "Yes, all our primary web development packages include 1 year of domain registration (.com or .in), high-speed global cloud hosting on edge networks, free SSL security encryption, professional domain business emails, and full initial Google setup."
  },
  {
    question: "What e-commerce features do you provide for retail stores in Chowk and Civil Lines?",
    answer: "We build complete online shopping platforms equipped with instant UPI (GPay, PhonePe, Paytm), credit card, and net banking payment gateways (Razorpay/Cashfree), stock inventory management, localized shipping zones, and automated order alerts via WhatsApp."
  },
  {
    question: "How does Local SEO & Google Entity Optimization help my business in Prayagraj?",
    answer: "Local SEO and Entity GEO optimization establish your business as an authoritative local brand on Google. When potential clients search for 'best clinic in George Town' or 'top real estate in Civil Lines', Google AI Overviews and Search maps display your business prominently."
  },
  {
    question: "What technology stack does Codelura use for web development in 2026?",
    answer: "We leverage Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion, and Node.js backend architecture hosted on global edge CDN networks like Vercel and AWS. For content-managed sites, we build custom lightweight WordPress themes or Shopify storefronts."
  },
  {
    question: "Do you offer post-launch website maintenance and technical support in Prayagraj?",
    answer: "Yes, Codelura provides comprehensive ongoing support, including monthly data backups, core software updates, security vulnerability patching, performance checks, content updates, and 24/7 technical assistance for Prayagraj business owners."
  },
  {
    question: "Can you build online doctor appointment systems for hospitals in George Town & Ashok Nagar?",
    answer: "Yes, we engineer specialized healthcare websites with real-time doctor schedule visibility, automated patient appointment bookings, emergency click-to-call buttons, tele-consultation links, and diagnostic report download portals."
  },
  {
    question: "What nearby areas in Prayagraj do you serve?",
    answer: "We serve businesses across all key localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do I get started with Codelura for web development in Prayagraj?",
    answer: "Starting your project is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or fill out our online contact form. Our Prayagraj web engineering team will provide a free consultation and project blueprint."
  }
];

export const INTERNAL_LINKS = [
  { title: "SEO Services", href: "/services/seo" },
  { title: "App Development", href: "/services/app-development" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "UI / UX Design", href: "/services/ui-ux" },
  { title: "AI Development", href: "/services/ai-development" },
  { title: "All Services", href: "/services" },
  { title: "Our Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
