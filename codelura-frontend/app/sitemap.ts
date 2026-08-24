// ═══════════════════════════════════════════════════════════════
// app/sitemap.ts — Auto-generate sitemap for all SEO pages + blogs
// ═══════════════════════════════════════════════════════════════
// (Save this as app/sitemap.ts)

import type { MetadataRoute } from "next";
import { allSEOPages } from "./seo/seoConfig";

// ─── Fetch all published blog slugs ───
async function getAllBlogSlugs() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
    const res = await fetch(`${API_URL}/blogs/sitemap`, {
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data?.blogs || [];
  } catch (err) {
    console.error("Sitemap blog fetch failed:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://codelura.com";

  // ─── Blog Posts (Dynamic) ───
  const blogs = await getAllBlogSlugs();

  const blogPages = blogs
    .filter((blog: any) => !blog.noIndex) // noIndex wale blogs sitemap se bahar
    .map((blog: any) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(
        blog.lastModifiedAt || blog.updatedAt || blog.publishedAt || blog.createdAt
      ),
      changeFrequency: "weekly" as const,
      priority: blog.isFeatured ? 0.9 : 0.75,
    }));

  // ─── SEO Landing Pages ───
  const seoPages = allSEOPages.map((page) => ({
    url: `${baseUrl}/seo/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.category === "service" ? 0.9 : 0.8,
  }));

  // ─── Static Pages ───
  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "daily" as const },

    { url: `${baseUrl}/about`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/contact`, priority: 0.9, changeFrequency: "monthly" as const },

    { url: `${baseUrl}/blogs`, priority: 0.85, changeFrequency: "daily" as const },
    { url: `${baseUrl}/courses`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/work`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/services`, priority: 0.85, changeFrequency: "weekly" as const },

    { url: `${baseUrl}/premium`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/career-programs`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/membership-plans`, priority: 0.8, changeFrequency: "monthly" as const },

    { url: `${baseUrl}/hackathons`, priority: 0.85, changeFrequency: "weekly" as const },

    { url: `${baseUrl}/privacy`, priority: 0.5, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/terms`, priority: 0.5, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/refund`, priority: 0.5, changeFrequency: "yearly" as const },

    { url: `${baseUrl}/cookies`, priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/protection`, priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/gdpr`, priority: 0.4, changeFrequency: "yearly" as const },
    { url: `${baseUrl}/accessibility`, priority: 0.4, changeFrequency: "yearly" as const }, // ✅ typo fixed
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
  }));

  return [...staticPages, ...blogPages, ...seoPages];
}