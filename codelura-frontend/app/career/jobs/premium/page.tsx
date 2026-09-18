// app/career/jobs/premium/page.tsx
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
  Users,
  Briefcase,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import api from "@/lib/api";

export const revalidate = 300;

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

async function getJobReferralPlans() {
  try {
    const apiUrl = (api.defaults.baseURL || "https://api.codelura.com/api").replace(/\/$/, "");
    const res = await fetch(`${apiUrl}/premium/plans`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    const plans: PremiumPlan[] = data.plans || [];
    const filtered = plans.filter((plan: PremiumPlan) => {
      const category = plan.category?.toLowerCase() || "";
      return (
        category === "referral" ||
        category === "job" ||
        category === "jobs" ||
        category === "other" ||
        category.includes("referral") ||
        category.includes("job")
      );
    });
    return filtered.length > 0 ? filtered : plans;
  } catch {
    return [];
  }
}

const getColors = (plan: PremiumPlan) => {
  const n = plan.title?.toLowerCase() || "";
  if (n.includes("advanced") || n.includes("executive") || n.includes("premium"))
    return {
      border: "border-violet-500/30",
      gradLight: "from-violet-500/10 to-purple-600/10",
      btnGrad: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
      badge: "bg-violet-500/20 text-violet-300 border-violet-500/30",
      iconGrad: "from-violet-500 to-purple-600",
      check: "text-violet-400",
      price: "text-violet-300",
      glow: "shadow-violet-500/20",
      ring: "ring-violet-500/40",
    };
  if (n.includes("growth") || n.includes("pro") || n.includes("standard"))
    return {
      border: "border-blue-500/30",
      gradLight: "from-blue-500/10 to-indigo-600/10",
      btnGrad: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      iconGrad: "from-blue-500 to-indigo-600",
      check: "text-blue-400",
      price: "text-blue-300",
      glow: "shadow-blue-500/20",
      ring: "ring-blue-500/40",
    };
  return {
    border: "border-emerald-500/30",
    gradLight: "from-emerald-500/10 to-teal-600/10",
    btnGrad: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    iconGrad: "from-emerald-500 to-teal-600",
    check: "text-emerald-400",
    price: "text-emerald-300",
    glow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/40",
  };
};

const getIcon = (plan: PremiumPlan): LucideIcon => {
  const n = plan.title?.toLowerCase() || "";
  if (n.includes("advanced") || n.includes("executive") || n.includes("premium")) return Crown;
  if (n.includes("growth") || n.includes("pro")) return Rocket;
  return Briefcase;
};

const getBestFor = (plan: PremiumPlan): string => {
  const n = plan.title?.toLowerCase() || "";
  if (n.includes("advanced") || n.includes("executive") || n.includes("premium")) return "For Leadership Roles";
  if (n.includes("growth") || n.includes("pro")) return "For Career Growth";
  return "For Quick Referrals";
};

const ReferralPlanCard = ({ plan }: { plan: PremiumPlan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const discountPercent = hasDiscount
    ? Math.round(((plan.price - (plan.discountedPrice as number)) / plan.price) * 100)
    : 0;
  const c = getColors(plan);
  const Icon = getIcon(plan);
  const isRecommended = plan.isRecommended || plan.badge === "Popular" || plan.badge === "Recommended";

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-slate-900/80 backdrop-blur-sm p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${c.border} ${
        isRecommended ? `shadow-xl ${c.glow} ring-2 ${c.ring}` : "shadow-lg"
      }`}
    >
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${c.gradLight} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      />
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-1.5 text-xs font-bold text-white shadow-lg whitespace-nowrap">
            &#11088; Most Popular
          </span>
        </div>
      )}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-5 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.iconGrad} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${c.badge}`}>
            {getBestFor(plan)}
          </span>
        </div>
        <h2 className="text-lg font-bold text-white leading-snug mb-1">{plan.title}</h2>
        {plan.shortDescription && (
          <p className="mb-4 text-xs text-slate-400 leading-relaxed">{plan.shortDescription}</p>
        )}
        <div className="mb-4 flex items-baseline gap-2">
          <span className={`text-4xl font-black ${c.price}`}>&#8377;{actualPrice}</span>
          {plan.durationInMonths ? (
            <span className="text-xs text-slate-500">
              / {plan.durationInMonths} month{plan.durationInMonths > 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-xs text-slate-500">/ one-time</span>
          )}
        </div>
        {hasDiscount && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Save {discountPercent}% &#8212; &#8377;{plan.price - (plan.discountedPrice as number)} off
            <span className="ml-1 line-through text-slate-500 font-normal">&#8377;{plan.price}</span>
          </div>
        )}
        {(plan.features?.length ?? 0) > 0 && (
          <ul className="mb-8 flex-1 space-y-2.5">
            {plan.features!.slice(0, 6).map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${c.check}`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/career/jobs/premium/${plan.slug}`}
          className={`mt-auto block w-full rounded-xl bg-gradient-to-r ${c.btnGrad} px-4 py-3.5 text-center text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-md`}
        >
          Get Referral Now <ArrowRight className="ml-2 inline-block h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const PlansSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900 p-7 animate-pulse">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-slate-800" />
          <div className="h-6 w-24 rounded-full bg-slate-800" />
        </div>
        <div className="mb-2 h-6 w-3/4 rounded bg-slate-800" />
        <div className="mb-4 h-4 w-1/2 rounded bg-slate-800" />
        <div className="mb-6 h-10 w-1/3 rounded bg-slate-800" />
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-800" />
          <div className="h-4 w-5/6 rounded bg-slate-800" />
          <div className="h-4 w-4/5 rounded bg-slate-800" />
        </div>
        <div className="mt-8 h-12 w-full rounded-xl bg-slate-800" />
      </div>
    ))}
  </div>
);

const STATS = [
  { value: "85%", label: "Referral Success Rate", color: "text-violet-400", Icon: Target },
  { value: "4.8/5", label: "Average Rating", color: "text-amber-400", Icon: Star },
  { value: "5,000+", label: "Referrals Generated", color: "text-blue-400", Icon: Rocket },
  { value: "50+", label: "Partner Companies", color: "text-emerald-400", Icon: Building2 },
];

const INDUSTRIES = [
  { name: "Technology", emoji: "💻", count: "200+ companies" },
  { name: "Finance", emoji: "💰", count: "80+ companies" },
  { name: "Healthcare", emoji: "🏥", count: "60+ companies" },
  { name: "Design", emoji: "🎨", count: "45+ companies" },
  { name: "Marketing", emoji: "📊", count: "70+ companies" },
  { name: "Engineering", emoji: "⚙️", count: "90+ companies" },
  { name: "Consulting", emoji: "📈", count: "55+ companies" },
  { name: "Data Science", emoji: "🤖", count: "65+ companies" },
];

const TESTIMONIALS = [
  {
    name: "Sneha Patel",
    role: "Software Engineer at Google",
    text: "The referral program connected me with a Google employee. Within 2 weeks I got the job! Best investment ever.",
    rating: 5,
    industry: "Technology",
    avatar: "SP",
  },
  {
    name: "Vikram Singh",
    role: "Product Manager at Amazon",
    text: "I was struggling past resume screening. The referral got my profile to hiring managers. Landed my dream role!",
    rating: 5,
    industry: "Technology",
    avatar: "VS",
  },
  {
    name: "Deepa Krishnan",
    role: "Data Scientist at Microsoft",
    text: "Matched me with the perfect referrer. My application was fast-tracked and I got interview calls within days!",
    rating: 5,
    industry: "Data Science",
    avatar: "DK",
  },
];

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
    a: "Most referrals are completed within 3-7 days. You will be matched with a referrer who will review your profile and submit the referral.",
  },
  {
    q: "Is the referral service guaranteed?",
    a: "We ensure that a referral is submitted for your application. While we cannot guarantee a job offer, our success rate is over 85%.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 100% satisfaction guarantee. If we cannot find a suitable referrer for you, we will provide a full refund.",
  },
  {
    q: "What if I am not in tech?",
    a: "We have referral networks across all industries including Finance, Healthcare, Consulting, Design, Marketing, and more.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Choose Your Plan", desc: "Pick a referral package that matches your target companies and career goals.", Icon: Sparkles },
  { step: "02", title: "Share Your Profile", desc: "Upload your resume and tell us which companies and roles you are targeting.", Icon: BadgeCheck },
  { step: "03", title: "Get Matched", desc: "We connect you with a verified employee at your target company within 24 hrs.", Icon: Users },
  { step: "04", title: "Referral Submitted", desc: "Your referrer reviews your profile and submits a referral to the hiring team.", Icon: Rocket },
];

export default async function JobReferralPage() {
  const plans = await getJobReferralPlans();

  return (
    <div className="min-h-screen bg-[#050714] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
              &#128640; Get Referred to Top Companies
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Job Referral
            </span>
            <br />
            <span className="text-white">Service</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Get referred to top companies by employees who can fast-track your application.{" "}
            <span className="text-slate-200 font-medium">Skip the resume black hole</span> and land interviews faster.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            {[
              { Icon: Users, text: "500+ Referrers" },
              { Icon: Target, text: "85% Success Rate" },
              { Icon: Clock, text: "3-7 Day Delivery" },
              { Icon: Shield, text: "Money-Back Guarantee" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm"
              >
                <item.Icon className="h-4 w-4 text-violet-400" />
                {item.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"
            >
              View All Plans <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="tel:+919330456710"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-8 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-violet-500/50 hover:text-white"
            >
              <Phone className="h-4 w-4 text-violet-400" /> Talk to Us
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-16 border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
              <Zap className="h-3 w-3" /> Simple Process
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              How It <span className="text-violet-400">Works</span>
            </h2>
            <p className="mt-2 text-slate-500 text-sm">Get your referral in 4 simple steps</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-violet-500/30 hover:bg-slate-900 hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl font-black text-slate-800 group-hover:text-violet-900/50 transition">
                    {step.step}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <step.Icon className="h-5 w-5 text-violet-400" />
                  </div>
                </div>
                <h3 className="mb-2 font-bold text-white">{step.title}</h3>
                <p className="text-xs leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="plans" className="relative px-6 py-20 border-t border-slate-800/60">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
              <Sparkles className="h-3 w-3" /> Choose Your Plan
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Job Referral <span className="text-violet-400">Packages</span>
            </h2>
            <p className="mt-3 text-slate-500">
              Select the plan that best fits your career goals and target companies
            </p>
          </div>
          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
                <div className="mb-4 text-6xl">&#127919;</div>
                <h3 className="mb-2 text-xl font-bold text-white">No Job Referral Plans Available</h3>
                <p className="text-slate-500">We&apos;re expanding our referral network. Check back soon!</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/career/jobs/premium" className="text-violet-400 hover:text-violet-300 text-sm">
                    Browse All Plans
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-2 text-sm font-semibold text-white"
                  >
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

      {/* STATS */}
      <section className="relative px-6 py-16 border-t border-slate-800/60">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/[0.07] via-purple-600/[0.04] to-indigo-600/[0.07]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center transition hover:border-violet-500/30 hover:bg-slate-900 hover:-translate-y-1"
              >
                <div className="mb-3 flex items-center justify-center">
                  <stat.Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-black text-white">{stat.value}</div>
                <div className="mt-1.5 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="px-6 py-16 border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Building2 className="h-3 w-3" /> Company Coverage
            </span>
            <h2 className="text-3xl font-bold text-white">
              Referrals From <span className="text-violet-400">Top Companies</span>
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Get connected with employees at these leading organizations
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <div
                key={industry.name}
                className="group flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center transition hover:border-violet-500/30 hover:bg-slate-900 hover:-translate-y-0.5"
              >
                <span className="mb-2 text-2xl">{industry.emoji}</span>
                <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition">
                  {industry.name}
                </span>
                <span className="text-xs text-slate-600 mt-0.5">{industry.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-16 border-t border-slate-800/60">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Star className="h-3 w-3 fill-emerald-400" /> Success Stories
            </span>
            <h2 className="text-3xl font-bold text-white">
              Real <span className="text-emerald-400">Referral Success</span> Stories
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-violet-500/20 hover:bg-slate-900 hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-slate-400 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-xs font-bold text-white flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <span className="ml-auto rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400 whitespace-nowrap">
                    {t.industry}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 border-t border-slate-800/60">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Lightbulb className="h-3 w-3" /> Got Questions?
            </span>
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked <span className="text-violet-400">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition hover:border-slate-700"
              >
                <summary className="cursor-pointer list-none px-6 py-4 text-sm font-semibold text-slate-200 marker:content-none hover:text-violet-300 transition">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition group-open:bg-violet-500/20 group-open:text-violet-400 group-open:rotate-45">
                      <span className="text-xl font-light leading-none">+</span>
                    </span>
                  </span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-500">{faq.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
            <p className="text-sm font-medium text-slate-300">Still have questions? We&apos;re here to help!</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:support@codelura.com"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/40 hover:text-violet-300"
              >
                <Mail className="h-4 w-4 text-violet-400" /> support@codelura.com
              </a>
              <a
                href="tel:+919330456710"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/40 hover:text-violet-300"
              >
                <Phone className="h-4 w-4 text-violet-400" /> +91 9330456710
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-300 transition hover:border-violet-500/40 hover:text-violet-300"
              >
                <MessageCircle className="h-4 w-4 text-violet-400" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden px-6 py-20 border-t border-slate-800/60">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-indigo-600/10" />
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-violet-400">
            <Rocket className="h-3 w-3" /> Ready to Get Started?
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Get Referred
            </span>
            {" "}
            to Your Dream Company?
          </h2>
          <p className="mt-3 text-slate-500">
            Skip the application black hole. Get your profile directly to hiring managers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={plans.length > 0 ? `/career/jobs/premium/${plans[0]?.slug}` : "/career/jobs/premium"}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:scale-[1.02] hover:from-violet-500 hover:to-purple-500"
            >
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-8 py-4 text-sm font-semibold text-slate-200 transition hover:border-violet-500/50 hover:text-white"
            >
              View All Plans
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
