import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import PrNotice from "@/components/PrNotice";
import ProductCard from "@/components/ProductCard";
import SearchButtons from "@/components/SearchButtons";
import { formatDate, getGuide, getGuides, yen } from "@/lib/guides";
import { siteUrl } from "@/lib/monetization";

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `guides/${guide.slug}/` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `guides/${guide.slug}/`,
      modifiedTime: guide.updatedAt,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const ranked = guide.picks
    .map((pick) => ({ pick, product: guide.products.find((p) => p.itemCode === pick.itemCode) }))
    .filter((r): r is { pick: typeof r.pick; product: NonNullable<typeof r.product> } => !!r.product);

  const related = getGuides()
    .filter((g) => g.category === guide.category && g.slug !== guide.slug)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: `${siteUrl}/guides/${guide.slug}/`,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PrNotice />
      <p className="mt-6 text-sm font-semibold text-accent-dark">{guide.category}</p>
      <h1 className="mt-1 text-2xl font-bold leading-snug">{guide.title}</h1>
      <p className="mt-2 text-xs opacity-60">
        公開 {formatDate(guide.publishedAt)}・最終更新 {formatDate(guide.updatedAt)}
      </p>
      <p className="mt-5 leading-relaxed">{guide.intro}</p>

      {ranked.length > 0 && (
        <nav className="mt-6 rounded-xl border border-line p-4 text-sm">
          <p className="font-bold">この記事で紹介する商品</p>
          <ol className="mt-2 list-decimal pl-5">
            {ranked.map(({ pick, product }) => (
              <li key={pick.itemCode} className="mt-1">
                <span className="font-semibold">{pick.label}</span>：{product.name.slice(0, 40)}…（{yen(product.price)}）
              </li>
            ))}
          </ol>
        </nav>
      )}

      <h2 className="mt-10 border-l-4 border-accent pl-3 text-xl font-bold">
        {guide.keyword}の選び方
      </h2>
      {guide.points.map((pt) => (
        <section key={pt.heading} className="mt-5">
          <h3 className="font-bold">{pt.heading}</h3>
          <p className="mt-1 leading-relaxed opacity-90">{pt.body}</p>
        </section>
      ))}

      <AdSlot className="mt-10" />

      <h2 className="mt-10 border-l-4 border-accent pl-3 text-xl font-bold">
        {ranked.length > 0 ? `おすすめの${guide.keyword}` : `${guide.keyword}を探す`}
      </h2>
      {ranked.length > 0 ? (
        <>
          <p className="mt-2 text-xs opacity-60">
            価格・レビューは{formatDate(guide.updatedAt)}時点の楽天市場のデータです。最新の情報はリンク先でご確認ください。
          </p>
          <div className="mt-4 flex flex-col gap-5">
            {ranked.map(({ pick, product }, i) => (
              <ProductCard key={pick.itemCode} rank={i + 1} pick={pick} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm opacity-80">
          上の選び方を参考に、人気の商品を比べてみてください。
        </p>
      )}
      <div className="mt-6">
        <SearchButtons keyword={guide.keyword} />
      </div>

      {guide.faq.length > 0 && (
        <>
          <h2 className="mt-10 border-l-4 border-accent pl-3 text-xl font-bold">よくある質問</h2>
          {guide.faq.map((f) => (
            <section key={f.q} className="mt-4">
              <h3 className="font-bold">Q. {f.q}</h3>
              <p className="mt-1 leading-relaxed opacity-90">A. {f.a}</p>
            </section>
          ))}
        </>
      )}

      {related.length > 0 && (
        <aside className="mt-12">
          <h2 className="text-lg font-bold">関連する比較記事</h2>
          <ul className="mt-3 list-disc pl-5">
            {related.map((g) => (
              <li key={g.slug} className="mt-1">
                <Link href={`/guides/${g.slug}/`} className="text-accent-dark hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
