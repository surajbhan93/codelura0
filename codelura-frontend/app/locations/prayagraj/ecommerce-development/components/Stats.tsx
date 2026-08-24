'use client';

import { motion } from 'framer-motion';

export default function Stats() {
  const stats = [
    { value: '160+', label: 'E-Commerce Online Stores Built in UP', highlight: 'text-cyan-400' },
    { value: '₹15 Cr+', label: 'Total Client E-Commerce GMV Processed', highlight: 'text-blue-400' },
    { value: '95+', label: 'Google PageSpeed Core Web Vitals Score', highlight: 'text-emerald-400' },
    { value: 'sub-200ms', label: 'Next.js 15 Full-Stack Page Load Speed', highlight: 'text-indigo-400' }
  ];

  return (
    <section className="py-12 bg-slate-900/60 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center space-y-2 hover:border-cyan-500/30 transition-all"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={`text-4xl sm:text-5xl font-black ${stat.highlight}`}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
