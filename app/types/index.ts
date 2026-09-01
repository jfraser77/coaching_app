export interface ResumeAnalysis {
 overallScore: number; 
 verdict: "strong" | "needs_work" | "weak";
 recruiterTake: string;
 flags: {type: string; severity: "low" | "medium" | "high"; note: string }[];
 scores: {impact: number; clarity: number; atsRisk: number; authenticity: number}
 topStrengths: string[];
 topWeaknesses: string[];
 aiIndicators: {detected: boolean; confidence: number; signals: string[]};
 bookingHook: string;
}