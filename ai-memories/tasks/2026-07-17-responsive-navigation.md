# Task: Responsive navigation and mobile action dock

- **Date**: 2026-07-17
- **Status**: Completed
- **Related**: `ai-memories/memories/systemPatterns.md` (shared `Navbar` / `ScrollToTop` layout)

## Problem / Goal

Opening the navigation currently removes the page scrollbar, causing the viewport width to change and page content to shift horizontally. Rework the responsive navigation so the layout stays stable while the menu is open. On phone and tablet viewports, replace the standalone back-to-top control with a permanently visible lower-right action dock: round icon buttons for back to top, language, and menu. Language and menu each open a secondary options panel; choosing a language closes its panel. The header navigation should no longer expose language/menu controls and should instead expose a contact-us action.

## Core approach

Replace the full-viewport, scroll-locking drawer with a compact action-dock panel. This keeps the document scrollbar present, so opening and closing language/navigation options cannot change the layout width. Reuse existing i18n and navigation link generation, keeping markup accessible with native buttons, labels, and expanded states. Use CSS media queries for the action dock and desktop/header variants rather than duplicating page-specific navigation.

## Affected files / modules

- `frontend/src/components/navbar/*` — navigation markup, drawer state, language/menu option panels, and scroll-lock handling.
- `frontend/src/components/scroll-to-top/*` — integrate or replace the standalone mobile back-to-top control in the shared dock.
- `frontend/src/styles/*` and component SCSS — responsive positioning, icon buttons, overlay compensation, and drawer/panel styling.
- `frontend/src/i18n/locales/*.json` — only if new accessible labels or contact button copy are not already available.
- `ai-memories/memories/activeContext.md` / `progress.md` — completion context and reusable outcomes.

## Step-by-step plan

- [x] Step 1: Inspect the shared navbar, scroll-to-top component, existing icon system, i18n keys, and responsive breakpoints; record exact integration points.
- [x] Step 2: Remove the scroll-locking navigation overlay so the browser scrollbar remains present and opening options cannot reflow the document.
- [x] Step 3: Build the mobile/tablet lower-right action dock with always-visible round back-to-top, language, and menu buttons; reuse existing language and navigation data in their secondary panels and close the language panel after selection.
- [x] Step 4: Simplify the header navigation by removing language/menu controls and adding the contact-us action, preserving desktop navigation behavior.
- [x] Step 5: Validate keyboard escape handling, language switching, and production/type builds; document discoveries and update the Memory Bank.

## Debug Notes

> Add material debugging findings and design changes here as they occur.

- 2026-07-17: Initial request identifies scrollbar disappearance during menu open as the visible source of horizontal page reflow.
- 2026-07-17: The previous `body.navbar-menu-open { overflow: hidden; }` was the direct cause. The new action dock has no full-screen overlay or scroll lock, which removes both the cause and the need for scrollbar-width compensation.
- 2026-07-17: `npm run build` is blocked by the local PowerShell execution policy; `npm.cmd run build` completes successfully when permitted to access Vite's parent-directory config resolution.

## Lessons Learned

> Fill in at task completion and copy reusable conclusions into the Memory Bank when appropriate.

- A persistent contextual action dock is a simpler mobile navigation pattern than a modal drawer when page scrolling should remain visually stable.
- Keep the shared desktop scroll-to-top button hidden below the mobile breakpoint when its behavior moves into the mobile dock, avoiding duplicate controls.
