// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   let token = null;

//   // 1️⃣ Authorization header (Bearer)
//   const authHeader = req.headers.authorization;
//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     token = authHeader.split(" ")[1];
//   }

//   // 2️⃣ Cookie based auth (auth_token)
//   if (!token && req.cookies?.auth_token) {
//     token = req.cookies.auth_token;
//   }

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // ✅ attach user
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// /**
//  * ===============================
//  * AUTH OPTIONAL (LOGIN OPTIONAL)
//  * ===============================
//  */
// export const authOptional = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.auth_token ||
//       req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       req.user = null;
//       return next();
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");

//     next();
//   } catch (err) {
//     req.user = null;
//     next();
//   }
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authMiddleware = (req, res, next) => {
  let token = null;

  // 1️⃣ Cookie-based auth (PRIMARY)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2️⃣ Authorization header (OPTIONAL)
  const authHeader = req.headers.authorization;
  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// export const authOptional = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.token ||
//       req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       req.user = null;
//       return next();
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     req.user = null;
//     next();
//   }
// };

export const authOptional = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token ||
      req.cookies?.auth_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (err) {
    req.user = null;
    next();
  }
};

export const protectOptional = async (req, res, next) => {
  try {

    // 1️⃣ Token sources
    const cookieToken = req.cookies?.token;
    const queryToken = req.query?.token;
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = cookieToken || queryToken || headerToken;

    console.log("COOKIES 👉", req.cookies);
    console.log("TOKEN 👉", token);

    // 2️⃣ No token → guest user
    if (!token) {
      req.user = null;
      return next();
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Load user from DB (with purchases)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;

    return next();

  } catch (err) {
    console.error("AUTH OPTIONAL ERROR 👉", err.message);
    req.user = null;
    return next();
  }
};