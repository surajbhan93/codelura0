"use client";
import { useRouter } from "next/navigation";

export default function PremiumCard({ plan }) {
  const router = useRouter();
  const isPopular = plan.isPopular || plan.badge;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

        .premium-card {
          font-family: 'Inter', sans-serif;
          position: relative;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2px;
          cursor: pointer;
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
          width: 100%;
          max-width: 340px;
        }
        .premium-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.15);
        }
        .premium-card.popular {
          border: 2px solid transparent;
          background: linear-gradient(#0a0a0f, #0a0a0f) padding-box,
                      linear-gradient(135deg, #7c3aed, #a855f7, #ec4899) border-box;
        }
        .premium-card.popular:hover {
          box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(168,85,247,0.25);
        }

        .card-inner {
          background: linear-gradient(145deg, #0e0e18 0%, #080810 100%);
          border-radius: 18px;
          padding: 28px 26px 26px;
          position: relative;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .popular .card-glow {
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2));
          border: 1px solid rgba(168,85,247,0.35);
          color: #c4b5fd;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a855f7;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .plan-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .plan-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .price-block {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          margin-bottom: 22px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #94a3b8;
          padding-bottom: 5px;
        }
        .price-amount {
          font-family: 'Syne', sans-serif;
          font-size: 44px;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          background: linear-gradient(135deg, #ffffff 40%, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .popular .price-amount {
          background: linear-gradient(135deg, #ffffff 30%, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .price-period {
          font-size: 12px;
          color: #475569;
          padding-bottom: 8px;
          font-weight: 500;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #94a3b8;
          font-weight: 400;
        }
        .feature-check {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.25);
          color: #a78bfa;
          font-size: 11px;
          font-weight: 700;
        }
        .popular .feature-check {
          background: rgba(168,85,247,0.15);
          border-color: rgba(168,85,247,0.35);
        }

        .cta-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          letter-spacing: 0.01em;
        }
        .cta-default {
          background: rgba(255,255,255,0.04);
          color: #94a3b8;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .cta-default:hover {
          background: rgba(255,255,255,0.08);
          color: #e2e8f0;
          border-color: rgba(255,255,255,0.15);
        }
        .cta-popular {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(139,92,246,0.35);
        }
        .cta-popular:hover {
          box-shadow: 0 12px 32px rgba(139,92,246,0.5);
          transform: translateY(-1px);
        }
        .cta-popular:active { transform: translateY(0); }

        .shine {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>

      <div
        className={`premium-card ${isPopular ? "popular" : ""}`}
        onClick={() => router.push(`/premium/${plan.slug}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && router.push(`/premium/${plan.slug}`)}
      >
        <div className="card-inner">
          <div className="shine" />
          <div className="card-glow" />

          {/* Badge */}
          {isPopular ? (
            <div className="badge">
              <span className="badge-dot" />
              {plan.badge || "Most Popular"}
            </div>
          ) : (
            <div style={{ height: "28px", marginBottom: "18px" }} />
          )}

          {/* Title + Description */}
          <h2 className="plan-title">{plan.title}</h2>
          <p className="plan-desc">{plan.description}</p>

          {/* Price */}
          <div className="price-block">
            <span className="currency">₹</span>
            <span className="price-amount">{Number(plan.price).toLocaleString("en-IN")}</span>
            <span className="price-period">{plan.period || "/ month"}</span>
          </div>

          {/* Features */}
          {plan.features?.length > 0 && (
            <ul className="features-list">
              {plan.features.map((f, i) => (
                <li key={i} className="feature-item">
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* CTA Button */}
          <button className={`cta-btn ${isPopular ? "cta-popular" : "cta-default"}`}>
            {plan.ctaText || (isPopular ? "Get Started Now →" : "Choose Plan")}
          </button>
        </div>
      </div>
    </>
  );
}