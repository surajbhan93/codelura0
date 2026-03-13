import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["DSA", "Web Development", "Backend", "Other"],
      default: "Other",
    },

    price: {
      type: Number,
      required: false,
    },

    platformLink: {
      type: String,
      required: true, // Unolearning link
    },
    clickCount: {
  type: Number,
  default: 0,
},

    image: {
      type: String,
    },
order: {
      type: Number,
      default: 0,
    },
    points: {
  type: [String],
  default: [],
},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Program ||
  mongoose.model("Program", programSchema);