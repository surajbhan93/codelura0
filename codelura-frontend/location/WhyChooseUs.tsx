'use client';

import { motion } from 'framer-motion';
import { Zap, Search, Smartphone, BarChart3, Headphones, DollarSign, Layout, ShieldCheck } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Fast 5-Day Delivery", desc: "Launch standard business websites in as little as 5 business days without compromising on design or code quality.", icon: Zap },
    { title: "Built-In Local SEO", desc: "Engineered specifically to capture top rankings for target keywords in Prayagraj and Allahabad right from day one.", icon: Search },
    { title: "100% Mobile Fluid", desc: "Fluid layouts tested across iOS, Android, and tablets guaranteeing perfect rendering for Prayagraj users.", icon: Smartphone },
    { title: "95+ PageSpeed Scores", desc: "Built with Next.js 15 edge server rendering and image optimization for sub-second page load speeds.", icon: BarChart3 },
    { title: "24/7 Technical Support", desc: "Dedicated local technical assistance in Prayagraj for backups, updates, security, and maintenance.", icon: Headphones },
    { title: "Fair & Transparent Pricing", desc: "No hidden setup fees or surprise charges. Transparent packages designed for local small business budgets.", icon: DollarSign },
    { title: "Modern UI/UX Design", desc: "State-of-the-art dark/light glassmorphic aesthetics that position your brand ahead of local competitors.", icon: Layout },
    { title: "Bank-Grade Security", desc: "Equipped with SSL security certificates, DDoS protection, database sanitization, and automated daily backups.", icon: ShieldCheck }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Superiority</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Website Development in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We bridge global software development standards with deep local market insights across Uttar Pradesh.
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
