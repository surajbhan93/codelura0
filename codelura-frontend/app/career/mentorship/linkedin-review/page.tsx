// app/career/jobs/premium/linkedin-review/page.tsx
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
async function getLinkedInReviewPlans() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.codelura.com/api";
    const res = await fetch(`${apiUrl}/premium/plans`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    const plans: PremiumPlan[] = data.plans || [];

    // ✅ Filter for linkedin-review category (removed duplicate condition)
    return plans.filter(
      (plan: PremiumPlan) =>
        plan.category === "linkedin" || plan.category === "linkedin"
    );
  } catch (error) {
    console.error("Error fetching LinkedIn review plans:", error);
    return [];
  }
}

// ============================================
// COMPONENTS
// ============================================

// ─── LinkedIn Review Plan Card ───
const LinkedInPlanCard = ({ plan }: { plan: PremiumPlan }) => {
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
        border: "border-emerald-200",
        bg: "bg-emerald-50/60",
        btn: "bg-emerald-600 hover:bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
        iconBg: "bg-emerald-100 text-emerald-600",
      };
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return {
        border: "border-blue-200",
        bg: "bg-blue-50/60",
        btn: "bg-blue-600 hover:bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
        iconBg: "bg-blue-100 text-blue-600",
      };
    }
    return {
      border: "border-sky-200",
      bg: "bg-sky-50/60",
      btn: "bg-sky-600 hover:bg-sky-500",
      badge: "bg-sky-100 text-sky-700",
      iconBg: "bg-sky-100 text-sky-600",
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
    return Zap;
  };

  const IconComponent = getIcon(plan);

  // Best for mapping
  const getBestFor = (plan: PremiumPlan) => {
    const name = plan.title?.toLowerCase() || "";
    if (name.includes("advanced") || name.includes("executive") || name.includes("premium")) {
      return "For leadership visibility";
    }
    if (name.includes("growth") || name.includes("pro") || name.includes("standard")) {
      return "For career growth";
    }
    return "For quick profile boost";
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
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-blue-600/30 whitespace-nowrap">
            ⭐ Most Popular
          </span>
          <div className="absolute -right-1 -top-1">
            <div className="h-16 w-16 overflow-hidden">
              <div className="absolute -right-8 -top-8 h-20 w-20 rotate-45 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20" />
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
        <span className="text-4xl font-black text-blue-600">₹{actualPrice}</span>
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
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/career/mentorship/linkedin-review/${plan.slug}`}
        className={`block w-full rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colors.btn}`}
      >
        Get Started Now
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
  { value: "95%", label: "Profile Visibility Increase" },
  { value: "4.9/5", label: "Average Rating" },
  { value: "8,000+", label: "Profiles Optimized" },
  { value: "30+", label: "Industries Covered" },
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

// ─── Industries Covered ───
const INDUSTRIES = [
  { name: "Technology", icon: "💻", count: "200+ experts" },
  { name: "Finance", icon: "💰", count: "80+ experts" },
  { name: "Healthcare", icon: "🏥", count: "60+ experts" },
  { name: "Design", icon: "🎨", count: "45+ experts" },
  { name: "Marketing", icon: "📊", count: "70+ experts" },
  { name: "Core Engineering", icon: "⚙️", count: "90+ experts" },
  { name: "Consulting", icon: "📈", count: "55+ experts" },
  { name: "Data Science", icon: "📊", count: "65+ experts" },
];

// ─── Testimonials ───
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Product Manager at FinTech Startup",
    text: "My LinkedIn profile was completely overhauled! Within 2 weeks, I started receiving messages from recruiters at top companies. Best investment in my career.",
    rating: 5,
    industry: "Technology",
  },
  {
    name: "Rahul Verma",
    role: "Senior Analyst → Strategy Consultant",
    text: "I was getting zero recruiter calls. After the LinkedIn review, my profile started appearing in searches. Got 5 interview calls in the first month!",
    rating: 5,
    industry: "Consulting",
  },
  {
    name: "Ananya Reddy",
    role: "Design Lead at Global Agency",
    text: "The expert knew exactly what recruiters look for. My headline and summary rewrite made a huge difference. Now my profile looks professional and stands out.",
    rating: 5,
    industry: "Design",
  },
];

// ─── FAQs ───
const FAQS = [
  {
    q: "What's included in the LinkedIn review?",
    a: "Complete profile audit including headline, summary, experience section, skills, recommendations, and overall visibility optimization. We also provide keyword optimization for recruiter searches.",
  },
  {
    q: "How long does the review take?",
    a: "Most reviews are completed within 24-48 hours. You'll receive a detailed report with specific recommendations and optimized content to copy-paste.",
  },
  {
    q: "Who conducts the review?",
    a: "We match you with an industry expert who has deep knowledge of LinkedIn algorithms and recruiter behavior in your specific industry.",
  },
  {
    q: "Will I get recruiter attention after the review?",
    a: "Yes! Our optimization increases your visibility in recruiter searches significantly. Most clients receive recruiter messages within 2-4 weeks.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 100% satisfaction guarantee. If you're not happy with the review, we'll refund your payment or provide a free redo.",
  },
  {
    q: "What if I'm not in a tech role?",
    a: "We have experts across 30+ industries including Finance, Healthcare, Design, Marketing, Core Engineering, Consulting, and more.",
  },
];

// ============================================
// MAIN PAGE (Server Component)
// ============================================
export default async function LinkedInReviewPage() {
  const plans = await getLinkedInReviewPlans();

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 px-6 py-20 sm:py-28">
        {/* Background elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-400/30 bg-blue-900/30 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              💼 Get Noticed by Recruiters
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              LinkedIn
            </span>{" "}
            Profile Review
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-blue-100 sm:text-lg">
            Optimize your LinkedIn profile to attract recruiters, land interviews, and advance your
            career. Get expert feedback and actionable recommendations.
          </p>

          {/* Quick stats */}
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
              <span>24-48 hr Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <HeartHandshake className="h-5 w-5" />
              <span>Refund Guarantee</span>
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
              <span className="text-blue-600">LinkedIn</span> Optimization Packages
            </h2>
            <p className="mt-2 text-slate-600">
              Select the plan that best fits your career goals and visibility needs
            </p>
          </div>

          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <div className="mb-4 text-6xl">💼</div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  No LinkedIn Review Plans Available
                </h3>
                <p className="text-slate-500">
                  We&apos;re preparing new LinkedIn optimization packages for you. Check back soon!
                </p>
                <Link href="/premium" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                  ← Browse All Plans
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <LinkedInPlanCard key={plan._id} plan={plan} />
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
            <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              <Building2 className="h-3 w-3" />
              Industry Coverage
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Experts From <span className="text-blue-600">Every Industry</span>
            </h2>
            <p className="mt-2 text-slate-600">
              Get matched with an expert who understands your field
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry.name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-center transition hover:border-blue-300 hover:bg-blue-50/30"
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
              What Our <span className="text-emerald-600">Community Says</span>
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
                  <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
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

          {/* Contact Support */}
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
            Ready to <span className="text-blue-200">Get Noticed</span> by Recruiters?
          </h2>
          <p className="mt-2 text-blue-100">
            Optimize your LinkedIn profile today and attract the right opportunities.
          </p>
          <Link
            href={plans.length > 0 ? `/career/jobs/premium/${plans[0]?.slug}` : "/premium"}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 transition hover:scale-[1.02] hover:shadow-xl"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}