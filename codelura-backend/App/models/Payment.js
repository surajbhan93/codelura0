const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "PremiumPlan" },

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  amount: Number,
  currency: { type: String, default: "INR" },

  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);