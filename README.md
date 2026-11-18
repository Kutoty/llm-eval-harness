# LLM Response Evaluation Harness

Scores a fixed set of model answers against a written rubric and writes one JSONL row per answer, including a short rationale for each criterion.

No API key. The grader looks for the signals named in `rubric.json`, so the same file always produces the same scores.

## Run

```bash
npm test
npm run score
```

`npm test` checks that all 6 fixture answers are scored. `npm run score` writes `out/scores.jsonl`.

## Layout

- `fixtures/responses.json` — 6 answers, 2 prompts, 3 models
- `rubric.json` — correctness, completeness, clarity
- `src/score.mjs` — the grader
