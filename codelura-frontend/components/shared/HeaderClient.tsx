"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "./Navbar";

/* The only two things that genuinely need client-side state:
   1. scroll shadow on the header
   2. mobile menu open/close (button + panel must share state)
   Everything else (logo, desktop links, account menu) is passed
   in as `children` from the server component and just renders here. */

export default function HeaderClient({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${className} ${scrolled ? "scrolled" : ""}`}>
      <nav className="nav-container">
        {children}

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="mobile-toggle"
          style={{
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
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* MOBILE PANEL — sibling of nav so it spans full header width, same as original */}
      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ label, href, external, emoji }) =>
            external ? (
              <a key={label} href={href} className="mobile-link">
                <span>
                  {emoji} {label}
                </span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </a>
            ) : (
              <Link key={label} href={href} className="mobile-link">
                <span>
                  {emoji} {label}
                </span>
                <span style={{ color: "#c7d2fe" }}>›</span>
              </Link>
            )
          )}
          <Link href="/contact" className="mobile-link">
            <span>📩 Contact</span>
            <span style={{ color: "#c7d2fe" }}>›</span>
          </Link>

          <Link href="https://career.codelura.com/career" className="mobile-cta">
            ✦ Jobs Alert
          </Link>
        </div>
      )}
    </header>
  );
}