import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function check() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  const jobSchema = new mongoose.Schema({ title: String, type: String, company: String, isExpired: Boolean });
  const Job = mongoose.model("Job", jobSchema, "jobs");

  // Query 1: All Jobs (default - excluding premium-referral)
  const allJobsQuery = { isExpired: false, type: { $ne: "premium-referral" } };
  const allJobs = await Job.find(allJobsQuery).select("title type company").lean();
  console.log("=== ALL JOBS (/admin/jobs) Count:", allJobs.length, "===");
  console.log("Any premium-referral in All Jobs?", allJobs.some(j => j.type === "premium-referral"));

  // Query 2: Premium Referral Jobs (/admin/premium-referrals)
  const referralJobsQuery = { isExpired: false, type: "premium-referral" };
  const referralJobs = await Job.find(referralJobsQuery).select("title type company").lean();
  console.log("=== REFERRAL JOBS (/admin/premium-referrals) Count:", referralJobs.length, "===");
  console.log(referralJobs);

  await mongoose.disconnect();
}

check().catch(console.error);
