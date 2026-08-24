"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { ServiceSection } from "../types";

export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    id: "resume-review",
    title: "Resume Review Session",
    description: "Get your resume reviewed by industry experts with personalized feedback on content and ATS compatibility.",
    icon: "📄",
    slug: "resume-review",
    price: 0,
    isPaid: true,
    features: ["Detailed analysis", "ATS compatibility", "Content feedback", "30-min call"],
    popular: true,
  },
  {
    id: "ats-score",
    title: "ATS Score Check",
    description: "Check if your resume passes ATS screening with detailed scoring and key optimization tips.",
    icon: "📊",
    slug: "ats-score",
    price: 299,
    isPaid: true,
    features: ["ATS score", "Keyword tips", "Formatting fixes", "Improvement plan"],
  },
  {
    id: "resume-builder",
    title: "Resume Builder",
    description: "Create an ATS-friendly resume with our builder using 50+ templates.",
    icon: "✍️",
    slug: "resume-builder",
    price: 699,
    isPaid: true,
    features: ["50+ templates", "AI suggestions", "ATS optimized", "One-click PDF download"],
    popular: true,
  },
];

export const ServiceCards = memo(function ServiceCards() {
  const router = useRouter();

  return (
    <section className="mt-12 space-y-4">
      <h3 className="text-lg font-black text-slate-900 tracking-tight">
        Recommended Career Services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVICE_SECTIONS.map((service) => (
          <div
            key={service.id}
            className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {service.popular && (
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                ⭐ Popular
              </span>
            )}
            <div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{service.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {service.features.map((f, i) => (
                  <span key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-base font-black text-indigo-600">₹{service.price}</span>
              <button
                type="button"
                onClick={() => router.push(`/services/${service.slug}`)}
                className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
              >
                Get Started →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});