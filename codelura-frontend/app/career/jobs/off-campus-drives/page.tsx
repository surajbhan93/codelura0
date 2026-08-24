import api from "@/lib/api";
import OffCampusJobsClient from "./Offcampusjobsclient";
// import type { Job } from "../JobsPageClient";
// import JobSearch from "@/components/jobs/JobSearch";
import type { Job } from "@/components/career/JobsPageClient";

export const dynamic = "force-dynamic";

export default async function OffCampusJobsPage() {
  let jobs: Job[] = [];

  try {
    // ✅ Active + Expired dono parallel fetch karo, sirf off-campus filter client side hoga
    const [activeRes, expiredRes] = await Promise.all([
      api.get("/jobs?type=off-campus&limit=100"),
      api.get("/jobs?type=off-campus&expired=true&limit=100"),
    ]);

    const activeJobs  = activeRes.data.jobs  || [];
    const expiredJobs = expiredRes.data.jobs || [];

    jobs = [...activeJobs, ...expiredJobs];
  } catch (error) {
    console.error("Failed to fetch off-campus jobs:", error);
  }

  return <OffCampusJobsClient jobs={jobs} />;
}