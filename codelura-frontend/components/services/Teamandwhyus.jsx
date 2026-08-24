"use client";

import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

const TEAM = [
  {
    name: "Aditya Rao",
    role: "Lead Developer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces",
  },
  {
    name: "Sneha Kulkarni",
    role: "UI/UX Designer",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=faces",
  },
  {
    name: "Vikram Singh",
    role: "Project Manager",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces",
  },
  {
    name: "Neha Joshi",
    role: "QA Lead",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=faces",
  },
];

const REASONS = [
  { title: "Clear Communication", desc: "You always know what stage your project is at, no chasing for updates." },
  { title: "On-Time Delivery", desc: "We plan around realistic timelines and stick to them." },
  { title: "Fair Pricing", desc: "No hidden costs. What we quote is what you pay." },
  { title: "Support After Launch", desc: "We stay reachable for fixes and small changes after handover." },
];

export default function TeamAndWhyUs() {
  return (
    <section style={{ padding: "0 0 80px" }}>
      <div className="cl-wrap">
        <div className="cl-line" />

        {/* Why choose us */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 56 }}
        >
          <span className="cl-pill" style={{ marginBottom: 18, display: "inline-flex" }}>
            Why Choose Us
          </span>
          <h2
            className="syne"
            style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 800, margin: "16px 0 34px", letterSpacing: "-0.02em" }}
          >
            Reasons clients <span className="cl-grad">stay with us</span>
          </h2>

          <div className="cl-reason-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {REASONS.map((r, i) => (
              <motion.div
                key={r.title}
                className="cl-glass"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ padding: "22px" }}
              >
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="cl-pill" style={{ marginBottom: 18, display: "inline-flex" }}>
            The Team
          </span>
          <h2
            className="syne"
            style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 800, margin: "16px 0 34px", letterSpacing: "-0.02em" }}
          >
            People behind <span className="cl-grad">this service</span>
          </h2>

          <div className="cl-team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                className="cl-glass"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ padding: "22px", textAlign: "center" }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", margin: "0 auto 14px" }}
                />
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{m.name}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{m.role}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media(max-width:900px) { .cl-reason-grid, .cl-team-grid { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:560px) { .cl-reason-grid, .cl-team-grid { grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  );
}