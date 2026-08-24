'use client';

import { motion } from 'framer-motion';
import { CITIES_LIST } from '../constants';
import Link from 'next/link';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function FeaturedCities() {
  const primaryCities = CITIES_LIST.filter((c) => c.isPrimary);

  return (
    <section className="py-20 bg-slate-900/30 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Key Regional Tech Hubs</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Primary Regional Tech &amp; Software Hubs
          </h2>
          <p className="text-slate-400 text-base">
            Codelura operates active software development, web engineering, and local SEO hubs across major economic centers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryCities.map((city, idx) => (
            <motion.div
              key={city.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-400 font-mono font-semibold">{city.state}</span>
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {city.name}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {city.shortDesc}
                </p>
              </div>

              <Link
                href={city.hubUrl}
                className="inline-flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-cyan-400 pt-4 border-t border-slate-800 transition-colors"
              >
                <span>Explore Location Page</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
