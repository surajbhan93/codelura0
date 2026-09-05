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
  Sparkles,
  Zap,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard/Portal", badge: null },
  { title: "Campus Program", icon: GraduationCap, href: "/dashboard/campus", badge: "HOT", badgeColor: "purple" },
  { title: "My Programs & Tracks", icon: GraduationCap, href: "/dashboard/programs", badge: "Active", badgeColor: "emerald" },
  { title: "Premium", icon: Crown, href: "/dashboard/premium", badge: "PRO", badgeColor: "gold" },
  { title: "Your Study Material", icon: BookOpen, href: "/dashboard/material", badge: "12", badgeColor: "blue" },
  { title: "Hackathon", icon: Trophy, href: "/dashboard/hackathon", badge: "Live", badgeColor: "red" },
  { title: "Profile", icon: User, href: "/dashboard/profile", badge: null },
  { title: "Settings", icon: Settings, href: "/dashboard/settings", badge: null },
  { title: "Notifications", icon: Bell, href: "/dashboard/notifications", badge: "3", badgeColor: "blue" },
];

type SidebarProps = {
  onLogout: () => Promise<void>;
};

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user in sidebar", err);
      });
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <aside className="relative h-screen w-[275px] flex flex-col bg-[#070814] border-r border-white/[0.08] select-none font-sans z-20 shrink-0">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

      {/* ── Brand Header ── */}
      <div className="relative px-5 pt-5 pb-4 border-b border-white/[0.07] flex items-center justify-between">
        <Link href="/dashboard/Portal" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-violet-600/25 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0a0c1b] rounded-[10px] flex items-center justify-center font-black text-sm text-white">
              C
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-base tracking-tight group-hover:text-violet-300 transition">
                Codelura
              </span>
              <span className="text-violet-500 font-black">.</span>
            </div>
            <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">
              Student Portal
            </p>
          </div>
        </Link>

        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30">
          <Zap size={10} className="text-yellow-400 fill-yellow-400" /> PRO
        </span>
      </div>

      {/* ── User Profile Card ── */}
      <div className="mx-3 my-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-md transition hover:border-violet-500/30">
        <div className="flex items-center gap-3">
          {/* Avatar with Glow Ring */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-sm text-white shadow-md shadow-violet-600/30 ring-2 ring-white/10">
              {initials}
            </div>
            {user?.isEmailVerified && (
              <BadgeCheck
                size={14}
                className="absolute -bottom-1 -right-1 text-emerald-400 drop-shadow"
                fill="#10b981"
                color="black"
              />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs sm:text-sm font-bold truncate leading-tight">
              {user?.name || "Loading..."}
            </p>
            <p className="text-slate-400 text-[10px] truncate mt-0.5">
              {user?.email || "student@codelura.com"}
            </p>
          </div>
        </div>

        {/* Learning Streak Tracker */}
        <div className="mt-2.5 flex items-center justify-between rounded-xl px-2.5 py-1.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-orange-500/20">
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-orange-400 fill-orange-400 animate-pulse" />
            <span className="text-orange-300 text-xs font-extrabold">
              {user?.streak || 1} day streak
            </span>
          </div>
          <span className="text-orange-400/70 text-[10px] font-semibold">Keep it up! 🔥</span>
        </div>
      </div>

      {/* ── Navigation Menu ── */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto scrollbar-none">
        <p className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-slate-500 px-3 pb-1 pt-1">
          Menu
        </p>

        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard/Portal" && (pathname === "/dashboard" || pathname === "/dashboard/Portal"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/30 border border-violet-400/40"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`}
            >
              {/* Active Left Indicator Bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-white shadow-sm" />
              )}

              <Icon
                size={17}
                className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                }`}
              />

              <span className="flex-1 truncate">{item.title}</span>

              {/* Badge */}
              {item.badge && (
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    item.badgeColor === "gold"
                      ? "bg-amber-500/20 text-yellow-300 border border-amber-500/30 shadow-sm"
                      : item.badgeColor === "red"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse"
                      : item.badgeColor === "purple"
                      ? "bg-purple-500/25 text-purple-200 border border-purple-400/40 shadow-sm shadow-purple-500/20"
                      : item.badgeColor === "emerald"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-blue-500/20 text-cyan-300 border border-blue-500/30"
                  }`}
                >
                  {item.badge === "HOT" && <Sparkles size={10} className="text-yellow-400" />}
                  {item.badge === "Live" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
                  {item.badge}
                </span>
              )}

              {!item.badge && !isActive && (
                <ChevronRight
                  size={13}
                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-500"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Weekly Goal Widget ── */}
      <div className="mx-3 my-2 p-3 rounded-2xl bg-gradient-to-br from-[#12142B] to-[#0A0C1B] border border-violet-500/20 shadow-lg">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-300 font-bold flex items-center gap-1">
            <Trophy size={13} className="text-yellow-400" /> Weekly Goal
          </span>
          <span className="text-violet-300 font-extrabold text-[11px]">5 / 8 hrs</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500"
            style={{ width: "65%" }}
          />
        </div>
        <p className="text-slate-400 text-[10px] font-medium mt-1.5">
          3 more hours to achieve your goal 🎯
        </p>
      </div>

      {/* ── Logout Button ── */}
      <div className="px-3 py-3 border-t border-white/[0.07]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200 group"
        >
          <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
          <span>Logout Account</span>
        </button>
      </div>
    </aside>
  );
}