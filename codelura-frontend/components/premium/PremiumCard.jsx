// components/premium/PremiumCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";

// ✅ Memoized component for better performance
const PremiumCard = memo(({ plan }) => {
  const hasDiscount = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const actualPrice = hasDiscount ? plan.discountedPrice : plan.price;
  const savings = hasDiscount ? plan.price - plan.discountedPrice : 0;
  const discountPercent = hasDiscount 
    ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100) 
    : 0;

  return (
    <div className="premium-card">
      {/* Banner Section */}
      <div className="card-banner">
        {plan.bannerImage ? (
          <Image
            src={plan.bannerImage}
            alt={plan.title}
            width={400}
            height={225}
            className="banner-image"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="banner-placeholder">
            <span className="placeholder-icon">{plan.title.charAt(0)}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="badge-container">
          {plan.durationInMonths && (
            <span className="badge duration-badge">
              {plan.durationInMonths}M
            </span>
          )}
          {hasDiscount && (
            <span className="badge discount-badge">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <h3 className="card-title">{plan.title}</h3>
        
        {plan.description && (
          <p className="card-description">{plan.description}</p>
        )}

        {/* Price */}
        <div className="price-section">
          <div className="price-main">
            <span className="currency">₹</span>
            <span className="amount">{actualPrice.toLocaleString("en-IN")}</span>
          </div>
          {hasDiscount && (
            <div className="price-original">
              ₹{plan.price.toLocaleString("en-IN")}
            </div>
          )}
        </div>

        {hasDiscount && (
          <div className="savings-badge">
            Save ₹{savings.toLocaleString("en-IN")}
          </div>
        )}

        {/* Features */}
        {plan.features?.length > 0 && (
          <ul className="features-list">
            {plan.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="feature-item">
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <Link href={`/career/jobs/premium/${plan.slug}`} className="cta-button">
          Get Started
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <style jsx>{`
        .premium-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(0, 0, 0, 0.04);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .premium-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
          border-color: rgba(0, 0, 0, 0.08);
        }

        /* Banner */
        .card-banner {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .premium-card:hover .banner-image {
          transform: scale(1.05);
        }

        .banner-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .placeholder-icon {
          font-size: 48px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Georgia', serif;
        }

        /* Badges */
        .badge-container {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }

        .duration-badge {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .discount-badge {
          background: #10b981;
          color: #fff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Content */
        .card-content {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
          line-height: 1.2;
          font-family: 'Georgia', serif;
        }

        .card-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
          flex: 1;
        }

        /* Price */
        .price-section {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-top: 4px;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .currency {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .amount {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          font-family: 'Georgia', serif;
        }

        .price-original {
          font-size: 16px;
          color: #9ca3af;
          text-decoration: line-through;
          text-decoration-color: #ef4444;
        }

        .savings-badge {
          display: inline-block;
          background: #ecfdf5;
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid #d1fae5;
          width: fit-content;
        }

        /* Features */
        .features-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #374151;
        }

        .check-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: #10b981;
        }

        /* CTA Button */
        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 24px;
          margin-top: auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .cta-button:hover::before {
          opacity: 1;
        }

        .cta-button .arrow-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(4px);
        }

        .cta-button span {
          position: relative;
          z-index: 1;
        }

        /* Dark Theme */
        .dark .premium-card {
          background: linear-gradient(145deg, #1f2937 0%, #111827 100%);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .dark .card-title {
          color: #f9fafb;
        }

        .dark .card-description {
          color: #9ca3af;
        }

        .dark .currency,
        .dark .amount {
          color: #f9fafb;
        }

        .dark .feature-item {
          color: #d1d5db;
        }

        .dark .price-original {
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .card-content {
            padding: 20px;
          }

          .card-title {
            font-size: 20px;
          }

          .amount {
            font-size: 28px;
          }

          .cta-button {
            padding: 12px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
});

PremiumCard.displayName = 'PremiumCard';

export default PremiumCard;