import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense, lazy } from "react";
import CTABand from "@/components/services/Ctaband";
import TypeAnimationWrapper from "./TypeAnimationWrapper";
// SEO Metadata
export const metadata: Metadata = {
  title: "Life & Business Coaching | 1:1 Coaching Programs — Elevate Coaching",
  description: "Elevate Coaching runs 1:1 and group coaching programs for founders, professionals, and individuals who want clarity, accountability, and real momentum toward their goals.",
  keywords: "life coaching, business coaching, 1:1 coaching, career coaching, executive coaching, personal growth, accountability coaching",
  openGraph: {
    title: "Life & Business Coaching | 1:1 Coaching Programs",
    description: "Get clarity, accountability, and real momentum toward your goals with our 1:1 and group coaching programs.",
    type: "website",
    url: "https://codelura.com/services/coaching-websites",
    siteName: "Elevate Coaching",
    images: [
      {
        url: "/og/coaching.jpg",
        width: 1200,
        height: 630,
        alt: "Life & Business Coaching Programs",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codelura.com/services/coaching-websites",
  },
};

// Lazy load TypeAnimation
// const TypeAnimation = lazy(() => 
//   import("react-type-animation").then(mod => ({ default: mod.TypeAnimation }))
// );

// Static data - moved outside for better performance
const features = [
  {
    title: "1:1 coaching sessions",
    desc: "Weekly or biweekly calls focused entirely on your goals, with a clear agenda and notes you can revisit between sessions.",
  },
  {
    title: "Personalised growth roadmap",
    desc: "We map your starting point, your goal, and the specific milestones in between — not a generic worksheet template.",
  },
  {
    title: "Accountability system",
    desc: "A simple weekly check-in flow keeps your commitments visible, so progress doesn't quietly stall between sessions.",
  },
  {
    title: "Mindset & clarity work",
    desc: "We work through the beliefs and patterns that usually block progress long before we touch tactics or to-do lists.",
  },
  {
    title: "Goal & habit tracking",
    desc: "Your goals are broken into trackable habits and milestones, reviewed and adjusted together every single month.",
  },
  {
    title: "Direct support between sessions",
    desc: "Message your coach directly when you hit a real decision point — you are never waiting two weeks for guidance.",
  },
];

const process = [
  {
    step: "Discovery call",
    detail: "We start with a free call to understand where you are right now, what's blocking you, and whether we're a good fit to work together.",
  },
  {
    step: "Goal mapping",
    detail: "We define what success actually looks like for you in concrete terms, then break it into a realistic 90-day roadmap.",
  },
  {
    step: "Personalised plan",
    detail: "Your coaching plan is built around your specific goals, schedule, and obstacles — never a one-size-fits-all program.",
  },
  {
    step: "Weekly coaching",
    detail: "Regular sessions keep you moving, focused on the one or two things that matter most that week, not everything at once.",
  },
  {
    step: "Track & refine monthly",
    detail: "We review what worked and what didn't every month and adjust the plan, since real growth is a continuous process.",
  },
];

const coachingTypes = [
  {
    name: "Career transitions",
    detail: "Clear decision frameworks matter most here, since these moves carry real financial and identity stakes.",
  },
  {
    name: "First-time founders",
    detail: "Longer, structured sessions cover hiring, prioritisation, and the self-doubt that comes with full ownership.",
  },
  {
    name: "Leadership growth",
    detail: "Coaching focuses on communication and delegation, where small shifts compound across an entire team.",
  },
  {
    name: "Personal goals & habits",
    detail: "Weekly accountability check-ins outperform a single big plan, since consistency beats intensity over time.",
  },
];

const faqs = [
  {
    q: "How long does coaching take to show real results?",
    a: "Most clients notice a shift in clarity and momentum within the first 2 to 3 sessions. Lasting behavioural and career or business change typically builds over 3 to 6 months of consistent work.",
  },
  {
    q: "Is this therapy, or is it different from therapy?",
    a: "Coaching is different from therapy. We focus on goals, decisions, and forward action rather than diagnosing or treating mental health conditions. If we ever sense therapy would serve you better, we'll say so directly.",
  },
  {
    q: "How often will we actually talk?",
    a: "Most clients meet weekly or biweekly for a full session, with lightweight check-ins or messaging support in between, depending on the plan you choose.",
  },
  {
    q: "Do you work with business owners as well as individuals?",
    a: "Yes. Many clients are founders or professionals working through career transitions, leadership challenges, or business growth decisions alongside personal goals.",
  },
  {
    q: "What happens in the free discovery call?",
    a: "We talk through where you are, what you want to change, and what's been getting in the way. You'll leave with clarity on next steps, whether or not we end up working together.",
  },
];

const checklist = [
  "Will they start with a real discovery conversation about your goals, rather than a generic sales pitch?",
  "Do they have experience with people in situations similar to yours — career stage, industry, or life stage?",
  "Is there a clear, ongoing accountability system, not just a one-time goal-setting session?",
  "Will they build a plan specific to your goals, rather than handing you a one-size-fits-all framework?",
  "Do they check in regularly on specific goals and habits, not just vague 'how are you feeling' chats?",
  "Is the line between coaching and therapy clearly explained upfront?",
  "Do they explain clearly when results are realistically expected, rather than promising overnight transformation?",
  "Is the pricing transparent and tied to a clearly defined program structure?",
];

const stats = [
  { value: "92%", label: "Of clients report a major goal achieved within 6 months." },
  { value: "4.9/5", label: "Average client satisfaction rating across all programs." },
  { value: "85%", label: "Of clients renew into a second coaching cycle." },
  { value: "300+", label: "Founders and professionals coached to date." },
];

// Image data
const heroImage = {
  src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
  alt: "Coach and client in a one-on-one coaching session in a modern office",
  width: 1200,
  height: 420,
};

const coachingImages = [
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=700&auto=format&fit=crop",
    alt: "Person reviewing personal goals and writing on paper",
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=700&auto=format&fit=crop",
    alt: "Coaching conversation in a bright office environment",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?q=80&w=700&auto=format&fit=crop",
    alt: "Client celebrating progress toward a personal goal",
  },
];

export default function CoachingPage() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <WhyCoachingSection />
      <FeaturesSection />
      <ImageBandSection />
      <ProcessSection />
      <CoachingTypesSection />
      <ResultsSection />
      <DetailedGuideSection />
      <ChecklistSection />
      <FAQSection />
      <CTABand
        heading="Let's get you moving toward what you actually want"
        subtext="Share a bit about your goal and we'll send you a free discovery call link within 24 hours."
      />
    </main>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 px-4 sm:px-6 py-8 sm:py-12 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 sm:px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
           <TypeAnimationWrapper
  sequences={[
    "Coaching · For Founders",
    2000,
    "Coaching · For Professionals",
    2000,
    "Coaching · For Career Changers",
    2000,
    "Coaching · For Life Goals",
    2000,
  ]}
  speed={50}
  repeat={Infinity}
/>
          </span>

          <h1 className="mt-6 font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
            Get{" "}
            <mark className="bg-transparent bg-gradient-to-r from-brand-500 to-emerald-500 bg-clip-text text-transparent">
              unstuck
            </mark>{" "}
            and move toward the life you actually want
          </h1>

          <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600">
            We run 1:1 life and business coaching programs built for
            people who are tired of staying still, so you get{" "}
            <span className="font-semibold text-slate-900">
              clarity, accountability, and real momentum
            </span>{" "}
            toward the goals that actually matter to you.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40"
            >
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Book a Free Discovery Call</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="#process"
              className="group relative overflow-hidden rounded-full border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 sm:px-8 py-3 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/30"
            >
              <span className="relative z-10 flex items-center gap-2">
                See how coaching works
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 flex flex-wrap gap-6 sm:gap-8 text-sm text-slate-500">
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">300+</p>
              <p className="text-xs sm:text-sm">Clients coached</p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">3-6 mo</p>
              <p className="text-xs sm:text-sm">Typical transformation window</p>
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-slate-900">4.9/5</p>
              <p className="text-xs sm:text-sm">Average client rating</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              className="h-[300px] sm:h-[380px] lg:h-[420px] w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </div>
          <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 hidden sm:block w-48 sm:w-56 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Client Progress</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">Promoted to Director</p>
            <p className="text-xs text-slate-500">After 4 months of coaching</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Why Coaching Section
function WhyCoachingSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Image
            src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?q=80&w=1100&auto=format&fit=crop"
            alt="Person journaling and planning goals with focus and intention"
            width={1100}
            height={733}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
          />
        </div>
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            Most people don&apos;t fail from a lack of effort
          </h2>
          <p className="mt-4 sm:mt-5 leading-relaxed text-slate-600">
            Most ambitious people aren&apos;t short on effort or intelligence.
            What they lack is{" "}
            <span className="font-semibold text-slate-900">
              a clear plan, an honest mirror, and someone holding them
              accountable
            </span>{" "}
            when motivation dips. Without that structure, even talented,
            hard-working people stay busy without actually moving toward
            the life or career they say they want.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Real progress depends on a specific mix of things: real
            clarity on what you&apos;re working toward, a plan broken into
            steps you can actually execute, consistent accountability so
            commitments don&apos;t quietly slip, and an outside perspective
            that catches blind spots you can&apos;t see from inside your own
            situation.
          </p>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
            What&apos;s included in every coaching program
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            These six pillars work together — skipping any one of them
            usually limits how far you can realistically get.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition hover:border-brand-200 hover:shadow-md"
            >
              <h3 className="font-display text-base sm:text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Image Band Section
function ImageBandSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        {coachingImages.map((img, index) => (
          <Image
            key={index}
            src={img.src}
            alt={img.alt}
            width={700}
            height={933}
            className="aspect-[3/4] w-full rounded-2xl object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            quality={80}
          />
        ))}
      </div>
    </section>
  );
}

// Process Section
function ProcessSection() {
  return (
    <section id="process" className="bg-[#0B1224] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            How our coaching process works
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            A five-stage cycle that starts with an honest conversation and
            continues as a focused, ongoing program.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p, i) => (
            <div
              key={p.step}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              <span className="font-display text-2xl sm:text-3xl font-bold text-brand-500">
                0{i + 1}
              </span>
              <h3 className="mt-3 sm:mt-4 font-display text-sm sm:text-base font-semibold text-white">
                {p.step}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {p.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Coaching Types Section
function CoachingTypesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        Coaching built around where you actually are
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
        Different goals call for a different rhythm of coaching, and our
        approach reflects that.
      </p>

      <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {coachingTypes.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-slate-200 p-5 sm:p-6"
          >
            <h3 className="font-display text-sm sm:text-base font-semibold text-slate-900">
              {item.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Results Section
function ResultsSection() {
  return (
    <section className="bg-brand-50 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              What changes after a few months of focused coaching
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Clients who commit to a sustained coaching program typically
              see steady, compounding change rather than a single
              dramatic breakthrough. Clarity tends to improve first,
              followed by consistent action, and finally a measurable
              shift in outcomes — a promotion, a launched business, a
              rebuilt routine.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="font-display text-2xl sm:text-3xl font-bold text-brand-500">
                  {s.value}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Detailed Guide Section
function DetailedGuideSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        A closer look at how this coaching program actually works
      </h2>
      <div className="mt-6 sm:mt-8 space-y-6 leading-relaxed text-slate-600">
        <p>
          Coaching works best when it stays grounded in your real life,
          not a generic framework copied across every client. Before any
          plan is built, we spend real time understanding your specific
          situation: your goals, your constraints, the patterns that have
          held you back before, and what&apos;s actually at stake for you
          right now.
        </p>
        <p>
          The discovery conversation is the single highest-leverage part
          of any coaching relationship, and it is also the most commonly
          rushed. Slowing down here often produces more clarity in one
          conversation than months of unguided effort.
        </p>
        <p>
          Accountability deserves particular attention because it
          influences follow-through more than motivation alone ever
          does. A client who reports progress weekly will usually
          outperform one relying purely on willpower.
        </p>
      </div>
    </section>
  );
}

// Checklist Section
function ChecklistSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
          A quick checklist before starting a coaching program
        </h2>
        <p className="mt-4 leading-relaxed text-slate-600">
          Use this to evaluate any coach, including us, before committing
          to a program.
        </p>
        <div className="mt-8 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {checklist.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
            >
              <span className="mt-0.5 grid h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 lg:px-10 border-t border-slate-200">
      <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
        Frequently asked questions
      </h2>
      <div className="mt-8 sm:mt-10 divide-y divide-slate-200">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5 sm:py-6">
            <summary className="flex cursor-pointer items-center justify-between font-display text-sm sm:text-base font-semibold text-slate-900">
              {f.q}
              <span className="ml-4 text-brand-500 transition group-open:rotate-45 text-xl sm:text-2xl">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}