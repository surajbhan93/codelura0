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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central business hub of Prayagraj, home to law firms, real estate agencies, and corporate offices requiring high-intent Google rankings." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Sector & Polyclinics", description: "Premier healthcare corridor where top doctors, hospitals, and diagnostic labs require Local Map Pack 3-Pack optimization." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center of UP where competitive exam coaching institutes compete for student search queries." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Services & Academies", description: "Vibrant neighborhood with charter accountancy firms, private academies, and legal consultancies seeking local SEO." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and residential sector requiring mobile voice search and Google Maps optimization." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Historic commercial belt where retail merchants and wholesalers need regional e-commerce and local SEO." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Industrial manufacturing zone of Allahabad where B2B factories require national B2B SEO and RFQ lead generation." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding township area where real estate developers and new businesses require geo-targeted local search rankings." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Key northern entry point to Prayagraj with manufacturing units and colleges needing search visibility across UP." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upmarket mixed sector with specialist medical practitioners and financial consultancies seeking local organic dominance." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Cultural hub where hotels, travel agencies, and boat tour operators target tourist and festival search queries." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing suburb where local shops, fitness gyms, and private clinics need Google Maps listing optimization." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "local-seo",
    title: "Local SEO & Google Maps Ranking Prayagraj",
    shortDesc: "Dominate the Google 3-Pack local map results and capture high-intent customers in Prayagraj and Allahabad.",
    fullDesc: "We optimize your Google Business Profile (GBP), build consistent NAP (Name, Address, Phone) citations, optimize localized geo-landing pages, and secure local reviews to place your business at the top of Google Maps search queries in Prayagraj.",
    iconName: "MapPin",
    tag: "Google 3-Pack"
  },
  {
    id: "technical-seo",
    title: "Technical SEO Audit & Core Web Vitals",
    shortDesc: "Fix crawl errors, optimize site architecture, improve Core Web Vitals, and enable instant Google indexing.",
    fullDesc: "Our technical SEO experts eliminate website bottlenecks. We resolve indexing issues, fix canonical tags, implement XML sitemaps, optimize PageSpeed for 95+ scores, and structure JavaScript rendering for sub-second load times.",
    iconName: "Cpu",
    tag: "High Performance"
  },
  {
    id: "on-page-seo",
    title: "On-Page SEO & Content Optimization",
    shortDesc: "Strategic keyword placement, semantic HTML structural tags, and high-converting copy optimized for search intent.",
    fullDesc: "We meticulously optimize title tags, meta descriptions, H1-H6 heading hierarchies, image alt text, and internal link structures. Every page is crafted to satisfy user search intent and outrank Prayagraj competitors.",
    iconName: "Search",
    tag: "Content Dominance"
  },
  {
    id: "off-page-seo",
    title: "Off-Page SEO & Authority Link Building",
    shortDesc: "High-DA contextual backlink acquisition, local digital PR, and brand authority building across India.",
    fullDesc: "Boost your website domain rating (DR) with high-quality, contextual backlinks from authoritative news portals, regional directories, and industry-specific blogs. We build natural, Google-compliant backlink profiles.",
    iconName: "Share2",
    tag: "High Authority"
  },
  {
    id: "gbp-optimization",
    title: "Google Business Profile (GBP) Optimization",
    shortDesc: "Complete optimization of your Google Map listing, business categories, geo-tagged photos, and review strategy.",
    fullDesc: "Turn your Google Business Profile into a lead magnet. We optimize your business category hierarchy, post geo-tagged photos of your Civil Lines or Katra facility, handle Q&A sections, and implement review collection systems.",
    iconName: "Store",
    tag: "Local Map Pack"
  },
  {
    id: "ai-entity-seo",
    title: "AI SEO, GEO & Entity SEO (Google AI Overviews)",
    shortDesc: "Future-proof your organic rankings for Google AI Overviews, ChatGPT Search, Perplexity, and voice queries.",
    fullDesc: "Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) are the future of search. We optimize your brand entity graph, inject Schema data, and structure content so Google AI Overviews feature your business as the primary recommended answer.",
    iconName: "Sparkles",
    tag: "AI & AEO Ready"
  },
  {
    id: "coaching-seo",
    title: "Coaching & Institute SEO Katra",
    shortDesc: "Specialized search engine optimization for competitive exam coaching institutes in Katra & Rambagh.",
    fullDesc: "Capture thousands of student search queries such as 'best IAS coaching in Prayagraj' or 'top NEET institute in Katra'. We rank your course landing pages, batch announcements, and review snippets at the top of Google SERPs.",
    iconName: "GraduationCap",
    tag: "EdTech Ranking"
  },
  {
    id: "hospital-seo",
    title: "Hospital & Medical Clinic SEO George Town",
    shortDesc: "Patient-acquisition SEO strategies for polyclinics, hospitals, and specialist doctors in Allahabad.",
    fullDesc: "Help patients find your medical clinic during health emergencies. We rank specialist services (cardiology, orthopedics, dental) for hyper-local queries like 'best dentist in George Town Prayagraj'.",
    iconName: "Stethoscope",
    tag: "Healthcare SEO"
  },
  {
    id: "realestate-seo",
    title: "Real Estate & Builder SEO Prayagraj",
    shortDesc: "Generate high-ticket buyer inquiries for residential projects and commercial spaces in Civil Lines & Jhunsi.",
    fullDesc: "Rank your property project landing pages for commercial and luxury residential buyer searches. Includes location schema, property gallery SEO, and high-converting landing page optimization.",
    iconName: "Home",
    tag: "Property Leads"
  },
  {
    id: "ecommerce-seo",
    title: "E-Commerce SEO & Product Schema",
    shortDesc: "Product page optimization, structured schema markup, and category taxonomy ranking for online stores.",
    fullDesc: "Turn online shoppers into buyers. We optimize product titles, meta data, Product & Offer JSON-LD schema, category pages, and site speed for Shopify, WooCommerce, and custom Next.js e-commerce sites.",
    iconName: "ShoppingCart",
    tag: "E-Com Sales"
  },
  {
    id: "b2b-industrial-seo",
    title: "B2B & Industrial Manufacturer SEO Naini",
    shortDesc: "National B2B search engine optimization for industrial factories and equipment manufacturers in Naini.",
    fullDesc: "Connect your manufacturing plant in Naini Industrial Area with nationwide B2B buyers. We optimize industrial catalog keywords, technical specifications, and RFQ lead funnels.",
    iconName: "Factory",
    tag: "B2B Industrial"
  },
  {
    id: "voice-search-seo",
    title: "Voice Search & Conversational AEO",
    shortDesc: "Optimize for 'near me' Google Assistant, Apple Siri, and conversational voice search queries.",
    fullDesc: "Over 40% of mobile searches in Prayagraj are conducted via voice. We structure conversational Q&A snippets and natural language content to dominate Google Featured Snippets and voice answers.",
    iconName: "Mic",
    tag: "Voice & AEO"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Local SEO Starter Package",
    price: "₹7,999 / mo",
    popular: false,
    description: "Ideal for local shops, individual doctors, advocates, and single-location clinics in Prayagraj.",
    features: [
      "Target Up to 10 Primary Local Keywords",
      "Complete Google Business Profile (GBP) Audit & Setup",
      "Local Map Pack 3-Pack Optimization",
      "25+ Verified Local Directory Citations",
      "On-Page SEO Optimization for 5 Key Pages",
      "Google Search Console & GA4 Setup",
      "Monthly Local Search Ranking & Traffic Report",
      "Dedicated Technical SEO Support"
    ]
  },
  {
    name: "Growth Local SEO Package",
    price: "₹14,999 / mo",
    popular: true,
    description: "Best for coaching institutes, hospitals, real estate agencies, and growing Prayagraj businesses.",
    features: [
      "Target Up to 25 High-Intent Local Keywords",
      "Full On-Page + Technical SEO Optimization",
      "Google Business Profile Weekly Post & Geo-Photo Management",
      "High-Authority Contextual Backlink Building (10/mo)",
      "JSON-LD Schema Markup (LocalBusiness, Service, FAQ)",
      "Core Web Vitals Speed Optimization (90+ Score)",
      "Competitor Keyword Gap & Backlink Analysis",
      "Bi-Weekly Strategy Call & Monthly ROI Report"
    ]
  },
  {
    name: "Enterprise SEO & Market Domination",
    price: "₹29,999+ / mo",
    popular: false,
    description: "For multi-location corporate brands, e-commerce stores, major educational networks & real estate developers.",
    features: [
      "Target 50+ State & National Competitive Keywords",
      "Complete GEO, AEO & AI Overviews Optimization",
      "Premium Backlink Outreach & Digital PR Campaign",
      "Advanced Entity SEO & Knowledge Graph Alignment",
      "E-Commerce Product & Category Page SEO",
      "Sub-Second Next.js Technical Speed Engineering",
      "Dedicated Senior SEO Strategist & Content Team",
      "24/7 Priority Support & Weekly Performance Audit"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Google Search Console", category: "Indexing & Crawl", desc: "Sitemap Indexing, Coverage Monitoring & Core Web Vitals Tracking" },
  { name: "Google Analytics 4 (GA4)", category: "Traffic Analytics", desc: "Custom Event Tracking, Conversion Funnels & User Behavioral Data" },
  { name: "Ahrefs & SEMrush", category: "Keyword Research", desc: "Competitor Backlink Audits, Keyword Gap & Rank Tracking" },
  { name: "Screaming Frog SEO", category: "Technical Crawling", desc: "Deep Technical Audits, Broken Links, Canonical & Redirect Mapping" },
  { name: "Google Tag Manager", category: "Event Tracking", desc: "Tag Deployment, Lead Click & Form Submission Tracking" },
  { name: "Surfer SEO & Frase", category: "Content Optimization", desc: "AI-Powered NLP Keyword Density & Semantic Structuring" },
  { name: "Schema App & JSON-LD", category: "Structured Data", desc: "Rich Snippets, LocalBusiness, FAQ & Entity Schema Injection" },
  { name: "Google PageSpeed", category: "Performance Audit", desc: "Lighthouse Performance, LCP, INP & CLS Core Web Vitals Fixes" },
  { name: "Moz Local & BrightLocal", category: "Citation Audit", desc: "NAP Consistency, Citation Building & Local Map Rank Tracking" },
  { name: "Cloudflare Edge CDN", category: "Edge Speed & Security", desc: "Sub-Second Global Edge Caching & DDoS Security Defense" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "35+ Institutes Ranked #1", description: "Dominating competitive exam search queries for IAS, NEET, JEE, and State PSC coaching centers in Katra." },
  { name: "Hospitals & Medical Clinics", location: "George Town, Ashok Nagar", count: "25+ Healthcare Sites Ranked", description: "Positioning polyclinics and specialist doctors at the top of Google Maps and organic local search results." },
  { name: "Real Estate & Housing Builders", location: "Civil Lines, Jhalwa", count: "20+ Builders Ranked", description: "Capturing high-intent property buyer leads for commercial plazas and residential townships in Civil Lines." },
  { name: "Hotels, Cafes & Tourism", location: "Civil Lines, Sangam Area", count: "30+ Hospitality Clients", description: "Maximizing booking inquiries during Mahakumbh, Magh Mela, and annual spiritual tourism seasons." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi Sector", count: "15+ Schools Ranked", description: "Helping ICSE, CBSE, and UP Board educational campuses rank for parent admission searches." },
  { name: "Manufacturing & Industrial Plants", location: "Naini Industrial Area", count: "18+ B2B Factories Ranked", description: "Connecting industrial equipment manufacturers with national B2B buyers via targeted B2B SEO." },
  { name: "Law Firms & High Court Advocates", location: "High Court, Civil Lines", count: "12+ Legal Practices Ranked", description: "Establishing top digital authority for corporate advocates and legal consultancies near High Court." },
  { name: "Retail & Local Showrooms", location: "Chowk, Katra Market", count: "40+ Retail Stores Ranked", description: "Driving foot traffic and online orders for local jewelry, clothing, and electronics stores in Chowk." }
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
    quote: "Codelura is without doubt the best SEO company in Prayagraj! Our coaching institute in Katra moved from Page 4 to #1 on Google for 'top coaching in Prayagraj' within 3 months. Our admissions skyrocketed!",
    author: "Sanjay Mishra",
    role: "Director",
    company: "Mishra IAS Academy, Katra Prayagraj",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We were struggling to get patient calls for our clinic in George Town. Codelura optimized our Google Map listing and technical SEO. Now we receive 15+ patient phone calls every single day directly from Google Maps!",
    author: "Dr. Alok Nath Srivastava",
    role: "Managing Director",
    company: "Srivastava Dental & Medical Hub",
    location: "George Town, Allahabad",
    rating: 5
  },
  {
    quote: "Our real estate project in Civil Lines was invisible on Google. Codelura executed a comprehensive Local SEO strategy. Today, we rank ahead of big portals like 99acres and Magicbricks for local property searches!",
    author: "Prashant Tandon",
    role: "Chief Executive Officer",
    company: "Tandon Infratech & Builders",
    location: "Civil Lines, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top SEO company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognised as the leading SEO agency in Prayagraj because we deliver proven, measurable rank growth rather than vanity metrics. We combine technical SEO (Core Web Vitals, sub-second speed, Schema markup), local SEO (Google Maps 3-Pack domination, NAP consistency), and modern AI SEO (GEO & AEO for Google AI Overviews). Our clients in Katra, Civil Lines, and George Town consistently achieve #1 Google rankings and exponential lead growth."
  },
  {
    question: "How much do SEO services cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, our transparent monthly SEO packages in Prayagraj start at ₹7,999 / month for local businesses and small clinics. Mid-sized coaching institutes, hospitals, and real estate agencies range between ₹14,999 to ₹25,000 / month, while enterprise e-commerce and multi-location brands start at ₹29,999 / month. We operate with 100% pricing transparency and zero long-term lock-in contracts."
  },
  {
    question: "How long does it take to rank #1 on Google for a business in Prayagraj?",
    answer: "Local SEO results (Google Maps 3-Pack and local search queries) typically become visible within 30 to 60 days. Highly competitive organic search keywords in Prayagraj (such as coaching or real estate terms) usually take 3 to 6 months of sustained technical SEO, high-authority backlink building, and content optimization to reach top Google positions."
  },
  {
    question: "What is Google Business Profile (GBP) Optimization and why is it vital for Prayagraj businesses?",
    answer: "Google Business Profile optimization ensures your business appears in the Google 3-Pack Map Results when local customers search for services near them (e.g., 'best clinic near me' or 'coaching in Katra'). We optimize your business category, primary services, geo-tagged photos, Q&A sections, customer review strategies, and map citations to ensure maximum local visibility."
  },
  {
    question: "What is the difference between Local SEO, Technical SEO, and AI SEO (GEO/AEO)?",
    answer: "Local SEO focuses on ranking your business for geographic queries in Prayagraj and Google Maps. Technical SEO fixes backend site speed, crawlability, mobile responsiveness, and Schema markup. AI SEO (Generative Engine Optimization & Answer Engine Optimization) ensures your brand is selected by Google AI Overviews, ChatGPT Search, and voice assistants as the authoritative recommended answer."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh need professional SEO services?",
    answer: "Katra is the education hub of UP. Thousands of students search Google daily for 'best coaching for IAS in Prayagraj' or 'top NEET coaching Katra'. If your institute is not on Page 1 of Google, you are losing hundreds of admissions to competitors. Our targeted ed-tech SEO strategy ensures your institute dominates local student search results."
  },
  {
    question: "How does Codelura help medical clinics and hospitals in George Town get more patients?",
    answer: "We implement hyper-local healthcare SEO. We optimize doctor profiles, department landing pages, emergency helpline buttons, and Google Map listings for medical terms like 'top dentist in George Town Allahabad' or 'best eye hospital near me'. This drives high-intent patient calls directly to your front desk."
  },
  {
    question: "Will SEO work for real estate developers and builders in Civil Lines and Jhalwa?",
    answer: "Yes! High-intent property buyers search Google for 'flats for sale in Civil Lines Prayagraj' or 'plots in Jhunsi'. By outranking national portals and optimizing property landing pages with location schema and high-converting copy, we generate qualified buyer leads directly for your sales team."
  },
  {
    question: "Do you provide white-hat SEO techniques compliant with Google Search guidelines?",
    answer: "100%. We strictly execute 100% white-hat SEO techniques compliant with Google’s Helpful Content System, Core Algorithm updates, and Webmaster Guidelines. We focus on technical site speed, semantic content depth, entity schema markup, and natural authority link acquisition."
  },
  {
    question: "What SEO tools and software does Codelura use?",
    answer: "We utilize enterprise-grade SEO tools including Google Search Console, Google Analytics 4, Ahrefs, SEMrush, Screaming Frog SEO Spider, Surfer SEO, Moz Local, Google Tag Manager, and proprietary AI schema generation tools to engineer data-driven campaigns."
  },
  {
    question: "Can Codelura audit our existing website for free?",
    answer: "Yes! We offer a comprehensive 100% free SEO Audit for any business operating in Prayagraj or Allahabad. We analyze your website's technical health, keyword rankings, Google Map listing, page load speed, and competitor gaps."
  },
  {
    question: "What post-campaign reporting and analytics do you provide?",
    answer: "We provide clear, easy-to-understand monthly performance reports detailing keyword rank movements, Google Maps call & direction metrics, organic traffic growth, backlink additions, and lead conversions."
  },
  {
    question: "Is mobile SEO included in your SEO packages?",
    answer: "Yes! Over 80% of local searches in Prayagraj happen on mobile devices. All our SEO strategies prioritize mobile Core Web Vitals (LCP, INP, CLS), responsive viewport optimization, touch usability, and mobile voice search readiness."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for Local SEO?",
    answer: "We cover all major commercial and residential sectors of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do I get started with Codelura for SEO services in Prayagraj?",
    answer: "Starting is quick and easy! Simply call us at +91 98765 43210, send a message on WhatsApp, or submit our online inquiry form. Our Prayagraj SEO team will conduct a free audit and present a customized ranking roadmap for your business."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "All Services", href: "/services" },
  { title: "SEO Services", href: "/services/seo-services" },
  { title: "App Development", href: "/services/app-development" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "UI / UX Design", href: "/services/ui-ux" },
  { title: "AI Development", href: "/services/ai-development" },
  { title: "Our Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
