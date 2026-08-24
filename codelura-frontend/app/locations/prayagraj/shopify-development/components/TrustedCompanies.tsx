'use client';

import { motion } from 'framer-motion';

export default function TrustedCompanies() {
  const categories = [
    { title: "Saree & Fashion Stores", detail: "Chowk Handloom Shopify Stores" },
    { title: "Artisans & Handicrafts", detail: "Daraganj Global Artisans" },
    { title: "Ayurveda & Supplement D2C", detail: "George Town Wellness Stores" },
    { title: "Publishers & Book Sellers", detail: "Katra Book E-Commerce" },
    { title: "Luxury Decor & Furniture", detail: "Civil Lines Interior Portals" },
    { title: "Hardware & Electronics", detail: "Lukerganj B2B Hardware" }
  ];

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest font-semibold text-slate-400 mb-8">
          The Trusted Custom Shopify E-Commerce Growth Partner for D2C &amp; Retail Merchants Across Prayagraj
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-center hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <div className="text-sm font-bold text-white mb-1">{cat.title}</div>
              <div className="text-[11px] text-cyan-400 font-medium">{cat.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
