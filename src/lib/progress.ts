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
