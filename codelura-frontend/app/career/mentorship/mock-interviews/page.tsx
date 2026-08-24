// app/premium/mock-interview/page.jsx
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./premium.module.css";
import CareerPromo from "@/components/career/CareerPromo";
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
}
// ============================================
// REUSABLE PREMIUM CARD
// ============================================
const PremiumCard = ({ plan }: { plan: any }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const savings = hasDiscount ? plan.price - plan.discountedPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100)
    : 0;

  return (
    <div className={styles.premiumCard}>
      <div className={styles.cardBanner}>
        {plan.bannerImage ? (
          <Image
            src={plan.bannerImage}
            alt={plan.title}
            width={400}
            height={225}
            className={styles.bannerImage}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className={styles.bannerPlaceholder}>
            <span className={styles.placeholderIcon}>{plan.title.charAt(0)}</span>
          </div>
        )}

        <div className={styles.badgeContainer}>
          {plan.durationInMonths && (
            <span className={`${styles.badge} ${styles.durationBadge}`}>
              {plan.durationInMonths}M
            </span>
          )}
          {hasDiscount && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{plan.title}</h3>

        {plan.shortDescription && (
          <p className={styles.cardDescription}>{plan.shortDescription}</p>
        )}

        <div className={styles.priceSection}>
          <div className={styles.priceMain}>
            <span className={styles.currency}>₹</span>
            <span className={styles.amount}>{actualPrice.toLocaleString("en-IN")}</span>
          </div>
          {hasDiscount && (
            <div className={styles.priceOriginal}>
              ₹{plan.price.toLocaleString("en-IN")}
            </div>
          )}
        </div>

        {hasDiscount && (
          <div className={styles.savingsBadge}>
            Save ₹{savings.toLocaleString("en-IN")}
          </div>
        )}

        {plan.features?.length > 0 && (
          <ul className={styles.featuresList}>
            {plan.features.slice(0, 4).map((feature: string, index: number) => (
              <li key={index} className={styles.featureItem}>
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}

        <Link href={`/career/mentorship/mock-interviews/${plan.slug}`} className={styles.ctaButton}>
          Get Started
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// ============================================
// SKELETON LOADER
// ============================================
const PlansSkeleton = () => {
  return (
    <div className={styles.plansSkeleton}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonBanner} />
          <div className={`${styles.skeletonLine} ${styles.short}`} />
          <div className={`${styles.skeletonLine} ${styles.medium}`} />
          <div className={styles.skeletonLine} />
        </div>
      ))}
    </div>
  );
};

// ============================================
// STATIC CONTENT (copy for the page)
// ============================================
const STATS = [
  { value: "12,000+", label: "Mock interviews conducted" },
  { value: "480+", label: "Industry mentors" },
  { value: "4.8/5", label: "Average learner rating" },
  { value: "72%", label: "Learners who felt more confident after 1 session" },
];

const WHY_ITEMS = [
  {
    icon: "🧠",
    title: "Practice under real pressure",
    desc: "Reading questions on a blog is not the same as answering them out loud, on camera, with someone judging your answer in real time. Mock interviews rebuild that pressure safely, so the real interview feels familiar instead of scary.",
  },
  {
    icon: "🎯",
    title: "Role & level specific",
    desc: "A mock interview for a fresher SDE role looks nothing like one for a senior product manager. Every session is matched to your target role, seniority, and company type, so the questions are actually relevant to what you'll face.",
  },
  {
    icon: "🗣️",
    title: "Real mentor, real conversation",
    desc: "No canned question banks or bots. You talk to an actual professional who has sat on the other side of the table, who follows up, pushes back, and reacts the way a real interviewer would.",
  },
  {
    icon: "📝",
    title: "Feedback you can act on",
    desc: "After every session, you get a structured breakdown: what worked, what didn't, and 2-3 specific things to fix before your next attempt — not vague encouragement.",
  },
  {
    icon: "📈",
    title: "Track your improvement",
    desc: "Book more than one session and see your scores move. Most learners notice a clear jump in structure and confidence by their second or third mock interview.",
  },
  {
    icon: "🔁",
    title: "Unlimited do-overs on tricky questions",
    desc: "Struggled with a system design question or a behavioral one? Flag it, and your mentor will circle back to it in a later session so it never trips you up again.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick your plan",
    desc: "Choose a plan based on how many sessions you need and how soon your interview is. Not sure? Start with a single session and upgrade any time.",
  },
  {
    step: "02",
    title: "Tell us your target role",
    desc: "Share the company, role, and job description if you have one. Your mentor prepares questions specific to that interview, not generic ones.",
  },
  {
    step: "03",
    title: "Do the mock interview",
    desc: "Join a live video session with your mentor. Answer questions exactly as you would in the real interview — technical, behavioral, or both.",
  },
  {
    step: "04",
    title: "Get your feedback report",
    desc: "Within 24 hours, receive a written breakdown covering communication, structure, technical depth, and a clear action plan before your next attempt.",
  },
];

const FAQS = [
  {
    q: "Who conducts the mock interviews?",
    a: "Working professionals and hiring managers from the industry who have real interviewing experience for the role you're targeting — not generic trainers.",
  },
  {
    q: "Can I choose the mentor?",
    a: "Yes. Once you pick a plan, you can browse mentor profiles by company background and specialization and pick who you'd like to practice with.",
  },
  {
    q: "What if I need to reschedule?",
    a: "You can reschedule a session up to 12 hours before it starts, directly from your dashboard, at no extra cost.",
  },
  {
    q: "Is this only for technical roles?",
    a: "No. We cover technical, product, design, marketing, consulting, and general behavioral/HR rounds across experience levels.",
  },
];

// ============================================
// DATA FETCHING (Server Side)
// ============================================
async function getMockInterviewPlans() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/plans?category=mock-interview`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();

    // ✅ Filter by category on client side as well (double check)
    // const plans = data.plans || [];
    const plans: PremiumPlan[] = data.plans || [];
    return plans.filter(plan => plan.category === "mock-interview" || plan.category === "mock_interview");
  } catch (error) {
    console.error('Error fetching mock interview plans:', error);
    return [];
  }
}

// ============================================
// MOCK INTERVIEW PAGE (Server Component)
// ============================================
export default async function MockInterviewPage() {
  const plans = await getMockInterviewPlans();

  return (
    <div className={styles.premiumPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🎯 Mock Interview</span>
          <h1 className={styles.heroTitle}>
            Walk in Prepared. <span className={styles.gradientText}>Walk out Confident.</span>
          </h1>
          <p className={styles.heroDescription}>
            Most interviews are&apos;nt lost on knowledge — they&apos;re lost on nerves, structure,
            and not knowing what the interviewer is really listening for. Practice with a
            real mentor in a real interview setting, get direct feedback, and fix your gaps
            before it actually counts.
          </p>
          <div className={styles.heroStats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.heroStatItem}>
                <span className={styles.heroStatValue}>{s.value}</span>
                <span className={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why mock interviews matter */}
      <section className={styles.whySection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Why it works</span>
          <h2 className={styles.sectionTitle}>Preparation is not the same as practice</h2>
          <p className={styles.sectionSubtitle}>
            You can read every interview guide out there and still freeze up the moment
            someone asks you to explain your answer out loud. Here&apos;s what an actual mock
            interview gives you that self-study can&apos;t.
          </p>
        </div>
        <div className={styles.whyGrid}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className={styles.whyCard}>
              <span className={styles.whyIcon}>{item.icon}</span>
              <h3 className={styles.whyTitle}>{item.title}</h3>
              <p className={styles.whyDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>How it works</span>
          <h2 className={styles.sectionTitle}>From booking to feedback in four steps</h2>
        </div>
        <div className={styles.howGrid}>
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className={styles.howCard}>
              <span className={styles.howStep}>{item.step}</span>
              <h3 className={styles.howTitle}>{item.title}</h3>
              <p className={styles.howDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans Grid */}
      <section className={styles.plansSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Choose your plan</span>
          <h2 className={styles.sectionTitle}>Mock interview plans</h2>
          <p className={styles.sectionSubtitle}>
            Pick the plan that matches how much practice you need. Every plan includes
            a live session with a real mentor and a written feedback report.
          </p>
        </div>
        <div className={styles.plansGrid}>
          <Suspense fallback={<PlansSkeleton />}>
            {plans.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🎯</div>
                <h2>No Mock Interview Plans Available</h2>
                <p>We&apos;re preparing new mock interview packages for you. Check back soon!</p>
                {/* <Link href="/premium" className={styles.backLink}>
                  ← Browse All Plans
                </Link> */}
              </div>
            ) : (
              plans.map((plan) => (
                <PremiumCard key={plan._id} plan={plan} />
              ))
            )}
          </Suspense>
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <CareerPromo section={0} />
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Questions</span>
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
        </div>
        <div className={styles.faqGrid}>
          {FAQS.map((item) => (
            <div key={item.q} className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>{item.q}</h3>
              <p className={styles.faqAnswer}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <h2 className={styles.finalCtaTitle}>Your next interview doesn&apos;t have to be a guess</h2>
        <p className={styles.finalCtaDesc}>
          Book a mock interview today and find out exactly where you stand — while there&apos;s
          still time to fix it.
        </p>
        <Link href="#top" className={styles.finalCtaButton}>
          View Plans Above
        </Link>
      </section>

      {/* Back to All Plans */}
      {/* <div className={styles.backSection}>
        <Link href="/premium" className={styles.backLink}>
          ← Back to All Plans
        </Link>
      </div> */}
    </div>
  );
}