export default function Industries() {
  const list = [
    { name: "IT & SaaS Startups", loc: "Sector 62 & Expressway", count: "80+ Projects", desc: "Multi-tenant SaaS products, cloud microservices, and AI integrations." },
    { name: "Retail & D2C Brands", loc: "Sector 18 & Greater Noida", count: "65+ Stores", desc: "Headless Next.js e-commerce, custom Shopify OS 2.0 & payment setups." },
    { name: "Real Estate Builders", loc: "Noida Expressway & Extension", count: "45+ Platforms", desc: "Interactive property listing portals, 3D floorplan viewings & lead CRM." },
    { name: "Healthcare & MedTech", loc: "Sector 128 & Sector 50", count: "30+ Systems", desc: "Custom Hospital Management Software (HMS), patient portals & tele-health." },
    { name: "EdTech & Colleges", loc: "Knowledge Park Greater Noida", count: "25+ Apps", desc: "Online exam portals, student mobile apps, LMS software & WhatsApp bots." },
    { name: "Industrial & Logistics", loc: "Phase 2 & Sector 63", count: "40+ Systems", desc: "Custom inventory ERP, B2B wholesale portals & barcode supply chain software." }
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Specialized Domain Expertise</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Industries We Serve Across Noida &amp; Greater Noida
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Custom software engineering tailored to the specific operational requirements of Noida business sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((ind, i) => (
            <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">{ind.loc}</span>
                <span className="text-[11px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/20">{ind.count}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{ind.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
