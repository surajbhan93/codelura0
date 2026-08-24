import {
  Briefcase,
  Users,
  Headphones,
  Star,
} from "lucide-react";

const stats = [
  {
    value: "350+",
    label: "Projects Delivered",
    icon: Briefcase,
  },
  {
    value: "200+",
    label: "Happy Clients",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Support Available",
    icon: Headphones,
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    icon: Star,
  },
];

export default function TrustBar() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5" />

      <div className="cl-wrap relative z-10">
        <div className="text-center mb-12">
          <span className="cl-pill">
            Trusted By Businesses
          </span>

          <h2
            className="syne mt-5"
            style={{
              fontSize: "clamp(28px,4vw,52px)",
              fontWeight: 800,
            }}
          >
            Proven Results,
            <span className="cl-grad"> Real Impact</span>
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,.5)",
              maxWidth: 650,
              margin: "16px auto 0",
              lineHeight: 1.8,
            }}
          >
            Delivering high-performance websites,
            software solutions and digital growth
            strategies for businesses across industries.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#ff6b35]/40"
              >
                {/* Glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#ff6b35]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff6b35]/10 text-[#ff6b35] transition-all duration-300 group-hover:bg-[#ff6b35] group-hover:text-white">
                    <Icon size={30} />
                  </div>

                  <h3
                    className="syne mt-6"
                    style={{
                      fontSize: "42px",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    <span className="cl-grad">
                      {item.value}
                    </span>
                  </h3>

                  <p
                    style={{
                      marginTop: 10,
                      color: "rgba(255,255,255,.55)",
                      fontSize: 14,
                    }}
                  >
                    {item.label}
                  </p>

                  <div className="mt-5 h-[2px] w-12 mx-auto rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ffb347] transition-all duration-500 group-hover:w-24" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Line */}
        <div
          className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center"
        >
          <p
            style={{
              color: "rgba(255,255,255,.55)",
              lineHeight: 1.8,
            }}
          >
            🚀 Trusted by startups, SMEs and enterprises across
            India for Website Development, Mobile Apps, SEO,
            Digital Marketing and Custom Software Solutions.
          </p>
        </div>
      </div>
    </section>
  );
}