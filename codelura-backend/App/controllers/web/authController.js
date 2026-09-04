import User from "../../models/User.js";
import CampusParticipant from "../../models/CampusParticipant.js";
import CampusEarning from "../../models/CampusEarning.js";
import CampusProgramSettings from "../../models/CampusProgramSettings.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendEmail.js";

/**
 * ===============================
 * SIGNUP + EMAIL VERIFICATION
 * ===============================
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret, ref, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔒 Admin creation protection
    let finalRole = "user";
    if (role === "admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid admin secret" });
      }
      finalRole = "admin";
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check campus referral code
    let referredByUser = null;
    const incomingRef = referralCode || ref;
    if (incomingRef) {
      try {
        const participant = await CampusParticipant.findOne({ referralCode: incomingRef.toUpperCase().trim() });
        if (participant) {
          referredByUser = participant.user;
          // Award referral signup points
          const settings = await CampusProgramSettings.findOne();
          const pts = settings?.referralSignupPoints || 10;
          participant.points = (participant.points || 0) + pts;
          participant.weeklyPoints = (participant.weeklyPoints || 0) + pts;
          participant.monthlyPoints = (participant.monthlyPoints || 0) + pts;
          await participant.save();

          await CampusEarning.create({
            participant: participant._id,
            source: "referral_bonus",
            amount: 0,
            points: pts,
            status: "approved",
            description: `Campus Referral: ${name} signed up`,
          });
        }
      } catch (err) {
        console.error("Referral process error:", err);
      }
    }

    // 🔐 Email verify token
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      emailVerifyToken,
      isEmailVerified: false,
      referredBy: referredByUser,
    });

     res.status(201).json({
      message: "Signup successful. Please verify your email.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
    // 📧 EMAIL BACKGROUND ME BHEJO
    try {
 const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${emailVerifyToken}`;

await sendEmail({
  to: user.email,
  subject: "Verify your email - Codelura",
  html: `
  <div style="
    max-width:600px;
    margin:40px auto;
    padding:32px;
    background:#ffffff;
    border-radius:12px;
    font-family:Arial,Helvetica,sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,0.08);
  ">
    
    <h1 style="
      text-align:center;
      font-size:28px;
      margin-bottom:10px;
      color:#111827;
    ">
      Codelura<span style="color:#6366f1;">.</span>
    </h1>

    <p style="
      text-align:center;
      font-size:15px;
      color:#6b7280;
      margin-bottom:30px;
    ">
      Build • Learn • Ship faster
    </p>

    <h2 style="
      font-size:20px;
      color:#111827;
      margin-bottom:12px;
    ">
      Welcome to Codelura 👋
    </h2>

    <p style="
      font-size:15px;
      color:#374151;
      line-height:1.6;
      margin-bottom:24px;
    ">
      Thanks for creating an account. Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align:center; margin:32px 0;">
      <a href="${verifyUrl}" 
        style="
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#ffffff;
          text-decoration:none;
          padding:14px 28px;
          font-size:16px;
          font-weight:600;
          border-radius:8px;
          display:inline-block;
        ">
        Verify Email
      </a>
    </div>

    <p style="
      font-size:14px;
      color:#6b7280;
      line-height:1.6;
      margin-top:24px;
    ">
      If you didn’t create a Codelura account, you can safely ignore this email.
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

    <p style="
      font-size:13px;
      color:#9ca3af;
      text-align:center;
    ">
      © ${new Date().getFullYear()} Codelura. All rights reserved.
    </p>
  </div>
  `
});

    } catch (emailError) {
      console.error("EMAIL ERROR 👉", emailError.message);
    }

  } catch (error) {
    console.error("SIGNUP ERROR 👉", error);
    return res.status(500).json({
      
      message: "Signup failed"
    });
  }
};

/**
 * ===============================
 * VERIFY EMAIL
 * ===============================
 */
export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerifyToken: req.params.token
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

/**
 * ===============================
 * RESEND VERIFICATION EMAIL
 * ===============================
 */
export const resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.isEmailVerified) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerifyToken = token;
  await user.save();

  const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;

  await sendEmail({
  to: user.email,
  subject: "Verify your email - Codelura",
  html: `
    <div style="
      max-width:520px;
      margin:40px auto;
      padding:28px;
      font-family:Arial, Helvetica, sans-serif;
      background:#ffffff;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <h2 style="
        text-align:center;
        color:#111827;
        margin-bottom:8px;
      ">
        Codelura<span style="color:#6366f1;">.</span>
      </h2>

      <p style="
        text-align:center;
        color:#6b7280;
        font-size:14px;
        margin-bottom:24px;
      ">
        Build • Learn • Ship faster
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:20px;
      ">
        Welcome to <strong>Codelura</strong> 👋  
        <br />
        Please verify your email address to complete your signup.
      </p>

      <div style="text-align:center; margin:28px 0;">
        <a href="${verifyUrl}"
          style="
            display:inline-block;
            background:#6366f1;
            color:#ffffff;
            text-decoration:none;
            padding:12px 24px;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
          ">
          Verify Email
        </a>
      </div>

      <p style="
        color:#6b7280;
        font-size:13px;
        line-height:1.6;
      ">
        If you didn’t create a Codelura account, you can safely ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="
        text-align:center;
        color:#9ca3af;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} Codelura
      </p>
    </div>
  `
});



  res.json({ message: "Verification email resent" });
};

/**
 * ===============================
 * LOGIN
 * ===============================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ DEPLOY-SAFE COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",   // ✅ ADD THIS LINE
    });
    return res.json({
  message: "Login successful",
  token, // ✅ ADD THIS
  user: {
    id: user._id,
    email: user.email,
    role: user.role,
  },
});
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * ===============================
 * FORGOT PASSWORD
 * ===============================
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // 🔒 Do not reveal existence
    return res.json({ message: "If email exists, reset link sent" });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

 await sendEmail({
  to: user.email,
  subject: "Reset Password - Codelura",
  html: `
    <div style="
      max-width:520px;
      margin:40px auto;
      padding:28px;
      font-family:Arial, Helvetica, sans-serif;
      background:#ffffff;
      border-radius:10px;
      box-shadow:0 8px 24px rgba(0,0,0,0.08);
    ">

      <h2 style="
        text-align:center;
        color:#111827;
        margin-bottom:8px;
      ">
        Codelura<span style="color:#6366f1;">.</span>
      </h2>

      <p style="
        text-align:center;
        color:#6b7280;
        font-size:14px;
        margin-bottom:24px;
      ">
        Build • Learn • Ship faster
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:20px;
      ">
        We received a request to reset your password for your
        <strong>Codelura</strong> account.
      </p>

      <p style="
        color:#374151;
        font-size:15px;
        line-height:1.6;
        margin-bottom:24px;
      ">
        Click the button below to set a new password:
      </p>

      <div style="text-align:center; margin:28px 0;">
        <a href="${resetUrl}"
          style="
            display:inline-block;
            background:#ef4444;
            color:#ffffff;
            text-decoration:none;
            padding:12px 24px;
            border-radius:6px;
            font-size:15px;
            font-weight:600;
          ">
          Reset Password
        </a>
      </div>

      <p style="
        color:#6b7280;
        font-size:13px;
        line-height:1.6;
      ">
        This password reset link will expire in <strong>15 minutes</strong>.
        If you didn’t request a password reset, please ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

      <p style="
        text-align:center;
        color:#9ca3af;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} Codelura
      </p>
    </div>
  `
});


  res.json({ message: "Password reset link sent" });
};

/**
 * ===============================
 * RESET PASSWORD
 * ===============================
 */
export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Token invalid or expired" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};

/**
 * ===============================
 * CHANGE PASSWORD (LOGGED IN)
 * ===============================
 */
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
};

export const me = async (req, res) => {
  try {
    let token = null;

    // 1️⃣ Check Bearer header from localStorage
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Fallback to Cookies
    if (!token && req.cookies) {
      token = req.cookies.token || req.cookies.auth_token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretjwtkey");
    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  };

  res.clearCookie("token", options);
  res.clearCookie("auth_token", options);

  return res.json({ message: "Logout successful" });
};


// admin 
// import User from "../../models/User.js";

/* ─────────────────────────────────────────────────
   ✅ GET ALL USERS (Admin)
   Query: q, role, verified, page, limit
───────────────────────────────────────────────── */
export const getAllUsers = async (req, res) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const { q, role, verified } = req.query;

    const query = {};

    if (role && role !== "all") query.role = role;

    if (verified === "true")  query.isEmailVerified = true;
    if (verified === "false") query.isEmailVerified = false;

    if (q) {
      const regex = new RegExp(q, "i");
      query.$or = [
        { name:  regex },
        { email: regex },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -emailVerifyToken -resetPasswordToken -resetPasswordExpire")
        .sort({ _id: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET USERS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ GET SINGLE USER (Admin)
───────────────────────────────────────────────── */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -emailVerifyToken -resetPasswordToken -resetPasswordExpire");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("GET USER ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ UPDATE USER ROLE (Admin)
───────────────────────────────────────────────── */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Role updated", user });
  } catch (error) {
    console.error("UPDATE ROLE ERROR 👉", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ DELETE USER (Admin)
───────────────────────────────────────────────── */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR 👉", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ GOOGLE LOGIN / SIGNUP AUTHENTICATION
───────────────────────────────────────────────── */
export const googleLogin = async (req, res) => {
  try {
    const { token, credential, email: bodyEmail, name: bodyName, picture: bodyPicture } = req.body;

    let email = bodyEmail;
    let name = bodyName;
    let avatar = bodyPicture;

    // Decode Google ID Token if passed
    const idToken = token || credential;
    if (idToken && typeof idToken === "string") {
      try {
        const decoded = jwt.decode(idToken);
        if (decoded && decoded.email) {
          email = decoded.email;
          name =
            decoded.name ||
            (decoded.given_name ? `${decoded.given_name} ${decoded.family_name || ""}`.trim() : "") ||
            name;
          avatar = decoded.picture || avatar;
        }
      } catch (e) {
        console.error("JWT Decode error:", e);
      }
    }

    if (!email) {
      return res.status(400).json({ message: "Invalid Google authentication data (email missing)" });
    }

    email = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Check campus referral code
      let referredByUser = null;
      const incomingRef = req.body.referralCode || req.body.ref;
      if (incomingRef) {
        try {
          const participant = await CampusParticipant.findOne({ referralCode: incomingRef.toUpperCase().trim() });
          if (participant) {
            referredByUser = participant.user;
            const settings = await CampusProgramSettings.findOne();
            const pts = settings?.referralSignupPoints || 10;
            participant.points = (participant.points || 0) + pts;
            participant.weeklyPoints = (participant.weeklyPoints || 0) + pts;
            participant.monthlyPoints = (participant.monthlyPoints || 0) + pts;
            await participant.save();

            await CampusEarning.create({
              participant: participant._id,
              source: "referral_bonus",
              amount: 0,
              points: pts,
              status: "approved",
              description: `Campus Referral: ${name || email} registered via Google`,
            });
          }
        } catch (err) {
          console.error("Google login referral error:", err);
        }
      }

      // Create new user in MongoDB (Will show in Admin Panel!)
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        role: "user",
        isEmailVerified: true,
        avatar: avatar || "",
        referredBy: referredByUser,
      });
      console.log(`✅ New Google User Created in DB: ${user.email} (${user._id})`);
    } else {
      // Ensure email verified flag is set
      user.isEmailVerified = true;
      // ✅ Update user name from Google if Google provides a real name
      if (name && name.trim()) {
        user.name = name.trim();
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
      }
      await user.save();
    }

    // Generate JWT Token for Codelura App
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecretjwtkey",
      { expiresIn: "7d" }
    );

    // Set Deploy-Safe HTTP-Only Cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("auth_token", jwtToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in with Google successfully",
      token: jwtToken,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR 👉", error);
    return res.status(500).json({ message: error.message || "Google login failed" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ UPDATE CURRENT USER PROFILE
───────────────────────────────────────────────── */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { name, phone, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name && name.trim()) user.name = name.trim();
    if (typeof phone === "string") user.phone = phone.trim();
    if (typeof bio === "string") user.bio = bio.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

/* ─────────────────────────────────────────────────
   ✅ GET USER STATS (Admin Dashboard)
───────────────────────────────────────────────── */
export const getUserStats = async (req, res) => {
  try {
    const [total, verified, admins, thisMonth] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isEmailVerified: true }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    res.json({
      total,
      verified,
      unverified: total - verified,
      admins,
      thisMonth,
    });
  } catch (error) {
    console.error("USER STATS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};