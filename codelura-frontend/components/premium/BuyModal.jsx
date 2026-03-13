"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function BuyModal({ plan, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    telegramUsername: "",
    mobile: "",
    email: "",
    note: "",
    transactionId: "",
    couponCode: "",
    referralCode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= PAYMENT ================= */
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/payment/create-order", {
        serviceId: plan._id,
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
            if (!window.Razorpay) {
              toast.error("Payment gateway failed to load");
              return;
            }
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              serviceId: plan._id,
            });
            toast.success("Payment Successful!");
            setForm((prev) => ({
              ...prev,
              transactionId: response.razorpay_payment_id,
            }));
            setStep(2);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#16a34a" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/premium/buy", { serviceId: plan._id, ...form });
      toast.success("Subscription request submitted");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

        .buy-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
          font-family: 'Sora', sans-serif;
        }

        .buy-card {
          background: #ffffff;
          width: 100%;
          max-width: 460px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        /* ── Header band ── */
        .buy-header {
          background: linear-gradient(135deg, #166534 0%, #16a34a 100%);
          padding: 24px 24px 20px;
          position: relative;
        }

        .buy-header-step {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          transition: background 0.25s;
        }
        .step-dot.active { background: #ffffff; }

        .buy-header h2 {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .buy-header p {
          color: rgba(255,255,255,0.75);
          font-size: 0.8rem;
          margin: 0;
        }

        .close-btn {
          position: absolute;
          top: 14px; right: 14px;
          background: rgba(255,255,255,0.18);
          border: none;
          color: #fff;
          width: 30px; height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.32); }

        /* ── Body ── */
        .buy-body {
          padding: 24px;
        }

        /* ── Plan pill ── */
        .plan-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }

        .plan-pill-label {
          font-size: 0.75rem;
          color: #15803d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 2px;
        }

        .plan-pill-name {
          font-size: 1rem;
          font-weight: 600;
          color: #14532d;
        }

        .plan-pill-price {
          font-size: 1.6rem;
          font-weight: 700;
          color: #16a34a;
        }

        /* ── Pay button ── */
        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(22,163,74,0.35);
        }
        .pay-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .pay-btn:active:not(:disabled) { transform: translateY(0); }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .secure-note {
          text-align: center;
          font-size: 0.72rem;
          color: #9ca3af;
          margin-top: 12px;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }

        /* ── Form ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-grid .full {
          grid-column: 1 / -1;
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field-wrap label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .field-wrap input,
        .field-wrap textarea {
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.875rem;
          font-family: 'Sora', sans-serif;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .field-wrap input:focus,
        .field-wrap textarea:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .field-wrap input.readonly {
          background: #f9fafb;
          color: #6b7280;
          cursor: default;
        }
        .field-wrap textarea {
          resize: none;
          height: 72px;
        }

        .divider {
          border: none;
          border-top: 1px dashed #e5e7eb;
          margin: 16px 0;
        }

        .optional-tag {
          font-size: 0.65rem;
          background: #f3f4f6;
          color: #9ca3af;
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: 4px;
          font-weight: 500;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          margin-top: 16px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Spinner ── */
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
          .buy-body { padding: 18px; }
          .buy-header { padding: 20px 18px 16px; }
        }
      `}</style>

      <div className="buy-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
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
                  <div className="plan-pill-price">₹{plan.price}</div>
                </div>

                <button
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? <span className="spinner" /> : "🔒"}
                  {loading ? "Initializing..." : `Pay ₹${plan.price}`}
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
                    <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
                  </div>

                  <div className="field-wrap">
                    <label>Mobile</label>
                    <input name="mobile" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={handleChange} />
                  </div>

                  <div className="field-wrap">
                    <label>Email</label>
                    <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                  </div>

                  <div className="field-wrap full">
                    <label>Telegram Username</label>
                    <input name="telegramUsername" placeholder="@username" value={form.telegramUsername} onChange={handleChange} />
                  </div>

                  <hr className="divider full" style={{ gridColumn: "1 / -1" }} />

                  <div className="field-wrap">
                    <label>Coupon Code <span className="optional-tag">optional</span></label>
                    <input name="couponCode" placeholder="SAVE10" value={form.couponCode} onChange={handleChange} />
                  </div>

                  <div className="field-wrap">
                    <label>Referral Code <span className="optional-tag">optional</span></label>
                    <input name="referralCode" placeholder="REF123" value={form.referralCode} onChange={handleChange} />
                  </div>

                  <div className="field-wrap full">
                    <label>Note <span className="optional-tag">optional</span></label>
                    <textarea name="note" placeholder="Anything you'd like us to know…" value={form.note} onChange={handleChange} />
                  </div>

                  <div className="field-wrap full">
                    <label>Transaction ID</label>
                    <input name="transactionId" value={form.transactionId} readOnly className="readonly" />
                  </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? <span className="spinner" /> : null}
                  {loading ? "Submitting..." : "Submit Details →"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}