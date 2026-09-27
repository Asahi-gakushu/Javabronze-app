// 掲載中の商品の価格・レビュー・リンクを楽天市場APIで最新化する。
// 販売終了した商品は記事から外し、紹介商品が2つ未満になった記事は商品をクリアする
// （商品が空の記事は、次回の generate-guides.mjs が新しい商品で書き直す）。
import { loadGuides, saveGuide } from "./lib/content.mjs";
import { lookupProduct, rakutenConfigured } from "./lib/rakuten.mjs";

if (!rakutenConfigured) {
  console.log("RAKUTEN_APPLICATION_ID / RAKUTEN_ACCESS_KEY が未設定のため、価格更新をスキップします。");
  process.exit(0);
}

let changedGuides = 0;
for (const { guide } of loadGuides()) {
  if (!guide.products.length) continue;
  let changed = false;
  const kept = [];
  for (const p of guide.products) {
    let fresh;
    try {
      fresh = await lookupProduct(p.itemCode);
    } catch (e) {
      console.warn(`  ${p.itemCode}: 取得失敗のため据え置き (${e.message})`);
      kept.push(p);
      continue;
    }
    if (!fresh) {
      console.log(`  ${guide.slug}: 販売終了のため除外 ${p.itemCode}`);
      changed = true;
      continue;
    }
    const next = { ...p, price: fresh.price, url: fresh.url, imageUrl: fresh.imageUrl ?? p.imageUrl,
      reviewAverage: fresh.reviewAverage, reviewCount: fresh.reviewCount };
    if (JSON.stringify(next) !== JSON.stringify(p)) changed = true;
    kept.push(next);
  }
  if (!changed) continue;
  const codes = new Set(kept.map((p) => p.itemCode));
  guide.picks = guide.picks.filter((pick) => codes.has(pick.itemCode));
  guide.products = kept.filter((p) => guide.picks.some((pick) => pick.itemCode === p.itemCode));
  if (guide.picks.length < 2) {
    guide.products = [];
    guide.picks = [];
    console.log(`  ${guide.slug}: 紹介商品が少なくなったため、次回書き直します`);
  }
  guide.updatedAt = new Date().toISOString();
  saveGuide(guide);
  changedGuides++;
}
console.log(`完了: ${changedGuides}本の記事を更新しました。`);
