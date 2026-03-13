import mongoose from "mongoose";

const hackathonSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true,
index: true
},

slug: {
type: String,
unique: true,
index: true
},

shortDescription: {
type: String,
required: true,
maxlength: 200
},

fullDescription: {
type: String,
required: true
},

bannerImage: {
type: String,
required: true
},

prizePool: {
type: String,
required: true
},

prizeDetails: String,

rules: String,

tracks: [
{
title: String,
description: String
}
],

teamSizeMin: {
type: Number,
default: 1
},

teamSizeMax: {
type: Number,
default: 4
},

judges: [
{
name: String,
role: String,
company: String,
image: String
}
],

sponsors: [
{
name: String,
logo: String,
website: String
}
],

faqs: [
{
question: String,
answer: String
}
],

judgingCriteria: [
{
title: String,
weightage: Number
}
],

discordLink: String,
websiteLink: String,

registrationStart: {
type: Date,
required: true
},

registrationDeadline: {
type: Date,
required: true,
index: true
},

startDate: {
type: Date,
required: true,
index: true
},

endDate: {
type: Date,
required: true
},
participants: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  default: []
},

maxParticipants: {
type: Number,
default: 1000
},

participantsCount: {
type: Number,
default: 0
},

submissionsCount: {
type: Number,
default: 0
},

status: {
type: String,
enum: ["draft","upcoming","ongoing","completed"],
default: "draft",
index: true
},

createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "User"
},

isPublished: {
type: Boolean,
default: false
}

},
{ timestamps: true }
);

export default mongoose.model("Hackathon", hackathonSchema);