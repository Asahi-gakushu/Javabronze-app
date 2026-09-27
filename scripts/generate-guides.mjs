// コンテンツボット：楽天市場APIで実在の商品データを取得し、Claude がそのデータだけを根拠に比較記事を書く。
// 別の Claude 呼び出しが事実確認を行い、合格した記事だけを保存する。
// 記事が増えるほど検索流入が増え、アフィリエイト・広告収益につながる。
//
// 使い方:  ANTHROPIC_API_KEY=... RAKUTEN_APPLICATION_ID=... RAKUTEN_ACCESS_KEY=... node scripts/generate-guides.mjs
// 環境変数: GUIDES_PER_RUN（1回で作る記事数、既定 3）
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { CATEGORIES, SLUG_RE, checkGuide, loadGuides, loadKeywords, saveGuide, saveKeywords } from "./lib/content.mjs";
import { rakutenConfigured, searchProducts } from "./lib/rakuten.mjs";

const MODEL = "claude-opus-5";
const perRun = Number(process.env.GUIDES_PER_RUN || 3);

if (!process.env.ANTHROPIC_API_KEY || !rakutenConfigured) {
  console.log("ANTHROPIC_API_KEY または楽天APIの認証情報が未設定のため、記事生成をスキップします。");
  process.exit(0);
}

const client = new Anthropic();

const Draft = z.object({
  title: z.string().describe("検索されやすい記事タイトル（40字前後、キーワードを含む）"),
  description: z.string().describe("検索結果に表示される説明文（100〜120字）"),
  intro: z.string().describe("導入文（150〜250字）"),
  points: z.array(z.object({ heading: z.string(), body: z.string() })).describe("選び方のポイント 3〜5個"),
  picks: z
    .array(z.object({ itemCode: z.string(), label: z.string(), summary: z.string() }))
    .describe("おすすめ商品 3〜5個。itemCode は必ず提供リストから選ぶ"),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).describe("よくある質問 2〜4個"),
});

const Review = z.object({
  approved: z.boolean(),
  problems: z.array(z.string()).describe("見つかった問題点。なければ空配列"),
});

const WRITER_SYSTEM = `あなたは在宅ワーク向けデスク用品の比較サイト「デスク環境ラボ」の編集者です。
提供された楽天市場の商品データをもとに、読者が自分に合う商品を選べる比較記事を日本語で書きます。

厳守するルール：
- 商品について書く事実（価格・評価・レビュー件数・仕様）は、提供データに書かれていることだけを使う。データにない仕様を推測で書かない。
- 実際に使ったかのような体験談（「使ってみた」「私は」など）を書かない。この記事は公開データにもとづく比較である。
- 「最強」「絶対」「業界No.1」など根拠のない誇張表現を使わない。順位や「最多」を書くときは「この記事で紹介する中で」など範囲を明示する。
- 医療・健康効果をうたわない（「腰痛が治る」など）。
- 選び方のポイントは、その商品カテゴリの一般的で正確な知識にもとづいて書く。
- picks の label は「コスパ重視」「レビュー件数が多い」など短い見出しにし、summary は2〜3文で、どんな人に向くかをデータを根拠に書く。`;

const REVIEWER_SYSTEM = `あなたはアフィリエイト記事の厳格な校閲者です。記事の下書きと、根拠となる商品データを照合してください。
次のいずれかがあれば approved を false にし、problems に具体的に書いてください：
- 商品データに書かれていない仕様・数値・事実を商品について断定している
- 実際に使用したかのような体験談がある
- 根拠のない誇張・最上級表現、または景品表示法上問題となりうる表現がある
- 医療・健康効果をうたっている
- 選び方の一般知識に明らかな誤りがある
- picks の itemCode が商品データに存在しない
軽微な言い回しの好みは問題にしないでください。`;

function productListing(products) {
  return products
    .map(
      (p) =>
        `- itemCode: ${p.itemCode}\n  商品名: ${p.name}\n  価格: ${p.price}円\n  評価: ${p.reviewAverage}（${p.reviewCount}件）\n  ショップ: ${p.shopName}\n  商品説明（抜粋）: ${p.caption}`
    )
    .join("\n");
}

async function parse(system, content, format) {
  const res = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system,
    messages: [{ role: "user", content }],
    output_config: { format: zodOutputFormat(format) },
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) {
    throw new Error(`応答を取得できませんでした (stop_reason=${res.stop_reason})`);
  }
  return res.parsed_output;
}

/** キーワードの在庫が減ったら、Claude にニッチ内の新しいキーワードを提案させて補充する。 */
async function refillKeywords(data, existingGuides) {
  if (data.queue.length >= 5) return;
  const taken = [...existingGuides.map((g) => g.keyword), ...data.queue.map((k) => k.keyword)];
  const takenSlugs = new Set([...existingGuides.map((g) => g.slug), ...data.queue.map((k) => k.slug)]);
  const out = await parse(
    "あなたは在宅ワーク向けデスク用品の比較サイトのSEO担当です。",
    `楽天市場で商品が見つかり、購入意欲の高い人が検索しそうな商品キーワードを10個提案してください。
カテゴリは次から選んでください: ${CATEGORIES.join(" / ")}
slug は英小文字・数字・ハイフンのみ。
既存のキーワード（重複・ほぼ同義は不可）: ${taken.join("、")}`,
    z.object({ keywords: z.array(z.object({ keyword: z.string(), slug: z.string(), category: z.string() })) })
  );
  for (const k of out.keywords) {
    if (!SLUG_RE.test(k.slug) || takenSlugs.has(k.slug) || !CATEGORIES.includes(k.category)) continue;
    takenSlugs.add(k.slug);
    data.queue.push({ keyword: k.keyword, slug: k.slug, category: k.category, attempts: 0 });
  }
  console.log(`キーワードを補充しました（待ち ${data.queue.length}件）`);
}

async function writeGuide({ keyword, slug, category, publishedAt }) {
  const candidates = await searchProducts(keyword);
  if (candidates.length < 3) throw new Error(`商品が${candidates.length}件しか見つかりません`);
  const listing = productListing(candidates);

  const draft = await parse(
    WRITER_SYSTEM,
    `キーワード: ${keyword}\nカテゴリ: ${category}\n\n商品データ:\n${listing}`,
    Draft
  );
  const review = await parse(
    REVIEWER_SYSTEM,
    `商品データ:\n${listing}\n\n記事の下書き(JSON):\n${JSON.stringify(draft, null, 2)}`,
    Review
  );
  if (!review.approved) throw new Error(`校閲で不合格: ${review.problems.join(" / ")}`);

  const now = new Date().toISOString();
  const picks = draft.picks.filter((p) => candidates.some((c) => c.itemCode === p.itemCode)).slice(0, 5);
  const guide = {
    slug,
    keyword,
    category,
    title: draft.title,
    description: draft.description,
    intro: draft.intro,
    points: draft.points,
    // caption は執筆の根拠用なので保存しない
    products: candidates
      .filter((c) => picks.some((p) => p.itemCode === c.itemCode))
      .map((c) => {
        const p = { ...c };
        delete p.caption;
        return p;
      }),
    picks,
    faq: draft.faq,
    publishedAt: publishedAt ?? now,
    updatedAt: now,
  };
  const errs = checkGuide(guide, `${slug}.json`);
  if (picks.length < 3) errs.push("有効なおすすめ商品が3つ未満です");
  if (errs.length) throw new Error(errs.join(" / "));
  saveGuide(guide);
}

const guides = loadGuides().map((g) => g.guide);
const keywords = loadKeywords();
let made = 0;

// 1) 商品が載っていない記事（初期記事や、販売終了で商品が外れた記事）を優先して書き直す
for (const g of guides.filter((g) => !g.picks.length)) {
  if (made >= perRun) break;
  console.log(`[書き直し] ${g.slug}（${g.keyword}）`);
  try {
    await writeGuide(g);
    made++;
    console.log("  保存しました");
  } catch (e) {
    console.warn(`  スキップ: ${e.message}`);
  }
}

// 2) キーワード待ちリストから新しい記事を作る
if (made < perRun) {
  try {
    await refillKeywords(keywords, guides);
  } catch (e) {
    console.warn(`キーワード補充に失敗: ${e.message}`);
  }
}
while (made < perRun && keywords.queue.length) {
  const k = keywords.queue.shift();
  console.log(`[新規] ${k.slug}（${k.keyword}）`);
  try {
    await writeGuide(k);
    made++;
    console.log("  保存しました");
  } catch (e) {
    console.warn(`  スキップ: ${e.message}`);
    // 2回失敗したキーワードは諦める。1回目はリストの最後に回して後日再挑戦する。
    if (++k.attempts < 2) keywords.queue.push(k);
    // 同じ実行内で同じキーワードを何度も試さないよう、失敗が続いたら打ち切る
    if (keywords.queue.every((q) => q.attempts > 0)) break;
  }
}
saveKeywords(keywords);
console.log(`完了: ${made}本の記事を作成しました。`);
