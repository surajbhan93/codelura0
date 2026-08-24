

import Course from "../../models/Course.js";
import slugify from "slugify";
import { uploadPdfToR2 } from "../../utils/uploadPDF.js";

/**
 * ===============================
 * ADMIN: CREATE COURSE
 * ===============================
 * POST /api/admin/courses
 */
export const uploadCourse = async (req, res) => {
  try {
    
    const body = req.body || {};

    const {
      title,
      description,
      price = 0,
      category = "notes",
      level,
      language,
      tags,
      duration,
      validityDays,
      previewPages,
      externalLinks,
      bannerUrl,                          // ✅ Cloudinary URL from form
      accessType = "login_required",
      showAdsForFreeUsers = true,
      allowDownloadAfterPurchase = true,
    } = body;

    if (!title || !req.files?.pdf) {
      return res.status(400).json({ message: "Title and PDF are required" });
    }

    if (accessType === "paid_only" && Number(price) <= 0) {
      return res.status(400).json({ message: "Paid-only course must have a price" });
    }

    /* ── Derived logic ── */
    const isPaid = accessType === "paid_only" || Number(price) > 0;
    const finalPreviewPages = accessType === "paid_only" ? 0 : Number(previewPages || 3);

    /* ── Upload PDF to R2 ── */
    const pdfFile = req.files.pdf[0];

    let pdfUrl;
    try {
      pdfUrl = await uploadPdfToR2(pdfFile);
    } catch (uploadErr) {
      console.error("R2 UPLOAD FAILED 👉", uploadErr.message);
      return res.status(500).json({
        message: "PDF upload to R2 failed. Check R2 credentials in .env",
        detail: uploadErr.message,
      });
    }

    if (!pdfUrl) {
      return res.status(500).json({ message: "R2 upload returned empty URL" });
    }

    console.log("✅ PDF uploaded to R2:", pdfUrl);

    /* ── Create course ── */
    const course = await Course.create({
      title,
      description,
      slug: slugify(title, { lower: true, strict: true }),
      category,

      // 💰 Pricing
      price:       Number(price),
      isPaid,
      validityDays,

      // 🔐 Access
      accessType,
      previewPages:              finalPreviewPages,
      showAdsForFreeUsers:       showAdsForFreeUsers === "true" || showAdsForFreeUsers === true,
      allowDownloadAfterPurchase: allowDownloadAfterPurchase === "true" || allowDownloadAfterPurchase === true,

      // 🧠 Meta
      level,
      language,
      duration,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],

      // 📄 PDF — R2
      pdf: {
        fileName: pdfFile.originalname,
        fileUrl:  pdfUrl,             // ✅ R2 public URL
        fileSize: pdfFile.size,
      },

     // ✅ Ye karo:
bannerImage: bannerUrl ? String(bannerUrl).trim() || null : null,

      // 📎 Attachments (agar R2 pe upload karna ho baad mein)
      attachments: [],

      // 🔗 External links
      externalLinks: externalLinks ? JSON.parse(externalLinks) : [],

      createdBy:   req.user.id,
      isPublished: true,
    });

    res.status(201).json({ message: "Course created successfully", course });

  } catch (err) {
    console.error("UPLOAD ERROR 👉", err);
    res.status(500).json({ message: "Course creation failed", detail: err.message });
  }
};

/**
 * ===============================
 * ADMIN: DELETE COURSE
 * ===============================
 */
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  await course.deleteOne();
  res.json({ message: "Course deleted successfully" });
};

/**
 * ===============================
 * ADMIN: PUBLISH / UNPUBLISH
 * ===============================
 */
export const togglePublishCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  course.isPublished = !course.isPublished;
  await course.save();

  res.json({
    message: course.isPublished ? "Course published" : "Course unpublished",
    isPublished: course.isPublished,
  });
};