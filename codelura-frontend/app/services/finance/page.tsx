import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/services/Ctaband";
import FinanceHeroBadge from "./FinanceHeroBadge";
// import Testimonials from "@/components/services/Testimonials";

export const metadata: Metadata = {
  title: "Finance Website Development | FinTech, Banking & Secure Portals — Pixelnext",
  description:
    "Pixelnext builds secure, compliant websites and portals for banks, NBFCs, insurers, wealth managers and fintech startups, designed to convert visitors into verified leads and onboarded customers.",
};

const features = [
  {
    title: "Bank-grade security architecture",
    desc: "SSL, data encryption, OWASP-aligned coding practices and secure authentication are built in from day one, not bolted on after launch.",
  },
  {
    title: "Compliance-ready by design",
    desc: "Pages, disclaimers, and data-handling flows are structured to align with RBI, SEBI and IRDAI guidelines relevant to your specific financial product.",
  },
  {
    title: "Secure customer & partner portals",
    desc: "Login-gated dashboards for account holders, advisors, or channel partners, with role-based access and document upload built in.",
  },
  {
    title: "Loan, EMI & investment calculators",
    desc: "Interactive calculators that let visitors model returns or repayments themselves, since this is what keeps serious prospects on the page longest.",
  },
  {
    title: "KYC & lead-capture automation",
    desc: "Forms that connect directly to your CRM or core banking system, so a submitted enquiry becomes a tracked lead instantly, not an email to chase.",
  },
  {
    title: "Performance under real traffic",
    desc: "Built to stay fast and stable during high-traffic moments like rate announcements or market news, when financial sites get the most visitors.",
  },
] as const;

const buildProcess = [
  {
    step: "Discovery & compliance mapping",
    detail:
      "We map your product type, target regulator, and required disclosures before a single screen is designed, since compliance gaps are expensive to fix later.",
  },
  {
    step: "Information architecture",
    detail:
      "We structure the site around how a borrower, investor, or policyholder actually decides, not around your internal org chart.",
  },
  {
    step: "Secure design & build",
    detail:
      "Next.js and Tailwind give us a fast, component-driven build, with encrypted forms and secure session handling for any portal areas.",
  },
  {
    step: "Calculator & portal integration",
    detail:
      "EMI calculators, return projections, and customer dashboards are wired to your real rate cards and APIs, not placeholder numbers.",
  },
  {
    step: "Launch & ongoing monitoring",
    detail:
      "After launch we monitor uptime, form submissions, and page speed monthly, since a financial site going down during peak hours has a real cost.",
  },
] as const;

const financeSegments = [
  {
    name: "Banks & NBFCs",
    icon: "🏦",
    detail:
      "Loan product pages, branch locators, and EMI calculators that turn rate-shoppers into branch walk-ins and online applications.",
  },
  {
    name: "Insurance providers",
    icon: "🛡️",
    detail:
      "Plan comparison tools and premium calculators that simplify complex policy terms so visitors can self-select with confidence.",
  },
  {
    name: "Wealth & investment platforms",
    icon: "📈",
    detail:
      "Portfolio dashboards, return projections, and onboarding flows built for KYC-first journeys with minimal drop-off.",
  },
  {
    name: "Fintech & payment startups",
    icon: "⚡",
    detail:
      "Developer-friendly landing pages, API documentation hubs, and conversion-focused signup flows built for a fast-moving product roadmap.",
  },
] as const;

const resultStats = [
  {
    value: "3.1x",
    label: "Average increase in qualified enquiry forms within 90 days.",
  },
  {
    value: "99.9%",
    label: "Uptime maintained across client portals during peak traffic.",
  },
  {
    value: "1.4s",
    label: "Average page load time on calculator and product pages.",
  },
  {
    value: "90%",
    label: "Client retention into a second year of ongoing support.",
  },
] as const;

const checklist = [
  "Will they map out compliance and disclosure requirements before designing a single page?",
  "Do they have direct experience securing customer-facing financial portals, not just marketing sites?",
  "Is there a clear plan for calculators or tools that match your actual product, not generic placeholders?",
  "Will leads from forms flow directly into your CRM or core system, instead of sitting in an inbox?",
  "Do they explain how the site is monitored for uptime and speed after launch, not just at handover?",
  "Is there a documented plan for data encryption and secure authentication on any login areas?",
  "Will the design clearly differentiate your products, rather than listing every service identically?",
  "Is pricing transparent and tied to a defined scope, with no vague 'enterprise quote' delays?",
] as const;

const faqs = [
  {
    q: "Can you build a website that meets RBI or SEBI-related guidelines?",
    a: "Yes. We structure disclosures, data handling, and required disclaimers based on your specific financial product category, working alongside your compliance or legal team to confirm final language.",
  },
  {
    q: "Do you build secure login portals for customers or partners?",
    a: "Yes, we build role-based portals with encrypted sessions and secure authentication, commonly used for customer dashboards, advisor logins, or channel partner access.",
  },
  {
    q: "Can the website integrate with our core banking or CRM system?",
    a: "In most cases, yes. We connect lead forms, calculators, and portal data to your existing CRM, core banking system, or internal APIs, depending on what access your team can provide.",
  },
  {
    q: "How do you handle high traffic during events like rate changes or market news?",
    a: "We build on Next.js with performance optimisation and load testing before launch, and monitor uptime and speed monthly so the site stays stable during traffic spikes.",
  },
  {
    q: "How long does a finance website project typically take?",
    a: "A marketing site with calculators typically takes 4 to 6 weeks. Projects including secure customer portals or API integrations usually take 8 to 12 weeks, depending on integration complexity.",
  },
] as const;

export default function FinanceWebsitesPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      {/* HERO */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-12">
          <div>
            <FinanceHeroBadge />

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Websites that earn trust before the first form is filled
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We design and build secure, compliant websites and portals for
              banks, NBFCs, insurers and fintech platforms — built to convert
              visitors into verified leads, not just page views.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/Enquiries?services=Finance%20Website&medium=organic"
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  gap-2
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-emerald-600
                  via-teal-500
                  to-indigo-600
                  px-8
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-xl
                  shadow-emerald-500/30
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:shadow-2xl
                  hover:shadow-emerald-500/40
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
                  border-emerald-500
                  bg-gradient-to-r
                  from-emerald-50
                  to-teal-50
                  px-8
                  py-3
                  text-sm
                  font-semibold
                  text-emerald-700
                  shadow-lg
                  shadow-emerald-500/20
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-teal-500
                  hover:shadow-xl
                  hover:shadow-teal-500/30
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
                <p className="font-display text-2xl font-bold text-slate-900">60+</p>
                <p>Finance platforms shipped</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">99.9%</p>
                <p>Portal uptime maintained</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">3.1x</p>
                <p>Average lead growth</p>
              </div>
            </div>
          </div>

          {/* SIGNATURE VISUAL — live-style ticker card, finance-native motif */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[#0B1224] shadow-2xl shadow-slate-200">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Portfolio Overview
                  </span>
                </div>
                <span className="text-xs text-slate-500">Live</span>
              </div>

              <div className="space-y-4 px-6 py-6">
                {[
                  { name: "Growth Fund", value: "₹12,48,300", change: "+4.2%", up: true },
                  { name: "Fixed Income", value: "₹6,02,150", change: "+0.8%", up: true },
                  { name: "Equity SIP", value: "₹3,17,940", change: "-1.1%", up: false },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{row.name}</p>
                      <p className="text-xs text-slate-400">{row.value}</p>
                    </div>
                    <span
                      className={
                        row.up
                          ? "text-sm font-semibold text-emerald-400"
                          : "text-sm font-semibold text-rose-400"
                      }
                    >
                      {row.change}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-32 px-6 pb-6">
                <svg viewBox="0 0 300 80" className="h-full w-full" preserveAspectRatio="none">
                  <polyline
                    points="0,60 30,55 60,58 90,40 120,45 150,30 180,35 210,18 240,24 270,10 300,15"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Verified Lead Captured
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Loan enquiry — ₹25L, 7.2% rate
              </p>
              <p className="text-xs text-slate-500">Routed to CRM in 4 seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1100&auto=format&fit=crop"
              alt="Financial dashboard with charts and data"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="font-display text-2xl font-bold text-brand-500">68%</p>
              <p className="mt-1 text-xs leading-snug text-slate-500">
                of visitors leave a financial site that feels untrustworthy within seconds
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Trust is decided before anyone reads a word
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              People hand over income details, loan documents, and
              investment decisions through your website. If the design,
              speed, or security feels off for even a moment, they leave —
              no matter how strong your actual rates or products are.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                  1
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Visible security signals </span>
                  — encryption, secure forms, and clear data-handling language reassure
                  visitors before they type a single digit.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                  2
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Clarity over complexity </span>
                  — calculators and comparisons that simplify decisions convert far better
                  than dense product brochures.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                  3
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">Reliability under load </span>
                  — a site that slows down during a rate announcement loses exactly the
                  leads it most needs to capture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-100/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              Everything You Need
            </div>

            <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
              What&apos;s included in every
              <span className="block text-brand-600">finance website build</span>
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              These six pillars work together — skipping any one of them
              usually shows up later as a compliance gap or a lost lead.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, index) => (
              <div
                key={f.title}
                className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-400 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                  <span className="text-lg font-bold">{(index + 1).toString().padStart(2, "0")}</span>
                </div>

                <h3 className="font-display text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-brand-600">
                  {f.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600">{f.desc}</p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span>Learn more</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-slate-500">Ready to build a site that converts?</p>
            <a
              href="/Enquiries?service=Finance%20Website&medium=organic"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-brand-600 transition-all hover:gap-3 hover:text-brand-700"
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
          <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200/50">
            Real Results
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            See what happens when you <br />
            <span className="text-brand-600">design for trust first</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            From security to speed to conversion — we track every metric that
            matters for a financial platform&apos;s growth.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=700&auto=format&fit=crop"
              alt="Secure data and lock icon overlay on laptop"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Security
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Bank-Grade Protection</h3>
                <p className="mt-1 text-sm text-white/80">Encrypted, audited, compliant</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=700&auto=format&fit=crop"
              alt="Person reviewing financial charts on a tablet"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Conversion
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Calculators That Convert</h3>
                <p className="mt-1 text-sm text-white/80">Self-serve decision tools</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=700&auto=format&fit=crop"
              alt="Team reviewing reports and dashboards"
              className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 p-6">
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Reliability
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">Stable Under Load</h3>
                <p className="mt-1 text-sm text-white/80">Built for traffic spikes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-200/50 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-600">4.8/5</p>
            <p className="mt-1 text-sm text-slate-600">Average Client Rating</p>
          </div>
          <div className="text-center sm:border-l sm:border-r sm:border-slate-200">
            <p className="text-3xl font-bold text-brand-600">60+</p>
            <p className="mt-1 text-sm text-slate-600">Finance Platforms Built</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-600">₹40Cr+</p>
            <p className="mt-1 text-sm text-slate-600">Loan & AUM Enquiries Routed</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Trusted by NBFCs & fintechs
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Proven lead growth
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Security-first builds
          </span>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-[#0B1224] py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How our finance website process works
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A five-stage build that starts with compliance, not colour
              palettes, and continues as ongoing monitoring after launch.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {buildProcess.map((p, i) => (
              <div key={p.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="font-display text-3xl font-bold text-brand-500">
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
            <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              Who We Build For
            </span>

            <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
              Different Financial Products,
              <span className="text-emerald-600"> Different Buying Journeys</span>
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              A loan applicant, an investor, and a policyholder all decide
              differently. We design around each journey, not a single
              one-size-fits-all template.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {financeSegments.map((item) => (
              <div
                key={item.name}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  {item.icon}
                </div>

                <h3 className="font-display text-xl font-semibold text-slate-900">
                  {item.name}
                </h3>

                <p className="mt-3 text-slate-600 leading-relaxed">{item.detail}</p>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS / NUMBERS */}
      <section className="relative overflow-hidden py-5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-indigo-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-emerald-300 backdrop-blur">
                Expected Growth
              </span>

              <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
                What Changes After
                <span className="text-emerald-300"> 3–6 Months</span>
                <br />
                of a Finance Website Build?
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-emerald-100">
                Strong growth in finance happens in stages. Trust signals and
                speed improve first, followed by enquiry volume, and finally
                a measurable drop in cost per qualified lead.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  { month: "Week 1-2", text: "Compliance mapping & secure architecture set up" },
                  { month: "Week 3-6", text: "Calculators, portals and lead capture go live" },
                  { month: "Month 2-3", text: "Organic enquiries rise as trust signals take effect" },
                  { month: "Month 4-6", text: "Lower cost per lead and higher portal engagement" },
                ].map((item) => (
                  <div key={item.month} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-bold text-slate-900">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.month}</p>
                      <p className="text-emerald-100">{item.text}</p>
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
                  <p className="font-display text-5xl font-bold text-emerald-300">{s.value}</p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wide text-emerald-100">
                    {s.label}
                  </p>
                </div>
              ))}

              <div className="col-span-2 rounded-3xl border border-emerald-400/20 bg-white/10 p-8 backdrop-blur-xl">
                <p className="text-3xl font-bold text-white">Transparent Monthly Reporting</p>
                <p className="mt-3 text-emerald-100">
                  We track uptime, page speed, form submissions, and lead
                  quality — so you always know exactly what&apos;s working and
                  what needs attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <section className="relative overflow-hidden py-5">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-indigo-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white backdrop-blur">
              Finance Website Checklist
            </span>

            <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
              Before You Invest in a
              <span className="text-emerald-300"> Finance Website</span>
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-emerald-100">
              Whether you&apos;re a bank, NBFC, insurer, or fintech startup,
              use this checklist to evaluate any agency before signing a
              development contract.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="group rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-lg">
                    ✓
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Check #{String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="leading-relaxed text-white/90">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-emerald-400/20 bg-white/10 p-8 text-center backdrop-blur-xl">
            <h3 className="font-display text-2xl font-semibold text-white">
              The Right Build Partner Should Be Transparent
            </h3>
            <p className="mx-auto mt-3 max-w-3xl text-emerald-100">
              If an agency skips compliance questions, avoids talking about
              security, or can&apos;t explain their integration plan clearly,
              consider it a red flag. Sustainable finance websites are built
              on trust, clarity, and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
              FAQs
            </span>

            <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
              Frequently Asked
              <span className="text-emerald-600"> Questions</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Everything you need to know about our finance website services,
              compliance, security, and timelines.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {faqs.map((f, index) => (
              <details
                key={f.q}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900">{f.q}</h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-emerald-600 transition-all duration-300 group-open:rotate-45 group-open:bg-emerald-600 group-open:text-white">
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
          heading="Let's build a finance website your customers trust instantly"
          subtext="Share your product type and we'll send a free compliance & conversion review within 48 hours."
        />
      </div>

      {/* <Footer /> */}
    </main>
  );
}