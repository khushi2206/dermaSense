export interface GeminiAnalysis {
  skinType: string;
  concern: string;
  explanation: string;
  routine: string;
}

const MODEL = "gemini-1.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;

function requireKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing VITE_GEMINI_API_KEY in your environment.");
  }
  return key;
}

function sanitizeToJson(text: string): GeminiAnalysis {
  // Gemini sometimes wraps JSON in code fences; strip them before parsing.
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  if (!parsed.skinType || !parsed.concern || !parsed.explanation || !parsed.routine) {
    throw new Error("Gemini returned an unexpected shape.");
  }
  return parsed as GeminiAnalysis;
}

export async function generateGeminiAnalysis(answers: Record<string, string[]>): Promise<GeminiAnalysis> {
  const key = requireKey();
  const promptLines: string[] = [
    "You are a concise skincare specialist.",
    "Based ONLY on the provided answers, return JSON with keys: skinType, concern, explanation, routine.",
    "If helpful, bake 1-3 short follow-up questions into the explanation to show what else you'd ask, but keep JSON fields the same.",
    "Use short, readable sentences; keep routine as bullet-style lines separated by \n.",
    "Do not add Markdown, code fences, or extra commentary.",
    "Answers:",
  ];

  Object.entries(answers).forEach(([question, selections]) => {
    const chosen = selections.length ? selections.join(", ") : "No answer";
    promptLines.push(`- ${question}: ${chosen}`);
  });

  const res = await fetch(`${ENDPOINT}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: promptLines.join("\n") }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 320,
      },
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Gemini error ${res.status}: ${details || "No details"}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return sanitizeToJson(text);
  } catch (err) {
    console.error("Gemini parse error", err, text);
    throw new Error("Could not parse Gemini response. Try again.");
  }
}