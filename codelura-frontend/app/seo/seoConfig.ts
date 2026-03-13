// ============================================================
// CODELURA SEO CONFIG — Dynamic Page Data
// Covers: Services, Cities (India+International), Topics
// ============================================================

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
  schema: "Service" | "FAQPage" | "Course" | "Organization" | "Article";
};

// ─── DIGITAL SERVICES ────────────────────────────────────────
const servicePages: SEOPageData[] = [
  {
    slug: "web-development-services",
    title: "Web Development Services",
    metaTitle: "Web Development Services | Codelura — India's #1 Tech Platform",
    metaDescription:
      "Get world-class web development services from Codelura. Custom websites, web apps, e-commerce solutions for startups & enterprises. India & worldwide.",
    h1: "Web Development Services That Scale",
    heroSubtitle:
      "From landing pages to enterprise SaaS — Codelura builds fast, beautiful, and SEO-ready web experiences.",
    category: "service",
    keywords: [
      "web development services india",
      "custom website development",
      "hire web developer india",
      "web app development company",
      "nextjs development services",
      "react web development",
      "web development agency india",
    ],
    faqs: [
      {
        q: "What web development services does Codelura offer?",
        a: "Codelura offers full-stack web development including React/Next.js frontends, Node.js/Python backends, REST & GraphQL APIs, CMS integrations, and performance optimization.",
      },
      {
        q: "How long does it take to build a website with Codelura?",
        a: "A basic website takes 1–2 weeks. Complex web apps or e-commerce platforms typically take 4–12 weeks depending on scope.",
      },
      {
        q: "Does Codelura work with international clients?",
        a: "Yes! Codelura serves clients across India, USA, UK, Canada, Australia, UAE, and 40+ countries.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "ecommerce-development",
      "one-to-one-guidance",
      "web-development-india",
    ],
    schema: "Service",
  },
  {
    slug: "app-development-services",
    title: "App Development Services",
    metaTitle: "Mobile App Development Services | iOS & Android — Codelura",
    metaDescription:
      "Build powerful iOS & Android apps with Codelura. React Native, Flutter, and native development for clinics, education, e-commerce & enterprise.",
    h1: "Mobile App Development for Every Industry",
    heroSubtitle:
      "Clinic apps, EdTech apps, e-commerce apps — we build apps users love. 5-star rated on every platform.",
    category: "service",
    keywords: [
      "mobile app development india",
      "ios app development",
      "android app development",
      "react native development",
      "flutter app development",
      "clinic app development",
      "education app development",
      "ecommerce app development",
    ],
    faqs: [
      {
        q: "Which platforms does Codelura develop apps for?",
        a: "We develop for iOS (Swift/SwiftUI), Android (Kotlin), and cross-platform (React Native & Flutter) to maximize reach and minimize cost.",
      },
      {
        q: "Can Codelura build a clinic management app?",
        a: "Absolutely. We specialize in healthcare apps with appointment booking, patient records, telemedicine, and prescription management.",
      },
      {
        q: "What industries does Codelura build apps for?",
        a: "Healthcare/clinics, EdTech, e-commerce, logistics, fintech, hospitality, and custom enterprise solutions.",
      },
    ],
    relatedSlugs: [
      "clinic-app-development",
      "education-app-development",
      "ecommerce-development",
      "web-development-services",
    ],
    schema: "Service",
  },
  {
    slug: "clinic-app-development",
    title: "Clinic & Healthcare App Development",
    metaTitle: "Clinic App Development | Healthcare Software — Codelura",
    metaDescription:
      "Custom clinic management apps, patient portals, telemedicine platforms. HIPAA-aware healthcare app development by Codelura. India & global.",
    h1: "Clinic & Healthcare App Development",
    heroSubtitle:
      "Modernize your clinic with smart appointment, EMR, billing & telemedicine apps built by Codelura.",
    category: "service",
    keywords: [
      "clinic app development",
      "hospital management software",
      "healthcare app development india",
      "telemedicine app development",
      "patient management system",
      "doctor appointment app",
      "EMR software development",
    ],
    faqs: [
      {
        q: "What features can be included in a clinic app?",
        a: "Appointment scheduling, patient records (EMR), billing & invoicing, prescription management, telemedicine video calls, lab reports, and staff management.",
      },
      {
        q: "Is the data in clinic apps secure?",
        a: "Yes. We follow best practices for healthcare data security including encrypted storage, role-based access, and secure APIs.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "web-development-services",
      "one-to-one-guidance",
    ],
    schema: "Service",
  },
  {
    slug: "education-app-development",
    title: "Education App & EdTech Development",
    metaTitle: "EdTech App Development | Education Platform — Codelura",
    metaDescription:
      "Build next-gen EdTech apps and e-learning platforms with Codelura. LMS, quiz apps, live tutoring, and AI-powered education tools.",
    h1: "EdTech & Education App Development",
    heroSubtitle:
      "From school LMS to global MOOC platforms — Codelura builds education technology that transforms learning.",
    category: "service",
    keywords: [
      "edtech app development",
      "education app development india",
      "lms development",
      "e-learning platform development",
      "online tutoring app",
      "quiz app development",
      "school management software",
    ],
    faqs: [
      {
        q: "Can Codelura build a platform like Udemy or Coursera?",
        a: "Yes! We build full LMS platforms with course creation, video hosting, quizzes, certificates, payments, and live classes.",
      },
      {
        q: "Does Codelura integrate AI into education apps?",
        a: "Yes — we integrate AI for personalized learning paths, smart assessments, chatbot tutors, and automated grading.",
      },
    ],
    relatedSlugs: [
      "app-development-services",
      "ai-based-products",
      "hackathons",
      "one-to-one-guidance",
    ],
    schema: "Service",
  },
  {
    slug: "ecommerce-development",
    title: "E-Commerce Development Services",
    metaTitle: "E-Commerce Development | Online Store Solutions — Codelura",
    metaDescription:
      "Launch your online store with Codelura. Custom e-commerce websites, Shopify, WooCommerce, and headless commerce solutions for India & global markets.",
    h1: "E-Commerce Development That Converts",
    heroSubtitle:
      "From Shopify stores to custom headless e-commerce — we build online stores that sell 24/7.",
    category: "service",
    keywords: [
      "ecommerce development india",
      "shopify development",
      "woocommerce development",
      "online store development",
      "headless ecommerce",
      "ecommerce website india",
      "ecommerce app development",
    ],
    faqs: [
      {
        q: "What e-commerce platforms does Codelura work with?",
        a: "We work with Shopify, WooCommerce, Magento, and also build fully custom e-commerce solutions using Next.js + Stripe/Razorpay.",
      },
      {
        q: "Can you integrate Indian payment gateways?",
        a: "Absolutely. We integrate Razorpay, PayU, Cashfree, Instamojo, and all major Indian payment gateways.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "web-development-india",
    ],
    schema: "Service",
  },
  {
    slug: "ai-based-products",
    title: "AI-Based Product Development",
    metaTitle: "AI Product Development | Machine Learning Solutions — Codelura",
    metaDescription:
      "Build AI-powered products with Codelura. Chatbots, recommendation engines, computer vision, NLP, and GPT integrations for your business.",
    h1: "AI-Based Product & Software Development",
    heroSubtitle:
      "From GPT-powered chatbots to computer vision — Codelura builds intelligent products that give you the edge.",
    category: "product",
    keywords: [
      "ai product development india",
      "machine learning development",
      "chatbot development",
      "gpt integration services",
      "ai software development company india",
      "nlp development",
      "computer vision development",
      "ai startup india",
    ],
    faqs: [
      {
        q: "What kind of AI products does Codelura build?",
        a: "We build AI chatbots, recommendation systems, document analysis tools, image recognition apps, predictive analytics dashboards, and custom GPT-based tools.",
      },
      {
        q: "Can Codelura integrate OpenAI / ChatGPT into my product?",
        a: "Yes! We specialize in GPT-4, Claude, Gemini, and other LLM integrations via APIs to power your product features.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "hackathons",
      "one-to-one-guidance",
    ],
    schema: "Service",
  },
];

// ─── LOCATION PAGES (India + International) ──────────────────
const locationPages: SEOPageData[] = [
  {
    slug: "web-development-india",
    title: "Web Development in India",
    metaTitle: "Best Web Development Company in India — Codelura",
    metaDescription:
      "Codelura is India's top web development company. Affordable, high-quality websites and web apps for startups, SMEs, and enterprises across India.",
    h1: "India's Best Web Development Company",
    heroSubtitle:
      "Trusted by 500+ businesses across India — from Mumbai to Bangalore, Delhi to Chennai.",
    category: "location",
    keywords: [
      "web development company india",
      "best web development india",
      "website development india",
      "software company india",
      "it company india",
      "web developer india",
    ],
    faqs: [
      {
        q: "Why choose Codelura for web development in India?",
        a: "Codelura offers competitive pricing, quality code, fast delivery, and dedicated support — making us the preferred choice for Indian businesses.",
      },
      {
        q: "Does Codelura serve Tier-2 and Tier-3 cities in India?",
        a: "Yes! We serve clients in Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Pune, Jaipur, Lucknow, Indore, and all cities across India.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "web-development-mumbai",
      "web-development-bangalore",
      "web-development-delhi",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-mumbai",
    title: "Web Development in Mumbai",
    metaTitle: "Web Development Company in Mumbai — Codelura",
    metaDescription:
      "Top web development company in Mumbai. Codelura builds websites, web apps, and digital solutions for Mumbai businesses. Get a free quote today.",
    h1: "Web Development Company in Mumbai",
    heroSubtitle:
      "Mumbai's startups and enterprises trust Codelura for cutting-edge web solutions.",
    category: "location",
    keywords: [
      "web development company mumbai",
      "website development mumbai",
      "web developer mumbai",
      "software company mumbai",
      "it company mumbai",
      "app development mumbai",
    ],
    faqs: [
      {
        q: "Does Codelura have an office in Mumbai?",
        a: "Codelura operates remotely with a distributed team, serving Mumbai clients virtually with the same quality as any on-site agency.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "app-development-services",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-bangalore",
    title: "Web Development in Bangalore",
    metaTitle: "Web Development Company in Bangalore — Codelura",
    metaDescription:
      "Codelura provides top-tier web and app development services in Bangalore. Serving startups in HSR, Koramangala, Whitefield & beyond.",
    h1: "Web Development Company in Bangalore",
    heroSubtitle:
      "Bangalore's startup ecosystem deserves world-class tech. Codelura delivers.",
    category: "location",
    keywords: [
      "web development company bangalore",
      "website development bangalore",
      "app development bangalore",
      "it company bangalore",
      "software development bangalore",
      "startup tech partner bangalore",
    ],
    faqs: [
      {
        q: "Can Codelura help Bangalore-based startups?",
        a: "Yes — we're a preferred tech partner for Bangalore startups, offering MVP development, scaling, and ongoing engineering support.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "ai-based-products",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-delhi",
    title: "Web Development in Delhi / NCR",
    metaTitle: "Web Development Company in Delhi NCR — Codelura",
    metaDescription:
      "Best web development company in Delhi NCR. Codelura serves Noida, Gurgaon, Faridabad, and Delhi businesses with premium digital services.",
    h1: "Web Development in Delhi NCR",
    heroSubtitle: "From Connaught Place to Cyber City Gurgaon — Codelura powers Delhi's digital growth.",
    category: "location",
    keywords: [
      "web development company delhi",
      "website development delhi ncr",
      "app development noida",
      "software company gurgaon",
      "web developer delhi",
    ],
    faqs: [
      {
        q: "Does Codelura serve businesses in Noida and Gurgaon?",
        a: "Yes! We serve the entire NCR region including Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad.",
      },
    ],
    relatedSlugs: [
      "web-development-india",
      "web-development-services",
      "ecommerce-development",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-usa",
    title: "Web Development Services for USA",
    metaTitle: "Web Development Services for USA Clients — Codelura",
    metaDescription:
      "Indian web development agency serving US clients. Codelura delivers Silicon Valley quality at competitive prices for US startups and SMEs.",
    h1: "Indian Web Development Agency for US Businesses",
    heroSubtitle:
      "US-quality standards, India-efficient pricing. Codelura is the offshore tech partner American businesses trust.",
    category: "location",
    keywords: [
      "web development company for usa",
      "indian web development agency usa",
      "offshore web development usa",
      "hire indian developers usa",
      "web development outsourcing usa",
    ],
    faqs: [
      {
        q: "Does Codelura work in US time zones?",
        a: "Yes — we offer flexible scheduling with overlap hours for EST, CST, PST, and MST time zones.",
      },
      {
        q: "What is the advantage of hiring Codelura over a US agency?",
        a: "You get the same quality at 40–60% lower cost, faster delivery, and a dedicated team that feels like an extension of your own.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "ai-based-products",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-uk",
    title: "Web Development Services for UK",
    metaTitle: "Web Development Services for UK Businesses — Codelura",
    metaDescription:
      "Codelura provides premium web and app development for UK businesses. Trusted by UK startups and SMEs. Competitive pricing, world-class quality.",
    h1: "Web Development Agency for UK Businesses",
    heroSubtitle:
      "London, Manchester, Birmingham — UK businesses choose Codelura for reliable, affordable, and excellent web development.",
    category: "location",
    keywords: [
      "web development company uk",
      "indian web agency uk",
      "offshore development uk",
      "hire developers uk",
      "website development uk",
    ],
    faqs: [
      {
        q: "Is Codelura GDPR compliant for UK clients?",
        a: "Yes — all projects for UK/EU clients are developed with GDPR compliance, including data privacy policies and cookie management.",
      },
    ],
    relatedSlugs: [
      "web-development-services",
      "app-development-services",
      "web-development-usa",
    ],
    schema: "Organization",
  },
  {
    slug: "web-development-uae",
    title: "Web Development Services for UAE / Dubai",
    metaTitle: "Web Development Services in UAE & Dubai — Codelura",
    metaDescription:
      "Top web and app development services for UAE and Dubai businesses. Codelura builds Arabic-ready, multilingual websites and apps for the Middle East market.",
    h1: "Web & App Development for UAE & Dubai",
    heroSubtitle:
      "Dubai's digital ambitions need world-class tech. Codelura delivers multi-lingual, high-performance digital solutions.",
    category: "location",
    keywords: [
      "web development company dubai",
      "web development uae",
      "app development dubai",
      "arabic website development",
      "digital agency dubai india",
    ],
    faqs: [
      {
        q: "Can Codelura build Arabic (RTL) websites?",
        a: "Yes — we build fully RTL-compatible websites and apps supporting Arabic, Urdu, and other right-to-left languages.",
      },
    ],
    relatedSlugs: ["web-development-services", "app-development-services"],
    schema: "Organization",
  },
];

// ─── TOPIC / COMMUNITY PAGES ──────────────────────────────────
const topicPages: SEOPageData[] = [
  {
    slug: "hackathons",
    title: "Tech Hackathons & Competitions",
    metaTitle: "Hackathons in India | Tech Competitions 2024-25 — Codelura",
    metaDescription:
      "Find and participate in top hackathons in India and globally. Codelura lists, hosts, and mentors teams for hackathons in web dev, AI, blockchain & more.",
    h1: "Hackathons & Tech Competitions",
    heroSubtitle:
      "Build. Compete. Win. Codelura connects you with the best hackathons in India and worldwide.",
    category: "topic",
    keywords: [
      "hackathons india 2024",
      "online hackathon india",
      "tech competition india",
      "coding competition india",
      "ai hackathon",
      "web development hackathon",
      "hackathon for students india",
    ],
    faqs: [
      {
        q: "How does Codelura help with hackathons?",
        a: "Codelura lists upcoming hackathons, helps you form teams, provides mentorship, technical resources, and project templates to maximize your chances of winning.",
      },
      {
        q: "Are there online hackathons listed on Codelura?",
        a: "Yes — Codelura lists both online and offline hackathons across India and internationally, filtered by skill level, domain, and prize money.",
      },
    ],
    relatedSlugs: [
      "tech-jobs",
      "blogs",
      "one-to-one-guidance",
      "ai-based-products",
    ],
    schema: "Course",
  },
  {
    slug: "tech-jobs",
    title: "Tech Jobs & Career Opportunities",
    metaTitle: "Tech Jobs in India | IT Career Opportunities — Codelura",
    metaDescription:
      "Browse tech jobs, internships, and freelance opportunities on Codelura. Web dev, app dev, AI/ML, UI/UX, DevOps, and more — India & remote worldwide.",
    h1: "Tech Jobs & Career Opportunities",
    heroSubtitle:
      "From internships to senior roles — Codelura is where tech talent meets great opportunities.",
    category: "topic",
    keywords: [
      "tech jobs india",
      "it jobs india",
      "software developer jobs india",
      "web developer jobs",
      "remote jobs india",
      "freelance developer india",
      "coding jobs india",
    ],
    faqs: [
      {
        q: "What kind of tech jobs are listed on Codelura?",
        a: "Full-stack development, frontend, backend, mobile (iOS/Android), AI/ML, DevOps, UI/UX design, product management, and tech internships.",
      },
      {
        q: "Are remote jobs available on Codelura?",
        a: "Yes — we list remote jobs for Indian developers working with India-based and international companies.",
      },
    ],
    relatedSlugs: ["hackathons", "one-to-one-guidance", "blogs"],
    schema: "Course",
  },
  {
    slug: "blogs",
    title: "Tech Blogs & Articles",
    metaTitle: "Tech Blogs | Web Dev, AI, Startup Articles — Codelura",
    metaDescription:
      "Read expert tech blogs on Codelura. Articles on web development, AI, mobile apps, startups, coding tutorials, and career advice for Indian developers.",
    h1: "Tech Blogs, Tutorials & Articles",
    heroSubtitle:
      "Stay ahead with Codelura's expert-written tech blogs — from React tutorials to AI trends.",
    category: "topic",
    keywords: [
      "tech blog india",
      "web development blog",
      "coding tutorials india",
      "ai blog india",
      "software development articles",
      "developer blog india",
      "tech news india",
    ],
    faqs: [
      {
        q: "What topics does Codelura's blog cover?",
        a: "Web development, mobile apps, AI/ML, UI/UX, DevOps, startup tips, career advice, coding tutorials, and tech industry news.",
      },
      {
        q: "Can I contribute a blog to Codelura?",
        a: "Yes! Codelura accepts guest posts from experienced developers and tech professionals. Submit your article for review.",
      },
    ],
    relatedSlugs: ["hackathons", "tech-jobs", "one-to-one-guidance"],
    schema: "Article",
  },
  {
    slug: "one-to-one-guidance",
    title: "One-to-One Tech Mentorship & Guidance",
    metaTitle: "1:1 Tech Mentorship & Career Guidance — Codelura",
    metaDescription:
      "Get personalized 1-on-1 mentorship from senior developers at Codelura. Career guidance, code reviews, interview prep, and project help for Indian developers.",
    h1: "One-to-One Tech Guidance & Mentorship",
    heroSubtitle:
      "Stuck on a problem? Starting a career? Get direct, personalized guidance from Codelura's senior tech experts.",
    category: "guidance",
    keywords: [
      "tech mentorship india",
      "one to one coding guidance",
      "developer mentorship india",
      "career guidance software engineer",
      "coding interview prep india",
      "1 on 1 tech mentoring",
      "online tech mentor india",
    ],
    faqs: [
      {
        q: "What does Codelura's 1:1 guidance include?",
        a: "Personalized sessions covering career planning, code reviews, project help, interview preparation, technology roadmaps, and freelancing advice.",
      },
      {
        q: "Who are the mentors at Codelura?",
        a: "Our mentors are senior developers and engineers with 5–15+ years of experience from top Indian and international tech companies.",
      },
      {
        q: "How do I book a 1:1 session on Codelura?",
        a: "Visit the Guidance section on Codelura, browse mentor profiles, and book a slot that fits your schedule.",
      },
    ],
    relatedSlugs: [
      "education-app-development",
      "hackathons",
      "tech-jobs",
      "blogs",
    ],
    schema: "Course",
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