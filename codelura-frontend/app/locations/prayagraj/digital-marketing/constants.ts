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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central business hub where corporate firms, law consultancies, and real estate developers require targeted Google & Meta Ads." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Polyclinics", description: "Healthcare sector where multi-specialty hospitals and specialist doctors need high-converting local patient lead campaigns." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center of UP where competitive exam coaching institutes require high-volume student admission leads." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Academies & Consultancies", description: "Corporate neighborhood where academies and financial planners seek performance marketing and social media campaigns." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Densely populated student and retail area requiring hyper-local Instagram & WhatsApp marketing campaigns." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Wholesale commercial district where traders require B2B buyer lead generation and Google Shopping Ads." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Manufacturing hub of Allahabad where factories require B2B LinkedIn Ads, Google Search Ads, and industrial branding." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Sector", description: "Rapidly expanding township area where real estate builders require Facebook & Instagram property lead generation." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing colleges and manufacturing plants seeking digital marketing strategies." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Finance Hub", description: "Upscale mixed district where private clinics and wealth management firms seek high-ROI Google Search Ads." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Pilgrimage tourism hub where hotels and boat tour operators require targeted festival seasonal campaigns." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing residential suburb where fitness centers and local merchants need high-ROI Facebook lead campaigns." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "google-ads-ppc",
    title: "Google Ads (PPC) Management Prayagraj",
    shortDesc: "High-ROI Google Search, Display, Shopping, and YouTube Ads capturing immediate ready-to-buy customer intent.",
    fullDesc: "Capture instant high-intent leads in Prayagraj. We engineer targeted Google Search campaigns, Google Shopping Ads for e-commerce, YouTube video ads, and remarketing banners with 100% conversion tracking.",
    iconName: "Search",
    tag: "High-Intent Leads"
  },
  {
    id: "meta-ads-facebook-instagram",
    title: "Meta Ads (Facebook & Instagram Ads) Prayagraj",
    shortDesc: "Targeted Facebook & Instagram lead generation and D2C sales campaigns with high-converting video creatives.",
    fullDesc: "Reach thousands of targeted local customers across Prayagraj. We design thumb-stopping ad creatives, engineer instant lead forms, build custom lookalike audiences, and optimize cost-per-lead (CPL) daily.",
    iconName: "Share2",
    tag: "Social Growth"
  },
  {
    id: "performance-marketing",
    title: "Data-Driven Performance Marketing",
    shortDesc: "ROI-focused multi-channel ad campaigns optimizing Cost Per Acquisition (CPA) & Return On Ad Spend (ROAS).",
    fullDesc: "Every rupee spent must drive measurable revenue. We combine Google Ads, Meta Ads, and retargeting pixel tracking to maximize Return on Ad Spend (ROAS) for Prayagraj businesses and D2C brands.",
    iconName: "TrendingUp",
    tag: "Max ROAS ROI"
  },
  {
    id: "coaching-lead-generation",
    title: "Coaching Institute Lead Generation Katra",
    shortDesc: "Targeted student enrollment campaigns for IAS, NEET, JEE, and State PSC coaching centers in Katra.",
    fullDesc: "Prayagraj is the educational preparation capital of UP. We run high-converting Meta Lead Ads, Google Search Ads, and WhatsApp auto-responder campaigns that generate thousands of verified student admission inquiries.",
    iconName: "GraduationCap",
    tag: "EdTech Leads"
  },
  {
    id: "hospital-doctor-marketing",
    title: "Hospital & Doctor Patient Lead Marketing",
    shortDesc: "Local healthcare marketing generating steady OPD patient appointments for George Town clinics.",
    fullDesc: "Designed for multi-specialty hospitals and clinics in George Town and Ashok Nagar. Features Google Local Services Ads, call-only mobile ads, doctor personal branding, and patient review management.",
    iconName: "Stethoscope",
    tag: "Patient Leads"
  },
  {
    id: "realestate-lead-generation",
    title: "Real Estate Property Lead Campaigns Civil Lines",
    shortDesc: "High-intent buyer lead generation for property builders & plot developers in Civil Lines & Jhalwa.",
    fullDesc: "Generate qualified buyer inquiries for residential flats and commercial land projects. Includes targeted Facebook lead forms, Google Search Ads for property keywords, interactive WhatsApp virtual tour bots, and CRM lead routing.",
    iconName: "Home",
    tag: "Property Leads"
  },
  {
    id: "social-media-marketing-smm",
    title: "Social Media Marketing (SMM) & Branding",
    shortDesc: "Organic Instagram reels, Facebook content, graphic design, and brand engagement management.",
    fullDesc: "Build an active social media community in Prayagraj. Our creative team produces high-engagement Instagram reels, carousel graphics, brand storytelling posts, and manages community comments daily.",
    iconName: "Megaphone",
    tag: "Organic Branding"
  },
  {
    id: "search-engine-optimization-seo",
    title: "Local SEO & Google Business Profile Optimization",
    shortDesc: "Rank in the Google Maps 3-Pack and capture top organic search positions across Prayagraj.",
    fullDesc: "Dominate local searches. We optimize your Google Business Profile (GMB), build local citations across UP business directories, generate authentic Google reviews, and optimize website local landing pages.",
    iconName: "Globe",
    tag: "Map 3-Pack Rank"
  },
  {
    id: "whatsapp-email-automation",
    title: "WhatsApp & Email Marketing Automation",
    shortDesc: "Automated WhatsApp API broadcast messaging, lead nurturing drips, and promotional broadcasts.",
    fullDesc: "Re-engage prospects instantly. We set up official WhatsApp Business API broadcast campaigns, abandoned cart recovery messages, automated welcome email sequences, and customer retention workflows.",
    iconName: "MessageSquare",
    tag: "WhatsApp Bot"
  },
  {
    id: "youtube-video-marketing",
    title: "YouTube Video Marketing & Channel SEO",
    shortDesc: "YouTube video production, channel SEO optimization, and targeted in-stream video ad campaigns.",
    fullDesc: "Video is the most powerful medium for trust. We optimize YouTube video titles, descriptions, and tags for search, while running targeted YouTube non-skippable and discovery ads for Prayagraj audiences.",
    iconName: "Video",
    tag: "YouTube Ads"
  },
  {
    id: "cro-landing-page-optimization",
    title: "Conversion Rate Optimization (CRO)",
    shortDesc: "A/B testing, heatmap analysis, and landing page UX optimization to double conversion rates.",
    fullDesc: "Turn existing website traffic into paying customers. We analyze user click heatmaps, eliminate form friction, write compelling direct-response sales copy, and optimize CTA placement for maximum conversion.",
    iconName: "Zap",
    tag: "High Conversion"
  },
  {
    id: "marketing-analytics-reporting",
    title: "GA4, GTM & Custom BI Marketing Dashboards",
    shortDesc: "Google Analytics 4 event tracking, GTM tag setup, and transparent weekly ROI performance reports.",
    fullDesc: "Gain 100% visibility into your ad spend. We configure Google Tag Manager (GTM), GA4 eCommerce conversion events, Meta Pixel server-side CAPI tracking, and deliver real-time visual client ROI dashboards.",
    iconName: "BarChart3",
    tag: "100% Tracking"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Local Business Growth Package",
    price: "₹14,999 / mo",
    popular: false,
    description: "Ideal for local shops, clinics, advocates, and new startups in Prayagraj building digital leads.",
    features: [
      "Google Business Profile (GMB) & Local SEO Optimization",
      "Meta Ads Management (Facebook & Instagram Lead Ads)",
      "Up to 12 Custom Social Media Creatives & Reels per Month",
      "Targeted Local Audience Setup (5-10 km Radius)",
      "WhatsApp Lead Alert Notifications Setup",
      "Monthly Conversion & Lead Audit Reports",
      "Dedicated Digital Campaign Manager"
    ]
  },
  {
    name: "Performance Lead Gen Package",
    price: "₹29,999 / mo",
    popular: true,
    description: "Best for coaching institutes, schools, hospitals, real estate builders, and growing SMBs.",
    features: [
      "Complete Google Ads (Search & Display) + Meta Ads Campaign Setup",
      "High-Converting Landing Page Design & CRO Optimization",
      "Official WhatsApp Business API Automation & Broadcast Setup",
      "Google Tag Manager & GA4 Conversion Event Tracking",
      "A/B Creative Split Testing (Graphics & Direct Response Copy)",
      "Weekly Ad Performance Tuning & ROAS Optimization",
      "Dedicated Senior Growth Strategist SLA"
    ]
  },
  {
    name: "Enterprise Multi-Channel Suite",
    price: "₹59,999+ / mo",
    popular: false,
    description: "Comprehensive performance marketing strategy for high-volume D2C brands & major institutions.",
    features: [
      "Omnichannel Ads (Google Search/Shopping, Meta, YouTube & LinkedIn)",
      "Full Funnel Performance Marketing Strategy & Media Buying",
      "Server-Side Meta CAPI & Advanced Analytics Tracking",
      "Dedicated Graphic Designer & Video Editor for Weekly Ad Creatives",
      "CRM Lead Auto-Sync & Automated Email Drip Sequences",
      "24/7 Priority Campaign Monitoring & Executive BI Dashboard",
      "Guaranteed Lowest Cost-Per-Lead (CPL) Optimization"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Google Ads & PPC Engine", category: "Search & Display", desc: "Smart Bidding, Performance Max & Search Keyword Campaigns" },
  { name: "Meta Ads Manager", category: "Social Advertising", desc: "Facebook & Instagram Lead Gen, Advantage+ & Lookalike Targeting" },
  { name: "Google Analytics 4 (GA4)", category: "Analytics Engine", desc: "eCommerce Conversion Tracking & Multi-Touch Attribution" },
  { name: "Google Tag Manager (GTM)", category: "Tag Infrastructure", desc: "Server-Side Tracking, Event Triggers & Custom JS Tags" },
  { name: "WhatsApp Business API", category: "Lead Automation", desc: "Automated Chatbots, Broadcasting & Instant Lead Alerts" },
  { name: "Klaviyo & Mailchimp", category: "Email Marketing", desc: "Automated Drip Sequences & Abandoned Cart Recovery" },
  { name: "Semrush & Ahrefs", category: "SEO & Keyword Research", desc: "Competitor Ad Audit & Local Search Intent Analysis" },
  { name: "Canva Pro & Premiere Pro", category: "Ad Creative Suite", desc: "Thumb-Stopping Video Ads & High-Converting Banner Graphics" },
  { name: "Hotjar & Clarity", category: "CRO & Heatmaps", desc: "User Behavior Recording & Landing Page UX Friction Audits" },
  { name: "Looker Studio", category: "BI Reporting", desc: "Real-Time Transparent Client Campaign ROI Dashboards" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "40+ Institutes Scaling Leads", description: "Generating thousands of verified student admission leads for IAS, NEET, and JEE coaching academies in Katra." },
  { name: "Hospitals & Diagnostic Clinics", location: "George Town, Ashok Nagar", count: "28+ Healthcare Clients", description: "Helping multi-specialty hospitals and clinics in George Town generate steady OPD doctor appointment inquiries." },
  { name: "Real Estate Builders & Developers", location: "Civil Lines, Jhalwa", count: "22+ Property Projects Sold", description: "Driving high-intent buyer inquiries for residential flats, commercial plots, and townships in Civil Lines." },
  { name: "Fashion & Retail Merchants", location: "Chowk, Katra, Lukerganj", count: "45+ Retail & D2C Stores", description: "Scaling online saree, handloom, and retail store sales through high-ROAS Meta and Google Shopping Ads." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi Sector", count: "18+ Academic Institutions", description: "Running annual admission marketing campaigns for CBSE, ICSE, and private degree colleges in Prayagraj." },
  { name: "Manufacturing & Industrial Plants", location: "Naini Industrial Area", count: "15+ B2B Manufacturers", description: "Generating B2B buyer leads nationwide for industrial equipment manufacturers in Naini via Google Search Ads." },
  { name: "Law Firms & CA Practices", location: "High Court, Civil Lines", count: "12+ Professional Services", description: "Positioning advocates and chartered accountants near High Court as top industry authorities." },
  { name: "Hotels & Tourism Agencies", location: "Daraganj, Sangam Area", count: "20+ Hospitality Brands", description: "Driving hotel room bookings and boat tour reservations during Mahakumbh and Magh Mela festival seasons." }
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    title: "Katra IAS Academy Lead Campaign",
    category: "Coaching Student Lead Generation",
    metric: "4,500+ Qualified Student Leads & ₹8.50 CPL",
    desc: "Executed targeted Meta Lead Ads and Google Search campaigns for a leading competitive exam institute in Katra, generating thousands of verified student admission inquiries.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio1.webp"
  },
  {
    title: "George Town Polyclinic Patient Campaign",
    category: "Healthcare Local Patient Ads",
    metric: "320+ Monthly OPD Patient Appointments",
    desc: "Managed Google Call Ads and Local SEO for a multi-specialty hospital in George Town, filling doctor schedules with high-intent local patients.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio2.webp"
  },
  {
    title: "Civil Lines Luxury Heights Property Launch",
    category: "Real Estate Buyer Lead Ads",
    metric: "₹12 Cr Property Sales Generated",
    desc: "Ran high-converting Facebook lead ads and Google Search campaigns for a premier real estate builder in Civil Lines, generating qualified buyer inquiries.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio3.webp"
  },
  {
    title: "Chowk Handlooms D2C E-Commerce Ads",
    category: "Performance Marketing & ROAS",
    metric: "5.4x ROAS & ₹22 Lakhs Monthly Sales",
    desc: "Scaled an authentic saree brand in Chowk across India using Meta Advantage+ shopping campaigns, Google Shopping Ads, and retargeting pixel tracking.",
    imageUrl: "https://res.cloudinary.com/codelura/image/upload/v1/codelura/portfolio4.webp"
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Codelura is the best digital marketing company in Prayagraj! Their Google & Meta Ads campaigns for our Katra coaching institute generated over 4,000 verified student leads in just 60 days. Our admissions doubled!",
    author: "Rakesh Nath Pandey",
    role: "Managing Director",
    company: "Pandey IAS & State PSC Academy",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We hired Codelura for our real estate project in Civil Lines. Their Facebook lead ads and Google Search campaigns delivered high-intent buyers. We sold out Phase-1 flats 3 months ahead of schedule!",
    author: "Vishal Agarwal",
    role: "CEO",
    company: "Agarwal Enclave & Housing",
    location: "Civil Lines, Allahabad",
    rating: 5
  },
  {
    quote: "Our polyclinic in George Town saw a 200% surge in monthly patient appointments after partnering with Codelura for Google Local Ads and GMB optimization. Transparent weekly reporting and incredible ROI!",
    author: "Dr. Sunita Keshari",
    role: "Chief Medical Officer",
    company: "Keshari Care Hospital",
    location: "George Town, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top digital marketing company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading digital marketing agency in Prayagraj because we focus strictly on measurable ROI, lower Cost-Per-Lead (CPL), and higher Return On Ad Spend (ROAS). Unlike generic agencies that focus only on vanity metrics like impressions, we engineer data-driven Google Ads, Meta Ads (Facebook & Instagram), Local SEO, WhatsApp automation, and high-converting landing pages tailored for Prayagraj businesses."
  },
  {
    question: "How much do digital marketing services cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, digital marketing packages in Prayagraj start at ₹14,999 per month for Local Business Growth plans (GMB SEO, Meta Ads, and social media branding). Performance Lead Generation packages (for coaching institutes, hospitals, and real estate builders) range between ₹29,999 to ₹45,000 per month, while enterprise multi-channel suites start at ₹59,999 per month. All ad spend is 100% transparent."
  },
  {
    question: "How fast can digital marketing campaigns generate leads for my business?",
    answer: "Pay-Per-Click (PPC) channels like Google Search Ads and Meta Lead Ads start generating verified customer leads within 24 to 48 hours of campaign launch. Search Engine Optimization (SEO) and organic social media growth build compounding long-term search dominance over 60 to 90 days."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh need specialized digital marketing?",
    answer: "Katra is UP’s coaching capital. Competitive exam institutes face intense competition for student enrollments. Our digital marketing strategies combine targeted Meta Lead Ads, Google Search Ads for competitive exam keywords, and instant WhatsApp auto-responders that capture student leads before competitors."
  },
  {
    question: "How do you help real estate developers in Civil Lines and Jhalwa sell properties?",
    answer: "We engineer targeted real estate lead generation campaigns. We target high-net-worth individuals (HNIs) across Uttar Pradesh using Facebook & Instagram Video Ads, Google Search Ads for property keywords, interactive WhatsApp virtual tour bots, and automated CRM lead distribution."
  },
  {
    question: "Can Codelura generate patient appointments for clinics in George Town?",
    answer: "Yes! We run specialized healthcare marketing campaigns for polyclinics, hospitals, and specialist doctors in George Town and Ashok Nagar. Includes Google Call-Only Ads, Local Search Ads, GMB map optimization, and authentic Google review management."
  },
  {
    question: "What is the difference between Google Ads and Facebook/Instagram (Meta) Ads?",
    answer: "Google Ads captures high-intent customers who are actively searching for your service (e.g. 'best hospital in George Town' or 'coaching in Katra'). Meta Ads (Facebook & Instagram) pushes visual banner and video ads to targeted demographic audiences based on interests, location, and behavior, creating new demand."
  },
  {
    question: "Do you provide transparent daily and weekly ROI reports?",
    answer: "100%! We provide live Google Looker Studio visual dashboards detailing total ad spend, cost-per-click (CPC), cost-per-lead (CPL), total conversion count, and ROAS. You get 100% transparent access to your own ad accounts."
  },
  {
    question: "What is WhatsApp Marketing Automation and how does it help local businesses?",
    answer: "WhatsApp has a 98% open rate in India. We connect the official WhatsApp Business API to automatically send instant welcome brochures when a user fills a lead form, dispatch automated appointment reminders, and broadcast promotional messages to your customer list."
  },
  {
    question: "Can you help our local store rank #1 on Google Maps in Prayagraj?",
    answer: "Yes! Our Local SEO team optimizes your Google Business Profile (GMB), manages local business citations across UP directories, optimizes location-based keywords on your website, and generates authentic customer reviews to secure a spot in the Google Maps 3-Pack."
  },
  {
    question: "Do you design ad creatives, graphics, and video reels in-house?",
    answer: "Yes, our dedicated creative team includes graphic designers and video editors who produce thumb-stopping ad banners, direct-response copy, animated graphics, and engaging Instagram reels tailored for Prayagraj audiences."
  },
  {
    question: "What is Conversion Rate Optimization (CRO) and why is it essential?",
    answer: "CRO ensures that more of your ad clicks turn into paying customers. We optimize landing page design, speed up page loads, simplify lead forms, add trust badges, and refine call-to-action (CTA) buttons so you get more leads without increasing your ad budget."
  },
  {
    question: "How do you track ad performance and prevent wasted ad spend?",
    answer: "We configure Google Tag Manager (GTM), GA4 eCommerce event tracking, and Meta Server-Side Conversion API (CAPI). This ensures 100% accurate conversion attribution, eliminating ad fraud and wasted budget on non-converting keywords."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for Digital Marketing?",
    answer: "We serve businesses across all major localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do we get started with Codelura for digital marketing in Prayagraj?",
    answer: "Getting started is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or submit our online inquiry form. Our Prayagraj growth team will conduct a free digital audit, competitor analysis, and custom marketing proposal."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
  { title: "Software Development Prayagraj", href: "/locations/prayagraj/software-development" },
  { title: "WordPress Development Prayagraj", href: "/locations/prayagraj/wordpress-development" },
  { title: "Shopify Development Prayagraj", href: "/locations/prayagraj/shopify-development" },
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
