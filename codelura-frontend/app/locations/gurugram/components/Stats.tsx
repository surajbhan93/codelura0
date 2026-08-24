export default function Stats() {
  const stats = [
    { value: "320+", label: "Gurugram Projects Delivered" },
    { value: "sub-200ms", label: "PageSpeed Load Time" },
    { value: "99.99%", label: "Cloud SLA Uptime" },
    { value: "100%", label: "Source Code & IP Ownership" }
  ];

  return (
    <section className="bg-slate-900 border-b border-slate-800/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl sm:text-4xl font-black text-cyan-400 tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
