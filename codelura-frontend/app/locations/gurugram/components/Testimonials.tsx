import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Codelura Technologies transformed our legacy web portal into a sub-second Next.js 15 web app. Our organic traffic and B2B leads from Cyber City enterprises quadrupled within 60 days.",
      author: "Siddharth Oberoi",
      role: "VP of Engineering",
      company: "CyberTech Solutions",
      location: "Cyber City, Gurugram"
    },
    {
      quote: "The cross-platform Flutter mobile app built by Codelura's team allowed us to launch on both Google Play Store and Apple App Store in just 4 weeks. Outstanding UI performance.",
      author: "Radhika Singhania",
      role: "Founder & CEO",
      company: "LuxeFit D2C",
      location: "Golf Course Road, Gurugram"
    },
    {
      quote: "Their AEO, SEO, and GEO strategies got us to #1 on Google Maps 3-Pack and featured in AI Overviews. Best IT & software development company in Gurugram NCR without a doubt.",
      author: "Vikramaditya Rao",
      role: "Managing Director",
      company: "Horizon Real Estate Group",
      location: "Sohna Road, Gurugram"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Client Verification</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What Business Leaders in Gurugram Say About Codelura
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Empowering founders, CTOs, and directors across Gurugram (Gurgaon) with enterprise software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{r.quote}"</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-sm font-bold text-white">{r.author}</div>
                <div className="text-xs text-cyan-400">{r.role}, {r.company}</div>
                <div className="text-[11px] text-slate-500">{r.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
