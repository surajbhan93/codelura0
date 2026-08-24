"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlinePlusCircle,
  HiOutlineChatAlt2,
  HiOutlineTrendingUp,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlinePhone,
  HiOutlineStar,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineQuestionMarkCircle,
  HiOutlineUsers,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { useState } from "react";

const menu = [
  { name: "Dashboard",          href: "/admin",                 icon: HiOutlineViewGrid,          group: "main" },

  // Learning & Tracks
  { name: "Enrollments",        href: "/admin/enrollments",     icon: HiOutlineShoppingBag,       group: "learning" },
  { name: "Career Tracks",      href: "/admin/career-tracks",   icon: HiOutlineTrendingUp,        group: "learning" },
  { name: "Programs",           href: "/admin/programs",        icon: HiOutlineAcademicCap,       group: "learning" },
  { name: "Courses",            href: "/admin/courses",         icon: HiOutlineCollection,        group: "learning" },
  { name: "Hackathons",         href: "/admin/hackathons",      icon: HiOutlineBriefcase,         group: "learning" },

  // Content & Jobs
  { name: "All Blogs",          href: "/admin/blogs",           icon: HiOutlineDocumentText,      group: "content" },
  { name: "Create Blog",        href: "/admin/blogs/create",    icon: HiOutlinePlusCircle,        group: "content" },
  { name: "Comments",           href: "/admin/blogs/comments",  icon: HiOutlineChatAlt2,          group: "content" },
  { name: "Jobs",               href: "/admin/jobs",            icon: HiOutlineBriefcase,         group: "content" },
  { name: "Analytics",          href: "/admin/analytics",       icon: HiOutlineChartBar,          group: "content" },

  // Services & Business
  { name: "Services",           href: "/admin/services",        icon: HiOutlineBriefcase,         group: "manage" },
  { name: "Membership",         href: "/admin/premium",         icon: HiOutlineStar,              group: "manage" },
  { name: "Enquiries",          href: "/admin/enquiries",       icon: HiOutlineQuestionMarkCircle, group: "manage" },
  { name: "Your Work",          href: "/admin/work",            icon: HiOutlineCollection,        group: "manage" },

  // Community
  { name: "Users",              href: "/admin/users",           icon: HiOutlineUsers,             group: "community" },
  { name: "Team",               href: "/admin/team",            icon: HiOutlineUsers,            group: "community" },

  // Other
  { name: "Testimonials",       href: "/admin/testimonials",    icon: HiOutlineStar,              group: "other" },
  { name: "Contact Us",         href: "/admin/contact",         icon: HiOutlinePhone,             group: "other" },
];

const groups: Record<string, string> = {
  main: "",
  learning: "Learning & Tracks",
  content: "Content & Jobs",
  manage: "Services & Sales",
  community: "Community",
  other: "Other",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
.sb-wrap{display:flex;flex-direction:column;height:100%;background:#0a0c17;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden}
.sb-wrap::before{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%);top:-80px;left:-80px;pointer-events:none;z-index:0}
.sb-wrap::after{content:'';position:absolute;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%);bottom:60px;right:-50px;pointer-events:none;z-index:0}
.sb-logo{padding:24px 20px 20px;border-bottom:1px solid rgba(255,255,255,0.06);position:relative;z-index:1;flex-shrink:0}
.sb-logo-text{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;line-height:1}
.sb-logo-dot{background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-logo-badge{margin-top:8px;display:inline-flex;align-items:center;gap:5px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);color:#818cf8;border-radius:100px;padding:3px 10px;font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.sb-logo-badge-dot{width:5px;height:5px;border-radius:50%;background:#818cf8;box-shadow:0 0 6px rgba(129,140,248,0.9);animation:sbpulse 2s ease-in-out infinite;display:inline-block}
@keyframes sbpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.65)}}
.sb-nav{flex:1;padding:14px 10px;overflow-y:auto;position:relative;z-index:1;scrollbar-width:none}
.sb-nav::-webkit-scrollbar{display:none}
.sb-group-label{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,0.2);padding:14px 10px 5px;display:block}
.sb-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin:6px 10px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:11px;font-size:13px;font-weight:500;text-decoration:none;color:rgba(255,255,255,0.42);transition:all 0.22s ease;position:relative;margin-bottom:2px;white-space:nowrap;border:1px solid transparent}
.sb-item:hover{color:rgba(255,255,255,0.78);background:rgba(255,255,255,0.04)}
.sb-item.active{background:linear-gradient(135deg,rgba(99,102,241,0.22),rgba(139,92,246,0.14));border:1px solid rgba(99,102,241,0.28);color:#a5b4fc;box-shadow:0 4px 16px rgba(99,102,241,0.12),inset 0 1px 0 rgba(255,255,255,0.06)}
.sb-item.active::after{content:'';position:absolute;left:0;top:22%;bottom:22%;width:3px;border-radius:0 3px 3px 0;background:linear-gradient(180deg,#818cf8,#c084fc);box-shadow:0 0 8px rgba(129,140,248,0.6)}
.sb-item-icon{font-size:16px;flex-shrink:0;transition:transform 0.22s ease}
.sb-item:hover .sb-item-icon{transform:translateX(2px)}
.sb-item.active .sb-item-icon{color:#818cf8}
.sb-footer{padding:14px 10px 20px;border-top:1px solid rgba(255,255,255,0.06);position:relative;z-index:1;flex-shrink:0}
.sb-logout{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.14);border-radius:11px;color:rgba(239,68,68,0.65);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.22s ease;font-family:'DM Sans',sans-serif}
.sb-logout:hover{background:rgba(239,68,68,0.11);border-color:rgba(239,68,68,0.28);color:#f87171}
.sb-logout-icon{font-size:16px}
`;

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  const SidebarContent = (
    <>
      <style>{CSS}</style>
      <div className="sb-wrap">
        {/* LOGO */}
        <div className="sb-logo">
          <div className="sb-logo-text">
            Codelura<span className="sb-logo-dot">.</span>
          </div>
          <div className="sb-logo-badge">
            <span className="sb-logo-badge-dot" />
            Admin Panel
          </div>
        </div>

        {/* NAV */}
        <nav className="sb-nav">
          {Object.entries(groups).map(([groupKey, groupLabel]) => {
            const items = menu.filter((m) => m.group === groupKey);
            if (!items.length) return null;
            return (
              <div key={groupKey}>
                {groupKey !== "main" && <div className="sb-divider" />}
                {groupLabel && <span className="sb-group-label">{groupLabel}</span>}
                {items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`sb-item ${active ? "active" : ""}`}
                    >
                      <item.icon className="sb-item-icon" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="sb-footer">
          <button className="sb-logout" onClick={logout}>
            <HiOutlineLogout className="sb-logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div
        className="md:hidden"
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:40, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"#0a0c17", borderBottom:"1px solid rgba(255,255,255,0.07)", fontFamily:"'DM Sans',sans-serif" }}
      >
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"18px", fontWeight:800, color:"#fff" }}>
          Codelura<span style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>.</span>
        </span>
        <button
          onClick={() => setOpen(true)}
          style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:"10px", padding:"7px", color:"#a5b4fc", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <HiOutlineMenu style={{ fontSize:"18px" }} />
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex"
        style={{ width:"248px", height:"100vh", position:"sticky", top:0, flexShrink:0 }}
      >
        {SidebarContent}
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="md:hidden"
          style={{ position:"fixed", inset:0, zIndex:40, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="md:hidden"
        style={{ position:"fixed", zIndex:50, top:0, left:0, height:"100%", width:"248px" }}
      >
        {SidebarContent}
      </motion.aside>
    </>
  );
}