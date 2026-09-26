// 依存なしのテスト。実行: node tools/rental-space-simulator/test.mjs
// index.html の <script id="calc"> を取り出して評価し、concept.md 第3版の試算と照合する
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const m = html.match(/<script id="calc">([\s\S]*?)<\/script>/);
assert.ok(m, 'index.html に <script id="calc"> が見つからない');

const names = [
  "DEFAULTS", "THRESHOLDS", "slotCapacity", "monthlyResult", "averagePrice", "contributionPerHour",
  "occupancyForProfit", "breakEvenOccupancy", "occupancyForPayback", "occupancyAtMonth", "monthlyPath",
  "paybackMonth", "occupancyFor12MonthPayback", "paybackMonths", "scaleOccupancy", "cashLineMonth",
  "judge12Months", "paybackReview", "exitChecks",
];
const calc = new Function(`${m[1]}\nreturn { ${names.join(", ")} };`)();
const {
  DEFAULTS, slotCapacity, monthlyResult, breakEvenOccupancy, occupancyForPayback, occupancyAtMonth,
  monthlyPath, paybackMonth, occupancyFor12MonthPayback, paybackMonths, scaleOccupancy, cashLineMonth,
  judge12Months, paybackReview, exitChecks,
} = calc;

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`ok   ${name}`);
  } catch (e) {
    console.error(`FAIL ${name}\n     ${e.message}`);
    process.exitCode = 1;
  }
}
const near = (actual, expected, tol, msg) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${msg}: 期待 ${expected}±${tol}, 実際 ${actual}`);

// 全時間帯を同じ単価・同じ稼働率にした入力(concept.md の単一単価の試算と比べるため)
const flat = (price, occPct, extra = {}) => ({
  ...DEFAULTS,
  priceEarly: price, priceWeekdayDay: price, priceWeekdayNight: price, priceHoliday: price,
  occEarly: occPct, occWeekdayDay: occPct, occWeekdayNight: occPct, occHoliday: occPct,
  ...extra,
});
const cumAt = (p, month) => monthlyPath(p, month)[month - 1].cumulative;

// concept.md 第3版「3つのシナリオ」
const achieve = flat(2700, 40);                                                            // 達成
const basic = flat(2500, 40);                                                              // 基本(単価だけ2,500円)
const careful = flat(2400, 35, { cleaningCost: 2000, occM1: 10, occM3: 16, occM6: 25 });  // 慎重

test("営業時間の容量:6〜23時×30日=510時間、早朝90/平日昼168/平日夜126/土日祝126", () => {
  const c = slotCapacity(DEFAULTS);
  assert.equal(c.total, 510);
  assert.equal(c.early, 90);
  assert.equal(c.weekdayDay, 168);
  assert.equal(c.weekdayNight, 126);
  assert.equal(c.holiday, 126);
  assert.equal(c.early + c.weekdayDay + c.weekdayNight + c.holiday, c.total);
});

test("時刻が営業時間外・逆転していても容量は合計と一致する", () => {
  for (const q of [{ nightStartHour: 25 }, { earlyEndHour: 3 }, { earlyEndHour: 20, nightStartHour: 17 }]) {
    const c = slotCapacity({ ...DEFAULTS, ...q });
    assert.equal(c.early + c.weekdayDay + c.weekdayNight + c.holiday, c.total, JSON.stringify(q));
  }
});

test("初期値は第3版:家賃7万・固定費11.5万・初期投資110万・運転資金70万・清掃1,500円/4時間", () => {
  assert.equal(DEFAULTS.rent, 70000);
  assert.equal(DEFAULTS.rent + DEFAULTS.otherFixed, 115000);
  assert.equal(DEFAULTS.initialInvestment, 1100000);
  assert.equal(DEFAULTS.workingCapital, 700000);
  assert.equal(DEFAULTS.cleaningCost, 1500);
  assert.equal(DEFAULTS.avgHoursPerBooking, 4);
  assert.deepEqual(
    [DEFAULTS.priceEarly, DEFAULTS.priceWeekdayDay, DEFAULTS.priceWeekdayNight, DEFAULTS.priceHoliday],
    [1200, 1500, 2600, 3500],
  );
});

test("初期値の結果:全体約40%(12ヶ月目標)・平均単価約2,700円・12ヶ月で回収", () => {
  const r = monthlyResult(DEFAULTS);
  near(r.occupancy, 0.40, 0.005, "全体稼働率");
  near(r.avgPrice, 2700, 50, "平均単価");
  assert.equal(r.fixed, 115000);
  assert.equal(paybackMonth(DEFAULTS), 12);
  assert.equal(judge12Months(r.occupancy).label, "継続(目標達成)");
});

test("損益分岐:2,700円 → 月76時間・稼働率約15%", () => {
  const be = breakEvenOccupancy(achieve);
  near(be * 510, 75.9, 0.1, "損益分岐時間");
  near(be, 0.149, 0.001, "損益分岐稼働率");
  near(monthlyResult(flat(2700, be * 100)).profit, 0, 1e-6, "損益分岐での利益");
});

test("月の損益の式:予約時間 ×(単価 × 0.7 − 375円)− 11.5万円(12ヶ月目 40% → +19.4万円)", () => {
  const r = monthlyResult(achieve);
  near(r.hours, 204, 1e-9, "予約時間");
  near(r.profit, 204 * (2700 * 0.7 - 375) - 115000, 1e-6, "利益");
  near(r.revenue, 550800, 1e-6, "売上(約55万円)");
});

test("立ち上げの推移:1ヶ月10%→3ヶ月20%→6ヶ月30%→9ヶ月35%→11ヶ月約38%→12ヶ月40%(直線)", () => {
  const o = (k) => occupancyAtMonth(achieve, k, 0.40);
  near(o(1), 0.10, 1e-12, "1");
  near(o(2), 0.15, 1e-12, "2");
  near(o(3), 0.20, 1e-12, "3");
  near(o(6), 0.30, 1e-12, "6");
  near(o(9), 0.35, 1e-12, "9");
  near(o(11), 0.3833, 1e-4, "11");
  near(o(12), 0.40, 1e-12, "12");
  near(o(18), 0.40, 1e-12, "18");
});

test("達成シナリオの月ごとの表(concept.md 第3版)と一致する", () => {
  const path = monthlyPath(achieve, 12);
  const expect = { 1: [-6.2, -6.2], 3: [4.0, -2.1], 6: [11.7, 25.2], 9: [15.5, 67.9], 11: [18.1, 102.9], 12: [19.4, 122.3] };
  for (const [k, [profit, cum]] of Object.entries(expect)) {
    near(path[k - 1].profit / 10000, profit, 0.051, `${k}ヶ月目の損益(万円)`);
    near(path[k - 1].cumulative / 10000, cum, 0.051, `${k}ヶ月目の累積(万円)`);
  }
});

test("3つのシナリオ:達成=12ヶ月目、基本=13ヶ月目(累積約98万)、慎重=20ヶ月目前後(累積約33万)", () => {
  near(cumAt(achieve, 12), 1223000, 1000, "達成の12ヶ月累積");
  assert.equal(paybackMonth(achieve), 12);
  near(cumAt(basic, 12), 980000, 5000, "基本の12ヶ月累積");
  assert.equal(paybackMonth(basic), 13);
  near(cumAt(careful, 12), 330000, 20000, "慎重の12ヶ月累積");
  near(paybackMonth(careful), 20, 1, "慎重の回収月");
});

test("12ヶ月の累積に効く要素:稼働率−5pt 約−46万、単価−200円 約−24万、清掃+500円 約−22万、家賃+1万 約−12万", () => {
  const base = cumAt(achieve, 12);
  const minus5 = flat(2700, 35, { occM1: 5, occM3: 15, occM6: 25 });
  near(cumAt(minus5, 12) - base, -460000, 15000, "稼働率−5pt");
  near(cumAt(flat(2500, 40), 12) - base, -240000, 5000, "単価−200円");
  near(cumAt(flat(2700, 40, { cleaningCost: 2000 }), 12) - base, -220000, 5000, "清掃+500円");
  near(cumAt(flat(2700, 40, { rent: 80000 }), 12) - base, -120000, 1, "家賃+1万円");
});

test("初期投資の逆算:単価2,500円なら約95万円以下で12ヶ月回収、110万円では13ヶ月目", () => {
  assert.equal(paybackMonth({ ...basic, initialInvestment: 950000 }), 12);
  assert.equal(paybackMonth(basic), 13);
});

test("12ヶ月回収に必要な稼働率:その値で12ヶ月目の累積がちょうど初期投資になる", () => {
  for (const p of [achieve, basic, careful, DEFAULTS]) {
    const need = occupancyFor12MonthPayback(p);
    near(monthlyPath(p, 12, need)[11].cumulative, p.initialInvestment, 1e-6, "累積");
  }
  // 達成シナリオは 40% より低くても間に合う(余裕は約5ポイント)、基本シナリオは 40% では足りない
  near(occupancyFor12MonthPayback(achieve), 0.3545, 0.001, "達成");
  assert.ok(occupancyFor12MonthPayback(basic) > 0.40);
});

test("12ヶ月回収に必要な稼働率:貢献利益が0以下なら達成不能、初期投資0なら0", () => {
  assert.equal(occupancyFor12MonthPayback(flat(500, 40, { cleaningCost: 3000 })), Infinity);
  assert.equal(occupancyFor12MonthPayback({ ...achieve, initialInvestment: 0 }), 0);
  assert.equal(paybackMonth({ ...achieve, initialInvestment: 0 }), 0);
});

test("開業月から毎月同じ稼働率なら、12ヶ月回収に約27%(割引なし)", () => {
  near(occupancyForPayback(achieve, 12), (115000 + 1100000 / 12) / 1515 / 510, 1e-12, "式");
});

test("回収できない入力は Infinity(損益分岐未満)", () => {
  assert.equal(paybackMonth(flat(2700, 12, { occM1: 5, occM3: 8, occM6: 10 })), Infinity);
  assert.equal(paybackMonths(1100000, 0), Infinity);
  assert.equal(paybackMonths(1100000, 110000), 10);
});

test("1ヶ月目のオープニング割引は1ヶ月目だけに効く", () => {
  const a = monthlyPath(achieve, 3);
  const b = monthlyPath({ ...achieve, openingDiscount: 0 }, 3);
  near(b[0].profit - a[0].profit, 51 * 2700 * 0.25 * 0.7, 1e-6, "1ヶ月目の差");
  near(b[1].profit, a[1].profit, 1e-9, "2ヶ月目");
});

test("12ヶ月判定の境界(第3版):20%未満=撤退判断、20〜30%=条件付き継続、30〜40%=継続(目標40%未満)、40〜50%=継続(目標達成)、50%超=上振れ", () => {
  assert.equal(judge12Months(0.199).label, "撤退判断");
  assert.equal(judge12Months(0.199).status, "ng");
  assert.equal(judge12Months(0.20).label, "条件付き継続");
  assert.equal(judge12Months(0.299).label, "条件付き継続");
  assert.equal(judge12Months(0.30).label, "継続(目標40%未満)");
  assert.equal(judge12Months(0.35).status, "warn");
  assert.equal(judge12Months(0.40).label, "継続(目標達成)");
  assert.equal(judge12Months(0.50).label, "継続(目標達成)");
  assert.equal(judge12Months(0.51).label, "上振れ");
});

test("以前の表示の問題:30〜35%を単に「継続」、45%を「2年回収ペース」と出さない", () => {
  for (const o of [0.30, 0.33, 0.35]) {
    const j = judge12Months(o);
    assert.notEqual(j.label, "継続");
    assert.match(j.label, /目標40%未満/);
  }
  for (const o of [0.25, 0.35, 0.45, 0.55]) {
    assert.doesNotMatch(JSON.stringify(judge12Months(o)), /2年/);
  }
});

test("1年回収の判定:100%以上=12ヶ月で回収、80%以上=ほぼ計画どおり、50%未満=18ヶ月回収の計画へ", () => {
  assert.equal(paybackReview(1.0).label, "12ヶ月で回収");
  assert.equal(paybackReview(0.8).label, "ほぼ計画どおり");
  assert.equal(paybackReview(0.79).label, "計画より遅れ");
  assert.equal(paybackReview(0.5).label, "計画より遅れ");
  assert.equal(paybackReview(0.49).label, "18ヶ月回収の計画へ");
  assert.notEqual(paybackReview(0.1).status, "ng"); // これだけでは撤退しない
});

test("scaleOccupancy:時間帯の比率を保ったまま全体稼働率を合わせる", () => {
  const q = scaleOccupancy(DEFAULTS, 0.3);
  near(monthlyResult(q).occupancy, 0.3, 1e-9, "全体稼働率");
  near(q.occHoliday / q.occEarly, DEFAULTS.occHoliday / DEFAULTS.occEarly, 1e-9, "比率");
});

test("資金ライン:固定費3ヶ月分(34.5万円)を割る月", () => {
  assert.equal(cashLineMonth(DEFAULTS), Infinity);
  assert.equal(cashLineMonth({ ...DEFAULTS, workingCapital: 300000 }), 0);
  // 稼働率が損益分岐に届かないと累積の赤字が 70万 − 34.5万 = 35.5万円を超えた月に割る
  const weak = flat(2400, 10, { occM1: 5, occM3: 8, occM6: 10 });
  const k = cashLineMonth(weak);
  const path = monthlyPath(weak, 18);
  assert.ok(Number.isFinite(k) && k > 1);
  assert.ok(700000 + path[k - 1].cumulative < 345000);
  assert.ok(700000 + path[k - 2].cumulative >= 345000);
});

test("撤退基準一覧:慎重シナリオ(12ヶ月35%)は継続だが12ヶ月回収は未達、18ヶ月の回収も未達", () => {
  const checks = exitChecks(careful);
  const find = (when, prefix) => checks.find((c) => c.when === when && c.rule.startsWith(prefix));
  assert.equal(find("3ヶ月", "稼働率12%未満").status, "ok");
  assert.equal(find("3ヶ月", "稼働率20%").status, "warn");
  assert.equal(find("6ヶ月", "稼働率20%未満").status, "ok");
  assert.equal(find("12ヶ月", "稼働率20%未満").label, "継続(目標40%未満)");
  assert.equal(find("12ヶ月", "累積利益").label, "18ヶ月回収の計画へ");
  assert.equal(find("18ヶ月", "初期投資を回収").status, "warn");
  assert.equal(find("随時", "運転資金").status, "ok");
});

test("撤退基準一覧:6ヶ月で黄信号、10ヶ月でも18%未満、12ヶ月で20%未満なら撤退水準", () => {
  const weak = flat(2700, 17, { occM1: 5, occM3: 10, occM6: 15 });
  const checks = exitChecks(weak);
  const find = (when, prefix) => checks.find((c) => c.when.startsWith(when) && c.rule.startsWith(prefix));
  assert.equal(find("3ヶ月", "稼働率12%未満").status, "warn");
  assert.equal(find("6ヶ月", "稼働率20%未満").status, "warn");
  assert.equal(find("見直し2回後", "黄信号").status, "ng");
  assert.equal(find("12ヶ月", "稼働率20%未満").status, "ng");
  assert.equal(find("18ヶ月", "条件付き継続").status, "ng");
});

test("撤退基準一覧:12ヶ月25%(条件付き継続)は18ヶ月目に30%未満なら撤退", () => {
  const checks = exitChecks(flat(2700, 25));
  assert.equal(checks.find((c) => c.when === "12ヶ月" && c.rule.startsWith("稼働率")).label, "条件付き継続");
  assert.equal(checks.find((c) => c.when === "18ヶ月" && c.rule.startsWith("条件付き継続")).status, "ng");
  // 12ヶ月30%以上なら18ヶ月の撤退ルールはかからない
  assert.equal(exitChecks(flat(2700, 30)).find((c) => c.when === "18ヶ月" && c.rule.startsWith("条件付き継続")).status, "ok");
});

console.log(`\n${passed} passed${process.exitCode ? ", some FAILED" : ""}`);
