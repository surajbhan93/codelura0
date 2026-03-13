import dotenv from "dotenv";
import app from "./App/app.js";
import connectDB from "./App/config/db.js";
import cors from "cors";
import { startAutoGBP } from "./App/cron/autogbp.cron.js";
dotenv.config();
connectDB();
startAutoGBP();
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
