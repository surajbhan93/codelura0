import api from "@/lib/api";
import InternshipPageClient from "./Internshipspageclient";
// import type { Job } from "@/app/jobs-Alerts/JobsPageClient";
import type { Job } from "@/components/career/JobsPageClient";
export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  let jobs: Job[] = [];

  try {
    // Sirf active jobs fetch karo
    const res = await api.get("/jobs?limit=100");

    const allJobs = res.data.jobs || [];

    // Sirf internships
    jobs = allJobs.filter(
      (job: Job) =>
        job.type === "internship" &&
        !job.isExpired
    );
  } catch (error) {
    console.error("Failed to fetch internships:", error);
  }

  return <InternshipPageClient jobs={jobs} />;
}