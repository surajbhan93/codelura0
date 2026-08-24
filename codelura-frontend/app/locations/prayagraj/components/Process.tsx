'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'In-Person Consultation & Workflow Audit',
      desc: 'We meet at our Civil Lines office or conduct a deep online audit to analyze your business workflows, target customer intent, and local Prayagraj competitors.'
    },
    {
      num: '02',
      title: 'Software Architecture & UI/UX Prototyping',
      desc: 'Our design and architecture team creates bespoke mobile-first Figma prototypes, database schemas, and microservice specs tailored for your brand.'
    },
    {
      num: '03',
      title: 'Full-Stack Next.js 15 & API Engineering',
      desc: 'We code type-safe React 19 / Next.js 15 web applications, mobile apps, REST APIs, payment gateways (Razorpay/Paytm), and Tally ERP integrations.'
    },
    {
      num: '04',
      title: 'Quality Assurance, Speed & Security Audit',
      desc: 'We perform automated end-to-end testing, Core Web Vitals speed tuning (95+ score), Entity SEO JSON-LD schema verification, and security penetration checks.'
    },
    {
      num: '05',
      title: 'Live Launch, Local GMB Rank & 24/7 SLA',
      desc: 'We deploy your platform on high-speed cloud servers, optimize Google Business Profile map listings, conduct admin training, and provide 24/7 technical care.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Engineering Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step Digital Transformation Process
          </h2>
          <p className="text-slate-400 text-base">
            A structured, battle-tested software development lifecycle designed to deliver high-quality platforms on schedule in Prayagraj.
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
