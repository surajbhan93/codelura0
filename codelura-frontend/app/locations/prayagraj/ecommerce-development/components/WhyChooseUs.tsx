'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Zap, CreditCard, Truck, ShieldCheck, Search, DollarSign, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Sub-Second Next.js Speed", desc: "Engineered with Next.js 15 App Router & Cloudflare CDN ensuring sub-200ms page load speeds across mobile & desktop.", icon: Zap },
    { title: "1-Click Razorpay UPI & COD OTP", desc: "Seamless 1-click GPay/PhonePe/Paytm UPI checkout combined with automated COD OTP phone verification to stop fake orders.", icon: CreditCard },
    { title: "Automated Shiprocket Logistics", desc: "1-click automated courier label generation, real-time tracking dispatch, and instant WhatsApp customer alerts.", icon: Truck },
    { title: "Product Schema & Shopping SEO", desc: "Built-in Product & Offer JSON-LD Schemas, collection SEO, and automated Google Merchant Center Shopping feed sync.", icon: Search },
    { title: "Multi-Platform Mastery", desc: "Expertise across custom full-stack Next.js, WooCommerce, Shopify OS 2.0, multi-vendor marketplaces, and B2B wholesale portals.", icon: ShoppingCart },
    { title: "Bank-Grade Security Hardening", desc: "PCI-DSS compliance, SSL/TLS API encryption, role-based admin security access, and automated daily cloud database backups.", icon: ShieldCheck },
    { title: "Fair & Transparent Pricing", desc: "Clear, fixed development rates tailored for local Prayagraj retail store and D2C brand budgets. Zero hidden costs.", icon: DollarSign },
    { title: "24/7 Dedicated Support SLA", desc: "Local technical assistance in Prayagraj for catalog updates, festive sale prep (Diwali/Kumbh Mela), security audits, and edits.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Ecommerce Development in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We build secure, high-speed online shopping platforms engineered to maximize sales revenue, reduce cart abandonment, and scale your brand nationwide.
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
