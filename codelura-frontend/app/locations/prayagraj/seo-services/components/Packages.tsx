'use client';

import { motion } from 'framer-motion';
import { PACKAGES } from '../constants';
import { Check } from 'lucide-react';

export default function Packages() {
  return (
    <section id="packages" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Transparent Monthly Investment</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Affordable SEO Packages &amp; Pricing in Prayagraj
          </h2>
          <p className="text-slate-400 text-base">
            Fixed monthly rates designed to fit local business budgets. 100% white-hat tactics, zero setup fees, and clear ROI deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={idx}
              className={`relative bg-slate-900 border rounded-3xl p-8 flex flex-col justify-between ${
                pkg.popular
                  ? 'border-cyan-500 shadow-2xl shadow-cyan-500/10 lg:-translate-y-2'
                  : 'border-slate-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Most Popular in Prayagraj
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-6 min-h-[40px]">{pkg.description}</p>
                <div className="text-4xl font-black text-cyan-400 mb-6">{pkg.price}</div>

                <ul className="space-y-3 border-t border-slate-800 pt-6 mb-8 text-sm text-slate-300">
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#contact"
                className={`w-full py-3.5 rounded-xl font-bold text-center transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                Select Package
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
