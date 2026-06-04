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
- **Keep platform differences explicit** — Electron-specific behavior belongs in `frontend/electron/`; web-specific behavior belongs behind a service boundary, not scattered through shared code.
- **When a feature fits a future phase**, flag it as such instead of scope-creeping the current one.
- **CSS lives in `.tsx` files** — all styles are inline `const styles` objects typed as `CSSProperties`. No external `.css` files, no Tailwind, no CSS modules. Shared design values live in `frontend/src/presentation/styles/tokens.ts`.

## Coding principles

- **Simple beats clever.** Ship the approach that solves the problem in front of us and reads well.
- **Folder boundaries are semantic.** Each top-level folder owns a distinct layer; don't reach across layers without a clear reason.
- **Strings are bugs.** Use existing types/constants for values referenced in more than one place — routes (`ROUTES`), PvP mode IDs (`PVP_MODES`), raid modes (`RAID_MODES`).
- **Comments are bugs too.** Default to none. Only write a short comment when the why is genuinely non-obvious.

## Running the app

**Frontend (from `frontend/`):**
- `npm run dev` — Vite web dev server at `localhost:5173`
- `npm run build` — TypeScript check + production web build to `dist/`
- `npm run electron:dev` — Vite + Electron desktop window (dev mode)
- `npm run electron:build` — package Electron app to `release/`

**Backend (from `backend/`):**
- Copy `.env.example` to `.env` and set `BUNGIE_API_KEY`
- `python scripts/update_manifest.py` — download latest Destiny manifest to `app/db/manifest.db`
- `uvicorn app.main:app --reload` — FastAPI dev server at `localhost:8000`

**Environment** — copy `.env.example` to `.env` in `frontend/` and set `VITE_API_BASE_URL`.

## Verification

Prefer the lightest verification that exercises the change:

- Docs/config-only changes: inspect the edited files and run targeted searches for stale wording.
- Type changes: `npx tsc --noEmit` from `frontend/`.
- Build correctness: `npm run build` from `frontend/`.
- Platform-specific (Electron) changes: `npm run electron:dev` and verify in the desktop window.
- Backend service changes: cover success, error, and missing-data paths.

Do not start unrelated servers or reset user state unless the task requires it.

### Evaluator workflow (frontend only)

Every non-trivial task — feature, bug fix, or refactor in `frontend/` — goes through the evaluator workflow. You own implementation; the evaluator owns the browser. Backend-only changes do not use this workflow.

**Spawn early.** As soon as you have a frontend task, spawn the evaluator with the `Agent` tool (`subagent_type: 'evaluator'`, `run_in_background: true`). Brief it with the full task, your draft plan, and the path to the plan file you'll share.

**Plan together.** Write the plan to `plans/<slug>.md` and share the path with the evaluator. It pushes back on coverage gaps, scope creep, and items that can't be verified. Converge before implementing. The plan must cover which screens/flows are affected, golden-path steps, edge cases, and regressions to watch for in adjacent screens.

**Implement one item at a time.** After each, send the evaluator a verification request. Pass → mark the item's status in the plan file and move to the next. Fail or ambiguous → fix or clarify. Don't drive the browser yourself.

**Take pushback seriously.** When the evaluator disagrees, engage the argument. You have final authority but using it is a last resort. If you override, record the disagreement in the plan's "Risks / unverified" section so it's traceable.

**Sign off.** When all items pass, ask the evaluator for sign-off. Delete the plan file. Commit and open a PR to `development`. Report done.
