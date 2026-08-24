'use client';

import { useState } from 'react';
import { COMPANY_DETAILS, NEARBY_AREAS } from '../constants';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import GoogleMap from './GoogleMap';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'software-development',
    locality: 'Cyber City',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Start Your Gurugram Project</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Consult With Our Gurugram Software Engineering Team
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Get a free technical consultation, workflow audit, and itemized project blueprint within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">Send Project Inquiry</h3>

            {status === 'success' ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 space-y-2 text-center">
                <div className="text-lg font-bold">Inquiry Received Successfully!</div>
                <p className="text-xs text-slate-300">
                  Thank you! Our Gurugram Solution Architect will review your specs and contact you within 2 to 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Siddharth Oberoi"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="siddharth@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Select Service Required</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="software-development">Software Development &amp; Enterprise SaaS</option>
                      <option value="app-development">Mobile App Development (iOS/Android/Flutter)</option>
                      <option value="website-development">Website Development (Next.js/React)</option>
                      <option value="seo-services">AEO, SEO &amp; GEO Search Rankings</option>
                      <option value="digital-marketing">Digital Marketing &amp; Performance PPC</option>
                      <option value="ecommerce-development">Headless E-Commerce Development</option>
                      <option value="shopify-development">Shopify Store Development</option>
                      <option value="wordpress-development">WordPress CMS Development</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Your Locality in Gurugram (Gurgaon)</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    {NEARBY_AREAS.map((area, idx) => (
                      <option key={idx} value={area.name}>{area.name} ({area.landmark})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Project Requirements &amp; Goals</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your software, website, mobile app or search ranking requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{status === 'submitting' ? 'Submitting Inquiry...' : 'Request Free Consultation & Quote'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-white">Gurugram Cyber City Office</h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Address:</strong>
                    <span>{COMPANY_DETAILS.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Direct Phone:</strong>
                    <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:text-cyan-400 transition-colors">
                      {COMPANY_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <strong className="text-white block">Gurugram Engineering Desk:</strong>
                    <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-cyan-400 transition-colors">
                      {COMPANY_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block">WhatsApp Instant Support:</strong>
                    <a
                      href={`https://wa.me/${COMPANY_DETAILS.whatsappPhone}?text=Hi%20Codelura,%20I%20want%20to%20discuss%20a%20project%20in%20Gurugram.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      Chat on WhatsApp (+91-98765-43210)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden border border-slate-800 h-64 relative bg-slate-950">
              <GoogleMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
