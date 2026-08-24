"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import axios from "axios";

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  service: string;
}

// Service options
const SERVICES = [
  { icon: "🌐", label: "Web Apps" },
  { icon: "📱", label: "Mobile Apps" },
  { icon: "🛒", label: "E-Commerce" },
  { icon: "🎨", label: "UI/UX Design" },
  { icon: "⚡", label: "APIs & Backend" },
  { icon: "☁️", label: "Cloud & DevOps" },
];

const WHY_CHOOSE_US = [
  { icon: "🚀", title: "Fast Turnaround", description: "MVP delivered in weeks, not months." },
  { icon: "🔒", title: "Transparent Process", description: "Regular updates, no surprises on scope or budget." },
  { icon: "🤝", title: "Post-launch Support", description: "We stay with you even after go-live." },
];

// Email + call block ("Email Us")
const CONTACT_INFO = [
  { icon: "📧", label: "Email", value: "shubham@codelura.in", href: "mailto:shubham@codelura.in" },
  { icon: "📧", label: "Email (General)", value: "codelura@gmail.com", href: "mailto:codelura@gmail.com" },
  { icon: "✉️", label: "Business Email", value: "tech@codeura.com", href: "mailto:tech@codeura.com" },
  { icon: "📞", label: "Call", value: "+91-9336289192", href: "tel:+919336289192" },
];

const CONSULT_LINK = "https://calendly.com/codelura/free-project-consultation-codelura";

const BUDGET_RANGES = [
  { value: "", label: "Select Budget Range" },
  { value: "under-10k", label: "Under ₹10k" },
  { value: "10k-25k", label: "₹10k – ₹25k" },
  { value: "25k-50k", label: "₹25k – ₹50k" },
  { value: "50k-1lakh", label: "₹50k – ₹1 Lakh" },
  { value: "1lakh-plus", label: "₹1 Lakh+" },
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "";

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
    service: serviceName,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: "",
  });

  // Update service when URL param changes
  useEffect(() => {
    if (serviceName && serviceName !== form.service) {
      setForm(prev => ({ ...prev, service: serviceName }));
    }
  }, [serviceName]);

  // Handle form input changes with useCallback
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  }, [submitStatus.type]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setSubmitStatus({
        type: 'error',
        message: "Please fill in all required fields (Name, Email, and Message)."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const res = await api.post("/services/create", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        budget: form.budget,
        message: form.message,
        serviceSlug: form.service.toLowerCase().replace(/\s+/g, "-"),
      });

      if (res.data.success) {
        setSubmitStatus({
          type: 'success',
          message: "Enquiry sent successfully! 🚀 We'll get back to you within 24 hours."
        });
        // Reset form
        setForm({
          name: "",
          email: "",
          phone: "",
          budget: "",
          message: "",
          service: serviceName,
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: res.data.message || "Something went wrong. Please try again."
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setSubmitStatus({
          type: 'error',
          message: error.response?.data?.message || "Network error. Please check your connection."
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: "Something went wrong. Please try again later."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, serviceName]);

  return (
    <main className="min-h-screen bg-[#080B14] flex items-center justify-center px-4 py-10 sm:py-16 lg:py-20">
      {/* Hidden SEO heading */}
      <h1 className="sr-only">Contact Codelura - Web Development Agency</h1>

      {/* Background effects */}
      <div className="grid-bg" aria-hidden="true" />
      <div className="glow glow-primary" aria-hidden="true" />
      <div className="glow glow-secondary" aria-hidden="true" />

      <div className="outer">
        {/* Left Info Panel */}
        <div className="info-panel">
          <div className="info-top">
            <div className="info-badge">
              <span className="info-badge-dot" aria-hidden="true" />
              Get in Touch
            </div>

            <h2 className="info-heading">
              Let&apos;s Build<br />Something{" "}
              <span className="grad">Great</span>
            </h2>
            <p className="info-sub">
              Whether it&apos;s a web app, mobile app, or a complete digital product — share your idea and we&apos;ll turn it into reality.
            </p>

            {/* Prefer to talk directly? */}
            <div className="consult-card">
              <div className="consult-title">
                <span aria-hidden="true">📅</span> Prefer to talk directly?
              </div>
              <p className="consult-desc">
                Book a free consultation call with our founder — no forms, just a quick conversation.
              </p>
              <a
                href={CONSULT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="consult-btn"
              >
                Book Free Consultation
              </a>
            </div>

            <div className="services-label">What we work on</div>
            <div className="services-pills">
              {SERVICES.map((s) => (
                <span className="pill" key={s.label}>
                  <span className="pill-icon" aria-hidden="true">{s.icon}</span>
                  {s.label}
                </span>
              ))}
            </div>

            <div className="why-list">
              {/* Email Us */}
              <div className="contact-box">
                <div className="services-label contact-box-label">Email Us</div>
                {CONTACT_INFO.map((item) => (
                  <div className="contact-item" key={item.label}>
                    <div className="contact-icon" aria-hidden="true">{item.icon}</div>
                    <div className="contact-item-body">
                      <div className="contact-label">{item.label}</div>
                      <div className="contact-text">
                        <a href={item.href} className="hover:text-[#ff6b35] transition-colors">
                          {item.value}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {WHY_CHOOSE_US.map((w) => (
                <div className="why-item" key={w.title}>
                  <div className="why-icon" aria-hidden="true">{w.icon}</div>
                  <div>
                    <div className="why-title">{w.title}</div>
                    <div className="why-desc">{w.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-row">
            <div>
              <div className="stat-val">200+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div>
              <div className="stat-val">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div>
              <div className="stat-val">24h</div>
              <div className="stat-label">Response Time</div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="form-panel">
          <div className="form-title">Send an Enquiry</div>
          <div className="form-sub">Fill in the details below — we will get back to you within 24 hours.</div>

          {/* Status messages */}
          {submitStatus.type && (
            <div className={`status-message ${submitStatus.type}`} role="alert">
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name + Email */}
            <div className="row2">
              <div className="wrap">
                <span className="ico" aria-hidden="true">👤</span>
                <input
                  name="name"
                  placeholder="Your Name *"
                  className="field"
                  value={form.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="wrap">
                <span className="ico" aria-hidden="true">📧</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  className="field"
                  value={form.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-gap" />

            {/* Phone + Service */}
            <div className="row2">
              <div className="wrap">
                <span className="ico" aria-hidden="true">📱</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="field"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="wrap">
                <span className="ico" aria-hidden="true">⚡</span>
                <input
                  name="service"
                  placeholder="Service"
                  className="field readonly"
                  value={form.service}
                  readOnly
                  aria-readonly="true"
                />
              </div>
            </div>

            <div className="form-gap" />

            {/* Budget */}
            <div className="wrap">
              <span className="ico" aria-hidden="true">💰</span>
              <select
                name="budget"
                className="field"
                value={form.budget}
                onChange={handleChange}
              >
                {BUDGET_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <span className="select-arrow" aria-hidden="true">▼</span>
            </div>

            {/* Message */}
            <div className="wrap">
              <span className="ico ico-top" aria-hidden="true">💬</span>
              <textarea
                name="message"
                placeholder="Describe your project or idea… *"
                className="field textarea"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              aria-label={isSubmitting ? "Sending..." : "Send Enquiry"}
            >
              <span>{isSubmitting ? "Sending..." : "Send Enquiry"}</span>
              <span aria-hidden="true">{isSubmitting ? "⏳" : "→"}</span>
            </button>

            <div className="form-note">
              <span aria-hidden="true">🔒</span> Your details are safe with us · No spam, ever
            </div>
          </form>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          box-sizing: border-box;
        }

        .syne {
          font-family: 'Syne', sans-serif;
        }

        /* Background */
        .grid-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }

        .glow-primary {
          width: 480px;
          height: 260px;
          background: rgba(255, 107, 53, 0.09);
          top: 4%;
          left: 50%;
          transform: translateX(-50%);
        }

        .glow-secondary {
          width: 200px;
          height: 200px;
          background: rgba(255, 60, 53, 0.06);
          bottom: 8%;
          left: 4%;
        }

        /* Layout */
        .outer {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1040px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
        }

        /* Info Panel */
        .info-panel {
          padding: 52px 44px;
          background: rgba(255, 107, 53, 0.04);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .info-panel::before {
          content: '';
          position: absolute;
          top: -80px;
          left: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        .info-panel::after {
          content: '';
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 200, 80, 0.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .info-top {
          position: relative;
          z-index: 1;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 107, 53, 0.12);
          border: 1px solid rgba(255, 107, 53, 0.28);
          color: #ff6b35;
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .info-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff6b35;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .info-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 3vw, 38px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .info-heading .grad {
          background: linear-gradient(90deg, #ff6b35, #ffaa35);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .info-sub {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.75;
          max-width: 300px;
          margin-bottom: 28px;
        }

        /* Prefer to talk directly? card */
        .consult-card {
          background: rgba(255, 107, 53, 0.08);
          border: 1px solid rgba(255, 107, 53, 0.25);
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 32px;
          max-width: 340px;
        }

        .consult-title {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .consult-desc {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.65;
          margin-bottom: 14px;
        }

        .consult-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff6b35, #ffaa35);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 100px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .consult-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255, 107, 53, 0.4);
        }

        .services-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.25);
          margin-bottom: 12px;
        }

        .services-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 36px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.55);
          transition: all 0.2s ease;
        }

        .pill:hover {
          border-color: rgba(255, 107, 53, 0.35);
          color: rgba(255, 255, 255, 0.85);
          background: rgba(255, 107, 53, 0.08);
        }

        .pill-icon {
          font-size: 13px;
        }

        .why-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .why-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .why-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          flex-shrink: 0;
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .why-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
        }

        .why-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.33);
          margin-top: 1px;
          line-height: 1.5;
        }

        .contact-box {
          margin-top: 10px;
          margin-bottom: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .contact-box-label {
          margin-bottom: 10px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
        }

        .contact-item:last-child {
          margin-bottom: 0;
        }

        .contact-item-body {
          min-width: 0;
        }

        .contact-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid rgba(255, 107, 53, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-text {
          color: rgba(255, 255, 255, 0.75);
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .contact-text a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }

        .contact-text a:hover {
          color: #ff6b35;
        }

        .contact-label {
          color: rgba(255, 255, 255, 0.35);
          font-size: 11px;
          margin-bottom: 2px;
        }

        .stat-row {
          display: flex;
          gap: 14px;
          margin-top: 16px;
          padding-top: 28px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
          z-index: 1;
        }

        .stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 3px;
        }

        /* Form Panel */
        .form-panel {
          padding: 52px 44px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
        }

        .form-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 28px;
        }

        .form-gap {
          height: 14px;
        }

        .row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .wrap:last-child {
          margin-bottom: 0;
        }

        .ico {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 15px;
          pointer-events: none;
          line-height: 1;
        }

        .ico-top {
          top: 14px;
          transform: none;
        }

        .field {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          padding: 12px 14px 12px 42px;
          outline: none;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          display: block;
          -webkit-appearance: none;
          appearance: none;
        }

        .field::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .field:focus {
          border-color: rgba(255, 107, 53, 0.55);
          background: rgba(255, 107, 53, 0.04);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.08);
        }

        .field.readonly {
          color: #ff6b35;
          border-color: rgba(255, 107, 53, 0.25);
          background: rgba(255, 107, 53, 0.06);
          cursor: default;
        }

        .field.textarea {
          padding-top: 12px;
          resize: none;
        }

        select.field option {
          background: #0f1220;
          color: #fff;
        }

        .select-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          pointer-events: none;
        }

        .btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #ff6b35, #ffaa35);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.03em;
          font-family: 'Syne', sans-serif;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 28px rgba(255, 107, 53, 0.3);
          margin-top: 4px;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(255, 107, 53, 0.42);
        }

        .btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Status Messages */
        .status-message {
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.5;
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        /* Responsive */
        @media (max-width: 780px) {
          .outer {
            grid-template-columns: 1fr;
          }

          .info-panel {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            padding: 36px 28px;
          }

          .form-panel {
            padding: 36px 28px;
          }

          .row2 {
            grid-template-columns: 1fr;
          }

          .stat-row {
            gap: 16px;
            flex-wrap: wrap;
          }

          .consult-card {
            max-width: none;
          }

          .info-sub {
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .outer {
            border-radius: 20px;
          }

          .info-panel {
            padding: 24px 18px;
          }

          .form-panel {
            padding: 24px 18px;
          }

          .info-heading {
            font-size: clamp(22px, 7vw, 30px);
          }

          .consult-card {
            padding: 14px 16px;
            margin-bottom: 24px;
          }

          .consult-btn {
            width: 100%;
            justify-content: center;
          }

          .services-pills {
            gap: 6px;
            margin-bottom: 28px;
          }

          .pill {
            font-size: 11px;
            padding: 4px 10px;
          }

          .contact-item {
            gap: 10px;
          }

          .contact-icon {
            width: 32px;
            height: 32px;
          }

          .stat-row {
            flex-wrap: wrap;
            gap: 12px;
          }

          .stat-val {
            font-size: 18px;
          }

          .ico {
            left: 12px;
            font-size: 14px;
          }

          .field {
            padding-left: 38px;
            font-size: 13.5px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles */
        .field:focus-visible {
          outline: 2px solid #ff6b35;
          outline-offset: 2px;
        }

        .btn:focus-visible,
        .consult-btn:focus-visible {
          outline: 2px solid #ff6b35;
          outline-offset: 2px;
        }

        .contact-text a:focus-visible {
          outline: 2px solid #ff6b35;
          outline-offset: 2px;
          border-radius: 2px;
        }
      `}</style>
    </main>
  );
}