export interface Question {
  id: string;
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface TopicProgress {
  bestScore: number;
  total: number;
  attempts: number;
  lastPlayedAt: string;
}

export type ProgressMap = Record<string, TopicProgress>;

import type { ProgressMap, TopicProgress } from "@/types";

const STORAGE_KEY = "javabronze:progress";

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function recordAttempt(
  topicId: string,
  score: number,
  total: number
): TopicProgress {
  const progress = loadProgress();
  const existing = progress[topicId];
  const updated: TopicProgress = {
    bestScore: Math.max(existing?.bestScore ?? 0, score),
    total,
    attempts: (existing?.attempts ?? 0) + 1,
    lastPlayedAt: new Date().toISOString(),
  };
  progress[topicId] = updated;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — progress just won't persist
  }
  return updated;
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Javabronze — Javaを学ぼう",
  description: "ブロンズレベルのJavaの基礎を身につけるための、短時間クイズ。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-bronze-light">
          <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span aria-hidden="true">☕</span>
              <span>
                Java<span className="text-bronze-dark">bronze</span>
              </span>
            </Link>
            <span className="text-sm opacity-70">初心者向けJavaクイズ</span>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-8">{children}</main>
        <footer className="border-t border-bronze-light">
          <div className="mx-auto max-w-4xl px-6 py-4 text-sm opacity-60">
            練習して、失敗して、また挑戦する。それがブロンズをシルバーに変える道。
          </div>
        </footer>
      </body>
    </html>
  );
}

@import "tailwindcss";

:root {
  --background: #fdfaf6;
  --foreground: #2b1d0e;
  --bronze: #b3763f;
  --bronze-dark: #8a5a2f;
  --bronze-light: #f1e0c9;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-bronze: var(--bronze);
  --color-bronze-dark: var(--bronze-dark);
  --color-bronze-light: var(--bronze-light);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1c140c;
    --foreground: #f1e6d8;
    --bronze: #d99a5b;
    --bronze-dark: #b3763f;
    --bronze-light: #3a2a18;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

import TopicGrid from "@/components/TopicGrid";
import { topics } from "@/data/topics";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Javaの基礎を身につけよう</h1>
      <p className="mt-2 opacity-70">
        下からトピックを選んで、短い4択クイズに挑戦しましょう。
        トピックごとの最高スコアはこの端末に保存されます。
      </p>
      <div className="mt-8">
        <TopicGrid topics={topics} />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { getTopic, topics } from "@/data/topics";
import QuizClient from "@/components/QuizClient";

export function generateStaticParams() {
  return topics.map((t) => ({ topicId: t.id }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTopic(topicId);
  if (!topic) notFound();

  return <QuizClient topic={topic} />;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProgressMap, Topic } from "@/types";
import { loadProgress } from "@/lib/progress";

export default function TopicGrid({ topics }: { topics: Topic[] }) {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    // One-off read of localStorage (an external, non-reactive store) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {topics.map((topic) => {
        const p = progress[topic.id];
        const pct = p ? Math.round((p.bestScore / p.total) * 100) : null;
        return (
          <Link
            key={topic.id}
            href={`/quiz/${topic.id}`}
            className="group rounded-xl border border-bronze-light p-5 transition hover:border-bronze hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              {pct !== null && (
                <span
                  className="shrink-0 rounded-full bg-bronze-light px-2 py-0.5 text-xs font-medium text-bronze-dark"
                  title={`最高スコア: ${p.bestScore}/${p.total}`}
                >
                  {pct}%
                </span>
              )}
            </div>
            <p className="mt-1 text-sm opacity-70">{topic.description}</p>
            <p className="mt-3 text-sm font-medium text-bronze-dark">
              {p ? "もう一度挑戦する →" : "クイズを始める →"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Topic } from "@/types";
import { recordAttempt } from "@/lib/progress";

function tierFor(pct: number): { label: string; className: string } {
  if (pct >= 90) return { label: "ゴールド", className: "bg-yellow-100 text-yellow-800" };
  if (pct >= 70) return { label: "シルバー", className: "bg-slate-200 text-slate-700" };
  return { label: "ブロンズ", className: "bg-bronze-light text-bronze-dark" };
}

export default function QuizClient({ topic }: { topic: Topic }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = topic.questions[questionIndex];
  const isLast = questionIndex === topic.questions.length - 1;
  const answered = selectedIndex !== null;

  const percent = useMemo(
    () => Math.round((score / topic.questions.length) * 100),
    [score, topic.questions.length]
  );

  function selectOption(index: number) {
    if (answered) return;
    setSelectedIndex(index);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function goNext() {
    if (isLast) {
      recordAttempt(topic.id, score, topic.questions.length);
      setFinished(true);
      return;
    }
    setQuestionIndex((i) => i + 1);
    setSelectedIndex(null);
  }

  function restart() {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const tier = tierFor(percent);
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-bold">クイズ終了!</h1>
        <p className="mt-2 opacity-70">{topic.title}</p>
        <div className="mt-6 rounded-xl border border-bronze-light p-6">
          <p className="text-4xl font-bold">
            {score}/{topic.questions.length}
          </p>
          <p className="mt-1 opacity-70">正答率 {percent}%</p>
          <span
            className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${tier.className}`}
          >
            {tier.label}ティア
          </span>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-lg bg-bronze px-4 py-2 font-medium text-white hover:bg-bronze-dark"
          >
            もう一度挑戦する
          </button>
          <Link
            href="/"
            className="rounded-lg border border-bronze-light px-4 py-2 font-medium hover:border-bronze"
          >
            トピック一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between text-sm opacity-70">
        <span>{topic.title}</span>
        <span>
          質問 {questionIndex + 1} / {topic.questions.length}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-bronze-light">
        <div
          className="h-1.5 rounded-full bg-bronze transition-all"
          style={{
            width: `${(questionIndex / topic.questions.length) * 100}%`,
          }}
        />
      </div>

      <h1 className="mt-6 text-xl font-semibold">{question.prompt}</h1>
      {question.code && (
        <pre className="mt-3 overflow-x-auto rounded-lg bg-bronze-light/40 p-4 font-mono text-sm">
          {question.code}
        </pre>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option, index) => {
          const isCorrect = index === question.correctIndex;
          const isSelected = index === selectedIndex;

          let stateClasses = "border-bronze-light hover:border-bronze";
          if (answered) {
            if (isCorrect) {
              stateClasses = "border-green-500 bg-green-50 text-green-900";
            } else if (isSelected) {
              stateClasses = "border-red-500 bg-red-50 text-red-900";
            } else {
              stateClasses = "border-bronze-light opacity-60";
            }
          }

          return (
            <button
              key={index}
              onClick={() => selectOption(index)}
              disabled={answered}
              className={`rounded-lg border px-4 py-3 text-left transition ${stateClasses}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-4 rounded-lg bg-bronze-light/40 p-4 text-sm">
          <p className="font-medium">
            {selectedIndex === question.correctIndex ? "正解!" : "残念…"}
          </p>
          <p className="mt-1 opacity-80">{question.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={goNext}
          disabled={!answered}
          className="rounded-lg bg-bronze px-5 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-bronze-dark"
        >
          {isLast ? "終了する" : "次の質問へ"}
        </button>
      </div>
    </div>
  );
}


