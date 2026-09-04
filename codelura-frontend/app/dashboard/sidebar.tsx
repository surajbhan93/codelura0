"use client";

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  LayoutDashboard,
  Crown,
  BookOpen,
  Trophy,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Flame,
  BadgeCheck,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard", badge: null },
  { title: "Campus Program", icon: GraduationCap, href: "/dashboard/campus", badge: "HOT", badgeColor: "purple" },
  { title: "My Programs & Tracks", icon: GraduationCap, href: "/dashboard/programs", badge: "Active", badgeColor: "purple" },
  { title: "Premium", icon: Crown, href: "/dashboard/premium", badge: "PRO", badgeColor: "gold" },
  { title: "Your Study Material", icon: BookOpen, href: "/dashboard/material", badge: "12", badgeColor: "blue" },
  { title: "Hackathon", icon: Trophy, href: "/dashboard/hackathon", badge: "Live", badgeColor: "red" },
  { title: "Profile", icon: User, href: "/dashboard/profile", badge: null },
  { title: "Settings", icon: Settings, href: "/dashboard/settings", badge: null },
  { title: "Notifications", icon: Bell, href: "/dashboard/notifications", badge: "3", badgeColor: "blue" },
];

// const user = {
//   name: "Rahul Sharma",
//   email: "rahul@example.com",
//   avatar: null,
//   streak: 7,
//   verified: true,
// };



type SidebarProps = {
  onLogout: () => Promise<void>;
};

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  // const router = useRouter();

  const [user, setUser] = useState<any>(null);

useEffect(() => {
  api.get("/auth/me")
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {
      console.error("Failed to fetch user", err);
    });
}, []);

  return (
    <aside
      className="h-screen w-64 flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0f0f17 0%, #13131f 60%, #111119 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <h1><b>C</b></h1>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">Codelura</span>
            <p className="text-[10px] text-white/30 font-medium leading-none mt-0.5 tracking-widest uppercase">
              Student Portal
            </p>
          </div>
        </div>
      </div>

      {/* ── User Card ── */}
      <div className="mx-3 mt-4 mb-2 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {user?.isEmailVerified && (
              <BadgeCheck size={13} className="absolute -bottom-0.5 -right-0.5 text-[#6366f1]" fill="#6366f1" color="white" />
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
  {user?.name || "Loading..."}
</p>

<p className="text-white/40 text-[10px] truncate">
  {user?.email || ""}
</p>
          </div>
        </div>
        {/* Streak */}
        <div
          className="mt-2.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
          style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}
        >
          <Flame size={13} className="text-orange-400" />
          <span className="text-orange-300 text-xs font-semibold">
  {user?.streak || 0} day streak
</span>
          <span className="ml-auto text-orange-400/60 text-[10px]">Keep it up!</span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 px-3 pb-1.5 pt-1">
          Navigation
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
              style={
                isActive
                  ? {
                      background: "linear-gradient(90deg, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0.08) 100%)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }
                  : {
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: "#6366f1" }}
                />
              )}

              <Icon
                size={17}
                className="shrink-0 transition-colors"
                color={isActive ? "#a5b4fc" : "rgba(255,255,255,0.4)"}
              />

              <span
                className="text-sm font-medium flex-1 transition-colors"
                style={{ color: isActive ? "#e0e7ff" : "rgba(255,255,255,0.5)" }}
              >
                {item.title}
              </span>

              {/* Badge */}
              {item.badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={
                    item.badgeColor === "gold"
                      ? { background: "rgba(251,191,36,0.15)", color: "#fbbf24" }
                      : item.badgeColor === "red"
                      ? { background: "rgba(239,68,68,0.15)", color: "#f87171" }
                      : item.badgeColor === "purple"
                      ? { background: "rgba(168,85,247,0.15)", color: "#c084fc" }
                      : { background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }
                  }
                >
                  {item.badge}
                </span>
              )}

              {/* Chevron on hover */}
              {!item.badge && (
                <ChevronRight
                  size={13}
                  className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-150"
                  color="rgba(255,255,255,0.3)"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Progress Card ── */}
      <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/60 text-xs font-medium">Weekly Goal</span>
          <span className="text-indigo-300 text-xs font-bold">5 / 8 hrs</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: "62.5%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }}
          />
        </div>
        <p className="text-white/30 text-[10px] mt-1.5">3 more hours to hit your goal 🎯</p>
      </div>

      {/* ── Logout ── */}
      <div className="px-3 pb-5 border-t border-white/5 pt-3">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 group"
          style={{ border: "1px solid transparent" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
            (e.currentTarget as HTMLElement).style.border = "1px solid rgba(239,68,68,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.border = "1px solid transparent";
          }}
        >
          <LogOut size={17} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-medium text-white/40 group-hover:text-red-400 transition-colors">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}