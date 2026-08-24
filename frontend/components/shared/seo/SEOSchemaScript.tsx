// ═══════════════════════════════════════════════════════════════
// components/seo/SEOSchemaScript.tsx
// Generates JSON-LD schema per page type
// ═══════════════════════════════════════════════════════════════
import type { SEOPageData } from "@/seo/seoConfig";

export default function SEOSchemaScript({ page }: { page: SEOPageData }) {
  const baseUrl = "https://codelura.com";
  const url = `${baseUrl}/seo/${page.slug}`;

  // ── FAQ Schema ──────────────────────────────────────────────
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  // ── Service Schema ──────────────────────────────────────────
  const serviceSchema =
    page.schema === "Service"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.title,
          description: page.metaDescription,
          url,
          provider: {
            "@type": "Organization",
            name: "Codelura",
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              url: `${baseUrl}/contact`,
            },
          },
          areaServed: ["IN", "US", "GB", "AE", "CA", "AU"],
          serviceType: page.title,
          keywords: page.keywords.join(", "),
        }
      : null;

  // ── Organization Schema ─────────────────────────────────────
  const orgSchema =
    page.schema === "Organization"
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Codelura",
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          description: page.metaDescription,
          sameAs: [
            "https://twitter.com/codelura",
            "https://linkedin.com/company/codelura",
            "https://instagram.com/codelura",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            url: `${baseUrl}/contact`,
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
          },
        }
      : null;

  // ── Course / Topic Schema ───────────────────────────────────
  const courseSchema =
    page.schema === "Course"
      ? {
          "@context": "https://schema.org",
          "@type": "Course",
          name: page.title,
          description: page.metaDescription,
          url,
          provider: {
            "@type": "Organization",
            name: "Codelura",
            url: baseUrl,
          },
        }
      : null;

  // ── Article Schema ──────────────────────────────────────────
  const articleSchema =
    page.schema === "Article"
      ? {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: page.title,
          description: page.metaDescription,
          url,
          publisher: {
            "@type": "Organization",
            name: "Codelura",
            url: baseUrl,
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo.png`,
            },
          },
        }
      : null;

  const schemas = [
    faqSchema,
    serviceSchema,
    orgSchema,
    courseSchema,
    articleSchema,
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}


