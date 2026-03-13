"use client";

import { Work } from "./page";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import type { Variants } from "framer-motion";
import Link from "next/link";
/* ─── fade-up variant helper ─── */
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

/* ─── section header ─── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2
        className="text-xl sm:text-2xl font-bold text-white tracking-tight whitespace-nowrap"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
    </div>
  );
}

export default function WorkDetailClient({ work }: { work: Work }) {
  /* ── Meta items — plain array of objects, no destructuring tricks ── */
  const metaItems = [
    { label: "Client",   value: work.clientName, icon: "🏢" },
    { label: "Category", value: work.category,   icon: "📂" },
    { label: "Industry", value: work.industry,   icon: "🏭" },
    { label: "Role",     value: work.role,        icon: "👤" },
    { label: "Duration", value: work.duration,    icon: "🗓️" },
  ].filter((item) => Boolean(item.value));

  /* ── Case study rows ── */
  const caseRows = [
    {
      title: "Problem",
      content: work.caseStudy?.problem,
      color: "from-rose-500/15 to-orange-500/5",
      tag: "bg-rose-500/20 text-rose-400",
      icon: "⚠️",
    },
    {
      title: "Solution",
      content: work.caseStudy?.solution,
      color: "from-indigo-500/15 to-violet-500/5",
      tag: "bg-indigo-500/20 text-indigo-400",
      icon: "💡",
    },
    {
      title: "Result",
      content: work.caseStudy?.result,
      color: "from-emerald-500/15 to-teal-500/5",
      tag: "bg-emerald-500/20 text-emerald-400",
      icon: "✅",
    },
  ].filter((row) => Boolean(row.content));

  /* ── Metric items ── */
  const metricItems = [
    { label: "Users",       value: work.metrics?.users,           icon: "👥" },
    { label: "Performance", value: work.metrics?.performanceGain, icon: "⚡" },
    { label: "Revenue",     value: work.metrics?.revenueImpact,   icon: "📈" },
  ].filter((item) => Boolean(item.value));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .wd-root { font-family: 'DM Sans', sans-serif; }

        .glow-card {
          position: relative;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
        }
        .glow-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(99,102,241,0.2);
          border-color: rgba(99,102,241,0.35);
        }
        .glow-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .glow-card:hover::before { opacity: 1; }

        .metric-card {
          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.08));
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 20px;
          padding: 28px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.25);
        }

        .tech-tag {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s;
        }
        .tech-tag:hover {
          background: rgba(99,102,241,0.25);
          border-color: rgba(99,102,241,0.5);
          color: white;
        }

        .case-card {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .case-card-inner {
          padding: 28px;
          background: rgba(255,255,255,0.03);
        }
        .case-tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 12px;
        }

        .gallery-wrap {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          height: 224px;
        }
        .gallery-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-wrap:hover img { transform: scale(1.06); }

        .btn-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
          transition: all 0.25s;
          text-decoration: none;
        }
        .btn-live:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(99,102,241,0.5);
        }

        .btn-code {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.15);
          transition: all 0.25s;
          text-decoration: none;
        }
        .btn-code:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
          color: white;
          transform: translateY(-2px);
        }

        .noise-dark::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div
        className="wd-root noise-dark relative min-h-screen overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0a0a14 0%, #0f0f1a 50%, #080810 100%)" }}
      >
        {/* ── background blobs + grid ── */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -top-60 -left-40 w-[800px] h-[800px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 -right-60 w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-60 left-1/3 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 space-y-20 sm:space-y-28">

          {/* ══ HERO ══ */}
         <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0}
  className="space-y-6"
>
            {/* breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
             <Link
  href="/work"
  className="hover:text-indigo-400 transition-colors"
>
  Work
</Link>
              <span>/</span>
              <span className="text-white/50">{work.title}</span>
            </div>

            {/* badges */}
            <div className="flex flex-wrap items-center gap-3">
              {work.isFeatured && (
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest
                             px-4 py-1.5 rounded-full text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}
                >
                  ✦ Featured Project
                </span>
              )}
              {work.category && (
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider
                             px-4 py-1.5 rounded-full text-white/60"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {work.category}
                </span>
              )}
            </div>

            {/* title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.06] tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {work.title}
            </h1>

            {/* short desc */}
            {work.shortDescription && (
              <p className="text-white/50 text-lg sm:text-xl max-w-2xl leading-relaxed">
                {work.shortDescription}
              </p>
            )}

            {/* CTA buttons */}
            {(work.liveUrl || work.githubUrl) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {work.liveUrl && (
                  <a href={work.liveUrl} target="_blank" rel="noreferrer" className="btn-live">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Preview
                  </a>
                )}
                {work.githubUrl && (
                  <a href={work.githubUrl} target="_blank" rel="noreferrer" className="btn-code">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    Source Code
                  </a>
                )}
              </div>
            )}
          </motion.section>

          {/* ══ THUMBNAIL ══ */}
          {work.thumbnail && (
            <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
  className="relative rounded-3xl overflow-hidden"
  style={{
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.6)"
  }}
>
              <img src={work.thumbnail} alt={work.title} className="w-full max-h-[560px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
          )}

          {/* ══ META CARDS ══ */}
          {metaItems.length > 0 && (
            <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.15}
>
              <SectionHeading>Project Details</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {metaItems.map((item) => (
                  <div key={item.label} className="glow-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{item.icon}</span>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-white font-semibold text-[0.95rem]">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ══ OVERVIEW ══ */}
          {work.description && (
           <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
  className="max-w-4xl"
>
              <SectionHeading>Overview</SectionHeading>
              <p className="text-white/55 leading-[1.9] text-base sm:text-lg">
                {work.description}
              </p>
            </motion.section>
          )}

          {/* ══ TECH STACK ══ */}
          {work.techStack && work.techStack.length > 0 && (
           <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
>
              <SectionHeading>Tech Stack</SectionHeading>
              <div className="flex flex-wrap gap-2.5">
                {work.techStack.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
              </div>
            </motion.section>
          )}

          {/* ══ CASE STUDY ══ */}
          {work.caseStudy && caseRows.length > 0 && (
           <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
>
              <SectionHeading>Case Study</SectionHeading>
              <div className="grid gap-5">
                {caseRows.map((row) => (
                  <div key={row.title} className={`case-card bg-gradient-to-br ${row.color}`}>
                    <div className="case-card-inner">
                      <span className={`case-tag ${row.tag}`}>
                        {row.icon} {row.title}
                      </span>
                      <p className="text-white/65 leading-relaxed">{row.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ══ METRICS ══ */}
          {work.metrics && metricItems.length > 0 && (
            <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
>
              <SectionHeading>Impact & Results</SectionHeading>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {metricItems.map((item) => (
                  <div key={item.label} className="metric-card">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-300/70 mb-3 flex items-center gap-2">
                      <span>{item.icon}</span>{item.label}
                    </p>
                    <p
                      className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ══ GALLERY ══ */}
          {work.images && work.images.length > 0 && (
            <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
>
              <SectionHeading>Screenshots</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {work.images.map((img, i) => (
                  <motion.div
                    key={i}
                    className="gallery-wrap"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={img} alt={`Screenshot ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ══ SEPARATOR ══ */}
          <Separator style={{ background: "rgba(255,255,255,0.08)" }} />

          {/* ══ CTA BOTTOM ══ */}
          <motion.section
  variants={fadeUp}
  initial="hidden"
  animate="show"
  custom={0.1}
>
            <div
              className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed, #6d28d9)" }}
            >
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
              <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10 space-y-4 max-w-lg mx-auto">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
                  Lets collaborate
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Like what you see?
                </h2>
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Lets work together to build something amazing.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  {work.liveUrl && (
                    <a href={work.liveUrl} target="_blank" rel="noreferrer" className="btn-live">
                      View Live →
                    </a>
                  )}
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                               bg-white text-indigo-700 font-bold text-sm
                               hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Start a Project →
                  </a>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
}