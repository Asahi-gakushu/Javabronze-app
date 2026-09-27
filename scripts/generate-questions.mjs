// 週次コンテンツボット：Claude に Java Bronze の新しい問題を作らせ、別の独立した Claude 呼び出しに
// 答えを見せずに解かせて、両者の答えが一致した問題だけを採用する。
// 問題（ページ）が増えることが検索流入、ひいては広告・アフィリエイト収益につながる。
//
// 使い方:  ANTHROPIC_API_KEY=... node scripts/generate-questions.mjs
// 環境変数: QUESTIONS_PER_TOPIC（既定 3）、TOPICS（カンマ区切りのトピックID、既定は全トピック）
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const MODEL = "claude-opus-5";
const perTopic = Number(process.env.QUESTIONS_PER_TOPIC || 3);
const onlyTopics = (process.env.TOPICS || "").split(",").map((s) => s.trim()).filter(Boolean);

const client = new Anthropic();
const dir = new URL("../src/data/topics/", import.meta.url);

const Draft = z.object({
  questions: z.array(
    z.object({
      prompt: z.string(),
      code: z.string().describe("問題と一緒に表示するJavaコード。なければ空文字"),
      options: z.array(z.string()),
      correctIndex: z.number().int(),
      explanation: z.string(),
    })
  ),
});

const Review = z.object({
  reviews: z.array(
    z.object({
      number: z.number().int(),
      answerIndex: z.number().int().describe("唯一の正解の選択肢のインデックス（0始まり）"),
      sound: z
        .boolean()
        .describe("正解がちょうど1つで、コードが意図どおりに動作し、Java Bronze の出題範囲内である場合のみ true"),
      reason: z.string(),
    })
  ),
});

async function draftQuestions(topic) {
  const existing = topic.questions.map((q) => `- ${q.prompt}${q.code ? ` [code: ${q.code.split("\n")[0]}…]` : ""}`);
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system:
      "あなたは Oracle認定 Java Programmer, Bronze SE 試験の対策問題を、自然な日本語で作成します。" +
      "各問題は選択肢がちょうど4つで正解は1つだけとし、なぜそれが正解かを簡潔な日本語で解説してください。" +
      "コードを示す問題では、そのコードが Java 17 以降で解説どおりに動作しなければなりません。" +
      "本番試験でよく出るひっかけ（整数除算、フォールスルー、既定値、Stringの不変性、スコープ、オーバーロードなど）を積極的に使ってください。",
    messages: [
      {
        role: "user",
        content:
          `トピック: ${topic.title} — ${topic.description}\n\n` +
          `既存の問題（これらと重複したり、まったく同じポイントを問うたりしないこと）:\n${existing.join("\n")}\n\n` +
          `このトピックの新しい問題を${perTopic}問作成してください。正解の選択肢の位置はばらつかせてください。`,
      },
    ],
    output_config: { format: zodOutputFormat(Draft) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    console.warn(`  問題作成をスキップ (stop_reason=${response.stop_reason})`);
    return [];
  }
  return response.parsed_output.questions;
}

async function reviewQuestions(drafts) {
  const listing = drafts
    .map((q, n) => {
      const opts = q.options.map((o, i) => `  ${i}: ${o}`).join("\n");
      return `### 問題 ${n}\n${q.prompt}\n${q.code ? "```java\n" + q.code + "\n```\n" : ""}${opts}`;
    })
    .join("\n\n");
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system:
      "あなたはJava資格試験問題の厳密なレビュアーです。コードを丁寧にトレースして、各問題の答えを自分で導いてください。" +
      "問題が正しく作られていると仮定してはいけません。正解と言える選択肢が複数ある場合、意図せずコンパイルエラーになる場合、" +
      "Java Bronze の範囲外の挙動に依存している場合は、その問題を不適切（sound: false）としてください。",
    messages: [{ role: "user", content: `以下のすべての問題に解答し、レビューしてください。\n\n${listing}` }],
    output_config: { format: zodOutputFormat(Review) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    console.warn(`  レビューをスキップ (stop_reason=${response.stop_reason})`);
    return [];
  }
  return response.parsed_output.reviews;
}

function wellFormed(q) {
  return (
    q.prompt.trim().length >= 5 &&
    q.options.length === 4 &&
    new Set(q.options).size === 4 &&
    Number.isInteger(q.correctIndex) &&
    q.correctIndex >= 0 &&
    q.correctIndex <= 3 &&
    q.explanation.trim().length >= 5
  );
}

function nextId(topic) {
  const nums = topic.questions
    .map((q) => Number(q.id.slice(topic.id.length + 1)))
    .filter(Number.isFinite);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

let added = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const url = new URL(file, dir);
  const topic = JSON.parse(readFileSync(url, "utf8"));
  if (onlyTopics.length && !onlyTopics.includes(topic.id)) continue;
  console.log(`[${topic.id}] ${perTopic}問を作成中…`);

  const drafts = (await draftQuestions(topic)).filter(wellFormed);
  if (!drafts.length) continue;
  const reviews = await reviewQuestions(drafts);

  const seen = new Set(topic.questions.map((q) => `${q.prompt}\n${q.code ?? ""}`));
  let id = nextId(topic);
  for (const [n, q] of drafts.entries()) {
    const review = reviews.find((r) => r.number === n);
    if (!review || !review.sound || review.answerIndex !== q.correctIndex) {
      console.log(`  不採用 #${n}: ${review ? review.reason : "レビューなし"}`);
      continue;
    }
    const key = `${q.prompt}\n${q.code || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const question = { id: `${topic.id}-${id++}`, prompt: q.prompt };
    if (q.code.trim()) question.code = q.code;
    Object.assign(question, { options: q.options, correctIndex: q.correctIndex, explanation: q.explanation });
    topic.questions.push(question);
    added++;
    console.log(`  追加 ${question.id}`);
  }
  writeFileSync(url, JSON.stringify(topic, null, 2) + "\n");
}

console.log(`完了: ${added}問を追加しました。`);
