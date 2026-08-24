"use client";

import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import type Quill from "quill";
import { motion } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import {
  TextInput,
  Textarea,
  Button,
  ToggleSwitch,
  Card,
  Badge
} from "flowbite-react";
import sanitizeHtml from "sanitize-html";
// ─── Lazy Load Components ───
const BlogSummary = lazy(() => import("@/components/blog/BlogSummary"));
const BlogTagGenerator = lazy(() => import("@/components/blog/BlogTagGenerator"));

// ─── Types ───
// interface BlogFormData {
//   title: string;
//   slug: string;
//   excerpt: string;
//   content: string;
//   coverImage: string;
//   ogImage: string;
//   summary: string;
//   metaTitle: string;
//   metaDescription: string;
//   tags: string;
//   category: string;
//   authorName: string;
//   readingTime: string;
//   isFeatured: boolean;
//   allowComments: boolean;
//   publishNow: boolean;
// }

interface FaqItem {
  question: string;
  answer: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string;        // 👈 NEW
  ogImage: string;
  summary: string;
  faqs: FaqItem[];              // 👈 NEW
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;         // 👈 NEW
  secondaryKeywords: string;    // 👈 NEW (comma-separated string, tags jaisa)
  tags: string;
  category: string;
  authorName: string;
  authorBio: string;            // 👈 NEW
  authorImage: string;          // 👈 NEW
  readingTime: string;
  isFeatured: boolean;
  allowComments: boolean;
  noIndex: boolean;             // 👈 NEW
  publishNow: boolean;
}
interface AdminBlogFormProps {
  initialData?: Partial<BlogFormData>;
  isEdit?: boolean;
  blogId?: string;
}

// ─── Lazy Load Quill ───
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading Editor...</span>
    </div>
  )
});

// ─── Styles ───
const adminStyles = `
  .preview-container {
    max-width: 100% !important;
    width: 100% !important;
    overflow: visible !important;
    height: auto !important;
    min-height: 200px !important;
    padding: 1.5rem !important;
    background: #f8fafc !important;
    border-radius: 0.5rem !important;
    color: #1e293b !important;
  }

  .preview-container * {
    max-height: none !important;
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    word-break: normal !important;
    word-wrap: normal !important;
    overflow-wrap: normal !important;
    white-space: normal !important;
    hyphens: none !important;
  }

  .preview-container h1 {
    font-size: 2.25rem !important;
    font-weight: 700 !important;
    margin: 2rem 0 1rem 0 !important;
    color: #0f172a !important;
    display: block !important;
  }

  .preview-container h2 {
    font-size: 1.875rem !important;
    font-weight: 700 !important;
    margin: 1.75rem 0 0.75rem 0 !important;
    color: #0f172a !important;
    display: block !important;
  }

  .preview-container h3 {
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    margin: 1.5rem 0 0.75rem 0 !important;
    color: #0f172a !important;
    display: block !important;
  }

  .preview-container h4 {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    margin: 1.25rem 0 0.5rem 0 !important;
    color: #0f172a !important;
    display: block !important;
  }

  .preview-container p {
    margin-bottom: 1rem !important;
    line-height: 1.8 !important;
    color: #1e293b !important;
    display: block !important;
  }

  .preview-container ul {
    list-style: disc !important;
    padding-left: 1.5rem !important;
    margin-bottom: 1rem !important;
    display: block !important;
  }

  .preview-container ol {
    list-style: decimal !important;
    padding-left: 1.5rem !important;
    margin-bottom: 1rem !important;
    display: block !important;
  }

  .preview-container li {
    margin-bottom: 0.25rem !important;
    line-height: 1.6 !important;
    display: list-item !important;
  }

  .preview-container blockquote {
    border-left: 4px solid #6366f1 !important;
    padding: 0.75rem 1rem !important;
    margin: 1rem 0 !important;
    font-style: italic !important;
    color: #475569 !important;
    background: #f1f5f9 !important;
    border-radius: 0 0.5rem 0.5rem 0 !important;
    display: block !important;
  }

  .preview-container pre {
    background: #1e1e1e !important;
    padding: 1.25rem !important;
    border-radius: 0.5rem !important;
    overflow-x: auto !important;
    margin: 1rem 0 !important;
    display: block !important;
  }

  .preview-container pre code {
    background: transparent !important;
    padding: 0 !important;
    color: #e2e8f0 !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.875rem !important;
    display: block !important;
  }

  .preview-container :not(pre) > code {
    background: #e2e8f0 !important;
    padding: 0.15rem 0.4rem !important;
    border-radius: 0.25rem !important;
    font-size: 0.875rem !important;
    color: #4f46e5 !important;
    font-weight: 600 !important;
    display: inline !important;
  }

  .preview-container a {
    color: #4f46e5 !important;
    text-decoration: underline !important;
    word-break: break-all !important;
    display: inline !important;
  }

  .preview-container img {
    max-width: 100% !important;
    height: auto !important;
    border-radius: 0.5rem !important;
    margin: 1rem 0 !important;
    display: block !important;
  }

  .code-wrapper {
    position: relative !important;
    margin: 1rem 0 !important;
    border-radius: 0.5rem !important;
    overflow: hidden !important;
    background: #1e1e1e !important;
  }

  .code-wrapper pre {
    margin: 0 !important;
    border-radius: 0 !important;
    padding: 1.25rem !important;
  }

  .code-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0.5rem 1rem !important;
    background: #2d2d2d !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    color: #9ca3af !important;
    font-size: 0.75rem !important;
  }

  .lang-badge {
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    color: #6ee7b7 !important;
  }

  .copy-btn {
    cursor: pointer !important;
    padding: 0.25rem 0.75rem !important;
    border-radius: 0.25rem !important;
    background: rgba(255,255,255,0.05) !important;
    transition: background 0.2s !important;
    color: #94a3b8 !important;
    border: none !important;
  }

  .copy-btn:hover {
    background: rgba(255,255,255,0.1) !important;
    color: #ffffff !important;
  }

  // .ql-editor {

  //   min-height: 300px !important;
  //   max-height: none !important;
  //   overflow: visible !important;
  // }
  .ql-editor {
    min-height: 300px !important;
    max-height: none !important;
    overflow: visible !important;
    color: #1e293b !important;
    background: #ffffff !important;
  }

  .ql-editor.ql-blank::before {
    color: #94a3b8 !important;
  }

  .ql-toolbar {
    background: #f8fafc !important;
    border-color: #e2e8f0 !important;
  }

  .ql-toolbar .ql-stroke {
    stroke: #334155 !important;
  }

  .ql-toolbar .ql-fill {
    fill: #334155 !important;
  }

  .ql-toolbar .ql-picker-label {
    color: #334155 !important;
  }

  .ql-container {
    border-color: #e2e8f0 !important;
  }

  /* ─── Auto-Save Indicator ─── */
  .save-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .save-indicator.saving {
    background: rgba(251, 191, 36, 0.2);
    color: #fbbf24;
  }

  .save-indicator.saved {
    background: rgba(52, 211, 153, 0.2);
    color: #34d399;
  }

  .save-indicator.error {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
  }

  .save-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  .save-dot.saving {
    background: #fbbf24;
    animation: pulse-dot 1s ease-in-out infinite;
  }

  .save-dot.saved {
    background: #34d399;
  }

  .save-dot.error {
    background: #f87171;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
`;

export default function AdminBlogForm({
  initialData = {},
  isEdit = false,
  blogId
}: AdminBlogFormProps) {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── LocalStorage Key ───
  const STORAGE_KEY = isEdit ? `blog_draft_${blogId}` : "blog_draft_new";
  const FORM_KEY = isEdit ? `blog_form_${blogId}` : "blog_form_new";

  // ─── Load from LocalStorage ───
  const loadFromStorage = useCallback(() => {
    try {
      // Load form data
      const savedForm = localStorage.getItem(FORM_KEY);
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Failed to load from storage:", error);
      return null;
    }
  }, [FORM_KEY]);

  // ─── Initialize Form State ───
  const [form, setForm] = useState<BlogFormData>(() => {
    // If editing, use initialData
    // if (isEdit && initialData && Object.keys(initialData).length > 0) {
    //   return {
    //     title: "",
    //     slug: "",
    //     excerpt: "",
    //     content: "",
    //     coverImage: "",
    //     ogImage: "",
    //     summary: "",
    //     metaTitle: "",
    //     metaDescription: "",
    //     tags: "",
    //     category: "",
    //     authorName: "",
    //     readingTime: "",
    //     isFeatured: false,
    //     allowComments: true,
    //     publishNow: false,
    //     ...initialData
    //   };
    // }

 if (isEdit && initialData && Object.keys(initialData).length > 0) {
      return {
        title: "",
        slug: "",
        excerpt: "",
        // content: "",
        coverImage: "",
        coverImageAlt: "",
        ogImage: "",
        summary: "",
        faqs: [],
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        secondaryKeywords: "",
        tags: "",
        category: "",
        authorName: "",
        authorBio: "",
        authorImage: "",
        readingTime: "",
        isFeatured: false,
        allowComments: true,
        noIndex: false,
        publishNow: false,
        ...initialData,
        content: (initialData.content || "")
          .replace(/color:\s*[^;"]+;?/gi, "")
          .replace(/style="\s*"/gi, "")
      };
    }
    // Otherwise load from localStorage
    // const saved = loadFromStorage();
    // if (saved) {
    //   return {
    //     title: "",
    //     slug: "",
    //     excerpt: "",
    //     content: "",
    //     coverImage: "",
    //     ogImage: "",
    //     summary: "",
    //     metaTitle: "",
    //     metaDescription: "",
    //     tags: "",
    //     category: "",
    //     authorName: "",
    //     readingTime: "",
    //     isFeatured: false,
    //     allowComments: true,
    //     publishNow: false,
    //     ...saved
    //   };
    // }

    const saved = loadFromStorage();
    if (saved) {
      return {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        coverImageAlt: "",
        ogImage: "",
        summary: "",
        faqs: [],
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
        secondaryKeywords: "",
        tags: "",
        category: "",
        authorName: "",
        authorBio: "",
        authorImage: "",
        readingTime: "",
        isFeatured: false,
        allowComments: true,
        noIndex: false,
        publishNow: false,
        ...saved
      };
    }

    // Default empty form
  //   return {
  //     title: "",
  //     slug: "",
  //     excerpt: "",
  //     content: "",
  //     coverImage: "",
  //     ogImage: "",
  //     summary: "",
  //     metaTitle: "",
  //     metaDescription: "",
  //     tags: "",
  //     category: "",
  //     authorName: "",
  //     readingTime: "",
  //     isFeatured: false,
  //     allowComments: true,
  //     publishNow: false
  //   };
  // });

  // Default empty form
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      coverImageAlt: "",
      ogImage: "",
      summary: "",
      faqs: [],
      metaTitle: "",
      metaDescription: "",
      focusKeyword: "",
      secondaryKeywords: "",
      tags: "",
      category: "",
      authorName: "",
      authorBio: "",
      authorImage: "",
      readingTime: "",
      isFeatured: false,
      allowComments: true,
      noIndex: false,
      publishNow: false
    };
  });

  // ─── Auto-Save Function ───
  const autoSave = useCallback((data: BlogFormData) => {
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus("saving");

    // Debounce save - wait 1 second after typing stops
    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Save form data
        localStorage.setItem(FORM_KEY, JSON.stringify(data));
        
        // Save only content separately for quick access
        if (data.content) {
          localStorage.setItem(STORAGE_KEY, data.content);
        }

        setSaveStatus("saved");
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus("error");
        toast.error("Failed to auto-save draft");
      }
    }, 1000);
  }, [FORM_KEY, STORAGE_KEY]);

  // ─── Handle Form Change with Auto-Save ───
  const handleFormChange = useCallback((key: keyof BlogFormData, value: any) => {
    setForm((prev) => {
      const newForm = { ...prev, [key]: value };
      
      // Auto-save on every change
      autoSave(newForm);
      
      return newForm;
    });
  }, [autoSave]);

  // ─── FAQ Handlers ───
  const addFaq = useCallback(() => {
    setForm((prev) => {
      const newForm = { ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] };
      autoSave(newForm);
      return newForm;
    });
  }, [autoSave]);

  const removeFaq = useCallback((index: number) => {
    setForm((prev) => {
      const newForm = { ...prev, faqs: prev.faqs.filter((_, i) => i !== index) };
      autoSave(newForm);
      return newForm;
    });
  }, [autoSave]);

  const updateFaq = useCallback((index: number, key: "question" | "answer", value: string) => {
    setForm((prev) => {
      const newFaqs = [...prev.faqs];
      newFaqs[index] = { ...newFaqs[index], [key]: value };
      const newForm = { ...prev, faqs: newFaqs };
      autoSave(newForm);
      return newForm;
    });
  }, [autoSave]);

  // ─── Upload Image ───
  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    const data = res.data;

    if (!data.url) {
      throw new Error("Upload failed");
    }

    return data.url;
  }, []);

  // ─── Quill Modules ───
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"]
      ],
      handlers: {
        link: function (this: { quill: Quill }) {
          const quill = this.quill;
          const range = quill.getSelection();
          if (!range) return;

          const selectedText = quill.getText(range.index, range.length);
          const text = window.prompt("Enter display text:", selectedText || "");
          if (!text) return;

          const url = window.prompt("Enter URL (https://...)");
          if (!url) return;

          if (range.length > 0) {
            quill.deleteText(range.index, range.length);
          }

          quill.insertText(range.index, text, "link", url);
          quill.setSelection(range.index + text.length);
        },

        image: async function (this: any) {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.click();

          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
              const imageUrl = await uploadImage(file);
              const range = this.quill.getSelection();
              this.quill.insertEmbed(range.index, "image", imageUrl);
              toast.success("Image uploaded ✅");
            } catch (err) {
              console.error(err);
              toast.error("Image upload failed ❌");
            }
          };
        }
      }
    }
  }), [uploadImage]);

  const formats = useMemo(() => [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image"
  ], []);

  // ─── Clean Content ───
  const cleanContent = useCallback((content: string) => {
    if (!content) return "";

    let clean = content
      .replace(/<span[^>]*>/g, "")
      .replace(/<\/span>/g, "")
      .replace(/ style="[^"]*"/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/<div>/g, "<p>")
      .replace(/<\/div>/g, "</p>")
      .replace(/<p>\s*<\/p>/g, "")
      .trim();

    clean = clean
      .replace(/<\/h2><\/span>/g, "</h2>")
      .replace(/<\/h2><span/g, "</h2><span")
      .replace(/<span><\/span>/g, "")
      .replace(/<span>\s*<\/span>/g, "");

    return sanitizeHtml(clean, {
      allowedTags: [
        "p", "h1", "h2", "h3", "h4", "h5", "h6",
        "strong", "em", "u", "s", "strike",
        "ul", "ol", "li",
        "blockquote",
        "code", "pre",
        "a", "img",
        "br",
        "table", "thead", "tbody", "tr", "th", "td"
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
        img: ["src", "alt", "title"],
        pre: ["class", "data-language"],
        code: ["class"]
      },
      allowedSchemes: ["http", "https", "mailto", "data"],
      allowProtocolRelative: true
    });
  }, []);

  // ─── Preview Content ───
  const previewContent = useMemo(() => cleanContent(form.content), [form.content, cleanContent]);

  // ─── Highlight.js ───
  useEffect(() => {
    if (!previewRef.current) return;

    const blocks = previewRef.current.querySelectorAll("pre");

    blocks.forEach((block) => {
      if (block.querySelector("code")) return;

      const code = document.createElement("code");
      const lang = block.getAttribute("data-language") || "javascript";
      code.className = `language-${lang}`;
      code.textContent = block.textContent || "";

      block.innerHTML = "";
      block.appendChild(code);

      hljs.highlightElement(code);
    });

    const wrappers = previewRef.current.querySelectorAll("pre");
    wrappers.forEach((block) => {
      if (block.parentElement?.classList.contains("code-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper";

      const header = document.createElement("div");
      header.className = "code-header";

      const lang = block.getAttribute("data-language") || "JS";

      const langBadge = document.createElement("span");
      langBadge.className = "lang-badge";
      langBadge.innerText = lang.toUpperCase();

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-btn";
      copyBtn.innerText = "Copy";

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(block.textContent || "");
        copyBtn.innerText = "Copied! ✅";
        setTimeout(() => (copyBtn.innerText = "Copy"), 2000);
      };

      header.appendChild(langBadge);
      header.appendChild(copyBtn);

      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(header);
      wrapper.appendChild(block);
    });
  }, [form.content]);

  // ─── Submit ───
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      const cleanedContent = cleanContent(form.content);

     const payload = {
        ...form,
        content: cleanedContent,
        tags: form.tags
          ?.split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        secondaryKeywords: form.secondaryKeywords
          ?.split(",")
          .map((k: string) => k.trim())
          .filter(Boolean),
        faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim())  // empty FAQs hata do
      };

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      };

      if (isEdit) {
        await api.patch(`/admin/blogs/${blogId}`, payload, { headers });
        toast.success("Blog updated successfully ✅");
      } else {
        await api.post("/admin/blogs", payload, { headers });
        toast.success("Blog created successfully 🚀");
      }

      // Clear draft after successful save
      localStorage.removeItem(FORM_KEY);
      localStorage.removeItem(STORAGE_KEY);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Action failed");
      }
    } finally {
      setLoading(false);
    }
  }, [form, isEdit, blogId, cleanContent, FORM_KEY, STORAGE_KEY]);

  // ─── Auto-save status indicator ───
  const SaveIndicator = () => {
    const statusMap = {
      idle: { label: "All changes saved", dot: "saved", className: "saved" },
      saving: { label: "Saving...", dot: "saving", className: "saving" },
      saved: { label: "✓ Saved", dot: "saved", className: "saved" },
      error: { label: "⚠️ Save failed", dot: "error", className: "error" }
    };

    const current = statusMap[saveStatus];

    return (
      <span className={`save-indicator ${current.className}`}>
        <span className={`save-dot ${current.dot}`} />
        {current.label}
      </span>
    );
  };

  // ─── Render ───
  return (
    <>
      <style>{adminStyles}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEdit ? "Edit Blog" : "Create New Blog"}
          </h1>

          <div className="flex items-center gap-3">
            <SaveIndicator />
            <Badge color="indigo" size="lg">
              {isEdit ? "Editing" : "Draft"}
            </Badge>
          </div>
        </div>

        <Suspense fallback={<div className="h-32 bg-black/20 rounded-xl animate-pulse" />}>
          <BlogSummary
            content={form.content}
            isAdmin
            onSummaryGenerated={(summary) => handleFormChange("summary", summary)}
          />
        </Suspense>

        {/* ─── BASIC INFO ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">
            📌 Basic Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Blog Title"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
            />

            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Custom Slug (optional)"
              value={form.slug}
              onChange={(e) => handleFormChange("slug", e.target.value)}
            />
          </div>

          <Textarea
            className="focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Short excerpt (used in previews & SEO)"
            value={form.excerpt}
            onChange={(e) => handleFormChange("excerpt", e.target.value)}
          />
        </Card>

        {/* ─── CONTENT ─── */}
        <Card className="bg-white/95 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            📝 Blog Content
          </h2>

          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => handleFormChange("content", value)}
            modules={modules}
            formats={formats}
            className="bg-white rounded-lg"
          />

          {/* ─── LIVE PREVIEW ─── */}
          <div className="mt-6 rounded-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">
                📖 Live Preview
              </h3>
            </div>

            <div ref={previewRef} className="preview-container">
              {previewContent && previewContent.length > 0 ? (
                <div dangerouslySetInnerHTML={{ __html: previewContent }} />
              ) : (
                <p className="text-gray-400 text-center py-8">
                  Start writing to see preview...
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* ─── MEDIA ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">🖼 Media</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const url = await uploadImage(file);
                    handleFormChange("coverImage", url);
                    toast.success("Cover image uploaded ✅");
                  } catch {
                    toast.error("Upload failed ❌");
                  }
                }}
              />

              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover"
                  className="mt-3 w-40 rounded-lg border border-white/10"
                />
              )}
               <TextInput
                className="mt-3 focus:ring-2 focus:ring-indigo-500"
                placeholder="Cover Image Alt Text (for SEO/Image search)"
                value={form.coverImageAlt}
                onChange={(e) => handleFormChange("coverImageAlt", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">OG Image</label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const url = await uploadImage(file);
                    handleFormChange("ogImage", url);
                    toast.success("OG image uploaded ✅");
                  } catch {
                    toast.error("Upload failed ❌");
                  }
                }}
              />

              {form.ogImage && (
                <img
                  src={form.ogImage}
                  alt="OG"
                  className="mt-3 w-40 rounded-lg border border-white/10"
                />
              )}
            </div>
          </div>
        </Card>

        {/* ─── SEO ─── */}
   {/* ─── SEO ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">
            🔍 SEO Metadata
          </h2>

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Meta Title"
            value={form.metaTitle}
            onChange={(e) => handleFormChange("metaTitle", e.target.value)}
          />

          <Textarea
            className="focus:ring-2 focus:ring-indigo-500 mt-4"
            rows={3}
            placeholder="Meta Description"
            value={form.metaDescription}
            onChange={(e) => handleFormChange("metaDescription", e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Focus Keyword (main keyword)"
              value={form.focusKeyword}
              onChange={(e) => handleFormChange("focusKeyword", e.target.value)}
            />

            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Secondary Keywords (comma separated)"
              value={form.secondaryKeywords}
              onChange={(e) => handleFormChange("secondaryKeywords", e.target.value)}
            />
          </div>
        </Card>

        {/* ─── ATTRIBUTES ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">
            🏷 Attributes
          </h2>

          <Suspense fallback={<div className="h-12 bg-black/20 rounded-lg animate-pulse" />}>
            <BlogTagGenerator
              content={form.content}
              onTagsGenerated={(tags) =>
                handleFormChange("tags", tags.join(", "))
              }
            />
          </Suspense>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => handleFormChange("tags", e.target.value)}
            />

            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Category"
              value={form.category}
              onChange={(e) => handleFormChange("category", e.target.value)}
            />

           <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Author Name"
              value={form.authorName}
              onChange={(e) => handleFormChange("authorName", e.target.value)}
            />

            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Reading Time (e.g. 8 min read)"
              value={form.readingTime}
              onChange={(e) => handleFormChange("readingTime", e.target.value)}
            />

            <TextInput
              className="focus:ring-2 focus:ring-indigo-500"
              placeholder="Author Image URL"
              value={form.authorImage}
              onChange={(e) => handleFormChange("authorImage", e.target.value)}
            />
          </div>

          <Textarea
            className="focus:ring-2 focus:ring-indigo-500 mt-4"
            rows={2}
            placeholder="Author Bio (short, for E-E-A-T/trust signals)"
            value={form.authorBio}
            onChange={(e) => handleFormChange("authorBio", e.target.value)}
          />
        </Card>

{/* ─── FAQ (AEO/GEO) ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-200">
              ❓ FAQs (helps AI search & Google Overviews)
            </h2>
            <Button size="sm" color="indigo" onClick={addFaq}>
              + Add FAQ
            </Button>
          </div>

          {form.faqs.length === 0 && (
            <p className="text-sm text-gray-500">No FAQs added yet.</p>
          )}

          <div className="space-y-4">
            {form.faqs.map((faq, index) => (
              <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">FAQ #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <TextInput
                  className="focus:ring-2 focus:ring-indigo-500"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                />

                <Textarea
                  className="focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* ─── SETTINGS ─── */}
        {/* ─── SETTINGS ─── */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">⚙️ Settings</h2>

          <div className="space-y-3">
            <ToggleSwitch
              checked={form.isFeatured}
              label="Featured Blog"
              onChange={(v) => handleFormChange("isFeatured", v)}
            />

            <ToggleSwitch
              checked={form.allowComments}
              label="Allow Comments"
              onChange={(v) => handleFormChange("allowComments", v)}
            />

            <ToggleSwitch
              checked={form.publishNow}
              label="Publish Immediately"
              onChange={(v) => handleFormChange("publishNow", v)}
            />
            <ToggleSwitch
              checked={form.noIndex}
              label="No Index (hide from Google search)"
              onChange={(v) => handleFormChange("noIndex", v)}
            />
          </div>
        </Card>

        {/* ─── ACTION BAR ─── */}
        <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row justify-end gap-3">
          <Button 
            color="gray" 
            onClick={() => {
              // Clear draft on cancel
              if (confirm("Are you sure you want to discard this draft?")) {
                localStorage.removeItem(FORM_KEY);
                localStorage.removeItem(STORAGE_KEY);
                window.history.back();
              }
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </motion.div>
    </>
  );
}