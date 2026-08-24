// lib/score.ts - Shared scoring utilities

// Stop words to filter out
export const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'for', 'nor', 'on', 'at', 'to', 'by', 'in',
  'with', 'without', 'of', 'for', 'so', 'yet', 'as', 'than', 'that', 'which', 'who',
  'whom', 'whose', 'what', 'which', 'where', 'when', 'why', 'how', 'then', 'than',
  'very', 'too', 'also', 'just', 'only', 'now', 'new', 'old', 'big', 'small', 'good',
  'bad', 'get', 'got', 'use', 'used', 'using', 'make', 'made', 'making', 'let', 'see',
  'ask', 'show', 'turn', 'take', 'go', 'come', 'look', 'say', 'tell', 'know', 'think',
]);

// Tokenize text into words
export function tokens(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9#.+ ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

// ATS analysis function
export function analyze(jobDescription: string, resumeText: string) {
  const jdTokens = tokens(jobDescription);
  const resumeTokens = tokens(resumeText);
  
  const jdFreq: Record<string, number> = {};
  jdTokens.forEach(w => { jdFreq[w] = (jdFreq[w] || 0) + 1; });
  
  const resumeFreq: Record<string, number> = {};
  resumeTokens.forEach(w => { resumeFreq[w] = (resumeFreq[w] || 0) + 1; });
  
  const matched: string[] = [];
  const missing: string[] = [];
  const jdWords = Object.keys(jdFreq).filter(w => !STOP.has(w) && w.length > 2);
  
  jdWords.forEach(word => {
    if (resumeFreq[word]) {
      matched.push(word);
    } else {
      missing.push(word);
    }
  });
  
  const score = jdWords.length > 0 ? Math.round((matched.length / jdWords.length) * 100) : 0;
  
  return {
    score,
    matched,
    missing,
    totalKeywords: jdWords.length,
  };
}