import type { Metadata } from "next";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import CTABand from "@/components/Services/CTABand";
import CTABand from "@/components/services/Ctaband";

export const metadata: Metadata = {
  title: "Ecommerce Website Development | Online Stores & Product Catalogues — Pixelnext",
  description:
    "Pixelnext builds high-converting ecommerce websites with product catalogues, secure checkout, and inventory management for online stores of every size.",
};

const features = [
  {
    title: "Product catalogue management",
    desc: "An organised, searchable catalogue with categories, filters, and variants, making it easy for shoppers to find exactly what they want.",
  },
  {
    title: "Secure checkout & payments",
    desc: "Integrated payment gateways supporting cards, UPI, net banking, and wallets, with a checkout flow optimised to reduce cart abandonment.",
  },
  {
    title: "Inventory & order management",
    desc: "Real-time stock tracking and an order dashboard that keeps your team informed without juggling spreadsheets or separate systems.",
  },
  {
    title: "Mobile-optimised shopping",
    desc: "A fast, thumb-friendly browsing and checkout experience, since the majority of online shopping traffic in India now comes from mobile devices.",
  },
  {
    title: "Abandoned cart recovery",
    desc: "Automated reminder emails or WhatsApp messages to shoppers who add items to cart but don't complete checkout, recovering otherwise lost sales.",
  },
  {
    title: "Reviews & trust signals",
    desc: "Verified product reviews, secure payment badges, and clear return policy information build the confidence needed to complete a purchase online.",
  },
];

const process = [
  {
    step: "Store planning",
    detail:
      "We map your product categories, expected catalogue size, and the payment and shipping options your business needs to support.",
  },
  {
    step: "Catalogue & design",
    detail:
      "We structure your product catalogue and design a storefront that reflects your brand while following proven ecommerce UX patterns.",
  },
  {
    step: "Build & integrate",
    detail:
      "Development connects payment gateways, shipping providers, and inventory systems, then runs thorough checkout testing.",
  },
  {
    step: "Pre-launch QA",
    detail:
      "We test every payment method, edge case, and mobile device combination before the store goes live to real customers.",
  },
  {
    step: "Launch & optimise",
    detail:
      "After launch we monitor conversion rate, cart abandonment, and page speed, continuously refining based on real shopper behaviour.",
  },
];

const faqs = [
  {
    q: "Which payment methods can be integrated into the store?",
    a: "We integrate major Indian payment gateways supporting credit and debit cards, UPI, net banking, and popular wallets, along with cash-on-delivery if your business model needs it.",
  },
  {
    q: "Can the store handle a large product catalogue with variants?",
    a: "Yes, the catalogue system supports thousands of products with size, colour, and other variant options, along with bulk upload tools to manage them efficiently.",
  },
  {
    q: "How is shipping and order tracking handled?",
    a: "We integrate with shipping providers to generate labels and tracking numbers automatically, and customers receive order status updates via email or WhatsApp.",
  },
  {
    q: "Will the store be ready for sale events and traffic spikes?",
    a: "Yes, we build on scalable hosting and load-test the checkout flow specifically for high-traffic events like festive sales, so the store stays fast under pressure.",
  },
  {
    q: "Can I manage inventory and orders without technical help?",
    a: "Yes, we provide a straightforward admin dashboard for managing products, stock levels, and orders, designed for non-technical store owners and staff.",
  },
];

export default function EcommercePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* <Navbar /> */}

      <section className="relative border-b border-slate-200 bg-gradient-to-b from-brand-50 via-white to-white">
        {/* <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28"> */}
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-600">
              Commerce &amp; Property · Ecommerce
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">
              Online stores built to turn browsers into buyers
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              We design and build ecommerce websites with organised
              product catalogues, secure checkout, and inventory tools
              that make running an online store genuinely manageable.
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
                  110+
                </p>
                <p>Online stores launched</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-slate-900">
                  2.1x
                </p>
                <p>Average conversion lift</p>
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
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"
                alt="Person shopping online on a laptop with packages nearby"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Order Confirmed
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Payment via UPI &middot; ₹2,499
              </p>
              <p className="text-xs text-slate-500">
                Shipping label generated
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1100&auto=format&fit=crop"
              alt="Boxes ready for shipping in a warehouse"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Most lost sales happen quietly, before checkout even starts
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              A shopper who adds a product to their cart has already shown
              real intent to buy. Yet a meaningful share of these shoppers
              never complete the purchase, often because of friction that
              has nothing to do with the product itself — a confusing
              checkout flow, an unexpected shipping charge revealed too
              late, or a payment option they don't trust or recognise.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              We design the entire purchase journey around removing this
              friction, from a clean product page with clear pricing and
              honest delivery estimates, to a checkout that asks for the
              minimum information needed and supports the payment methods
              Indian shoppers already trust, particularly UPI, which has
              become the default choice for a large share of online
              transactions.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              Beyond the storefront, we also think about what happens
              after the sale — order confirmation, shipping updates, and
              easy returns — because a smooth post-purchase experience is
              what turns a one-time buyer into a repeat customer, which is
              ultimately far more valuable than any single sale.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              What goes into every ecommerce build
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Each feature below directly affects either conversion rate
              or how manageable the store is to run day to day.
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
            src="https://images.unsplash.com/photo-1556741533-411cf82e4e2d?q=80&w=700&auto=format&fit=crop"
            alt="Person packing an online order box"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=700&auto=format&fit=crop"
            alt="Online store product photography setup"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=700&auto=format&fit=crop"
            alt="Smartphone showing a shopping app checkout"
            className="aspect-[3/4] w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section id="process" className="bg-[#0B1224] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              How we build your online store
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              A thorough five-stage process that treats checkout testing
              and load readiness as seriously as the design itself.
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
          Built for every kind of online store
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
          The right catalogue and checkout structure depends heavily on
          what you sell and how customers typically shop for it.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-4">
          {[
            {
              name: "Fashion & apparel",
              detail:
                "Size and colour variant management, a clear sizing guide, and an easy returns and exchange flow to reduce purchase hesitation.",
            },
            {
              name: "Electronics & gadgets",
              detail:
                "Detailed specification tables, comparison features, and warranty information presented clearly on every product page.",
            },
            {
              name: "Food & grocery",
              detail:
                "Fast, repeat-purchase-friendly checkout with saved addresses, subscription options, and delivery slot selection.",
            },
            {
              name: "Handmade & D2C brands",
              detail:
                "Story-driven product pages and brand-forward design that helps independent brands compete with larger marketplaces.",
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
                Brands that move from a marketplace-only presence or a
                basic templated store to a properly optimised one
                typically see a meaningful improvement in conversion rate,
                since small frictions in checkout and product pages add up
                to a large cumulative loss when left unaddressed.
              </p>
              <p className="mt-4 leading-relaxed text-slate-600">
                We track conversion rate, average order value, and cart
                abandonment rate after launch, since these three numbers
                together tell a much clearer story than total visits
                alone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  2.1x
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Average conversion rate improvement after relaunch.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  28%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Reduction in cart abandonment with recovery flows active.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  3 wks
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Typical launch timeline for a mid-sized catalogue.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="font-display text-3xl font-bold text-brand-500">
                  99.9%
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Uptime maintained during peak festive sale traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          A closer look at what actually drives ecommerce conversions
        </h2>
        <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
          <p>
            Ecommerce is one of the most measurable categories of website
            we build, since every design and copy decision can ultimately
            be traced back to a conversion rate number. This is both a
            blessing and a trap. It is a blessing because we can validate
            what actually works rather than relying purely on opinion, and
            a trap because it is tempting to chase small, flashy
            optimisations while ignoring larger structural issues that
            quietly cost far more in lost sales.
          </p>
          <p>
            Product pages carry the heaviest conversion weight on any
            store. We pay close attention to image quality and quantity,
            since shoppers cannot physically touch or try a product
            online, and clear, multiple-angle photography is the closest
            substitute available. Pricing needs to be unambiguous, with
            any additional charges like shipping or tax shown early rather
            than surprising the shopper at the final checkout step, which
            is one of the most common reasons for last-minute cart
            abandonment.
          </p>
          <p>
            Checkout flow design deserves disproportionate attention
            relative to how little screen time it occupies. Every
            additional field, every unclear error message, and every
            unexpected step between "add to cart" and "order confirmed"
            chips away at completion rate. We design checkout to ask only
            for what is strictly necessary, support guest checkout for
            shoppers who don't want to create an account, and surface
            UPI as a fast, familiar payment option since it now accounts
            for a substantial share of online transactions in India.
          </p>
          <p>
            Trust signals matter more for newer or independent brands
            competing against large, established marketplaces. Verified
            customer reviews, a clearly stated return policy, secure
            payment badges, and visible contact information all reduce
            the hesitation a first-time shopper feels when buying from a
            brand they have not purchased from before. We treat these as
            core design elements rather than an afterthought added near
            launch.
          </p>
          <p>
            Finally, the operational backend matters as much as the
            customer-facing storefront. An ecommerce site that looks great
            but leaves the store owner manually reconciling orders across
            three different spreadsheets will eventually break down as
            order volume grows. We build inventory and order management
            tools designed for the realistic daily workflow of a small or
            mid-sized store team, not an enterprise system that assumes a
            dedicated operations department.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            A quick checklist before choosing an ecommerce partner
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            Use this list to evaluate any agency or platform vendor before
            committing to building your online store with them.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Does the checkout flow support UPI prominently, given how widely it's used by Indian online shoppers?",
              "Is there a clear plan for abandoned cart recovery, rather than treating it as an optional add-on?",
              "Will the store be load-tested for sale-event traffic, not just normal day-to-day volume?",
              "Is the admin dashboard genuinely usable by a non-technical store owner for daily order management?",
              "Are shipping charges and delivery timelines shown early, rather than revealed only at final checkout?",
              "Does the proposal include a plan for product photography guidance, since image quality drives conversion heavily?",
              "Is there a clear strategy for displaying reviews and trust signals if you're a newer or independent brand?",
              "Is pricing and timeline for the project clearly defined in writing?",
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
        heading="Let's build a store that converts browsers into buyers"
        subtext="Share what you sell and we'll map out a catalogue and checkout plan within 48 hours, free of cost."
      />

      {/* <Footer /> */}
    </main>
  );
}