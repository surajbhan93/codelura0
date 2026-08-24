export default function TrustedCompanies() {
  const brands = [
    "Sector 62 IT Parks",
    "Sector 18 D2C Brands",
    "Sector 63 Industrial Units",
    "Expressway SaaS Startups",
    "Knowledge Park Academies"
  ];

  return (
    <section className="py-8 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Trusted By Startups, IT Parks &amp; Enterprises Across Noida &amp; Greater Noida
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-75">
          {brands.map((b, i) => (
            <span key={i} className="text-xs sm:text-sm font-bold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
