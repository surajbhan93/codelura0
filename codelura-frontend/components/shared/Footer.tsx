import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  Heart,
  Globe,
  Sparkles,
  Shield,
} from "lucide-react";

export default function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  const serviceCountries = [
    { name: "India", flag: "🇮🇳" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "USA", flag: "🇺🇸" },
    { name: "UK", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "UAE", flag: "🇦🇪" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#03040b] text-slate-400 border-t border-white/5">
      {/* Premium ambient glows */}
      <div className="pointer-events-none absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-indigo-950/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 right-1/4 h-96 w-96 rounded-full bg-cyan-950/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1536px] px-4 sm:px-8 md:px-12 lg:px-16 pt-20 pb-10">
        
        {/* ─── Main Footer Grid ─── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-8 pb-16 border-b border-white/5">
          
          {/* Brand & Socials (Col span 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Codelura
                </span>
              </Link>

              <p className="mt-3 text-xs tracking-wider text-slate-500 uppercase font-semibold font-mono">
                Learn • Build • Grow
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Codelura is a premium ecosystem for developers, innovators, and businesses. We build cutting-edge software and help developers accelerate their careers.
            </p>

            {/* Official Support Email */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:support@codelura.com"
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition"
              >
                <Mail size={14} className="text-indigo-400" />
                <span>support@codelura.com</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Linkedin, href: "https://linkedin.com/company/codelura", label: "LinkedIn" },
                { Icon: Instagram, href: "https://instagram.com/codelura", label: "Instagram" },
                { Icon: Twitter, href: "https://twitter.com/codelura", label: "Twitter" },
                { Icon: Facebook, href: "https://facebook.com/codelura", label: "Facebook" },
                { Icon: Youtube, href: "https://youtube.com/@codelura", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                  aria-label={label}
                >
                  <Icon size={15} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1: Agency Services */}
          <div className="space-y-4">

            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
              Agency Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Websites & Web Apps", href: "/services" },
                { label: "Custom CRM & ERP", href: "/services" },
                { label: "Custom AI Bots & Workflow Automation", href: "/services/ai-development" },
                { label: "GBP Audit / Google SEO", href: "https://vyaparsetiai.codelura.com/dental-audit", external: true },
                { label: "UI/UX Product Design", href: "/services" },
              ].map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Career Hub */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
              Career Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Job Alerts", href: "/career/jobs/latest" },
                { label: "Study Notes", href: "/career/learning/study-material" },
                { label: "Hackathons", href: "/hackathons" },
                { label: "Career Tracks", href: "/career/learning/career-tracks" },
                { label: "Campus Program", href: "/dashboard/campus" },
                { label: "Premium Membership", href: "/premium" },
              ].map((link: any) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>



          {/* Links Column 3: Company */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Team", href: "/services/team" },
                { label: "Client Reviews", href: "/testimonial" },
                { label: "Our Work", href: "/work" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 4: Newsletter & Legal */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                Newsletter
              </h4>
              <div className="space-y-3">
                <p className="text-xs text-slate-500 leading-normal">
                  Subscribe to our weekly tech drops.
                </p>
                <div className="relative flex items-center rounded-xl border border-white/10 bg-white/[0.02] p-1.5 focus-within:border-indigo-500/50">
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    aria-label="Subscribe"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Legal
              </h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/refund" className="hover:text-white transition-colors">Refund</Link>
              </div>
            </div>
          </div>


        </div>

        {/* ─── Middle Section: Locations & Badges ─── */}
        <div className="py-12 border-b border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Countries / Global Presence */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500 font-mono">
              <Globe size={13} className="text-slate-500" />
              <span>We serve globally</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {serviceCountries.map((c) => (
                <div
                  key={c.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.01] px-3.5 py-1 text-xs text-slate-400 hover:border-indigo-500/20 hover:text-white transition-all cursor-default"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secure / Badges */}
          <div className="flex flex-col sm:flex-row items-start md:items-end md:justify-end gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] px-4 py-2">
              <Shield size={14} className="text-cyan-400" />
              <div className="text-left">
                <p className="font-semibold text-slate-300">100% Secure Checkout</p>
                <p className="text-[10px] text-slate-500">SSL Encrypted Gateway</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-600 font-mono">
              <span>💳 Visa</span>
              <span>•</span>
              <span>PayPal</span>
              <span>•</span>
              <span>Razorpay</span>
            </div>
          </div>

        </div>

        {/* ─── Bottom Footer Strip ─── */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          
          <div className="flex items-center gap-1">
            <span>© {currentYear} Codelura Inc.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={11} className="text-red-500 fill-red-500 animate-pulse" /> in India
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Sitemap</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Security</Link>
            <Link href="/about" className="hover:text-white transition-colors">Status</Link>
          </div>

          {/* System Monitor Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-medium text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Systems Normal</span>
          </div>

        </div>

      </div>
    </footer>
  );
}