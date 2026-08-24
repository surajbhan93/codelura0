"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

// ============================================================
//  TYPES
// ============================================================
interface PlanFormData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  serviceType: string;
  price: string;
  discountedPrice: string;
  plans: PlanItem[];
  durationInMonths: string;
  requiredFields: RequiredField[];
  features: string[];
  deliverables: Deliverable[];
  turnaroundTime: { value: number; unit: string };
  revision: { count: number; validityDays: number };
  reviewMode: string;
  meeting: { required: boolean; provider: string; duration: number };
  attachments: { maxFiles: number; maxSizeMB: number; allowedTypes: string[] };
  badge: string;
  level: string;
  bannerImage: string;
  galleryImages: string[];
  faqs: FAQ[];
  processSteps: ProcessStep[];
  relatedServices: string[];
  primaryCTA: string;
  secondaryCTA: string;
  allowCoupons: boolean;
  seo: SEOData;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: string;
}

interface PlanItem {
  name: string;
  price: string;
  discountedPrice: string;
  deliveryTime: { value: string; unit: string };
  features: string[];
  isRecommended: boolean;
}

interface RequiredField {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  options: string[];
  required: boolean;
  validation: { min: string; max: string; regex: string };
}

interface Deliverable {
  title: string;
  description: string;
  icon: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
}

interface PlanFormProps {
  initialData?: any;
  onSubmit?: (data: any) => Promise<void>;
  submitLabel?: string;
  planId?: string | null;
}

// ============================================================
//  PLAN FORM
// ============================================================
export default function PlanForm({ 
  initialData = null, 
  onSubmit, 
  submitLabel = "Create Plan", 
  planId = null 
}: PlanFormProps) {
  const [form, setForm] = useState<PlanFormData>({
    title: "",
    shortDescription: "",
    description: "",
    category: "other",
    serviceType: "digital",
    price: "",
    discountedPrice: "",
    plans: [{ name: "", price: "", discountedPrice: "", deliveryTime: { value: "", unit: "hours" }, features: [""], isRecommended: false }],
    durationInMonths: "",
    requiredFields: [{ key: "", label: "", type: "text", placeholder: "", options: [], required: false, validation: { min: "", max: "", regex: "" } }],
    features: [""],
    deliverables: [{ title: "", description: "", icon: "" }],
    turnaroundTime: { value: 24, unit: "hours" },
    revision: { count: 0, validityDays: 0 },
    reviewMode: "Human",
    meeting: { required: false, provider: "Google Meet", duration: 30 },
    attachments: { maxFiles: 5, maxSizeMB: 10, allowedTypes: ["pdf", "doc", "docx"] },
    badge: "",
    level: "",
    bannerImage: "",
    galleryImages: [""],
    faqs: [{ question: "", answer: "" }],
    processSteps: [{ title: "", description: "" }],
    relatedServices: [],
    primaryCTA: "Buy Now",
    secondaryCTA: "Talk to Expert",
    allowCoupons: true,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      canonicalUrl: "",
      ogImage: "",
    },
    isFeatured: false,
    isActive: true,
    sortOrder: "0",
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"" | "saving" | "saved" | "error">("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isEditMode = !!planId;
  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================
  //  POPULATE FORM WITH INITIAL DATA (for edit mode)
  // ============================================================
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        price: initialData.price?.toString() || "",
        discountedPrice: initialData.discountedPrice?.toString() || "",
        durationInMonths: initialData.durationInMonths?.toString() || "",
        sortOrder: initialData.sortOrder?.toString() || "0",
        features: initialData.features?.length ? initialData.features : [""],
        galleryImages: initialData.galleryImages?.length ? initialData.galleryImages : [""],
        faqs: initialData.faqs?.length ? initialData.faqs : [{ question: "", answer: "" }],
        processSteps: initialData.processSteps?.length ? initialData.processSteps : [{ title: "", description: "" }],
        deliverables: initialData.deliverables?.length ? initialData.deliverables : [{ title: "", description: "", icon: "" }],
        plans: initialData.plans?.length ? initialData.plans : [{ name: "", price: "", discountedPrice: "", deliveryTime: { value: "", unit: "hours" }, features: [""], isRecommended: false }],
        requiredFields: initialData.requiredFields?.length ? initialData.requiredFields : [{ key: "", label: "", type: "text", placeholder: "", options: [], required: false, validation: { min: "", max: "", regex: "" } }],
        seo: {
          metaTitle: initialData.seo?.metaTitle || "",
          metaDescription: initialData.seo?.metaDescription || "",
          keywords: initialData.seo?.keywords || [],
          canonicalUrl: initialData.seo?.canonicalUrl || "",
          ogImage: initialData.seo?.ogImage || "",
        },
        turnaroundTime: initialData.turnaroundTime || { value: 24, unit: "hours" },
        revision: {
          count: initialData.revision?.count ?? 0,
          validityDays: initialData.revision?.validityDays ?? 0,
        },
        meeting: initialData.meeting || { required: false, provider: "Google Meet", duration: 30 },
        attachments: initialData.attachments || { maxFiles: 5, maxSizeMB: 10, allowedTypes: ["pdf", "doc", "docx"] },
      });
      isInitialLoad.current = false;
    }
  }, [initialData]);

  // ============================================================
  //  PREPARE PAYLOAD
  // ============================================================
  const preparePayload = useCallback(() => {
    const payload = {
      title: form.title || "",
      shortDescription: form.shortDescription || "",
      description: form.description || "",
      category: form.category || "other",
      serviceType: form.serviceType || "digital",
      price: Number(form.price) || 0,
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
      durationInMonths: form.durationInMonths ? Number(form.durationInMonths) : null,
      sortOrder: Number(form.sortOrder) || 0,
      plans: form.plans
        .filter(
          (p) =>
            p.name?.trim() &&
            p.price !== "" &&
            Number(p.price) > 0
        )
        .map((p) => ({
          name: p.name.trim(),
          price: Number(p.price),
          discountedPrice: p.discountedPrice
            ? Number(p.discountedPrice)
            : null,
          deliveryTime: {
            value: Number(p.deliveryTime?.value) || 0,
            unit: p.deliveryTime?.unit || "hours",
          },
          features: p.features?.filter((f) => f.trim()) || [],
          isRecommended: p.isRecommended || false,
        })),
      requiredFields: form.requiredFields
        .filter(
          (f) =>
            f.key?.trim() &&
            f.label?.trim()
        )
        .map((f) => ({
          key: f.key.trim(),
          label: f.label.trim(),
          type: f.type || "text",
          placeholder: f.placeholder || "",
          options: f.options?.filter((o) => o.trim()) || [],
          required: f.required || false,
          validation: {
            min: f.validation?.min
              ? Number(f.validation.min)
              : null,
            max: f.validation?.max
              ? Number(f.validation.max)
              : null,
            regex: f.validation?.regex || "",
          },
        })),
      galleryImages: form.galleryImages.filter((url) => url.trim()),
      features: form.features.filter((f) => f.trim()),
      deliverables: form.deliverables.map((d) => ({
        title: d.title || "",
        description: d.description || "",
        icon: d.icon || "",
      })),
      seo: {
        metaTitle: form.seo?.metaTitle || "",
        metaDescription: form.seo?.metaDescription || "",
        keywords: form.seo?.keywords?.filter((k) => k.trim()) || [],
        canonicalUrl: form.seo?.canonicalUrl || "",
        ogImage: form.seo?.ogImage || "",
      },
      relatedServices: form.relatedServices || [],
      turnaroundTime: {
        value: Number(form.turnaroundTime?.value) || 24,
        unit: form.turnaroundTime?.unit || "hours",
      },
      revision: {
        count: Number(form.revision?.count) || 0,
        validityDays: Number(form.revision?.validityDays) || 0,
      },
      meeting: {
        required: form.meeting?.required || false,
        provider: form.meeting?.provider || "Google Meet",
        duration: Number(form.meeting?.duration) || 30,
      },
      attachments: {
        maxFiles: Number(form.attachments?.maxFiles) || 5,
        maxSizeMB: Number(form.attachments?.maxSizeMB) || 10,
        allowedTypes: form.attachments?.allowedTypes || [],
      },
      badge: form.badge || "",
      level: form.level || "",
      bannerImage: form.bannerImage || "",
      faqs: form.faqs.map((f) => ({
        question: f.question || "",
        answer: f.answer || "",
      })),
      processSteps: form.processSteps.map((p) => ({
        title: p.title || "",
        description: p.description || "",
      })),
      primaryCTA: form.primaryCTA || "Buy Now",
      secondaryCTA: form.secondaryCTA || "Talk to Expert",
      allowCoupons: form.allowCoupons !== undefined ? form.allowCoupons : true,
      isFeatured: form.isFeatured || false,
      isActive: form.isActive !== undefined ? form.isActive : true,
    };

    return payload;
  }, [form]);

  // ============================================================
  //  AUTO-SAVE FUNCTION
  // ============================================================
  const autoSave = useCallback(async () => {
    if (!isEditMode || !planId) return;
    if (isInitialLoad.current) return;

    try {
      setSaveStatus("saving");
      setSaveError(null);
      
      const payload = preparePayload();
      
      await api.put(`/premium/admin/plan/${planId}`, payload);
      
      setSaveStatus("saved");
      setLastSaved(new Date());
      setSaveError(null);
    } catch (err: any) {
      console.error("Auto-save error:", err);
      setSaveStatus("error");
      setSaveError(err.response?.data?.message || err.message || "Auto-save failed");
    }
  }, [preparePayload, planId, isEditMode]);

  // ============================================================
  //  AUTO-SAVE DEBOUNCE
  // ============================================================
  useEffect(() => {
    if (!isEditMode || isInitialLoad.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [form, autoSave, isEditMode]);

  // ============================================================
  //  HANDLERS
  // ============================================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  type NestedObjectKey =
  | "turnaroundTime"
  | "revision"
  | "meeting"
  | "attachments"
  | "seo";

const handleNestedChange = <
  P extends NestedObjectKey,
  K extends keyof PlanFormData[P]
>(
  parent: P,
  key: K,
  value: PlanFormData[P][K]
) => {
  setForm((prev) => ({
    ...prev,
    [parent]: {
      ...prev[parent],
      [key]: value,
    },
  }));
};

  const handleArrayChange = (
    arrayName: keyof PlanFormData,
    index: number,
    key: string,
    value: any
  ) => {
    const updated = [...(form[arrayName] as any[])];
    updated[index] = { ...updated[index], [key]: value };
    setForm({ ...form, [arrayName]: updated });
  };

  const handleArrayItemChange = (
    arrayName: keyof PlanFormData,
    index: number,
    value: any
  ) => {
    const updated = [...(form[arrayName] as any[])];
    updated[index] = value;
    setForm({ ...form, [arrayName]: updated });
  };

  const addArrayItem = (arrayName: keyof PlanFormData, defaultItem: any) => {
    setForm((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as any[]), defaultItem],
    }));
  };

  const removeArrayItem = (arrayName: keyof PlanFormData, index: number) => {
    const array = form[arrayName] as any[];
    if (array.length <= 1) {
      toast.error("At least one item is required");
      return;
    }
    setForm((prev) => ({
      ...prev,
      [arrayName]: array.filter((_, i) => i !== index),
    }));
  };

  // ============================================================
  //  MANUAL SUBMIT
  // ============================================================
  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("Title, Description, and Price are required");
      return;
    }

    if (form.discountedPrice && Number(form.discountedPrice) >= Number(form.price)) {
      toast.error("Discounted price must be less than original price");
      return;
    }

    const payload = preparePayload();

    try {
      setLoading(true);
      
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await api.post("/premium/admin/plan", payload);
        toast.success("Plan created successfully!");
        // Reset form after create
        setForm({
          title: "",
          shortDescription: "",
          description: "",
          category: "other",
          serviceType: "digital",
          price: "",
          discountedPrice: "",
          plans: [{ name: "", price: "", discountedPrice: "", deliveryTime: { value: "", unit: "hours" }, features: [""], isRecommended: false }],
          durationInMonths: "",
          requiredFields: [{ key: "", label: "", type: "text", placeholder: "", options: [], required: false, validation: { min: "", max: "", regex: "" } }],
          features: [""],
          deliverables: [{ title: "", description: "", icon: "" }],
          turnaroundTime: { value: 24, unit: "hours" },
          revision: { count: 0, validityDays: 0 },
          reviewMode: "Human",
          meeting: { required: false, provider: "Google Meet", duration: 30 },
          attachments: { maxFiles: 5, maxSizeMB: 10, allowedTypes: ["pdf", "doc", "docx"] },
          badge: "",
          level: "",
          bannerImage: "",
          galleryImages: [""],
          faqs: [{ question: "", answer: "" }],
          processSteps: [{ title: "", description: "" }],
          relatedServices: [],
          primaryCTA: "Buy Now",
          secondaryCTA: "Talk to Expert",
          allowCoupons: true,
          seo: {
            metaTitle: "",
            metaDescription: "",
            keywords: [],
            canonicalUrl: "",
            ogImage: "",
          },
          isFeatured: false,
          isActive: true,
          sortOrder: "0",
        });
      }
    } catch (err: any) {
      if (!onSubmit) {
        toast.error(err.response?.data?.message || "Error creating plan");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  //  MANUAL SAVE
  // ============================================================
  const handleManualSave = async () => {
    if (!isEditMode) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    await autoSave();
    if (saveStatus === "saved") {
      toast.success("Plan saved successfully!");
    } else if (saveStatus === "error") {
      toast.error(saveError || "Auto-save failed. Please try again.");
    }
  };

  // ============================================================
  //  DISCOUNT CALCULATION
  // ============================================================
  const discountPct =
    form.price && form.discountedPrice && Number(form.discountedPrice) < Number(form.price)
      ? Math.round(((Number(form.price) - Number(form.discountedPrice)) / Number(form.price)) * 100)
      : null;

  // ============================================================
  //  RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {isEditMode && (
        <div className="flex items-center justify-end gap-3 border-b border-gray-200 pb-4">
          {saveStatus === "saving" && (
            <span className="text-sm text-yellow-600 flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Auto-saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="text-sm text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-600 flex items-center gap-2" title={saveError || undefined}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" stroke="currentColor" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
              Auto-save failed
            </span>
          )}
          <button
            onClick={handleManualSave}
            disabled={saveStatus === "saving"}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            Save Now
          </button>
        </div>
      )}

      {/* ========== BASIC INFO ========== */}
      <FormSection title="Basic Info" icon="📋">
        <Field label="Title *">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Pro Monthly Plan" required />
        </Field>
        <Field label="Short Description">
          <Input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief tagline" />
        </Field>
        <Field label="Full Description *">
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed description..." required />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select name="category" value={form.category} onChange={handleChange} options={["resume", "linkedin", "mock-interview", "career-guidance", "mentorship", "referral", "portfolio", "website-review", "other"]} />
          </Field>
          <Field label="Service Type">
            <Select name="serviceType" value={form.serviceType} onChange={handleChange} options={["digital", "document-review", "meeting", "consultation", "subscription"]} />
          </Field>
        </div>
      </FormSection>

      {/* ========== PRICING ========== */}
      <FormSection title="Pricing" icon="💰">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Original Price (₹) *">
            <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="149" required />
          </Field>
          <Field label="Discounted Price (optional)">
            <Input name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleChange} placeholder="119" />
          </Field>
        </div>
        {discountPct && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700">
            🏷️ Save ₹{Number(form.price) - Number(form.discountedPrice)} ({discountPct}% OFF)
          </div>
        )}
        <Field label="Duration (months)">
          <Input name="durationInMonths" type="number" value={form.durationInMonths} onChange={handleChange} placeholder="1" />
        </Field>

        {/* ===== PLANS ===== */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Multi-tier Plans</label>
          {form.plans.map((plan, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-3 mt-2 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Plan #{idx + 1}</span>
                {form.plans.length > 1 && (
                  <button onClick={() => removeArrayItem("plans", idx)} className="text-red-400 hover:text-red-600 text-sm">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Name" value={plan.name} onChange={(e) => handleArrayChange("plans", idx, "name", e.target.value)} />
                <Input placeholder="Price" type="number" value={plan.price} onChange={(e) => handleArrayChange("plans", idx, "price", e.target.value)} />
                <Input placeholder="Discounted Price" type="number" value={plan.discountedPrice} onChange={(e) => handleArrayChange("plans", idx, "discountedPrice", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input placeholder="Delivery Value" type="number" value={plan.deliveryTime.value} onChange={(e) => handleArrayChange("plans", idx, "deliveryTime", { ...plan.deliveryTime, value: e.target.value })} />
                <Select value={plan.deliveryTime.unit} onChange={(e) => handleArrayChange("plans", idx, "deliveryTime", { ...plan.deliveryTime, unit: e.target.value })} options={["hours", "days", "weeks"]} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={plan.isRecommended} onChange={(e) => handleArrayChange("plans", idx, "isRecommended", e.target.checked)} />
                <span className="text-sm">Recommended</span>
              </div>
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("plans", { name: "", price: "", discountedPrice: "", deliveryTime: { value: "", unit: "hours" }, features: [""], isRecommended: false })} label="Add Plan" />
        </div>
      </FormSection>

      {/* ========== FEATURES & DELIVERABLES ========== */}
      <FormSection title="Features & Deliverables" icon="✨">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Features</label>
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <Input value={f} onChange={(e) => handleArrayItemChange("features", i, e.target.value)} placeholder={`Feature ${i + 1}`} />
              {form.features.length > 1 && (
                <button onClick={() => removeArrayItem("features", i)} className="text-red-400 hover:text-red-600">✕</button>
              )}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("features", "")} label="Add Feature" />
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deliverables</label>
          {form.deliverables.map((d, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Deliverable #{i + 1}</span>
                {form.deliverables.length > 1 && (
                  <button onClick={() => removeArrayItem("deliverables", i)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Title" value={d.title} onChange={(e) => handleArrayChange("deliverables", i, "title", e.target.value)} />
                <Input placeholder="Description" value={d.description} onChange={(e) => handleArrayChange("deliverables", i, "description", e.target.value)} />
                <Input placeholder="Icon" value={d.icon} onChange={(e) => handleArrayChange("deliverables", i, "icon", e.target.value)} />
              </div>
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("deliverables", { title: "", description: "", icon: "" })} label="Add Deliverable" />
        </div>
      </FormSection>

      {/* ========== DELIVERY & REVISION ========== */}
      <FormSection title="Delivery & Revision" icon="⏱️">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Turnaround Value">
            <Input
              type="number"
              value={form.turnaroundTime.value}
              onChange={(e) =>
                handleNestedChange(
                  "turnaroundTime",
                  "value",
                  Number(e.target.value)
                )
              }
              placeholder="24"
            />
          </Field>
          <Field label="Turnaround Unit">
            <Select
              value={form.turnaroundTime.unit}
              onChange={(e) =>
                handleNestedChange("turnaroundTime", "unit", e.target.value)
              }
              options={["hours", "days"]}
            />
          </Field>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Field label="Revision Count">
            <Input
              type="number"
              value={form.revision.count}
              onChange={(e) =>
                handleNestedChange(
                  "revision",
                  "count",
                  Number(e.target.value)
                )
              }
              placeholder="0"
              min="0"
              step="1"
            />
          </Field>
          <Field label="Revision Validity (days)">
            <Input
              type="number"
              value={form.revision.validityDays}
              onChange={(e) =>
                handleNestedChange(
                  "revision",
                  "validityDays",
                  Number(e.target.value)
                )
              }
              placeholder="0"
              min="0"
              step="1"
            />
          </Field>
        </div>
        
        <Field label="Review Mode">
          <Select 
            name="reviewMode" 
            value={form.reviewMode} 
            onChange={handleChange} 
            options={["AI", "Human", "AI + Human"]} 
          />
        </Field>
      </FormSection>

      {/* ========== MEETING ========== */}
      <FormSection title="Meeting" icon="📅">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.meeting.required}
            onChange={(e) =>
              handleNestedChange("meeting", "required", e.target.checked)
            }
          />
          <span className="text-sm">Meeting Required</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Provider">
            <Input
              value={form.meeting.provider}
              onChange={(e) =>
                handleNestedChange("meeting", "provider", e.target.value)
              }
            />
          </Field>
          <Field label="Duration (minutes)">
            <Input
              type="number"
              value={form.meeting.duration}
              onChange={(e) =>
                handleNestedChange(
                  "meeting",
                  "duration",
                  Number(e.target.value)
                )
              }
            />
          </Field>
        </div>
      </FormSection>

      {/* ========== ATTACHMENTS ========== */}
      <FormSection title="Attachments" icon="📎">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Max Files">
            <Input type="number" value={form.attachments.maxFiles} onChange={(e) => handleNestedChange("attachments", "maxFiles", Number(e.target.value))} placeholder="5" />
          </Field>
          <Field label="Max Size (MB)">
            <Input type="number" value={form.attachments.maxSizeMB} onChange={(e) => handleNestedChange("attachments", "maxSizeMB", Number(e.target.value))} placeholder="10" />
          </Field>
          <Field label="Allowed Types">
            <Input value={form.attachments.allowedTypes.join(", ")} onChange={(e) => handleNestedChange("attachments", "allowedTypes", e.target.value.split(",").map((s) => s.trim()))} placeholder="pdf, doc, docx" />
          </Field>
        </div>
      </FormSection>

      {/* ========== BADGE & LEVEL ========== */}
      <FormSection title="Badge & Level" icon="🏅">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Badge">
            <Select name="badge" value={form.badge} onChange={handleChange} options={["", "Best Seller", "Popular", "Recommended", "Premium", "New"]} />
          </Field>
          <Field label="Level">
            <Select name="level" value={form.level} onChange={handleChange} options={["", "Beginner", "Intermediate", "Advanced"]} />
          </Field>
        </div>
      </FormSection>

      {/* ========== IMAGES ========== */}
      <FormSection title="Images" icon="🖼️">
        <Field label="Banner Image URL">
          <Input name="bannerImage" value={form.bannerImage} onChange={handleChange} placeholder="https://..." />
        </Field>
        <Field label="OG Image URL">
          <Input value={form.seo.ogImage} onChange={(e) => handleNestedChange("seo", "ogImage", e.target.value)} placeholder="https://..." />
        </Field>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gallery Images</label>
          {form.galleryImages.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={url} onChange={(e) => handleArrayItemChange("galleryImages", i, e.target.value)} placeholder={`Image URL ${i + 1}`} />
              {form.galleryImages.length > 1 && (
                <button onClick={() => removeArrayItem("galleryImages", i)} className="text-red-400 hover:text-red-600">✕</button>
              )}
            </div>
          ))}
          <AddBtn onClick={() => addArrayItem("galleryImages", "")} label="Add Gallery Image" />
        </div>
      </FormSection>

      {/* ========== FAQS ========== */}
      <FormSection title="FAQs" icon="❓">
        {form.faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">FAQ #{i + 1}</span>
              {form.faqs.length > 1 && (
                <button onClick={() => removeArrayItem("faqs", i)} className="text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>
            <Input placeholder="Question" value={faq.question} onChange={(e) => handleArrayChange("faqs", i, "question", e.target.value)} />
            <Textarea placeholder="Answer" value={faq.answer} onChange={(e) => handleArrayChange("faqs", i, "answer", e.target.value)} rows={2} />
          </div>
        ))}
        <AddBtn onClick={() => addArrayItem("faqs", { question: "", answer: "" })} label="Add FAQ" />
      </FormSection>

      {/* ========== PROCESS STEPS ========== */}
      <FormSection title="How It Works" icon="⚙️">
        {form.processSteps.map((step, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Step #{i + 1}</span>
              {form.processSteps.length > 1 && (
                <button onClick={() => removeArrayItem("processSteps", i)} className="text-red-400 hover:text-red-600">Remove</button>
              )}
            </div>
            <Input placeholder="Title" value={step.title} onChange={(e) => handleArrayChange("processSteps", i, "title", e.target.value)} />
            <Textarea placeholder="Description" value={step.description} onChange={(e) => handleArrayChange("processSteps", i, "description", e.target.value)} rows={2} />
          </div>
        ))}
        <AddBtn onClick={() => addArrayItem("processSteps", { title: "", description: "" })} label="Add Step" />
      </FormSection>

      {/* ========== CTA & COUPON ========== */}
      <FormSection title="CTA & Coupon" icon="🎯">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Primary CTA">
            <Input name="primaryCTA" value={form.primaryCTA} onChange={handleChange} placeholder="Buy Now" />
          </Field>
          <Field label="Secondary CTA">
            <Input name="secondaryCTA" value={form.secondaryCTA} onChange={handleChange} placeholder="Talk to Expert" />
          </Field>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.allowCoupons} onChange={(e) => setForm({ ...form, allowCoupons: e.target.checked })} />
          <span className="text-sm">Allow Coupons</span>
        </div>
      </FormSection>

      {/* ========== SEO ========== */}
      <FormSection title="SEO" icon="🔍">
        <Field label="Meta Title">
          <Input value={form.seo.metaTitle} onChange={(e) => handleNestedChange("seo", "metaTitle", e.target.value)} placeholder="SEO Title" />
        </Field>
        <Field label="Meta Description">
          <Textarea value={form.seo.metaDescription} onChange={(e) => handleNestedChange("seo", "metaDescription", e.target.value)} placeholder="SEO Description" rows={2} />
        </Field>
        <Field label="Keywords (comma separated)">
          <Input value={form.seo.keywords.join(", ")} onChange={(e) => handleNestedChange("seo", "keywords", e.target.value.split(",").map((s) => s.trim()))} placeholder="keyword1, keyword2" />
        </Field>
        <Field label="Canonical URL">
          <Input value={form.seo.canonicalUrl} onChange={(e) => handleNestedChange("seo", "canonicalUrl", e.target.value)} placeholder="https://..." />
        </Field>
      </FormSection>

      {/* ========== STATUS ========== */}
      <FormSection title="Status & Order" icon="⚙️">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active
          </label>
        </div>
        <Field label="Sort Order">
          <Input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} placeholder="0" />
        </Field>
      </FormSection>

      {/* ========== SUBMIT ========== */}
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
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </button>
    </div>
  );
}

// ============================================================
//  REUSABLE COMPONENTS
// ============================================================
interface FormSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

function FormSection({ title, icon, children }: FormSectionProps) {
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

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

function Input({ prefix, ...props }: InputProps) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">{prefix}</span>}
      <input
        {...props}
        className={`w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${prefix ? "pl-8 pr-3" : "px-3"}`}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function Textarea(props: TextareaProps) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

function Select({ options, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || "None"}
        </option>
      ))}
    </select>
  );
}

interface AddBtnProps {
  onClick: () => void;
  label: string;
}

function AddBtn({ onClick, label }: AddBtnProps) {
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