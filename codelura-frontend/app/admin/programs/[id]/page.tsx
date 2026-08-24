"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Program, Section, Instructor, Review } from "@/components/admin/program";

const CATEGORIES = ["DSA", "Web Development", "Backend", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const STATUSES = ["published", "draft", "archived"];

const emptyForm: Partial<Program> = {
  name: "",
  subtitle: "",
  slug: "",
  badge: "Codelura PRO",
  shortDescription: "",
  description: "",
  category: "DSA",
  level: "Beginner",
  price: 7000,
  discountPrice: 4100,
  platformLink: "",
  thumbnail: "",
  image: "",
  banner: "",
  icon: "",
  color: "#4F46E5",
  duration: "6 Months",
  totalHours: "293 Hours",
  totalStudentsCount: "3k+ students",
  includedInSubscription: true,
  language: "Hindi",
  certificate: true,
  internship: false,
  placementSupport: true,
  mentorSupport: true,
  featured: false,
  trending: false,
  popular: false,
  recommended: false,
  status: "published",
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:ring-indigo-950";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200";

const cardClass =
  "rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4";

export default function ProgramFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const isNew = !id || id === "new";

  const [form, setForm] = useState<Partial<Program>>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Comma & Line Separated Helpers
  const [pointsText, setPointsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [techText, setTechText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [keywordsText, setKeywordsText] = useState("");

  const [sections, setSections] = useState<Section[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [careerTracksList, setCareerTracksList] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchCareerTracks = async () => {
      try {
        const { data } = await api.get("/admin/career-tracks");
        setCareerTracksList(data.data || []);
      } catch (err) {
        console.error("Failed to fetch career tracks:", err);
      }
    };
    fetchCareerTracks();
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/programs/admin/${id}`);
        const program: Program = data.data;
        setForm({
          ...program,
          careerTrack:
            typeof program.careerTrack === "object"
              ? (program.careerTrack as any)?._id
              : program.careerTrack,
        });
        setPointsText((program.points || []).join("\n"));
        setSkillsText((program.skills || []).join(", "));
        setToolsText((program.tools || []).join(", "));
        setTechText((program.technologies || []).join(", "));
        setTagsText((program.tags || []).join(", "));
        setSections(program.sections || []);
        setInstructors(program.instructors || []);
        setReviews(program.reviews || []);
      } catch (err) {
        setError("Failed to load program details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const generateSlug = () => {
    if (!form.name) return;
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setForm((prev) => ({ ...prev, slug: prev.slug || slug }));
  };

  // Section & Lesson Helpers
  const addSection = () => {
    setSections((prev) => [...prev, { title: "", description: "", lessons: [] }]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSectionField = (index: number, field: string, value: string) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addLesson = (sectionIndex: number) => {
    setSections((prev) => {
      const copy = [...prev];
      const lessons = [...(copy[sectionIndex].lessons || []), { title: "", duration: "", isFreePreview: false }];
      copy[sectionIndex] = { ...copy[sectionIndex], lessons };
      return copy;
    });
  };

  const updateLessonField = (
    sectionIndex: number,
    lessonIndex: number,
    field: string,
    value: any
  ) => {
    setSections((prev) => {
      const copy = [...prev];
      const lessons = [...copy[sectionIndex].lessons];
      lessons[lessonIndex] = { ...lessons[lessonIndex], [field]: value };
      copy[sectionIndex] = { ...copy[sectionIndex], lessons };
      return copy;
    });
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setSections((prev) => {
      const copy = [...prev];
      const lessons = copy[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
      copy[sectionIndex] = { ...copy[sectionIndex], lessons };
      return copy;
    });
  };

  // Instructor Helpers
  const addInstructor = () => {
    setInstructors((prev) => [
      ...prev,
      { name: "", title: "", company: "", image: "", bio: "", highlightsText: "" } as any,
    ]);
  };

  const removeInstructor = (index: number) => {
    setInstructors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstructorField = (index: number, field: string, value: any) => {
    setInstructors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Review Helpers
  const addReview = () => {
    setReviews((prev) => [
      ...prev,
      { userName: "", userRole: "", userAvatar: "", rating: 5, comment: "" },
    ]);
  };

  const removeReview = (index: number) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateReviewField = (index: number, field: keyof Review, value: any) => {
    setReviews((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Process Instructors Highlights
    const formattedInstructors = instructors.map((inst: any) => ({
      ...inst,
      highlights: typeof inst.highlightsText === "string"
        ? inst.highlightsText.split("\n").map((h: string) => h.trim()).filter(Boolean)
        : inst.highlights || [],
    }));

    const payload = {
      ...form,
      totalSectionsCount: sections.length,
      sections,
      instructors: formattedInstructors,
      reviews,
      points: pointsText
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean),
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: toolsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      technologies: techText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      metaKeywords: keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    try {
      if (isNew) {
        await api.post("/programs/admin", payload);
      } else {
        await api.put(`/programs/admin/${id}`, payload);
      }
      router.push("/admin/programs");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading program data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#09090B]">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isNew ? "Create Program (Full Attributes)" : "Edit Program"}
            </h1>
            <p className="text-sm text-slate-500">
              Fill in complete course information for Codelura Learning Platform.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/programs")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ← Back to Programs
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. BASIC INFORMATION */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              1. Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Program Title *</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  required
                  placeholder="Data Structures & Algorithms"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Subtitle</label>
                <input
                  name="subtitle"
                  value={form.subtitle || ""}
                  onChange={handleChange}
                  placeholder="Complete Zero to Hero DSA Track"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  name="slug"
                  value={form.slug || ""}
                  onChange={handleChange}
                  required
                  placeholder="data-structures-algorithms"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Badge / Tag</label>
                <input
                  name="badge"
                  value={form.badge || ""}
                  onChange={handleChange}
                  placeholder="Codelura PRO / Bestseller"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Career Track Association</label>
                <select
                  name="careerTrack"
                  value={(form.careerTrack as string) || ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">-- Select Career Track (Optional) --</option>
                  {careerTracksList.map((ct) => (
                    <option key={ct._id} value={ct._id}>
                      {ct.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Short Description *</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription || ""}
                onChange={handleChange}
                required
                rows={2}
                placeholder="Brief summary of the program..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Full Detailed Description</label>
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={4}
                placeholder="Comprehensive overview, syllabus description, prerequisites..."
                className={inputClass}
              />
            </div>
          </div>

          {/* 2. MEDIA & APPEARANCE */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              2. Media & Appearance
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Thumbnail Image URL</label>
                <input
                  name="thumbnail"
                  value={form.thumbnail || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  name="image"
                  value={form.image || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Hero Banner Image URL</label>
                <input
                  name="banner"
                  value={form.banner || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Accent Color Code</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="color"
                    value={form.color || "#4F46E5"}
                    onChange={handleChange}
                    className="h-10 w-14 cursor-pointer rounded border border-slate-300 p-1"
                  />
                  <input
                    name="color"
                    value={form.color || "#4F46E5"}
                    onChange={handleChange}
                    placeholder="#4F46E5"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PRICING, STATS & DURATION */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              3. Pricing, Duration & Statistics
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label className={labelClass}>Discount Price (₹)</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice ?? ""}
                  onChange={handleChange}
                  placeholder="4100"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Original Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price ?? ""}
                  onChange={handleChange}
                  placeholder="7000"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Total Hours</label>
                <input
                  name="totalHours"
                  value={form.totalHours || ""}
                  onChange={handleChange}
                  placeholder="293 Hours"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Course Duration</label>
                <input
                  name="duration"
                  value={form.duration || ""}
                  onChange={handleChange}
                  placeholder="6 Months"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Students Enrolled Count</label>
                <input
                  name="totalStudentsCount"
                  value={form.totalStudentsCount || ""}
                  onChange={handleChange}
                  placeholder="3k+ students"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Language</label>
                <input
                  name="language"
                  value={form.language || "Hindi"}
                  onChange={handleChange}
                  placeholder="Hindi / English"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Platform / Video Link (Optional)</label>
                <input
                  name="platformLink"
                  value={form.platformLink || ""}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Checkboxes Group */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 sm:grid-cols-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="includedInSubscription"
                  checked={Boolean(form.includedInSubscription)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Subscription Badge
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="certificate"
                  checked={Boolean(form.certificate)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Certificate
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="placementSupport"
                  checked={Boolean(form.placementSupport)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Placement Support
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="mentorSupport"
                  checked={Boolean(form.mentorSupport)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                1:1 Mentor Support
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="internship"
                  checked={Boolean(form.internship)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Internship
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="featured"
                  checked={Boolean(form.featured)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Featured
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="trending"
                  checked={Boolean(form.trending)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Trending
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  name="popular"
                  checked={Boolean(form.popular)}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-indigo-600"
                />
                Popular
              </label>
            </div>
          </div>

          {/* 4. LEARNING PATH, SKILLS & TAGS */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              4. Learning Outcomes, Skills & Tools
            </h2>

            <div>
              <label className={labelClass}>
                What You&apos;ll Learn Points (One per line)
              </label>
              <textarea
                value={pointsText}
                onChange={(e) => setPointsText(e.target.value)}
                rows={3}
                placeholder={"Master C++ & Data Structures\nCrack Product-Based Interviews\nBuild Real Production Projects"}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Skills (Comma separated)</label>
                <input
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="C++, Data Structures, Algorithms, Dynamic Programming"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Tools (Comma separated)</label>
                <input
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  placeholder="VS Code, Git, GitHub, LeetCode"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Technologies (Comma separated)</label>
                <input
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  placeholder="C++17, STL, Graph Theory"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Search Tags (Comma separated)</label>
                <input
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="dsa, cpp, coding, algorithm"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 5. CURRICULUM SECTIONS BUILDER */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  5. Course Curriculum ({sections.length} Sections)
                </h2>
                <p className="text-xs text-slate-500">
                  Add modules, topics, and lessons for your students.
                </p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {sections.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                  No sections added yet. Click "+ Add Section" to build curriculum.
                </div>
              ) : (
                sections.map((sec, sIndex) => (
                  <div
                    key={sIndex}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        value={sec.title}
                        onChange={(e) =>
                          updateSectionField(sIndex, "title", e.target.value)
                        }
                        placeholder={`Section ${sIndex + 1} Title (e.g., Learn C++, Patterns, DP)`}
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sIndex)}
                        className="rounded-lg bg-red-100 px-3 py-2.5 text-xs font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>

                    <input
                      value={sec.description || ""}
                      onChange={(e) =>
                        updateSectionField(sIndex, "description", e.target.value)
                      }
                      placeholder="Section summary description (optional)"
                      className={inputClass}
                    />

                    {/* Lessons list */}
                    <div className="pl-3 space-y-2 border-l-2 border-indigo-500/30">
                      {sec.lessons?.map((les, lIndex) => (
                        <div
                          key={lIndex}
                          className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800"
                        >
                          <input
                            value={les.title}
                            onChange={(e) =>
                              updateLessonField(
                                sIndex,
                                lIndex,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder={`Lesson ${lIndex + 1} Title`}
                            className={inputClass}
                          />
                          <input
                            value={les.duration || ""}
                            onChange={(e) =>
                              updateLessonField(
                                sIndex,
                                lIndex,
                                "duration",
                                e.target.value
                              )
                            }
                            placeholder="15 mins"
                            className="w-28 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                          />
                          <label className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={Boolean(les.isFreePreview)}
                              onChange={(e) =>
                                updateLessonField(
                                  sIndex,
                                  lIndex,
                                  "isFreePreview",
                                  e.target.checked
                                )
                              }
                            />
                            Free Preview
                          </label>
                          <button
                            type="button"
                            onClick={() => removeLesson(sIndex, lIndex)}
                            className="text-xs text-red-500 hover:underline px-1 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLesson(sIndex)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                      >
                        + Add Lesson to Section {sIndex + 1}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 6. INSTRUCTORS BUILDER */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  6. Course Instructors ({instructors.length} Instructors)
                </h2>
                <p className="text-xs text-slate-500">
                  Add instructor profiles and badges for this program.
                </p>
              </div>
              <button
                type="button"
                onClick={addInstructor}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                + Add Instructor
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {instructors.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                  No custom instructors added. Default platform mentors will be shown.
                </div>
              ) : (
                instructors.map((inst: any, iIndex) => (
                  <div
                    key={iIndex}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-3"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Instructor Name</label>
                        <input
                          value={inst.name || ""}
                          onChange={(e) =>
                            updateInstructorField(iIndex, "name", e.target.value)
                          }
                          placeholder="Love Babbar"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Role / Title</label>
                        <input
                          value={inst.title || ""}
                          onChange={(e) =>
                            updateInstructorField(iIndex, "title", e.target.value)
                          }
                          placeholder="Founder & Software Engineer"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Company Badge</label>
                        <input
                          value={inst.company || ""}
                          onChange={(e) =>
                            updateInstructorField(iIndex, "company", e.target.value)
                          }
                          placeholder="Ex-Amazon, Ex-Microsoft"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Photo / Avatar URL</label>
                        <input
                          value={inst.image || ""}
                          onChange={(e) =>
                            updateInstructorField(iIndex, "image", e.target.value)
                          }
                          placeholder="https://..."
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Bio Summary</label>
                      <input
                        value={inst.bio || ""}
                        onChange={(e) =>
                          updateInstructorField(iIndex, "bio", e.target.value)
                        }
                        placeholder="Known for expertise in algorithms and software engineering."
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Highlights (One per line)</label>
                      <textarea
                        value={
                          typeof inst.highlightsText === "string"
                            ? inst.highlightsText
                            : (inst.highlights || []).join("\n")
                        }
                        onChange={(e) =>
                          updateInstructorField(iIndex, "highlightsText", e.target.value)
                        }
                        rows={2}
                        placeholder={"Previously worked at Amazon & Microsoft\nMentored 500,000+ students"}
                        className={inputClass}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeInstructor(iIndex)}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove Instructor
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 7. STUDENT REVIEWS BUILDER */}
          <div className={cardClass}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                  7. Student Reviews & Success Stories ({reviews.length} Reviews)
                </h2>
                <p className="text-xs text-slate-500">
                  Add student testimonials, rating stars, and photo image links to display on the program page.
                </p>
              </div>
              <button
                type="button"
                onClick={addReview}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                + Add Review
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {reviews.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg">
                  No student reviews added yet. Click "+ Add Review" to add student testimonials with images.
                </div>
              ) : (
                reviews.map((rev, rIndex) => (
                  <div
                    key={rIndex}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-3"
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className={labelClass}>Student Name *</label>
                        <input
                          value={rev.userName || ""}
                          onChange={(e) =>
                            updateReviewField(rIndex, "userName", e.target.value)
                          }
                          placeholder="e.g. Rahul Sharma"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Role / Company Badge</label>
                        <input
                          value={rev.userRole || ""}
                          onChange={(e) =>
                            updateReviewField(rIndex, "userRole", e.target.value)
                          }
                          placeholder="e.g. SDE-1 @ Amazon"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Rating (1 - 5 Stars)</label>
                        <select
                          value={rev.rating || 5}
                          onChange={(e) =>
                            updateReviewField(rIndex, "rating", Number(e.target.value))
                          }
                          className={inputClass}
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                          <option value={3}>⭐⭐⭐ (3 Stars)</option>
                          <option value={2}>⭐⭐ (2 Stars)</option>
                          <option value={1}>⭐ (1 Star)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Student Photo / Avatar Image URL (Image Link)</label>
                      <input
                        value={rev.userAvatar || ""}
                        onChange={(e) =>
                          updateReviewField(rIndex, "userAvatar", e.target.value)
                        }
                        placeholder="https://images.unsplash.com/... or image URL"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Review Comment / Testimonial Feedback</label>
                      <textarea
                        value={rev.comment || ""}
                        onChange={(e) =>
                          updateReviewField(rIndex, "comment", e.target.value)
                        }
                        rows={2}
                        placeholder="This program helped me master DSA and crack my dream software engineering job..."
                        className={inputClass}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeReview(rIndex)}
                        className="text-xs text-red-500 font-bold hover:underline"
                      >
                        Remove Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 8. SEO METADATA */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              8. SEO Metadata
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>SEO Meta Title</label>
                <input
                  name="metaTitle"
                  value={form.metaTitle || ""}
                  onChange={handleChange}
                  placeholder="Data Structures & Algorithms Course - Codelura"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Canonical URL</label>
                <input
                  name="canonicalUrl"
                  value={form.canonicalUrl || ""}
                  onChange={handleChange}
                  placeholder="https://codelura.com/programs/..."
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>SEO Keywords (Comma separated)</label>
                <input
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="dsa course, learn cpp, coding interview prep, codelura"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>SEO Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Master DSA and C++ algorithms..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 9. STATUS & PUBLISHING */}
          <div className={cardClass}>
            <h2 className="text-base font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              9. Status & Visibility
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Publishing Status</label>
                <select
                  name="status"
                  value={form.status || "published"}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={Boolean(form.isActive)}
                    onChange={handleChange}
                    className="h-4 w-4 rounded text-indigo-600"
                  />
                  Program Active & Accessible
                </label>
              </div>
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/programs")}
              className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving Program..." : isNew ? "Create Program" : "Update Program"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}