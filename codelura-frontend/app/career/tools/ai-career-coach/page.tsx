// app/ai-career-coach/page.tsx (Server Component)
import Link from 'next/link';
import { Suspense, lazy } from 'react';
import { Metadata } from 'next';
import { 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// ─── Metadata ───
export const metadata: Metadata = {
  title: 'AI Career Coach - Personal Career Assistant | Codelura',
  description: 'Get personalized career advice, resume feedback, and job search strategies powered by advanced AI. Launching soon!',
  keywords: 'AI career coach, career advice, resume feedback, job search, career guidance, AI assistant',
  openGraph: {
    title: 'AI Career Coach - Personal Career Assistant | Codelura',
    description: 'Get personalized career advice, resume feedback, and job search strategies powered by advanced AI.',
    url: 'https://codelura.com/ai-career-coach',
    siteName: 'Codelura',
    images: [
      {
        url: 'https://codelura.com/og-ai-coach.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Career Coach - Codelura',
    description: 'AI-powered career guidance for professionals',
    images: ['https://codelura.com/og-ai-coach.jpg'],
  },
};

// ─── Static Data (Moved outside component) ───
const FEATURES = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "24/7 AI Chat Support",
    description: "Get instant answers to your career questions anytime, anywhere with our intelligent AI assistant."
  },
  {
    icon: DocumentTextIcon,
    title: "Smart Resume Analysis",
    description: "Receive detailed feedback on your resume with actionable suggestions to improve your chances."
  },
  {
    icon: ChartBarIcon,
    title: "Skill Gap Analysis",
    description: "Identify skill gaps and get personalized learning recommendations for career advancement."
  },
  {
    icon: LightBulbIcon,
    title: "Interview Preparation",
    description: "Practice with AI-powered mock interviews tailored to your target role and industry."
  },
  {
    icon: UserGroupIcon,
    title: "Career Path Planning",
    description: "Map out your career trajectory with AI-powered insights and market trend analysis."
  },
  {
    icon: ShieldCheckIcon,
    title: "Salary & Market Insights",
    description: "Get data-driven salary benchmarks and market insights for your role and location."
  }
];

const STEPS = [
  {
    title: "Tell Us About You",
    description: "Share your goals, experience, and preferences"
  },
  {
    title: "AI Analysis",
    description: "Our AI processes your profile and goals"
  },
  {
    title: "Get Recommendations",
    description: "Receive personalized career strategies"
  },
  {
    title: "Track Progress",
    description: "Monitor your growth and adjust your plan"
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    quote: "AI Career Coach helped me land my dream job at Google!",
    rating: 5
  },
  {
    name: "Michael R.",
    role: "Product Manager",
    quote: "The resume feedback was incredibly detailed and actionable.",
    rating: 5
  },
  {
    name: "Priya D.",
    role: "Data Scientist",
    quote: "Completely transformed my job search strategy.",
    rating: 5
  }
];

// ─── Server Components ───

// Announcement Bar
function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
      <span className="inline-flex items-center gap-2">
        <SparklesIcon className="w-4 h-4 animate-pulse" />
        Coming Soon: AI Career Coach — Your Personal Career Assistant
        <SparklesIcon className="w-4 h-4 animate-pulse" />
      </span>
    </div>
  );
}

// Header Section
function HeaderSection() {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <SparklesIcon className="w-4 h-4" />
        AI-Powered Career Guidance
      </div>
      
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Your Personal{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Career Coach
        </span>
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Get personalized career advice, resume feedback, and job search strategies — 
        all powered by advanced AI tailored to your goals.
      </p>

      <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-full px-6 py-3 mb-12">
        <ClockIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Launching in</span>
        <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
          15 days
        </span>
      </div>

      <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-16">
        <span>Get Notified When Live</span>
        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
        </span>
      </button>
    </div>
  );
}

// Features Grid
function FeaturesGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div 
            key={index}
            className="group bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// How It Works Section
function HowItWorksSection() {
  return (
    <div className="bg-white dark:bg-gray-800/30 rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-700 mb-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
        How It Works
      </h2>
      <div className="grid md:grid-cols-4 gap-6">
        {STEPS.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
              {index + 1}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {step.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Section
function TestimonialsSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-16">
      {TESTIMONIALS.map((testimonial, index) => (
        <div key={index} className="bg-white dark:bg-gray-800/50 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            &quot;{testimonial.quote}&quot;
          </p>
          <p className="text-xs text-gray-400 mt-2">
            — {testimonial.name}, {testimonial.role}
          </p>
        </div>
      ))}
    </div>
  );
}

// CTA Section
function CTASection() {
  return (
    <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Supercharge Your Career?
      </h2>
      <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
        Join thousands of professionals who are leveling up their careers with AI-powered guidance.
      </p>
      <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
        Join the Waitlist
      </button>
    </div>
  );
}

// ─── Loading Skeleton ───
function AICareerCoachSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-indigo-200 dark:bg-indigo-800/30 rounded-full animate-pulse mx-auto mb-6" />
          <div className="h-16 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto" />
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mt-4" />
          <div className="h-12 w-64 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto mt-8" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-white dark:bg-gray-800/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE (Server Component) ───
export default function AICareerCoachPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={<AICareerCoachSkeleton />}>
        {/* ─── Announcement Bar ─── */}
        <AnnouncementBar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* ─── Header ─── */}
          <HeaderSection />

          {/* ─── Features ─── */}
          <FeaturesGrid />

          {/* ─── How It Works ─── */}
          <HowItWorksSection />

          {/* ─── Testimonials ─── */}
          <TestimonialsSection />

          {/* ─── CTA ─── */}
          <CTASection />

          {/* ─── Footer Navigation ─── */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex gap-6">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Home
              </Link>
              <Link href="/career-tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Career Tools
              </Link>
              <Link href="/mentorship" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Mentorship
              </Link>
            </div>
            <span>© 2026 Codelura. All rights reserved.</span>
          </div>
        </div>
      </Suspense>
    </div>
  );
}