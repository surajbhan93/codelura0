import Hackathon from "../../models/Hackathon.js";
import User from "../../models/User.js";
import mongoose from "mongoose";
// import Hackathon from "../../models/Hackathon.js";
import Submission from "../../models/Submission.js";
const mockHackathons = [
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d1",
    id: "64f1a2b3c4d5e6f7a8b9c0d1",
    title: "AI Innovation Challenge",
    shortDescription: "Build the next generation of AI-powered applications that solve real-world problems.",
    fullDescription: "Join us for a 15-day intensive hackathon focused on Generative AI, LLMs, and innovative AI agents. Whether you're a seasoned developer or just starting with AI, this challenge provides the tools and mentorship to bring your wildest ideas to life. We're looking for projects that demonstrate technical excellence, creativity, and real impact.",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "upcoming",
    prizePool: "$5,000",
    prizeDetails: "First Prize: $3,000 + Codelura Premium for Life\nSecond Prize: $1,500 + Mentorship Session\nThird Prize: $500",
    rules: "1. Teams can have 1-4 members.\n2. Projects must use at least one AI-related technology.\n3. Original work only. Any plagiarism will result in disqualification.\n4. Code must be submitted via a public GitHub repository.",
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    participants: [],
    participantsCount: 42
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d2",
    id: "64f1a2b3c4d5e6f7a8b9c0d2",
    title: "Web3 World Summit",
    shortDescription: "Decentralize everything. Create dApps that empower communities and secure data.",
    fullDescription: "Web3 is about more than just crypto. It's about data sovereignty, decentralized governance, and transparent systems. In this hackathon, we challenge you to build dApps on various protocols that solve identity, supply chain, or social network issues. Get ready to BUIDL.",
    bannerImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Started 2 days ago
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: "ongoing",
    prizePool: "$10,000",
    prizeDetails: "Winner: $7,000\nRunner up: $3,000\nCommunity Choice: $1,000",
    rules: "1. All smart contracts must be open-sourced.\n2. Submissions must include a video demo (max 3 mins).\n3. Gas optimization will be a key judging criteria.",
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    participants: [],
    participantsCount: 128
  },
  {
    _id: "64f1a2b3c4d5e6f7a8b9c0d3",
    id: "64f1a2b3c4d5e6f7a8b9c0d3",
    title: "Codelura Genesis Hack",
    shortDescription: "The hackathon that started it all. Relive the best projects from our community.",
    fullDescription: "Our first ever hackathon was a massive success with over 100 projects submitted. This page serves as an archive of the event and the incredible innovations our community produced.",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Ended 2 months ago
    endDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    status: "completed",
    prizePool: "$2,500",
    prizeDetails: "Awarded to 'EcoTrack', 'DecentralPay', and 'DevFlow'.",
    rules: "Event has concluded. No more submissions accepted.",
    registrationDeadline: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000),
    participants: [],
    participantsCount: 256
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

const getDynamicStatus = (h) => {
  const now = new Date();
  const start = new Date(h.startDate);
  const end = new Date(h.endDate);
  
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
};

/**
 * @desc    Get all hackathons filtered by status
 * @route   GET /api/hackathons
 * @access  Public
 */
export const getHackathons = async (req, res) => {
  try {
    const { status } = req.query;
    let data = [];
    const now = new Date();

    if (isDbConnected()) {
      let query = {};
      
      // Dynamic filtering based on dates instead of hardcoded status field
      if (status === "upcoming") {
        query = { startDate: { $gt: now } };
      } else if (status === "ongoing") {
        query = { startDate: { $lte: now }, endDate: { $gte: now } };
      } else if (status === "completed") {
        query = { endDate: { $lt: now } };
      }

      const hackathons = await Hackathon.find(query)
        .sort({ startDate: status === "completed" ? -1 : 1 })
        .select("-fullDescription -rules -prizeDetails");
      
      data = hackathons.map(h => {
        const obj = h.toObject();
        return { ...obj, status: getDynamicStatus(obj) };
      });
    } else {
      // Mock fallback
      data = mockHackathons.map(h => ({ ...h, status: getDynamicStatus(h) }));
      if (status) {
        data = data.filter(h => h.status === status);
      }
    }

    const userId = req.user?._id || req.user?.id;
    const finalData = data.map(hackathon => ({
      ...hackathon,
      id: hackathon.id || hackathon._id?.toString(),
      isRegistered: userId ? (hackathon.participants || []).some(p => p.toString() === userId.toString()) : false,
      currentUser: userId ? { id: userId } : null
    }));

    res.json(finalData);
  } catch (error) {
    console.error("Error in getHackathons:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Get hackathon details by ID
 * @route   GET /api/hackathons/:id
 * @access  Public
 */
export const getHackathonById = async (req, res) => {
  try {
    let hackathon;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(req.params.id)) {
      hackathon = await Hackathon.findById(req.params.id);
      if (hackathon) hackathon = hackathon.toObject();
    }

    if (!hackathon) {
      hackathon = mockHackathons.find(h => h.id === req.params.id || h._id === req.params.id);
    }

    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found" });
    }

    const userId = req.user?._id || req.user?.id;
    const data = {
      ...hackathon,
      id: hackathon.id || hackathon._id?.toString(),
      status: getDynamicStatus(hackathon),
      isRegistered: userId ? (hackathon.participants || []).some(p => p.toString() === userId.toString()) : false,
      currentUser: userId ? { id: userId } : null
    };

    res.json(data);
  } catch (error) {
    console.error("Error in getHackathonById:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Join a hackathon
 * @route   POST /api/participation/join
 * @access  Private
 */
export const joinHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.body;

    if (!hackathonId) {
      return res.status(400).json({
        success: false,
        message: "Hackathon ID is required"
      });
    }

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    if (!isDbConnected()) {
      return res.status(500).json({
        success: false,
        message: "Database not connected"
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    // Ensure participants array exists
    if (!hackathon.participants) {
      hackathon.participants = [];
    }

    const now = new Date();
    const deadline = new Date(hackathon.registrationDeadline);

    if (now > deadline) {
      return res.status(400).json({
        success: false,
        message: "Registration has closed"
      });
    }

    // Max participants check
    if (hackathon.participantsCount >= hackathon.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Maximum participants reached"
      });
    }

    // Duplicate check
    const alreadyJoined = hackathon.participants.some(
      (id) => id.toString() === userId
    );

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this hackathon"
      });
    }

    // Add participant
    hackathon.participants.push(userId);

    // Update counter
    hackathon.participantsCount += 1;

    await hackathon.save();

    return res.status(200).json({
      success: true,
      message: "Successfully joined the hackathon",
      participantsCount: hackathon.participantsCount
    });

  } catch (error) {
    console.error("Error in joinHackathon:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const submitProject = async (req, res) => {
  try {

    const {
      hackathonId,
      projectTitle,
      projectDescription,
      problemStatement,
      solution,
      techStack,
      githubRepo,
      demoVideo,
      liveUrl,
      pitchDeck,
      screenshots
    } = req.body;

    const userId = req.user.id;

    // Required validation
    if (!hackathonId || !projectTitle || !projectDescription) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found"
      });
    }

    const now = new Date();

    // Hackathon must be ongoing
    if (now < hackathon.startDate || now > hackathon.endDate) {
      return res.status(400).json({
        success: false,
        message: "Submissions are not open"
      });
    }

    // Check if user joined hackathon
    const joined = hackathon.participants.some(
      (id) => id.toString() === userId
    );

    if (!joined) {
      return res.status(403).json({
        success: false,
        message: "You must join the hackathon first"
      });
    }

    // Prevent duplicate submissions
    const existing = await Submission.findOne({
      hackathon: hackathonId,
      user: userId
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Submission already exists"
      });
    }

    // Create submission
    const submission = await Submission.create({
      hackathon: hackathonId,
      user: userId,
      projectTitle,
      projectDescription,
      problemStatement,
      solution,
      techStack: techStack || [],
      githubRepo,
      demoVideo,
      liveUrl,
      pitchDeck,
      screenshots: screenshots || []
    });

    // Update hackathon submissions count
    hackathon.submissionsCount += 1;
    await hackathon.save();

    return res.status(201).json({
      success: true,
      message: "Project submitted successfully",
      data: submission
    });

  } catch (error) {

    console.error("Submission Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};

export const getMySubmission = async (req,res)=>{

try{

const userId = req.user.id
const {hackathonId} = req.params

const submission = await Submission.findOne({
hackathon: hackathonId,
user: userId
})

res.json({
success:true,
data:submission
})

}catch(err){

res.status(500).json({
success:false,
message:"Server Error"
})

}

}