"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Shield,
  Settings,
  FileText,
  Mail,
  CheckCircle,
  Cookie,
  Eye,
} from "lucide-react";

interface ExpandedSections {
  [key: number]: boolean;
}

interface PolicySection {
  id: number;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut", // ✅ now valid
    },
  },
};

const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function CookiePolicyPage(): React.ReactElement {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

  const toggleSection = (sectionId: number): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentYear = new Date().getFullYear();

  const sections: PolicySection[] = [
    {
      id: 1,
      title: "1. What Are Cookies?",
      icon: <Cookie className="w-5 h-5 text-orange-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile phone)
            when you visit a website. They are widely used to make websites work more efficiently and to
            provide information to website owners.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">How Cookies Work</h4>
            <ul className="list-disc ml-6 space-y-2 text-sm">
              <li>When you visit Codelura, cookies are placed on your device</li>
              <li>Your browser sends these cookies back to us on each visit</li>
              <li>Cookies help us recognize you and remember your preferences</li>
              <li>They improve your browsing experience and platform functionality</li>
              <li>Cookies expire after a specified period or when you clear them</li>
            </ul>
          </div>
          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">Cookie Size &amp; Storage</h4>
            <p className="text-sm">
              Each cookie is typically only a few kilobytes in size. Your browser can store thousands of
              cookies without significant impact on device performance. You can delete cookies anytime
              through your browser settings.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "2. Types of Cookies We Use",
      icon: <Shield className="w-5 h-5 text-green-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Codelura uses different types of cookies to provide various functionality and improve your experience:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Essential/Strictly Necessary Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies are required for the website to function properly. Without them, core features
                wouldn&apos;t work.
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>User authentication and login sessions</li>
                <li>Security &amp; fraud prevention</li>
                <li>Basic website functionality</li>
                <li>CSRF protection &amp; security tokens</li>
                <li>Remember login state</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                Analytics &amp; Performance Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies help us understand how users interact with our platform and track performance:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Page views &amp; user interaction tracking</li>
                <li>Feature usage &amp; engagement metrics</li>
                <li>Performance monitoring &amp; optimization</li>
                <li>Error tracking &amp; debugging</li>
                <li>Tools: Google Analytics, Mixpanel, Hotjar</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-400" />
                Preference &amp; Functionality Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies remember your choices to enhance your experience:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Dark/light mode preference</li>
                <li>Language &amp; region settings</li>
                <li>Font size &amp; accessibility options</li>
                <li>User interface preferences</li>
                <li>Volume &amp; media player settings</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                Advertising &amp; Marketing Cookies
              </h4>
              <p className="text-sm mb-2">
                These cookies track your activity to serve relevant content (require opt-in):
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Retargeting &amp; remarketing campaigns</li>
                <li>Ad performance &amp; conversion tracking</li>
                <li>Interest-based content recommendations</li>
                <li>Tools: Google Ads, Facebook Pixel</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "3. First-Party vs Third-Party Cookies",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Cookies are classified based on their origin and the domain that sets them:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">First-Party Cookies</h4>
              <p className="text-sm mb-2">Set directly by Codelura domain (codelura.com):</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Session management &amp; user authentication</li>
                <li>User preferences &amp; settings</li>
                <li>Platform functionality cookies</li>
                <li>Security &amp; anti-fraud measures</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Third-Party Cookies</h4>
              <p className="text-sm mb-2">Set by external services &amp; partners:</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Google Analytics - anonymous usage statistics</li>
                <li>Google Ads - advertising &amp; conversion tracking</li>
                <li>Facebook Pixel - social media integration</li>
                <li>Cloudflare - security &amp; performance</li>
                <li>Payment processors - secure transactions</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "4. Cookie Duration &amp; Lifespan",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Cookies have different lifespans depending on their purpose:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Session Cookies</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Deleted when you close your browser</li>
                <li>Used for login sessions &amp; temporary data</li>
                <li>Don&apos;t persist on your device long-term</li>
                <li>Examples: Session ID, CSRF tokens</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Persistent Cookies</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Remain on your device for a set period</li>
                <li>Typically range from days to years</li>
                <li>Used for preferences &amp; analytics</li>
                <li>Examples: User preferences, analytics tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Cookie Expiration</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Essential cookies: 1 year - indefinite</li>
                <li>Analytics cookies: 6 months - 2 years</li>
                <li>Preference cookies: 1 year - indefinite</li>
                <li>Marketing cookies: 30 days - 2 years</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "5. Specific Cookies We Use",
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Here&apos;s a detailed list of cookies used on Codelura:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Authentication &amp; Security</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">session_id</span>
                  <span className="text-gray-500">Essential</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Maintains user login session - expires on browser close</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">csrf_token</span>
                  <span className="text-gray-500">Essential</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Prevents cross-site request forgery - expires per request</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">auth_remember</span>
                  <span className="text-gray-500">Essential</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Remember me functionality - 30 days expiration</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">User Preferences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">theme_preference</span>
                  <span className="text-gray-500">Preference</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Stores dark/light mode preference - 1 year</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">language_setting</span>
                  <span className="text-gray-500">Preference</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">User language preference - 6 months</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">notification_prefs</span>
                  <span className="text-gray-500">Preference</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Notification settings - 1 year</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Analytics &amp; Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">_ga, _ga_*</span>
                  <span className="text-gray-500">Analytics</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Google Analytics tracking - 2 years</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">_gid</span>
                  <span className="text-gray-500">Analytics</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Google Analytics session ID - 24 hours</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">mixpanel_uuid</span>
                  <span className="text-gray-500">Analytics</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Mixpanel analytics tracking - 5 years</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Advertising &amp; Marketing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">facebook_pixel</span>
                  <span className="text-gray-500">Marketing</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Facebook conversion tracking - 3 months</p>

                <div className="flex justify-between mt-2">
                  <span className="font-semibold">google_ads_id</span>
                  <span className="text-gray-500">Marketing</span>
                </div>
                <p className="ml-0 text-xs text-gray-500">Google Ads conversion tracking - 6 months</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "6. How to Control &amp; Delete Cookies",
      icon: <Settings className="w-5 h-5 text-purple-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            You have full control over cookies in your browser. Here&apos;s how to manage them:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Browser-Level Cookie Management</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 w-24 flex-shrink-0">Chrome:</span>
                  <span>Settings → Privacy and Security → Cookies and Other Site Data</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 w-24 flex-shrink-0">Firefox:</span>
                  <span>Preferences → Privacy → Cookies and Site Data</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 w-24 flex-shrink-0">Safari:</span>
                  <span>Preferences → Privacy → Cookies and Website Data</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 w-24 flex-shrink-0">Edge:</span>
                  <span>Settings → Privacy → Cookies and Other Site Data</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Cookie Management Options</h4>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">Block All Cookies:</span> Prevent all cookies from being set
                </li>
                <li>
                  <span className="font-semibold">Block Third-Party Cookies:</span> Allow first-party, block third-party
                </li>
                <li>
                  <span className="font-semibold">Clear Cookies:</span> Delete existing cookies for specific sites
                </li>
                <li>
                  <span className="font-semibold">Allow Exceptions:</span> Add specific sites to allow list
                </li>
              </ul>
            </div>

            <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Important Note</h4>
              <p className="text-sm">
                Blocking essential cookies may prevent Codelura from functioning properly, including login,
                security features, and basic functionality. Preference cookies help us remember your choices.
                We recommend blocking only non-essential marketing cookies if desired.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "7. Cookie Consent &amp; Opt-Out",
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We respect your privacy choices regarding cookies:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Consent Banner</h4>
              <p className="text-sm mb-2">
                When you first visit Codelura, we show a cookie consent banner. You can:
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Accept All:</span> Consent to all non-essential cookies
                </li>
                <li>
                  <span className="font-semibold">Reject All:</span> Only essential cookies will be used
                </li>
                <li>
                  <span className="font-semibold">Customize:</span> Choose specific cookie categories
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Changing Your Preferences</h4>
              <p className="text-sm mb-2">
                You can change your cookie preferences anytime:
              </p>
              <ol className="list-decimal ml-6 space-y-1 text-sm">
                <li>Click &quot;Cookie Settings&quot; in website footer</li>
                <li>Go to Account Settings → Privacy → Cookie Preferences</li>
                <li>Manage individual cookie categories</li>
                <li>Save your preferences</li>
              </ol>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Do Not Track (DNT)</h4>
              <p className="text-sm">
                If you enable DNT in your browser, we will honor your preference and limit tracking cookies.
                However, some cookies may still be necessary for core functionality.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. Data Privacy &amp; Security",
      icon: <Shield className="w-5 h-5 text-red-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Your cookie data is protected with multiple security measures:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Security Measures</h4>
              <ul className="list-disc ml-6 space-y-2 text-sm">
                <li>
                  <span className="font-semibold">HTTPS Only:</span> Cookies transmitted over encrypted HTTPS connections
                </li>
                <li>
                  <span className="font-semibold">HttpOnly Flag:</span> Session cookies marked HttpOnly to prevent JavaScript access
                </li>
                <li>
                  <span className="font-semibold">Secure Flag:</span> Sensitive cookies only transmitted over HTTPS
                </li>
                <li>
                  <span className="font-semibold">SameSite Attribute:</span> Prevents cross-site cookie transmission
                </li>
                <li>
                  <span className="font-semibold">Regular Audits:</span> Security reviews of cookie data handling
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Data Retention</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Cookies expire based on their lifespan</li>
                <li>Persistent data in our systems retained per Privacy Policy</li>
                <li>You can request data deletion anytime</li>
                <li>Analytics data anonymized after 6 months</li>
              </ul>
            </div>

            <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Personal Information</h4>
              <p className="text-sm">
                Cookies do not directly store personal information like passwords or credit card numbers.
                They only contain session identifiers that link to data stored securely on our servers.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: "9. Third-Party Services &amp; Partnerships",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            We partner with trusted third-party services that may set their own cookies:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Analytics Partners</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="font-semibold">Google Analytics</span>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Mixpanel</span>
                  <a href="https://mixpanel.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Hotjar</span>
                  <a href="https://www.hotjar.com/legal/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Advertising Partners</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="font-semibold">Google Ads</span>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Facebook Pixel</span>
                  <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Service Providers</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="font-semibold">Stripe (Payments)</span>
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Cloudflare (CDN/Security)</span>
                  <a href="https://www.cloudflare.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Partner Compliance</h4>
              <p className="text-sm">
                All third-party partners are bound by data processing agreements to protect your information
                and comply with GDPR, CCPA, and other privacy regulations.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. GDPR &amp; Global Privacy Compliance",
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            Codelura complies with international data protection regulations:
          </p>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">GDPR (European Union)</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Consent required before non-essential cookies</li>
                <li>Right to access, delete, and export cookie data</li>
                <li>Cookie banner displayed for all EU users</li>
                <li>Legitimate interest basis for analytics cookies</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">CCPA (California, USA)</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Right to know what cookies are used</li>
                <li>Right to delete cookie data</li>
                <li>Right to opt-out of cookie-based tracking</li>
                <li>&quot;Do Not Sell&quot; link available</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Other Regulations</h4>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>ePrivacy Directive (EU) - cookie consent</li>
                <li>LGPD (Brazil) - data protection compliance</li>
                <li>PIPEDA (Canada) - privacy requirements</li>
                <li>India DPDPA - digital personal data protection</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: "11. Frequently Asked Questions",
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Are cookies safe?</h4>
              <p className="text-sm">
                Yes, cookies are generally safe. They cannot carry viruses or access files. However, they do
                track behavior. You can always manage them in browser settings. Essential cookies are necessary
                for website function and don&apos;t pose privacy risks.
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Can I browse without cookies?</h4>
              <p className="text-sm">
                You can block cookies, but many websites won&apos;t work properly. Codelura requires essential
                cookies for login, security, and core functionality. You can still use Codelura by blocking
                only non-essential (marketing, analytics) cookies.
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">How often are cookies updated?</h4>
              <p className="text-sm">
                We regularly review and update our cookie list as we integrate new services. Major changes
                will be reflected in this policy. You can always check our cookie list below for current
                implementations.
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">What if I disable cookies?</h4>
              <p className="text-sm">
                If you disable all cookies, some features may not work (login, preferences saved, etc.).
                We recommend keeping essential cookies enabled. You can selectively disable analytics and
                marketing cookies while keeping necessary ones active.
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-white font-semibold mb-2">Do you track me across websites?</h4>
              <p className="text-sm">
                Third-party cookies from Google and Facebook may track you across multiple websites for
                advertising purposes. You can opt-out through Google Ads Settings or Facebook Settings.
                We respect DNT signals and allow users to disable these cookies.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 12,
      title: "12. Updates &amp; Contact",
      icon: <Mail className="w-5 h-5 text-blue-400" />,
      content: (
        <div className="space-y-4 text-gray-400 leading-relaxed">
          <p>
            This Cookie Policy may be updated periodically. We encourage you to review it regularly.
          </p>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-3">Policy Updates</h4>
            <ul className="list-disc ml-6 space-y-1 text-sm">
              <li>Updates take effect on the date posted</li>
              <li>&quot;Last Updated&quot; date shown at bottom of page</li>
              <li>Significant changes communicated via email</li>
              <li>Continued use of platform = acceptance of updated policy</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-4 border border-blue-700 hover:border-blue-600 transition-colors"
            >
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Privacy Inquiries
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                <a href="mailto:privacy@codelura.com">privacy@codelura.com</a>
              </p>
              <p className="text-xs text-gray-400 mt-2">For privacy &amp; cookie questions</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg p-4 border border-green-700 hover:border-green-600 transition-colors"
            >
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400" />
                General Support
              </h4>
              <p className="text-blue-400 font-medium hover:text-blue-300 transition-colors text-sm">
                <a href="mailto:support@codelura.com">support@codelura.com</a>
              </p>
              <p className="text-xs text-gray-400 mt-2">For general inquiries</p>
            </motion.div>
          </div>

          <div className="bg-blue-950/20 border border-blue-900 rounded-lg p-4 mt-6">
            <h4 className="text-blue-300 font-semibold mb-2">Response Timeline</h4>
            <p className="text-sm">
              We respond to privacy inquiries within <span className="font-semibold">48 hours</span>.
              For complex requests, we may need up to <span className="font-semibold">30 days</span> to comply
              with your rights.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-300 px-6 md:px-16 py-20">
      {/* SEO Hidden Heading */}
      <h1 className="sr-only">
        Codelura Cookie Policy - Cookies Usage, Types &amp; Management Guide
      </h1>

      {/* HEADER */}
      <motion.section
        variants={fadeInDown}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto text-center mb-20"
      >
        <motion.div
          variants={fadeInUp}
          className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-orange-950/40 to-orange-900/40 border border-orange-900 rounded-full"
        >
          <p className="text-orange-300 text-sm font-semibold">COOKIE &amp; TRACKING POLICY</p>
        </motion.div>

        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Cookie Policy
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
          This comprehensive Cookie Policy explains what cookies are, the types of cookies Codelura uses,
          how they work, and how you can control them. We&apos;re committed to transparency about data collection.
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
      </motion.section>

      {/* TABLE OF CONTENTS */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mb-16"
      >
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((section: PolicySection) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className="text-left text-blue-400 hover:text-blue-300 text-sm transition-colors hover:translate-x-1"
              >
                → {section.title}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONTENT SECTIONS */}
      <div className="max-w-5xl mx-auto space-y-4 mb-16">
        {sections.map((section: PolicySection) => (
          <motion.section
            key={section.id}
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-600"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                {section.icon}
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections[section.id] ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {expandedSections[section.id] ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </motion.div>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: expandedSections[section.id] ? "auto" : 0,
                opacity: expandedSections[section.id] ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-4 border-t border-gray-700 bg-black/30">
                {section.content}
              </div>
            </motion.div>
          </motion.section>
        ))}
      </div>

      {/* FOOTER */}
      <motion.footer
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto border-t border-gray-800 pt-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-white font-semibold mb-3">About Cookies</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cookies are essential for modern web functionality. We use them responsibly to improve
              your experience while respecting your privacy and data protection rights.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Related Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="/protection" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Data Protection
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Your Rights</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Manage cookie preferences</li>
              <li className="text-gray-400">Clear cookies anytime</li>
              <li className="text-gray-400">Request data deletion</li>
              <li className="text-gray-400">Opt-out of tracking</li>
            </ul>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Codelura Inc. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Codelura Cookie Policy | Last Updated: {currentDate} | Version 2.0
          </p>
        </div>
      </motion.footer>
    </div>
  );
}