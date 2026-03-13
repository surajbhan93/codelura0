"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import PremiumCard from "@/components/premium/PremiumCard";
import Link from "next/link";
/* ===============================
   PLAN TYPE
================================ */
type PremiumPlan = {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  features: string[];
};

type Testimonial = {
  _id: string;
  name: string;
  message: string;
  rating: number;
  profileImage?: string;
  category: string;
  createdAt: string;
};

/* ===============================
   SKELETON CARD
================================ */
function SkeletonCard() {
  return (
    <div className="premium-skeleton">
      <div className="skeleton-shimmer" />
    </div>
  );
}

/* ===============================
   MAIN PAGE
================================ */
export default function PremiumPage() {
  const [plans, setPlans] = useState<PremiumPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await api.get("/premium/plans");
      setPlans(res.data.plans || []);
      setLoading(false);
      // Slight delay so cards animate after skeleton fades
      setTimeout(() => setVisible(true), 80);
    };

    fetchPlans();

    // Trigger header animations immediately
    const header = document.querySelector(".premium-header");
    if (header) header.classList.add("animate-in");
  }, []);


  useEffect(() => {
  api.get("/testimonial/membership")
    .then((res) => {
      setTestimonials(res.data.data);
    })
    .catch((err) => {
      console.error("Testimonial fetch error:", err);
    });
}, []);

  return (
    <>
      {/* ── Global Styles ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --gold:    #c9a84c;
          --gold-lt: #e8cc80;
          --ink:     #0b0c10;
          --ink-2:   #13151c;
          --ink-3:   #1c1f2a;
          --border:  rgba(201,168,76,0.18);
          --text:    #e8e6e0;
          --muted:   #7a7870;
        }

        .premium-page {
          min-height: 100vh;
          background: var(--ink);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow-x: hidden;
          position: relative;
        }

        /* ── Noise grain overlay ── */
        .premium-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── Radial glow behind content ── */
        .bg-glow {
          position: fixed;
          top: -30%;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Inner container ── */
        .premium-inner {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 32px 100px;
        }

        /* ── Header ── */
        .premium-header {
          text-align: center;
          margin-bottom: 72px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .premium-header.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .eyebrow::before,
        .eyebrow::after {
          content: '';
          display: block;
          width: 36px;
          height: 1px;
          background: var(--gold);
          opacity: 0.5;
        }

        .premium-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.01em;
          color: #fff;
          margin: 0 0 20px;
        }
        .premium-title em {
          font-style: italic;
          color: var(--gold-lt);
        }

        .premium-subtitle {
          font-size: 15px;
          font-weight: 300;
          color: var(--muted);
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* ── Gold rule ── */
        .gold-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 28px auto 0;
        }

        /* ── Grid ── */
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        /* ── Card reveal animation ── */
        .card-wrapper {
          opacity: 0;
          transform: translateY(36px) scale(0.97);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .card-wrapper.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .card-wrapper:nth-child(1) { transition-delay: 0.05s; }
        .card-wrapper:nth-child(2) { transition-delay: 0.15s; }
        .card-wrapper:nth-child(3) { transition-delay: 0.25s; }
        .card-wrapper:nth-child(4) { transition-delay: 0.35s; }
        .card-wrapper:nth-child(5) { transition-delay: 0.45s; }
        .card-wrapper:nth-child(6) { transition-delay: 0.55s; }

        /* ── Skeleton ── */
        .premium-skeleton {
          height: 380px;
          border-radius: 16px;
          background: var(--ink-3);
          border: 1px solid var(--border);
          overflow: hidden;
          position: relative;
        }
        .skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(201,168,76,0.06) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Decorative corner marks ── */
        .corner-mark {
          position: absolute;
          width: 16px;
          height: 16px;
          opacity: 0.3;
        }
        .corner-mark.tl { top: 40px; left: 40px; border-top: 1px solid var(--gold); border-left: 1px solid var(--gold); }
        .corner-mark.tr { top: 40px; right: 40px; border-top: 1px solid var(--gold); border-right: 1px solid var(--gold); }
        .corner-mark.bl { bottom: 40px; left: 40px; border-bottom: 1px solid var(--gold); border-left: 1px solid var(--gold); }
        .corner-mark.br { bottom: 40px; right: 40px; border-bottom: 1px solid var(--gold); border-right: 1px solid var(--gold); }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--muted);
          font-size: 14px;
          opacity: 0;
          animation: fadeIn 0.5s 0.2s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .premium-inner { padding: 60px 20px 80px; }
          .corner-mark { display: none; }
        }
      `}</style>

      {/* ── Page ──────────────────────────────────────────── */}
      <div className="premium-page">
        <div className="bg-glow" />

        {/* Decorative corners */}
        <div className="corner-mark tl" />
        <div className="corner-mark tr" />
        <div className="corner-mark bl" />
        <div className="corner-mark br" />

        <div className="premium-inner">

          {/* ── Header ── */}
          <header className="premium-header animate-in">
            <p className="eyebrow">Membership</p>
            <h1 className="premium-title">
              Choose Your <em>Plan</em>
            </h1>
            <p className="premium-subtitle">
              Unlock the full experience. Every plan is crafted to give you exactly what you need — nothing more, nothing less.
            </p>
            <div className="gold-rule" />
          </header>

          {/* ── Plans Grid ── */}
          <div className="plans-grid" ref={gridRef}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : plans.length === 0
              ? (
                  <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
                    No plans available at the moment. Please check back soon.
                  </div>
                )
              : plans.map((plan, i) => (
                  <div
                    key={plan._id}
                    className={`card-wrapper ${visible ? "visible" : ""}`}
                  >
                    <PremiumCard plan={plan} />
                  </div>
                ))
            }
          </div>

        </div>



        {/* ══ PREMIUM TESTIMONIALS ══ */}
{testimonials.length > 0 && (
  <section style={{ marginTop: "96px", position: "relative", padding: "0 0 48px" }}>

    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap');

      .testi-section { font-family: 'DM Sans', sans-serif; }

      /* ── ambient orbs ── */
      .testi-orb {
        position: absolute; border-radius: 50%;
        pointer-events: none; filter: blur(80px); z-index: 0;
      }

      /* ── pill badge ── */
      .testi-pill {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, rgba(251,146,60,0.12), rgba(251,191,36,0.08));
        border: 1px solid rgba(251,146,60,0.25);
        color: #f97316; border-radius: 100px;
        padding: 6px 18px; font-size: 10.5px; font-weight: 700;
        letter-spacing: .1em; text-transform: uppercase;
        font-family: 'DM Sans', sans-serif;
      }
      .testi-pill-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: #f97316;
        box-shadow: 0 0 8px rgba(249,115,22,0.8);
        animation: tpulse 2s ease-in-out infinite;
      }
      @keyframes tpulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.75); }
      }

      /* ── card ── */
      .testi-card {
        position: relative;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid rgba(0,0,0,0.06);
        padding: 28px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.05), 0 0 0 0 rgba(249,115,22,0);
        transition: transform 0.35s cubic-bezier(.22,.68,0,1.2),
                    box-shadow 0.35s ease,
                    border-color 0.3s ease;
        overflow: hidden;
        display: flex; flex-direction: column; gap: 18px;
        cursor: default;
      }
      .testi-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, #f97316, #fbbf24, #f97316);
        background-size: 200% auto;
        opacity: 0;
        transition: opacity 0.3s ease;
        animation: shimmer 2.5s linear infinite paused;
      }
      .testi-card:hover::before { opacity: 1; animation-play-state: running; }
      @keyframes shimmer { to { background-position: 200% center; } }

      .testi-card:hover {
        transform: translateY(-6px) scale(1.01);
        box-shadow: 0 20px 50px rgba(249,115,22,0.12), 0 8px 20px rgba(0,0,0,0.08);
        border-color: rgba(249,115,22,0.2);
      }

      /* ── giant decorative quote ── */
      .testi-quote-bg {
        position: absolute; top: 12px; right: 16px;
        font-size: 100px; line-height: 1;
        font-family: 'Playfair Display', Georgia, serif;
        color: rgba(249,115,22,0.07);
        pointer-events: none; user-select: none;
        font-weight: 700; transition: color 0.3s ease;
      }
      .testi-card:hover .testi-quote-bg { color: rgba(249,115,22,0.13); }

      /* ── avatar ── */
      .testi-avatar {
        width: 46px; height: 46px; border-radius: 50%;
        border: 2px solid rgba(249,115,22,0.2);
        object-fit: cover; flex-shrink: 0;
        transition: border-color 0.3s ease, transform 0.3s ease;
      }
      .testi-card:hover .testi-avatar { border-color: rgba(249,115,22,0.5); transform: scale(1.05); }

      .testi-avatar-fallback {
        width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
        background: linear-gradient(135deg, #f97316, #fbbf24);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-weight: 700; font-size: 17px;
        font-family: 'DM Sans', sans-serif;
        box-shadow: 0 4px 12px rgba(249,115,22,0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .testi-card:hover .testi-avatar-fallback {
        transform: scale(1.05);
        box-shadow: 0 6px 18px rgba(249,115,22,0.4);
      }

      /* ── stars ── */
      .testi-star { font-size: 13px; transition: transform 0.2s ease; }
      .testi-star.filled { color: #fbbf24; }
      .testi-star.empty  { color: #e5e7eb; }
      .testi-card:hover .testi-star.filled { transform: scale(1.15); }

      /* ── verified chip ── */
      .testi-verified {
        display: inline-flex; align-items: center; gap: 4px;
        background: rgba(249,115,22,0.07);
        border: 1px solid rgba(249,115,22,0.18);
        color: #f97316; border-radius: 100px;
        padding: 3px 10px; font-size: 10px; font-weight: 600;
        letter-spacing: .04em; text-transform: uppercase;
        font-family: 'DM Sans', sans-serif;
      }

      /* ── divider ── */
      .testi-divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,0,0,0.07), transparent);
      }

      /* ── view all button ── */
      .testi-btn {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, #f97316, #fbbf24);
        color: #fff; border: none; border-radius: 100px;
        padding: 13px 32px; font-size: 14px; font-weight: 600;
        text-decoration: none; font-family: 'DM Sans', sans-serif;
        box-shadow: 0 4px 20px rgba(249,115,22,0.35);
        transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.2s;
        white-space: nowrap;
      }
      .testi-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(249,115,22,0.45);
        opacity: 0.93;
      }
      .testi-btn svg { transition: transform 0.25s ease; }
      .testi-btn:hover svg { transform: translateX(3px); }

      /* ── stagger animation ── */
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .testi-card-anim {
        opacity: 0;
        animation: fadeSlideUp 0.55s cubic-bezier(.22,.68,0,1.1) forwards;
      }
      .testi-card-anim:nth-child(1) { animation-delay: 0.05s; }
      .testi-card-anim:nth-child(2) { animation-delay: 0.15s; }
      .testi-card-anim:nth-child(3) { animation-delay: 0.25s; }

      @media (max-width: 768px) {
        .testi-grid { grid-template-columns: 1fr !important; }
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        .testi-grid { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>

    <div className="testi-section" style={{ position: "relative" }}>

      {/* ambient orbs */}
      <div className="testi-orb" style={{ width: 500, height: 250, background: "rgba(251,146,60,0.08)", top: "-60px", left: "50%", transform: "translateX(-50%)" }} />
      <div className="testi-orb" style={{ width: 200, height: 200, background: "rgba(251,191,36,0.06)", top: "20%", right: "-5%" }} />
      <div className="testi-orb" style={{ width: 160, height: 160, background: "rgba(249,115,22,0.05)", bottom: "10%", left: "-3%" }} />

      {/* ── heading ── */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: "56px", zIndex: 1 }}>

        <span className="testi-pill">
          <span className="testi-pill-dot" />
          Student Reviews
        </span>

        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(30px, 4vw, 46px)",
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          margin: "16px 0 10px",
        }}>
          What Students{" "}
          <em style={{ color: "#f97316", fontStyle: "italic" }}>Say</em>{" "}
          <span style={{ fontSize: "0.85em" }}>💬</span>
        </h2>

        <p style={{
          color: "#9ca3af",
          fontSize: "14px",
          maxWidth: "380px",
          margin: "0 auto",
          lineHeight: 1.7,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Honest experiences from real students who used our materials.
        </p>

        {/* subtle underline accent */}
        <div style={{
          width: 48, height: 3,
          background: "linear-gradient(90deg, #f97316, #fbbf24)",
          borderRadius: 100,
          margin: "16px auto 0",
        }} />
      </div>

      {/* ── cards grid ── */}
      <div
        className="testi-grid"
        style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {testimonials.slice(0, 3).map((t, idx) => (
          <div key={t._id} className="testi-card testi-card-anim">

            {/* shimmer bar (shown on hover via CSS) */}
            {/* decorative bg quote */}
            <span className="testi-quote-bg">&ldquo;</span>

            {/* ── author row ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>

              {t.profileImage ? (
                <img src={t.profileImage} alt={t.name} className="testi-avatar" />
              ) : (
                <div className="testi-avatar-fallback">
                  {t.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{
                  fontWeight: 600, fontSize: "14px", color: "#111827",
                  margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {t.name}
                </h3>

                {/* stars */}
                <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`testi-star ${s <= t.rating ? "filled" : "empty"}`}>★</span>
                  ))}
                  <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 700, marginLeft: "4px" }}>
                    {t.rating}.0
                  </span>
                </div>
              </div>

              <span className="testi-verified" style={{ flexShrink: 0 }}>
                ✦ Verified
              </span>
            </div>

            {/* divider */}
            <div className="testi-divider" />

            {/* message */}
            <p style={{
              color: "#6b7280",
              fontSize: "13.5px",
              lineHeight: 1.78,
              fontStyle: "italic",
              flex: 1,
              position: "relative",
              fontFamily: "'DM Sans', sans-serif",
              margin: 0,
            }}>
              {t.message}
            </p>

          </div>
        ))}
      </div>

      {/* ── view all ── */}
      {testimonials.length > 3 && (
        <div style={{ textAlign: "center", marginTop: "48px", position: "relative", zIndex: 1 }}>
          <Link href="/testimonial/membership" className="testi-btn">
            View All Reviews
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      )}

    </div>
  </section>
)}

      </div>



    </>
  );
}