import type { Metadata } from "next";
import { siteName } from "@/lib/site";

export const metadata: Metadata = { title: "プライバシーポリシー" };

export default function Privacy() {
  return (
    <div className="leading-relaxed">
      <h1 className="text-2xl font-bold">プライバシーポリシー</h1>
      <h2 className="mt-8 text-lg font-bold">アクセス解析ツールについて</h2>
      <p className="mt-2">
        {siteName}では、Googleによるアクセス解析ツール「Googleアナリティクス」を利用する場合があります。
        Googleアナリティクスはデータ収集のためにCookieを使用します。このデータは匿名で収集されており、個人を特定するものではありません。
        Cookieを無効にすることで収集を拒否できますので、お使いのブラウザの設定をご確認ください。
      </p>
      <h2 className="mt-8 text-lg font-bold">広告配信について</h2>
      <p className="mt-2">
        当サイトは第三者配信の広告サービス（Google AdSense）およびアフィリエイトプログラムを利用する場合があります。
        広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
        パーソナライズ広告は、Googleの広告設定で無効にできます。
      </p>
      <h2 className="mt-8 text-lg font-bold">免責事項</h2>
      <p className="mt-2">
        当サイトの情報はできる限り正確な提供に努めていますが、正確性や安全性を保証するものではありません。
        当サイトのリンク先で購入された商品・サービスについては、各販売店にお問い合わせください。
        当サイトの利用によって生じた損害について、一切の責任を負いかねます。
      </p>
    </div>
  );
}
