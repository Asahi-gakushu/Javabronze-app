# Javabronze ☕

Java Bronze（Oracle認定Javaブロンズ）対策の無料4択クイズサイト。
**一度設定すれば、あとは放置で「コンテンツが増える → 検索流入が増える → 広告・アフィリエイト収益」が回る**ように作ってあります。

## 自動で回る仕組み

```
毎週月曜 6:07 (JST)  ── GitHub Actions「週次コンテンツボット」
   │
   ├─ Claude が各トピックの新問題を作成
   ├─ 別の Claude 呼び出しが「答えを見ずに」解き直す
   │     → 正解が一致し、曖昧さがない問題だけ採用
   ├─ 構造チェック（4択・重複・正解番号など）＋ビルド確認
   ├─ main に自動コミット
   └─ GitHub Pages に自動デプロイ（無料ホスティング）
          │
          ├─ sitemap.xml / robots.txt / トピックごとのSEOメタデータ → 検索流入
          ├─ 結果画面の「Xでシェア」 → 口コミ流入
          └─ 収益化
               ├─ Google AdSense 広告（トップ・結果画面）
               ├─ Amazonアソシエイト（おすすめ教材。点数で文言が変わる）
               └─ 応援リンク（Stripe Payment Link / Ko-fi など）
```

1ラウンド10問をランダム出題するので、問題が増えるほど「もう一度挑戦する」価値も上がります。

## 最初に一度だけ必要な作業（人間にしかできない部分）

アカウント作成・審査・支払い受け取りは本人名義が必要なため、ここだけはご自身でお願いします。
**未設定の項目は自動的に非表示になる**ので、1つずつ進めて大丈夫です。

| # | やること | 場所 | 目安 |
|---|---|---|---|
| 1 | GitHub Pages を有効化（Source: **GitHub Actions**） | リポジトリ Settings → Pages | 1分 |
| 2 | `ANTHROPIC_API_KEY` を Secret に登録（問題自動生成用） | Settings → Secrets and variables → Actions → **Secrets** | 2分 |
| 3 | Amazonアソシエイトに登録し、`NEXT_PUBLIC_AMAZON_TAG` を登録 | 同 → **Variables** | 審査あり |
| 4 | Google AdSense に申請し、`NEXT_PUBLIC_ADSENSE_CLIENT` / `NEXT_PUBLIC_ADSENSE_SLOT` を登録 | 同 → **Variables** | 審査あり（ある程度の記事量が必要） |
| 5 | （任意）応援・決済リンクを `NEXT_PUBLIC_SUPPORT_URL` に登録 | 同 → **Variables** | 5分 |
| 6 | （任意）Google Analytics の `NEXT_PUBLIC_GA_ID` を登録 | 同 → **Variables** | 5分 |
| 7 | Google Search Console にサイトを登録し `sitemap.xml` を送信 | search.google.com/search-console | 5分 |

独自ドメインを使う場合は `NEXT_PUBLIC_SITE_URL` も Variables に設定してください。
Variables を変えたら Actions → 「GitHub Pages へデプロイ」→ Run workflow で反映されます。

### コストの目安
- ホスティング：GitHub Pages なので無料
- 問題生成：週1回 × 6トピック × 3問（作成＋検証の2回呼び出し）。1回あたり数十円〜程度のAPI利用料。
  Actions → 「週次コンテンツボット」→ Run workflow で問題数を変えて手動実行もできます。

### 正直な注意点
- 収益はアクセス数次第です。最初の数か月は検索エンジンに評価されるまで収益はほぼゼロが普通です。
- AdSense は中身の薄いサイトだと審査に落ちることがあります。問題が100問程度たまってから申請するのがおすすめ。
- 自動生成問題は2段階チェックしていますが、完璧ではありません。ときどき `git log` で追加分を眺めて、
  おかしな問題は `src/data/topics/*.json` から削除してください。

## 開発

```bash
npm install
npm run dev          # http://localhost:3000
npm run validate     # 問題データの構造チェック
npm run lint && npm run typecheck && npm run build   # 静的サイトを out/ に出力

# 手元で問題を生成（APIキーが必要）
ANTHROPIC_API_KEY=... QUESTIONS_PER_TOPIC=2 TOPICS=basics npm run generate
```

| パス | 役割 |
|---|---|
| `src/data/topics/*.json` | 問題データ（トピックごと。ボットがここに追記） |
| `src/lib/monetization.ts` | 収益化の設定・おすすめ教材リスト |
| `src/components/AdSlot.tsx` / `AffiliateBox.tsx` / `SupportCta.tsx` / `ShareButton.tsx` | 収益化・拡散パーツ |
| `scripts/generate-questions.mjs` | Claude による問題作成＋ブラインド検証 |
| `scripts/validate-questions.mjs` | 問題データの検証（CI・ボット・デプロイで実行） |
| `.github/workflows/` | CI / Pages デプロイ / 週次コンテンツボット |
