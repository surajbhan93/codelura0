export default function Portfolio() {
  const items = [
    { title: "Cyber City Fintech SaaS", cat: "Enterprise SaaS", metric: "99.99% Uptime", desc: "Multi-tenant cloud fintech analytics platform for a Cyber City DLF Phase 2 enterprise." },
    { title: "D2C Luxury Lifestyle Store", cat: "Headless E-Commerce", metric: "4.1x ROAS", desc: "Next.js & Shopify e-commerce site for a Golf Course Road luxury fashion brand." },
    { title: "Automotive Factory ERP", cat: "Supply Chain Software", metric: "35% Cost Saved", desc: "Custom inventory management ERP & barcode engine for an IMT Manesar auto manufacturer." }
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Proven Execution</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Featured Case Studies &amp; Engineering Work
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Real software systems engineered for companies operating in Gurugram (Gurgaon).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold">{item.cat}</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/20">{item.metric}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
