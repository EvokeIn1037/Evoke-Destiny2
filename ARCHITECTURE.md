# Architecture Blueprint

Companion to [AGENTS.md](AGENTS.md). AGENTS.md covers *what we're building and why*; this doc covers the target structure for growing the project without letting layer boundaries blur.

**Stack:** React 18 + TypeScript + Vite (frontend) · Electron (desktop) · Python/FastAPI (backend, planned) · React Router v6 · CSS-in-TSX inline styles · Bungie API (Destiny 2 player data retrieval and game data search)

---

## Architecture Goal

The frontend has a layered foundation: `src/data`, `src/presentation`, `src/shared`, and a consistent `@/` path alias. The build blueprint is to keep that foundation, tighten the layer boundaries, and introduce a small `app/` and intentional `domain/` layer before the project grows further.

Target dependency direction:

```text
app
  -> presentation
  -> data
  -> domain
  -> shared
```

More precisely:

- `app` composes providers, routing, and app-wide lifecycle.
- `presentation` can depend on `data`, `domain`, and `shared`.
- `data` can depend on `domain` and `shared`.
- `domain` can depend on `shared` only when the dependency is truly generic.
- `shared` must not depend on `presentation` or `data`.

If a lower layer imports from a higher layer, move the shared type, constant, or helper down into `domain` or `shared`.

---

## Source Layout

```text
frontend/
  electron/
    main.ts              ← Electron main process; loads localhost:5173 in dev, dist/index.html in prod
    preload.ts           ← Context bridge; exposes platform + isElectron to renderer
  src/
    app/
      App.tsx            ← Thin boot entry: mounts AppProviders + AppRouter
      AppProviders.tsx   ← Composes PlayerProvider, CharacterProvider, PvpProvider
      AppRouter.tsx      ← HashRouter + route→screen mapping
      navigation/
        routes.ts        ← ROUTES constants (/, /character, /pvp)
    domain/
      types/
        player.ts        ← PlayerProfile, Character, CharacterDetail, GearItem, ClanInfo, CharacterStats
        pvp.ts           ← PvpActivity
      constants/
        pvpModes.ts      ← PVP_MODES array + PVP_MODE_MAP (mode id → Chinese label)
    data/
      config/
        api.ts           ← fetch wrapper reading VITE_API_BASE_URL
      services/
        playerService.ts    ← searchPlayer(name) → PlayerProfile
        characterService.ts ← loadCharacterDetail(membershipId, characterId) → CharacterDetail
        pvpService.ts       ← loadPvpActivities(membershipId, characterId, mode) → PvpActivity[]
      providers/
        player.type.ts      ← PlayerState + PlayerContextValue interface
        player.provider.tsx ← PlayerContext + useReducer + usePlayer() hook
        character.type.ts   ← CharacterDetailState + CharacterContextValue interface
        character.provider.tsx ← CharacterContext + per-characterId state map + useCharacter() hook
        pvp.type.ts         ← PvpDataState + PvpContextValue interface
        pvp.provider.tsx    ← PvpContext + keyed by `${characterId}:${mode}` + usePvp() hook
    presentation/
      screens/
        HomePage.tsx       ← Video background + hero text
        CharacterPage.tsx  ← Search → per-character stats + gear + clan info
        PvpPage.tsx        ← Search → per-character mode selector → activity table
      components/
        layout/
          Navbar.tsx       ← Sticky nav; active route highlighted in primary gold
          Footer.tsx       ← ~Presented by evoke~
        player/
          SearchBar.tsx    ← Controlled input + submit; reused on both data pages
          CharacterCard.tsx← Emblem image + class name overlay + light level
          StatTable.tsx    ← Class/race/gender, last login, playtime, light, 6 stats
          GearGrid.tsx     ← 3 weapons + 5 armor slots; icon + name + light per slot
          ClanInfo.tsx     ← Banner image + name/callsign + member count + motto + about
        pvp/
          ModeSelector.tsx ← 12 mode buttons; active mode highlighted in primary gold
          ActivityTable.tsx← Scrollable table: map, K, D, A, KD, KDA, efficiency
      styles/
        tokens.ts          ← colors, spacing, fontSizes, font, radii, shared style objects
    shared/
      hooks/
        useAsync.ts        ← Generic status/data/error state + run(promise) helper
      utils/
        bungieName.ts      ← encodeBungieName (# → %23), splitBungieName
    main.tsx               ← ReactDOM.createRoot entry point
    vite-env.d.ts          ← VITE_API_BASE_URL env type
  index.html
  vite.config.ts           ← @/ alias; electron plugin activated when --mode electron
  tsconfig.json            ← React source (src/)
  tsconfig.node.json       ← Vite config + electron/ (Node types)
  package.json
  electron-builder.json    ← Electron packaging (dmg/nsis/AppImage)
  .env.example             ← VITE_API_BASE_URL=http://localhost:8000
```

---

## Provider Pattern

Each data domain gets exactly two files:

- `*.type.ts` — the context's TypeScript interface (state shape + action signatures). No React imports.
- `*.provider.tsx` — `createContext` + `useReducer` state machine + exported hook (`usePlayer`, `useCharacter`, `usePvp`).

State machines use discriminated union `Action` types. Reducers are idempotent: a `LOAD_START` for an already-loading entry is a no-op at the reducer level.

Providers live at the app level (`AppProviders.tsx`). Screens consume data via hooks, never by importing context directly.

---

## CSS Convention

All styles are declared as `const styles: Record<string, CSSProperties>` at the bottom of each `.tsx` file. Shared design values (colors, spacing, font sizes, border radii, common button/input objects) live in `src/presentation/styles/tokens.ts` and are imported directly.

No external `.css` files. No CSS modules. No Tailwind. No styled-components.

---

## Platform Split (Web vs Electron)

| Concern | Web | Electron |
|---|---|---|
| Router | `HashRouter` (works with `file://` and HTTP) | Same |
| Dev entry | `vite --mode development` | `vite --mode electron` (adds electron plugin) |
| Prod load | Static HTTP server → `dist/index.html` | `win.loadFile('../dist/index.html')` |
| Native APIs | None | `electron/preload.ts` exposes `platform` via contextBridge |

The React app has zero Electron-specific imports. Platform detection (`window.electronAPI`) is available if needed but the current codebase does not require it.

---

## Backend API (Planned — FastAPI)

The frontend calls these endpoints. Services in `src/data/services/` map 1-to-1:

| Method | Path | Service function |
|---|---|---|
| `GET` | `/api/player/search?name={name}` | `searchPlayer` |
| `GET` | `/api/character/{membershipId}/{characterId}` | `loadCharacterDetail` |
| `GET` | `/api/pvp/{membershipId}/{characterId}?mode={mode}` | `loadPvpActivities` |

All responses match the TypeScript interfaces in `src/domain/types/`. The `api.ts` config wrapper reads `VITE_API_BASE_URL` and throws a typed error on non-2xx responses.

---

## Navigation Blueprint

```text
src/app/AppRouter.tsx
  owns HashRouter + Routes

src/app/navigation/routes.ts
  owns ROUTES constants and AppRoute type

src/presentation/screens/**
  render screens; navigate via useNavigate()
```

Add new routes by: (1) adding a constant to `routes.ts`, (2) adding a `<Route>` in `AppRouter.tsx`, (3) creating the screen file.

---

## Quality Gates

Before merging changes:

- `npx tsc --noEmit` from `frontend/` — zero errors required
- `npm run build` from `frontend/` — production build must succeed
- UI changes: verify in `npm run dev` (web) and optionally `npm run electron:dev` (desktop)

---

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Vite web dev server at `localhost:5173` |
| `npm run build` | TypeScript check + production web build |
| `npm run preview` | Preview production build locally |
| `npm run electron:dev` | Vite + Electron desktop window (dev) |
| `npm run electron:build` | Package Electron app to `release/` |

Run all commands from the `frontend/` directory.

---

## Conventions

- Use `@/...` imports for all source files (alias points to `src/`).
- Route strings: always use `ROUTES.*` constants, never raw strings.
- PvP mode IDs: always use `PVP_MODES` / `PVP_MODE_MAP`, never magic numbers.
- Class/race/gender labels: always use `CLASS_NAMES`, `RACE_NAMES`, `GENDER_NAMES` from `domain/types/player.ts`.
- Do not let `data` or `shared` import from `presentation`.
- Do not add external CSS files; add to `tokens.ts` or local `styles` objects instead.
- Introduce a repository only when it hides meaningful orchestration across multiple services.
