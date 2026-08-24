import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
import CTABand from "@/components/Services/ctAband";

export const metadata: Metadata = {
  title: "Travel & Business Website Design | Service Websites & Growth Systems — Pixelnext",
  description:
    "Pixelnext builds websites and growth systems for travel agencies and service businesses, with itinerary pages, booking enquiry flows, and lead systems that drive growth.",
};

const features = [
  {
    title: "Itinerary & package pages",
    desc: "Detailed, visually rich pages for each tour package or service offering, with pricing, inclusions, and a clear day-by-day breakdown where relevant.",
  },
  {
    title: "Booking enquiry & quote forms",
    desc: "A simple enquiry flow that captures travel dates, group size, or service requirements, routing straight to your sales team for fast follow-up.",
  },
  {
    title: "Customer testimonial showcase",
    desc: "Real traveler or client stories and photos build the trust needed for people to commit to a trip or service booking sight unseen.",
  },
  {
    title: "WhatsApp-first communication",
    desc: "Since most travel and service enquiries in India happen over WhatsApp, every page is built around making that the easiest next step.",
  },
  {
    title: "Service area & coverage maps",
    desc: "For service businesses, a clear map of operating areas helps prospective clients quickly confirm you serve their location.",
  },
  {
    title: "Lead tracking & growth dashboard",
    desc: "A simple dashboard shows where enquiries are coming from, which packages or services generate the most interest, and what to focus on next.",
  },
];

const process = [
  {
    step: "Understanding your offerings",
    detail:
      "We map your packages, services, target customer, and how enquiries currently flow into your business.",
  },
  {
    step: "Content & structure",
    detail:
      "We organise packages or services into clear pages and draft content highlighting what makes each one worth booking.",
  },
  {
    step: "Design & build",
    detail:
      "A design reflecting your brand's personality is built, then development adds enquiry forms, WhatsApp integration, and tracking.",
  },
  {
    step: "Review & launch",
    detail:
      "You review the live preview, request changes, and we launch after a final mobile and speed check.",
  },
  {
    step: "Ongoing growth support",
    detail:
      "We track which packages or services drive the most enquiries and help you refine offerings and content based on real demand.",
  },
];

const faqs = [
  {
    q: "Can the website handle multiple travel packages with different pricing?",
    a: "Yes, each package gets its own page with pricing, inclusions, exclusions, and itinerary details, with a simple system for updating seasonal pricing.",
  },
  {
    q: "How do booking enquiries reach our team?",
    a: "Every enquiry routes instantly to WhatsApp, email, or both, including key details like travel dates and group size, so your team can respond quickly with relevant information.",
  },
  {
    q: "Can service businesses outside travel use this too?",
    a: "Yes, the same structure works well for consulting, home services, B2B service providers, and other growth-focused businesses that rely on enquiry-driven leads.",
  },
  {
    q: "Can we showcase customer reviews and trip photos?",
    a: "Yes, we build a dedicated testimonial and photo showcase section that updates easily as new customer stories come in.",
  },
  {
    q: "Do you help with ongoing marketing after the website launches?",
    a: "We can recommend and set up basic growth systems like lead tracking and review collection, and can discuss broader marketing support based on your needs.",
  },
];

export default function TravelBusinessPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              Commerce &amp; Property · Travel &amp; Business
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Service websites built into real growth systems
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We build websites for travel agencies and service businesses
              with compelling package pages, fast enquiry routing, and the
              lead tracking needed to keep growing month after month.
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
                  95+
                </p>
                <p>Travel &amp; service sites built</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  2.3x
                </p>
                <p>Average enquiry growth</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  10 days
                </p>
                <p>Typical turnaround</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200">
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop"
                alt="Traveler with backpack looking at a scenic mountain view"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                New Enquiry
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Bali Package &middot; 4 travelers
              </p>
              <p className="text-xs text-slate-500">
                Sent to WhatsApp instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=1100&auto=format&fit=crop"
              alt="Person planning a trip with a map and laptop"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              A package page should sell the trip before the call
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Whether someone is planning a family vacation or researching
              a service provider for their business, they form most of
              their opinion before ever speaking to a human. A travel
              package page with vague descriptions and no clear pricing
              forces a phone call just to get basic information, and many
              prospective customers simply move on to a competitor who
              made that information easy to find.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We design package and service pages to do the selling
              upfront — clear inclusions and exclusions, a realistic
              day-by-day itinerary where relevant, and pricing that sets
              honest expectations. When the call finally happens, it
              becomes a conversation about customisation and booking
              details rather than basic fact-finding, which makes your
              sales team's time far more productive.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We also think about repeat and referral business, which
              tends to matter enormously for travel and service brands.
              A well-organised testimonial section, paired with an easy
              way for happy customers to share photos or reviews, helps
              new prospects trust a brand they have never used before,
              long before they pick up the phone.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              What goes into every travel &amp; service website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Each feature is designed to reduce friction between
              interest and a confirmed booking or service enquiry.
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
            src="https://images.unsplash.com/photo-1499591934245-40b55745b905?q=80&w=700&auto=format&fit=crop"
            alt="Group of travelers exploring a destination"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=700&auto=format&fit=crop"
            alt="Business professional consulting with a client"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=700&auto=format&fit=crop"
            alt="Scenic travel destination with mountains and lake"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section id="process" className="bg-[#0B1224] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How we build your travel or service website
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A practical five-step process focused on turning your
              offerings into a clear, enquiry-generating online presence.
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
          Built for every kind of travel or service business
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          The right structure depends on what you offer and how customers
          typically research and book it.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              name: "Travel agencies & tour operators",
              detail:
                "Destination and package pages with itineraries, inclusions, and group or custom trip enquiry options.",
            },
            {
              name: "Home & local services",
              detail:
                "Service area coverage maps, transparent pricing, and a fast quote-request flow for time-sensitive enquiries.",
            },
            {
              name: "B2B consulting & agencies",
              detail:
                "Case studies, service breakdowns, and a structured discovery-call booking flow for longer sales cycles.",
            },
            {
              name: "Event & hospitality businesses",
              detail:
                "Visual-heavy package pages with availability calendars and a clear enquiry-to-booking confirmation flow.",
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
                Travel and service businesses that move from a thin
                brochure site to a structured, enquiry-focused one
                typically see better-qualified leads, since prospects
                arrive already informed about pricing and offerings
                rather than starting the conversation from scratch.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                We track which packages or services generate the most
                enquiries, which often reveals demand your team had not
                fully recognised, helping guide what to promote or expand
                next.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  2.3x
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Average increase in booking and service enquiries.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  55%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Of enquiries now arrive via WhatsApp instead of calls.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  10 days
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Typical build time for a multi-package website.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  93%
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
          A closer look at building growth systems, not just websites
        </h2>
        <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
          <p>
            Many travel agencies and service businesses think of their
            website as a digital brochure — something to point people
            toward once a relationship already exists through referrals
            or social media. This undersells what a well-built website
            can actually do. A genuinely structured site becomes an active
            growth channel in its own right, generating fresh enquiries
            from people who have never heard of your brand through any
            other channel.
          </p>
          <p>
            Package and service pages need to do real persuasive work,
            not just list information. For travel specifically, this means
            going beyond a generic itinerary template and actually
            conveying what makes a destination or experience worth
            choosing — the kind of detail a customer would only otherwise
            get from a knowledgeable friend who has been there. For
            service businesses, this means clearly explaining the process,
            timeline, and outcome a client can expect, rather than vague
            claims about quality or expertise.
          </p>
          <p>
            WhatsApp deserves particular emphasis for this category, since
            a significant share of Indian travel and service enquiries
            already happen through it informally, often starting with a
            forwarded message or a screenshot. We design every key page
            to make WhatsApp the obvious next step, rather than forcing
            visitors through a traditional contact form that feels more
            effortful than the channel they would naturally prefer to
            use.
          </p>
          <p>
            Trust and social proof matter enormously in categories where
            customers are essentially buying an experience or an outcome
            they cannot fully evaluate in advance. Real traveler photos
            and stories, client case studies, and visible review counts
            all reduce the uncertainty a new customer feels, particularly
            for higher-value bookings like international trips or
            significant service contracts.
          </p>
          <p>
            Finally, we treat the website as a feedback loop rather than a
            static asset. Tracking which packages or service pages
            generate the most enquiries reveals real demand patterns that
            often surprise business owners, who may have assumed a
            different offering was their strongest draw. This data, fed
            back into what you promote and how you price, is what turns a
            website from a one-time project into an ongoing growth system.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            A quick checklist before choosing a website partner
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Use this list to evaluate any agency you are considering for
            your travel or service business website.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Will each package or service get a dedicated page with real, persuasive detail, rather than a generic template?",
              "Is WhatsApp integration treated as a primary channel, given how Indian customers actually prefer to enquire?",
              "Is pricing or a starting range shown clearly, rather than hidden behind a forced contact step?",
              "Will enquiries capture useful context like dates, group size, or service needs before reaching your team?",
              "Is there a plan for showcasing real customer testimonials and photos, not generic stock imagery?",
              "Does the agency understand the difference between a one-time brochure site and an ongoing growth system?",
              "Will you get visibility into which pages or packages generate the most enquiries after launch?",
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
        heading="Let's turn your offerings into a real growth engine"
        subtext="Share your packages or services and we'll show you a sample page within 48 hours, free of cost."
      />

      {/* <Footer /> */}
    </main>
  );
}