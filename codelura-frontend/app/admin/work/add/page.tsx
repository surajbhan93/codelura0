"use client";

import { useState, ChangeEvent } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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

export default function AddWork() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const submit = async () => {
    if (!form.title || !form.description) {
      toast.error("Title & Description required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/work", {
        title: form.title,
        shortDescription: form.shortDescription,
        description: form.description,
        clientName: form.clientName,

        industry: form.industry,
        role: form.role,
        duration: form.duration,

        category: form.category,
        techStack: form.techStack.split(",").map((t) => t.trim()),

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
        images: form.images.split(",").map((i) => i.trim()),

        seo: {
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          keywords: form.keywords.split(",").map((k) => k.trim()),
        },

        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      });

      toast.success("Work created successfully");
      router.push("/admin/work");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-16 px-4">
      <div className="w-full max-w-5xl bg-white text-black rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Add Work</h1>

        {/* BASIC INFO */}
        <section className="grid md:grid-cols-2 gap-4">
          <input name="title" placeholder="Work title" className="input" onChange={handleChange} />
          <input name="clientName" placeholder="Client name" className="input" onChange={handleChange} />
          <input name="shortDescription" placeholder="Short description" className="input md:col-span-2" onChange={handleChange} />
          <textarea name="description" placeholder="Full description" className="input h-28 md:col-span-2" onChange={handleChange} />
        </section>

        {/* META */}
        <section className="grid md:grid-cols-2 gap-4 mt-6">
          <select name="category" className="input" onChange={handleChange}>
            <option value="project">Project</option>
            <option value="client">Client</option>
            <option value="startup">Startup</option>
          </select>

          <input name="techStack" placeholder="Tech stack (React, Node, Mongo)" className="input" onChange={handleChange} />
          {/* PROJECT META */}
<section className="grid md:grid-cols-3 gap-4 mt-6">
  <input
    name="industry"
    placeholder="Industry (EdTech, FinTech, SaaS)"
    className="input"
    onChange={handleChange}
  />

  <input
    name="role"
    placeholder="Your role (Full Stack, Backend)"
    className="input"
    onChange={handleChange}
  />

  <input
    name="duration"
    placeholder="Duration (e.g. 3 months)"
    className="input"
    onChange={handleChange}
  />
</section>

          <input name="liveUrl" placeholder="Live URL" className="input" onChange={handleChange} />
          <input name="githubUrl" placeholder="GitHub URL" className="input" onChange={handleChange} />
        </section>
{/* CASE STUDY */}
<section className="mt-8">
  <h3 className="font-semibold mb-2">Case Study</h3>

  <textarea
    name="problem"
    placeholder="Problem – What issue did the client face?"
    className="input h-24"
    onChange={handleChange}
  />

  <textarea
    name="solution"
    placeholder="Solution – How did you solve it?"
    className="input h-24 mt-3"
    onChange={handleChange}
  />

  <textarea
    name="result"
    placeholder="Result – What was the outcome?"
    className="input h-24 mt-3"
    onChange={handleChange}
  />
</section>

{/* METRICS */}
<section className="mt-8">
  <h3 className="font-semibold mb-2">Impact / Metrics</h3>

  <div className="grid md:grid-cols-3 gap-4">
    <input
      name="users"
      placeholder="Users impacted (e.g. 50K+)"
      className="input"
      onChange={handleChange}
    />

    <input
      name="performanceGain"
      placeholder="Performance gain (e.g. 3x faster)"
      className="input"
      onChange={handleChange}
    />

    <input
      name="revenueImpact"
      placeholder="Revenue impact (e.g. +25%)"
      className="input"
      onChange={handleChange}
    />
  </div>
</section>

        {/* IMAGES */}
        <section className="mt-6">
          <h3 className="font-semibold mb-2">Images</h3>

          <input
            name="thumbnail"
            placeholder="Thumbnail Image URL"
            className="input mb-3"
            onChange={handleChange}
          />

          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="Thumbnail preview"
              className="w-40 h-28 object-cover rounded-lg border mb-4"
            />
          )}

          <input
            name="images"
            placeholder="Gallery Images (comma separated URLs)"
            className="input"
            onChange={handleChange}
          />

          {form.images && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {form.images.split(",").map((img, i) => (
                <img
                  key={i}
                  src={img.trim()}
                  className="w-24 h-20 object-cover rounded border"
                  alt="preview"
                />
              ))}
            </div>
          )}
        </section>

        {/* SEO */}
        <section className="mt-6">
          <h3 className="font-semibold mb-2">SEO</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input name="metaTitle" placeholder="Meta title" className="input" onChange={handleChange} />
            <input name="metaDescription" placeholder="Meta description" className="input" onChange={handleChange} />
            <input name="keywords" placeholder="Keywords (comma separated)" className="input md:col-span-2" onChange={handleChange} />
          </div>
        </section>

        {/* FLAGS */}
        <div className="flex gap-8 mt-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isFeatured" onChange={handleChange} />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="isPublished" defaultChecked onChange={handleChange} />
            Published
          </label>
        </div>

        {/* ACTION */}
        <button
          onClick={submit}
          disabled={loading}
          className="mt-8 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Work"}
        </button>
      </div>
    </div>
  );
}
