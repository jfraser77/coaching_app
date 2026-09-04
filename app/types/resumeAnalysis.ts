// types/resumeAnalysis.ts
//
// Shared contract for POST /api/analyze-resume.
// This mirrors ResumeAnalysisSchema (the Zod schema) in
// app/api/analyze-resume/route.ts. If you ever change that schema,
// update this file to match — it's the source of truth for what
// the frontend can expect back.

export type ResumeVerdict = "strong" | "needs_work" | "weak";
export type FlagSeverity = "low" | "medium" | "high";

export interface ResumeFlag {
  type: string;
  severity: FlagSeverity;
  note: string;
}

export interface ResumeScores {
  impact: number;        // 0-100
  clarity: number;       // 0-100
  atsRisk: number;       // 0-100
  authenticity: number;  // 0-100
}

export interface AiIndicators {
  detected: boolean;
  confidence: number;    // 0-100
  signals: string[];
}

export interface ResumeAnalysis {
  overallScore: number;  // 0-100
  verdict: ResumeVerdict;
  recruiterTake: string;
  flags: ResumeFlag[];
  scores: ResumeScores;
  topStrengths: string[];
  topWeaknesses: string[];
  aiIndicators: AiIndicators;
  bookingHook: string;
}

export interface ResumeAnalysisError {
  error: string;
}

/*
 * REQUEST CONTRACT
 * -----------------
 * POST /api/analyze-resume
 * Content-Type: multipart/form-data  (do NOT set this header manually —
 *   the browser generates the correct boundary when you pass a FormData
 *   body to fetch(); setting it yourself breaks the boundary)
 *
 * Body: FormData with exactly one field:
 *   "resume" -> a File, must be application/pdf
 *
 * RESPONSE CONTRACT
 * ------------------
 * 200  -> ResumeAnalysis
 * 400  -> ResumeAnalysisError   (no file, wrong file type, or an unreadable/corrupt PDF)
 * 502  -> ResumeAnalysisError   (Claude's response didn't parse as valid JSON,
 *                                 or didn't match ResumeAnalysisSchema)
 *
 * TIMING NOTE
 * -----------
 * This call is slow — 20-25 seconds observed in testing, since Claude is
 * doing the actual analysis work server-side. The UI MUST show a real
 * loading state, not just a disabled button. A user staring at a static
 * screen for 25 seconds will assume it's broken and re-click.
 */
