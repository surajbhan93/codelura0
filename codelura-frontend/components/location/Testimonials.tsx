'use client';

import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/app/locations/prayagraj/website-development/constants';
import { Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Client Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            What Prayagraj Business Owners Say About Codelura
          </h2>
          <p className="text-slate-400 text-base">
            Authentic reviews from directors, doctors, and entrepreneurs in Katra, George Town, and Civil Lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">{t.quote}</p>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="font-bold text-white text-base">{t.author}</div>
                <div className="text-xs text-cyan-400 font-medium">{t.role}</div>
                <div className="text-xs text-slate-500">{t.company} • {t.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
