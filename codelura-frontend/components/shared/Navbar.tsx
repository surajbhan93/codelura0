import Link from "next/link";
import { Syne, DM_Sans } from "next/font/google";
import { Briefcase, Wrench, BookOpen, Rocket } from "lucide-react";
import AccountMenu from "./AccountMenu";
import HeaderClient from "./HeaderClient";

/* ────────────────────────────────────────────────────────────
   SERVER COMPONENT — no "use client" here.
   Simple flat navbar: Career + Build go to their own subdomains
   (all the sub-content lives there, no dropdown needed on the
   home navbar), plus Blogs + Hackathons as direct links, plus
   Contact.

   Only two things need real browser state, so they're split
   into small client islands:
     - HeaderClient.tsx  ("use client") — scroll shadow +
       mobile menu toggle/panel (share state, kept together)
     - AccountMenu.tsx   ("use client") — reads localStorage
       role, renders login/CTA or account dropdown + logout
   Everything else (logo, links, layout, styles) is rendered
   on the server.
   ──────────────────────────────────────────────────────────── */

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-sans" });

const CAREER_URL = "https://career.codelura.com/career";
const BUILD_URL = "https://build.codelura.com/";

// Single source of truth for the simple link list — used by
// both the desktop row (server-rendered) and the mobile panel
// (rendered inside the client island).
export const NAV_LINKS = [
  { label: "Career", href: CAREER_URL, external: true, icon: Briefcase, emoji: "💼" },
  { label: "Services", href: BUILD_URL, external: true, icon: Wrench, emoji: "🛠️" },
  { label: "Blogs", href: "/blogs", external: false, icon: BookOpen, emoji: "📘" },
  { label: "Hackathons", href: "/hackathons", external: false, icon: Rocket, emoji: "🚀" },
];

export default function AppNavbar() {
  return (
    <>
      <style>{`
        .nav-root { font-family: var(--font-dm-sans), sans-serif; }
        .nav-logo { font-family: var(--font-syne), sans-serif; font-weight: 800; letter-spacing: -0.5px; }

        .nav-link {
          font-weight: 500;
          font-size: 0.875rem;
          color: #374151;
          transition: color 0.2s;
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        .nav-link:hover { color: #4f46e5; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 99px;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

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
          display: flex; align-items: center; gap: 10px;
          padding: 11px 18px; font-size: 0.875rem; color: #374151;
          transition: background 0.15s, color 0.15s; font-weight: 400;
          text-decoration: none;
        }
        .dropdown-item:hover { background: linear-gradient(90deg, #f0f0ff, #f5f3ff); color: #4338ca; }

        .btn-login {
          font-weight: 500; font-size: 0.875rem; color: #374151;
          padding: 8px 18px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          background: white; cursor: pointer; transition: all 0.2s;
        }
        .btn-login:hover { border-color: #a5b4fc; color: #4338ca; background: #f5f3ff; }

        .btn-cta {
          font-weight: 600; font-size: 0.875rem; color: white;
          padding: 9px 22px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          display: flex; align-items: center; gap: 6px;
          text-decoration: none;
        }
        .btn-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .btn-cta:active { transform: translateY(0); }

        .user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          background: white; cursor: pointer; transition: all 0.2s;
        }
        .user-btn:hover { border-color: #a5b4fc; background: #f5f3ff; }
        .user-avatar {
          width: 28px; height: 28px; border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center; color: white;
        }

        .logout-btn {
          width: 100%; text-align: left; padding: 11px 18px; font-size: 0.875rem;
          color: #ef4444; background: none; border: none; cursor: pointer;
          transition: background 0.15s; display: flex; align-items: center; gap: 8px;
        }
        .logout-btn:hover { background: #fef2f2; }

        .mobile-menu {
          background: linear-gradient(160deg, #fafafa 0%, #f5f3ff 100%);
          border-top: 1px solid rgba(99,102,241,0.1);
          padding: 24px 20px 28px;
          animation: slideDown 0.22s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; border-radius: 12px; background: white;
          border: 1px solid #f0eeff; box-shadow: 0 1px 4px rgba(99,102,241,0.06);
          transition: all 0.18s; margin-bottom: 10px; color: #1f2937;
          font-weight: 500; font-size: 0.9rem; text-decoration: none;
        }
        .mobile-link:hover { border-color: #c7d2fe; background: #f5f3ff; transform: translateX(2px); }
        .mobile-cta {
          display: block; text-align: center; margin-top: 20px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white; padding: 14px; border-radius: 14px;
          font-family: var(--font-syne), sans-serif; font-weight: 700; font-size: 0.95rem;
          letter-spacing: 0.01em; box-shadow: 0 6px 20px rgba(99,102,241,0.35);
          transition: all 0.2s; text-decoration: none;
        }
        .mobile-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }

        .header-bar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid #f0eeff;
          transition: box-shadow 0.3s;
        }
        .header-bar.scrolled { box-shadow: 0 4px 30px rgba(99,102,241,0.08); }

        .chevron-icon { transition: transform 0.2s; }
        .chevron-icon.open { transform: rotate(180deg); }

        .desktop-menu, .desktop-right { display: none; align-items: center; }
        .mobile-toggle { display: flex; }
        @media (min-width: 768px) {
          .desktop-menu, .desktop-right { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>

      <HeaderClient className={`header-bar nav-root ${syne.variable} ${dmSans.variable}`}>
        {/* LOGO */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="nav-logo" style={{ fontSize: "1.5rem", color: "#111827" }}>
            Codelura<span style={{ color: "#6366f1" }}>.</span>
          </span>
        </Link>

        {/* DESKTOP MENU — flat links, no dropdown */}
        <div className="desktop-menu" style={{ gap: "32px" }}>
          {NAV_LINKS.map(({ label, href, external, icon: Icon }) =>
            external ? (
              <a key={label} href={href} className="nav-link">
                <Icon size={15} style={{ color: "#9ca3af" }} />
                {label}
              </a>
            ) : (
              <Link key={label} href={href} className="nav-link">
                <Icon size={15} style={{ color: "#9ca3af" }} />
                {label}
              </Link>
            )
          )}
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        {/* RIGHT SIDE (auth-aware, client) */}
        <AccountMenu jobsAlertUrl={CAREER_URL} />
      </HeaderClient>
    </>
  );
}