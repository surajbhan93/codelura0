'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { images } from '@/lib/images/images';
import { COMPANY_DETAILS } from '../constants';
import { MapPin, ArrowRight, MessageSquare, Phone, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-slate-800/80 bg-slate-950 text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Copy */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium shadow-sm">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Premier Enterprise Software Development Company in Prayagraj (Allahabad)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Software Development Company</span> in Prayagraj
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Automate operations and scale business revenue with custom <strong className="text-white">CRM, ERP, HMS, POS Billing &amp; Cloud SaaS Software</strong>. Codelura engineers secure, high-throughput software systems using <strong className="text-cyan-400">Next.js 15, Node.js &amp; PostgreSQL</strong> for coaching centers, hospitals, real estate developers, manufacturers, and enterprises in <strong className="text-white">Civil Lines, Katra, George Town &amp; Naini</strong>.
            </p>

            {/* Quick Benefits Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Custom Workflows &amp; Zero Per-User Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sub-Second Next.js &amp; Cloud API Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Tally ERP &amp; Razorpay UPI Integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enterprise Data Encryption &amp; 99.99% Uptime</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              >
                <span>Get Free Software Architecture Demo</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hi%20Codelura,%20I%20want%20to%20discuss%20a%20custom%20software%20project%20in%20Prayagraj.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 font-bold text-base hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Software Architect</span>
              </a>

              <a
                href={`tel:${COMPANY_DETAILS.phone}`}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-cyan-500/10">
              <Image
                src={images.hero}
                alt="Software Development Company in Prayagraj - Codelura Engineering Lab"
                width={800}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="rounded-2xl w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">Prayagraj Software Engineering Hub</span>
                    <span className="text-slate-400">Civil Lines, Near Subhash Chouraha</span>
                  </div>
                  <span className="bg-cyan-500/20 text-cyan-400 px-2.5 py-1 rounded-full font-semibold border border-cyan-500/30">
                    Next.js / Node.js Active
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
