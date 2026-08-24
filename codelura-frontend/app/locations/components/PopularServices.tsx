'use client';

import { motion } from 'framer-motion';
import { CITIES_LIST } from '../constants';
import Link from 'next/link';

export default function PopularServices() {
  return (
    <section className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Top City Service Matrix</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Popular Local Service Routes
          </h2>
          <p className="text-slate-400 text-base">
            Direct access to specialized location landing pages engineered for search dominance and maximum conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES_LIST.map((city, idx) => (
            <motion.div
              key={city.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">{city.name} Services</h3>
                <span className="text-xs text-cyan-400 font-mono font-semibold">{city.state}</span>
              </div>

              <div className="space-y-2 text-xs">
                {city.services.map((s, sIdx) => (
                  <Link
                    key={sIdx}
                    href={s.url}
                    className="block p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all font-medium truncate"
                  >
                    • {s.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
