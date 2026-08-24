import { Check } from 'lucide-react';

export default function Packages() {
  const plans = [
    {
      name: "Starter Business",
      price: "₹14,999",
      period: "one-time",
      desc: "Perfect for local businesses, clinics, and startups needing a fast responsive website.",
      features: [
        "Up to 5 Pages Next.js Responsive Web App",
        "Sub-Second Page Load Speed (95+ Score)",
        "Free Domain & SSL Certificate Setup",
        "Basic SEO & Google Maps Profile Setup",
        "WhatsApp Live Chat & Contact Form",
        "1 Year Maintenance Support"
      ],
      highlight: false
    },
    {
      name: "Professional Corporate",
      price: "₹34,999",
      period: "one-time",
      desc: "Ideal for growing IT firms, real estate builders, and D2C brand e-commerce stores.",
      features: [
        "Up to 15 Pages Custom Next.js / Shopify Site",
        "AEO, SEO & GEO Generative Search Optimization",
        "Razorpay / Stripe Payment Gateway Integration",
        "Custom Blog / CMS Control Panel",
        "Google Analytics 4 & Meta Pixel Setup",
        "Full Source Code & Github Repository Access"
      ],
      highlight: true
    },
    {
      name: "Enterprise Custom",
      price: "Custom Quote",
      period: "milestone-based",
      desc: "For complex software platforms, custom SaaS products, mobile apps, and ERP systems.",
      features: [
        "Custom Flutter / React Native iOS & Android Apps",
        "Multi-Tenant SaaS / Custom ERP / CRM Development",
        "Python AI / RAG Pipeline & Vector DB Setup",
        "Dedicated Solution Architect & Priority SLA",
        "100% IP & NDA Transfer Agreement",
        "Custom Cloud Deployment on AWS / Vercel"
      ],
      highlight: false
    }
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Transparent Investment</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Noida Software &amp; IT Engineering Packages
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            No hidden costs. Predictable pricing backed by milestone execution and 100% code ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl flex flex-col justify-between transition-all ${
                p.highlight
                  ? 'bg-slate-950 border-2 border-cyan-500 shadow-xl shadow-cyan-500/10 relative scale-[1.02]'
                  : 'bg-slate-950 border border-slate-800'
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">/ {p.period}</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="#contact"
                  className={`w-full py-3.5 rounded-xl font-bold text-xs text-center block transition-all ${
                    p.highlight
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105'
                      : 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Select Package
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
