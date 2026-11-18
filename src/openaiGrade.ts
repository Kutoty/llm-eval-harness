import OpenAI from "openai";
import type { Answer, Rubric } from "./score.ts";

export function gradePrompt(item: Answer, rubric: Rubric) {
  const criteria = rubric.criteria
    .map((criterion) => `${criterion.id} (0-${criterion.max})`)
    .join(", ");
  return [
    `Grade this answer on: ${criteria}.`,
    "Return JSON with total, max, and criteria[{id, score, rationale}].",
    `Prompt ${item.promptId}. Model ${item.model}.`,
    item.text,
  ].join("\n");
}

export async function gradeWithOpenAI(item: Answer, rubric: Rubric, apiKey: string) {
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You grade model answers against a rubric. Reply with JSON only." },
      { role: "user", content: gradePrompt(item, rubric) },
    ],
  });
  return completion.choices[0]?.message?.content ?? "";
}
