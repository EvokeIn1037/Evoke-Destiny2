#!/usr/bin/env python3
"""Download the latest Bungie Destiny 2 manifest and save to app/db/manifest.db.

Run from the backend/ directory:
    python scripts/update_manifest.py
"""

import os
import shutil
import tempfile
import urllib.request
import zipfile

BUNGIE_ROOT = "https://www.bungie.net"
MANIFEST_ENDPOINT = f"{BUNGIE_ROOT}/Platform/Destiny2/Manifest/"
DB_PATH = "./app/db/manifest.db"


def main() -> None:
    api_key = os.environ.get("BUNGIE_API_KEY")
    if not api_key:
        # Try loading from .env
        env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("BUNGIE_API_KEY="):
                        api_key = line.split("=", 1)[1].strip()
                        break

    if not api_key:
        raise SystemExit("BUNGIE_API_KEY not set. Export it or add it to backend/.env")

    print("Fetching manifest metadata...")
    req = urllib.request.Request(MANIFEST_ENDPOINT, headers={"X-API-Key": api_key})
    with urllib.request.urlopen(req) as resp:
        import json
        data = json.loads(resp.read())

    content_paths = data["Response"]["mobileWorldContentPaths"]
    # Prefer Simplified Chinese, fall back to English
    db_url_path = content_paths.get("zh-chs") or content_paths.get("en")
    if not db_url_path:
        raise SystemExit("No suitable content path found in manifest response")

    db_url = f"{BUNGIE_ROOT}{db_url_path}"
    print(f"Downloading {db_url} ...")

    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        urllib.request.urlretrieve(db_url, tmp_path)
        print("Extracting SQLite database...")
        with zipfile.ZipFile(tmp_path) as zf:
            names = zf.namelist()
            if not names:
                raise SystemExit("Zip archive is empty")
            db_name = names[0]
            out_dir = os.path.dirname(DB_PATH)
            os.makedirs(out_dir, exist_ok=True)
            extracted = zf.extract(db_name, out_dir)
            shutil.move(extracted, DB_PATH)
    finally:
        os.unlink(tmp_path)

    print(f"Manifest saved to {DB_PATH}")


if __name__ == "__main__":
    main()
