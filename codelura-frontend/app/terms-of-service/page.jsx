"use client";

import { useState } from "react";

const sections = [
  {
    number: "01",
    icon: "✅",
    title: "Acceptance of Terms",
    content:
      "By using our services, you confirm that you are at least 18 years old or have parental consent. Continued use of the platform constitutes acceptance of these terms.",
  },
  {
    number: "02",
    icon: "🧩",
    title: "Description of Services",
    content:
      "Codelura provides educational blogs, learning resources, project showcase opportunities, software development services, and hackathon participation features. We reserve the right to modify or discontinue services at any time without prior notice.",
  },
  {
    number: "03",
    icon: "👤",
    title: "User Responsibilities",
    list: [
      "You must provide accurate information while registering.",
      "You are responsible for maintaining account confidentiality.",
      "You must not upload harmful, illegal, or plagiarized content.",
      "You agree not to misuse the platform or attempt unauthorized access.",
    ],
  },
  {
    number: "04",
    icon: "©️",
    title: "Intellectual Property",
    content:
      "All platform content including design, branding, blogs, and materials are the intellectual property of Codelura unless otherwise stated. Users retain ownership of their uploaded projects but grant us a license to display them publicly.",
  },
  {
    number: "05",
    icon: "💳",
    title: "Payments & Services",
    content:
      "For paid services such as website development, app development, and software solutions, payment terms will be defined in separate agreements. Refunds, if applicable, will follow stated policies.",
  },
  {
    number: "06",
    icon: "⚠️",
    title: "Limitation of Liability",
    content:
      "Codelura shall not be held liable for indirect, incidental, or consequential damages resulting from platform usage. Users are responsible for verifying information before acting upon it.",
  },
  {
    number: "07",
    icon: "🚫",
    title: "Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these Terms of Service without prior notice.",
  },
  {
    number: "08",
    icon: "⚖️",
    title: "Governing Law",
    content:
      "These Terms shall be governed by applicable laws. Any disputes shall be resolved under the jurisdiction of competent courts.",
  },
];

const highlights = [
  { icon: "🔞", label: "18+ or Parental Consent", desc: "Age requirement" },
  { icon: "🔒", label: "Account Security", desc: "You own your credentials" },
  { icon: "🧠", label: "Your IP is Yours", desc: "Projects stay with you" },
  { icon: "⚡", label: "Fair Usage", desc: "No misuse or hacking" },
];

export default function TermsOfService() {
  const [active, setActive] = useState(null);

  return (
    <main className="min-h-screen bg-[#080B14] text-white px-4 py-0">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s, background 0.3s;
        }
        .card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.7), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card:hover, .card.open {
          border-color: rgba(255,107,53,0.4);
          background: rgba(255,107,53,0.04);
          transform: translateY(-2px);
        }
        .card:hover::after, .card.open::after { opacity: 1; }

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
          text-transform: uppercase;
        }

        .gradient-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,53,0.4), transparent);
        }

        .accordion-body {
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.35s ease;
        }
        .accordion-body.open { max-height: 600px; opacity: 1; }
        .accordion-body.closed { max-height: 0; opacity: 0; }

        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ff6b35;
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(255,107,53,0.5);
        }

        .highlight-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .highlight-card:hover {
          border-color: rgba(255,107,53,0.3);
          background: rgba(255,107,53,0.05);
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative text-center pt-24 pb-20 overflow-hidden px-4">
        <div className="glow-orb" style={{ width: 650, height: 320, background: "rgba(255,107,53,0.11)", top: "5%", left: "50%", transform: "translateX(-50%)" }} />
        <div className="glow-orb" style={{ width: 180, height: 180, background: "rgba(255,180,53,0.07)", top: "50%", left: "15%" }} />
        <div className="glow-orb" style={{ width: 180, height: 180, background: "rgba(255,60,53,0.07)", top: "30%", right: "10%" }} />

        <div className="relative z-10">
          <span className="tag">📜 Legal</span>

          <h1
            className="syne mt-6 mb-5 leading-tight"
            style={{ fontSize: "clamp(38px, 6vw, 74px)", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Terms of
            <br />
            <span style={{ background: "linear-gradient(90deg, #ff6b35, #ffaa35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Service
            </span>
          </h1>

          <p className="mx-auto max-w-xl" style={{ color: "rgba(255,255,255,0.48)", fontSize: 17, lineHeight: 1.75 }}>
            Welcome to <span style={{ color: "#ff6b35", fontWeight: 600 }}>Codelura</span>. By
            accessing or using our platform, services, blogs, learning materials, project showcase,
            and hackathon features, you agree to comply with the following terms.
          </p>

          {/* Quick highlights */}
          <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-2xl mx-auto">
            {highlights.map((h) => (
              <div key={h.label} className="highlight-card flex items-center gap-3 text-left" style={{ minWidth: 180 }}>
                <span style={{ fontSize: 22 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{h.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Accordion ── */}
      <div className="max-w-4xl mx-auto pb-24 px-2">
        <div className="gradient-line mb-12" />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s, i) => {
            const isOpen = active === i;
            return (
              <div
                key={i}
                className={`card ${isOpen ? "open" : ""}`}
                onClick={() => setActive(isOpen ? null : i)}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <div style={{
                      width: 46, height: 46, borderRadius: 12,
                      background: "rgba(255,107,53,0.1)",
                      border: "1px solid rgba(255,107,53,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0,
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,107,53,0.55)", letterSpacing: "0.12em" }}>
                        {s.number}
                      </div>
                      <div className="syne" style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
                        {s.title}
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: "1px solid rgba(255,107,53,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform 0.3s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5L7 9L11 5" stroke="#ff6b35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                {/* Body */}
                <div className={`accordion-body ${isOpen ? "open" : "closed"}`}>
                  <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                    {s.content && (
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.8 }}>
                        {s.content}
                      </p>
                    )}
                    {s.list && (
                      <div>
                        {s.list.map((item, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3"
                            style={{
                              padding: "10px 0",
                              borderBottom: j < s.list.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                              color: "rgba(255,255,255,0.55)",
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

        {/* Footer */}
        <div className="gradient-line mt-12 mb-8" />
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,53,0.07) 0%, rgba(255,107,53,0.02) 100%)",
            border: "1px solid rgba(255,107,53,0.18)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 12 }}>📝</div>
          <p className="syne" style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
            You are agreeing to these terms
          </p>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
            By continuing to use Codelura, you acknowledge that you have read, understood, and agreed to these Terms of Service.
          </p>
        </div>
      </div>
    </main>
  );
}