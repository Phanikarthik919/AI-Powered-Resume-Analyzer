import Groq from "groq-sdk";
import { config } from "dotenv";

config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── ATS Analysis ──────────────────────────────────────────────────────────────
export const analyzeResume = async (resumeText, targetRole, jobDescription) => {
  const prompt = `
  You are a COLD, DISPASSIONATE ATS MATHEMATICIAN. You REJECT 95% of candidates. 
  Your task is to calculate a final score out of 100 for this resume based on the role: "${targetRole}".
  ${jobDescription ? `JD REQUIREMENTS (MANDATORY MATCH): \n${jobDescription}\n` : ""}

  ----------------------------------
  SCORING ALGORITHM (START AT 0):
  ----------------------------------
  
  1. SECTION INTEGRITY (Max 5):
  - +1.25 for each: [Skills, Experience, Projects, Education].
  
  2. HARD SKILL MATCH (Max 25):
  - Strictly count unique tech skills from the JD/Role.
  - 0-5 skills: +5
  - 6-10 skills: +10
  - 11-15 skills: +15
  - 16-20 skills: +20
  - 21+ skills: +25 (ONLY if they exactly match ${targetRole} stack).

  3. QUANTIFIABLE DATA (Max 40):
  - Count unique metrics (%, $, numbers, kHz, etc.) in work history.
  - 0-2 metrics: +5
  - 3-5 metrics: +15
  - 6-9 metrics: +25
  - 10+ high-impact metrics: +40

  4. PROJECT VALIDATION (Max 20):
  - Mentions tech stack: +5
  - Valid Links (GitHub/Live): +5
  - Quantified Impact: +10

  5. EDUCATIONAL ALIGNMENT (Max 10):
  - Correct degree: +10
  - Wrong degree: 0

  ----------------------------------
  CRITICAL PENALTIES (SUBTRACT FROM TOTAL):
  ----------------------------------
  - Any personal pronouns (I, me, my, our): -20 (MAJOR RED FLAG)
  - Vague bullets (e.g., "Assisted in", "Worked on", "Responsible for"): -15
  - Using "soft skills" in technical resume: -10
  - Missing LinkedIn/GitHub link: -10
  - Fluff keywords (passionate, motivated, hard-worker, team-player...): -5 PER INSTANCE

  ----------------------------------
  CALCULATION RULES:
  ----------------------------------
  - Points + Points - Penalties = Final Score.
  - Clamp between 0 and 100.
  - BE STINGY. 90% of resumes should score below 40. A 60% is a miracle.

  ----------------------------------
  OUTPUT (JSON ONLY - MUST INCLUDE BREAKDOWN):
  ----------------------------------
  {
    "atsScore": number,
    "breakdown": {
      "sections": number,
      "keywords": number,
      "metrics": number,
      "projects": number,
      "education": number,
      "penalties": number
    },
    "missingSkills": ["skill1", "skill2"],
    "aiSuggestions": ["Direct, harsh correction 1", "Direct, harsh correction 2"],
    "analysisSummary": "1-sentence blunt assessment."
  }

  Return ONLY valid JSON.

  RESUME:
  ${resumeText}
  `;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a cold, mathematical ATS scoring engine. You strictly follow the provided point-based rubric with no subjectivity.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
    });

    const rawText = response.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    const extractJSON = (str) => {
      const start = str.indexOf("{");
      const end = str.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
      return JSON.parse(str.slice(start, end + 1));
    };

    const parsed = extractJSON(cleaned);
    parsed.atsScore = Math.min(100, Math.max(0, Math.round(parsed.atsScore)));

    return parsed;

  } catch (error) {
    console.log("Groq error:", error.message);

    const wordCount = resumeText.split(" ").length;
    const basicScore = Math.min(55, Math.max(10, Math.floor(wordCount / 12)));

    return {
      atsScore: basicScore,
      scoringBreakdown: null,
      missingSkills: [],
      aiSuggestions: [
        "AI analysis was temporarily unavailable. Re-upload to get a full score.",
        "Add quantified achievements (numbers, percentages, team sizes).",
        "Ensure all standard sections (Skills, Experience, Projects, Education) are clearly labeled.",
      ],
      analysisSummary:
        "AI scoring was unavailable. A rough score has been assigned based on resume length. Please re-upload for a detailed analysis.",
    };
  }
};

// ── Parse resume into structured JSON ────────────────────────────────────────
export const parseResumeToStructured = async (resumeText) => {
  const prompt = `
 Extract structured data from this resume and return ONLY valid JSON.
 No markdown, no explanation, no extra text.
 IMPORTANT: Look closely for GitHub links (e.g., github.com/...) and Live Demo links (e.g., vercel.app, heroku, etc.) specifically within Project titles and descriptions. Map them to gitRepo and projectLink.
 If a field has no data, use an empty string "" or empty array [].

 {
   "personalInfo": {
     "name": "",
     "email": "",
     "phone": "",
     "linkedin": "",
     "github": "",
     "portfolio": ""
   },
   "summary": "",
   "skills": {
     "languages": [],
     "frontend": [],
     "backend": [],
     "databases": [],
     "tools": [],
     "cloud": [],
     "other": []
   },
   "experience": [
     {
       "title": "",
       "company": "",
       "duration": "",
       "location": "",
       "description": []
     }
   ],
   "projects": [
     {
       "name": "",
       "description": "",
       "techStack": [],
       "points": [],
       "projectLink": "",
       "gitRepo": ""
     }
   ],
   "education": [
     {
       "degree": "",
       "institution": "",
       "year": "",
       "score": ""
     }
   ],
   "certifications": [
     {
       "name": "",
       "issuer": "",
       "duration": ""
     }
   ],
   "achievements": []
 }

 RESUME TEXT:
 \`${resumeText}\`
 `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You extract structured resume data and return only valid JSON. Use empty strings and empty arrays for missing fields. Never add extra text outside the JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
  });

  const rawText = response.choices[0].message.content;
  console.log("PARSED RESUME DATA:\n", rawText.slice(0, 300), "...");

  const cleaned = rawText.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in parseResumeToStructured response");
  return JSON.parse(cleaned.slice(start, end + 1));
};

// ── Optimize specific resume section ──────────────────────────────────────────
export const optimizeResumeSection = async (sectionType, content, targetRole, jobDescription = "") => {
  const prompt = `
  Optimize this ${sectionType} section for a ${targetRole} position.
  ${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ""}
  
  CURRENT CONTENT:
  ${content}

  Objective:
  1. Use impactful action verbs.
  2. Align the content to the key requirements and keywords in the Job Description (if provided).
  3. For Experience/Projects, quantify results where possible (even if you have to suggest placeholder [X%]).
  4. Ensure it's ATS-friendly and professional.
  5. Keep the output concise but powerful.

  Return ONLY a valid JSON object:
  {
    "optimizedContent": "...",
    "justification": "Short explanation of how this aligns with the ${targetRole} role and keywords from the JD."
  }
  `;

  console.log("Optimization Prompt:", prompt);
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a world-class professional resume writer and ATS expert. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const rawText = response.choices[0].message.content;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error("No JSON in optimization response");
    }
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch (error) {
    throw error;
  }
};
