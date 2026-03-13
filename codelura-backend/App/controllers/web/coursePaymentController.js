import crypto from "crypto";
import razorpay from "../../config/razorpay.js";
import Course from "../../models/Course.js";
import User from "../../models/User.js";
import Purchase from "../../models/Purchase.js";
/* =====================================================
   1️⃣ CREATE COURSE ORDER
===================================================== */

export const createCourseOrder = async (req, res) => {
  try {

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID required"
      });
    }

    const course = await Course.findById(courseId);

    if (!course || !course.isPublished) {
      return res.status(404).json({
        message: "Course not available"
      });
    }

    if (!course.price || course.price <= 0) {
      return res.status(400).json({
        message: "Invalid course price"
      });
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `course_${Date.now()}`,
      notes: {
        courseId: course._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      course,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {

    console.error("Create Course Order Error:", error);

    return res.status(500).json({
      message: "Order creation failed"
    });

  }
};


/* =====================================================
   2️⃣ VERIFY COURSE PAYMENT
===================================================== */

export const verifyCoursePayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid signature"
      });
    }
   console.log("BODY:", req.body);
console.log("USER:", req.user);
console.log("SIGNATURE:", razorpay_signature);

   const course = await Course.findById(courseId);

await User.findByIdAndUpdate(userId, {
  $addToSet: { purchasedCourses: courseId }
});

await Purchase.create({
  user: userId,
  course: courseId,
  courseTitle: course.title,
  amount: course.price,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
});

    res.json({
      success: true,
      message: "Course purchased successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Verification failed"
    });

  }

};



// admin 
export const getAllPurchases = async (req, res) => {

  try {

    const purchases = await Purchase.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 });

    res.json({
      total: purchases.length,
      purchases
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch purchases"
    });

  }

};