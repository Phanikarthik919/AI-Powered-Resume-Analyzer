import exp from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/UserSchema.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Resume } from "../models/ResumeSchema.js";
import upload from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import { extractPdfText } from "../services/extractPdfText.js";
import { analyzeResume, parseResumeToStructured, optimizeResumeSection } from "../services/analyzeResume.js";
import fs from "fs";

const userApp = exp.Router();

// AI optimize specific section
userApp.post("/optimize-section", verifyToken, async (req, res, next) => {
  try {
    const { sectionType, content, targetRole, jobDescription } = req.body;
    if (!content || !sectionType) {
      return res.status(400).json({ message: "Content and section type are required" });
    }

    const optimization = await optimizeResumeSection(sectionType, content, targetRole || "Professional", jobDescription || "");
    res.json({ message: "Optimization fetched", payload: optimization });
  } catch (err) {
    next(err);
  }
});

//register
userApp.post("/register", async (req, res, next) => {
  try {
    // get user data
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // save user
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
});

//get users
userApp.get("/user", verifyToken, async (req, res) => {
  return res.status(200).json({ message: "hey authenticated" });
});

// upload resume
userApp.post("/upload-resume", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { resumeName, targetRole, jobDescription } = req.body;
    const userId = req.user.userId;

    // Extract text — structuredText preserves line breaks for display,
    // aiText is compact (up to 12,000 chars) for the AI prompt
    const { structuredText, aiText } = await extractPdfText(req.file.path);

    // Run ATS scoring + structured parsing in parallel — cuts upload time in half
    const [groqResponse, parsedData] = await Promise.all([
      analyzeResume(aiText, targetRole, jobDescription || ""),
      parseResumeToStructured(aiText).catch((err) => {
        console.log("Structured parsing failed (non-fatal):", err.message);
        return {}; // don't fail the whole upload if parsing fails
      }),
    ]);

    console.log("Groq ATS response:", groqResponse);

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "resumes",
    });

    // delete file safely
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("File delete error:", err);
    });

    // Save to DB
    const newResume = await Resume.create({
      userId,
      resumeName,
      targetRole,
      jobDescription: jobDescription || "",
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      atsScore: groqResponse.atsScore,
      scoringBreakdown: groqResponse.breakdown,
      missingSkills: groqResponse.missingSkills,
      aiSuggestions: groqResponse.aiSuggestions,
      analysisSummary: groqResponse.analysisSummary,
      resumeText: structuredText,
      parsedData,
      status: "completed",
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: newResume,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET user resumes
userApp.get("/user-resumes", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const resumes = await Resume.find({ userId }).select("resumeName targetRole atsScore createdAt").sort({ createdAt: -1 });

    res.json({
      message: "Resumes fetched successfully",
      payload: resumes,
    });
  } catch (err) {
    next(err);
  }
});

// get profile
userApp.get("/profile", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("name email");

    res.json({
      message: "Profile fetched successfully",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});

// Get specific resume analysis
userApp.get("/resume/:id", verifyToken, async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume analysis fetched successfully", payload: resume });
  } catch (err) {
    next(err);
  }
});

// Update profile
userApp.patch("/update-profile", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    // check if new email already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select("-password");
    res.json({ message: "Profile updated successfully", payload: user });
  } catch (err) {
    next(err);
  }
});


// Update resume data
userApp.put("/update-resume/:id", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { parsedData } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: { parsedData } },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    res.json({ message: "Resume updated successfully", payload: resume });
  } catch (err) {
    next(err);
  }
});

// Download resume
userApp.get("/resume/:id/download", verifyToken, async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    // Redirect to cloudinary URL or send it back
    res.redirect(resume.fileUrl);
  } catch (err) {
    next(err);
  }
});

export default userApp;
