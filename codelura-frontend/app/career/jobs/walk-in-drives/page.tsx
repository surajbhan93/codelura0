import api from "@/lib/api";
import WalkInJobsClient from "./Walkinjobsclient";
// import type { Job } from "../JobsPageClient";
import type { Job } from "@/components/career/JobsPageClient";


export const dynamic = "force-dynamic";

export default async function WalkInJobsPage() {
  let jobs: Job[] = [];

  try {
    // ✅ Active + Expired dono parallel fetch karo, sirf walk-in filter client side hoga
    const [activeRes, expiredRes] = await Promise.all([
      api.get("/jobs?type=walk-in&limit=100"),
      api.get("/jobs?type=walk-in&expired=true&limit=100"),
    ]);

    const activeJobs  = activeRes.data.jobs  || [];
    const expiredJobs = expiredRes.data.jobs || [];

    jobs = [...activeJobs, ...expiredJobs];
  } catch (error) {
    console.error("Failed to fetch walk-in jobs:", error);
  }

  return <WalkInJobsClient jobs={jobs} />;
}