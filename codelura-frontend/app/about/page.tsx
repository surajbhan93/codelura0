"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Testimonials from "@/components/services/Testimonials.jsx";
import FounderSection from "./FounderSection";
// ---------- Data ----------
const deliveryData = [
  { quarter: "Q1 '24", projects: 14, clients: 9 },
  { quarter: "Q2 '24", projects: 19, clients: 13 },
  { quarter: "Q3 '24", projects: 23, clients: 17 },
  { quarter: "Q4 '24", projects: 27, clients: 22 },
  { quarter: "Q1 '25", projects: 31, clients: 27 },
  { quarter: "Q2 '25", projects: 34, clients: 31 },
  { quarter: "Q3 '25", projects: 28, clients: 35 },
  { quarter: "Q4 '25", projects: 32, clients: 40 },
];
const mentorshipData = [
  { quarter: "Q1 '24", students: 180, referrals: 60 },
  { quarter: "Q2 '24", students: 420, referrals: 180 },
  { quarter: "Q3 '24", students: 760, referrals: 420 },
  { quarter: "Q4 '24", students: 1200, referrals: 700 },
  { quarter: "Q1 '25", students: 1800, referrals: 1100 },
  { quarter: "Q2 '25", students: 2700, referrals: 1600 },
  { quarter: "Q3 '25", students: 3800, referrals: 2100 },
  { quarter: "Q4 '25", students: 5000, referrals: 2500 },
];

const mentorshipStats = [
  {
    id: "01",
    value: "5000+",
    label: "Students mentored",
    note: "Students guided through mentorship, workshops and career sessions.",
  },
  {
    id: "02",
    value: "2500+",
    label: "Referral opportunities",
    note: "Students connected with internships, jobs and company referrals.",
  },
  {
    id: "03",
    value: "2 Years",
    label: "Career mentorship",
    note: "Helping students prepare for placements and software careers.",
  },
];
const stats = [
  {
    id: "01",
    value: "200+",
    label: "Projects delivered",
    note: "Web, App, AI/ML & SaaS — shipped, not just started.",
  },
  {
    id: "02",
    value: "40+",
    label: "Active clients",
    note: "Startups and businesses we currently build and maintain for.",
  },
  {
    id: "03",
    value: "2 yrs",
    label: "Track record",
    note: "Consistent delivery, quarter over quarter, since 2024.",
  },
];

const services = [
  {
    title: "AI & Automation",
    desc: "Custom AI solutions, chatbots, workflow automation, and business process optimization.",
  },
  {
    title: "Web & Mobile Development",
    desc: "Modern websites, SaaS platforms, eCommerce stores, and Android/iOS applications.",
  },
  {
    title: "Career Guidance & Mentorship",
    desc: "1-on-1 mentorship, resume reviews, interview preparation, placement guidance, and career planning.",
  },
  {
    title: "Digital Marketing",
    desc: "SEO, Google Business Profile optimization, paid ads, and growth strategies for businesses.",
  },
  {
    title: "Social Media Management",
    desc: "Professional handling of Instagram, LinkedIn, Facebook, YouTube, content creation, and branding.",
  },
  {
    title: "Google Business Profile (GBP)",
    desc: "Complete GBP setup, verification, optimization, review management, and local SEO.",
  },
  {
    title: "Study Notes & Educational Resources",
    desc: "Well-structured notes, study materials, learning resources, and educational content for students.",
  },
  {
    title: "Cloud & Backend Solutions",
    desc: "Scalable APIs, cloud deployment, database architecture, DevOps, and secure backend systems.",
  },
];

// ---------- Tooltip ----------
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#0E1730]/95 px-3.5 py-2.5 shadow-xl shadow-black/40 backdrop-blur-sm">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#8FA3C7]">
        {label}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#9FD0FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
            Projects
          </span>
          <span className="font-semibold text-white">
            {payload[0]?.payload?.projects}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-[#7FE3C3]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2FD9A8]" />
            Clients
          </span>
          <span className="font-semibold text-white">
            {payload[0]?.payload?.clients}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function AboutPage() {
  const totalProjects = useMemo(() => {
    return deliveryData.reduce((sum, d) => sum + d.projects, 0);
  }, []);

  return (
    <main className="bg-[#0B1220]">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-white/[0.06] py-24 sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #2D82DC 0, transparent 45%), radial-gradient(circle at 85% 80%, #2FD9A8 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#9FD0FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
            About Codelura
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Technology and career growth,{" "}
            <span className="text-[#5FB0FF]">built on one platform.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#8FA3C7] sm:text-lg">
            We build websites, apps, AI/ML solutions and SaaS products for
            businesses — and give developers the mentorship, blogs and job
            alerts they need to grow their careers.
          </p>
        </div>
      </section>

      {/* ---------- Impact / Stats + Chart ---------- */}
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8FA3C7]">
              Delivery record
            </span>
          </div>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
              Two years of shipping —{" "}
              <span className="text-[#5FB0FF]">not just promising.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-[#8FA3C7]">
              Every quarter below is a real release cycle — projects we
              shipped and the clients who stayed on with us.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
            <div className="flex flex-col gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-[#2D82DC]/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[11px] text-[#4A5C82]">
                      {stat.id}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#9FD0FF]">
                    {stat.label}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#8FA3C7]">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Quarterly delivery &amp; active clients
                  </p>
                  <p className="text-[12px] text-[#8FA3C7]">
                    {totalProjects}+ projects shipped across 8 quarters
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                  <span className="flex items-center gap-1.5 text-[#9FD0FF]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
                    Projects
                  </span>
                  <span className="flex items-center gap-1.5 text-[#7FE3C3]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2FD9A8]" />
                    Clients
                  </span>
                </div>
              </div>

              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={deliveryData}
                    margin={{ top: 6, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="projectsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5FB0FF" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#5FB0FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="clientsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2FD9A8" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#2FD9A8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#1E2A47" strokeDasharray="3 6" />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fill: "#5C6F94", fontSize: 11 }}
                      axisLine={{ stroke: "#1E2A47" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#5C6F94", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2D82DC", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="projects"
                      stroke="#5FB0FF"
                      strokeWidth={2}
                      fill="url(#projectsFill)"
                      activeDot={{ r: 4, fill: "#5FB0FF", stroke: "#0B1220", strokeWidth: 2 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clients"
                      stroke="#2FD9A8"
                      strokeWidth={2}
                      fill="url(#clientsFill)"
                      activeDot={{ r: 4, fill: "#2FD9A8", stroke: "#0B1220", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

<FounderSection />

{/* ---------- Mission ---------- */}
<section className="border-t border-white/[0.06] py-16 sm:py-20">
  <div className="mx-auto max-w-6xl px-6 lg:px-8">

    <div className="mb-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8FA3C7]">
        Our Mission
      </span>
    </div>

    <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">

      {/* Left */}
      <div>
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          Empowering businesses with technology,
          <span className="text-[#5FB0FF]">
            {" "}empowering students with opportunities.
          </span>
        </h2>

        <p className="mt-6 text-base leading-8 text-[#8FA3C7]">
          At <span className="font-semibold text-white">Codelura</span>, our
          mission is to bridge the gap between technology and talent.
          We help startups and businesses build modern digital products while
          supporting students through mentorship, career guidance, referrals,
          and real-world learning opportunities.
        </p>

        <p className="mt-5 text-base leading-8 text-[#8FA3C7]">
          From AI-powered applications and SaaS platforms to career mentoring,
          interview preparation, and placement support, we believe technology
          should create opportunities for everyone.
        </p>
      </div>

      {/* Right Cards */}
      <div className="grid gap-4">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-semibold text-white">
            🚀 Innovation
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#8FA3C7]">
            Building modern AI solutions, SaaS platforms and scalable software
            for businesses.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-semibold text-white">
            🎓 Education
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#8FA3C7]">
            Helping students learn, prepare for interviews and grow into
            successful software professionals.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-lg font-semibold text-white">
            🤝 Long-Term Partnership
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#8FA3C7]">
            We focus on lasting relationships with clients, startups and
            learners through continuous support and innovation.
          </p>
        </div>

      </div>

    </div>
  </div>
</section>


{/* ---------- Mentorship Impact ---------- */}
<section className="relative overflow-hidden border-t border-white/[0.06] py-10 sm:py-14">

  <div className="relative mx-auto max-w-6xl px-6 lg:px-8">

    <div className="mb-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8FA3C7]">
        Mentorship Impact
      </span>
    </div>

    <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
        Helping developers grow —
        <span className="text-[#5FB0FF]">
          from learning to landing jobs.
        </span>
      </h2>

      <p className="max-w-sm text-sm leading-relaxed text-[#8FA3C7]">
        Over the last two years we've mentored thousands of students,
        conducted mock interviews and helped candidates secure
        internships, referrals and placements.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">

      {/* Stats */}
      <div className="flex flex-col gap-4">
        {mentorshipStats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#2D82DC]/40 hover:bg-white/[0.05]"
          >
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">
                {stat.value}
              </span>

              <span className="font-mono text-[11px] text-[#4A5C82]">
                {stat.id}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-[#9FD0FF]">
              {stat.label}
            </p>

            <p className="mt-2 text-[13px] leading-relaxed text-[#8FA3C7]">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-7">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold text-white">
              Student Growth & Referrals
            </p>

            <p className="text-xs text-[#8FA3C7]">
              5000+ students mentored over the last two years
            </p>
          </div>

          <div className="flex gap-4 text-xs">

            <span className="flex items-center gap-1.5 text-[#5FB0FF]">
              <span className="h-2 w-2 rounded-full bg-[#5FB0FF]" />
              Students
            </span>

            <span className="flex items-center gap-1.5 text-[#2FD9A8]">
              <span className="h-2 w-2 rounded-full bg-[#2FD9A8]" />
              Referrals
            </span>

          </div>
        </div>

        <div className="h-64 sm:h-72">

          <ResponsiveContainer width="100%" height="100%">

            <AreaChart data={mentorshipData}>

              <defs>

                <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5FB0FF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#5FB0FF" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="referralFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2FD9A8" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2FD9A8" stopOpacity={0} />
                </linearGradient>

              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#1E2A47"
                strokeDasharray="3 6"
              />

              <XAxis
                dataKey="quarter"
                tick={{ fill: "#5C6F94", fontSize: 11 }}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#5C6F94", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="students"
                stroke="#5FB0FF"
                strokeWidth={2}
                fill="url(#studentsFill)"
              />

              <Area
                type="monotone"
                dataKey="referrals"
                stroke="#2FD9A8"
                strokeWidth={2}
                fill="url(#referralFill)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* ---------- Services ---------- */}
      <section className="border-t border-white/[0.06] py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5FB0FF]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8FA3C7]">
              What we offer
            </span>
          </div>
          <h2 className="mb-10 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
  Technology, Education & Digital Growth — All in One Place.
</h2>

          {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"> */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-[#2D82DC]/40 hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8FA3C7]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  <Testimonials />
      {/* ---------- CTA ---------- */}
      <section className="border-t border-white/[0.06] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Build with us, or grow your career with us.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#8FA3C7] sm:text-base">
            Build. Learn. Launch. — that&apos;s Codelura.
          </p>
         <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
  <a
    href="/contact"
    className="rounded-full bg-[#2D82DC] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5FB0FF]"
  >
    Start a project
  </a>

  <a
    href="/mentorship"
    className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]"
  >
    Explore mentorship
  </a>
</div>
</div>   {/* ← YE MISSING THA */}
      </section>
    </main>
  );
}