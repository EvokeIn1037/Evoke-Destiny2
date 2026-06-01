# AGENTS.md

Orientation for agents working in this repo. For stack/file-layout details, read [ARCHITECTURE.md](ARCHITECTURE.md) -- this document is about **what we're building and why**. Read both.

---

## What this project is

**[Project Name]** is a [brief description of what the app/service does and who it's for].

[Describe the system it integrates with, its primary data flows, and any notable platform constraints or split (e.g. native vs. web, client vs. server).]

If older documentation, skills, or comments conflict with [Project Name], treat that as stale context and update it before relying on it.

Reference trees may ship in the repo for comparison only; they are not part of the build:

| Path | What it is |
|---|---|
| `reference/` | Reference implementation or prior codebase. Use for comparison only; not the source of truth for this project. |

---

## Product areas

- **[Area 1]**: [what it covers].
- **[Area 2]**: [what it covers].
- **[Area 3]**: [what it covers].
- **[Area N]**: [what it covers].

---

## Working norms

- **Strategic / context-setting prompts** ("here's what we're doing, look into things") -> research and converse, don't pre-empt with edits.
- **Tactical prompts** ("fix this bug", "rename this") -> proceed normally.
- **Keep platform differences explicit** -- environment-specific behavior belongs behind a service or platform-specific file, not scattered through shared code.
- **When a feature fits a future phase**, flag it as such instead of scope-creeping the current one.

## Coding principles

- **Simple beats clever.** Ship the approach that solves the problem in front of us and reads well.
- **Folder boundaries are semantic.** Each top-level folder owns a distinct layer; don't reach across layers without a clear reason.
- **Strings are bugs.** Use existing types/constants for values referenced in more than one place -- routes, statuses, event names, and API payload shapes.
- **Comments are bugs too.** Default to none. Only write a short comment when the why is genuinely non-obvious.

## Running the app

- `[command to start dev server]`
- `[command to run tests]`
- `[command to run lint]`
- `[any additional platform-specific run commands]`

## Verification

Prefer the lightest verification that exercises the change:

- Docs/config-only changes: inspect the edited files and run targeted searches for stale wording.
- UI or browser-flow changes: use the web/dev build.
- Platform-specific changes: run type/lint/tests where possible and clearly state what still needs device or environment verification.
- Service changes: cover success, error, and missing-data paths where the existing test harness allows it.

Do not start unrelated servers or reset user state unless the task requires it.
