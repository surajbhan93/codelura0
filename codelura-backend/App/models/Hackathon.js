import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    theme: String,
    mode: {
      type: String,
      default: "Online",
    },

    shortDescription: {
      type: String,
      required: true,
    },

    fullDescription: {
      type: String,
      required: true,
    },

    bannerImage: String,
    bannerImageUrl: String,

    prizePool: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    prizeDetails: String,

    prizes: [
      {
        rank: Number,
        title: String,
        cashPrize: Number,
        benefits: [String],
      },
    ],

    rules: {
      type: mongoose.Schema.Types.Mixed, // Accepts both Array of Strings and String
    },

    eligibility: [String],
    submissionRequirements: [String],
    benefits: [String],

    tracks: [
      {
        name: String,
        title: String,
        slug: String,
        description: String,
      },
    ],

    teamSizeMin: {
      type: Number,
      default: 1,
    },

    teamSizeMax: {
      type: Number,
      default: 4,
    },

    judges: [
      {
        name: String,
        role: String,
        company: String,
        image: String,
      },
    ],

    sponsors: [
      {
        name: String,
        logo: String,
        website: String,
      },
    ],

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    judgingCriteria: [
      {
        criteria: String,
        title: String,
        weight: Number,
        weightage: Number,
      },
    ],

    discordLink: String,
    websiteLink: String,

    registrationStart: Date,
    registrationStartDate: Date,
    registrationDeadline: Date,
    registrationEndDate: Date,

    startDate: Date,
    hackathonStartDate: Date,
    endDate: Date,
    hackathonEndDate: Date,

    submissionDeadline: Date,
    winnerAnnouncementDate: Date,

    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    maxParticipants: {
      type: Number,
      default: 500,
    },

    participantsCount: {
      type: Number,
      default: 0,
    },

    submissionsCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "upcoming", "ongoing", "active", "completed", "ended"],
      default: "upcoming",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hackathon", hackathonSchema);