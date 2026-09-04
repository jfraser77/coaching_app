"use client";

import { useState } from "react";
import type { ResumeAnalysis, ResumeAnalysisError } from "../types/resumeAnalysis";

type Status = "idle" | "uploading" | "success" | "error";


export default function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


    // This function handles file selection and validation
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Get the selected file from the input event
    const selectedFile = e.target.files?.[0] ?? null; // If no file was selected, this will be null
    setFile(selectedFile);

    // If no file is selected, clear the file state and any previous error message
    if (!selectedFile){
      setFile(null);
      setErrorMessage(null); // Clear any previous error message if no file is selected
      return; // Exit early if no file is selected
    }

    // If the file is valid, clear any previous error message.
    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("Invalid file type. Please upload a PDF file.");
      setFile(null); // Clear the file state if it's invalid
      return; // Exit early if the file is invalid
    }

    // If the file is valid, set the file state and clear any previous error message
    setFile(selectedFile); // Set the valid file
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault(); // Prevent the default form submission behavior

    // If no file is selected, set the status to "error" and display an error message  
    if(!file) {
      setStatus("error");
      setErrorMessage("No file selected. Please upload a PDF file.");
      return;
    }
    
    // Set the status to "uploading" and clear any previous error message or result
    setStatus("uploading");
    setErrorMessage(null);
    setResult(null);

    // Create a FormData object and append the selected file to it. This is necessary for sending the file in a multipart/form-data request.
    const formData = new FormData(); 
    formData.append("resume", file);

    // Send the FormData to the backend API endpoint for analysis
    try {
      const response = await fetch("/api/analyze-resume", {method: "POST", body: formData}); 
      
      // Handle the response from the backend API. If the response is not OK (status code not in the 200-299 range), parse the error message and set the status to "error". Otherwise, parse the successful response and set the result state with the analysis data.
      if (!response.ok) {
        const errorBody: ResumeAnalysisError = await response.json();
        setStatus("error");
        setErrorMessage("Error analyzing resume: " + errorBody.error);
      } else {
        const data: ResumeAnalysis = await response.json();
        setResult(data);
        setStatus("success");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An error occurred while analyzing the resume.");
    }  
  }
  let isLoading = status === "uploading";
      function displayMessage() {
        if (isLoading) {
          return "Analyzing resume... this takes about 20-25 seconds.";
        } else  (status === "error") {
          return errorMessage;
        }
      

  return (
    <form onSubmit={handleSubmit}>
      
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      
      <button type="submit" disabled={status === "uploading" || !file}>Upload Resume</button>
      displayMessage()
      {/* TODO: status === "uploading" -> a real loading indicator with copy that
          sets expectations, e.g. "Analyzing resume... this takes about 20-25 seconds."
          Don't just disable the button and leave the screen static. */}
      
      {/* TODO: status === "error" -> render errorMessage in a visible, styled way
          (not a browser alert() — see the Chrome automation notes elsewhere in
          this project for why alert() is a bad idea generally, but also just
          bad UX here) */}

      {/* TODO: status === "success" && result -> render <ResumeAnalysisResult analysis={result} />
          Build ResumeAnalysisResult as its own component, don't inline the
          results markup here. Suggested breakdown for that component when
          you get to it Tuesday afternoon:
            - overallScore + verdict as a headline badge (color by verdict:
              strong=green, needs_work=yellow, weak=red)
            - recruiterTake as a lead paragraph
            - scores (impact/clarity/atsRisk/authenticity) as four small
              meters or numbers
            - flags grouped or sorted by severity (high first)
            - topStrengths / topWeaknesses as two lists
            - aiIndicators shown only if detected === true, otherwise omit
              entirely rather than showing "AI detected: false" noise
            - bookingHook as a closing callout, this is the lead-gen payoff
              line for Liz's business — it should visually stand out */}
    </form>
  );
}
