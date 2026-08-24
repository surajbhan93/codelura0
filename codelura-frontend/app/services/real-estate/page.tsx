import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/Services/CTABand";

export const metadata: Metadata = {
  title: "Real Estate Website Design | Property Listings & Lead Systems — Pixelnext",
  description:
    "Pixelnext builds real estate websites with property listings, lead capture forms, and CRM integration that help builders, brokers, and agencies convert site visits into deals.",
};

const features = [
  {
    title: "Property listing pages",
    desc: "Detailed listing pages with photos, floor plans, pricing, amenities, and location maps, structured for both buyers browsing and search engines indexing.",
  },
  {
    title: "Advanced search & filters",
    desc: "Filter by location, budget, property type, and configuration, so buyers narrow down to relevant listings in seconds instead of scrolling endlessly.",
  },
  {
    title: "Lead capture & CRM integration",
    desc: "Every enquiry form, brochure download, or site-visit request feeds directly into your CRM or sales team's WhatsApp, with no manual data entry.",
  },
  {
    title: "Virtual tours & video walkthroughs",
    desc: "Embedded 360-degree tours or video walkthroughs let serious buyers explore a property remotely before committing to an in-person visit.",
  },
  {
    title: "EMI & budget calculators",
    desc: "An interactive calculator helps buyers quickly understand affordability, which keeps them engaged on your site longer and qualifies serious leads.",
  },
  {
    title: "Builder & project pages",
    desc: "Dedicated pages for each project with construction updates, RERA details, and amenity highlights, building the credibility larger purchases require.",
  },
];

const process = [
  {
    step: "Portfolio mapping",
    detail:
      "We catalogue your current listings or projects, your typical buyer profile, and how your sales team currently handles enquiries.",
  },
  {
    step: "Listing structure & design",
    detail:
      "We design listing and project pages that highlight what matters most to your buyer segment, from budget to amenities to RERA compliance.",
  },
  {
    step: "Build & CRM integration",
    detail:
      "Development connects lead forms directly to your CRM or sales team's communication channel, eliminating manual lead transfer.",
  },
  {
    step: "Review & launch",
    detail:
      "You review the live preview, we apply changes, run mobile and speed checks, and launch with tracking in place.",
  },
  {
    step: "Ongoing listing updates",
    detail:
      "We help add new projects, update availability, and refresh pricing as your inventory and project status changes.",
  },
];

const faqs = [
  {
    q: "Can the website handle hundreds of property listings?",
    a: "Yes, we build a structured listing system with search and filters that scales comfortably to large inventories, with bulk upload tools for adding new listings efficiently.",
  },
  {
    q: "How do leads from the website reach our sales team?",
    a: "Every enquiry, brochure download, or site-visit request can route directly to your CRM, a shared sales inbox, or WhatsApp, so your team can follow up without delay.",
  },
  {
    q: "Can we display RERA registration details for our projects?",
    a: "Yes, we include a clear, compliant section for RERA registration numbers and related disclosures on every applicable project page.",
  },
  {
    q: "Will the website support virtual tours or video walkthroughs?",
    a: "Yes, we embed 360-degree virtual tours or video walkthroughs directly on listing pages, which significantly increases time spent on page for serious buyers.",
  },
  {
    q: "Can brokers and agents have their own profile pages on the site?",
    a: "Yes, for brokerage and agency clients we build individual agent profile pages with their listings, contact details, and client testimonials.",
  },
];

export default function RealEstatePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              Commerce &amp; Property · Real Estate
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Property websites that turn browsing into site visits
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We build real estate websites with detailed listings, smart
              lead capture, and CRM integration that help builders,
              brokers, and agencies convert online interest into booked
              site visits.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
                      <a
  href="#contact"
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
                <p className="font-display text-2xl font-bold text-slate-900">
                  75+
                </p>
                <p>Real estate sites delivered</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  2.6x
                </p>
                <p>Average lead growth</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  3 wks
                </p>
                <p>Typical launch timeline</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
                alt="Modern residential apartment building exterior"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Site Visit Requested
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                3BHK &middot; Sector 45
              </p>
              <p className="text-xs text-slate-500">
                Routed to sales team instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1100&auto=format&fit=crop"
              alt="Real estate agent showing a property to clients"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Buyers shortlist three properties before calling anyone
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Real estate is one of the largest purchases most people ever
              make, and buyers research extensively online before ever
              contacting a builder or broker directly. They compare
              floor plans, amenities, pricing, and location across
              multiple projects in open browser tabs, and a property
              listing with poor photos, missing pricing, or no floor plan
              gets quietly eliminated from that shortlist.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We design listing pages to survive that comparison stage.
              High-quality photography, clear floor plans, transparent
              pricing or price ranges, and an honest amenities list all
              help a serious buyer move from "interested" to "ready to
              schedule a site visit" without needing a phone call just to
              get basic information that should already be on the page.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We also design specifically for lead quality, not just lead
              volume. A site-visit request that already specifies budget,
              preferred configuration, and timeline is far more valuable
              to a sales team than a generic "interested, please call"
              message, and we structure enquiry forms to capture this
              detail naturally rather than feeling like an interrogation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              What goes into every real estate website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Each feature is designed to move a buyer one step closer to
              a booked site visit or a serious sales conversation.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-slate-900">
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

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=700&auto=format&fit=crop"
            alt="Modern living room interior in a property listing"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=700&auto=format&fit=crop"
            alt="Aerial view of a residential housing development"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=700&auto=format&fit=crop"
            alt="Real estate agent handing over house keys"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section id="process" className="bg-[#0B1224] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How we build your real estate website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A five-stage process built around your project portfolio and
              how your sales team actually closes deals.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            {process.map((p, i) => (
              <div
                key={p.step}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <span className="font-display text-3xl font-bold text-brand-500">
                  0{i + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">
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

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Built for every kind of real estate business
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          The right structure depends on whether you build, broker, or
          manage rental property, and we adapt the site accordingly.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              name: "Builders & developers",
              detail:
                "Project-centric pages with construction progress, RERA details, and amenity highlights for large residential or commercial developments.",
            },
            {
              name: "Brokers & agencies",
              detail:
                "A searchable multi-listing catalogue with individual agent profiles and a strong lead routing system across a sales team.",
            },
            {
              name: "Rental & property management",
              detail:
                "Listings emphasising availability dates, lease terms, and a streamlined enquiry-to-viewing scheduling flow.",
            },
            {
              name: "Commercial & co-working spaces",
              detail:
                "Detailed floor plans, pricing per seat or square foot, and amenity comparisons for business decision-makers.",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <h3 className="font-display text-base font-semibold text-slate-900">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold text-slate-900">
                What changes after launch
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Builders and brokers who move from a basic listing page or
                third-party portal dependency to their own structured
                website typically see better-qualified leads arrive,
                since serious buyers self-filter using the detail provided
                before ever reaching out.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                We track site-visit conversion rate and average lead
                quality alongside raw traffic, since a smaller number of
                serious enquiries usually outperforms a flood of vague
                ones for a sales team's time and effort.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  2.6x
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Average increase in qualified site-visit requests.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  45%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  More time spent on listing pages with virtual tours.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  3 wks
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Typical launch timeline for a multi-project portfolio.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  95%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Client satisfaction score across post-launch reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          A closer look at what makes real estate websites convert
        </h2>
        <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
          <p>
            Real estate purchases involve a long, considered decision
            cycle, often spanning weeks or months and multiple
            stakeholders within a family. A website built for this
            category needs to support that extended journey rather than
            assuming a single visit will result in a decision. We design
            with this patience in mind, making it easy for a buyer to
            save listings, download a brochure for later, and return to
            compare options over several visits before reaching out.
          </p>
          <p>
            Photography and floor plans carry enormous weight in this
            category, arguably more than in almost any other industry we
            work with. A buyer cannot physically visit every project
            they're considering, especially early in their search, so the
            visual representation of a property online effectively stands
            in for that visit. We push hard for high-quality, well-lit
            photography and clear, properly labelled floor plans, since
            cutting corners here measurably reduces how seriously a
            listing is considered.
          </p>
          <p>
            Pricing transparency is a genuinely debated topic among
            developers and brokers, some of whom prefer to discuss price
            only on a call to allow room for negotiation. In our
            experience, showing at least a clear starting price or range
            upfront builds more trust than it costs in negotiating
            leverage, since serious buyers researching multiple projects
            quickly grow frustrated with listings that hide basic pricing
            information and tend to favour the ones that don't.
          </p>
          <p>
            Lead quality matters more than lead volume in real estate,
            since a sales team following up on dozens of vague enquiries
            wastes time that could go toward a handful of genuinely
            qualified ones. We structure enquiry forms to naturally
            capture budget range, preferred configuration, and intended
            timeline, which gives your sales team immediate context before
            the first call, rather than starting every conversation from
            zero.
          </p>
          <p>
            Finally, RERA compliance and transparent legal disclosure are
            not just regulatory requirements but genuine trust builders
            for Indian buyers who have become understandably cautious
            after well-publicised project delays in the broader industry.
            We design a clear, easy-to-find section for registration
            numbers and project status, presented as a sign of legitimacy
            rather than buried in fine print.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            A quick checklist before choosing a real estate website partner
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Use this list to evaluate any agency or platform vendor you
            are considering for your real estate website project.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Will listing pages include clear floor plans and high-quality photography, not just a generic image carousel?",
              "Is there a structured way to capture buyer budget and timeline in the enquiry form, rather than a single generic field?",
              "Will leads route directly into your CRM or sales team's communication channel without manual data entry?",
              "Is there a clear, compliant section for RERA registration and project disclosures?",
              "Can the listing search handle the number of properties or units you actually manage, with relevant filters?",
              "Does the proposal include virtual tour or video walkthrough support for key listings?",
              "Will the site work well for both builders showcasing a single project and brokers managing many listings, depending on your model?",
              "Is there a clear, written timeline and cost for the project?",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                <p className="text-sm leading-relaxed text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10 border-t border-slate-200">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between font-display text-base font-semibold text-slate-900">
                {f.q}
                <span className="ml-4 text-brand-500 transition group-open:rotate-45">
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

      <CTABand
        heading="Let's turn your listings into booked site visits"
        subtext="Share your project or listing portfolio and we'll show you a sample listing page within 48 hours."
      />

      {/* <Footer /> */}
    </main>
  );
}