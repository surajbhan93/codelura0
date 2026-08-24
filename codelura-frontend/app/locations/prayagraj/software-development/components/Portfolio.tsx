'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PORTFOLIO } from '../constants';

export default function Portfolio() {
  return (
    <section className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Enterprise Software Portfolio</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Featured Prayagraj Software Case Studies
          </h2>
          <p className="text-slate-400 text-base">
            See how Codelura engineered custom ERP, HMS, CRM, and manufacturing software for top institutions in Prayagraj.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="relative h-64 w-full bg-slate-950">
                <Image
                  src={item.imageUrl}
                  alt={`${item.title} - Custom Software Development Project in Prayagraj`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  loading="lazy"
                  className="object-cover"
                />
              </div>

              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                    {item.metric}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
