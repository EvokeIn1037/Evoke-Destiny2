#!/usr/bin/env python3
"""Download the latest Bungie Destiny 2 manifest SQLite database.

Run from the backend/ directory:
    python scripts/update_manifest.py [locale]

Locale options: en, fr, es, es-mx, de, it, ja, pt-br, ru, pl, ko, zh-cht, zh-chs
Defaults to en.
"""

import os
import sys
import tempfile
import urllib.request
import zipfile
import json

BUNGIE_ROOT = "https://www.bungie.net"
MANIFEST_ENDPOINT = f"{BUNGIE_ROOT}/Platform/Destiny2/Manifest/"
DB_DIR = "./app/db"
SUPPORTED_LOCALES = ["en", "fr", "es", "es-mx", "de", "it", "ja", "pt-br", "ru", "pl", "ko", "zh-cht", "zh-chs"]


def _load_api_key() -> str:
    api_key = os.environ.get("BUNGIE_API_KEY", "")
    if api_key:
        return api_key
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line.startswith("BUNGIE_API_KEY="):
                    return line.split("=", 1)[1].strip()
    return ""


def _get_mobile_content_path(api_key: str, locale: str) -> str:
    req = urllib.request.Request(MANIFEST_ENDPOINT, headers={"X-API-Key": api_key})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())

    content_paths = data["Response"]["mobileWorldContentPaths"]
    path = content_paths.get(locale) or content_paths.get("en")
    if not path:
        raise SystemExit(f"No mobile content path found for locale '{locale}' or fallback 'en'")
    return path


def main() -> None:
    locale = sys.argv[1] if len(sys.argv) > 1 else "en"
    if locale not in SUPPORTED_LOCALES:
        raise SystemExit(
            f"Unsupported locale '{locale}'. Choose from: {', '.join(SUPPORTED_LOCALES)}"
        )

    api_key = _load_api_key()
    if not api_key:
        raise SystemExit("BUNGIE_API_KEY not set. Export it or add it to backend/.env")

    print(f"Fetching manifest metadata (locale: {locale})...")
    content_path = _get_mobile_content_path(api_key, locale)
    url = f"{BUNGIE_ROOT}{content_path}"
    print(f"Downloading {url} ...")

    os.makedirs(DB_DIR, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp_dir:
        content_file = os.path.join(tmp_dir, "world_sql_content.content")
        req = urllib.request.Request(url, headers={"X-API-Key": api_key})
        with urllib.request.urlopen(req) as resp:
            with open(content_file, "wb") as f:
                f.write(resp.read())

        zip_file = content_file.replace(".content", ".zip")
        os.rename(content_file, zip_file)

        print("Extracting...")
        with zipfile.ZipFile(zip_file, "r") as zf:
            names = zf.namelist()
            if not names:
                raise SystemExit("Zip archive is empty")
            zf.extract(names[0], tmp_dir)
            extracted = os.path.join(tmp_dir, names[0])

        dest = os.path.join(DB_DIR, f"manifest_{locale}.db")
        if os.path.exists(dest):
            os.remove(dest)
        os.rename(extracted, dest)

    print(f"Manifest saved to {dest}")


if __name__ == "__main__":
    main()
