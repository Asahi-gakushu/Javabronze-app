// 問題データの構造チェック。CI・ボットの生成後・デプロイ時に実行し、
// 形式の壊れた問題や重複した問題が公開サイトに出ないようにする。
import { readdirSync, readFileSync } from "node:fs";

const dir = new URL("../src/data/topics/", import.meta.url);
const errors = [];
const seenIds = new Set();
let total = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const topic = JSON.parse(readFileSync(new URL(file, dir), "utf8"));
  const where = (q, msg) => errors.push(`${file} ${q?.id ?? "?"}: ${msg}`);
  if (`${topic.id}.json` !== file) errors.push(`${file}: id "${topic.id}" がファイル名と一致しません`);
  if (!topic.title || !topic.description) errors.push(`${file}: title / description がありません`);
  if (!Array.isArray(topic.questions) || topic.questions.length === 0) {
    errors.push(`${file}: 問題がありません`);
    continue;
  }
  const prompts = new Set();
  for (const q of topic.questions) {
    total++;
    if (typeof q.id !== "string" || !q.id) where(q, "id がありません");
    else if (seenIds.has(q.id)) where(q, "id が重複しています");
    seenIds.add(q.id);
    if (typeof q.prompt !== "string" || q.prompt.trim().length < 5) where(q, "問題文が短すぎます");
    const key = `${q.prompt}\n${q.code ?? ""}`;
    if (prompts.has(key)) where(q, "問題文とコードが重複しています");
    prompts.add(key);
    if (q.code !== undefined && (typeof q.code !== "string" || !q.code.trim())) where(q, "code が空です");
    if (!Array.isArray(q.options) || q.options.length !== 4) where(q, "選択肢はちょうど4つ必要です");
    else if (new Set(q.options).size !== 4) where(q, "選択肢が重複しています");
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3)
      where(q, "correctIndex は 0〜3 である必要があります");
    if (typeof q.explanation !== "string" || q.explanation.trim().length < 5) where(q, "解説が短すぎます");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} 件の問題が見つかりました。`);
  process.exit(1);
}
console.log(`OK: 全${total}問、問題ありません。`);
