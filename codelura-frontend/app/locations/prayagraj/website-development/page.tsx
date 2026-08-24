import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { prayagrajWebsiteDevMetadata } from './metadata';
import { images } from '@/lib/images/images';
import Breadcrumb from '@/components/location/Breadcrumb';
import Hero from '@/components/location/Hero';
import Stats from '@/components/location/Stats';
import TrustedCompanies from '@/components/location/TrustedCompanies';
import Services from '@/components/location/Services';
import WhyChooseUs from '@/components/location/WhyChooseUs';
import Process from '@/components/location/Process';
import Packages from '@/components/location/Packages';
import Technologies from '@/components/location/Technologies';
import Industries from '@/components/location/Industries';
import Portfolio from '@/components/location/Portfolio';
import Testimonials from '@/components/location/Testimonials';
import FAQ from '@/components/location/FAQ';
import Contact from '@/components/location/Contact';
import CTA from '@/components/location/CTA';
export const metadata: Metadata = prayagrajWebsiteDevMetadata;

export default function PrayagrajWebsiteDevelopmentPage() {
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

      {/* Quick Statistics Bar */}
      <Stats />

      {/* Local Proof & Trusted Sectors */}
      <TrustedCompanies />

      {/* DEEP EDITORIAL CONTENT (3500+ Words Rich SEO/GEO/AEO Text) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Local Digital Transformation</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Website Development Guide for Businesses in Prayagraj (Allahabad)
            </h2>
            <p className="text-slate-400">
              Prayagraj (historically known as Allahabad) is rapidly transforming into a modern commercial, educational, and healthcare powerhouse in Uttar Pradesh. As consumer behavior shifts decisively toward online search, having a fast, responsive, and Google rank-optimized website is no longer optional — it is the single most vital growth engine for any enterprise operating in <strong className="text-white">Civil Lines, Katra, George Town, Naini, Tagore Town, or Jhunsi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900 border border-slate-800 p-8 rounded-3xl">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Engineering Web Excellence for Prayagraj</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                At <strong className="text-cyan-400">Codelura</strong>, we don’t assemble generic templates. We build high-speed, custom web platforms utilizing Next.js 15, React 19, TypeScript, and Tailwind CSS v4. Our web solutions deliver sub-second loading speeds, full Schema structured data markup, and localized Google Maps 3-Pack integration.
              </p>
              <ul className="text-xs text-slate-400 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Sub-second Core Web Vitals performance score (95+)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Entity GEO &amp; AEO optimization for Google AI Overviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Localized conversion funnels tailored for Uttar Pradesh users
                </li>
              </ul>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <Image
                src={images.office}
                alt="Codelura Prayagraj Development Office Team"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                loading="lazy"
                className="object-cover"
              />
            </div>
          </div>

          {/* Section: Educational Hub Focus */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Empowering Coaching Institutes in Katra &amp; Rambagh with Custom Web Portals
            </h3>
            <p>
              Prayagraj is celebrated nationwide as the primary educational preparation hub for IAS, State PSC, NEET, JEE, SSC, and Banking competitive examinations. Hundreds of thousands of aspiring students flood <strong className="text-white">Katra, Rambagh, Tagore Town, and Allahpur</strong> every year searching for top-tier coaching academies.
            </p>
            <p>
              Traditional pamphleteering and local hoardings are no longer sufficient to attract digital-native students. Coaching centers require specialized ed-tech web portals equipped with:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
                Online Batch Registration &amp; Fee Payments
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
                Downloadable PDF Study Material &amp; Syllabus
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200">
                Instant Student Inquiry Lead Routing via WhatsApp
              </div>
            </div>
          </div>

          {/* Section: Healthcare Focus */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Specialized Healthcare &amp; Hospital Website Development in George Town &amp; Ashok Nagar
            </h3>
            <p>
              Healthcare institutions, multi-specialty clinics, diagnostic laboratories, and private medical practitioners in <strong className="text-white">George Town, Ashok Nagar, and Civil Lines</strong> face unique patient communication challenges. Patients requiring urgent medical consultations or specialist care actively search Google for <em>"top cardiologist in George Town Prayagraj"</em> or <em>"best multi-specialty hospital near me"</em>.
            </p>
            <p>
              Codelura designs HIPAA-compliant, user-friendly medical websites featuring online doctor schedule viewings, instant patient appointment booking forms, emergency helpline triggers, and direct diagnostic report access portals.
            </p>
          </div>

          {/* Section: Real Estate Focus */}
          <div className="space-y-4 pt-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Accelerating Real Estate &amp; Construction Sales in Civil Lines, Jhalwa &amp; Jhunsi
            </h3>
            <p>
              With massive infrastructure developments across <strong className="text-white">Civil Lines, Jhalwa, Kalindipuram, and Jhunsi</strong>, the Prayagraj real estate sector is booming. Builders and property consultants require modern real estate listing portals that display residential apartments, commercial plazas, and township developments with high-resolution photo galleries, interactive floor plans, video walkthroughs, and direct lead capture integrations.
            </p>
          </div>

          {/* Editorial Callout */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Outpace Competitors in Prayagraj?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Prayagraj web engineering team is ready to analyze your market niche, craft a custom visual wireframe, and build a high-performance web platform that converts visitors into paying clients.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm"
            >
              <span>Get Started Today</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Development Process Section */}
      <Process />

      {/* Pricing Packages Section */}
      <Packages />

      {/* Technologies Section */}
      <Technologies />

      {/* Industries Served Section */}
      <Industries />

      {/* Portfolio / Case Studies Section */}
      <Portfolio />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Section with GoogleMap Component */}
      <Contact />

      {/* Call To Action & Footer CTA */}
      <CTA />

      {/* Simple Site Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-500 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">Codelura</strong>. All rights reserved. Top Website Development Company in Prayagraj (Allahabad), Uttar Pradesh.
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
