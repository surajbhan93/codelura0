import Link from "next/link";
import {
  GraduationCap,
  HeartPulse,
  Building2,
  Landmark,
  ShoppingCart,
  Factory,
  Rocket,
  Store,
  Scale,
  Plane,
  Truck,
  Hotel,
  Wheat,
  Car,
  Hammer,
  ArrowRight,
} from "lucide-react";
type Industry = {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
};

const industries: Industry[] = [
  {
    title: "Education",
    slug: "/coaching-websites",
    icon: GraduationCap,
    description:
      "School websites, coaching portals, LMS platforms and EdTech solutions.",
  },
  {
    title: "Healthcare",
    slug: "doctor-websites",
    icon: HeartPulse,
    description:
      "Hospital management systems, clinic websites and healthcare apps.",
  },
  {
    title: "Real Estate",
    slug: "real-estate",
    icon: Building2,
    description:
      "Property listing portals, CRM solutions and lead generation systems.",
  },
  {
    title: "Finance",
    slug: "finance",
    icon: Landmark,
    description:
      "FinTech products, secure portals and financial automation tools.",
  },
  {
    title: "E-Commerce",
    slug: "ecommerce",
    icon: ShoppingCart,
    description:
      "Online stores, marketplaces and D2C brand platforms.",
  },
  {
    title: "Manufacturing",
    slug: "manufacturing",
    icon: Factory,
    description:
      "ERP systems, inventory management and factory automation.",
  },
  {
    title: "Startups",
    slug: "startups",
    icon: Rocket,
    description:
      "MVP development, SaaS products and startup growth solutions.",
  },
  {
    title: "Local Businesses",
    slug: "local-business",
    icon: Store,
    description:
      "Websites and marketing solutions for local brands.",
  },
  {
    title: "Legal Services",
    slug: "legal-services",
    icon: Scale,
    description:
      "Law firm websites, case management and legal portals.",
  },
  {
    title: "Travel & Tourism",
    slug: "travel-business",
    icon: Plane,
    description:
      "Booking systems, travel websites and tourism platforms.",
  },
  {
    title: "Logistics",
    slug: "logistics",
    icon: Truck,
    description:
      "Fleet tracking, logistics management and transport solutions.",
  },
  {
    title: "Hospitality",
    slug: "clinic-websites",
    icon: Hotel,
    description:
      "Hotel websites, restaurant ordering and hospitality software.",
  },
  {
    title: "Agriculture",
    slug: "agriculture",
    icon: Wheat,
    description:
      "AgriTech platforms, farmer portals and agriculture software.",
  },
  {
    title: "Automobile",
    slug: "automobile",
    icon: Car,
    description:
      "Dealer management systems and automotive websites.",
  },
  {
    title: "Construction",
    slug: "construction",
    icon: Hammer,
    description:
      "Construction company websites and project management systems.",
  },
];
export default function Industries() {
  return (
    <section className="relative overflow-hidden py-28 bg-[#030712]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
            Industries We Serve
          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-white md:text-6xl">
            Solutions Built For
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Every Industry
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            From startups to enterprises, we deliver software, websites,
            mobile apps and digital growth solutions tailored to industry needs.
          </p>
        </div>

        {/* Featured Card */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <h3 className="text-3xl font-bold text-white">
                Serving 50+ Industries Across India
              </h3>

              <p className="mt-3 max-w-2xl text-slate-400">
                We build custom software, websites, mobile apps,
                ERP systems, CRM solutions and SEO strategies
                for businesses of all sizes.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Discuss Your Project
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Industry Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry) => {
            const Icon = industry.icon;

            return (
              <Link
                key={industry.slug}
                href={`/services/${industry.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-white/[0.08]"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition-all group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={30} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">
                    {industry.title}
                  </h3>

                  <p className="mt-3 text-slate-400 leading-relaxed">
                    {industry.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-blue-400 font-medium">
                    Explore Industry Solutions
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Content */}
        <div className="mt-20 text-center">
          <p className="mx-auto max-w-5xl text-slate-400 leading-8">
            Codelura Technologies provides Website Development,
            Mobile App Development, Custom Software Development,
            SEO Services, Google Ads Management and Digital Marketing
            solutions for Education, Healthcare, Real Estate,
            Finance, E-Commerce, Manufacturing, Startups,
            Logistics, Hospitality and other industries.
          </p>
        </div>
      </div>
    </section>
  );
}