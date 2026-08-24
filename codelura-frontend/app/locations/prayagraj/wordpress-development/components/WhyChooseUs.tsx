'use client';

import { motion } from 'framer-motion';
import { Layout, Zap, Search, ShieldCheck, DollarSign, Headphones, Code, Globe } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Zero Pre-Made Bloat", desc: "We eliminate heavy, slow multipurpose themes and page builder bloat, writing custom lightweight Gutenberg PHP code.", icon: Layout },
    { title: "95+ Core Web Vitals Score", desc: "Optimized with Redis Object caching, WebP images, and minified assets for sub-second page loading speeds.", icon: Zap },
    { title: "Built-In Local SEO & Schemas", desc: "Engineered specifically to rank for target keywords in Prayagraj with clean semantic HTML and LocalBusiness Schema.", icon: Search },
    { title: "WooCommerce & UPI Gateways", desc: "Complete e-commerce store setup with instant Razorpay/Paytm UPI checkout, GST invoicing, and WhatsApp alerts.", icon: Globe },
    { title: "Bank-Grade Security Hardening", desc: "Strict malware scans, 2FA logins, WAF firewalls, and automated daily cloud backups on AWS servers.", icon: ShieldCheck },
    { title: "100% Easy Visual Editing", desc: "Intuitive visual drag-and-drop block editors allowing staff to easily edit text, add images, and post blogs without coding.", icon: Code },
    { title: "Fair & Transparent Pricing", desc: "No hidden renewal costs or surprise charges. Transparent packages designed for local small business budgets.", icon: DollarSign },
    { title: "24/7 Dedicated Support SLA", desc: "Local technical assistance in Prayagraj for weekly plugin updates, security audits, database cleanups, and edits.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Custom WordPress Development in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We bridge clean software engineering standards with deep local market insights to deliver high-speed, easy-to-manage WordPress sites.
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
