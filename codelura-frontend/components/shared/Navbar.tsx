"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  User,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Code2,
  Users,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ---------------- NAVBAR ---------------- */

export default function AppNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [role, setRole] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role");
    }
    return null;
  });

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
        }
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: #374151;
          transition: color 0.2s;
          position: relative;
        }
        .nav-link:hover {
          color: #4f46e5;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 99px;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }

        .dropdown-panel {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(79,70,229,0.12), 0 4px 16px rgba(0,0,0,0.06);
          overflow: hidden;
          animation: dropFade 0.18s ease;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 18px;
          font-size: 0.875rem;
          color: #374151;
          transition: background 0.15s, color 0.15s;
          font-weight: 400;
        }
        .dropdown-item:hover {
          background: linear-gradient(90deg, #f0f0ff, #f5f3ff);
          color: #4338ca;
        }
        .dropdown-item .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          flex-shrink: 0;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .dropdown-item:hover .dot {
          opacity: 1;
        }

        .btn-login {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          color: #374151;
          padding: 8px 18px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-login:hover {
          border-color: #a5b4fc;
          color: #4338ca;
          background: #f5f3ff;
        }

        .btn-cta {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: white;
          padding: 9px 22px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.45);
        }
        .btn-cta:active {
          transform: translateY(0);
        }

        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-btn:hover {
          border-color: #a5b4fc;
          background: #f5f3ff;
        }
        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        /* Mobile */
        .mobile-menu {
          background: linear-gradient(160deg, #fafafa 0%, #f5f3ff 100%);
          border-top: 1px solid rgba(99,102,241,0.1);
          padding: 24px 20px 28px;
          animation: slideDown 0.22s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 10px;
          padding-left: 4px;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          background: white;
          border: 1px solid #f0eeff;
          box-shadow: 0 1px 4px rgba(99,102,241,0.06);
          transition: all 0.18s;
          margin-bottom: 8px;
          color: #1f2937;
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
        }
        .mobile-link:hover {
          border-color: #c7d2fe;
          background: #f5f3ff;
          transform: translateX(2px);
        }
        .mobile-cta {
          display: block;
          text-align: center;
          margin-top: 20px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 14px;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 20px rgba(99,102,241,0.35);
          transition: all 0.2s;
          text-decoration: none;
        }
        .mobile-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.45);
        }

        .header-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #f0eeff;
          transition: box-shadow 0.3s;
        }
        .header-bar.scrolled {
          box-shadow: 0 4px 30px rgba(99,102,241,0.08);
        }

        .chevron-icon {
          transition: transform 0.2s;
        }
        .chevron-icon.open {
          transform: rotate(180deg);
        }
      `}</style>

      <header className={`header-bar nav-root ${scrolled ? "scrolled" : ""}`}>
        <nav
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LOGO */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="nav-logo" style={{ fontSize: "1.5rem", color: "#111827" }}>
              Codelura<span style={{ color: "#6366f1" }}>.</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div
            style={{
              display: "none",
              gap: "32px",
              alignItems: "center",
            }}
            className="desktop-menu"
          >
            <style>{`@media(min-width:768px){.desktop-menu{display:flex!important;}}`}</style>

            <ClickDropdown
              label="Learn"
              icon={<BookOpen size={15} />}
              items={[
                { label: "Blogs & Guides", href: "/blogs" },
                { label: "Study Materials", href: "/courses" },
              ]}
            />
            <ClickDropdown
              label="Build"
              icon={<Code2 size={15} />}
              items={[
                { label: "Development Services", href: "/services" },
                { label: "My Work", href: "/work" },
                { label: "Hackathons", href: "/hackathons" },
              ]}
            />
            <ClickDropdown
              label="Mentorship"
              icon={<Users size={15} />}
              items={[
                { label: "1-to-1 Guidance", href: "https://topmate.io/talkwithsuraj/" },
                { label: "Career Programs", href: "/programs" },
                { label: "Membership Plans", href: "/premium" },
              ]}
            />
            <Link href="/contact" className="nav-link" style={{ textDecoration: "none" }}>
              Contact
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{ display: "none", alignItems: "center", gap: "12px" }}
            className="desktop-right"
          >
            <style>{`@media(min-width:768px){.desktop-right{display:flex!important;}}`}</style>

            {!role ? (
              <>
                <Link href="/auth/login" style={{ textDecoration: "none" }}>
                  <button className="btn-login">Login</button>
                </Link>
                <Link href="/pricing" style={{ textDecoration: "none" }}>
                  <button className="btn-cta">
                    <Sparkles size={14} />
                    Get Started
                  </button>
                </Link>
              </>
            ) : (
              <div ref={accountRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setAccountOpen((p) => !p)}
                  className="user-btn"
                >
                  <div className="user-avatar">
                    <User size={14} />
                  </div>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>
                    Account
                  </span>
                  <ChevronDown
                    size={14}
                    className={`chevron-icon ${accountOpen ? "open" : ""}`}
                    style={{ color: "#9ca3af" }}
                  />
                </button>

                {accountOpen && (
                  <div
                    className="dropdown-panel"
                    style={{ position: "absolute", right: 0, marginTop: "10px", minWidth: "180px" }}
                  >
                    <NavItem href={role === "admin" ? "/admin" : "/dashboard"}>
                      Dashboard
                    </NavItem>
                    <NavItem href="/profile">Profile</NavItem>
                    <NavItem href="/contact">Contact</NavItem>
                    <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0" }} />
                    <button
                     onClick={async () => {
                            try {
                              await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                                method: "POST",
                                credentials: "include"
                              });

                              localStorage.removeItem("role");

                              window.location.href = "/auth/login";

                            } catch (err) {
                              console.error("Logout failed", err);
                            }
                          }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "11px 18px",
                        fontSize: "0.875rem",
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <span style={{ fontSize: "16px" }}>👋</span> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              border: "1.5px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              color: "#374151",
            }}
            className="mobile-toggle"
          >
            <style>{`@media(min-width:768px){.mobile-toggle{display:none!important;}}`}</style>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="mobile-menu">
            <div style={{ marginBottom: "20px" }}>
              <p className="mobile-section-label">LEARN</p>
              <Link href="/blogs" className="mobile-link">
                <span>📘 Blogs & Guides</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
              <Link href="/courses" className="mobile-link">
                <span>📚 Study Material</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <p className="mobile-section-label">BUILD</p>
              <Link href="/services" className="mobile-link">
                <span>💻 Tech Services</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
              <Link href="/work" className="mobile-link">
                <span>🧑‍💻 My Work</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
              <Link href="/hackathons" className="mobile-link">
                <span>🚀 Hackathons</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
            </div>

            <div style={{ marginBottom: "4px" }}>
              <p className="mobile-section-label">CAREER</p>
              <Link href="/premium" className="mobile-link">
                <span>⭐ Membership Plan</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
              <Link href="/contact" className="mobile-link">
                <span>📩 Contact</span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
            </div>

            <Link href="/premium" className="mobile-cta">
              ✦ Upgrade to Pro
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

/* ---------------- CLICK DROPDOWN ---------------- */

function ClickDropdown({
  label,
  icon,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="nav-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <span style={{ color: open ? "#6366f1" : "#9ca3af" }}>{icon}</span>
        <span style={{ color: open ? "#4338ca" : undefined }}>{label}</span>
        <ChevronDown
          size={13}
          className={`chevron-icon ${open ? "open" : ""}`}
          style={{ color: "#9ca3af" }}
        />
      </button>

      {open && (
        <div
          className="dropdown-panel"
          style={{ position: "absolute", left: 0, marginTop: "10px", minWidth: "210px" }}
        >
          {items.map((item) => (
            <NavItem key={item.label} href={item.href}>
              {item.label}
            </NavItem>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE ---------------- */

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="dropdown-item" style={{ textDecoration: "none" }}>
      <span className="dot" />
      {children}
    </Link>
  );
}