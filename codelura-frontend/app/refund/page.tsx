import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Mail,
} from "lucide-react";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Refund Policy | Codelura - Subscriptions, Courses & Services",
  description: "Learn about Codelura's refund policy for premium subscriptions, digital courses, hackathons, services, and more. Clear terms for billing and refunds.",
  keywords: "refund policy, billing policy, Codelura refund, subscription refund, course refund, hackathon refund",
  openGraph: {
    title: "Refund Policy | Codelura",
    description: "Comprehensive refund policy for Codelura platform services",
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
  icon?: React.ReactNode;
  content: React.ReactNode;
}

// Server Component
export default function RefundPolicyPage() {
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
      title: "1. Policy Overview & Scope",
      icon: <FileText className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            This Refund Policy outlines the terms and conditions under which refunds
            may be issued for purchases made on the Codelura platform. It applies to:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Premium subscriptions and memberships</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Digital courses and learning materials</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Hackathon and event registrations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Service-based projects and custom work</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Digital content and tools</span>
              </li>
            </ul>
          </div>
          <p className="text-sm">
            Please read this policy carefully to understand our refund procedures and eligibility criteria.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. Premium Subscriptions & Memberships",
      icon: <DollarSign className="w-5 h-5 text-green-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Our premium subscription plans come with specific refund eligibility based on usage and time:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Refund Eligibility Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm text-yellow-300">Within 7 Days</p>
                  <p className="text-sm mt-1">Full refund if subscription unused or minimal features accessed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm text-orange-300">7-30 Days</p>
                  <p className="text-sm mt-1">Partial refund (50%) if less than 25% of features utilized</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm text-red-300">After 30 Days</p>
                  <p className="text-sm mt-1">No refund unless technical failure or service issue occurred</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Subscription Cancellation</h4>
            <p className="text-sm">
              Canceling your subscription stops future billing but does NOT entitle you to a refund for the
              current billing period. Your access continues until the end of the current billing cycle.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. Digital Courses & Learning Materials",
      icon: <FileText className="w-5 h-5 text-purple-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Refunds for digital courses depend on course access and completion level:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Course Refund Conditions</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Full Refund:</span> Within 7 days &amp; less than 10% course content accessed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">Partial Refund (50%):</span> Within 14 days &amp; 10-25% content accessed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-red-300">No Refund:</span> More than 25% course content accessed
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Content Access Tracking</h4>
            <p className="text-sm">
              Course completion and access levels are automatically tracked through your account dashboard.
              This helps us determine your eligibility for refunds accurately and fairly.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Hackathons & Event Registrations",
      icon: <Clock className="w-5 h-5 text-orange-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Event and hackathon registration fees have specific refund policies based on timing and circumstances:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Event Refund Timeline</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Full Refund:</span> Cancellation 30+ days before event
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">75% Refund:</span> 15-29 days before event
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-orange-300">50% Refund:</span> Less than 15 days before event
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-red-300">No Refund:</span> After event has started
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
            <h4 className="text-orange-300 font-semibold mb-2">Non-Refundable Scenarios</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm text-orange-200">
              <li>Event cancelled by participant (no-show)</li>
              <li>Disqualification due to rule violations</li>
              <li>User account violations or suspension</li>
              <li>Event postponed (refund may be offered for later event)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. Service-Based Projects & Custom Work",
      icon: <DollarSign className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Refunds for custom development services, web projects, or service-based work are subject to specific terms:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Service Work Refund Policy</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Full Refund:</span> Before work commencement (if agreed in contract)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">Partial Refund:</span> Based on work completed (documented in contract)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-red-300">No Refund:</span> After service delivery or substantial work completion
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Service Disputes</h4>
            <p className="text-sm">
              Service quality disputes are reviewed on a case-by-case basis. Both parties will be given opportunity
              to present documentation and evidence. Resolution may include partial refund, rework, or other remedies.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "6. Digital Downloads & Resources",
      icon: <FileText className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Digital downloads and resource purchases have limited refund options due to instant access nature:
          </p>
          <div className="bg-red-950/20 border border-red-900 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-3">Non-Refundable Digital Content</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm text-red-200">
              <li>Templates, code snippets, and resources</li>
              <li>Pre-made project files and assets</li>
              <li>Downloaded digital products</li>
              <li>One-time purchases of digital goods</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Exception: Technical Issues</h4>
            <p className="text-sm">
              If a digital product is defective, corrupted, or does not match description, refunds will be
              considered within 7 days of purchase with proof of the issue.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "7. Refund Request Process",
      icon: <FileText className="w-5 h-5 text-purple-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Follow these steps to request a refund:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Step-by-Step Refund Process</h4>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">1.</span>
                <span>Log in to your Codelura account and navigate to "Billing" section</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">2.</span>
                <span>Locate the transaction for which you want a refund</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">3.</span>
                <span>Click "Request Refund" and select reason from dropdown</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">4.</span>
                <span>Provide detailed explanation (minimum 20 characters)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">5.</span>
                <span>Submit supporting documentation if applicable (screenshots, error logs)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-400 w-6 flex-shrink-0">6.</span>
                <span>Wait for confirmation email (usually within 24 hours)</span>
              </li>
            </ol>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Required Information</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Account email address (registered email)</li>
              <li>Transaction ID (found in email receipt)</li>
              <li>Order date and amount</li>
              <li>Detailed reason for refund request</li>
              <li>Any supporting documentation</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. Processing Time & Methods",
      icon: <Clock className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Once your refund request is approved, we process it according to the following timeline:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Processing Timeline</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-yellow-300">Review Period:</span> 3-5 business days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-blue-300">Processing:</span> 5-10 business days after approval
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-green-300">Bank Transfer:</span> 3-7 business days (varies by bank)
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Refund Methods</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Original payment method (credit/debit card, wallet, etc.)</li>
              <li>Bank transfer (if original method unavailable)</li>
              <li>Codelura account credit (up to 1.5x refund amount - limited time)</li>
            </ul>
          </div>
          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Important Note</h4>
            <p className="text-sm">
              Bank processing times are beyond Codelura&apos;s control. If your refund hasn&apos;t appeared
              after 10 business days, contact your bank directly. We recommend providing your transaction
              reference number from our refund confirmation email.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "9. Non-Refundable Scenarios",
      icon: <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            The following situations are explicitly non-refundable:
          </p>
          <div className="bg-red-950/20 border border-red-900 rounded-lg p-4">
            <h4 className="text-red-300 font-semibold mb-3">Non-Refundable Cases</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ul className="space-y-2 text-sm text-red-200">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Purchaser change of mind</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Product or service was fully used</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>User violation of Terms &amp; Conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Account suspended or terminated</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-red-200">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Fraudulent transaction</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Refund request beyond policy timeframe</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Chargeback filed with credit card company</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Third-party charges or taxes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. Payment Method Specific Terms",
      icon: <DollarSign className="w-5 h-5 text-green-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Refund procedures vary slightly depending on your payment method:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Credit/Debit Card</h4>
              <p className="text-sm">Refund appears as credit on your card statement within 7-10 business days</p>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Digital Wallets (Apple Pay, Google Pay, etc.)</h4>
              <p className="text-sm">Refund credited back to wallet account; timeline depends on wallet provider</p>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Bank Transfer/UPI</h4>
              <p className="text-sm">Refund processed via bank transfer; typically 2-5 business days</p>
            </div>
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Gift Cards/Store Credit</h4>
              <p className="text-sm">Refund issued as store credit; can be used immediately in account</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: "11. Duplicate Charges & Billing Errors",
      icon: <Clock className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            If you notice duplicate charges or billing errors, we prioritize these requests:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Duplicate Charge Resolution</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>Report duplicate charge immediately via billing@codelura.com</li>
              <li>Include transaction IDs and evidence of duplication</li>
              <li>We investigate within 24-48 hours</li>
              <li>Approved refunds processed within 3-5 business days</li>
              <li>We may apply goodwill credit for inconvenience</li>
            </ul>
          </div>
          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Billing Error Protection</h4>
            <p className="text-sm">
              We take billing errors seriously. If a technical error caused incorrect charges, we will
              resolve this promptly with full refund and account credit compensation.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 12,
      title: "12. Chargebacks & Dispute Resolution",
      icon: <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            If you file a chargeback or dispute without contacting us first, we reserve specific rights:
          </p>
          <div className="bg-orange-950/20 border border-orange-900 rounded-lg p-4">
            <h4 className="text-orange-300 font-semibold mb-3">Chargeback Policy</h4>
            <ul className="space-y-2 text-sm text-orange-200">
              <li>We prefer resolving disputes directly with you first</li>
              <li>Chargebacks filed without contacting support may result in account suspension</li>
              <li>Repeated chargebacks may lead to permanent account ban</li>
              <li>You agree to pay chargeback fees ($15-50) charged by payment processors</li>
              <li>Our refund process is faster and easier than chargebacks</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Before Initiating Chargeback</h4>
            <p className="text-sm mb-2">Please contact us first at billing@codelura.com with:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Your concern and reason for dispute</li>
              <li>Transaction details and evidence</li>
              <li>Your preferred resolution</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      title: "13. Tax & Currency Considerations",
      icon: <DollarSign className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Refund amounts are subject to certain considerations based on payment location and currency:
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Tax &amp; Currency Policy</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>
                <span className="font-semibold">Taxes:</span> Refunds are issued for the amount including taxes.
                Customers responsible for any tax implications in their jurisdiction
              </li>
              <li>
                <span className="font-semibold">Currency Conversion:</span> If original payment in different currency,
                refund converted at current exchange rate; Codelura not responsible for rate fluctuations
              </li>
              <li>
                <span className="font-semibold">Exchange Fees:</span> International refunds may incur bank/payment
                processor fees (not charged by Codelura)
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 14,
      title: "14. Policy Updates & Contact Support",
      icon: <Mail className="w-5 h-5 text-blue-400" aria-hidden="true" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            This Refund Policy may be updated periodically. We encourage you to review it regularly.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Policy Updates</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Updates take effect on the date posted</li>
              <li>"Last Updated" date shown at bottom of page</li>
              <li>Significant changes communicated via email</li>
              <li>Continued use of platform = acceptance of updated policy</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-4 border border-blue-700 hover:border-blue-600 transition-colors">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" aria-hidden="true" />
                Billing &amp; Refunds
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                <a href="mailto:billing@codelura.com">billing@codelura.com</a>
              </p>
              <p className="text-xs text-gray-400 mt-2">For refund requests &amp; billing issues</p>
            </div>
            <div className="bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg p-4 border border-green-700 hover:border-green-600 transition-colors">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" aria-hidden="true" />
                General Support
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                <a href="mailto:support@codelura.com">support@codelura.com</a>
              </p>
              <p className="text-xs text-gray-400 mt-2">For general inquiries &amp; issues</p>
            </div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4 mt-6">
            <h4 className="text-blue-300 font-semibold mb-2">Response Timeline</h4>
            <p className="text-sm">
              We respond to refund requests within <span className="font-semibold">24-48 hours</span> of submission.
              For complex cases, investigation may take up to <span className="font-semibold">5 business days</span>.
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Client-side accordion component
  // const AccordionSection = ({ section }: { section: PolicySection }) => {
  //   'use client';
  //   const [isExpanded, setIsExpanded] = React.useState(false);

  //   return (
  //     <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600">
  //       <button
  //         onClick={() => setIsExpanded(!isExpanded)}
  //         className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
  //         aria-expanded={isExpanded}
  //       >
  //         <div className="flex items-center gap-3 text-left">
  //           {section.icon}
  //           <h3 className="text-lg font-semibold text-white">{section.title}</h3>
  //         </div>
  //         <div
  //           className={`transform transition-transform duration-300 ${
  //             isExpanded ? "rotate-180" : ""
  //           }`}
  //         >
  //           {isExpanded ? (
  //             <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" aria-hidden="true" />
  //           ) : (
  //             <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
  //           )}
  //         </div>
  //       </button>

  //       <div
  //         className={`overflow-hidden transition-all duration-300 ${
  //           isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
  //         }`}
  //       >
  //         <div className="px-6 py-4 border-t border-gray-700 bg-black/30">
  //           {section.content}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const AccordionSection = ({ section }: { section: PolicySection }) => {
  return (
    <details className="group bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600">
      <summary className="list-none cursor-pointer w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3 text-left">
          {section.icon}
          <h3 className="text-lg font-semibold text-white">
            {section.title}
          </h3>
        </div>

        <div className="transition-transform duration-300 group-open:rotate-180">
          <ChevronDown
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            aria-hidden="true"
          />
        </div>
      </summary>

      <div className="px-6 py-4 border-t border-gray-700 bg-black/30">
        {section.content}
      </div>
    </details>
  );
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-300 px-6 md:px-16 py-20">
      {/* SEO Hidden Heading */}
      <h1 className="sr-only">
        Codelura Refund Policy - Subscriptions, Courses, Hackathons &amp; Services Refund Terms
      </h1>

      {/* Header */}
      <header className="max-w-5xl mx-auto text-center mb-20">
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-green-950/40 to-green-900/40 border border-green-900 rounded-full">
          <p className="text-green-300 text-sm font-semibold">REFUND &amp; BILLING POLICY</p>
        </div>

        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Refund Policy
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          This comprehensive Refund Policy outlines the terms under which refunds may be issued
          for premium subscriptions, digital courses, hackathon registrations, service-based work,
          and other paid offerings on the Codelura platform.
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
            <h3 className="text-white font-semibold mb-3">About This Policy</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our refund policy is designed to be fair and transparent. We believe in customer
              satisfaction and stand behind our products and services.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Payment Methods</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Credit/Debit Cards</li>
              <li className="text-gray-400">Digital Wallets</li>
              <li className="text-gray-400">Bank Transfer/UPI</li>
              <li className="text-gray-400">Gift Cards</li>
            </ul>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Codelura Inc. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Codelura Refund Policy | Last Updated: {currentDate} | Version 2.0
          </p>
        </div>
      </footer>
    </div>
  );
}