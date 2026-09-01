"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Work = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  isFeatured?: boolean;
  thumbnail?: string;
  category?: string;
  industry?: string;
  techStack?: string[];
  role?: string;
  duration?: string;
  views?: number;
};

const COLORS = [
  { grad: "linear-gradient(135deg,#7c3aed,#4f46e5)", glow: "rgba(124,58,237,0.35)", accent: "#a78bfa" },
  { grad: "linear-gradient(135deg,#e11d48,#db2777)", glow: "rgba(225,29,72,0.35)",  accent: "#fb7185" },
  { grad: "linear-gradient(135deg,#d97706,#ea580c)", glow: "rgba(217,119,6,0.35)",  accent: "#fbbf24" },
  { grad: "linear-gradient(135deg,#059669,#0891b2)", glow: "rgba(5,150,105,0.35)",  accent: "#34d399" },
  { grad: "linear-gradient(135deg,#0284c7,#0e7490)", glow: "rgba(2,132,199,0.35)",  accent: "#38bdf8" },
  { grad: "linear-gradient(135deg,#c026d3,#7c3aed)", glow: "rgba(192,38,211,0.35)", accent: "#e879f9" },
];
const palette = (i: number) => COLORS[i % COLORS.length];

function SkeletonCard() {
  return (
    <div style={{ borderRadius:"20px", overflow:"hidden", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", animation:"wskPulse 1.8s ease-in-out infinite" }}>
      <div style={{ height:"192px", background:"rgba(255,255,255,0.05)" }} />
      <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:"10px" }}>
        <div style={{ height:"14px", background:"rgba(255,255,255,0.07)", borderRadius:"8px", width:"70%" }} />
        <div style={{ height:"11px", background:"rgba(255,255,255,0.05)", borderRadius:"8px", width:"45%" }} />
        <div style={{ height:"11px", background:"rgba(255,255,255,0.04)", borderRadius:"8px", width:"90%" }} />
        <div style={{ display:"flex", gap:"6px", paddingTop:"4px" }}>
          {[1,2,3].map(x => <div key={x} style={{ height:"20px", width:"50px", background:"rgba(255,255,255,0.05)", borderRadius:"100px" }} />)}
        </div>
      </div>
    </div>
  );
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  const { grad, glow, accent } = palette(index);
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/work/${work.slug}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"flex", flexDirection:"column", background: hov ? "linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))" : "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", border: hov ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.09)", borderRadius:"20px", overflow:"hidden", textDecoration:"none", transition:"all 0.38s cubic-bezier(.22,.68,0,1.2)", transform: hov ? "translateY(-7px)" : "translateY(0)", boxShadow: hov ? `0 24px 60px rgba(0,0,0,0.5),0 0 0 1px ${accent}20,0 8px 24px ${glow}` : "0 2px 12px rgba(0,0,0,0.2)", position:"relative", backdropFilter:"blur(8px)", cursor:"pointer" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:grad, opacity: hov ? 1 : 0, transition:"opacity 0.38s ease" }} />
      <div style={{ position:"relative", height:"192px", overflow:"hidden", flexShrink:0 }}>
        {work.thumbnail ? (
          <><img src={work.thumbnail} alt={work.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.6s ease", transform: hov ? "scale(1.09)" : "scale(1)" }} /><div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,transparent 25%,rgba(7,8,15,0.88) 100%)" }} /><div style={{ position:"absolute", inset:0, background:grad, opacity: hov ? 0.2 : 0, transition:"opacity 0.5s ease" }} /></>
        ) : (
          <div style={{ width:"100%", height:"100%", background:grad, display:"flex", alignItems:"center", justifyContent:"center", transition:"transform 0.5s ease", transform: hov ? "scale(1.1)" : "scale(1)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/></svg>
          </div>
        )}
        {work.isFeatured && <span style={{ position:"absolute", top:12, left:12, display:"inline-flex", alignItems:"center", gap:5, background:"rgba(7,8,15,0.8)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", borderRadius:"100px", padding:"4px 12px", fontSize:"9px", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>✦ Featured</span>}
        {typeof work.views === "number" && <span style={{ position:"absolute", top:12, right:12, background:"rgba(7,8,15,0.75)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", borderRadius:"100px", padding:"4px 12px", fontSize:"11px", fontWeight:600 }}>👁 {work.views.toLocaleString()}</span>}
        {work.category && <span style={{ position:"absolute", bottom:12, left:12, fontSize:"9px", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)" }}>{work.category}</span>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", flex:1, padding:"20px", gap:"10px" }}>
        <div>
          <h2 style={{ fontSize:"15px", fontWeight:700, lineHeight:1.3, color: hov ? accent : "#fff", margin:"0 0 4px", fontFamily:"'Syne',sans-serif", transition:"color 0.3s ease" }}>{work.title}</h2>
          {(work.role || work.duration) && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", margin:0 }}>{[work.role, work.duration].filter(Boolean).join(" · ")}</p>}
        </div>
        {work.shortDescription && <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.45)", lineHeight:1.7, margin:0, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{work.shortDescription}</p>}
        {work.techStack && work.techStack.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
            {work.techStack.slice(0,3).map(tech => <span key={tech} style={{ fontSize:"10px", padding:"3px 9px", borderRadius:"6px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.45)", fontWeight:500 }}>{tech}</span>)}
            {work.techStack.length > 3 && <span style={{ fontSize:"10px", padding:"3px 9px", borderRadius:"6px", background:"transparent", border:"1px dashed rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.25)", fontWeight:500 }}>+{work.techStack.length - 3}</span>}
          </div>
        )}
        {work.industry && <span style={{ display:"inline-block", width:"fit-content", fontSize:"10px", padding:"4px 10px", borderRadius:"100px", background:`${accent}18`, border:`1px solid ${accent}35`, color:accent, fontWeight:600 }}>{work.industry}</span>}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", marginTop:"auto", paddingTop:"4px" }}>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:"11px", fontWeight:700, color:accent, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(8px)", transition:"all 0.3s ease" }}>
            View Case Study
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ work, index }: { work: Work; index: number }) {
  const { grad, glow, accent } = palette(index);
  const [hov, setHov] = useState(false);
  return (
    <Link href={`/work/${work.slug}`}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:"flex", flexDirection:"row", background: hov ? "linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))" : "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))", border: hov ? `1px solid ${accent}45` : "1px solid rgba(255,255,255,0.09)", borderRadius:"24px", overflow:"hidden", textDecoration:"none", transition:"all 0.4s cubic-bezier(.22,.68,0,1.2)", transform: hov ? "translateY(-5px)" : "translateY(0)", boxShadow: hov ? `0 28px 70px rgba(0,0,0,0.55),0 0 0 1px ${accent}20,0 12px 32px ${glow}` : "0 4px 20px rgba(0,0,0,0.25)", position:"relative", backdropFilter:"blur(8px)", cursor:"pointer", minHeight:"260px", width:"100%" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background:grad, transform: hov ? "scaleY(1)" : "scaleY(0)", transformOrigin:"top", transition:"transform 0.45s ease" }} />
      <div className="work-feat-img" style={{ position:"relative", width:"340px", flexShrink:0, overflow:"hidden" }}>
        {work.thumbnail ? (
          <><img src={work.thumbnail} alt={work.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.7s ease", transform: hov ? "scale(1.06)" : "scale(1)" }} /><div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,transparent 60%,rgba(7,8,15,0.7) 100%)" }} /><div style={{ position:"absolute", inset:0, background:grad, opacity: hov ? 0.18 : 0, transition:"opacity 0.5s ease" }} /></>
        ) : (
          <div style={{ width:"100%", height:"100%", background:grad, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="rgba(255,255,255,0.2)"/></svg>
          </div>
        )}
        <div style={{ position:"absolute", top:16, left:16 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(7,8,15,0.8)", backdropFilter:"blur(10px)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", borderRadius:"100px", padding:"5px 14px", fontSize:"9px", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:accent, boxShadow:`0 0 8px ${accent}`, display:"inline-block" }} />Featured
          </span>
        </div>
        {typeof work.views === "number" && <span style={{ position:"absolute", bottom:16, left:16, background:"rgba(7,8,15,0.75)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.65)", borderRadius:"100px", padding:"4px 12px", fontSize:"11px", fontWeight:600 }}>👁 {work.views.toLocaleString()}</span>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:"36px 40px", gap:"14px", flex:1 }}>
        {work.category && <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:".15em", textTransform:"uppercase", color:accent }}>{work.category}</span>}
        <h2 style={{ fontSize:"clamp(20px,2.5vw,26px)", fontWeight:800, lineHeight:1.2, color: hov ? accent : "#fff", margin:0, fontFamily:"'Syne',sans-serif", transition:"color 0.3s ease", letterSpacing:"-0.02em" }}>{work.title}</h2>
        {(work.role || work.duration) && <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", margin:0 }}>{[work.role, work.duration].filter(Boolean).join(" · ")}</p>}
        {work.shortDescription && <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.45)", lineHeight:1.75, margin:0, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{work.shortDescription}</p>}
        {work.techStack && work.techStack.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {work.techStack.slice(0,5).map(tech => <span key={tech} style={{ fontSize:"11px", padding:"4px 12px", borderRadius:"8px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontWeight:500 }}>{tech}</span>)}
            {work.techStack.length > 5 && <span style={{ fontSize:"11px", padding:"4px 12px", borderRadius:"8px", background:"transparent", border:"1px dashed rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.25)" }}>+{work.techStack.length - 5}</span>}
          </div>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"4px" }}>
          {work.industry && <span style={{ fontSize:"11px", padding:"5px 12px", borderRadius:"100px", background:`${accent}15`, border:`1px solid ${accent}30`, color:accent, fontWeight:600 }}>{work.industry}</span>}
          <span style={{ marginLeft:"auto", display:"inline-flex", alignItems:"center", gap: hov ? 10 : 6, fontSize:"12px", fontWeight:700, color:"#fff", padding:"10px 20px", borderRadius:"12px", background:grad, boxShadow: hov ? `0 6px 20px ${glow}` : `0 2px 8px ${glow}60`, transition:"all 0.3s ease" }}>
            Case Study
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionLabel({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
      <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:".15em", textTransform:"uppercase", color: accent ? "#818cf8" : "rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>{children}</span>
      <div style={{ flex:1, height:"1px", background: accent ? "linear-gradient(90deg,rgba(129,140,248,0.35),transparent)" : "linear-gradient(90deg,rgba(255,255,255,0.08),transparent)" }} />
    </div>
  );
}

export default function WorkPage() {
  const [works, setWorks]     = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    api.get("/work").then((res) => setWorks(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  const featured        = works.filter((w) => w.isFeatured);
  const regular         = works.filter((w) => !w.isFeatured);
  const categories      = ["All", ...Array.from(new Set(works.map((w) => w.category).filter(Boolean) as string[]))];
  const filteredRegular = filter === "All" ? regular : regular.filter((w) => w.category === filter);
  const industryCount   = [...new Set(works.map((w) => w.industry).filter(Boolean))].length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .wp{font-family:'DM Sans',sans-serif}
        .wph{font-family:'Syne',sans-serif}
        .work-bg{background:#07080f;min-height:100vh;position:relative;overflow-x:hidden}
        .work-bg::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
        .w-glow{position:fixed;border-radius:50%;pointer-events:none;filter:blur(120px);z-index:0}
        .w-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.25);color:#a5b4fc;border-radius:100px;padding:7px 20px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-family:'DM Sans',sans-serif}
        .w-badge-dot{width:6px;height:6px;border-radius:50%;background:#818cf8;box-shadow:0 0 8px rgba(129,140,248,0.9);animation:wblink 2s ease-in-out infinite}
        @keyframes wblink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}
        .w-stat-val{font-family:'Syne',sans-serif;font-size:2.4rem;font-weight:800;line-height:1;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .w-pill{font-size:11px;font-weight:700;padding:7px 20px;border-radius:100px;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);cursor:pointer;transition:all .22s;font-family:'DM Sans',sans-serif;letter-spacing:.02em;white-space:nowrap}
        .w-pill:hover{border-color:rgba(99,102,241,0.4);color:#a5b4fc;background:rgba(99,102,241,0.08)}
        .w-pill.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);border-color:transparent;color:#fff;box-shadow:0 4px 16px rgba(99,102,241,0.4)}
        @keyframes wskPulse{0%,100%{opacity:.6}50%{opacity:.3}}
        @keyframes wfadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .wfu{animation:wfadeUp .6s ease both}
        .wd1{animation-delay:.05s}.wd2{animation-delay:.15s}.wd3{animation-delay:.25s}.wd4{animation-delay:.4s}
        .wsq{animation:wsqDraw 1.1s ease .65s both;stroke-dasharray:320;stroke-dashoffset:320}
        @keyframes wsqDraw{to{stroke-dashoffset:0}}
        .w-cta{background:linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(139,92,246,0.14) 50%,rgba(79,70,229,0.2) 100%);border:1px solid rgba(99,102,241,0.22);border-radius:28px;padding:80px 40px;text-align:center;position:relative;overflow:hidden;margin-top:88px}
        @media(max-width:640px){.work-feat-card{flex-direction:column !important}.work-feat-img{width:100% !important;height:220px !important}.work-grid{grid-template-columns:1fr !important}.w-cta{padding:50px 22px !important}.w-stats-row{gap:28px !important}}
        @media(min-width:641px) and (max-width:1023px){.work-grid{grid-template-columns:1fr 1fr !important}}
      `}</style>

      <div className="wp work-bg">
        <div className="w-glow" style={{ width:700, height:700, background:"radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 65%)", top:"-220px", left:"-200px" }} />
        <div className="w-glow" style={{ width:600, height:600, background:"radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 65%)", top:"35%", right:"-200px" }} />
        <div className="w-glow" style={{ width:500, height:500, background:"radial-gradient(circle,rgba(59,130,246,0.05) 0%,transparent 65%)", bottom:"-100px", left:"25%" }} />

        <div style={{ position:"relative", zIndex:1, maxWidth:"1200px", margin:"0 auto", padding:"72px 24px" }}>

          {/* ══ HERO ══ */}
          <section style={{ textAlign:"center", marginBottom:"72px" }}>
            <div className="wfu wd1" style={{ marginBottom:"22px" }}>
              <span className="w-badge"><span className="w-badge-dot" />Portfolio</span>
            </div>
            <h1 className="wph wfu wd2" style={{ fontSize:"clamp(38px,6vw,72px)", fontWeight:800, lineHeight:1.06, letterSpacing:"-0.03em", color:"#fff", margin:"0 0 20px" }}>
              Work that{" "}
              <span style={{ position:"relative", display:"inline-block" }}>
                <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", position:"relative", zIndex:1 }}>speaks</span>
                <svg style={{ position:"absolute", bottom:"-6px", left:0, width:"100%", overflow:"visible" }} viewBox="0 0 300 10" fill="none">
                  <path className="wsq" d="M2 7 Q 75 1, 150 6 T 298 4" stroke="url(#wsg)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <defs><linearGradient id="wsg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#c084fc"/></linearGradient></defs>
                </svg>
              </span>{" "}for itself.
            </h1>
            <p className="wfu wd3" style={{ fontSize:17, lineHeight:1.75, color:"rgba(255,255,255,0.42)", maxWidth:520, margin:"0 auto 36px" }}>
              Real-world projects, startups & client solutions — built with{" "}
              <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:500 }}>performance, scalability, and thoughtful design.</span>
            </p>
            {!loading && works.length > 0 && (
              <div className="wfu wd4 w-stats-row" style={{ display:"flex", justifyContent:"center", gap:"56px", flexWrap:"wrap" }}>
                {[
  { label: "Projects", value: works.length * 5 + 3 },
  { label: "Featured", value: featured.length * 5 + 3 },
  { label: "Industries", value: industryCount * 5 + 3 },
].map((s) => (
                  <div key={s.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <span className="w-stat-val">{s.value}</span>
                    <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ══ LOADING ══ */}
          {loading && (
            <div className="work-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ══ EMPTY ══ */}
          {!loading && works.length === 0 && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"100px 0", gap:"18px", textAlign:"center" }}>
              <div style={{ width:80, height:80, borderRadius:"20px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="36" height="36" fill="none" stroke="rgba(255,255,255,0.2)" viewBox="0 0 24 24" strokeWidth="1.4"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
              </div>
              <div>
                <p style={{ color:"rgba(255,255,255,0.5)", fontWeight:600, fontSize:18, margin:0 }}>No projects yet</p>
                <p style={{ color:"rgba(255,255,255,0.2)", fontSize:14, marginTop:4 }}>Check back soon!</p>
              </div>
            </div>
          )}

          {/* ══ FEATURED ══ */}
          {!loading && featured.length > 0 && (
            <section style={{ marginBottom:"56px" }}>
              <SectionLabel accent>Featured Work</SectionLabel>
              <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                {featured.map((work, i) => (
                  <div key={work._id} className="work-feat-card" style={{ display:"flex" }}>
                    <FeaturedCard work={work} index={i} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ ALL PROJECTS ══ */}
          {!loading && regular.length > 0 && (
            <section>
              <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap", marginBottom:"28px" }}>
                <SectionLabel accent={featured.length === 0}>
                  {featured.length > 0 ? "All Projects" : "Projects"}
                </SectionLabel>
                {categories.length > 2 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginLeft:"auto" }}>
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setFilter(cat)} className={`w-pill ${filter === cat ? "on" : ""}`}>{cat}</button>
                    ))}
                  </div>
                )}
              </div>
              {filteredRegular.length === 0 ? (
                <div style={{ textAlign:"center", padding:"72px 0", color:"rgba(255,255,255,0.25)", fontSize:14 }}>No projects in this category.</div>
              ) : (
                <div className="work-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
                  {filteredRegular.map((work, i) => <WorkCard key={work._id} work={work} index={i} />)}
                </div>
              )}
            </section>
          )}

          {/* ══ BOTTOM CTA ══ */}
          {!loading && works.length > 0 && (
            <section className="w-cta">
              <div style={{ position:"absolute", width:320, height:320, borderRadius:"50%", background:"rgba(99,102,241,0.08)", top:"-120px", right:"-80px", pointerEvents:"none" }} />
              <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"rgba(139,92,246,0.06)", bottom:"-160px", left:"-100px", pointerEvents:"none" }} />
              <div style={{ position:"absolute", inset:0, opacity:.04, backgroundImage:"radial-gradient(rgba(255,255,255,0.7) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:520, margin:"0 auto" }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"rgba(165,180,252,0.6)", marginBottom:16 }}>Let&apos;s Collaborate</p>
                <h2 className="wph" style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, color:"#fff", lineHeight:1.15, marginBottom:14, letterSpacing:"-0.02em" }}>
                  Have a project{" "}
                  <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>in mind?</span>
                </h2>
                <p style={{ color:"rgba(165,180,252,0.55)", fontSize:15, lineHeight:1.75, marginBottom:36 }}>Let&apos;s build something great together — from idea to launch.</p>
                <Link href="/contact"
                  style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#fff", color:"#4f46e5", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, padding:"14px 32px", borderRadius:"14px", textDecoration:"none", boxShadow:"0 4px 24px rgba(99,102,241,0.35)", transition:"transform .25s,box-shadow .25s" }}
                  onMouseOver={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 10px 36px rgba(99,102,241,0.5)"; }}
                  onMouseOut={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform=""; el.style.boxShadow="0 4px 24px rgba(99,102,241,0.35)"; }}
                >
                  Start a Conversation
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#4f46e5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}