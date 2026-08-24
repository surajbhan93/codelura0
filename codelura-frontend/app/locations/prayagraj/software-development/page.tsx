import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajSoftwareDevMetadata } from './metadata';
import { images } from '@/lib/images/images';
import Breadcrumb from './components/Breadcrumb';
import Hero from './components/Hero';
import Stats from './components/Stats';
import TrustedCompanies from './components/TrustedCompanies';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Process from './components/Process';
import Packages from './components/Packages';
import Technologies from './components/Technologies';
import Industries from './components/Industries';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import CTA from './components/CTA';

export const metadata: Metadata = prayagrajSoftwareDevMetadata;

export default function PrayagrajSoftwareDevelopmentPage() {
  const {
    organizationSchema,
    localBusinessSchema,
    softwareAppSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema
  } = generateSchemas();

  return (
    <main className="bg-slate-950 text-slate-100 font-sans min-h-screen selection:bg-cyan-500 selection:text-white">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation Breadcrumb */}
      <Breadcrumb />

      {/* Hero Section */}
      <Hero />

      {/* Statistics Bar */}
      <Stats />

      {/* Trusted Local Proof */}
      <TrustedCompanies />

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich Unique Software Engineering Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Enterprise Software Engineering</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Custom Software Development Guide for Enterprises in Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              As commercial, educational, and industrial enterprises across Prayagraj (Allahabad) expand rapidly, off-the-shelf software solutions fall short. Rigid pre-packaged software with high recurring per-seat fees fails to adapt to custom operational workflows in <strong className="text-white">Civil Lines, Katra, George Town, Naini, Tagore Town, or Jhunsi</strong>.
            </p>
          </div>

          {/* Section: Custom CRM & ERP Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Why Prayagraj Enterprises Need Custom CRM &amp; ERP Software</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, our Senior Staff Software Engineers build custom CRM, ERP, and business automation platforms utilizing Next.js 15, React 19, TypeScript, Node.js, and PostgreSQL. You gain 100% software ownership, zero per-seat licensing fees, and custom feature sets built specifically around your business.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-second data processing speed powered by Next.js App Router &amp; Redis caching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Automated Tally accounting sync, Razorpay UPI checkout &amp; WhatsApp Business alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Enterprise role-based security access, OAuth 2.0 &amp; automated cloud backups
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Enterprise Software Engineering Center in Prayagraj"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Educational EdTech ERP Katra */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Academic Institute ERP Software in Katra, Rambagh &amp; Tagore Town
            </h3>
            <p>
              Prayagraj is the educational preparation capital of Uttar Pradesh. Large competitive exam institutes managing tens of thousands of IAS, NEET, JEE, and State PSC aspirants in <strong className="text-white">Katra, Rambagh, Tagore Town, and Allahpur</strong> struggle with manual fee recording and offline test evaluation.
            </p>
            <p>
              Codelura engineers specialized Institute ERP software featuring online student admission, automated fee collection via UPI, SMS/WhatsApp receipt dispatch, student attendance tracking, online test series grading, and parent portals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">UPI Automated Fees</div>
                <div>Instant 1-click student fee payments with automated digital GST invoice generation.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Test Series Engine</div>
                <div>Online &amp; offline test evaluation with instant AI rank generation and SMS scorecards.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Attendance &amp; Alerts</div>
                <div>Biometric student attendance integrated with instant WhatsApp parent notification bots.</div>
              </div>
            </div>
          </div>

          {/* Section: Healthcare Hospital HMS George Town */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Hospital Management Software (HMS) for Clinics in George Town &amp; Ashok Nagar
            </h3>
            <p>
              Hospitals, multi-specialty polyclinics, and diagnostic laboratories in <strong className="text-white">George Town, Ashok Nagar, and Civil Lines</strong> face high patient volumes. Our custom HMS software digitizes OPD/IPD patient registration, doctor appointment scheduling, electronic medical records (EMR), pharmacy inventory, diagnostic lab billing, and bed allotment.
            </p>
          </div>

          {/* Section: Manufacturing ERP Naini & POS Billing Chowk */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Industrial Manufacturing ERP in Naini &amp; Retail POS Software in Chowk
            </h3>
            <p>
              From custom B2B manufacturing ERP software for factories in <strong className="text-white">Naini Industrial Area and Phaphamau</strong> tracking raw material procurement and bill of materials (BOM), to high-speed multi-counter POS billing and inventory software for retail merchants in <strong className="text-white">Chowk, Katra, and Lukerganj</strong>, Codelura engineers software systems that drive operational efficiency.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Automate Your Business with Custom Software?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj software engineering team will audit your operational workflows, design a custom architecture blueprint, and build software that scales your enterprise.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free Software Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Software Development Process Section */}
      <Process />

      {/* Pricing Packages Section */}
      <Packages />

      {/* Technologies & Frameworks */}
      <Technologies />

      {/* Industries Served */}
      <Industries />

      {/* Case Studies & Portfolio */}
      <Portfolio />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section with GoogleMap Component */}
      <Contact />

      {/* Call To Action & Footer CTA */}
      <CTA />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-500 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top Software Development Company in Prayagraj (Allahabad), Uttar Pradesh.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-cyan-400">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-cyan-400">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-cyan-400">Sitemap</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
