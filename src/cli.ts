import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gradeWithOpenAI } from "./openaiGrade.ts";
import { scoreResponse, toJsonl, type Answer, type Rubric } from "./score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const responses = JSON.parse(readFileSync(join(root, "fixtures/responses.json"), "utf8")) as Answer[];
const rubric = JSON.parse(readFileSync(join(root, "rubric.json"), "utf8")) as Rubric;

const rows = [];
for (const item of responses) {
  if (process.env.OPENAI_API_KEY) {
    const raw = await gradeWithOpenAI(item, rubric, process.env.OPENAI_API_KEY);
    rows.push({ id: item.id, source: "openai", raw });
  } else {
    rows.push({ ...scoreResponse(item, rubric), source: "rubric-signals" });
  }
}

const out = join(root, "out/scores.jsonl");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, toJsonl(rows));
console.log(`scored ${rows.length} responses -> out/scores.jsonl`);
