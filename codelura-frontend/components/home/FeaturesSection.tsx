import {
  BookOpen,
  Layers,
  UserCheck,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   PURE SERVER COMPONENT. No "use client", no hooks, no JS.

   Tab switching is done with the classic hidden-radio-input
   trick: 4 <input type="radio"> elements (one per feature) are
   visually hidden, and every label/panel that needs to react to
   "which tab is active" uses the CSS :has() selector to look at
   which radio is :checked. The browser handles all the
   interactivity natively — no onClick, no useState, no
   framer-motion, no useInView.

   Trade-off vs the original: entrance animations now play on
   page load (can't observe scroll position without JS), and
   the "Explore Feature" button is a plain <a href> per panel
   instead of router.push() with dynamic state.
   ──────────────────────────────────────────────────────────── */

interface Feature {
  title: string;
  tagline: string;
  desc: string;
  details: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  accentBg: string;
  accentText: string;
  route: string;
  visual: React.ReactNode;
}

/* ─── Static visual mockups (CSS animations only) ────────────── */
function LearningVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c1a] overflow-hidden shadow-2xl anim-fade-up">
        <div className="h-8 flex items-center gap-1.5 px-4 bg-white/4 border-b border-white/5">
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
          <span className="ml-3 text-[10px] text-white/25 font-mono">blog.codelura.com</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="h-3 w-3/4 rounded-full bg-violet-500/40 animate-pulse" />
          <div className="h-2 w-full rounded-full bg-white/10" />
          <div className="h-2 w-5/6 rounded-full bg-white/8" />
          <div className="h-2 w-4/6 rounded-full bg-white/6" />
          <div className="mt-4 flex gap-2">
            {["React", "Next.js", "AI"].map((tag) => (
              <span key={tag} className="rounded-full bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 text-[10px] text-violet-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-2 space-y-2">
            {[85, 60, 75].map((w, i) => (
              <div
                key={i}
                className="anim-grow h-1.5 rounded-full bg-gradient-to-r from-violet-500/50 to-cyan-500/30 origin-left"
                style={{ animationDelay: `${0.3 + i * 0.15}s`, ["--w" as string]: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="anim-float absolute top-4 right-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 font-semibold backdrop-blur">
        ✦ New Article
      </div>
    </div>
  );
}

function ResourcesVisual() {
  const items = [
    { label: "DSA Notes", type: "FREE", color: "#22c55e" },
    { label: "System Design", type: "PRO", color: "#a78bfa" },
    { label: "DevOps Guide", type: "FREE", color: "#22c55e" },
    { label: "AI/ML Roadmap", type: "PRO", color: "#a78bfa" },
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="anim-fade-up flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 backdrop-blur"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white/40" />
            </div>
            <span className="flex-1 text-sm text-white/70 font-medium">{item.label}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold border"
              style={{ color: item.color, borderColor: item.color + "40", background: item.color + "15" }}
            >
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorshipVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="anim-fade-up flex gap-3 items-end" style={{ animationDelay: "0.1s" }}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">M</div>
          <div className="rounded-2xl rounded-bl-sm bg-white/8 border border-white/8 px-4 py-3 text-sm text-white/70 max-w-[220px]">
            Your portfolio is solid. Let&apos;s work on negotiation strategy.
          </div>
        </div>
        <div className="anim-fade-up flex gap-3 items-end flex-row-reverse" style={{ animationDelay: "0.3s" }}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">Y</div>
          <div className="rounded-2xl rounded-br-sm bg-violet-500/20 border border-violet-500/25 px-4 py-3 text-sm text-white/80 max-w-[220px]">
            I got an offer from Google! 🎉
          </div>
        </div>
        <div className="anim-fade-up flex gap-3 items-end" style={{ animationDelay: "0.5s" }}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shrink-0 flex items-center justify-center text-xs font-bold text-white">M</div>
          <div className="rounded-2xl rounded-bl-sm bg-white/8 border border-white/8 px-4 py-3 text-sm text-white/70 max-w-[220px]">
            Knew you&apos;d crush it 💪 Next: Senior roles.
          </div>
        </div>
        <div className="ml-11 flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="anim-bounce-dot h-1.5 w-1.5 rounded-full bg-white/30"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WebsiteVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="anim-fade-up w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c0c1a] overflow-hidden shadow-2xl">
        <div className="h-8 flex items-center gap-1.5 px-4 bg-white/4 border-b border-white/5">
          {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div className="p-4 space-y-2">
          <div className="h-20 rounded-xl bg-gradient-to-br from-violet-900/50 to-fuchsia-900/30 border border-white/5 flex items-center justify-center">
            <span className="text-xs text-white/40 font-mono">Hero Section</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Features", "Pricing", "Contact"].map((s) => (
              <div key={s} className="h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                <span className="text-[9px] text-white/30">{s}</span>
              </div>
            ))}
          </div>
          <div className="h-2 w-3/4 rounded-full bg-white/8" />
          <div className="h-2 w-1/2 rounded-full bg-white/5" />
          <div className="anim-glow mt-2 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Deploy →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature data ────────────────────────────────────────────── */
const FEATURES: Feature[] = [
  {
    title: "Premium Learning Content",
    tagline: "Learn from Real Production Experience",
    desc: "Industry-grade blogs, notes, and practical materials curated by working developers — not textbook authors.",
    details: [
      "Real-world projects & case studies",
      "Updated weekly with new content",
      "Covers DSA, System Design, AI/ML & more",
    ],
    icon: BookOpen,
    accent: "from-violet-400 to-fuchsia-400",
    accentBg: "bg-violet-500/10 border-violet-500/20",
    accentText: "text-violet-300",
    route: "https://career.codelura.com/career/learning/study-material",
    visual: <LearningVisual />,
  },
  {
    title: "Free & Paid Resources",
    tagline: "Everything a Developer Needs in One Place",
    desc: "Carefully curated tools, courses, roadmaps and libraries — saving you weeks of scattered research.",
    details: [
      "500+ free resources available instantly",
      "Premium deep-dive courses & notes",
      "Structured roadmaps by role & stack",
    ],
    icon: Layers,
    accent: "from-cyan-400 to-blue-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/20",
    accentText: "text-cyan-300",
    route: "https://career.codelura.com/career/learning/career-tracks",
    visual: <ResourcesVisual />,
  },
  {
    title: "1-on-1 Mentorship",
    tagline: "Personal Guidance That Actually Works",
    desc: "Direct sessions with industry experts focused on your resume, projects, interview prep and career clarity.",
    details: [
      "Book sessions with vetted senior devs",
      "Resume, portfolio & interview prep",
      "Long-term career roadmap support",
    ],
    icon: UserCheck,
    accent: "from-emerald-400 to-teal-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/20",
    accentText: "text-emerald-300",
    route: "https://career.codelura.com/career/mentorship/one-on-one",
    visual: <MentorshipVisual />,
  },
  {
    title: "Website Development",
    tagline: "Professional Websites for Your Business",
    desc: "End-to-end website delivery for startups, creators & businesses — design, dev, deployment & support included.",
    details: [
      "Custom design, not templates",
      "Next.js / React with full SEO setup",
      "Delivery in 7–14 days with support",
    ],
    icon: Globe,
    accent: "from-rose-400 to-orange-400",
    accentBg: "bg-rose-500/10 border-rose-500/20",
    accentText: "text-rose-300",
    route: "https://build.codelura.com/services",
    visual: <WebsiteVisual />,
  },
];

/* Scoped styles: keyframes + the CSS-only tab mechanics via :has() */
function TabStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
          @keyframes floatY { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-8px);} }
          @keyframes growX { from { transform:scaleX(0);} to { transform:scaleX(1);} }
          @keyframes bounceDot { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-4px);} }
          @keyframes glowPulse { 0%,100% { box-shadow:0 0 0px #a855f7; } 50% { box-shadow:0 0 20px #a855f740; } }
          @keyframes panelIn { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:translateY(0);} }

          .anim-fade-up { opacity:0; animation: fadeUp .5s ease-out forwards; }
          .anim-float { animation: floatY 3s ease-in-out infinite; }
          .anim-grow { transform: scaleX(0); animation: growX .8s ease-out forwards; width: var(--w); }
          .anim-bounce-dot { animation: bounceDot .8s ease-in-out infinite; }
          .anim-glow { animation: glowPulse 2s ease-in-out infinite; }

          .fx-tabs input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 1px; height: 1px;
            pointer-events: none;
          }
          .fx-tabs .fx-panel { display: none; }
          .fx-tabs .fx-panel.active-for-0 { display: none; }

          /* panel visibility driven purely by :checked + :has() */
          .fx-tabs:has(#fx-tab-0:checked) .fx-panel-0 { display: block; animation: panelIn .4s ease-out; }
          .fx-tabs:has(#fx-tab-1:checked) .fx-panel-1 { display: block; animation: panelIn .4s ease-out; }
          .fx-tabs:has(#fx-tab-2:checked) .fx-panel-2 { display: block; animation: panelIn .4s ease-out; }
          .fx-tabs:has(#fx-tab-3:checked) .fx-panel-3 { display: block; animation: panelIn .4s ease-out; }

          /* active tab label styling */
          .fx-tabs .fx-tab-label { color: rgba(255,255,255,0.45); border-color: rgba(255,255,255,0.1); }
          .fx-tabs:has(#fx-tab-0:checked) .fx-tab-label-0,
          .fx-tabs:has(#fx-tab-1:checked) .fx-tab-label-1,
          .fx-tabs:has(#fx-tab-2:checked) .fx-tab-label-2,
          .fx-tabs:has(#fx-tab-3:checked) .fx-tab-label-3 {
            color: #fff;
            border-color: transparent;
          }

          /* active mini-card highlight */
          .fx-tabs .fx-card { border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); }
          .fx-tabs:has(#fx-tab-0:checked) .fx-card-0,
          .fx-tabs:has(#fx-tab-1:checked) .fx-card-1,
          .fx-tabs:has(#fx-tab-2:checked) .fx-card-2,
          .fx-tabs:has(#fx-tab-3:checked) .fx-card-3 {
            border-color: rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.08);
          }
        `,
      }}
    />
  );
}

export default function FeaturesSection() {
  return (
    <section
      aria-label="Codelura Platform Features"
      className="relative overflow-hidden bg-[#07060f] py-10 md:py-14"
    >
      <TabStyles />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Codelura Platform Features",
            itemListElement: FEATURES.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: f.title,
              description: f.desc,
            })),
          }),
        }}
      />

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-violet-700/10 blur-[120px] hidden sm:block" />
        <div className="absolute right-0 bottom-0 h-[320px] w-[320px] rounded-full bg-cyan-700/8 blur-[110px] hidden sm:block" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="anim-fade-up mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <Sparkles className="h-3 w-3" />
            Everything You Need
          </span>
          <h2 className="mt-5 text-3xl font-black text-white md:text-5xl">
            Why Developers Choose{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Codelura
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-base text-white/40 leading-relaxed">
            One platform packed with everything — learning, resources, mentorship,
            and professional services.
          </p>
        </div>

        {/* fx-tabs wrapper: everything CSS-driven from here down */}
        <div className="fx-tabs relative">
          <input type="radio" name="feature-tab" id="fx-tab-0" defaultChecked />
          <input type="radio" name="feature-tab" id="fx-tab-1" />
          <input type="radio" name="feature-tab" id="fx-tab-2" />
          <input type="radio" name="feature-tab" id="fx-tab-3" />

          {/* Tab nav — underline-glow style instead of filled pills */}
          <div
            className="anim-fade-up mb-12 flex flex-wrap justify-center gap-2"
            style={{ animationDelay: "0.15s" }}
            role="tablist"
            aria-label="Feature categories"
          >
            {FEATURES.map((f, i) => {
              const TabIcon = f.icon;
              return (
                <label
                  key={f.title}
                  htmlFor={`fx-tab-${i}`}
                  role="tab"
                  className={`fx-tab-label fx-tab-label-${i} flex cursor-pointer items-center gap-2 rounded-full border bg-white/4 px-5 py-2.5 text-sm font-semibold transition-colors duration-300 hover:text-white/80`}
                  style={
                    {
                      "--tw-gradient-from": undefined,
                    } as React.CSSProperties
                  }
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span className={`bg-gradient-to-r ${f.accent} bg-clip-text`}>
                    <span className="text-inherit" style={{ WebkitTextFillColor: "inherit" }}>
                      {f.title.split(" ").slice(0, 2).join(" ")}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {/* Panels — all rendered, only the :checked one is display:block */}
          <div className="relative">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  id={`feature-panel-${i}`}
                  role="tabpanel"
                  aria-label={f.title}
                  className={`fx-panel fx-panel-${i} grid gap-8 lg:grid-cols-2 lg:items-center`}
                >
                  {/* LEFT — spotlight card with accent left-border */}
                  <div
                    className={`space-y-6 rounded-2xl border-l-2 ${f.accentBg} px-6 py-2 lg:border-l-4 lg:bg-transparent lg:border-t-0 lg:border-r-0 lg:border-b-0 lg:pl-6 lg:pr-0`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${f.accentBg}`}>
                        <Icon className={`h-5 w-5 ${f.accentText}`} />
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${f.accentText} ${f.accentBg}`}>
                        {f.tagline}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white md:text-3xl leading-tight">
                      {f.title}
                    </h3>

                    <p className="text-base text-white/50 leading-relaxed">{f.desc}</p>

                    <ul className="space-y-3" aria-label={`${f.title} features`}>
                      {f.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-3 text-sm text-white/65">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 ${f.accentText}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={f.route}
                      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${f.accent} px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:translate-x-1 hover:shadow-xl`}
                    >
                      Explore Feature
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                  {/* RIGHT — visual */}
                  <div className="relative h-[360px] rounded-3xl border border-white/8 bg-white/3 overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12), transparent 70%)" }}
                    />
                    {f.visual}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom mini cards — also act as tab switchers, no JS needed */}
          <div className="anim-fade-up mt-16 grid grid-cols-2 gap-4 md:grid-cols-4" style={{ animationDelay: "0.3s" }}>
            {FEATURES.map((f, i) => {
              const CardIcon = f.icon;
              return (
                <label
                  key={f.title}
                  htmlFor={`fx-tab-${i}`}
                  className={`fx-card fx-card-${i} group block cursor-pointer rounded-2xl border p-4 text-left transition-all duration-300 hover:bg-white/6 hover:-translate-y-[3px]`}
                  aria-label={`View ${f.title}`}
                >
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${f.accentBg}`}>
                    <CardIcon className="h-4 w-4 text-white/60" />
                  </div>
                  <p className="text-sm font-semibold text-white/75 leading-tight">{f.title}</p>
                  <p className="mt-1 text-xs text-white/35 leading-snug line-clamp-2">{f.desc}</p>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}