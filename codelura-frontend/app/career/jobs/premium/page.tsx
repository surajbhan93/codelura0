// app/career/jobs/premium/job-referral/page.tsx
import { Suspense } from "react";
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
  Users,
  Briefcase,
  Target,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ✅ ISR - Revalidate every 1 hour
export const revalidate = 3600;

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
// DATA FETCHING (Server Side)
// ============================================
async function getJobReferralPlans() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.codelura.com/api";
    const res = await fetch(`${apiUrl}/premium/plans`, {
      next: { revalidate: 3600 },
    });
    
    // ✅ Error handling for fetch
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    const plans: PremiumPlan[] = data.plans || [];

    // ✅ Filter for referral AND other categories
    return plans.filter(
      (plan: PremiumPlan) => {
        const category = plan.category?.toLowerCase() || "";
        return category === "referral" || category === "other";
      }
    );
  } catch (error) {
    console.error("Error fetching job referral plans:", error);
    return [];
  }
}
// ============================================
// COMPONENTS
// ============================================

// ─── Job Referral Plan Card ───
const ReferralPlanCard = ({ plan }: { plan: PremiumPlan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount
    ? Math.round(((plan.price - (plan.discountedPrice as number)) / plan.price) * 100)
    : 0;

  // Color mapping based on plan name
  const getColorScheme = (plan: PremiumPlan) => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return {
        border: "border-purple-200",
        bg: "bg-purple-50/60",
        btn: "bg-purple-600 hover:bg-purple-500",
        badge: "bg-purple-100 text-purple-700",
        iconBg: "bg-purple-100 text-purple-600",
        gradient: "from-purple-600 to-indigo-600",
        shadow: "shadow-purple-600/30",
        text: "text-purple-600",
      };
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return {
        border: "border-blue-200",
        bg: "bg-blue-50/60",
        btn: "bg-blue-600 hover:bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
        iconBg: "bg-blue-100 text-blue-600",
        gradient: "from-blue-600 to-indigo-600",
        shadow: "shadow-blue-600/30",
        text: "text-blue-600",
      };
    }
    return {
      border: "border-emerald-200",
      bg: "bg-emerald-50/60",
      btn: "bg-emerald-600 hover:bg-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-600",
      gradient: "from-emerald-600 to-teal-600",
      shadow: "shadow-emerald-600/30",
      text: "text-emerald-600",
    };
  };

  const colors = getColorScheme(plan);

  // Icon mapping
  const getIcon = (plan: PremiumPlan): LucideIcon => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return Crown;
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return Rocket;
    }
    return Briefcase;
  };

  const IconComponent = getIcon(plan);

  // Best for mapping - Referral specific
  const getBestFor = (plan: PremiumPlan) => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return "For leadership roles";
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return "For career growth";
    }
    return "For quick referrals";
  };

  // Highlight if plan is recommended
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

      {/* Icon & Badge */}
      <div className="mb-4 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg}`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}
        >
          {getBestFor(plan)}
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

      <Link
        href={`/career/jobs/premium/${plan.slug}`}
        className={`block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.btn}`}
      >
        Get Referral Now
        <ArrowRight className="ml-2 inline-block h-4 w-4" />
      </Link>
    </div>
  );
};

// ─── Skeleton Loader ───
const PlansSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="h-6 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
        <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
        <div className="mb-6 h-10 w-1/3 rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="mt-8 h-12 w-full rounded-xl bg-slate-200" />
      </div>
    ))}
  </div>
);

// ─── Stats Section ───
const STATS = [
  { value: "85%", label: "Referral Success Rate" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "5,000+", label: "Referrals Generated" },
  { value: "50+", label: "Partner Companies" },
];

const StatsSection = () => (
  <section className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="text-center text-white">
            <div className="text-4xl font-black">{stat.value}</div>
            <div className="mt-1 text-sm font-light text-purple-100">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Industries Covered ───
const INDUSTRIES = [
  { name: "Technology", icon: "💻", count: "200+ companies" },
  { name: "Finance", icon: "💰", count: "80+ companies" },
  { name: "Healthcare", icon: "🏥", count: "60+ companies" },
  { name: "Design", icon: "🎨", count: "45+ companies" },
  { name: "Marketing", icon: "📊", count: "70+ companies" },
  { name: "Core Engineering", icon: "⚙️", count: "90+ companies" },
  { name: "Consulting", icon: "📈", count: "55+ companies" },
  { name: "Data Science", icon: "📊", count: "65+ companies" },
];

// ─── Testimonials ───
const TESTIMONIALS = [
  {
    name: "Sneha Patel",
    role: "Software Engineer at Google (via Referral)",
    text: "The referral program connected me with an employee at Google. Within 2 weeks, I had my first interview and got the job! Best investment ever.",
    rating: 5,
    industry: "Technology",
  },
  {
    name: "Vikram Singh",
    role: "Product Manager at Amazon (via Referral)",
    text: "I was struggling to get past the resume screening. The referral service got my profile directly to hiring managers. Landed my dream role at Amazon!",
    rating: 5,
    industry: "Technology",
  },
  {
    name: "Deepa Krishnan",
    role: "Data Scientist at Microsoft (via Referral)",
    text: "The expert matched me with the perfect referrer. My application was fast-tracked and I got interview calls within days. Highly recommend!",
    rating: 5,
    industry: "Data Science",
  },
];

// ─── FAQs ───
const FAQS = [
  {
    q: "How does the job referral service work?",
    a: "We connect you with employees at your target companies who can refer you for open positions. This significantly increases your chances of getting an interview.",
  },
  {
    q: "Which companies do you have referrals for?",
    a: "We have referral networks across 50+ companies including FAANG, top startups, consulting firms, and more. Our network is constantly growing.",
  },
  {
    q: "How long does it take to get a referral?",
    a: "Most referrals are completed within 3-7 days. You'll be matched with a referrer who will review your profile and submit the referral.",
  },
  {
    q: "Is the referral service guaranteed?",
    a: "We ensure that a referral is submitted for your application. While we can't guarantee a job offer, our success rate is over 85%.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 100% satisfaction guarantee. If we can't find a suitable referrer for you, we'll provide a full refund.",
  },
  {
    q: "What if I'm not in tech?",
    a: "We have referral networks across all industries including Finance, Healthcare, Consulting, Design, Marketing, and more.",
  },
];

// ============================================
// MAIN PAGE (Server Component)
// ============================================
export default async function JobReferralPage() {
  const plans = await getJobReferralPlans();

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 px-6 py-20 sm:py-28">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-purple-400/30 bg-purple-900/30 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-300">
              🚀 Get Referrals to Top Companies
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-indigo-200 bg-clip-text text-transparent">
              Job Referral
            </span>{" "}
            Service
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-purple-100 sm:text-lg">
            Get referred to top companies by employees who can fast-track your application. 
            Skip the resume black hole and land interviews faster.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-purple-300">
              <Users className="h-5 w-5" />
              <span>500+ Referrers</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Target className="h-5 w-5" />
              <span>85% Success Rate</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Clock className="h-5 w-5" />
              <span>3-7 Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Award className="h-5 w-5" />
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANS SECTION ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <Sparkles className="h-3 w-3" />
              Choose Your Plan
            </span>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="text-purple-600">Job Referral</span> Packages
            </h2>
            <p className="mt-2 text-slate-600">
              Select the plan that best fits your career goals and target companies
            </p>
          </div>

          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mb-4 text-6xl">🎯</div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  No Job Referral Plans Available
                </h3>
                <p className="text-slate-500">
                  We&apos;re expanding our referral network to more companies. Check back soon for 
                  personalized referral packages!
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/career/jobs/premium" className="text-purple-600 hover:text-purple-700">
                    ← Browse All Plans
                  </Link>
                  <Link href="/contact" className="rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                    Contact Us
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <ReferralPlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <StatsSection />

      {/* ─── INDUSTRY COVERAGE ─── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <Building2 className="h-3 w-3" />
              Company Coverage
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Referrals From <span className="text-purple-600">Top Companies</span>
            </h2>
            <p className="mt-2 text-slate-600">
              Get connected with employees at these leading organizations
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry.name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition hover:border-purple-300 hover:bg-purple-50/30"
              >
                <span className="mb-1 text-2xl">{industry.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{industry.name}</span>
                <span className="text-xs text-slate-400">{industry.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-[#f9f5ef] px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              <Star className="h-3 w-3 fill-emerald-500" />
              Success Stories
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Real <span className="text-emerald-600">Referral Success</span> Stories
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
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
                  <span className="mt-1 inline-block rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600">
                    {testimonial.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="bg-white px-6 py-16">
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
                <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 marker:content-none hover:text-purple-600">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition duration-300 group-open:rotate-45">
                      <span className="text-xl font-light">+</span>
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              Still have questions? We&apos;re here to help!
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:support@codelura.com"
                className="inline-flex items-center gap-2 text-sm text-purple-600 transition hover:text-purple-700"
              >
                <Mail className="h-4 w-4" />
                support@codelura.com
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="tel:+919330456710"
                className="inline-flex items-center gap-2 text-sm text-purple-600 transition hover:text-purple-700"
              >
                <Phone className="h-4 w-4" />
                +91 9330456710
              </a>
              <span className="text-slate-300">|</span>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-purple-600 transition hover:text-purple-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-3xl font-bold">
            Ready to <span className="text-purple-200">Get Referred</span> to Your Dream Company?
          </h2>
          <p className="mt-2 text-purple-100">
            Skip the application black hole. Get your profile directly to hiring managers.
          </p>
          <Link
            href={plans.length > 0 ? `/career/jobs/premium/${plans[0]?.slug}` : "/career/jobs/premium"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-purple-700 transition hover:scale-[1.02] hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}