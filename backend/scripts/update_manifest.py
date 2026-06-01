#!/usr/bin/env python3
"""Download the latest Bungie Destiny 2 manifest JSON and save to app/db/manifest.db.

Run from the backend/ directory:
    python scripts/update_manifest.py [locale]

Locale options: en, fr, es, es-mx, de, it, ja, pt-br, ru, pl, ko, zh-cht, zh-chs
Defaults to zh-chs, falling back to en.
"""

import json
import os
import sqlite3
import sys
import urllib.request

BUNGIE_ROOT = "https://www.bungie.net"
MANIFEST_ENDPOINT = f"{BUNGIE_ROOT}/Platform/Destiny2/Manifest/"
DB_PATH = "./app/db/manifest.db"
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


def getDestinyContentPath(api_key: str, locale: str = "zh-chs") -> str:
    """Fetch Bungie manifest and return the jsonWorldContentPaths entry for the given locale."""
    req = urllib.request.Request(MANIFEST_ENDPOINT, headers={"X-API-Key": api_key})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())

    content_paths = data["Response"]["jsonWorldContentPaths"]
    path = content_paths.get(locale) or content_paths.get("en")
    if not path:
        raise SystemExit(f"No content path found for locale '{locale}' or fallback 'en'")
    return path


def _hash_to_id(hash_str: str) -> int:
    id_ = int(hash_str)
    if id_ & (1 << 31):
        id_ -= 1 << 32
    return id_


def _build_db(content: dict) -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    try:
        for table_name, definitions in content.items():
            if not isinstance(definitions, dict):
                continue
            con.execute(f"DROP TABLE IF EXISTS {table_name}")
            con.execute(
                f"CREATE TABLE {table_name} (id INTEGER PRIMARY KEY, json TEXT NOT NULL)"
            )
            rows = [
                (_hash_to_id(hash_str), json.dumps(entry, ensure_ascii=False))
                for hash_str, entry in definitions.items()
            ]
            con.executemany(
                f"INSERT INTO {table_name} (id, json) VALUES (?, ?)", rows
            )
        con.commit()
    finally:
        con.close()


def main() -> None:
    locale = sys.argv[1] if len(sys.argv) > 1 else "zh-chs"
    if locale not in SUPPORTED_LOCALES:
        raise SystemExit(
            f"Unsupported locale '{locale}'. Choose from: {', '.join(SUPPORTED_LOCALES)}"
        )

    api_key = _load_api_key()
    if not api_key:
        raise SystemExit("BUNGIE_API_KEY not set. Export it or add it to backend/.env")

    print(f"Fetching manifest metadata (locale: {locale})...")
    json_path = getDestinyContentPath(api_key, locale)
    url = f"{BUNGIE_ROOT}{json_path}"
    print(f"Downloading {url} ...")

    req = urllib.request.Request(url, headers={"X-API-Key": api_key})
    with urllib.request.urlopen(req) as resp:
        content = json.loads(resp.read())

    print("Building SQLite database...")
    _build_db(content)
    print(f"Manifest saved to {DB_PATH}")


if __name__ == "__main__":
    main()
