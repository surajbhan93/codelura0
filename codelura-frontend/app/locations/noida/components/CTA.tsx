import { COMPANY_DETAILS } from '../constants';
import { ArrowRight, Phone, MessageSquare } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              Scale Your Digital Platform
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Ready to Partner With Noida’s Premier Software &amp; IT Agency?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you need enterprise SaaS software, custom mobile apps, or AEO/SEO/GEO search domination in Noida, Codelura Technologies is ready to engineer your vision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Schedule Tech Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hi%20Codelura,%20I%20want%20to%20discuss%20a%20project%20in%20Noida.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call Us Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
