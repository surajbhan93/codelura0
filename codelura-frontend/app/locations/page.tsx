import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { locationsMasterMetadata } from './metadata';
// import { images } from '@/lib/images';
import { images } from '@/lib/images/images';
import Breadcrumb from './components/Breadcrumb';
import Hero from './components/Hero';
import SearchLocation from './components/SearchLocation';
import FeaturedCities from './components/FeaturedCities';
import ServicesGrid from './components/ServicesGrid';
import PopularServices from './components/PopularServices';
import WhyChooseCodelura from './components/WhyChooseCodelura';
import CoverageMap from './components/CoverageMap';
import FAQ from './components/FAQ';
import CTA from './components/CTA';

export const metadata: Metadata = locationsMasterMetadata;

export default function LocationsMasterHubPage() {
  const {
    organizationSchema,
    websiteSchema,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Hero Section */}
      <Hero />

      {/* Live Interactive City Search Component */}
      <SearchLocation />

      {/* Featured Primary Regional Cities */}
      <FeaturedCities />

      {/* DEEP EDITORIAL CONTENT (1500+ Words Rich Unique Multi-City Infrastructure Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Multi-City Engineering Infrastructure</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Why Codelura Operates City-Specific Digital Engineering &amp; Software Hubs Across India
            </h2>
            <p className="text-slate-400">
              In India’s rapidly evolving digital economy, businesses cannot rely on generic, one-size-fits-all software providers. Commercial ecosystems in <strong className="text-white">Prayagraj, Noida, Lucknow, Kanpur, Varanasi, Gurugram, Delhi, Agra, and Meerut</strong> possess distinct local industry structures, target buyer demographics, regional search behaviors, and operational requirements.
            </p>
          </div>

          {/* Section: Dedicated Local Experts & Regional Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Dedicated Local Solution Architects &amp; Regional Strategy</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, our master location network connects our central engineering lab in Prayagraj with tech corridors across NCR and Uttar Pradesh. We deploy localized software solution architects who understand your city’s unique business landscape.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Hyper-local keyword mapping for Google Maps 3-Pack and AI Overviews search dominance
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Custom industry workflow engineering for coaching centers, hospitals, factories &amp; retail
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-second Next.js 15 App Router page speeds with Cloudflare edge CDN distribution
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Multi-City Tech Operations Center"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: How to Choose Your City Hub */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              How to Select the Right Location Hub for Your Enterprise
            </h3>
            <p>
              Navigating Codelura’s location network is simple. Select the city hub that corresponds to your primary business operations or target customer geography:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Prayagraj Hub</div>
                <div>Serving Civil Lines, Katra, George Town, Naini &amp; Eastern UP educational &amp; retail brands.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Noida &amp; NCR Hub</div>
                <div>Serving IT parks, SaaS companies, corporate enterprises &amp; D2C brands across Sector 62 &amp; Greater Noida.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Lucknow Capital Hub</div>
                <div>Serving Hazratganj, Gomti Nagar &amp; Alambagh healthcare polyclinics, real estate &amp; government web portals.</div>
              </div>
            </div>
          </div>

          {/* Section: Standardized Quality & Search Dominance */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Standardized Senior Staff Engineering Quality Across Every City
            </h3>
            <p>
              Regardless of which location hub you choose, every software system, custom website, mobile app, or SEO campaign engineered by Codelura is built to the exact same Google Senior Engineer standards: Next.js 15 App Router, React 19, TypeScript, sub-200ms TTFB rendering, Product &amp; LocalBusiness JSON-LD Schema markup, and bank-grade SSL security.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Partner with Codelura in Your City?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our regional technical team will audit your digital infrastructure, evaluate competitor performance, and deliver a custom software design blueprint tailored for your local market.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Schedule National Strategy Call</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Available Across Cities */}
      <ServicesGrid />

      {/* Popular City Service Routes */}
      <PopularServices />

      {/* Why Choose Codelura Across India */}
      <WhyChooseCodelura />

      {/* Coverage Map Section */}
      <CoverageMap />

      {/* FAQ Section */}
      <FAQ />

      {/* Call To Action & Footer Links */}
      <CTA />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-500 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Master Locations Hub - Software Development &amp; Digital Engineering Services Across India.
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
