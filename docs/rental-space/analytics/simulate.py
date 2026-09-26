#!/usr/bin/env python3
"""レンタルスペース事業 収支シミュレーション(ai-analyst / concept.md 第3版対応)

入力の出典: docs/rental-space/strategy/concept.md 第3版(1-3・2-1・2-4・第3章・第4章)
実行: python3 docs/rental-space/analytics/simulate.py
出力(同フォルダ, UTF-8 BOM付きCSV。Excelでそのまま開ける):
  pl-monthly.csv      3シナリオ(目標/単価2,500円/立ち上げ遅れ)の開業後24ヶ月の月次収支
  target-check.csv    concept 第3版の手計算(3-2の月次表・3-3のシナリオ・影響表・損益分岐)の検算
  payback-grid.csv    12ヶ月回収に必要な条件の組み合わせ(家賃 x 12ヶ月目稼働率 x 平均単価)
  sensitivity.csv     定常月(ランプなし)の感度分析(家賃 x 単価 x 稼働率)
  band-mix.csv        時間帯4区分(早朝/平日昼/平日夜/土日祝)で平均2,700円になる埋まり方の確認
  levers.csv          12ヶ月累積利益へのレバー別影響(目標シナリオ基準)
すべて税抜・円。減価償却・所得税・消費税の納税・季節変動・直接予約は含めない
(キャッシュベースの営業損益)。開業前の空家賃は初期投資110万円の予備費に含む(concept 3-1)。
"""
import csv
import math
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ---- 前提(concept 第3版 3-1) ----
HOURS_PER_MONTH = 510            # 6-23時 17h x 30日
COMMISSION = 0.30
CLEANING = 1500                  # 清掃外注 1回
HOURS_PER_BOOKING = 4.0          # 1予約あたり平均(U-18)
INITIAL_INVESTMENT = 1_100_000   # 運転資金を除く
ACQUISITION = 450_000            # うち物件取得費(家賃7万円のとき)
WORKING_CAPITAL = 700_000
CASH_ALERT = 350_000             # 資金ライン(固定費3ヶ月分)
RENT = 70_000
FIXED_OTHER = {                  # 家賃以外(計45,000円)
    "utilities": 15_000, "internet": 5_000, "tools": 5_000, "supplies": 10_000,
    "insurance": 3_000, "waste": 5_000, "misc": 2_000,
}
FIXED_OTHER_SUM = sum(FIXED_OTHER.values())
OPENING_DISCOUNT = 0.25          # 1ヶ月目のみ(concept 2-2)

# ---- 時間帯4区分(1ヶ月30日 = 平日21日 + 土日祝9日 と仮定。concept 1-3) ----
# (キー, 表示名, 月の枠時間, 実効単価の仮定)
#   早朝   定価1,200円/h、3hパック3,000円=1,000円/h -> 1,000
#   平日昼 定価1,500円/h、4hパック5,800円=1,450円/h -> 1,450
#   平日夜 定価2,600円/h、晩酌3h 7,800円=2,600、上映会4h 9,800円=2,450 -> 2,550
#   土日祝 定価3,500円/h、5h 15,800円=3,160、晩酌4h 12,800円=3,200 -> 3,350(concept「3,300〜3,400」)
BANDS = [
    ("early",   "早朝6-9時",     30 * 3, 1000),
    ("day",     "平日昼9-17時",  21 * 8, 1450),
    ("night",   "平日夜17-23時", 21 * 6, 2550),
    ("holiday", "土日祝9-23時",   9 * 14, 3350),
]
assert sum(b[2] for b in BANDS) == HOURS_PER_MONTH


def fixed_cost(rent=RENT):
    return rent + FIXED_OTHER_SUM


def investment_for_rent(rent):
    """物件取得費は家賃に比例(7万円で45万円 = 約6.4ヶ月分)と仮定。それ以外の65万円は固定。"""
    return INITIAL_INVESTMENT - ACQUISITION + round(ACQUISITION * rent / RENT)


def ramp(points, plateau_after=12):
    """points: {月: 稼働率}。間は直線、最終点以降は横ばい。"""
    keys = sorted(points)
    def f(m):
        if m >= keys[-1]:
            return points[keys[-1]]
        if m in points:
            return points[m]
        for a, b in zip(keys, keys[1:]):
            if a < m < b:
                return points[a] + (points[b] - points[a]) * (m - a) / (b - a)
    return f


# ---- シナリオ(concept 3-3) ----
# 「立ち上げ遅れ」の1ヶ月目は concept に記載がないため 8% と仮定(目標の10%/20%と同じ比率)。
# 10%と置くと回収は20ヶ月目、8%だと21ヶ月目(20ヶ月目の累積は110万円に約0.5万円届かない)。
SCENARIOS = {
    "目標": dict(price=2700, clean=1500, occ=ramp({1: 0.10, 3: 0.20, 6: 0.30, 12: 0.40})),
    "単価2500": dict(price=2500, clean=1500, occ=ramp({1: 0.10, 3: 0.20, 6: 0.30, 12: 0.40})),
    "立ち上げ遅れ": dict(price=2400, clean=2000, occ=ramp({1: 0.08, 3: 0.16, 6: 0.25, 12: 0.35})),
}


def month_pl(occ, price, clean=CLEANING, rent=RENT, disc=0.0, commission=COMMISSION,
             hpb=HOURS_PER_BOOKING):
    """concept 3-1 の式: 予約時間 x (単価 x (1-割引) x 0.7 - 清掃/4h) - 固定費"""
    h = HOURS_PER_MONTH * occ
    sales = h * price * (1 - disc)
    fee = sales * commission
    cleaning = h / hpb * clean
    fixed = fixed_cost(rent)
    return dict(h=h, sales=sales, fee=fee, cleaning=cleaning, fixed=fixed,
                profit=sales - fee - cleaning - fixed, bookings=h / hpb)


def run(price, clean, occ_fn, rent=RENT, inv=INITIAL_INVESTMENT, months=60,
        commission=COMMISSION, hpb=HOURS_PER_BOOKING):
    cum, pb, rows = 0.0, None, []
    for m in range(1, months + 1):
        disc = OPENING_DISCOUNT if m == 1 else 0.0
        r = month_pl(occ_fn(m), price, clean, rent, disc, commission, hpb)
        cum += r["profit"]
        if pb is None and cum >= inv:
            pb = m
        rows.append((m, occ_fn(m), disc, r, cum))
    return rows, pb


def write_csv(name, header, rows):
    with open(os.path.join(OUT, name), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


PHASE = lambda m: "P3立ち上げ" if m <= 3 else ("P4最適化" if m <= 6 else ("P5安定化" if m <= 12 else "2年目"))


# ================= 1. pl-monthly.csv =================
def build_pl():
    out, summary = [], {}
    for name, s in SCENARIOS.items():
        rows, pb = run(s["price"], s["clean"], s["occ"], months=60)
        min_cash = min(WORKING_CAPITAL + min(0, c) for *_, c in rows)
        summary[name] = dict(payback=pb, cum12=rows[11][4], cum24=rows[23][4],
                             m12=rows[11][3]["profit"], min_cash=min_cash,
                             bottom=min((c, m) for m, _, _, _, c in rows))
        for m, occ, disc, r, cum in rows[:24]:
            cash = WORKING_CAPITAL + cum
            out.append([name, m, PHASE(m), f"{occ:.1%}", round(r["h"], 1), round(r["bookings"], 1),
                        f"{disc:.0%}", s["price"], round(r["sales"]), round(-r["fee"]),
                        round(r["sales"] - r["fee"]), round(-r["cleaning"]), -RENT, -FIXED_OTHER_SUM,
                        round(r["profit"]), round(cum), round(cum - INITIAL_INVESTMENT),
                        "回収" if pb == m else "", round(cash),
                        "yes" if cash < CASH_ALERT else ""])
    header = ["シナリオ", "月(開業後)", "フェーズ", "稼働率(510h分母)", "予約時間h", "予約件数(4h/件)",
              "割引率", "平均単価(定価ベース)", "売上", "ポータル手数料", "手取り売上", "清掃費",
              "家賃", "その他固定費", "営業損益", "累積営業損益", "回収残(累積-110万)", "回収月",
              "運転資金残高(70万+累積)", "資金ライン35万割れ"]
    write_csv("pl-monthly.csv", header, out)
    return summary


# ================= 2. target-check.csv =================
def build_target_check(summary):
    rows_t, _ = run(2700, 1500, SCENARIOS["目標"]["occ"], months=12)
    ceo_month = {1: (-62_000, -62_000), 3: (40_000, -21_000), 6: (117_000, 252_000),
                 9: (155_000, 679_000), 11: (181_000, 1_029_000), 12: (194_000, 1_223_000)}
    out = []
    for m, (c_p, c_cum) in ceo_month.items():
        _, occ, _, r, cum = rows_t[m - 1]
        for label, calc, ceo in (("月の営業損益", r["profit"], c_p), ("累積", cum, c_cum)):
            diff = calc - ceo
            out.append([f"3-2 月次表 {m}ヶ月目 {label}", f"{occ:.1%}", round(calc), ceo, round(diff),
                        "一致" if abs(diff) <= 5_000 else "要修正"])
    out.append(["3-2 12ヶ月目の売上", "40.0%", round(rows_t[11][3]["sales"]), 550_000,
                round(rows_t[11][3]["sales"] - 550_000), "一致"])
    ceo_sc = {"目標": (1_220_000, 12), "単価2500": (980_000, 13), "立ち上げ遅れ": (330_000, 20)}
    for name, (c_cum, c_pb) in ceo_sc.items():
        s = summary[name]
        d = s["cum12"] - c_cum
        out.append([f"3-3 {name} 12ヶ月累積", "", round(s["cum12"]), c_cum, round(d),
                    "一致" if abs(d) <= 10_000 else "要修正"])
        out.append([f"3-3 {name} 回収月", "", s["payback"], c_pb, s["payback"] - c_pb,
                    "一致" if s["payback"] == c_pb else ("概ね一致(前後)" if abs(s["payback"] - c_pb) <= 1 else "要修正")])
    # 影響表(12ヶ月累積、目標シナリオ基準)
    base = summary["目標"]["cum12"]
    tgt = SCENARIOS["目標"]["occ"]
    def cum12(**kw):
        rows, pb = run(kw.get("price", 2700), kw.get("clean", 1500), kw.get("occ", tgt),
                       rent=kw.get("rent", RENT), inv=kw.get("inv", INITIAL_INVESTMENT), months=60)
        return rows[11][4], pb
    impacts = [
        ("3-3 影響 稼働率-5pt(毎月)", cum12(occ=lambda m: tgt(m) - 0.05), -460_000),
        ("3-3 影響 単価-200円", cum12(price=2500), -240_000),
        ("3-3 影響 清掃+500円", cum12(clean=2000), -220_000),
        ("3-3 影響 家賃+1万円", cum12(rent=80_000, inv=investment_for_rent(80_000)), -120_000),
    ]
    for label, (c, pb), ceo in impacts:
        d = (c - base) - ceo
        out.append([label + f"(回収{pb}ヶ月目)", "", round(c - base), ceo, round(d),
                    "一致" if abs(d) <= 10_000 else "要修正"])
    for price in (2700, 2500, 2400):
        be = fixed_cost() / (price * 0.7 - CLEANING / HOURS_PER_BOOKING)
        out.append([f"損益分岐 単価{price}円(清掃1,500円)", f"{be / HOURS_PER_MONTH:.1%}", round(be, 1),
                    "76h/15%" if price == 2700 else "", "", "一致" if price == 2700 else "参考"])
    header = ["項目", "稼働率", "検算値", "concept第3版(手計算)", "差", "判定"]
    write_csv("target-check.csv", header, out)
    return out


# ================= 3. payback-grid.csv =================
BASE_RAMP = {1: 0.10, 3: 0.20, 6: 0.30, 12: 0.40}


def scaled_ramp(occ12):
    k = occ12 / 0.40
    return ramp({m: v * k for m, v in BASE_RAMP.items()})


def build_payback_grid():
    out = []
    for rent_man in (5, 6, 7, 8, 9):
        rent = rent_man * 10_000
        inv = investment_for_rent(rent)
        for occ12 in (0.30, 0.35, 0.40, 0.45, 0.50):
            for price in range(2200, 3101, 100):
                for clean in (1500, 2000):
                    rows, pb = run(price, clean, scaled_ramp(occ12), rent=rent, inv=inv, months=120)
                    out.append([rent_man, round(inv), f"{occ12:.0%}", price, clean,
                                round(rows[11][4]), pb if pb else "120ヶ月超",
                                "OK" if pb and pb <= 12 else ""])
    header = ["家賃(万円)", "初期投資(取得費を家賃連動)", "12ヶ月目稼働率(ランプは目標と同じ形で比例)",
              "平均単価", "清掃(円/回)", "12ヶ月累積営業損益", "回収月", "12ヶ月以内に回収"]
    write_csv("payback-grid.csv", header, out)
    return out


def min_price_12m(rent_man, occ12, clean=1500):
    rent = rent_man * 10_000
    inv = investment_for_rent(rent)
    for price in range(2000, 4001, 10):
        _, pb = run(price, clean, scaled_ramp(occ12), rent=rent, inv=inv, months=12)
        if pb:
            return price
    return None


# ================= 4. sensitivity.csv =================
def build_sensitivity():
    out = []
    for rent_man in range(5, 11):
        rent = rent_man * 10_000
        inv = investment_for_rent(rent)
        for price in range(1500, 3501, 250):
            cph = price * 0.7 - CLEANING / HOURS_PER_BOOKING
            be = fixed_cost(rent) / cph
            for occ_pct in range(10, 61, 5):
                h = HOURS_PER_MONTH * occ_pct / 100
                profit = h * cph - fixed_cost(rent)
                pb = math.ceil(inv / profit) if profit > 0 else "回収不可"
                out.append([rent_man, price, occ_pct, round(h, 1), round(h * price), round(profit),
                            inv, pb, f"{be / HOURS_PER_MONTH:.1%}"])
    header = ["家賃(万円/月)", "平均単価(円/h)", "稼働率(%)", "月予約時間h", "月売上", "月営業利益",
              "初期投資(取得費を家賃連動)", "回収月数(初月からこの状態の単純計算)", "損益分岐稼働率"]
    write_csv("sensitivity.csv", header, out)
    return out


# ================= 5. band-mix.csv =================
# 12ヶ月目(全体40%=204h)に平均2,700円になる時間帯別の埋まり方(仮定)と、平日昼が多い場合の比較
MIXES = {
    "目標ミックス(平均約2,700円)": {"early": 0.10, "day": 0.186, "night": 0.55, "holiday": 0.75},
    "平日昼が多いミックス": {"early": 0.10, "day": 0.35, "night": 0.45, "holiday": 0.55},
    "土日祝頼み(平日夜が弱い)": {"early": 0.05, "day": 0.25, "night": 0.40, "holiday": 0.85},
}


def build_band_mix():
    out = []
    for name, occ in MIXES.items():
        tot_h = tot_s = 0.0
        for key, label, cap, price in BANDS:
            h = cap * occ[key]
            tot_h += h
            tot_s += h * price
            out.append([name, label, cap, price, f"{occ[key]:.1%}", round(h, 1), round(h * price)])
        out.append([name, "合計", HOURS_PER_MONTH, round(tot_s / tot_h), f"{tot_h / HOURS_PER_MONTH:.1%}",
                    round(tot_h, 1), round(tot_s)])
    header = ["ミックス", "時間帯", "月の枠h", "実効単価(仮定)", "時間帯稼働率", "予約時間h", "売上"]
    write_csv("band-mix.csv", header, out)
    return out


# ================= 6. levers.csv =================
def build_levers(summary):
    base = summary["目標"]["cum12"]
    tgt = SCENARIOS["目標"]["occ"]
    def case(price=2700, clean=1500, occ=tgt, rent=RENT, inv=INITIAL_INVESTMENT, commission=COMMISSION,
             hpb=HOURS_PER_BOOKING):
        rows, pb = run(price, clean, occ, rent=rent, inv=inv, months=60, commission=commission, hpb=hpb)
        return rows[11][4], pb
    cases = [
        ("稼働率 毎月-5pt", case(occ=lambda m: tgt(m) - 0.05)),
        ("稼働率 毎月+5pt", case(occ=lambda m: tgt(m) + 0.05)),
        ("立ち上げが2ヶ月遅れる(ランプを2ヶ月後ろへ)", case(occ=lambda m: tgt(max(1, m - 2)))),
        ("平均単価 -200円(2,500円)", case(price=2500)),
        ("平均単価 +200円(2,900円)", case(price=2900)),
        ("清掃 +500円(2,000円)", case(clean=2000)),
        ("家賃 +1万円(取得費も連動)", case(rent=80_000, inv=investment_for_rent(80_000))),
        ("家賃 -1万円(取得費も連動)", case(rent=60_000, inv=investment_for_rent(60_000))),
        ("手数料 30%->33%(手数料の消費税を控除できない)", case(commission=0.33)),
        ("手数料 30%->35%(インスタベース中心)", case(commission=0.35)),
        ("1予約 4h->3h", case(hpb=3.0)),
        ("初期投資 110万->100万", case(inv=1_000_000)),
    ]
    rows = [["ベース(目標シナリオ)", round(base), 0, summary["目標"]["payback"]]]
    rows += [[n, round(c), round(c - base), pb] for n, (c, pb) in cases]
    write_csv("levers.csv", ["ケース", "12ヶ月累積営業損益", "ベースとの差", "回収月"], rows)
    return rows


if __name__ == "__main__":
    summary = build_pl()
    tc = build_target_check(summary)
    grid = build_payback_grid()
    sens = build_sensitivity()
    bm = build_band_mix()
    lv = build_levers(summary)
    print("== scenarios ==")
    for k, v in summary.items():
        print(k, {kk: (round(vv) if isinstance(vv, float) else vv) for kk, vv in v.items()})
    print("== target check ==")
    for r in tc:
        print(r)
    print("== levers ==")
    for r in lv:
        print(r)
    print("== band mix ==")
    for r in bm:
        print(r)
    print("== min avg price for payback within 12 months (clean 1,500) ==")
    for rent_man in (5, 6, 7, 8, 9):
        print(rent_man, [(f"{o:.0%}", min_price_12m(rent_man, o)) for o in (0.30, 0.35, 0.40, 0.45, 0.50)])
    print("== clean 2,000 ==")
    for rent_man in (6, 7, 8):
        print(rent_man, [(f"{o:.0%}", min_price_12m(rent_man, o, 2000)) for o in (0.35, 0.40, 0.45, 0.50)])
    print("slow scenario m1=10% sensitivity:",
          run(2400, 2000, ramp({1: 0.10, 3: 0.16, 6: 0.25, 12: 0.35}))[1])
    print("rows: grid", len(grid), "sens", len(sens))
