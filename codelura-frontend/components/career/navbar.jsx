"use client";

import Link from "next/link";
import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import api from "@/lib/api";
import {
  ChevronDown,
  Briefcase,
  GraduationCap,
  Users,
  Wrench,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  User,
  LayoutDashboard,
  Award,
  LogOut,
  Settings,
  Flame,
  Zap,
} from "lucide-react";

// Memoized menu data to prevent re-creation
const MENU = [
  {
    label: "Jobs",
    icon: Briefcase,
    description: "Find your dream role",
    items: [
      { label: "Latest Jobs", slug: "/career/jobs/latest", tag: "Live" },
      { label: "Internships", slug: "/career/jobs/internships" },
      { label: "Full Time", slug: "/career/jobs/full-time" },
      { label: "Premium Referral (🔥)", slug: "/career/jobs/premium" },
      { label: "Companies", slug: "/career/jobs/companies" },
      { label: "Off-campus Drives", slug: "/career/jobs/off-campus-drives" },
      { label: "Walk-in Drives", slug: "/career/jobs/walk-in-drives" },
      { label: "Codelura Hiring", slug: "/career/jobs/codelura-hiring", tag: "Featured" },
    ],
  },
  {
    label: "Learning",
    icon: GraduationCap,
    description: "Upskill yourself",
    items: [
      { label: "Courses", slug: "/career/learning/programs" },
      { label: "Study Material", slug: "/career/learning/study-material" },
      { label: "Career Tracks", slug: "/career/learning/career-tracks" },
      { label: "Certifications", slug: "/career/learning/certifications", tag: "Popular" },
    ],
  },
  {
    label: "Mentorship",
    icon: Users,
    description: "Learn from experts",
    items: [
      { label: "Find Mentors", slug: "/career/mentorship/find-mentors", tag: "Hot" },
      { label: "1:1 Mentorship", slug: "/career/mentorship/one-on-one" },
      { label: "Mock Interviews", slug: "/career/mentorship/mock-interviews" },
      { label: "Resume Review", slug: "/career/mentorship/resume-review" },
      { label: "LinkedIn Review", slug: "/career/mentorship/linkedin-review" },
      { label: "Portfolio Review", slug: "/career/mentorship/portfolio-review" },
      { label: "Career Guidance", slug: "/career/mentorship/career-guidance" },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    description: "Boost your career",
    items: [
      { label: "ATS Resume Checker", slug: "/career/tools/ats-resume-checker" },
      { label: "Resume Builder", slug: "/career/tools/resume-builder" },
      { label: "Resume Templates", slug: "/career/tools/resume-templates" },
      { label: "Cover Letter Generator", slug: "/career/tools/cover-letter-generator" },
      { label: "Salary Calculator", slug: "/career/tools/salary-calculator" },
      { label: "Skill Gap Analysis", slug: "/career/tools/skill-gap-analysis" },
      { label: "AI Career Coach", slug: "/career/tools/ai-career-coach", tag: "New" },
    ],
  },
];

const COMMUNITY_SLUG = "/career/community";
const AUTH_LOGIN = "/login";
const AUTH_SIGNUP = "/signup";

const getTagStyles = (tag) => {
  const styles = {
    New: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Hot: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    Live: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    Popular: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    Featured: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  };
  return styles[tag] || "bg-violet-500/10 text-violet-400 border border-violet-500/20";
};

// Separate component for menu items
const MenuItem = memo(({ item, index, isOpen, onToggle }) => {
  const Icon = item.icon;
  const itemRef = useRef(null);

  return (
    <div ref={itemRef} className="relative">
      <button
        onClick={() => onToggle(index)}
        className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
          isOpen
            ? "text-white bg-white/10 shadow-sm"
            : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
        }`}
        aria-expanded={isOpen}
      >
        <Icon size={14} className="opacity-70 text-violet-400" />
        {item.label}
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-violet-400" : ""
          }`}
        />
      </button>
    </div>
  );
});

MenuItem.displayName = "MenuItem";

// Separate component for dropdown content
const DropdownContent = memo(({ menu, isOpen, onClose }) => {
  const Icon = menu.icon;

  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 top-full z-50 mt-2 w-[420px] -translate-x-1/2 rounded-2xl border border-white/[0.08] bg-[#0b0e20]/95 backdrop-blur-2xl p-4 shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-150">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/10 border border-violet-500/20 px-4 py-2.5">
        <div className="rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 p-1.5 shadow-md shadow-violet-600/30">
          <Icon size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">{menu.label}</p>
          <p className="text-[11px] text-slate-400">{menu.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {menu.items.map((item) => (
          <Link
            key={item.label}
            href={item.slug}
            onClick={onClose}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
          >
            <span className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-violet-400 transition-colors" />
              <span className="truncate">{item.label}</span>
              {item.tag && (
                <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold ${getTagStyles(item.tag)}`}>
                  {item.tag}
                </span>
              )}
            </span>
            <ArrowUpRight
              size={12}
              className="shrink-0 text-slate-500 opacity-0 transition-all group-hover:opacity-100 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

DropdownContent.displayName = "DropdownContent";

export default function CareerNavbar() {
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // User Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Check login status and fetch profile on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "user");

      api.get("/auth/me")
        .then((res) => {
          if (res?.data?.user) {
            setUser(res.data.user);
            setIsLoggedIn(true);
            setRole(res.data.user.role || storedRole || "user");
            localStorage.setItem("role", res.data.user.role || storedRole || "user");
          }
        })
        .catch(() => {
          // Keep state if offline or token still active
        });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout").catch(() => null);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  // Handle click outside
  const handleClickOutside = useCallback((e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setOpenIndex(null);
    }
    if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
      setUserDropdownOpen(false);
    }
  }, []);

  // Handle scroll
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 8;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  const toggleMenu = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
    if (mobileOpen) {
      setMobileExpanded(null);
    }
  }, [mobileOpen]);

  const toggleMobileExpanded = useCallback((index) => {
    setMobileExpanded((prev) => (prev === index ? null : index));
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleClickOutside, handleScroll]);

  const navItems = useMemo(() => MENU, []);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full border-b transition-all duration-250 ${
        scrolled
          ? "bg-[#07091a]/90 backdrop-blur-xl border-white/[0.08] shadow-2xl shadow-black/50"
          : "bg-[#07091a]/75 backdrop-blur-md border-white/[0.05]"
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 lg:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 select-none"
          aria-label="Codelura Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-violet-600/30 group-hover:scale-105 transition">
            <div className="w-full h-full bg-[#0a0c1e] rounded-[10px] flex items-center justify-center font-black text-sm text-white">
              C
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-violet-300 transition">
              Codelura
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30 text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">
              Careers
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="relative hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navItems.map((menu, index) => (
            <div key={menu.label} className="relative">
              <MenuItem
                item={menu}
                index={index}
                isOpen={openIndex === index}
                onToggle={toggleMenu}
              />
              <DropdownContent
                menu={menu}
                isOpen={openIndex === index}
                onClose={() => setOpenIndex(null)}
              />
            </div>
          ))}

          <Link
            href={COMMUNITY_SLUG}
            className="relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 transition-all hover:text-white hover:bg-white/[0.06]"
          >
            <MessageCircle size={14} className="opacity-70 text-violet-400" />
            Community
          </Link>
        </div>

        {/* Desktop CTA & Account Menu */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-white/[0.08] hover:border-violet-500/40"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-[11px] font-extrabold text-white shadow-sm shadow-violet-600/30">
                  {initial}
                </div>
                <span className="font-semibold text-slate-100">{firstName}</span>
                <ChevronDown
                  size={13}
                  className={`text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-violet-400" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0e20]/95 p-2 shadow-2xl backdrop-blur-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                    <p className="text-xs font-bold text-white truncate">{user?.name || "Student"}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email || ""}</p>
                  </div>
                  <Link
                    href={role === "admin" ? "/admin" : "/dashboard/Portal"}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-violet-600/20 hover:text-white transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <LayoutDashboard size={14} className="text-violet-400" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-violet-600/20 hover:text-white transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <User size={14} className="text-indigo-400" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/dashboard/campus"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-violet-600/20 hover:text-white transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <GraduationCap size={14} className="text-pink-400" />
                    Campus Program <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300">HOT</span>
                  </Link>
                  <Link
                    href="/dashboard/programs"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-violet-600/20 hover:text-white transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Award size={14} className="text-emerald-400" />
                    My Learning
                  </Link>
                  <div className="my-1 border-t border-white/[0.06]" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href={AUTH_LOGIN}
                className="rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 transition-colors hover:text-white hover:bg-white/[0.06] border border-white/[0.08]"
              >
                Login
              </Link>
              <Link
                href={AUTH_SIGNUP}
                className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all duration-300 hover:shadow-violet-600/40 hover:scale-105 active:scale-95"
              >
                <Sparkles size={13} />
                <span>Get Started</span>
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="relative rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/[0.06] lg:hidden border border-white/[0.08]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`overflow-hidden border-t border-white/[0.06] bg-[#07091a]/98 backdrop-blur-2xl transition-all duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-[85vh] overflow-y-auto" : "max-h-0"
        }`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navItems.map((menu, index) => {
            const Icon = menu.icon;
            const expanded = mobileExpanded === index;
            return (
              <div key={menu.label} className="border-b border-white/[0.06] last:border-0">
                <button
                  onClick={() => toggleMobileExpanded(index)}
                  className="flex w-full items-center justify-between py-3 text-left"
                  aria-expanded={expanded}
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-slate-200">
                    <div className="rounded-lg bg-violet-600/20 p-1.5 border border-violet-500/20">
                      <Icon size={14} className="text-violet-400" />
                    </div>
                    {menu.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      expanded ? "rotate-180 text-violet-400" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    expanded ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-1 overflow-hidden pl-8">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.slug}
                        className="flex items-center justify-between rounded-lg py-2 text-xs font-medium text-slate-300 transition-colors hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          {item.label}
                          {item.tag && (
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${getTagStyles(
                                item.tag
                              )}`}
                            >
                              {item.tag}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight size={12} className="text-slate-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href={COMMUNITY_SLUG}
            className="flex items-center gap-2.5 py-3 text-sm font-semibold text-slate-200"
            onClick={() => setMobileOpen(false)}
          >
            <div className="rounded-lg bg-violet-600/20 p-1.5 border border-violet-500/20">
              <MessageCircle size={14} className="text-violet-400" />
            </div>
            Community
          </Link>

          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
            {isLoggedIn ? (
              <>
                <Link
                  href={role === "admin" ? "/admin" : "/dashboard/Portal"}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/[0.06]"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard size={14} className="text-violet-400" />
                  Dashboard ({role === "admin" ? "Admin" : firstName})
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-white hover:bg-white/[0.06]"
                  onClick={() => setMobileOpen(false)}
                >
                  <User size={14} className="text-indigo-400" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={AUTH_LOGIN}
                  className="flex items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/[0.08]"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={AUTH_SIGNUP}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/30"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles size={14} />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}