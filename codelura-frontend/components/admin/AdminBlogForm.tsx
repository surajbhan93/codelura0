"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import type Quill from "quill";
import BlogSummary from "@/components/blog/BlogSummary";
import BlogTagGenerator from "@/components/blog/BlogTagGenerator";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import sanitizeHtml from "sanitize-html";
import {
  TextInput,
  Textarea,
  Button,
  ToggleSwitch,
  Card,
  Badge
} from "flowbite-react";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  ogImage: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  tags: string;
  category: string;
  authorName: string;
  readingTime: string;
  isFeatured: boolean;
  allowComments: boolean;
  publishNow: boolean;
}

interface AdminBlogFormProps {
  initialData?: Partial<BlogFormData>;
  isEdit?: boolean;
  blogId?: string;
}

import { motion } from "framer-motion";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false
});

export default function AdminBlogForm({
  initialData = {},
  isEdit = false,
  blogId
}: AdminBlogFormProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    ogImage: "",
    summary: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    category: "",
    authorName: "",
    readingTime: "",
    isFeatured: false,
    allowComments: true,
    publishNow: false,
    ...initialData
  });

  const modules = {
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

          const text = window.prompt(
            "Enter display text:",
            selectedText || ""
          );
          if (!text) return;

          const url = window.prompt("Enter URL (https://...)");
          if (!url) return;

          if (range.length > 0) {
            quill.deleteText(range.index, range.length);
          }

          quill.insertText(range.index, text, "link", url);
          quill.setSelection(range.index + text.length);
        }
      }
    }
  };

  const formats = [
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
  ];

  useEffect(() => {
    const blocks = document.querySelectorAll(".preview-container pre");

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

    addCodeEnhancements();
  }, [form.content]);

  const addCodeEnhancements = () => {
    const blocks = document.querySelectorAll(".preview-container pre");

    blocks.forEach((block) => {
      if (block.parentElement?.classList.contains("code-wrapper")) return;

      const wrapper = document.createElement("div");
      wrapper.className =
        "code-wrapper relative my-6 rounded-xl overflow-hidden bg-[#1e1e1e]";

      const header = document.createElement("div");
      header.className =
        "flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-xs text-gray-300";

      const lang = block.getAttribute("data-language") || "JS";

      const langBadge = document.createElement("span");
      langBadge.innerText = lang.toUpperCase();

      const copyBtn = document.createElement("button");
      copyBtn.innerText = "Copy";
      copyBtn.className = "text-gray-400 hover:text-white transition";

      copyBtn.onclick = () => {
        navigator.clipboard.writeText(block.textContent || "");
        copyBtn.innerText = "Copied!";
        setTimeout(() => (copyBtn.innerText = "Copy"), 2000);
      };

      header.appendChild(langBadge);
      header.appendChild(copyBtn);

      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(header);
      wrapper.appendChild(block);
    });
  };

  // ✅ FIXED PREVIEW CONTENT - PROPER WORD WRAPPING
  const previewContent = sanitizeHtml(form.content, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
      "img",
      "br"
    ],
    allowedAttributes: {
      a: ["href", "target"],
      img: ["src", "alt"]
    }
  })
    .replace(/&nbsp;/g, " ")
    .replace(/<span[^>]*>/g, "")
    .replace(/<\/span>/g, "")
    .trim();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const cleanContent = sanitizeHtml(form.content, {
        allowedTags: [
          "p",
          "h1",
          "h2",
          "h3",
          "strong",
          "em",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "a",
          "img",
          "br"
        ],
        allowedAttributes: {
          a: ["href", "target"],
          img: ["src", "alt"]
        },
        allowedSchemes: ["http", "https", "mailto"]
      });

      const normalizedContent = cleanContent
        .replace(/<span[^>]*>/g, "")
        .replace(/<\/span>/g, "")
        .replace(/ style="[^"]*"/g, "")
        .replace(/<div>/g, "<p>")
        .replace(/<\/div>/g, "</p>")
        .replace(/&nbsp;/g, " ")
        .replace(/<p>\s*<\/p>/g, "")
        .trim();

      const payload = {
        ...form,
        content: normalizedContent,
        tags: form.tags
          ?.split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Action failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isEdit ? "Edit Blog" : "Create New Blog"}
        </h1>

        <Badge color="indigo" size="lg">
          {isEdit ? "Editing" : "Draft"}
        </Badge>
      </div>

      <BlogSummary
        content={form.content}
        isAdmin
        onSummaryGenerated={(summary) => setForm({ ...form, summary })}
      />

      {/* BASIC INFO */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          📌 Basic Information
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Custom Slug (optional)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        <Textarea
          className="focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Short excerpt (used in previews & SEO)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
      </Card>

      {/* CONTENT */}
      <Card className="bg-white/95 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          📝 Blog Content
        </h2>

        <ReactQuill
          theme="snow"
          value={form.content}
          onChange={(value) => setForm({ ...form, content: value })}
          modules={modules}
          formats={formats}
          className="bg-white rounded-lg"
        />

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            📖 Live Preview
          </h3>

          {/* ✅ FIXED PREVIEW - PROPER WORD WRAPPING */}
          <div
            className="
              preview-container
              max-w-none
              text-gray-800
              leading-relaxed

              break-words
              overflow-wrap-anywhere
              
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:break-words
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-5 [&_h2]:mt-7 [&_h2]:break-words
              [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-4 [&_h3]:mt-6 [&_h3]:break-words

              [&_p]:mb-4
              [&_p]:leading-7
              [&_p]:break-words
              [&_p]:whitespace-normal

              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4

              [&_li]:mb-1 [&_li]:break-words

              [&_blockquote]:border-l-4
              [&_blockquote]:border-indigo-500
              [&_blockquote]:pl-4
              [&_blockquote]:italic
              [&_blockquote]:text-gray-600
              [&_blockquote]:my-4
              [&_blockquote]:break-words

              [&_pre]:bg-[#1e1e1e]
              [&_pre]:p-4
              [&_pre]:rounded-xl
              [&_pre]:overflow-x-auto
              [&_pre]:my-6
              [&_pre]:text-sm
              [&_pre]:font-mono

              [&_code]:break-words
              [&_code]:whitespace-pre-wrap

              [&_a]:text-indigo-600
              [&_a]:underline
              [&_a]:break-words

              [&_img]:rounded-xl
              [&_img]:my-6
              [&_img]:max-w-full
            "
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </div>
      </Card>

      {/* MEDIA */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">🖼 Media</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Cover Image URL"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="OG Image URL"
            value={form.ogImage}
            onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
          />
        </div>
      </Card>

      {/* SEO */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          🔍 SEO Metadata
        </h2>

        <TextInput
          className="focus:ring-2 focus:ring-indigo-500"
          placeholder="Meta Title"
          value={form.metaTitle}
          onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
        />

        <Textarea
          className="focus:ring-2 focus:ring-indigo-500"
          rows={3}
          placeholder="Meta Description"
          value={form.metaDescription}
          onChange={(e) =>
            setForm({
              ...form,
              metaDescription: e.target.value
            })
          }
        />
      </Card>

      {/* ATTRIBUTES */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          🏷 Attributes
        </h2>
        <BlogTagGenerator
          content={form.content}
          onTagsGenerated={(tags) =>
            setForm({
              ...form,
              tags: tags.join(", ")
            })
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Author Name"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />

          <TextInput
            className="focus:ring-2 focus:ring-indigo-500"
            placeholder="Reading Time (e.g. 8 min read)"
            value={form.readingTime}
            onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
          />
        </div>
      </Card>

      {/* SETTINGS */}
      <Card className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">⚙️ Settings</h2>

        <div className="space-y-3">
          <ToggleSwitch
            checked={form.isFeatured}
            label="Featured Blog"
            onChange={(v) => setForm({ ...form, isFeatured: v })}
          />

          <ToggleSwitch
            checked={form.allowComments}
            label="Allow Comments"
            onChange={(v) => setForm({ ...form, allowComments: v })}
          />

          <ToggleSwitch
            checked={form.publishNow}
            label="Publish Immediately"
            onChange={(v) => setForm({ ...form, publishNow: v })}
          />
        </div>
      </Card>

      {/* ACTION BAR */}
      <div className="sticky bottom-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row justify-end gap-3">
        <Button color="gray">Cancel</Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600"
        >
          {loading ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
        </Button>
      </div>
    </motion.div>
  );
}