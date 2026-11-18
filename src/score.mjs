import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function scoreResponse(item, rubric) {
  const text = item.text.toLowerCase();
  const criteria = rubric.criteria.map((criterion) => {
    const hits = criterion.signals.filter((signal) => text.includes(signal)).length;
    const score = Math.min(criterion.max, hits);
    const rationale = hits
      ? `Matched ${hits} of ${criterion.signals.length} signals for ${criterion.id}.`
      : `No signals matched for ${criterion.id}.`;
    return { id: criterion.id, score, max: criterion.max, rationale };
  });
  const total = criteria.reduce((sum, row) => sum + row.score, 0);
  const max = criteria.reduce((sum, row) => sum + row.max, 0);
  return {
    id: item.id,
    promptId: item.promptId,
    model: item.model,
    total,
    max,
    criteria,
  };
}

export function toJsonl(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
}

function load() {
  return {
    responses: JSON.parse(readFileSync(join(root, "fixtures/responses.json"), "utf8")),
    rubric: JSON.parse(readFileSync(join(root, "rubric.json"), "utf8")),
  };
}

export function scoreFixture() {
  const { responses, rubric } = load();
  return responses.map((item) => scoreResponse(item, rubric));
}

const isMain = process.argv[1] && process.argv[1].endsWith("score.mjs");
if (isMain) {
  const rows = scoreFixture();
  const out = join(root, "out/scores.jsonl");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, toJsonl(rows));
  console.log(`scored ${rows.length} responses -> out/scores.jsonl`);
}
