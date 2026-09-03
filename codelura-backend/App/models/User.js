import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: false,
      default: null
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    // 🔐 Email verification
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifyToken: String,


    
//     referralCode: {
//   type: String,
//   unique: true,
// },

referralCode: {
  type: String,
  unique: true,
  sparse: true,  // 👈 yahi add karo
},

referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

walletBalance: {
  type: Number,
  default: 0,
},
    // 🔐 Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // 💳 PAID COURSES / NOTES (NEW)
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    enrolledPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program"
      }
    ],
    enrolledCareerTracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CareerTrack"
      }
    ],
    savedCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
    ],
  },
  { timestamps: true }
);

/**
 * ⚠️ IMPORTANT
 * - DO NOT use arrow function
 * - DO NOT change function signature
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

export default mongoose.model("User", userSchema);

