import Link from "next/link";
import Head from "next/head";
import {
  Sparkles,
  BarChart3,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import TypingWord from "./hero/Typingword";
import HeroCTAButtons from "./hero/Heroctabuttons";
import ServicesBar from "./hero/Servicesbar";

/* ────────────────────────────────────────────────────────────
   THIS FILE IS A SERVER COMPONENT. No "use client" directive.
   It ships ZERO JavaScript of its own — the HTML below is
   rendered on the server and streamed to the browser as static
   markup + CSS. The only client JS that loads is:
     1. TypingWord.tsx   — tiny, just a setTimeout loop
     2. HeroCTAButtons.tsx — magnetic hover effect + the button
        that lazy-loads DemoModal (which is where framer-motion
        and the YouTube iframe actually live)
   Everything else (services grid, stats, dashboard mockup,
   floating cards, ambient glow) is plain server-rendered HTML
   with CSS keyframe animations — no React hydration needed
   for any of it.

   NOTE: If this project actually uses the App Router (Next 13+
   app/ directory), replace the <Head> below with an exported
   `metadata` object in this file instead — next/head only works
   in the Pages Router. Left as-is here since the original file
   used it.
   ──────────────────────────────────────────────────────────── */

function SEOMeta() {
  return (
    <Head>
      <title>Codelura – AI Developer Platform | Software, Mentorship & Career Growth</title>
      <meta
        name="description"
        content="Codelura is your all-in-one AI-powered developer platform. Access software notes, hackathons, career guidance, mentorship, SaaS tools, and professional portfolio websites — all in one ecosystem."
      />
      <meta
        name="keywords"
        content="AI developer platform, software notes, hackathon, career guidance, mentorship, SaaS tools, coding platform, learn programming, developer ecosystem"
      />
      <link rel="canonical" href="https://codelura.com/" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://codelura.com/" />
      <meta property="og:title" content="Codelura – AI Developer Platform" />
      <meta
        property="og:description"
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship & more."
      />
      <meta property="og:image" content="https://codelura.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Codelura – AI Developer Platform" />
      <meta
        name="twitter:description"
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship & more."
      />
      <meta name="twitter:image" content="https://codelura.com/og-image.png" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Codelura",
            applicationCategory: "DeveloperApplication",
            description:
              "AI-powered developer platform offering software notes, hackathons, career guidance, mentorship and SaaS tools.",
            url: "https://codelura.com",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </Head>
  );
}

/* Global keyframes — server-rendered once, zero JS cost.
   Move into globals.css in a real project if you have one. */
function PerfStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-12px); }
          }
          .anim-fade-up {
            opacity: 0;
            animation: fadeUp 0.6s ease-out forwards;
          }
          .anim-float {
            animation: floatY 4s ease-in-out infinite;
            will-change: transform;
          }
        `,
      }}
    />
  );
}

/* Pure presentational — server-rendered, no hooks, no JS shipped */
function FloatingCard({
  icon: Icon,
  title,
  className,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`anim-fade-up anim-float absolute z-10 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-2xl backdrop-blur-2xl ${className}`}
      style={{ animationDelay: `${delay}s, ${delay}s` }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
          <Icon className="h-3.5 w-3.5 text-white" />
        </span>
        {title}
      </div>
    </div>
  );
}

const STATS = [
  { value: "250K+", label: "Monthly Visitors" },
    { value: "120k+", label: "Community Members" },
  { value: "25+", label: "AI Tools" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function HeroSection() {
  return (
    <>
      <SEOMeta />
      <PerfStyles />

      <section
        aria-label="Hero – AI Developer Platform"
        className="relative min-h-[60vh] md:min-h-[75vh] overflow-hidden bg-[#06050f]"
      >
        {/* Ambient glow — 2 blobs, hidden on mobile (blur() is
            expensive to paint on low-power GPUs) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden sm:block">
          <div className="absolute left-[10%] top-[15%] h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[110px]" />
          <div className="absolute right-[5%] top-[-10%] h-[360px] w-[360px] rounded-full bg-fuchsia-600/15 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-4 lg:py-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* ── LEFT ── */}
            <div className="text-center lg:text-left">
              <div className="anim-fade-up mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 backdrop-blur">
                <Zap className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
                <span>AI-Powered Developer Ecosystem</span>
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              </div>

              <h1
                className="anim-fade-up text-4xl font-black leading-[1.05] tracking-tight text-white md:text-6xl lg:text-[3.8rem] xl:text-[4.2rem]"
                style={{ animationDelay: "0.15s" }}
              >
                Your AI Platform
                <span className="block mt-1">
                  Built to <TypingWord />
                </span>
              </h1>

              <p
                className="anim-fade-up mt-6 max-w-lg text-lg leading-relaxed text-white/55 lg:mx-0"
                style={{ animationDelay: "0.3s" }}
              >
                One platform. Infinite possibilities. Software notes, hackathons,
                AI tools, career guidance, expert mentorship &amp; SaaS services —
                everything a modern developer needs to grow.
              </p>

              {/* Only client island for interactivity: magnetic
                  hover + the button that lazy-loads the modal */}
              <HeroCTAButtons />

              <div
                className="anim-fade-up mt-10 flex justify-center gap-8 lg:justify-start"
                style={{ animationDelay: "0.6s" }}
              >
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center lg:text-left">
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-xs text-white/40 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <ServicesBar />
            </div>

            {/* ── RIGHT (Dashboard Visual) — fully static markup ── */}
            <div className="anim-fade-up relative hidden lg:block" style={{ animationDelay: "0.25s" }}>
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 hover:scale-[1.015]">
                <div className="h-[380px] w-full rounded-2xl bg-gradient-to-br from-[#0f0d1f] to-[#1a1040] p-5 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    <div className="ml-4 flex-1 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/30">
                      codelura.com/dashboard
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {["AI Tools", "Hackathons", "Mentors"].map((t, i) => (
                      <div key={t} className="rounded-xl bg-white/5 p-3 border border-white/5">
                        <div
                          className={`h-1.5 w-8 rounded-full mb-2 ${
                            ["bg-violet-400", "bg-fuchsia-400", "bg-cyan-400"][i]
                          }`}
                        />
                        <p className="text-[10px] text-white/50">{t}</p>
                        <p className="text-lg font-bold text-white">{["200+", "48", "120+"][i]}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 mb-3">
                    <p className="text-[10px] text-white/40 mb-3">Learning Activity</p>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-600 to-fuchsia-400 opacity-70"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {["React Advanced Patterns", "System Design for Devs"].map((c) => (
                      <div key={c} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2 border border-white/5">
                        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                        <p className="text-[11px] text-white/60">{c}</p>
                        <div className="ml-auto h-1.5 w-12 rounded-full bg-white/10">
                          <div className="h-full w-3/4 rounded-full bg-violet-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="anim-fade-up absolute bottom-10 left-4 hidden w-[220px] rounded-xl border border-white/10 bg-black/70 p-4 text-xs text-emerald-400 backdrop-blur xl:block"
                  style={{ animationDelay: "1.2s" }}
                >
                  <pre className="leading-relaxed">{`const ai = new Codelura({
  services: ["notes","mentor",
    "hackathon","career"],
  mode: "turbo" 🚀
})`}</pre>
                </div>
              </div>

              <FloatingCard icon={BarChart3} title="Live Analytics" className="-top-5 left-6" delay={0.8} />
              <FloatingCard icon={Terminal} title="Code Playground" className="top-1/3 -right-6" delay={1.0} />
              <FloatingCard icon={Trophy} title="Win Hackathons" className="-bottom-5 right-10" delay={1.2} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}