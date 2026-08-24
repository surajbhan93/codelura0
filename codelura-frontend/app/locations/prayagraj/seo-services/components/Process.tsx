'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'In-Depth Technical SEO & Keyword Audit',
      desc: 'We perform a 100+ point site audit, analyze competitor backlink profiles in Prayagraj, and discover high-converting, low-competition local search terms.'
    },
    {
      num: '02',
      title: 'Google Business Profile & Local Citation Setup',
      desc: 'We claim, verify, and optimize your Google Map listing, unify NAP (Name, Address, Phone) across 30+ regional directories, and setup geo-tagging.'
    },
    {
      num: '03',
      title: 'On-Page Architecture & Semantic Content Optimization',
      desc: 'We optimize page title tags, meta tags, H1-H3 hierarchies, URL structures, internal links, and inject rich JSON-LD Schema data.'
    },
    {
      num: '04',
      title: 'High-Authority Backlink Acquisition & Digital PR',
      desc: 'We secure high-DA contextual backlinks from authoritative Indian news outlets, regional blogs, and niche directories to supercharge domain rating.'
    },
    {
      num: '05',
      title: 'AI SEO (GEO/AEO) & Monthly Performance Auditing',
      desc: 'We structure content for Google AI Overviews and voice search while providing transparent monthly rank tracking reports and GA4 analytics.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step SEO Growth Framework
          </h2>
          <p className="text-slate-400 text-base">
            A battle-tested search engine optimization roadmap designed to take your website from invisible to #1 on Google.
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
