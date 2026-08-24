import Program from "../../models/Program.js";

// ===========================
// GET All Published Programs (Public)
// ===========================
export const getAllPrograms = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      search = "",
      featured,
      trending,
      popular,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "published", isActive: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (featured === "true") query.featured = true;
    if (trending === "true") query.trending = true;
    if (popular === "true") query.popular = true;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [programs, total] = await Promise.all([
      Program.find(query)
        .select("-structuredData -createdBy") // heavy/internal fields hide kar do
        .populate("careerTrack", "title slug")
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit)),
      Program.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: programs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

// ===========================
// GET Single Program by Slug (Public) + view count increment
// ===========================
export const getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate(
      { slug: req.params.slug, status: "published", isActive: true },
      { $inc: { views: 1, uniqueVisitors: 1 } }, // simple increment; unique visitor logic can be refined via cookies/IP
      { new: true }
    ).populate("careerTrack", "title slug thumbnail");

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch program",
      error: error.message,
    });
  }
};

// ===========================
// Track Click (jab user "Enroll / Buy Now" pe click kare - platformLink)
// ===========================
export const trackProgramClick = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    ).select("platformLink clickCount");

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({
      success: true,
      redirectUrl: program.platformLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to track click",
      error: error.message,
    });
  }
};

// ===========================
// GET Featured Programs (for homepage)
// ===========================
export const getFeaturedPrograms = async (req, res) => {
  try {
    const programs = await Program.find({
      status: "published",
      isActive: true,
      featured: true,
    })
      .select("name slug shortDescription thumbnail price discountPrice rating level")
      .sort({ order: 1 })
      .limit(8);

    res.status(200).json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured programs",
      error: error.message,
    });
  }
};

// ===========================
// LIKE / BOOKMARK / SHARE increment
// ===========================
export const incrementProgramStat = async (req, res) => {
  try {
    const { statType } = req.body; // "likes" | "shares" | "bookmarks"
    const allowedStats = ["likes", "shares", "bookmarks"];

    if (!allowedStats.includes(statType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stat type",
      });
    }

    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $inc: { [statType]: 1 } },
      { new: true }
    ).select(statType);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update stat",
      error: error.message,
    });
  }
};