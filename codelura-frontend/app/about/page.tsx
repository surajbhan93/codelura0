"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Codelura } from "@/components/about/Codelura";
import type { Variants } from "framer-motion";
// import { BottomLine } from "@/components/shared/BottomLine";
// import { MySkill } from "@/components/about/MySkill";
// import { Education } from "@/components/about/Education";
// import { Experience } from "@/components/about/Experience";
import { TeamScroller } from "@/components/about/TeamScroller";

/* ─────────────────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────────────────── */
const fadeUp = (delay = 0): Variants => ({
  initial: { opacity: 0, y: 32 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  },
});

const fadeLeft = (delay = 0): Variants => ({
  initial: { opacity: 0, x: -40 },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  },
});

const fadeRight = (delay = 0): Variants => ({
  initial: { opacity: 0, x: 40 },
  whileInView: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  },
});

/* ─────────────────────────────────────────────────────
   SECTION WRAPPER — consistent spacing + label
───────────────────────────────────────────────────── */
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative py-20 ${className}`}>
      {children}
    </section>
  );
}


/* ─────────────────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────────────────── */
function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle?: string;
}) {
  return (
    <motion.div {...fadeUp(0)} className="mb-14 text-center">
      <span className="mb-3 inline-block rounded-full border border-teal-500/25 bg-teal-500/[0.08] px-4 py-1.5 font-[Outfit,sans-serif] text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-400">
        {eyebrow}
      </span>
      <h2 className="font-[Syne,sans-serif] text-4xl font-extrabold tracking-tight text-zinc-100 md:text-5xl">
        {title}{" "}
        <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
          {subtitle}
        </p>
      )}
      <div className="mt-5 flex justify-center">
        <div className="h-px w-16 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────── */
function StatCard({
  number,
  label,
  icon,
  delay,
}: {
  number: string;
  label: string;
  icon: string;
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/30 hover:bg-zinc-900/90"
    >
      <div className="pointer-events-none absolute -right-4 -top-4 text-6xl opacity-[0.06] transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-110 select-none">
        {icon}
      </div>
      <p className="font-[Syne,sans-serif] text-3xl font-extrabold text-teal-400">{number}</p>
      <p className="mt-1 text-[0.8rem] text-zinc-400">{label}</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   ACHIEVEMENT BADGE
───────────────────────────────────────────────────── */
function AchievementBadge({
  icon,
  title,
  sub,
  color,
  delay,
}: {
  icon: string;
  title: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`flex items-start gap-3.5 rounded-2xl border ${color} p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1`}
    >
      <span className="mt-0.5 text-2xl">{icon}</span>
      <div>
        <p className="text-[0.88rem] font-semibold text-zinc-200">{title}</p>
        <p className="mt-0.5 text-[0.76rem] text-zinc-500">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────────────────── */
function ServiceCard({
  icon,
  title,
  desc,
  tags,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  delay: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:bg-zinc-900/80"
    >
      {/* corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-500/[0.06] blur-2xl transition-all duration-500 group-hover:bg-teal-500/[0.12]" />

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/[0.08] text-2xl">
        {icon}
      </div>
      <h3 className="font-[Syne,sans-serif] text-lg font-bold text-zinc-100">{title}</h3>
      <p className="mt-2 text-[0.82rem] leading-relaxed text-zinc-500">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[0.66rem] font-medium uppercase tracking-wide text-zinc-500"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   SKILL BAR
───────────────────────────────────────────────────── */
function SkillBar({
  label,
  percent,
  color,
  delay,
}: {
  label: string;
  percent: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="group">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.82rem] font-medium text-zinc-300">{label}</span>
        <span className="text-[0.75rem] text-zinc-500">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{ duration: 1, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   TIMELINE CARD  (education / experience)
───────────────────────────────────────────────────── */
function TimelineCard({
  year,
  title,
  org,
  desc,
  badge,
  badgeColor,
  delay,
}: {
  year: string;
  title: string;
  org: string;
  desc: string;
  badge: string;
  badgeColor: string;
  delay: number;
}) {
  return (
    <motion.div {...fadeLeft(delay)} className="relative pl-8">
      {/* dot */}
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-teal-500 bg-zinc-900" />
      {/* line segment */}
      <div className="absolute left-[5px] top-4 h-full w-px bg-gradient-to-b from-teal-500/30 to-transparent" />

      <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/20">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-wider ${badgeColor}`}>
            {badge}
          </span>
          <span className="text-[0.72rem] text-zinc-600">{year}</span>
        </div>
        <h3 className="font-[Syne,sans-serif] text-[1rem] font-bold text-zinc-100">{title}</h3>
        <p className="mt-0.5 text-[0.8rem] font-medium text-teal-400">{org}</p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-zinc-500">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT ROW
───────────────────────────────────────────────────── */
function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[0.66rem] uppercase tracking-widest text-zinc-600">{label}</p>
        <p className="text-[0.84rem] font-medium text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SOCIAL BUTTON
───────────────────────────────────────────────────── */
function SocialBtn({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-400 transition-all duration-200 hover:border-teal-500/40 hover:bg-teal-500/[0.08] hover:text-teal-400"
    >
      {icon}
    </a>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
export default function AboutPage() {
  const [resumeLink, setResumeLink] = useState("");

  /* ── Original API logic — unchanged ── */
  useEffect(() => {
    axios
      .get("https://codewithsuraj-portfolio-backend.onrender.com/api/resume/latest")
      .then((res) => {
        setResumeLink(
          "https://codewithsuraj-portfolio-backend.onrender.com" + res.data.path
        );
      });
  }, []);

  /* ─────────────────────────────────── */
  return (
    <>
      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className="font-[Outfit,sans-serif] min-h-screen bg-[#0a0908] text-zinc-300">

        {/* ── Page-level ambient ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-64 top-32 h-[500px] w-[500px] rounded-full bg-teal-500/[0.04] blur-[120px]" />
          <div className="absolute -right-64 bottom-32 h-[400px] w-[400px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">

          {/* ════════════════════════════════════
               0. CODELURA + TEAM SCROLLER (kept)
          ════════════════════════════════════ */}
          <Codelura />
          <TeamScroller />

          {/* ════════════════════════════════════
               1. HERO SECTION
          ════════════════════════════════════ */}
          <Section className="pt-24">

            {/* Eyebrow + title */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, type: "spring" }}
              className="mb-16 text-center"
            >
              <span className="mb-4 inline-block rounded-full border border-teal-500/25 bg-teal-500/[0.08] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-400">
                ✦ Something About Myself
              </span>
              <h1 className="font-[Syne,sans-serif] text-5xl font-extrabold tracking-tight text-zinc-100 md:text-6xl">
                About{" "}
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Me
                </span>
              </h1>
              <div className="mt-5 flex justify-center">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
              </div>
            </motion.div>

            {/* Hero 2-col grid */}
            <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:items-center">

              {/* Profile image */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
                className="flex justify-center"
              >
                <div className="relative">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/30 to-emerald-500/20 blur-2xl scale-110" />
                  {/* Spinning dashed border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/20"
                  />
                  <Image
                    src="https://i.ibb.co/kVMGMxWJ/my.png"
                    alt="Suraj Bhan"
                    width={300}
                    height={300}
                    className="relative rounded-full border-2 border-teal-500/20 shadow-2xl"
                    priority
                  />
                  {/* Floating badge */}
                  <div className="absolute -bottom-3 -right-3 flex items-center gap-2 rounded-full border border-teal-500/30 bg-zinc-900/95 px-3 py-1.5 shadow-xl backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
                    <span className="text-[0.72rem] font-semibold text-teal-400">Available for work</span>
                  </div>
                </div>
              </motion.div>

              {/* Bio text */}
              <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-5"
              >
                <h2 className="font-[Syne,sans-serif] text-3xl font-bold leading-snug text-zinc-100 md:text-4xl">
                  Suraj Bhan
                  <br />
                  <span className="text-xl font-semibold text-zinc-400">Full-Stack Developer · Entrepreneur · Mentor</span>
                </h2>

                <TypeAnimation
                  className="text-lg font-bold text-teal-400 md:text-xl"
                  sequence={[
                    "A Full-stack Developer", 2000,
                    "A MERN Stack Developer", 2000,
                    "A Web Security Enthusiast", 2000,
                    "A Blockchain Enthusiast", 2000,
                    "A Freelancer Building Scalable Solutions", 2000,
                  ]}
                  repeat={Infinity}
                />

                <p className="text-sm leading-[1.9] text-zinc-400">
                  I am a MERN & TypeScript Developer with{" "}
                  <span className="font-semibold text-zinc-200">3+ years of freelancing experience</span>,
                  building <span className="font-semibold text-zinc-200">100+ websites</span> for startups and global clients.
                  I focus on scalable, secure and user-centric digital products.
                </p>

                <p className="text-sm leading-[1.9] text-zinc-400">
                  Co-Founder & CEO of{" "}
                  <span className="font-semibold text-teal-400">MentorSetu</span>, mentoring{" "}
                  <span className="font-semibold text-zinc-200">500+ learners</span> across Bharat.
                  Background includes{" "}
                  <span className="font-semibold text-zinc-200">GATE CSE AIR-823</span>, NIT Allahabad,
                  and industry experience at Synapsweb & Fifth Avenue Technologies.
                </p>

                {/* Contact mini grid */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <ContactRow icon="📧" label="Email" value="suraj933628@gmail.com" />
                  <ContactRow icon="📍" label="Location" value="Noida, UP, India" />
                  <ContactRow icon="🎓" label="Education" value="NIT Allahabad" />
                  <ContactRow icon="💼" label="Experience" value="3+ Years" />
                </div>

                {/* Social + Resume */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <SocialBtn href="https://github.com"      icon="🐙" label="GitHub" />
                  <SocialBtn href="https://linkedin.com"    icon="💼" label="LinkedIn" />
                  <SocialBtn href="https://twitter.com"     icon="🐦" label="Twitter" />
                  <SocialBtn href="https://youtube.com"     icon="▶️"  label="YouTube" />
                  <SocialBtn href="https://instagram.com"   icon="📸" label="Instagram" />

                  {resumeLink && (
                    <a
                      href={resumeLink}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-[0_4px_24px_rgba(20,184,166,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(20,184,166,0.5)]"
                    >
                      ⬇ Download Resume
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </Section>

          {/* ════════════════════════════════════
               2. STATS BAR
          ════════════════════════════════════ */}
          <Section>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard number="3+"   label="Years of Experience"      icon="🚀" delay={0}    />
              <StatCard number="100+" label="Projects Delivered"        icon="💻" delay={0.08} />
              <StatCard number="500+" label="Learners Mentored"         icon="🎓" delay={0.16} />
              <StatCard number="50+"  label="Global Clients"            icon="🌍" delay={0.24} />
            </div>
          </Section>

          {/* ════════════════════════════════════
               3. ACHIEVEMENTS
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Milestones"
              title="Key"
              highlight="Achievements"
              subtitle="A track record built through consistent effort, deep learning, and real-world impact."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AchievementBadge
                icon="🏆"
                title="GATE CSE AIR-823"
                sub="All India Rank in Graduate Aptitude Test in Engineering (Computer Science)"
                color="border-amber-500/15 bg-amber-500/[0.05] hover:border-amber-500/30"
                delay={0}
              />
              <AchievementBadge
                icon="🎓"
                title="NIT Allahabad Alumni"
                sub="B.Tech from one of India's premier National Institutes of Technology"
                color="border-blue-500/15 bg-blue-500/[0.05] hover:border-blue-500/30"
                delay={0.08}
              />
              <AchievementBadge
                icon="🏢"
                title="Co-Founder & CEO — MentorSetu"
                sub="Ed-tech platform empowering 500+ students across Bharat with mentorship"
                color="border-teal-500/15 bg-teal-500/[0.05] hover:border-teal-500/30"
                delay={0.16}
              />
              <AchievementBadge
                icon="🌐"
                title="100+ Websites Delivered"
                sub="End-to-end development for startups and global clients across industries"
                color="border-violet-500/15 bg-violet-500/[0.05] hover:border-violet-500/30"
                delay={0.24}
              />
              <AchievementBadge
                icon="🔒"
                title="Web Security Practitioner"
                sub="Hands-on experience in penetration testing, OWASP, and secure coding"
                color="border-rose-500/15 bg-rose-500/[0.05] hover:border-rose-500/30"
                delay={0.32}
              />
              <AchievementBadge
                icon="⛓️"
                title="Blockchain Developer"
                sub="Smart contracts, DeFi protocols, and Web3 integrations using Solidity & Hardhat"
                color="border-emerald-500/15 bg-emerald-500/[0.05] hover:border-emerald-500/30"
                delay={0.4}
              />
            </div>
          </Section>

          {/* ════════════════════════════════════
               4. WHAT I DO — SERVICES
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Expertise"
              title="What I"
              highlight="Do"
              subtitle="From ideation to deployment — I cover the full spectrum of modern web engineering."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <ServiceCard
                icon="⚛️"
                title="Frontend Development"
                desc="Pixel-perfect, accessible, and responsive UIs using React, Next.js, Tailwind CSS and Framer Motion."
                tags={["React", "Next.js", "Tailwind", "TypeScript"]}
                delay={0}
              />
              <ServiceCard
                icon="🛠️"
                title="Backend Engineering"
                desc="Scalable REST and GraphQL APIs with Node.js, Express, authentication systems and cloud deployments."
                tags={["Node.js", "Express", "MongoDB", "PostgreSQL"]}
                delay={0.08}
              />
              <ServiceCard
                icon="📱"
                title="Full-Stack Products"
                desc="End-to-end SaaS products, admin panels, multi-tenant systems and complex business logic."
                tags={["MERN", "SaaS", "Multi-tenant", "CI/CD"]}
                delay={0.16}
              />
              <ServiceCard
                icon="🔒"
                title="Web Security"
                desc="Security audits, penetration testing, JWT/OAuth2 hardening, OWASP compliance, and rate limiting."
                tags={["OWASP", "Pen Testing", "JWT", "OAuth2"]}
                delay={0.24}
              />
              <ServiceCard
                icon="⛓️"
                title="Blockchain & Web3"
                desc="Smart contract development, token creation, DeFi integrations, and NFT marketplace engineering."
                tags={["Solidity", "Hardhat", "Ethers.js", "Web3"]}
                delay={0.32}
              />
              <ServiceCard
                icon="🎓"
                title="Mentorship & Training"
                desc="1-on-1 mentorship, cohort-based learning programs, resume reviews, and mock technical interviews."
                tags={["Mentoring", "Code Review", "Interview Prep"]}
                delay={0.4}
              />
            </div>
          </Section>

          {/* ════════════════════════════════════
               5. TECH STACK — SKILL BARS
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Stack"
              title="Technical"
              highlight="Skills"
              subtitle="Technologies I work with daily — refined through hundreds of real-world projects."
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

              {/* Frontend */}
              <motion.div {...fadeLeft(0)} className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm">
                <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-widest text-teal-500">
                  Frontend
                </p>
                <div className="flex flex-col gap-4">
                  <SkillBar label="React / Next.js"   percent={94} color="bg-gradient-to-r from-teal-500 to-emerald-500"   delay={0}    />
                  <SkillBar label="TypeScript"         percent={90} color="bg-gradient-to-r from-blue-500 to-indigo-500"    delay={0.05} />
                  <SkillBar label="Tailwind CSS"       percent={96} color="bg-gradient-to-r from-teal-400 to-cyan-400"     delay={0.1}  />
                  <SkillBar label="Framer Motion"      percent={82} color="bg-gradient-to-r from-violet-500 to-purple-500" delay={0.15} />
                  <SkillBar label="HTML / CSS"         percent={98} color="bg-gradient-to-r from-orange-500 to-amber-500"  delay={0.2}  />
                </div>
              </motion.div>

              {/* Backend */}
              <motion.div {...fadeRight(0.08)} className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm">
                <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-widest text-emerald-500">
                  Backend & Database
                </p>
                <div className="flex flex-col gap-4">
                  <SkillBar label="Node.js / Express"  percent={92} color="bg-gradient-to-r from-emerald-500 to-green-500" delay={0}    />
                  <SkillBar label="MongoDB"             percent={90} color="bg-gradient-to-r from-green-500 to-teal-500"   delay={0.05} />
                  <SkillBar label="PostgreSQL"          percent={78} color="bg-gradient-to-r from-blue-400 to-blue-600"    delay={0.1}  />
                  <SkillBar label="Redis"               percent={72} color="bg-gradient-to-r from-rose-500 to-red-500"     delay={0.15} />
                  <SkillBar label="REST / GraphQL"      percent={88} color="bg-gradient-to-r from-pink-500 to-rose-500"    delay={0.2}  />
                </div>
              </motion.div>

              {/* DevOps */}
              <motion.div {...fadeLeft(0.12)} className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm">
                <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-widest text-blue-400">
                  DevOps & Cloud
                </p>
                <div className="flex flex-col gap-4">
                  <SkillBar label="Docker / Kubernetes"  percent={74} color="bg-gradient-to-r from-blue-500 to-cyan-500"      delay={0}    />
                  <SkillBar label="AWS / GCP"            percent={70} color="bg-gradient-to-r from-amber-500 to-yellow-500"   delay={0.05} />
                  <SkillBar label="GitHub Actions / CI"  percent={84} color="bg-gradient-to-r from-zinc-400 to-zinc-300"      delay={0.1}  />
                  <SkillBar label="Nginx / Linux"        percent={80} color="bg-gradient-to-r from-orange-400 to-orange-600"  delay={0.15} />
                  <SkillBar label="Vercel / Render"      percent={95} color="bg-gradient-to-r from-zinc-500 to-zinc-300"      delay={0.2}  />
                </div>
              </motion.div>

              {/* Web3 & Security */}
              <motion.div {...fadeRight(0.16)} className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm">
                <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-widest text-violet-400">
                  Blockchain & Security
                </p>
                <div className="flex flex-col gap-4">
                  <SkillBar label="Solidity / Hardhat"  percent={76} color="bg-gradient-to-r from-gray-400 to-gray-300"       delay={0}    />
                  <SkillBar label="Ethers.js / Web3.js" percent={74} color="bg-gradient-to-r from-violet-500 to-purple-500"   delay={0.05} />
                  <SkillBar label="OWASP / Pen Testing" percent={78} color="bg-gradient-to-r from-rose-500 to-red-600"        delay={0.1}  />
                  <SkillBar label="JWT / OAuth2"        percent={90} color="bg-gradient-to-r from-teal-500 to-green-500"      delay={0.15} />
                  <SkillBar label="Smart Contracts"     percent={72} color="bg-gradient-to-r from-indigo-500 to-blue-500"     delay={0.2}  />
                </div>
              </motion.div>
            </div>

            {/* Tech pill cloud */}
            <motion.div {...fadeUp(0.2)} className="mt-8 rounded-2xl border border-white/[0.06] bg-zinc-900/40 p-6 text-center backdrop-blur-sm">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Also familiar with</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Prisma", "Zustand", "Redux Toolkit", "Socket.io", "WebRTC", "Stripe",
                  "Razorpay", "Firebase", "Supabase", "Cloudinary", "SendGrid", "Twilio",
                  "Jest", "Vitest", "Playwright", "Storybook", "shadcn/ui", "Zod",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[0.72rem] font-medium text-zinc-400 transition-all hover:border-teal-500/25 hover:text-teal-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </Section>

          {/* ════════════════════════════════════
               6. EDUCATION TIMELINE
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Academic Background"
              title="My"
              highlight="Education"
              subtitle="A strong academic foundation combined with continuous self-learning and hands-on practice."
            />

            {/* Custom timeline (wraps original Education component) */}
            <div className="mb-8 flex flex-col gap-6">
              <TimelineCard
                year="2017 – 2021"
                title="B.Tech — Computer Science & Engineering"
                org="NIT Allahabad (Motilal Nehru National Institute of Technology)"
                desc="Graduated with honours. Specialised in algorithms, distributed systems, and computer networks. Active member of the coding club and open-source contributor."
                badge="B.Tech"
                badgeColor="border-blue-500/20 bg-blue-500/10 text-blue-400"
                delay={0}
              />
              <TimelineCard
                year="2022"
                title="GATE CSE — All India Rank 823"
                org="Ministry of Education, Government of India"
                desc="Cleared GATE with an exceptional AIR-823 among hundreds of thousands of applicants, demonstrating strong fundamentals in CS theory and engineering."
                badge="GATE"
                badgeColor="border-amber-500/20 bg-amber-500/10 text-amber-400"
                delay={0.1}
              />
              <TimelineCard
                year="2021 – Present"
                title="Self-Directed Learning — Full-Stack & Web3"
                org="Open Source · Udemy · YouTube · Official Docs"
                desc="Continuous learning in advanced TypeScript, system design, DevOps, blockchain development, and web security. Built 100+ projects as part of this journey."
                badge="Self-Learning"
                badgeColor="border-teal-500/20 bg-teal-500/10 text-teal-400"
                delay={0.2}
              />
            </div>

            {/* Original Education component (kept) */}
            {/* <Education /> */}
          </Section>

          {/* ════════════════════════════════════
               7. EXPERIENCE TIMELINE
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Work History"
              title="My"
              highlight="Experience"
              subtitle="From corporate engineering roles to founding a startup — every step shaped my craft."
            />

            <div className="mb-8 flex flex-col gap-6">
              <TimelineCard
                year="2023 – Present"
                title="Co-Founder & CEO"
                org="MentorSetu"
                desc="Built and scaled an ed-tech mentorship platform from zero to 500+ active learners. Led engineering, product strategy, marketing, and mentor onboarding."
                badge="Founder"
                badgeColor="border-teal-500/20 bg-teal-500/10 text-teal-400"
                delay={0}
              />
              <TimelineCard
                year="2022 – 2023"
                title="Full-Stack Developer"
                org="Fifth Avenue Technologies"
                desc="Developed end-to-end features for fintech and logistics SaaS platforms using MERN stack. Led a team of 3 developers and introduced automated CI/CD pipelines."
                badge="Full-Time"
                badgeColor="border-blue-500/20 bg-blue-500/10 text-blue-400"
                delay={0.1}
              />
              <TimelineCard
                year="2021 – 2022"
                title="Junior Developer"
                org="Synapsweb"
                desc="Built responsive web applications and REST APIs for digital agency clients. Gained experience in client communication, agile sprints, and code reviews."
                badge="Full-Time"
                badgeColor="border-violet-500/20 bg-violet-500/10 text-violet-400"
                delay={0.2}
              />
              <TimelineCard
                year="2019 – Present"
                title="Freelance Full-Stack Developer"
                org="Self-Employed · Upwork · Fiverr · Direct Clients"
                desc="Delivered 100+ projects across e-commerce, SaaS, portfolio, and utility apps for clients across USA, UK, UAE, and India. Maintained 5-star client ratings."
                badge="Freelance"
                badgeColor="border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                delay={0.3}
              />
            </div>

            {/* Original Experience component (kept) */}
            {/* <Experience /> */}
          </Section>

         

          {/* ════════════════════════════════════
               9. QUICK FACTS / FUN SIDE
          ════════════════════════════════════ */}
          <Section>
            <SectionHeading
              eyebrow="Beyond Code"
              title="Quick"
              highlight="Facts"
              subtitle="A few things that define me outside the terminal."
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "☕", label: "Daily Coffee Cups",  value: "3+",          color: "text-amber-400" },
                { icon: "📖", label: "Books Read in 2024", value: "12",          color: "text-blue-400" },
                { icon: "🌏", label: "Countries Worked With", value: "8+",       color: "text-teal-400" },
                { icon: "🎯", label: "Open Source PRs",    value: "47",          color: "text-emerald-400" },
              ].map(({ icon, label, value, color }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(i * 0.08)}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-5 text-center backdrop-blur-sm transition-all hover:border-teal-500/20"
                >
                  <span className="text-3xl">{icon}</span>
                  <p className={`font-[Syne,sans-serif] text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-[0.76rem] text-zinc-500">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Interests */}
            <motion.div {...fadeUp(0.2)} className="mt-6 rounded-2xl border border-white/[0.06] bg-zinc-900/60 p-6 backdrop-blur-sm">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-widest text-zinc-500">Interests & Hobbies</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Open Source 🛠️", "Competitive Programming 🏅", "System Design 📐",
                  "Teaching & Mentoring 🎓", "Blockchain Research ⛓️", "Cybersecurity 🔒",
                  "Reading Tech Blogs 📖", "Badminton 🏸", "Chess ♟️", "Travel 🌍",
                ].map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[0.78rem] text-zinc-400 transition-all hover:border-teal-500/25 hover:text-teal-400"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          </Section>

          {/* ════════════════════════════════════
               10. RESUME CTA BANNER
          ════════════════════════════════════ */}
          {resumeLink && (
            <Section>
              <motion.div
                {...fadeUp(0)}
                className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/[0.08] via-zinc-900/80 to-emerald-500/[0.06] p-10 text-center backdrop-blur-sm"
              >
                {/* Ambient */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

                <span className="mb-4 inline-block rounded-full border border-teal-500/25 bg-teal-500/[0.08] px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-teal-400">
                  ✦ Let Connect
                </span>
                <h2 className="font-[Syne,sans-serif] text-3xl font-extrabold text-zinc-100 md:text-4xl">
                  Interested in working{" "}
                  <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    together?
                  </span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
                  Download my resume to see the full picture — or just drop me an email and let build something great.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-7 py-3 text-sm font-bold text-zinc-900 shadow-[0_4px_24px_rgba(20,184,166,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(20,184,166,0.55)]"
                  >
                    ⬇ Download Resume
                  </a>
                  <a
                    href="mailto:suraj933628@gmail.com"
                    className="rounded-full border border-teal-500/30 bg-teal-500/[0.08] px-7 py-3 text-sm font-semibold text-teal-400 transition-all hover:border-teal-500/50 hover:bg-teal-500/[0.14]"
                  >
                    📧 Get In Touch
                  </a>
                </div>
              </motion.div>
            </Section>
          )}

        </div>
      </div>
    </>
  );
}