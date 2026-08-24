'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Digital Audit & Audience Research',
      desc: 'We analyze your target audience in Prayagraj, audit competitor ad strategies, evaluate conversion funnel friction, and establish target CPL & ROAS KPIs.'
    },
    {
      num: '02',
      title: 'High-Converting Creative & Copywriting Design',
      desc: 'Our creative team produces direct-response ad copy, high-impact graphic banners, video reels, and dedicated lead generation landing pages.'
    },
    {
      num: '03',
      title: 'Multi-Channel Ad Campaign Architecture',
      desc: 'We configure Google Search & Display Ads, Meta (Facebook & Instagram) Lead Ads, GTM conversion tags, server-side Meta CAPI, and GA4 analytics.'
    },
    {
      num: '04',
      title: 'Real-Time A/B Testing & CPL Optimization',
      desc: 'We run multi-variant creative split testing, negative keyword scrubbing, bid strategy adjustments, and continuous landing page CRO tuning.'
    },
    {
      num: '05',
      title: 'WhatsApp Automation & Weekly ROI Reporting',
      desc: 'We connect WhatsApp API lead bots for instant auto-responses and deliver real-time Looker Studio ROI performance dashboards to your team.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step Performance Growth Framework
          </h2>
          <p className="text-slate-400 text-base">
            A structured, data-driven marketing engineering process designed to scale customer lead volume and maximize ad spend profitability.
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
