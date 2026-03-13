"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Mail, MapPin, Phone } from "lucide-react";

interface ExpandedSections {
  [key: number]: boolean;
}

interface Section {
  id: number;
  title: string;
  content: React.ReactNode;
}

export default function PrivacyPage(): React.ReactElement {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  const toggleSection = (sectionId: number): void => {
    setExpandedSections((prev: ExpandedSections) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections: Section[] = [
    {
      id: 1,
      title: "1. Information We Collect",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We collect information to provide better services to students,
            developers, mentors, startups and businesses across our platform.
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h4 className="text-white font-semibold mb-3">Personal Information</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Full name, email address, and profile details</li>
              <li>Phone number (optional for contact purposes)</li>
              <li>College / organization / company details</li>
              <li>Profile picture and bio information</li>
              <li>Social media links and portfolios</li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h4 className="text-white font-semibold mb-3">Content &amp; Activity Data</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Projects uploaded to showcase and their metadata</li>
              <li>Blog posts, comments, ratings and interactions</li>
              <li>Hackathon participation and event registration details</li>
              <li>Course progress and learning activity logs</li>
              <li>Search queries and platform navigation patterns</li>
              <li>File uploads and content classifications</li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h4 className="text-white font-semibold mb-3">Technical Data</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>IP address and geolocation data</li>
              <li>Browser type, version, and device information</li>
              <li>Operating system and hardware configuration</li>
              <li>Cookies and session identifiers</li>
              <li>Pages visited and time spent on each</li>
              <li>Referral sources and exit pages</li>
              <li>Performance metrics and crash reports</li>
            </ul>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <h4 className="text-white font-semibold mb-3">AI &amp; Analytics Data</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>AI model usage patterns and input/output logs</li>
              <li>Feature interaction data for recommendation systems</li>
              <li>Performance analytics and feature popularity metrics</li>
              <li>Aggregated engagement and behavior analysis</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. How We Use Your Data",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p className="font-semibold text-white">
            Codelura uses collected data for the following purposes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-blue-900/30">
              <h4 className="text-blue-400 font-semibold mb-2">Core Services</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Deliver learning materials and blog content</li>
                <li>Enable project showcase visibility</li>
                <li>Facilitate course access and progress tracking</li>
                <li>Organize hackathons and startup events</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-green-900/30">
              <h4 className="text-green-400 font-semibold mb-2">Personalization</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Power AI-based discovery system</li>
                <li>Provide personalized recommendations</li>
                <li>Customize user experience and preferences</li>
                <li>Improve content recommendations</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-yellow-900/30">
              <h4 className="text-yellow-400 font-semibold mb-2">Platform Operations</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Improve backend and frontend performance</li>
                <li>Monitor platform stability and security</li>
                <li>Prevent spam and platform abuse</li>
                <li>Enforce terms of service and policies</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-900/30">
              <h4 className="text-purple-400 font-semibold mb-2">Business &amp; Support</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Provide customer support and communications</li>
                <li>Process payments for premium features</li>
                <li>Send service updates and announcements</li>
                <li>Conduct product research and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. Projects &amp; User Content",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Projects uploaded by users are subject to the following terms:
          </p>
          <div className="bg-blue-950/30 border border-blue-900 rounded-lg p-4 space-y-3">
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">✓</div>
              <div>
                <h4 className="text-white font-semibold">Ownership Rights</h4>
                <p className="text-sm mt-1">
                  You retain full ownership and intellectual property rights of your projects.
                  Codelura does not claim any ownership or rights to your original content.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">✓</div>
              <div>
                <h4 className="text-white font-semibold">Privacy Controls</h4>
                <p className="text-sm mt-1">
                  You can mark projects as private, public, or restricted to specific users.
                  Private projects are only accessible to you.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">✓</div>
              <div>
                <h4 className="text-white font-semibold">AI Indexing</h4>
                <p className="text-sm mt-1">
                  AI indexing may analyze metadata and tags for discovery purposes.
                  Source code analysis is limited to public projects only.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">✓</div>
              <div>
                <h4 className="text-white font-semibold">License &amp; Attribution</h4>
                <p className="text-sm mt-1">
                  Users must specify project licenses. Any reuse requires attribution and
                  compliance with specified license terms.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-blue-400 font-bold">✓</div>
              <div>
                <h4 className="text-white font-semibold">Removal &amp; Deletion</h4>
                <p className="text-sm mt-1">
                  You can delete your projects at any time. Deleted projects are permanently
                  removed from the platform within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. AI &amp; Smart Discovery System",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Our platform includes AI-powered recommendation systems that enhance your
            experience on Codelura.
          </p>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">How AI Analysis Works</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Analyzes engagement patterns and user preferences</li>
                <li>Processes project tags, descriptions, and metadata</li>
                <li>Tracks usage behavior to identify trending topics</li>
                <li>Generates personalized project recommendations</li>
                <li>Improves content discovery accuracy over time</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Data Protection in AI Processing</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>AI training uses aggregated, anonymized data by default</li>
                <li>Individual user data is not shared with AI training datasets</li>
                <li>Projects marked as private are excluded from AI analysis</li>
                <li>You can opt-out of AI recommendations at any time</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Transparency &amp; Control</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>AI decisions are explainable and auditable</li>
                <li>You can request removal from AI recommendation systems</li>
                <li>We comply with GDPR and AI transparency requirements</li>
                <li>Regular audits ensure unbiased AI recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. Data Sharing &amp; Third-Party Services",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-red-950/20 border border-red-900 rounded-lg p-4 mb-4">
            <p className="text-red-300 font-semibold">
              ⚠️ We DO NOT sell user data to third parties.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Necessary Third-Party Services</h4>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Payment Processors:</span> Stripe, Razorpay
                  for secure payment processing
                </li>
                <li>
                  <span className="font-semibold">Cloud Infrastructure:</span> AWS, Google Cloud
                  for data hosting and backup
                </li>
                <li>
                  <span className="font-semibold">Analytics Tools:</span> Mixpanel, Amplitude
                  for anonymous usage analytics
                </li>
                <li>
                  <span className="font-semibold">Email Services:</span> SendGrid for
                  transactional emails and notifications
                </li>
                <li>
                  <span className="font-semibold">Security Services:</span> Cloudflare for DDoS
                  protection and security
                </li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Data Sharing Restrictions</h4>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li>Third parties are bound by strict data processing agreements</li>
                <li>Data shared is limited to what&apos;s necessary for service delivery</li>
                <li>Third parties cannot use your data for their own purposes</li>
                <li>We do not share data with advertisers or marketing firms</li>
                <li>Cross-border transfers comply with GDPR and relevant regulations</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Legal Disclosures</h4>
              <p className="text-sm mb-2">We may disclose personal information when required by law:</p>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li>In response to valid court orders or legal requests</li>
                <li>To comply with government regulations and law enforcement</li>
                <li>To protect against fraud, security threats, and criminal activity</li>
                <li>To enforce our Terms of Service and protect user rights</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "6. Data Security Measures",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We implement comprehensive security measures to protect your personal information:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-green-400 font-semibold mb-3">✓ Encryption</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>SSL/TLS encryption for all data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>End-to-end encryption for sensitive data</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-green-400 font-semibold mb-3">✓ Authentication</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Two-factor authentication (2FA) support</li>
                <li>Secure password hashing (bcrypt)</li>
                <li>OAuth 2.0 for third-party integrations</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-green-400 font-semibold mb-3">✓ Infrastructure</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Role-based access control (RBAC)</li>
                <li>Regular security audits and penetration testing</li>
                <li>Firewalls and intrusion detection systems</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-green-400 font-semibold mb-3">✓ Compliance</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>GDPR and CCPA compliance</li>
                <li>Data backup and disaster recovery</li>
                <li>Incident response procedures in place</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-950/30 border border-yellow-900 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-300">
              <span className="font-semibold">Note:</span> While we strive to protect your
              information, no system is 100% secure. We cannot guarantee absolute security and
              encourage users to use strong passwords and enable 2FA.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "7. Cookies &amp; Tracking Technologies",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We use cookies and similar tracking technologies to enhance your experience:
          </p>

          <div className="space-y-3">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Essential Cookies</h4>
              <p className="text-sm mb-2">Required for basic functionality:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Basic platform functionality</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Analytics Cookies</h4>
              <p className="text-sm mb-2">To understand how you use our platform:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Page views and user interaction tracking</li>
                <li>Performance monitoring and optimization</li>
                <li>Identifying trends and usage patterns</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Preference Cookies</h4>
              <p className="text-sm mb-2">To remember your preferences:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Dark/light mode preferences</li>
                <li>Language and region settings</li>
                <li>Personalization preferences</li>
              </ul>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-semibold mb-2">Cookie Control</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>You can manage cookie preferences in settings</li>
                <li>Browser settings allow you to block or delete cookies</li>
                <li>Disabling cookies may affect platform functionality</li>
                <li>We honor Do Not Track (DNT) browser signals</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. Premium Services &amp; Payments",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Information about our premium services and payment handling:
          </p>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">Payment Processing</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>
                  Premium subscriptions and features are processed via PCI-DSS compliant
                  payment gateways
                </li>
                <li>We never store raw credit card details on our servers</li>
                <li>Payment processors handle all sensitive financial information</li>
                <li>Secure tokenization ensures safe recurring payments</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Subscription Data</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Billing address and invoice details</li>
                <li>Subscription tier and active features</li>
                <li>Renewal dates and payment history</li>
                <li>Transaction logs for audit purposes</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Billing &amp; Refunds</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>You receive detailed billing statements via email</li>
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>Refund requests are processed per our refund policy</li>
                <li>You can manage subscriptions in account settings</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "9. Children &amp; Minors Policy",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
            <p className="text-orange-300 font-semibold">
              Codelura is intended for users aged 13 and above.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">For Users Under 18</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Parental or guardian supervision is strongly recommended</li>
                <li>We collect minimal personal information from minors</li>
                <li>No marketing communications without parental consent</li>
                <li>Minors can request data deletion at any time</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">For Parents &amp; Guardians</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>We comply with COPPA (Children&apos;s Online Privacy Protection Act)</li>
                <li>You can request to review your child&apos;s information</li>
                <li>You can request deletion of your child&apos;s account</li>
                <li>Contact us to manage your child&apos;s privacy settings</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Safety Features</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Content filtering for age-appropriate materials</li>
                <li>Protection against cyberbullying and harassment</li>
                <li>Parental controls available in account settings</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. Your Data Rights &amp; Control",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            You have rights regarding your personal information. Here&apos;s what you can do:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">📋</div>
              <div>
                <h4 className="text-white font-semibold">Access Your Data</h4>
                <p className="text-sm mt-1">
                  Download a copy of all personal data associated with your account
                  in a machine-readable format.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">✏️</div>
              <div>
                <h4 className="text-white font-semibold">Correct Your Data</h4>
                <p className="text-sm mt-1">
                  Update, modify, or correct inaccurate information in your profile
                  at any time through account settings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">🗑️</div>
              <div>
                <h4 className="text-white font-semibold">Delete Your Data</h4>
                <p className="text-sm mt-1">
                  Request permanent deletion of your account and all associated data.
                  This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">🚫</div>
              <div>
                <h4 className="text-white font-semibold">Opt-Out</h4>
                <p className="text-sm mt-1">
                  Withdraw consent for data processing, opt-out of marketing emails,
                  and disable AI recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">📤</div>
              <div>
                <h4 className="text-white font-semibold">Data Portability</h4>
                <p className="text-sm mt-1">
                  Receive your data in a commonly-used, machine-readable format
                  and transfer it to other services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="text-blue-400 font-bold mt-1">🔍</div>
              <div>
                <h4 className="text-white font-semibold">Transparency</h4>
                <p className="text-sm mt-1">
                  Know how and why your data is being processed, and review all
                  third parties with access to your information.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-300">
              To exercise these rights, contact our privacy team at{" "}
              <span className="font-semibold">privacy@codelura.com</span> with proof of identity.
              We&apos;ll respond within 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: "11. International Data Transfers",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Our platform operates across multiple jurisdictions. Here&apos;s how we handle
            international data:
          </p>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">Data Transfers &amp; Agreements</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>
                  We implement Standard Contractual Clauses (SCCs) for EU-US data transfers
                </li>
                <li>GDPR compliance ensured for European users</li>
                <li>Data localization requirements are respected</li>
                <li>Binding Corporate Rules (BCRs) for affiliated companies</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Regional Compliance</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>GDPR (European Union)</li>
                <li>CCPA (California, USA)</li>
                <li>PIPEDA (Canada)</li>
                <li>LGPD (Brazil)</li>
                <li>India&apos;s Digital Personal Data Protection Act (DPDPA)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 12,
      title: "12. Data Retention &amp; Deletion",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We retain your data only as long as necessary to provide our services:
          </p>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">Retention Periods</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>
                  <span className="font-semibold">Active Account:</span> Data retained while
                  account is active
                </li>
                <li>
                  <span className="font-semibold">After Deletion:</span> Data deleted within 30
                  days (legal holds excepted)
                </li>
                <li>
                  <span className="font-semibold">Backups:</span> Data retained in backups for
                  60 days
                </li>
                <li>
                  <span className="font-semibold">Legal Requirements:</span> Longer retention
                  if required by law
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Account Deletion Process</h4>
              <ol className="list-decimal ml-6 space-y-1 text-sm mt-2">
                <li>Request account deletion from account settings</li>
                <li>Confirm deletion via email verification</li>
                <li>All personal data deleted within 30 days</li>
                <li>Public projects archived (unless specifically requested for deletion)</li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      title: "13. Privacy Policy Updates",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We may update this Privacy Policy to reflect changes in our practices or
            legal requirements:
          </p>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 space-y-3">
            <div>
              <h4 className="text-white font-semibold">Updates &amp; Notifications</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Major changes will be announced at least 30 days in advance</li>
                <li>We&apos;ll notify you via email for significant privacy changes</li>
                <li>The &quot;Last Updated&quot; date appears at the top of this policy</li>
                <li>Continued use of the platform indicates acceptance of changes</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-white font-semibold">Your Options</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
                <li>Review changes before they take effect</li>
                <li>Withdraw consent if you disagree with new terms</li>
                <li>Request account deletion if unhappy with changes</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 14,
      title: "14. Contact &amp; Privacy Inquiries",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Have questions about our privacy practices? Here&apos;s how to reach us:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="text-blue-400 w-5 h-5" />
                <h4 className="text-white font-semibold">Email</h4>
              </div>
              <p className="text-sm">
                <a href="mailto:privacy@codelura.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  privacy@codelura.com
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Response time: 48-72 hours
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="text-blue-400 w-5 h-5" />
                <h4 className="text-white font-semibold">Support</h4>
              </div>
              <p className="text-sm">
                <a href="mailto:support@codelura.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  support@codelura.com
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                For general inquiries
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-blue-400 w-5 h-5" />
                <h4 className="text-white font-semibold">Mailing Address</h4>
              </div>
              <p className="text-sm">
                Codelura Inc.<br />
                <span className="text-gray-500">Tech Hub, Innovation District</span><br />
                <span className="text-gray-500">Bangalore, India 560001</span>
              </p>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="text-blue-400 w-5 h-5" />
                <h4 className="text-white font-semibold">Phone</h4>
              </div>
              <p className="text-sm">
                <a href="tel:+918123456789" className="text-blue-400 hover:text-blue-300 transition-colors">
                  +91 812-345-6789
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Mon-Fri: 10 AM - 6 PM IST
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mt-4">
            <h4 className="text-white font-semibold mb-2">Data Protection Officer</h4>
            <p className="text-sm">
              If you have concerns about our data practices, you can reach our Data Protection
              Officer at{" "}
              <a href="mailto:dpo@codelura.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                dpo@codelura.com
              </a>
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-300 px-6 md:px-16 py-16">
      {/* HEADER SECTION */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <div className="inline-block mb-4 px-4 py-2 bg-blue-950/40 border border-blue-900 rounded-full">
          <p className="text-blue-300 text-sm font-semibold">PRIVACY &amp; SECURITY</p>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Privacy Policy
        </h1>

        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          Welcome to <span className="text-blue-400 font-semibold">Codelura</span>. Your privacy
          and data security are our top priorities. This comprehensive Privacy Policy explains
          how we collect, use, protect, and manage your information across our entire platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 text-sm">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2">
            <p className="text-gray-500">
              Last Updated:{" "}
              <span className="text-white font-semibold">{currentDate}</span>
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2">
            <p className="text-gray-500">
              Version: <span className="text-white font-semibold">2.0</span>
            </p>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h2 className="text-white font-semibold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section: Section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                → {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="max-w-7xl mx-auto space-y-4 mb-16">
        {sections.map((section: Section) => (
          <section
            key={section.id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-white text-left">
                {section.title}
              </h2>
              {expandedSections[section.id] ? (
                <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="px-6 py-4 border-t border-gray-800 bg-black/30">
                {section.content}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="max-w-5xl mx-auto border-t border-gray-800 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-white font-semibold mb-3">About Codelura</h3>
            <p className="text-gray-400 text-sm">
              A comprehensive platform for learning, building, and showcasing projects with
              AI-powered discovery.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="protection" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Data Processing Agreement
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  GDPR Compliance
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  CCPA Rights
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Codelura. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Privacy is a fundamental right. We&apos;re committed to protecting yours.
          </p>
        </div>
      </footer>
    </div>
  );
}