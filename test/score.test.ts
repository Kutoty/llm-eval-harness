import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gradePrompt } from "../src/openaiGrade.ts";
import { scoreResponse, toJsonl, type Answer, type Rubric } from "../src/score.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const responses = JSON.parse(readFileSync(join(root, "fixtures/responses.json"), "utf8")) as Answer[];
const rubric = JSON.parse(readFileSync(join(root, "rubric.json"), "utf8")) as Rubric;

test("scores every fixture and builds an OpenAI prompt", () => {
  const rows = responses.map((item) => scoreResponse(item, rubric));
  assert.equal(rows.length, 6);
  assert.ok(rows[0].total > rows[1].total);
  assert.equal(toJsonl(rows).trim().split("\n").length, 6);
  const prompt = gradePrompt(responses[0], rubric);
  assert.match(prompt, /correctness/);
  assert.match(prompt, /Grade this answer/);
});
