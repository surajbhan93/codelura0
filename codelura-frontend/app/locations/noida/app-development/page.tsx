import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { noidaAppDevMetadata } from './metadata';
import { images } from '@/lib/images/images';
import Breadcrumb from '../components/Breadcrumb';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import TrustedCompanies from '../components/TrustedCompanies';
import FeaturedServices from '../components/FeaturedServices';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import Packages from '../components/Packages';
import Technologies from '../components/Technologies';
import Industries from '../components/Industries';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import CTA from '../components/CTA';

export const metadata: Metadata = noidaAppDevMetadata;

export default function NoidaAppDevelopmentPage() {
  const {
    organizationSchema,
    localBusinessSchema,
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

      {/* DEEP EDITORIAL CONTENT (AEO, SEO & GEO Mobile Engineering Guide for Noida) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Mobile Engineering Leadership</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Mobile App Development Guide for Businesses in Noida &amp; Greater Noida
            </h2>
            <p className="text-slate-400">
              Mobile smartphones are the primary operational and transactional interface for consumers, employees, and enterprises across Noida (NCR). Whether it is a D2C shopper in <strong className="text-white">Sector 18</strong> ordering products online, an IT engineer in <strong className="text-white">Sector 62 (Stellar IT Park)</strong> accessing enterprise CRM, or a resident in <strong className="text-white">Greater Noida West</strong> scheduling local services, high-performance mobile apps drive user engagement and business revenue.
            </p>
          </div>

          {/* Section: Cross-Platform & Native Mobile Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Flutter &amp; React Native vs Native Mobile Engineering</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura Technologies</strong>, our Senior Staff Mobile Engineers specialize in both cross-platform (Google Flutter &amp; React Native) and native (Kotlin for Android &amp; Swift for iOS) software architectures. We build mobile applications that render at a fluid 60fps, feature offline-first caching, and consume minimal battery and memory resources.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Single-codebase cross-platform efficiency reducing dev costs by 50%
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Native module bridges for hardware GPS, Bluetooth, biometrics &amp; camera SDKs
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-second API response times backed by Node.js &amp; PostgreSQL microservices
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Mobile App Engineering Lab in Sector 62 Noida"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Enterprise & Startup Mobile Apps */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Enterprise Workforce &amp; SaaS Mobile App Development in Sector 62, 63 &amp; Expressway
            </h3>
            <p>
              Noida is the corporate software hub of Uttar Pradesh NCR. High-growth startups and enterprises in <strong className="text-white">Sector 62, Sector 63, Sector 125, Sector 132, and Electronic City</strong> deploy mobile apps for field force management, logistics tracking, CRM workflow automation, and customer self-service.
            </p>
            <p>
              Codelura Technologies builds enterprise mobile apps equipped with biometric login (FaceID/Fingerprint), encrypted SQLite data storage, push notifications via FCM/APNs, and 1-click payment integrations (Razorpay, Stripe, UPI).
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Launch Your Mobile App in Noida?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Noida mobile app engineering team will analyze your app idea, craft an interactive UI/UX prototype, and build a high-performance Android &amp; iOS app ready for store launch.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free App Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <FeaturedServices />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* App Development Process Section */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura Technologies</strong>. All rights reserved. Top App Development Company in Noida &amp; Greater Noida, Uttar Pradesh (NCR).
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
