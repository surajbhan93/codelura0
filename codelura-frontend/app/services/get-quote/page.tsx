import Link from "next/link";

const benefits = [
  {
    title: "No Obligation",
    desc: "Get expert advice on your project without any pressure to commit.",
  },
  {
    title: "Clear Pricing",
    desc: "Understand what your project will cost before you decide anything.",
  },
  {
    title: "Fast Response",
    desc: "We reply to every enquiry within 24 hours on business days.",
  },
  {
    title: "Expert Guidance",
    desc: "Talk directly with our founder and technical team, not a salesperson.",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose an Option",
    desc: "Book a free consultation call or submit your project details.",
  },
  {
    step: "02",
    title: "Share Your Requirements",
    desc: "Tell us about your goals, features and timeline.",
  },
  {
    step: "03",
    title: "Get Your Quote",
    desc: "We review everything and send you a clear, custom proposal.",
  },
];

export default function GetQuotePage() {
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
            Get Free Quote
          </span>

          <h1 className="mt-8 text-5xl font-bold leading-tight sm:text-6xl">
            Let&apos;s Build Something
            <span className="block text-[#5FB0FF]">Great Together.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[#8FA3C7]">
            Whether you want to talk through your idea first or you&apos;re
            ready to share your project details — we&apos;ve made it simple
            to get started, completely free of cost.
          </p>
        </div>
      </section>

      {/* TWO OPTIONS */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Consultation Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 transition hover:border-[#2D82DC]/40 hover:bg-white/[0.07]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2D82DC]/20 blur-3xl transition group-hover:bg-[#2D82DC]/30" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2D82DC]/10 text-3xl">
                  📅
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Free Consultation
                </h2>

                <p className="mt-4 leading-8 text-[#8FA3C7]">
                  Not sure where to start? Book a free 1-on-1 call with our
                  founder to discuss your idea, get expert advice and
                  understand your options — no pressure, no obligation.
                </p>

                <Link
                  href="https://calendly.com/surajbhan/free-project-consultation-codelura"
                  target="_blank"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2D82DC] px-8 py-4 font-semibold transition hover:bg-[#3E8FE5]"
                >
                  📅 Book Free Consultation
                </Link>
              </div>
            </div>

            {/* Start Project Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 transition hover:border-[#2FD9A8]/40 hover:bg-white/[0.07]">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#2FD9A8]/20 blur-3xl transition group-hover:bg-[#2FD9A8]/30" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2FD9A8]/10 text-3xl">
                  🚀
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  Start Your Project
                </h2>

                <p className="mt-4 leading-8 text-[#8FA3C7]">
                  Already know what you need? Share your project details
                  with us and our team will get back to you with a custom
                  quote within 24 hours.
                </p>

                <Link
                  href="/Enquiries"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2FD9A8] px-8 py-4 font-semibold text-[#0B1220] transition hover:bg-[#3FE8B8]"
                >
                  🚀 Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE THIS */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            Why Get a Quote From Us
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-[#8FA3C7]">
            No hidden costs, no confusing packages — just honest advice and
            a clear path forward.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#5FB0FF]/40"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">
            How It Works
          </h2>

          <div className="relative mt-16 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#2D82DC]/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2D82DC] text-sm font-bold">
                  {item.step}
                </div>

                <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-[#8FA3C7]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold">Still deciding?</h2>

          <p className="mt-5 text-lg leading-8 text-[#8FA3C7]">
            Book a free call and we&apos;ll help you figure out the right
            approach for your project — no strings attached.
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
              href="/Enquiries"
              className="rounded-full border border-white/15 px-8 py-4 font-semibold transition hover:bg-white/5"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}