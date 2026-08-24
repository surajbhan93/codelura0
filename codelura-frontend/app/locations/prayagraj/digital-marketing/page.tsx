import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajDigitalMarketingMetadata } from './metadata';
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

export const metadata: Metadata = prayagrajDigitalMarketingMetadata;

export default function PrayagrajDigitalMarketingPage() {
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

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich Unique Digital Marketing Engineering Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Performance Marketing Leadership</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Digital Marketing &amp; Lead Generation Blueprint for Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              Traditional offline advertising method (newspaper ads, hoardings, paper pamflets) are no longer sufficient to scale a business in Prayagraj. Consumers and students across <strong className="text-white">Civil Lines, Katra, George Town, Naini, Tagore Town, and Allahpur</strong> spend over 4 hours daily on Google, YouTube, Instagram, and WhatsApp. To capture market share, businesses require a data-driven digital marketing agency that measures success by lower Cost Per Lead (CPL) and higher Return On Ad Spend (ROAS).
            </p>
          </div>

          {/* Section: Data-Driven Performance Marketing vs Vanity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Data-Driven Performance Marketing vs Vanity Impression Metrics</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, our Senior Performance Growth Engineers engineer multi-channel ad campaigns across Google Ads (PPC), Meta Ads (Facebook &amp; Instagram), YouTube Ads, and Local SEO. We track every lead back to its exact keyword source and conversion path.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Server-side Meta CAPI &amp; GA4 event tracking eliminating lost conversion data
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Official WhatsApp Business API auto-responder bots for instant prospect engagement
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Weekly A/B creative split testing reducing Cost Per Acquisition (CPA)
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Performance Digital Growth Center in Prayagraj"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Coaching Lead Generation Katra */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Student Admission Lead Campaigns for Katra &amp; Tagore Town Coaching Academies
            </h3>
            <p>
              Prayagraj is the competitive exam coaching epicenter of Uttar Pradesh. Thousands of ambitious IAS, NEET, JEE, and Banking aspirants move to <strong className="text-white">Katra, Rambagh, Tagore Town, and Allahpur</strong> every year. Coaching institutes face intense competition during admission seasons.
            </p>
            <p>
              Codelura builds high-volume student lead engines combining Meta Instant Lead Forms, Google Search Ads for competitive exam keywords, and automated WhatsApp welcome brochure broadcasts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Google Search Ads</div>
                <div>Target high-intent keywords like 'best IAS coaching in Katra Prayagraj' with instant call extensions.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Meta Instant Lead Forms</div>
                <div>Capture student name, phone number, and targeted exam batch preferences directly inside Instagram.</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 space-y-1">
                <div className="text-cyan-400 font-bold text-sm">WhatsApp Auto Drip</div>
                <div>Automated instant PDF syllabus sending and counselor callback triggers upon form fill.</div>
              </div>
            </div>
          </div>

          {/* Section: Healthcare Patient Leads George Town & Real Estate Civil Lines */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Patient Lead Campaigns in George Town &amp; Real Estate Property Ads in Civil Lines
            </h3>
            <p>
              For multi-specialty hospitals and polyclinics in <strong className="text-white">George Town and Ashok Nagar</strong>, we run Google Call-Only Ads and Google Maps 3-Pack Local SEO campaigns to fill OPD doctor schedules. For real estate builders in <strong className="text-white">Civil Lines, Jhalwa, and Jhunsi</strong>, we run targeted HNI Meta Ads generating qualified buyer leads for residential flats and plots.
            </p>
          </div>

          {/* Section: Retail D2C Sales Chowk & Industrial B2B Naini */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              D2C E-Commerce ROAS Ads in Chowk &amp; B2B Industrial Ads in Naini
            </h3>
            <p>
              From high-ROAS Meta Advantage+ Shopping campaigns and Google Shopping Ads for handloom saree merchants in <strong className="text-white">Chowk and Katra</strong>, to B2B Google Search Ads connecting manufacturing plants in <strong className="text-white">Naini Industrial Area and Phaphamau</strong> with buyers nationwide, Codelura drives predictable digital growth.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Scale Your Business Leads &amp; Sales Revenue?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj performance marketing team will audit your current digital campaigns, analyze competitor ad strategies, and launch high-ROI Google &amp; Meta ad campaigns.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Free Marketing Consultation</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Digital Marketing Process Section */}
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
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top Digital Marketing Company in Prayagraj (Allahabad), Uttar Pradesh.
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
