import Image from 'next/image';
import { PORTFOLIO } from '@/app/locations/prayagraj/website-development/constants';

// This component is now server-side by default (no 'use client' directive)
export default function Portfolio() {
  return (
    <section className="py-20 bg-slate-900/20 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">
            Proven Track Record
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Featured Prayagraj Client Case Studies &amp; Success Stories
          </h2>
          <p className="text-slate-400 text-base">
            See how Codelura transformed local businesses in Katra, George Town, 
            and Civil Lines into digital market leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PORTFOLIO.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative h-64 w-full bg-slate-950">
                <Image
                  src={item.imageUrl}
                  alt={`${item.title} - Website Development Project in Prayagraj`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  priority={idx < 2} // Load first 2 images with priority
                />
              </div>

              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                    {item.metric}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}