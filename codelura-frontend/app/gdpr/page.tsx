import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import  "./gdpr.css";
// Metadata for SEO
export const metadata: Metadata = {
  title: "GDPR Compliance & Data Protection Policy | Codelura",
  description: "Codelura is fully GDPR compliant. Learn about our data protection policies, your rights under GDPR, and how we protect your personal information.",
  keywords: "GDPR compliance, data protection, GDPR policy, Codelura GDPR, data privacy, user rights, GDPR rights, data security",
  openGraph: {
    title: "GDPR Compliance & Data Protection | Codelura",
    description: "Your data privacy matters. Codelura is fully compliant with GDPR regulations.",
    type: "website",
    url: "https://codelura.com/gdpr",
    siteName: "Codelura",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://codelura.com/gdpr",
  },
};

// Types
interface Section {
  number: string;
  icon: string;
  title: string;
  content?: string;
  list?: string[];
}

// Static sections data
const sections: Section[] = [
  {
    number: "01",
    icon: "📋",
    title: "What Data We Collect",
    content:
      "We may collect personal information such as your name, email address, contact details, educational background, uploaded projects, and usage data when you interact with our platform, blogs, learning resources, or services.",
  },
  {
    number: "02",
    icon: "⚙️",
    title: "How We Use Your Data",
    list: [
      "To provide access to learning materials, blogs, and resources",
      "To showcase student and user projects",
      "To improve platform performance and user experience",
      "To communicate important updates and opportunities",
      "To ensure platform security and prevent misuse",
    ],
  },
  {
    number: "03",
    icon: "⚖️",
    title: "Legal Basis for Processing",
    content:
      "We process personal data based on user consent, contractual necessity, and legitimate interests such as improving our services and maintaining platform security.",
  },
  {
    number: "04",
    icon: "🔒",
    title: "Data Storage & Security",
    content:
      "All data is securely stored using industry-standard security measures. We restrict access to authorized personnel only and continuously monitor our systems to prevent unauthorized access or breaches.",
  },
  {
    number: "05",
    icon: "🛡️",
    title: "Your Rights Under GDPR",
    list: [
      "Right to access your personal data",
      "Right to correct inaccurate information",
      "Right to request deletion of your data",
      "Right to restrict or object to processing",
      "Right to data portability",
    ],
  },
  {
    number: "06",
    icon: "🔗",
    title: "Third-Party Services",
    content:
      "We may use trusted third-party services for analytics, hosting, or communication. These providers comply with GDPR and follow strict data protection standards.",
  },
];



const AccordionSection = ({
  section,
  index,
}: {
  section: Section;
  index: number;
}) => {
  return (
    <details className="card group">
      <summary className="list-none cursor-pointer">
        <div className="flex items-center justify-between p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="icon-box">
              <span className="text-xl" aria-hidden="true">
                {section.icon}
              </span>
            </div>

            <div>
              <div className="section-number">{section.number}</div>
              <h2 className="section-title">{section.title}</h2>
            </div>
          </div>

          <div
            className="chevron transition-transform duration-300 group-open:rotate-180"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 5L7 9L11 5"
                stroke="#ff6b35"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </summary>

      <div className="accordion-content">
        <div className="accordion-body">
          {section.content && (
            <p className="content-text">{section.content}</p>
          )}

          {section.list && (
            <div className="space-y-0">
              {section.list.map((item, j) => (
                <div key={j} className="list-item">
                  <div className="dot" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </details>
  );
};

export default function GDPRPage() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#080B14] text-white font-sans" role="main">
      {/* Hidden SEO heading */}
      <h1 className="sr-only">GDPR Compliance and Data Protection Policy - Codelura</h1>

      {/* Hero Section */}
      <section className="relative text-center pt-24 pb-20 overflow-hidden px-4" aria-labelledby="hero-title">
        <div className="glow-orb glow-orb-primary" aria-hidden="true" />
        <div className="glow-orb glow-orb-secondary" aria-hidden="true" />

        <div className="relative z-10">
          <span className="tag" role="status">
            <span aria-hidden="true">🔐</span> GDPR COMPLIANT
          </span>

          <h2 id="hero-title" className="hero-title">
            Data Protection
            <br />
            <span className="gradient-text">& GDPR Policy</span>
          </h2>

          <p className="hero-description">
            At <span className="highlight">Codelura</span>, we
            respect your privacy and are committed to protecting your personal data in
            accordance with the General Data Protection Regulation (GDPR).
          </p>

          {/* Stats row */}
          <div className="stats-container">
            {[
              { label: "GDPR Compliant", value: "100%" },
              { label: "Data Encrypted", value: "AES-256" },
              { label: "Uptime SLA", value: "99.9%" },
            ].map((stat) => (
              <div key={stat.label} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Last updated */}
          <div className="last-updated">
            <span aria-hidden="true">📅</span>
            Last Updated: <span className="font-semibold text-white/80">{lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto pb-24 px-4">
        <div className="gradient-line" aria-hidden="true" />

        {/* Accordion Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <AccordionSection key={index} section={section} index={index} />
          ))}
        </div>

        {/* Your Rights Highlight Section */}
        <section className="rights-section" aria-labelledby="rights-title">
          <h3 id="rights-title" className="rights-title">
            <span aria-hidden="true">⚡</span> Your GDPR Rights at a Glance
          </h3>
          <div className="rights-grid">
            {[
              { icon: "👁️", title: "Access", desc: "View your personal data" },
              { icon: "✏️", title: "Rectify", desc: "Correct inaccurate info" },
              { icon: "🗑️", title: "Erase", desc: "Request data deletion" },
              { icon: "🚫", title: "Restrict", desc: "Limit how we use data" },
              { icon: "📦", title: "Portability", desc: "Export your data" },
              { icon: "🙋", title: "Object", desc: "Oppose processing" },
            ].map((right) => (
              <div key={right.title} className="right-badge">
                <span className="text-xl" aria-hidden="true">{right.icon}</span>
                <div>
                  <div className="right-title">{right.title}</div>
                  <div className="right-desc">{right.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <div className="gradient-line" aria-hidden="true" />
        <p className="footer-note">
          By using Codelura, you acknowledge that you have read and understood our GDPR Compliance
          Policy. For any concerns, please contact us through our official support channels.
        </p>

        {/* Quick Links */}
        <nav className="quick-links" aria-label="Legal pages">
          <Link href="/privacy" className="quick-link">Privacy Policy</Link>
          <Link href="/terms" className="quick-link">Terms of Service</Link>
          <Link href="/cookies" className="quick-link">Cookie Policy</Link>
          <Link href="/data-protection" className="quick-link">Data Protection</Link>
        </nav>

        {/* Footer */}
        <footer className="footer">
          <p>
            &copy; {currentYear} Codelura. All rights reserved.
          </p>
          <p className="footer-sub">
            GDPR Compliant | Data Protection Policy v2.0
          </p>
        </footer>
      </div>

      {/* Styles */}
      
    </main>
  );
}