import type { Metadata } from "next";
import { contactUrl } from "@/lib/monetization";
import { siteName } from "@/lib/site";

export const metadata: Metadata = { title: "運営者情報・運営方針" };

export default function About() {
  return (
    <div className="leading-relaxed">
      <h1 className="text-2xl font-bold">運営者情報・運営方針</h1>
      <h2 className="mt-8 text-lg font-bold">サイトについて</h2>
      <p className="mt-2">
        {siteName}は、在宅ワークのデスク環境づくりに役立つ道具を比較・紹介するサイトです。
      </p>
      <h2 className="mt-8 text-lg font-bold">記事の作り方</h2>
      <ul className="mt-2 list-disc pl-5">
        <li>商品名・価格・レビュー評価・レビュー件数は、楽天市場の公開APIから自動で取得し、定期的に更新しています。</li>
        <li>記事の文章はAI（Claude）を利用して作成し、別のAIによる事実確認を経て掲載しています。</li>
        <li>記事は公開データにもとづく比較であり、運営者が実際に商品を使用したレビューではありません。</li>
        <li>価格や在庫は変動します。購入前に必ずリンク先の販売ページで最新情報をご確認ください。</li>
      </ul>
      <h2 className="mt-8 text-lg font-bold">広告について</h2>
      <p className="mt-2">
        当サイトは、楽天アフィリエイト、Amazonアソシエイト・プログラム等のアフィリエイトプログラムに参加しています。
        記事内のリンクから商品が購入されると、運営者に紹介料が支払われる場合があります。
        Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。
      </p>
      <h2 className="mt-8 text-lg font-bold">お問い合わせ</h2>
      <p className="mt-2">
        {contactUrl ? (
          <a href={contactUrl} className="text-accent-dark underline" target="_blank" rel="noopener noreferrer">
            お問い合わせフォーム
          </a>
        ) : (
          "お問い合わせフォームは準備中です。"
        )}
      </p>
    </div>
  );
}
