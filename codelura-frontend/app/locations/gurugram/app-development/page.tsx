import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { generateSchemas } from './schema';
import { gurugramAppDevMetadata } from './metadata';
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

export const metadata: Metadata = gurugramAppDevMetadata;

export default function GurugramAppDevelopmentPage() {
  const {
    organizationSchema,
    localBusinessSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema
  } = generateSchemas();

  return (
    <main className="bg-slate-950 text-slate-100 font-sans min-h-screen selection:bg-cyan-500 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Breadcrumb />
      <Hero />
      <Stats />
      <TrustedCompanies />

      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-slate-300 leading-relaxed text-base sm:text-lg">
          <div className="space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Mobile Engineering Leadership</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Definitive Mobile App Development Guide for Businesses in Gurugram &amp; Gurgaon
            </h2>
            <p className="text-slate-400">
              Mobile smartphones are the primary operational interface for consumers and corporate executives across Gurugram. Whether it is a D2C shopper on <strong className="text-white">Golf Course Road</strong>, an IT engineer in <strong className="text-white">Cyber City</strong> accessing corporate CRM, or an industrial manager in <strong className="text-white">Udyog Vihar or IMT Manesar</strong>, high-performance mobile apps drive engagement and revenue.
            </p>
          </div>

          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 rounded-3xl text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-bold text-white">Ready to Launch Your Mobile App in Gurugram?</h4>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Our Gurugram mobile app engineering team will analyze your app idea, craft an interactive UI/UX prototype, and build a high-performance Android &amp; iOS app ready for store launch.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all text-sm">
              <span>Get Free App Consultation</span>
            </a>
          </div>
        </div>
      </section>

      <FeaturedServices />
      <WhyChooseUs />
      <Process />
      <Packages />
      <Technologies />
      <Industries />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <Contact />
      <CTA />

      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-500 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>&copy; {new Date().getFullYear()} <strong className="text-white">Codelura Technologies</strong>. All rights reserved. Top App Development Company in Gurugram &amp; Gurgaon, Haryana.</div>
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
