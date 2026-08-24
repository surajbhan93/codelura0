
import CareerTrack from "../../models/CareerTrack.js";
import mongoose from "mongoose";

// ===========================
// @desc    Get all published Career Tracks (public listing)
// @route   GET /api/career-tracks
// @access  Public
// ===========================
export const getAllCareerTracks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      level,
      featured,
      trending,
      popular,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    const filter = { status: "published" };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (featured === "true") filter.featured = true;
    if (trending === "true") filter.trending = true;
    if (popular === "true") filter.popular = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tracks, total] = await Promise.all([
      CareerTrack.find(filter)
        .select("-structuredData -metaKeywords -createdBy")
        .populate("category", "name slug")
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit)),
      CareerTrack.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: tracks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career tracks",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Get single Career Track by slug (public detail page)
// @route   GET /api/career-tracks/:slug
// @access  Public
// ===========================
export const getCareerTrackBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const careerTrack = await CareerTrack.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1, uniqueVisitors: 1 } },
      { new: true }
    )
      .populate("category", "name slug")
      .populate("courses", "name slug thumbnail price discountPrice level");

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: careerTrack,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career track",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Get featured Career Tracks
// @route   GET /api/career-tracks/featured
// @access  Public
// ===========================
export const getFeaturedCareerTracks = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const tracks = await CareerTrack.find({
      status: "published",
      featured: true,
    })
      .select("-structuredData -metaKeywords -createdBy")
      .populate("category", "name slug")
      .sort({ order: 1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured career tracks",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Get trending Career Tracks
// @route   GET /api/career-tracks/trending
// @access  Public
// ===========================
export const getTrendingCareerTracks = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const tracks = await CareerTrack.find({
      status: "published",
      trending: true,
    })
      .select("-structuredData -metaKeywords -createdBy")
      .populate("category", "name slug")
      .sort({ views: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: tracks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending career tracks",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Like a Career Track
// @route   POST /api/career-tracks/:id/like
// @access  Public
// ===========================
export const likeCareerTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    const careerTrack = await CareerTrack.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career track liked",
      data: { likes: careerTrack.likes },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to like career track",
      error: error.message,
    });
  }
};