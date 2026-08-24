import Image from "next/image";
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
    <footer className="bg-gradient-to-b from-black via-gray-950 to-black text-gray-300">
      {/* MAIN SECTION */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* TOP GRID */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 mb-16">
          {/* ABOUT SECTION */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Codelura<span className="text-blue-500">.</span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                Learn • Build • Grow
              </p>
            </div>

            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Codelura is a premium learning &amp; service platform for developers, students, and
              professionals. Learn with real-world content, unlock premium resources, get mentorship,
              and build high-performance projects.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:hello@codelura.com">hello@codelura.com</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+918123456789">+91 930-527-5932</a>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <span>Sector 62, Noida, India 201309</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Blogs", "/blogs"],
                ["Study Material", "https://career.codelura.com/career/learning/study-material"],
                ["Client Project", "/work"],
                ["tech Services", "https://build.codelura.com/services"],
                ["Membership", "/premium"],
                ["Hackathons", "/hackathons"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-green-500 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["About Us", "/about"],
                ["Give testimonials", "/testimonial"],
                ["Privacy Policy", "/privacy"],
                ["Terms &amp; Conditions", "/terms"],
                ["Refund Policy", "/refund"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-green-400 hover:translate-x-1 transition duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                ["Cookie Policy", "/cookies"],
                ["Data Protection", "/protection"],
                ["GDPR Compliance", "/gdpr"],
                ["Terms of Service", "/terms-of-service"],
                ["Accessibility", "/accessibility"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-purple-400 hover:translate-x-1 transition duration-200 flex items-center gap-1 group"
                  >
                    {label}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            We Provide Technical Services In
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {serviceCountries.map(({ name, flag }) => (
              <div
                key={name}
                className="bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-3 flex items-center gap-2 hover:border-blue-500 hover:bg-blue-500/10 transition duration-200"
              >
                <span className="text-lg">{flag}</span>
                <span className="text-sm text-gray-300">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-900/50 rounded-2xl p-8 mb-16">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">
              Stay Updated With Latest News
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Subscribe to our newsletter and get the latest updates, resources, and exclusive content delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time. See our privacy policy for details.
            </p>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3 mb-16">
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3 flex-wrap">
              {[
                { icon: Facebook, link: "https://facebook.com/codelura", label: "Facebook" },
                { icon: Instagram, link: "https://instagram.com/codelura", label: "Instagram" },
                { icon: Twitter, link: "https://twitter.com/codelura", label: "Twitter" },
                { icon: Linkedin, link: "https://linkedin.com/company/codelura", label: "LinkedIn" },
                { icon: Youtube, link: "https://youtube.com/@codelura", label: "YouTube" },
              ].map(({ icon: Icon, link, label }) => (
                <a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 w-11 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-blue-500 hover:bg-blue-500/10 flex items-center justify-center text-gray-400 hover:text-blue-400 transition duration-200 group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.codelura"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900/50 border border-gray-800 hover:border-green-500 hover:bg-green-500/10 rounded-lg px-4 py-2 flex items-center gap-3 transition duration-200 group"
              >
                <div className="text-green-400 group-hover:scale-110 transition">
                  <Image
                    src="/footer/google-play.svg"
                    alt="Google Play"
                    width={24}
                    height={24}
                    className="invert"
                  />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </a>

              <a
                href="https://apps.apple.com/app/codelura"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900/50 border border-gray-800 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg px-4 py-2 flex items-center gap-3 transition duration-200 group"
              >
                <div className="text-blue-400 group-hover:scale-110 transition">
                  <Image src="/footer/app-store.svg" alt="App Store" width={24} height={24} className="invert" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
              We Accept
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Visa", icon: "💳" },
                { name: "Mastercard", icon: "💳" },
                { name: "PayPal", icon: "🅿️" },
                { name: "Google Pay", icon: "🔵" },
                { name: "Apple Pay", icon: "🍎" },
                { name: "Razorpay", icon: "🟠" },
              ].map(({ name, icon }) => (
                <div
                  key={name}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:border-green-500 hover:bg-green-500/10 transition"
                >
                  <span className="text-xl mb-1">{icon}</span>
                  <p className="text-xs text-gray-400">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/50"></div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-500 text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-2">
              © {currentYear} Codelura Inc. All rights reserved.
              <span className="text-xs">•</span>
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>in India</span>
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-white transition">
              Sitemap
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition">
              Security
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/about" className="text-gray-500 hover:text-white transition">
              Status
            </Link>
          </div>

          <div className="text-xs text-gray-600 text-center md:text-right">
            <p>Version 2.0 • Built with Next.js</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40 hidden lg:flex">
        <a
          href="https://status.codelura.com"
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full px-4 py-2 text-xs font-semibold text-green-300 hover:border-green-400 hover:from-green-500/30 hover:to-emerald-500/30 transition duration-200 flex items-center gap-2"
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          All Systems Operational
        </a>
      </div>
    </footer>
  );
}