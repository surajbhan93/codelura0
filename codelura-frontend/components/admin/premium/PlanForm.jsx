// "use client";

// import { useState } from "react";
// import api from "@/lib/api";
// import toast from "react-hot-toast";

// export default function PlanForm() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     price: "",
//     durationInMonths: "",

//     features: [""],

//     bannerImage: "",
//     galleryImages: [""],

//     /* ✅ NEW */
//     faqs: [{ question: "", answer: "" }],
//     processSteps: [{ title: "", description: "" }],

//     metaTitle: "",
//     metaDescription: "",
//     ogImage: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   /* ===== FEATURES ===== */
//   const handleFeatureChange = (i, value) => {
//     const features = [...form.features];
//     features[i] = value;
//     setForm({ ...form, features });
//   };

//   const addFeature = () =>
//     setForm({ ...form, features: [...form.features, ""] });

//   /* ===== FAQ ===== */
//   const handleFAQChange = (i, field, value) => {
//     const faqs = [...form.faqs];
//     faqs[i][field] = value;
//     setForm({ ...form, faqs });
//   };

//   const addFAQ = () =>
//     setForm({
//       ...form,
//       faqs: [...form.faqs, { question: "", answer: "" }],
//     });

//   /* ===== PROCESS ===== */
//   const handleProcessChange = (i, field, value) => {
//     const steps = [...form.processSteps];
//     steps[i][field] = value;
//     setForm({ ...form, processSteps: steps });
//   };

//   const addProcess = () =>
//     setForm({
//       ...form,
//       processSteps: [
//         ...form.processSteps,
//         { title: "", description: "" },
//       ],
//     });

//   /* ===== SUBMIT ===== */
//   const handleSubmit = async () => {
//     try {
//       await api.post("/premium/admin/plan", {
//         ...form,
//         price: Number(form.price),
//         durationInMonths: Number(form.durationInMonths),
//       });

//       toast.success("Advanced Plan Created Successfully");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow space-y-6">
//       <h2 className="font-bold text-lg">Create Advanced Plan</h2>

//       {/* BASIC INFO */}
//       <input name="title" placeholder="Title" onChange={handleChange} className="input" />
//       <textarea name="description" placeholder="Description" onChange={handleChange} className="input" />
//       <input name="price" placeholder="Price" onChange={handleChange} className="input" />
//       <input name="durationInMonths" placeholder="Duration (months)" onChange={handleChange} className="input" />

//       {/* FEATURES */}
//       <div>
//         <h3 className="font-semibold">Features</h3>
//         {form.features.map((f, i) => (
//           <input
//             key={i}
//             value={f}
//             onChange={(e) => handleFeatureChange(i, e.target.value)}
//             className="input mt-2"
//           />
//         ))}
//         <button onClick={addFeature} className="text-blue-600 text-sm mt-2">
//           + Add Feature
//         </button>
//       </div>

//       {/* FAQ */}
//       <div>
//         <h3 className="font-semibold">FAQs</h3>
//         {form.faqs.map((faq, i) => (
//           <div key={i} className="border p-3 rounded mt-2">
//             <input
//               placeholder="Question"
//               value={faq.question}
//               onChange={(e) =>
//                 handleFAQChange(i, "question", e.target.value)
//               }
//               className="input mb-2"
//             />
//             <textarea
//               placeholder="Answer"
//               value={faq.answer}
//               onChange={(e) =>
//                 handleFAQChange(i, "answer", e.target.value)
//               }
//               className="input"
//             />
//           </div>
//         ))}
//         <button onClick={addFAQ} className="text-blue-600 text-sm mt-2">
//           + Add FAQ
//         </button>
//       </div>

//       {/* PROCESS */}
//       <div>
//         <h3 className="font-semibold">Process (How it works)</h3>
//         {form.processSteps.map((step, i) => (
//           <div key={i} className="border p-3 rounded mt-2">
//             <input
//               placeholder="Step Title"
//               value={step.title}
//               onChange={(e) =>
//                 handleProcessChange(i, "title", e.target.value)
//               }
//               className="input mb-2"
//             />
//             <textarea
//               placeholder="Step Description"
//               value={step.description}
//               onChange={(e) =>
//                 handleProcessChange(i, "description", e.target.value)
//               }
//               className="input"
//             />
//           </div>
//         ))}
//         <button onClick={addProcess} className="text-blue-600 text-sm mt-2">
//           + Add Process Step
//         </button>
//       </div>

//       {/* IMAGES */}
//       <input name="bannerImage" placeholder="Banner Image URL" onChange={handleChange} className="input" />
//       <input name="ogImage" placeholder="OG Image URL" onChange={handleChange} className="input" />

//       {/* SEO */}
//       <input name="metaTitle" placeholder="Meta Title" onChange={handleChange} className="input" />
//       <textarea name="metaDescription" placeholder="Meta Description" onChange={handleChange} className="input" />

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-blue-600 text-white py-2 rounded"
//       >
//         Create Advanced Plan
//       </button>

//       <style jsx>{`
//         .input {
//           width: 100%;
//           border: 1px solid #ddd;
//           padding: 8px;
//           border-radius: 6px;
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function PlanForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    durationInMonths: "",
    features: [""],
    bannerImage: "",
    galleryImages: [""],
    faqs: [{ question: "", answer: "" }],
    processSteps: [{ title: "", description: "" }],
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ===== FEATURES ===== */
  const handleFeatureChange = (i, value) => {
    const features = [...form.features];
    features[i] = value;
    setForm({ ...form, features });
  };
  const addFeature = () =>
    setForm({ ...form, features: [...form.features, ""] });
  const removeFeature = (i) =>
    setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });

  /* ===== FAQ ===== */
  const handleFAQChange = (i, field, value) => {
    const faqs = [...form.faqs];
    faqs[i][field] = value;
    setForm({ ...form, faqs });
  };
  const addFAQ = () =>
    setForm({ ...form, faqs: [...form.faqs, { question: "", answer: "" }] });
  const removeFAQ = (i) =>
    setForm({ ...form, faqs: form.faqs.filter((_, idx) => idx !== i) });

  /* ===== PROCESS ===== */
  const handleProcessChange = (i, field, value) => {
    const steps = [...form.processSteps];
    steps[i][field] = value;
    setForm({ ...form, processSteps: steps });
  };
  const addProcess = () =>
    setForm({ ...form, processSteps: [...form.processSteps, { title: "", description: "" }] });
  const removeProcess = (i) =>
    setForm({ ...form, processSteps: form.processSteps.filter((_, idx) => idx !== i) });

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/premium/admin/plan", {
        ...form,
        price: Number(form.price),
        durationInMonths: Number(form.durationInMonths),
      });
      toast.success("Advanced Plan Created Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* ── Basic Info ── */}
      <FormSection title="Basic Info" icon="📋">
        <Field label="Title">
          <Input name="title" value={form.title} placeholder="e.g. Pro Monthly Plan" onChange={handleChange} />
        </Field>
        <Field label="Description">
          <Textarea name="description" value={form.description} placeholder="What's included in this plan..." onChange={handleChange} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)">
            <Input name="price" value={form.price} placeholder="499" type="number" onChange={handleChange} prefix="₹" />
          </Field>
          <Field label="Duration (months)">
            <Input name="durationInMonths" value={form.durationInMonths} placeholder="1" type="number" onChange={handleChange} prefix="mo" />
          </Field>
        </div>
      </FormSection>

      {/* ── Features ── */}
      <FormSection title="Features" icon="✨">
        <div className="space-y-2">
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <input
                value={f}
                onChange={(e) => handleFeatureChange(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="flex-1 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {form.features.length > 1 && (
                <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <AddBtn onClick={addFeature} label="Add Feature" />
      </FormSection>

      {/* ── FAQs ── */}
      <FormSection title="FAQs" icon="❓">
        <div className="space-y-3">
          {form.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQ {i + 1}</span>
                {form.faqs.length > 1 && (
                  <button onClick={() => removeFAQ(i)} className="text-red-400 hover:text-red-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleFAQChange(i, "question", e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                rows={2}
                onChange={(e) => handleFAQChange(i, "answer", e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              />
            </div>
          ))}
        </div>
        <AddBtn onClick={addFAQ} label="Add FAQ" />
      </FormSection>

      {/* ── Process Steps ── */}
      <FormSection title="How It Works" icon="⚙️">
        <div className="space-y-3">
          {form.processSteps.map((step, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {i + 1}</span>
                </div>
                {form.processSteps.length > 1 && (
                  <button onClick={() => removeProcess(i)} className="text-red-400 hover:text-red-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                placeholder="Step Title"
                value={step.title}
                onChange={(e) => handleProcessChange(i, "title", e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              <textarea
                placeholder="Step Description"
                value={step.description}
                rows={2}
                onChange={(e) => handleProcessChange(i, "description", e.target.value)}
                className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              />
            </div>
          ))}
        </div>
        <AddBtn onClick={addProcess} label="Add Step" />
      </FormSection>

      {/* ── Images ── */}
      <FormSection title="Images" icon="🖼️">
        <Field label="Banner Image URL">
          <Input name="bannerImage" value={form.bannerImage} placeholder="https://..." onChange={handleChange} />
        </Field>
        <Field label="OG Image URL">
          <Input name="ogImage" value={form.ogImage} placeholder="https://..." onChange={handleChange} />
        </Field>
      </FormSection>

      {/* ── SEO ── */}
      <FormSection title="SEO" icon="🔍">
        <Field label="Meta Title">
          <Input name="metaTitle" value={form.metaTitle} placeholder="SEO title for this plan" onChange={handleChange} />
        </Field>
        <Field label="Meta Description">
          <Textarea name="metaDescription" value={form.metaDescription} placeholder="Short SEO description..." onChange={handleChange} />
        </Field>
      </FormSection>

      {/* ── Submit ── */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition-colors duration-150"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Creating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Advanced Plan
          </>
        )}
      </button>
    </div>
  );
}

/* ── Sub-components ── */

function FormSection({ title, icon, children }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span>{icon}</span>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4 space-y-3 bg-white">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input({ prefix, ...props }) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">{prefix}</span>
      )}
      <input
        {...props}
        className={`w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${prefix ? "pl-8 pr-3" : "px-3"}`}
      />
    </div>
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
    />
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all duration-150"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      {label}
    </button>
  );
}