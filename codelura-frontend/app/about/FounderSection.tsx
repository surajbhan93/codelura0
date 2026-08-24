import Link from "next/link";

const highlights = [
  { label: "Education", value: "B.Tech, MNNIT Allahabad" },
  { label: "Public speaker", value: "Mentor & career guide" },
  { label: "Founder", value: "Codelura & Tutvex" },
  { label: "Backend engineer", value: "APIs · Cloud · SaaS" },
];

const experience = ["FAT (USA)", "Lokharido", "GeeksforGeeks", "SynapsWeb"];

export default function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] py-10 sm:py-14">
      {/* Quiet backdrop — same network-node language as the rest of the site */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 15%, #2D82DC 0, transparent 45%), radial-gradient(circle at 90% 85%, #2FD9A8 0, transparent 40%)",
        }}
      />

      {/* <div className="relative mx-auto max-w-7xl px-6 lg:px-8"> */}
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10 xl:px-12">
        {/* <div className="grid items-center gap-16 lg:grid-cols-2"> */}
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
          {/* ---------- Content ---------- */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#9FD0FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
              Founder &amp; software engineer
            </span>

            <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Meet Suraj Bhan
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#B7C4DE] sm:text-lg">
              Founder of <span className="font-semibold text-white">Codelura</span> and{" "}
              <span className="font-semibold text-white">Tutvex</span> — building
              technology products, educational platforms and digital solutions
              for startups and businesses.
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#8FA3C7] sm:text-lg">
              Software engineer focused on backend development, APIs, cloud
              infrastructure and scalable applications.
            </p>

            {/* Highlights */}
            <div className="mt-9 grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-[#2D82DC]/40 hover:bg-white/[0.05]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5FB0FF]">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="mt-9">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8FA3C7]">
                Experience
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {experience.map((company) => (
                  <span
                    key={company}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-[#D6E2F5]"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-3.5">
              <Link
                href="/portfolio"
                className="rounded-full bg-[#2D82DC] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5FB0FF]"
              >
                View portfolio →
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* ---------- Image ---------- */}
          <div className="flex justify-center lg:justify-end">
            {/* <div className="relative w-full max-w-[580px]"> */}
            {/* <div className="relative w-full max-w-[720px]"> */}
            <div className="relative w-full max-w-[760px]">
              {/* Soft glow behind the frame — quiet, not neon */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] bg-[#2D82DC]/10 blur-2xl"
              />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/40">
                <div className="overflow-hidden rounded-[1.4rem]">
                  <img
                    src="https://res.cloudinary.com/dqaucdncd/image/upload/v1782116923/ChatGPT_Image_Jun_22_2026_01_58_32_PM_1_tqgc7m.png"
                    alt="Suraj Bhan being interviewed on stage at Josh Talks"
                    // className="aspect-[4/5] w-full object-cover"
                    // className="aspect-[5/6] w-full object-cover object-center"
                    className="aspect-[4/4.8] w-full object-cover object-center"
                  />
                </div>

                {/* Floating credential badge */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl border border-white/10 bg-[#0B1220]/85 px-4 py-3 backdrop-blur-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5FB0FF]">
                      Featured on
                    </p>
                    <p className="text-sm font-semibold text-white">Josh Talks</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-[#2FD9A8]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}