'use client';

import { motion } from 'framer-motion';

export default function TrustedCompanies() {
  const categories = [
    { title: "Coaching Institutes", detail: "Katra & Rambagh Hub" },
    { title: "Hospitals & Polyclinics", detail: "George Town & Ashok Nagar" },
    { title: "Real Estate Developers", detail: "Civil Lines & Jhalwa" },
    { title: "Schools & Colleges", detail: "Naini & Jhunsi Sector" },
    { title: "Restaurants & Hotels", detail: "Civil Lines & Chowk" },
    { title: "Factories & Industrial", detail: "Naini Industrial Area" }
  ];

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest font-semibold text-slate-400 mb-8">
          Trusted Web Engineering Partner for Businesses Across Prayagraj &amp; Allahabad
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

