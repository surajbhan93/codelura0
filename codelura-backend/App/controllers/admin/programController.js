import Program from "../../models/Program.js";
import CareerTrack from "../../models/CareerTrack.js";

// ===========================
// CREATE Program
// ===========================
export const createProgram = async (req, res) => {
  try {
    const existing = await Program.findOne({ slug: req.body.slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists, please choose a different slug",
      });
    }

    const program = await Program.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    // Agar careerTrack diya hai to us track ke courses array mein bhi add kar do
    if (program.careerTrack) {
      await CareerTrack.findByIdAndUpdate(program.careerTrack, {
        $addToSet: { courses: program._id },
      });
    }

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create program",
      error: error.message,
    });
  }
};

// ===========================
// GET All Programs (Admin - with filters, pagination, search)
// ===========================
export const getAllProgramsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      status,
      level,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;
    if (level) query.level = level;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const [programs, total] = await Promise.all([
      Program.find(query)
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
// GET Single Program by ID (Admin)
// ===========================
export const getProgramByIdAdmin = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      "careerTrack",
      "title slug"
    );

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
// UPDATE Program
// ===========================
export const updateProgram = async (req, res) => {
  try {
    const existingProgram = await Program.findById(req.params.id);
    if (!existingProgram) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    // Agar slug change ho raha hai to duplicate check karo
    if (req.body.slug && req.body.slug !== existingProgram.slug) {
      const slugExists = await Program.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id },
      });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const oldCareerTrack = existingProgram.careerTrack?.toString();
    const newCareerTrack = req.body.careerTrack;

    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Agar careerTrack change hua hai to dono tracks ke courses array update karo
    if (newCareerTrack && oldCareerTrack !== newCareerTrack) {
      if (oldCareerTrack) {
        await CareerTrack.findByIdAndUpdate(oldCareerTrack, {
          $pull: { courses: updatedProgram._id },
        });
      }
      await CareerTrack.findByIdAndUpdate(newCareerTrack, {
        $addToSet: { courses: updatedProgram._id },
      });
    }

    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update program",
      error: error.message,
    });
  }
};

// ===========================
// DELETE Program
// ===========================
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    if (program.careerTrack) {
      await CareerTrack.findByIdAndUpdate(program.careerTrack, {
        $pull: { courses: program._id },
      });
    }

    await program.deleteOne();

    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete program",
      error: error.message,
    });
  }
};

// ===========================
// TOGGLE Status flags (featured, trending, popular, recommended, isActive)
// ===========================
export const toggleProgramFlag = async (req, res) => {
  try {
    const { flag } = req.body; // e.g. "featured", "trending", "isActive"
    const allowedFlags = [
      "featured",
      "trending",
      "popular",
      "recommended",
      "isActive",
      "certificate",
      "internship",
      "placementSupport",
      "mentorSupport",
    ];

    if (!allowedFlags.includes(flag)) {
      return res.status(400).json({
        success: false,
        message: "Invalid flag provided",
      });
    }

    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    program[flag] = !program[flag];
    await program.save();

    res.status(200).json({
      success: true,
      message: `${flag} toggled successfully`,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle flag",
      error: error.message,
    });
  }
};

// ===========================
// UPDATE Status (draft/published/archived)
// ===========================
export const updateProgramStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updateData = { status };
    if (status === "published") {
      updateData.publishedAt = new Date();
    }

    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// ===========================
// BULK DELETE
// ===========================
export const bulkDeletePrograms = async (req, res) => {
  try {
    const { ids } = req.body; // array of program IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No IDs provided",
      });
    }

    await Program.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${ids.length} program(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to bulk delete programs",
      error: error.message,
    });
  }
};