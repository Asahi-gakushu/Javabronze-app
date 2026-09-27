// 各収益チャネルはビルド時に埋め込まれる NEXT_PUBLIC_* 環境変数で制御する。
// 未設定ならそのチャネルは無効（または通常リンク）になるので、アカウント登録前でもサイトは動く。

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://asahi-gakushu.github.io/Javabronze-app"
).replace(/\/$/, "");

export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
export const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";
export const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG || "";
export const rakutenAffiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID || "";
export const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
export const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL || "";

export function amazonSearchUrl(keyword: string): string {
  const params = new URLSearchParams({ k: keyword });
  if (amazonTag) params.set("tag", amazonTag);
  return `https://www.amazon.co.jp/s?${params.toString()}`;
}

/** 楽天市場の検索結果ページ。アフィリエイトIDがあれば楽天アフィリエイト経由のリンクにする。 */
export function rakutenSearchUrl(keyword: string): string {
  const target = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  if (!rakutenAffiliateId) return target;
  const encoded = encodeURIComponent(target);
  return `https://hb.afl.rakuten.co.jp/hgc/${rakutenAffiliateId}/?pc=${encoded}&m=${encoded}`;
}
