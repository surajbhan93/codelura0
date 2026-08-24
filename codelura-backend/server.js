import "dotenv/config";
import dotenv from "dotenv";
import app from "./App/app.js";
import connectDB from "./App/config/db.js";
import cors from "cors";
import { startAutoGBP } from "./App/cron/autogbp.cron.js";
import path from "path";
// github
import passport from "./App/config/passport.js";
app.use(passport.initialize());

dotenv.config();
import express from "express";
console.log("R2 KEY:", process.env.R2_ACCESS_KEY_ID);
// 🔥 force load .env from project root
dotenv.config({
  path: path.resolve(process.cwd(), ".env")
});

console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME); // 👈 debug
connectDB();
startAutoGBP();
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
