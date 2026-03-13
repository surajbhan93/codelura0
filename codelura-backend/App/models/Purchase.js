import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  courseTitle: String,

  amount: Number,

  razorpay_order_id: String,

  razorpay_payment_id: String,

  razorpay_signature: String,

  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success"
  }

}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);