# デスク環境ラボ 🖥️

在宅ワーク向けのデスク用品（モニターアーム・チェア・Webカメラなど）を、**楽天市場の実データで比較するアフィリエイトサイト**です。
一度設定すれば、あとは放置で「記事が増える → 検索流入が増える → アフィリエイト収益」が回るように作ってあります。

## 自動で回る仕組み

```
GitHub Actions「コンテンツ自動更新ボット」
 │
 ├─ 毎日 6:07（日本時間）
 │    └─ 掲載商品の価格・レビュー・リンクを楽天市場APIで最新化
 │       （販売終了した商品は自動で外す）
 │
 ├─ 月曜・木曜はさらに、新しい比較記事を3本作成
 │    ├─ キーワード待ちリストから次のキーワードを取り出す
 │    │   （リストが減ると Claude が新しいキーワードを提案して補充）
 │    ├─ 楽天市場APIでレビューの多い実在商品を取得
 │    ├─ Claude がその商品データ「だけ」を根拠に比較記事を執筆
 │    └─ 別の Claude が事実確認。合格した記事だけを採用
 │       ・データにない仕様の断定　・体験談のねつ造
 │       ・根拠のない「最強」「No.1」などの表現　・健康効果の表示
 │       は不合格
 │
 ├─ 構造チェック → ビルド → main に自動コミット
 └─ GitHub Pages に自動デプロイ（無料ホスティング）
        │
        ├─ sitemap.xml / 記事ごとのSEOメタデータ・構造化データ → 検索流入
        └─ 収益化
             ├─ 楽天アフィリエイト（各商品ボタン・検索ボタン）
             ├─ Amazonアソシエイト（検索ボタン）
             └─ Google AdSense（任意）
```

最初から、6本の記事（選び方の解説つき）と18個のキーワード待ちリストが入っています。
APIキーを設定する前は、各記事に「楽天市場／Amazonで探す」ボタンだけが表示されます。
キーワード待ちリストは `src/data/keywords.json` です。
設定後の最初の記事作成で、実在商品のおすすめ付きの記事に書き直されます。

### 法令・規約への配慮
- 全ページの冒頭に「PR」表記を出しています（ステルスマーケティング規制への対応）。
- 運営方針ページで「公開データにもとづく比較であり、実際に使用したレビューではない」と明記しています。
- 価格には「◯月◯日時点」と表示し、毎日更新しています。
- 運営者情報・プライバシーポリシー・お問い合わせのページがあります（ASPやAdSenseの審査で求められることが多いため）。

## 最初に一度だけ必要な作業（人間にしかできない部分）

アカウント作成・審査・報酬の受け取りは本人名義が必要なため、ここだけはご自身でお願いします。
**未設定の項目は自動的に無効になる**ので、1つずつ進めて大丈夫です。

| # | やること | 登録先（リポジトリの Settings → Secrets and variables → Actions） |
|---|---|---|
| 1 | Settings → Pages で Source を **GitHub Actions** にする | — |
| 2 | 楽天会員で [楽天アフィリエイト](https://affiliate.rakuten.co.jp/) に登録し、アフィリエイトIDを取得 | **Variables**: `NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID` |
| 3 | [Rakuten Developers](https://webservice.rakuten.co.jp/) でアプリを登録し、アプリIDとアクセスキーを取得（「許可されたWebサイト」に公開URLを入れる） | **Secrets**: `RAKUTEN_APPLICATION_ID`, `RAKUTEN_ACCESS_KEY` |
| 4 | Anthropic の API キーを取得 | **Secrets**: `ANTHROPIC_API_KEY` |
| 5 | Actions →「コンテンツ自動更新ボット」→ Run workflow で初回実行 | — |
| 6 | Googleフォームなどでお問い合わせフォームを作る | **Variables**: `NEXT_PUBLIC_CONTACT_URL` |
| 7 | 記事が20本くらいになったら、Amazonアソシエイトに申請 | **Variables**: `NEXT_PUBLIC_AMAZON_TAG` |
| 8 | （任意）Google AdSense・Google Analytics | **Variables**: `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT`, `NEXT_PUBLIC_GA_ID` |
| 9 | Google Search Console にサイトを登録し、`sitemap.xml` を送信 | — |

独自ドメインを使う場合は `NEXT_PUBLIC_SITE_URL` を Variables に設定してください。
楽天アプリの「許可されたWebサイト」にも同じURLを登録します。
Variables を変えたら、Actions →「GitHub Pages へデプロイ」→ Run workflow で反映されます。

### コストの目安
- ホスティング：無料（GitHub Pages）
- 楽天API：無料
- Claude API：週2回 × 3記事（執筆と事実確認で2回ずつ呼び出し）。1回あたり数十円〜程度（未計測の目安）

### 正直な注意点
- 収益はアクセス数しだいです。検索エンジンに評価されるまで、最初の数か月はほぼゼロが普通です。
- Amazonアソシエイトは「登録後180日以内に3件の売上」がないと取り消されます。ある程度アクセスが出てから申請するのが安全です。
- 事実確認は二重にしていますが、完璧ではありません。ときどき `git log` で追加された記事を眺めてください。
  問題があれば `src/data/guides/` の該当ファイルを削除すれば、そのページは消えます。
- 楽天APIの仕様は2026年に新ドメイン（`openapi.rakuten.co.jp`）・新バージョン（`20260701`）へ移行しています。
  今後また変わった場合は `scripts/lib/rakuten.mjs` の修正が必要です。

## 開発

```bash
npm install
npm run dev             # http://localhost:3000
npm run validate        # 記事データの構造チェック
npm run lint && npm run typecheck && npm run build   # 静的サイトを out/ に出力

# 手元でボットを動かす（APIキーが必要）
RAKUTEN_APPLICATION_ID=... RAKUTEN_ACCESS_KEY=... npm run update-prices
ANTHROPIC_API_KEY=... RAKUTEN_APPLICATION_ID=... RAKUTEN_ACCESS_KEY=... GUIDES_PER_RUN=1 npm run generate
```

| パス | 役割 |
|---|---|
| `src/data/guides/*.json` | 記事データ（1記事1ファイル。ボットが追加・更新） |
| `src/data/keywords.json` | これから記事にするキーワードの待ちリスト |
| `src/lib/site.ts` | サイト名・カテゴリ |
| `src/lib/monetization.ts` | アフィリエイトリンクの生成・収益化の設定 |
| `scripts/generate-guides.mjs` | 楽天データ取得 → Claude 執筆 → Claude 事実確認 |
| `scripts/update-prices.mjs` | 価格・レビューの毎日更新、販売終了商品の除外 |
| `scripts/lib/rakuten.mjs` | 楽天市場商品検索APIのクライアント |
| `scripts/validate-content.mjs` | 記事データの検証（CI・ボット・デプロイで実行） |
| `.github/workflows/` | CI / Pages デプロイ / コンテンツ自動更新ボット |
