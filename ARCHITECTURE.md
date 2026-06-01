# Architecture Blueprint

Companion to [AGENTS.md](AGENTS.md). AGENTS.md covers *what we're building and why*; this doc covers the target structure for growing the project without letting layer boundaries blur.

**Stack:** _(fill in your stack — e.g. Expo + React Native + TypeScript + React Native Web + Auth + Cloud/API services)_

---

## Architecture Goal

The project has a layered foundation: `src/data`, `src/presentation`, `src/shared`, and a consistent path alias. The build blueprint is to keep that foundation, tighten the layer boundaries, and introduce a small `app/` and intentional `domain/` layer before the project grows further.

Target dependency direction:

```text
app
  -> presentation
  -> data
  -> domain
  -> shared
```

More precisely:

- `app` composes providers, routing, auth bootstrapping, and app-wide lifecycle.
- `presentation` can depend on `data`, `domain`, and `shared`.
- `data` can depend on `domain` and `shared`.
- `domain` can depend on `shared` only when the dependency is truly generic.
- `shared` should not depend on `presentation` or `data`.

If a lower layer imports from a higher layer, move the shared type, constant, or helper down into `domain` or `shared`.

---

## Target Source Layout

```text
src/
  app/
    AppProviders.tsx
    AppRouter.tsx
    navigation/
      routes.ts
      deepLinking.ts
  domain/
    models/
    constants/
    types/
  data/
    config/
    graphql/
      queries/
      mutations/
      subscriptions/
    mappers/
    services/
    repositories/
    models/
  presentation/
    assets/
    components/
    contexts/
    hooks/
    screens/
    styles/
    types/
  shared/
    hooks/
    types/
    utils/
```

This is an ideal blueprint, not a demand for a large rewrite. Move code toward this shape when touching nearby files.

---

## App Layer

`App.tsx` should become a thin boot entry. It should register the top-level shell and delegate the real work:

- `src/app/AppProviders.tsx` composes global providers such as auth state, feature flags, and any app-wide context.
- `src/app/AppRouter.tsx` owns active-route state, route-to-screen rendering, and navigation callbacks.
- `src/app/navigation/` owns route types, route helpers, and deep-link mapping.

Avoid letting `App.tsx` accumulate auth validation, deep-link handling, route state, provider composition, and manual screen rendering all at once. New navigation work should move toward the app layer instead of adding more weight to `App.tsx`.

A standard router library (e.g. React Navigation, Expo Router) is a reasonable option if flows become complex enough to justify it. Until then, keep any custom router isolated behind the app layer boundary.

---

## Domain Layer

`src/domain` should hold business-facing concepts that are not UI-specific and not API-specific:

- Core domain models for the product's main entities.
- Enums and constants used by more than one layer.
- Use-case-level types that services return and screens consume.

Use `domain` to fix leaky imports. For example, data services should not import `src/presentation/types`, and shared helpers should not import presentation constants. When a type is needed by both a service and a screen, it belongs in `domain` or `shared/types`.

Avoid empty architecture folders. If `domain/models`, `domain/constants`, or `domain/types` exist, they should contain real cross-layer contracts. Otherwise, remove placeholders until they are needed.

---

## Data Layer

`src/data` is the integration layer for external APIs and device-backed capabilities.

Responsibilities:

- Own endpoint details, auth token usage, GraphQL or REST queries/mutations/subscriptions, request bodies, response mapping, and error normalization.
- Hide API payload shapes behind app/domain-shaped service methods.
- Keep native APIs behind service boundaries with web-safe fallbacks where applicable.
- Keep mapping logic in `mappers/` and service payload models in `models/`.
- Add `repositories/` when a feature needs caching, composition across multiple services, or a stable domain-facing API over several backend calls.

Example service areas to fill in:

| Area | Files |
|---|---|
| Auth | _(e.g. `AuthService`, `AuthStorage`, `AuthStorage.web`)_ |
| Cloud / realtime | _(e.g. `ApiService`, GraphQL files)_ |
| Feature A | _(e.g. `FeatureAService`)_ |
| Feature B | _(e.g. `FeatureBService`)_ |
| Device / native | _(e.g. `DeviceService`, `DeviceService.web`)_ |

Data code should not import presentation components, presentation constants, or presentation types.

---

## Presentation Layer

`src/presentation` owns UI and interaction:

- `screens/` contains route-level screens and feature flows.
- `components/` contains reusable UI and feature-scoped components.
- `contexts/` exposes UI/app state to screen trees.
- `hooks/` contains UI and device hooks.
- `types/` contains presentation-only contracts such as tab definitions, screen props, and UI state.
- `styles/` contains UI labels, layout values, and style tokens.

Large screens and viewers should be split by responsibility:

- Stateful orchestration moves into feature hooks.
- Data loading moves into services, repositories, or feature hooks.
- Rendering components stay focused on layout and display.
- Heavy transformation or mapping logic moves out of screen files.

---

## Shared Layer

`src/shared` is for utilities and types that are generic across product areas:

- Generic hooks.
- Generic TypeScript helpers and utility functions.
- Cross-cutting types that do not encode UI or backend details.

`shared` must stay presentation-agnostic and data-agnostic. If a helper needs UI constants, it probably belongs in `presentation/utils`. If it needs API models, it probably belongs in `data/helpers` or `data/mappers`.

---

## Platform Boundaries

Rules for projects targeting multiple platforms (e.g. iOS, Android, web):

- Use `.web.ts` / `.web.tsx` files when web behavior differs from native.
- Keep platform-specific APIs inside services or hooks.
- Do not import native modules directly in screens when a service or hook can hide the platform difference.
- Keep web verification paths working even when native-only behavior needs separate simulator/device verification.

---

## Navigation Blueprint

Target navigation structure:

```text
src/app/AppRouter.tsx
  owns current route and route rendering

src/app/navigation/routes.ts
  owns route/screen types and route constructors

src/app/navigation/deepLinking.ts
  maps incoming URLs to routes

src/presentation/screens/**
  render screens and call navigation APIs
```

`App.tsx` should not keep growing with new screen cases, deep-link branches, and navigation callbacks. Put new routing work behind the router boundary.

---

## Quality Gates

Before relying on architecture changes, keep the validation path clean:

- `npm run lint`
- `npm test -- --runInBand --no-watchman`
- TypeScript checking when a script is available
- Targeted web verification through `npm run dev:web`
- Native simulator/device verification for native-only behavior

General cleanup priorities:

- Fix lint failures from unused variables before refactoring.
- Ensure tests are not Watchman-dependent in restricted environments; use `--no-watchman` when needed.
- Add CI or pre-merge checks for TypeScript, lint, and tests once the local gates are clean.

---

## Migration Order

Use this order when moving toward the target architecture:

1. Fix lint and failing tests so refactors have a trustworthy baseline.
2. Move shared/domain types and constants out of `presentation`.
3. Remove unused placeholder folders or populate them with real contracts.
4. Extract routing, provider composition, and deep-link handling from `App.tsx`.
5. Split large screens, viewers, and services along responsibility boundaries.
6. Expand README setup, environment, native build, testing, and linting docs.
7. Add CI or pre-merge quality gates.

Do this incrementally. The project does not need a full rewrite; it needs steady boundary tightening as features are touched.

---

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server / Expo with the dev client. |
| `npm run dev:web` | Start the web build. |
| `npm run ios` | Run the iOS target. |
| `npm run android` | Run the Android target. |
| `npm test` | Run Jest. |
| `npm run lint` | Run ESLint. |

_(Adjust commands to match your project's package.json scripts.)_

---

## Conventions

- Use `@/...` imports for source files (or the alias configured in your project).
- Keep API request/response shapes in `data`; keep business concepts in `domain`; keep UI-only contracts in `presentation`.
- Prefer constants/types for repeated labels, IDs, statuses, tab names, and route names.
- Do not let `data` or `shared` import from `presentation`.
- Introduce a repository only when it hides meaningful orchestration, caching, or multi-service composition.
- Check for web fallbacks before introducing native-only imports.
