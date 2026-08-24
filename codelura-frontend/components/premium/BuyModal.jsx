"use client";

import { useState, useCallback, memo } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

// Memoized component for better performance
const BuyModal = memo(({ plan, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    telegramUsername: "",
    mobile: "",
    email: "",
    note: "",
    transactionId: "",
    referralCode: "",
  });

  // Memoized handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const basePrice = plan.discountedPrice ?? plan.price;
  const hasSlash = plan.discountedPrice != null && plan.discountedPrice < plan.price;
  const finalAmount = Math.max(0, basePrice - couponDiscount);

  // Apply Coupon - Optimized
  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponLoading(true);
      const { data } = await api.post("/premium/coupon/apply", {
        code: couponCode,
        serviceId: plan._id,
      });
      setCouponDiscount(data.discountAmount || 0);
      setCouponApplied(true);
      toast.success(`Coupon applied! ₹${data.discountAmount} off`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setCouponApplied(false);
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, plan._id]);

  const handleRemoveCoupon = useCallback(() => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDiscount(0);
  }, []);

  // Payment Handler - Optimized
  const handlePayment = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/payment/create-order", {
        serviceId: plan._id,
        couponCode: couponApplied ? couponCode : undefined,
        finalAmount: finalAmount,
      });

      const order = data.order;
      const options = {
        key: data.key,
        amount: order.amount,
        currency: order.currency,
        name: "Codelura Premium",
        description: plan.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            const txnId = response.razorpay_payment_id;
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId: plan._id,
            });

            await api.post("/premium/buy", {
              serviceId: plan._id,
              ...form,
              transactionId: txnId,
              couponCode: couponApplied ? couponCode : "",
            });

            toast.success("Payment Successful 🎉");
            onClose();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  }, [plan, couponApplied, couponCode, finalAmount, form, onClose]);

  // Submit Handler - Optimized
  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.mobile || !form.email) {
      toast.error("Please fill all required fields");
      return;
    }
    await handlePayment();
  }, [form, handlePayment]);

  // Keyboard shortcut to close modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  // Click outside handler
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .buy-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50; padding: 16px;
          font-family: 'Sora', sans-serif;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .buy-card {
          background: #fff;
          width: 100%; max-width: 460px;
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .buy-header {
          background: linear-gradient(135deg, #166534 0%, #16a34a 100%);
          padding: 20px 24px 16px;
          position: relative;
          flex-shrink: 0;
        }
        .buy-header-step { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .step-dot { 
          width: 8px; height: 8px; border-radius: 50%; 
          background: rgba(255,255,255,0.35); 
          transition: background 0.25s; 
        }
        .step-dot.active { background: #fff; }
        .buy-header h2 { 
          color: #fff; font-size: 1.1rem; font-weight: 700; 
          margin: 0 0 2px; 
        }
        .buy-header p { 
          color: rgba(255,255,255,0.75); 
          font-size: 0.75rem; margin: 0; 
        }
        .close-btn {
          position: absolute; top: 12px; right: 12px;
          background: rgba(255,255,255,0.18); border: none; color: #fff;
          width: 28px; height: 28px; border-radius: 50%;
          cursor: pointer; font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.32); }
        
        .buy-body { 
          padding: 20px 24px 24px; 
          overflow-y: auto;
          flex: 1;
        }

        /* ── Plan pill ── */
        .plan-pill {
          display: flex; align-items: center; justify-content: space-between;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 12px; padding: 12px 16px; margin-bottom: 14px;
        }
        .plan-pill-label { 
          font-size: 0.7rem; color: #15803d; font-weight: 600; 
          text-transform: uppercase; letter-spacing: 0.06em; 
          margin-bottom: 2px; 
        }
        .plan-pill-name { font-size: 0.95rem; font-weight: 600; color: #14532d; }
        .plan-pill-price-block { text-align: right; }
        .plan-pill-price { font-size: 1.4rem; font-weight: 700; color: #16a34a; line-height: 1; }
        .plan-pill-original {
          font-size: 0.8rem; color: #9ca3af;
          text-decoration: line-through;
          text-decoration-color: rgba(156,163,175,0.7);
        }
        .plan-pill-save {
          display: inline-block;
          font-size: 0.65rem; font-weight: 700;
          color: #16a34a; background: #dcfce7;
          border: 1px solid #bbf7d0;
          border-radius: 100px; padding: 1px 8px;
        }

        /* ── Price summary ── */
        .price-summary {
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 10px 14px;
          margin-bottom: 14px; font-size: 0.8rem;
          display: flex; flex-direction: column; gap: 5px;
        }
        .price-row { display: flex; justify-content: space-between; color: #6b7280; }
        .price-row.total { 
          color: #111827; font-weight: 700; font-size: 0.9rem; 
          border-top: 1px dashed #e5e7eb; padding-top: 5px; margin-top: 2px; 
        }
        .price-row .green { color: #16a34a; font-weight: 600; }

        /* ── Coupon ── */
        .coupon-row {
          display: flex; gap: 8px; margin-bottom: 14px;
        }
        .coupon-input {
          flex: 1; border: 1.5px solid #e5e7eb; border-radius: 10px;
          padding: 8px 12px; font-size: 0.85rem;
          font-family: 'Sora', sans-serif; color: #111827;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          text-transform: uppercase;
        }
        .coupon-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
        .coupon-input:disabled { background: #f9fafb; color: #6b7280; }
        .coupon-apply-btn {
          background: #16a34a; color: #fff; border: none;
          border-radius: 10px; padding: 8px 14px;
          font-size: 0.8rem; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          white-space: nowrap; transition: opacity 0.2s;
        }
        .coupon-apply-btn:hover:not(:disabled) { opacity: 0.88; }
        .coupon-apply-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .coupon-remove-btn {
          background: #fee2e2; color: #dc2626; border: none;
          border-radius: 10px; padding: 8px 14px;
          font-size: 0.8rem; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          transition: background 0.2s;
        }
        .coupon-remove-btn:hover { background: #fecaca; }

        /* ── Pay button ── */
        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #fff; border: none; padding: 12px;
          border-radius: 12px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; font-family: 'Sora', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(22,163,74,0.35);
        }
        .pay-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .secure-note {
          text-align: center; font-size: 0.7rem; color: #9ca3af;
          margin-top: 10px;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }

        /* ── Form ── */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .form-grid .full { grid-column: 1 / -1; }
        .field-wrap { display: flex; flex-direction: column; gap: 3px; }
        .field-wrap label { 
          font-size: 0.7rem; font-weight: 600; color: #6b7280; 
          text-transform: uppercase; letter-spacing: 0.05em; 
        }
        .field-wrap input, .field-wrap textarea {
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          padding: 8px 12px; font-size: 0.85rem;
          font-family: 'Sora', sans-serif; color: #111827;
          background: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .field-wrap input:focus, .field-wrap textarea:focus {
          border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .field-wrap input.readonly { background: #f9fafb; color: #6b7280; cursor: default; }
        .field-wrap textarea { resize: vertical; height: 60px; min-height: 50px; max-height: 120px; }
        .divider { border: none; border-top: 1px dashed #e5e7eb; margin: 12px 0; }
        .optional-tag { 
          font-size: 0.6rem; background: #f3f4f6; color: #9ca3af; 
          padding: 1px 6px; border-radius: 4px; margin-left: 4px; font-weight: 500; 
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff; border: none; padding: 12px;
          border-radius: 12px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; font-family: 'Sora', sans-serif; 
          margin-top: 14px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner { 
          width: 16px; height: 16px; 
          border: 2px solid rgba(255,255,255,0.35); 
          border-top-color: #fff; 
          border-radius: 50%; 
          animation: spin 0.7s linear infinite; 
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-grid .full { grid-column: 1; }
          .buy-body { padding: 16px 18px 20px; }
          .buy-header { padding: 16px 18px 14px; }
          .buy-card { max-height: 95vh; }
        }
      `}</style>

      <div 
        className="buy-overlay" 
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
      >
        <div className="buy-card">

          {/* ── Header ── */}
          <div className="buy-header">
            <div className="buy-header-step">
              <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
              <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
            </div>
            <h2>{step === 1 ? "Confirm Purchase" : "Complete Your Details"}</h2>
            <p>{step === 1 ? "Secure payment via Razorpay" : "Step 2 of 2 — Fill in your info"}</p>
            <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {/* ── Body ── */}
          <div className="buy-body">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className="plan-pill">
                  <div>
                    <div className="plan-pill-label">Selected Plan</div>
                    <div className="plan-pill-name">{plan.title}</div>
                  </div>
                  <div className="plan-pill-price-block">
                    <div className="plan-pill-price">₹{basePrice.toLocaleString("en-IN")}</div>
                    {hasSlash && (
                      <>
                        <div className="plan-pill-original">₹{plan.price.toLocaleString("en-IN")}</div>
                        <div className="plan-pill-save">
                          {Math.round(((plan.price - basePrice) / plan.price) * 100)}% OFF
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="coupon-row">
                  <input
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <button className="coupon-remove-btn" onClick={handleRemoveCoupon}>
                      ✕ Remove
                    </button>
                  ) : (
                    <button
                      className="coupon-apply-btn"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? <span className="spinner" /> : "Apply"}
                    </button>
                  )}
                </div>

                <div className="price-summary">
                  <div className="price-row">
                    <span>Plan Price</span>
                    <span>₹{basePrice.toLocaleString("en-IN")}</span>
                  </div>
                  {hasSlash && (
                    <div className="price-row">
                      <span>Plan Discount</span>
                      <span className="green">- ₹{(plan.price - basePrice).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {couponApplied && couponDiscount > 0 && (
                    <div className="price-row">
                      <span>Coupon ({couponCode})</span>
                      <span className="green">- ₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total Payable</span>
                    <span>₹{finalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button className="pay-btn" onClick={() => setStep(2)} disabled={loading}>
                  {loading ? <span className="spinner" /> : "🔒"}
                  {loading ? "Initializing..." : `Pay ₹${finalAmount.toLocaleString("en-IN")}`}
                </button>

                <p className="secure-note">
                  🛡️ 256-bit encrypted · Powered by Razorpay
                </p>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className="form-grid">
                  <div className="field-wrap full">
                    <label>Full Name</label>
                    <input 
                      name="name" 
                      placeholder="John Doe" 
                      value={form.name} 
                      onChange={handleChange} 
                      autoFocus
                    />
                  </div>
                  <div className="field-wrap">
                    <label>Mobile</label>
                    <input 
                      name="mobile" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={form.mobile} 
                      onChange={handleChange} 
                      type="tel"
                    />
                  </div>
                  <div className="field-wrap">
                    <label>Email</label>
                    <input 
                      name="email" 
                      type="email" 
                      placeholder="you@email.com" 
                      value={form.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="field-wrap full">
                    <label>Telegram Username</label>
                    <input 
                      name="telegramUsername" 
                      placeholder="@username" 
                      value={form.telegramUsername} 
                      onChange={handleChange} 
                    />
                  </div>
                  <hr className="divider" style={{ gridColumn: "1 / -1" }} />
                  <div className="field-wrap full">
                    <label>Referral Code <span className="optional-tag">optional</span></label>
                    <input 
                      name="referralCode" 
                      placeholder="REF123" 
                      value={form.referralCode} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="field-wrap full">
                    <label>Note <span className="optional-tag">optional</span></label>
                    <textarea 
                      name="note" 
                      placeholder="Anything you'd like us to know…" 
                      value={form.note} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="field-wrap full">
                    <label>Transaction ID</label>
                    <input 
                      name="transactionId" 
                      value={form.transactionId} 
                      readOnly 
                      className="readonly" 
                    />
                  </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? <span className="spinner" /> : null}
                  {loading ? "Processing..." : "Continue to Pay →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

BuyModal.displayName = 'BuyModal';

export default BuyModal;