import Program from "../../models/Program.js";

/**
 * GET ALL ACTIVE PROGRAMS
 */
export const getActivePrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .select("name slug shortDescription category image points")
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: programs.length,
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
 * REDIRECT TO PLATFORM LINK
 */
export const redirectToPlatform = async (req, res) => {
  try {
    const { slug } = req.params;

    // 🔥 Find and increment clickCount atomically
    const program = await Program.findOneAndUpdate(
      { slug, isActive: true },
      { $inc: { clickCount: 1 } },   // increment by 1
      { new: true, select: "platformLink clickCount" }
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    // Optional: log for debugging
    console.log(
      `Program "${slug}" clicked. Total clicks: ${program.clickCount}`
    );

    // 🔥 Redirect to external platform
    return res.redirect(program.platformLink);

  } catch (error) {
    console.error("Redirect error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};