# Refactor Plan: evoke's Destiny 2 Finder

## What This Project Is

A Destiny 2 player stat lookup tool ("evoke's destiny finder"). Users enter a Bungie username and see their characters' stats, equipped gear, PvP history per game mode, and clan info. The site calls the public Bungie API and queries a local Destiny manifest SQLite database to resolve activity/item names.

## Current State (Sophomore Era)

**Frontend**: Vanilla HTML pages + Bootstrap 3 + jQuery, one folder per page (`character/`, `pvp/`, `raid/`).

**Backend**: PHP scripts directly called by AJAX (`search/`, `db/`). API key hardcoded in source. No separation between routing, business logic, or data access.

**Database**: `db/world_sql_content.sqlite` — Bungie's manifest snapshot that maps hashed item/activity IDs to names.

**Problems to fix**:
- API key hardcoded in multiple PHP files
- Raw HTML strings assembled in PHP (XSS risk, impossible to maintain)
- No component reuse — each page duplicates nav, loading state, error handling
- Backend returns pre-rendered HTML snippets instead of clean JSON
- No type safety anywhere
- Hardcoded `membershipType=3` (PC only) — should be configurable
- `world_sql_content.sqlite` requires manual file replacement; no tooling for updates

---

## Target Architecture

```
/
├── frontend/    ← React + TypeScript (Vite)
└── backend/     ← Python (FastAPI)
```

The backend becomes a thin, authenticated proxy layer over the Bungie API plus a manifest query service. The frontend owns all rendering and UX state.

---

## Backend: Python / FastAPI

### Why FastAPI
- Async by default — multiple Bungie API calls per request can be parallelized with `asyncio`
- Auto-generates OpenAPI docs at `/docs`
- First-class Pydantic models for request/response validation and type safety
- Cleaner than Flask for a JSON API; lighter than Django

### Folder Layout

```
backend/
  app/
    main.py              ← FastAPI app, CORS, router registration
    config.py            ← Settings loaded from env vars (API key, etc.)
    routers/
      player.py          ← /api/player endpoints
      character.py       ← /api/character endpoints
      pvp.py             ← /api/pvp endpoints
      manifest.py        ← /api/manifest endpoints
    services/
      bungie.py          ← Async HTTP client wrapping all Bungie API calls
      manifest.py        ← SQLite queries for item/activity name resolution
    models/
      player.py          ← Pydantic response models: PlayerProfile, Character, etc.
      pvp.py             ← PvP activity, aggregate stats models
    db/
      manifest.db        ← Bungie manifest SQLite (gitignored; script downloads it)
  scripts/
    update_manifest.py   ← Downloads latest manifest from Bungie and saves to db/
  requirements.txt
  .env.example
```

### Environment Variables (`.env`)

```
BUNGIE_API_KEY=your_key_here
MANIFEST_DB_PATH=./db/manifest.db
CORS_ORIGINS=http://localhost:5173
```

### Key API Endpoints

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/api/player/search?name={name}` | Resolve Bungie name → membershipId + characters |
| `GET` | `/api/character/{membershipId}/{characterId}` | Character stats, gear, emblem |
| `GET` | `/api/pvp/{membershipId}/{characterId}?mode={mode}` | Recent PvP activities with resolved map names |
| `GET` | `/api/manifest/activity/{hash}` | Resolve activity hash → display name |
| `GET` | `/api/manifest/item/{hash}` | Resolve item hash → name + icon |

All endpoints return clean JSON — no HTML assembly in the backend.

### Manifest Update Flow

The `scripts/update_manifest.py` script hits `https://www.bungie.net/Platform/Destiny2/Manifest/`, downloads the latest SQLite, and replaces `db/manifest.db`. Run this after major Destiny updates.

---

## Frontend: React + TypeScript

### Stack

- **Vite** — fast dev server and build
- **React 18** + **TypeScript**
- **React Router v6** — client-side routing replacing the multi-folder HTML approach
- **TanStack Query (React Query)** — server state, caching, loading/error states
- **Tailwind CSS** — replaces Bootstrap; utility-first, no jQuery dependency

### Folder Layout

```
frontend/
  src/
    app/
      App.tsx            ← Root component, QueryClientProvider, Router
      router.tsx         ← Route definitions
    pages/
      HomePage.tsx       ← Landing page with video background
      CharacterPage.tsx  ← Character data lookup
      PvpPage.tsx        ← PvP stats per mode
    components/
      layout/
        Navbar.tsx       ← Shared navigation bar
        Footer.tsx       ← Shared footer
      player/
        SearchBar.tsx    ← Bungie name input + submit
        CharacterCard.tsx← Emblem image + class label
        GearGrid.tsx     ← 3 weapons + 5 armor slots
        StatTable.tsx    ← Light level, mobility, resilience, etc.
        ClanInfo.tsx     ← Clan banner + details
      pvp/
        ModeSelector.tsx ← Game mode buttons (Control, Iron Banner, etc.)
        ActivityTable.tsx← Per-match table: map, K/D/A/KDA
    hooks/
      usePlayer.ts       ← useQuery wrapper for player search
      useCharacter.ts    ← useQuery wrapper for character data
      usePvp.ts          ← useQuery wrapper for PvP activity history
    api/
      client.ts          ← Axios instance pointed at backend base URL
      player.ts          ← API call functions matching backend endpoints
      character.ts
      pvp.ts
    types/
      player.ts          ← TypeScript interfaces for API responses
      pvp.ts
    assets/
      bungieload.gif     ← Keep the loading animation
  index.html
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
```

### Routing

```
/              → HomePage
/character     → CharacterPage
/pvp           → PvpPage
```

Replaces the current `character/index.html`, `pvp/index.html` folder structure.

---

## Migration Phases

### Phase 1 — Backend foundation
1. Set up FastAPI project, `.env` config, and `bungie.py` HTTP service
2. Implement `/api/player/search` endpoint (replaces `search/getInfo.php`)
3. Implement `/api/character/{membershipId}/{characterId}` (replaces `search/getName.php` + `db/getName.php`)
4. Implement `/api/pvp/{membershipId}/{characterId}` with manifest resolution (replaces `db/pvp.php`)
5. Write `scripts/update_manifest.py`
6. Test all endpoints against live Bungie API

### Phase 2 — Frontend foundation
1. Scaffold Vite + React + TypeScript + Tailwind project in `/frontend`
2. Set up React Router with three routes
3. Build `Navbar` and page shells
4. Implement `SearchBar` + `usePlayer` hook wired to backend
5. Build `CharacterCard`, `GearGrid`, `StatTable`, `ClanInfo` for CharacterPage
6. Build `ModeSelector` + `ActivityTable` for PvpPage

### Phase 3 — Polish and cleanup
1. Add proper error states and empty states throughout
2. Mobile-responsive layout (Tailwind breakpoints)
3. Move Bungie API key out of any committed file — document `.env.example`
4. Add `update_manifest.py` instructions to README
5. Remove legacy PHP files once frontend+backend are verified working

---

## What Changes, What Stays

| Concern | Old | New |
|---------|-----|-----|
| Routing | Separate HTML folders | React Router in `frontend/` |
| API calls | Browser AJAX → PHP → Bungie | Browser → FastAPI → Bungie |
| Manifest lookup | PHP + SQLite in same process | Python service in `backend/` |
| HTML rendering | PHP echo strings | React components |
| API key | Hardcoded in PHP source | `.env` file, never committed |
| Styling | Bootstrap 3 + jQuery | Tailwind CSS |
| Type safety | None | TypeScript + Pydantic |
| Loading state | jQuery innerHTML swap | React Query + component state |

---

## Out of Scope (for now)

- Raid lookup page (was already commented out) — add later as `RaidPage`
- Weapon data page (nav link existed but was never built) — add later
- Authentication / OAuth (the Bungie API calls here are all public read-only endpoints)
- Deployment / hosting configuration
