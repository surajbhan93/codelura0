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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central corporate sector where financial consultancies, corporate firms, and real estate developers require custom CRM & ERP software." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Polyclinics", description: "Healthcare sector where multi-specialty hospitals and diagnostic labs require custom Hospital Management Software (HMS)." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center where large competitive exam institutes require custom School & Institute ERP portals." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Services & Academies", description: "Sector of chartered accountancy practices and corporate consultancies seeking custom billing and HRMS software." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Dense commercial area where retail outlets and hostel management businesses require automated POS billing software." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Industrial Corridor", description: "Wholesale retail district where traders require inventory management, GST billing, and stock tracking software." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Primary industrial estate of Allahabad where manufacturing factories require B2B ERP, supply chain, and production software." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding urban zone where real estate builders require property management and lead tracking CRM software." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry point housing manufacturing plants and colleges needing custom workflow automation software." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Polyclinic & Corporate Zone", description: "Upscale mixed district with specialist medical centers and finance firms seeking cloud SaaS software." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Tourism & cultural hub where hotels and travel agencies require reservation management and billing software." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram & Transit Sector", description: "Growing residential district where supermarkets and fitness clubs require cloud POS and membership software." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "custom-crm-development",
    title: "Custom CRM Software Development Prayagraj",
    shortDesc: "Bespoke Customer Relationship Management (CRM) software tailored to your sales funnel and lead workflows.",
    fullDesc: "We engineer custom CRM platforms designed specifically for your sales process in Prayagraj. Features automated lead capture from WhatsApp/Website, deal pipeline tracking, sales team performance analytics, and automated SMS/email reminders.",
    iconName: "Users",
    tag: "Sales Automation"
  },
  {
    id: "erp-development",
    title: "Enterprise ERP Software Development Allahabad",
    shortDesc: "Complete Enterprise Resource Planning (ERP) software integrating finance, HR, inventory, and operations.",
    fullDesc: "Streamline multi-department operations with a unified cloud ERP. Built with role-based access security, automated GST invoice generation, real-time inventory tracking, procurement workflows, and executive analytics dashboards.",
    iconName: "Globe",
    tag: "Enterprise ERP"
  },
  {
    id: "saas-development",
    title: "Cloud SaaS Product Development",
    shortDesc: "Scalable Multi-Tenant Software-as-a-Service (SaaS) applications powered by Next.js 15 & Node.js.",
    fullDesc: "Transform your software product idea into a recurring-revenue SaaS platform. We engineer secure multi-tenant cloud architectures, automated subscription billing (Razorpay/Stripe), user onboarding flows, and scalable API pipelines.",
    iconName: "Cpu",
    tag: "Cloud SaaS"
  },
  {
    id: "inventory-pos-software",
    title: "Inventory & POS Billing Software Prayagraj",
    shortDesc: "High-speed retail POS billing and stock management software with barcode scanning and GST compliance.",
    fullDesc: "Designed for retail stores, supermarkets, and wholesalers in Chowk, Katra, and Lukerganj. Features instant barcode scanning, stock level alerts, multi-counter GST billing, supplier management, and daily profit analytics.",
    iconName: "ShoppingCart",
    tag: "Retail & POS"
  },
  {
    id: "hospital-management-software",
    title: "Hospital Management Software (HMS) George Town",
    shortDesc: "Comprehensive HMS for polyclinics, hospitals, and diagnostic labs in George Town & Ashok Nagar.",
    fullDesc: "Digitize hospital operations with an integrated HMS. Features OPD/IPD patient registration, online doctor scheduling, pharmacy inventory, electronic medical records (EMR), diagnostic lab billing, and bed management.",
    iconName: "Stethoscope",
    tag: "Healthcare HMS"
  },
  {
    id: "school-institute-erp",
    title: "School & Coaching Institute ERP Katra",
    shortDesc: "Academic management software for competitive exam coaching institutes in Katra & UP schools.",
    fullDesc: "Prayagraj is the education capital of UP. We engineer custom institute ERP software featuring online student admission, batch timetables, automated fee collection via UPI, attendance tracking, test series grading, and parent WhatsApp alerts.",
    iconName: "GraduationCap",
    tag: "EdTech ERP"
  },
  {
    id: "manufacturing-erp-naini",
    title: "Manufacturing & B2B Industry ERP Naini",
    shortDesc: "Production planning, bill of materials (BOM), and supply chain software for factories in Naini.",
    fullDesc: "Empower manufacturing plants in Naini Industrial Area. Tracks raw material procurement, machinery maintenance schedules, production line batching, quality assurance audits, and finished goods inventory.",
    iconName: "Factory",
    tag: "B2B Manufacturing"
  },
  {
    id: "hrms-payroll-software",
    title: "HRMS & Automated Payroll Software",
    shortDesc: "Human Resource Management System (HRMS) with biometric attendance, PF/ESI, and salary slip generation.",
    fullDesc: "Automate workforce administration. Our HRMS software manages biometric/GPS employee attendance, leave requests, automated salary calculation with PF/ESI deductions, 1-click bank transfer files, and PDF payslips.",
    iconName: "Briefcase",
    tag: "HR & Payroll"
  },
  {
    id: "realestate-crm-software",
    title: "Real Estate Property Management CRM",
    shortDesc: "Lead tracking, plot/apartment booking, and EMI collection software for Prayagraj builders.",
    fullDesc: "Tailored for real estate developers and property brokers in Civil Lines and Jhalwa. Features property inventory maps, buyer inquiry routing, payment installment (EMI) reminders, site visit logs, and commission tracking.",
    iconName: "Home",
    tag: "Real Estate CRM"
  },
  {
    id: "custom-dashboard-analytics",
    title: "Custom Executive Analytics Dashboards",
    shortDesc: "Real-time BI analytics dashboards consolidating data from multiple business tools into visual KPIs.",
    fullDesc: "Make data-driven business decisions. We build custom web dashboards displaying real-time revenue KPIs, sales velocity charts, operational bottlenecks, inventory alerts, and automated PDF executive summary reports.",
    iconName: "BarChart3",
    tag: "BI & Dashboards"
  },
  {
    id: "workflow-automation-software",
    title: "Business Process & Workflow Automation",
    shortDesc: "Eliminate manual data entry and repetitive paperwork with custom software automation scripts.",
    fullDesc: "Streamline daily business tasks. We automate PDF invoice generation, WhatsApp customer notifications, data sync between legacy software and cloud databases, and multi-tier approval workflows.",
    iconName: "Zap",
    tag: "Process Automation"
  },
  {
    id: "custom-api-integration",
    title: "Custom API & Legacy Software Integration",
    shortDesc: "Connect third-party APIs, Tally ERP, payment gateways, and cloud databases seamlessly.",
    fullDesc: "Eliminate data silos in your business. We build secure RESTful and GraphQL API integrations connecting Tally Accounting, Razorpay/Paytm UPI, WhatsApp Business API, CRM software, and cloud databases.",
    iconName: "Code",
    tag: "API Integration"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Business Automation MVP Package",
    price: "₹34,999",
    popular: false,
    description: "Ideal for small local businesses, single clinics, and stores in Prayagraj automating core workflows.",
    features: [
      "Custom Web Application / Internal Tool (Up to 10 Modules)",
      "User Authentication & Role-Based Access Control",
      "GST Compliant Invoice & Billing Generation Module",
      "WhatsApp & Email Automated Alerts Setup",
      "Database Setup (PostgreSQL / MongoDB Cloud)",
      "Responsive Web UI for Desktop, Tablet & Mobile",
      "Free 3 Months Software Maintenance & Support"
    ]
  },
  {
    name: "Enterprise ERP / CRM Package",
    price: "₹74,999",
    popular: true,
    description: "Best for coaching institutes, hospitals, real estate developers, and growing Prayagraj SMBs.",
    features: [
      "Full-Featured Custom ERP, CRM, or Institute Management Software",
      "Up to 25 Custom Operational Modules & Workflows",
      "Razorpay, Paytm & UPI Payment Gateway Integration",
      "Real-Time Executive Analytics Dashboard & KPI Charts",
      "Biometric / GPS Attendance & Inventory Tracking",
      "Tally / Legacy Accounting Data Integration",
      "High-Security Cloud Deployment (AWS / Vercel Edge)",
      "1 Year Dedicated Maintenance SLA & Training"
    ]
  },
  {
    name: "Custom Cloud SaaS Platform",
    price: "₹1,49,999+",
    popular: false,
    description: "Comprehensive multi-tenant cloud software platform for commercial SaaS startups and major enterprises.",
    features: [
      "Unlimited Operational Modules & Custom Microservices",
      "Multi-Tenant Subscription Architecture (SaaS Model)",
      "Stripe / Razorpay Recurring Billing & Plan Management",
      "Advanced BI Analytics & Automated Data Export (PDF/Excel)",
      "Sub-Second Next.js 15 Speed Performance Engineering",
      "Enterprise Encryption, DDoS Protection & Auto Backups",
      "Dedicated Senior Software Engineering Team",
      "Priority 24/7 SLA Support & Custom Feature Additions"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Next.js 15 & React 19", category: "Frontend Core", desc: "App Router, Server Components & Sub-Second Load Speeds" },
  { name: "TypeScript", category: "Code Quality", desc: "100% Type-Safe Codebase Preventing Runtime Errors" },
  { name: "Node.js & Express", category: "Backend Engine", desc: "High-Throughput RESTful APIs & Microservices Architecture" },
  { name: "PostgreSQL & MongoDB", category: "Database Layer", desc: "ACID-Compliant Relational & NoSQL Data Storage" },
  { name: "Tailwind CSS v4", category: "UI System", desc: "Utility-First Glassmorphism & Responsive Dashboard Aesthetics" },
  { name: "Redis & Memcached", category: "Caching Layer", desc: "Sub-Millisecond In-Memory Data Retrieval" },
  { name: "AWS & Vercel Edge", category: "Cloud Hosting", desc: "99.99% Uptime Auto-Scaling Edge Server Network" },
  { name: "Docker & Kubernetes", category: "DevOps & CI/CD", desc: "Containerized Microservices & Automated Deployment Pipelines" },
  { name: "Razorpay & UPI SDKs", category: "Payments API", desc: "Instant GST Invoicing & Indian Payment Gateway Integration" },
  { name: "Tally & WhatsApp APIs", category: "Integrations", desc: "Automated Accounting Data Sync & WhatsApp Bot Messaging" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & Academies", location: "Katra, Rambagh, Tagore Town", count: "35+ ERP Systems Built", description: "Enabling Katra IAS and NEET coaching centers to automate student admissions, fee collections, and online test grading." },
  { name: "Hospitals & Diagnostic Polyclinics", location: "George Town, Ashok Nagar", count: "25+ HMS Systems Built", description: "Helping multi-specialty hospitals in George Town streamline OPD/IPD patient registration, doctor schedules, and EMR records." },
  { name: "Real Estate & Housing Builders", location: "Civil Lines, Jhalwa", count: "20+ CRM Software Systems", description: "Managing property inventories, plot bookings, buyer lead pipelines, and EMI collection schedules for Civil Lines developers." },
  { name: "Retail Stores & Wholesalers", location: "Chowk, Katra, Lukerganj", count: "45+ POS & Inventory Systems", description: "Powering multi-counter barcode billing, stock level tracking, and GST invoicing for retail merchants in Chowk." },
  { name: "Manufacturing & Industrial Factories", location: "Naini Industrial Area", count: "18+ Industry ERP Systems", description: "Connecting industrial equipment plants in Naini with production scheduling, raw material BOM, and workforce software." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi Sector", count: "15+ School ERP Systems", description: "Digitizing student report cards, parent communication apps, bus transport tracking, and fee payment portals." },
  { name: "Law Firms & CA Consultancy", location: "High Court, Civil Lines", count: "12+ Legal & Billing Systems", description: "Providing legal case file repositories, client billable hours tracking, and automated GST invoice software." },
  { name: "Hotels & Travel Tour Agencies", location: "Daraganj, Sangam Area", count: "22+ Booking & Billing Systems", description: "Managing hotel room bookings, boat tour reservations, and tourist billing during Mahakumbh and Magh Mela festivals." }
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
    quote: "Codelura is the best software development company in Prayagraj! They custom-built an institute ERP software for our Katra academy. Managing 15,000+ student fees, attendance, and test series has become 100% automated!",
    author: "Vivek Kumar Dwivedi",
    role: "Managing Director",
    company: "Dwivedi IAS & UPPSC Classes",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We replaced our slow legacy hospital software with Codelura’s custom HMS in George Town. Doctor scheduling, OPD billing, and patient records now load instantly. Outstanding software engineering!",
    author: "Dr. Rajeshwar Nath Kapoor",
    role: "Chief Medical Director",
    company: "Kapoor Memorial Hospital",
    location: "George Town, Allahabad",
    rating: 5
  },
  {
    quote: "Codelura developed a custom real estate CRM software for our Civil Lines property projects. Our sales team tracks every buyer inquiry, site visit, and payment schedule effortlessly. Highly recommended!",
    author: "Abhinav Tandon",
    role: "CEO",
    company: "Tandon Realty & Builders",
    location: "Civil Lines, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the top software development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the leading software engineering company in Prayagraj because we build 100% custom, enterprise-grade software (CRM, ERP, HMS, POS, Cloud SaaS) tailored precisely to your business workflows. Unlike generic off-the-shelf software with monthly per-user licensing fees, we build scalable software utilizing Next.js 15, React 19, TypeScript, and Node.js with zero bloat and maximum data security."
  },
  {
    question: "What is the cost of custom software development in Prayagraj (Allahabad)?",
    answer: "At Codelura, custom software packages in Prayagraj start at ₹34,999 for standard Business Automation MVP modules. Feature-rich custom ERP or CRM systems (for coaching institutes, hospitals, real estate builders, or factories) range between ₹74,999 to ₹1,20,000, while complex multi-tenant cloud SaaS platforms start at ₹1,49,999. Every quote is fully itemized with zero hidden fees."
  },
  {
    question: "How long does it take to build custom software for a business in Prayagraj?",
    answer: "Standard business automation tools and billing/POS software modules are delivered within 2 to 3 weeks. Complex enterprise ERP, hospital management software, or coaching institute portals typically require 4 to 8 weeks depending on customized module requirements, Tally integrations, and user acceptance testing."
  },
  {
    question: "What is the difference between custom software development and off-the-shelf software?",
    answer: "Off-the-shelf software forces your business to adapt to rigid, pre-made features and charges expensive recurring per-user fees. Custom software development by Codelura is built 100% around your unique operational workflows, giving you full ownership, unlimited user scalability, zero recurring per-seat fees, and custom features competitors cannot match."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh need custom institute ERP software?",
    answer: "Prayagraj is the educational hub of UP. Coaching centers managing thousands of students in Katra, Rambagh, and Tagore Town require custom ERP software to automate online student admissions, fee collection via UPI, attendance tracking, automated SMS/WhatsApp alerts, and online test series grading."
  },
  {
    question: "Can Codelura build custom Hospital Management Software (HMS) for George Town clinics?",
    answer: "Yes! We engineer specialized HMS software for hospitals and polyclinics in George Town and Ashok Nagar. Features include OPD/IPD patient registration, electronic medical records (EMR), doctor appointment schedules, pharmacy stock tracking, diagnostic lab report generation, and bed management."
  },
  {
    question: "Do you integrate Tally Accounting, Razorpay UPI, and WhatsApp Business APIs?",
    answer: "Absolutely. We seamlessly connect third-party APIs including Tally ERP for accounting sync, Razorpay/Paytm for instant UPI payments, WhatsApp Business API for automated customer invoices, and biometric hardware for employee attendance."
  },
  {
    question: "What technology stack does Codelura use for custom software development in 2026?",
    answer: "We leverage Next.js 15, React 19, TypeScript, Tailwind CSS v4, Node.js, Express, PostgreSQL, MongoDB, Redis, and Docker microservices hosted on global edge CDN networks like Vercel and AWS for sub-second speeds and 99.99% uptime."
  },
  {
    question: "Can Codelura build custom CRM software for real estate developers in Civil Lines?",
    answer: "Yes, we build customized real estate CRM software for property builders in Civil Lines and Jhalwa. Tracks buyer inquiries, plot availability maps, site visit schedules, payment installment (EMI) reminders, and sales team commissions."
  },
  {
    question: "How do you ensure data security and privacy in custom software applications?",
    answer: "We enforce enterprise-grade security standards, including role-based access control (RBAC), SSL/TLS API encryption, OAuth 2.0 authentication, database sanitization, automated daily cloud backups, and compliance with Indian digital data protection laws."
  },
  {
    question: "Do you provide post-launch software maintenance and technical support in Prayagraj?",
    answer: "Yes! Codelura provides comprehensive post-launch software maintenance, including 24/7 technical support, cloud database backups, server monitoring, security vulnerability patching, and feature additions."
  },
  {
    question: "Can you modernize or replace our existing slow, outdated desktop software?",
    answer: "Yes! We specialize in migrating legacy desktop software (VB6, old Tally/FoxPro setups) to modern, lightning-fast web and cloud software accessible securely from any browser, tablet, or smartphone."
  },
  {
    question: "Will our custom software work smoothly on mobile phones and tablets?",
    answer: "100%. All software systems engineered by Codelura feature responsive web UI design, rendering fluidly across desktop monitors, laptops, iPads, tablets, and mobile smartphones."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for Software Development?",
    answer: "We serve enterprises across all major localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do we start a custom software development project with Codelura in Prayagraj?",
    answer: "Getting started is quick and effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or submit our online inquiry form. Our Prayagraj software engineering team will provide a free consultation, workflow audit, and project quotation."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "App Development Prayagraj", href: "/locations/prayagraj/app-development" },
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
