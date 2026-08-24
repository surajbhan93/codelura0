'use client';

import { motion } from 'framer-motion';
import { FAQS } from '../constants';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  return (
    <section id="faqs" className="py-20 bg-slate-900/30 border-b border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">E-Commerce FAQs</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions (FAQs) - Ecommerce Development Prayagraj
          </h2>
          <p className="text-slate-400 text-base">
            Everything you need to know about Next.js 15 e-commerce, WooCommerce, Shopify OS 2.0, multi-vendor marketplaces, Razorpay UPI, COD OTP verification, and Shiprocket logistics.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <motion.details
              key={idx}
              className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 [&_summary::-webkit-details-marker]:none cursor-pointer hover:border-cyan-500/40 transition-all"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <summary className="flex items-center justify-between text-base sm:text-lg font-bold text-white gap-4">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-cyan-400 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <p className="text-slate-300 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-800/80">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
