"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MapPin, Building2, Star, FileText, CalendarClock,
  Image, BarChart2, Search, Gauge, Bot, Users2, Bell, ShieldCheck,
  Settings, ChevronLeft, Menu, X
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/google-business-profile/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/google-business-profile/locations", label: "Locations", Icon: MapPin },
  { href: "/google-business-profile/profile", label: "Profile", Icon: Building2 },
  { href: "/google-business-profile/reviews", label: "Reviews", Icon: Star },
  { href: "/google-business-profile/posts", label: "Posts", Icon: FileText },
  { href: "/google-business-profile/post-scheduler", label: "Post Scheduler", Icon: CalendarClock },
  { href: "/google-business-profile/media", label: "Media", Icon: Image },
  { href: "/google-business-profile/performance", label: "Performance", Icon: BarChart2 },
  { href: "/google-business-profile/keywords", label: "Search Keywords", Icon: Search },
  { href: "/google-business-profile/audit", label: "Local SEO Audit", Icon: Gauge },
  { href: "/google-business-profile/ai-seo", label: "AI SEO", Icon: Bot },
  { href: "/google-business-profile/competitors", label: "Competitors", Icon: Users2 },
  { href: "/google-business-profile/notifications", label: "Notifications", Icon: Bell },
  { href: "/google-business-profile/verification", label: "Verification", Icon: ShieldCheck },
  { href: "/google-business-profile/settings", label: "Settings", Icon: Settings },
];

export default function GbpSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300
          md:relative md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Google Business</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Profile Manager</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${
                  active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="h-3 w-3" />
            {!collapsed && <span>Back to Codelura</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
