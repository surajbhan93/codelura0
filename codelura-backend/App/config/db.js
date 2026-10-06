import mongoose from "mongoose";
import dns from "node:dns";

// Fix Node.js querySrv ECONNREFUSED on Windows/local router DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignore if not supported in environment
}

const connectDB = async (retries = 5, delay = 3000) => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGO_URI is missing in environment variables!");
    return;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 20,
      });
      console.log("✅ MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`⚠️ MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) {
        console.error("❌ MongoDB final connection error:", error);
      } else {
        console.log(`🔄 Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected");
});

export default connectDB;
