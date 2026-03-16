import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeName: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },

  // File Storage
  fileUrl: {
    type: String,
    required: true
  },         // Original upload
  improvedFileUrl: {
    type: String
  },                // For "Download Improved Resume"

  // Analysis Data (for ATSScore, MissingSkills, Suggestions components)
  atsScore: {
    type: Number,
    default: 0
  },
  missingSkills: [{
    type: String
  }],
  aiSuggestions: [{
    type: String
  }],
  analysisSummary: {
    type: String
  },                // Short text for ResumeCard preview

  // State Management (for Zustand Store & UI Loading)
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
