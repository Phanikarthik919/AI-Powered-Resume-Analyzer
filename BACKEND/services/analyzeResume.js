import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResume = async (resumeText, targetRole, jobDescription = "") => {
  // ── JD comparison block ─────────────────────────────────────────────────────
  const jdSection = jobDescription?.trim()
    ? `A JOB DESCRIPTION HAS BEEN PROVIDED. You MUST use it as the primary source of truth.
Compare the resume's skills, titles, and technologies directly against the JD.

---JD START---
${jobDescription.trim().slice(0, 4000)}
---JD END---

KEYWORD GAP PENALTY:
- Count required keywords/skills in the JD that are ABSENT from the resume.
- 1–3 missing JD keywords: -5 pts
- 4–6 missing JD keywords: -15 pts
- 7+  missing JD keywords: -25 pts
Apply this penalty AFTER computing the rubric total (minimum final score = 0).`
    : `No job description provided. Use strict, widely-accepted industry standards for "${targetRole}".`;

  const prompt = `
You are a STRICT, calibrated ATS scoring engine. Your job is to give REALISTIC scores.
Most real-world resumes score between 40–70. Only exceptional resumes score above 80.

Evaluate this resume for the role: "${targetRole}".

${jdSection}

╔══════════════════════════════════════════════════════════╗
║         SCORE CALIBRATION ANCHORS (READ FIRST)          ║
╠══════════════════════════════════════════════════════════╣
║ 90–100: Perfect resume. All sections, 8+ directly        ║
║         relevant skills, 3+ quantified achievements,     ║
║         strong projects with real impact. Rare.          ║
║                                                          ║
║ 75–89:  Strong resume. All sections present, 6–7         ║
║         relevant skills, 1–2 quantified achievements,    ║
║         good projects. Ready for senior roles.           ║
║                                                          ║
║ 55–74:  Average resume. Most sections present, 4–5       ║
║         relevant skills, vague experience descriptions,  ║
║         projects lack measurable impact.                 ║
║                                                          ║
║ 35–54:  Weak resume. Missing sections, few relevant      ║
║         skills, no quantified achievements, thin         ║
║         project descriptions.                            ║
║                                                          ║
║ 0–34:   Very weak. Missing critical sections, irrelevant ║
║         skills, no evidence of technical competence.     ║
╚══════════════════════════════════════════════════════════╝

══════════════════════════════════════════════════
STEP-BY-STEP SCORING RUBRIC  (Start at 0, add up)
══════════════════════════════════════════════════

── A. SECTION COMPLETENESS (max 15 pts) ──────────
Award points ONLY if the section heading is explicitly present AND contains meaningful content (not just the label):
+4  Skills section with at least 5 listed skills
+4  Experience/Work History with at least 1 role described
+4  Projects section with at least 1 project described
+3  Education section with degree, institution, and year

── B. SKILL MATCH for "${targetRole}" (max 25 pts) ──
Count ONLY skills that are DIRECTLY and COMMONLY required for this specific role.
Do NOT count generic skills (e.g. "communication", "teamwork", "MS Office") unless the role specifically needs them.
+5   1–2 directly relevant skills
+12  3–5 directly relevant skills
+20  6–8 directly relevant skills
+25  9 or more directly relevant skills

── C. EXPERIENCE DEPTH (max 25 pts) ─────────────
+5   Has at least 1 job/internship entry
+5   Role titles and company names are present
+5   Descriptions mention SPECIFIC technologies or tools used
+10  Has 2 or more bullet points with QUANTIFIED impact
     (e.g. "reduced latency by 40%", "served 10k users", "led team of 4")
     — Do NOT award this if numbers are only in dates or version numbers.

── D. PROJECT QUALITY (max 20 pts) ───────────────
+4   Has at least 1 project
+4   Project uses technologies directly relevant to "${targetRole}"
+6   Project description explains what it DOES (not just what you built)
+6   Project shows real-world usage, deployed link, users, or measurable result
     — Award only if EXPLICITLY stated, never assume.

── E. EDUCATION & CREDENTIALS (max 10 pts) ───────
+5   Degree in CS, Engineering, or directly related field
+3   Certifications or courses relevant to "${targetRole}"
+2   Academic achievements (GPA ≥ 3.5, honors, relevant coursework)
If none of the above apply: +0

── F. RED FLAG DEDUCTIONS ────────────────────────
Subtract from the total for these common ATS issues:
-5   Resume appears to be a single paragraph (no clear structure)
-5   Skills section is too vague (only lists "Python", "Java" with no context)
-5   Every experience bullet starts with the same verb OR is only 1 line each
-5   No dates anywhere in the resume
-10  Fewer than 3 relevant skills for the given role

══════════════════════════════════════════════════
PENALTY FROM JD GAPS (if JD was provided — see above)
══════════════════════════════════════════════════
Apply the JD keyword gap penalty now if applicable.

══════════════════════════════════════════════════
ABSOLUTE RULES — VIOLATIONS ARE NOT PERMITTED:
══════════════════════════════════════════════════
1. You MUST follow the calibration anchors. If you give a score above 75, you must be able to justify it with specific evidence from the resume text.
2. Never award points that are not clearly evidenced in the resume text.
3. If a criterion says "quantified achievement" and there are NO numbers tied to impact, the +10 is NOT awarded.
4. The score must be an integer between 0 and 100.
5. Return ONLY valid JSON — no markdown, no explanation outside the JSON.

══════════════════════════════════════════════════
OUTPUT FORMAT (STRICT JSON ONLY):
══════════════════════════════════════════════════
{
  "atsScore": <integer 0–100>,
  "scoringBreakdown": {
    "sectionCompleteness": <0–15>,
    "skillMatch": <0–25>,
    "experienceDepth": <0–25>,
    "projectQuality": <0–20>,
    "education": <0–10>,
    "deductions": <0 or negative integer>
  },
  "missingSkills": ["skill1", "skill2", "skill3"],
  "aiSuggestions": [
    "Specific, actionable suggestion referencing the resume",
    "Specific, actionable suggestion referencing the resume",
    "Specific, actionable suggestion referencing the resume"
  ],
  "analysisSummary": "2–3 sentences explaining exactly WHY the resume got this score, referencing specific strengths and gaps found."
}

══════════════════════════════════════════════════
RESUME TEXT:
══════════════════════════════════════════════════
${resumeText}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a strict, calibrated ATS scoring engine. You follow a precise point-based rubric. Most resumes score 40–70. You never inflate scores. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
    });

    const rawText = response.choices[0].message.content;
    console.log("RAW AI RESPONSE:\n", rawText);

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    const extractJSON = (str) => {
      const start = str.indexOf("{");
      const end = str.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
      return JSON.parse(str.slice(start, end + 1));
    };

    const parsed = extractJSON(cleaned);

    // Clamp score to 0–100 just in case
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
