"""roadmap-solo.md から、ひとりで進める用のチェックリストページ (index.html) を生成する。

使い方: python3 tools/rental-space-checklist/build.py
roadmap-solo.md を直したら再実行して、index.html を公開し直す。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "docs/rental-space/roadmap-solo.md"
TEMPLATE = Path(__file__).with_name("template.html")
OUT = Path(__file__).with_name("index.html")

KIND = {"家": "home", "出": "out", "外": "contact", "AI": "ai"}
WEEKDAY = "月火水木金土日"


def iso(md):
    m = re.search(r"(\d{1,2})/(\d{1,2})", md or "")
    if not m:
        return None
    mo, d = int(m.group(1)), int(m.group(2))
    year = 2026 if mo >= 9 else 2027
    return f"{year}-{mo:02d}-{d:02d}"


def parse():
    text = SRC.read_text(encoding="utf8")
    m = re.search(r"開業目標日[^0-9]{0,20}(\d{4})-(\d{2})-(\d{2})", text)
    if not m:
        raise SystemExit("roadmap-solo.md に「開業目標日 … YYYY-MM-DD」が見つかりません")
    y, mo, d = map(int, m.groups())
    import datetime
    wd = WEEKDAY[datetime.date(y, mo, d).weekday()]
    dday, dlabel = f"{y}-{mo:02d}-{d:02d}", f"{y}年{mo}月{d}日({wd})"

    tasks, phases, weeks = [], [], []
    phase = None
    for line in text.split("\n"):
        pm = re.match(r"### (F\d.*?)\s*[(（](.*?)[)）]\s*$", line)
        if pm:
            phase = {"key": f"p{len(phases)}", "title": pm.group(1).strip(), "period": pm.group(2)}
            phases.append(phase)
            continue
        tm = re.match(r"- \[ \] \*\*(S-\d+)\*\* (.*)", line)
        if tm:
            parts = [p.strip() for p in tm.group(2).split("｜")] + [""] * 7
            owner = parts[1]
            tasks.append({
                "id": tm.group(1), "phase": phase["key"] if phase else "p0", "text": parts[0],
                "owner": owner, "who": "ai" if owner.startswith("ai-") else "me",
                "kinds": [KIND[k] for k in re.findall(r"【(家|出|外|AI)】", parts[2])],
                "time": parts[3], "dueText": parts[4], "due": iso(parts[4]),
                "deps": parts[5] if parts[5] not in ("—", "-", "") else "",
            })
            continue
        wm = re.match(r"\| (W\d+(?:[〜~-]W?\d+)?) \|", line)
        if wm:
            cells = [c.strip() for c in line.strip().strip("|").split("|")] + [""] * 5
            weeks.append({"week": cells[0], "period": cells[1], "start": iso(cells[1]),
                          "me": cells[2], "ai": cells[3], "milestone": cells[4]})
    return {"dday": dday, "ddayLabel": dlabel, "tasks": tasks, "phases": phases, "weeks": weeks}


def main():
    data = parse()
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    OUT.write_text(TEMPLATE.read_text(encoding="utf8").replace("/*__DATA__*/null", payload), encoding="utf8")
    print(f"{len(data['tasks'])} tasks, {len(data['phases'])} phases, {len(data['weeks'])} weeks, D={data['dday']} -> {OUT}")


if __name__ == "__main__":
    main()
