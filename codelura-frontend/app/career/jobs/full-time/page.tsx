import api from "@/lib/api";
import FullTimeJobsClient from "./Fulltimejobsclient";
// import type { Job } from "../JobsPageClient";
import type { Job } from "@/components/career/JobsPageClient";


export const dynamic = "force-dynamic";

export default async function FullTimeJobsPage() {
  let jobs: Job[] = [];

  try {
    // ✅ Active + Expired dono parallel fetch karo, sirf full-time filter client side hoga
    const [activeRes, expiredRes] = await Promise.all([
      api.get("/jobs?type=full-time&limit=100"),
      api.get("/jobs?type=full-time&expired=true&limit=100"),
    ]);

    const activeJobs  = activeRes.data.jobs  || [];
    const expiredJobs = expiredRes.data.jobs || [];

    jobs = [...activeJobs, ...expiredJobs];
  } catch (error) {
    console.error("Failed to fetch full-time jobs:", error);
  }

  return <FullTimeJobsClient jobs={jobs} />;
}