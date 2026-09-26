# 社長に決めていただくこと(レンタルスペース事業)

- 作成:ai-secretary / 2026-09-26
- 並び順:**今すぐ → 物件探し前 → 契約前 → 開業前 → 開業後**。同じ区分の中は重要な順
- 各項目に「推奨案」と「根拠資料」を付けた。推奨案は各AI社員の資料をもとにした案で、**社長の承認前は仮**
- 「**要統一**」は部署間で内容が食い違っている項目。第2部に矛盾の一覧(U-xx)をまとめた。他部署の資料は編集していない。決定後に ai-secretary が各担当へ修正を依頼する
- タスクの進み具合は [tasks.md](tasks.md)、本日の議事録は [minutes/2026-09-26.md](minutes/2026-09-26.md)
- 期限の目安:concept.md のロードマップどおりなら P0 締め=2026-10-10、契約=第8週(〜2026-11-21)、開業日 D ≒ 2026-12-19(第12週)

---

## 第1部 決定事項の一覧

### A. 今すぐ(P0:2026-10-10 まで)

| ID | 決めること | 推奨案 | 根拠資料 |
|---|---|---|---|
| O-01 | コンセプトを採用するか(主軸:休日・平日夜の推し活・上映会・誕生日会/副軸:平日昼の撮影・会議・面接) | **採用**。大人数・飲酒中心のパーティー、会議室のみ(損益分岐約57%)、ダンス・楽器は見送り | [concept.md 第1章・結論](strategy/concept.md)、[market-report.md 第3・6章](research/market-report.md) |
| O-02 | 予算上限400万円(初期投資250万円+運転資金150万円)と資金源 | **自己資金。運転資金150万円は初期投資と別に確保**。物件取得費は上限150万円 | [concept.md 3-4](strategy/concept.md)、[costs.md 第1章](admin/costs.md)、[opening-checklist.md 0-2](admin/opening-checklist.md) |
| O-03 | 撤退基準への合意と、**初期投資の回収は「開業から約3年(35ヶ月目)」**になることの了承 | **合意**。6ヶ月20%未満で黄信号、12ヶ月30%未満で撤退、運転資金48万円割れで撤退・縮小 | [concept.md 3-2・3-3](strategy/concept.md)、[analytics/report.md](analytics/report.md)、[analytics/pl-monthly.csv](analytics/pl-monthly.csv) |
| O-04 | 12ヶ月時点で稼働率30〜35%だった場合の扱い | **18ヶ月目を期限とした条件付き継続**(15ヶ月目に中間判定、18ヶ月目に40%未満なら撤退)。30%では月+1.7万円で事実上回収できないため | [concept.md 3-3-1](strategy/concept.md)、[analytics/kpi.md 第4章 #3](analytics/kpi.md) |
| O-05 | 事業の形(個人事業か法人か) | **個人事業で開始**(契約名義も個人。後で法人化する場合の名義変更の可否は契約時に確認) | [concept.md 第5章 #5](strategy/concept.md)、[contract-notes.md 2-4 #28](admin/contract-notes.md) |
| O-06 | 社長自身の関与時間(清掃・トラブル対応・メッセージ返信) | **最初の1ヶ月は社長が自分で清掃し、その後は外注**。返信は1時間以内、1日10〜20分を見込む | [concept.md 1-1・第5章 #6](strategy/concept.md)、[plan.md S3・S4](marketing/plan.md)、[operations.md 1-3](admin/operations.md) |
| O-07 | **要統一(U-01)** スペース名 | **「ROOM6(ルームシックス)」をブランド名に仮決定**し、ポータルの掲載名は「ROOM6|◯◯駅徒歩◯分|100インチシアター&白壁撮影|6名まで」の形にする。駅名を名前に入れないので2室目にも広げやすく、駅名での検索はタイトルで拾える(ai-writer の狙いも満たす)。商標・同名の確認後に本決定 | [listing.md 第1章](content/listing.md)、[brand-and-banners.md 第1章](design/brand-and-banners.md) |
| O-08 | **要統一(U-02・U-05)** ハウスルールの時間と飲酒 | ①**パーティー・上映会・誕生日会は22時退室、会議・撮影・勉強会だけ23時まで予約可**(ai-writer 案)。SNS・画像の「22時退室」は「パーティー・上映会は22時退室」と書く ②**飲酒は持ち込み可・節度を守る(泥酔・飲酒目的の長時間利用は禁止)**。ただし賃貸借契約・管理規約で禁止・制限があればそちらに合わせる | [concept.md 1-1・1-3](strategy/concept.md)、[listing.md 6-2・6-5](content/listing.md)、[faq.md Q13](sales/faq.md)、[contract-notes.md 2-1 #3・#4](admin/contract-notes.md) |
| O-09 | **要統一(U-12)** 開業時の料金表 | concept 2-1・2-2 の料金を採用。ただし**「平日 撮影半日パック(4時間)6,800円」は「商用撮影料込み」と定義する**(定価で計算すると 1,500円×4h=6,000円より高く、商用加算込み 10,000円なら割安になるため)。税込/税抜の表示はポータルの仕様に合わせて統一 | [concept.md 第2章](strategy/concept.md)、[listing.md 第4章](content/listing.md)、[objection-handling.md #3](sales/objection-handling.md)、[simulate.py の単価メモ](analytics/simulate.py) |
| O-10 | **要統一(U-13)** 回数券・平日昼定額プラン(sales 案)と請求書払い | **開業時は採用しない**。「ポータル経由+月4回以上で10%引き」だけで始め、ポータル規約の確認(直接取引の可否)と開業後の法人の要望件数を見て P4 で再判断 | [proposal.md 料金・社内メモ](sales/proposal.md)、[targets.md 第4章](sales/targets.md)、[concept.md 2-2・第6章](strategy/concept.md) |

### B. 物件探し前(P1 開始:2026-10-10 ごろ)

| ID | 決めること | 推奨案 | 根拠資料 |
|---|---|---|---|
| O-11 | 物件の必須条件と上限 | **家賃(共益費込み)12万円以下、物件取得費150万円以下、駅徒歩5分以内、事業用、同フロア・上下階に住戸なし、時間貸しの書面承諾**。解約予告は3ヶ月以内を交渉 | [concept.md 1-5](strategy/concept.md)、[contract-notes.md 第1章](admin/contract-notes.md)、[analytics/report.md レバー](analytics/report.md) |
| O-12 | 候補駅の決定 | ai-marketer の比較表(RS-050・RS-052)を見て、必須条件を満たす駅から1つ。ターミナル駅の1〜2駅隣・推し活集積地の「隣」を優先 | [competitors.md 第3〜5章](marketing/competitors.md)、[concept.md 1-5](strategy/concept.md) |
| O-13 | **要統一(U-03・U-04)** 入室できる時刻と清掃バッファ | **入室は予約開始時刻から(暗証番号も予約時間内のみ有効)。清掃バッファは「利用後30分」のみ**。「前後30分」にすると予約の間が実質1時間空き、売れる時間が減る | [listing.md 4・6-2](content/listing.md)、[guest-messages.md 2・4-4](content/guest-messages.md)、[faq.md Q5・Q18](sales/faq.md)、[concept.md 2-1](strategy/concept.md)、[operations.md A2](admin/operations.md) |
| O-14 | **要統一(U-06)** ゴミのルール | **ゲストは原則すべて持ち帰り**(事業系ゴミの収集契約が不要で、清掃時間も短い)。室内の分別ゴミ箱は清掃用と少量の分別用に置く。内見で建物のゴミ規則を確認し、持ち帰りが現実的でなければ見直す | [listing.md 6-6](content/listing.md)、[guest-messages.md 1](content/guest-messages.md)、[interior.md 5-3・4-2 #16](design/interior.md)、[operations.md 2-3](admin/operations.md)、[faq.md Q13](sales/faq.md) |
| O-15 | **要統一(U-07)** 装飾でテープを使ってよいか | **装飾は有孔ボードとピクチャーレールに限る。マスキングテープは有孔ボード・貸出キットの上だけ可、壁紙・天井・家具には一切不可**。掲載文に「マステは装飾壁の上のみ可」と明記(推し活の幹事は可否を気にする) | [listing.md 5・6-7](content/listing.md)、[interior.md 第6章](design/interior.md)、[operations.md 2-1](admin/operations.md)、[personas.md A](marketing/personas.md) |

### C. 契約前(第8週:2026-11-21 ごろまで)

| ID | 決めること | 推奨案 | 根拠資料 |
|---|---|---|---|
| O-16 | 物件の申込・契約 | **時間貸し(第三者利用)可の書面承諾(特約または覚書)がなければ契約しない**。最重要5項目(転貸・用途・営業時間・定員/騒音/飲酒・解除条項)を書面で確認 | [contract-notes.md 2-1・第5章](admin/contract-notes.md)、[opening-checklist.md 1-4](admin/opening-checklist.md) |
| O-17 | 覚書に書く条件 | 営業時間8〜23時・宿泊不可・スマートロック/入口カメラ/騒音センサー設置可・内装(貼って剥がせる壁紙・突っ張り柱)と原状回復の範囲。O-08 の飲酒・22時退室と矛盾しない文面にする | [contract-notes.md 2-1 覚書の文例・2-3](admin/contract-notes.md)、[interior.md 第6章](design/interior.md) |
| O-18 | 専門家(弁護士・司法書士等)に契約書を見てもらうか | **見てもらう**(1室しかないので、解除=投資の全損に近い)。費用は予備費から | [contract-notes.md 冒頭・第5章](admin/contract-notes.md) |
| O-19 | 火災保険(借家人賠償付き) | **加入**(貸主指定があればそれに従う)。入居日まで | [opening-checklist.md 1-8](admin/opening-checklist.md)、[market-report.md 第4章](research/market-report.md) |

### D. 開業前(D−30〜D)

| ID | 決めること | 推奨案 | 根拠資料 |
|---|---|---|---|
| O-20 | 内装・設備への投資額 | **内装50万円+家具・AV・撮影照明45万円=95万円以内。装飾壁と簡易防音まで、本格的な防音工事はしない**。写真撮影は8万円でプロに半日依頼 | [interior.md 第4章](design/interior.md)、[photo-shotlist.md](design/photo-shotlist.md)、[concept.md 3-4・第5章 #9](strategy/concept.md) |
| O-21 | **要統一(U-20)** 掲載するポータルと開始時期 | **開業時はスペースマーケット+インスタベースの2社。会議系1社(スペイシー等)は開業後3ヶ月以内に追加**(最初は2社で返信速度とレビューに集中)。カシカシは4ヶ月目以降に検討 | [concept.md 第5章 #10](strategy/concept.md)、[plan.md S5](marketing/plan.md)、[opening-checklist.md 2-11](admin/opening-checklist.md) |
| O-22 | 施設賠償責任保険 | **加入**(最初の予約受付日まで)。ポータル保険は各社の予約にしか効かず上限もある | [concept.md 第5章 #11](strategy/concept.md)、[opening-checklist.md 2-7](admin/opening-checklist.md) |
| O-23 | **要統一(U-08・U-09)** モニター・ホワイトボード・会議用マイク、撮影機材の貸出 | **開業時はモニター・ホワイトボード・マイクは置かない(プロジェクター投影で代替)。背景紙スタンドは内装予算に入っているので「室内で自由に使える備品」として掲載し、「機材貸出」とは書かない**。法人の要望件数を見て P4 で追加を判断 | [targets.md 第4章 #2・#3](sales/targets.md)、[faq.md Q9・Q11](sales/faq.md)、[listing.md 3-3・5](content/listing.md)、[interior.md 4-2](design/interior.md)、[photo-shotlist.md カット15](design/photo-shotlist.md)、[personas.md C](marketing/personas.md) |
| O-24 | 開業日 D | 契約日+内装・届出・審査に約4週間を見て、契約後に決める(ロードマップどおりなら2026-12中旬)。12月開業ならクリスマス・年末上映会の需要が開業月に重なる | [concept.md 第4章](strategy/concept.md)、[opening-checklist.md 期限の早見表](admin/opening-checklist.md)、[plan.md A4](marketing/plan.md) |
| O-25 | オープニング価格の割引率 | **25%引きを開業1ヶ月目のみ**(収支試算もこの値) | [concept.md 2-3](strategy/concept.md)、[analytics/kpi.md 第0章](analytics/kpi.md) |
| O-26 | **要統一(U-14)** キャンセル料・延長料金・違反時の追加清掃費 | キャンセルは ai-writer 例(7日前まで無料/6〜3日前50%/2日前〜当日100%)をポータルの設定範囲で採用。延長は「30分ごとの料金」で表記をそろえる(金額は ai-ceo 案) | [listing.md 6-2・6-9・6-10](content/listing.md)、[faq.md Q6・Q7](sales/faq.md) |
| O-27 | ヨガ・ストレッチ等のレッスン利用 | **開業時は受けない**。物件の床・下階・広さを確認してから判断。ダンス・楽器・大声は常に不可 | [targets.md 2-4・第4章 #5](sales/targets.md)、[faq.md Q12](sales/faq.md) |
| O-28 | SNS(Instagram・X)とGoogleビジネスプロフィールの開設、開業前の投稿 | **SNS は開業5週前に開設、4週前から sns.md の順に投稿**(各投稿は社長確認後)。GBP は無人スペースが登録対象と確認できた場合だけ | [sns.md](content/sns.md)、[plan.md A1・A2](marketing/plan.md)、[brand-and-banners.md 第6〜7章](design/brand-and-banners.md) |
| O-29 | インボイス登録と表記 | **開業時は未登録で始め、掲載文・FAQ に「適格請求書は発行できません」と明記**(不満レビューを防ぐ)。開業3ヶ月の法人利用比率と手数料の消費税(実質33%→30%)の効果で判断 | [concept.md 第5章 #5・2-3 #4](strategy/concept.md)、[personas.md C](marketing/personas.md)、[faq.md Q19](sales/faq.md)、[opening-checklist.md 3-4](admin/opening-checklist.md) |

### E. 開業後

| ID | 決めること | 推奨案 | 根拠資料 |
|---|---|---|---|
| O-30 | 6ヶ月・12ヶ月・(条件付き継続なら)15・18ヶ月の継続/撤退、50%超3ヶ月連続なら2室目 | 撤退基準どおり | [concept.md 3-3](strategy/concept.md) |
| O-31 | 有料広告 | 原則やらない。6ヶ月時点で黄信号のときだけ月1〜2万円で1ヶ月試す | [plan.md B3](marketing/plan.md) |
| O-32 | 直接予約のLP・回数券・定額プラン | ポータル規約で認められる範囲で P4〜P5 に再判断 | [concept.md P5・第6章](strategy/concept.md)、[proposal.md](sales/proposal.md) |

---

## 第2部 部署間の矛盾一覧(要統一)

「決め方」の列が「社長」のものは第1部の O-xx で判断をお願いしたい。「担当で修正」のものは、社長判断なしで担当者が直せる食い違い(tasks.md に登録済み)。

| ID | 内容 | 食い違っている資料 | 決め方 |
|---|---|---|---|
| U-01 | **スペース名**:ai-writer は「シアタールーム【駅名】 six」を推奨、ai-designer は「ROOM6 シアター&スタジオ」を推奨し、ロゴ・配色・SNSテンプレートまで ROOM6 で作り込んでいる | [listing.md 第1章](content/listing.md)/[brand-and-banners.md 第1章](design/brand-and-banners.md) | 社長 O-07(+商標確認 RS-034) |
| U-02 | **退室時刻**:concept は「営業8〜23時、パーティー系は22時退室」。listing.md は用途で分けて「会議・撮影・勉強会は23時まで」。SNS 投稿案5・ハイライト「ルール」・ゲスト定型文・掲載タイトルの説明は用途を問わず「22時退室」と書いている。提案書は「営業時間8:00〜23:00」。収支試算(analytics・simulator)は全用途を23時まで売れる前提(月450時間)で、22〜23時はパーティー系には売れない | [concept.md 1-1](strategy/concept.md)、[listing.md 6-2](content/listing.md)、[sns.md #5](content/sns.md)、[brand-and-banners.md 6-4](design/brand-and-banners.md)、[proposal.md](sales/proposal.md)、[analytics/kpi.md 第0章](analytics/kpi.md) | 社長 O-08 → 文言は ai-writer/ai-designer、再計算は ai-analyst(RS-038) |
| U-03 | **入室できる時刻**:ゲスト定型文は「利用時間の10分前から暗証番号が使える」。利用規約・FAQ・提案書は「予約開始時刻から/予約時間外の入室不可/番号は予約時間内のみ有効」 | [guest-messages.md 2・4-4](content/guest-messages.md)/[listing.md 6-2](content/listing.md)、[faq.md Q16・Q18](sales/faq.md)、[objection-handling.md #10](sales/objection-handling.md) | 社長 O-13 |
| U-04 | **清掃バッファ**:concept・FAQ は「利用後30分」、listing.md と自動化 A2 は「前後30分」 | [concept.md 2-1](strategy/concept.md)、[faq.md Q5](sales/faq.md)/[listing.md 第4章](content/listing.md)、[operations.md A2](admin/operations.md) | 社長 O-13 |
| U-05 | **飲酒の可否**:利用規約は「飲酒は節度を守って可」、FAQ は「アルコールの可否:平日昼は◯◯」で未定、concept は明記なし(飲酒中心のパーティーは不採用)、contract-notes は契約で飲酒制限の有無を確認するとしている | [listing.md 6-5](content/listing.md)/[faq.md Q13](sales/faq.md)/[concept.md 1-4](strategy/concept.md)/[contract-notes.md 2-1 #4](admin/contract-notes.md) | 社長 O-08(契約条項 RS-058 で最終確認) |
| U-06 | **ゴミ**:ゲスト定型文・利用規約は「すべてお持ち帰り」、内装指示書は「室内の分別ゴミ箱に入れて清掃スタッフが回収」(分別ゴミ箱も購入予定)、運営フローは事業系ゴミの扱いが未定 | [guest-messages.md 1](content/guest-messages.md)、[listing.md 6-6](content/listing.md)/[interior.md 5-3](design/interior.md)/[operations.md 2-3](admin/operations.md) | 社長 O-14 |
| U-07 | **装飾のテープ**:利用規約は「壁・天井・家具へのテープ使用不可、テープ・画びょうは不要」。内装指示書は「マスキングテープ・有孔ボードのフック・ピクチャーレールのみ使用可」とし装飾キットにマステを入れ、運営フローも装飾用にマステを貸出 | [listing.md 5・6-7](content/listing.md)/[interior.md 4-2 #14・第6章](design/interior.md)、[operations.md 2-1](admin/operations.md) | 社長 O-15 |
| U-08 | **撮影機材の貸出**:撮影指示書のカット15は「撮影機材=機材の貸出」を伝える写真で、背景紙スタンドも購入予定。営業資料は「機材貸出あり」と言うことを NG(計画なし)とし、FAQ は「貸出の有無未定」 | [photo-shotlist.md カット15](design/photo-shotlist.md)、[interior.md 4-2 #12](design/interior.md)/[targets.md 2-1](sales/targets.md)、[faq.md Q11](sales/faq.md) | 社長 O-23 |
| U-09 | **モニター**:掲載文は「Wi-Fiとモニター出力(HDMI)をご用意」、設備表は「モニター:有無要確認」、内装の購入リストにモニターはない、営業資料は「有無未定」、ペルソナCの決め手には「大画面モニター/プロジェクター」 | [listing.md 3-3・5](content/listing.md)/[interior.md 4-2](design/interior.md)/[faq.md Q9](sales/faq.md)/[personas.md C](marketing/personas.md) | 社長 O-23 |
| U-10 | **スクリーンの大きさ**:掲載文・SNS・提案書は「100インチ以上」と書くが、内装指示書は「短辺が2.5m未満なら80〜90型に落とす」 | [listing.md](content/listing.md)、[sns.md #3](content/sns.md)、[proposal.md](sales/proposal.md)/[interior.md 第7章](design/interior.md) | 担当で修正(物件の実寸で確定 RS-064 → 文言を ai-writer・ai-sales が追従) |
| U-11 | **会議配置の席**:内装指示書は「机+チェア4脚+プーフ2」、撮影指示書カット5は「椅子6席」、掲載文は「椅子6脚」 | [interior.md 1-3・4-2](design/interior.md)/[photo-shotlist.md カット5](design/photo-shotlist.md)/[listing.md 5](content/listing.md) | 担当で修正(ai-designer と ai-writer で統一) |
| U-12 | **料金**:平日撮影半日パック6,800円(1,700円/時)が平日昼の定価(4h=6,000円)より高い。営業資料は「商用加算込みなら割安」と説明する前提で、concept・掲載文は商用加算の扱いを書いていない | [concept.md 2-1・2-2](strategy/concept.md)、[listing.md 4](content/listing.md)/[objection-handling.md #3](sales/objection-handling.md)、[proposal.md](sales/proposal.md) | 社長 O-09 |
| U-13 | **新プラン**:営業資料に回数券(10時間13,500円)・定額ライト(月8時間10,800円)・定額スタンダード(月16時間21,600円)・請求書払いの案。concept は「月4回以上で10%引き」だけで、直接契約は規約確認までは計画に入れない方針 | [proposal.md](sales/proposal.md)、[faq.md Q4](sales/faq.md)/[concept.md 2-2・第6章](strategy/concept.md) | 社長 O-10 |
| U-14 | **延長料金・キャンセル**:利用規約は「30分ごとに通常料金の◯倍」、FAQ は「延長料金◯円/30分」。キャンセルは利用規約に例があり、FAQ は未定 | [listing.md 6-2・6-10](content/listing.md)/[faq.md Q6・Q7](sales/faq.md) | 社長 O-26 |
| U-15 | **3ヶ月目・6ヶ月目の数字**:concept 第2版は3ヶ月目「売上約20万円・損益約−6万円」、6ヶ月目「約32万円・約+1万円」。analytics/kpi.md の月次表は「約22万円・約−4万円(シミュ)」「約33万円・約+2万円」(時間帯ミックス単価2,481円で計算)。simulator の README は「concept の−4万円は誤り」と注記したままで、第2版の修正を反映していない | [concept.md 3-2](strategy/concept.md)/[analytics/kpi.md 2-2](analytics/kpi.md)、[pl-monthly.csv](analytics/pl-monthly.csv)/[simulator README 末尾](../../tools/rental-space-simulator/README.md) | 担当で修正(RS-037:concept 第2版を正本とし、kpi.md の表は参考値と明記、README 更新) |
| U-16 | **シミュレーターの判定**:12ヶ月で30〜35%を「継続(合格未満)」と表示(concept 第2版は「18ヶ月期限の条件付き継続」)。45%の説明が「2年回収ペース」(第2版は「開業から約3年」)。「投資回収月数」は初期投資÷月利益で、立ち上げ期の赤字を含まない | [tools/rental-space-simulator/index.html judge12Months](../../tools/rental-space-simulator/index.html)/[concept.md 3-2・3-3-1](strategy/concept.md) | 担当で修正(RS-036。O-04 の決定を反映) |
| U-17 | **平日夜の単価と時間帯別の稼働率の初期値**:analytics は平日夜の実効単価2,300円(上映会パック込み)・6ヶ月時点15/31/50%、simulator は定価2,500円・15/35/50%。同じ「6ヶ月・約30%」でも月利益が合わない | [simulate.py BANDS](analytics/simulate.py)/[simulator README 初期値](../../tools/rental-space-simulator/README.md) | 担当で修正(RS-037。どちらの前提かを画面・資料に明記) |
| U-18 | **1予約あたりの平均時間**:concept・analytics・simulator は4.7時間、集客プランは4.0時間で予約件数を逆算(12ヶ月で約50件 vs analytics 約43件)。1ヶ月目の売上も plan.md「約10万円」、pl-monthly.csv「約8.4万円」 | [plan.md 1-2・S4](marketing/plan.md)/[concept.md 3-1](strategy/concept.md)、[pl-monthly.csv](analytics/pl-monthly.csv) | 担当で修正(RS-037。1予約が短いと清掃費で月約4.9万円悪化するため、どちらを目標にするか明記) |
| U-19 | **調査レポート(初版)の古い目安**:「2年回収には稼働率44%」「12か月で40%前後」は concept 第2版(12ヶ月45%目標・開業から約3年で回収)に置き換わっている | [market-report.md 結論・5-3](research/market-report.md)/[concept.md 3-2](strategy/concept.md) | 担当で注記(ai-researcher が改版時に「concept 第2版を参照」と書く。判断には concept を使う) |
| U-20 | **ポータルの開始時期**:concept は「2社から開始し、平日向けに1社追加」、集客プランは「会議系1社は3ヶ月目までに追加」、開業手続きは「平日向け1社も含めて D−14 までに申請」 | [concept.md 第5章 #10](strategy/concept.md)/[plan.md S5](marketing/plan.md)/[opening-checklist.md 2-11](admin/opening-checklist.md)、[targets.md 差し込み欄](sales/targets.md) | 社長 O-21 |
| U-21 | **concept の番号ずれ**:第2版で第5章に項目が加わり番号が1つずつずれたが、他部署の資料は第1版の番号を引用している | [plan.md S5](marketing/plan.md)、[competitors.md 第4章 #7](marketing/competitors.md)、[personas.md C](marketing/personas.md)、[interior.md 第5章](design/interior.md)、[opening-checklist.md 0-2・1-4](admin/opening-checklist.md) | 担当で修正(RS-043) |
| U-22 | **上映の権利条項の抜け**:ペルソナ資料は「上映内容の権利はゲストの責任」を ai-writer が利用規約に入れるとしているが、利用規約にまだない | [personas.md A 注意](marketing/personas.md)/[listing.md 第6章](content/listing.md) | 担当で修正(RS-093) |
| U-23 | **定員に乳幼児を含むか**:利用規約は「含む」と定義済み、FAQ は「規約で定義」の未定のまま | [listing.md 6-1](content/listing.md)/[faq.md Q15](sales/faq.md) | 担当で修正(RS-094 で FAQ を規約に合わせる) |
| U-24 | **インボイス**:ペルソナCの「刺さる言葉」に「適格請求書発行可」、提案書は【対応/未対応】、concept は判断保留 | [personas.md C](marketing/personas.md)/[proposal.md](sales/proposal.md)/[concept.md 第5章 #5](strategy/concept.md) | 社長 O-29 |
| U-25 | **レビュー返信の期限**:集客プランは「48時間以内」、運営フローは「3日以内」 | [plan.md S4](marketing/plan.md)/[operations.md 1-5](admin/operations.md) | 担当で修正(短い48時間にそろえることを推奨。RS-114) |

---

## 第3部 抜け漏れのリマインド(ai-secretary)

- **担当が決まっていない作業**:ポータル規約の一括確認は資料ごとに「ai-researcher」「社長・ai-researcher」「未確認」とばらばらだったため、tasks.md で ai-researcher に一本化した(RS-032・RS-033)。GAS 自動化の実装者は operations.md に書かれていないため、ai-programmer を仮で割り当てた(RS-084)
- **期限が迫っているもの**:P0 の締め(2026-10-10)までに O-01〜O-10 の決定が必要。特に O-07(スペース名)が決まらないと ai-designer のロゴ・SNS素材と ai-writer の掲載名が止まる
- **開業日 D が未定**:届出・保険・撮影・審査の期限はすべて D からの逆算。契約日が決まったら O-24 を最優先で
- ai-designer・ai-admin の成果物は「WIP」コミットのままで、最終版のコミットがない(内容は本日の資料として扱った)
