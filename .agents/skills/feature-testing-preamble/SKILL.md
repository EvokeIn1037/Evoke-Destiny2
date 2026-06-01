---
name: feature-testing-preamble
description: Generic preamble for browser-driven feature testing. Navigates to the running web build, waits for the app shell to load, and lands on the target feature screen. Customize the numbered steps for your project's navigation and entry point.
---

# Feature Testing Preamble

Universal setup for browser verification of a feature flow. Execute this skill before any feature-specific testing steps.

## When to use

Before driving any browser-based feature verification that starts from the app's home screen.

Skip this skill when you only need to verify a screen that can be reached directly by URL.

## Prerequisites

- The dev web server is running (e.g., `npm run dev:web`). Port is in `.dev-port` if present.
- Browser automation MCP is available.
- The app is authenticated. If navigation lands on a sign-in screen, stop and ask the user to refresh authentication before continuing.

## Steps

1. Read `.dev-port` if present to get `<port>`. If absent, use the known dev URL for the running session.
2. Navigate to `http://localhost:<port>`.
3. Take a snapshot and wait for the app shell to finish loading (no spinners, no global loading indicators).
4. Wait for any global loading state to clear before interacting with navigation items.
5. Click the target navigation item (e.g., a tab or sidebar link for the feature area).
6. Wait for the feature screen to fully load. Snapshot and confirm the expected heading or landmark is visible before continuing.
7. Trigger the feature entry point (e.g., click `+ New Item`, open a modal, or select a record).

## Postcondition check

Pass condition: the browser is on the expected feature screen and the entry-point action has been triggered successfully.

If the entry point is missing or disabled after loading finishes, capture the snapshot state and diagnose the screen before continuing.

## Not in scope

- Does not fill in form fields or submit data.
- Does not wait for async operations triggered by the entry point to complete.
- Does not reset app state or clear existing records.
