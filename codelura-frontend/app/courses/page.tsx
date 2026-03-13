"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Course = {
  _id: string; title: string; price: number; isPaid: boolean;
  category: string; level?: string; language?: string;
  createdAt: string; tags?: string[];
  bannerImage?: { filePath: string };
};
type Testimonial = {
  _id: string; name: string; message: string; rating: number;
  profileImage?: string; category: string; createdAt: string;
};

const ITEMS_PER_PAGE = 6;
const STATIC_RATINGS = [4.4, 4.6, 4.3, 4.5, 4.4, 4.2, 4.8, 4.7];
const isTrending = (index: number, course: Course): boolean => index < 3 || (!course.isPaid && index % 2 === 0);
const isNewCourse = (createdAt: string) => Date.now() - new Date(createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
const generateStudentCounts = (count = 20) => {
  const set = new Set<string>();
  while (set.size < count) {
    const num = Math.floor(Math.random() * (9800 - 800) + 800);
    set.add(num < 1000 ? `${num}` : `${(num / 1000).toFixed(1)}k`);
  }
  return Array.from(set);
};
const STUDENT_COUNTS = generateStudentCounts(20);
const FILTERS: Array<"all" | "free" | "paid"> = ["all", "free", "paid"];
const levelConfig: Record<string, { color: string; bg: string; border: string }> = {
  Beginner:     { color:"#34d399", bg:"rgba(52,211,153,0.1)",  border:"rgba(52,211,153,0.25)"  },
  Intermediate: { color:"#fbbf24", bg:"rgba(251,191,36,0.1)",  border:"rgba(251,191,36,0.25)"  },
  Advanced:     { color:"#f87171", bg:"rgba(248,113,113,0.1)", border:"rgba(248,113,113,0.25)" },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const partial = rating - full;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"2px" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24">
          {i < full ? (
            <path fill="#f59e0b" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          ) : i === full && partial > 0 ? (
            <><defs><linearGradient id={`sg${i}`}><stop offset={`${partial*100}%`} stopColor="#f59e0b"/><stop offset={`${partial*100}%`} stopColor="rgba(255,255,255,0.1)"/></linearGradient></defs>
            <path fill={`url(#sg${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>
          ) : (
            <path fill="rgba(255,255,255,0.1)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          )}
        </svg>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ borderRadius:"24px", overflow:"hidden", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", animation:"skPulse 1.8s ease-in-out infinite" }}>
      <div style={{ height:"200px", background:"rgba(255,255,255,0.05)" }} />
      <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:"12px" }}>
        <div style={{ height:"14px", background:"rgba(255,255,255,0.07)", borderRadius:"8px", width:"60%" }} />
        <div style={{ height:"12px", background:"rgba(255,255,255,0.05)", borderRadius:"8px", width:"85%" }} />
        <div style={{ height:"44px", background:"rgba(255,255,255,0.06)", borderRadius:"14px", marginTop:"8px" }} />
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box}
.cp{font-family:'DM Sans',sans-serif}
.cph{font-family:'Syne',sans-serif}
.courses-bg{background:#07080f;min-height:100vh;position:relative;overflow-x:hidden}
.courses-bg::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.glow-orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(120px);z-index:0}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.25);color:#a5b4fc;border-radius:100px;padding:7px 20px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-family:'DM Sans',sans-serif}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:#818cf8;box-shadow:0 0 8px rgba(129,140,248,0.9);animation:blink 2s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
.stat-block{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:18px 28px;display:flex;flex-direction:column;align-items:center;backdrop-filter:blur(12px);transition:border-color .3s,transform .3s}
.stat-block:hover{border-color:rgba(99,102,241,0.3);transform:translateY(-3px)}
.stat-num{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;line-height:1;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-lbl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-top:3px}
.fp{padding:9px 26px;border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;transition:all .25s;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);font-family:'DM Sans',sans-serif;letter-spacing:.02em}
.fp:hover{border-color:rgba(99,102,241,0.4);color:#a5b4fc;background:rgba(99,102,241,0.08)}
.fp.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-color:transparent;color:#fff;box-shadow:0 4px 20px rgba(99,102,241,0.4)}

/* ── PREMIUM CARD ── */
.pcard{position:relative;background:linear-gradient(145deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.02) 100%);border:1px solid rgba(255,255,255,0.09);border-radius:24px;overflow:hidden;display:flex;flex-direction:column;transition:border-color .4s ease,box-shadow .4s ease;backdrop-filter:blur(8px)}
.pcard::before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(99,102,241,0.06) 0%,transparent 60%);opacity:0;transition:opacity .4s ease;pointer-events:none}
.pcard:hover{border-color:rgba(99,102,241,0.35);box-shadow:0 0 0 1px rgba(99,102,241,0.1),0 24px 60px rgba(0,0,0,0.5),0 8px 24px rgba(99,102,241,0.15),inset 0 1px 0 rgba(255,255,255,0.08)}
.pcard:hover::before{opacity:1}
.pcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#818cf8,#c084fc,transparent);opacity:0;transition:opacity .4s}
.pcard:hover::after{opacity:1}
.pcard-img-wrap{position:relative;height:196px;overflow:hidden;flex-shrink:0;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))}
.pcard-img-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.22,.68,0,1.2)}
.pcard:hover .pcard-img-wrap img{transform:scale(1.08)}
.pcard-img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(7,8,15,0.82) 100%)}
.pcard-img-top{position:absolute;inset:0;background:linear-gradient(160deg,rgba(7,8,15,0.25) 0%,transparent 50%)}
.pcard-category{position:absolute;top:14px;left:14px;display:inline-flex;align-items:center;gap:5px;background:rgba(7,8,15,0.75);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.75);border-radius:100px;padding:5px 12px;font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;font-family:'DM Sans',sans-serif}
.pcard-price-free{position:absolute;top:14px;right:14px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border-radius:10px;padding:5px 14px;font-size:12px;font-weight:800;font-family:'Syne',sans-serif;box-shadow:0 4px 16px rgba(16,185,129,0.4)}
.pcard-price-paid{position:absolute;top:14px;right:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:10px;padding:5px 14px;font-size:12px;font-weight:800;font-family:'Syne',sans-serif;box-shadow:0 4px 16px rgba(99,102,241,0.45)}
.badge-hot{display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;border-radius:100px;padding:4px 10px;font-size:10px;font-weight:700;font-family:'DM Sans',sans-serif}
.badge-new-c{display:inline-flex;align-items:center;gap:4px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;border-radius:100px;padding:4px 10px;font-size:10px;font-weight:700;font-family:'DM Sans',sans-serif}
.pcard-students{position:absolute;bottom:12px;left:14px;display:inline-flex;align-items:center;gap:6px;background:rgba(7,8,15,0.75);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.65);border-radius:100px;padding:5px 12px;font-size:11px;font-weight:600;font-family:'DM Sans',sans-serif}
.pcard-body{padding:22px 22px 20px;display:flex;flex-direction:column;gap:12px;flex:1}
.pcard-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#fff;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .25s}
.pcard:hover .pcard-title{color:#a5b4fc}
.meta-chip{display:inline-flex;align-items:center;border-radius:8px;padding:4px 10px;font-size:10.5px;font-weight:600;border:1px solid;font-family:'DM Sans',sans-serif}
.tag-chip{display:inline-flex;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:500;color:rgba(255,255,255,0.35);font-family:'DM Sans',sans-serif}
.pcard-cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border-radius:14px;border:none;font-size:13.5px;font-weight:700;font-family:'Syne',sans-serif;text-decoration:none;cursor:pointer;letter-spacing:.01em;transition:all .3s cubic-bezier(.22,.68,0,1.2);position:relative;overflow:hidden}
.pcard-cta-free{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 4px 20px rgba(16,185,129,0.3)}
.pcard-cta-free:hover{box-shadow:0 8px 30px rgba(16,185,129,0.5);transform:translateY(-2px)}
.pcard-cta-paid{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 4px 20px rgba(99,102,241,0.35)}
.pcard-cta-paid:hover{box-shadow:0 8px 30px rgba(99,102,241,0.55);transform:translateY(-2px)}
.pcard-cta::before{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transition:left .5s ease}
.pcard-cta:hover::before{left:160%}
.pcard-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1));font-size:56px;transition:transform .5s ease}
.pcard:hover .pcard-fallback{transform:scale(1.1)}
.pgbtn{width:40px;height:40px;border-radius:12px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);cursor:pointer;transition:all .22s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center}
.pgbtn:hover{border-color:rgba(99,102,241,0.4);color:#a5b4fc}
.pgbtn.active{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-color:transparent;color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.4)}
.pgbtn:disabled{opacity:.25;cursor:not-allowed}
.hl-chip{display:inline-flex;align-items:center;gap:7px;padding:8px 18px;border-radius:100px;font-size:12px;font-weight:600;font-family:'DM Sans',sans-serif;border:1px solid}
@keyframes skPulse{0%,100%{opacity:.6}50%{opacity:.3}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.fu{animation:fadeUp .6s ease both}
.d1{animation-delay:.05s}.d2{animation-delay:.15s}.d3{animation-delay:.25s}.d4{animation-delay:.38s}.d5{animation-delay:.5s}
.squiggle{animation:sqDraw 1.1s ease .7s both;stroke-dasharray:320;stroke-dashoffset:320}
@keyframes sqDraw{to{stroke-dashoffset:0}}
.bottom-cta{background:linear-gradient(135deg,rgba(99,102,241,0.18) 0%,rgba(139,92,246,0.12) 50%,rgba(79,70,229,0.18) 100%);border:1px solid rgba(99,102,241,0.2);border-radius:28px;padding:72px 40px;text-align:center;position:relative;overflow:hidden}
.tcard{position:relative;background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:22px;padding:28px;display:flex;flex-direction:column;gap:16px;overflow:hidden;transition:border-color .35s,box-shadow .35s,transform .35s}
.tcard::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#f97316,#fbbf24,transparent);opacity:0;transition:opacity .35s}
.tcard:hover{border-color:rgba(249,115,22,0.25);transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,0.4),0 0 0 1px rgba(249,115,22,0.1)}
.tcard:hover::after{opacity:1}
.tcard-quote{position:absolute;top:10px;right:16px;font-size:90px;line-height:1;color:rgba(249,115,22,0.06);font-family:Georgia,serif;font-weight:700;pointer-events:none;user-select:none;transition:color .35s}
.tcard:hover .tcard-quote{color:rgba(249,115,22,0.1)}
.tcard-avatar{width:44px;height:44px;border-radius:50%;border:2px solid rgba(249,115,22,0.2);object-fit:cover;flex-shrink:0;transition:border-color .3s,transform .3s}
.tcard:hover .tcard-avatar{border-color:rgba(249,115,22,0.5);transform:scale(1.06)}
.tcard-av-fallback{width:44px;height:44px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:16px;box-shadow:0 4px 14px rgba(249,115,22,0.35);transition:transform .3s,box-shadow .3s}
.tcard:hover .tcard-av-fallback{transform:scale(1.06);box-shadow:0 6px 20px rgba(249,115,22,0.45)}
.tcard-verified{display:inline-flex;align-items:center;gap:4px;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);color:#fb923c;border-radius:100px;padding:3px 10px;font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;font-family:'DM Sans',sans-serif}
@keyframes tcardFU{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.tcard-anim{opacity:0;animation:tcardFU .55s cubic-bezier(.22,.68,0,1.1) forwards}
.tcard-anim:nth-child(1){animation-delay:.08s}
.tcard-anim:nth-child(2){animation-delay:.18s}
.tcard-anim:nth-child(3){animation-delay:.28s}
@media(max-width:640px){.course-grid{grid-template-columns:1fr !important}.testi-grid{grid-template-columns:1fr !important}.bottom-cta{padding:50px 24px !important}}
@media(min-width:641px) and (max-width:1023px){.course-grid{grid-template-columns:1fr 1fr !important}.testi-grid{grid-template-columns:1fr 1fr !important}}
`;

export default function CoursesPage() {
  const [courses, setCourses]           = useState<Course[]>([]);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [filter, setFilter]             = useState<"all" | "free" | "paid">("all");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/testimonial/material")
      .then((res) => setTestimonials(res.data.data))
      .catch((err) => console.error("Testimonial fetch error:", err));
  }, []);

  const normalizePath = (p: string) =>
    p.includes("uploads") ? "/uploads/" + p.split("uploads")[1].replace(/\\/g, "/") : p;

  const filteredCourses  = courses.filter((c) => filter === "free" ? !c.isPaid : filter === "paid" ? c.isPaid : true);
  const totalPages       = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const start            = (page - 1) * ITEMS_PER_PAGE;
  const visibleCourses   = filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  const freeCourses      = courses.filter((c) => !c.isPaid).length;
  const paidCourses      = courses.filter((c) =>  c.isPaid).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="cp courses-bg">
        {/* Ambient Glows */}
        <div className="glow-orb" style={{ width:700, height:700, background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 65%)", top:"-200px", left:"-200px" }} />
        <div className="glow-orb" style={{ width:600, height:600, background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 65%)", top:"40%", right:"-200px" }} />
        <div className="glow-orb" style={{ width:500, height:500, background:"radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 65%)", bottom:"-100px", left:"20%" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:"1200px", margin:"0 auto", padding:"72px 24px" }}>

          {/* ══ HERO ══ */}
          <section style={{ textAlign:"center", marginBottom:"72px" }}>
            <div className="fu d1" style={{ marginBottom:"20px" }}>
              <span className="hero-badge"><span className="hero-badge-dot" />Study Materials</span>
            </div>
            <h1 className="cph fu d2" style={{ fontSize:"clamp(38px,6vw,72px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-0.03em", color:"#fff", margin:"0 0 20px" }}>
              Learn, Crack &{" "}
              <span style={{ position:"relative", display:"inline-block" }}>
                <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", position:"relative", zIndex:1 }}>Succeed</span>
                <svg style={{ position:"absolute", bottom:"-6px", left:0, width:"100%", overflow:"visible" }} viewBox="0 0 300 10" fill="none">
                  <path className="squiggle" d="M2 7 Q 75 1, 150 6 T 298 4" stroke="url(#csg)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <defs><linearGradient id="csg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#c084fc"/></linearGradient></defs>
                </svg>
              </span>
            </h1>
            <p className="fu d3" style={{ fontSize:17, lineHeight:1.75, color:"rgba(255,255,255,0.45)", maxWidth:580, margin:"0 auto 32px" }}>
              Complete <span style={{ color:"rgba(255,255,255,0.8)", fontWeight:600 }}>software engineering & placement preparation</span> ke liye — coding, DSA, interview prep aur real-world concepts.
            </p>
            <div className="fu d4" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"10px", marginBottom:"36px" }}>
              {[
                { icon:"📄", label:"Downloadable PDFs",   c:"rgba(52,211,153,0.12)",  b:"rgba(52,211,153,0.25)",  t:"#6ee7b7" },
                { icon:"💻", label:"Software & IT Focus",  c:"rgba(99,102,241,0.12)",  b:"rgba(99,102,241,0.25)",  t:"#a5b4fc" },
                { icon:"🎯", label:"Placement Oriented",   c:"rgba(168,85,247,0.12)",  b:"rgba(168,85,247,0.25)",  t:"#d8b4fe" },
                { icon:"🚀", label:"Beginner to Advanced", c:"rgba(251,191,36,0.12)",  b:"rgba(251,191,36,0.25)",  t:"#fde68a" },
              ].map((h) => (
                <span key={h.label} className="hl-chip" style={{ background:h.c, borderColor:h.b, color:h.t }}>{h.icon} {h.label}</span>
              ))}
            </div>
            {!loading && courses.length > 0 && (
              <div className="fu d5" style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"14px" }}>
                {[{ val:`${courses.length}+`, label:"Total Courses" }, { val:`${freeCourses}`, label:"Free Access" }, { val:`${paidCourses}`, label:"Premium" }].map((s, i) => (
                  <div key={i} className="stat-block"><div className="stat-num">{s.val}</div><div className="stat-lbl">{s.label}</div></div>
                ))}
              </div>
            )}
          </section>

          {/* ══ FILTER ══ */}
          <div style={{ display:"flex", justifyContent:"center", gap:"12px", marginBottom:"52px" }}>
            {FILTERS.map((t) => (
              <button key={t} onClick={() => { setFilter(t); setPage(1); }} className={`fp ${filter === t ? "active" : ""}`}>
                {t === "all" ? "✦ All Courses" : t === "free" ? "🎁 Free" : "⭐ Premium"}
              </button>
            ))}
          </div>

          {/* ══ LOADING ══ */}
          {loading && (
            <div className="course-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"22px" }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ══ EMPTY ══ */}
          {!loading && filteredCourses.length === 0 && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"100px 0", gap:"18px", textAlign:"center" }}>
              <div style={{ width:80, height:80, borderRadius:"20px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>📭</div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontWeight:600, fontSize:18, margin:0 }}>No courses found</p>
              <p style={{ color:"rgba(255,255,255,0.25)", fontSize:14, margin:0 }}>Try a different filter</p>
            </div>
          )}

          {/* ══ COURSES GRID ══ */}
          {!loading && visibleCourses.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div key={filter + page} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.35 }}
                className="course-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"22px" }}>
                {visibleCourses.map((c, index) => {
                  const rating   = STATIC_RATINGS[index % STATIC_RATINGS.length];
                  const students = STUDENT_COUNTS[index % STUDENT_COUNTS.length];
                  const trending = isTrending(index, c);
                  const isNew    = isNewCourse(c.createdAt);
                  const lvlCfg   = c.level ? (levelConfig[c.level] ?? { color:"rgba(255,255,255,0.45)", bg:"rgba(255,255,255,0.05)", border:"rgba(255,255,255,0.12)" }) : null;
                  return (
                    <motion.div key={c._id} whileHover={{ y: -8 }} transition={{ duration:0.3, ease:[0.22,0.68,0,1.2] }} className="pcard">
                      <div className="pcard-img-wrap">
                        {c.bannerImage?.filePath
                          ? <><img src={`http://localhost:3002${normalizePath(c.bannerImage.filePath)}`} alt={c.title} loading="lazy" /><div className="pcard-img-overlay" /><div className="pcard-img-top" /></>
                          : <><div className="pcard-fallback">📚</div><div className="pcard-img-overlay" /></>
                        }
                        <span className="pcard-category">
                          <span style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.5)", display:"inline-block" }} />
                          {c.category}
                        </span>
                        {c.isPaid ? <span className="pcard-price-paid">₹{c.price}</span> : <span className="pcard-price-free">FREE</span>}
                        {(trending || isNew) && (
                          <div style={{ position:"absolute", bottom:42, left:14, display:"flex", flexDirection:"column", gap:5 }}>
                            {trending && <span className="badge-hot">🔥 Popular</span>}
                            {isNew    && <span className="badge-new-c">✦ New</span>}
                          </div>
                        )}
                        <span className="pcard-students">👥 {students} learners</span>
                      </div>
                      <div className="pcard-body">
                        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                          {lvlCfg && c.level && <span className="meta-chip" style={{ background:lvlCfg.bg, borderColor:lvlCfg.border, color:lvlCfg.color }}>{c.level}</span>}
                          {c.language && <span className="meta-chip" style={{ background:"rgba(255,255,255,0.05)", borderColor:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.45)" }}>🌐 {c.language}</span>}
                        </div>
                        <h2 className="pcard-title">{c.title}</h2>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <StarRating rating={rating} />
                          <span style={{ fontSize:13, fontWeight:700, color:"#fbbf24", fontFamily:"'Syne',sans-serif" }}>{rating.toFixed(1)}</span>
                          <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>({students})</span>
                        </div>
                        {c.tags && c.tags.length > 0 && (
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                            {c.tags.slice(0,3).map((tag) => <span key={tag} className="tag-chip">#{tag}</span>)}
                          </div>
                        )}
                        <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", margin:"2px 0" }} />
                        <Link href={`/courses/${c._id}`} className={`pcard-cta ${c.isPaid ? "pcard-cta-paid" : "pcard-cta-free"}`}>
                          {c.isPaid ? `Enroll for ₹${c.price}` : "Access for Free"}
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ══ PAGINATION ══ */}
          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:"8px", marginTop:"56px" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="pgbtn">‹</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`pgbtn ${page === i + 1 ? "active" : ""}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="pgbtn">›</button>
            </div>
          )}

          {/* ══ BOTTOM CTA ══ */}
          {!loading && courses.length > 0 && (
            <section className="bottom-cta" style={{ marginTop:"80px" }}>
              <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"rgba(99,102,241,0.08)", top:"-100px", right:"-60px", pointerEvents:"none" }} />
              <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(139,92,246,0.06)", bottom:"-150px", left:"-80px", pointerEvents:"none" }} />
              <div style={{ position:"absolute", inset:0, opacity:.04, backgroundImage:"radial-gradient(rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize:"30px 30px", pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:520, margin:"0 auto" }}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".2em", color:"rgba(165,180,252,0.7)", marginBottom:14 }}>1-on-1 Guidance</p>
                <h2 className="cph" style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:12 }}>
                  Need Personalized{" "}
                  <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Mentorship?</span>
                </h2>
                <p style={{ color:"rgba(165,180,252,0.6)", fontSize:15, lineHeight:1.7, marginBottom:32 }}>Direct guidance for placements, DSA, projects aur career growth.</p>
                <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"12px" }}>
                  <a href="https://topmate.io/talkwithsuraj/" target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:"14px", background:"#fff", color:"#4f46e5", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, textDecoration:"none", boxShadow:"0 4px 24px rgba(99,102,241,0.3)", transition:"transform .25s,box-shadow .25s" }}
                    onMouseOver={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 8px 32px rgba(99,102,241,0.45)"; }}
                    onMouseOut={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform=""; el.style.boxShadow="0 4px 24px rgba(99,102,241,0.3)"; }}
                  >
                    Book a Session
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 4l3.5 3.5L8 11" stroke="#4f46e5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                  <Link href="/premium"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"13px 28px", borderRadius:"14px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, textDecoration:"none", transition:"background .25s" }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.14)"; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.08)"; }}
                  >View Plans</Link>
                </div>
              </div>
            </section>
          )}

          {/* ══ TESTIMONIALS ══ */}
          {testimonials.length > 0 && (
            <section style={{ marginTop:"96px", position:"relative" }}>
              <div style={{ position:"absolute", width:600, height:300, borderRadius:"50%", background:"rgba(249,115,22,0.06)", top:"-60px", left:"50%", transform:"translateX(-50%)", filter:"blur(80px)", pointerEvents:"none" }} />
              <div style={{ position:"relative", textAlign:"center", marginBottom:"52px", zIndex:1 }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(249,115,22,0.1)", border:"1px solid rgba(249,115,22,0.25)", color:"#fb923c", borderRadius:"100px", padding:"6px 18px", fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" as const, fontFamily:"'DM Sans',sans-serif", marginBottom:16 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#f97316", boxShadow:"0 0 8px rgba(249,115,22,0.8)", animation:"blink 2s ease-in-out infinite", display:"inline-block" }} />
                  Student Reviews
                </span>
                <h2 className="cph" style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#fff", lineHeight:1.12, letterSpacing:"-0.02em", margin:"0 0 10px" }}>
                  What Students <em style={{ color:"#f97316", fontStyle:"italic", fontFamily:"Georgia,serif" }}>Say</em> 💬
                </h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:14, maxWidth:380, margin:"0 auto", lineHeight:1.7 }}>Honest experiences from real students who used our materials.</p>
                <div style={{ width:48, height:3, background:"linear-gradient(90deg,#f97316,#fbbf24)", borderRadius:100, margin:"16px auto 0" }} />
              </div>
              <div className="testi-grid" style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"18px" }}>
                {testimonials.slice(0, 3).map((t) => (
                  <div key={t._id} className="tcard tcard-anim">
                    <span className="tcard-quote">&ldquo;</span>
                    <div style={{ display:"flex", alignItems:"center", gap:"12px", position:"relative" }}>
                      {t.profileImage
                        ? <img src={t.profileImage} alt={t.name} className="tcard-avatar" />
                        : <div className="tcard-av-fallback">{t.name.charAt(0).toUpperCase()}</div>
                      }
                      <div style={{ minWidth:0, flex:1 }}>
                        <h3 style={{ fontWeight:600, fontSize:14, color:"#fff", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"'DM Sans',sans-serif" }}>{t.name}</h3>
                        <div style={{ display:"flex", alignItems:"center", gap:"3px", marginTop:"5px" }}>
                          {[1,2,3,4,5].map((s) => <span key={s} style={{ fontSize:13, color: s <= t.rating ? "#fbbf24" : "rgba(255,255,255,0.12)" }}>★</span>)}
                          <span style={{ fontSize:11, color:"#f59e0b", fontWeight:700, marginLeft:4, fontFamily:"'Syne',sans-serif" }}>{t.rating}.0</span>
                        </div>
                      </div>
                      <span className="tcard-verified">✦ Verified</span>
                    </div>
                    <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)" }} />
                    <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13.5, lineHeight:1.78, fontStyle:"italic", flex:1, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{t.message}</p>
                  </div>
                ))}
              </div>
              {testimonials.length > 3 && (
                <div style={{ textAlign:"center", marginTop:"44px" }}>
                  <Link href="/testimonial/material"
                    style={{ display:"inline-flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#f97316,#fbbf24)", color:"#fff", borderRadius:"100px", padding:"13px 32px", fontSize:14, fontWeight:600, textDecoration:"none", fontFamily:"'Syne',sans-serif", boxShadow:"0 4px 20px rgba(249,115,22,0.35)", transition:"transform .25s,box-shadow .25s" }}
                    onMouseOver={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 8px 28px rgba(249,115,22,0.5)"; }}
                    onMouseOut={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform=""; el.style.boxShadow="0 4px 20px rgba(249,115,22,0.35)"; }}
                  >
                    View All Reviews
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </>
  );
}