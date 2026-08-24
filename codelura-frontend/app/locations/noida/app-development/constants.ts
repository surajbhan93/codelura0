export interface ServiceCardItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  tag: string;
}

export interface TechItem {
  name: string;
  category: string;
  desc: string;
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

export const COMPANY_DETAILS = {
  name: "Codelura Technologies",
  tagline: "Premier Mobile App Development Agency in Noida",
  primaryKeyword: "App Development Company in Noida",
  phone: "+91-98765-43210",
  whatsappPhone: "919876543210",
  email: "noida@codelura.com",
  address: "Codelura Tech Center, Sector 62, Near Electronic City Metro Station, Noida, Uttar Pradesh 201309, India",
  coordinates: { lat: 28.6280, lng: 77.3649 },
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.562341234567!2d77.3649!3d28.6280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce50000000001%3A0x123456789abcdef!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export const SERVICES: ServiceCardItem[] = [
  {
    id: "flutter-app-development",
    title: "Flutter Cross-Platform App Development",
    shortDesc: "Single-codebase Google Flutter apps for iOS & Android with native 60fps UI performance.",
    fullDesc: "Engineered with Dart and Flutter OS engine for fast cross-platform rendering across mobile devices.",
    iconName: "Smartphone",
    tag: "Flutter 60fps"
  },
  {
    id: "react-native-app-development",
    title: "React Native Mobile App Engineering",
    shortDesc: "Cross-platform iOS & Android mobile apps built on React, JavaScript, and TypeScript bridges.",
    fullDesc: "High-performance React Native app builds with offline state persistence, Redux Toolkit, and native bridges.",
    iconName: "Code",
    tag: "React Native"
  },
  {
    id: "android-app-development",
    title: "Native Android App Development (Kotlin)",
    shortDesc: "Custom Android apps built with Kotlin, Jetpack Compose, and Material Design 3 UI components.",
    fullDesc: "Native Android software tailored for Google Play Store compliance, background services, and hardware GPS.",
    iconName: "Smartphone",
    tag: "Native Kotlin"
  },
  {
    id: "ios-app-development",
    title: "Native iOS App Development (Swift)",
    shortDesc: "Premium iPhone & iPad applications built using Swift 6, SwiftUI, and iOS HIG interface standards.",
    fullDesc: "Custom native iOS development optimized for Apple App Store review checklists, FaceID, and Apple Pay.",
    iconName: "Globe",
    tag: "Native Swift"
  }
];

export const TECH_STACK: TechItem[] = [
  { name: "Flutter", category: "Cross-Platform", desc: "60fps High Performance Mobile UI" },
  { name: "React Native", category: "Cross-Platform", desc: "TypeScript & Native Bridge Architecture" },
  { name: "Kotlin", category: "Android Native", desc: "Jetpack Compose & Modern Android SDKs" },
  { name: "Swift", category: "iOS Native", desc: "SwiftUI, Combine Framework & iOS HIG" },
  { name: "Node.js", category: "Mobile Backend", desc: "Scalable REST APIs & WebSockets" },
  { name: "Firebase / Supabase", category: "BaaS", desc: "Authentication, FCM Push Alerts & Realtime DB" }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Codelura Technologies built our Flutter mobile app in 4 weeks. The app performs smoothly on both Android and iOS with instant push notifications and Razorpay UPI payments.",
    author: "Rohan Verma",
    role: "Co-Founder",
    company: "FitNoida D2C",
    location: "Sector 18, Noida",
    rating: 5
  },
  {
    quote: "Their team engineered our corporate workforce mobile app with offline SQLite sync for field engineers across Greater Noida. Highly professional team.",
    author: "Ananya Saxena",
    role: "Head of Digital",
    company: "Logix Tech Systems",
    location: "Sector 62, Noida",
    rating: 5
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Why choose Codelura Technologies for mobile app development in Noida?",
    answer: "Codelura Technologies offers Google Senior Engineer-grade app development. We build 60fps Flutter, React Native, and native Kotlin/Swift mobile apps with sub-second API speeds, offline sync, biometric security, and full Apple App Store / Google Play Store publishing management."
  },
  {
    question: "How long does it take to develop a mobile application in Noida?",
    answer: "A Minimum Viable Product (MVP) cross-platform app (Flutter or React Native) typically takes 3 to 5 weeks. Complex enterprise mobile apps with custom backends take 6 to 10 weeks."
  },
  {
    question: "Do you handle App Store and Play Store app publishing?",
    answer: "Yes, 100%. We handle developer account setup, app store guidelines compliance, provisioning profiles, store screenshots, privacy policies, and app submission."
  }
];
