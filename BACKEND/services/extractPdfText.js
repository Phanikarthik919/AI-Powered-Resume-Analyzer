import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const extractPdfText = async (filePath) => {
  const dataBuffer = await fs.promises.readFile(filePath);

  let extractedText = "";

  if (typeof pdf === "function") {
    const pdfData = await pdf(dataBuffer);
    extractedText = pdfData.text;
  } else if (pdf.default && typeof pdf.default === "function") {
    const pdfData = await pdf.default(dataBuffer);
    extractedText = pdfData.text;
  } else {
    throw new Error("PDF parsing failed");
  }

  const rawText = extractedText?.trim();

  if (!rawText || rawText.length < 20) {
    throw new Error("Unable to extract text. Please upload a text-based PDF (not scanned).");
  }

  // ── Preserve structure for the "Extracted Text" view and AI analysis ──
  // Only collapse runs of blank lines (3+ newlines → 2), keep single newlines
  const structuredText = rawText
    .replace(/\r\n/g, "\n") // normalize Windows line endings
    .replace(/\r/g, "\n") // normalize old Mac line endings
    .replace(/\n{3,}/g, "\n\n") // collapse 3+ blank lines to max 2
    .replace(/[ \t]{2,}/g, " ") // collapse multiple spaces/tabs (but NOT newlines)
    .trim();

  // ── For the AI prompt, collapse to single spaces so the prompt stays compact ──
  // We send up to 12,000 chars (covers most 2-page resumes at ~600 wpm)
  const aiText = structuredText
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 12000);

  console.log(`Extracted PDF text: ${structuredText.length} chars total | sending ${aiText.length} chars to AI`);

  // Return both: structured text for DB display, compact text for AI
  return { structuredText, aiText };
};
