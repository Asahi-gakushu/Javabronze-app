import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Guide } from "@/types";

// ビルド時に src/data/guides/*.json をすべて読み込む。ボットがファイルを追加するだけで記事が増える。
const dir = path.join(process.cwd(), "src/data/guides");

let cache: Guide[] | null = null;

export function getGuides(): Guide[] {
  if (!cache) {
    cache = readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")) as Guide)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  return cache;
}

export function getGuide(slug: string): Guide | undefined {
  return getGuides().find((g) => g.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function yen(n: number): string {
  return `${n.toLocaleString("ja-JP")}円`;
}
