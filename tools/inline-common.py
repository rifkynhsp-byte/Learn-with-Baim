#!/usr/bin/env python3
"""Copy common.js into every page that carries an inlined copy of it.

Each game page embeds common.js verbatim in its first <script> block, so the
pages keep working when opened straight from the file system. After editing
common.js, run this from the repository root:

    python3 tools/inline-common.py            # the main app
    python3 tools/inline-common.py islami     # Rumah Islami, which has its own
"""
import pathlib
import sys

HEAD = "/* ============================================================\n   common.js"

folder = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".")
common = (folder / "common.js").read_text(encoding="utf-8").strip()
changed = 0
for page in sorted(folder.glob("*.html")):
    html = page.read_text(encoding="utf-8")
    start = html.find(HEAD)
    if start < 0:
        continue
    end = html.find("</script>", start)
    body = html[start:end]
    new = common + "\n"
    if body.strip() == common:
        continue
    page.write_text(html[:start] + new + html[end:], encoding="utf-8")
    changed += 1
    print("updated", page)
print(f"{changed} page(s) updated")
