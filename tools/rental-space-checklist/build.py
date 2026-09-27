"""roadmap-3people.md から 3人用チェックリストページ (index.html) を生成する。

使い方: python3 tools/rental-space-checklist/build.py
roadmap-3people.md を直したら再実行して、index.html を公開し直す。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "docs/rental-space/roadmap-3people.md"
TEMPLATE = Path(__file__).with_name("template.html")
OUT = Path(__file__).with_name("index.html")

KIND = {"個": "solo", "集": "together", "外": "outside", "AI": "ai"}


def iso(md):
    m = re.search(r"(\d{1,2})/(\d{1,2})", md or "")
    if not m:
        return None
    mo, d = int(m.group(1)), int(m.group(2))
    year = 2026 if mo >= 9 else 2027
    return f"{year}-{mo:02d}-{d:02d}"


def people(owner):
    if "3人" in owner or "各自" in owner:
        return ["A", "B", "C"]
    found = [p for p in "ABC" if re.search(rf"(?<![A-Za-z]){p}(?![A-Za-z])", owner)]
    return found or ["AI"]


def parse():
    lines = SRC.read_text(encoding="utf8").split("\n")
    tasks, phases, weeks = [], [], []
    phase = None
    for line in lines:
        m = re.match(r"### (F\d[^(（]*?)\s*[(（](.*?)[)）]\s*$", line)
        if m and line.startswith("### F"):
            phase = {"key": f"p{len(phases)}", "title": m.group(1).strip(), "period": m.group(2)}
            phases.append(phase)
            continue
        m = re.match(r"- \[ \] \*\*(R3-\d+)\*\* (.*)", line)
        if m:
            parts = [p.strip() for p in m.group(2).split("｜")] + [""] * 8
            owner = parts[1]
            kinds = [KIND[k] for k in re.findall(r"【(個|集|外|AI)】", parts[2])]
            tasks.append({
                "id": m.group(1), "phase": phase["key"], "text": parts[0],
                "owner": owner, "who": people(owner), "kinds": kinds,
                "time": parts[3], "dueText": parts[4], "due": iso(parts[4]),
                "deps": parts[5] if parts[5] not in ("—", "") else "",
            })
            continue
        m = re.match(r"\| (W\d+(?:〜W\d+)?) \| (.*)", line)
        if m:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            weeks.append({
                "week": cells[0], "period": cells[1], "start": iso(cells[1]),
                "A": cells[2], "B": cells[3], "C": cells[4], "all": cells[5], "milestone": cells[6],
            })
    return tasks, phases, weeks


def main():
    tasks, phases, weeks = parse()
    data = json.dumps({"tasks": tasks, "phases": phases, "weeks": weeks}, ensure_ascii=False)
    data = data.replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf8").replace("/*__DATA__*/null", data)
    OUT.write_text(html, encoding="utf8")
    print(f"{len(tasks)} tasks, {len(phases)} phases, {len(weeks)} weeks -> {OUT}")


if __name__ == "__main__":
    main()
