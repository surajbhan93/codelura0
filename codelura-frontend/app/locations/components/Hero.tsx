'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
// import { images } from '@/lib/images';
import { images } from '@/lib/images/images';
import { MapPin, Globe, CheckCircle, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-800/80 bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Overview */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium shadow-sm">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Multi-City Software Engineering &amp; Local Digital Transformation Hub</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Locations <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">We Serve</span> Across India
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Explore Codelura software development, Next.js 15 web applications, mobile apps, SEO, AI integration, and digital marketing services tailored for enterprises and growing businesses across <strong className="text-white">Prayagraj, Noida, Lucknow, Kanpur, Varanasi, Gurugram, Delhi, Agra, and Meerut</strong>.
            </p>

            {/* Quick Core Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Hyper-Local Industry Expertise</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sub-Second Next.js Core Web Vitals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Entity SEO &amp; Google Map 3-Pack Rank</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dedicated Regional Solution Architects</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#cities"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <span>Browse All City Hubs</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Contact National HQ</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-cyan-500/10">
              <Image
                src={images.hero}
                alt="Locations We Serve - Codelura Software & Digital Agency Across India"
                width={800}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="rounded-2xl w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">Codelura Multi-City Tech Network</span>
                    <span className="text-slate-400">Prayagraj • Noida • Lucknow • Gurugram</span>
                  </div>
                  <span className="bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full font-semibold border border-cyan-500/30">
                    Active Operations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
