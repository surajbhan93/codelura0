import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajSeoServicesMetadata } from './metadata';
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

export const metadata: Metadata = prayagrajSeoServicesMetadata;

export default function PrayagrajSeoServicesPage() {
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

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich Unique SEO/GEO/AEO Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Search Engine Dominance</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Comprehensive SEO &amp; Organic Growth Guide for Prayagraj (Allahabad) Businesses
            </h2>
            <p className="text-slate-400">
              In today's hyper-competitive digital landscape, having a website is only half the battle. If your target customers in <strong className="text-white">Civil Lines, Katra, George Town, Naini, Tagore Town, or Jhunsi</strong> cannot find your business on the first page of Google search results or in the Google Maps 3-Pack, your competitors are capturing thousands of high-intent inquiries every month.
            </p>
          </div>

          {/* Section: Local SEO & Google Maps 3-Pack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Dominating the Google 3-Pack Local Map Pack in Prayagraj</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When a student in Tagore Town searches for <em>"top IAS coaching in Prayagraj"</em> or a resident searches for <em>"best dentist near Civil Lines Allahabad"</em>, Google displays the prominent 3-Pack Local Map box above all organic web links. <strong className="text-cyan-400">Codelura</strong> specializes in hyper-local Google Business Profile (GBP) optimization.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Consistent NAP (Name, Address, Phone) citation synchronization across 30+ regional directories
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Geo-tagged photo uploads and weekly Google Business Profile post updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Local review generation &amp; response strategies to build 4.9+ star rating authority
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura SEO Strategy & Analytics Office in Prayagraj"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Technical SEO & Core Web Vitals */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Technical SEO &amp; Core Web Vitals Engineering (INP, LCP &amp; CLS)
            </h3>
            <p>
              Google’s ranking algorithms heavily penalize slow, poorly structured websites. Technical SEO forms the structural foundation of every high-ranking website in Prayagraj. At Codelura, our Senior Staff Engineers fix critical technical bottlenecks that prevent Google spiders from indexing your content:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Sub-Second Speed</div>
                <div>LCP &amp; INP optimization ensuring page load times under 1.2 seconds across mobile networks.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">JSON-LD Schemas</div>
                <div>Injection of LocalBusiness, ProfessionalService, FAQ &amp; Review structured data markup.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Crawl Architecture</div>
                <div>Error-free XML sitemaps, canonical tags, and clean JavaScript server-side rendering.</div>
              </div>
            </div>
          </div>

          {/* Section: AI SEO, GEO & AEO (Google AI Overviews) */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Generative Engine Optimization (GEO) &amp; AEO for Google AI Overviews
            </h3>
            <p>
              Search is evolving rapidly in 2026. With the rise of Google AI Overviews, ChatGPT Search, Perplexity, and Apple Siri voice queries, traditional keyword stuffing is obsolete. Users are asking complex conversational questions such as <em>"Which coaching institute in Katra has the highest selection rate for State PSC?"</em> or <em>"Who is the most recommended orthopedic surgeon in George Town Prayagraj?"</em>
            </p>
            <p>
              Codelura implements <strong className="text-white">Answer Engine Optimization (AEO)</strong> and <strong className="text-white">Generative Engine Optimization (GEO)</strong>. We structure your brand entity graph, publish clear conversational Q&amp;A snippets, and build entity authority so Google AI Overviews feature your business as the primary recommended answer.
            </p>
          </div>

          {/* Section: Educational Hub Coaching SEO */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Coaching &amp; Academic Institute SEO in Katra, Rambagh &amp; Tagore Town
            </h3>
            <p>
              Prayagraj is recognized as the educational preparation capital of Uttar Pradesh. Thousands of ambitious students flock to <strong className="text-white">Katra, Rambagh, Tagore Town, and Allahpur</strong> every year to prepare for IAS, State PSC, NEET, JEE, and Banking exams. Coaching institutes face intense local competition.
            </p>
            <p>
              Our specialized EdTech SEO strategy targets high-intent search terms such as <em>"best IAS coaching in Katra Prayagraj"</em>, <em>"top NEET institute near Rambagh"</em>, and <em>"UPPSC test series offline Prayagraj"</em>. We rank your course landing pages, student result showcases, and batch timetables directly at the top of Google.
            </p>
          </div>

          {/* Section: Medical & Real Estate SEO */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Specialized SEO for Healthcare in George Town &amp; Real Estate in Civil Lines
            </h3>
            <p>
              Whether you manage a multi-specialty hospital in <strong className="text-white">George Town</strong> or a real estate property development in <strong className="text-white">Civil Lines, Jhalwa, or Jhunsi</strong>, Codelura crafts tailored organic search campaigns:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300 pl-4">
              <li><strong className="text-white">Healthcare SEO:</strong> Optimized doctor profile pages, specialist department keywords, emergency helpline triggers, and local map rankings for patient acquisition.</li>
              <li><strong className="text-white">Real Estate SEO:</strong> Location property landing pages, property gallery schema, high-intent buyer keyword targeting, outranking national property aggregator portals.</li>
            </ul>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Claim the #1 Spot on Google in Prayagraj?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj SEO engineering team will audit your technical SEO health, analyze your local competitors, and deliver a comprehensive 90-day Google ranking roadmap.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Request Free SEO Audit</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* SEO Process Section */}
      <Process />

      {/* Pricing Packages Section */}
      <Packages />

      {/* Technologies & SEO Software Suite */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top SEO Company in Prayagraj (Allahabad), Uttar Pradesh.
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
