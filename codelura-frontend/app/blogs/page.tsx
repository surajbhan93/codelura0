import api from "@/lib/api";
import BlogCard from "@/components/blog/BlogCard";
import BlogSearch from "@/components/blog/BlogSearch";
import { Suspense, cache } from "react";
import { Metadata } from "next";

// ─── Types ───
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  readingTime: string;
  tags: string[];
  isFeatured: boolean;
  category?: string;
  createdAt?: string;
  publishedAt?: string;
}

// ─── Metadata ───
// ─── Metadata ───
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}): Promise<Metadata> {
  const { tag, page } = await searchParams;
  const baseUrl = "https://codelura.com/blogs";

  const title = tag
    ? `${tag} Articles | Craft & Code Perspectives`
    : "Blog | Craft & Code Perspectives";

  const description = tag
    ? `Explore articles tagged with "${tag}" — backend, frontend, and system design insights.`
    : "Deep dives into backend architecture, frontend craft, and system design — written for builders, by builders.";

  // Filtered/paginated views ko index nahi karna — sirf main listing index ho
  const isFiltered = Boolean(tag || (page && page !== "1"));

  return {
    title,
    description,
    alternates: {
      canonical: baseUrl, // hamesha main /blogs page ki taraf point kare
    },
    robots: {
      index: !isFiltered,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: baseUrl,
    },
  };
}

// ─── Cache Configuration ───
export const revalidate = 60; // refresh every hour

// ─── Data Fetching ───
const getBlogs = cache(async (): Promise<Blog[]> => {
  try {
    const { data } = await api.get("/blogs");
    return data.blogs || [];
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
});

// ─── Page Component ───
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const { tag } = await searchParams;
  const blogs = await getBlogs();

  // Agar tag query hai to filter kar do (client-side hi sahi, abhi ke liye)
  const filteredBlogs = tag
    ? blogs.filter((b) => b.tags?.includes(tag))
    : blogs;

const featuredBlogs = filteredBlogs.filter((b) => b.isFeatured);
  const normalBlogs = filteredBlogs.filter((b) => !b.isFeatured);
  const totalTags = new Set(blogs.flatMap((b) => b.tags || [])).size;
 const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tag ? `${tag} Articles` : "Blog | Craft & Code Perspectives",
    description:
      "Deep dives into backend architecture, frontend craft, and system design.",
    url: "https://codelura.com/blogs",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filteredBlogs.slice(0, 20).map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://codelura.com/blogs/${blog.slug}`,
        name: blog.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Craft &amp; Code <span className="text-orange-600">Perspectives</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl">
            Deep dives into backend architecture, frontend craft, and system design —
            written for builders, by builders.
          </p>

          <div className="mt-6 max-w-lg">
            <Suspense fallback={<div className="h-11 bg-gray-100 rounded-lg animate-pulse" />}>
              <BlogSearch />
            </Suspense>
          </div>

          <div className="flex gap-8 mt-8 pt-6 border-t border-gray-100 text-sm">
            <div>
              <span className="text-2xl font-bold text-gray-900">{blogs.length}</span>
              <p className="text-gray-500">Articles</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{featuredBlogs.length}</span>
              <p className="text-gray-500">Featured</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">{totalTags}</span>
              <p className="text-gray-500">Topics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* ─── Featured Section ─── */}
        {featuredBlogs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              ⭐ Featured <span className="text-orange-600">Stories</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} featured />
              ))}
            </div>
          </section>
        )}

        {/* ─── All Other Blogs ─── */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Blogs</h2>

          {normalBlogs.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <p className="text-lg text-gray-800 mb-1">No more articles</p>
              <p className="text-sm">Check back soon for fresh content.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}