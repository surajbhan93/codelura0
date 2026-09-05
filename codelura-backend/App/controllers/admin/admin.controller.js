import User from "../../models/User.js";
import Blog from "../../models/Blog.js";
import Course from "../../models/Course.js";
import PremiumService from "../../models/PremiumService.js";
import PremiumSubscription from "../../models/PremiumSubscription.js";
import Service from "../../models/Service.js";

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      totalCourses,
      totalServices,
      totalSubscriptions,
      approvedSubs
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Course.countDocuments(),
      PremiumService.countDocuments().then(async (cnt) => cnt || (await Service.countDocuments())),
      PremiumSubscription.countDocuments(),
      PremiumSubscription.find({ status: "approved" }).select("finalAmount price discountedPrice")
    ]);

    // Calculate total revenue from approved subscriptions
    const totalRevenue = approvedSubs.reduce((acc, sub) => acc + (sub.finalAmount || sub.discountedPrice || sub.price || 0), 0);

    return res.json({
      totalUsers,
      totalBlogs,
      totalCourses,
      totalServices,
      totalSubscriptions,
      totalRevenue
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR 👉", error);
    return res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};