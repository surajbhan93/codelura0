"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AddServicePage() {
  const router = useRouter();
 const [form, setForm] = useState({
  title: "",
  shortDescription: "",
  description: "",
  category: "website",
  icon: "",
  image: "",
  startingPrice: "",

  features: [""],
  process: [""],

  // ✅ ADD THESE
  techStack: [""],
  idealFor: [""],

  pricing: [
    {
      name: "",
      price: "",
      features: [""],
    },
  ],

  faqs: [
    {
      question: "",
      answer: "",
    },
  ],

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
  },

  isFeatured: false,
  isActive: true,
});


  const submit = async (e) => {
    e.preventDefault();
    await api.post("/admin/services", form);
    router.push("/admin/services");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          ➕ Add New Service
        </h1>
      
        <form onSubmit={submit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title
            </label>
            <input
              type="text"
              placeholder="e.g. Website Development"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description (Card view)
            </label>
            <input
              type="text"
              placeholder="Short one-line description"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              required
            />
          </div>

          {/* FULL DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Description (Detail page)
            </label>
            <textarea
              rows={4}
              placeholder="Explain the service in detail"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="website">Website</option>
              <option value="app">App</option>
              <option value="design">Design</option>
              <option value="software">Software</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ICON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Emoji)
            </label>
            <input
              type="text"
              placeholder="🌐  📱  🎨"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.icon}
              onChange={(e) =>
                setForm({ ...form, icon: e.target.value })
              }
            />
          </div>
          {/* IMAGE URL */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Service Image (Cloudinary URL)
  </label>
  <input
    type="text"
    placeholder="https://res.cloudinary.com/..."
    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-black"
    value={form.image}
    onChange={(e) =>
      setForm({ ...form, image: e.target.value })
    }
  />

  {/* PREVIEW */}
  {form.image && (
    <img
      src={form.image}
      alt="Preview"
      className="mt-3 h-32 rounded border object-cover"
    />
  )}
</div>


          {/* PRICE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Starting Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 9999"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.startingPrice}
              onChange={(e) =>
                setForm({ ...form, startingPrice: e.target.value })
              }
            />
          </div>

          {/* PRICING PLANS */}
<div>
  <label className="block font-medium mb-2">
    Pricing Plans
  </label>

  {form.pricing.map((plan, i) => (
    <div key={i} className="border p-4 rounded mb-4 space-y-2">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Plan name (Basic / Pro)"
        value={plan.name}
        onChange={(e) => {
          const updated = [...form.pricing];
          updated[i].name = e.target.value;
          setForm({ ...form, pricing: updated });
        }}
      />

      <input
        type="number"
        className="w-full border px-3 py-2 rounded"
        placeholder="Price"
        value={plan.price}
        onChange={(e) => {
          const updated = [...form.pricing];
          updated[i].price = e.target.value;
          setForm({ ...form, pricing: updated });
        }}
      />
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({
        ...form,
        pricing: [
          ...form.pricing,
          { name: "", price: "", features: [""] },
        ],
      })
    }
    className="text-sm text-blue-600"
  >
    + Add Pricing Plan
  </button>
</div>

{/* FAQ */}
<div>
  <label className="block font-medium mb-2">
    FAQs
  </label>

  {form.faqs.map((faq, i) => (
    <div key={i} className="border p-4 rounded mb-3 space-y-2">
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Question"
        value={faq.question}
        onChange={(e) => {
          const updated = [...form.faqs];
          updated[i].question = e.target.value;
          setForm({ ...form, faqs: updated });
        }}
      />

      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Answer"
        value={faq.answer}
        onChange={(e) => {
          const updated = [...form.faqs];
          updated[i].answer = e.target.value;
          setForm({ ...form, faqs: updated });
        }}
      />
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({
        ...form,
        faqs: [...form.faqs, { question: "", answer: "" }],
      })
    }
    className="text-sm text-blue-600"
  >
    + Add FAQ
  </button>
</div>

          {/* FEATURES */}
<div>
  <label className="block font-medium mb-2">
    Features (What you offer)
  </label>

  {form.features.map((item, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        className="flex-1 border px-3 py-2 rounded"
        placeholder={`Feature ${index + 1}`}
        value={item}
        onChange={(e) => {
          const updated = [...form.features];
          updated[index] = e.target.value;
          setForm({ ...form, features: updated });
        }}
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.features.filter((_, i) => i !== index);
          setForm({ ...form, features: updated });
        }}
        className="px-3 bg-red-500 text-white rounded"
      >
        ✕
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({ ...form, features: [...form.features, ""] })
    }
    className="text-sm text-blue-600 mt-1"
  >
    + Add Feature
  </button>
</div>

{/* PROCESS */}
<div>
  <label className="block font-medium mb-2">
    Process (How you work)
  </label>

  {form.process.map((step, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        className="flex-1 border px-3 py-2 rounded"
        placeholder={`Step ${index + 1}`}
        value={step}
        onChange={(e) => {
          const updated = [...form.process];
          updated[index] = e.target.value;
          setForm({ ...form, process: updated });
        }}
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.process.filter((_, i) => i !== index);
          setForm({ ...form, process: updated });
        }}
        className="px-3 bg-red-500 text-white rounded"
      >
        ✕
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({ ...form, process: [...form.process, ""] })
    }
    className="text-sm text-blue-600 mt-1"
  >
    + Add Step
  </button>
</div>

{/* TECH STACK */}
<div>
  <label className="block font-medium mb-2">
    Tech Stack Used
  </label>

  {form.techStack.map((tech, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        className="flex-1 border px-3 py-2 rounded"
        placeholder="e.g. Next.js"
        value={tech}
        onChange={(e) => {
          const updated = [...form.techStack];
          updated[index] = e.target.value;
          setForm({ ...form, techStack: updated });
        }}
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.techStack.filter((_, i) => i !== index);
          setForm({ ...form, techStack: updated });
        }}
        className="px-3 bg-red-500 text-white rounded"
      >
        ✕
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({ ...form, techStack: [...form.techStack, ""] })
    }
    className="text-sm text-blue-600"
  >
    + Add Tech
  </button>
</div>
{/* IDEAL FOR */}
<div>
  <label className="block font-medium mb-2">
    Ideal For (Target Audience)
  </label>

  {form.idealFor.map((item, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <input
        className="flex-1 border px-3 py-2 rounded"
        placeholder="e.g. Startups"
        value={item}
        onChange={(e) => {
          const updated = [...form.idealFor];
          updated[index] = e.target.value;
          setForm({ ...form, idealFor: updated });
        }}
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.idealFor.filter((_, i) => i !== index);
          setForm({ ...form, idealFor: updated });
        }}
        className="px-3 bg-red-500 text-white rounded"
      >
        ✕
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={() =>
      setForm({ ...form, idealFor: [...form.idealFor, ""] })
    }
    className="text-sm text-blue-600"
  >
    + Add Audience
  </button>
</div>


 <div className="flex gap-6">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={form.isFeatured}
      onChange={(e) =>
        setForm({ ...form, isFeatured: e.target.checked })
      }
    />
    Featured Service
  </label>

  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={form.isActive}
      onChange={(e) =>
        setForm({ ...form, isActive: e.target.checked })
      }
    />
    Active
  </label>
</div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create Service
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
          {/* SEO */}
<div>
  <h3 className="font-semibold text-lg mb-2">
    SEO Settings
  </h3>

  <input
    className="w-full border px-3 py-2 rounded mb-2"
    placeholder="Meta Title"
    value={form.seo.metaTitle}
    onChange={(e) =>
      setForm({
        ...form,
        seo: { ...form.seo, metaTitle: e.target.value },
      })
    }
  />

  <textarea
    className="w-full border px-3 py-2 rounded mb-2"
    placeholder="Meta Description"
    value={form.seo.metaDescription}
    onChange={(e) =>
      setForm({
        ...form,
        seo: { ...form.seo, metaDescription: e.target.value },
      })
    }
  />

  <input
    className="w-full border px-3 py-2 rounded"
    placeholder="Keywords (comma separated)"
    value={form.seo.keywords}
    onChange={(e) =>
      setForm({
        ...form,
        seo: {
          ...form.seo,
          keywords: e.target.value.split(","),
        },
      })
    }
  />
</div>

        </form>

      </div>
    </div>
  );
}
