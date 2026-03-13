import Program from "../../models/Program.js";
import slugify from "slugify";

/**
 * CREATE
 */
export const createProgram = async (req, res) => {
  try {
    const program = await Program.create({
      ...req.body,
      slug: slugify(req.body.name, { lower: true }),
    });

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * READ (Admin)
 */
export const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE
 */
export const updateProgram = async (req, res) => {
  try {
    const updated = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE
 */
export const deleteProgram = async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};