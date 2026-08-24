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

// Extracted constants
const COMMUNITY_SLUG = "/career/community";
const GET_STARTED_SLUG = "/auth/login";
const AUTH_LOGIN = "/auth/login";

// Memoized utility functions
const getTagStyles = (tag) => {
  const styles = {
    New: "bg-emerald-50 text-emerald-600",
    Hot: "bg-rose-50 text-rose-600",
    Live: "bg-blue-50 text-blue-600",
    Popular: "bg-amber-50 text-amber-600",
    Featured: "bg-indigo-50 text-indigo-600",
  };
  return styles[tag] || "bg-indigo-50 text-indigo-600";
};

// Separate component for menu items to prevent re-renders
const MenuItem = memo(({ item, index, isOpen, onMouseEnter, onToggle }) => {
  const Icon = item.icon;
  const itemRef = useRef(null);

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={() => onMouseEnter(index)}
    >
      <button
        onClick={() => onToggle(index)}
        className={`relative z-10 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-semibold transition-all duration-200 ${
          isOpen
            ? "text-indigo-700 bg-indigo-50/50"
            : "text-slate-700 hover:text-indigo-700"
        }`}
        aria-expanded={isOpen}
      >
        <Icon size={16} className="opacity-70" />
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
});

MenuItem.displayName = "MenuItem";

// Separate component for dropdown content
const DropdownContent = memo(({ menu, isOpen }) => {
  const Icon = menu.icon;

  if (!isOpen) return null;

  return (
    <div className="absolute left-1/2 top-full z-20 mt-2 w-[420px] -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl p-4 shadow-2xl shadow-slate-900/[0.08]">
      <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3">
        <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 p-1.5">
          <Icon size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{menu.label}</p>
          <p className="text-xs text-slate-500">{menu.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-0.5">
        {menu.items.map((item) => (
          <Link
            key={item.label}
            href={item.slug}
            className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-violet-50/80 hover:text-indigo-700"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
              {item.label}
              {item.tag && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${getTagStyles(
                    item.tag
                  )}`}
                >
                  {item.tag}
                </span>
              )}
            </span>
            <ArrowUpRight
              size={13}
              className="shrink-0 text-slate-300 opacity-0 transition-all group-hover:opacity-100 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

DropdownContent.displayName = "DropdownContent";

// Main Navbar component
export default function Navbar() {
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // User Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Check login status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("role");
      if (token) {
        setIsLoggedIn(true);
        setRole(userRole);
      }
    }
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // ignore
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/auth/login";
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = useMemo(() => MENU, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-lg shadow-slate-900/[0.03]"
          : "bg-white/70 backdrop-blur-md border-transparent"
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 lg:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/career"
          className="group flex shrink-0 items-baseline gap-1.5 select-none"
          aria-label="Codelura Careers Home"
        >
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">Codelura</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              .
            </span>
          </span>
          <span className="hidden border-l border-slate-200 pl-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:inline">
            Careers
          </span>
          <span className="ml-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Beta
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="relative hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {navItems.map((menu, index) => (
            <div key={menu.label} className="relative">
              <MenuItem
                item={menu}
                index={index}
                isOpen={openIndex === index}
                onMouseEnter={() => {}}
                onToggle={toggleMenu}
              />
              <DropdownContent menu={menu} isOpen={openIndex === index} />
            </div>
          ))}

          <Link
            href={COMMUNITY_SLUG}
            className="relative z-10 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[15px] font-semibold text-slate-700 transition-all hover:text-indigo-700"
          >
            <MessageCircle size={16} className="opacity-70" />
            Community
          </Link>
        </div>

        {/* Desktop CTA & Account Dropdown */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-indigo-200"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold">
                  <User size={14} />
                </div>
                <span>{role === "admin" ? "Admin Account" : "My Account"}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl backdrop-blur-xl space-y-1">
                  <Link
                    href={role === "admin" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    👤 Profile Settings
                  </Link>
                  <Link
                    href="/career/learning/programs"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    📚 Enrolled Programs
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={AUTH_LOGIN}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href={GET_STARTED_SLUG}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Sparkles size={16} />
                  Get Started
                </span>
                <ArrowUpRight
                  size={15}
                  className="relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="relative rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          {!mobileOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`overflow-hidden border-t border-slate-100/80 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        }`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-1 px-4 py-4">
          {navItems.map((menu, index) => {
            const Icon = menu.icon;
            const expanded = mobileExpanded === index;
            return (
              <div key={menu.label} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => toggleMobileExpanded(index)}
                  className="flex w-full items-center justify-between py-3.5 text-left"
                  aria-expanded={expanded}
                >
                  <span className="flex items-center gap-3 text-[15px] font-semibold text-slate-800">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 p-1.5">
                      <Icon size={16} className="text-indigo-600" />
                    </div>
                    {menu.label}
                    <span className="text-xs font-normal text-slate-400">
                      {menu.description}
                    </span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    expanded ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden pl-10">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.slug}
                        className="flex items-center justify-between rounded-lg py-2.5 text-sm text-slate-600 transition-colors hover:text-indigo-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          {item.label}
                          {item.tag && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${getTagStyles(
                                item.tag
                              )}`}
                            >
                              {item.tag}
                            </span>
                          )}
                        </span>
                        <ArrowUpRight size={13} className="text-slate-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href={COMMUNITY_SLUG}
            className="flex items-center gap-3 py-3.5 text-[15px] font-semibold text-slate-800"
            onClick={() => setMobileOpen(false)}
          >
            <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 p-1.5">
              <MessageCircle size={16} className="text-indigo-600" />
            </div>
            Community
          </Link>

          <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-slate-100">
            {isLoggedIn ? (
              <>
                <Link
                  href={role === "admin" ? "/admin" : "/dashboard"}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  📊 Dashboard ({role === "admin" ? "Admin" : "User"})
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={AUTH_LOGIN}
                  className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href={GET_STARTED_SLUG}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25"
                  onClick={() => setMobileOpen(false)}
                >
                  <Sparkles size={16} />
                  Get Started
                  <ArrowUpRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}