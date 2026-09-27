import type { Pick, Product } from "@/types";
import { amazonSearchUrl } from "@/lib/monetization";
import { yen } from "@/lib/guides";

export default function ProductCard({
  rank,
  product,
  pick,
}: {
  rank: number;
  product: Product;
  pick: Pick;
}) {
  return (
    <article className="rounded-xl border border-line p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
          {rank}
        </span>
        <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent-dark">
          {pick.label}
        </span>
      </div>
      <div className="mt-3 flex gap-4">
        {product.imageUrl && (
          // 楽天の商品画像は外部URLのまま表示する（静的エクスポートでは next/image の最適化が使えない）
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            width={120}
            height={120}
            loading="lazy"
            className="h-[120px] w-[120px] shrink-0 rounded-lg border border-line bg-white object-contain"
          />
        )}
        <div className="min-w-0">
          <h3 className="line-clamp-3 font-semibold leading-snug">{product.name}</h3>
          <p className="mt-1 text-lg font-bold text-accent-dark">{yen(product.price)}</p>
          <p className="text-sm opacity-70">
            ★{product.reviewAverage.toFixed(2)}（{product.reviewCount.toLocaleString("ja-JP")}件）・{product.shopName}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed">{pick.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={product.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="rounded-lg bg-[#bf0000] px-4 py-2 text-sm font-bold text-white hover:opacity-85"
        >
          楽天市場で詳細を見る
        </a>
        <a
          href={amazonSearchUrl(product.name.slice(0, 40))}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:border-accent"
        >
          Amazonで探す
        </a>
      </div>
    </article>
  );
}
