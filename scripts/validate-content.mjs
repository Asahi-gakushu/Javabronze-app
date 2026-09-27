// 記事データの構造チェック。CI・ボットの生成後・デプロイ時に実行し、壊れた記事が公開されないようにする。
import { SLUG_RE, checkGuide, loadGuides, loadKeywords } from "./lib/content.mjs";

const errors = [];
const guides = loadGuides();
for (const { file, guide } of guides) errors.push(...checkGuide(guide, file));

const { queue } = loadKeywords();
const slugs = new Set(guides.map((g) => g.guide.slug));
for (const k of queue) {
  if (!SLUG_RE.test(k.slug)) errors.push(`keywords.json: slug「${k.slug}」が不正です`);
  if (slugs.has(k.slug)) errors.push(`keywords.json: slug「${k.slug}」は既に記事があります`);
  slugs.add(k.slug);
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} 件の問題が見つかりました。`);
  process.exit(1);
}
const withProducts = guides.filter((g) => g.guide.picks.length).length;
console.log(`OK: 記事${guides.length}本（商品掲載済み${withProducts}本）、キーワード待ち${queue.length}件。`);
