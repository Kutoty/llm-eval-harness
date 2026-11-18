export type Criterion = { id: string; max: number; signals: string[] };
export type Rubric = { name: string; criteria: Criterion[] };
export type Answer = { id: string; promptId: string; model: string; text: string };

export function scoreResponse(item: Answer, rubric: Rubric) {
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
  return { id: item.id, promptId: item.promptId, model: item.model, total, max, criteria };
}

export function toJsonl(rows: unknown[]) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
}
