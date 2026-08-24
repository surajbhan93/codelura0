import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Shield,
  Scale,
  FileText,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Terms & Conditions | Codelura Legal Agreement",
  description: "Read Codelura's comprehensive Terms & Conditions governing the use of our learning platform, AI tools, hackathons, and community services.",
  keywords: "terms and conditions, legal agreement, Codelura terms, user agreement, platform terms",
  openGraph: {
    title: "Terms & Conditions | Codelura",
    description: "Legal terms governing the use of Codelura platform",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Types
interface SectionContent {
  id: number;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

// Server Component - No 'use client' needed
export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentYear = new Date().getFullYear();

  // Static sections data - moved outside component to prevent recreation
  const sections: SectionContent[] = [
    {
      id: 1,
      title: "1. Acceptance of Terms & Legal Agreement",
      icon: <FileText className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            By accessing, browsing, registering, or using the Codelura platform
            (including but not limited to our website, mobile applications, APIs,
            and all related services), you acknowledge that you have read, understood,
            and agree to be bound by these Terms & Conditions.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Scope of Agreement</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Educational blogs and learning materials</li>
              <li>Online courses and tutorials</li>
              <li>Project showcase and portfolio features</li>
              <li>AI-powered tools and recommendation systems</li>
              <li>Hackathons and competitive events</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. User Eligibility & Age Requirements",
      icon: <Shield className="w-5 h-5 text-green-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>You must meet the following eligibility requirements:</p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Eligibility Criteria</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>You must be at least 13 years of age</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>You must be capable of entering into legally binding agreements</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>You are not located in a country under embargo</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. User Accounts & Registration",
      icon: <Shield className="w-5 h-5 text-purple-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>When you create an account on Codelura, you agree to:</p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" aria-hidden="true" />
                Account Information
              </h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Provide accurate and truthful information</li>
                <li>Use your real name or authorized professional name</li>
                <li>Maintain current contact information</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" aria-hidden="true" />
                Account Security
              </h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>You are solely responsible for protecting your password</li>
                <li>Enable two-factor authentication when available</li>
                <li>Notify us immediately of unauthorized access</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. User Content & Intellectual Property Rights",
      icon: <Scale className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Content Ownership</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>You retain full ownership of all your projects and content</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Codelura does not claim ownership of your IP</span>
              </li>
            </ul>
          </div>
          <div className="bg-red-950/20 border border-red-900 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-2">Prohibited Content</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm text-red-200">
              <li>Malware, viruses, or malicious code</li>
              <li>Plagiarism or copyright infringement</li>
              <li>Hate speech or discrimination</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. AI Tools & Automated Features",
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>Codelura uses AI algorithms for recommendations and discovery:</p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">AI Limitations</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">Informational Only:</span> AI outputs are informational
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">No Guarantees:</span> We don&apos;t guarantee accuracy
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "6. Hackathons & Competitive Events",
      icon: <Clock className="w-5 h-5 text-orange-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>Participation in hackathons is governed by specific rules:</p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Participation Requirements</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Must be eligible per event guidelines</li>
              <li>Must comply with all event rules</li>
              <li>Must create original work or properly attribute sources</li>
            </ul>
          </div>
          <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
            <h4 className="text-orange-300 font-semibold mb-2">Judging Decisions</h4>
            <p className="text-sm">Judging decisions are final and not subject to appeal.</p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "7. Courses & Learning Materials",
      icon: <FileText className="w-5 h-5 text-green-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>Our courses and learning materials are provided under these terms:</p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Course Access</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Courses are for personal, non-commercial use only</li>
              <li>You may not share credentials or sell course access</li>
              <li>You may not republish course content</li>
            </ul>
          </div>
          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Refund Policy
            </h4>
            <ul className="list-disc ml-6 space-y-1 text-sm text-blue-200">
              <li>7 days refund window from purchase</li>
              <li>Full refund if less than 10% accessed</li>
              <li>Processing takes 5-7 business days</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. Premium Services & Payment Terms",
      icon: <Shield className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>Premium services are provided under these payment terms:</p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Payment & Billing</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>All prices in currency specified at checkout</li>
              <li>Recurring subscriptions auto-renew unless cancelled</li>
              <li>Cancel anytime from account settings</li>
              <li>No refund for partial months</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "9. Community Standards & Prohibited Activities",
      icon: <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>To maintain a safe community, these activities are prohibited:</p>
          <div className="bg-red-950/20 border border-red-900 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-3">Prohibited Behaviors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="space-y-2 text-sm text-red-200">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Uploading malware or malicious code</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Attempting unauthorized access</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Harassment or abusive behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Hate speech or discrimination</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-red-200">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Using bots for artificial engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Plagiarism or copyright infringement</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Phishing or social engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Scraping or bulk downloading</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. Content Moderation & Removal",
      icon: <Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Moderation Rights</h4>
            <p className="text-sm mb-2">Codelura reserves the right to:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Review, moderate, and remove any content</li>
              <li>Remove content violating these terms or laws</li>
              <li>Take action without prior notice in severe cases</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Appeals Process</h4>
            <ol className="list-decimal ml-6 space-y-1 text-sm">
              <li>You will receive notice of action and reason</li>
              <li>Submit appeal within 30 days</li>
              <li>Appeals reviewed by moderation team</li>
              <li>Contact legal@codelura.com for appeals</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: "11. Limitation of Liability & Disclaimers",
      icon: <Scale className="w-5 h-5 text-orange-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
            <p className="text-orange-300 font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
            <p className="text-sm">
              THE CODELURA PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND.
            </p>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">No Warranties</h4>
            <p className="text-sm mb-2">Codelura makes no warranties regarding:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Accuracy or completeness of content</li>
              <li>Uninterrupted or error-free service</li>
              <li>Quality of products or services</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 12,
      title: "12. Indemnification",
      icon: <Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            You agree to indemnify Codelura from any claims arising from your use of the platform.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Your violation of these terms</li>
              <li>Your use or misuse of the platform</li>
              <li>Your content or submissions</li>
              <li>Your violation of any law or third-party rights</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      title: "13. Termination & Account Suspension",
      icon: <AlertCircle className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Termination Rights</h4>
            <p className="text-sm mb-2">We may terminate your account for:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Any violation of these terms</li>
              <li>Inactivity (2+ years)</li>
              <li>Non-payment of fees</li>
              <li>Fraudulent activity</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 14,
      title: "14. Dispute Resolution & Governing Law",
      icon: <Scale className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Governing Law</h4>
            <p className="text-sm">
              These Terms are governed by the laws of India. Codelura is based in Bangalore, India.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 15,
      title: "15. Changes to Terms & Updates",
      icon: <Clock className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Modification of Terms</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Changes effective immediately upon posting</li>
              <li>&quot;Last Updated&quot; date will reflect changes</li>
              <li>Major changes communicated via email</li>
              <li>Continued use = acceptance of new terms</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 16,
      title: "16. Contact & Legal Inquiries",
      icon: <Mail className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>Contact us for questions about these Terms & Conditions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-600 transition-colors">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
                Legal Email
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                <a href="mailto:legal@codelura.com">legal@codelura.com</a>
              </p>
              <p className="text-xs text-gray-500 mt-2">Legal inquiries & disputes</p>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-green-600 transition-colors">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" aria-hidden="true" />
                Support Email
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                <a href="mailto:support@codelura.com">support@codelura.com</a>
              </p>
              <p className="text-xs text-gray-500 mt-2">General support & inquiries</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Accordion component for client-side interactivity
const AccordionSection = ({ section }: { section: SectionContent }) => (
  <details className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg overflow-hidden group">
    <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between hover:bg-gray-800/50">
      <div className="flex items-center gap-3">
        {section.icon}
        <h2 className="text-lg font-semibold text-white">
          {section.title}
        </h2>
      </div>

      <ChevronDown className="w-5 h-5 text-blue-400 transition-transform group-open:rotate-180" />
    </summary>

    <div className="px-6 py-4 border-t border-gray-700 bg-black/30">
      {section.content}
    </div>
  </details>
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-300 px-6 md:px-16 py-20">
      {/* Header */}
      <header className="max-w-7xl mx-auto text-center mb-20">
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-red-950/40 to-red-900/40 border border-red-900 rounded-full">
          <p className="text-red-300 text-sm font-semibold">LEGAL TERMS & CONDITIONS</p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Terms & Conditions
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          These comprehensive Terms & Conditions govern your use of the Codelura platform,
          including all websites, applications, and digital services.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-sm">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 hover:border-gray-700 transition-colors">
            <p className="text-gray-500">
              Last Updated:{" "}
              <span className="text-white font-semibold">{currentDate}</span>
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 hover:border-gray-700 transition-colors">
            <p className="text-gray-500">
              Version: <span className="text-white font-semibold">2.0</span>
            </p>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <section className="max-w-5xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" aria-hidden="true" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#section-${section.id}`}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover:translate-x-1"
              >
                → {section.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto space-y-4 mb-16">
        {sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`}>
            <AccordionSection section={section} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto border-t border-gray-800 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-white font-semibold mb-3">About Codelura</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Codelura is a comprehensive platform for learning, building, and
              showcasing projects with AI-powered discovery.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal & Compliance</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Codelura Inc. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Terms & Conditions for Codelura Platform | Last Updated: {currentDate} | Version 2.0
          </p>
        </div>
      </footer>
    </div>
  );
}