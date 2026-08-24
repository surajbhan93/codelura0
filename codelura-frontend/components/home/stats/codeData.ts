// components/stats/codeData.ts
export interface CodeToken {
  text: string;
  color: string;
}

export interface CodeLine {
  indent: number;
  tokens: CodeToken[];
}

export const CODE_LINES: CodeLine[] = [
  { indent: 0, tokens: [{ text: "// 🚀 Codelura AI Platform", color: "#6b7280" }] },
  { indent: 0, tokens: [{ text: "import", color: "#a78bfa" }, { text: " { ", color: "#e5e7eb" }, { text: "Codelura", color: "#34d399" }, { text: " } ", color: "#e5e7eb" }, { text: "from", color: "#a78bfa" }, { text: " '@/sdk'", color: "#fbbf24" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "const", color: "#a78bfa" }, { text: " ai ", color: "#e5e7eb" }, { text: "=", color: "#a78bfa" }, { text: " new ", color: "#a78bfa" }, { text: "Codelura", color: "#34d399" }, { text: "({", color: "#e5e7eb" }] },
  { indent: 2, tokens: [{ text: "services", color: "#93c5fd" }, { text: ": [", color: "#e5e7eb" }, { text: "'notes'", color: "#fbbf24" }, { text: ", ", color: "#e5e7eb" }, { text: "'mentor'", color: "#fbbf24" }, { text: ", ", color: "#e5e7eb" }, { text: "'career'", color: "#fbbf24" }, { text: "]", color: "#e5e7eb" }] },
  { indent: 2, tokens: [{ text: "hackathons", color: "#93c5fd" }, { text: ": ", color: "#e5e7eb" }, { text: "true", color: "#34d399" }] },
  { indent: 2, tokens: [{ text: "aiMode", color: "#93c5fd" }, { text: ": ", color: "#e5e7eb" }, { text: "'turbo'", color: "#fbbf24" }] },
  { indent: 0, tokens: [{ text: "})", color: "#e5e7eb" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ text: "// Launch your developer journey", color: "#6b7280" }] },
  { indent: 0, tokens: [{ text: "await", color: "#a78bfa" }, { text: " ai.", color: "#e5e7eb" }, { text: "launch", color: "#34d399" }, { text: "()", color: "#e5e7eb" }] },
];