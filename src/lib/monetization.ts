// 各収益チャネルはビルド時に埋め込まれる NEXT_PUBLIC_* 環境変数で制御する。
// 未設定ならそのチャネルは無効になるので、アカウント登録前でもサイトは動く。

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://asahi-gakushu.github.io/Javabronze-app"
).replace(/\/$/, "");

export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
export const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "";
export const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG || "";
export const supportUrl = process.env.NEXT_PUBLIC_SUPPORT_URL || "";
export const gaId = process.env.NEXT_PUBLIC_GA_ID || "";

export interface AffiliateItem {
  title: string;
  note: string;
  /** Amazon検索キーワード。検索リンクにしておけば、絶版などでリンク切れにならない。 */
  keywords: string;
}

export const recommendedBooks: AffiliateItem[] = [
  {
    title: "Java Bronze 対策問題集",
    note: "試験範囲を網羅した定番の問題集。本番形式で実力チェック。",
    keywords: "Java Bronze SE 問題集",
  },
  {
    title: "スッキリわかるJava入門",
    note: "文法をゼロから丁寧に。クイズで間違えた所の復習に。",
    keywords: "スッキリわかるJava入門",
  },
  {
    title: "Java Silver 黒本",
    note: "ブロンズの次はシルバー。ステップアップ用に。",
    keywords: "Java Silver 黒本",
  },
];

export function amazonSearchUrl(keywords: string): string {
  const params = new URLSearchParams({ k: keywords });
  if (amazonTag) params.set("tag", amazonTag);
  return `https://www.amazon.co.jp/s?${params.toString()}`;
}
