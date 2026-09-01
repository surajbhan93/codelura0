"use client";

import { useEffect, useState, ChangeEvent } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

interface WorkForm {
  title: string;
  shortDescription: string;
  description: string;
  clientName: string;

  industry: string;
  role: string;
  duration: string;

  category: string;
  techStack: string;

  problem: string;
  solution: string;
  result: string;

  users: string;
  performanceGain: string;
  revenueImpact: string;

  liveUrl: string;
  githubUrl: string;

  thumbnail: string;
  images: string;

  metaTitle: string;
  metaDescription: string;
  keywords: string;

  isFeatured: boolean;
  isPublished: boolean;
}

export default function EditWork() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [realWorkId, setRealWorkId] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);
  const [previewMode, setPreviewMode] = useState<"iframe" | "snapshot">("iframe");

  const [form, setForm] = useState<WorkForm>({
    title: "",
    shortDescription: "",
    description: "",
    clientName: "",

    industry: "",
    role: "",
    duration: "",

    category: "project",
    techStack: "",

    problem: "",
    solution: "",
    result: "",

    users: "",
    performanceGain: "",
    revenueImpact: "",

    liveUrl: "",
    githubUrl: "",

    thumbnail: "",
    images: "",

    metaTitle: "",
    metaDescription: "",
    keywords: "",

    isFeatured: false,
    isPublished: true,
  });

  /* 🔄 FETCH EXISTING WORK WITH FALLBACK FINDER */
  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        let w: any = null;

        // Attempt 1: Fetch by route parameter (slug or _id)
        try {
          const res = await api.get(`/work/${id}`);
          w = res.data?.data || res.data?.work || res.data;
        } catch (e1) {
          // Attempt 2: Fallback to listing all works & finding matching item by _id or slug
          try {
            const resList = await api.get("/work");
            const list = resList.data?.data || resList.data?.works || resList.data;
            if (Array.isArray(list)) {
              w = list.find((item: any) => item._id === id || item.slug === id || item.id === id);
            }
          } catch (e2) {
            console.error("Failed fallback work fetch", e2);
          }
        }

        if (!isMounted) return;

        if (w && (w.title || w._id)) {
          setRealWorkId(w._id || w.id || id);
          setForm({
            title: w.title || "",
            shortDescription: w.shortDescription || "",
            description: w.description || "",
            clientName: w.clientName || "",

            industry: w.industry || "",
            role: w.role || "",
            duration: w.duration || "",

            category: w.category || "project",
            techStack: Array.isArray(w.techStack) ? w.techStack.join(", ") : (w.techStack || ""),

            problem: w.caseStudy?.problem || "",
            solution: w.caseStudy?.solution || "",
            result: w.caseStudy?.result || "",

            users: w.metrics?.users || "",
            performanceGain: w.metrics?.performanceGain || "",
            revenueImpact: w.metrics?.revenueImpact || "",

            liveUrl: w.liveUrl || "",
            githubUrl: w.githubUrl || "",

            thumbnail: w.thumbnail || "",
            images: Array.isArray(w.images) ? w.images.join(", ") : (w.images || ""),

            metaTitle: w.seo?.metaTitle || "",
            metaDescription: w.seo?.metaDescription || "",
            keywords: Array.isArray(w.seo?.keywords) ? w.seo.keywords.join(", ") : (w.seo?.keywords || ""),

            isFeatured: Boolean(w.isFeatured),
            isPublished: w.isPublished ?? true,
          });
          setFetching(false);
        } else {
          toast.error("Work item not found");
          setFetching(false);
        }
      } catch (err) {
        if (isMounted) {
          toast.error("Error loading work details");
          setFetching(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    const checked =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* 🔄 UPDATE WORK */
  const submit = async () => {
    if (!form.title || !form.description) {
      toast.error("Title & Description required");
      return;
    }

    const targetId = realWorkId || id;

    try {
      setLoading(true);

      await api.put(`/work/${targetId}`, {
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        clientName: form.clientName,

        industry: form.industry,
        role: form.role,
        duration: form.duration,

        category: form.category,
        techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),

        caseStudy: {
          problem: form.problem,
          solution: form.solution,
          result: form.result,
        },

        metrics: {
          users: form.users,
          performanceGain: form.performanceGain,
          revenueImpact: form.revenueImpact,
        },

        liveUrl: form.liveUrl,
        githubUrl: form.githubUrl,

        thumbnail: form.thumbnail,
        images: form.images.split(",").map((i) => i.trim()).filter(Boolean),

        seo: {
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        },

        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      });

      toast.success("Work updated successfully");
      router.push("/admin/work");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Update failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">
        Loading work data...
      </div>
    );
  }

  const cleanUrl = form.liveUrl ? (form.liveUrl.startsWith("http") ? form.liveUrl : `https://${form.liveUrl}`) : "";
  const snapshotUrl = cleanUrl ? `https://image.thum.io/get/width/1200/crop/800/${cleanUrl}` : form.thumbnail;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="w-full max-w-6xl mx-auto bg-white text-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Work</h1>
            <p className="text-sm text-gray-500 mt-1">Update work details and live preview</p>
          </div>
          <button
            onClick={() => router.push("/admin/work")}
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 border px-3 py-1.5 rounded-lg"
          >
            ← Back to Work List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: FORM FIELDS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* BASIC INFO */}
            <section className="space-y-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Basic Information</h3>
              <input name="title" value={form.title} placeholder="Work title *" className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none" onChange={handleChange} />
              <input name="clientName" value={form.clientName} placeholder="Client name" className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none" onChange={handleChange} />
              <input name="shortDescription" value={form.shortDescription} placeholder="Short summary description" className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none" onChange={handleChange} />
              <textarea name="description" value={form.description} placeholder="Full detailed description *" className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none h-28" onChange={handleChange} />
            </section>

            {/* META */}
            <section className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Category & Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <select name="category" value={form.category} className="p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none" onChange={handleChange}>
                  <option value="project">Project</option>
                  <option value="client">Client</option>
                  <option value="startup">Startup</option>
                </select>

                <input name="techStack" value={form.techStack} placeholder="Tech stack (React, Node)" className="p-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-black outline-none" onChange={handleChange} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input name="industry" value={form.industry} placeholder="Industry (EdTech)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
                <input name="role" value={form.role} placeholder="Role (Full Stack)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
                <input name="duration" value={form.duration} placeholder="Duration (3 months)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
              </div>

              {/* URL INPUTS */}
              <div className="space-y-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider">Live Preview URL</label>
                <input
                  name="liveUrl"
                  value={form.liveUrl}
                  placeholder="https://yourwebsite.com/blog/my-post"
                  className="w-full p-3 rounded-lg border border-indigo-200 text-sm font-mono focus:ring-2 focus:ring-indigo-600 outline-none bg-white"
                  onChange={handleChange}
                />
                <p className="text-[11px] text-indigo-700">Paste any URL to see a real-time live preview in the window on the right.</p>

                <input name="githubUrl" value={form.githubUrl} placeholder="GitHub Source URL" className="w-full p-3 rounded-lg border border-gray-300 text-sm font-mono outline-none bg-white" onChange={handleChange} />
              </div>
            </section>

            {/* CASE STUDY */}
            <section className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Case Study</h3>
              <textarea name="problem" value={form.problem} placeholder="Problem – What issue did client face?" className="w-full p-3 rounded-lg border border-gray-300 text-sm h-20 outline-none" onChange={handleChange} />
              <textarea name="solution" value={form.solution} placeholder="Solution – How did you solve it?" className="w-full p-3 rounded-lg border border-gray-300 text-sm h-20 outline-none" onChange={handleChange} />
              <textarea name="result" value={form.result} placeholder="Result – What was the outcome?" className="w-full p-3 rounded-lg border border-gray-300 text-sm h-20 outline-none" onChange={handleChange} />
            </section>

            {/* METRICS */}
            <section className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Impact & Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <input name="users" value={form.users} placeholder="Users (e.g. 50K+)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
                <input name="performanceGain" value={form.performanceGain} placeholder="Performance (e.g. 3x)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
                <input name="revenueImpact" value={form.revenueImpact} placeholder="Revenue (e.g. +25%)" className="p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
              </div>
            </section>

            {/* IMAGES */}
            <section className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Images</h3>
              <input name="thumbnail" value={form.thumbnail} placeholder="Thumbnail Image URL" className="w-full p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
              <input name="images" value={form.images} placeholder="Gallery Images (comma separated URLs)" className="w-full p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
            </section>

            {/* SEO */}
            <section className="space-y-3 pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">SEO Settings</h3>
              <input name="metaTitle" value={form.metaTitle} placeholder="Meta Title" className="w-full p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
              <input name="metaDescription" value={form.metaDescription} placeholder="Meta Description" className="w-full p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
              <input name="keywords" value={form.keywords} placeholder="Keywords (comma separated)" className="w-full p-3 rounded-lg border border-gray-300 text-sm outline-none" onChange={handleChange} />
            </section>

            {/* FLAGS */}
            <div className="flex gap-8 pt-4 border-t">
              <label className="flex items-center gap-2 font-medium text-sm cursor-pointer">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 text-black rounded" />
                Featured Project
              </label>

              <label className="flex items-center gap-2 font-medium text-sm cursor-pointer">
                <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 text-black rounded" />
                Published (Public)
              </label>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-6">
              <button
                onClick={submit}
                disabled={loading}
                className="w-full py-3.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Saving Changes..." : "Update Work"}
              </button>
            </div>

          </div>

          {/* RIGHT: LIVE PREVIEW BROWSER (5 COLS - STICKY) */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Live Preview Box
                </span>
                <div className="flex items-center gap-1 bg-gray-200 p-0.5 rounded-md text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPreviewMode("iframe")}
                    className={`px-2 py-0.5 rounded ${previewMode === "iframe" ? "bg-black text-white" : "text-gray-600"}`}
                  >
                    Iframe
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("snapshot")}
                    className={`px-2 py-0.5 rounded ${previewMode === "snapshot" ? "bg-black text-white" : "text-gray-600"}`}
                  >
                    Snapshot
                  </button>
                </div>
              </div>

              {/* BROWSER MOCKUP CONTAINER */}
              <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#0d0d1a] shadow-2xl">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#18182c] border-b border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                  <div className="flex-1 max-w-xs mx-2 px-3 py-1 bg-black/60 rounded-md text-[11px] font-mono text-gray-300 truncate text-center border border-gray-700">
                    {cleanUrl || "Paste Live URL to preview"}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                    Live
                  </span>
                </div>

                {/* Viewport Frame */}
                <div className="relative h-[480px] bg-black flex items-center justify-center overflow-hidden">
                  {cleanUrl ? (
                    previewMode === "iframe" ? (
                      <iframe
                        key={previewKey}
                        src={cleanUrl}
                        title="Admin Live Preview"
                        className="w-full h-full border-none"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />
                    ) : (
                      <img
                        key={previewKey}
                        src={snapshotUrl}
                        alt="Live Screenshot View"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (form.thumbnail && e.currentTarget.src !== form.thumbnail) {
                            e.currentTarget.src = form.thumbnail;
                          }
                        }}
                      />
                    )
                  ) : form.thumbnail ? (
                    <img src={form.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 text-gray-500 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto text-gray-400 font-bold text-xl">
                        🌐
                      </div>
                      <p className="text-xs font-semibold text-gray-300">Live Preview Output</p>
                      <p className="text-[11px] text-gray-500 max-w-xs">
                        Paste your live URL in the form (e.g. https://yourwebsite.com/blog/my-post) to render interactive preview right here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="px-4 py-2 bg-[#121222] border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-400 font-mono">
                  <span>{previewMode === "iframe" ? "Mode: Interactive Iframe" : "Mode: Live Snapshot Capture"}</span>
                  {cleanUrl && (
                    <a href={cleanUrl} target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline">
                      Open Site ↗
                    </a>
                  )}
                </div>
              </div>

              {/* Helper alert box */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-center justify-between">
                <span>Site blocking iframe? Click <b>Snapshot</b> button above to view live capture.</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
