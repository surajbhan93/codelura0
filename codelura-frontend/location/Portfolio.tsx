'use client';

export default function Portfolio() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Work</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore our portfolio of websites, apps, and software solutions delivered for businesses across India.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['E-commerce Portal', 'Healthcare CMS', 'Education ERP', 'Real Estate App', 'Coaching LMS', 'SaaS Dashboard'].map((project, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/40 transition-colors">
              <div className="h-36 bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-500 text-sm">
                Project Preview
              </div>
              <h3 className="text-white font-semibold mb-1">{project}</h3>
              <p className="text-slate-400 text-sm">Custom-built solution delivered on time and within budget.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
