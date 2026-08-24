import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  Eye,
  FileText,
  Mail,
  CheckCircle,
  AlertCircle,
  Database,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Data Protection Policy | Codelura - GDPR & CCPA Compliance",
  description: "Codelura's comprehensive Data Protection Policy. Learn how we protect your personal information, ensure GDPR compliance, CCPA compliance, and maintain data security.",
  keywords: "data protection, GDPR compliance, CCPA compliance, data security, privacy policy, data encryption, user rights, data retention",
  openGraph: {
    title: "Data Protection Policy | Codelura",
    description: "Your data is sacred. Learn about Codelura's commitment to data protection and security.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Types
interface PolicySection {
  id: number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

// Server Component
export default function DataProtectionPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentYear = new Date().getFullYear();

  // Static sections data
  const sections: PolicySection[] = [
    {
      id: 1,
      title: "1. Data Protection Overview & Commitment",
      subtitle: "Our Promise to Protect Your Information",
      icon: <Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            At Codelura, data protection is at the heart of everything we do. We understand that your personal information is
            sacred and must be handled with utmost care and responsibility. This Data Protection Policy outlines our commitment
            to safeguarding your data throughout its entire lifecycle—from collection through storage, processing, and eventual deletion.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Our Core Principles</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Transparency:</span> We clearly communicate what data we collect
                  and how it&apos;s used
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Security:</span> We employ industry-leading security measures to
                  protect your information
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Control:</span> You have complete control over your data and can
                  access or delete it anytime
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Compliance:</span> We strictly adhere to GDPR, CCPA, and all
                  applicable international regulations
                </span>
              </li>
            </ul>
          </div>
          <p className="text-sm">
            Codelura is committed to protecting your fundamental right to privacy. We believe that data protection is not just
            a legal obligation, but an ethical responsibility we owe to every user.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. Legal Framework & Regulatory Compliance",
      subtitle: "We Follow Global Data Protection Laws",
      icon: <FileText className="w-5 h-5 text-purple-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Codelura operates in compliance with major international data protection regulations. We have implemented comprehensive
            policies and procedures to ensure adherence to all applicable laws across jurisdictions where our users reside.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" aria-hidden="true" />
                GDPR (General Data Protection Regulation)
              </h4>
              <p className="text-sm mb-2">
                For users in the European Union and EEA countries, we comply with GDPR requirements including:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Legal basis for data processing (consent, contract, legitimate interest)</li>
                <li>Data subject rights (access, rectification, erasure, portability)</li>
                <li>Data protection impact assessments for high-risk processing</li>
                <li>Data processing agreements with all service providers</li>
                <li>Incident reporting within 72 hours to supervisory authorities</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                CCPA (California Consumer Privacy Act)
              </h4>
              <p className="text-sm mb-2">
                For California residents, we provide rights including:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information held by businesses</li>
                <li>Right to opt-out of personal information sales or sharing</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
                <li>Mechanisms for submitting and responding to consumer requests</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" aria-hidden="true" />
                Other International Standards
              </h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">LGPD (Brazil):</span> Brazilian data protection law for Brazilian residents
                </li>
                <li>
                  <span className="font-semibold">PIPEDA (Canada):</span> Personal Information Protection and Electronic Documents Act
                </li>
                <li>
                  <span className="font-semibold">DPDPA (India):</span> Digital Personal Data Protection Act for Indian users
                </li>
                <li>
                  <span className="font-semibold">ePrivacy Directive (EU):</span> Cookie consent and electronic communications
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. Data Encryption & Security Technologies",
      subtitle: "How We Protect Your Data in Transit and at Rest",
      icon: <Lock className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Codelura uses state-of-the-art encryption and security technologies to protect your personal information from unauthorized
            access, theft, and misuse. We implement multiple layers of security across our infrastructure and applications.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Encryption in Transit</h4>
              <p className="text-sm mb-2">
                All data transmitted between your device and our servers is encrypted using industry-standard protocols:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">TLS 1.3:</span> Latest transport layer security protocol for HTTPS connections
                </li>
                <li>
                  <span className="font-semibold">256-bit Encryption:</span> Strong encryption for all data in flight
                </li>
                <li>
                  <span className="font-semibold">SSL Certificate:</span> Valid SSL certificates from trusted certificate authorities
                </li>
                <li>
                  <span className="font-semibold">Perfect Forward Secrecy:</span> Ensures session keys cannot be decrypted even if
                  private key is compromised
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Encryption at Rest</h4>
              <p className="text-sm mb-2">
                Data stored on our servers and databases is encrypted at rest using:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">AES-256:</span> Advanced Encryption Standard with 256-bit keys for database
                  encryption
                </li>
                <li>
                  <span className="font-semibold">Encryption Keys:</span> Managed separately from encrypted data using hardware security
                  modules
                </li>
                <li>
                  <span className="font-semibold">Backup Encryption:</span> All backups encrypted with same standards as production data
                </li>
                <li>
                  <span className="font-semibold">Database-Level Encryption:</span> Transparent encryption at database level for all
                  sensitive information
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Password Security</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Bcrypt Hashing:</span> Industry-standard password hashing with salt and strong rounds
                </li>
                <li>
                  <span className="font-semibold">Never Stored in Plain Text:</span> Passwords never stored or transmitted in plaintext
                </li>
                <li>
                  <span className="font-semibold">Strength Requirements:</span> Minimum 12 characters with complexity validation
                </li>
                <li>
                  <span className="font-semibold">Two-Factor Authentication:</span> Optional 2FA adds additional security layer
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Data Collection & Usage Practices",
      subtitle: "What Information We Collect and Why",
      icon: <Database className="w-5 h-5 text-cyan-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We collect personal information only when necessary to provide our services, improve user experience, and comply with
            legal obligations. Every data collection practice is based on legitimate purposes and user consent where required.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Categories of Data Collected</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Personal Information:</span> Name, email, phone, address (for billing)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Account Data:</span> Username, profile information, preferences
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">User Generated Content:</span> Projects, courses, blogs, comments
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Technical Data:</span> IP address, device type, browser, usage patterns
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Behavioral Data:</span> Pages visited, features used, time spent
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Legal Basis for Processing</h4>
              <p className="text-sm mb-2">
                We process your data based on one of the following legal grounds:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Consent:</span> You have explicitly consented to processing for specific purposes
                </li>
                <li>
                  <span className="font-semibold">Contract:</span> Processing is necessary to provide services you&apos;ve requested
                </li>
                <li>
                  <span className="font-semibold">Legal Obligation:</span> We must process data to comply with applicable law
                </li>
                <li>
                  <span className="font-semibold">Legitimate Interests:</span> Processing serves our business interests (marketing,
                  fraud prevention)
                </li>
                <li>
                  <span className="font-semibold">Vital Interests:</span> Processing necessary to protect someone&apos;s vital interests
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Data Minimization</h4>
              <p className="text-sm">
                We practice data minimization by collecting only what&apos;s necessary for stated purposes. We don&apos;t collect
                excessive information and regularly review data collection practices to reduce unnecessary data gathering.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. User Rights & Data Access",
      subtitle: "Your Control Over Your Personal Information",
      icon: <Eye className="w-5 h-5 text-green-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            You have comprehensive rights regarding your personal data. We are committed to providing you with tools and processes
            to exercise these rights easily and quickly. All requests are handled with priority and care.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Your Data Rights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Access:</span> Request and receive copy of your personal data in a
                    machine-readable format
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Rectification:</span> Correct inaccurate or incomplete personal data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Erasure:</span> Request deletion of your data under certain conditions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Restrict Processing:</span> Limit how your data is used or processed
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Data Portability:</span> Transfer your data to another service provider
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Right to Object:</span> Withdraw consent or object to specific processing
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Exercising Your Rights</h4>
              <ol className="list-decimal ml-6 space-y-2 text-sm">
                <li>Visit Account Settings → Privacy &amp; Data</li>
                <li>Select the right you wish to exercise</li>
                <li>Fill in required information and submit</li>
                <li>We respond within 30 days (extendable to 90 days)</li>
                <li>Provide data in requested format (CSV, JSON, PDF)</li>
              </ol>
            </div>

            <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">No Discrimination</h4>
              <p className="text-sm">
                We do not discriminate against you for exercising your data rights. You will receive the same service level and
                pricing regardless of whether you exercise your rights or provide additional data.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "6. Data Retention & Deletion Policies",
      subtitle: "How Long We Keep Your Information",
      icon: <BarChart3 className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We retain personal data only for as long as necessary to provide our services and fulfill the purposes for which
            it was collected. After this period, data is securely deleted or anonymized.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Data Retention Periods</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Active User Accounts</span>
                  <span className="text-yellow-300">Duration of relationship</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">After Account Deletion</span>
                  <span className="text-yellow-300">30 days (grace period)</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Transaction Records</span>
                  <span className="text-yellow-300">7 years (legal requirement)</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Analytics Data</span>
                  <span className="text-yellow-300">6 months (anonymized)</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="font-semibold">Cookies</span>
                  <span className="text-yellow-300">Per cookie policy</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Backup Data</span>
                  <span className="text-yellow-300">60 days after deletion</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Secure Data Deletion</h4>
              <p className="text-sm mb-2">
                When data is deleted, we use secure deletion methods:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Cryptographic Erasure:</span> Deletion of encryption keys making data unrecoverable
                </li>
                <li>
                  <span className="font-semibold">Overwriting:</span> Multiple overwrite passes to prevent recovery
                </li>
                <li>
                  <span className="font-semibold">Physical Destruction:</span> For hardware reaching end-of-life
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Anonymization</h4>
              <p className="text-sm">
                Where possible, we anonymize data after retention period. Anonymized data cannot identify individuals and is not
                subject to same data protection requirements. We use anonymization for long-term analytics and service improvement.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "7. Data Breach & Incident Response",
      subtitle: "How We Handle Security Incidents",
      icon: <AlertCircle className="w-5 h-5 text-orange-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            While we implement comprehensive security measures, we recognize that no system is 100% secure. In the event of a
            data breach, we have established procedures to respond quickly and transparently.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Our Response Process</h4>
              <ol className="list-decimal ml-6 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Immediate Detection &amp; Containment:</span> Detect breach and stop further
                  unauthorized access
                </li>
                <li>
                  <span className="font-semibold">Investigation:</span> Determine scope, nature, and affected data
                </li>
                <li>
                  <span className="font-semibold">Internal Notification:</span> Inform management and legal team
                </li>
                <li>
                  <span className="font-semibold">User Notification (if required):</span> Notify affected users without undue delay
                </li>
                <li>
                  <span className="font-semibold">Authority Notification:</span> Report to supervisory authorities within 72 hours
                  (GDPR requirement)
                </li>
                <li>
                  <span className="font-semibold">Remediation:</span> Fix vulnerabilities and prevent future incidents
                </li>
                <li>
                  <span className="font-semibold">Post-Incident Review:</span> Analyze and improve security practices
                </li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">User Notification</h4>
              <p className="text-sm mb-2">
                If a breach affects your personal data, we will notify you through:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Email to your registered email address</li>
                <li>In-app notification in your dashboard</li>
                <li>Detailed breach impact statement</li>
                <li>Recommended actions you should take</li>
                <li>Contact information for questions</li>
              </ul>
            </div>

            <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
              <h4 className="text-orange-300 font-semibold mb-2">Reporting Security Vulnerabilities</h4>
              <p className="text-sm">
                If you discover a security vulnerability, please report it responsibly to security@codelura.com. Do not publicly
                disclose the vulnerability. We take all security reports seriously and will investigate promptly.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. Third-Party Data Sharing & Processors",
      subtitle: "Who We Share Your Data With",
      icon: <Users className="w-5 h-5 text-cyan-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We do not sell your personal data to third parties. However, we may share data with trusted service providers who help
            us operate the platform. All data sharing is governed by strict Data Processing Agreements.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Categories of Data Processors</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Payment Processors:</span> Stripe, Razorpay (secure payment processing)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Cloud Infrastructure:</span> AWS, Google Cloud (hosting &amp; storage)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Analytics:</span> Google Analytics, Mixpanel (usage analytics)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Email Services:</span> SendGrid, Mailgun (transactional emails)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Security Services:</span> Cloudflare (DDoS protection &amp; security)
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Data Processing Agreements</h4>
              <p className="text-sm mb-2">
                All processors are bound by comprehensive Data Processing Agreements that ensure:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Data processed only on Codelura&apos;s instructions</li>
                <li>Appropriate security measures implemented</li>
                <li>Limited access to necessary personnel only</li>
                <li>Sub-processor approval from Codelura</li>
                <li>Assistance with data subject rights requests</li>
                <li>Audit rights for Codelura</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">International Data Transfers</h4>
              <p className="text-sm">
                Some processors are located outside your country. For transfers from EU to non-EU countries, we use Standard
                Contractual Clauses and other lawful mechanisms to ensure your data receives adequate protection.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "9. Privacy by Design & Default",
      subtitle: "Data Protection Embedded in Our Systems",
      icon: <Zap className="w-5 h-5 text-purple-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We implement Privacy by Design and Default principles, meaning data protection is built into our systems from the ground
            up, not added as an afterthought. This approach ensures protection throughout the entire data lifecycle.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Privacy by Design Principles</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Proactive Not Reactive:</span> We anticipate data protection challenges and
                    address them before they occur
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Default Settings:</span> Privacy-friendly settings are defaults; users can opt
                    for less privacy if desired
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Data Minimization:</span> We collect only necessary data and no more
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Transparency:</span> Users understand what data is collected and why
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">User Control:</span> Users have ability to view, modify, and delete their data
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="font-semibold">Security &amp; Integrity:</span> Strong encryption and security measures protect
                    data throughout
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Data Protection Impact Assessments</h4>
              <p className="text-sm">
                We conduct Data Protection Impact Assessments (DPIA) for all high-risk data processing activities to identify and
                mitigate privacy risks before implementation.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. Policy Updates & Contact Information",
      subtitle: "Stay Informed & Get in Touch",
      icon: <Mail className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            This Data Protection Policy may be updated periodically to reflect changes in our practices, technology, or applicable
            laws. We encourage you to review it regularly. Your feedback helps us improve data protection practices.
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Policy Updates</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Updates take effect on the date posted</li>
                <li>&quot;Last Updated&quot; date reflects most recent changes</li>
                <li>Major changes communicated via email (30 days notice)</li>
                <li>Continued use of platform = acceptance of updated policy</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-4 border border-blue-700 hover:border-blue-600 transition-colors">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
                  Data Protection Officer
                </h4>
                <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                  <a href="mailto:dpo@codelura.com">dpo@codelura.com</a>
                </p>
                <p className="text-xs text-gray-400 mt-2">For data protection &amp; GDPR inquiries</p>
              </div>

              <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg p-4 border border-green-700 hover:border-green-600 transition-colors">
                <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-400" aria-hidden="true" />
                  Privacy Team
                </h4>
                <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                  <a href="mailto:privacy@codelura.com">privacy@codelura.com</a>
                </p>
                <p className="text-xs text-gray-400 mt-2">For privacy &amp; data requests</p>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Response Timeline</h4>
              <p className="text-sm">
                We respond to data protection inquiries within <span className="font-semibold">48 hours</span>. For formal data
                subject requests, we comply within <span className="font-semibold">30 days</span> (extendable to 90 days for complex
                requests) as required by GDPR.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Server-side Accordion Component (No useState required)
const AccordionSection = ({ section }: { section: PolicySection }) => {
  return (
    <details className="group bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600">
      <summary className="list-none cursor-pointer w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3 text-left">
          {section.icon}
          <div>
            <h3 className="text-lg font-semibold text-white">
              {section.title}
            </h3>
            {section.subtitle && (
              <p className="text-sm text-gray-500">
                {section.subtitle}
              </p>
            )}
          </div>
        </div>

        <ChevronDown
          className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <div className="overflow-hidden">
        <div className="px-6 py-4 border-t border-gray-700 bg-black/30">
          {section.content}
        </div>
      </div>
    </details>
  );
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-300 px-6 md:px-16 py-20">
      {/* SEO Hidden Heading */}
      <h1 className="sr-only">
        Codelura Data Protection Policy - GDPR, CCPA &amp; Data Security Compliance
      </h1>

      {/* Header */}
      <header className="max-w-5xl mx-auto text-center mb-20">
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-950/40 to-blue-900/40 border border-blue-900 rounded-full">
          <p className="text-blue-300 text-sm font-semibold">DATA PROTECTION &amp; SECURITY</p>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Data Protection Policy
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          At Codelura, your data is sacred. This comprehensive Data Protection Policy outlines our commitment to securing,
          protecting, and respecting your personal information. We comply with international regulations including GDPR, CCPA,
          and other global data protection standards. Your privacy is our priority.
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
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" aria-hidden="true" />
            Quick Navigation
          </h3>
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
      <div className="max-w-5xl mx-auto space-y-4 mb-16">
        {sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`}>
            <AccordionSection section={section} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto border-t border-gray-800 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-white font-semibold mb-3">Our Commitment</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Data protection is not just compliance—it&apos;s our core value. We are committed to safeguarding your personal
              information with the highest standards of security and transparency.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Related Policies</h3>
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
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Your Rights</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Access your data anytime</li>
              <li className="text-gray-400">Request data deletion</li>
              <li className="text-gray-400">Correct inaccurate info</li>
              <li className="text-gray-400">Export your data</li>
            </ul>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Codelura Inc. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Data Protection Policy | Last Updated: {currentDate} | Version 2.0 | GDPR &amp; CCPA Compliant
          </p>
        </div>
      </footer>
    </div>
  );
}