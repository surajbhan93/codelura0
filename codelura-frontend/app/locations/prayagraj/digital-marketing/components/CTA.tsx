'use client';

import Image from 'next/image';
import { images } from '@/lib/images/images';
import { COMPANY_DETAILS, NEARBY_AREAS, INTERNAL_LINKS } from '../constants';
import { Phone, MessageSquare, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src={images.cta}
          alt="Codelura Prayagraj Digital Marketing CTA Background"
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Main CTA Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Scale Your Business Revenue</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Ready to Dominate Your Market with High-ROI Digital Marketing in Prayagraj?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Get a free digital audit, competitor campaign breakdown, and an explicit price quote today. Partner with Codelura — Prayagraj's leading performance digital marketing agency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us: {COMPANY_DETAILS.phone}</span>
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hi%20Codelura,%20I%20want%20to%20discuss%20a%20digital%20marketing%20campaign%20for%20my%20Prayagraj%20business.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Instant WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        {/* Nearby Areas Section */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Target Localities We Serve for Digital Marketing in Prayagraj</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {NEARBY_AREAS.map((area, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center space-y-1">
                <div className="text-xs font-bold text-white">{area.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono">PIN: {area.zipCode}</div>
                <div className="text-[10px] text-slate-400 truncate">{area.landmark}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Navigation Links Section */}
        <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-300 mb-4 text-center">Explore Codelura Digital Engineering Ecosystem</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-3 text-center text-xs font-semibold">
            {INTERNAL_LINKS.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
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
