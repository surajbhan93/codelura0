import Link from 'next/link';
import { NOIDA_SERVICES } from '../constants';
import { Code, Smartphone, Globe, Search, TrendingUp, ShoppingBag, ShoppingCart, Layout, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-6 h-6 text-cyan-400" />,
  Smartphone: <Smartphone className="w-6 h-6 text-cyan-400" />,
  Globe: <Globe className="w-6 h-6 text-cyan-400" />,
  Search: <Search className="w-6 h-6 text-cyan-400" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-cyan-400" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-cyan-400" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6 text-cyan-400" />,
  Layout: <Layout className="w-6 h-6 text-cyan-400" />
};

export default function FeaturedServices() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">IT &amp; Digital Services in Noida</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Software Development &amp; Digital Engineering Services
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From enterprise SaaS applications and mobile apps to AEO, SEO, and GEO search rankings — Codelura Technologies delivers end-to-end digital solutions in Noida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NOIDA_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40">
                    {iconMap[service.iconName] || <Code className="w-6 h-6 text-cyan-400" />}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6">
                <Link
                  href={service.url}
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Explore Service Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
