import Link from "next/link";
import { Syne, DM_Sans } from "next/font/google";
import { Briefcase, Wrench, BookOpen, Rocket } from "lucide-react";
import AccountMenu from "./AccountMenu";
import HeaderClient from "./HeaderClient";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-sans" });

const CAREER_URL = "/career";
const BUILD_URL = "/services";

export const NAV_LINKS = [
  { label: "Career",     href: CAREER_URL, external: false, icon: Briefcase, emoji: "💼" },
  { label: "Services",   href: BUILD_URL,   external: false, icon: Wrench,    emoji: "🛠️" },
  { label: "Blogs",      href: "/blogs",    external: false, icon: BookOpen,  emoji: "📘" },
  { label: "Hackathons", href: "/hackathons",external: false,icon: Rocket,    emoji: "🚀" },
];

export default function AppNavbar() {
  return (
    <>
      <style>{`
        /* ─── Fonts ─── */
        .nav-root { font-family: var(--font-dm-sans), sans-serif; }
        .nav-logo { font-family: var(--font-syne), sans-serif; font-weight: 800; letter-spacing: -0.5px; }

        /* ─── Header bar & Container ─── */
        .header-bar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(5, 7, 20, 0.75);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: box-shadow 0.3s, background 0.3s;
        }
        .header-bar.scrolled {
          background: rgba(5, 7, 20, 0.92);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05);
        }
        .nav-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        @media (min-width: 768px) {
          .nav-container {
            padding: 12px 24px;
          }
        }

        /* ─── Nav links ─── */
        .nav-link {
          font-weight: 500; font-size: 0.85rem;
          color: rgba(255,255,255,0.65);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 99px;
        }
        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }


        /* ─── CTA button ─── */
        .btn-cta {
          font-weight: 600; font-size: 0.8rem; color: white;
          padding: 8px 20px; border-radius: 999px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #0ea5e9 100%);
          border: none; cursor: pointer; transition: all 0.25s;
          box-shadow: 0 0 20px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          display: flex; align-items: center; gap: 6px;
          text-decoration: none; letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .btn-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 32px rgba(124,58,237,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .btn-cta:active { transform: translateY(0); }

        /* ─── Login button ─── */
        .btn-login {
          font-weight: 500; font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          padding: 7px 16px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          cursor: pointer; transition: all 0.2s;
          text-decoration: none;
        }
        .btn-login:hover {
          color: white;
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
        }

        /* ─── User account button ─── */
        .user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          cursor: pointer; transition: all 0.2s; color: white;
        }
        .user-btn:hover {
          border-color: rgba(139,92,246,0.4);
          background: rgba(139,92,246,0.08);
        }
        .user-avatar {
          width: 26px; height: 26px; border-radius: 8px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          display: flex; align-items: center; justify-content: center; color: white;
          font-size: 11px; font-weight: 700;
        }

        /* ─── Dropdown ─── */
        .dropdown-panel {
          background: rgba(10, 10, 20, 0.96);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
          overflow: hidden;
          animation: dropFade 0.18s ease;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          transition: background 0.15s, color 0.15s; font-weight: 400;
          text-decoration: none;
        }
        .dropdown-item:hover {
          background: rgba(139,92,246,0.1);
          color: white;
        }

        /* ─── Logout ─── */
        .logout-btn {
          width: 100%; text-align: left; padding: 10px 16px; font-size: 0.85rem;
          color: #f87171; background: none; border: none; cursor: pointer;
          transition: background 0.15s; display: flex; align-items: center; gap: 8px;
        }
        .logout-btn:hover { background: rgba(248,113,113,0.08); }

        /* ─── Mobile menu ─── */
        .mobile-menu {
          background: rgba(5, 7, 20, 0.98);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 20px 16px 24px;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.18s; margin-bottom: 8px;
          color: rgba(255,255,255,0.7);
          font-weight: 500; font-size: 0.9rem; text-decoration: none;
        }
        .mobile-link:hover {
          border-color: rgba(139,92,246,0.3);
          background: rgba(139,92,246,0.08);
          color: white;
          transform: translateX(3px);
        }
        .mobile-cta {
          display: block; text-align: center; margin-top: 16px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #0ea5e9 100%);
          color: white; padding: 13px; border-radius: 14px;
          font-family: var(--font-syne), sans-serif;
          font-weight: 700; font-size: 0.9rem;
          letter-spacing: 0.02em;
          box-shadow: 0 0 24px rgba(124,58,237,0.4);
          transition: all 0.2s; text-decoration: none;
        }
        .mobile-cta:hover { transform: translateY(-1px); box-shadow: 0 0 36px rgba(124,58,237,0.55); }

        /* ─── Mobile toggle ─── */
        .mobile-toggle {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          cursor: pointer; color: rgba(255,255,255,0.7);
          transition: all 0.2s;
        }
        .mobile-toggle:hover {
          border-color: rgba(139,92,246,0.4);
          background: rgba(139,92,246,0.08);
          color: white;
        }

        /* ─── Responsive show/hide ─── */
        .desktop-menu, .desktop-right { display: none; align-items: center; }
        .mobile-toggle { display: flex; }
        @media (min-width: 768px) {
          .desktop-menu, .desktop-right { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }

        /* ─── Chevron ─── */
        .chevron-icon { transition: transform 0.2s; }
        .chevron-icon.open { transform: rotate(180deg); }
      `}</style>

      <HeaderClient className={`header-bar nav-root ${syne.variable} ${dmSans.variable}`}>
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            className="nav-logo"
            style={{
              fontSize: "1.35rem",
              background: "linear-gradient(135deg, #fff 30%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Codelura
          </span>
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase",
              paddingTop: "2px",
            }}
          >
            TECH
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="desktop-menu" style={{ gap: "28px" }}>
          {NAV_LINKS.map(({ label, href, external, icon: Icon }) =>
            external ? (
              <a key={label} href={href} className="nav-link">
                <Icon size={13} style={{ opacity: 0.5 }} />
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className="nav-link">
                <Icon size={13} style={{ opacity: 0.5 }} />
                {label}
              </Link>
            )
          )}
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        {/* RIGHT — auth-aware (client) */}
        <AccountMenu jobsAlertUrl={CAREER_URL} />
      </HeaderClient>
    </>
  );
}