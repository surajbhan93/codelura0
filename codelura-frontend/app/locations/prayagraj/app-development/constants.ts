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
  { name: "Civil Lines", zipCode: "211001", landmark: "Subhash Chouraha & High Court", description: "Central commercial district where corporate firms, real estate agencies, and retail brands require enterprise mobile applications." },
  { name: "George Town", zipCode: "211002", landmark: "Medical Hub & Polyclinics", description: "Healthcare sector where multi-specialty hospitals and clinics require patient doctor appointment booking apps." },
  { name: "Katra", zipCode: "211002", landmark: "University & Coaching Center Hub", description: "Educational center where competitive exam coaching institutes require online student learning and live test series mobile apps." },
  { name: "Tagore Town", zipCode: "211002", landmark: "Professional Academies Sector", description: "Hub of professional academies and consultancies seeking custom iOS and Android business applications." },
  { name: "Allahpur", zipCode: "211006", landmark: "Matiyara Road Commercial Zone", description: "Dense student district where hyper-local delivery apps and student food ordering platforms thrive." },
  { name: "Lukerganj", zipCode: "211001", landmark: "GT Road Retail & Logistics Area", description: "Wholesale retail hub where merchants require inventory tracking, B2B order booking, and mobile CRM apps." },
  { name: "Naini", zipCode: "211008", landmark: "Naini Industrial Area & SHUATS", description: "Major industrial sector where factories and manufacturing units require mobile workforce and logistics management apps." },
  { name: "Jhunsi", zipCode: "211019", landmark: "Shastri Bridge & Residential Hub", description: "Rapidly expanding township area where real estate apps and local service booking mobile platforms operate." },
  { name: "Phaphamau", zipCode: "211013", landmark: "Ganga Bridge & Industrial Zone", description: "Northern entry corridor housing manufacturing factories and educational institutions seeking mobile solutions." },
  { name: "Ashok Nagar", zipCode: "211001", landmark: "Corporate & Clinic Zone", description: "Upscale mixed district with specialist medical centers and finance firms requiring custom mobile apps." },
  { name: "Daraganj", zipCode: "211006", landmark: "Sacred Sangam Ghats", description: "Pilgrimage and cultural hub where hotel booking, tour guide, and Sangam tourism apps serve nationwide tourists." },
  { name: "Rajrooppur", zipCode: "211011", landmark: "Kalindipuram Residential Area", description: "Growing residential district where fitness gyms, retail outlets, and private clinics need customer mobile loyalty apps." }
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "android-app-development",
    title: "Android App Development Prayagraj",
    shortDesc: "Custom native Android applications built with Kotlin and Jetpack Compose for maximum performance.",
    fullDesc: "We engineer high-performance native Android apps optimized for smartphones, tablets, and Android TVs. Our Android apps feature smooth UI/UX, offline offline-first caching, biometrics, push notifications, and Google Play Store Publishing.",
    iconName: "Smartphone",
    tag: "Native Android"
  },
  {
    id: "ios-app-development",
    title: "iOS App Development Prayagraj",
    shortDesc: "Native iPhone and iPad mobile applications developed using Swift and SwiftUI.",
    fullDesc: "Deliver premium iOS experiences to Apple device users in Prayagraj. We build sleek, secure, and intuitive iOS apps adhering to Apple Human Interface Guidelines and Apple App Store Review Standards.",
    iconName: "Apple",
    tag: "Native iOS"
  },
  {
    id: "flutter-app-development",
    title: "Flutter Cross-Platform App Development",
    shortDesc: "Single-codebase mobile apps for Android and iOS using Google Flutter and Dart framework.",
    fullDesc: "Reduce development costs and launch time by up to 50% with Google Flutter. We build native-like 60fps cross-platform mobile apps with rich custom widgets, seamless API integration, and near-native performance.",
    iconName: "Zap",
    tag: "Flutter 60fps"
  },
  {
    id: "react-native-development",
    title: "React Native Mobile App Development",
    shortDesc: "High-speed cross-platform mobile apps for iOS and Android powered by React Native and TypeScript.",
    fullDesc: "Leverage the power of React 19 on mobile. We build cross-platform mobile applications with shared JavaScript/TypeScript logic, fast hot-reloading, native module bridges, and scalable app architectures.",
    iconName: "Code",
    tag: "React Native"
  },
  {
    id: "custom-business-apps",
    title: "Custom Business & SaaS Mobile Apps",
    shortDesc: "Bespoke mobile tools, CRM portals, and service booking apps tailored to Prayagraj SMBs.",
    fullDesc: "Transform your business operations with custom mobile apps. We build client portals, field staff tracking apps, booking engines, and mobile SaaS products with real-time sync and cloud database backends.",
    iconName: "Building2",
    tag: "Business Automation"
  },
  {
    id: "coaching-learning-apps",
    title: "Coaching & EdTech Mobile Apps Katra",
    shortDesc: "Online student learning apps with live video classes, test series, and PDF downloads.",
    fullDesc: "Prayagraj is UP's coaching hub. We build custom EdTech mobile apps for Katra institutes featuring student video streaming, live mock tests, batch notifications, online fee payments, and study material downloads.",
    iconName: "GraduationCap",
    tag: "EdTech Apps"
  },
  {
    id: "hospital-doctor-apps",
    title: "Healthcare & Doctor Appointment Apps",
    shortDesc: "Patient appointment scheduling, tele-consultation, and electronic health record (EHR) apps.",
    fullDesc: "Engineered for hospitals and clinics in George Town and Ashok Nagar. Features doctor schedule viewing, automated appointment reminders, online fee checkout, tele-health video calls, and lab report downloads.",
    iconName: "Stethoscope",
    tag: "Healthcare Tech"
  },
  {
    id: "realestate-apps",
    title: "Real Estate & Property Listing Mobile Apps",
    shortDesc: "Property showcase apps with interactive site maps, AR virtual tours, and WhatsApp leads.",
    fullDesc: "Empower real estate agents and builders in Civil Lines. Showcase residential apartments, commercial plazas, and plots with GPS map filters, high-res photo carousels, floor plans, and instant agent calls.",
    iconName: "Home",
    tag: "Real Estate Apps"
  },
  {
    id: "ecommerce-delivery-apps",
    title: "E-Commerce & Food Delivery Mobile Apps",
    shortDesc: "Online shopping and delivery apps with Razorpay UPI payment and live order GPS tracking.",
    fullDesc: "Turn your local Prayagraj retail store or restaurant into an online ordering powerhouse. Features mobile product catalogs, shopping cart, UPI checkout, driver GPS tracking, and push notifications.",
    iconName: "ShoppingCart",
    tag: "E-Com & Delivery"
  },
  {
    id: "enterprise-mobile-apps",
    title: "Enterprise Mobile Application Development",
    shortDesc: "Secure, scalable mobile applications built for large corporations and B2B manufacturers.",
    fullDesc: "Designed for industrial units in Naini and corporate houses in Civil Lines. Features multi-role access control, encrypted offline data storage, ERP integration, and high-security cloud API pipelines.",
    iconName: "Globe",
    tag: "Enterprise Apps"
  },
  {
    id: "aso-store-optimization",
    title: "App Store Optimization (ASO) & Play Store Ranking",
    shortDesc: "Maximize mobile app downloads on Google Play Store & Apple App Store with keyword ASO.",
    fullDesc: "Launching an app is only the first step. We optimize app titles, keyword metadata, screenshots, app icons, and review acquisition strategies to drive thousands of organic mobile app downloads.",
    iconName: "Search",
    tag: "ASO Growth"
  },
  {
    id: "app-maintenance-support",
    title: "Mobile App Maintenance & Security Updates",
    shortDesc: "24/7 technical monitoring, OS version updates, security patches, and cloud maintenance.",
    fullDesc: "Keep your mobile app bug-free and compatible with the latest Android 16 & iOS 19 updates. We provide ongoing crash monitoring, cloud database optimization, feature additions, and security patches.",
    iconName: "ShieldCheck",
    tag: "24/7 Support"
  }
];

export const PACKAGES: PackageItem[] = [
  {
    name: "Startup MVP App Package",
    price: "₹24,999",
    popular: false,
    description: "Ideal for startups, local shops, and single clinics needing a fast, high-quality mobile app.",
    features: [
      "Cross-Platform App (Android & iOS via Flutter / React Native)",
      "Up to 8 Custom Designed App Screens",
      "User Authentication & Profile Management",
      "Push Notification & WhatsApp Chat Integration",
      "Basic Admin Panel for Content Updates",
      "Google Play Store App Submission",
      "Free 3 Months App Maintenance & Bug Fixes"
    ]
  },
  {
    name: "Business Growth App Package",
    price: "₹49,999",
    popular: true,
    description: "Best for coaching institutes, schools, hospitals, real estate, and growing Prayagraj SMBs.",
    features: [
      "Full-Featured Android & iOS Native / Cross-Platform App",
      "Up to 20 Custom App Screens & Rich UI Animations",
      "Razorpay, Paytm, Cashfree & UPI Payment Gateway Setup",
      "Live GPS Location Tracking & Map Integration",
      "Advanced Web Admin Dashboard & Analytics",
      "Both Google Play Store & Apple App Store Publishing",
      "App Store Optimization (ASO) for Keyword Downloads",
      "1 Year Cloud Hosting & Technical Support"
    ]
  },
  {
    name: "Enterprise Custom Mobile Suite",
    price: "₹89,999+",
    popular: false,
    description: "Comprehensive mobile platform for e-commerce, EdTech portals, and multi-location enterprises.",
    features: [
      "Unlimited App Screens & Custom Microservices Architecture",
      "High-Scale Real-Time Backend (Node.js / PostgreSQL / Redis)",
      "Offline-First Caching & Enterprise Encryption",
      "Custom Live Video Streaming / Test Series Engines",
      "Automated SMS & WhatsApp Invoice Alerts",
      "Sub-Second Mobile App Performance Engineering",
      "Dedicated Senior Mobile App Developer Team",
      "Priority 24/7 SLA Technical Maintenance"
    ]
  }
];

export const TECHNOLOGIES: TechItem[] = [
  { name: "Flutter & Dart", category: "Cross-Platform", desc: "Google's 60fps Native-Compiled UI Framework" },
  { name: "React Native", category: "Cross-Platform", desc: "Meta's High-Speed Cross-Platform JavaScript Framework" },
  { name: "Kotlin & Jetpack Compose", category: "Native Android", desc: "Modern Type-Safe Native Android Development" },
  { name: "Swift & SwiftUI", category: "Native iOS", desc: "Apple's Official High-Performance iOS Framework" },
  { name: "Node.js & Express", category: "Backend APIs", desc: "Scalable RESTful & GraphQL Microservices APIs" },
  { name: "PostgreSQL & MongoDB", category: "Database Layer", desc: "Secure Real-Time Cloud Data Storage & Caching" },
  { name: "Firebase & AWS Amplify", category: "Cloud Services", desc: "Realtime Database, Authentication & Cloud Messaging" },
  { name: "Razorpay & UPI SDKs", category: "Payments", desc: "Instant Mobile Checkout & Indian Payment Gateways" },
  { name: "Google Maps SDK", category: "Location & GPS", desc: "Real-Time Geolocation Tracking & Navigation" },
  { name: "Docker & Kubernetes", category: "DevOps Cloud", desc: "Scalable Backend Deployment & 99.99% Uptime" }
];

export const INDUSTRIES: IndustryItem[] = [
  { name: "Coaching Institutes & EdTech", location: "Katra, Rambagh, Tagore Town", count: "30+ Mobile Apps Delivered", description: "Enabling Katra IAS and NEET coaching centers to conduct live test series and stream video lectures to 50,000+ students." },
  { name: "Hospitals & Medical Centers", location: "George Town, Ashok Nagar", count: "22+ Medical Apps Built", description: "Helping clinics and multi-specialty hospitals in George Town manage online patient appointment booking and lab reports." },
  { name: "Real Estate & Housing Builders", location: "Civil Lines, Jhalwa", count: "18+ Property Apps Built", description: "Showcasing luxury residential towers and commercial plazas in Civil Lines with interactive floor plans and AR walkthroughs." },
  { name: "Restaurants, Cafes & Food Delivery", location: "Civil Lines, Chowk", count: "25+ Delivery Apps Built", description: "Powering mobile food ordering, QR menus, and delivery boy GPS tracking for Prayagraj restaurants." },
  { name: "Schools & Educational Colleges", location: "Naini, Jhunsi Sector", count: "15+ Campus Apps Built", description: "Building parent-teacher communication portals, fee payment apps, and student attendance tracking." },
  { name: "Manufacturing & Industrial Logistics", location: "Naini Industrial Area", count: "14+ Enterprise Apps Built", description: "Connecting industrial equipment factories in Naini with mobile inventory tracking and field staff management." },
  { name: "Law Firms & High Court Advocates", location: "High Court, Civil Lines", count: "10+ Legal Practice Apps", description: "Providing legal case tracking, client appointment booking, and document repository mobile apps for advocates." },
  { name: "Travel & Sangam Tourism", location: "Daraganj, Sangam", count: "16+ Tourism Apps Built", description: "Serving pilgrims and tourists during Mahakumbh and Magh Mela with hotel booking and Sangam guide apps." }
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
    quote: "Codelura is the #1 mobile app development company in Prayagraj! They built our coaching institute's Android & iOS test series app in record time. Over 30,000 students in Katra use it daily without a single glitch!",
    author: "Ramanuj Pandey",
    role: "Director",
    company: "Pandey IAS Academy, Katra Prayagraj",
    location: "Katra, Prayagraj",
    rating: 5
  },
  {
    quote: "We needed a patient appointment booking app for our clinic in George Town. Codelura delivered a beautiful React Native mobile app with UPI payment integration. Our patient management has become 100% automated!",
    author: "Dr. Sunita Kapoor",
    role: "Chief Medical Officer",
    company: "Kapoor Health & Diagnostic Center",
    location: "George Town, Allahabad",
    rating: 5
  },
  {
    quote: "Our real estate project app in Civil Lines exceeded expectations. The high-resolution property showcase and instant WhatsApp inquiry feature helped us close property deals fast. Exceptional work by Codelura!",
    author: "Harshvardhan Singh",
    role: "Managing Director",
    company: "Singh Builders & Infratech",
    location: "Civil Lines, Prayagraj",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why is Codelura recognised as the best app development company in Prayagraj (Allahabad)?",
    answer: "Codelura is recognized as the top mobile app development agency in Prayagraj because we engineer native and cross-platform mobile apps (Android, iOS, Flutter, React Native) with zero compromise on speed, UI/UX, or security. We build custom EdTech apps for Katra coaching centers, medical apps for George Town hospitals, and enterprise apps for Civil Lines corporate houses."
  },
  {
    question: "How much does mobile app development cost in Prayagraj (Allahabad)?",
    answer: "At Codelura, our transparent app development packages start at ₹24,999 for basic Startup MVP mobile apps. Mid-sized business apps (for coaching institutes, clinics, real estate, restaurants) range between ₹49,999 to ₹75,000, while complex enterprise platforms and e-commerce delivery mobile suites start at ₹89,999. Every quote is fully itemized with zero hidden costs."
  },
  {
    question: "How long does it take to develop and launch a mobile app in Prayagraj?",
    answer: "Standard MVP mobile apps and business tools are completed within 2 to 3 weeks. Feature-rich cross-platform mobile apps for coaching institutes or healthcare providers require 4 to 8 weeks depending on backend API integrations, custom UI/UX requirements, and store publishing approval timelines."
  },
  {
    question: "Do you develop mobile apps for both Android and iOS (Apple iPhone)?",
    answer: "Yes! We specialize in cross-platform mobile development using Google Flutter and React Native, allowing you to launch high-performance mobile apps on both Google Play Store (Android) and Apple App Store (iOS) using a single, cost-effective codebase."
  },
  {
    question: "Why do coaching institutes in Katra and Rambagh need custom mobile app development?",
    answer: "Prayagraj is the educational hub of UP. Coaching centers in Katra, Rambagh, and Tagore Town require custom mobile apps to offer online student registration, live test series, video lecture streaming, downloadable PDF notes, and push notifications to retain and attract thousands of students."
  },
  {
    question: "Will Codelura handle publishing our mobile app on Google Play Store and Apple App Store?",
    answer: "Yes! All our mobile app development packages include complete end-to-end publishing support. We prepare app icons, store screenshots, privacy policy links, App Store Optimization (ASO) metadata, and handle app submission to pass Google Play Console and Apple Developer guidelines."
  },
  {
    question: "Can Codelura integrate UPI payment gateways (GPay, PhonePe, Paytm) into our mobile app?",
    answer: "Absolutely. We seamlessly integrate leading Indian payment gateways (Razorpay, Paytm, Cashfree, PhonePe) to enable instant 1-click UPI payments, credit card, debit card, and net banking checkout within your mobile app."
  },
  {
    question: "What technology stack do you use for mobile app development in 2026?",
    answer: "We leverage Flutter & Dart, React Native & TypeScript, Kotlin & Jetpack Compose (Native Android), and Swift & SwiftUI (Native iOS) on the frontend. On the backend, we use Node.js, Express, PostgreSQL, MongoDB, Firebase, and AWS Cloud infrastructure."
  },
  {
    question: "Do you build custom mobile apps for healthcare clinics in George Town & Ashok Nagar?",
    answer: "Yes, we build custom healthcare mobile apps featuring real-time doctor schedule visibility, automated patient appointment bookings, emergency click-to-call buttons, tele-consultation video links, and diagnostic report download portals."
  },
  {
    question: "What is App Store Optimization (ASO) and why is it included?",
    answer: "ASO is search engine optimization for app stores. By optimizing your app title, keyword tags, description, and visual assets, ASO ensures your app ranks at the top of Google Play Store and Apple App Store when users search for keywords related to your business in Prayagraj."
  },
  {
    question: "Do you provide post-launch app maintenance and technical support in Prayagraj?",
    answer: "Yes! Codelura provides ongoing app support, including 24/7 technical monitoring, Android 16 & iOS 19 OS version updates, cloud database backups, security vulnerability patching, and feature expansions."
  },
  {
    question: "Can you convert our existing website into a native mobile app?",
    answer: "Yes! We can convert your existing business website, e-commerce store, or web portal into a fast, feature-rich Android and iOS mobile app enriched with native push notifications, offline caching, and biometric login."
  },
  {
    question: "How do you ensure data security and privacy in mobile applications?",
    answer: "We enforce enterprise-grade security protocols, including SSL/TLS API encryption, OAuth 2.0 authentication, biometric logins (FaceID/Fingerprint), database sanitization, and compliance with Indian digital data privacy regulations."
  },
  {
    question: "What nearby areas in Prayagraj do you cover for App Development?",
    answer: "We serve businesses across all major localities of Prayagraj (Allahabad), including Civil Lines, George Town, Katra, Tagore Town, Allahpur, Lukerganj, Naini Industrial Area, Jhunsi, Phaphamau, Ashok Nagar, Daraganj, and Rajrooppur."
  },
  {
    question: "How do we start a mobile app development project with Codelura in Prayagraj?",
    answer: "Getting started is effortless! Simply call us at +91 98765 43210, send a message on WhatsApp, or fill out our online contact form. Our Prayagraj mobile app engineering team will provide a free consultation, UI/UX wireframe demo, and project estimate."
  }
];

export const INTERNAL_LINKS = [
  { title: "Website Development Prayagraj", href: "/locations/prayagraj/website-development" },
  { title: "SEO Services Prayagraj", href: "/locations/prayagraj/seo-services" },
  { title: "All Services", href: "/services" },
  { title: "App Development", href: "/services/app-development" },
  { title: "Software Development", href: "/services/software-development" },
  { title: "UI / UX Design", href: "/services/ui-ux" },
  { title: "AI Development", href: "/services/ai-development" },
  { title: "Our Portfolio", href: "/portfolio" },
  { title: "Tech Blogs", href: "/blogs" },
  { title: "Contact Us", href: "/contact" }
];
