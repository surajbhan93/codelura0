import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    profileImage: {
      type: String,
    },

    role: {
      type: String, // Student, Client, Employee etc.
    },

    message: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    category: {
      type: String,
      enum: [
        "webservice",
        "material",
        "referral",
        "jobs",
        "membership",
        "hackathon",
        "general",
      ],
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // admin approval required
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);