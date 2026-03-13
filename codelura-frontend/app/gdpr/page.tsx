"use client";

import { useState } from "react";

const sections = [
  {
    number: "01",
    icon: "📋",
    title: "What Data We Collect",
    content:
      "We may collect personal information such as your name, email address, contact details, educational background, uploaded projects, and usage data when you interact with our platform, blogs, learning resources, or services.",
  },
  {
    number: "02",
    icon: "⚙️",
    title: "How We Use Your Data",
    list: [
      "To provide access to learning materials, blogs, and resources",
      "To showcase student and user projects",
      "To improve platform performance and user experience",
      "To communicate important updates and opportunities",
      "To ensure platform security and prevent misuse",
    ],
  },
  {
    number: "03",
    icon: "⚖️",
    title: "Legal Basis for Processing",
    content:
      "We process personal data based on user consent, contractual necessity, and legitimate interests such as improving our services and maintaining platform security.",
  },
  {
    number: "04",
    icon: "🔒",
    title: "Data Storage & Security",
    content:
      "All data is securely stored using industry-standard security measures. We restrict access to authorized personnel only and continuously monitor our systems to prevent unauthorized access or breaches.",
  },
  {
    number: "05",
    icon: "🛡️",
    title: "Your Rights Under GDPR",
    list: [
      "Right to access your personal data",
      "Right to correct inaccurate information",
      "Right to request deletion of your data",
      "Right to restrict or object to processing",
      "Right to data portability",
    ],
  },
  {
    number: "06",
    icon: "🔗",
    title: "Third-Party Services",
    content:
      "We may use trusted third-party services for analytics, hosting, or communication. These providers comply with GDPR and follow strict data protection standards.",
  },
];

export default function GDPRPage() {
//   const [active, setActive] = useState(null);
  const [active, setActive] = useState<number | null>(null);
  return (
    <main className="min-h-screen bg-[#080B14] text-white px-4 py-0 font-sans">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { font-family: 'DM Sans', sans-serif; }
        .syne { font-family: 'Syne', sans-serif; }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.6), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card.active, .card:hover {
          border-color: rgba(255,107,53,0.4);
          background: rgba(255,107,53,0.04);
          transform: translateY(-2px);
        }
        .card.active::after, .card:hover::after { opacity: 1; }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,107,53,0.1);
          border: 1px solid rgba(255,107,53,0.3);
          color: #ff6b35;
          border-radius: 100px;
          padding: 5px 16px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ff6b35;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(255,107,53,0.6);
        }

        .right-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s, background 0.2s;
        }
        .right-badge:hover {
          border-color: rgba(255,107,53,0.3);
          background: rgba(255,107,53,0.05);
        }

        .gradient-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.4), transparent);
        }

        .accordion-content {
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .accordion-content.open { max-height: 500px; opacity: 1; }
        .accordion-content.closed { max-height: 0; opacity: 0; }
      `}</style>

      {/* Hero */}
      <section className="relative text-center pt-24 pb-20 overflow-hidden px-4">
        <div
          className="glow-orb"
          style={{
            width: 600,
            height: 300,
            background: "rgba(255,107,53,0.12)",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: 200,
            height: 200,
            background: "rgba(255,200,53,0.06)",
            top: "40%",
            left: "20%",
          }}
        />

        <div className="relative z-10">
          <span className="tag">🔐 GDPR COMPLIANT</span>

          <h1
            className="syne mt-6 mb-5 leading-tight tracking-tight"
            style={{ fontSize: "clamp(38px, 6vw, 76px)", fontWeight: 800 }}
          >
            Data Protection
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #ff6b35, #ffaa35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              & GDPR Policy
            </span>
          </h1>

          <p
            className="mx-auto max-w-xl"
            style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, lineHeight: 1.75 }}
          >
            At <span style={{ color: "#ff6b35", fontWeight: 600 }}>Codelura</span>, we
            respect your privacy and are committed to protecting your personal data in
            accordance with the General Data Protection Regulation (GDPR).
          </p>

          {/* Stats row */}
          <div
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            {[
              { label: "GDPR Compliant", val: "100%" },
              { label: "Data Encrypted", val: "AES-256" },
              { label: "Uptime SLA", val: "99.9%" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "14px 28px",
                  textAlign: "center",
                }}
              >
                <div
                  className="syne"
                  style={{ fontSize: 22, fontWeight: 700, color: "#ff6b35" }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto pb-24 px-2">
        <div className="gradient-line mb-12" />

        {/* Accordion sections */}
        <div className="space-y-4">
          {sections.map((s, i) => {
            const isOpen = active === i;
            return (
              <div
                key={i}
                className={`card ${isOpen ? "active" : ""}`}
                onClick={() => setActive(isOpen ? null : i)}
              >
                <div className="flex items-center justify-between p-6 gap-4">
                  <div className="flex items-center gap-4">
                    {/* Icon box */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: "rgba(255,107,53,0.1)",
                        border: "1px solid rgba(255,107,53,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(255,107,53,0.6)",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {s.number}
                      </div>
                      <div
                        className="syne"
                        style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                  {/* Chevron */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,107,53,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "transform 0.3s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 5L7 9L11 5"
                        stroke="#ff6b35"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Accordion body */}
                <div
                  className={`accordion-content ${isOpen ? "open" : "closed"}`}
                >
                  <div
                    style={{
                      padding: "0 24px 24px 24px",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      paddingTop: 20,
                    }}
                  >
                    {s.content && (
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8 }}>
                        {s.content}
                      </p>
                    )}
                    {s.list && (
                      <div className="space-y-0">
                        {s.list.map((item, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3"
                            style={{
                              padding: "10px 0",
                              borderBottom:
                                j < s.list.length - 1
                                  ? "1px solid rgba(255,255,255,0.05)"
                                  : "none",
                              color: "rgba(255,255,255,0.58)",
                              fontSize: 15,
                            }}
                          >
                            <div className="dot" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your Rights highlight section */}
        <div
          className="mt-10 p-8 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,107,53,0.02) 100%)",
            border: "1px solid rgba(255,107,53,0.2)",
          }}
        >
          <h3
            className="syne mb-6"
            style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}
          >
            ⚡ Your GDPR Rights at a Glance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "👁️", right: "Access", desc: "View your personal data" },
              { icon: "✏️", right: "Rectify", desc: "Correct inaccurate info" },
              { icon: "🗑️", right: "Erase", desc: "Request data deletion" },
              { icon: "🚫", right: "Restrict", desc: "Limit how we use data" },
              { icon: "📦", right: "Portability", desc: "Export your data" },
              { icon: "🙋", right: "Object", desc: "Oppose processing" },
            ].map((r) => (
              <div key={r.right} className="right-badge">
                <span style={{ fontSize: 20 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                    {r.right}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="gradient-line mt-12 mb-8" />
        <p
          className="text-center"
          style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.8 }}
        >
          By using Codelura, you acknowledge that you have read and understood our GDPR Compliance
          Policy. For any concerns, please contact us through our official support channels.
        </p>
      </div>
    </main>
  );
}