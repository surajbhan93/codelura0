'use client';

const techs = [
  { name: 'Next.js 14', icon: '▲', category: 'Frontend' },
  { name: 'React 19', icon: '⚛', category: 'Frontend' },
  { name: 'TypeScript', icon: 'TS', category: 'Language' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Styling' },
  { name: 'Node.js', icon: '🟢', category: 'Backend' },
  { name: 'MongoDB', icon: '🍃', category: 'Database' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'Flutter', icon: '💙', category: 'Mobile' },
  { name: 'React Native', icon: '📱', category: 'Mobile' },
  { name: 'AWS / GCP', icon: '☁️', category: 'Cloud' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'Razorpay', icon: '💳', category: 'Payments' },
];

export default function Technologies() {
  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Technologies We Use</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We build with modern, production-grade technologies that ensure performance, scalability, and long-term maintainability.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {techs.map((tech) => (
            <div
              key={tech.name}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-2xl mb-2">{tech.icon}</div>
              <div className="text-white text-xs font-bold">{tech.name}</div>
              <div className="text-slate-500 text-[10px] mt-1">{tech.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
