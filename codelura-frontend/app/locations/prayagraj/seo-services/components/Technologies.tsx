'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { TECHNOLOGIES } from '../constants';
import { images } from '@/lib/images/images';

export default function Technologies() {
  return (
    <section className="py-20 bg-slate-900/30 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Enterprise SEO Suite</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Enterprise SEO Software &amp; Analytics Stack We Master
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              We combine industry-leading SEO audit tools, real-time rank trackers, schema compilers, and analytics software to engineer data-driven organic growth.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-2 shadow-xl">
              <Image
                src={images.technologies}
                alt="SEO Software Stack - Ahrefs, SEMrush, Screaming Frog, Google Analytics 4, Search Console"
                width={600}
                height={400}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 500px"
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {TECHNOLOGIES.map((tech, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                {tech.category}
              </span>
              <h3 className="text-lg font-bold text-white">{tech.name}</h3>
              <p className="text-slate-400 text-xs">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
