import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/author/undefined",   // agar authorName kabhi empty ho to broken URL na crawl ho
          "/*?*",                 // query-param URLs (jaise ?tag=, ?page=) duplicate content se bachne ke liye
        ],
      },
    ],
    sitemap: "https://codelura.com/sitemap.xml",
  };
}