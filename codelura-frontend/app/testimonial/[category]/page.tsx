"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Image from "next/image";

interface Testimonial {
  _id: string;
  name: string;
  message: string;
  rating: number;
  profileImage?: string;
  createdAt: string;
}

export default function TestimonialPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;

  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get(`/testimonial/${category}`);
        setData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [category]);

  const avgRating =
    data.length > 0
      ? (data.reduce((sum, t) => sum + t.rating, 0) / data.length).toFixed(1)
      : null;

  const categoryEmojis: Record<string, string> = {
    webservice: "🌐", material: "📦", referral: "🤝",
    jobs: "💼", membership: "🎖️", hackathon: "⚡", general: "💬",
  };
  const emoji = categoryEmojis[category] || "💬";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');


        .t-page {
          min-height: 100vh; background: #09090f;
          font-family: 'DM Sans', sans-serif; color: #fff;
          position: relative; overflow-x: hidden;
        }

        /* BG orbs */
        .orb {
          position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .orb-1 { width: 600px; height: 600px; top: -180px; left: -180px;
          background: radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 65%); }
        .orb-2 { width: 400px; height: 400px; bottom: -100px; right: -100px;
          background: radial-gradient(circle, rgba(255,200,80,0.08) 0%, transparent 65%); }
        .orb-3 { width: 300px; height: 300px; top: 40%; left: 55%;
          background: radial-gradient(circle, rgba(100,80,255,0.05) 0%, transparent 65%); }

        /* Grid bg */
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .t-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 64px 24px 80px;
        }

        /* ── HEADER ── */
        .t-header { margin-bottom: 56px; }

        .t-breadcrumb {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .t-breadcrumb span { color: rgba(255,107,53,0.7); }

        .t-title-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 20px; margin-bottom: 24px;
        }
        .t-title-left {}
        .t-cat-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.22);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; color: rgba(255,107,53,0.85); font-weight: 500;
          letter-spacing: 0.05em; margin-bottom: 12px;
        }
        .t-cat-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b35;
          animation: blink 2s ease-in-out infinite; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.4} }

        .t-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 4vw, 44px); font-weight: 700;
          color: #fff; line-height: 1.15;
        }
        .t-title em { font-style: italic; color: #ff6b35; }

        /* Stats row */
        .t-stats {
          display: flex; align-items: center; gap: 32px; flex-wrap: wrap;
        }
        .t-stat { display: flex; flex-direction: column; }
        .t-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700; color: #fff; line-height: 1;
        }
        .t-stat-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; letter-spacing: 0.05em; }
        .t-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.08); }

        .t-avg-stars { display: flex; align-items: center; gap: 3px; margin-top: 4px; }
        .t-avg-star { font-size: 13px; }

        /* ── LOADING ── */
        .t-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 40vh; gap: 16px;
        }
        .t-spinner {
          width: 40px; height: 40px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.08);
          border-top-color: #ff6b35;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .t-loading-text { font-size: 14px; color: rgba(255,255,255,0.3); }

        /* ── EMPTY ── */
        .t-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; min-height: 40vh; gap: 12px; text-align: center;
        }
        .t-empty-icon {
          font-size: 48px; margin-bottom: 8px;
          filter: grayscale(0.3) opacity(0.6);
        }
        .t-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; color: rgba(255,255,255,0.5);
        }
        .t-empty-sub { font-size: 14px; color: rgba(255,255,255,0.25); max-width: 280px; line-height: 1.6; }

        /* ── GRID ── */
        .t-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        /* ── CARD ── */
        .t-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px;
          transition: all 0.25s ease;
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; gap: 16px;
        }
        .t-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.04) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .t-card:hover {
          border-color: rgba(255,107,53,0.25);
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.1);
        }
        .t-card:hover::before { opacity: 1; }

        /* card top accent line */
        .t-card-accent {
          position: absolute; top: 0; left: 28px; right: 28px; height: 2px;
          background: linear-gradient(90deg, #ff6b35, #ffc850, transparent);
          border-radius: 0 0 4px 4px; opacity: 0;
          transition: opacity 0.25s ease;
        }
        .t-card:hover .t-card-accent { opacity: 1; }

        /* quote mark */
        .t-quote-mark {
          position: absolute; top: 20px; right: 24px;
          font-family: 'Playfair Display', serif;
          font-size: 64px; line-height: 1; color: rgba(255,107,53,0.08);
          font-weight: 700; pointer-events: none; user-select: none;
        }

        /* author row */
        .t-author { display: flex; align-items: center; gap: 12px; }
        .t-avatar-wrap { position: relative; flex-shrink: 0; }
        .t-avatar-img {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2px solid rgba(255,107,53,0.35);
          object-fit: cover; display: block;
        }
        .t-avatar-fallback {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,53,0.3), rgba(255,200,80,0.3));
          border: 2px solid rgba(255,107,53,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.7);
          flex-shrink: 0;
        }
        .t-author-info {}
        .t-author-name { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .t-author-date { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 2px; }

        /* stars */
        .t-stars { display: flex; align-items: center; gap: 3px; }
        .t-star { font-size: 13px; }
        .t-star-empty { font-size: 13px; opacity: 0.2; }
        .t-rating-num { font-size: 12px; font-weight: 600; color: rgba(255,200,80,0.8); margin-left: 6px; }

        /* message */
        .t-message {
          font-size: 14px; color: rgba(255,255,255,0.55);
          line-height: 1.75; flex: 1;
          font-style: italic;
        }

        /* verified badge */
        .t-verified {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; color: rgba(255,107,53,0.6);
          margin-left: auto;
        }

        /* divider inside card */
        .t-card-divider {
          height: 1px; background: rgba(255,255,255,0.06);
        }

        @media (max-width: 600px) {
          .t-inner { padding: 40px 16px 60px; }
          .t-title-row { flex-direction: column; align-items: flex-start; }
          .t-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="t-page">
        <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        <div className="grid-bg" />

        <div className="t-inner">
          {/* ── HEADER ── */}
          <div className="t-header">
            <div className="t-breadcrumb">
              Testimonials <span>/</span> {category}
            </div>

            <div className="t-title-row">
              <div className="t-title-left">
                <div className="t-cat-badge">
                  <span className="t-cat-dot" />
                  {emoji} {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <h1 className="t-title">
                  What people say about <em>{category}</em>
                </h1>
              </div>
            </div>

            {!loading && data.length > 0 && (
              <div className="t-stats">
                <div className="t-stat">
                  <span className="t-stat-val">{data.length}</span>
                  <span className="t-stat-label">Total Reviews</span>
                </div>
                <div className="t-stat-divider" />
                <div className="t-stat">
                  <span className="t-stat-val">{avgRating}★</span>
                  <span className="t-stat-label">Avg. Rating</span>
                </div>
                <div className="t-stat-divider" />
                <div className="t-stat">
                  <span className="t-stat-val">
                    {data.filter((t) => t.rating === 5).length}
                  </span>
                  <span className="t-stat-label">5-Star Reviews</span>
                </div>
              </div>
            )}
          </div>

          {/* ── STATES ── */}
          {loading && (
            <div className="t-loading">
              <div className="t-spinner" />
              <span className="t-loading-text">Fetching testimonials…</span>
            </div>
          )}

          {!loading && data.length === 0 && (
            <div className="t-empty">
              <div className="t-empty-icon">{emoji}</div>
              <div className="t-empty-title">No reviews yet</div>
              <div className="t-empty-sub">
                Be the first to share your experience in the{" "}
                <strong>{category}</strong> category.
              </div>
            </div>
          )}

          {/* ── CARDS ── */}
          {!loading && data.length > 0 && (
            <div className="t-grid">
              {data.map((item) => (
                <div className="t-card" key={item._id}>
                  <div className="t-card-accent" />
                  <div className="t-quote-mark"></div>

                  {/* Author */}
                  <div className="t-author">
                    {item.profileImage ? (
                      <div className="t-avatar-wrap">
                        <Image
                          src={item.profileImage}
                          alt={item.name}
                          width={44} height={44}
                          className="t-avatar-img"
                        />
                      </div>
                    ) : (
                      <div className="t-avatar-fallback">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="t-author-info">
                      <div className="t-author-name">{item.name}</div>
                      <div className="t-author-date">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="t-verified">✦ Verified</div>
                  </div>

                  {/* Stars */}
                  <div className="t-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= item.rating ? "t-star" : "t-star-empty"}>★</span>
                    ))}
                    <span className="t-rating-num">{item.rating}.0</span>
                  </div>

                  <div className="t-card-divider" />

                  {/* Message */}
                  <p className="t-message">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}