import crypto from "crypto";
import mongoose from "mongoose";
import razorpay, { getRazorpay } from "../../config/razorpay.js";
import Enrollment from "../../models/Enrollment.js";
import Course from "../../models/Course.js";
import Program from "../../models/Program.js";
import CareerTrack from "../../models/CareerTrack.js";
import User from "../../models/User.js";
import Coupon from "../../models/Coupon.js";

// Helper to get model by type
const getItemModel = (itemType) => {
  switch (itemType) {
    case "Course":
      return Course;
    case "Program":
      return Program;
    case "CareerTrack":
      return CareerTrack;
    default:
      return null;
  }
};

// Helper to unlock all child Programs when a Career Track is purchased
const unlockChildProgramsForCareerTrack = async (userId, careerTrackId) => {
  try {
    const track = await CareerTrack.findById(careerTrackId);
    if (!track || !track.courses || track.courses.length === 0) return;

    // Add all child Program IDs to user.enrolledPrograms
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledPrograms: { $each: track.courses } },
    });

    // Create / Update Enrollment records for each child program so they show in user dashboard!
    for (const progId of track.courses) {
      const prog = await Program.findById(progId);
      if (prog) {
        await Enrollment.findOneAndUpdate(
          { user: userId, itemRef: progId },
          {
            user: userId,
            itemType: "Program",
            itemRef: progId,
            itemTitle: prog.name || prog.title || "Program",
            amount: 0,
            paymentStatus: "completed",
            enrollmentStatus: "active",
            unlockedViaCareerTrack: true,
            parentCareerTrack: careerTrackId,
            enrolledAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }
    }
  } catch (err) {
    console.error("Error unlocking child programs for career track:", err);
  }
};

/* =====================================================
   1️⃣ CREATE ENROLLMENT ORDER (RAZORPAY)
===================================================== */
export const createEnrollmentOrder = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { itemType, itemId, couponCode } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: "Item type (Course/Program/CareerTrack) and item ID are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${itemType || "item"} ID format`,
      });
    }

    const Model = getItemModel(itemType);
    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid item type" });
    }

    const item = await Model.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: `${itemType} not found` });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      itemRef: itemId,
      paymentStatus: "completed",
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: `You are already enrolled in this ${itemType.toLowerCase()}`,
      });
    }

    // If enrolling in a Program, check if user already owns a parent CareerTrack
    if (itemType === "Program") {
      const userTrackEnrollments = await Enrollment.find({
        user: userId,
        itemType: "CareerTrack",
        paymentStatus: "completed",
      });

      if (userTrackEnrollments.length > 0) {
        const trackIds = userTrackEnrollments.map((e) => e.itemRef);
        const matchingTrack = await CareerTrack.findOne({
          _id: { $in: trackIds },
          courses: itemId,
        });

        if (matchingTrack) {
          return res.status(400).json({
            success: false,
            message: `You already have full access to this program through your enrolled Career Track "${matchingTrack.title}". No need to purchase separately!`,
          });
        }
      }
    }

    // Calculate base price
    let basePrice = 0;
    if (itemType === "Course") {
      basePrice = item.price || 0;
    } else if (itemType === "Program") {
      basePrice = item.discountPrice !== undefined && item.discountPrice > 0 ? item.discountPrice : (item.price || 0);
    } else if (itemType === "CareerTrack") {
      basePrice = item.discountPrice !== undefined && item.discountPrice > 0 ? item.discountPrice : (item.price || 0);
    }

    const itemTitle = item.title || item.name || "Untitled Course";

    // Handle Free Item Direct Enrollment
    if (basePrice <= 0) {
      const freeEnrollment = await Enrollment.create({
        user: userId,
        itemType,
        itemRef: itemId,
        itemTitle,
        amount: 0,
        paymentStatus: "completed",
        enrollmentStatus: "active",
        enrolledAt: new Date(),
      });

      // Update User & Item stats
      const userUpdateField =
        itemType === "Course"
          ? "purchasedCourses"
          : itemType === "Program"
          ? "enrolledPrograms"
          : "enrolledCareerTracks";

      await User.findByIdAndUpdate(userId, { $addToSet: { [userUpdateField]: itemId } });
      await Model.findByIdAndUpdate(itemId, { $inc: { enrollments: 1 } });

      if (itemType === "CareerTrack") {
        await unlockChildProgramsForCareerTrack(userId, itemId);
      }

      return res.status(200).json({
        success: true,
        isFree: true,
        message: `Successfully enrolled in free ${itemType.toLowerCase()}!`,
        enrollment: freeEnrollment,
      });
    }

    // Handle Coupon Discount
    let finalAmount = basePrice;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (coupon) {
        discountAmount =
          coupon.discountType === "percentage"
            ? Math.round((basePrice * coupon.discountValue) / 100)
            : coupon.discountValue;

        finalAmount = Math.max(1, basePrice - discountAmount);
      }
    }

    // Create Razorpay Order with fallback
    let order;
    try {
      const options = {
        amount: Math.round(finalAmount * 100), // amount in paise
        currency: "INR",
        receipt: `enroll_${Date.now()}`,
        notes: {
          userId: userId.toString(),
          itemType,
          itemId: itemId.toString(),
        },
      };

      const rzp = getRazorpay();
      order = await rzp.orders.create(options);
    } catch (rzpErr) {
      console.warn("Razorpay API Key Auth Error, using local test order fallback:", rzpErr?.message || rzpErr);
      order = {
        id: `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount: Math.round(finalAmount * 100),
        currency: "INR",
      };
    }

    // Save pending Enrollment record
    const enrollment = await Enrollment.create({
      user: userId,
      itemType,
      itemRef: itemId,
      itemTitle,
      amount: finalAmount,
      currency: "INR",
      couponCode: couponCode || "",
      discountAmount,
      paymentStatus: "pending",
      enrollmentStatus: "active",
      razorpayOrderId: order.id,
    });

    const isTestMode = order.id.startsWith("order_test_");

    return res.status(200).json({
      success: true,
      isFree: false,
      isTestMode,
      enrollmentId: enrollment._id,
      orderId: order.id,
      amount: finalAmount,
      currency: "INR",
      key: (process.env.RAZORPAY_KEY_ID || "rzp_test_S8BjiwOqvmp8HX").trim(),
      itemTitle,
    });
  } catch (error) {
    console.error("Create Enrollment Order Error:", error);
    return res.status(500).json({
      success: false,
      message: error?.error?.description || error?.description || error?.message || "Enrollment order creation failed",
      error: error?.error?.description || error?.message,
    });
  }
};

/* =====================================================
   2️⃣ VERIFY ENROLLMENT PAYMENT (RAZORPAY SIGNATURE)
===================================================== */
export const verifyEnrollmentPayment = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment parameters",
      });
    }

    // Signature Verification (With Test Order Exemption)
    const isTestOrder = razorpay_order_id.startsWith("order_test_");
    if (!isTestOrder) {
      const secret = (process.env.RAZORPAY_KEY_SECRET || "xwHQcoDAMzZX2RVb2WgirkTM").trim();
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        if (enrollmentId) {
          await Enrollment.findByIdAndUpdate(enrollmentId, {
            paymentStatus: "failed",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature. Verification failed.",
        });
      }
    }

    // Find Enrollment Record
    let enrollment;
    if (enrollmentId) {
      enrollment = await Enrollment.findById(enrollmentId);
    } else {
      enrollment = await Enrollment.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment record not found" });
    }

    // Update Enrollment Status to Completed
    enrollment.paymentStatus = "completed";
    enrollment.enrollmentStatus = "active";
    enrollment.razorpayPaymentId = razorpay_payment_id;
    enrollment.razorpaySignature = razorpay_signature;
    enrollment.enrolledAt = new Date();
    await enrollment.save();

    // Update User purchased/enrolled arrays
    const userUpdateField =
      enrollment.itemType === "Course"
        ? "purchasedCourses"
        : enrollment.itemType === "Program"
        ? "enrolledPrograms"
        : "enrolledCareerTracks";

    await User.findByIdAndUpdate(userId, {
      $addToSet: { [userUpdateField]: enrollment.itemRef },
    });

    if (enrollment.itemType === "CareerTrack") {
      await unlockChildProgramsForCareerTrack(userId, enrollment.itemRef);
    }

    // Increment item enrollments stat
    const Model = getItemModel(enrollment.itemType);
    if (Model) {
      await Model.findByIdAndUpdate(enrollment.itemRef, {
        $inc: { enrollments: 1 },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Payment verified & successfully enrolled in ${enrollment.itemTitle}!`,
      enrollment,
    });
  } catch (error) {
    console.error("Verify Enrollment Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/* =====================================================
   3️⃣ GET MY ENROLLMENTS (USER)
===================================================== */
export const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const enrollments = await Enrollment.find({
      user: userId,
      paymentStatus: "completed",
    })
      .populate("itemRef")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    console.error("Get My Enrollments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    });
  }
};

/* =====================================================
   4️⃣ GET ALL ENROLLMENTS (ADMIN)
===================================================== */
export const getAllEnrollmentsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      paymentStatus,
      itemType,
      search,
    } = req.query;

    const query = {};

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (itemType) query.itemType = itemType;

    const skip = (Number(page) - 1) * Number(limit);

    const [enrollments, total] = await Promise.all([
      Enrollment.find(query)
        .populate("user", "name email")
        .populate("itemRef")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Enrollment.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: enrollments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get All Enrollments Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin enrollments",
      error: error.message,
    });
  }
};

/* =====================================================
   5️⃣ MANUAL ENROLLMENT (ADMIN)
===================================================== */
export const manualAdminEnroll = async (req, res) => {
  try {
    const { userId, itemType, itemId } = req.body;

    if (!userId || !itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: "userId, itemType (Course/Program/CareerTrack), and itemId are required",
      });
    }

    const Model = getItemModel(itemType);
    if (!Model) {
      return res.status(400).json({ success: false, message: "Invalid item type" });
    }

    const [targetUser, item] = await Promise.all([
      User.findById(userId),
      Model.findById(itemId),
    ]);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!item) {
      return res.status(404).json({ success: false, message: `${itemType} not found` });
    }

    const itemTitle = item.title || item.name || "Untitled";

    const enrollment = await Enrollment.create({
      user: userId,
      itemType,
      itemRef: itemId,
      itemTitle,
      amount: 0,
      paymentStatus: "completed",
      enrollmentStatus: "active",
      enrolledAt: new Date(),
    });

    const userUpdateField =
      itemType === "Course"
        ? "purchasedCourses"
        : itemType === "Program"
        ? "enrolledPrograms"
        : "enrolledCareerTracks";

    await User.findByIdAndUpdate(userId, {
      $addToSet: { [userUpdateField]: itemId },
    });

    if (itemType === "CareerTrack") {
      await unlockChildProgramsForCareerTrack(userId, itemId);
    }

    await Model.findByIdAndUpdate(itemId, {
      $inc: { enrollments: 1 },
    });

    return res.status(200).json({
      success: true,
      message: `User ${targetUser.name} manually enrolled in ${itemTitle}`,
      enrollment,
    });
  } catch (error) {
    console.error("Manual Admin Enroll Error:", error);
    return res.status(500).json({
      success: false,
      message: "Manual enrollment failed",
      error: error.message,
    });
  }
};
