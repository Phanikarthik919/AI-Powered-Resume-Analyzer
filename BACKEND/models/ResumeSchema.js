import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    resumeName: { type: String, required: true },
    targetRole: { type: String, required: true },
    jobDescription: { type: String, default: "" },

    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },

    improvedFileUrl: { type: String, default: "" },
    improvedFilePublicId: { type: String, default: "" },

    atsScore: { type: Number, default: 0 },

    scoreBreakdown: {
      sectionCompleteness: { type: Number, default: 0 },
      skillMatch: { type: Number, default: 0 },
      experienceDepth: { type: Number, default: 0 },
      projectQuality: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },

    missingSkills: [{ type: String }],
    aiSuggestions: [{ type: String }],
    analysisSummary: { type: String },
    resumeText: { type: String, default: "" },

    status: {
      type: String,
      enum: ["uploading", "processing", "completed", "failed"],
      default: "uploading",
    },
  },
  { timestamps: true },
);

export const Resume = mongoose.model("resume", resumeSchema);
