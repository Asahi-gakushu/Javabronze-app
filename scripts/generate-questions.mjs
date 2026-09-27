// Weekly content bot: asks Claude for new Java Bronze questions, has a second, independent
// Claude call answer them blind, and keeps only the questions both calls agree on.
// A growing bank of pages is what brings in search traffic (and therefore ad/affiliate revenue).
//
// Usage:  ANTHROPIC_API_KEY=... node scripts/generate-questions.mjs
// Env:    QUESTIONS_PER_TOPIC (default 3), TOPICS (comma-separated ids, default all)
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
      code: z.string().describe("Java code shown with the question, or empty string if none"),
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
      answerIndex: z.number().int().describe("0-based index of the single correct option"),
      sound: z
        .boolean()
        .describe("true only if exactly one option is correct, the code compiles as intended, and the question is within Java Bronze scope"),
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
      "You write exam-prep questions for the Oracle Certified Java Programmer, Bronze SE exam, in natural Japanese. " +
      "Each question has exactly 4 options with exactly one correct answer, and a concise Japanese explanation of why. " +
      "When a question shows code, the code must behave exactly as the explanation claims on Java 17+. " +
      "Prefer the kinds of traps the real exam uses (integer division, fall-through, default values, String immutability, scope, overloading).",
    messages: [
      {
        role: "user",
        content:
          `Topic: ${topic.title} — ${topic.description}\n\n` +
          `Existing questions (do not duplicate these or test the exact same point):\n${existing.join("\n")}\n\n` +
          `Write ${perTopic} new questions for this topic. Vary which option index is correct.`,
      },
    ],
    output_config: { format: zodOutputFormat(Draft) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    console.warn(`  draft skipped (stop_reason=${response.stop_reason})`);
    return [];
  }
  return response.parsed_output.questions;
}

async function reviewQuestions(drafts) {
  const listing = drafts
    .map((q, n) => {
      const opts = q.options.map((o, i) => `  ${i}: ${o}`).join("\n");
      return `### Question ${n}\n${q.prompt}\n${q.code ? "```java\n" + q.code + "\n```\n" : ""}${opts}`;
    })
    .join("\n\n");
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system:
      "You are a meticulous reviewer of Java certification questions. Work out each answer yourself by tracing the code " +
      "carefully; do not assume the question is well-formed. Mark a question unsound if more than one option could be " +
      "argued correct, if the code would not compile when it isn't meant to, or if it relies on behavior outside Java Bronze scope.",
    messages: [{ role: "user", content: `Answer and review every question below.\n\n${listing}` }],
    output_config: { format: zodOutputFormat(Review) },
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    console.warn(`  review skipped (stop_reason=${response.stop_reason})`);
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
  console.log(`[${topic.id}] drafting ${perTopic} question(s)…`);

  const drafts = (await draftQuestions(topic)).filter(wellFormed);
  if (!drafts.length) continue;
  const reviews = await reviewQuestions(drafts);

  const seen = new Set(topic.questions.map((q) => `${q.prompt}\n${q.code ?? ""}`));
  let id = nextId(topic);
  for (const [n, q] of drafts.entries()) {
    const review = reviews.find((r) => r.number === n);
    if (!review || !review.sound || review.answerIndex !== q.correctIndex) {
      console.log(`  rejected #${n}: ${review ? review.reason : "no review"}`);
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
    console.log(`  added ${question.id}`);
  }
  writeFileSync(url, JSON.stringify(topic, null, 2) + "\n");
}

console.log(`Done: ${added} question(s) added.`);
