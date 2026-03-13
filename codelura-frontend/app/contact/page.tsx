"use client";

import { useState } from "react";
import api from "@/lib/api";
import axios from "axios";

export default function GeneralContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/contact/create", form);
      if (res.data.success) {
        alert("Message sent successfully 🚀");
        setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Error");
      } else {
        alert("Something went wrong");
      }
    }
  };

  const subjects = [
    { value: "general",       label: "General Query",  icon: "💬" },
    { value: "hackathon",     label: "Hackathon",       icon: "⚡" },
    { value: "notes",         label: "Notes",           icon: "📝" },
    { value: "membership",    label: "Membership",      icon: "🎖️" },
    { value: "collaboration", label: "Collaboration",   icon: "🤝" },
  ];

  return (
    <main className="min-h-screen bg-[#080B14] flex items-center justify-center px-4 py-20">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      <style>{`
   
        .dm  { font-family: 'DM Sans', sans-serif; }
        .syn { font-family: 'Syne', sans-serif; }

        /* bg */
        .glow { position: fixed; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0; }
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* wrapper */
        .outer {
          position: relative; z-index: 1;
          width: 100%; max-width: 1020px;
          display: grid; grid-template-columns: 1fr 1fr;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.55);
          font-family: 'DM Sans', sans-serif; color: #fff;
        }

        /* ── LEFT ── */
        .left {
          padding: 52px 44px;
          background: rgba(255,107,53,0.04);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .left::before {
          content: ''; position: absolute; top: -80px; left: -80px;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.14) 0%, transparent 65%);
          pointer-events: none;
        }
        .left::after {
          content: ''; position: absolute; bottom: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,200,80,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.28);
          color: #ff6b35; border-radius: 100px;
          padding: 5px 14px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 20px; width: fit-content; position: relative; z-index: 1;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #ff6b35;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.35} }

        .left-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 3vw, 38px); font-weight: 800;
          color: #fff; line-height: 1.15; margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .left-heading .grad {
          background: linear-gradient(90deg, #ff6b35, #ffaa35);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .left-sub {
          font-size: 14px; color: rgba(255,255,255,0.38);
          line-height: 1.75; max-width: 300px; margin-bottom: 36px;
          position: relative; z-index: 1;
        }

        /* topic pills */
        .topics-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 12px;
          position: relative; z-index: 1;
        }
        .pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; position: relative; z-index: 1; }
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px; padding: 6px 14px;
          font-size: 12px; color: rgba(255,255,255,0.5);
          transition: all 0.2s ease; cursor: default;
        }
        .pill:hover { border-color: rgba(255,107,53,0.35); color: rgba(255,255,255,0.85); background: rgba(255,107,53,0.08); }

        /* channels */
        .channels-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .channels { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; margin-bottom: 36px; }
        .channel-row { display: flex; align-items: center; gap: 12px; }
        .channel-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.18);
          display: flex; align-items: center; justify-content: center; font-size: 15px;
        }
        .channel-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); }
        .channel-val   { font-size: 12px; color: rgba(255,255,255,0.32); margin-top: 1px; }

        /* stats */
        .stat-row {
          display: flex; gap: 24px;
          padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06);
          position: relative; z-index: 1;
        }
        .stat-val-num {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: #fff; line-height: 1;
        }
        .stat-lbl { font-size: 11px; color: rgba(255,255,255,0.28); margin-top: 3px; }

        /* ── RIGHT FORM ── */
        .right { padding: 52px 44px; }

        .form-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .form-sub { font-size: 13px; color: rgba(255,255,255,0.32); margin-bottom: 28px; line-height: 1.6; }

        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }

        .wrap { position: relative; margin-bottom: 14px; }
        .ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 15px; pointer-events: none; line-height: 1; z-index: 1; }
        .ico-top { top: 14px; transform: none; }

        .field {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 12px;
          color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif;
          padding: 12px 14px 12px 42px; outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          display: block; -webkit-appearance: none; appearance: none;
        }
        .field::placeholder { color: rgba(255,255,255,0.22); }
        .field:focus {
          border-color: rgba(255,107,53,0.55); background: rgba(255,107,53,0.04);
          box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
        }
        select.field option { background: #0f1220; color: #fff; }
        .select-arr { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); font-size: 10px; color: rgba(255,255,255,0.28); pointer-events: none; }

        /* subject chips */
        .chips-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 10px;
        }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px; padding: 7px 14px;
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.45);
          cursor: pointer; transition: all 0.2s ease; font-family: 'DM Sans', sans-serif;
        }
        .chip:hover { border-color: rgba(255,107,53,0.3); color: rgba(255,255,255,0.75); background: rgba(255,107,53,0.07); }
        .chip.active {
          background: rgba(255,107,53,0.14); border-color: rgba(255,107,53,0.55);
          color: #ff6b35; box-shadow: 0 0 12px rgba(255,107,53,0.12);
        }

        .btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #ff6b35, #ffaa35);
          border: none; border-radius: 14px; color: #fff;
          font-size: 15px; font-weight: 700; font-family: 'Syne', sans-serif;
          cursor: pointer; letter-spacing: 0.03em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s ease; box-shadow: 0 8px 28px rgba(255,107,53,0.3);
          margin-top: 4px; position: relative; overflow: hidden;
        }
        .btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(255,107,53,0.42); }
        .btn:hover::before { opacity: 1; }
        .btn:active { transform: translateY(0); }

        .form-note {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          margin-top: 14px; font-size: 12px; color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 760px) {
          .outer { grid-template-columns: 1fr; }
          .left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 36px 24px; }
          .right { padding: 36px 24px; }
          .row2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow" style={{ width: 500, height: 260, background: "rgba(255,107,53,0.09)", top: "3%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="glow" style={{ width: 220, height: 220, background: "rgba(255,60,53,0.06)", bottom: "6%", left: "3%" }} />

      <div className="outer">

        {/* ── LEFT ── */}
        <div className="left">
          <div>
            <div className="badge"><span className="badge-dot" />Contact Us</div>

            <h2 className="left-heading">
              We&apos;d Love to<br />Hear <span className="grad">From You</span>
            </h2>
            <p className="left-sub">
              Have a question, idea, or just want to say hello? Drop us a message — we read every single one and reply within 24 hours.
            </p>

            <div className="topics-label">You can reach us about</div>
            <div className="pills">
              {["General Queries", "Hackathons", "Membership", "Study Notes", "Collaboration", "Feedback"].map((p) => (
                <span className="pill" key={p}>{p}</span>
              ))}
            </div>
            <div className="channels-label">Other ways to reach us</div>
            <div className="channels">
              {[
                { icon: "📧", title: "Email", val: "hello@yourcompany.com" },
                { icon: "💬", title: "Community Discord", val: "Join our server for quick answers" },
                { icon: "📍", title: "Based in", val: "India · Remote-friendly" },
              ].map((c) => (
                <div className="channel-row" key={c.title}>
                  <div className="channel-icon">{c.icon}</div>
                  <div>
                    <div className="channel-title">{c.title}</div>
                    <div className="channel-val">{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="stat-row">
            <div><div className="stat-val-num">24h</div><div className="stat-lbl">Avg. Reply Time</div></div>
            <div><div className="stat-val-num">50k+</div><div className="stat-lbl">Community Members</div></div>
            <div><div className="stat-val-num">100%</div><div className="stat-lbl">Messages Replied</div></div>
          </div>
        </div>
        {/* ── RIGHT ── */}
        <div className="right">
          <div className="form-title">Send a Message</div>
          <div className="form-sub">Tell us what&apos;s on your mind — we&apos;re here to help.</div>
          <form onSubmit={handleSubmit}>
            {/* Name + Email */}
            <div className="row2">
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">👤</span>
                <input className="field" placeholder="Your Name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">📧</span>
                <input className="field" placeholder="Email Address" type="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* Phone */}
            <div className="wrap">
              <span className="ico">📱</span>
              <input className="field" placeholder="Phone (optional)"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            {/* Subject chips — replaces boring select */}
            <div className="chips-label">What&apos;s this about?</div>
            <div className="chips">
              {subjects.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  className={`chip ${form.subject === s.value ? "active" : ""}`}
                  onClick={() => setForm({ ...form, subject: s.value })}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>

            {/* Message */}
            <div className="wrap">
              <span className="ico ico-top">💬</span>
              <textarea className="field" rows={4}
                placeholder="Write your message here…"
                style={{ resize: "none", paddingTop: 12 }}
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            <button type="submit" className="btn">
              Send Message <span>→</span>
            </button>

            <div className="form-note">🔒 We never share your info · No spam, ever</div>
          </form>
        </div>
      </div>
    </main>
  );
}