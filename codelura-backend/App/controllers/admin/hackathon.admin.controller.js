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
      bannerImageUrl,
      theme,
      mode,
      prizePool,
      prizeDetails,
      prizes,
      tracks,
      rules,
      eligibility,
      submissionRequirements,
      benefits,
      judgingCriteria,
      teamSizeMin,
      teamSizeMax,
      teamSize,
      registrationStart,
      registrationStartDate,
      registrationDeadline,
      registrationEndDate,
      startDate,
      hackathonStartDate,
      endDate,
      hackathonEndDate,
      submissionDeadline,
      winnerAnnouncementDate,
      maxParticipants,
      sponsors,
      judges,
      faqs,
      discordLink,
      websiteLink,
      status,
      isPublished
    } = req.body;

    if (!title || !shortDescription) {
      return res.status(400).json({
        success: false,
        message: "Title and short description are required"
      });
    }

    const slug = req.body.slug || slugify(title, { lower: true, strict: true });

    const hackathon = await Hackathon.create({
      title,
      slug,
      theme,
      mode: mode || "Online",
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      bannerImage: bannerImage || bannerImageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475",
      bannerImageUrl: bannerImageUrl || bannerImage,
      prizePool: prizePool || "₹1,00,000",
      prizeDetails,
      prizes,
      tracks,
      rules,
      eligibility,
      submissionRequirements,
      benefits,
      judgingCriteria,
      teamSizeMin: teamSizeMin || teamSize?.min || 1,
      teamSizeMax: teamSizeMax || teamSize?.max || 4,
      registrationStart: registrationStart || registrationStartDate || new Date(),
      registrationStartDate: registrationStartDate || registrationStart || new Date(),
      registrationDeadline: registrationDeadline || registrationEndDate || new Date(),
      registrationEndDate: registrationEndDate || registrationDeadline || new Date(),
      startDate: startDate || hackathonStartDate || new Date(),
      hackathonStartDate: hackathonStartDate || startDate || new Date(),
      endDate: endDate || hackathonEndDate || new Date(),
      hackathonEndDate: hackathonEndDate || endDate || new Date(),
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline) : undefined,
      winnerAnnouncementDate: winnerAnnouncementDate ? new Date(winnerAnnouncementDate) : undefined,
      maxParticipants: maxParticipants || 500,
      sponsors,
      judges,
      faqs,
      discordLink,
      websiteLink,
      createdBy: req.user?._id,
      status: status || "upcoming",
      isPublished: isPublished !== undefined ? isPublished : true
    });

    return res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: hackathon
    });

  } catch (error) {
    console.error("Hackathon Creation Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error"
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
      (submission.innovationScore || 0) +
      (submission.technicalScore || 0) +
      (submission.impactScore || 0);

    await submission.save();

    return res.json({
      success: true,
      message: "AI scores saved successfully",
      data: submission
    });

  } catch (error) {
    console.error("Save Submission Scores Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getHackathonParticipantsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Search by _id or slug
    let hackathon = await Hackathon.findById(id).populate("participants", "name email role createdAt isEmailVerified");
    if (!hackathon) {
      hackathon = await Hackathon.findOne({ slug: id }).populate("participants", "name email role createdAt isEmailVerified");
    }

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    // Get submissions for these participants to enrich team & track info
    const submissions = await Submission.find({ hackathon: hackathon._id }).select("user projectTitle status techStack createdAt");
    const subMap = {};
    submissions.forEach((s) => {
      if (s.user) subMap[s.user.toString()] = s;
    });

    const participantList = (hackathon.participants || []).map((p) => {
      const sub = subMap[p._id.toString()];
      return {
        _id: p._id,
        name: p.name,
        email: p.email,
        role: p.role || "Student",
        isEmailVerified: p.isEmailVerified || false,
        joinedAt: p.createdAt,
        submissionStatus: sub ? sub.status : "No Submission",
        projectTitle: sub ? sub.projectTitle : null,
      };
    });

    return res.status(200).json({
      success: true,
      count: participantList.length,
      hackathonTitle: hackathon.title,
      data: participantList
    });

  } catch (error) {
    console.error("Get Hackathon Participants Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};