#!/usr/bin/env python3
"""レンタルスペース事業 収支シミュレーション(ai-analyst)

入力の出典: docs/rental-space/strategy/concept.md 第2・3章、research/market-report.md 第5章
実行: python3 docs/rental-space/analytics/simulate.py
出力(同フォルダ, UTF-8 BOM付きCSV):
  pl-monthly.csv      開業後24ヶ月の月次収支(ベースケース)
  sensitivity.csv     稼働率 x 平均単価 x 家賃 の感度分析
  target-check.csv    concept.md 目標値の検算
  levers.csv          レバー別の月利益インパクト(12ヶ月目の定常状態基準)
すべて税抜・円。減価償却・所得税・消費税の納税は含めない(キャッシュベースの営業損益)。
"""
import csv
import math
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ---- 前提(concept.md 3-1 / market-report.md 5-2) ----
HOURS_PER_MONTH = 450          # 8-23時 15h x 30日
COMMISSION = 0.30              # ポータル手数料(スペースマーケット30%。インスタベースは35%)
CLEANING_PER_BOOKING = 2000    # 清掃外注 1回
HOURS_PER_BOOKING = 4.7        # 1予約あたり平均利用時間(新宿/渋谷ポータル平均)
INITIAL_INVESTMENT = 2_500_000 # 初期投資(運転資金を除く)
WORKING_CAPITAL = 1_500_000    # 運転資金
CASH_ALERT = 480_000           # 資金ライン(固定費3ヶ月分)
RENT = 120_000
FIXED_OTHER = {                # 家賃以外の固定費(計40,000円)
    "utilities": 15_000, "internet": 5_000, "tools": 5_000,
    "supplies": 10_000, "insurance": 3_000, "misc": 2_000,
}

# ---- 時間帯(1ヶ月30日 = 平日21日 + 土日祝9日 と仮定) ----
# (名前, 月の枠時間, 実効単価, 全体稼働率に対する倍率)
# 実効単価はパック利用を織り込んだ値:
#   平日昼 定価1,500(撮影半日パック1,700/h・商用+1,000と相殺して1,500据え置き)
#   平日夜 定価2,500と上映会パック8,800/4h=2,200の混在 -> 2,300
#   土日祝 定価3,000-3,500と5hパック14,800=2,960/h、3hパック9,800=3,267/h -> 3,000
# 倍率は「6ヶ月目(全体30%)で平日昼15%」(concept 3-2 補助KPI)と
# 「休日は平日夜の約1.6倍埋まる」という仮定から置いた(実績で要更新)。
BANDS = [
    ("weekday_day",   21 * 9, 1500, 0.50),
    ("weekday_night", 21 * 6, 2300, 1.04),
    ("holiday",        9 * 15, 3000, 1.66),
]
assert sum(b[1] for b in BANDS) == HOURS_PER_MONTH

# ---- 稼働率ランプ(concept 3-2: 3ヶ月20%・6ヶ月30%・12ヶ月45%) ----
def occupancy(m):
    pts = {1: 0.10, 3: 0.20, 6: 0.30, 12: 0.45}
    if m >= 12:
        return 0.45            # 13ヶ月目以降は45%で横ばい(上振れは見込まない)
    if m in pts:
        return pts[m]
    keys = sorted(pts)
    for a, b in zip(keys, keys[1:]):
        if a < m < b:
            return pts[a] + (pts[b] - pts[a]) * (m - a) / (b - a)

def discount(m):
    return 0.25 if m == 1 else 0.0   # オープニング価格(20-30%引き)を1ヶ月

PHASE = lambda m: "P3立ち上げ" if m <= 3 else ("P4最適化" if m <= 6 else ("P5安定化" if m <= 12 else "2年目"))

def write_csv(name, header, rows):
    with open(os.path.join(OUT, name), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)

def month_pl(occ, price_by_band=None, disc=0.0, rent=RENT, commission=COMMISSION,
             clean=CLEANING_PER_BOOKING, hpb=HOURS_PER_BOOKING):
    hours = {}
    sales = 0.0
    for name, cap, price, mult in BANDS:
        h = cap * min(occ * mult, 0.95)
        hours[name] = h
        p = (price_by_band or {}).get(name, price)
        sales += h * p * (1 - disc)
    total_h = sum(hours.values())
    bookings = total_h / hpb
    fee = sales * commission
    cleaning = bookings * clean
    fixed = rent + sum(FIXED_OTHER.values())
    profit = sales - fee - cleaning - fixed
    return dict(hours=hours, total_h=total_h, bookings=bookings, sales=sales,
                fee=fee, cleaning=cleaning, fixed=fixed, profit=profit)

# ================= 1. pl-monthly.csv =================
def build_pl():
    rows, cum, payback = [], 0.0, None
    min_cash = (None, 10**12)
    for m in range(1, 25):
        occ = occupancy(m)
        r = month_pl(occ, disc=discount(m))
        cum += r["profit"]
        cash = WORKING_CAPITAL + cum
        if cash < min_cash[1]:
            min_cash = (m, cash)
        recovered = cum - INITIAL_INVESTMENT
        if payback is None and recovered >= 0:
            payback = m
        avg_price = r["sales"] / r["total_h"]
        rows.append([
            m, PHASE(m), f"{occ:.1%}", round(r["total_h"], 1),
            round(r["hours"]["weekday_day"], 1), round(r["hours"]["weekday_night"], 1),
            round(r["hours"]["holiday"], 1), round(r["bookings"], 1),
            f"{discount(m):.0%}", round(avg_price), round(r["sales"]), round(-r["fee"]),
            round(r["sales"] - r["fee"]), round(-r["cleaning"]), -RENT,
            -sum(FIXED_OTHER.values()), round(r["profit"]), round(cum),
            round(cash), round(recovered), "yes" if cash < CASH_ALERT else "",
        ])
    header = ["月(開業後)", "フェーズ", "稼働率", "予約時間h", "うち平日昼h", "うち平日夜h",
              "うち土日祝h", "予約件数", "割引率", "実効平均単価", "売上", "ポータル手数料",
              "手取り売上", "清掃費", "家賃", "その他固定費", "営業損益", "累積営業損益",
              "運転資金残高", "初期投資回収残(累積損益-250万)", "資金ライン割れ"]
    write_csv("pl-monthly.csv", header, rows)
    return rows, payback, min_cash

# ================= 2. sensitivity.csv =================
def contribution_per_hour(price, commission=COMMISSION):
    return price * (1 - commission) - CLEANING_PER_BOOKING / HOURS_PER_BOOKING

def build_sensitivity():
    rows = []
    for rent_man in range(8, 16):
        rent = rent_man * 10_000
        fixed = rent + sum(FIXED_OTHER.values())
        # 物件取得費は家賃に比例すると仮定(concept: 家賃12万で110万 = 約9.2ヶ月分)
        inv_linked = INITIAL_INVESTMENT - 1_100_000 + round(rent * 110 / 12)
        for price in range(1500, 3501, 250):
            cph = contribution_per_hour(price)
            be_h = fixed / cph if cph > 0 else float("inf")
            for occ_pct in range(10, 61, 5):
                h = HOURS_PER_MONTH * occ_pct / 100
                profit = h * cph - fixed
                pb = math.ceil(INITIAL_INVESTMENT / profit) if profit > 0 else "回収不可"
                pb2 = math.ceil(inv_linked / profit) if profit > 0 else "回収不可"
                rows.append([rent_man, price, occ_pct, round(h, 1), round(h * price),
                             round(profit), pb, inv_linked, pb2,
                             f"{be_h / HOURS_PER_MONTH:.1%}" if cph > 0 else "到達不可"])
    header = ["家賃(万円/月)", "平均単価(円/h)", "稼働率(%)", "月予約時間h", "月売上",
              "月営業利益", "投資回収月数(初期投資250万固定)", "初期投資(取得費を家賃連動)",
              "投資回収月数(家賃連動投資)", "損益分岐稼働率"]
    write_csv("sensitivity.csv", header, rows)
    return rows

# ================= 3. target-check.csv =================
def concept_formula(occ, price, rent=RENT):
    h = HOURS_PER_MONTH * occ
    sales = h * price
    profit = sales * 0.7 - (h / HOURS_PER_BOOKING) * CLEANING_PER_BOOKING - (rent + 40_000)
    return h, sales, profit

def build_target_check():
    targets = [  # 時点, 稼働率, 単価, concept記載の売上, concept記載の損益
        ("3ヶ月", 0.20, 2200, 200_000, -40_000),
        ("6ヶ月", 0.30, 2400, 320_000, 5_000),
        ("12ヶ月(目標)", 0.45, 2500, 500_000, 100_000),
        ("12ヶ月(合格)", 0.40, 2500, 450_000, 80_000),
    ]
    rows = []
    for label, occ, price, c_sales, c_profit in targets:
        h, sales, profit = concept_formula(occ, price)
        rows.append([label, f"{occ:.0%}", price, round(h, 1), round(sales), c_sales,
                     round(profit), c_profit, round(profit - c_profit),
                     "要修正" if abs(profit - c_profit) > 15_000 else "概ね一致"])
    header = ["時点", "稼働率", "単価", "予約時間h", "売上(検算)", "売上(concept)",
              "営業損益(検算)", "営業損益(concept)", "差", "判定"]
    write_csv("target-check.csv", header, rows)
    return rows

# ================= 4. levers.csv =================
def build_levers():
    base = month_pl(0.45)
    b = base["profit"]
    def band_prices(mult):
        return {n: p * mult for n, _, p, _ in BANDS}
    cases = [
        ("稼働率 +5pt (45->50%)", month_pl(0.50)["profit"]),
        ("平均単価 +10% (値上げ、稼働率不変)", month_pl(0.45, band_prices(1.10))["profit"]),
        ("土日祝のみ +300円/h", month_pl(0.45, {"holiday": 3300})["profit"]),
        ("家賃 -1万円", month_pl(0.45, rent=RENT - 10_000)["profit"]),
        ("手数料 30%->25% (直接予約・カシカシ比率UP)", month_pl(0.45, commission=0.25)["profit"]),
        ("手数料 30%->35% (インスタベース中心)", month_pl(0.45, commission=0.35)["profit"]),
        ("清掃費 2,000->1,500円/回", month_pl(0.45, clean=1500)["profit"]),
        ("1予約の平均時間 4.7h->3.0h (短時間予約が増える)", month_pl(0.45, hpb=3.0)["profit"]),
        ("手数料の消費税が控除できない(実質33%)", month_pl(0.45, commission=0.33)["profit"]),
    ]
    rows = [["ベース(12ヶ月目: 稼働率45%・帯別単価・家賃12万)", round(b), 0]]
    rows += [[n, round(p), round(p - b)] for n, p in cases]
    write_csv("levers.csv", ["ケース", "月営業利益", "ベースとの差"], rows)
    return rows

if __name__ == "__main__":
    pl, payback, min_cash = build_pl()
    sens = build_sensitivity()
    tc = build_target_check()
    lv = build_levers()
    print("== PL ==")
    for r in pl:
        print(r[0], r[2], "avgP", r[9], "sales", r[10], "profit", r[16], "cum", r[17], "cash", r[18])
    print("payback month (cum profit >= 2.5M):", payback)
    print("min cash:", min_cash)
    print("24m cum profit:", pl[-1][17], "remaining to recover:", pl[-1][19])
    print("== target check ==")
    for r in tc:
        print(r)
    print("== levers ==")
    for r in lv:
        print(r)
    print("base avg price at 45%:", round(month_pl(0.45)["sales"] / month_pl(0.45)["total_h"]))
    for price in (1250, 1500, 2400, 2478, 2500):
        cph = contribution_per_hour(price)
        print("BE occ @", price, f"{160000 / cph / 450:.1%}", "2y-payback occ",
              f"{(160000 + INITIAL_INVESTMENT / 24) / cph / 450:.1%}")
    print("sensitivity rows:", len(sens))
    print("== payback by plateau scenario (ramp as base until m6, then linear to plateau at m12) ==")
    for plateau in (0.30, 0.35, 0.40, 0.45, 0.50):
        cum, pb, low = 0.0, None, 0.0
        for m in range(1, 121):
            if m <= 6:
                occ = occupancy(m)
            elif m < 12:
                occ = 0.30 + (plateau - 0.30) * (m - 6) / 6
            else:
                occ = plateau
            cum += month_pl(occ, disc=discount(m))["profit"]
            low = min(low, cum)
            if pb is None and cum >= INITIAL_INVESTMENT:
                pb = m
        print(f"plateau {plateau:.0%}: payback month {pb}, max cum loss {round(low)}")
