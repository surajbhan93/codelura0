import Link from "next/link";
import { Suspense } from "react";
import { 
  Clock, Calendar, Sparkles, Eye, ArrowLeft,
  Briefcase, FileSearch, BookOpen, FileText, ArrowRight 
} from "lucide-react";
import BlogInteractiveBar from "./Bloginteractivebar";
import BlogContent from "./BlogContent";
import BlogComments from "./BlogComments";
import BlogSummary from "@/components/blog/BlogSummary";
import BlogActions from "@/components/blog/BlogActions";
import BlogRecommendations from "@/components/blog/BlogRecommendations";
import { cache } from "react";
import "./Blog-content.css";
// import styles from "./Blog-content.module.css";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
// ─── Types ───
interface FaqItem {
  question: string;
  answer: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;      // 👈 NEW
  authorName?: string;
  authorBio?: string;          // 👈 NEW
  authorImage?: string;        // 👈 NEW
  category?: string;
  readingTime?: string;
  summary?: string;
  excerpt?: string;
  tags?: string[];
  createdAt?: string;
  publishedAt?: string;
  lastModifiedAt?: string;     // 👈 NEW
  updatedAt?: string;          // 👈 NEW (timestamps se aata hai)
  views?: number;
  likes?: number;
  faqs?: FaqItem[];            // 👈 NEW
  noIndex?: boolean;           // 👈 NEW
}
// ─── API Configuration ───
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

// ─── Server-side fetch with CACHE for instant loading ───
const getBlog = cache(async (slug: string): Promise<Blog | null> => {
  try {
    const res = await fetch(`https://career.codelura.com/api/blogs/${slug}`, {
      // ISR: revalidate every 60 seconds
      next: { revalidate: 60 },
      // Add cache control for faster responses
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    // console.log("API DATA", data);
    // Return blog data safely
    return data?.blog || data || null;
  } catch (err) {
    console.error("Blog fetch failed", err);
    return null;
  }
});

// ─── Helper Functions ───
function formatDate(dateString?: string) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Generate Metadata for SEO ───
// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params;
//   const blog = await getBlog(slug);
  
//   if (!blog) {
//     return {
//       title: "Blog Not Found | CodeLura",
//       description: "The requested blog post could not be found.",
//     };
//   }
  
//   return {
//     title: `${blog.title} | CodeLura Blog`,
//     description: blog.summary || blog.excerpt || blog.content?.slice(0, 160) || "",
//     openGraph: {
//       title: blog.title,
//       description: blog.summary || blog.excerpt || "",
//       images: blog.coverImage ? [blog.coverImage] : [],
//       type: "article",
//       publishedTime: blog.publishedAt || blog.createdAt,
//       authors: blog.authorName ? [blog.authorName] : [],
//       tags: blog.tags,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: blog.title,
//       description: blog.summary || blog.excerpt || "",
//       images: blog.coverImage ? [blog.coverImage] : [],
//     },
//   };
// }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: "Blog Not Found | CodeLura",
      description: "The requested blog post could not be found.",
    };
  }

  const url = `https://codelura.com/blogs/${slug}`;
  
  return {
    title: `${blog.title} | CodeLura Blog`,
    description: blog.summary || blog.excerpt || blog.content?.slice(0, 160) || "",
    alternates: {
      canonical: url,
    },
    keywords: blog.tags?.join(", "),
    openGraph: {
      title: blog.title,
      description: blog.summary || blog.excerpt || "",
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630 }] : [],
      type: "article",
      url,
      siteName: "CodeLura",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: blog.authorName ? [blog.authorName] : [],
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary || blog.excerpt || "",
      images: blog.coverImage ? [blog.coverImage] : [],
    },
   robots: {
      index: !blog.noIndex,
      follow: true,
      googleBot: { index: !blog.noIndex, follow: true, "max-image-preview": "large" },
    },
  };
}

// ─── Page Component ───
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Fetch blog data with caching
  const blog = await getBlog(slug);

  // Handle not found
  if (!blog) {
    return (
      <div className="min-h-screen bg-[#060609] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-8 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-display">
            Article Not Found
          </h1>
          <p className="text-[#64748b] mb-8 leading-relaxed">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  // Format date once
  // const formattedDate = formatDate(blog.publishedAt || blog.createdAt);
  const formattedDate = formatDate(blog.publishedAt || blog.createdAt);

  // ─── Structured Data (AEO/GEO/SEO) ───
  const pageUrl = `https://codelura.com/blogs/${slug}`;
  const plainSummary = (blog.summary || blog.excerpt || "").replace(/<[^>]*>/g, "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: plainSummary,
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt || blog.createdAt,
    // dateModified: blog.publishedAt || blog.createdAt,
    dateModified: blog.lastModifiedAt || blog.updatedAt || blog.publishedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.authorName || "CodeLura Team",
      ...(blog.authorImage && { image: blog.authorImage }),
      ...(blog.authorBio && { description: blog.authorBio }),
    },
    publisher: {
      "@type": "Organization",
      name: "CodeLura",
      logo: {
        "@type": "ImageObject",
        url: "https://codelura.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    keywords: blog.tags?.join(", "),
    articleSection: blog.category,
  };

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://codelura.com" },
      { "@type": "ListItem", position: 2, name: "Blogs", item: "https://codelura.com/blogs" },
      { "@type": "ListItem", position: 3, name: blog.title, item: pageUrl },
    ],
  };

  const faqJsonLd = blog.faqs && blog.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blog.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-[#060609] text-white">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
     <ThemeToggle />
      {/* ─── Background Glow (Static, Zero JS) ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-fuchsia-600/4 rounded-full blur-[100px]" />
      </div>

      {/* ─── Interactive Bar ─── */}
      <BlogInteractiveBar blogId={blog._id} title={blog.title} />

      {/* ─── Main Article ─── */}
      <article className="relative max-w-[1200px] mx-auto px-6 sm:px-10 py-12 sm:py-20">
        {/* ─── Back Button ─── */}
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 mb-10 text-[#475569] hover:text-white transition-colors text-sm font-medium"
          prefetch={true}
        >
          <span className="w-8 h-8 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/8 transition-all">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
          Back
        </Link>

        {/* ─── Cover Image ─── */}
        {/* {blog.coverImage && (
          <div className="mb-14 rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-[clamp(220px,42vw,480px)] object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )} */}
        {/* ─── Cover Image ─── */}
        {blog.coverImage && (
          <div className="mb-14 rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/60 relative h-[clamp(220px,42vw,480px)]">
            <Image
              src={blog.coverImage}
              // alt={blog.title}
                alt={blog.coverImageAlt || blog.title}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}

        {/* ─── Header ─── */}
        <div className="mb-14">
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
            {blog.views !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-[11px] font-bold tracking-widest uppercase">
                <Eye className="w-3 h-3" />
                {blog.views} views
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-[56px] font-black leading-[1.15] text-white tracking-tight mb-10 break-words">
            {blog.title}
          </h1>

          {/* ─── Meta Cards ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      

            {blog.readingTime && (
              <div className="meta-card flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-0.5">
                    Reading Time
                  </p>
                  <p className="text-sm font-bold text-white">{blog.readingTime}</p>
                </div>
              </div>
            )}

            {(blog.publishedAt || blog.createdAt) && (
              <div className="meta-card flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-0.5">
                    Published
                  </p>
                  <p className="text-sm font-bold text-white">{formattedDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Summary ─── */}
        <div className="mb-14">
          <Suspense fallback={<div className="h-32 bg-[#0f0f1a] rounded-xl animate-pulse" />}>
            <BlogSummary content={blog.content} initialSummary={blog.summary} />
          </Suspense>
        </div>

        {/* ─── Content ─── */}
        <BlogContent html={blog.content} />

{/* ─── FAQ Section ─── */}
        {blog.faqs && blog.faqs.length > 0 && (
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {blog.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="rounded-xl bg-white/5 border border-white/10 p-5 group"
                >
                  <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-violet-400 group-open:rotate-45 transition-transform text-xl">+</span>
                  </summary>
                  <p className="mt-3 text-[#94a3b8] leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* ─── Tags ─── */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-14 pb-14 border-b border-white/5">
            <p className="text-[10px] font-bold text-[#334155] uppercase tracking-widest mb-5">
              Topics Covered
            </p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blogs?tag=${tag}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0f0f1a] border border-white/6 text-[#64748b] text-xs font-semibold hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/5 transition-all"
                  prefetch={true}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

{/* ─── About Author ─── */}
{blog.authorName && (
  <section className="mb-14">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <h2 className="text-2xl font-bold text-white mb-6">
        About the Author
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">

        {blog.authorImage && (
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
            <Image
              src={blog.authorImage}
              alt={blog.authorName}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1">

          <h3 className="text-xl font-bold text-white">
            {blog.authorName}
          </h3>

          {blog.authorBio && (
            <p className="mt-3 text-gray-400 leading-8">
              {blog.authorBio}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs">
              Software Engineering
            </span>

            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs">
              AI
            </span>

            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs">
              Career Guidance
            </span>

            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs">
              Remote Work
            </span>
          </div>

          <Link
            href="/blogs/"
            className="inline-flex items-center gap-2 mt-6 text-violet-400 hover:text-violet-300 font-semibold"
          >
            View all articles
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

      </div>

    </div>
  </section>
)}
        {/* ─── Career Section ─── */}
        <div className="my-14">
          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#0b0b14] via-[#121223] to-[#0b0b14] p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Boost Your Career</h2>
                <p className="text-gray-400 text-sm">
                  Explore our most popular career resources.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <Link
                href="https://career.codelura.com/career/jobs/latest"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="text-violet-400" />
                  <div>
                    <h3 className="font-semibold text-white">Latest Jobs</h3>
                    <p className="text-sm text-gray-400">Find the newest internships & jobs.</p>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="https://career.codelura.com/career/tools/ats-resume-checker"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <FileSearch className="text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">ATS Resume Checker</h3>
                    <p className="text-sm text-gray-400">Improve your resume score instantly.</p>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="https://career.codelura.com/career/learning/study-material"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="text-orange-400" />
                  <div>
                    <h3 className="font-semibold text-white">Study Material</h3>
                    <p className="text-sm text-gray-400">Notes, MCQs & interview resources.</p>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="https://career.codelura.com/career/tools/cover-letter-generator"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 hover:border-violet-500 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-pink-400" />
                  <div>
                    <h3 className="font-semibold text-white">Cover Letter Generator</h3>
                    <p className="text-sm text-gray-400">Generate a professional cover letter.</p>
                  </div>
                </div>
                <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Blog Actions ─── */}
        {/* <div className="mb-14">
          <Suspense fallback={<div className="h-12 bg-[#0f0f1a] rounded-xl animate-pulse" />}>
            <BlogActions blog={blog} />
          </Suspense>
        </div> */}
        
        {/* ─── Blog Actions ─── */}
        <div className="mb-14">
          <Suspense fallback={<div className="h-12 bg-[#0f0f1a] rounded-xl animate-pulse" />}>
            <BlogActions blog={blog} />
          </Suspense>
        </div>

        {/* ─── Divider ─── */}
        <div className="section-divider my-16" />

        {/* ─── Comments ─── */}
        <Suspense fallback={<div className="h-40 bg-[#0f0f1a] rounded-xl animate-pulse" />}>
          <BlogComments blogId={blog._id} />
        </Suspense>

        {/* ─── Divider ─── */}
        <div className="section-divider my-16" />

        {/* ─── Recommendations ─── */}
        <Suspense fallback={<div className="h-80 bg-[#0f0f1a] rounded-xl animate-pulse" />}>
          <BlogRecommendations blogId={blog._id} category={blog.category} />
        </Suspense>
      </article>
    </div>
  );
}