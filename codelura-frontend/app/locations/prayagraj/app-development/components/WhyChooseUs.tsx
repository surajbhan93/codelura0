'use client';

import { motion } from 'framer-motion';
import { Smartphone, Zap, ShieldCheck, DollarSign, Layout, Headphones, Search, Layers } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Native & Cross-Platform", desc: "Expertise in Google Flutter, React Native, Kotlin, and Swift guarantees 60fps fluid UI performance.", icon: Smartphone },
    { title: "Fast MVP Delivery", desc: "Launch initial startup and business mobile app MVPs in as little as 14 to 21 business days.", icon: Zap },
    { title: "Razorpay & UPI Payments", desc: "Built-in integration for instant 1-click mobile UPI payments (GPay, PhonePe, Paytm) and net banking.", icon: Layers },
    { title: "Store Publishing Guaranteed", desc: "100% submission management and approval compliance for Google Play Store and Apple App Store.", icon: ShieldCheck },
    { title: "App Store Optimization (ASO)", desc: "Keyword-optimized app store listings designed to capture thousands of organic mobile app downloads.", icon: Search },
    { title: "Transparent Pricing", desc: "Clear, fixed mobile app packages tailored to local Prayagraj small business and institute budgets.", icon: DollarSign },
    { title: "Modern UI/UX Micro-Interactions", desc: "Stunning mobile user interfaces with smooth gestures, dark/light themes, and fluid navigation.", icon: Layout },
    { title: "24/7 Ongoing Technical SLA", desc: "Dedicated local support for Android/iOS OS updates, security vulnerability patching, and database backups.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Codelura for Mobile App Development in Prayagraj?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We build secure, high-speed mobile software engineered to scale your brand, automate workflows, and boost customer retention.
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
