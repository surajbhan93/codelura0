import Course from "../../models/Course.js";
import slugify from "slugify";

/**
 * ===============================
 * ADMIN: CREATE COURSE
 * ===============================
 * POST /api/admin/courses
 */

/**
 * ===============================
 * ADMIN: CREATE COURSE
 * ===============================
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

      // 🔥 ACCESS CONTROLS
      accessType = "login_required", // public_preview | login_required | paid_only
      showAdsForFreeUsers = true,
      allowDownloadAfterPurchase = true
    } = body;

    if (!title || !req.files?.pdf) {
      return res.status(400).json({
        message: "Title and PDF are required"
      });
    }

    /* ===============================
       VALIDATIONS
    =============================== */

    if (accessType === "paid_only" && Number(price) <= 0) {
      return res.status(400).json({
        message: "Paid-only course must have a price"
      });
    }

    /* ===============================
       DERIVED LOGIC
    =============================== */

    const isPaid =
      accessType === "paid_only" || Number(price) > 0;

    const finalPreviewPages =
      accessType === "paid_only"
        ? 0
        : Number(previewPages || 3);

    const makeWebPath = (p) =>
      p.replace(process.cwd(), "").replace(/\\/g, "/");

    /* ===============================
       CREATE COURSE
    =============================== */

    const course = await Course.create({
      title,
      description,
      slug: slugify(title, { lower: true }),
      category,

      // 💰 Pricing
      price: Number(price),
      isPaid,
      validityDays,

      // 🔐 Access rules
      accessType,
      previewPages: finalPreviewPages,
      showAdsForFreeUsers,
      allowDownloadAfterPurchase,

      // 🧠 Meta
      level,
      language,
      duration,
      tags: tags ? tags.split(",") : [],

      // 📄 Main PDF
      pdf: {
        fileName: req.files.pdf[0].originalname,
        filePath: makeWebPath(req.files.pdf[0].path),
        fileSize: req.files.pdf[0].size
      },

      // 🖼 Banner
      bannerImage: req.files.banner
        ? {
            fileName: req.files.banner[0].originalname,
            filePath: makeWebPath(req.files.banner[0].path),
            fileSize: req.files.banner[0].size
          }
        : undefined,

      // 📎 Attachments
      attachments: req.files.attachments
        ? req.files.attachments.map((f) => ({
            fileName: f.originalname,
            filePath: makeWebPath(f.path),
            fileSize: f.size,
            fileType: f.mimetype.includes("excel")
              ? "excel"
              : "other"
          }))
        : [],

      // 🔗 External links
      externalLinks: externalLinks
        ? JSON.parse(externalLinks)
        : [],

      createdBy: req.user.id,
      isPublished: true
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (err) {
    console.error("UPLOAD ERROR 👉", err);
    res.status(500).json({
      message: "Course creation failed"
    });
  }
};
/**
 * ===============================
 * ADMIN: DELETE COURSE
 * ===============================
 */
export const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

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
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.isPublished = !course.isPublished;
  await course.save();

  res.json({
    message: course.isPublished
      ? "Course published"
      : "Course unpublished",
    isPublished: course.isPublished
  });
};
