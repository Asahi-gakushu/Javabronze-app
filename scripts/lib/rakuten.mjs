// 楽天市場商品検索API（2026年の新ドメイン・新バージョン）の薄いクライアント。
// 必要な環境変数: RAKUTEN_APPLICATION_ID, RAKUTEN_ACCESS_KEY
// 任意: NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID（付けると affiliateUrl が返り、紹介料の対象になる）
const ENDPOINT = "https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260701";

const applicationId = process.env.RAKUTEN_APPLICATION_ID || "";
const accessKey = process.env.RAKUTEN_ACCESS_KEY || "";
const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID || "";
// アプリ登録時に指定したサイトURLと一致させる必要がある
const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://asahi-gakushu.github.io/Javabronze-app").replace(/\/$/, "");

export const rakutenConfigured = Boolean(applicationId && accessKey);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastCall = 0;

async function call(params) {
  // APIの利用規約上、1秒に1回までにする
  const wait = lastCall + 1100 - Date.now();
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();

  const query = new URLSearchParams({ applicationId, accessKey, formatVersion: "2", ...params });
  if (affiliateId) query.set("affiliateId", affiliateId);
  const res = await fetch(`${ENDPOINT}?${query}`, { headers: { Referer: `${origin}/`, Origin: origin } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    throw new Error(`楽天API エラー ${res.status}: ${body.error ?? ""} ${body.error_description ?? ""}`);
  }
  return (body.Items ?? []).map((raw) => raw.Item ?? raw);
}

function firstImage(item) {
  const first = (item.mediumImageUrls ?? [])[0];
  const url = typeof first === "string" ? first : first?.imageUrl;
  // 既定の128pxサムネイルは小さいので、少し大きいサイズを指定する
  return url ? url.replace(/_ex=\d+x\d+/, "_ex=240x240") : undefined;
}

/** 記事に保存する形へ変換。caption は執筆時の根拠用で、保存はしない。 */
function toProduct(item) {
  return {
    itemCode: item.itemCode,
    name: item.itemName,
    price: item.itemPrice,
    url: item.affiliateUrl || item.itemUrl,
    imageUrl: firstImage(item),
    reviewAverage: Number(item.reviewAverage) || 0,
    reviewCount: Number(item.reviewCount) || 0,
    shopName: item.shopName,
    caption: String(item.itemCaption ?? "").replace(/\s+/g, " ").slice(0, 400),
  };
}

/** レビューの多い順に、在庫ありの商品を検索する。似た商品の重複は除く。 */
export async function searchProducts(keyword, limit = 10) {
  const items = await call({ keyword, hits: "30", sort: "-reviewCount", availability: "1", imageFlag: "1" });
  const seen = new Set();
  const products = [];
  for (const item of items.map(toProduct)) {
    const key = item.name.replace(/[【\[].*?[】\]]/g, "").slice(0, 25);
    if (item.reviewCount < 3 || seen.has(key)) continue;
    seen.add(key);
    products.push(item);
    if (products.length >= limit) break;
  }
  return products;
}

/** itemCode で1商品を取得。販売終了などで見つからなければ null。 */
export async function lookupProduct(itemCode) {
  const items = await call({ itemCode });
  return items.length ? toProduct(items[0]) : null;
}
