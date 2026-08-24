

import api from "@/lib/api";
import JobsPageClient from "./JobsPageClient";
import type { Job } from "./JobsPageClient";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  let jobs: Job[] = [];

  try {
    // ✅ Active + Expired dono parallel fetch karo
    const [activeRes, expiredRes] = await Promise.all([
      api.get("/jobs?limit=100"),
      api.get("/jobs?expired=true&limit=100"),
    ]);

    const activeJobs  = activeRes.data.jobs  || [];
    const expiredJobs = expiredRes.data.jobs || [];

    jobs = [...activeJobs, ...expiredJobs];
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  }

  return <JobsPageClient jobs={jobs} />;
}