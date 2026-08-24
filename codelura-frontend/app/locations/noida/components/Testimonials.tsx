import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Codelura Technologies transformed our legacy web portal into a sub-second Next.js 15 web app. Our organic traffic and B2B leads from Sector 62 IT firms skyrocketed within 60 days.",
      author: "Vikram Malhotra",
      role: "VP of Engineering",
      company: "CloudTech Solutions",
      location: "Sector 62, Noida"
    },
    {
      quote: "The cross-platform Flutter mobile app built by Codelura's team allowed us to launch on both Google Play Store and Apple App Store in just 4 weeks. Their code quality is outstanding.",
      author: "Neha Sharma",
      role: "Founder & CEO",
      company: "StyleHub D2C",
      location: "Sector 18, Noida"
    },
    {
      quote: "Their AEO, SEO, and GEO strategies got us to #1 on Google Maps 3-Pack and featured in AI Overviews. Best IT & software development company in Noida NCR without a doubt.",
      author: "Rajesh Agarwal",
      role: "Managing Director",
      company: "Apex Real Estate Builders",
      location: "Noida Expressway"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Client Verification</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What Business Leaders in Noida Say About Codelura
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Empowering founders, CTOs, and directors across Noida with enterprise software engineering.
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
