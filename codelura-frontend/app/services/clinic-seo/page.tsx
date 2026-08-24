import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/services/Ctaband";
import SeoHeroBadge from "./SeoHeroBadge";
import Testimonials from "@/components/services/Testimonials";
// import Testimonials from "@/components/services/Testimonials";import Testimonials from "@/components/services/Testimonials";
// import Testimonials from "@/components/services/Testimonials";
export const metadata: Metadata = {
  title: "Clinic SEO Services | Local Healthcare SEO & Maps Visibility — Pixelnext",
  description:
    "Pixelnext runs local SEO and Google Maps visibility programs for clinics and hospitals, helping them rank for nearby searches and turn that visibility into booked appointments.",
};

const features = [
  {
    title: "Google Business Profile optimisation",
    desc: "We fully build out your profile with correct categories, services, photos, and posting cadence, since this is what shows up first in 'near me' searches.",
  },
  {
    title: "Local keyword targeting",
    desc: "We research the exact phrases patients in your city use — 'best dermatologist in [area]', 'dental clinic near [landmark]' — and build pages around them.",
  },
  {
    title: "Review generation system",
    desc: "A simple, automated WhatsApp or SMS flow asks satisfied patients for a Google review right after their visit, while the experience is still fresh.",
  },
  {
    title: "On-page medical SEO",
    desc: "Page titles, headings, schema markup, and internal linking are structured around how Google evaluates healthcare ('YMYL') content specifically.",
  },
  {
    title: "Citation & directory listings",
    desc: "Consistent name, address, and phone details across Practo, JustDial, IndiaMart, and other medical directories strengthen your local ranking signals.",
  },
  {
    title: "Monthly ranking reports",
    desc: "A plain-language monthly report shows keyword position changes, map pack visibility, and enquiry volume, not just raw traffic numbers.",
  },
] as const;

const seoProcess = [
  {
    step: "SEO audit",
    detail:
      "We audit your current website, Google Business Profile, and directory listings to find exactly what is holding back local visibility today.",
  },
  {
    step: "Keyword & competitor research",
    detail:
      "We identify which searches matter most in your city and study what the clinics currently ranking above you are doing right.",
  },
  {
    step: "On-page fixes",
    detail:
      "We restructure page titles, headings, and content gaps on your existing site, or rebuild key pages where the gap is too large to patch.",
  },
  {
    step: "Local signal building",
    detail:
      "We optimise your Google Business Profile, fix directory inconsistencies, and set up an ongoing review collection system.",
  },
  {
    step: "Track & refine monthly",
    detail:
      "We review rankings and enquiry data every month and adjust the plan, since local SEO is an ongoing process, not a one-time fix.",
  },
] as const;

const searchBehaviours = [
  {
    name: "Emergency & urgent care",
    detail:
      "Fast-loading pages and prominent phone numbers matter most, since these searches happen under time pressure with little browsing.",
  },
  {
    name: "Elective & cosmetic procedures",
    detail:
      "Longer research-driven searches need detailed content covering cost, recovery, and before/after expectations.",
  },
  {
    name: "Diagnostic & testing centres",
    detail:
      "Searches focus on specific test names and pricing, so individual test pages outperform a single generic services page.",
  },
  {
    name: "Multi-branch hospital chains",
    detail:
      "Each branch needs its own optimised local presence, since Google ranks each location independently of the brand overall.",
  },
] as const;

const seoInsights = [
  {
    title: "Medical Trust Signals",
    icon: "🏥",
    desc: "Healthcare websites need stronger expertise, authority and trust signals than most local businesses."
  },
  {
    title: "Google Business Profile",
    icon: "📍",
    desc: "Optimizing your Google listing is often the fastest way to improve local visibility and patient inquiries."
  },
  {
    title: "Patient Reviews",
    icon: "⭐",
    desc: "Review quantity and quality directly impact both rankings and patient trust."
  },
  {
    title: "Service Pages",
    icon: "📄",
    desc: "Dedicated pages for each treatment perform better than generic service listings."
  },
  {
    title: "Citation Consistency",
    icon: "🔗",
    desc: "Matching clinic details across Google, Practo, JustDial and your website strengthens local SEO."
  }
];

const resultStats = [
  {
    value: "2.7x",
    label: "Average growth in organic enquiry volume within 6 months.",
  },
  {
    value: "85%",
    label: "Of clients reach map pack top 3 for at least one key term.",
  },
  {
    value: "4x",
    label: "Average review count growth in the first 90 days.",
  },
  {
    value: "92%",
    label: "Client retention into a second year of the SEO program.",
  },
] as const;

const checklist = [
  "Will they start with a real audit of your Google Business Profile and current rankings, rather than a generic pitch deck?",
  "Do they have experience with healthcare specifically, given the stricter standards Google applies to medical content?",
  "Is there a clear, ongoing plan for review collection, not just a one-time request to 'ask patients for reviews'?",
  "Will they build dedicated pages for your key services, rather than one general services page for everything?",
  "Do they report monthly with specific keyword rankings and map pack position, not just vague 'traffic improved' claims?",
  "Is citation consistency across directories like Practo and JustDial part of the plan?",
  "Do they explain clearly when results are realistically expected, rather than promising overnight rankings?",
  "Is the pricing transparent and tied to a defined scope of monthly work?",
] as const;

const faqs = [
  {
    q: "How long does clinic SEO take to show results?",
    a: "Most clinics see initial Google Business Profile improvements within 3 to 4 weeks. Organic keyword ranking improvements typically build over 3 to 6 months of consistent work.",
  },
  {
    q: "Do I need a new website, or can SEO work with my current one?",
    a: "In many cases we can improve your current website's structure and content. If the existing site has deep technical issues, we recommend specific fixes or a partial rebuild rather than starting from zero unnecessarily.",
  },
  {
    q: "How important are Google reviews for clinic SEO?",
    a: "Extremely important. Review count and rating directly influence your position in the local map pack, which is often the first thing a patient sees before clicking through to any website.",
  },
  {
    q: "Can you help if my clinic has multiple branches in different areas?",
    a: "Yes, each branch needs its own optimised Google Business Profile and a dedicated local landing page, since Google treats each location as a distinct local search entity.",
  },
  {
    q: "What is included in the monthly SEO report?",
    a: "You receive keyword position tracking, map pack visibility, Google Business Profile insights, review growth, and an estimate of enquiries attributable to organic search, explained in plain language.",
  },
] as const;

export default function ClinicSEOPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      {/* HERO */}
      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        {/* <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28"> */}
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-12">
          <div>
            <SeoHeroBadge />

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Get found first when patients search nearby
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We run local SEO and Google Maps visibility programs built
              specifically for healthcare, so your clinic shows up when
              patients in your city search for the care you provide.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
            <a
  href="/Enquiries?services=Clinic%20SEO&medium=organic"
  className="
    group
    relative
    inline-flex
    items-center
    gap-2
    overflow-hidden
    rounded-full
    bg-gradient-to-r
    from-blue-600
    via-cyan-500
    to-emerald-500
    px-8
    py-3.5
    text-sm
    font-semibold
    text-white
    shadow-xl
    shadow-cyan-500/30
    transition-all
    duration-300
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-2xl
    hover:shadow-cyan-500/40
  "
>
  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

  <span className="relative z-10">
    Get a Free Quote
  </span>

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
    border-blue-500
    bg-gradient-to-r
    from-blue-50
    to-cyan-50
    px-8
    py-3
    text-sm
    font-semibold
    text-blue-700
    shadow-lg
    shadow-blue-500/20
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-500
    hover:shadow-xl
    hover:shadow-cyan-500/30
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
                <p className="font-display text-2xl font-bold text-slate-900">140+</p>
                <p>Clinics ranked locally</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">3-6 mo</p>
                <p>Typical ranking timeline</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">2.7x</p>
                <p>Average enquiry growth</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop"
                alt="Person searching for a clinic on a smartphone map"
                className="h-[420px] w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Map Pack Position
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                #2 for &quot;dentist near me&quot;
              </p>
              <p className="text-xs text-slate-500">Up from #14 in 90 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
     {/* WHY IT MATTERS */}
<section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
  <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
    <div className="relative">
      <img
        src="https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1100&auto=format&fit=crop"
        alt="Laptop showing analytics dashboard"
        className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
        loading="lazy"
      />
      <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
        <p className="font-display text-2xl font-bold text-brand-500">93%</p>
        <p className="mt-1 text-xs leading-snug text-slate-500">
          of clicks go to the top 3 map pack results
        </p>
      </div>
    </div>

    <div>
      <h2 className="font-display text-3xl font-semibold text-slate-900">
        Most patients never scroll past the map pack
      </h2>
      <p className="mt-5 leading-relaxed text-slate-600">
        When someone searches &quot;clinic near me,&quot; Google shows
        three highlighted results before any website link appears. Miss
        that pack, and you are invisible to most nearby searchers — no
        matter how good your website is.
      </p>

      <div className="mt-8 space-y-5">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
            1
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">
              Profile activity & reviews{" "}
            </span>
            — how complete your Business Profile is, and how many recent
            reviews back it up.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
            2
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">
              Listing consistency{" "}
            </span>
            — the same business details everywhere, so Google trusts what
            it sees.
          </p>
        </div>
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
            3
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-900">
              Ongoing upkeep{" "}
            </span>
            — rankings slip within months once a clinic stops investing,
            so we treat this as infrastructure, not a campaign.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* FEATURES GRID */}
   
{/* FEATURES GRID - Enhanced Design */}
<section className="relative bg-gradient-to-b from-slate-50 to-white py-5 overflow-hidden">
  {/* Background Decorative Elements */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-100/20 blur-3xl" />
    <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
    {/* Section Header with Better Visual Impact */}
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200/50">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
        </span>
        Everything You Need
      </div>
      
      <h2 className="mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
        What's included in every 
        <span className="block text-brand-600">clinic SEO program</span>
      </h2>
      
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        These six pillars work together — skipping any one of them
        usually limits how high you can realistically rank.
      </p>
    </div>

    {/* Feature Grid with Enhanced Cards */}
    <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, index) => (
        <div
          key={f.title}
          className="group relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Card Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-brand-400 to-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Icon/Number Badge */}
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 ring-1 ring-brand-200/50 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
            <span className="text-lg font-bold">{(index + 1).toString().padStart(2, '0')}</span>
          </div>

          <h3 className="font-display text-xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-brand-600">
            {f.title}
          </h3>
          
          <p className="mt-3 leading-relaxed text-slate-600">{f.desc}</p>

          {/* Hover Arrow Indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span>Learn more</span>
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      ))}
    </div>

    {/* Optional CTA at Bottom */}
    <div className="mt-16 text-center">
      <p className="text-sm text-slate-500">
        Ready to start ranking higher?
      </p>
      <a href="/Enquiries?service=Website%20Development&medium=organic" className="mt-2 inline-flex items-center gap-2 font-semibold text-brand-600 transition-all hover:gap-3 hover:text-brand-700">
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
  {/* Section Header */}
  <div className="mx-auto max-w-3xl text-center">
    <span className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-200/50">
      Real Results
    </span>
    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
      See what happens when you <br />
      <span className="text-brand-600">optimize the right way</span>
    </h2>
    <p className="mt-4 text-lg leading-relaxed text-slate-600">
      From analytics to rankings to reviews — we track every metric that matters
      for your clinic's online growth.
    </p>
  </div>

  {/* Image Grid with Overlays */}
  <div className="mt-12 grid gap-6 sm:grid-cols-3">
    {/* Image 1 */}
    <div className="group relative overflow-hidden rounded-2xl">
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=700&auto=format&fit=crop"
        alt="Analytics charts showing growth"
        className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
        loading="lazy"
      />
      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-6">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Analytics
          </span>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Data-Driven Growth
          </h3>
          <p className="mt-1 text-sm text-white/80">
            Track every KPI that matters
          </p>
        </div>
      </div>
    </div>

    {/* Image 2 */}
    <div className="group relative overflow-hidden rounded-2xl">
      <img
        src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=700&auto=format&fit=crop"
        alt="Person reviewing search ranking data"
        className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-6">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Rankings
          </span>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Top Search Positions
          </h3>
          <p className="mt-1 text-sm text-white/80">
            Rank higher than competitors
          </p>
        </div>
      </div>
    </div>

    {/* Image 3 */}
    <div className="group relative overflow-hidden rounded-2xl">
      <img
        src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=700&auto=format&fit=crop"
        alt="Smartphone showing star ratings and reviews"
        className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-6">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Reputation
          </span>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Stellar Reviews
          </h3>
          <p className="mt-1 text-sm text-white/80">
            Build trust with real feedback
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Stats Bar */}
  <div className="mt-16 grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-200/50 sm:grid-cols-3">
    <div className="text-center">
      <p className="text-3xl font-bold text-brand-600">4.9/5</p>
      <p className="mt-1 text-sm text-slate-600">Average Client Rating</p>
    </div>
    <div className="text-center sm:border-l sm:border-r sm:border-slate-200">
      <p className="text-3xl font-bold text-brand-600">100+</p>
      <p className="mt-1 text-sm text-slate-600">Clinics Optimized</p>
    </div>
    <div className="text-center">
      <p className="text-3xl font-bold text-brand-600">1.2M+</p>
      <p className="mt-1 text-sm text-slate-600">Monthly Impressions</p>
    </div>
  </div>

  {/* Trust Badge */}
  <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
    <span className="flex items-center gap-2">
      <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Trusted by healthcare leaders
    </span>
    <span className="flex items-center gap-2">
      <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Proven ROI results
    </span>
    <span className="flex items-center gap-2">
      <svg className="h-5 w-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      HIPAA compliant
    </span>
  </div>
</section>

      {/* PROCESS */}
      <section id="process" className="bg-[#0B1224] py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How our clinic SEO process works
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A five-stage cycle that starts with an honest audit and
              continues as a monthly, measured program.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {seoProcess.map((p, i) => (
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

      {/* SEARCH BEHAVIOUR BY CATEGORY */}
     <section className="bg-slate-50 py-5">
  <div className="mx-auto max-w-7xl px-6 lg:px-10">

    <div className="text-center">
      <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
        Patient Search Intent
      </span>

      <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
        SEO Built Around How
        <span className="text-blue-600"> Patients Actually Search</span>
      </h2>

      <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
        Every healthcare specialty has different search patterns. We create
        content and SEO campaigns based on real patient behaviour.
      </p>
    </div>

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {searchBehaviours.map((item, index) => (
        <div
          key={item.name}
          className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
            {["🦷", "❤️", "👶", "🩺"][index]}
          </div>

          <h3 className="font-display text-xl font-semibold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-3 text-slate-600 leading-relaxed">
            {item.detail}
          </p>

          <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </div>
      ))}
    </div>

  </div>
</section>

      {/* RESULTS / NUMBERS */}
    <section className="relative overflow-hidden py-5">
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-700" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]" />

  <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
    <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

      {/* Left Content */}
      <div>
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-cyan-300 backdrop-blur">
          Expected SEO Growth
        </span>

        <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
          What Changes After
          <span className="text-cyan-300"> 3–6 Months</span>
          <br />
          of Clinic SEO?
        </h2>

        <p className="mt-6 text-lg leading-relaxed text-blue-100">
          Strong SEO growth happens gradually. Clinics usually see
          improvements in local map rankings first, followed by organic
          traffic growth and increased patient enquiries.
        </p>

        {/* Timeline */}
        <div className="mt-10 space-y-6">
          {[
            {
              month: "Month 1",
              text: "Technical SEO audit & Google Business Profile optimization",
            },
            {
              month: "Month 2-3",
              text: "Improved local visibility and more profile interactions",
            },
            {
              month: "Month 3-4",
              text: "Keyword rankings start climbing for key treatments",
            },
            {
              month: "Month 5-6",
              text: "Increase in patient calls, bookings and organic traffic",
            },
          ].map((item) => (
            <div key={item.month} className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-900">
                ✓
              </div>

              <div>
                <p className="font-semibold text-white">{item.month}</p>
                <p className="text-blue-100">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Stats */}
      <div className="grid grid-cols-2 gap-6">
        {resultStats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
          >
            <p className="font-display text-5xl font-bold text-cyan-300">
              {s.value}
            </p>

            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-blue-100">
              {s.label}
            </p>
          </div>
        ))}

        {/* Extra Trust Card */}
        <div className="col-span-2 rounded-3xl border border-cyan-400/20 bg-white/10 p-8 backdrop-blur-xl">
          <p className="text-3xl font-bold text-white">
            Transparent Monthly Reporting
          </p>

          <p className="mt-3 text-blue-100">
            We track rankings, traffic, calls, leads, and patient enquiries —
            so you always know exactly what's improving and what needs
            attention.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

    

      {/* CHECKLIST */}
 {/* CLINIC SEO CHECKLIST */}
<section className="relative overflow-hidden py-5">
  {/* Background Effects */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-700" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_35%)]" />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_35%)]" />

  <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
    <div className="text-center">
      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white backdrop-blur">
        Clinic SEO Success Checklist
      </span>

      <h2 className="mt-5 font-display text-4xl font-bold text-white lg:text-5xl">
        Before You Invest in
        <span className="text-cyan-300"> Clinic SEO</span>
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">
        Whether you're a dental clinic, dermatology center, physiotherapy
        clinic, or multi-speciality hospital, use this checklist to evaluate
        any SEO agency before signing a monthly contract.
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
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                Check #{String(index + 1).padStart(2, "0")}
              </div>

              <p className="leading-relaxed text-white/90">
                {item}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Trust Box */}
    <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-white/10 p-8 text-center backdrop-blur-xl">
      <h3 className="font-display text-2xl font-semibold text-white">
        The Right SEO Partner Should Be Transparent
      </h3>

      <p className="mx-auto mt-3 max-w-3xl text-blue-100">
        If an agency guarantees #1 rankings, avoids reporting, or can't explain
        their strategy clearly, consider it a red flag. Sustainable clinic SEO
        is built on trust, content quality, local authority, and patient
        experience.
      </p>
    </div>
  </div>
</section>
      {/* FAQ */}
      {/* FAQ SECTION */}
<section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-5">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_35%)]" />

  <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
    <div className="text-center">
      <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
        FAQs
      </span>

      <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
        Frequently Asked
        <span className="text-blue-600"> Questions</span>
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Everything you need to know about our clinic SEO services,
        timelines, rankings, and results.
      </p>
    </div>

    <div className="mt-14 space-y-5">
      {faqs.map((f, index) => (
        <details
          key={f.q}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
        >
          <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="font-display text-lg font-semibold text-slate-900">
                {f.q}
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-bold text-blue-600 transition-all duration-300 group-open:rotate-45 group-open:bg-blue-600 group-open:text-white">
              +
            </div>
          </summary>

          <div className="border-t border-slate-100 px-6 py-5">
            <p className="leading-relaxed text-slate-600">
              {f.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  </div>
</section>
{/* Testimonials */}
<Testimonials />
      {/* CTA — wrapped with id="contact" since the hero CTA links to
          #contact, but CTABand itself doesn't render an id. Without this
          wrapper the "Get a Free Quote" hero link had nowhere to scroll to. */}
      <div id="contact">
        <CTABand
          heading="Let's get your clinic into the local map pack"
          subtext="Share your clinic name and city and we'll send a free ranking snapshot within 48 hours."
        />
      </div>

      {/* <Footer /> */}
    </main>
  );
}