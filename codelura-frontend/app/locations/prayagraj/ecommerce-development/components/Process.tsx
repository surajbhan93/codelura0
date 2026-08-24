'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Store Audit & E-Commerce Strategy',
      desc: 'We analyze your product catalog, target buyer audience in Prayagraj & India, audit competitor online stores, and design conversion-focused user journeys.'
    },
    {
      num: '02',
      title: 'UI/UX Wireframing & Store Architecture',
      desc: 'Our design team crafts bespoke mobile storefront layouts, product page templates, variant color swatches, and slide-out cart drawers.'
    },
    {
      num: '03',
      title: 'Full-Stack Coding & Gateway Integration',
      desc: 'We code backend RESTful APIs, set up Razorpay/Paytm UPI payment gateways, Cash on Delivery (COD) OTP verification, and Shiprocket logistics APIs.'
    },
    {
      num: '04',
      title: 'Catalog Upload, Speed & Security QA Audit',
      desc: 'We upload product SKUs with WebP image compression, perform role-based security testing, setup Product Schema markup, and optimize Core Web Vitals.'
    },
    {
      num: '05',
      title: 'Live Launch, Admin Training & Support SLA',
      desc: 'We launch your store live on your domain, submit XML sitemaps to Google Merchant Center, conduct admin management training, and provide 24/7 SLA help.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step E-Commerce Engineering Process
          </h2>
          <p className="text-slate-400 text-base">
            A structured, battle-tested software engineering process designed to launch high-sales e-commerce platforms on schedule.
          </p>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start gap-6 hover:border-cyan-500/40 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 shrink-0">
                {step.num}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
