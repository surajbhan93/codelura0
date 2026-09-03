"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Sparkles } from "lucide-react";
import api from "@/lib/api";

export default function AccountMenu({ jobsAlertUrl }: { jobsAlertUrl: string }) {
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "user");

      // Fetch user info dynamically
      api.get("/auth/me")
        .then((res) => {
          if (res?.data?.user) {
            setUser(res.data.user);
            setRole(res.data.user.role || storedRole || "user");
            localStorage.setItem("role", res.data.user.role || storedRole || "user");
          }
        })
        .catch(() => {
          // Token invalid or expired
        });
    } else {
      setIsLoggedIn(false);
      setRole(null);
      setUser(null);
    }
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
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="desktop-right" style={{ gap: "12px" }}>
      {!isLoggedIn ? (
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
              {user?.name ? initial : <User size={14} />}
            </div>
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255, 255, 255, 0.85)" }}>
              {user?.name?.split(" ")[0] || "Account"}
            </span>
            <ChevronDown
              size={14}
              className={`chevron-icon ${open ? "open" : ""}`}
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
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
              <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "4px 0" }} />
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