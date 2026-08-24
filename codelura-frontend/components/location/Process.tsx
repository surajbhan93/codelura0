'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Local Search Audit',
      desc: 'We map out your business goals, analyze Prayagraj competitor websites, establish keyword targets, and structure a high-converting site layout.'
    },
    {
      num: '02',
      title: 'UI/UX Design & Prototype Approval',
      desc: 'Our design team crafts bespoke wireframes and visual prototypes tailored around your brand identity, color scheme, and local Prayagraj clientele.'
    },
    {
      num: '03',
      title: 'High-Speed Web Coding',
      desc: 'We code your website using Next.js 15, React 19, TypeScript, and Tailwind CSS v4, ensuring clean semantic structure and ultra-fast page speeds.'
    },
    {
      num: '04',
      title: 'SEO, Schema & Mobile Testing',
      desc: 'Rigorous cross-browser testing, mobile fluid verification, Google PageSpeed audits, and local Schema markup validation (LocalBusiness, FAQ).'
    },
    {
      num: '05',
      title: 'Cloud Launch & Google Indexing',
      desc: 'We deploy your site to global edge CDNs, connect custom domain SSL, submit XML sitemaps to Google Search Console, and set up Google Analytics.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step Website Development Process
          </h2>
          <p className="text-slate-400 text-base">
            A structured, battle-tested engineering framework designed to launch world-class websites on schedule.
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
