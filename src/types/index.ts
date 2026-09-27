/** 楽天市場APIから自動取得した商品データ（文章はここにある事実だけを根拠に書く） */
export interface Product {
  itemCode: string;
  name: string;
  price: number;
  url: string;
  imageUrl?: string;
  reviewAverage: number;
  reviewCount: number;
  shopName: string;
}

export interface Pick {
  itemCode: string;
  /** 例: 「コスパ重視」「レビュー件数No.1」 */
  label: string;
  summary: string;
}

export interface Guide {
  slug: string;
  keyword: string;
  category: string;
  title: string;
  description: string;
  intro: string;
  points: { heading: string; body: string }[];
  products: Product[];
  picks: Pick[];
  faq: { q: string; a: string }[];
  publishedAt: string;
  updatedAt: string;
}
