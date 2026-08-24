'use client';

import { motion } from 'framer-motion';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Workflow Discovery & System Architecture',
      desc: 'We analyze your business operations in Prayagraj, audit data bottlenecks, map out module entities, and define software architecture specifications.'
    },
    {
      num: '02',
      title: 'Database Schema & UI/UX Wireframing',
      desc: 'Our engineers design normalized SQL/NoSQL database schemas and build high-fidelity interactive dashboard prototypes for team review.'
    },
    {
      num: '03',
      title: 'Agile Full-Stack Software Engineering',
      desc: 'We code backend RESTful APIs with Node.js/PostgreSQL and craft fast, responsive web UIs using Next.js 15, React 19, and Tailwind CSS v4.'
    },
    {
      num: '04',
      title: 'Integration, Security & Load Testing',
      desc: 'We connect Tally, Razorpay UPI, WhatsApp APIs, perform role-based security audits, and stress-test data pipelines for zero downtime.'
    },
    {
      num: '05',
      title: 'Cloud Deployment, Staff Training & Support',
      desc: 'We deploy software to secure AWS cloud servers, migrate existing business data, conduct staff onboarding training, and provide 24/7 SLA maintenance.'
    }
  ];

  return (
    <section id="process" className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Methodology</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Our 5-Step Software Engineering Framework
          </h2>
          <p className="text-slate-400 text-base">
            A structured, battle-tested software engineering process designed to launch enterprise systems smoothly and securely.
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
