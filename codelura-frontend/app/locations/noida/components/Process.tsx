export default function Process() {
  const steps = [
    { num: "01", title: "Discovery & System Blueprint", desc: "Detailed requirements mapping, database schema design, wireframing & tech stack selection." },
    { num: "02", title: "Agile Full-Stack Development", desc: "Bi-weekly sprint iterations, clean modular TypeScript coding, and continuous staging previews." },
    { num: "03", title: "Rigorous QA & Security Audit", desc: "Automated unit tests, load stress testing, security vulnerability scans, and cross-device testing." },
    { num: "04", title: "Cloud Deployment & Scale", desc: "Sub-second production deployment on Vercel/AWS, SSL configuration, AEO/SEO setup, and SLA monitoring." }
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Agile Workflow</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Our 4-Step Engineering &amp; Delivery Process
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Transparent, predictable, and milestone-driven engineering execution for Noida startups and corporate clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
              <span className="text-3xl font-black text-cyan-400/40 block">{s.num}</span>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
