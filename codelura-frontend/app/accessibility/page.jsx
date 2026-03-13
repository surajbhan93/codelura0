"use client";

const sections = [
  {
    number: "01",
    title: "Our Commitment",
    icon: "🤝",
    content:
      "We strive to make our website accessible and usable for people of all abilities. Our goal is to follow best practices aligned with Web Content Accessibility Guidelines (WCAG) and ensure equal access to information, learning materials, projects, and services.",
  },
  {
    number: "02",
    title: "Accessibility Features",
    icon: "✦",
    list: [
      "Clear and consistent navigation structure",
      "Readable fonts with proper contrast ratios",
      "Keyboard navigability support",
      "Alt text for meaningful images",
      "Responsive design for all screen sizes",
      "Semantic HTML structure for screen readers",
    ],
  },
  {
    number: "03",
    title: "Ongoing Improvements",
    icon: "⟳",
    content:
      "Accessibility is an ongoing effort. We regularly review our website to identify and fix potential accessibility barriers. We also incorporate feedback from users to enhance accessibility standards.",
  },
  {
    number: "04",
    title: "Third-Party Content",
    icon: "◈",
    content:
      "Some third-party tools or integrations may not be fully accessible. While we aim to use accessible technologies, we cannot guarantee complete accessibility of external services.",
  },
  {
    number: "05",
    title: "Feedback & Contact",
    icon: "✉",
    content:
      "If you experience difficulty accessing any part of our website, please contact us. We value your feedback and will work to provide the information or service you need in an accessible format.",
  },
];

export default function AccessibilityPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080B14",
        fontFamily: "'DM Sans', sans-serif",
        padding: "0",
        color: "#fff",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <style>{`
        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px;
          transition: border-color 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,107,53,0.05) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card:hover { border-color: rgba(255,107,53,0.35); transform: translateY(-3px); }
        .card:hover::before { opacity: 1; }
        .tag { display: inline-block; background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.3); color: #ff6b35; border-radius: 100px; padding: 4px 14px; font-size: 12px; font-weight: 500; letter-spacing: 0.05em; }
        .num { font-family: 'Syne', sans-serif; font-size: 13px; color: rgba(255,107,53,0.5); font-weight: 700; letter-spacing: 0.1em; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin: 10px 0 16px; }
        .body-text { color: rgba(255,255,255,0.55); font-size: 15px; line-height: 1.75; }
        .list-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-size: 15px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .list-item:last-child { border-bottom: none; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b35; flex-shrink: 0; }
        .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,107,53,0.3), transparent); margin: 0 auto 60px; }
        .icon-box { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,107,53,0.1); border: 1px solid rgba(255,107,53,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 16px; }
      `}</style>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          padding: "100px 24px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <span className="tag">♿ WCAG Compliant</span>
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              margin: "24px 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            Accessibility
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #ff6b35, #ff9a35)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Statement
            </span>
          </h1>
          <p
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              color: "rgba(255,255,255,0.5)",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            Codelura is committed to ensuring digital accessibility for all
            users, including individuals with disabilities. We continuously
            improve the experience for everyone.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 24px 40px",
          display: "grid",
          gap: "20px",
        }}
      >
        <div className="divider" style={{ margin: "0 0 20px" }} />

        {sections.map((s) => (
          <div className="card" key={s.number}>
            <div className="icon-box">{s.icon}</div>
            <div className="num">{s.number}</div>
            <div className="section-title">{s.title}</div>
            {s.content && <p className="body-text">{s.content}</p>}
            {s.list && (
              <div>
                {s.list.map((item, i) => (
                  <div className="list-item" key={i}>
                    <div className="dot" />
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer card */}
        <div
          style={{
            marginTop: "12px",
            padding: "28px 36px",
            background: "rgba(255,107,53,0.06)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.7 }}>
            Codelura is dedicated to making its platform inclusive and
            accessible to all users. This statement may be updated periodically
            to reflect improvements and compliance updates.
          </p>
        </div>
      </div>
    </main>
  );
}