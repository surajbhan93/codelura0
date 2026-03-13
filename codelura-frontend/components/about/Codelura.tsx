"use client";

import { motion, Variants } from "framer-motion";
import {  useState } from "react";

/* ─────────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────────── */
// const fadeUp = (delay = 0) => ({
//   initial: { opacity: 0, y: 30 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true, margin: "-50px" },
//   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
// });

// const fadeLeft = (delay = 0) => ({
//   initial: { opacity: 0, x: -30 },
//   whileInView: { opacity: 1, x: 0 },
//   viewport: { once: true, margin: "-50px" },
//   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
// });

// const fadeRight = (delay = 0) => ({
//   initial: { opacity: 0, x: 30 },
//   whileInView: { opacity: 1, x: 0 },
//   viewport: { once: true, margin: "-50px" },
//   transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
// });

const fadeRightVariant: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const fadeUpVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};
const fadeLeftVariant: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};
/* ─────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────── */
function SectionLabel({ eyebrow, title, highlight, sub }: {
  eyebrow: string; title: string; highlight: string; sub?: string;
}) {
  return (
    <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  custom={0}
  viewport={{ once: true, margin: "-50px" }}
>
      <span className="mb-3 inline-block rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-violet-400">
        {eyebrow}
      </span>
      <h2 className="font-[Syne,sans-serif] text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        {title}{" "}
        <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">{sub}</p>}
      <div className="mt-5 flex justify-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   BUCKET CARD — for feature areas
───────────────────────────────────────────── */
function BucketCard({ icon, title, desc, tags, gradient, delay }: {
  icon: string; title: string; desc: string; tags: string[]; gradient: string; delay: number;
}) {
  return (
    <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
  viewport={{ once: true, margin: "-50px" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  }}
>
      {/* top gradient bar */}
      <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradient}`} />
      {/* corner glow */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20`} />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-2xl">
        {icon}
      </div>
      <h3 className="font-[Syne,sans-serif] text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-[0.82rem] leading-relaxed text-zinc-500">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[0.65rem] font-medium text-zinc-500">
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   STAT BOX
───────────────────────────────────────────── */
function StatBox({ n, label, icon }: { n: string; label: string; icon: string; delay: number }) {
  return (
    <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  className="group flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 text-center transition-all hover:border-violet-500/25"
  viewport={{ once: true, margin: "-50px" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  }}
>
      <span className="text-2xl">{icon}</span>
      <p className="font-[Syne,sans-serif] text-3xl font-extrabold text-violet-400">{n}</p>
      <p className="text-[0.75rem] text-zinc-500">{label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SERVICE ROW
───────────────────────────────────────────── */
// function ServicePill({ icon, label }: { icon: string; label: string }) {
//   return (
//     <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-all hover:border-violet-500/25 hover:bg-violet-500/[0.04]">
//       <span className="text-lg">{icon}</span>
//       <span className="text-[0.84rem] font-medium text-zinc-300">{label}</span>
//     </div>
//   );
// }

/* ─────────────────────────────────────────────
   WHY CODELURA ROW
───────────────────────────────────────────── */
function WhyRow({ icon, title, desc }: { icon: string; title: string; desc: string; delay: number }) {
  return (
    <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  className="flex gap-4"
  viewport={{ once: true, margin: "-50px" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  }}
>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/[0.08] text-xl">
        {icon}
      </div>
      <div>
        <p className="text-[0.88rem] font-semibold text-zinc-200">{title}</p>
        <p className="mt-0.5 text-[0.78rem] leading-relaxed text-zinc-500">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   HACKATHON CARD
───────────────────────────────────────────── */
function HackCard({ title, date, prize, tags, status, delay }: {
  title: string; date: string; prize: string; tags: string[]; status: "live" | "upcoming" | "past"; delay: number;
}) {
  const colors = {
    live:     "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    upcoming: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    past:     "border-zinc-500/30 text-zinc-500 bg-zinc-500/10",
  };
  return (
    <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/20"
  viewport={{ once: true, margin: "-50px" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  }}
>
      {status === "live" && (
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-[Syne,sans-serif] text-[1rem] font-bold text-white">{title}</h3>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide ${colors[status]}`}>
          {status === "live" ? "🔴 Live" : status === "upcoming" ? "⏳ Soon" : "✅ Past"}
        </span>
      </div>
      <p className="mt-1 text-[0.76rem] text-zinc-500">{date}</p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[0.82rem] font-semibold text-violet-400">🏆 {prize}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[0.63rem] text-zinc-500">{t}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   BLOG CARD
───────────────────────────────────────────── */
function BlogCard({ title, cat, readTime, date, delay }: {
  title: string; cat: string; readTime: string; date: string; delay: number;
}) {
  return (
   <motion.div
  variants={fadeUpVariant}
  initial="hidden"
  whileInView="visible"
  className="group cursor-pointer rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/25"
  viewport={{ once: true, margin: "-50px" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
    delay: 0,
  }}
>
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-2.5 py-0.5 text-[0.63rem] font-semibold uppercase tracking-wide text-violet-400">
          {cat}
        </span>
        <span className="text-[0.68rem] text-zinc-600">{readTime}</span>
      </div>
      <h3 className="font-[Syne,sans-serif] text-[0.95rem] font-bold leading-snug text-zinc-100 transition-colors group-hover:text-violet-300">
        {title}
      </h3>
      <p className="mt-3 text-[0.72rem] text-zinc-600">{date}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export function Codelura() {
  const [activeTab, setActiveTab] = useState<"b2b" | "b2c">("b2b");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');`}</style>

      <div className="font-[Outfit,sans-serif] relative">

        {/* ── ambient bg ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -left-48 top-24 h-96 w-96 rounded-full bg-violet-600/[0.05] blur-[100px]" />
          <div className="absolute -right-48 bottom-48 h-96 w-96 rounded-full bg-pink-600/[0.04] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 space-y-32">

          {/* ══════════════════════════════════════
               HERO — WHO IS CODELURA
          ══════════════════════════════════════ */}
          <section>
            {/* Top glint */}
            <div className="flex justify-center mb-10">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
            </div>

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              className="text-center mb-14"
            >
              <span className="mb-4 inline-block rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-violet-400">
                ✦ Who We Are
              </span>
              <h1 className="font-[Syne,sans-serif] text-5xl font-extrabold tracking-tight text-white md:text-6xl">
                About{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Codelura
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-zinc-400">
                A creative technology studio empowering businesses, brands, and learners in the digital era — through code, design, education, and mentorship.
              </p>
            </motion.div>

            {/* 3-col mission grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  icon: "🚀",
                  title: "Our Mission",
                  body: "To bridge the gap between academic knowledge and industry-ready skills — while helping businesses grow through scalable digital solutions.",
                  gradient: "from-violet-500 to-fuchsia-500",
                },
                {
                  icon: "💡",
                  title: "Our Vision",
                  body: "A world where every startup, creator, and student has access to world-class engineering, design, and mentorship — regardless of geography.",
                  gradient: "from-pink-500 to-rose-500",
                },
                {
                  icon: "🤝",
                  title: "Our Values",
                  body: "Transparency, quality craftsmanship, long-term value creation, and building with empathy. We grow when our clients and students grow.",
                  gradient: "from-indigo-500 to-violet-500",
                },
              ].map((c) => (
                <motion.div

                  variants={fadeUpVariant}
                  key={c.title}
                  initial="hidden"
                  whileInView="visible"
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-6 backdrop-blur-sm transition-all hover:border-violet-500/25 hover:-translate-y-1"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0,
                  }}
                >
               
                  <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${c.gradient}`} />
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="font-[Syne,sans-serif] mt-3 text-lg font-bold text-white">{c.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-relaxed text-zinc-500">{c.body}</p>
                </motion.div>
              ))}
            </div>

            {/* Description paragraphs */}
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              <motion.div
                  variants={fadeLeftVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm text-[0.875rem] leading-[1.9] text-zinc-400"
                >
                <span className="font-bold text-white">Codelura</span> is a digital-first technology brand focused on building impactful online experiences through modern website design, performance-driven digital marketing, and mentorship-led learning.
                <br /><br />
                We help <span className="font-semibold text-zinc-200">startups, creators, MSMEs, and growing businesses</span> build scalable websites, strengthen their digital presence, and convert ideas into real-world products.
              </motion.div>
              <motion.div
                  variants={fadeRightVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1,
                  }}
                  className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm text-[0.875rem] leading-[1.9] text-zinc-400"
                >
                Beyond client services, Codelura also operates in the <span className="font-semibold text-zinc-200">B2C education space</span>, offering mentorship, structured notes, digital products, and learning resources for students and early-stage developers.
                <br /><br />
                Whether its a <span className="font-semibold text-zinc-200">B2B collaboration</span> or a <span className="font-semibold text-zinc-200">B2C learning journey</span>, Codelura is built on transparency, quality, and long-term value.
              </motion.div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox n="100+"  label="Websites Delivered"     icon="🌐" delay={0}    />
              <StatBox n="500+"  label="Students Mentored"      icon="🎓" delay={0.08} />
              <StatBox n="3+"    label="Years of Excellence"    icon="📅" delay={0.16} />
              <StatBox n="50+"   label="Global Clients"         icon="🌍" delay={0.24} />
            </div>
          </section>

          {/* ══════════════════════════════════════
               1. BLOG — PROFESSIONAL CONTENT HUB
          ══════════════════════════════════════ */}
          <section>
            <SectionLabel
              eyebrow="Section 01 · Content Hub"
              title="Professional"
              highlight="Blog"
              sub="In-depth technical articles, startup stories, dev tutorials, and career guides — crafted by practitioners, not influencers."
            />

            {/* Category tabs */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {["All", "Full-Stack", "Startup", "Career", "Web3", "DSA", "System Design"].map(tab => (
                <button
                  key={tab}
                  className="rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-1.5 text-[0.75rem] font-medium text-zinc-400 transition-all hover:border-violet-500/30 hover:text-violet-400"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <BlogCard title="Building Scalable MERN Apps: A 2024 Production Guide" cat="Full-Stack" readTime="8 min read" date="Jan 15, 2025" delay={0}    />
              <BlogCard title="How We Scaled MentorSetu to 500+ Users Without VC Money" cat="Startup"    readTime="6 min read" date="Jan 08, 2025" delay={0.08} />
              <BlogCard title="From GATE AIR-823 to Startup CEO: My Unconventional Path" cat="Career"     readTime="7 min read" date="Dec 28, 2024" delay={0.16} />
              <BlogCard title="Understanding Solidity Security: Reentrancy & Overflow Attacks" cat="Web3" readTime="10 min read" date="Dec 20, 2024" delay={0.24} />
              <BlogCard title="System Design: How to Design a URL Shortener for 10M Users" cat="System Design" readTime="12 min read" date="Dec 12, 2024" delay={0.32} />
              <BlogCard title="Cracking DSA for FAANG: A 90-Day Structured Roadmap" cat="DSA"          readTime="9 min read"  date="Dec 01, 2024" delay={0.4}  />
            </div>

           <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0,
                  }}
                  className="mt-6 text-center"
                >
              <button className="rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-6 py-2.5 text-sm font-semibold text-violet-400 transition-all hover:border-violet-500/40 hover:bg-violet-500/[0.14]">
                View All Articles →
              </button>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════
               2. LEARNING MATERIAL
          ══════════════════════════════════════ */}
          <section>
            <SectionLabel
              eyebrow="Section 02 · Education"
              title="Learning"
              highlight="Material"
              sub="Handcrafted notes, curated resources, and structured roadmaps — designed for students, job seekers, and self-taught developers."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "📘", title: "Notes & PDFs",       desc: "Structured, printable notes for MERN, DSA, System Design, Web3 and more.",                        color: "from-blue-500 to-indigo-500",   tag: "200+ PDFs" },
                { icon: "🗺️",  title: "Learning Roadmaps", desc: "Visual, step-by-step roadmaps for full-stack, DevOps, blockchain, and freelancing careers.",        color: "from-violet-500 to-fuchsia-500", tag: "15+ Roadmaps" },
                { icon: "🎥", title: "Video Tutorials",    desc: "Free & premium tutorials covering React, Node.js, TypeScript, Docker, and interview preparation.",   color: "from-pink-500 to-rose-500",     tag: "100+ Videos" },
                { icon: "📝", title: "Blogs & Resources",  desc: "Long-form professional articles on startup, career, and technical topics updated weekly.",           color: "from-emerald-500 to-teal-500",  tag: "50+ Articles" },
              ].map((c, i) => (
                <motion.div
                    key={c.title}
                    variants={fadeUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.08,
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/70 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-violet-500/25"
                  >
                  <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${c.color}`} />
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-xl opacity-90`}>
                    {c.icon}
                  </div>
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[0.63rem] font-semibold text-zinc-500">{c.tag}</span>
                  <h3 className="font-[Syne,sans-serif] mt-2 text-[1rem] font-bold text-white">{c.title}</h3>
                  <p className="mt-1.5 text-[0.78rem] leading-relaxed text-zinc-500">{c.desc}</p>
                  <button className="mt-4 text-[0.76rem] font-semibold text-violet-400 hover:text-violet-300">Explore →</button>
                </motion.div>
              ))}
            </div>

            {/* Popular subjects */}
            <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.15,
                  }}
                  className="mt-6 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm"
                >
              <p className="mb-4 text-[0.66rem] font-semibold uppercase tracking-widest text-zinc-500">Popular Subjects</p>
              <div className="flex flex-wrap gap-2">
                {["MERN Stack", "Next.js 14", "TypeScript Advanced", "System Design", "DSA with Java",
                  "Web Security", "Docker & DevOps", "Solidity & Web3", "Interview Prep", "Freelancing Masterclass",
                  "Database Design", "React Native", "CI/CD Pipelines", "Node.js Internals"].map(s => (
                  <span key={s} className="cursor-pointer rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[0.75rem] text-zinc-400 transition-all hover:border-violet-500/30 hover:text-violet-400">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════
               3. SERVICES — B2B / B2C
          ══════════════════════════════════════ */}
          <section>
            <SectionLabel
              eyebrow="Section 03 · Services"
              title="What We"
              highlight="Offer"
              sub="End-to-end digital services for businesses and tailored learning products for individuals."
            />

            {/* Toggle */}
            <div className="mb-10 flex justify-center">
              <div className="flex rounded-full border border-white/[0.07] bg-zinc-900/60 p-1">
                {(["b2b", "b2c"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                      activeTab === t
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t === "b2b" ? "🏢 B2B — For Businesses" : "🎓 B2C — For Learners"}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "b2b" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <BucketCard icon="🌐" title="Website Design & Development" desc="Custom, conversion-focused websites and web apps built with React, Next.js, and Node.js. From landing pages to full SaaS platforms." tags={["React", "Next.js", "Node.js", "SEO"]}           gradient="from-violet-500 to-indigo-500"   delay={0}    />
                <BucketCard icon="📱" title="Mobile App Development"        desc="Cross-platform mobile apps using React Native. Clean UI, fast performance, and full-stack integration."                                tags={["React Native", "Expo", "Firebase"]}              gradient="from-blue-500 to-cyan-500"       delay={0.08} />
                <BucketCard icon="🎨" title="UI/UX Design & Branding"       desc="Complete brand identity, UI kits, logo design, Figma prototypes, and visual systems that convert visitors into customers."            tags={["Figma", "Brand ID", "Design System"]}           gradient="from-pink-500 to-rose-500"       delay={0.16} />
                <BucketCard icon="📈" title="Digital Marketing & SEO"       desc="Full-funnel digital marketing: SEO audits, content strategy, performance ads, social media, and growth hacking."                     tags={["SEO", "Google Ads", "Content", "Analytics"]}    gradient="from-emerald-500 to-teal-500"    delay={0.24} />
                <BucketCard icon="🔒" title="Security & DevOps"             desc="Infrastructure setup, CI/CD pipelines, cloud deployments, and security audits to keep your product production-ready."                tags={["Docker", "AWS", "CI/CD", "Pen Testing"]}        gradient="from-rose-500 to-orange-500"     delay={0.32} />
                <BucketCard icon="⛓️" title="Blockchain & Web3"             desc="Smart contract development, NFT platforms, DeFi protocols, and Web3 integrations for forward-thinking businesses."                   tags={["Solidity", "Hardhat", "Ethers.js", "NFT"]}     gradient="from-amber-500 to-yellow-500"    delay={0.4}  />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <BucketCard icon="🧑‍🏫" title="1-on-1 Mentorship"       desc="Personalized mentorship sessions with Suraj — covering career guidance, code review, mock interviews, and project feedback."    tags={["Career", "Code Review", "Interviews"]}          gradient="from-violet-500 to-fuchsia-500"  delay={0}    />
                <BucketCard icon="📚" title="Structured Notes & PDFs"    desc="200+ exam-ready, print-ready PDFs covering full-stack, DSA, Web3, and interview preparation with real-world examples."         tags={["PDF", "DSA", "MERN", "System Design"]}         gradient="from-blue-500 to-indigo-500"     delay={0.08} />
                <BucketCard icon="🎯" title="Cohort-Based Learning"      desc="Intensive, project-based cohorts where you build real products, get peer reviews, and receive weekly mentor feedback."           tags={["Cohort", "Projects", "Community"]}             gradient="from-teal-500 to-emerald-500"    delay={0.16} />
                <BucketCard icon="🏆" title="Hackathon & Competitions"   desc="Curated hackathons, live challenges, and coding competitions — with prizes, certificates, and resume-worthy project building."  tags={["Hackathon", "Prizes", "Certificate"]}          gradient="from-orange-500 to-amber-500"    delay={0.24} />
                <BucketCard icon="🗺️"  title="Roadmaps & Career Plans"   desc="Clear, opinionated learning roadmaps for every track — frontend, backend, DevOps, blockchain, and freelancing."                tags={["Roadmap", "Career", "Freelancing"]}            gradient="from-pink-500 to-rose-500"       delay={0.32} />
                <BucketCard icon="💼" title="Portfolio & Resume Reviews"  desc="Professional portfolio critiques, ATS-friendly resume edits, LinkedIn profile optimization, and GitHub cleanup."               tags={["Resume", "LinkedIn", "GitHub", "Portfolio"]}   gradient="from-indigo-500 to-violet-500"   delay={0.4}  />
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════
               4. SMART DISCOVERY & SEO
          ══════════════════════════════════════ */}
          <section>
            <SectionLabel
              eyebrow="Section 04 · Growth Engine"
              title="Smart Discovery"
              highlight="& SEO"
              sub="We don't just build — we ensure the world finds you. SEO, performance, and content strategy built into every product."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <WhyRow icon="🔍" title="Technical SEO Audits"       desc="Deep crawl analysis, Core Web Vitals optimization, schema markup, sitemap generation, and canonical URL strategy." delay={0}    />
                <WhyRow icon="📝" title="Content-Led Growth"          desc="Blog strategy, keyword research, pillar pages, and thought leadership content that ranks on Google within weeks." delay={0.08} />
                <WhyRow icon="⚡" title="Performance Engineering"     desc="Sub-2-second load times via lazy loading, CDN, image optimization, server-side rendering, and caching layers." delay={0.16} />
                <WhyRow icon="📊" title="Analytics & Conversion"      desc="GA4, Hotjar, A/B testing, heatmaps, funnel tracking, and revenue attribution dashboards — data-driven decisions." delay={0.24} />
                <WhyRow icon="🌐" title="International SEO & i18n"   desc="Multi-language support, hreflang tags, regional targeting, and market-specific keyword strategies for global reach." delay={0.32} />
              </div>

              {/* Stats card */}
             <motion.div
                variants={fadeRightVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className="rounded-2xl border border-violet-500/20 bg-gradient-to-b from-violet-900/20 to-zinc-900/60 p-7 backdrop-blur-sm"
              >
                <p className="mb-6 text-[0.66rem] font-semibold uppercase tracking-widest text-violet-400">Our SEO Impact</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { n: "10x",   l: "Avg. Traffic Growth",        c: "text-violet-400" },
                    { n: "#1",    l: "Google Ranking Achieved",     c: "text-emerald-400" },
                    { n: "3 wks", l: "Time to First Ranking",       c: "text-amber-400" },
                    { n: "40%",   l: "Avg. Conversion Improvement", c: "text-pink-400" },
                  ].map(s => (
                    <div key={s.l} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-center">
                      <p className={`font-[Syne,sans-serif] text-2xl font-extrabold ${s.c}`}>{s.n}</p>
                      <p className="mt-1 text-[0.7rem] text-zinc-500">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-[0.8rem] leading-relaxed text-zinc-500">
                  💡 Every website we build has <span className="font-semibold text-zinc-300">SEO baked in from day one</span> — not bolted on as an afterthought.
                </div>
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════
               5. HACKATHON HUB
          ══════════════════════════════════════ */}
          <section>
            <SectionLabel
              eyebrow="Section 05 · Community"
              title="Hackathon"
              highlight="Hub"
              sub="Learn by building under pressure. Codelura runs regular hackathons, live challenges, and student competitions — with real prizes and visibility."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <HackCard title="Codelura Hack 2025 — Build for Bharat"     date="Feb 15–17, 2025"   prize="₹50,000 + Internship" tags={["Full-Stack","Open Source","India"]} status="live"     delay={0}    />
              <HackCard title="AI/ML Challenge — Smart Solutions Sprint"   date="Mar 01–03, 2025"   prize="₹30,000 + Mentorship" tags={["AI","Python","LLM"]}                status="upcoming" delay={0.08} />
              <HackCard title="Web3 Hack — DeFi for the Next Billion"     date="Apr 12–14, 2025"   prize="₹40,000 + NFT Badge"  tags={["Solidity","Web3","Blockchain"]}     status="upcoming" delay={0.16} />
              <HackCard title="DevOps Challenge — Ship in 24 Hours"       date="Jan 10–11, 2025"   prize="₹20,000 + Cert"       tags={["Docker","CI/CD","AWS"]}             status="past"     delay={0.24} />
              <HackCard title="UI/UX Design Sprint — Redesign Challenge"  date="Dec 20–21, 2024"   prize="₹15,000 + Portfolio"  tags={["Figma","Design","UX"]}              status="past"     delay={0.32} />
              <HackCard title="Open Source Weekend — 500 PRs Goal"        date="Nov 15–17, 2024"   prize="₹10,000 + Swag"       tags={["GitHub","Open Source","Git"]}       status="past"     delay={0.4}  />
            </div>

            {/* Why join */}
            <motion.div
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2,
                  }}
                  className="mt-6 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm"
                >
              <p className="mb-5 text-[0.66rem] font-semibold uppercase tracking-widest text-violet-400">Why Participate?</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: "🏆", t: "Cash Prizes", d: "Real money rewards for top performers" },
                  { icon: "📜", t: "Certificates", d: "Industry-recognized completion certs" },
                  { icon: "👥", t: "Networking",   d: "Connect with 500+ developers & mentors" },
                  { icon: "💼", t: "Resume Boost", d: "Real projects to showcase to recruiters" },
                ].map(w => (
                  <div key={w.t} className="flex gap-3">
                    <span className="text-xl">{w.icon}</span>
                    <div>
                      <p className="text-[0.84rem] font-semibold text-zinc-200">{w.t}</p>
                      <p className="text-[0.74rem] text-zinc-500">{w.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Focus area pills (original 4 items) */}
           <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="mt-6 "
              >
              <p className="mb-4 text-center text-[0.66rem] font-semibold uppercase tracking-widest text-zinc-500">Core Focus Areas</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: "🌐", label: "Website Design & Development" },
                  { icon: "📣", label: "Digital Marketing & Branding" },
                  { icon: "🧑‍🏫", label: "Mentorship & Career Guidance" },
                  { icon: "📚", label: "Educational Products & Notes" },
                ].map(({ icon, label }, i) => (
                 <motion.div
                  key={label}
                  variants={fadeUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.07,
                  }}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/60 p-4 text-center transition-all hover:-translate-y-1 hover:border-violet-500/25"
                >
                    <span className="text-2xl">{icon}</span>
                    <p className="text-[0.78rem] font-medium text-zinc-300">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ══════════════════════════════════════
               BOTTOM CTA
          ══════════════════════════════════════ */}
          <section>
          <motion.div
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0,
                }}
                className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 via-zinc-900/80 to-fuchsia-900/10 p-12 text-center backdrop-blur-sm"
              >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

              <span className="mb-4 inline-block rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-violet-400">
                ✦ Start Your Journey
              </span>
              <h2 className="font-[Syne,sans-serif] text-3xl font-extrabold text-white md:text-4xl">
                Ready to{" "}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  build something great?
                </span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
                Whether you are a startup looking for a tech partner or a student ready to level up — Codelura is where growth happens.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#services" className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-bold text-white shadow-[0_4px_24px_rgba(139,92,246,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(139,92,246,0.5)]">
                  Explore Services →
                </a>
                <a href="#learn" className="rounded-full border border-violet-500/30 bg-violet-500/[0.08] px-7 py-3 text-sm font-semibold text-violet-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/[0.14]">
                  Start Learning →
                </a>
              </div>
            </motion.div>
          </section>

        </div>
      </div>
    </>
  );
}