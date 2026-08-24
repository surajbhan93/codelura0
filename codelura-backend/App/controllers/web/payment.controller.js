import crypto from "crypto";
// import razorpay from "../../config/razorpay.js";
import razorpay from "../../config/razorpay.js";
import PremiumService from "../../models/PremiumService.js";
import PremiumSubscription from "../../models/PremiumSubscription.js";
import User from "../../models/User.js";
import Coupon from "../../models/Coupon.js"; // 👈 add karo
/* =====================================================
   1️⃣ CREATE ORDER
===================================================== */

export const createOrder = async (req, res) => {
  try {
    const { serviceId, couponCode } = req.body; // 👈 couponCode bhi lo

    if (!serviceId)
      return res.status(400).json({ message: "Service ID required" });

    const service = await PremiumService.findById(serviceId);
    if (!service || !service.isActive)
      return res.status(404).json({ message: "Service not available" });

    // 👇 discountedPrice ho toh wahi base price
    let amount = service.discountedPrice ?? service.price;

    // 👇 Coupon apply karo agar bheja ho
    if (couponCode) {
      const coupon = await Coupon.findOne({  // Coupon import karna padega
        code: couponCode.toUpperCase().trim(),
        isActive: true,
      });

      if (coupon) {
        const discount =
          coupon.discountType === "percentage"
            ? Math.round((amount * coupon.discountValue) / 100)
            : coupon.discountValue;

        amount = Math.max(1, amount - discount); // minimum ₹1
      }
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // 👈 correct amount
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      service,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ message: "Order creation failed" });
  }
};
/* =====================================================
   2️⃣ VERIFY PAYMENT
===================================================== */
export const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      serviceId,
      name,
      telegramUsername,
      mobile,
      email,
      note,
    } = req.body;

    /* ================= USER ================= */

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    /* ================= VALIDATION ================= */

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment details"
      });
    }

    /* ================= SIGNATURE VERIFY ================= */

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid signature"
      });
    }

    /* ================= SERVICE ================= */

    const service = await PremiumService.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    /* ================= SUBSCRIPTION DATES ================= */

    const startDate = new Date();

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + service.durationInMonths);

    /* ================= CREATE SUBSCRIPTION ================= */
// 👇 BAS YE LINE ADD KARO — service.price ki jagah
const basePrice = service.discountedPrice ?? service.price;

    const subscription = await PremiumSubscription.create({
      user: userId,
      premiumService: service._id,

      name,
      telegramUsername,
      mobile,
      email,
      note,
     finalAmount: basePrice, // 👈 service.price tha, ab basePrice
      finalAmount: service.price,
      status: "approved",

      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & subscription activated",
      subscription,
    });

  } catch (error) {

    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      message: "Verification failed"
    });

  }
};
/* =====================================================
   3️⃣ WEBHOOK HANDLER (PRODUCTION SAFETY)
===================================================== */
export const webhookHandler = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      console.log("Payment captured via webhook");
      // Optional: extra validation logic
    }

    return res.status(200).json({ status: "ok" });

  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ message: "Webhook failed" });
  }
};




//PDF notes ke liye Payement 