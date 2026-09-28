"""Airbnb民泊 収支シミュレーター

3つの事業モデル(賃貸転貸×民泊新法 / 中古戸建購入リノベ×簡易宿所 / 購入リノベ×新法+マンスリー)
について、初期費用・年間収支・投資回収期間・感応度を計算し、Markdownで出力する。

使い方:
    python3 minpaku/simulate.py            # 全シナリオを表示
    python3 minpaku/simulate.py B          # シナリオBのみ

数値はすべて「仮定」。物件・エリアが決まったら SCENARIOS の値を書き換えて再計算すること。
"""

import sys
from dataclasses import dataclass, field

MAN = 10_000  # 1万円


@dataclass
class Scenario:
    key: str
    name: str
    # --- 初期費用(円) ---
    initial_costs: dict
    # --- 売上の前提 ---
    adr: int                 # 平均客室単価(1泊あたり・清掃料除く)
    occupancy: float         # 稼働率(営業可能日に対する割合)
    operable_days: int       # 年間営業可能日数(新法は180日上限)
    avg_stay: float          # 平均宿泊数(泊/組)
    cleaning_fee: int        # ゲストから受け取る清掃料(1組あたり)
    other_income: int = 0    # 年間その他収入(マンスリー賃貸など)
    # --- 変動費 ---
    platform_fee_rate: float = 0.155  # Airbnbホスト手数料(ホスト全額負担型)
    agency_rate: float = 0.20         # 運営代行手数料(売上比)。自主管理なら0
    cleaning_cost: int = 12_000       # 清掃・リネン外注費(1回)
    consumables_per_stay: int = 1_500  # アメニティ等(1組)
    # --- 固定費(年額) ---
    fixed_costs: dict = field(default_factory=dict)
    # --- 融資 ---
    loan_amount: int = 0
    loan_rate: float = 0.0
    loan_years: int = 0
    # --- 資産価値(購入型のみ):出口想定の土地建物売却額 ---
    exit_value: int = 0


def annual_loan_payment(principal, rate, years):
    if principal == 0 or years == 0:
        return 0
    r = rate / 12
    n = years * 12
    if r == 0:
        return principal / years
    monthly = principal * r / (1 - (1 + r) ** -n)
    return monthly * 12


def calc(s: Scenario, adr=None, occupancy=None):
    adr = adr if adr is not None else s.adr
    occ = occupancy if occupancy is not None else s.occupancy

    nights = s.operable_days * occ
    stays = nights / s.avg_stay
    room_rev = adr * nights
    cleaning_rev = s.cleaning_fee * stays
    gross = room_rev + cleaning_rev

    platform = gross * s.platform_fee_rate
    agency = gross * s.agency_rate
    cleaning = s.cleaning_cost * stays
    consumables = s.consumables_per_stay * stays
    variable = platform + agency + cleaning + consumables

    fixed = sum(s.fixed_costs.values())
    noi = gross + s.other_income - variable - fixed  # 税引前・借入返済前の営業CF
    debt = annual_loan_payment(s.loan_amount, s.loan_rate, s.loan_years)
    cf_after_debt = noi - debt

    initial = sum(s.initial_costs.values())
    equity = initial - s.loan_amount

    return dict(
        nights=nights, stays=stays, room_rev=room_rev, cleaning_rev=cleaning_rev,
        gross=gross, other_income=s.other_income,
        platform=platform, agency=agency, cleaning=cleaning, consumables=consumables,
        variable=variable, fixed=fixed, noi=noi, debt=debt, cf=cf_after_debt,
        initial=initial, equity=equity,
        payback_total=initial / noi if noi > 0 else float("inf"),
        payback_equity=equity / cf_after_debt if cf_after_debt > 0 else float("inf"),
        yield_=noi / initial if initial else 0,
    )


def yen(v):
    return f"{v / MAN:,.0f}万円"


def years(v):
    return "回収不能" if v == float("inf") else f"{v:.1f}年"


# ---------------------------------------------------------------------------
# シナリオ定義(仮定値)
# ---------------------------------------------------------------------------
SCENARIOS = [
    Scenario(
        key="A",
        name="A: 賃貸マンション転貸 × 民泊新法(東京23区・2LDK 50㎡・定員4名)",
        initial_costs={
            "賃貸契約費(敷金・礼金・仲介等 家賃6ヶ月)": 90 * MAN,
            "軽微な内装(クロス・照明・アクセント壁)": 60 * MAN,
            "消防設備(特定小規模用自火報・誘導灯等)": 25 * MAN,
            "家具・家電・寝具・備品": 120 * MAN,
            "届出代行(行政書士)・図面": 20 * MAN,
            "撮影・リスティング作成・スマートロック・Wi-Fi": 15 * MAN,
            "運転資金(3ヶ月分)": 60 * MAN,
        },
        adr=22_000, occupancy=0.85, operable_days=180, avg_stay=3.0,
        cleaning_fee=8_000,
        cleaning_cost=9_000,
        fixed_costs={
            "家賃(月15万円×12)": 180 * MAN,
            "水道光熱・通信(月3万円)": 36 * MAN,
            "保険・消防点検・PMS等": 15 * MAN,
            "修繕・備品更新": 15 * MAN,
        },
    ),
    Scenario(
        key="B",
        name="B: 中古戸建購入+フルリノベ × 旅館業(簡易宿所)(大阪・東京郊外 延床90㎡・定員8名)",
        initial_costs={
            "物件購入(築40年前後の木造戸建)": 1_800 * MAN,
            "購入諸費用(仲介・登記・取得税等 約7%)": 126 * MAN,
            "リノベ: 水回り(浴室・トイレ2・キッチン・洗面)": 280 * MAN,
            "リノベ: 内装(床・壁・天井・建具)": 170 * MAN,
            "リノベ: 電気・給排水・断熱・耐震補強": 150 * MAN,
            "リノベ: 和モダン演出(障子・畳コーナー・照明)": 80 * MAN,
            "消防設備(自動火災報知・誘導灯・非常用照明)": 90 * MAN,
            "旅館業許可申請(行政書士・設計図書)": 40 * MAN,
            "家具・家電・寝具・備品(8名分)": 200 * MAN,
            "撮影・多言語リスティング・スマートロック・Wi-Fi": 25 * MAN,
            "運転資金(6ヶ月分)": 120 * MAN,
        },
        adr=32_000, occupancy=0.70, operable_days=365, avg_stay=3.5,
        cleaning_fee=12_000,
        cleaning_cost=15_000, consumables_per_stay=2_500,
        fixed_costs={
            "水道光熱・通信(月5万円)": 60 * MAN,
            "固定資産税・都市計画税": 15 * MAN,
            "保険(火災・施設賠償)": 12 * MAN,
            "消防点検・PMS・価格調整ツール": 18 * MAN,
            "修繕・備品更新積立": 40 * MAN,
        },
        loan_amount=2_000 * MAN, loan_rate=0.025, loan_years=15,
        exit_value=1_800 * MAN,
    ),
    Scenario(
        key="C",
        name="C: 中古戸建購入+リノベ × 民泊新法180日+マンスリー賃貸(旅館業が取れない住居専用地域)",
        initial_costs={
            "物件購入(築40年前後の木造戸建)": 1_800 * MAN,
            "購入諸費用(約7%)": 126 * MAN,
            "リノベ一式(Bと同等から演出を削減)": 600 * MAN,
            "消防設備(家主不在型)": 60 * MAN,
            "届出代行(行政書士)": 20 * MAN,
            "家具・家電・寝具・備品": 200 * MAN,
            "撮影・リスティング・スマートロック・Wi-Fi": 25 * MAN,
            "運転資金(6ヶ月分)": 100 * MAN,
        },
        adr=32_000, occupancy=0.85, operable_days=180, avg_stay=3.5,
        cleaning_fee=12_000,
        cleaning_cost=15_000, consumables_per_stay=2_500,
        # 残り約185日のうち約5ヶ月をマンスリー(月25万円・代行手数料控除後)で運用
        other_income=int(25 * MAN * 5 * 0.85),
        fixed_costs={
            "水道光熱・通信(月5万円)": 60 * MAN,
            "固定資産税・都市計画税": 15 * MAN,
            "保険(火災・施設賠償)": 12 * MAN,
            "消防点検・PMS等": 12 * MAN,
            "修繕・備品更新積立": 40 * MAN,
        },
        loan_amount=2_000 * MAN, loan_rate=0.025, loan_years=15,
        exit_value=1_800 * MAN,
    ),
]


def report(s: Scenario):
    r = calc(s)
    out = [f"## {s.name}", ""]

    out += ["### 初期費用", "", "| 項目 | 金額 |", "|---|---:|"]
    for k, v in s.initial_costs.items():
        out.append(f"| {k} | {yen(v)} |")
    out.append(f"| **合計** | **{yen(r['initial'])}** |")
    if s.loan_amount:
        out.append(f"| うち融資({s.loan_rate:.1%}・{s.loan_years}年) | {yen(s.loan_amount)} |")
        out.append(f"| うち自己資金 | {yen(r['equity'])} |")
    out.append("")

    out += [
        "### 年間収支(標準ケース)", "",
        f"前提: 客単価 {s.adr:,}円/泊・稼働率 {s.occupancy:.0%}・営業可能 {s.operable_days}日"
        f"・平均 {s.avg_stay}泊/組・清掃料 {s.cleaning_fee:,}円/組", "",
        "| 項目 | 年額 |", "|---|---:|",
        f"| 販売泊数 | {r['nights']:.0f}泊({r['stays']:.0f}組) |",
        f"| 宿泊売上 | {yen(r['room_rev'])} |",
        f"| 清掃料売上 | {yen(r['cleaning_rev'])} |",
    ]
    if s.other_income:
        out.append(f"| その他収入(マンスリー等) | {yen(s.other_income)} |")
    out += [
        f"| **売上合計** | **{yen(r['gross'] + s.other_income)}** |",
        f"| Airbnb手数料({s.platform_fee_rate:.1%}) | ▲{yen(r['platform'])} |",
        f"| 運営代行({s.agency_rate:.0%}) | ▲{yen(r['agency'])} |",
        f"| 清掃・リネン外注 | ▲{yen(r['cleaning'])} |",
        f"| アメニティ・消耗品 | ▲{yen(r['consumables'])} |",
    ]
    for k, v in s.fixed_costs.items():
        out.append(f"| {k} | ▲{yen(v)} |")
    out.append(f"| **営業CF(税・返済前)** | **{yen(r['noi'])}** |")
    if s.loan_amount:
        out.append(f"| 借入返済(元利) | ▲{yen(r['debt'])} |")
        out.append(f"| **手残りCF(税引前)** | **{yen(r['cf'])}** |")
    out.append("")

    out += ["### 投資回収", "", "| 指標 | 値 |", "|---|---:|",
            f"| 表面利回り(営業CF÷総投資) | {r['yield_']:.1%} |",
            f"| 総投資の回収期間(総投資÷営業CF) | {years(r['payback_total'])} |"]
    if s.loan_amount:
        out.append(f"| 自己資金の回収期間(自己資金÷手残りCF) | {years(r['payback_equity'])} |")
    if s.exit_value:
        # 10年後に売却した場合の累計損益(簡易: 返済は元本残高を考慮)
        bal = loan_balance(s.loan_amount, s.loan_rate, s.loan_years, 10)
        total = r["cf"] * 10 + s.exit_value - bal - r["equity"]
        out.append(f"| 10年運営後に{yen(s.exit_value)}で売却した場合の累計損益 | {yen(total)} |")
    out.append("")

    out += sensitivity(s)
    return "\n".join(out)


def loan_balance(principal, rate, years_, after_years):
    if principal == 0:
        return 0
    r = rate / 12
    n = years_ * 12
    k = after_years * 12
    pmt = principal * r / (1 - (1 + r) ** -n)
    return principal * (1 + r) ** k - pmt * ((1 + r) ** k - 1) / r


def sensitivity(s: Scenario):
    adrs = [int(s.adr * m) for m in (0.8, 0.9, 1.0, 1.1, 1.2)]
    occs = [round(s.occupancy + d, 2) for d in (-0.2, -0.1, 0, 0.1)]
    occs = [o for o in occs if 0 < o <= 1]
    metric = "payback_equity" if s.loan_amount else "payback_total"
    label = "自己資金" if s.loan_amount else "総投資"
    out = [f"### 感応度: {label}の回収年数(客単価 × 稼働率)", "",
           "| 稼働率 \\ 客単価 | " + " | ".join(f"{a:,}円" for a in adrs) + " |",
           "|---|" + "---:|" * len(adrs)]
    for o in occs:
        row = [years(calc(s, adr=a, occupancy=o)[metric]) for a in adrs]
        out.append(f"| {o:.0%} | " + " | ".join(row) + " |")
    out.append("")
    return out


def main():
    keys = set(a.upper() for a in sys.argv[1:])
    for s in SCENARIOS:
        if not keys or s.key in keys:
            print(report(s))


if __name__ == "__main__":
    main()
