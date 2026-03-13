"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import api from "@/lib/api";
import Image from "next/image";
import { Star, Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Users } from "lucide-react";

export default function TestimonialPage() {
  const { data: session } = useSession();

  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);

  /* ───────────────────────────── BEFORE LOGIN ───────────────────────────── */
  if (!session) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');



          .pre-page {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: #09090f;
            font-family: 'DM Sans', sans-serif;
           
          }

          .pre-left {
            position: relative;
            padding: 64px 56px;
            display: flex; flex-direction: column; justify-content: center;
            
          }
          .pre-left::before {
            content: '';
            position: absolute; inset: 0;
            background: radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.18) 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 10%, rgba(255,200,80,0.1) 0%, transparent 50%);
            pointer-events: none;
          }
          .pre-left-grid {
            position: absolute; inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            pointer-events: none;
          }
          .pre-badge {
            display: inline-flex; align-items: center; gap: 8px;
            background: rgba(255,107,53,0.12);
            border: 1px solid rgba(255,107,53,0.25);
            border-radius: 100px; padding: 6px 14px;
            font-size: 12px; font-weight: 500;
            color: rgba(255,107,53,0.9); letter-spacing: 0.05em;
            margin-bottom: 28px; width: fit-content;
          }
          .pre-badge-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: #ff6b35;
            animation: pulse-dot 2s ease-in-out infinite;
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
          .pre-heading {
            font-family: 'Playfair Display', serif;
            font-size: clamp(32px, 3.5vw, 48px); font-weight: 700;
            color: #fff; line-height: 1.15; margin-bottom: 20px;
          }
          .pre-heading em { font-style: italic; color: #ff6b35; }
          .pre-sub {
            font-size: 15px; color: rgba(255,255,255,0.45);
            line-height: 1.75; max-width: 380px; margin-bottom: 44px;
          }
          .pre-features { display: flex; flex-direction: column; gap: 18px; margin-bottom: 48px; }
          .pre-feature { display: flex; align-items: flex-start; gap: 14px; }
          .pre-feature-icon {
            width: 36px; height: 36px; flex-shrink: 0;
            background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.2);
            border-radius: 10px; display: flex; align-items: center; justify-content: center;
            color: #ff6b35;
          }
          .pre-feature-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
          .pre-feature-desc { font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.5; }
          .pre-stats { display: flex; gap: 32px; }
          .pre-stat-num {
            font-family: 'Playfair Display', serif;
            font-size: 26px; font-weight: 700; color: #fff;
          }
          .pre-stat-label { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }

          .pre-right {
            display: flex; align-items: center; justify-content: center;
            padding: 48px 40px; position: relative;
            border-left: 1px solid rgba(255,255,255,0.06);
          }
          .sign-card {
            width: 100%; max-width: 380px;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.09);
            border-radius: 24px; padding: 44px 36px;
            backdrop-filter: blur(24px);
            box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          }
          .sign-icon {
            width: 64px; height: 64px;
            background: linear-gradient(135deg, #ff6b35, #ffc850);
            border-radius: 18px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 24px; font-size: 26px;
            box-shadow: 0 8px 24px rgba(255,107,53,0.3);
          }
          .sign-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px; font-weight: 700; color: #fff;
            margin-bottom: 8px; line-height: 1.3;
          }
          .sign-sub { color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.6; margin-bottom: 32px; }

          .steps { margin-bottom: 32px; }
          .steps-label {
            font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
            text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 16px;
          }
          .step-row {
            display: flex; align-items: flex-start; gap: 12px;
            margin-bottom: 14px; position: relative;
          }
          .step-row:not(:last-child)::after {
            content: ''; position: absolute; left: 15px; top: 32px;
            width: 2px; height: calc(100% - 4px);
            background: rgba(255,255,255,0.06);
          }
          .step-num {
            width: 30px; height: 30px; flex-shrink: 0;
            background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.25);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 12px; font-weight: 600; color: #ff6b35; position: relative; z-index: 1;
          }
          .step-text { padding-top: 4px; }
          .step-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); }
          .step-desc { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 1px; }

          .sign-btn {
            display: flex; align-items: center; justify-content: center; gap: 12px;
            width: 100%; padding: 16px 24px;
            background: linear-gradient(135deg, #ff6b35, #ff8c42);
            color: #fff; border: none; border-radius: 14px;
            font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
            cursor: pointer; transition: all 0.2s ease;
            box-shadow: 0 8px 24px rgba(255,107,53,0.3); margin-bottom: 16px;
          }
          .sign-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(255,107,53,0.45); }
          .sign-note {
            text-align: center; font-size: 12px; color: rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center; gap: 6px;
          }

          @media (max-width: 768px) {
            .pre-page { grid-template-columns: 1fr; }
            .pre-left { padding: 40px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
            .pre-right { padding: 36px 20px; border-left: none; }
          }
        `}</style>

        <div className="pre-page">
          {/* LEFT */}
          <div className="pre-left">
            <div className="pre-left-grid" />
            <div className="pre-badge"><span className="pre-badge-dot" />Trusted by 2,000+ members</div>
            <h1 className="pre-heading">Your voice <em>matters</em><br />to our community</h1>
            <p className="pre-sub">Share your honest experience and help others make better decisions. Every testimonial is reviewed and published within 24 hours.</p>
            <div className="pre-features">
              <div className="pre-feature">
                <div className="pre-feature-icon"><Shield size={16} /></div>
                <div><div className="pre-feature-title">Verified & Authentic</div><div className="pre-feature-desc">Only real users can submit — no fake reviews, ever.</div></div>
              </div>
              <div className="pre-feature">
                <div className="pre-feature-icon"><Zap size={16} /></div>
                <div><div className="pre-feature-title">Quick & Easy</div><div className="pre-feature-desc">Takes less than 2 minutes. Sign in, rate, write, done.</div></div>
              </div>
              <div className="pre-feature">
                <div className="pre-feature-icon"><Users size={16} /></div>
                <div><div className="pre-feature-title">Helps the Community</div><div className="pre-feature-desc">Your feedback shapes future members experience.</div></div>
              </div>
            </div>
            <div className="pre-stats">
              <div><div className="pre-stat-num">4.9★</div><div className="pre-stat-label">Avg. rating</div></div>
              <div><div className="pre-stat-num">1.2k+</div><div className="pre-stat-label">Testimonials</div></div>
              <div><div className="pre-stat-num">24h</div><div className="pre-stat-label">Review time</div></div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="pre-right">
            <div className="sign-card">
              <div className="sign-icon">✦</div>
              <h2 className="sign-title">Share Your Experience</h2>
              <p className="sign-sub">Sign in with Google to get started — it only takes a moment.</p>
              <div className="steps">
                <div className="steps-label">How it works</div>
                {[
                  { n: "1", t: "Sign in with Google", d: "One click, no password needed" },
                  { n: "2", t: "Rate & Select Category", d: "Choose stars and what you're reviewing" },
                  { n: "3", t: "Write Your Testimonial", d: "Share your honest experience" },
                  { n: "4", t: "Submit for Approval", d: "Published within 24 hours after review" },
                ].map((s) => (
                  <div className="step-row" key={s.n}>
                    <div className="step-num">{s.n}</div>
                    <div className="step-text">
                      <div className="step-title">{s.t}</div>
                      <div className="step-desc">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => signIn("google")} className="sign-btn">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <div className="sign-note"><Shield size={12} />Secure sign-in · No spam · Cancel anytime</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ───────────────────────────── AFTER LOGIN ────────────────────────────── */
  const handleSubmit = async () => {
    if (!message.trim()) { alert("Please write a testimonial"); return; }
    await api.post("/testimonial/create", {
      name: session.user?.name,
      email: session.user?.email,
      profileImage: session.user?.image,
      message, category, rating,
    });
    alert("Submitted for approval 🚀");
    setMessage(""); setRating(5);
  };

  const categories = [
    { value: "webservice", label: "Web Service", emoji: "🌐" },
    { value: "material", label: "Material", emoji: "📦" },
    { value: "referral", label: "Referral", emoji: "🤝" },
    { value: "jobs", label: "Jobs", emoji: "💼" },
    { value: "membership", label: "Membership", emoji: "🎖️" },
    { value: "hackathon", label: "Hackathon", emoji: "⚡" },
    { value: "general", label: "General", emoji: "💬" },
  ];
  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');


        .post-page {
          min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
          background: #09090f; font-family: 'DM Sans', sans-serif;
        }

        .post-left {
          position: relative; padding: 64px 56px;
          display: flex; flex-direction: column; justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.06); 
        }
        .post-left::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 20% 40%, rgba(255,107,53,0.15) 0%, transparent 55%),
                      radial-gradient(ellipse at 85% 80%, rgba(255,200,80,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        .post-left-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .welcome-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.2);
          border-radius: 100px; padding: 6px 14px;
          font-size: 12px; color: rgba(255,107,53,0.85); font-weight: 500;
          letter-spacing: 0.04em; margin-bottom: 28px; width: fit-content;
        }
        .welcome-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b35; }
        .post-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3vw, 42px); font-weight: 700;
          color: #fff; line-height: 1.2; margin-bottom: 16px;
        }
        .post-heading em { font-style: italic; color: #ff6b35; }
        .post-sub { font-size: 15px; color: rgba(255,255,255,0.4); line-height: 1.75; max-width: 360px; margin-bottom: 40px; }

        .tips-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 16px;
        }
        .tips { display: flex; flex-direction: column; gap: 14px; margin-bottom: 44px; }
        .tip-row { display: flex; align-items: flex-start; gap: 12px; }
        .tip-check { margin-top: 1px; flex-shrink: 0; color: #ff6b35; }
        .tip-text { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.55; }
        .tip-text strong { color: rgba(255,255,255,0.75); font-weight: 600; }

        .preview-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px; max-width: 360px;
        }
        .preview-stars { color: #ffc850; font-size: 14px; margin-bottom: 10px; letter-spacing: 2px; }
        .preview-quote {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; margin-bottom: 14px;
        }
        .preview-author { display: flex; align-items: center; gap: 10px; }
        .preview-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #ff6b35, #ffc850);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #fff; font-weight: 700;
        }
        .preview-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); }
        .preview-verified { font-size: 11px; color: rgba(255,107,53,0.6); margin-top: 1px; }

        .post-right {
          display: flex; align-items: center; justify-content: center;
          padding: 40px 36px; position: relative; overflow-y: auto;
        }
        .card {
          position: relative; z-index: 1; width: 100%; max-width: 460px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 28px; padding: 36px 32px; backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .header {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 28px; padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .avatar-wrap { position: relative; flex-shrink: 0; }
        .avatar-img { width: 52px; height: 52px; border-radius: 50%; border: 2px solid rgba(255,107,53,0.5); object-fit: cover; display: block; }
        .avatar-badge {
          position: absolute; bottom: -2px; right: -2px;
          width: 17px; height: 17px; background: linear-gradient(135deg, #ff6b35, #ffc850);
          border-radius: 50%; border: 2px solid #09090f;
          display: flex; align-items: center; justify-content: center; font-size: 8px;
        }
        .user-name { font-size: 15px; font-weight: 600; color: #fff; }
        .user-email { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .header-tag {
          margin-left: auto; font-family: 'Playfair Display', serif;
          font-size: 12px; color: rgba(255,107,53,0.75); letter-spacing: 0.05em; text-transform: uppercase;
        }

        .section-label {
          font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.28);
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px;
        }
        .rating-section { margin-bottom: 22px; }
        .stars-row { display: flex; align-items: center; gap: 4px; }
        .star-btn { background: none; border: none; cursor: pointer; padding: 3px; line-height: 0; transition: transform 0.15s ease; }
        .star-btn:hover { transform: scale(1.2); }
        .star-btn svg { width: 26px; height: 26px; transition: all 0.15s ease; }
        .star-active svg { filter: drop-shadow(0 0 6px rgba(255,200,80,0.6)); }
        .rating-label { margin-left: 10px; font-size: 13px; font-weight: 500; color: rgba(255,200,80,0.9); min-width: 58px; }

        .category-section { margin-bottom: 22px; }
        .category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
        .cat-btn {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px; padding: 9px 5px; cursor: pointer; transition: all 0.2s ease;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: rgba(255,255,255,0.45); font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
        }
        .cat-btn .cat-emoji { font-size: 15px; line-height: 1; }
        .cat-btn:hover { background: rgba(255,107,53,0.1); border-color: rgba(255,107,53,0.3); color: rgba(255,255,255,0.8); }
        .cat-btn.active { background: rgba(255,107,53,0.15); border-color: rgba(255,107,53,0.6); color: #ff6b35; box-shadow: 0 0 14px rgba(255,107,53,0.15); }

        .textarea-section { margin-bottom: 24px; }
        .textarea-wrap { position: relative; }
        .testimonial-textarea {
          width: 100%; min-height: 110px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px; padding: 14px 16px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7;
          resize: vertical; outline: none; transition: all 0.2s ease; display: block;
        }
        .testimonial-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .testimonial-textarea:focus {
          border-color: rgba(255,107,53,0.45); background: rgba(255,107,53,0.04);
          box-shadow: 0 0 0 4px rgba(255,107,53,0.08);
        }
        .char-count { position: absolute; bottom: 11px; right: 13px; font-size: 11px; color: rgba(255,255,255,0.18); pointer-events: none; }

        .submit-btn {
          width: 100%; padding: 16px 24px;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa726 100%);
          border: none; border-radius: 14px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.25s ease; box-shadow: 0 8px 28px rgba(255,107,53,0.35);
          position: relative; 
        }
        .submit-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(255,107,53,0.45); }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active { transform: translateY(0); }

        .divider { display: flex; align-items: center; gap: 10px; margin-bottom: 22px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .divider-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,107,53,0.35); }

        @media (max-width: 860px) {
          .post-page { grid-template-columns: 1fr; }
          .post-left { padding: 36px 24px; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .post-right { padding: 32px 20px; }
          .preview-card { display: none; }
        }
      `}</style>

      <div className="post-page">
        {/* LEFT — Tips & Context */}
        <div className="post-left">
          <div className="post-left-grid" />
          <div className="welcome-tag">
            <span className="welcome-dot" />
            Welcome back, {session.user?.name?.split(" ")[0]}!
          </div>
          <h1 className="post-heading">Help others with<br />your <em>honest</em> review</h1>
          <p className="post-sub">Great testimonials are specific, genuine, and helpful. Here is what makes yours stand out.</p>

          <div className="tips-label">Tips for a great review</div>
          <div className="tips">
            {[
              { t: "Be specific", d: "Mention exactly what you used and why it helped you." },
              { t: "Share the outcome", d: "Did it save time? Solve a problem? Say it." },
              { t: "Keep it genuine", d: "Authentic experiences resonate more than generic praise." },
              { t: "Rate honestly", d: "Your stars guide future members — be accurate." },
            ].map((tip, i) => (
              <div className="tip-row" key={i}>
                <CheckCircle2 size={16} className="tip-check" />
                <div className="tip-text"><strong>{tip.t} — </strong>{tip.d}</div>
              </div>
            ))}
          </div>

          <div className="preview-card">
            <div className="preview-stars">★★★★★</div>
            <div className="preview-quote">The hackathon was incredibly well-organized. I connected with amazing people and shipped a product in 48 hours.</div>
            <div className="preview-author">
              <div className="preview-avatar">AK</div>
              <div>
                <div className="preview-name">Arjun K.</div>
                <div className="preview-verified">✦ Verified member</div>
              </div>
            </div>
          </div>
<br />
           <div className="preview-card">
            <div className="preview-stars">★★★★★</div>
            <div className="preview-quote">The material quality was excellent. It was well-structured, easy to understand, and helped me learn effectively.</div>
            <div className="preview-author">
              <div className="preview-avatar">PK</div>
              <div>
                <div className="preview-name">Pragati Singh</div>
                <div className="preview-verified">✦ Verified member</div>
              </div>
            </div>
          </div>

        </div>
        

        {/* RIGHT — Form */}
        <div className="post-right">
          <div className="card">
            <div className="header">
              <div className="avatar-wrap">
                <Image src={session.user?.image || ""} alt="Profile" width={52} height={52} className="avatar-img" />
                <div className="avatar-badge">✦</div>
              </div>
              <div>
                <div className="user-name">{session.user?.name}</div>
                <div className="user-email">{session.user?.email}</div>
              </div>
              <div className="header-tag">Testimonial</div>
            </div>

            <div className="rating-section">
              <div className="section-label">Your Rating</div>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className={`star-btn ${star <= (hoveredStar || rating) ? "star-active" : ""}`}
                    onClick={() => setRating(star)} onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}>
                    <Star style={{ color: star <= (hoveredStar || rating) ? "#ffc850" : "rgba(255,255,255,0.15)", fill: star <= (hoveredStar || rating) ? "#ffc850" : "transparent" }} />
                  </button>
                ))}
                <span className="rating-label">{ratingLabels[hoveredStar || rating]}</span>
              </div>
            </div>

            <div className="divider"><div className="divider-line" /><div className="divider-dot" /><div className="divider-line" /></div>

            <div className="category-section">
              <div className="section-label">Category</div>
              <div className="category-grid">
                {categories.map((cat) => (
                  <button key={cat.value} className={`cat-btn ${category === cat.value ? "active" : ""}`} onClick={() => setCategory(cat.value)}>
                    <span className="cat-emoji">{cat.emoji}</span>{cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider"><div className="divider-line" /><div className="divider-dot" /><div className="divider-line" /></div>

            <div className="textarea-section">
              <div className="section-label">Your Message</div>
              <div className="textarea-wrap">
                <textarea className="testimonial-textarea" placeholder="Tell us about your experience — what made it memorable?"
                  value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
                <span className="char-count">{message.length}/500</span>
              </div>
            </div>

            <button onClick={handleSubmit} className="submit-btn">
              <Sparkles size={15} />Submit Testimonial<ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}