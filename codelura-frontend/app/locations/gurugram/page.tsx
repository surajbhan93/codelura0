import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { gurugramCityMetadata } from './metadata';
import { images } from '@/lib/images/images';
import Breadcrumb from './components/Breadcrumb';
import Hero from './components/Hero';
import Stats from './components/Stats';
import TrustedCompanies from './components/TrustedCompanies';
import FeaturedServices from './components/FeaturedServices';
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

export const metadata: Metadata = gurugramCityMetadata;

export default function GurugramCityHubPage() {
  const {
    organizationSchema,
    localBusinessSchema,
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

      {/* DEEP EDITORIAL CONTENT (AEO, SEO & GEO Optimization for Gurugram IT & Enterprise Ecosystem) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Gurugram IT &amp; Engineering Center</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Software &amp; IT Engineering Master Blueprint for Gurugram &amp; Gurgaon (NCR)
            </h2>
            <p className="text-slate-400">
              Gurugram (Gurgaon) is India's financial, SaaS, and technology hub. From Fortune 500 enterprise software centers in <strong className="text-white">Cyber City (DLF Cyber City)</strong> and luxury D2C brand headquarters on <strong className="text-white">Golf Course Road</strong> to industrial engineering zones in <strong className="text-white">Udyog Vihar (Phases 1-5)</strong>, tech parks on <strong className="text-white">Sohna Road (Spaze iTech Park &amp; JMD Megapolis)</strong>, and manufacturing plants in <strong className="text-white">IMT Manesar</strong>, global enterprises require Next.js 15 web software, iOS/Android mobile apps, and AEO/SEO/GEO search domination.
            </p>
          </div>

          {/* Section: Google Senior Staff Engineering vs Fragmented Local Agencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Google Senior Staff Software Engineering vs Fragmented Agencies</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura Technologies</strong>, our engineering hub near Cyber City builds enterprise software, full-stack Next.js 15 web apps, native mobile apps, and Entity AEO/GEO systems using strict Google Senior Software Engineer standards.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-200ms ultra-fast mobile rendering with Next.js 15 App Router &amp; Redis caching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  AEO (Voice Search), SEO (Map 3-Pack) &amp; GEO (Generative AI Search Engine) Rank #1 Optimization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  1-click Razorpay / Stripe payments, COD OTP verification &amp; Shiprocket logistics APIs
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Technologies IT Center in Cyber City Gurugram"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Specialized Sector Engineering */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Specialized Industry Software Solutions across Gurugram Localities
            </h3>
            <p>
              We engineer bespoke digital platforms customized for Gurugram's key business sectors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Cyber City SaaS Platforms</div>
                <div>Multi-tenant SaaS products, REST/GraphQL microservices, and automated billing subscriptions.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Golf Course D2C Stores</div>
                <div>Headless Next.js &amp; Shopify e-commerce storefronts with 1-click Razorpay UPI and COD verification.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">IMT Manesar Factory ERP</div>
                <div>Custom inventory ERP software, barcode scanners, IoT supply chain monitoring &amp; B2B wholesale portals.</div>
              </div>
            </div>
          </div>

          {/* Section: AEO, SEO & GEO Generative Search Optimization */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Triple Search Engine Dominance: AEO, SEO &amp; GEO (Generative Engine Optimization)
            </h3>
            <p>
              Search behavior has evolved beyond traditional blue links. Customers in Gurugram search for software companies using Google, voice queries on Google Assistant (AEO), and AI Search engines like <strong className="text-white">ChatGPT Search, Perplexity AI, Gemini, and Claude</strong> (GEO). Codelura Technologies structures your entity data, schema markups, citation networks, and technical content so AI models cite your business as the definitive authority in Gurugram.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Build Enterprise Digital Solutions in Gurugram?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Gurugram software engineering team will conduct a free technical audit of your business, evaluate your digital workflows, and deliver a custom software development blueprint.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free Tech Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <FeaturedServices />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Development Process Section */}
      <Process />

      {/* Pricing Packages Section */}
      <Packages />

      {/* Technologies & Analytics Stack */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura Technologies</strong>. All rights reserved. Top Software Company in Gurugram (Gurgaon), Haryana (NCR).
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
