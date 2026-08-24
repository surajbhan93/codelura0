'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Zap, Code, BarChart3, Lock, DollarSign, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    { title: "Senior Google-Grade Engineering", desc: "Engineered under strict Google Senior Staff standards using Next.js 15, React 19, TypeScript, and microservice backends.", icon: Code },
    { title: "Physical Office in Civil Lines", desc: "Direct local presence in Prayagraj near Subhash Chouraha for face-to-face meetings, technical audits, and ongoing support.", icon: MapPin },
    { title: "Sub-Second Mobile Page Load Speed", desc: "PageSpeed scores of 95+ and sub-200ms TTFB rendering ensure your local business outranks competitors effortlessly.", icon: Zap },
    { title: "Google Map 3-Pack & Entity SEO", desc: "Structured JSON-LD schema graphs, local directory citations, and GMB optimization designed for Google AI Overviews.", icon: BarChart3 },
    { title: "Tailored Prayagraj Industry Solutions", desc: "Specialized workflows built specifically for Katra coaching centers, George Town hospitals, Civil Lines real estate, and Chowk retail.", icon: ShieldCheck },
    { title: "Bank-Grade Security Hardening", desc: "PCI-DSS compliance, SSL encryption, automated daily cloud backups, and Web Application Firewall (WAF) protection.", icon: Lock },
    { title: "Fixed & Transparent Itemized Pricing", desc: "Zero hidden costs or deployment surcharges. Full access to clean source code repositories with zero platform lock-in.", icon: DollarSign },
    { title: "24/7 Local Support & SLA Care", desc: "Round-the-clock server monitoring, security patching, festive traffic scaling (Kumbh Mela/Diwali), and continuous updates.", icon: Headphones }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Why Prayagraj Businesses Choose Codelura as Their IT Partner
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            We combine Silicon Valley software engineering standards with deep local market knowledge to deliver market-dominating digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((pt, idx) => {
            const IconComp = pt.icon;
            return (
              <motion.div
                key={idx}
                className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl space-y-4 hover:border-cyan-500/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{pt.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{pt.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
