import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    subject: {
      type: String,
      enum: [
        "hackathon",
        "notes",
        "membership",
        "collaboration",
        "general",
      ],
      default: "general",
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "replied", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "ContactMessage",
  contactMessageSchema
);