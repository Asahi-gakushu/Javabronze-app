// Structural checks on the question bank. Runs in CI and after every bot generation,
// so a malformed or duplicated question can never reach the deployed site.
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../src/data/topics/", import.meta.url);
const errors = [];
const seenIds = new Set();
let total = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const topic = JSON.parse(readFileSync(new URL(file, dir), "utf8"));
  const where = (q, msg) => errors.push(`${file} ${q?.id ?? "?"}: ${msg}`);
  if (`${topic.id}.json` !== file) errors.push(`${file}: id "${topic.id}" does not match filename`);
  if (!topic.title || !topic.description) errors.push(`${file}: missing title/description`);
  if (!Array.isArray(topic.questions) || topic.questions.length === 0) {
    errors.push(`${file}: no questions`);
    continue;
  }
  const prompts = new Set();
  for (const q of topic.questions) {
    total++;
    if (typeof q.id !== "string" || !q.id) where(q, "missing id");
    else if (seenIds.has(q.id)) where(q, "duplicate id");
    seenIds.add(q.id);
    if (typeof q.prompt !== "string" || q.prompt.trim().length < 5) where(q, "prompt too short");
    const key = `${q.prompt}\n${q.code ?? ""}`;
    if (prompts.has(key)) where(q, "duplicate prompt+code");
    prompts.add(key);
    if (q.code !== undefined && (typeof q.code !== "string" || !q.code.trim())) where(q, "empty code");
    if (!Array.isArray(q.options) || q.options.length !== 4) where(q, "must have exactly 4 options");
    else if (new Set(q.options).size !== 4) where(q, "options must be unique");
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3)
      where(q, "correctIndex must be 0-3");
    if (typeof q.explanation !== "string" || q.explanation.trim().length < 5) where(q, "explanation too short");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log(`OK: ${total} questions, all valid.`);
