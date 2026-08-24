

import mongoose from "mongoose";
import Course from "../../models/Course.js";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import User from "../../models/User.js";
// ─── R2 Config ───────────────────────────────────────────────
// .env mein ye variables set karo:
//   R2_ACCOUNT_ID=your_account_id
//   R2_ACCESS_KEY_ID=your_access_key
//   R2_SECRET_ACCESS_KEY=your_secret_key
//   R2_BUCKET_NAME=your_bucket_name
//   R2_PUBLIC_URL=https://pub-xxxx.r2.dev   ← R2 public domain ya custom domain
//
// PDF ko Course model mein sirf filename store karo:
//   course.pdf.fileName = "physics-notes.pdf"
//
// Full URL ban jaata hai: R2_PUBLIC_URL + "/" + fileName
// -------------------------------------------------------------

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, ""); // trailing slash hata do
const findCourseByIdOrSlug = async (value) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return await Course.findById(value);
  }

  return await Course.findOne({ slug: value });
};
/**
 * R2 se PDF bytes fetch karne ka helper.
 * course.pdf.fileUrl already full URL hai → directly use karo.
 * Ya agar sirf fileName stored hai → R2_PUBLIC_URL + fileName se banao.
 */
async function fetchPdfBytes(course) {
  // Priority: fileUrl (already set) → R2_PUBLIC_URL + fileName fallback
  const url =
    course.pdf?.fileUrl ||
    `${R2_PUBLIC_URL}/${course.pdf?.fileName}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`R2 fetch failed: ${response.status} ${url}`);
  }

  return response.arrayBuffer();
}

/* ===============================
   LIST COURSES
=============================== */
export const listCourses = async (req, res) => {
  const courses = await Course.find({ isPublished: true })
    .select("-pdf.filePath -attachments")
    .sort({ createdAt: -1 });

  res.json(courses);
};

/* ===============================
   GET COURSE
=============================== */
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let course;

    // Old URLs with MongoDB ObjectId will continue working
    if (mongoose.Types.ObjectId.isValid(id)) {
      course = await Course.findById(id);
    } else {
      // New SEO-friendly URLs
      course = await Course.findOne({ slug: id });
    }

    console.log("USER 👉", req.user);
    console.log("PURCHASED COURSES 👉", req.user?.purchasedCourses);

    if (!course || !course.isPublished) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const isLoggedIn = !!req.user;

    const hasPurchased = req.user?.purchasedCourses?.some(
      (courseId) => courseId.toString() === course._id.toString()
    );

    console.log("HAS PURCHASED 👉", hasPurchased);

    let accessLevel = "preview";

    if (hasPurchased) {
      accessLevel = "full_access";
    } else if (isLoggedIn) {
      accessLevel = "full_read";
    }

    return res.json({
      course,
      accessLevel,
    });
  } catch (error) {
    console.error("GET COURSE ERROR 👉", error);

    return res.status(500).json({
      message: "Failed to fetch course",
    });
  }
};

/* ===============================
   PREVIEW PDF  (R2 version)
=============================== */
export const previewPDF = async (req, res) => {
  try {
    // const course = await Course.findById(req.params.id);
    const course = await findCourseByIdOrSlug(req.params.id);

    if (!course || !course.pdf?.fileUrl) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const isLoggedIn  = !!req.user;
    const hasPurchased = req.user?.purchasedCourses?.some(
      (id) => id.toString() === course._id.toString()
    );

    console.log("PREVIEW REQUEST USER 👉", req.user);
    console.log("COURSE ID 👉", req.params.id);
    console.log("PREVIEW HAS PURCHASED 👉", hasPurchased);

    /* ── Access Rules ── */

    // Rule 1: paid_only + guest
    if (course.accessType === "paid_only" && !hasPurchased && !isLoggedIn) {
      return res.status(403).send(lockedHTML(course, "premium"));
    }

    // Rule 2: login_required + guest
    if (course.accessType === "login_required" && !isLoggedIn) {
      return res.status(403).send(lockedHTML(course, "login"));
    }

    /* ── Fetch PDF from R2 ── */
    const originalBytes = await fetchPdfBytes(course);           // ← R2 se aata hai
    const originalPdf   = await PDFDocument.load(originalBytes);
    const totalPages    = originalPdf.getPageCount();

    /* ── HEAD request (total pages only) ── */
    if (req.method === "HEAD") {
      res.setHeader("X-Total-Pages", totalPages);
      return res.status(200).end();
    }

    /* ── Pages to show ── */
    let pagesToShow;
    if (hasPurchased) pagesToShow = totalPages;          // full access
    else if (isLoggedIn) pagesToShow = totalPages;       // full read
    else pagesToShow = course.previewPages || 3;         // guest preview

    /* ── Build preview PDF with watermark ── */
    const previewPdf   = await PDFDocument.create();
    const copiedPages  = await previewPdf.copyPages(
      originalPdf,
      Array.from({ length: Math.min(pagesToShow, totalPages) }, (_, i) => i)
    );

    copiedPages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText("Codelura", {
        x:       width / 2 - 150,
        y:       height / 2 - 50,
        size:    100,
        color:   rgb(0.75, 0.75, 0.75),
        rotate:  degrees(45),
        opacity: 0.4,
      });
      previewPdf.addPage(page);
    });

    const previewBytes = await previewPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Total-Pages", totalPages);
    return res.end(Buffer.from(previewBytes));

  } catch (err) {
    console.error("PREVIEW ERROR 👉", err);
    res.status(500).json({ message: "Preview failed" });
  }
};

/* ===============================
   DOWNLOAD PDF  (R2 version)
=============================== */
export const downloadPDF = async (req, res) => {
  try {
    // const course = await Course.findById(req.params.id);
    const course = await findCourseByIdOrSlug(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const hasPurchased = req.user?.purchasedCourses?.some(
      (id) => id.toString() === course._id.toString()
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: "Purchase required" });
    }

    // R2 public URL pe redirect — browser seedha R2 se download karega
    const fileUrl =
      course.pdf?.fileUrl ||
      `${R2_PUBLIC_URL}/${course.pdf?.fileName}`;

    return res.redirect(fileUrl);

  } catch (err) {
    console.error("DOWNLOAD ERROR 👉", err);
    res.status(500).json({ message: "Download failed" });
  }
};

/* ===============================
   LOCKED PAGE HTML HELPER
=============================== */
function lockedHTML(course, type) {
  if (type === "login") {
    return `<!DOCTYPE html>
<html>
<head><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-[#0c0b09] flex items-center justify-center h-screen text-white">
  <div class="text-center max-w-md p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-800 border border-white/10 shadow-2xl">
    <div class="text-5xl mb-4">🔒</div>
    <h1 class="text-2xl font-bold mb-2">Login Required</h1>
    <p class="text-zinc-400 text-sm mb-6">This premium document preview is available only for logged-in users.</p>
    <a href="/auth/login" class="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold shadow-lg hover:scale-105 transition">
      Login to Continue
    </a>
  </div>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="relative h-screen flex items-center justify-center text-white overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-br from-[#1b1b1b] via-[#121212] to-black"></div>
  <div class="absolute inset-0 p-20 space-y-4 opacity-20">
    <div class="h-3 bg-white rounded w-3/4"></div>
    <div class="h-3 bg-white rounded w-5/6"></div>
    <div class="h-3 bg-white rounded w-2/3"></div>
    <div class="h-3 bg-white rounded w-4/5"></div>
  </div>
  <div class="relative z-10 text-center max-w-md p-10 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
    <div class="text-6xl mb-6">🔐</div>
    <h1 class="text-2xl font-bold mb-3">Premium Content Locked</h1>
    <p class="text-zinc-400 text-sm mb-8">Login and purchase to unlock the full PDF notes.</p>
    <div class="flex flex-col gap-3 text-sm text-left mb-8">
      <div class="flex items-center gap-3"><span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span><span>Login to your account</span></div>
      <div class="flex items-center gap-3"><span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span><span>Purchase this course</span></div>
      <div class="flex items-center gap-3"><span class="bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span><span>Unlock the full document</span></div>
    </div>
    <div class="flex gap-3 justify-center">
      <a href="/auth/login" class="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">Login</a>
      <a href="/courses/${course._id}" class="px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-semibold hover:scale-105 transition">Buy Course</a>
    </div>
  </div>
</body>
</html>`;
}

/* ===============================
   RELATED COURSES
=============================== */
export const getRelatedCourses = async (req, res) => {
  try {
    const { exclude, tags, category } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 4, 12);

    if (!exclude) {
      return res.status(400).json({ error: "exclude (_id) is required" });
    }

    const tagList = tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const poolSize = limit * 5;

    const query = {
      _id: { $ne: exclude },
      isPublished: true,
    };

    if (tagList.length || category) {
      const orClauses = [];
      if (tagList.length) orClauses.push({ tags: { $in: tagList } });
      if (category) orClauses.push({ category });
      query.$or = orClauses;
    }

    let candidates = await Course.find(query)
      .select(
        "_id title slug category language level price isPaid tags bannerImage createdAt isFeatured previewPages"
      )
      .sort({ createdAt: -1 })
      .limit(poolSize)
      .lean();

    // fallback if not enough
    if (candidates.length < limit) {
      const fallback = await Course.find({
        _id: { $ne: exclude, $nin: candidates.map((c) => c._id) },
        isPublished: true,
      })
        .select(
          "_id title slug category language level price isPaid tags bannerImage createdAt isFeatured previewPages"
        )
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(limit - candidates.length)
        .lean();

      candidates = [...candidates, ...fallback];
    }

    const tagSet = new Set(tagList.map((t) => t.toLowerCase()));

    const scored = candidates.map((c) => {
      let score = 0;

      if (tagSet.size && Array.isArray(c.tags)) {
        for (const t of c.tags) {
          if (tagSet.has(t.toLowerCase())) score += 2;
        }
      }

      if (category && c.category === category) score += 1;
      if (c.isFeatured) score += 0.5;

      return { ...c, _score: score };
    });

    scored.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

    const result = scored.slice(0, limit).map(({ _score, ...c }) => c);

    res.json(result);

  } catch (err) {
    console.error("[related-courses]", err);
    res.status(500).json({ error: "Failed to fetch related courses" });
  }
};

//add new api
/* ===============================
   SAVE COURSE TO USER
=============================== */
export const saveCourseToDashboard = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

if (!userId) {
  return res.status(401).json({ message: "Unauthorized - user missing" });
}
    const { courseId } = req.body;
console.log("USER 👉", req.user);
    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const user = await User.findById(userId);

if (!user) {
  return res.status(404).json({ message: "User not found" });
}
    // already purchased → directly dashboard open
    const alreadyPurchased = user.purchasedCourses.some(
      (id) => id.toString() === courseId
    );

    if (alreadyPurchased) {
      return res.json({ message: "Already purchased" });
    }

    // already saved?
    const alreadySaved = user.savedCourses.some(
      (id) => id.toString() === courseId
    );

    if (!alreadySaved) {
      user.savedCourses.push(courseId);
      await user.save();
    }

    res.json({ success: true, message: "Saved to dashboard" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving course" });
  }
};

export const buyCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { courseId } = req.body;

    // already purchased
    if (
      user.purchasedCourses.some((id) => id.toString() === courseId)
    ) {
      return res.json({ message: "Already purchased" });
    }

    // add to purchased
    user.purchasedCourses.push(courseId);

    // remove from saved
    user.savedCourses = user.savedCourses.filter(
      (id) => id.toString() !== courseId
    );

    await user.save();

    res.json({ success: true, message: "Course purchased" });
  } catch (err) {
    res.status(500).json({ message: "Purchase failed" });
  }
};

/* ===============================
   MY COURSES (Dashboard API)
=============================== */
export const getMyCourses = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId)
      .populate({
  path: "savedCourses",
  select: "title price isPaid bannerImage category level language tags createdAt"
})
.populate({
  path: "purchasedCourses",
  select: "title price isPaid bannerImage category level language tags createdAt"
})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("POPULATED 👉", user.savedCourses);

    res.json({
      savedCourses: user.savedCourses,
      purchasedCourses: user.purchasedCourses,
    });

  } catch (err) {
    console.error("MY COURSES ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};