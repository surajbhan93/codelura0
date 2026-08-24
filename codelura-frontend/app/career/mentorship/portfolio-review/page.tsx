// app/career/jobs/premium/portfolio-review/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import CareerPromo from "@/components/career/CareerPromo";
import {
  Check,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";

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
async function getPortfolioReviewPlans() {
  try {
    const res =
     await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/premium/plans`,{
    
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    const plans: PremiumPlan[] = data.plans || [];

    return plans.filter(
      (plan: PremiumPlan) =>
        plan.category === "portfolio" ||
        plan.category === "portfolio" ||
        plan.category === "portfolio"
    );
  } catch (error) {
    console.error("Error fetching portfolio review plans:", error);
    return [];
  }
}

// ============================================
// COMPONENTS
// ============================================

// ─── Plan Card (single neutral accent, no per-tier color chaos) ───
const PortfolioReviewPlanCard = ({ plan }: { plan: PremiumPlan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount
    ? Math.round(((plan.price - (plan.discountedPrice as number)) / plan.price) * 100)
    : 0;

  const isRecommended =
    plan.isRecommended || plan.badge === "Popular" || plan.badge === "Recommended";

  return (
    <div
      className={`relative flex flex-col border p-8 transition-colors duration-200 ${
        isRecommended
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400"
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-8 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900">
          Recommended
        </span>
      )}

      <p className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isRecommended ? "text-slate-400" : "text-slate-400"}`}>
        Portfolio Review
      </p>
      <h2 className="text-2xl font-semibold">{plan.title}</h2>
      {plan.shortDescription && (
        <p className={`mt-2 text-sm leading-relaxed ${isRecommended ? "text-slate-300" : "text-slate-500"}`}>
          {plan.shortDescription}
        </p>
      )}

      <div className="my-6 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">₹{actualPrice}</span>
        {plan.durationInMonths ? (
          <span className="text-sm text-slate-400">
            / {plan.durationInMonths} month{plan.durationInMonths > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-sm text-slate-400">/ review</span>
        )}
      </div>

      {hasDiscount && (
        <div
          className={`mb-6 w-fit border px-2.5 py-1 text-xs font-medium ${
            isRecommended ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-500"
          }`}
        >
          Save {discountPercent}% · ₹{plan.price - (plan.discountedPrice as number)} off
        </div>
      )}

      {(plan.features?.length ?? 0) > 0 && (
        <ul
          className={`mb-8 flex-1 space-y-3 border-t border-dashed pt-6 ${
            isRecommended ? "border-slate-700" : "border-slate-200"
          }`}
        >
          {plan.features!.slice(0, 6).map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${isRecommended ? "text-white" : "text-slate-900"}`} />
              <span className={isRecommended ? "text-slate-200" : "text-slate-600"}>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/career/mentorship/portfolio-review/${plan.slug}`}
        className={`mt-auto flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold transition ${
          isRecommended
            ? "bg-white text-slate-900 hover:bg-slate-100"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

// ─── Skeleton Loader ───
const PlansSkeleton = () => (
  <div className="grid gap-px bg-slate-200 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-8 animate-pulse">
        <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
        <div className="mb-2 h-6 w-3/4 rounded bg-slate-200" />
        <div className="mb-6 h-4 w-1/2 rounded bg-slate-200" />
        <div className="mb-6 h-10 w-1/3 rounded bg-slate-200" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-5/6 rounded bg-slate-200" />
          <div className="h-4 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="mt-8 h-12 w-full rounded bg-slate-200" />
      </div>
    ))}
  </div>
);

// ─── Stats ───
const STATS = [
  { value: "90%", label: "Portfolios improved" },
  { value: "4.9/5", label: "Average rating" },
  { value: "8,000+", label: "Portfolios reviewed" },
  { value: "40+", label: "Fields covered" },
];

const StatsSection = () => (
  <section className="border-y border-slate-200 bg-white px-6 py-12">
    <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-4">
      {STATS.map((stat, idx) => (
        <div key={idx} className="text-center">
          <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

// ─── Portfolio Types Covered — plain, single tone, no rainbow ───
const PORTFOLIO_TYPES = [
  "Design",
  "Development",
  "Photography",
  "Data Science",
  "Product",
  "Marketing",
  "Architecture",
  "Writing",
];

// ─── Testimonials ───
const TESTIMONIALS = [
  {
    name: "Aditi Menon",
    role: "UX Designer, Product Startup",
    text: "The review completely reshaped how I presented my case studies. My reviewer pointed out gaps I hadn't noticed, and I started getting more interview calls within weeks.",
    rating: 5,
  },
  {
    name: "Karan Malhotra",
    role: "Full Stack Developer",
    text: "I always struggled to show my GitHub projects properly. The feedback helped me restructure my portfolio and highlight the right projects for recruiters.",
    rating: 5,
  },
  {
    name: "Sneha Iyer",
    role: "Data Analyst → Data Scientist",
    text: "My reviewer helped me turn a plain project list into a proper story with impact metrics. It made a real difference in how recruiters responded.",
    rating: 5,
  },
];

// ─── FAQs ───
const FAQS = [
  {
    q: "Which portfolio review plan should I choose?",
    a: "If you just need quick feedback on your current portfolio, go with the starter plan. If you want a deeper review with structural changes and project selection help, choose the standard plan. For senior-level portfolios, the advanced plan gives the most comprehensive support.",
  },
  {
    q: "Who reviews my portfolio?",
    a: "A verified professional with relevant industry experience in your field reviews it, so the feedback is practical and specific to what recruiters in your domain look for.",
  },
  {
    q: "What happens after I choose a plan?",
    a: "Submit your portfolio link or files along with your goals, and within 24-48 hours you'll receive detailed written feedback, plus a call if your plan includes one.",
  },
  {
    q: "Can I get a second round of review?",
    a: "Yes, higher-tier plans include a follow-up review after you've made changes based on the first round of feedback.",
  },
  {
    q: "What's the refund policy?",
    a: "We offer a full refund if requested before your review begins. Once the review has started, refunds are not applicable since the work has already been carried out.",
  },
  {
    q: "Is this only for design portfolios?",
    a: "Not at all. We review portfolios across Design, Development, Data Science, Product, Marketing, Architecture, Writing, and more.",
  },
];

// ============================================
// MAIN PAGE (Server Component)
// ============================================
export default async function PortfolioReviewPage() {
  const plans = await getPortfolioReviewPlans();

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO — light, editorial, no glow blobs ─── */}
      <section className="border-b border-slate-200 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Portfolio Review
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
            Get honest feedback before a recruiter ever sees your work.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500">
            A verified professional in your field reviews your portfolio and tells you exactly
            what to fix, cut, or reframe — no generic advice.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Verified reviewers
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> 24-48 hr turnaround
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" /> Refund before review starts
            </span>
          </div>
        </div>
      </section>

      {/* ─── PLANS ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-900">Choose a plan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each plan is built for a different level of depth and support.
            </p>
          </div>

          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className="border border-slate-200 p-12 text-center">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  No portfolio review plans available right now
                </h3>
                <p className="text-sm text-slate-500">
                  We&apos;re preparing new packages. Check back soon.
                </p>
                <Link href="/premium" className="mt-4 inline-block text-sm font-medium text-slate-900 underline">
                  Browse all plans
                </Link>
              </div>
            ) : (
              <div className="grid gap-px bg-slate-200 md:grid-cols-3">
                {plans.map((plan) => (
                  <PortfolioReviewPlanCard key={plan._id} plan={plan} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <StatsSection />

      {/* ─── PORTFOLIO TYPES — plain list, one tone ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-slate-900">Fields we cover</h2>
          <p className="mt-1 text-sm text-slate-500">
            Reviewers matched to your kind of work — no generic checklist feedback.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {PORTFOLIO_TYPES.map((type) => (
              <span
                key={type}
                className="border border-slate-200 px-4 py-2 text-sm text-slate-700"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <CareerPromo section={2} />
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-slate-900">What people say</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="border border-slate-200 bg-white p-6">
                <div className="mb-3 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-slate-900 text-slate-900" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600">{testimonial.text}</p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">Frequently asked questions</h2>

          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900 marker:content-none">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <a href="mailto:support@codelura.com" className="flex items-center gap-2 hover:text-slate-900">
              <Mail className="h-4 w-4" /> support@codelura.com
            </a>
            <a href="tel:+919330456710" className="flex items-center gap-2 hover:text-slate-900">
              <Phone className="h-4 w-4" /> +91 9330456710
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-slate-900">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-slate-200 bg-slate-900 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to fix what&apos;s holding your portfolio back?
          </h2>
          <p className="mt-2 text-slate-300">Get it reviewed today by a verified expert in your field.</p>
          <Link
            href={plans.length > 0 ? `/career/jobs/premium/${plans[0]?.slug}` : "/premium"}
            className="mt-6 inline-flex items-center gap-2 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}