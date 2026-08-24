'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Requirement Discovery & Site Architecture',
      desc: 'We analyze your business goals in Prayagraj, audit competitor sites, plan custom page layouts, and select light, secure plugin dependencies.'
    },
    {
      num: '02',
      title: 'UI/UX Wireframing & Custom Theme Design',
      desc: 'Our design team crafts bespoke visual layouts tailored around your brand identity, color scheme, and local Prayagraj target audience.'
    },
    {
      num: '03',
      title: 'Custom Gutenberg & PHP Coding',
      desc: 'We convert approved designs into clean, semantic PHP and Gutenberg block code enriched with Tailwind CSS styling and Schema metadata.'
    },
    {
      num: '04',
      title: 'Speed Optimization, Security & QA Audit',
      desc: 'Rigorous cross-browser testing, mobile usability checks, LiteSpeed/Redis caching, image WebP compression, and security hardening.'
    },
    {
      num: '05',
      title: 'Cloud Launch, Training & SEO Indexing',
      desc: 'We launch your site live on fast cloud servers, submit XML sitemaps to Google Search Console, and conduct visual CMS editor staff training.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step WordPress Development Process
          </h2>
          <p className="text-slate-400 text-base">
            A structured, battle-tested engineering framework designed to deliver high-quality, easy-to-manage WordPress sites on schedule.
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
