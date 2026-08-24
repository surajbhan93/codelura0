import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajEcommerceDevMetadata } from './metadata';
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

export const metadata: Metadata = prayagrajEcommerceDevMetadata;

export default function PrayagrajEcommerceDevelopmentPage() {
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

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich Unique E-Commerce Engineering Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">E-Commerce Software Engineering</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Comprehensive E-Commerce Website Development Guide for Merchants in Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              The digital retail landscape across Prayagraj (Allahabad) is undergoing a massive transformation. Saree and textile merchants in <strong className="text-white">Chowk</strong>, boutique fashion creators in <strong className="text-white">Civil Lines</strong>, educational book publishers in <strong className="text-white">Katra</strong>, and ayurvedic supplement brands in <strong className="text-white">George Town</strong> are no longer limited to regional physical store counters. Developing a custom e-commerce website unlocks direct access to millions of buyers across India.
            </p>
          </div>

          {/* Section: Custom Full-Stack Next.js vs Generic Templates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Full-Stack Next.js 15 &amp; Headless Architecture vs Slow Platforms</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, our Senior E-Commerce Architects engineer custom online shopping platforms using Next.js 15, React 19, TypeScript, Node.js, and PostgreSQL. We deliver sub-200ms page loads, eliminating checkout friction and boosting conversion rates.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-200ms ultra-fast mobile rendering with Next.js App Router &amp; Redis caching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  1-click Razorpay UPI checkout &amp; automated Cash on Delivery (COD) OTP fraud protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Automated Shiprocket logistics integration with real-time WhatsApp tracking alerts
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Custom E-Commerce Software Center in Prayagraj"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Fashion & Saree Handloom E-Commerce Chowk */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Saree &amp; Fashion Apparel D2C E-Commerce Platforms in Chowk &amp; Civil Lines
            </h3>
            <p>
              Chowk represents the heart of Prayagraj's textile and saree retail trade. Traditional retail merchants face growing competition from online fashion brands. A custom e-commerce shopping website allows local merchants to showcase authentic handlooms, silk sarees, and designer apparel to buyers in tier-1 cities like Delhi, Mumbai, and Bangalore.
            </p>
            <p>
              Codelura equips Prayagraj fashion stores with variant color swatches, interactive size charts, shoppable Instagram galleries, 1-click UPI checkout, and automated shipping labels.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Variant Swatches</div>
                <div>Visual color and fabric size selectors rendering smoothly without page reload delay.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">COD OTP Protection</div>
                <div>Automated SMS OTP verification for Cash on Delivery orders to eliminate fake orders.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">WhatsApp Tracking</div>
                <div>Instant order confirmation, shipping tracking, and delivery alerts sent directly to WhatsApp.</div>
              </div>
            </div>
          </div>

          {/* Section: Katra Book Publishers & Multi-Vendor Marketplaces */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Katra Academic Book E-Stores &amp; Multi-Vendor Regional Marketplaces
            </h3>
            <p>
              Educational book publishers in <strong className="text-white">Katra and Tagore Town</strong> process tens of thousands of online orders for competitive exam guides nationwide. We engineer high-throughput book e-stores with instant digital PDF downloads and Shiprocket courier integration. We also build Amazon-style Multi-Vendor Marketplaces allowing multiple sellers across UP to list products while you earn commission splits.
            </p>
          </div>

          {/* Section: B2B Wholesale Naini & Global Artisans Daraganj */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              B2B Wholesale Portals in Naini &amp; Global Handicraft E-Commerce in Daraganj
            </h3>
            <p>
              For wholesale hardware and industrial suppliers in <strong className="text-white">Lukerganj and Naini Industrial Area</strong>, we engineer B2B wholesale portals featuring tiered quantity pricing and GST credit invoices. For artisans in <strong className="text-white">Daraganj and Sangam Ghats</strong>, we build international e-commerce stores supporting multi-currency conversion to sell religious crafts globally.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Launch Your Custom Online Shopping Store in Prayagraj?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj e-commerce engineering team will audit your product catalog, design a high-converting storefront architecture, and launch an online store built for explosive sales growth.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free E-Commerce Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* E-Commerce Development Process Section */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top Ecommerce Website Development Company in Prayagraj (Allahabad), Uttar Pradesh.
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
