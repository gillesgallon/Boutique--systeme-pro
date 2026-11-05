#!/usr/bin/env bash
set -euo pipefail
icon_dir="$HOME/.local/share/icons"
mkdir -p "$icon_dir"
tmp_icon=$(mktemp "$icon_dir/hippique-pro.XXXXXX")
trap 'rm -f "$tmp_icon"' EXIT
curl --fail --location --silent --show-error \
  "https://gillesgallon.github.io/Boutique--systeme-pro/hippique-logo.png" -o "$tmp_icon"
python3 - "$tmp_icon" <<'PY'
import sys
from pathlib import Path
if not Path(sys.argv[1]).read_bytes().startswith(b'\x89PNG\r\n\x1a\n'):
    raise SystemExit("Le logo reçu est invalide. Aucun raccourci modifié.")
PY
mv "$tmp_icon" "$icon_dir/hippique-pro.png"
python3 <<'PY'
from pathlib import Path
from datetime import datetime
import re
home = Path.home()
folders = {home/"Bureau", home/"Desktop", home/".local/share/applications"}
count = 0
for folder in folders:
    for path in folder.glob("*.desktop"):
        if path.is_symlink():
            continue
        text = path.read_text(encoding="utf-8")
        if not re.search(r"^Name=HIPPIQUE SYSTÈME PRO\s*$", text, re.M):
            continue
        lines = text.splitlines(keepends=True)
        inside = False
        replaced = False
        for i, line in enumerate(lines):
            if line.startswith("["):
                if inside and not replaced:
                    lines.insert(i, "Icon=" + str(home/".local/share/icons/hippique-pro.png") + "\n")
                    replaced = True
                    break
                inside = line.strip() == "[Desktop Entry]"
            elif inside and line.startswith("Icon="):
                lines[i] = "Icon=" + str(home/".local/share/icons/hippique-pro.png") + "\n"
                replaced = True
                break
        if inside and not replaced:
            lines.append("\nIcon=" + str(home/".local/share/icons/hippique-pro.png") + "\n")
            replaced = True
        if replaced:
            backup = path.with_name(path.name + ".sauvegarde-icone-" + datetime.now().strftime("%Y%m%d%H%M%S%f"))
            backup.write_text(text, encoding="utf-8")
            path.write_text("".join(lines), encoding="utf-8")
            count += 1
print(f"Logo hippique installé. {count} raccourci(s) corrigé(s).")
if not count:
    print("Aucun raccourci HIPPIQUE SYSTÈME PRO trouvé.")
PY
echo "Si nécessaire, cliquez sur le bureau puis appuyez sur F5."
