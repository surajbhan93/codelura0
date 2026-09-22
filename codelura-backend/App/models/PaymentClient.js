import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PaymentClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined but enforces uniqueness when present
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Admin who created this client
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
PaymentClientSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
PaymentClientSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("PaymentClient", PaymentClientSchema);
