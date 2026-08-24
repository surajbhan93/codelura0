// app/career/jobs/premium/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Zap,
  Crown,
  Sparkles,
  Rocket,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  Lightbulb,
  HeartHandshake,
  Briefcase,
  Users,
  Target,
  Award,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PremiumPlan {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  discountedPrice?: number;
  durationInMonths?: number;
  shortDescription?: string;
  features?: string[];
  bannerImage?: string;
  badge?: string;
  isRecommended?: boolean;
}

// ============================================
// DATA FETCHING
// ============================================
async function getAllPremiumPlans() {
  try {
    
const res = await fetch("https://career.codelura.com/api/premium/plans", {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    return data.plans || [];
  } catch (error) {
    console.error("Error fetching premium plans:", error);
    return [];
  }
}

// ============================================
// COMPONENTS
// ============================================

// ─── Premium Plan Card ───
const PremiumPlanCard = ({ plan }: { plan: PremiumPlan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount
    ? Math.round(((plan.price - (plan.discountedPrice as number)) / plan.price) * 100)
    : 0;

  const getColorScheme = (plan: PremiumPlan) => {
    const category = plan.category?.toLowerCase() || "";
    
    if (category === "linkedin") {
      return {
        border: "border-blue-200",
        bg: "bg-blue-50/60",
        btn: "bg-blue-600 hover:bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
        iconBg: "bg-blue-100 text-blue-600",
        gradient: "from-blue-600 to-indigo-600",
        shadow: "shadow-blue-600/30",
        text: "text-blue-600",
        categoryLabel: "LinkedIn",
      };
    }
    if (category === "referral") {
      return {
        border: "border-purple-200",
        bg: "bg-purple-50/60",
        btn: "bg-purple-600 hover:bg-purple-500",
        badge: "bg-purple-100 text-purple-700",
        iconBg: "bg-purple-100 text-purple-600",
        gradient: "from-purple-600 to-indigo-600",
        shadow: "shadow-purple-600/30",
        text: "text-purple-600",
        categoryLabel: "Referral",
      };
    }
    if (category === "resume" || category === "cv") {
      return {
        border: "border-emerald-200",
        bg: "bg-emerald-50/60",
        btn: "bg-emerald-600 hover:bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
        iconBg: "bg-emerald-100 text-emerald-600",
        gradient: "from-emerald-600 to-teal-600",
        shadow: "shadow-emerald-600/30",
        text: "text-emerald-600",
        categoryLabel: "Resume",
      };
    }
    if (category === "other") {
      return {
        border: "border-amber-200",
        bg: "bg-amber-50/60",
        btn: "bg-amber-600 hover:bg-amber-500",
        badge: "bg-amber-100 text-amber-700",
        iconBg: "bg-amber-100 text-amber-600",
        gradient: "from-amber-600 to-orange-600",
        shadow: "shadow-amber-600/30",
        text: "text-amber-600",
        categoryLabel: "Other",
      };
    }
    return {
      border: "border-slate-200",
      bg: "bg-slate-50/60",
      btn: "bg-slate-600 hover:bg-slate-500",
      badge: "bg-slate-100 text-slate-700",
      iconBg: "bg-slate-100 text-slate-600",
      gradient: "from-slate-600 to-slate-700",
      shadow: "shadow-slate-600/30",
      text: "text-slate-600",
      categoryLabel: "Premium",
    };
  };

  const colors = getColorScheme(plan);

  const getIcon = (plan: PremiumPlan): LucideIcon => {
    const category = plan.category?.toLowerCase() || "";
    if (category === "linkedin") return Users;
    if (category === "referral") return Briefcase;
    if (category === "resume" || category === "cv") return Award;
    if (category === "other") return Zap;
    return Crown;
  };

  const IconComponent = getIcon(plan);

  const getCategoryEmoji = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat === "linkedin") return "💼";
    if (cat === "referral") return "🎯";
    if (cat === "resume" || cat === "cv") return "📄";
    if (cat === "other") return "⚡";
    return "⭐";
  };

  const isRecommended =
    plan.isRecommended || plan.badge === "Popular" || plan.badge === "Recommended";

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300 hover:-translate-y-2 ${colors.border} ${colors.bg} hover:shadow-xl ${
        isRecommended ? "shadow-lg" : ""
      }`}
    >
      {isRecommended && (
        <>
          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r ${colors.gradient} px-4 py-1 text-xs font-bold text-white shadow-lg ${colors.shadow} whitespace-nowrap`}>
            ⭐ Most Popular
          </span>
          <div className="absolute -right-1 -top-1">
            <div className="h-16 w-16 overflow-hidden">
              <div className={`absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-gradient-to-r ${colors.gradient} opacity-20`} />
            </div>
          </div>
        </>
      )}

      <div className="absolute right-4 top-4">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${colors.badge}`}>
          {getCategoryEmoji(plan.category || "")} {colors.categoryLabel}
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}
        >
          {plan.durationInMonths 
            ? `${plan.durationInMonths} Month${plan.durationInMonths > 1 ? 's' : ''}`
            : 'One-Time'
          }
        </span>
      </div>

      <h2 className="text-xl font-bold text-slate-900">{plan.title}</h2>
      {plan.shortDescription && (
        <p className="mb-4 text-sm text-slate-500">{plan.shortDescription}</p>
      )}

      <div className="mb-6 flex items-baseline gap-1.5">
        <span className={`text-4xl font-black ${colors.text}`}>₹{actualPrice}</span>
        {plan.durationInMonths ? (
          <span className="text-sm text-slate-400">
            / {plan.durationInMonths} month{plan.durationInMonths > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-sm text-slate-400">/ one-time</span>
        )}
      </div>

      {hasDiscount && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Save {discountPercent}% • ₹{plan.price - (plan.discountedPrice as number)} off
        </div>
      )}

      {(plan.features?.length ?? 0) > 0 && (
        <ul className="mb-8 flex-1 space-y-3">
          {plan.features!.slice(0, 6).map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
              <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${colors.text}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Redirect to /premium/[slug] */}
      <Link
        href={`/premium/${plan.slug}`}
        className={`block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.btn}`}
      >
        View Details
        <ArrowRight className="ml-2 inline-block h-4 w-4" />
      </Link>
    </div>
  );
};

// ─── Skeleton Loader ───
const PlansSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
        <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
        <div className="mb-6 h-10 w-1/3 rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
        </div>
        <div className="mt-8 h-12 w-full rounded-xl bg-slate-200" />
      </div>
    ))}
  </div>
);

// ─── Filter Component ───
const PremiumFilter = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: { 
  categories: string[]; 
  activeCategory: string; 
  setActiveCategory: (category: string) => void;
}) => {
  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || "";
    if (cat === "linkedin") return "💼";
    if (cat === "referral") return "🎯";
    if (cat === "resume" || cat === "cv") return "📄";
    if (cat === "other") return "⚡";
    return "⭐";
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setActiveCategory("all")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          activeCategory === "all"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
        }`}
      >
        <LayoutGrid className="mr-2 inline-block h-4 w-4" />
        All Plans
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
};

// ─── Stats Section ───
const STATS = [
  { value: "10,000+", label: "Profiles Optimized" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "50+", label: "Industries Covered" },
  { value: "95%", label: "Success Rate" },
];

const StatsSection = () => (
  <section className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center text-white">
            <div className="text-4xl font-black">{stat.value}</div>
            <div className="mt-1 text-sm font-light text-blue-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Testimonials ───
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Product Manager",
    text: "The premium services completely transformed my career. From LinkedIn optimization to job referrals, everything was top-notch!",
    rating: 5,
    service: "LinkedIn Review",
  },
  {
    name: "Rahul Verma",
    role: "Strategy Consultant",
    text: "Got referred to my dream company through this platform. The process was seamless and the results were amazing!",
    rating: 5,
    service: "Job Referral",
  },
  {
    name: "Ananya Reddy",
    role: "Design Lead",
    text: "The resume review service helped me land interviews at top design agencies. Highly recommended for anyone looking to grow.",
    rating: 5,
    service: "Resume Review",
  },
];

// ─── FAQs ───
const FAQS = [
  {
    q: "What services do you offer?",
    a: "We offer comprehensive career services including LinkedIn profile reviews, job referrals, resume reviews, CV optimization, and more.",
  },
  {
    q: "How do I choose the right plan?",
    a: "Browse through our plans and select the one that best fits your career goals. Each plan is designed for specific needs.",
  },
  {
    q: "Are the services guaranteed?",
    a: "We offer a 100% satisfaction guarantee on all our premium services. If you're not satisfied, we'll work to make it right.",
  },
  {
    q: "How quickly will I see results?",
    a: "Results vary by service. LinkedIn reviews show improvements within 2-4 weeks, while referrals can get you interviews within days.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, we offer a money-back guarantee if you're not satisfied with our services. Contact our support team for assistance.",
  },
  {
    q: "Do you work with all industries?",
    a: "Yes, we have experts and referral networks across 50+ industries including Technology, Finance, Healthcare, and more.",
  },
];

// ============================================
// MAIN PAGE
// ============================================
export default function PremiumPage() {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  // Get unique categories
  const categories = Array.from(
    new Set(plans.map((plan) => plan.category?.toLowerCase()).filter(Boolean))
  );

  // Filter plans based on active category
  const filteredPlans = activeCategory === "all"
    ? plans
    : plans.filter((plan) => plan.category?.toLowerCase() === activeCategory);

  // ✅ Fixed: Use useEffect instead of useState
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPremiumPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error loading plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f5ef]">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <PlansSkeleton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-400/30 bg-blue-900/30 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              🚀 Premium Career Services
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              Premium
            </span>{" "}
            Career Plans
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-blue-100 sm:text-lg">
            Accelerate your career with our premium services. Get expert reviews, job referrals, 
            and personalized guidance to land your dream role.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-blue-300">
              <BadgeCheck className="h-5 w-5" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Shield className="h-5 w-5" />
              <span>100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <Clock className="h-5 w-5" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <HeartHandshake className="h-5 w-5" />
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANS SECTION ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3 w-3" />
              Choose Your Plan
            </span>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              All <span className="text-blue-600">Premium</span> Services
            </h2>
            <p className="mt-2 text-slate-600">
              Select from our comprehensive range of career advancement services
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mb-4 text-6xl">🚀</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                No Premium Plans Available
              </h3>
              <p className="text-slate-500">
                We&apos;re preparing exciting new premium services for you. Check back soon!
              </p>
              <Link href="/career" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                ← Browse Career Resources
              </Link>
            </div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="mb-8">
                  <PremiumFilter 
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <PremiumPlanCard key={plan._id} plan={plan} />
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <p className="text-slate-500">No plans found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <StatsSection />

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Star className="h-3 w-3 fill-emerald-500" />
              Success Stories
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              What Our <span className="text-emerald-600">Community Says</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-[#f9f5ef] p-6 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{testimonial.text}</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="bg-[#f9f5ef] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <Lightbulb className="h-3 w-3" />
              Got Questions?
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Frequently Asked <span className="text-purple-600">Questions</span>
            </h2>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group px-6 py-5 first:rounded-t-2xl last:rounded-b-2xl">
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none hover:text-blue-600">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition duration-300 group-open:rotate-45">
                      <span className="text-xl font-light">+</span>
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              Still have questions? We&apos;re here to help!
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:support@codelura.com"
                className="inline-flex items-center gap-2 text-sm text-blue-600 transition hover:text-blue-700"
              >
                <Mail className="h-4 w-4" />
                support@codelura.com
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="tel:+919330456710"
                className="inline-flex items-center gap-2 text-sm text-blue-600 transition hover:text-blue-700"
              >
                <Phone className="h-4 w-4" />
                +91 9330456710
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-blue-600 transition hover:text-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to <span className="text-blue-200">Accelerate</span> Your Career?
          </h2>
          <p className="mt-2 text-blue-100">
            Choose the right premium service and take the next step in your career journey.
          </p>
          <Link
            href={plans.length > 0 ? `/premium/${plans[0]?.slug}` : "/career"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 transition hover:scale-[1.02] hover:shadow-xl"
          >
            Explore Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}