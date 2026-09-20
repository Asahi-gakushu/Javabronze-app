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
