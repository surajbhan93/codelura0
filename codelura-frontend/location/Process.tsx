'use client';

const steps = [
  { step: '01', title: 'Discovery & Scope', desc: 'We understand your business goals, target audience, and technical requirements in a free consultation call.' },
  { step: '02', title: 'Design & Prototype', desc: 'Our designers create wireframes and UI mockups in Figma, reviewed and approved by you before development.' },
  { step: '03', title: 'Development', desc: 'Agile sprints with weekly progress updates. Built with Next.js, React, TypeScript, and production-grade code.' },
  { step: '04', title: 'Testing & QA', desc: 'Rigorous cross-device testing, performance audits (95+ PageSpeed), and security review before launch.' },
  { step: '05', title: 'Launch & Handover', desc: 'Smooth deployment to your server or cloud. Full handover with training documentation and admin access.' },
  { step: '06', title: 'Ongoing Support', desc: 'Post-launch maintenance, updates, and feature additions with transparent monthly retainer plans.' },
];

export default function Process() {
  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-4">Our Delivery Process</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A proven 6-step framework that delivers on-time, on-budget digital solutions your business can depend on.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors">
              <div className="text-3xl font-black text-cyan-500/30 mb-3">{s.step}</div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
