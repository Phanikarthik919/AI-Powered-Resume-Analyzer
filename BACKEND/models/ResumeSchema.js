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
    scoringBreakdown: {
      sections: Number,
      keywords: Number,
      metrics: Number,
      projects: Number,
      education: Number,
      penalties: Number,
    },

    missingSkills: [{ type: String }],
    aiSuggestions: [{ type: String }],
    analysisSummary: { type: String },
    resumeText: { type: String, default: "" },
    parsedData: { type: Object, default: {} },

    status: {
      type: String,
      enum: ["uploading", "processing", "completed", "failed"],
      default: "uploading",
    },
  },
  { timestamps: true },
);

export const Resume = mongoose.model("resume", resumeSchema);
