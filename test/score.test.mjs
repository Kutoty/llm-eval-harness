import assert from "node:assert/strict";
import test from "node:test";
import { scoreFixture, toJsonl } from "../src/score.mjs";

test("scores every fixture row and writes jsonl", () => {
  const rows = scoreFixture();
  assert.equal(rows.length, 6);
  assert.ok(rows.every((row) => row.criteria.length === 3));
  assert.ok(rows[0].total > rows[1].total);
  const lines = toJsonl(rows).trim().split("\n");
  assert.equal(lines.length, 6);
  assert.equal(JSON.parse(lines[0]).id, "r1");
});
