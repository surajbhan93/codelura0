import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./ContactForm";

// ============================================
// SEO — metadata is generated at build time on
// the server, so it's in the initial HTML for
// crawlers (no client JS needed to see it).
// ============================================
export const metadata: Metadata = {
  title: "Contact Us | Codelura",
  description:
    "Have a question, idea, or want to collaborate? Reach out to the Codelura team for hackathons, membership, study notes, and general queries. We reply within 24 hours.",
  keywords: [
    "Codelura contact",
    "Codelura support",
    "contact Codelura team",
    "Codelura hackathon query",
    "Codelura membership help",
  ],
  alternates: {
    canonical: "https://www.codelura.com/contact",
  },
  openGraph: {
    title: "Contact Codelura",
    description:
      "Reach out to the Codelura team for hackathons, membership, notes, and collaboration. We reply within 24 hours.",
    url: "https://www.codelura.com/contact",
    siteName: "Codelura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Codelura",
    description:
      "Reach out to the Codelura team for hackathons, membership, notes, and collaboration.",
  },
};

const TOPICS = [
  "General Queries",
  "Hackathons",
  "Membership",
  "Study Notes",
  "Collaboration",
  "Feedback",
];

const STATS = [
  { value: "24h", label: "Avg. Reply" },
  { value: "50k+", label: "Community" },
  { value: "100%", label: "Replied" },
];

// Structured data helps Google show a richer result
// (org name, email, phone) directly in search.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Codelura",
  url: "https://www.codelura.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Codelura",
    email: "contact@codelura.com",
    telephone: "+91-9336289192",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@codelura.com",
        telephone: "+91-9336289192",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  },
};

// ============================================
// SERVER COMPONENT — everything except the form
// itself is static markup rendered on the server.
// Only <ContactForm /> ships client JS.
// ============================================
export default function GeneralContactPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="border-b border-white/10 py-10">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="rounded-full border border-[#2D82DC]/30 bg-[#2D82DC]/10 px-4 py-2 text-xs sm:text-sm text-[#5FB0FF]">
            Contact Us
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            We&apos;d Love to Hear
            <span className="block text-[#5FB0FF]">From You</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8FA3C7] sm:text-lg sm:leading-8">
            Have a question, idea, or just want to say hello? Drop us a
            message — we read every single one and reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-5">
          {/* LEFT — static contact info, no client JS needed */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            {/* Free Consultation card */}
            <div className="rounded-2xl border border-[#2D82DC]/30 bg-[#2D82DC]/10 p-6">
              <h2 className="text-lg font-semibold text-[#5FB0FF]">
                📅 Prefer to talk directly?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#8FA3C7]">
                Book a free consultation call with our founder — no forms,
                just a quick conversation.
              </p>
              <Link
                href="https://calendly.com/codelura/free-project-consultation-codelura"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2D82DC] px-6 py-3 text-sm font-semibold transition hover:bg-[#3E8FE5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5FB0FF]"
              >
                Book Free Consultation
              </Link>
            </div>

            {/* Email / phone */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">📧 Email Us</h2>
              <div className="mt-3 space-y-2 text-sm">
                <a
                  href="mailto:support@codelura.com"
                  className="block text-[#8FA3C7] transition hover:text-[#5FB0FF]"
                >
                  support@codelura.com
                </a>
                <a
                  href="mailto:contact@codelura.com"
                  className="block text-[#8FA3C7] transition hover:text-[#5FB0FF]"
                >
                  contact@codelura.com
                </a>
                <a
                  href="mailto:info@codelura.com"
                  className="block text-[#8FA3C7] transition hover:text-[#5FB0FF]"
                >
                  info@codelura.com
                </a>
              </div>
            </div>

            {/* Topics */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold">💡 You can reach us about</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {TOPICS.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-[#8FA3C7]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:gap-4 sm:p-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-bold text-[#5FB0FF] sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] text-[#8FA3C7] sm:text-xs">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — the only client-hydrated piece */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-3">
            <h2 className="text-2xl font-bold">Send a Message</h2>
            <p className="mt-2 text-sm text-[#8FA3C7]">
              Tell us what&apos;s on your mind — we&apos;re here to help.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* OFFICIAL DEPARTMENT EMAIL DIRECTORY */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-14 pt-10 border-t border-white/10">
          <div className="text-center mb-8">
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 font-bold uppercase tracking-wider">
              Official Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Department Direct Contacts
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
              Reach out directly to the dedicated Codelura team responsible for your inquiry.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { dept: "Support", email: "support@codelura.com" },
              { dept: "HR & People", email: "hr@codelura.com" },
              { dept: "Administration", email: "admin@codelura.com" },
              { dept: "General Info", email: "info@codelura.com" },
              { dept: "Contact & Desk", email: "contact@codelura.com" },
              { dept: "Sales & Deals", email: "sales@codelura.com" },
              { dept: "Marketing & PR", email: "marketing@codelura.com" },
              { dept: "Careers & Jobs", email: "careers@codelura.com" },
              { dept: "Accounts", email: "accounts@codelura.com" },
              { dept: "Billing & Invoices", email: "billing@codelura.com" },
              { dept: "Finance", email: "finance@codelura.com" },
              { dept: "Operations", email: "operations@codelura.com" },
              { dept: "Business & Growth", email: "business@codelura.com" },
              { dept: "Engineering & Dev", email: "developer@codelura.com" },
              { dept: "Team Desk", email: "team@codelura.com" },
              { dept: "Hello & Welcome", email: "hello@codelura.com" },
              { dept: "Legal & Compliance", email: "legal@codelura.com" },
              { dept: "Data Protection", email: "dpo@codelura.com" },
            ].map((item) => (
              <a
                key={item.email}
                href={`mailto:${item.email}`}
                className="group flex flex-col p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/40 hover:bg-violet-500/10 transition text-left"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-violet-300">
                  {item.dept}
                </span>
                <span className="text-xs font-semibold text-white truncate mt-1 group-hover:text-violet-200">
                  {item.email}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}