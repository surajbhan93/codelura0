import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/services/Ctaband";
// import StartupHeroBadge from "./StartupHeroBadge";
// import Testimonials from "@/components/services/Testimonials";

export const metadata: Metadata = {
  title: "Startup & SaaS Website Development | MVP Builds & Growth Sites — Pixelnext",
  description:
    "Pixelnext builds MVPs, SaaS products and investor-ready websites for startups, designed to ship fast, prove traction, and scale without a rebuild.",
};

const features = [
  {
    title: "MVP architecture & rapid prototyping",
    desc: "We scope the smallest version of your product that can actually be tested by real users, so you validate before you over-build.",
  },
  {
    title: "SaaS-ready, multi-tenant builds",
    desc: "Auth, billing, and account structures are built in from day one, so adding your hundredth customer is a non-event, not a rewrite.",
  },
  {
    title: "Scalable cloud-native infrastructure",
    desc: "Built on Next.js with serverless infra that scales automatically, so a traffic spike from a launch post never takes the site down.",
  },
  {
    title: "Investor-ready landing pages",
    desc: "Pages built to hold up under diligence — clear positioning, real metrics, and a narrative that supports the deck, not just decoration.",
  },
  {
    title: "Product analytics from day one",
    desc: "Funnel tracking, activation events, and growth instrumentation are wired in at launch, so you have real data by week two, not month six.",
  },
  {
    title: "Continuous iteration & support",
    desc: "Weekly ship cycles after launch, so the product keeps moving at the pace early customer feedback actually demands.",
  },
] as const;

const buildProcess = [
  {
    step: "Discovery & scoping sprint",
    detail:
      "A focused session to define your core user journey and cut the feature list down to what truly needs to exist for version one.",
  },
  {
    step: "Rapid prototyping",
    detail:
      "Clickable prototypes let you and early users react to the real flow within days, before a single line of production code is written.",
  },
  {
    step: "MVP build",
    detail:
      "We build in short, visible sprints on Next.js and Tailwind, so you see real progress every week, not a single reveal at the end.",
  },
  {
    step: "Launch & instrument",
    detail:
      "We ship to production with analytics and error tracking already wired in, so day-one usage data is available immediately.",
  },
  {
    step: "Iterate & scale",
    detail:
      "Post-launch, we work in weekly cycles guided by real usage data, and harden the infrastructure as your user base grows.",
  },
] as const;

const startupSegments = [
  {
    name: "Idea & pre-seed founders",
    icon: "💡",
    detail:
      "A lean, focused MVP built to test your core hypothesis with real users, without spending runway on features nobody asked for.",
  },
  {
    name: "Seed-funded SaaS teams",
    icon: "🧩",
    detail:
      "Multi-tenant product builds with billing, onboarding, and analytics in place, ready to support your first hundred paying customers.",
  },
  {
    name: "Series A scaling startups",
    icon: "📊",
    detail:
      "Infrastructure hardening, performance audits, and design system work that holds up as headcount and usage both grow fast.",
  },
  {
    name: "Bootstrapped indie founders",
    icon: "🛠️",
    detail:
      "Pragmatic builds scoped to a fixed budget and timeline, prioritising the features that drive revenue first.",
  },
] as const;

const resultStats = [
  {
    value: "6 wks",
    label: "Average time from kickoff to a launched, testable MVP.",
  },
  {
    value: "94%",
    label: "Of sprints shipped on the date committed at planning.",
  },
  {
    value: "99.9%",
    label: "Uptime maintained through launch-day traffic spikes.",
  },
  {
    value: "88%",
    label: "Client retention into a second build phase or funding round.",
  },
] as const;

const checklist = [
  "Will they scope a true MVP, or quietly sell you a six-month build for version one?",
  "Do you retain full ownership of the codebase and infrastructure after launch?",
  "Is there a signed NDA and clear IP assignment before any real product details are shared?",
  "Will you see working software every week, rather than a single reveal at the end?",
  "Is the tech stack a common, well-supported one your next hire could pick up easily?",
  "Do they have a clear plan for analytics and instrumentation from day one, not as an afterthought?",
  "Can they show a past MVP that actually shipped and is still running in production today?",
  "Is pricing tied to a defined scope and timeline, with change requests handled transparently?",
] as const;

const faqs = [
  {
    q: "How fast can you actually build our MVP?",
    a: "Most focused MVPs launch in 4 to 8 weeks, depending on scope. We define the exact timeline together during the discovery sprint, before any contract is signed.",
  },
  {
    q: "Do we own the code and infrastructure after launch?",
    a: "Yes, full ownership of the codebase, design files, and infrastructure transfers to you. There is no vendor lock-in or ongoing dependency required.",
  },
  {
    q: "Will you sign an NDA before we share our idea?",
    a: "Yes, we sign an NDA as a standard first step, before any detailed product discussion begins.",
  },
  {
    q: "Can the MVP scale if we get traction quickly?",
    a: "Yes, we build on cloud-native infrastructure designed to scale without a rebuild. Some hardening work is normal as usage grows, but the foundation is built for it from day one.",
  },
  {
    q: "Do you work for equity instead of fees?",
    a: "We primarily work on a fixed-scope or retainer basis, since this keeps incentives clear for both sides. Hybrid arrangements can be discussed for the right early-stage fit.",
  },
] as const;

const techStack = [
  "Next.js",
  "Tailwind CSS",
  "Supabase",
  "Stripe",
  "Vercel",
  "PostgreSQL",
  "Resend",
  "Clerk",
] as const;

export default function StartupWebsitesPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      {/* HERO */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div
          className="absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_60%_50%_at_60%_20%,black,transparent)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-12">
          <div>
            {/* <StartupHeroBadge /> */}

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Ship the MVP that proves your idea, fast
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We build MVPs, SaaS products and investor-ready websites for
              startups — scoped tight, shipped in weeks, and built on
              infrastructure that scales the moment you get traction.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/Enquiries?services=Startup%20MVP&medium=organic"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-2
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-violet-600
                  via-fuchsia-500
                  to-amber-400
                  px-8
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-xl
                  shadow-fuchsia-500/30
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:shadow-2xl
                  hover:shadow-fuchsia-500/40
                "
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10">Get a Free Quote</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#process"
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-full
                  border-2
                  border-violet-500
                  bg-gradient-to-r
                  from-violet-50
                  to-fuchsia-50
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-violet-700
                  shadow-lg
                  shadow-violet-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-fuchsia-500
                  hover:shadow-xl
                  hover:shadow-fuchsia-500/30
                "
              >
                <span className="relative z-10 flex items-center gap-2">
                  See how we work
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-500">
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">80+</p>
                <p>MVPs shipped</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">6 wks</p>
                <p>Avg. time to launch</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">94%</p>
                <p>Sprints shipped on time</p>
              </div>
            </div>
          </div>

          {/* SIGNATURE VISUAL — sprint board, startup-native motif */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#0B1224] shadow-2xl shadow-slate-200">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Sprint 4 — Onboarding v2
                  </span>
                </div>
                <span className="text-xs text-slate-500">Week 4 / 6</span>
              </div>

              <div className="grid grid-cols-3 gap-3 px-6 py-6">
                {[
                  {
                    label: "Backlog",
                    color: "bg-slate-600",
                    items: ["Email digests", "Team invites"],
                  },
                  {
                    label: "In Sprint",
                    color: "bg-amber-400",
                    items: ["Stripe billing", "Auth + SSO"],
                  },
                  {
                    label: "Shipped",
                    color: "bg-emerald-400",
                    items: ["Signup flow", "Dashboard v1"],
                  },
                ].map((col) => (
                  <div key={col.label}>
                    <div className="mb-2 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {col.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {col.items.map((item) => (
                        <div
                          key={item}
                          className="rounded-lg bg-white/5 px-2.5 py-2 text-[11px] leading-snug text-slate-200"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-1.5 px-6 pb-6">
                {[40, 55, 35, 70, 50, 85, 65, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500 to-fuchsia-400"
                    style={{ height: `${h * 0.45}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                Feature Shipped
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Onboarding flow v2 — deployed
              </p>
              <p className="text-xs text-slate-500">Live in production in 3.2 days</p>
            </div>
          </div>
        </div>

        {/* TECH STACK MARQUEE */}
        <div className="relative border-t border-slate-100 bg-white/60 py-5">
          <p className="mx-auto mb-3 max-w-7xl px-6 text-center text-xs font-medium uppercase tracking-wider text-slate-400 lg:px-10">
            Built with tools your next engineering hire already knows
          </p>
          <div className="group relative mx-auto max-w-7xl overflow-hidden px-6 lg:px-10">
            <div className="flex w-max animate-startup-marquee gap-12 group-hover:[animation-play-state:paused]">
              {[...techStack, ...techStack].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="whitespace-nowrap text-base font-semibold text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes startup-marquee {
                from { transform: translateX(0); }
                to { transform: translateX(-50%); }
              }
              .animate-startup-marquee {
                animation: startup-marquee 22s linear infinite;
              }
            `,
          }}
        />
      </section>

      {/* WHY IT MATTERS */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1100&auto=format&fit=crop"
              alt="Startup team planning product roadmap on a whiteboard"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="font-display text-2xl font-bold text-violet-600">72%</p>
              <p className="mt-1 text-xs leading-snug text-slate-500">
                of startups run out of runway before the product is actually ready
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Speed to launch is the real product
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Every week spent building the wrong feature is a week of
              runway you don&apos;t get back. The goal isn&apos;t a perfect
              product — it&apos;s the smallest version that gets real
              signal from real users, shipped before your next milestone.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  1
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Ruthless scoping </span>
                  — we cut the feature list to what version one actually needs to prove,
                  not what it would be nice to have.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  2
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Weekly visible progress </span>
                  — you see working software every week, so there are no surprises at
                  the finish line.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
                  3
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Infra that scales quietly </span>
                  — built so a sudden traffic spike from a launch post is a good
                  problem, not an outage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-100/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
              </span>
              Everything You Need
            </div>

            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
              What&apos;s included in every
              <span className="block text-violet-600">startup build</span>
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              These six pillars work together — skipping any one of them
              usually shows up later as a rebuild you didn&apos;t budget for.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, index) => (
              <div
                key={f.title}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-violet-200"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 ring-1 ring-violet-200/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:ring-violet-600">
                  <span className="text-lg font-bold">{(index + 1).toString().padStart(2, "0")}</span>
                </div>

                <h3 className="font-display text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-violet-600">
                  {f.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600">{f.desc}</p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span>Learn more</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500">Ready to ship your MVP?</p>
            <a
              href="/Enquiries?service=Startup%20MVP&medium=organic"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-violet-600 transition-all hover:gap-3 hover:text-violet-700"
            >
              Book a free consultation
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* IMAGE BAND */}
      <section className="mx-auto max-w-7xl px-6 py-5 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200/50">
            Real Results
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            See what happens when you <br />
            <span className="text-violet-600">build to ship, not to stall</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            From prototype to production to scale — we track every metric
            that matters for a startup&apos;s momentum.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=700&auto=format&fit=crop"
              alt="Developers collaborating on a product sprint"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Velocity
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Weekly Ship Cycles</h3>
                <p className="mt-1 text-sm text-white/80">Real progress, every sprint</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=700&auto=format&fit=crop"
              alt="Founder reviewing product analytics on a laptop"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Signal
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Real Usage Data</h3>
                <p className="mt-1 text-sm text-white/80">Instrumented from day one</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=700&auto=format&fit=crop"
              alt="Team celebrating a product launch milestone"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Scale
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Built to Grow</h3>
                <p className="mt-1 text-sm text-white/80">No rebuild at Series A</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-200/50 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-violet-600">4.9/5</p>
            <p className="mt-1 text-sm text-slate-600">Average Client Rating</p>
          </div>
          <div className="text-center sm:border-l sm:border-r sm:border-slate-200">
            <p className="text-3xl font-bold text-violet-600">80+</p>
            <p className="mt-1 text-sm text-slate-600">MVPs & SaaS Products Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-violet-600">$120M+</p>
            <p className="mt-1 text-sm text-slate-600">Raised by clients post-launch</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted by funded startups
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fast, scoped sprints
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Built to scale
          </span>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-[#0B1224] py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How our startup build process works
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A five-stage cycle that starts with ruthless scoping and
              continues as weekly ship cycles long after launch day.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {buildProcess.map((p, i) => (
              <div key={p.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="font-display text-3xl font-bold text-violet-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">
                  {p.step}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGMENTS WE BUILD FOR */}
      <section className="bg-slate-50 py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <span className="rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700">
              Who We Build For
            </span>

            <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
              Different Stages,
              <span className="text-violet-600"> Different Priorities</span>
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              A pre-seed founder and a Series A team need very different
              things from a build. We scope around your actual stage, not a
              one-size-fits-all package.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {startupSegments.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
                  {item.icon}
                </div>

                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-3 text-slate-600 leading-relaxed">{item.detail}</p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-violet-600 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS / NUMBERS */}
      <section className="relative overflow-hidden py-5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-fuchsia-800 to-amber-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-amber-300 backdrop-blur">
                Expected Momentum
              </span>

              <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
                What Changes After
                <span className="text-amber-300"> 4–8 Weeks</span>
                <br />
                of a Startup Build?
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-violet-100">
                Momentum in early-stage products builds in stages. A
                testable MVP comes first, followed by real usage signal,
                and finally the infrastructure work that supports growth.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { month: "Week 1", text: "Discovery sprint defines the true MVP scope" },
                  { month: "Week 2-3", text: "Clickable prototype validated with early users" },
                  { month: "Week 4-6", text: "MVP built and shipped to production" },
                  { month: "Week 7-8", text: "Usage data flowing, first iteration cycle begins" },
                ].map((item) => (
                  <div key={item.month} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-900">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.month}</p>
                      <p className="text-violet-100">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {resultStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                >
                  <p className="font-display text-5xl font-bold text-amber-300">{s.value}</p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wide text-violet-100">
                    {s.label}
                  </p>
                </div>
              ))}

              <div className="col-span-2 rounded-3xl border border-amber-400/20 bg-white/10 p-8 backdrop-blur-xl">
                <p className="text-3xl font-bold text-white">Weekly, Visible Progress</p>
                <p className="mt-3 text-violet-100">
                  We share working software, sprint notes, and shipped
                  features every week — so you always know exactly what
                  shipped and what&apos;s next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="relative overflow-hidden py-5">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-fuchsia-800 to-amber-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white backdrop-blur">
              Startup Build Checklist
            </span>

            <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
              Before You Hire a Team to
              <span className="text-amber-300"> Build Your MVP</span>
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-violet-100">
              Whether you&apos;re pre-seed, freshly funded, or bootstrapped,
              use this checklist to evaluate any dev partner before signing
              a contract.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="group rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-lg font-bold text-slate-900 shadow-lg">
                    ✓
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                      Check #{String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="leading-relaxed text-white/90">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-amber-400/20 bg-white/10 p-8 text-center backdrop-blur-xl">
            <h3 className="font-display text-2xl font-semibold text-white">
              The Right Build Partner Ships, Not Just Talks
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-violet-100">
              If a team can&apos;t show software running in production from
              a past project, or avoids talking about ownership and
              timelines, consider it a red flag. A real startup build is
              judged on what shipped, not what was promised.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-1 text-sm font-semibold text-violet-700">
              FAQs
            </span>

            <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
              Frequently Asked
              <span className="text-violet-600"> Questions</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Everything you need to know about our startup and MVP
              development services, timelines, and ownership.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {faqs.map((f, index) => (
              <details
                key={f.q}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 font-bold text-violet-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900">{f.q}</h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-violet-600 transition-all duration-300 group-open:rotate-45 group-open:bg-violet-600 group-open:text-white">
                    +
                  </div>
                </summary>

                <div className="border-t border-slate-100 px-6 py-5">
                  <p className="leading-relaxed text-slate-600">{f.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <Testimonials /> */}

      {/* CTA */}
      <div id="contact">
        <CTABand
          heading="Let's ship the MVP that gets your startup to the next milestone"
          subtext="Share what you're building and we'll send a free scoping outline within 48 hours."
        />
      </div>

      {/* <Footer /> */}
    </main>
  );
}