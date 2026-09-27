import { readdirSync, readFileSync, writeFileSync } from "node:fs";

export const guidesDir = new URL("../../src/data/guides/", import.meta.url);
export const keywordsFile = new URL("../../src/data/keywords.json", import.meta.url);

export const CATEGORIES = ["モニター周り", "チェア・デスク", "入力デバイス", "Web会議", "配線・電源", "快適グッズ"];
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function loadGuides() {
  return readdirSync(guidesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: f, guide: JSON.parse(readFileSync(new URL(f, guidesDir), "utf8")) }));
}

export function saveGuide(guide) {
  writeFileSync(new URL(`${guide.slug}.json`, guidesDir), JSON.stringify(guide, null, 2) + "\n");
}

export function loadKeywords() {
  return JSON.parse(readFileSync(keywordsFile, "utf8"));
}

export function saveKeywords(data) {
  writeFileSync(keywordsFile, JSON.stringify(data, null, 2) + "\n");
}

/** 1記事の構造チェック。問題があればメッセージの配列を返す。 */
export function checkGuide(g, file) {
  const errs = [];
  const need = (cond, msg) => cond || errs.push(`${file}: ${msg}`);
  need(SLUG_RE.test(g.slug ?? ""), "slug が不正です");
  need(!file || file === `${g.slug}.json`, "slug がファイル名と一致しません");
  need(CATEGORIES.includes(g.category), `未知のカテゴリ「${g.category}」`);
  for (const k of ["keyword", "title", "description", "intro"]) need(typeof g[k] === "string" && g[k].trim().length >= 2, `${k} がありません`);
  need(Array.isArray(g.points) && g.points.length >= 2, "選び方のポイントが2つ以上必要です");
  for (const p of g.points ?? []) need(p.heading?.trim() && p.body?.trim().length >= 10, "ポイントの見出しか本文が空です");
  need(Array.isArray(g.faq), "faq がありません");
  need(Array.isArray(g.products) && Array.isArray(g.picks), "products / picks がありません");
  const codes = new Set((g.products ?? []).map((p) => p.itemCode));
  for (const p of g.products ?? []) {
    need(p.itemCode && p.name && p.url?.startsWith("https://"), `商品データが不完全です (${p.itemCode})`);
    need(Number.isFinite(p.price) && p.price > 0, `価格が不正です (${p.itemCode})`);
  }
  for (const pick of g.picks ?? []) {
    need(codes.has(pick.itemCode), `picks の商品 ${pick.itemCode} が products にありません`);
    need(pick.label?.trim() && pick.summary?.trim().length >= 10, `picks の label / summary が空です (${pick.itemCode})`);
  }
  need(!Number.isNaN(Date.parse(g.publishedAt)) && !Number.isNaN(Date.parse(g.updatedAt)), "日付が不正です");
  return errs;
}
