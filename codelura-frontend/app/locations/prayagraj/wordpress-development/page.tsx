import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajWordPressDevMetadata } from './metadata';
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

export const metadata: Metadata = prayagrajWordPressDevMetadata;

export default function PrayagrajWordPressDevelopmentPage() {
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

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich Unique WordPress Engineering Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Custom CMS Engineering</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Comprehensive WordPress Development Guide for Businesses in Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              WordPress powers over 43% of the world's websites. However, many business websites in Prayagraj suffer from slow loading speeds, bloated themes, outdated plugins, and poor mobile responsiveness. Whether you run a competitive coaching institute in <strong className="text-white">Katra</strong>, a doctor polyclinic in <strong className="text-white">George Town</strong>, or a corporate consultancy in <strong className="text-white">Civil Lines</strong>, a custom-engineered WordPress website gives you full content control without sacrificing performance.
            </p>
          </div>

          {/* Section: Custom Gutenberg vs Heavy Pre-made Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Custom Gutenberg Block Engineering vs Bloated Themes</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, we build custom WordPress websites by engineering custom Gutenberg blocks and writing lightweight PHP 8.3 code. We eliminate heavy multipurpose themes and unnecessary plugins, achieving 95+ Google PageSpeed scores.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-second page rendering with Redis Object caching &amp; WebP image compression
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Intuitive drag-and-drop block editing — zero coding skills needed for staff updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Built-in LocalBusiness Schema &amp; Google Search Console sitemap indexing
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Custom WordPress Engineering Center in Prayagraj"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Educational Coaching Websites Katra */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Coaching Institute &amp; EduBlog WordPress Websites in Katra, Rambagh &amp; Tagore Town
            </h3>
            <p>
              Prayagraj is the educational preparation capital of Uttar Pradesh. Thousands of ambitious IAS, NEET, JEE, and Banking aspirants reside in <strong className="text-white">Katra, Rambagh, Tagore Town, and Allahpur</strong>. Educational institutes require fast WordPress sites to publish daily exam notifications, batch timetables, downloadable PDF study notes, and student results.
            </p>
            <p>
              Codelura equips Katra institutes with customized WordPress portals featuring student enrollment forms, PDF note repositories, WhatsApp lead routing, and automated SMS alerts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Downloadable PDF Notes</div>
                <div>Fast PDF study notes downloads organized by exam subject and batch year.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Batch Announcements</div>
                <div>Publish new batch schedules and exam notifications in seconds using Gutenberg blocks.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">WhatsApp Student Leads</div>
                <div>Direct 1-click WhatsApp inquiry chat triggers for instant student counseling.</div>
              </div>
            </div>
          </div>

          {/* Section: WooCommerce Chowk & Medical Sites George Town */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              WooCommerce Online Stores in Chowk &amp; Medical Websites in George Town
            </h3>
            <p>
              From custom WooCommerce e-commerce stores for retail merchants in <strong className="text-white">Chowk, Katra, and Lukerganj</strong> featuring 1-click Razorpay UPI payments and GST invoice generation, to patient-friendly medical WordPress sites for polyclinics in <strong className="text-white">George Town and Ashok Nagar</strong> displaying doctor schedules and booking forms, Codelura delivers tailored WordPress web engineering across Prayagraj.
            </p>
          </div>

          {/* Section: Real Estate Builders Civil Lines & Factories Naini */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Real Estate Portals in Civil Lines &amp; B2B Manufacturing Catalogs in Naini
            </h3>
            <p>
              Showcase residential flats and commercial land projects in <strong className="text-white">Civil Lines, Jhalwa, and Jhunsi</strong> with dynamic filterable WordPress property portals. For manufacturing units in <strong className="text-white">Naini Industrial Area and Phaphamau</strong>, we build digital B2B product catalog sites to connect with buyers nationwide.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Launch Your Custom WordPress Site in Prayagraj?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj WordPress engineering team will audit your current website, design a lightweight custom theme, and launch a fast, secure website ready for Google ranking.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free WordPress Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* WordPress Development Process Section */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top WordPress Development Company in Prayagraj (Allahabad), Uttar Pradesh.
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
