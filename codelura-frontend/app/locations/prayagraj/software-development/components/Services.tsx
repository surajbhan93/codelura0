'use client';

import { motion } from 'framer-motion';
import { SERVICES_LIST } from '../constants';
import {
  Users,
  Globe,
  Cpu,
  ShoppingCart,
  Stethoscope,
  GraduationCap,
  Factory,
  Briefcase,
  Home,
  BarChart3,
  Zap,
  Code,
  ArrowRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Users,
  Globe,
  Cpu,
  ShoppingCart,
  Stethoscope,
  GraduationCap,
  Factory,
  Briefcase,
  Home,
  BarChart3,
  Zap,
  Code
};

export default function Services() {
  return (
    <section id="services" className="py-20 bg-slate-900/30 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Custom Engineering Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Enterprise Custom Software Development Services in Prayagraj
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From bespoke CRM and ERP portals to specialized Hospital HMS, Institute ERP, POS billing software, and cloud SaaS platforms, Codelura delivers tailormade software systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((service, idx) => {
            const IconComponent = iconMap[service.iconName] || Code;
            return (
              <motion.div
                key={service.id}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between hover:border-cyan-500/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-bold bg-slate-800 text-cyan-400 px-3 py-1 rounded-full border border-slate-700">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.fullDesc}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors pt-4 border-t border-slate-800/80"
                >
                  <span>Request Custom Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
