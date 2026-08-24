'use client';

import { motion } from 'framer-motion';
import { CITIES_LIST } from '../constants';
import { MapPin, Globe } from 'lucide-react';

export default function CoverageMap() {
  return (
    <section className="py-20 bg-slate-900/30 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Regional Coverage Network</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Expanding Software Development &amp; Tech Coverage Across Northern India
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Codelura’s distributed software engineering network bridges major IT corridors in National Capital Region (NCR) like <strong className="text-white">Noida, Gurugram &amp; Delhi</strong> with premier commercial hubs in Uttar Pradesh including <strong className="text-white">Prayagraj, Lucknow, Kanpur, Varanasi, Agra, and Meerut</strong>.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold text-sm">Primary Engineering HQ</div>
                <div className="text-slate-300">Civil Lines, Prayagraj (Allahabad)</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                <div className="text-cyan-400 font-bold text-sm">NCR Tech Corridor</div>
                <div className="text-slate-300">Noida, Gurugram &amp; Delhi NCR</div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Map Matrix */}
          <motion.div
            className="lg:col-span-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span>Active Regional City Hubs</span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 font-mono">
                9 Cities Connected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CITIES_LIST.map((city) => (
                <div
                  key={city.id}
                  className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-2 hover:border-cyan-500/40 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">{city.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 truncate">{city.state}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
              Don't see your city listed? We deliver remote cloud software, web engineering, and custom mobile apps to clients nationwide across India.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
