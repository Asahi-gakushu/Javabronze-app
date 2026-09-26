// 依存なしのテスト。実行: node tools/rental-space-simulator/test.mjs
// index.html の <script id="calc"> を取り出して評価し、concept.md / market-report.md の試算と照合する
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const m = html.match(/<script id="calc">([\s\S]*?)<\/script>/);
assert.ok(m, 'index.html に <script id="calc"> が見つからない');

const names = [
  "DEFAULTS", "THRESHOLDS", "slotCapacity", "monthlyResult", "contributionPerHour",
  "occupancyForProfit", "breakEvenOccupancy", "occupancyForPayback", "paybackMonths",
  "scaleOccupancy", "monthsToCashLine", "judge12Months", "exitChecks",
];
const calc = new Function(`${m[1]}\nreturn { ${names.join(", ")} };`)();
const {
  DEFAULTS, slotCapacity, monthlyResult, breakEvenOccupancy, occupancyForPayback,
  paybackMonths, scaleOccupancy, monthsToCashLine, judge12Months, exitChecks,
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

// 全時間帯を同じ単価・同じ稼働率にした入力(レポートの単一単価の試算と比べるため)
const flat = (price, occPct) => ({
  ...DEFAULTS,
  priceWeekdayDay: price, priceWeekdayNight: price, priceHoliday: price,
  occWeekdayDay: occPct, occWeekdayNight: occPct, occHoliday: occPct,
});

test("営業時間の容量:8〜23時×30日=450時間、平日昼/夜/休日に分かれる", () => {
  const c = slotCapacity(DEFAULTS);
  assert.equal(c.total, 450);
  assert.equal(c.weekdayDay, 21 * 9);
  assert.equal(c.weekdayNight, 21 * 6);
  assert.equal(c.holiday, 9 * 15);
  assert.equal(c.weekdayDay + c.weekdayNight + c.holiday, c.total);
});

test("夜の開始時刻が営業時間外でも容量は合計と一致する", () => {
  const c = slotCapacity({ ...DEFAULTS, nightStartHour: 25 });
  assert.equal(c.weekdayNight, 0);
  assert.equal(c.weekdayDay + c.weekdayNight + c.holiday, c.total);
});

test("concept.md 3-2 開業6ヶ月:稼働率30%・2,400円 → 売上約32万円・利益±0〜+1万円", () => {
  const r = monthlyResult(flat(2400, 30));
  near(r.hours, 135, 1e-9, "予約時間");
  near(r.revenue, 324000, 1e-6, "売上");
  near(r.profit, 324000 * 0.7 - (135 / 4.7) * 2000 - 160000, 1e-6, "利益");
  assert.ok(r.profit >= 0 && r.profit <= 10000, `利益 ${r.profit}`);
});

// concept.md の表は「約−4万円」だが、同じ表の計算式(売上×0.7 − 清掃費 − 16万円)では約−6万円になる。
// ここでは計算式のほうに合わせる(表の値の修正は ai-ceo に依頼)
test("concept.md 3-2 開業3ヶ月:稼働率20%・2,200円 → 売上約20万円・利益約−6万円(計算式どおり)", () => {
  const r = monthlyResult(flat(2200, 20));
  near(r.revenue, 198000, 1e-6, "売上");
  near(r.profit, 198000 * 0.7 - (90 / 4.7) * 2000 - 160000, 1e-6, "利益");
  near(r.profit, -60000, 1000, "利益(概算)");
});

test("concept.md 3-2 開業12ヶ月:稼働率45%・2,500円 → 利益約+10万円、40% → 約+8万円", () => {
  near(monthlyResult(flat(2500, 45)).profit, 100000, 10000, "45%の利益");
  near(monthlyResult(flat(2500, 40)).profit, 80000, 5000, "40%の利益");
});

test("market-report.md 5-3:2,500円・手数料30% → 損益分岐 約121時間・稼働率約27%", () => {
  const p = flat(2500, 30);
  const be = breakEvenOccupancy(p);
  near(be * 450, 120.7, 0.2, "損益分岐時間");
  near(be, 0.268, 0.001, "損益分岐稼働率");
  near(monthlyResult(flat(2500, be * 100)).profit, 0, 1e-6, "損益分岐での利益");
});

test("market-report.md 5-3:250万円を24ヶ月で回収 → 稼働率約44%", () => {
  near(occupancyForPayback(flat(2500, 30), 24), 0.443, 0.001, "2年回収の稼働率");
});

test("家賃+1万円で損益分岐が約1.7ポイント悪化(concept.md 1-5)", () => {
  const a = breakEvenOccupancy(flat(2500, 30));
  const b = breakEvenOccupancy({ ...flat(2500, 30), rent: 130000 });
  near((b - a) * 100, 1.7, 0.05, "差(ポイント)");
});

test("投資回収月数:黒字なら割り算、赤字・0円なら Infinity", () => {
  assert.equal(paybackMonths(2500000, 100000), 25);
  assert.equal(paybackMonths(2500000, 0), Infinity);
  assert.equal(paybackMonths(2500000, -1), Infinity);
});

test("単価が手数料・清掃費を下回ると損益分岐は達成不能", () => {
  assert.equal(breakEvenOccupancy({ ...flat(500, 30), cleaningCost: 3000 }), Infinity);
});

test("予約0件でも損益分岐は営業時間の比率で出せる", () => {
  const p = { ...DEFAULTS, occWeekdayDay: 0, occWeekdayNight: 0, occHoliday: 0 };
  const r = monthlyResult(p);
  assert.equal(r.revenue, 0);
  assert.equal(r.profit, -160000);
  assert.ok(Number.isFinite(breakEvenOccupancy(p)));
});

test("scaleOccupancy:時間帯の比率を保ったまま全体稼働率を合わせる", () => {
  const q = scaleOccupancy(DEFAULTS, 0.4);
  near(monthlyResult(q).occupancy, 0.4, 1e-9, "全体稼働率");
  near(q.occHoliday / q.occWeekdayDay, DEFAULTS.occHoliday / DEFAULTS.occWeekdayDay, 1e-9, "比率");
});

test("12ヶ月判定の境界:30%未満=撤退、40%=合格、45%=目標、50%超=上振れ", () => {
  assert.equal(judge12Months(0.299).label, "撤退");
  assert.equal(judge12Months(0.30).label, "継続(合格未満)");
  assert.equal(judge12Months(0.40).label, "合格");
  assert.equal(judge12Months(0.45).label, "目標達成");
  assert.equal(judge12Months(0.50).label, "目標達成");
  assert.equal(judge12Months(0.51).label, "上振れ");
});

test("資金ライン:固定費3ヶ月分(48万円)まで何ヶ月もつか", () => {
  assert.equal(monthsToCashLine(1500000, 160000, -40000), (1500000 - 480000) / 40000);
  assert.equal(monthsToCashLine(1500000, 160000, 10000), Infinity);
  assert.equal(monthsToCashLine(400000, 160000, 10000), 0);
});

test("撤退基準一覧:稼働率20%は12ヶ月撤退・見直し後撤退が未達になる", () => {
  const checks = exitChecks(flat(2200, 20));
  const find = (when, prefix) => checks.find((c) => c.when === when && c.rule.startsWith(prefix));
  assert.equal(find("12ヶ月", "稼働率30%未満").status, "ng");
  assert.equal(find("見直し2回後", "稼働率25%未満").status, "ng");
  assert.equal(find("6ヶ月", "稼働率20%未満").status, "ok");
  assert.equal(find("随時", "運転資金").status, "warn");
});

test("初期値(concept.md の料金・時間帯別稼働率)の結果が妥当な範囲", () => {
  const r = monthlyResult(DEFAULTS);
  near(r.occupancy, 0.31, 0.01, "全体稼働率");
  assert.ok(r.avgPrice > 2400 && r.avgPrice < 2700, `平均単価 ${r.avgPrice}`);
  assert.equal(r.fixed, 160000);
});

console.log(`\n${passed} passed${process.exitCode ? ", some FAILED" : ""}`);
