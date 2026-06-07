# AGENTS.md

Orientation for agents working in this repo. For stack/file-layout details, read [ARCHITECTURE.md](ARCHITECTURE.md) — this document is about **what we're building and why**. Read both.

---

## What this project is

**evoke's destiny finder** uses the Bungie API for Destiny 2 game player data retrieving and game data search. Users enter a Bungie username and see their characters' stats, equipped gear, PvP match history per game mode, and clan info. The app calls a FastAPI backend which proxies the public Bungie API and queries a local Destiny manifest SQLite database to resolve activity and item names.

The project has two deployment targets that share the same codebase:

- **Web browser**: Vite dev server or static build served over HTTP.
- **Desktop (Electron)**: same React build loaded inside a `BrowserWindow`. Electron main process lives in `frontend/electron/`.

The backend is a separate Python/FastAPI process (`backend/`). The frontend talks to it via `VITE_API_BASE_URL` (default `http://localhost:8000`).

If older documentation, skills, or comments conflict with what is described here, treat that as stale context and update it before relying on it.

The original HTML pages (`index.html`, `character/`, `pvp/`, `raid/`) remain in the repo as reference only. They are **not** part of the active build.

| Path                          | What it is                         |
| ----------------------------- | ---------------------------------- |
| `character/`, `pvp/`, `raid/` | Legacy HTML pages. Reference only. |

---

## Product areas

- **Player search**: Resolve a Bungie display name (e.g. `evoke#1037`) to a `membershipId` + list of characters. Entry point for both the character and PvP pages.
- **Character data**: Per-character stats (light level, mobility, resilience, etc.), equipped gear (3 weapons + 5 armor with icons and light values), and clan info.
- **PvP history**: Per-character, per-mode recent activity list — map name, kills, deaths, assists, KD, KDA, efficiency. Supports 12 game modes including Trials of Osiris.
- **Manifest resolution**: Backend service that maps Bungie hash IDs to human-readable names using a local SQLite snapshot of the Destiny manifest.

---

## Working norms

- **Strategic / context-setting prompts** ("here's what we're doing, look into things") → research and converse, don't pre-empt with edits.
- **Tactical prompts** ("fix this bug", "rename this") → proceed normally.
- **Provider boundary is sacred** — when in doubt about where logic belongs, push it inside the provider rather than leaking it out.
- **When a feature fits a future phase**, flag it as such instead of scope-creeping the current one.

## Coding principles

- **Simple beats clever.** Ship the approach that solves the problem in front of us and reads well. Don't pre-build for hypothetical short-tail cases — the abstraction guessed at usually doesn't survive contact with the real second use.
- **Build the seam when N≥2 is real.** When a second variant of something is already on the roadmap (another provider, another command type), put the abstraction in now. The provider and command patterns are paid-for examples.
- **Folder boundaries are semantic.** `controller/` is glue, `engine/` isolates Babylon, `services/` is provider-shaped, `store/` is Zustand. New code goes in the layer it belongs to — don't smear logic across layers.
- **Strings are bugs.** Use enums/types for anything referenced in more than one place — routes (`ROUTES`), PvP mode IDs (`PVP_MODES`), raid modes (`RAID_MODES`).
- **Comments are bugs too.** Default to none. Well-named identifiers should carry the _what_; only write a comment when the _why_ is genuinely non-obvious (a hidden constraint, a workaround, a subtle invariant). Don't describe behavior the code already shows, don't narrate task history ("added for X", "fix from PR #N"), and don't write multi-line docstrings — one short line max. If removing the comment wouldn't confuse a future reader, don't write it.

## Running the app

**Frontend (from `frontend/`):**

- `npm run dev` — Vite web dev server at `localhost:5173`
- `npm run build` — TypeScript check + production web build to `dist/`
- `npm run electron:dev` — Vite + Electron desktop window (dev mode)
- `npm run electron:build` — package Electron app to `release/`

**Backend (from `backend/`):**

- Create `backend/.env` with at minimum `BUNGIE_API_KEY=<your key>`. Optional overrides: `MANIFEST_DB_PATH`, `CORS_ORIGINS`, `BUNGIE_ROOT`.
- Activate the venv: `source venv/bin/activate`
- `python scripts/update_manifest.py [locale]` — download the Destiny manifest for the given locale (default: `zh-chs`, fallback: `en`). Saves to `app/db/manifest_{locale}.db`. Supported locales: `en fr es es-mx de it ja pt-br ru pl ko zh-cht zh-chs`.
- `uvicorn app.main:app --reload` — FastAPI dev server at `localhost:8000`

**Environment** — create `frontend/.env` and set `VITE_API_BASE_URL=http://localhost:8000`.

## Verification

Every task spawns the **evaluator** — a verification subagent that lives from the start of the task to sign-off. You own implementation; the evaluator owns verification. Even simple changes go through it. Evaluators are stateful, so plan and agree with one evaluator from the start. For verification you're free to spawn more — make sure to kill any evaluator processes you no longer need.

**Spawn early.** As soon as you have a task, spawn the evaluator with the `Agent` tool (`subagent_type: 'evaluator'`, `run_in_background: true`). Brief = the user's full ask + your draft plan + the path to a plan file you'll share.

**Plan together.** Write the plan to `plans/<slug>.md` and share the path with the evaluator. It pushes back on coverage gaps, scope creep, and items that can't be verified. Converge before implementing.

**Take pushback seriously.** When the evaluator disagrees, engage the argument. You have final authority but using it is a last resort. If you override, record the disagreement in the plan's "Risks / unverified" section so it's traceable.

**Implement one item at a time.** After each, send the evaluator a verification request. Pass → mark the item's status in the plan file and move to the next. Fail or ambiguous → fix or clarify. Don't run the browser yourself — that's the evaluator's surface entirely.

**Sign off.** When all items pass, ask the evaluator for sign-off. It may recommend writing or updating a testing skill — your call whether to act on that. Delete the plan file. Commit and open a PR to `development`. Report done.
