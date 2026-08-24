import Link from "next/link";

const services = [
  "AI Solutions",
  "Web Development",
  "Mobile Apps",
  "SaaS Platforms",
  "CRM & ERP Systems",
  "SEO Optimization",
  "Google Business Profile",
  "Social Media Management",
  "Career Mentorship",
  "UI / UX Design",
  "Cloud Infrastructure",
  "Maintenance & Support",
];

const process = [
  {
    step: "01",
    title: "Book Free Consultation",
    desc: "Schedule a free meeting with our experts.",
  },
  {
    step: "02",
    title: "Requirement Discussion",
    desc: "Understand your goals, features and expectations.",
  },
  {
    step: "03",
    title: "Planning & Estimation",
    desc: "Technology stack, timeline and project planning.",
  },
  {
    step: "04",
    title: "Custom Proposal",
    desc: "Transparent quotation with detailed scope.",
  },
  {
    step: "05",
    title: "Project Kickoff",
    desc: "Development begins after approval.",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-[#0B1220] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(circle at left,#2D82DC,transparent 40%),radial-gradient(circle at right,#2FD9A8,transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <span className="rounded-full border border-[#2D82DC]/30 bg-[#2D82DC]/10 px-5 py-2 text-sm text-[#5FB0FF]">
            Custom Pricing
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight sm:text-6xl">
            Every Project Is Different.
            <span className="block text-[#5FB0FF]">
              So Is Our Pricing.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#8FA3C7]">
            At Codelura, we don&apos;t believe in one-size-fits-all pricing.
            Every project is unique, and our pricing depends on your
            requirements, features, technology stack, integrations,
            timeline and long-term goals.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="https://calendly.com/surajbhan/free-project-consultation-codelura"
              target="_blank"
              className="rounded-full bg-[#2D82DC] px-8 py-4 font-semibold transition hover:bg-[#3E8FE5]"
            >
              📅 Book Free Consultation
            </Link>

            <Link
              href="/services"
              className="rounded-full border border-white/15 px-8 py-4 font-semibold transition hover:bg-white/5"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CUSTOM */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            Why We Don&apos;t Show Fixed Pricing
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-[#8FA3C7]">
            Every business has different goals, features and technical
            requirements. That&apos;s why we prepare a custom quotation
            for every client.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-[#2D82DC]/40 hover:bg-white/[0.07]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D82DC]/10 text-3xl transition group-hover:scale-110">
                ⚙️
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                Project Complexity
              </h3>

              <p className="mt-4 leading-8 text-[#8FA3C7]">
                Landing pages, SaaS platforms, AI products and enterprise
                applications all require different planning, architecture
                and development effort.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-[#2FD9A8]/40 hover:bg-white/[0.07]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2FD9A8]/10 text-3xl transition group-hover:scale-110">
                🚀
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                Features & Integrations
              </h3>

              <p className="mt-4 leading-8 text-[#8FA3C7]">
                Authentication, payment gateways, AI, dashboards, APIs,
                cloud deployment and automation all affect pricing.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:border-[#5FB0FF]/40 hover:bg-white/[0.07]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5FB0FF]/10 text-3xl transition group-hover:scale-110">
                🤝
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                Long-Term Partnership
              </h3>

              <p className="mt-4 leading-8 text-[#8FA3C7]">
                We also provide maintenance, hosting, SEO, marketing,
                upgrades and continuous technical support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            What We Can Build For You
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-[#8FA3C7]">
            From idea to launch — our services cover every stage of your
            digital journey.
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#C7D6EE] transition hover:border-[#2D82DC]/50 hover:bg-[#2D82DC]/10 hover:text-white"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            How Pricing Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-[#8FA3C7]">
            A simple, transparent process from first call to project
            kickoff.
          </p>

          <div className="relative mt-16 grid gap-6 md:grid-cols-5">
            {/* connecting line for desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

            {process.map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#2D82DC]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D82DC] text-sm font-bold">
                  {item.step}
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">
            Ready to get a custom quote?
          </h2>

          <p className="mt-5 text-lg leading-8 text-[#8FA3C7]">
            Book a free consultation and let&apos;s discuss your project
            requirements, timeline and budget.
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
              href="/contact"
              className="rounded-full border border-white/15 px-8 py-4 font-semibold transition hover:bg-white/5"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}