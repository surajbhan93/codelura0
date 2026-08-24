import { analyze } from "../utils/score.js";

export const atsChecker = async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    // Better validation
    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please paste your resume text.",
      });
    }

    if (resume.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: "Resume seems too short. Please paste at least 50 characters of your resume.",
      });
    }

    if (resume.length > 100000) {
      return res.status(400).json({
        success: false,
        message: "Resume is too large. Please limit to 100,000 characters.",
      });
    }

    // Clean the resume
    const cleanResume = resume
      .replace(/[\r\n]+/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    const cleanJD = jobDescription
      ? jobDescription.replace(/[\r\n]+/g, "\n").replace(/\s+/g, " ").trim()
      : null;

    const result = analyze(cleanResume, cleanJD);

    // If there's an error in the result
    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.json({
      success: true,
      data: {
        ...result,
        analyzedAt: new Date().toISOString(),
        wordCount: result.wc || 0,
      },
    });
  } catch (err) {
    console.error("ATS Checker Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing your resume. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
};