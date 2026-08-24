'use client';

import { motion } from 'framer-motion';

export default function Stats() {
  const stats = [
    { value: '180+', label: 'Custom Software Systems Delivered in UP', highlight: 'text-cyan-400' },
    { value: '99.99%', label: 'Cloud System Uptime Guaranteed', highlight: 'text-blue-400' },
    { value: '45%+', label: 'Operational Cost Savings for Clients', highlight: 'text-emerald-400' },
    { value: '100%', label: 'Type-Safe Architecture & Zero Data Leakage', highlight: 'text-indigo-400' }
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
