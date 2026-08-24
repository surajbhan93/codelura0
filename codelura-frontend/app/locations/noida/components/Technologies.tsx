import { TECH_STACK } from '../constants';

export default function Technologies() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Engineering Toolkit</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Modern Frameworks &amp; Technology Stack
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            We utilize Google Senior Engineer-approved frameworks for maximum speed, security, and scalability.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {TECH_STACK.map((tech, i) => (
            <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-center hover:border-cyan-500/40 transition-colors">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">{tech.category}</span>
              <h3 className="text-sm font-bold text-white">{tech.name}</h3>
              <p className="text-[11px] text-slate-400 leading-tight">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
