import Head from "next/head";
import dynamic from "next/dynamic";
import { Sparkles, Zap } from "lucide-react";
import TypingWord from "./hero/Typingword";
import HeroCTAButtons from "./hero/Heroctabuttons";

// Three.js canvas — client-only, zero SSR cost
const ThreeBackground = dynamic(() => import("./ThreeBackground"), {
  ssr: false,
});

function SEOMeta() {
  return (
    <Head>
      <title>Codelura – AI Developer Platform | Software, Mentorship &amp; Career Growth</title>
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
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship &amp; more."
      />
      <meta property="og:image" content="https://codelura.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Codelura – AI Developer Platform" />
      <meta
        name="twitter:description"
        content="All-in-one AI platform for developers: software notes, hackathons, career guidance, mentorship &amp; more."
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

function PerfStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .anim-fade-up {
            opacity: 0;
            animation: fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        `,
      }}
    />
  );
}

export default function HeroSection() {
  return (
    <>
      <SEOMeta />
      <PerfStyles />

      <section
        aria-label="Hero – AI Developer Platform"
        className="relative min-h-screen overflow-hidden bg-[#06050f]"
      >
        {/* Three.js animated 3D background */}
        <div className="absolute inset-0 z-0">
          <ThreeBackground />
        </div>

        {/* Gradient overlay — keeps text readable */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#06050f]/20 via-transparent to-[#06050f]/75" />

        {/* Content — vertically centered, biased upward */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-28 text-center">

          {/* Badge */}
          <div
            className="anim-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-black/30 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-400 backdrop-blur-md"
          >
            <Zap className="h-3 w-3 fill-violet-400" />
            AI-Powered Developer Ecosystem
            <Sparkles className="h-3 w-3" />
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up max-w-3xl text-6xl font-black leading-[1.05] tracking-tight text-white md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
            style={{ animationDelay: "0.15s" }}
          >
            Build Smarter.
            <span className="block mt-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Ship Faster.
            </span>
          </h1>

          {/* One-liner tagline */}
          <p
            className="anim-fade-up mt-5 text-sm font-medium uppercase tracking-[0.2em] text-white/35"
            style={{ animationDelay: "0.3s" }}
          >
            One ecosystem for developers who ship.
          </p>

          {/* CTA Buttons */}
          <div
            className="anim-fade-up mt-10"
            style={{ animationDelay: "0.45s" }}
          >
            <HeroCTAButtons />
          </div>

        </div>
      </section>
    </>
  );
}
