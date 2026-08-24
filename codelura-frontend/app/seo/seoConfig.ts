// ============================================================
// CODELURA SEO CONFIG — Dynamic Page Data & Types
// Covers: Services, Cities (India & International), Topics, Guidance, Products
// Expanded for Deep Content & Search Engine Indexing
// ============================================================

export type SEOFeature = {
  title: string;
  description: string;
  icon?: string;
};

export type SEOProcessStep = {
  step?: string;
  title: string;
  description: string;
};

export type SEOTechCategory = {
  category: string;
  technologies: string[];
};

export type SEOContentSection = {
  heading: string;
  content: string;
  bullets?: string[];
};

export type SEOPageData = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  category: "service" | "location" | "topic" | "guidance" | "product";
  keywords: string[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  schema: "Service" | "Organization" | "Article" | "FAQPage";
  
  intro?: string;
  overview?: {
    title: string;
    description: string;
  };
  features?: SEOFeature[];
  solutions?: SEOFeature[];
  industries?: SEOFeature[];
  benefits?: SEOFeature[];
  useCases?: SEOFeature[];
  process?: SEOProcessStep[];
  techStack?: SEOTechCategory[];
  contentSections?: SEOContentSection[];
  stats?: {
    value: string;
    label: string;
  }[];
};

// ─── DIGITAL SERVICES ────────────────────────────────────────
const servicePages: SEOPageData[] = [
  {
    slug: "web-development-services",
    title: "Web Development Services",
    metaTitle: "Custom Web Development Services & Engineering Solutions | Codelura",
    metaDescription:
      "Comprehensive web development services by Codelura. Modern web application engineering, Next.js frontends, scalable Node.js/Python backends, e-commerce systems, and API integrations.",
    h1: "Custom Web Development Services & Scalable Engineering",
    heroSubtitle:
      "From high-throughput web applications to enterprise SaaS portals — Codelura builds fast, accessible, secure, and search-engine-optimized web experiences.",
    category: "service",
    keywords: [
      "web development services",
      "custom website development company",
      "hire web developers",
      "web application engineering",
      "nextjs development services",
      "react web application development",
      "full stack web development agency",
      "enterprise saas engineering",
    ],
    faqs: [
      {
        q: "What web development technologies and frameworks does Codelura use?",
        a: "We specialize in modern full-stack JavaScript and TypeScript ecosystems. Our primary stacks include React and Next.js for high-performance frontends, Node.js (Express/Fastify) and Python (FastAPI/Django) for microservice backends, along with PostgreSQL, MongoDB, and Redis for data management.",
      },
      {
        q: "How long does a typical web software development lifecycle take?",
        a: "Timeline depends strictly on functional scope. Standard business web portals typically range from 3 to 5 weeks. Feature-rich Web Applications or SaaS Minimum Viable Products (MVPs) generally take 6 to 12 weeks from initial architectural planning to production deployment.",
      },
      {
        q: "How does Codelura ensure optimal website loading speed and Core Web Vitals?",
        a: "We implement Server-Side Rendering (SSR) and Static Site Generation (SSG) via Next.js, code splitting, dynamic asset compression, automated image optimization (AVIF/WebP), edge CDN distribution, and strict DOM tree optimization to consistently achieve high Lighthouse scores.",
      },
      {
        q: "Does Codelura handle continuous post-launch maintenance and DevOps?",
        a: "Yes. We offer ongoing technical maintenance packages covering cloud infrastructure monitoring (Vercel/AWS), database backup management, security patch updates, framework version upgrades, and feature additions.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "ecommerce-development",
      "one-to-one-guidance",
      "web-development-india",
    ],
    schema: "Service",
    intro:
      "Digital web software must deliver fast load times, effortless user experience, and dependable security. Codelura provides comprehensive full-stack web engineering, managing your product from initial system design and database planning through to production hosting and search engine optimization.",
    overview: {
      title: "Enterprise-Grade Web Application Engineering",
      description:
        "Whether you are launching a customer-facing digital portal, a multi-tenant SaaS application, or a high-concurrency e-commerce engine, our team delivers clean, modular TypeScript codebases engineered for performance and scalability.",
    },
    solutions: [
      {
        title: "Single Page & Server-Rendered Web Applications",
        description:
          "High-performance dynamic web applications built with React and Next.js, combining client-side interactive state with fast server rendering.",
      },
      {
        title: "Multi-Tenant SaaS Platform Development",
        description:
          "Scalable cloud SaaS architectures engineered with secure user authentication, role-based access control, automated billing subscriptions, and tenant data isolation.",
      },
      {
        title: "API Microservices & Backend Architectures",
        description:
          "Robust Node.js and Python microservices providing secure RESTful API endpoints, GraphQL schemas, database ORM integrations, and background job processing queues.",
      },
      {
        title: "Headless CMS & Content Systems",
        description:
          "Decoupled content platforms integrated with Strapi, Sanity, or Payload CMS, giving marketing and operations teams total control over digital assets and page content.",
      },
      {
        title: "Progressive Web Applications (PWAs)",
        description:
          "Web apps featuring service worker caching, offline access capabilities, installability prompts, and mobile-responsive interface controls.",
      },
    ],
    features: [
      {
        title: "Core Web Vitals Optimization",
        description: "Optimized bundle splitting, font preloading, asset compression, and DOM hydration for top-tier Google speed metrics.",
      },
      {
        title: "Responsive & Accessible UI/UX",
        description: "Standard CSS and WCAG-compliant UI components designed for seamless navigation across mobile, tablet, and desktop viewports.",
      },
      {
        title: "Clean TypeScript Codebase",
        description: "Strictly typed codebases preventing runtime errors, enabling modular component reusability, and facilitating long-term maintenance.",
      },
      {
        title: "Robust Security Protocols",
        description: "Implementation of CORS policies, CSRF token validation, rate limiting, SQL injection defense, and automated vulnerability scanning.",
      },
    ],
    industries: [
      { title: "SaaS & Tech Startups", description: "Rapid MVP builds and scalable Web applications ready for venture growth and customer acquisition." },
      { title: "E-Commerce & Digital Retail", description: "High-converting online shopping platforms with fast catalog search and regional payment gateways." },
      { title: "Healthcare & Life Sciences", description: "Patient interaction portals and clinical management web tools built around strict data privacy." },
      { title: "Financial Services & Fintech", description: "Secure customer dashboards, transaction reporting tools, and interactive data visualization interfaces." },
    ],
    benefits: [
      { title: "Higher Organic Search Visibility", description: "Built-in server-side rendering and structured data schemas ensure search engines accurately index your pages." },
      { title: "Lower Infrastructure Overhead", description: "Modern serverless and edge hosting setups reduce ongoing hosting expenses while handling traffic spikes effortlessly." },
      { title: "Faster Time to Market", description: "Reusable component libraries and agile sprint structures accelerate development from kickoff to launch." },
    ],
    process: [
      { step: "01", title: "Discovery & Architecture Planning", description: "Mapping core functional specifications, database schema diagrams, API contracts, and user flow wireframes." },
      { step: "02", title: "Frontend & Backend Sprints", description: "Developing responsive UI components and microservice APIs with bi-weekly client review demonstrations." },
      { step: "03", title: "Automated QA & Security Audit", description: "Executing automated unit tests, integration testing, cross-browser audits, and security vulnerability reviews." },
      { step: "04", title: "Production Deployment & Support", description: "Configuring production hosting environments, CDN caching, SSL certificates, CI/CD pipelines, and telemetry." },
    ],
    techStack: [
      { category: "Frontend", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Vue.js"] },
      { category: "Backend & Database", technologies: ["Node.js", "Express", "Python / FastAPI", "PostgreSQL", "MongoDB", "Redis", "Prisma ORM"] },
      { category: "Cloud & DevOps", technologies: ["Vercel", "AWS", "Docker", "GitHub Actions", "Cloudflare CDN"] },
    ],
    contentSections: [
      {
        heading: "Why Search Engine Optimization & Technical Web Architecture Matter",
        content: "Modern search engines prioritize web applications that load quickly, exhibit stable visual layouts, and provide clean HTML structure. A web application developed with poor technical architecture risks indexation delays and reduced search engine rankings.",
        bullets: [
          "Server-Side Rendering (SSR) delivers fully rendered HTML to Googlebot for immediate content indexing.",
          "Dynamic meta tag generation and canonical URLs prevent duplicate content penalties.",
          "Optimized image loading via modern AVIF and WebP formats ensures instant page loads across low-bandwidth mobile networks.",
        ],
      },
      {
        heading: "Scalable Full-Stack Engineering Principles",
        content: "Our development methodologies rely on decoupled modular architectures. Separating the user interface from core backend logic ensures that your web application can evolve over time without requiring expensive complete codebase rewrites.",
      },
    ],
  },
  {
    slug: "app-development-services",
    title: "Mobile App Development Services",
    metaTitle: "Mobile App Development Services | iOS & Android Apps — Codelura",
    metaDescription:
      "Native and cross-platform mobile application development services by Codelura. Mobile app engineering using React Native, Flutter, Swift, and Kotlin for iOS and Android platforms.",
    h1: "Mobile App Development Services for iOS & Android",
    heroSubtitle:
      "Native device performance combined with cross-platform efficiency. Codelura designs and engineers mobile applications focused on intuitive touch navigation, reliable offline operation, and secure backend integration.",
    category: "service",
    keywords: [
      "mobile app development services",
      "ios app development company",
      "android app development agency",
      "react native mobile development",
      "flutter app development",
      "cross platform app engineering",
      "custom mobile application company",
    ],
    faqs: [
      {
        q: "Should I select cross-platform development (React Native/Flutter) or native development (Swift/Kotlin)?",
        a: "Cross-platform frameworks like React Native and Flutter enable shared codebases between iOS and Android, drastically reducing initial capital expenditure and time to market. Native development (SwiftUI for iOS, Jetpack Compose for Android) is suggested for apps requiring intensive low-level hardware communication, background Bluetooth processing, or heavy graphics rendering.",
      },
      {
        q: "How does Codelura handle App Store and Google Play Store submissions?",
        a: "We manage the complete publishing lifecycle for both Apple App Store and Google Play Store. This includes configuring developer certificates, provisioning profiles, store listing graphics, privacy policy declarations, and addressing review board inquiries.",
      },
      {
        q: "Can mobile applications work without an active internet connection?",
        a: "Yes. We engineer offline-first mobile architectures using local embedded databases (SQLite, WatermelonDB, or Realm) that save user actions locally and synchronize automatically when network connectivity is restored.",
      },
    ],
    relatedSlugs: [
      "clinic-app-development",
      "education-app-development",
      "ecommerce-development",
      "web-development-services",
    ],
    schema: "Service",
    intro:
      "Mobile applications demand intuitive touch interface controls, minimal battery consumption, efficient memory management, and secure data storage. Codelura designs and builds mobile software platforms for consumer startups, operational workflows, and enterprise workforces.",
    solutions: [
      {
        title: "Cross-Platform Mobile Application Development",
        description: "Single-codebase mobile applications targeting both iOS and Android devices using React Native and Flutter for cost-efficient development.",
      },
      {
        title: "Native iOS & Android Application Engineering",
        description: "High-performance native mobile apps developed with Swift/SwiftUI for Apple devices and Kotlin/Jetpack Compose for Android devices.",
      },
      {
        title: "Enterprise Workforce Mobility Apps",
        description: "Internal business mobile apps featuring field worker data collection, offline form completion, barcode scanning, and role-based security permissions.",
      },
      {
        title: "Mobile App Backend & API Integration",
        description: "Scalable mobile backends powered by Node.js or Supabase, offering instant push notifications, authentication, and database synchronization.",
      },
    ],
    features: [
      { title: "Offline Data Synchronization", description: "Local SQLite storage layer ensuring complete mobile app functionality during spotty connection." },
      { title: "Real-Time Push Notifications", description: "Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs) integrations for instant user notifications." },
      { title: "Biometric & Secure Auth", description: "Hardware-level FaceID, TouchID, fingerprint authentication, OAuth2, and encrypted token management." },
    ],
    industries: [
      { title: "Healthcare & Telemedicine", description: "Patient appointment booking apps, digital health monitoring, and secure consultation rooms." },
      { title: "EdTech & Learning Apps", description: "Interactive student learning mobile apps, quiz modules, and offline lesson downloads." },
      { title: "E-Commerce & On-Demand", description: "Mobile shopping apps, product catalogs, live delivery tracking, and digital wallet checkouts." },
    ],
    process: [
      { step: "01", title: "Mobile UI/UX Wireframing", description: "Designing touch gestures, screen navigation flows, interactive prototypes, and design systems." },
      { step: "02", title: "Core Application Development", description: "Building mobile component architectures, state management stores, and REST/GraphQL API connections." },
      { step: "03", title: "Real Device Testing", description: "Testing app binaries across real physical iOS and Android devices with varying screen sizes and OS versions." },
      { step: "04", title: "Store Submission & Launch", description: "Publishing app binaries to Apple App Store and Google Play Store, managing approval checklists." },
    ],
    techStack: [
      { category: "Mobile Frameworks", technologies: ["React Native", "Flutter", "Swift / SwiftUI", "Kotlin / Jetpack Compose"] },
      { category: "Backend Services", technologies: ["Firebase", "Supabase", "Node.js", "GraphQL", "APNs / FCM"] },
      { category: "Local Storage", technologies: ["SQLite", "WatermelonDB", "AsyncStorage", "Realm"] },
    ],
    contentSections: [
      {
        heading: "Key Criteria for High-Performance Mobile Applications",
        content: "Developing a successful mobile app requires balancing user interface responsiveness with memory management. Apps that crash or drain device battery quickly suffer high uninstall rates.",
        bullets: [
          "Efficient image caching and list virtualization ensure smooth 60fps scrolling performance.",
          "Encrypted local data vaults protect sensitive user data on stolen or lost mobile hardware.",
          "Modular state management prevents unnecessary UI re-renders and reduces CPU usage.",
        ],
      },
    ],
  },
  {
    slug: "clinic-app-development",
    title: "Clinic & Healthcare Software Development",
    metaTitle: "Clinic App Development & Healthcare Software Systems | Codelura",
    metaDescription:
      "Custom clinic management software development, patient applications, Electronic Medical Record (EMR) tools, and telemedicine platform engineering by Codelura.",
    h1: "Clinic & Healthcare Application Development",
    heroSubtitle:
      "Modernize clinical operations with digital appointment scheduling, electronic medical records (EMR), patient portals, prescription workflows, and secure consultation platforms.",
    category: "service",
    keywords: [
      "clinic app development",
      "healthcare software engineering",
      "telemedicine app development",
      "patient portal software",
      "EMR software development",
      "doctor appointment app development",
      "hospital management software",
    ],
    faqs: [
      {
        q: "What modules can be included in a custom clinic management application?",
        a: "Modules typically include patient intake forms, doctor schedule management, automated SMS/WhatsApp reminders, electronic medical records (EMR/EHR), digital prescription generators, billing & invoicing workflows, lab test reporting, and WebRTC telemedicine video calls.",
      },
      {
        q: "How does Codelura address healthcare data security and privacy?",
        a: "We engineer healthcare platforms following strict cybersecurity standard practices. All health data is encrypted at rest using AES-256 and in transit via TLS 1.3. We implement Granular Role-Based Access Control (RBAC), multi-factor authentication, and immutable audit logs.",
      },
      {
        q: "Can existing laboratory or diagnostic software be integrated into the clinic application?",
        a: "Yes. We build custom API connectors and data translation layers to integrate with external diagnostic lab systems, pharmacy inventory software, and medical devices.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "web-development-services",
      "one-to-one-guidance",
    ],
    schema: "Service",
    intro:
      "Medical facilities, specialty clinics, and healthcare practices require digital management systems that simplify patient administration while safeguarding health records. Codelura engineers custom clinical software adapted to your exact operational workflows.",
    overview: {
      title: "Digital Clinical Operations & Patient Management Systems",
      description:
        "From individual medical clinics to multi-branch healthcare networks, our clinical applications eliminate paper forms, reduce appointment no-shows, streamline medical charting, and enable remote patient consultation.",
    },
    solutions: [
      {
        title: "Electronic Medical Records (EMR) & Charting Systems",
        description: "Centralized digital chart management, clinical note taking, diagnostic attachment uploads, treatment history tracking, and ICD-coded diagnostic logging.",
      },
      {
        title: "Patient Self-Service Mobile Apps & Portals",
        description: "Intuitive patient applications for online appointment booking, digital check-in, medical history submission, prescription access, and bill payment.",
      },
      {
        title: "Telemedicine Video Consultation Rooms",
        description: "Encrypted WebRTC video calling rooms integrated with live doctor note taking, screen sharing, and automated digital prescription generation.",
      },
      {
        title: "Clinic Administrative & Billing Dashboards",
        description: "Staff shift scheduling, inventory tracking for pharmaceuticals and supplies, invoice generation, and financial revenue analytics dashboards.",
      },
    ],
    features: [
      { title: "Encrypted Data Vaults", description: "Database fields containing personal health information encrypted according to cybersecurity standards." },
      { title: "Role-Based Permissions", description: "Granular access restrictions ensuring doctors, nurses, receptionists, and accountants view only permitted data." },
      { title: "Automated Patient Notifications", description: "Automated SMS, email, and push notifications for appointment confirmations, queue updates, and medication schedules." },
    ],
    industries: [
      { title: "Dental & Orthodontic Clinics", description: "Specialized dental charting, appointment recall alerts, and treatment plan billing modules." },
      { title: "Polyclinics & Multi-Specialty Networks", description: "Multi-branch patient record synchronization, doctor schedule coordination, and centralized revenue control." },
      { title: "Mental Health & Counseling", description: "Private consultation booking, session notes encryption, and automated recurring appointment billing." },
    ],
    process: [
      { step: "01", title: "Clinical Workflow Discovery", description: "Analyzing patient registration flows, consultation steps, lab ordering practices, and billing workflows." },
      { step: "02", title: "Architecture & Security Blueprint", description: "Designing database structures, encryption key hierarchies, user roles, and compliance requirements." },
      { step: "03", title: "Module Engineering & Testing", description: "Developing appointment engine, EMR dashboard, prescription builder, and WebRTC video integration." },
      { step: "04", title: "Deployment & Staff Onboarding", description: "Deploying application to secure cloud servers, conducting data migration, and providing staff training manuals." },
    ],
    techStack: [
      { category: "Frontend & Mobile", technologies: ["Next.js", "React Native", "TypeScript", "Tailwind CSS"] },
      { category: "Backend Infrastructure", technologies: ["Node.js", "PostgreSQL", "Redis", "WebRTC", "Docker"] },
      { category: "Security & Storage", technologies: ["AES-256 Encryption", "AWS KMS", "S3 Encrypted Buckets"] },
    ],
    contentSections: [
      {
        heading: "Essential Features of Modern Clinic Management Software",
        content: "Transitioning a medical clinic from manual paperwork to a unified software platform dramatically improves administrative throughput and patient satisfaction.",
        bullets: [
          "Digital Appointment Scheduling eliminates double bookings and streamlines doctor daily calendars.",
          "Electronic Prescriptions allow doctors to compile and sign prescriptions digitally in seconds.",
          "Centralized Billing tracking ensures all consultation fees and lab orders are accounted for accurately.",
        ],
      },
    ],
  },
  {
    slug: "education-app-development",
    title: "EdTech & Learning Management System Development",
    metaTitle: "EdTech App Development & LMS Solutions | Codelura",
    metaDescription:
      "Custom learning management systems (LMS), educational mobile app development, e-learning platforms, and live virtual classroom tools engineered by Codelura.",
    h1: "EdTech & Education Application Engineering",
    heroSubtitle:
      "Empower educators and learners with custom learning management platforms, interactive mobile apps, automated quiz engines, and live virtual classrooms.",
    category: "service",
    keywords: [
      "edtech app development",
      "lms development company",
      "e-learning platform development",
      "education mobile app development",
      "online tutoring platform software",
      "quiz app development",
      "school management software",
    ],
    faqs: [
      {
        q: "Can Codelura build custom LMS platforms similar to Coursera, Canvas, or Udemy?",
        a: "Yes. We engineer comprehensive learning management systems featuring course catalog hierarchies, video module streaming, student progress tracking, interactive quizzes, automated certificate generation, and subscription payments.",
      },
      {
        q: "How are video streaming bandwidth costs managed for high-traffic courses?",
        a: "We implement HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming over HTTP (DASH) video protocols connected with CDN caching (Cloudflare or AWS CloudFront). This serves adaptive video resolutions tailored to student connection speeds while optimizing bandwidth costs.",
      },
      {
        q: "Can gamification features be incorporated into educational applications?",
        a: "Yes. We design custom gamification engines including learning streak counters, XP points, achievement badges, leaderboards, and interactive reward popups to boost student engagement.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "ai-based-products",
      "hackathons",
      "one-to-one-guidance",
    ],
    schema: "Service",
    intro:
      "Educational institutions, EdTech companies, and corporate training departments need engaging digital learning environments. Codelura develops custom educational software engineered to increase course completion rates and simplify content delivery.",
    solutions: [
      {
        title: "Custom Learning Management Systems (LMS)",
        description: "End-to-end LMS platforms featuring course outline management, video lesson playlists, student progress bars, and discussion forums.",
      },
      {
        title: "Interactive Assessment & Quiz Engines",
        description: "Automated examination portals supporting multiple-choice questions, essay uploads, timed quizzes, immediate grading, and scorecards.",
      },
      {
        title: "Live Virtual Classroom Portals",
        description: "Real-time video lecture integrations featuring digital whiteboards, student chat messaging, screen sharing, and attendance logs.",
      },
      {
        title: "Automated Certificate Generation Systems",
        description: "Dynamic PDF certificate engines that verify completion credentials and issue downloadable certificates automatically.",
      },
    ],
    features: [
      { title: "Multi-Role User Portals", description: "Tailored dashboard views for students, instructors, course creators, and platform administrators." },
      { title: "Adaptive Bitrate Video Streaming", description: "HLS adaptive video playback ensuring buffer-free streaming across mobile connections." },
      { title: "Gamification & Progress Tracking", description: "Learning streaks, completion badges, point systems, and interactive progress metrics." },
    ],
    process: [
      { step: "01", title: "Curriculum & UX Specification", description: "Mapping course hierarchy structures, video delivery requirements, assessment logic, and user permissions." },
      { step: "02", title: "Platform & Portal Development", description: "Developing responsive student dashboard interfaces, course authoring tools, and checkout funnels." },
      { step: "03", title: "Media CDN & Video Pipeline Setup", description: "Configuring adaptive HLS video transcoding, storage buckets, and global CDN caching." },
      { step: "04", title: "Concurrency Testing & Launch", description: "Executing stress testing to ensure the platform handles simultaneous student exam attempts without latency." },
    ],
    techStack: [
      { category: "Frontend & Video", technologies: ["React", "Next.js", "Video.js", "HLS.js", "Tailwind CSS"] },
      { category: "Backend Infrastructure", technologies: ["Node.js", "Python", "PostgreSQL", "AWS S3 / CloudFront", "Redis"] },
    ],
  },
  {
    slug: "ecommerce-development",
    title: "E-Commerce Development Services",
    metaTitle: "Custom E-Commerce Web & App Development Services | Codelura",
    metaDescription:
      "Custom e-commerce web applications, headless commerce platforms, Shopify development, and payment gateway integration services by Codelura.",
    h1: "High-Performance E-Commerce Development",
    heroSubtitle:
      "Drive digital sales with custom online storefronts, optimized checkout funnels, real-time inventory management, and regional payment gateway integrations.",
    category: "service",
    keywords: [
      "ecommerce development services",
      "custom ecommerce website development",
      "headless commerce development",
      "shopify development company",
      "online store software development",
      "payment gateway integration services",
      "ecommerce app development",
    ],
    faqs: [
      {
        q: "Do you build custom e-commerce applications or platform customized setups?",
        a: "We offer both. We build custom headless e-commerce solutions (Next.js + Stripe/Razorpay) for unique product workflows, as well as customized e-commerce setups on platforms like Shopify or WooCommerce.",
      },
      {
        q: "Which regional and international payment gateways can Codelura integrate?",
        a: "We integrate all leading payment processors including Stripe, Razorpay, PayU, Cashfree, PayPal, Apple Pay, Google Pay, and custom bank gateways.",
      },
      {
        q: "How is high load managed during peak promotional sales events?",
        a: "We deploy storefronts on serverless edge networks (Vercel/Cloudflare) with database caching (Redis) and background order queues to ensure instant page load speeds during high-traffic flash sales.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "web-development-india",
    ],
    schema: "Service",
    intro:
      "An effective e-commerce platform requires fast product search filtering, intuitive mobile shopping carts, frictionless checkout steps, and real-time inventory tracking. Codelura builds modern e-commerce systems engineered to boost conversion rates.",
    solutions: [
      {
        title: "Headless E-Commerce Applications",
        description: "Decoupled online storefronts powered by Next.js frontends connecting to headless backends via fast GraphQL/REST APIs.",
      },
      {
        title: "Custom Storefront & Product Configurators",
        description: "Tailored online shopping experiences featuring interactive 3D/dynamic product customizers, multi-currency switching, and subscriptions.",
      },
      {
        title: "Payment Gateway & Logistics Integration",
        description: "Seamless connections to payment processors, automated tax calculation tools, and shipping tracking provider APIs.",
      },
      {
        title: "E-Commerce Administrative Dashboards",
        description: "Centralized order processing, customer profile tracking, product inventory updates, and sales revenue analytics.",
      },
    ],
    features: [
      { title: "Optimized Mobile Cart UX", description: "Slide-out cart drawers, quick add-to-cart triggers, and streamlined single-page checkouts." },
      { title: "Instant Faceted Search & Filtering", description: "Fast client-side product filtering by category, price, size, color, and stock availability." },
      { title: "Real-Time Inventory Synchronization", description: "Automated background order processing preventing overselling during traffic peaks." },
    ],
    process: [
      { step: "01", title: "Catalog & Funnel Wireframing", description: "Designing product grid layouts, product detail pages, cart drawers, and checkout steps." },
      { step: "02", title: "Storefront & Engine Setup", description: "Developing React components, connecting database product schemas, and configuring search indexers." },
      { step: "03", title: "Payment & Webhook Audit", description: "Testing payment webhooks, cart persistence, SSL security, and order confirmation emails." },
      { step: "04", title: "Edge Deployment & Launch", description: "Deploying store to edge CDN networks and performing live transaction validations." },
    ],
    techStack: [
      { category: "Frontend Commerce", technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"] },
      { category: "Backend & Payments", technologies: ["Stripe", "Razorpay", "Shopify API", "Payload CMS", "Node.js"] },
    ],
  },
  {
    slug: "ai-based-products",
    title: "AI Product Development & LLM Integration",
    metaTitle: "AI Product Development & LLM Integration Services | Codelura",
    metaDescription:
      "Custom AI application development services by Codelura. Engineering AI software using LLM APIs, Retrieval-Augmented Generation (RAG), vector databases, and document automation.",
    h1: "AI Product Development & Software Engineering",
    heroSubtitle:
      "Integrate artificial intelligence into your business products. Codelura builds AI-powered software, custom chat assistants, document extraction engines, and operational automation tools.",
    category: "product",
    keywords: [
      "ai product development services",
      "llm integration company",
      "rag system development",
      "vector database development",
      "ai software engineering",
      "custom chatbot development",
      "ai document extraction",
    ],
    faqs: [
      {
        q: "What practical AI features can Codelura integrate into existing applications?",
        a: "We integrate custom AI conversational assistants, Retrieval-Augmented Generation (RAG) over company documents, automated data extraction from PDFs/invoices, sentiment analysis pipelines, and predictive analytics dashboards.",
      },
      {
        q: "How is company data privacy ensured in AI applications?",
        a: "We implement architectures using private API connections, vector database embeddings with role-level access controls, and strict data non-retention policies ensuring proprietary data is never used to train public models.",
      },
      {
        q: "What is Retrieval-Augmented Generation (RAG)?",
        a: "RAG is a technique that connects Large Language Models (LLMs) to your specific private company documents. When a user asks a question, the system retrieves relevant document chunks from a vector database and feeds them to the LLM to generate factual, accurate answers with source citations.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "hackathons",
      "one-to-one-guidance",
    ],
    schema: "Service",
    intro:
      "Artificial Intelligence is transforming business applications. Codelura helps companies turn AI concepts into production-ready software products, engineering intelligent features that reduce manual labor and deliver actionable insights.",
    solutions: [
      {
        title: "Retrieval-Augmented Generation (RAG) Systems",
        description: "Connect internal company documentation, knowledge bases, and PDFs to LLMs for accurate, grounded search and automated Q&A.",
      },
      {
        title: "Custom AI Assistant Interfaces",
        description: "Interactive chat and assistant interfaces equipped with custom tool calling, conversational memory, and streaming responses.",
      },
      {
        title: "Document Processing & Data Extraction Engines",
        description: "Automate the parsing of unstructured PDFs, receipts, and invoices into structured JSON entries ready for database insertion.",
      },
      {
        title: "NLP & Predictive Analytics Pipelines",
        description: "Custom natural language processing workflows, text classification models, and predictive data analysis tools.",
      },
    ],
    features: [
      { title: "Vector Database Setup", description: "Pinecone, Qdrant, or pgvector integration for fast semantic similarity search over high-dimensional vectors." },
      { title: "Streaming Response UI", description: "Real-time Server-Sent Events (SSE) token streaming for instantaneous chat response rendering." },
      { title: "Prompt Engineering & Guardrails", description: "Structured prompt templates, fallback mechanisms, and input sanitization layers." },
    ],
    process: [
      { step: "01", title: "AI Feasibility & Data Evaluation", description: "Analyzing business use cases, dataset formats, model performance requirements, and cost estimates." },
      { step: "02", title: "Vector Embedding Pipeline Setup", description: "Building data chunking, tokenization, and vector store indexing workflows." },
      { step: "03", title: "Interface & Backend Development", description: "Engineering chat UI components, fallback handlers, and administrative API controls." },
      { step: "04", title: "Latency Tuning & Monitoring", description: "Tracking response latency, token usage costs, accuracy evaluations, and continuous prompt updates." },
    ],
    techStack: [
      { category: "AI & Vector Stacks", technologies: ["OpenAI API", "LangChain / LlamaIndex", "Pinecone", "pgvector", "Python / FastAPI"] },
      { category: "Full-Stack Interface", technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"] },
    ],
  },
];

// ─── LOCATION PAGES ──────────────────────────────────────────
const locationPages: SEOPageData[] = [
  {
    slug: "web-development-india",
    title: "Web Development Services in India",
    metaTitle: "Web Development Services in India | Codelura",
    metaDescription:
      "Reliable web application development and digital engineering services for Indian startups, growing businesses, and enterprises by Codelura.",
    h1: "Web Development Services for Indian Enterprises",
    heroSubtitle:
      "Delivering full-stack web software, custom mobile apps, and cloud-native digital platforms for businesses across India.",
    category: "location",
    keywords: [
      "web development company india",
      "website development services india",
      "software development agency india",
      "web application company india",
      "hire web developers in india",
    ],
    faqs: [
      {
        q: "Why choose Codelura for web software development in India?",
        a: "Codelura pairs modern technology standards (Next.js, TypeScript, Cloud Native) with transparent communication, documented codebase architectures, and predictable project timelines.",
      },
      {
        q: "What engagement models does Codelura offer for Indian companies?",
        a: "We offer fixed-scope project agreements for defined application builds, as well as dedicated developer team arrangements for ongoing product development.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "web-development-mumbai",
      "web-development-bangalore",
      "web-development-delhi",
    ],
    schema: "Organization",
    intro:
      "India's growing digital economy demands scalable web platforms. Codelura partners with Indian startup founders, businesses, and enterprise teams to build software designed for performance, stability, and growth.",
    solutions: [
      { title: "Custom Web Software Development", description: "Tailor-made web applications designed to automate business operations and drive customer conversion." },
      { title: "Startup MVP Engineering", description: "Rapid turn-around development for early-stage software concepts ready for market testing and investor demos." },
      { title: "E-Commerce & Digital Payments", description: "Scalable online storefronts integrated with Razorpay, PayU, Cashfree, and regional payment gateways." },
    ],
    process: [
      { step: "01", title: "Requirement Scope & Planning", description: "Detailed consultation mapping software requirements, user flows, and project milestones." },
      { step: "02", title: "Design & Full-Stack Sprints", description: "Crafting modern user interfaces and building testable backend API microservices." },
      { step: "03", title: "Launch & Technical Assistance", description: "Deploying to production servers, DNS management, and post-launch technical maintenance." },
    ],
  },
  {
    slug: "web-development-mumbai",
    title: "Web Development Services in Mumbai",
    metaTitle: "Web Development Services in Mumbai | Codelura",
    metaDescription:
      "Professional web development services for Mumbai businesses, commercial enterprises, and startups. Custom web application engineering by Codelura.",
    h1: "Web Software Development in Mumbai",
    heroSubtitle:
      "Powering financial services, retail, media, and corporate businesses in Mumbai with modern digital web systems.",
    category: "location",
    keywords: [
      "web development company mumbai",
      "website development mumbai",
      "software company in mumbai",
      "web application agency mumbai",
    ],
    faqs: [
      {
        q: "How does Codelura collaborate remotely with clients based in Mumbai?",
        a: "We utilize structured remote project management using video standups, dedicated communication channels, and bi-weekly sprint reviews to keep projects transparent.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "app-development-services",
    ],
    schema: "Organization",
    intro:
      "Mumbai's commercial ecosystem demands reliable digital infrastructure. Codelura provides Mumbai enterprises with modern web software, corporate portals, and secure online applications.",
    solutions: [
      { title: "Corporate & Customer Portals", description: "Professional corporate web platforms featuring secure user account portals and document workflows." },
      { title: "Financial & Service Dashboards", description: "Data-dense web interfaces equipped with interactive data reporting, charting, and multi-tier access permissions." },
    ],
  },
  {
    slug: "web-development-bangalore",
    title: "Web Development Services in Bangalore",
    metaTitle: "Web Development Services in Bangalore | Codelura",
    metaDescription:
      "High-tech web software development and startup product engineering in Bangalore. Next.js, React, Node.js, and cloud application solutions by Codelura.",
    h1: "Web & Product Software Development in Bangalore",
    heroSubtitle:
      "Engineering scalable web apps and SaaS products for tech startups and innovation hubs across Bangalore.",
    category: "location",
    keywords: [
      "web development company bangalore",
      "startup tech partner bangalore",
      "saas app development bangalore",
      "software engineering bangalore",
    ],
    faqs: [
      {
        q: "Can Codelura build scalable tech MVPs for Bangalore startups?",
        a: "Yes. We specialize in building production-ready Minimum Viable Products using Next.js and Node.js designed for fast scaling and investor demonstrations.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "ai-based-products",
    ],
    schema: "Organization",
    intro:
      "As India's technology capital, Bangalore requires cutting-edge engineering standards. Codelura delivers clean TypeScript codebases, microservice architectures, and automated cloud pipelines.",
    solutions: [
      { title: "SaaS Product Engineering", description: "Scalable SaaS web applications built for multi-tenancy, subscription logic, and high concurrency loads." },
      { title: "API Microservices Development", description: "Performant backend services connecting mobile applications and third-party platform APIs." },
    ],
  },
  {
    slug: "web-development-delhi",
    title: "Web Development Services in Delhi NCR",
    metaTitle: "Web Development Services in Delhi NCR | Codelura",
    metaDescription:
      "Custom web development and digital solutions for businesses in Delhi, Gurgaon, and Noida. High-performance web software engineered by Codelura.",
    h1: "Web Development Services in Delhi NCR",
    heroSubtitle:
      "Supporting corporate offices across Delhi, Gurgaon cyber hubs, and Noida with high-performance web applications and digital portals.",
    category: "location",
    keywords: [
      "web development company delhi",
      "website development delhi ncr",
      "software agency gurgaon",
      "app development noida",
    ],
    faqs: [
      {
        q: "Does Codelura serve businesses in both Gurgaon and Noida?",
        a: "Yes. We collaborate seamlessly with organizations across the Delhi National Capital Region (NCR) including Delhi, Gurgaon, Noida, and Faridabad.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "ecommerce-development",
    ],
    schema: "Organization",
    intro:
      "Delhi NCR is home to diverse corporate headquarters, retail networks, and tech hubs. Codelura provides tailored web application development and robust digital management software.",
    solutions: [
      { title: "Corporate Business Web Portals", description: "High-speed corporate websites with integrated lead generation tools and multi-tier access controls." },
      { title: "E-Commerce & Digital Marketplaces", description: "Custom digital marketplaces connecting vendors and buyers with integrated payment checkout flows." },
    ],
  },
  {
    slug: "web-development-usa",
    title: "Web Development Services for US Clients",
    metaTitle: "Web Development Services for US Businesses | Codelura",
    metaDescription:
      "High-quality offshore software engineering and web development for US startups and SMEs. Time-zone overlapping communication workflows by Codelura.",
    h1: "Offshore Web Engineering for US Businesses",
    heroSubtitle:
      "Silicon Valley software standards paired with efficient remote engineering workflows. Delivering high-caliber web applications to US founders.",
    category: "location",
    keywords: [
      "web development agency for usa",
      "offshore web development usa",
      "hire react developers usa",
      "us software development outsourcing",
    ],
    faqs: [
      {
        q: "How does Codelura manage working hours across US time zones?",
        a: "We structure overlap communication schedules tailored for EST, CST, and PST time zones, ensuring daily sync calls and prompt messaging updates.",
      },
      {
        q: "How are code quality and IP protection handled for international clients?",
        a: "All code repositories remain the exclusive intellectual property of the client. We sign standard Non-Disclosure Agreements (NDAs) and follow clean git workflows.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "ai-based-products",
    ],
    schema: "Organization",
    intro:
      "American companies require dependable software partners who deliver clean code, adhere to timelines, and communicate proactively. Codelura acts as a remote engineering partner for US startups and growing enterprises.",
    solutions: [
      { title: "Dedicated Remote Developer Teams", description: "Augment your existing tech team with experienced full-stack React, Next.js, and Node.js engineers." },
      { title: "Full Product Lifecycle Execution", description: "From initial specifications to automated cloud deployment on AWS or Vercel with test coverage." },
    ],
  },
  {
    slug: "web-development-uk",
    title: "Web Development Services for UK Businesses",
    metaTitle: "Web Development Services for UK Clients | Codelura",
    metaDescription:
      "Reliable web application and mobile software development for UK startups and SMBs. Data privacy standards and agile delivery by Codelura.",
    h1: "Web Software Engineering for UK Businesses",
    heroSubtitle:
      "Building clean, accessible, and modern web applications for clients across London, Manchester, and the United Kingdom.",
    category: "location",
    keywords: [
      "web development company uk",
      "offshore software development uk",
      "hire nextjs developers uk",
      "web application company uk",
    ],
    faqs: [
      {
        q: "Are web applications engineered with data privacy and cookie management practices?",
        a: "Yes. Web applications engineered for UK/EU clients are configured with cookie consent managers, data privacy controls, and secure user data storage handling.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "web-development-usa",
    ],
    schema: "Organization",
    intro:
      "UK businesses seek engineering efficiency without compromising software standards. Codelura provides UK organizations with performant web platforms, modern user interfaces, and structured sprint execution.",
    solutions: [
      { title: "Custom Web Application Engineering", description: "Fast, responsive web software designed around modern UK usability standards." },
      { title: "API Microservices & Cloud Migration", description: "Upgrading legacy web portals to modern cloud infrastructure with minimal downtime." },
    ],
  },
  {
    slug: "web-development-uae",
    title: "Web & App Development Services for UAE & Dubai",
    metaTitle: "Web Development Services in UAE & Dubai | Codelura",
    metaDescription:
      "Custom web application and mobile app development services for UAE and Dubai businesses. Right-to-left (RTL) Arabic localization ready by Codelura.",
    h1: "Web & Mobile Software Development for UAE & Dubai",
    heroSubtitle:
      "Delivering high-performance digital platforms, multilingual web software, and enterprise applications for the Middle East market.",
    category: "location",
    keywords: [
      "web development company dubai",
      "web development uae",
      "arabic website development",
      "app development agency dubai",
    ],
    faqs: [
      {
        q: "Can Codelura engineer websites supporting Arabic RTL (Right-to-Left) layouts?",
        a: "Yes. We build bi-directional applications supporting both English and Arabic with native RTL CSS styling and effortless language switching.",
      },
    ],
    relatedSlugs: ["web-development-services", "app-development-services"],
    schema: "Organization",
    intro:
      "The UAE's fast-growing digital economy demands sophisticated web software. Codelura builds bilingual, high-throughput web applications customized for Middle Eastern business and consumer environments.",
    solutions: [
      { title: "Bilingual Web Applications", description: "Seamless switching between Arabic (RTL) and English layouts with centralized content localization." },
      { title: "Enterprise & Retail Portals", description: "High-speed web platforms tailored for Dubai commercial sectors with payment integration capabilities." },
    ],
  },
];

// ─── TOPIC & COMMUNITY PAGES ──────────────────────────────────
const topicPages: SEOPageData[] = [
  {
    slug: "hackathons",
    title: "Tech Hackathons & Developer Competitions",
    metaTitle: "Tech Hackathons Guide, Architecture & Starter Code | Codelura",
    metaDescription:
      "Explore tech hackathon resources, MVP project architectures, team formation strategies, and technical boilerplate starters curated by Codelura.",
    h1: "Tech Hackathons & Project Acceleration",
    heroSubtitle:
      "Build fast. Solve problems. Innovate. Essential guides, architectural boilerplate templates, and strategy tips for hackathon participants and teams.",
    category: "topic",
    keywords: [
      "tech hackathons guide",
      "coding competition preparation",
      "hackathon project starter templates",
      "ai hackathon starter code",
      "hackathon team preparation",
    ],
    faqs: [
      {
        q: "How can developers effectively prepare for a 24 to 48-hour hackathon sprint?",
        a: "Preparation requires choosing a focused problem statement, setting up repository boilerplates before the event starts, selecting familiar tech stacks (e.g. Next.js + Supabase/Firebase), and defining explicit team member roles.",
      },
      {
        q: "What tech stack is recommended for building a rapid hackathon MVP?",
        a: "We recommend Next.js paired with Tailwind CSS for instant UI styling, Supabase or Firebase for rapid backend/auth/database setup, and Vercel for one-click deployment.",
      },
    ],
    relatedSlugs: [
      "tech-jobs",
      "blogs",
      "one-to-one-guidance",
      "ai-based-products",
    ],
    schema: "Article",
    intro:
      "Hackathons provide developers and designers an environment to transform concepts into working prototypes in short timeframes. Codelura provides starter code patterns and advice to help teams turn early hackathon ideas into functional products.",
    overview: {
      title: "Maximizing Your Hackathon MVP Sprint",
      description:
        "Success in a hackathon requires strict scope limitation, efficient code setups, modular UI component selection, and a compelling live project demonstration.",
    },
    features: [
      { title: "Rapid Project Boilerplates", description: "Pre-configured Next.js and React Native starters equipped with Tailwind CSS and TypeScript." },
      { title: "API Integration Cheat Sheets", description: "Quick guides for integrating LLM endpoints, payment webhooks, and authentication providers." },
      { title: "Pitch Demo Framework", description: "Structuring 3-minute technical presentations to highlight problem solving, architecture, and live features." },
    ],
    contentSections: [
      {
        heading: "Essential Steps for Building a Winning Hackathon Project",
        content: "Building a successful hackathon submission requires balancing technical scope with presentation clarity.",
        bullets: [
          "Scope small: Focus strictly on 1 or 2 core user interactions rather than attempting a feature-heavy application.",
          "Deploy early: Set up CI/CD hosting on hour one so live links are always testable during development.",
          "Prioritize visual appeal: Ensure your user interface looks clean and responsive during video demonstrations.",
        ],
      },
    ],
  },
  {
    slug: "tech-jobs",
    title: "Tech Careers & Software Engineering Guidance",
    metaTitle: "Tech Careers, Engineering Roles & Skill Roadmaps | Codelura",
    metaDescription:
      "Explore software engineering career paths, core technical skill roadmaps, interview preparation guidelines, and developer growth resources by Codelura.",
    h1: "Tech Careers & Engineering Roadmaps",
    heroSubtitle:
      "Navigating software development career paths — from frontend and full-stack engineering to AI development and system architecture.",
    category: "topic",
    keywords: [
      "tech career roadmap",
      "software engineer skills",
      "web developer career path",
      "full stack developer roadmap",
      "technical interview preparation",
    ],
    faqs: [
      {
        q: "What technical skills are in highest demand for full-stack web developers?",
        a: "Key fundamentals include TypeScript/JavaScript, React/Next.js, Node.js, SQL database query design, REST/GraphQL API development, and git version control workflows.",
      },
      {
        q: "How can developers prepare effectively for technical coding interviews?",
        a: "Focus on data structures and algorithms, system design principles, building practical portfolio applications, writing clean code, and communicating design decisions clearly.",
      },
    ],
    relatedSlugs: ["hackathons", "one-to-one-guidance", "blogs"],
    schema: "Article",
    intro:
      "The software industry evolves continuously, requiring developers to update their skill sets regularly. Codelura curates practical advice on engineering roles, career transition roadmaps, and portfolio presentation.",
    features: [
      { title: "Frontend Engineering Path", description: "Mastering semantic HTML5, TypeScript, state management, and modern rendering framework optimization." },
      { title: "Backend Systems Path", description: "Understanding database normalization, REST/GraphQL API design, authentication, and server deployments." },
      { title: "Portfolio Project Development", description: "Guidance on building production-deployed personal projects that demonstrate real engineering value." },
    ],
  },
  {
    slug: "blogs",
    title: "Tech Insights & Software Engineering Articles",
    metaTitle: "Tech Articles, Technical Tutorials & Code Guides | Codelura",
    metaDescription:
      "Read technical articles, frontend and backend tutorials, system design insights, and software architecture guides written by Codelura.",
    h1: "Tech Articles & Engineering Guides",
    heroSubtitle:
      "Practical technical articles on Next.js, TypeScript patterns, web performance, database optimization, and AI application architectures.",
    category: "topic",
    keywords: [
      "tech blog",
      "web development tutorials",
      "nextjs architecture articles",
      "typescript guides",
      "software design patterns",
    ],
    faqs: [
      {
        q: "What technical topics does Codelura write about?",
        a: "We publish technical guides covering React & Next.js performance, database indexing, REST/GraphQL APIs, web accessibility, and practical AI application patterns.",
      },
    ],
    relatedSlugs: ["hackathons", "tech-jobs", "one-to-one-guidance"],
    schema: "Article",
    intro:
      "Clear technical writing helps bridge complex software concepts with practical implementation. Codelura shares structured articles and tutorials for developers and technical founders.",
    features: [
      { title: "In-Depth Programming Tutorials", description: "Step-by-step technical guides with clear code snippets and architectural diagrams." },
      { title: "Performance Benchmarks", description: "Comparative evaluations of web frameworks, rendering strategies, and performance patterns." },
    ],
  },
  {
    slug: "one-to-one-guidance",
    title: "1-on-1 Tech Mentorship & Career Guidance",
    metaTitle: "1:1 Developer Mentorship & Code Reviews | Codelura",
    metaDescription:
      "Get personalized 1-on-1 technical mentorship, architecture advisory, code review sessions, and interview preparation guidance from Codelura.",
    h1: "1-on-1 Technical Mentorship & Guidance",
    heroSubtitle:
      "Overcome technical roadblocks, refine application architectures, prepare for engineering interviews, and receive structured code feedback.",
    category: "guidance",
    keywords: [
      "tech mentorship",
      "1 on 1 coding guidance",
      "developer code review",
      "software career mentor",
      "system design guidance",
    ],
    faqs: [
      {
        q: "What takes place during a 1:1 technical guidance session?",
        a: "Sessions focus directly on your goals — whether reviewing your project codebase for performance issues, breaking down complex system design questions, or creating a skill roadmap.",
      },
      {
        q: "Who is this mentorship suitable for?",
        a: "It is designed for self-taught developers, computer science students, junior developers, and aspiring engineers looking for targeted code reviews and career direction.",
      },
    ],
    relatedSlugs: [
      "education-app-development",
      "hackathons",
      "tech-jobs",
      "blogs",
    ],
    schema: "Article",
    intro:
      "Direct technical feedback accelerates learning faster than passive video tutorials. Codelura offers structured 1-on-1 sessions aimed at solving immediate coding challenges and improving software engineering practices.",
    features: [
      { title: "Codebase & Architecture Reviews", description: "Detailed walkthroughs of your application repository to identify performance bottlenecks and refactoring opportunities." },
      { title: "Technical Interview Practice", description: "Mock coding interviews and system design discussions designed to build technical confidence." },
      { title: "Custom Skill Roadmaps", description: "Tailored action plans detailing exact technical skills to focus on for your targeted engineering roles." },
    ],
  },
];

// ─── ALL PAGES COMBINED ───────────────────────────────────────
export const allSEOPages: SEOPageData[] = [
  ...servicePages,
  ...locationPages,
  ...topicPages,
];

export const getSEOPage = (slug: string): SEOPageData | undefined =>
  allSEOPages.find((p) => p.slug === slug);

export const getSEOPagesByCategory = (
  category: SEOPageData["category"]
): SEOPageData[] => allSEOPages.filter((p) => p.category === category);

export const getAllSlugs = (): string[] => allSEOPages.map((p) => p.slug);
