"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Sparkles } from "lucide-react";

export default function AccountMenu({ jobsAlertUrl }: { jobsAlertUrl: string }) {
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Reading localStorage only after mount avoids a server/client
  // hydration mismatch (server always renders "logged out").
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="desktop-right" style={{ gap: "12px" }}>
      {!role ? (
        <>
          <Link href="/auth/login" style={{ textDecoration: "none" }}>
            <button className="btn-login">Login</button>
          </Link>
          <a href={jobsAlertUrl} className="btn-cta">
            <Sparkles size={14} />
            Job Alerts
          </a>
        </>
      ) : (
        <div ref={ref} style={{ position: "relative" }}>
          <button onClick={() => setOpen((p) => !p)} className="user-btn">
            <div className="user-avatar">
              <User size={14} />
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>Account</span>
            <ChevronDown
              size={14}
              className={`chevron-icon ${open ? "open" : ""}`}
              style={{ color: "#9ca3af" }}
            />
          </button>
          {open && (
            <div
              className="dropdown-panel"
              style={{ position: "absolute", right: 0, marginTop: "10px", minWidth: "180px" }}
            >
              <Link href={role === "admin" ? "/admin" : "/dashboard"} className="dropdown-item">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="dropdown-item">
                Profile
              </Link>
              <Link href="/contact" className="dropdown-item">
                Contact
              </Link>
              <div style={{ height: "1px", background: "#f3f4f6", margin: "4px 0" }} />
              <button onClick={handleLogout} className="logout-btn">
                <span style={{ fontSize: "16px" }}>👋</span> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}