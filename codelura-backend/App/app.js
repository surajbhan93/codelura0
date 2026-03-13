
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import premiumRoutes from "./routes/premium.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import adminBlogRoutes from "./routes/admin.blog.routes.js";
import authRoutes from "./routes/authRoutes.js";
import adminCourseRoutes from "./routes/admin/course.admin.routes.js";
import courseRoutes from "./routes/web/course.routes.js";
// import serviceRoutes from "./routes/web/service.routes.js";
import serviceRoutes from "./routes/web/service.routes.js";
import workRoutes from "./routes/work.routes.js";
import adminServiceRoutes from "./routes/admin/service.admin.routes.js";
import aiRoutes from "./routes/web/ai.routes.js";
import contactRoutes from "./routes/contactRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import programAdminRoutes from "./routes/admin/program.admin.route.js";
import programWebRoutes from "./routes/web/program.route.js";
// import paymentRoutes from "./routes/payment.routes.js";
import { webhookHandler } from "./controllers/web/payment.controller.js";
import paymentRoutes from "./routes/payment.routes.js";
import autogbpRoutes from "./routes/web/autogbp.routes.js";
import googleRoutes from "./routes/google.route.js";
import hackathonRoutes from "./routes/hackathon.routes.js";
import hackathonAdminRoute from "./routes/admin/hackthon.admin.routes.js";
import bodyParser from "body-parser";
import path from "path";
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3003",
      "http://10.100.125.51:3003"
    ],
    credentials: true
  })
);

app.use(cookieParser());

// ❌ GLOBAL body parsers hata do
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// ✅ JSON only for non-file APIs
app.use("/api/auth", express.json(), authRoutes);
app.use("/api/blogs", express.json(), blogRoutes);
app.use("/api", express.json(), commentRoutes);
app.use(
  "/api/admin/blogs",
  express.json({ limit: "10mb" }),
  express.urlencoded({ limit: "10mb", extended: true }),
  adminBlogRoutes
);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
// ✅ FILE UPLOAD ROUTE (NO json/urlencoded)
app.use("/api/contact",express.json(), contactRoutes);
app.use("/api/testimonial",express.json(), testimonialRoutes);
app.use("/api/admin", adminCourseRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin/services", express.json(), adminServiceRoutes);
// app.use("/api/premium", premiumRoutes);
app.use("/api/premium", express.json(), premiumRoutes);
// ✅ web APIs
app.use("/api", express.json(), courseRoutes);
app.use("/api/work", express.json(), workRoutes);
// 🔥 AI Semantic Search Route

app.use("/api", aiRoutes);

// program 
app.use("/api/admin/program",express.json(), programAdminRoutes);
app.use("/api/program",express.json(), programWebRoutes);

// Razorpay webhook (raw body required)
// Razorpay webhook (raw body required)
app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookHandler
);

app.use("/api/payment", express.json(), paymentRoutes);

// Google businees auto 

app.use("/api/autogbp",express.json(), autogbpRoutes);
app.use("/api/google", googleRoutes);

// hackathonRoutes
app.use("/api/hackathons", express.json(), hackathonRoutes);
app.use("/api/participation", express.json(), hackathonRoutes); // Reusing the same router which has /join


//admin
app.use("/api/admin", express.json(), hackathonAdminRoute); // 
export default app;
