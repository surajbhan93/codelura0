"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data.user));
    api
      .get("/enrollments/my-enrollments")
      .then((res) => {
        if (res.data.success) {
          setEnrollments(res.data.data || []);
        }
      })
      .catch(() => {});
  }, []);

  if (!user)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0d17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 14,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            border: "3px solid #1f2937",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          Loading your profile...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  const stats = [
    { label: "Wallet", value: `₹${user.walletBalance || 0}`, icon: "💰" },
    { label: "Role", value: user.role || "Student", icon: "🎓" },
    { label: "Courses", value: user.coursesEnrolled || "—", icon: "📚" },
    { label: "Streak", value: user.streak ? `${user.streak}d 🔥` : "0d", icon: "⚡" },
  ];

  const quickLinks = [
    {
      title: "Change Password",
      desc: "Update your account password",
      icon: "🔐",
      color: "#7c3aed",
      bg: "#1c1a3a",
      border: "#4f46e5",
      href: "/dashboard/settings?tab=account",
    },
    {
      title: "Referral Program",
      desc: "Invite friends & earn rewards",
      icon: "🎁",
      color: "#f59e0b",
      bg: "#1a160a",
      border: "#78350f",
      badge: "Coming Soon",
    },
    {
      title: "Notifications",
      desc: "Manage your alerts & updates",
      icon: "🔔",
      color: "#34d399",
      bg: "#0a1a12",
      border: "#065f46",
      href: "/dashboard/notifications",
      badge: user.unreadNotifications > 0 ? `${user.unreadNotifications} New` : null,
    },
    {
      title: "My Certificates",
      desc: "View & download certificates",
      icon: "🏅",
      color: "#60a5fa",
      bg: "#0c1828",
      border: "#1e3a5f",
      badge: "Coming Soon",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d17",
        color: "#f9fafb",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: "28px 20px",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .quick-card { transition: transform 0.15s, border-color 0.15s; cursor: pointer; }
        .quick-card:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* ── Coming Soon Banner ── */}
        <div
          className="fade-up"
          style={{
            marginBottom: 24,
            borderRadius: 14,
            border: "1px solid #312e81",
            background: "linear-gradient(135deg, #1e1b4b 0%, #0f0c2e 100%)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animationDelay: "0s",
          }}
        >
          <span style={{ fontSize: 22 }}>🚧</span>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#a5b4fc" }}>
              Your Full Dashboard is Coming Soon
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6366f1" }}>
              We're building something amazing for you. Stay tuned!
            </p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              background: "#312e81",
              color: "#a5b4fc",
              padding: "3px 10px",
              borderRadius: 20,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            In Progress
          </span>
        </div>

        {/* ── Profile Hero Card ── */}
        <div
          className="fade-up"
          style={{
            background: "linear-gradient(160deg, #111827 0%, #0d1320 100%)",
            border: "1px solid #1f2937",
            borderRadius: 20,
            padding: "24px 20px",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
            animationDelay: "0.07s",
          }}
        >
          {/* Glow orb background */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Top row: avatar + name + verified */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px #1c1a3a",
                }}
              >
                {initials}
              </div>
              {user.isEmailVerified && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#059669",
                    border: "2px solid #0b0d17",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                  }}
                >
                  ✓
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f9fafb" }}>
                {user.name}
              </h2>
              <p style={{ margin: "3px 0 6px", fontSize: 13, color: "#6b7280" }}>
                {user.email}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {user.isEmailVerified && (
                  <span
                    style={{
                      fontSize: 11,
                      background: "#052e16",
                      color: "#34d399",
                      padding: "2px 9px",
                      borderRadius: 20,
                      fontWeight: 600,
                      border: "1px solid #065f46",
                    }}
                  >
                    ✓ Verified
                  </span>
                )}
                <span
                  style={{
                    fontSize: 11,
                    background: "#1c1a3a",
                    color: "#a78bfa",
                    padding: "2px 9px",
                    borderRadius: 20,
                    fontWeight: 600,
                    border: "1px solid #4f46e5",
                    textTransform: "capitalize",
                  }}
                >
                  {user.role || "Student"}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#1f2937", marginBottom: 18 }} />

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#0f1320",
                  border: "1px solid #1f2937",
                  borderRadius: 12,
                  padding: "12px 8px",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: 18 }}>{s.icon}</p>
                <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#f3f4f6" }}>
                  {s.value}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info Rows ── */}
        <div
          className="fade-up"
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: "18px 20px",
            marginBottom: 16,
            animationDelay: "0.14s",
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "#4b5563",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Account Details
          </p>
          {[
            { label: "Full Name", value: user.name, icon: "👤" },
            { label: "Email Address", value: user.email, icon: "✉️" },
            { label: "Role", value: user.role || "Student", icon: "🎓" },
            { label: "Wallet Balance", value: `₹${user.walletBalance || 0}`, icon: "💰" },
          ].map(({ label, value, icon }, idx, arr) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "11px 0",
                borderBottom: idx < arr.length - 1 ? "1px solid #1f2937" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "#e5e7eb",
                  fontWeight: 500,
                  maxWidth: 220,
                  textAlign: "right",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── My Enrolled Learning & Programs ── */}
        <div
          className="fade-up"
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 16,
            padding: "18px 20px",
            marginBottom: 16,
            animationDelay: "0.18s",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              My Enrolled Programs &amp; Tracks ({enrollments.length})
            </p>
            <a
              href="/career/learning/programs"
              style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", textDecoration: "none" }}
            >
              Explore More →
            </a>
          </div>

          {enrollments.length === 0 ? (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              <p style={{ margin: "0 0 6px", fontSize: 24 }}>🎓</p>
              <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
                You have not enrolled in any programs yet.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enrollments.map((en: any) => {
                const item = en.itemRef || {};
                const isCareerTrack = en.itemType === "CareerTrack";
                const isUnlocked = en.unlockedViaCareerTrack;
                const slug = item.slug || "";
                const href = isCareerTrack
                  ? `/career/learning/career-tracks/${slug}`
                  : `/career/learning/programs/${slug}`;

                return (
                  <div
                    key={en._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#0f1320",
                      border: "1px solid #1f2937",
                      borderRadius: 12,
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 12,
                            background: isCareerTrack
                              ? "#3b0764"
                              : isUnlocked
                              ? "#064e3b"
                              : "#1e1b4b",
                            color: isCareerTrack
                              ? "#e9d5ff"
                              : isUnlocked
                              ? "#a7f3d0"
                              : "#c7d2fe",
                            border: `1px solid ${
                              isCareerTrack
                                ? "#6b21a8"
                                : isUnlocked
                                ? "#047857"
                                : "#3730a3"
                            }`,
                          }}
                        >
                          {isCareerTrack
                            ? "🎯 Career Track"
                            : isUnlocked
                            ? "✨ Unlocked via Career Track"
                            : "🚀 Program"}
                        </span>
                      </div>

                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#f9fafb" }}>
                        {en.itemTitle || item.name || item.title}
                      </h4>
                    </div>

                    <a
                      href={href}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        background: "#4f46e5",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Start Learning →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Links ── */}
        <p
          className="fade-up"
          style={{
            margin: "0 0 10px",
            fontSize: 12,
            fontWeight: 600,
            color: "#4b5563",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            animationDelay: "0.2s",
          }}
        >
          Quick Actions
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          {quickLinks.map((item, i) => (
            <a
              key={item.title}
              href={item.href ?? "#"}
              className="fade-up quick-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: item.href ? item.bg : "#0f1320",
                border: `1px solid ${item.href ? item.border : "#1f2937"}`,
                borderRadius: 14,
                padding: "14px 16px",
                textDecoration: "none",
                animationDelay: `${0.24 + i * 0.06}s`,
                opacity: item.href ? 1 : 0.7,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: item.href ? `${item.color}18` : "#1f2937",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#f3f4f6" }}>
                  {item.title}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
                  {item.desc}
                </p>
              </div>

              {item.badge ? (
                <span
                  style={{
                    fontSize: 11,
                    background:
                      item.badge.includes("New")
                        ? "#052e16"
                        : "#1f2937",
                    color:
                      item.badge.includes("New")
                        ? "#34d399"
                        : "#6b7280",
                    border: `1px solid ${item.badge.includes("New") ? "#065f46" : "#374151"}`,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.badge}
                </span>
              ) : (
                <span style={{ color: "#4b5563", fontSize: 16 }}>›</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}