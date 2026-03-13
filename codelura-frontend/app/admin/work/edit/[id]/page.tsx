"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function EditWork() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    clientName: "",
    category: "project",
    techStack: "",
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

  /* 🔄 FETCH EXISTING WORK */
  useEffect(() => {
    if (!id) return;

    api.get(`/work/${id}`)
      .then((res) => {
        const w = res.data.data;

        setForm({
          title: w.title || "",
          shortDescription: w.shortDescription || "",
          description: w.description || "",
          clientName: w.clientName || "",
          category: w.category || "project",
          techStack: w.techStack?.join(", ") || "",
          liveUrl: w.liveUrl || "",
          githubUrl: w.githubUrl || "",
          thumbnail: w.thumbnail || "",
          images: w.images?.join(", ") || "",
          metaTitle: w.seo?.metaTitle || "",
          metaDescription: w.seo?.metaDescription || "",
          keywords: w.seo?.keywords?.join(", ") || "",
          isFeatured: w.isFeatured || false,
          isPublished: w.isPublished ?? true,
        });

        setFetching(false);
      })
      .catch(() => {
        toast.error("Failed to load work");
        router.push("/admin/work");
      });
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* 🔄 UPDATE */
  const submit = async () => {
    if (!form.title || !form.description) {
      toast.error("Title & Description required");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/work/${id}`, {
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        clientName: form.clientName,
        category: form.category,
        techStack: form.techStack.split(",").map((t) => t.trim()),
        liveUrl: form.liveUrl,
        githubUrl: form.githubUrl,
        thumbnail: form.thumbnail,
        images: form.images.split(",").map((i) => i.trim()),
        seo: {
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          keywords: form.keywords.split(",").map((k) => k.trim()),
        },
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      });

      toast.success("Work updated successfully");
      router.push("/admin/work");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading work...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center py-16 px-4">
      <div className="w-full max-w-5xl bg-white text-black rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Edit Work</h1>

        {/* BASIC INFO */}
        <section className="grid md:grid-cols-2 gap-4">
          <input name="title" value={form.title} placeholder="Work title" className="input" onChange={handleChange} />
          <input name="clientName" value={form.clientName} placeholder="Client name" className="input" onChange={handleChange} />
          <input name="shortDescription" value={form.shortDescription} placeholder="Short description" className="input md:col-span-2" onChange={handleChange} />
          <textarea name="description" value={form.description} placeholder="Full description" className="input h-28 md:col-span-2" onChange={handleChange} />
        </section>

        {/* META */}
        <section className="grid md:grid-cols-2 gap-4 mt-6">
          <select name="category" value={form.category} className="input" onChange={handleChange}>
            <option value="project">Project</option>
            <option value="client">Client</option>
            <option value="startup">Startup</option>
          </select>

          <input name="techStack" value={form.techStack} placeholder="Tech stack (React, Node)" className="input" onChange={handleChange} />
          <input name="liveUrl" value={form.liveUrl} placeholder="Live URL" className="input" onChange={handleChange} />
          <input name="githubUrl" value={form.githubUrl} placeholder="GitHub URL" className="input" onChange={handleChange} />
        </section>

        {/* IMAGES */}
        <section className="mt-6">
          <h3 className="font-semibold mb-2">Images</h3>

          <input name="thumbnail" value={form.thumbnail} placeholder="Thumbnail URL" className="input mb-3" onChange={handleChange} />
          {form.thumbnail && (
            <img src={form.thumbnail} className="w-40 h-28 object-cover rounded-lg border mb-4" />
          )}

          <input name="images" value={form.images} placeholder="Gallery images (comma separated)" className="input" onChange={handleChange} />
          {form.images && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {form.images.split(",").map((img, i) => (
                <img key={i} src={img.trim()} className="w-24 h-20 object-cover rounded border" />
              ))}
            </div>
          )}
        </section>

        {/* SEO */}
        <section className="mt-6">
          <h3 className="font-semibold mb-2">SEO</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="metaTitle" value={form.metaTitle} placeholder="Meta title" className="input" onChange={handleChange} />
            <input name="metaDescription" value={form.metaDescription} placeholder="Meta description" className="input" onChange={handleChange} />
            <input name="keywords" value={form.keywords} placeholder="Keywords (comma separated)" className="input md:col-span-2" onChange={handleChange} />
          </div>
        </section>

        {/* FLAGS */}
        <div className="flex gap-8 mt-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
            Published
          </label>
        </div>

        {/* ACTION */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-8 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Work"}
        </button>
      </div>
    </div>
  );
}
