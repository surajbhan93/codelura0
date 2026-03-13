

// ═══════════════════════════════════════════════════════════════
// app/sitemap.ts — Auto-generate sitemap for all SEO pages
// ═══════════════════════════════════════════════════════════════
// (Save this as app/sitemap.ts)

import type { MetadataRoute } from "next";
import { allSEOPages } from "@/app/seo/seoConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codelura.com";

  const seoPages = allSEOPages.map((page) => ({
    url: `${baseUrl}/seo/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: page.category === "service" ? 0.9 : 0.8,
  }));

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
    { url: `${baseUrl}/accessibilityy`, priority: 0.4, changeFrequency: "yearly" as const },
  ].map((p) => ({
    ...p,
    lastModified: new Date(),
  }));

  return [...staticPages, ...seoPages];
}