"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Topic } from "@/types";
import { recordAttempt } from "@/lib/progress";

function tierFor(pct: number): { label: string; className: string } {
  if (pct >= 90) return { label: "Gold", className: "bg-yellow-100 text-yellow-800" };
  if (pct >= 70) return { label: "Silver", className: "bg-slate-200 text-slate-700" };
  return { label: "Bronze", className: "bg-bronze-light text-bronze-dark" };
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
        <h1 className="text-2xl font-bold">Quiz complete!</h1>
        <p className="mt-2 opacity-70">{topic.title}</p>
        <div className="mt-6 rounded-xl border border-bronze-light p-6">
          <p className="text-4xl font-bold">
            {score}/{topic.questions.length}
          </p>
          <p className="mt-1 opacity-70">{percent}% correct</p>
          <span
            className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${tier.className}`}
          >
            {tier.label} tier
          </span>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={restart}
            className="rounded-lg bg-bronze px-4 py-2 font-medium text-white hover:bg-bronze-dark"
          >
            Retry quiz
          </button>
          <Link
            href="/"
            className="rounded-lg border border-bronze-light px-4 py-2 font-medium hover:border-bronze"
          >
            Back to topics
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
          Question {questionIndex + 1} of {topic.questions.length}
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
            {selectedIndex === question.correctIndex ? "Correct!" : "Not quite."}
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
          {isLast ? "Finish" : "Next question"}
        </button>
      </div>
    </div>
  );
}
