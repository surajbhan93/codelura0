"use client";

import { useCallback, useState } from "react";
import api from "@/lib/api";
import axios from "axios";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  { value: "general", label: "General Query", icon: "💬" },
  { value: "hackathon", label: "Hackathon", icon: "⚡" },
  { value: "notes", label: "Notes", icon: "📝" },
  { value: "membership", label: "Membership", icon: "🎖️" },
  { value: "collaboration", label: "Collaboration", icon: "🤝" },
] as const;

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "general",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);
      try {
        const res = await api.post("/contact/create", form);
        if (res.data.success) {
          setStatus({ type: "success", text: "Message sent successfully 🚀" });
          setForm(INITIAL_FORM);
        }
      } catch (error: unknown) {
        const text = axios.isAxiosError(error)
          ? error.response?.data?.message || "Something went wrong. Please try again."
          : "Something went wrong. Please try again.";
        setStatus({ type: "error", text });
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#2D82DC]"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#2D82DC]"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="sr-only">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#2D82DC]"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          autoComplete="tel"
          inputMode="tel"
        />
      </div>

      {/* Subject */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          What&apos;s this about?
        </legend>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              type="button"
              key={s.value}
              onClick={() => setForm((f) => ({ ...f, subject: s.value }))}
              aria-pressed={form.subject === s.value}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                form.subject === s.value
                  ? "border-[#2D82DC] bg-[#2D82DC]/20 text-[#5FB0FF]"
                  : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="sr-only">
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#2D82DC]"
          rows={4}
          placeholder="Write your message here…"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#2D82DC] py-3 font-semibold transition hover:bg-[#3E8FE5] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message →"}
      </button>

      {/* Inline status instead of a blocking alert() — faster, less jarring,
          and screen readers announce it via aria-live automatically. */}
      <p
        role="status"
        aria-live="polite"
        className={`text-center text-xs ${
          status?.type === "error"
            ? "text-red-400"
            : status?.type === "success"
            ? "text-green-400"
            : "text-white/30"
        }`}
      >
        {status ? status.text : "🔒 We never share your info · No spam, ever"}
      </p>
    </form>
  );
}