'use client';

import { motion } from 'framer-motion';
import { INDUSTRIES } from '../constants';
import { MapPin } from 'lucide-react';

export default function Industries() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Sector Specific Growth</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Industries We Drive Customer Leads For in Prayagraj &amp; Allahabad
          </h2>
          <p className="text-slate-400 text-base">
            From student admission campaigns in Katra to patient leads in George Town and real estate buyer leads in Civil Lines, we deliver targeted performance marketing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRIES.map((ind, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <h3 className="text-lg font-bold text-white">{ind.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{ind.location}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{ind.description}</p>
              <div className="text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800/80">
                {ind.count}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
