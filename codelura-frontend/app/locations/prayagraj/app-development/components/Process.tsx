'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'App Architecture & UI/UX Wireframing',
      desc: 'We map out app features, user journeys, database schemas, and create interactive Figma UI/UX prototypes tailored to your Prayagraj business.'
    },
    {
      num: '02',
      title: 'Frontend & Backend API Engineering',
      desc: 'Our mobile engineers code your app using Flutter, React Native, or Native Kotlin/Swift, connecting high-speed RESTful APIs and encrypted databases.'
    },
    {
      num: '03',
      title: 'Third-Party SDK & Payment Integration',
      desc: 'We integrate Razorpay/Paytm UPI payment gateways, Google Maps SDK location tracking, SMS/WhatsApp alerts, and push notification triggers.'
    },
    {
      num: '04',
      title: 'Testing, Security & Performance Auditing',
      desc: 'Rigorous QA testing across multiple physical Android and iOS devices, memory leak detection, 60fps frame rate optimization, and security audits.'
    },
    {
      num: '05',
      title: 'Store Publishing & App Store Optimization (ASO)',
      desc: 'We publish your app live on Google Play Store and Apple App Store, implement ASO metadata for search downloads, and provide ongoing SLA maintenance.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step Mobile App Development Process
          </h2>
          <p className="text-slate-400 text-base">
            A structured software engineering framework designed to transform your app idea into a high-ranking Play Store &amp; App Store application.
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
