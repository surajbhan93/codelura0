"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type NotifCategory = "all" | "course" | "hackathon" | "premium" | "system";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "course" | "hackathon" | "premium" | "system" | "achievement";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const categoryTabs: { key: NotifCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "course", label: "Courses" },
  { key: "hackathon", label: "Hackathon" },
  { key: "premium", label: "Premium" },
  { key: "system", label: "System" },
];

const typeConfig: Record<
  Notification["type"],
  { icon: string; color: string; bg: string; border: string }
> = {
  course:      { icon: "📚", color: "#60a5fa", bg: "#0c1a2e", border: "#1e3a5f" },
  hackathon:   { icon: "🚀", color: "#f472b6", bg: "#1a0c1e", border: "#4a1a5f" },
  premium:     { icon: "👑", color: "#fbbf24", bg: "#1a160c", border: "#5f440c" },
  system:      { icon: "⚙️", color: "#9ca3af", bg: "#111827", border: "#374151" },
  achievement: { icon: "🏆", color: "#34d399", bg: "#0c1a14", border: "#0f5132" },
};

const demoNotifications: Notification[] = [
  {
    _id: "1",
    title: "New Lecture Available",
    message: "React Hooks - Advanced Patterns lecture has been uploaded. Watch it now and level up your skills!",
    type: "course",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    link: "/dashboard/courses",
  },
  {
    _id: "2",
    title: "Hackathon Starting Soon! 🚀",
    message: "Build-a-thon 2025 begins tomorrow. Register now to compete with top developers across India!",
    type: "hackathon",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: "/dashboard/hackathon",
  },
  {
    _id: "3",
    title: "Premium Plan Approved ✅",
    message: "Your Pro plan has been successfully activated. Enjoy unlimited access to all courses and resources!",
    type: "premium",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: "4",
    title: "7 Day Streak Achieved 🔥",
    message: "Amazing! You've maintained a 7-day learning streak. Keep it up and unlock the next milestone badge!",
    type: "achievement",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: "5",
    title: "Assignment Deadline Reminder",
    message: "Your JavaScript Fundamentals assignment is due in 24 hours. Submit before the deadline to earn full marks.",
    type: "course",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    link: "/dashboard/courses",
  },
  {
    _id: "6",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance on Sunday 2:00 AM – 4:00 AM IST. The platform may be temporarily unavailable.",
    type: "system",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: "7",
    title: "New Course Unlocked",
    message: "You've unlocked 'Node.js & Express Masterclass'. This course is now available in your dashboard.",
    type: "course",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    link: "/dashboard/courses",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotifCategory>("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    api
      .get("/notifications")
      .then((res) => {
        const data = res.data.notifications ?? res.data;
        setNotifications(Array.isArray(data) && data.length > 0 ? data : demoNotifications);
      })
      .catch(() => {
        setNotifications(demoNotifications);
      })
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    api.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const markAllRead = async () => {
    setMarkingAll(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await api.patch("/notifications/mark-all-read").catch(() => {});
    setMarkingAll(false);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    api.delete(`/notifications/${id}`).catch(() => {});
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0d17",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
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
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
          Loading notifications...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .notif-card {
          animation: slideIn 0.25s ease forwards;
          transition: background 0.15s, border-color 0.15s;
        }
        .notif-card:hover { background: #161d2e !important; }
        .delete-btn { opacity: 0; transition: opacity 0.15s; }
        .notif-card:hover .delete-btn { opacity: 1; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#f9fafb",
                letterSpacing: "-0.3px",
              }}
            >
              🔔 Notifications
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 14, color: "#6b7280" }}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid #374151",
                borderRadius: 10,
                color: "#a78bfa",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                opacity: markingAll ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {markingAll ? "Marking..." : "✓ Mark all as read"}
            </button>
          )}
        </div>

        {/* ── Category Tabs ── */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {categoryTabs.map((tab) => {
            const count =
              tab.key === "all"
                ? notifications.filter((n) => !n.isRead).length
                : notifications.filter((n) => n.type === tab.key && !n.isRead).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "7px 16px",
                  background: activeTab === tab.key ? "#1c1a3a" : "transparent",
                  border: `1px solid ${activeTab === tab.key ? "#7c3aed" : "#1f2937"}`,
                  borderRadius: 20,
                  color: activeTab === tab.key ? "#a78bfa" : "#6b7280",
                  fontSize: 13,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    style={{
                      background: "#7c3aed",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 10,
                      padding: "1px 6px",
                      lineHeight: "16px",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Notification List ── */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              background: "#111827",
              borderRadius: 16,
              border: "1px solid #1f2937",
            }}
          >
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🔕</p>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f3f4f6" }}>
              No notifications here
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280" }}>
              This category is empty right now.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((notif, i) => {
              const cfg = typeConfig[notif.type];
              return (
                <div
                  key={notif._id}
                  className="notif-card"
                  style={{
                    background: notif.isRead ? "#0f1320" : cfg.bg,
                    border: `1px solid ${notif.isRead ? "#1a2035" : cfg.border}`,
                    borderRadius: 14,
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    cursor: "pointer",
                    animationDelay: `${i * 0.04}s`,
                    position: "relative",
                  }}
                  onClick={() => { if (!notif.isRead) markAsRead(notif._id); }}
                >
                  {/* Unread dot */}
                  {!notif.isRead && (
                    <div
                      style={{
                        position: "absolute",
                        top: 18,
                        right: 48,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#7c3aed",
                      }}
                    />
                  )}

                  {/* Type icon */}
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: notif.isRead ? "#1f2937" : cfg.bg,
                      border: `1px solid ${notif.isRead ? "#374151" : cfg.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: notif.isRead ? 400 : 600,
                          color: notif.isRead ? "#d1d5db" : "#f9fafb",
                          lineHeight: 1.4,
                        }}
                      >
                        {notif.title}
                      </p>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#4b5563",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {timeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: notif.isRead ? "#6b7280" : "#9ca3af",
                        lineHeight: 1.5,
                      }}
                    >
                      {notif.message}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: cfg.color,
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontWeight: 500,
                          textTransform: "capitalize",
                        }}
                      >
                        {notif.type}
                      </span>

                      {notif.link && (
                        <a
                          href={notif.link}
                          style={{
                            fontSize: 12,
                            color: "#7c3aed",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Delete button — visible on hover */}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#4b5563",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: "2px 4px",
                      flexShrink: 0,
                      lineHeight: 1,
                    }}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <p style={{ textAlign: "center", fontSize: 13, color: "#374151", marginTop: 24 }}>
            Showing {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}