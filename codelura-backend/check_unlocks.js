import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function check() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  const unlockSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, referralId: mongoose.Schema.Types.ObjectId, createdAt: Date });
  const PremiumReferralUnlock = mongoose.model("PremiumReferralUnlock", unlockSchema, "premiumreferralunlocks");

  const unlocks = await PremiumReferralUnlock.find({}).lean();
  console.log("TOTAL UNLOCKS IN DB:", unlocks.length);
  console.log(JSON.stringify(unlocks, null, 2));

  await mongoose.disconnect();
}

check().catch(console.error);
