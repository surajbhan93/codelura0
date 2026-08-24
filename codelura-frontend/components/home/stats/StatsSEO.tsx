// components/stats/StatsSEO.tsx
export default function StatsSEO() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codelura",
    description:
      "AI-powered developer platform with 10,000+ developers, 1,200+ resources, mentorship sessions and websites built.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "3500",
    },
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}