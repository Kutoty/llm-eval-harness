# LLM Response Evaluation Harness

TypeScript tool that scores model answers against a written rubric and writes JSONL.

Without `OPENAI_API_KEY`, it uses the signals in `rubric.json`. With a key, `npm run score` sends each answer to the OpenAI API (`gpt-4o-mini`) and stores the model's JSON grade.

## Run

```bash
npm install
npm test
npm run score
```
