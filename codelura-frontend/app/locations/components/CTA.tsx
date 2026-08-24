'use client';

import Image from 'next/image';
// import { images } from '@/lib/images';
import { images } from '@/lib/images/images';
import { COMPANY_DETAILS, INTERNAL_LINKS } from '../constants';
import { Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src={images.cta}
          alt="Codelura Locations Hub Call to Action Background"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Main Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Enterprise Software Partner</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Build Powerful Digital Solutions for Your Business in India?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Get a free technical architecture audit, custom project blueprint, and explicit price quote today. Partner with Codelura — India's premier digital engineering agency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              <span>Call National HQ: {COMPANY_DETAILS.phone}</span>
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hi%20Codelura,%20I%20want%20to%20discuss%20a%20software%20engineering%20or%20web%20development%20project.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Instant WhatsApp Consultation</span>
            </a>
          </div>
        </div>

        {/* Quick Location Hub Directory */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-300 text-center">Quick Directory of Codelura City Location Hubs</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs font-semibold">
            {INTERNAL_LINKS.slice(0, 9).map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
