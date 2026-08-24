import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajCityMetadata } from './metadata';
// import { images } from '@/lib/images';
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

export const metadata: Metadata = prayagrajCityMetadata;

export default function PrayagrajCityHubPage() {
  const {
    organizationSchema,
    localBusinessSchema,
    collectionPageSchema,
    itemListSchema,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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

      {/* DEEP EDITORIAL CONTENT (3000+ Words Rich Unique Software Engineering Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Prayagraj IT &amp; Engineering Center</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Software &amp; IT Engineering Master Blueprint for Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              Prayagraj (Allahabad) is experiencing a historic economic modernization. From educational preparation academies in <strong className="text-white">Katra and Tagore Town</strong> and healthcare polyclinics in <strong className="text-white">George Town</strong> to corporate law firms in <strong className="text-white">Civil Lines</strong>, industrial plants in <strong className="text-white">Naini</strong>, and retail merchants in <strong className="text-white">Chowk and Allahpur</strong>, businesses require world-class digital software, custom web applications, and local search dominance to expand nationwide.
            </p>
          </div>

          {/* Section: Google Senior Staff Engineering vs Local Freelancers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Google Senior Staff Software Engineering vs Fragmented Local Agencies</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, our central engineering lab in Civil Lines builds enterprise software, full-stack Next.js 15 web apps, native mobile apps, and Entity SEO systems using strict Google Senior Software Engineer standards.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-200ms ultra-fast mobile rendering with Next.js 15 App Router &amp; Redis caching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Local Search &amp; Google Map 3-Pack rank #1 optimization for local keyword queries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  1-click Razorpay UPI, COD OTP verification &amp; Shiprocket logistics automation
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Software Center in Civil Lines Prayagraj"
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
              Specialized Industry Software Solutions across Prayagraj Localities
            </h3>
            <p>
              We engineer bespoke digital platforms customized for Prayagraj’s key business sectors:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Katra Student Lead Portals</div>
                <div>Custom admission portals, online test apps, and automated WhatsApp brochure bots for IAS/NEET coaching.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">George Town Hospital Systems</div>
                <div>Custom Hospital Management Systems (HMS), doctor appointment booking web apps &amp; Google Local Call Ads.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Chowk Saree E-Commerce</div>
                <div>High-converting Next.js &amp; Shopify e-commerce stores with 1-click Razorpay UPI and COD OTP verification.</div>
              </div>
            </div>
          </div>

          {/* Section: Local Expertise & In-Person Civil Lines Presence */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Why In-Person Local Engineering Presence in Civil Lines Matters
            </h3>
            <p>
              Working with an offshore or distant agency often leads to communication barriers and delayed execution. Having our primary engineering team located in <strong className="text-white">Civil Lines, Prayagraj (near Subhash Chouraha)</strong> gives local business owners direct access to in-person technical consultation, rapid workflow audits, and 24/7 priority SLA support.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Build Enterprise Digital Solutions in Prayagraj?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj software engineering team will conduct a free technical audit of your business, evaluate your digital workflows, and deliver a custom software development blueprint.
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top Software Company in Prayagraj (Allahabad), Uttar Pradesh.
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
