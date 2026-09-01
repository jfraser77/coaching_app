import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import "pdf-parse/worker";
import {PDFParse} from "pdf-parse";
import { z } from "zod";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });


// Define a Zod schema for the expected JSON structure returned by the Anthropic API
const ResumeAnalysisSchema = z.object({
  overallScore: z.number(),
  verdict: z.enum(["strong", "needs_work", "weak"]),
  recruiterTake: z.string(),
  flags: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    note: z.string(),
  })),
  scores: z.object({
    impact: z.number(),
    clarity: z.number(),
    atsRisk: z.number(),
    authenticity: z.number(),
  }),
  topStrengths: z.array(z.string()),
  topWeaknesses: z.array(z.string()),
  aiIndicators: z.object({
    detected: z.boolean(),
    confidence: z.number(),
    signals: z.array(z.string()),
  }),
  bookingHook: z.string(),
});

type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

// Analyze a resume and return an analysis
export async function POST(request: NextRequest) {
  const formData = await request.formData(); // Get the form data from the request
  const file = formData.get("resume") as File | null; // Get the uploaded file from the form data

    // Check if a file was provided
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Please upload a PDF file." }, { status: 400 });
    }

    // Read the PDF file as an ArrayBuffer
    let resumeText: string;

    try { 
        const buffer = Buffer.from(await file.arrayBuffer());
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        await parser.destroy();
        resumeText = result.text;
    } catch (error) {
        console.error("PDF parse error:", error);
        return NextResponse.json({ error: "Could not read PDF." }, { status: 400 });
    }

// Send the resume text to the Anthropic API for analysis
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: `You are a recruiter who has reviewed 500+ resumes. Analyze this resume and respond with ONLY valid JSON matching this shape:
{
  "overallScore": number (0-100), "verdict": "strong"|"needs_work"|"weak",
  "recruiterTake": string (2-3 sentences, honest),
  "flags": [{ "type": string, "severity": "low"|"medium"|"high", "note": string }],
  "scores": { "impact": number, "clarity": number, "atsRisk": number, "authenticity": number },
  "topStrengths": string[], "topWeaknesses": string[],
  "aiIndicators": { "detected": boolean, "confidence": number, "signals": string[] },
  "bookingHook": string
}

Resume:
${resumeText}`
    }],
  });

  const textBlock = message.content.find((b) => b.type === "text");

  // Check if the response contains valid JSON
  let analysis: ResumeAnalysis;
  // Attempt to parse the JSON response from Claude
  try {
    const raw = textBlock!.text.trim(); // Get the text content of the response
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, ""); // Remove any code block formatting
    const parsed = JSON.parse(cleaned); // Parse the cleaned string into a JavaScript object
    analysis = ResumeAnalysisSchema.parse(parsed); // throws if shape doesn't match
  } catch (error) {
    console.error("Claude returned invalid JSON:", error);
    return NextResponse.json({ error: "Claude returned invalid JSON" }, { status: 502 });
  }
  // Return the analysis as a JSON response
  return NextResponse.json(analysis);
}
