"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import axios from "axios";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
    service: serviceName,
  });

  return (
    <main className="min-h-screen bg-[#080B14] flex items-center justify-center px-4 py-20">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }
        .playfair { font-family: 'Playfair Display', serif; }

        .glow { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; }

        /* ── GRID BG ── */
        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* ── LAYOUT ── */
        .outer {
          position: relative; z-index: 1;
          width: 100%; max-width: 1040px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
        }

        /* ── LEFT INFO PANEL ── */
        .info-panel {
          padding: 52px 44px;
          background: rgba(255,107,53,0.04);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .info-panel::before {
          content: '';
          position: absolute; top: -80px; left: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .info-panel::after {
          content: '';
          position: absolute; bottom: -60px; right: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,200,80,0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .info-top { position: relative; z-index: 1; }

        .info-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,107,53,0.12);
          border: 1px solid rgba(255,107,53,0.28);
          color: #ff6b35; border-radius: 100px;
          padding: 5px 14px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .info-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #ff6b35;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.35} }

        .info-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 3vw, 38px); font-weight: 800;
          color: #fff; line-height: 1.15; margin-bottom: 14px;
        }
        .info-heading .grad {
          background: linear-gradient(90deg, #ff6b35, #ffaa35);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .info-sub {
          font-size: 14px; color: rgba(255,255,255,0.4);
          line-height: 1.75; max-width: 300px; margin-bottom: 36px;
        }

        /* Service pills */
        .services-label {
          font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 12px;
        }
        .services-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 36px; }
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px; padding: 6px 14px;
          font-size: 12px; color: rgba(255,255,255,0.55);
          transition: all 0.2s ease;
        }
        .pill:hover {
          border-color: rgba(255,107,53,0.35);
          color: rgba(255,255,255,0.85);
          background: rgba(255,107,53,0.08);
        }
        .pill-icon { font-size: 13px; }

        /* Why us points */
        .why-list { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
        .why-item { display: flex; align-items: flex-start; gap: 12px; }
        .why-icon {
          width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
          background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.2);
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .why-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); }
        .why-desc { font-size: 12px; color: rgba(255,255,255,0.33); margin-top: 1px; line-height: 1.5; }

        /* stat row */
        .stat-row {
          display: flex; gap: 24px; margin-top: 36px;
          padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.06);
          position: relative; z-index: 1;
        }
        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: #fff; line-height: 1;
        }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 3px; }

        /* ── RIGHT FORM PANEL ── */
        .form-panel { padding: 52px 44px; }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; color: #fff;
          margin-bottom: 6px;
        }
        .form-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; }

        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .wrap { position: relative; margin-bottom: 14px; }
        .ico {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; pointer-events: none; line-height: 1;
        }
        .ico-top { top: 14px; transform: none; }

        .field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          color: #fff; font-size: 14px;
          padding: 12px 14px 12px 42px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          display: block;
          -webkit-appearance: none; appearance: none;
        }
        .field::placeholder { color: rgba(255,255,255,0.25); }
        .field:focus {
          border-color: rgba(255,107,53,0.55);
          background: rgba(255,107,53,0.04);
          box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
        }
        .field[readonly] {
          color: #ff6b35;
          border-color: rgba(255,107,53,0.25);
          background: rgba(255,107,53,0.06);
          cursor: default;
        }
        select.field option { background: #0f1220; color: #fff; }

        .select-arrow {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 10px; color: rgba(255,255,255,0.3); pointer-events: none;
        }

        .btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #ff6b35, #ffaa35);
          border: none; border-radius: 14px;
          color: #fff; font-size: 15px; font-weight: 700;
          cursor: pointer; letter-spacing: 0.03em;
          font-family: 'Syne', sans-serif;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 8px 28px rgba(255,107,53,0.3);
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
        }

        @media (max-width: 780px) {
          .outer { grid-template-columns: 1fr; }
          .info-panel { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 36px 28px; }
          .form-panel { padding: 36px 28px; }
          .row2 { grid-template-columns: 1fr; }
          .stat-row { gap: 16px; }
        }
      `}</style>

      {/* BG effects */}
      <div className="grid-bg" />
      <div className="glow" style={{ width: 480, height: 260, background: "rgba(255,107,53,0.09)", top: "4%", left: "50%", transform: "translateX(-50%)" }} />
      <div className="glow" style={{ width: 200, height: 200, background: "rgba(255,60,53,0.06)", bottom: "8%", left: "4%" }} />

      <div className="outer">

        {/* ── LEFT INFO PANEL ── */}
        <div className="info-panel">
          <div className="info-top">
            <div className="info-badge">
              <span className="info-badge-dot" />
              Get in Touch
            </div>

            <h2 className="info-heading">
              Let&apos;s Build<br />Something{" "}
              <span className="grad">Great</span>
            </h2>
            <p className="info-sub">
              Whether it&apos;s a web app, mobile app, or a complete digital product — share your idea and we&apos;ll turn it into reality.
            </p>

            <div className="services-label">What we work on</div>
            <div className="services-pills">
              {[
                { icon: "🌐", label: "Web Apps" },
                { icon: "📱", label: "Mobile Apps" },
                { icon: "🛒", label: "E-Commerce" },
                { icon: "🎨", label: "UI/UX Design" },
                { icon: "⚡", label: "APIs & Backend" },
                { icon: "☁️", label: "Cloud & DevOps" },
              ].map((s) => (
                <span className="pill" key={s.label}>
                  <span className="pill-icon">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>

            <div className="why-list">
              {[
                { icon: "🚀", t: "Fast Turnaround", d: "MVP delivered in weeks, not months." },
                { icon: "🔒", t: "Transparent Process", d: "Regular updates, no surprises on scope or budget." },
                { icon: "🤝", t: "Post-launch Support", d: "We stay with you even after go-live." },
              ].map((w) => (
                <div className="why-item" key={w.t}>
                  <div className="why-icon">{w.icon}</div>
                  <div>
                    <div className="why-title">{w.t}</div>
                    <div className="why-desc">{w.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-row">
            <div><div className="stat-val">200+</div><div className="stat-label">Projects Delivered</div></div>
            <div><div className="stat-val">98%</div><div className="stat-label">Client Satisfaction</div></div>
            <div><div className="stat-val">24h</div><div className="stat-label">Response Time</div></div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="form-panel">
          <div className="form-title">Send an Enquiry</div>
          <div className="form-sub">Fill in the details below — we will get back to you within 24 hours.</div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const res = await api.post("/services/create", {
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                  budget: form.budget,
                  message: form.message,
                  serviceSlug: form.service.toLowerCase().replace(/\s+/g, "-"),
                });
                if (res.data.success) {
                  alert("Enquiry sent successfully 🚀");
                  setForm({ name: "", email: "", phone: "", budget: "", message: "", service: serviceName });
                } else {
                  alert(res.data.message);
                }
              } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                  alert(error.response?.data?.message || "Something went wrong");
                } else {
                  alert("Something went wrong");
                }
              }
            }}
          >
            {/* Name + Email */}
            <div className="row2">
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">👤</span>
                <input placeholder="Your Name" className="field"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">📧</span>
                <input placeholder="Email Address" className="field"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* gap */}
            <div style={{ height: 14 }} />

            {/* Phone + Service */}
            <div className="row2">
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">📱</span>
                <input placeholder="Phone Number" className="field"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="wrap" style={{ marginBottom: 0 }}>
                <span className="ico">⚡</span>
                <input placeholder="Service" className="field" value={form.service} readOnly />
              </div>
            </div>

            <div style={{ height: 14 }} />

            {/* Budget */}
            <div className="wrap">
              <span className="ico">💰</span>
              <select className="field" value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                <option value="">Select Budget Range</option>
                <option value="under-10k">Under ₹10k</option>
                <option value="10k-25k">₹10k – ₹25k</option>
                <option value="25k-50k">₹25k – ₹50k</option>
                <option value="50k-1lakh">₹50k – ₹1 Lakh</option>
                <option value="1lakh-plus">₹1 Lakh+</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>

            {/* Message */}
            <div className="wrap">
              <span className="ico ico-top">💬</span>
              <textarea placeholder="Describe your project or idea…" className="field"
                rows={4} style={{ resize: "none", paddingTop: 12 }}
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            <button type="submit" className="btn">
              <span>Send Enquiry</span>
              <span>→</span>
            </button>

            <div className="form-note">
              🔒 Your details are safe with us · No spam, ever
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}