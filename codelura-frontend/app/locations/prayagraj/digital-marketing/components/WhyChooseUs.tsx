'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, MessageSquare, ShieldCheck, Zap, DollarSign, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Guaranteed Lower CPL & High ROAS", desc: "Focus strictly on business revenue. We optimize campaigns daily to drive lower Cost Per Lead (CPL) and higher ROAS.", icon: TrendingUp },
    { title: "Deep Local Prayagraj Insights", desc: "Tailored campaign strategies engineered specifically for student, medical, real estate, and retail audiences in Allahabad.", icon: Target },
    { title: "Multi-Channel Ad Expertise", desc: "Certified Google Ads, Meta Ads (Facebook & Instagram), YouTube, and LinkedIn media buying experts.", icon: Zap },
    { title: "WhatsApp & Email Automation", desc: "Automated instant lead notification alerts, WhatsApp chatbot auto-responders, and email drip sequences.", icon: MessageSquare },
    { title: "GA4 & Server-Side CAPI Tracking", desc: "100% accurate conversion attribution setup using Google Tag Manager, GA4, and Meta Server-Side CAPI.", icon: BarChart3 },
    { title: "High-Converting Ad Creatives", desc: "In-house graphic design and video editing producing thumb-stopping Reels, banners, and direct-response copy.", icon: ShieldCheck },
    { title: "Transparent Real-Time Dashboards", desc: "Live Google Looker Studio client dashboards detailing total ad spend, CPC, CPL, conversions, and total ROI.", icon: DollarSign },
    { title: "24/7 Dedicated Growth SLA", desc: "Dedicated growth manager in Prayagraj providing weekly campaign tuning, A/B split testing, and strategy calls.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Digital Marketing in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We bridge data science, creative storytelling, and high-intent media buying to deliver predictable, profitable growth.
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
