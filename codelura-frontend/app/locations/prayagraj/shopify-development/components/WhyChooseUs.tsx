'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Zap, CreditCard, Truck, ShieldCheck, Search, DollarSign, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Custom Liquid OS 2.0 Themes", desc: "Built 100% with lightweight JSON templates and custom Liquid code eliminating third-party theme bloat.", icon: ShoppingCart },
    { title: "Sub-Second Page Loads", desc: "Optimized for 95+ Google PageSpeed Core Web Vitals, driving lower bounce rates and higher ad conversions.", icon: Zap },
    { title: "Razorpay UPI & COD Fraud Defense", desc: "Seamless 1-click GPay/PhonePe/Paytm UPI checkout combined with automated COD OTP verification.", icon: CreditCard },
    { title: "Shiprocket & Delhivery Logistics", desc: "Automated 1-click courier label generation, tracking updates, and WhatsApp order notification bots.", icon: Truck },
    { title: "99.99% Cloud Uptime Guarantee", desc: "Shopify's cloud architecture handles peak festive sale surges (Diwali/Dhanteras) with zero server crashes.", icon: ShieldCheck },
    { title: "Product & E-Commerce SEO", desc: "Built-in Product JSON-LD Schemas, collection page SEO, and Google Merchant Center Shopping Feed integration.", icon: Search },
    { title: "Transparent Store Pricing", desc: "Fixed, transparent development packages tailored for local Prayagraj retail and D2C brand budgets.", icon: DollarSign },
    { title: "24/7 Local Support SLA", desc: "Dedicated technical help in Prayagraj for catalog updates, promotional campaigns, theme tweaks, and app audits.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Shopify Store Development in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We build high-converting Shopify stores engineered to maximize sales revenue, reduce cart abandonment, and scale your brand nationwide.
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
