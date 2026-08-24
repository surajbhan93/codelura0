// import { analyze } from "../utils/score.js";

// export const analyzeResume = (resume, jobDescription) => {
//     return analyze(resume, jobDescription);
// };

// services/ats.service.js
import { analyze } from "../utils/score.js";

export const analyzeResume = (resume, jobDescription) => {
  // Clean input
  const cleanResume = resume
    .replace(/[\r\n]+/g, "\n")
    .replace(/\s+/g, " ")
    .trim();

  const cleanJD = jobDescription
    ? jobDescription.replace(/[\r\n]+/g, "\n").replace(/\s+/g, " ").trim()
    : null;

  const result = analyze(cleanResume, cleanJD);

  // Enhance with additional insights
  return {
    ...result,
    insights: {
      wordCount: result.wc,
      hasJobDescription: !!cleanJD,
      suggestedActions: generateSuggestions(result),
    },
  };
};

function generateSuggestions(result) {
  const suggestions = [];

  if (result.total < 60) {
    suggestions.push({
      priority: "high",
      action: "Review your resume formatting",
      description:
        "Your resume may have formatting issues that confuse ATS parsers. Use a single-column layout with standard section headings.",
    });
  }

  if (result.kw && result.kw.pct < 40) {
    suggestions.push({
      priority: "high",
      action: "Add missing keywords",
      description: `Your resume is missing key terms from the job description. Consider adding: ${result.kw.miss
        .slice(0, 5)
        .join(", ")}`,
    });
  }

  const actionVerbsCat = result.cats.find((c) => c.key === "Action verbs");
  if (actionVerbsCat && actionVerbsCat.score < 10) {
    suggestions.push({
      priority: "medium",
      action: "Use more action verbs",
      description:
        "Start bullet points with strong action verbs like 'Led', 'Built', 'Increased', or 'Reduced' to make your experience more impactful.",
    });
  }

  const quantCat = result.cats.find((c) => c.key === "Quantified impact");
  if (quantCat && quantCat.score < 10) {
    suggestions.push({
      priority: "medium",
      action: "Add measurable impact",
      description:
        "Include specific numbers, percentages, or dollar amounts to demonstrate your impact (e.g., 'Increased sales by 25%').",
    });
  }

  return suggestions;
}