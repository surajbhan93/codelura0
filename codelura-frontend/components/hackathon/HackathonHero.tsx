"use client";

import { useEffect, useRef, useState } from "react";

const FLOATING_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  dur: Math.random() * 12 + 8,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.4 + 0.1,
}));

const STATS = [
  { value: "₹5L+", label: "Total Prize Pool" },
  { value: "12K+", label: "Participants" },
  { value: "40+", label: "Hackathons Hosted" },
  { value: "98%", label: "Satisfaction Rate" },
];

const TRACKS = ["AI & ML", "Web3", "FinTech", "HealthTech", "Open Innovation", "EdTech", "ClimaTech", "Cybersecurity"];

export default function HackathonHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTrack, setActiveTrack] = useState(0);
  const [mounted, setMounted] = useState(false);

 useEffect(() => {
  const raf = requestAnimationFrame(() => setMounted(true));

  const interval = setInterval(() => {
    setActiveTrack((p) => (p + 1) % TRACKS.length);
  }, 2200);

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(interval);
  };
}, []);

  // Animated grid canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = 18, rows = 10;
      const cw = canvas.width / cols, ch = canvas.height / rows;

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const wave = Math.sin(t * 0.6 + c * 0.5 + r * 0.4) * 0.5 + 0.5;
          const alpha = wave * 0.12 + 0.03;
          ctx.fillStyle = `rgba(139,92,246,${alpha})`;
          ctx.beginPath();
          ctx.arc(c * cw, r * ch, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Horizontal lines
      for (let r = 0; r <= rows; r++) {
        const wave = Math.sin(t * 0.4 + r * 0.7) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(139,92,246,${wave * 0.07 + 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, r * ch);
        ctx.lineTo(canvas.width, r * ch);
        ctx.stroke();
      }
      // Vertical lines
      for (let c = 0; c <= cols; c++) {
        const wave = Math.sin(t * 0.4 + c * 0.5) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(139,92,246,${wave * 0.07 + 0.02})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(c * cw, 0);
        ctx.lineTo(c * cw, canvas.height);
        ctx.stroke();
      }

      t += 0.02;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .hero-root {
          position: relative;
          min-height: 100vh;
          background: #06060f;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px 14px 70px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Noise texture overlay ── */
        .hero-root::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.6;
        }

        /* ── Deep purple orbs ── */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 70%);
          top: -150px; left: -100px; animation: orb-drift1 18s ease-in-out infinite;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
          top: 10%; right: -80px; animation: orb-drift2 22s ease-in-out infinite;
        }
        .orb-3 {
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%);
          bottom: -100px; left: 20%; animation: orb-drift3 16s ease-in-out infinite;
        }
        @keyframes orb-drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,40px)} }
        @keyframes orb-drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,60px)} }
        @keyframes orb-drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-50px)} }

        /* ── Particles ── */
        .particle {
          position: absolute; border-radius: 50%;
          background: rgba(167,139,250,0.6);
          animation: float-up linear infinite;
          pointer-events: none;
        }
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: var(--op); }
          50%  { transform: translateY(-40px) scale(1.2); }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }

        /* ── Badge ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 18px; border-radius: 99px;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.3);
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #a78bfa;
          margin-bottom: 28px;
          animation: fade-down 0.7s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #a78bfa;
          animation: badge-pulse 1.8s ease-in-out infinite;
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.5); }
          50%      { box-shadow: 0 0 0 5px rgba(167,139,250,0); }
        }

        /* ── Headline ── */
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 9vw, 7.5rem);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #fff;
          text-align: center;
          margin-bottom: 10px;
          animation: fade-down 0.7s 0.1s ease both;
        }
        .hero-headline .grad {
          background: linear-gradient(135deg, #c4b5fd 0%, #818cf8 35%, #38bdf8 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-headline .outline {
          -webkit-text-stroke: 2px rgba(255,255,255,0.15);
          color: transparent;
        }

        /* ── Rotating track pill ── */
        .track-pill-wrap {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.4);
          margin: 18px 0 30px; animation: fade-down 0.7s 0.2s ease both;
        }
        .track-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 16px; border-radius: 99px;
          background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2);
          color: #7dd3fc; font-weight: 700; font-size: 13px;
          animation: pill-in 0.4s cubic-bezier(.22,.68,0,1.4) both;
          white-space: nowrap;
        }
        @keyframes pill-in {
          from { opacity: 0; transform: translateY(8px) scale(0.92); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Sub-text ── */
        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(255,255,255,0.38); max-width: 540px;
          text-align: center; line-height: 1.65; font-weight: 400;
          margin-bottom: 48px; animation: fade-down 0.7s 0.3s ease both;
        }
        .hero-sub strong { color: rgba(255,255,255,0.7); font-weight: 600; }

        /* ── CTA buttons ── */
        .cta-row {
          display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
          animation: fade-down 0.7s 0.4s ease both; margin-bottom: 72px;
        }
        .btn-primary {
          position: relative; overflow: hidden;
          padding: 16px 36px; border-radius: 16px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          color: #fff; font-weight: 700; font-size: 15px;
          border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(124,58,237,0.4);
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, #9333ea, #4f46e5);
          opacity: 0; transition: opacity 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(124,58,237,0.5); }
        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:active { transform: scale(0.97); }
        .btn-primary span { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; }

        .btn-secondary {
          padding: 16px 36px; border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8); font-weight: 600; font-size: 15px;
          cursor: pointer; transition: all 0.2s; backdrop-filter: blur(8px);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          color: #fff; transform: translateY(-2px);
        }
        .btn-secondary:active { transform: scale(0.97); }

        /* ── Stats bar ── */
        .stats-bar {
          display: flex; flex-wrap: wrap; justify-content: center; gap: 2px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 6px; max-width: 700px; width: 100%;
          animation: fade-up 0.7s 0.55s ease both;
        }
        .stat-item {
          flex: 1; min-width: 130px; display: flex; flex-direction: column;
          align-items: center; padding: 18px 16px; border-radius: 18px;
          transition: background 0.2s;
        }
        .stat-item:hover { background: rgba(139,92,246,0.08); }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.9rem; font-weight: 800;
          background: linear-gradient(135deg, #e2d9f3, #a5b4fc);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; line-height: 1;
        }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 600; margin-top: 5px; letter-spacing: 0.05em; text-transform: uppercase; }
        .stat-sep { width: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; align-self: stretch; }

        /* ── Scroll hint ── */
        .scroll-hint {
          position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); animation: fade-up 1s 1s ease both;
        }
        .scroll-arrow {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          animation: bounce-soft 2s ease-in-out infinite;
        }
        @keyframes bounce-soft {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(5px); }
        }

        /* ── Common animations ── */
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 640px) {
          .hero-root { padding: 120px 16px 60px; }
          .stats-bar { border-radius: 18px; }
          .stat-item { min-width: 100px; padding: 14px 10px; }
          .stat-value { font-size: 1.5rem; }
          .btn-primary, .btn-secondary { padding: 14px 26px; font-size: 14px; }
        }
      `}</style>

      <section className="hero-root" id="hackathon-hero">
        {/* ── Background canvas grid ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        {/* ── Orbs ── */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* ── Floating particles ── */}
        {mounted && FLOATING_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              "--op": p.opacity,
            } as React.CSSProperties}
          />
        ))}

        {/* ── Content ── */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-dot" />
            Codelura Hackathons
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            <span className="grad">Build.</span>{" "}
            <span className="outline">Compete.</span>
            <br />
            <span className="grad">Win.</span>
          </h1>

          {/* Rotating track pill */}
          <div className="track-pill-wrap">
            <span>Tracks include</span>
            {mounted && (
              <span key={activeTrack} className="track-pill">
                ⚡ {TRACKS[activeTrack]}
              </span>
            )}
          </div>

          {/* Sub-text */}
          <p className="hero-sub">
            The next generation of tech challenges — where <strong>builders compete</strong>,{" "}
            <strong>ideas ship fast</strong>, and the best solutions win{" "}
            <strong>real prizes</strong>.
          </p>

          {/* CTAs */}
          <div className="cta-row">
            <button
              className="btn-primary"
              onClick={() => document.getElementById("hackathon-tabs")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Explore Hackathons
              </span>
            </button>
            <button className="btn-secondary">
              🚀 Host Your Own
            </button>
          </div>

          {/* Stats bar */}
          <div className="stats-bar">
            {STATS.map((s, i) => (
              <>
                <div key={s.label} className="stat-item">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                {i < STATS.length - 1 && <div key={`sep-${i}`} className="stat-sep" />}
              </>
            ))}
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-arrow">
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}