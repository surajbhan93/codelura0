import { ShieldCheck, Cpu, Zap, Search, Lock, Headphones } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "Google Senior Engineer Standards",
      desc: "Architected by Staff Engineers using Next.js 15, React 19, TypeScript & microservices with zero bloat."
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: "Sub-Second Page Load Speed",
      desc: "Optimized for 95+ Google PageSpeed Score and sub-200ms TTFB to reduce bounce rate & drive conversions."
    },
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: "AEO, SEO & GEO Domination",
      desc: "Rank #1 on Google Maps 3-Pack, traditional search, Google Voice Assistant, and AI Search Engines (ChatGPT/Perplexity)."
    },
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: "100% IP & NDA Code Ownership",
      desc: "Full source code, repository access, and copyright ownership transferred to your company with strict NDA protection."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
      title: "Enterprise Cybersecurity Built-In",
      desc: "AES-256 encryption, TLS 1.3, rate limiting, SQL injection defense, and OWASP Top-10 security practices."
    },
    {
      icon: <Headphones className="w-6 h-6 text-cyan-400" />,
      title: "Dedicated Noida SLA & Support",
      desc: "Direct communication with senior tech architects, bi-weekly review demos, and priority SLAs for Noida clients."
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">The Codelura Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Why Businesses in Noida Partner with Codelura Technologies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            We deliver enterprise-grade software engineering without the overhead of massive legacy consulting firms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((p, i) => (
            <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 hover:border-cyan-500/40 transition-colors">
              <div className="p-3 bg-slate-900 rounded-xl w-fit border border-slate-800">{p.icon}</div>
              <h3 className="text-lg font-bold text-white">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
