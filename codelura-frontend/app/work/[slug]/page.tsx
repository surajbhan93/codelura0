import { serverFetch } from "@/lib/serverFetch";
import WorkDetailClient from "./WorkDetailClient";

/* ================= TYPES ================= */
export type Work = {
  title: string;
  shortDescription?: string;
  description: string;

  clientName?: string;
  category?: string;
  industry?: string;
  role?: string;
  duration?: string;

  techStack?: string[];

  caseStudy?: {
    problem?: string;
    solution?: string;
    result?: string;
  };

  metrics?: {
    users?: string;
    performanceGain?: string;
    revenueImpact?: string;
  };

  thumbnail?: string;
  images?: string[];

  liveUrl?: string;
  githubUrl?: string;

  isFeatured?: boolean;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
};

/* ================= SEO ================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ MUST unwrap params
  const { slug } = await params;

  const res = await serverFetch(`/work/${slug}`);
  const work: Work = res.data;

  return {
    title: work.seo?.metaTitle || work.title,
    description:
      work.seo?.metaDescription ||
      work.shortDescription ||
      work.description.slice(0, 150),
  };
}

/* ================= PAGE ================= */
export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ MUST unwrap params
  const { slug } = await params;

  const res = await serverFetch(`/work/${slug}`);
  const work: Work = res.data;

  return <WorkDetailClient work={work} />;
}
