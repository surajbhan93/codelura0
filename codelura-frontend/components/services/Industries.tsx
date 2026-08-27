import Link from "next/link";
import React from "react";
import {
  GraduationCap, HeartPulse, Building2, Landmark, ShoppingCart,
  Factory, Rocket, Store, Scale, Plane, Truck, Hotel, Wheat, Car,
  Hammer, ArrowRight,
} from "lucide-react";

type Industry = {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
  accent: string;
};

const industries: Industry[] = [
  { title: "Education",       slug: "/coaching-websites", icon: GraduationCap, description: "School websites, coaching portals, LMS platforms and EdTech solutions.",          accent: "from-violet-500 to-purple-600" },
  { title: "Healthcare",      slug: "doctor-websites",    icon: HeartPulse,    description: "Hospital management systems, clinic websites and healthcare apps.",               accent: "from-rose-500 to-pink-600" },
  { title: "Real Estate",     slug: "real-estate",        icon: Building2,     description: "Property listing portals, CRM solutions and lead generation systems.",           accent: "from-amber-500 to-orange-600" },
  { title: "Finance",         slug: "finance",            icon: Landmark,      description: "FinTech products, secure portals and financial automation tools.",                accent: "from-emerald-500 to-teal-600" },
  { title: "E-Commerce",      slug: "ecommerce",          icon: ShoppingCart,  description: "Online stores, marketplaces and D2C brand platforms.",                          accent: "from-cyan-500 to-blue-600" },
  { title: "Manufacturing",   slug: "manufacturing",      icon: Factory,       description: "ERP systems, inventory management and factory automation.",                      accent: "from-slate-400 to-zinc-500" },
  { title: "Startups",        slug: "startups",           icon: Rocket,        description: "MVP development, SaaS products and startup growth solutions.",                   accent: "from-fuchsia-500 to-pink-600" },
  { title: "Local Businesses",slug: "local-business",     icon: Store,         description: "Websites and marketing solutions for local brands.",                            accent: "from-yellow-400 to-amber-500" },
  { title: "Legal Services",  slug: "legal-services",     icon: Scale,         description: "Law firm websites, case management and legal portals.",                         accent: "from-indigo-500 to-violet-600" },
  { title: "Travel & Tourism",slug: "travel-business",    icon: Plane,         description: "Booking systems, travel websites and tourism platforms.",                       accent: "from-sky-500 to-cyan-600" },
  { title: "Logistics",       slug: "logistics",          icon: Truck,         description: "Fleet tracking, logistics management and transport solutions.",                  accent: "from-orange-500 to-red-600" },
  { title: "Hospitality",     slug: "clinic-websites",    icon: Hotel,         description: "Hotel websites, restaurant ordering and hospitality software.",                  accent: "from-pink-500 to-rose-600" },
  { title: "Agriculture",     slug: "agriculture",        icon: Wheat,         description: "AgriTech platforms, farmer portals and agriculture software.",                   accent: "from-lime-500 to-green-600" },
  { title: "Automobile",      slug: "automobile",         icon: Car,           description: "Dealer management systems and automotive websites.",                            accent: "from-zinc-400 to-slate-500" },
  { title: "Construction",    slug: "construction",       icon: Hammer,        description: "Construction company websites and project management systems.",                  accent: "from-amber-600 to-yellow-500" },
];

export default function Industries() {
  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-16">
      {/* Subtle background glows */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-950/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-950/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-5">
            Industries We Serve
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Solutions Built For
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Every Industry
            </span>
          </h2>
          <p className="mt-5 text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            From startups to enterprises — websites, apps and digital growth tailored to your domain.
          </p>
        </div>

        {/* ── Banner strip ── */}
        <div className="mb-14 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-white font-bold text-lg sm:text-xl">Serving 50+ Industries Across India</p>
            <p className="text-slate-500 text-sm mt-1">Custom software · Websites · Mobile apps · ERP · CRM · SEO</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            Discuss Your Project
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* ── Industry Grid ── */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <Link
                key={ind.slug}
                href={`/services/${ind.slug}`}
                className="group relative flex flex-col bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 transition-all duration-300 hover:border-white/20 hover:bg-[#111] hover:-translate-y-1"
              >
                {/* Icon with accent gradient bg on hover */}
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-gradient-to-br ${ind.accent} transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-white">
                  {ind.title}
                </h3>

                {/* Thin accent divider */}
                <div className={`h-px w-8 rounded-full bg-gradient-to-r ${ind.accent} mb-3 transition-all duration-300 group-hover:w-14`} />

                {/* Description */}
                <p className="text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed transition-colors flex-1">
                  {ind.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-slate-600 group-hover:text-slate-300 transition-colors uppercase tracking-widest">
                  Explore
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom SEO text ── */}
        <p className="mt-16 text-center text-xs text-slate-700 max-w-4xl mx-auto leading-relaxed">
          Codelura Technologies provides Website Development, Mobile App Development, Custom Software Development,
          SEO Services, Google Ads Management and Digital Marketing solutions for Education, Healthcare, Real Estate,
          Finance, E-Commerce, Manufacturing, Startups, Logistics, Hospitality and other industries.
        </p>
      </div>
    </section>
  );
}