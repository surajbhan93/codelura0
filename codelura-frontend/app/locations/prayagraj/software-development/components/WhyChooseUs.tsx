'use client';

import { motion } from 'framer-motion';
import { Cpu, DollarSign, Layers, ShieldCheck, Zap, BarChart3, Headphones, Layout } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "100% Custom Tailored", desc: "Built 100% around your exact operational workflows. Zero forced features, zero bloat, and full software ownership.", icon: Layout },
    { title: "Zero Per-User Licensing", desc: "Say goodbye to expensive monthly per-seat licenses. Scale to unlimited staff members and branches with zero extra fees.", icon: DollarSign },
    { title: "Sub-Second Next.js Performance", desc: "Engineered with Next.js 15, Node.js, and Redis caching ensuring sub-second response times across desktop & mobile.", icon: Cpu },
    { title: "Tally & API Ecosystem", desc: "Seamless API integrations with Tally ERP, Razorpay UPI payments, WhatsApp Business API, and biometric hardware.", icon: Layers },
    { title: "Enterprise Grade Security", desc: "Role-based access security, OAuth 2.0 authentication, SSL encryption, and automated cloud database backups.", icon: ShieldCheck },
    { title: "Real-Time BI Analytics", desc: "Consolidate complex operational metrics into executive visual dashboards with 1-click PDF/Excel reporting.", icon: BarChart3 },
    { title: "Fast Modular Delivery", desc: "Launch core functional software modules in as little as 14 to 21 days with agile iterative development.", icon: Zap },
    { title: "24/7 Dedicated SLA Support", desc: "Local technical assistance in Prayagraj for cloud server maintenance, user training, updates, and feature additions.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Choose Custom Software Development over Off-The-Shelf Tools?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We build high-performance software systems that adapt to your business — not the other way around.
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
