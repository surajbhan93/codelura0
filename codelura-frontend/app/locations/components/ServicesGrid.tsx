'use client';

import { motion } from 'framer-motion';
import { MASTER_SERVICES } from '../constants';
import {
  Globe,
  Search,
  Smartphone,
  Code,
  Layout,
  ShoppingCart,
  ShoppingBag,
  Palette,
  Cpu,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Search,
  Smartphone,
  Code,
  Layout,
  ShoppingCart,
  ShoppingBag,
  Palette,
  Cpu,
  TrendingUp
};

export default function ServicesGrid() {
  return (
    <section id="services" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Multi-City Engineering Offerings</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Services Available Across All Location Hubs
          </h2>
          <p className="text-slate-400 text-base">
            Every location hub delivers our full suite of enterprise software, web engineering, mobile development, SEO, and AI automation solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {MASTER_SERVICES.map((svc, idx) => {
            const IconComp = iconMap[svc.iconName] || Code;
            return (
              <motion.div
                key={svc.id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>

                <Link
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-4 mt-4 border-t border-slate-800/80 transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
