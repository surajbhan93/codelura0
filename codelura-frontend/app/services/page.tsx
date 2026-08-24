// app/services/page.tsx (Server Component)

import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";
import Stats from "@/components/services/Stats";
import Services from "@/components/services/Services";
import Industries from "@/components/services/Industries";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Codelura Technologies - Software Development, AI Solutions & Growth",
  description: "We build websites, mobile apps, AI solutions and digital experiences that grow your business. Trusted by 100+ brands.",
  keywords: "software development, web development, mobile apps, AI solutions, digital marketing, Codelura",
};

const processSteps = [
  {
    step: "01",
    title: "Discovery Call",
    description: "We understand your business, goals and target audience.",
  },
  {
    step: "02",
    title: "Plan & Design",
    description: "Wireframes, tech stack and timeline finalized together.",
  },
  {
    step: "03",
    title: "Build & Test",
    description: "Development sprints with regular demos and QA checks.",
  },
  {
    step: "04",
    title: "Launch & Grow",
    description: "We ship it live, then support SEO and marketing growth.",
  },
];

function ProcessSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
            How we work
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            From idea to launch, in four steps
          </h2>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item, idx) => (
            <div key={item.step} className="relative group">
              <span className="text-4xl font-extrabold text-slate-200 sm:text-5xl group-hover:text-purple-600 transition-colors">
                {item.step}
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] text-slate-600">
                {item.description}
              </p>
              {idx < processSteps.length - 1 && (
                <div className="absolute right-[-20px] top-7 hidden h-px w-10 bg-slate-200 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 py-16 sm:py-20 lg:py-24 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
          Ready to transform your business?
        </h2>
        <p className="mt-3 text-base text-purple-100 sm:mt-4 sm:text-lg">
          Let&apos;s discuss your project and build something amazing together.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-[15px] font-bold text-purple-700 shadow-xl transition-transform hover:scale-[1.03]"
          >
            Start Your Project
            <ArrowRight size={17} />
          </Link>
          <Link
            href="https://wa.me/919336289192"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Chat on WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomePageSkeleton() {
  return (
    <main className="bg-[#050714] min-h-screen text-white animate-pulse">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="h-8 w-48 bg-purple-950 rounded-full" />
        <div className="mt-6 h-16 w-3/4 bg-purple-950 rounded-2xl" />
        <div className="mt-4 h-6 w-1/2 bg-purple-950 rounded-lg" />
      </div>
    </main>
  );
}

export default async function ServicesPage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <main className="bg-[#050714]">
        {/* ============ HERO SECTION (FUTURISTIC 1ST IMAGE MATCH) ============ */}
        <HeroSection />

        {/* ============ DETAILED SERVICES LIST ============ */}
        <div id="services" className="bg-[#050714]">
          <Services />
        </div>

        {/* ============ INDUSTRIES ============ */}
        <Industries />

        {/* ============ PROCESS ============ */}
        <ProcessSection />

        {/* ============ STATS ============ */}
        <Stats />

        {/* ============ FINAL CTA ============ */}
        <CTASection />
      </main>
    </Suspense>
  );
}

// ─── HERO SECTION (MATCHING USER 1ST IMAGE MOCKUP) ───
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#050714] text-white pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-pink-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-purple-300 backdrop-blur-md shadow-lg shadow-purple-950/50 mb-6">
              <span className="text-purple-400">🚀</span> WE BUILD DIGITAL FUTURES
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl leading-[1.1] mb-6">
              We Build{" "}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Websites,
              </span>
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                {" "}Mobile Apps,
              </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {" "}AI Solutions
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-white to-slate-200 bg-clip-text text-transparent">
                & Digital Experiences
              </span>
              <br />
              <span className="text-white">That Grow Your Business</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto lg:mx-0 max-w-xl text-slate-300 text-base sm:text-lg mb-8 leading-relaxed font-normal">
              From stunning websites to powerful apps and intelligent AI solutions,
              we help brands innovate, automate and scale in the digital world.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Link
                href="/services/Enquiries?service=Custom%20Software"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-600/35 transition-all hover:scale-105 active:scale-95"
              >
                Explore Our Services →
              </Link>
              <Link
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/50 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:border-purple-400"
              >
                ▶ View Our Work
              </Link>
            </div>

            {/* Social Proof Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-slate-300">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#050714]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Client" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#050714]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Client" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#050714]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Client" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#050714]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Client" />
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
                ★ 4.9/5
              </div>
              <span className="text-slate-400 text-xs sm:text-sm">
                Trusted by 100+ brands & startups worldwide
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN (3D MOCKUPS & FLOATING BADGES) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Floating Badge 1: Web Dev */}
            <div className="absolute -top-4 left-0 z-30 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#0F122C]/90 px-3.5 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md">
              <span className="text-purple-400 font-mono text-sm">&lt;/&gt;</span>
              <span>Web Development</span>
            </div>

            {/* Floating Badge 2: Mobile Apps */}
            <div className="absolute top-10 right-0 z-30 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#0F122C]/90 px-3.5 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md">
              <span className="text-blue-400 text-sm">📱</span>
              <span>Mobile Apps</span>
            </div>

            {/* Floating Badge 3: Digital Marketing */}
            <div className="absolute bottom-12 left-2 z-30 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#0F122C]/90 px-3.5 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md">
              <span className="text-pink-400 text-sm">📣</span>
              <span>Digital Marketing</span>
            </div>

            {/* Floating Badge 4: AI Solutions */}
            <div className="absolute bottom-4 -right-2 z-30 flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#0F122C]/90 px-3.5 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md">
              <span className="text-cyan-400 text-sm">🧠</span>
              <span>AI Solutions</span>
            </div>

            {/* 3D LAPTOP & PHONE DISPLAY CONTAINER */}
            <div className="relative w-full max-w-lg py-8">
              
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-indigo-600/40 to-cyan-500/30 blur-2xl rounded-3xl" />

              {/* LAPTOP MOCKUP */}
              <div className="relative z-10 overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0A0D21] p-3 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.4)]">
                <div className="flex items-center justify-between border-b border-purple-500/20 bg-[#080B1C] px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-purple-300/70">
                    Codelura Digital Dashboard
                  </span>
                  <span className="text-xs text-purple-400">⚡</span>
                </div>

                <div className="bg-gradient-to-b from-[#0B0F28] to-[#07091A] p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-purple-400">Codelura</span>
                    <h3 className="text-xl font-extrabold text-white">
                      Building <span className="text-purple-400">Digital</span> Solutions
                    </h3>
                    <p className="text-[11px] text-slate-400">Innovative. Scalable. Intelligent.</p>
                  </div>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-950/30 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Performance Overview</p>
                      <p className="text-lg font-bold text-emerald-400">+165%</p>
                      <p className="text-[9px] text-slate-400">Growth this month</p>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      <div className="w-1.5 h-3 bg-purple-500/40 rounded-t" />
                      <div className="w-1.5 h-5 bg-purple-500/60 rounded-t" />
                      <div className="w-1.5 h-4 bg-purple-500/80 rounded-t" />
                      <div className="w-1.5 h-7 bg-purple-400 rounded-t" />
                      <div className="w-1.5 h-8 bg-emerald-400 rounded-t" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Total Users</p>
                      <p className="text-base font-bold text-white">24.8K</p>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">↑ 12.5%</span>
                  </div>
                </div>
              </div>

              {/* SMARTPHONE MOCKUP */}
              <div className="absolute -bottom-4 -right-4 z-20 w-44 rounded-3xl border-2 border-purple-400/40 bg-[#080B1C] p-2.5 shadow-2xl shadow-purple-950">
                <div className="mx-auto mb-2 h-3 w-16 rounded-full bg-slate-900" />
                <div className="rounded-2xl bg-gradient-to-b from-[#111638] to-[#07091B] p-3 text-center space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/30 text-purple-300 text-lg border border-purple-500/40">
                    🤖
                  </div>
                  <p className="text-xs font-bold text-white">Hello! 🖐️</p>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    How can I help your business today?
                  </p>
                  <div className="rounded-xl bg-purple-950/60 border border-purple-500/30 p-2 text-[9px] text-purple-300 text-left">
                    Ask anything...
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM STATS STRIP */}
        <div className="mt-16 rounded-2xl border border-purple-500/20 bg-[#0C0F28]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/30">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 text-2xl border border-purple-500/30">
                🚀
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">250+</p>
                <p className="text-xs text-slate-400 font-medium">Projects Delivered</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 text-2xl border border-indigo-500/30">
                👥
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">100+</p>
                <p className="text-xs text-slate-400 font-medium">Happy Clients</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600/20 text-pink-400 text-2xl border border-pink-500/30">
                🏆
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">5+</p>
                <p className="text-xs text-slate-400 font-medium">Years of Experience</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/20 text-cyan-400 text-2xl border border-cyan-500/30">
                🎧
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">24/7</p>
                <p className="text-xs text-slate-400 font-medium">Support & Maintenance</p>
              </div>
            </div>
          </div>
        </div>

        {/* OVERVIEW SECTION: WHAT WE DO */}
        <div className="mt-20">
          <div className="mb-10 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
              WHAT WE DO
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
              End-to-End Digital Solutions for{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Modern Businesses
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="group rounded-2xl border border-purple-500/20 bg-[#0D102A]/80 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-[#121638]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 text-2xl border border-blue-500/30">
                  🌐
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 transition group-hover:bg-purple-600 group-hover:text-white">
                  →
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Website Development</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern, responsive & SEO-friendly websites that convert visitors into customers.
              </p>
            </div>

            <div className="group rounded-2xl border border-purple-500/20 bg-[#0D102A]/80 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-[#121638]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400 text-2xl border border-purple-500/30">
                  📱
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 transition group-hover:bg-purple-600 group-hover:text-white">
                  →
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Mobile App Development</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Android & iOS apps that deliver smooth performance and great user experience.
              </p>
            </div>

            <div className="group rounded-2xl border border-purple-500/20 bg-[#0D102A]/80 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-[#121638]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/20 text-cyan-400 text-2xl border border-cyan-500/30">
                  🧠
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 transition group-hover:bg-purple-600 group-hover:text-white">
                  →
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">AI Solutions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart AI solutions to automate processes, analyze data & drive better decisions.
              </p>
            </div>

            <div className="group rounded-2xl border border-purple-500/20 bg-[#0D102A]/80 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:bg-[#121638]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-600/20 text-pink-400 text-2xl border border-pink-500/30">
                  📣
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/20 text-purple-300 transition group-hover:bg-purple-600 group-hover:text-white">
                  →
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">Digital Marketing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grow your brand with SEO, social media, paid ads & data-driven marketing strategies.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}