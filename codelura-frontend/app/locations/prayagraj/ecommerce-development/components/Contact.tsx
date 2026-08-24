'use client';

import { motion } from 'framer-motion';
import GoogleMap from './GoogleMap';
import { COMPANY_DETAILS } from '../constants';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Contact Information */}
          <motion.div
            className="lg:col-span-6 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Free E-Commerce Architecture Audit</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Visit Our Prayagraj E-Commerce Tech Center
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-4 leading-relaxed">
                Want to build a new online shopping website, launch a multi-vendor marketplace, or integrate 1-click UPI payments and Shiprocket logistics in Prayagraj? Visit our Civil Lines office or schedule a meeting with our Senior E-Commerce Architects.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Office Address</h3>
                  <p className="text-slate-400 text-sm">{COMPANY_DETAILS.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Phone Numbers</h3>
                  <p className="text-slate-400 text-sm">{COMPANY_DETAILS.phone} / +91-98765-43211</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Email Addresses</h3>
                  <p className="text-slate-400 text-sm">{COMPANY_DETAILS.email} / {COMPANY_DETAILS.prayagrajEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Working Hours</h3>
                  <p className="text-slate-400 text-sm">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Quick Action Triggers */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hello%20Codelura,%20I%20want%20to%20schedule%20an%20ecommerce%20website%20consultation%20in%20Civil%20Lines.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp E-Commerce Architect</span>
              </a>
              <a
                href={`tel:${COMPANY_DETAILS.phone}`}
                className="px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Direct Hotline Call</span>
              </a>
            </div>
          </motion.div>

          {/* Right Side: Google Map */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GoogleMap
              embedUrl={COMPANY_DETAILS.googleMapEmbedUrl}
              title="Codelura E-Commerce Hub - Prayagraj Location"
              address={COMPANY_DETAILS.address}
              coordinates={COMPANY_DETAILS.coordinates}
            />

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <div className="text-white font-bold text-sm">Schedule a 1-on-1 E-Commerce Architecture Demo</div>
                <div className="text-xs text-slate-400">Civil Lines Tech Hub, Prayagraj (Allahabad)</div>
              </div>
              <a
                href={`tel:${COMPANY_DETAILS.phone}`}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg hover:shadow-cyan-500/30 transition-all shrink-0"
              >
                Book Demo
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
