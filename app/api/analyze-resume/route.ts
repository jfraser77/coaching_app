import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import pdf from "pdf-parse";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ResumeAnalysis {
  overallScore: number;
  verdict: "strong" | "needs_work" | "weak";
  recruiterTake: string;
  flags: { type: string; severity: "low" | "medium" | "high"; note: string }[];
  scores: { impact: number; clarity: number; atsRisk: number; authenticity: number };
  topStrengths: string[];
  topWeaknesses: string[];
  aiIndicators: { detected: boolean; confidence: number; signals: string[] };
  bookingHook: string;
}

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
        resumeText = (await pdf(buffer)).text;
    } catch (error) {
        return NextResponse.json({ error: "Could not read PDF." }, { status: 400 });
    }


  const message = await anthropic.messages.create({
    model: "claude-sonet-4-6",
    max_tokens: 1024,
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
  try {
    analysis = JSON.parse(textBlock!.text);
  } catch (error) {
    return NextResponse.json({ error: "Claude returned invalid JSON" }, { status: 502 });
  }
 
}
