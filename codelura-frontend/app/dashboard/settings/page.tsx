"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

type TabKey = "profile" | "account" | "notifications" | "privacy" | "appearance";

interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  walletBalance?: number;
  isEmailVerified?: boolean;
  phone?: string;
  bio?: string;
}

const tabs: Tab[] = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "account", label: "Account", icon: "🔐" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "privacy", label: "Privacy", icon: "🛡️" },
  { key: "appearance", label: "Appearance", icon: "🎨" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Profile state — prefilled from API
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        const u: User = res.data.user;
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        setBio(u.bio || "");
        setPhone(u.phone || "");
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Notifications state
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [hackathonAlerts, setHackathonAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // Privacy state
  const [profilePublic, setProfilePublic] = useState(true);
  const [showStreak, setShowStreak] = useState(true);
  const [showProgress, setShowProgress] = useState(false);

  // Appearance state
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [language, setLanguage] = useState("Hindi + English");
  const [fontSize, setFontSize] = useState("Medium");

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          color: "#6b7280",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid #1f2937",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: 14 }}>Settings load ho rahi hain...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: value
          ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
          : "#374151",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          display: "block",
        }}
      />
    </button>
  );

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          color: "#9ca3af",
          marginBottom: 6,
          fontWeight: 500,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          background: "#1f2937",
          border: "1px solid #374151",
          borderRadius: 10,
          color: "#f9fafb",
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
        onBlur={(e) => (e.target.style.borderColor = "#374151")}
      />
    </div>
  );

  const SettingRow = ({
    title,
    desc,
    value,
    onChange,
  }: {
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid #1f2937",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "#f3f4f6",
            fontWeight: 500,
          }}
        >
          {title}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6b7280" }}>
          {desc}
        </p>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            {/* Avatar Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 32,
                padding: 20,
                background: "#111827",
                borderRadius: 14,
                border: "1px solid #1f2937",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#f9fafb" }}>
                    {name}
                  </p>
                  {user?.isEmailVerified && (
                    <span style={{ fontSize: 11, background: "#052e16", color: "#34d399", padding: "2px 8px", borderRadius: 6, fontWeight: 500 }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p style={{ margin: "2px 0 4px", fontSize: 13, color: "#6b7280" }}>{email}</p>
                {user?.role && (
                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "#a78bfa", fontWeight: 500, textTransform: "capitalize" }}>
                    {user.role} • ₹{user.walletBalance ?? 0} wallet
                  </p>
                )}
                <button
                  style={{
                    padding: "6px 16px",
                    background: "transparent",
                    border: "1px solid #7c3aed",
                    borderRadius: 8,
                    color: "#a78bfa",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  📷 Photo Change Karein
                </button>
              </div>
              <div
                style={{
                  background: "#1c1a3a",
                  border: "1px solid #4f46e5",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 12,
                  color: "#a78bfa",
                  fontWeight: 600,
                }}
              >
                🔥 7 Day Streak
              </div>
            </div>

            <InputField label="Poora Naam" value={name} onChange={setName} />
            <InputField
              label="Email Address"
              value={email}
              onChange={setEmail}
              type="email"
            />
            <InputField
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              type="tel"
            />

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#9ca3af",
                  marginBottom: 6,
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: 10,
                  color: "#f9fafb",
                  fontSize: 15,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "#374151")}
              />
            </div>
          </div>
        );

      case "account":
        return (
          <div>
            <div
              style={{
                background: "#1c1a3a",
                border: "1px solid #4f46e5",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 24 }}>👑</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    color: "#a78bfa",
                    fontSize: 15,
                  }}
                >
                  Premium Member
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>
                  2 active subscriptions • ₹0 spent
                </p>
              </div>
              <button
                style={{
                  marginLeft: "auto",
                  padding: "6px 14px",
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Upgrade
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3
                style={{
                  margin: "0 0 16px",
                  fontSize: 15,
                  color: "#9ca3af",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password Change Karein
              </h3>
              <InputField
                label="Current Password"
                value=""
                onChange={() => {}}
                type="password"
                placeholder="••••••••"
              />
              <InputField
                label="New Password"
                value=""
                onChange={() => {}}
                type="password"
                placeholder="••••••••"
              />
              <InputField
                label="Confirm New Password"
                value=""
                onChange={() => {}}
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div
              style={{
                background: "#1f2937",
                borderRadius: 12,
                padding: 16,
                border: "1px solid #374151",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontWeight: 600,
                  color: "#f3f4f6",
                  fontSize: 15,
                }}
              >
                Two-Factor Authentication
              </p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>
                Extra security layer add karein apne account ke liye
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#d1d5db",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                🔐 2FA Enable Karein
              </button>
            </div>

            <div
              style={{
                background: "#1a0a0a",
                borderRadius: 12,
                padding: 16,
                border: "1px solid #7f1d1d",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontWeight: 600,
                  color: "#fca5a5",
                  fontSize: 15,
                }}
              >
                Account Delete Karein
              </p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>
                Yeh action permanent hai. Sochke karo!
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #7f1d1d",
                  borderRadius: 8,
                  color: "#f87171",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                🗑️ Account Delete Karein
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div>
            <SettingRow
              title="Email Notifications"
              desc="Important updates email pe receive karein"
              value={emailNotif}
              onChange={setEmailNotif}
            />
            <SettingRow
              title="Push Notifications"
              desc="Browser notifications allow karein"
              value={pushNotif}
              onChange={setPushNotif}
            />
            <SettingRow
              title="Course Updates"
              desc="Naye lectures aur assignments ke alerts"
              value={courseUpdates}
              onChange={setCourseUpdates}
            />
            <SettingRow
              title="Hackathon Alerts"
              desc="Upcoming hackathons ki reminders"
              value={hackathonAlerts}
              onChange={setHackathonAlerts}
            />
            <SettingRow
              title="Weekly Digest"
              desc="Har hafte progress summary email karein"
              value={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        );

      case "privacy":
        return (
          <div>
            <SettingRow
              title="Public Profile"
              desc="Doosre students aapki profile dekh sakein"
              value={profilePublic}
              onChange={setProfilePublic}
            />
            <SettingRow
              title="Streak Display"
              desc="Apni streak leaderboard pe dikhayein"
              value={showStreak}
              onChange={setShowStreak}
            />
            <SettingRow
              title="Course Progress"
              desc="Progress publicly visible rahegi"
              value={showProgress}
              onChange={setShowProgress}
            />

            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: "#111827",
                borderRadius: 12,
                border: "1px solid #1f2937",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: 600,
                  color: "#f3f4f6",
                  fontSize: 15,
                }}
              >
                Data Download Karein
              </p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>
                Apna saara data export karein (profile, courses, progress)
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid #374151",
                  borderRadius: 8,
                  color: "#d1d5db",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                📦 Data Export Karein
              </button>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#9ca3af",
                  marginBottom: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Theme
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {(["dark", "light", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      background:
                        theme === t ? "#1c1a3a" : "#1f2937",
                      border: `1.5px solid ${theme === t ? "#7c3aed" : "#374151"}`,
                      borderRadius: 10,
                      color: theme === t ? "#a78bfa" : "#9ca3af",
                      fontSize: 14,
                      cursor: "pointer",
                      fontWeight: theme === t ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {t === "dark" ? "🌙 Dark" : t === "light" ? "☀️ Light" : "💻 System"}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#9ca3af",
                  marginBottom: 8,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: 10,
                  color: "#f9fafb",
                  fontSize: 15,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option>Hindi + English</option>
                <option>English Only</option>
                <option>Hindi Only</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  color: "#9ca3af",
                  marginBottom: 8,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Font Size
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Small", "Medium", "Large"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background:
                        fontSize === s ? "#1c1a3a" : "transparent",
                      border: `1px solid ${fontSize === s ? "#7c3aed" : "#374151"}`,
                      borderRadius: 8,
                      color: fontSize === s ? "#a78bfa" : "#9ca3af",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#f9fafb",
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#f9fafb",
            }}
          >
            ⚙️ Settings
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 15, color: "#6b7280" }}>
            Apna account aur preferences manage karein
          </p>
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Sidebar Tabs */}
          <div
            style={{
              width: 200,
              flexShrink: 0,
              background: "#111827",
              borderRadius: 14,
              border: "1px solid #1f2937",
              padding: 8,
              height: "fit-content",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background:
                    activeTab === tab.key
                      ? "linear-gradient(135deg, #2d1b69, #1e1b4b)"
                      : "transparent",
                  border: "none",
                  borderRadius: 10,
                  color: activeTab === tab.key ? "#a78bfa" : "#9ca3af",
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.15s",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#111827",
                borderRadius: 14,
                border: "1px solid #1f2937",
                padding: 24,
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#f9fafb",
                  borderBottom: "1px solid #1f2937",
                  paddingBottom: 16,
                }}
              >
                {tabs.find((t) => t.key === activeTab)?.icon}{" "}
                {tabs.find((t) => t.key === activeTab)?.label} Settings
              </h2>

              {renderContent()}

              {/* Save Button */}
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px solid #1f2937",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <button
                  onClick={handleSave}
                  style={{
                    padding: "10px 28px",
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                >
                  💾 Changes Save Karein
                </button>
                {saved && (
                  <span
                    style={{
                      color: "#34d399",
                      fontSize: 14,
                      fontWeight: 500,
                      animation: "fadeIn 0.3s ease",
                    }}
                  >
                    ✅ Saved successfully!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}