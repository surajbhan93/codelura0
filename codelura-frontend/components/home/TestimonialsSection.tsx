"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote,  ArrowRight, Sparkles } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */
interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  gradient: string;
  tag: string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aryan Sharma",
    role: "Software Engineer",
    company: "Google",
    text: "Codelura's mentorship completely transformed my interview prep. The 1-on-1 sessions were laser-focused and helped me crack Google in just 3 months.",
    rating: 5,
    avatar: "AS",
    gradient: "from-violet-500 to-indigo-500",
    tag: "Mentorship",
  },
  {
    name: "Priya Mehta",
    role: "Freelance Developer",
    company: "Toptal",
    text: "I landed my first international client within 2 weeks of building my portfolio on Codelura. The practical content is unlike anything else out there.",
    rating: 5,
    avatar: "PM",
    gradient: "from-fuchsia-500 to-pink-500",
    tag: "Freelancing",
  },
  {
    name: "Rahul Verma",
    role: "Startup Founder",
    company: "BuildFast",
    text: "They delivered our entire SaaS dashboard in 12 days. Clean code, great communication, and a stunning design. Highly recommend their dev services.",
    rating: 5,
    avatar: "RV",
    gradient: "from-emerald-500 to-teal-500",
    tag: "Development",
  },
  {
    name: "Sneha Joshi",
    role: "CS Student",
    company: "IIT Bombay",
    text: "The DSA notes and system design content saved me hundreds of hours. Everything is structured exactly how industry expects you to think.",
    rating: 5,
    avatar: "SJ",
    gradient: "from-cyan-500 to-blue-500",
    tag: "Learning",
  },
  {
    name: "Karan Malhotra",
    role: "Backend Developer",
    company: "Razorpay",
    text: "I upskilled from a junior to senior role in 6 months using Codelura. The real-world architecture breakdowns are genuinely top-tier content.",
    rating: 5,
    avatar: "KM",
    gradient: "from-amber-500 to-orange-500",
    tag: "Upskilling",
  },
  {
    name: "Nisha Patel",
    role: "Product Manager",
    company: "Zomato",
    text: "Even as a PM I use Codelura to stay technically sharp. The blogs are dense, practical and written by people who clearly work in production systems.",
    rating: 5,
    avatar: "NP",
    gradient: "from-rose-500 to-pink-500",
    tag: "Content",
  },
];

/* ─── Star Row ───────────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ─── Single Card ────────────────────────────────────────────── */
function TestimonialCard({
  t,
  i,
  featured = false,
}: {
  t: Testimonial;
  i: number;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/8 bg-white/4 p-7 backdrop-blur-xl transition-all duration-300
        ${featured ? "md:col-span-1 ring-1 ring-violet-500/30" : ""}`}
      style={{ cursor: "default" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 12px 48px rgba(139,92,246,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Quote icon */}
      <Quote className="mb-4 h-6 w-6 text-white/10" aria-hidden="true" />

      {/* Tag */}
      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
        <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${t.gradient}`} />
        {t.tag}
      </span>

      {/* Review text */}
      <p className="flex-1 text-sm leading-relaxed text-white/60">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="my-5 h-px bg-white/6" />

      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${t.gradient} text-xs font-black text-white shadow-md`}
          >
            {t.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-white/85">{t.name}</p>
            <p className="text-[11px] text-white/35">
              {t.role} · {t.company}
            </p>
          </div>
        </div>
        <Stars count={t.rating} />
      </div>
    </motion.div>
  );
}

/* ─── Marquee Row (mobile / overflow) ───────────────────────── */
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-5"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
      >
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="w-[340px] shrink-0">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur">
              <Quote className="mb-3 h-4 w-4 text-white/10" />
              <p className="mb-4 text-xs leading-relaxed text-white/50">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} text-[10px] font-black text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-white/75">{t.name}</p>
                  <p className="text-[10px] text-white/35">{t.company}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Export ────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section
      aria-label="Testimonials — What people say about Codelura"
      className="relative overflow-hidden bg-[#07060f] py-10 md:py-14 text-white"
    >
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Codelura Testimonials",
            itemListElement: TESTIMONIALS.map((t, i) => ({
              "@type": "Review",
              position: i + 1,
              author: { "@type": "Person", name: t.name },
              reviewBody: t.text,
              reviewRating: {
                "@type": "Rating",
                ratingValue: t.rating,
                bestRating: 5,
              },
            })),
          }),
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[160px]" />
        <div className="absolute left-0 bottom-0 h-[350px] w-[350px] rounded-full bg-fuchsia-700/8 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 28 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-400">
            <Sparkles className="h-3 w-3" />
            Real Stories
          </span>

          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            What People Say About{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Codelura
            </span>
          </h2>

          <p className="mt-4 mx-auto max-w-xl text-base text-white/40 leading-relaxed">
            Developers, students, freelancers and founders share how Codelura
            helped them grow, build and get hired.
          </p>

          {/* Aggregate rating */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-2.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-black text-amber-300">4.9</span>
            <span className="text-xs text-white/35">from 3,500+ reviews</span>
          </div>
        </motion.div>

        {/* ── Grid (desktop) ── */}
        <div
          className="hidden md:grid md:grid-cols-3 gap-5"
          aria-label="Testimonial reviews"
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} t={t} i={i} />
          ))}
        </div>

        {/* ── Marquee (mobile + visual depth on all screens) ── */}
        <div className="mt-8 space-y-5 md:hidden">
          <MarqueeRow items={TESTIMONIALS.slice(0, 3)} />
          <MarqueeRow items={TESTIMONIALS.slice(3)} reverse />
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-sm text-white/35">
            Join{" "}
            <span className="font-bold text-white/65">10,000+</span> developers
            already building their future
          </p>
          <motion.a
            href="/auth/singup"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-violet-700/30 transition-all duration-300 hover:shadow-violet-700/55"
            aria-label="Join Codelura today"
          >
            Join Codelura Today
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}