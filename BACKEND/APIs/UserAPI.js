import exp from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/UserSchema.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { Resume } from "../models/ResumeSchema.js";
import upload from "../middlewares/multer.js";
import cloudinary from "../config/cloudinary.js";
import { extractPdfText } from "../services/extractPdfText.js";
import { analyzeResume } from "../services/analyzeResume.js";
import fs from "fs";

const userApp = exp.Router();

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

    // AI analysis uses compact text + optional job description for accurate matching
    const groqResponse = await analyzeResume(aiText, targetRole, jobDescription || "");

    console.log("Groq response:", groqResponse);

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
      scoreBreakdown: groqResponse.scoringBreakdown || {},

      missingSkills: groqResponse.missingSkills || [],
      aiSuggestions: groqResponse.aiSuggestions || [],
      analysisSummary: groqResponse.analysisSummary || "",

      resumeText: structuredText,
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

// GET single resume
userApp.get("/resume/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({
      message: "Resume fetched",
      payload: resume,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching resume" });
  }
});

// get profile
userApp.get("/profile", verifyToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});

export default userApp;
