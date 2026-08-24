import Link from "next/link";

const caseStudies = [
  {
    slug: "ai-chatbot-for-edtech-startup",
    category: "AI & Automation",
    title: "AI Chatbot That Cut Support Tickets by 60%",
    desc: "Built a custom AI chatbot with RAG for an edtech startup, automating student queries and reducing support workload.",
    result: "60% fewer tickets",
    tags: ["AI", "RAG", "Chatbot"],
  },
  {
    slug: "saas-platform-for-hr-tech",
    category: "SaaS Development",
    title: "Scalable SaaS Platform for HR Management",
    desc: "Designed and developed a multi-tenant SaaS platform handling payroll, attendance and employee onboarding.",
    result: "10k+ active users",
    tags: ["Next.js", "Node.js", "MongoDB"],
  },
  {
    slug: "ecommerce-revamp-for-d2c-brand",
    category: "Web Development",
    title: "E-commerce Revamp That Boosted Conversions",
    desc: "Rebuilt a slow legacy store into a fast, modern storefront with better UX and checkout flow.",
    result: "35% more conversions",
    tags: ["React", "Performance", "UX"],
  },
  {
    slug: "cloud-migration-for-fintech",
    category: "Cloud & DevOps",
    title: "Zero-Downtime Cloud Migration for Fintech App",
    desc: "Migrated a monolithic app to AWS with Docker and CI/CD, improving deployment speed and reliability.",
    result: "Zero downtime",
    tags: ["AWS", "Docker", "CI/CD"],
  },
  {
    slug: "mobile-app-for-fitness-brand",
    category: "Mobile Development",
    title: "Cross-Platform Fitness Tracking App",
    desc: "Developed a React Native app with real-time tracking, subscriptions and social features for a fitness brand.",
    result: "4.8★ app rating",
    tags: ["React Native", "Firebase"],
  },
  {
    slug: "seo-growth-for-local-business",
    category: "Digital Marketing",
    title: "Local SEO Strategy That Tripled Organic Traffic",
    desc: "Implemented Google Business Profile optimization and local SEO for a service-based business.",
    result: "3x organic traffic",
    tags: ["SEO", "Google Business"],
  },
];

export default function CaseStudiesPage() {
  return (
    <main className="bg-[#0B1220] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 py-24">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at left,#2D82DC,transparent 40%),radial-gradient(circle at right,#2FD9A8,transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <span className="rounded-full border border-[#2D82DC]/30 bg-[#2D82DC]/10 px-5 py-2 text-sm text-[#5FB0FF]">
            Case Studies
          </span>
          <h1 className="mt-8 text-5xl font-bold leading-tight sm:text-6xl">
            Real Projects.
            <span className="block text-[#5FB0FF]">Real Results.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#8FA3C7]">
            Explore how we&apos;ve helped businesses and startups solve real
            problems with technology — from AI products to scalable
            platforms.
          </p>
        </div>
      </section>

      {/* CASE STUDIES GRID */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((item) => (
              <Link
                key={item.slug}
                href={`/blogs/${item.slug}`}
                className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#2D82DC]/40 hover:bg-white/[0.07]"
              >
                <span className="w-fit rounded-full border border-[#2D82DC]/30 bg-[#2D82DC]/10 px-3 py-1 text-xs font-medium text-[#5FB0FF]">
                  {item.category}
                </span>

                <h3 className="mt-5 text-xl font-semibold leading-snug transition group-hover:text-[#5FB0FF]">
                  {item.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#8FA3C7]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm font-semibold text-[#2FD9A8]">
                    {item.result}
                  </span>
                  <span className="text-sm font-medium text-[#5FB0FF] transition group-hover:translate-x-1">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Want results like these for your business?
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#8FA3C7]">
            Let&apos;s discuss your project and build something that actually
            moves the needle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="https://calendly.com/surajbhan/free-project-consultation-codelura"
              target="_blank"
              className="rounded-full bg-[#2D82DC] px-8 py-4 font-semibold transition hover:bg-[#3E8FE5]"
            >
              📅 Book Free Consultation
            </Link>
            <Link
              href="/blogs"
              className="rounded-full border border-white/15 px-8 py-4 font-semibold transition hover:bg-white/5"
            >
              Read Our Blogs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}