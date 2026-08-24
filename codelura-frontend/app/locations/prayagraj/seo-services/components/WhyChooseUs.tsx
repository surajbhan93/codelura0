'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, Cpu, ShieldCheck, BarChart3, DollarSign, Sparkles, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Google 3-Pack Domination", desc: "We place your business at the top of Google Maps search results in Prayagraj for high-intent local customer queries.", icon: MapPin },
    { title: "Technical SEO Engineering", desc: "Sub-second PageSpeed, clean canonical tags, and error-free Schema markup that Google crawlers love.", icon: Cpu },
    { title: "AI SEO & GEO/AEO Ready", desc: "Future-proof your organic search traffic for Google AI Overviews, ChatGPT Search, and voice search answers.", icon: Sparkles },
    { title: "100% White-Hat Practices", desc: "Strict adherence to Google Search guidelines to ensure lasting organic rankings without penalty risk.", icon: ShieldCheck },
    { title: "Transparent ROI Analytics", desc: "Comprehensive GA4 and Search Console reporting showing clear rank progression, organic calls, and lead conversions.", icon: BarChart3 },
    { title: "Affordable Monthly Packages", desc: "Flexible, pocket-friendly SEO packages designed for Prayagraj small businesses and growing institutes.", icon: DollarSign },
    { title: "Deep Local Prayagraj Knowledge", desc: "Localized keyword strategy targeting Civil Lines, Katra, George Town, Naini, and surrounding UP regions.", icon: Search },
    { title: "Dedicated Senior Strategist", desc: "Direct access to an experienced SEO strategist who manages your keyword optimization and monthly rank strategy.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura as Your SEO Company in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We don't sell empty promises or vanity traffic metrics. We deliver top Google rankings, high phone call volume, and real business revenue growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{pt.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{pt.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
