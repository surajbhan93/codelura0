"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import BlogSummary from "@/components/blog/BlogSummary";
import BlogRecommendations from "@/components/blog/BlogRecommendations";
import BlogActions from "@/components/blog/BlogActions";
import CommentBox from "@/components/blog/CommentBox";
import CommentList from "@/components/blog/CommentList";
import { Clock, Calendar, ArrowLeft, Sparkles, ChevronUp } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  coverImage?: string;
  authorName?: string;
  category?: string;
  readingTime?: string;
  summary?: string;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string;
}

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data);
      } catch (err) {
        console.error("Blog fetch failed", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const blocks = document.querySelectorAll(".blog-content pre");
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
  }, [blog?.content]);

  const addCodeEnhancements = () => {
    const blocks = document.querySelectorAll(".blog-content pre");
    blocks.forEach((block) => {
      if (block.parentElement?.classList.contains("code-wrapper")) return;
      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper relative my-8 rounded-xl overflow-hidden shadow-2xl border border-white/5";
      const header = document.createElement("div");
      header.className = "flex items-center justify-between px-5 py-3 bg-[#0d0d0d] border-b border-white/5 text-xs";
      const lang = block.getAttribute("data-language") || "javascript";

      /* three mac-style dots */
      const dots = document.createElement("div");
      dots.className = "flex items-center gap-1.5";
      dots.innerHTML = `<span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span><span class="w-3 h-3 rounded-full bg-[#febc2e]"></span><span class="w-3 h-3 rounded-full bg-[#28c840]"></span>`;

      const right = document.createElement("div");
      right.className = "flex items-center gap-3";

      const langBadge = document.createElement("span");
      langBadge.className = "text-[10px] font-bold tracking-widest uppercase text-[#6ee7b7] opacity-70";
      langBadge.innerText = lang;

      const copyBtn = document.createElement("button");
      copyBtn.innerText = "Copy";
      copyBtn.className = "px-3 py-1 text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 rounded-md transition-all duration-200 font-medium text-[11px]";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(block.textContent || "");
        copyBtn.innerText = "✓ Copied";
        copyBtn.classList.add("text-emerald-400");
        setTimeout(() => {
          copyBtn.innerText = "Copy";
          copyBtn.classList.remove("text-emerald-400");
        }, 2000);
      };

      right.appendChild(langBadge);
      right.appendChild(copyBtn);
      header.appendChild(dots);
      header.appendChild(right);
      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(header);
      wrapper.appendChild(block);
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="min-h-screen bg-[#060609] flex items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <div className="loader-ring"></div>
            <p className="text-sm text-[#475569] tracking-widest uppercase font-medium animate-pulse">
              Loading article…
            </p>
          </div>
        </div>
      </>
    );
  }

  /* ─── NOT FOUND ─── */
  if (!blog) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="min-h-screen bg-[#060609] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="mb-8 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 font-display">Article Not Found</h1>
            <p className="text-[#64748b] mb-8 leading-relaxed">
              The article you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/blogs")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ─── MAIN ─── */
  return (
    <>
      <style>{globalStyles}</style>

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-50 progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-11 h-11 rounded-xl bg-[#0f0f17] border border-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all shadow-xl shadow-black/50 backdrop-blur-sm"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      <div className="min-h-screen bg-[#060609] text-white">
        {/* Ambient glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-fuchsia-600/4 rounded-full blur-[100px]" />
        </div>

        <article className="relative max-w-[860px] mx-auto px-5 sm:px-8 py-12 sm:py-20">

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 mb-10 text-[#475569] hover:text-white transition-colors text-sm font-medium"
          >
            <span className="w-8 h-8 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/8 transition-all">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            </span>
            Back
          </button>

          {/* Cover image */}
          {blog.coverImage && (
            <div className="mb-14 rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-[300px] sm:h-[420px] object-cover"
              />
            </div>
          )}

          {/* Header section */}
          <div className="mb-14">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-7">
              {blog.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {blog.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Published
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-5xl md:text-[56px] font-black leading-[1.1] text-white tracking-tight mb-10 break-words">
              {blog.title}
            </h1>

            {/* Meta cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {blog.authorName && (
                <div className="meta-card flex items-center gap-3 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-black flex-shrink-0">
                    {blog.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-0.5">Author</p>
                    <p className="text-sm font-bold text-white truncate">{blog.authorName}</p>
                  </div>
                </div>
              )}

              {blog.readingTime && (
                <div className="meta-card flex items-center gap-3 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-0.5">Reading Time</p>
                    <p className="text-sm font-bold text-white">{blog.readingTime}</p>
                  </div>
                </div>
              )}

              {(blog.publishedAt || blog.createdAt) && (
                <div className="meta-card flex items-center gap-3 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-0.5">Published</p>
                    <p className="text-sm font-bold text-white">
                      {blog.publishedAt ? formatDate(blog.publishedAt) : formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Summary */}
          <div className="mb-14">
            <BlogSummary content={blog.content} initialSummary={blog.summary} />
          </div>

          {/* Blog content */}
          <div
            className="blog-content mb-20 text-base sm:text-[17px] leading-[1.85] text-[#94a3b8] break-words
              [&_*]:break-words
              [&_h1]:font-display [&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-black [&_h1]:mt-16 [&_h1]:mb-6 [&_h1]:text-white [&_h1]:tracking-tight
              [&_h2]:font-display [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:text-white
              [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-[#e2e8f0]
              [&_p]:mb-6 [&_p]:text-[#94a3b8] [&_p]:leading-[1.85]
              [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-6 [&_ul]:space-y-2
              [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li]:before:content-['▸'] [&_ul_li]:before:absolute [&_ul_li]:before:left-0 [&_ul_li]:before:text-violet-400 [&_ul_li]:before:text-xs [&_ul_li]:before:top-[2px]
              [&_ol]:list-decimal [&_ol]:pl-8 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-[#94a3b8]
              [&_li]:mb-2 [&_li]:text-[#94a3b8]
              [&_img]:rounded-xl [&_img]:my-10 [&_img]:max-w-full [&_img]:border [&_img]:border-white/5 [&_img]:shadow-2xl [&_img]:shadow-black/50
              [&_blockquote]:relative [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500 [&_blockquote]:bg-violet-500/5 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:text-[#c4b5fd] [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl
              [&_pre]:bg-[#0a0a12] [&_pre]:text-gray-100 [&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:border [&_pre]:border-white/5
              [&_code]:whitespace-pre-wrap
              [&_:not(pre)>code]:bg-[#131320] [&_:not(pre)>code]:text-[#a78bfa] [&_:not(pre)>code]:px-2 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:font-semibold [&_:not(pre)>code]:text-[13px] [&_:not(pre)>code]:border [&_:not(pre)>code]:border-violet-500/20
              [&_a]:text-violet-400 [&_a]:font-medium [&_a]:hover:text-violet-300 [&_a]:underline [&_a]:decoration-violet-400/30 [&_a]:underline-offset-2 [&_a]:transition-colors
              [&_strong]:text-white [&_strong]:font-bold
              [&_table]:w-full [&_table]:border-collapse [&_table]:my-8 [&_table]:border [&_table]:border-white/5 [&_table]:rounded-xl [&_table]:overflow-hidden
              [&_th]:bg-[#0d0d1a] [&_th]:border-b [&_th]:border-white/5 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-white [&_th]:text-sm
              [&_td]:border-b [&_td]:border-white/4 [&_td]:px-4 [&_td]:py-3 [&_td]:text-[#94a3b8] [&_td]:text-sm
              [&_tr:last-child_td]:border-b-0
              [&_hr]:border-0 [&_hr]:my-12 [&_hr]:h-px [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-white/10 [&_hr]:to-transparent"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-14 pb-14 border-b border-white/5">
              <p className="text-[10px] font-bold text-[#334155] uppercase tracking-widest mb-5">Topics Covered</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0f0f1a] border border-white/6 text-[#64748b] text-xs font-semibold hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/5 transition-all cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Blog actions */}
          <div className="mb-14">
            <BlogActions blog={blog} />
          </div>

          {/* Divider */}
          <div className="section-divider my-16" />

          {/* Comments */}
          <div className="space-y-10">
            <CommentBox blogId={blog._id} onCommentAdded={handleRefresh} />
            <CommentList blogId={blog._id} refreshKey={refreshKey} />
          </div>

          {/* Divider */}
          <div className="section-divider my-16" />

          {/* Recommendations */}
          <BlogRecommendations blogId={blog._id} category={blog.category} />
        </article>
      </div>
    </>
  );
}

/* ─── GLOBAL STYLES ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

  .font-display { font-family: 'Syne', sans-serif !important; }
  * { font-family: 'Inter', sans-serif; }
  h1, h2, h3 { font-family: 'Syne', sans-serif; }

  .progress-bar {
    background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899);
    transition: width 0.1s linear;
    box-shadow: 0 0 12px rgba(168,85,247,0.6);
  }

  .meta-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.2s ease;
  }
  .meta-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.1);
  }

  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
  }

  .loader-ring {
    width: 36px;
    height: 36px;
    border: 2px solid rgba(124,58,237,0.15);
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Code block override for wrapper bg */
  .code-wrapper pre {
    background: #080810 !important;
    margin: 0 !important;
    border-radius: 0 !important;
    border: none !important;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }

  /* Selection */
  ::selection { background: rgba(124,58,237,0.3); color: #fff; }
`;