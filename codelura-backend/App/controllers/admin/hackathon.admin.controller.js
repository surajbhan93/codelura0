import Hackathon from "../../models/Hackathon.js";
import slugify from "slugify";
import Submission from "../../models/Submission.js";
import Evaluation from "../../models/Evaluation.js";
export const createHackathon = async (req, res) => {
  try {

    const {
      title,
      shortDescription,
      fullDescription,
      bannerImage,

      prizePool,
      prizeDetails,

      tracks,
      rules,
      judgingCriteria,

      teamSizeMin,
      teamSizeMax,

      registrationStart,
      registrationDeadline,
      startDate,
      endDate,

      maxParticipants,

      sponsors,
      judges,
      faqs,

      discordLink,
      websiteLink

    } = req.body;

    if (!title || !shortDescription || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const slug = slugify(title, { lower: true });

    const hackathon = await Hackathon.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      bannerImage,

      prizePool,
      prizeDetails,

      tracks,
      rules,
      judgingCriteria,

      teamSizeMin,
      teamSizeMax,

      registrationStart,
      registrationDeadline,
      startDate,
      endDate,

      maxParticipants,

      sponsors,
      judges,
      faqs,

      discordLink,
      websiteLink,

      createdBy: req.user._id,
      status: "draft"
    });

    return res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: hackathon
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


export const getAllHackathonsAdmin = async (req, res) => {
  try {

    const hackathons = await Hackathon.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};


export const deleteHackathon = async (req, res) => {
  try {

    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    await Hackathon.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getHackathonAnalytics = async (req, res) => {
  try {

    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        title: hackathon.title,
        participants: hackathon.participantsCount,
        submissions: hackathon.submissionsCount,
        maxParticipants: hackathon.maxParticipants,
        status: hackathon.status
      }
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const togglePublishHackathon = async (req, res) => {
  try {

    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    hackathon.isPublished = !hackathon.isPublished;

    await hackathon.save();

    return res.status(200).json({
      success: true,
      message: "Publish status updated",
      data: hackathon
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getAllSubmissions = async (req, res) => {

  try {

    const submissions = await Submission.find()
      .populate("user", "name email")
      .populate("hackathon", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });

  } catch (error) {

    console.error("Get Submissions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

export const getHackathonSubmissions = async (req, res) => {
  try {

    const { id } = req.params;

    const submissions = await Submission.find({ hackathon: id })
      .populate("user", "name email")
      .populate("hackathon", "title");

    const evaluations = await Evaluation.find({
      submissionId: { $in: submissions.map(s => s._id.toString()) }
    });

    const evalMap = {};
    evaluations.forEach(e => {
      evalMap[e.submissionId] = e;
    });

    const result = submissions.map(sub => {

      const evalData = evalMap[sub._id.toString()];

      return {
        ...sub.toObject(),

        plagiarismScore: evalData?.plagiarism?.similarityScore || 0,
        ruleScore: evalData?.ruleScore || 0,
        finalScore: evalData?.finalScore || 0,
        classificationLevel: evalData?.classification?.qualityLevel || null,
        aiJudgingRequired: evalData?.classification?.aiJudgingRequired || false,
        judgeRemarks: evalData?.remarks || null

      };

    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};
// import Evaluation from "../models/Evaluation.js";
// import Submission from "../models/Submission.js";

export const saveSubmissionScores = async (req, res) => {

  try {

    const submissionId = req.params.id;

    const {
      plagiarismScore,
      classificationLevel,
      judgeRuleScore,
      judgeFinalScore,
      judgeRemarks,
      aiJudgingRequired
    } = req.body;

    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found"
      });
    }

    // ---- Evaluation Save ----

    let evaluation = await Evaluation.findOne({ submissionId });

    if (!evaluation) {

      evaluation = new Evaluation({
        submissionId,
        hackathonId: submission.hackathon
      });

    }

    evaluation.classification = {
      qualityLevel: classificationLevel,
      aiJudgingRequired
    };

    evaluation.plagiarism = {
      similarityScore: plagiarismScore
    };

    evaluation.ruleScore = judgeRuleScore;
    evaluation.finalScore = judgeFinalScore;
    evaluation.remarks = judgeRemarks;

    await evaluation.save();

    // ---- Submission Update ----

    submission.plagiarismScore = plagiarismScore;

    submission.innovationScore = judgeFinalScore;
    submission.technicalScore = judgeRuleScore;

    submission.impactScore = Math.round(judgeFinalScore / 2);

    submission.score =
      submission.innovationScore +
      submission.technicalScore +
      submission.impactScore;

    await submission.save();

    res.json({
      success: true,
      message: "AI scores saved successfully",
      data: submission
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};