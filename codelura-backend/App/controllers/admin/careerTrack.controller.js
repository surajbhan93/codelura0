

import CareerTrack from "../../models/CareerTrack.js";
import mongoose from "mongoose";

// ===========================
// @desc    Create a new Career Track
// @route   POST /api/admin/career-tracks
// @access  Private/Admin
// ===========================
export const createCareerTrack = async (req, res) => {
  try {
    const { slug } = req.body;

    const existing = await CareerTrack.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Career track with this slug already exists",
      });
    }

    const careerTrack = await CareerTrack.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Career track created successfully",
      data: careerTrack,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create career track",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Get all Career Tracks (all statuses, admin view)
// @route   GET /api/admin/career-tracks
// @access  Private/Admin
// ===========================
export const getAllCareerTracksAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tracks, total] = await Promise.all([
      CareerTrack.find(filter)
        .populate("category", "name slug")
        .populate("courses", "name slug")
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
// @desc    Get single Career Track by ID (admin)
// @route   GET /api/admin/career-tracks/:id
// @access  Private/Admin
// ===========================
export const getCareerTrackByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    const careerTrack = await CareerTrack.findById(id)
      .populate("category", "name slug")
      .populate("courses", "name slug")
      .populate("createdBy", "name email");

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
// @desc    Update Career Track
// @route   PUT /api/admin/career-tracks/:id
// @access  Private/Admin
// ===========================
export const updateCareerTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    // If slug is being updated, ensure uniqueness
    if (req.body.slug) {
      const existing = await CareerTrack.findOne({
        slug: req.body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Another career track already uses this slug",
        });
      }
    }

    const careerTrack = await CareerTrack.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career track updated successfully",
      data: careerTrack,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update career track",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Delete Career Track
// @route   DELETE /api/admin/career-tracks/:id
// @access  Private/Admin
// ===========================
export const deleteCareerTrack = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    const careerTrack = await CareerTrack.findByIdAndDelete(id);

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career track deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete career track",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Update status (draft/published/archived)
// @route   PATCH /api/admin/career-tracks/:id/status
// @access  Private/Admin
// ===========================
export const updateCareerTrackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const update = { status };
    if (status === "published") update.publishedAt = new Date();

    const careerTrack = await CareerTrack.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Career track marked as ${status}`,
      data: careerTrack,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// ===========================
// @desc    Toggle featured/trending/popular/recommended flags
// @route   PATCH /api/admin/career-tracks/:id/flags
// @access  Private/Admin
// ===========================
export const toggleCareerTrackFlags = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured, trending, popular, recommended } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid career track ID",
      });
    }

    const update = {};
    if (typeof featured === "boolean") update.featured = featured;
    if (typeof trending === "boolean") update.trending = trending;
    if (typeof popular === "boolean") update.popular = popular;
    if (typeof recommended === "boolean") update.recommended = recommended;

    const careerTrack = await CareerTrack.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!careerTrack) {
      return res.status(404).json({
        success: false,
        message: "Career track not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career track flags updated",
      data: careerTrack,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update flags",
      error: error.message,
    });
  }
};