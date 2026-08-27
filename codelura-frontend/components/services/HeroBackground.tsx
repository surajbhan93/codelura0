"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Dark blue / midnight bands only ── */
    const bands = [
      { r: 15,  g: 30,  b: 80,  offset: 0.0, speed: 0.8,  amp: 0.18, yBase: 0.35 },
      { r: 8,   g: 20,  b: 60,  offset: 2.1, speed: 0.55, amp: 0.14, yBase: 0.52 },
      { r: 20,  g: 40,  b: 100, offset: 4.2, speed: 1.0,  amp: 0.16, yBase: 0.62 },
      { r: 10,  g: 25,  b: 70,  offset: 1.5, speed: 0.70, amp: 0.12, yBase: 0.28 },
      { r: 5,   g: 15,  b: 55,  offset: 3.3, speed: 0.50, amp: 0.10, yBase: 0.74 },
    ];

    const drawFrame = () => {
      t += 0.004;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const b of bands) {
        const yCenter = H * b.yBase + Math.sin(t * b.speed + b.offset) * H * b.amp;
        const bandH = H * 0.4;

        ctx.beginPath();
        ctx.moveTo(0, yCenter - bandH);
        for (let x = 0; x <= W; x += 4) {
          const wavY =
            yCenter +
            Math.sin((x / W) * Math.PI * 3 + t * b.speed * 1.8 + b.offset) * (bandH * 0.35) +
            Math.sin((x / W) * Math.PI * 1.4 + t * b.speed * 0.6 + b.offset * 2) * (bandH * 0.15);
          ctx.lineTo(x, wavY);
        }
        ctx.lineTo(W, yCenter + bandH * 1.2);
        ctx.lineTo(0, yCenter + bandH * 1.2);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yCenter - bandH, 0, yCenter + bandH);
        grad.addColorStop(0,    `rgba(${b.r},${b.g},${b.b},0)`);
        grad.addColorStop(0.35, `rgba(${b.r},${b.g},${b.b},0.28)`);
        grad.addColorStop(0.5,  `rgba(${b.r},${b.g},${b.b},0.45)`);
        grad.addColorStop(0.65, `rgba(${b.r},${b.g},${b.b},0.25)`);
        grad.addColorStop(1,    `rgba(${b.r},${b.g},${b.b},0)`);

        ctx.fillStyle = grad;
        ctx.fill();
      }

      /* Subtle shimmer line — dark electric blue */
      const shimY = H * 0.45 + Math.sin(t * 0.7) * H * 0.08;
      const shimGrad = ctx.createLinearGradient(0, 0, W, 0);
      shimGrad.addColorStop(0,    "rgba(255,255,255,0)");
      shimGrad.addColorStop(0.35, "rgba(30,80,200,0.18)");
      shimGrad.addColorStop(0.5,  "rgba(50,100,255,0.28)");
      shimGrad.addColorStop(0.65, "rgba(30,80,200,0.18)");
      shimGrad.addColorStop(1,    "rgba(255,255,255,0)");
      ctx.fillStyle = shimGrad;
      ctx.fillRect(0, shimY - 1.5, W, 3);

      animId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes orb-float-1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%     { transform: translate(40px,-50px) scale(1.07); }
          66%     { transform: translate(-30px,30px) scale(0.95); }
        }
        @keyframes orb-float-2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%     { transform: translate(-55px,45px) scale(1.12); }
          70%     { transform: translate(35px,-35px) scale(0.92); }
        }
        @keyframes grain-shift {
          0%,100% { transform: translate(0,0); }
          20% { transform: translate(-1.5%,-1%); }
          40% { transform: translate(1%,-1.5%); }
          60% { transform: translate(-1%,1.5%); }
          80% { transform: translate(1.5%,1%); }
        }
      `}</style>

      {/* ── Canvas aurora waves ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.85 }}
      />

      {/* ── Orb 1 — deep navy, top-left ── */}
      <div style={{
        position: "absolute", top: "-10%", left: "-8%",
        width: "55vw", height: "55vw", maxWidth: "750px", maxHeight: "750px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, rgba(20,40,120,0.55) 0%, rgba(10,20,70,0.25) 50%, transparent 70%)",
        filter: "blur(90px)",
        animation: "orb-float-1 20s ease-in-out infinite",
      }} />

      {/* ── Orb 2 — midnight blue, top-right ── */}
      <div style={{
        position: "absolute", top: "-18%", right: "-10%",
        width: "48vw", height: "48vw", maxWidth: "680px", maxHeight: "680px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 60% 40%, rgba(15,35,110,0.50) 0%, rgba(8,18,65,0.22) 50%, transparent 70%)",
        filter: "blur(85px)",
        animation: "orb-float-2 24s ease-in-out infinite",
      }} />

      {/* ── Orb 3 — dark blue-grey, bottom ── */}
      <div style={{
        position: "absolute", bottom: "-8%", left: "28%",
        width: "44vw", height: "44vw", maxWidth: "620px", maxHeight: "620px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 60%, rgba(12,25,80,0.45) 0%, rgba(6,12,45,0.20) 50%, transparent 70%)",
        filter: "blur(95px)",
        animation: "orb-float-1 17s ease-in-out infinite 4s",
      }} />

      {/* ── Dot grid ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* ── Film grain ── */}
      <svg style={{
        position: "absolute", top: "-50%", left: "-50%",
        width: "200%", height: "200%",
        opacity: 0.04,
        animation: "grain-shift 0.85s steps(1) infinite",
      }}>
        <filter id="hbg-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hbg-noise)" />
      </svg>

      {/* ── Dark vignette — text readability ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,0,8,0.05) 0%, rgba(0,0,8,0.72) 100%)",
      }} />
    </div>
  );
}
