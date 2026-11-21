---
name: feature
description: Scoped workflow for adding or changing a feature in this weather app — agree a short spec first, implement inside the CLAUDE.md conventions, then verify and sync README. Use when the user asks for a new feature, UI change, new data/tile/popup section, or a behaviour change.
argument-hint: <what to build>
---

# Feature workflow

Goal: ship exactly what was agreed, in the existing style, nothing extra.

## 1. Spec before code

Read the relevant README section and the `app.js` sections from the CLAUDE.md
map. Then write a short spec back to the user (in their language) and wait for an OK:

- **What** changes for the user (1–3 bullets), mobile and desktop.
- **Where**: which `app.js` sections, `styles.css` blocks, `index.html` markup.
- **Data**: new Open-Meteo variables / endpoints? (new host or keyed API → stop, ask).
- **New strings** (→ `TXT`) and **new thresholds** (→ named constants).
- **Out of scope**: what you will deliberately NOT touch.
- **Open questions** — only real ones.

Skip the wait only if the user already gave a precise spec or said "just do it".

## 2. Implement

- Follow CLAUDE.md "Code conventions". Copy the pattern of the nearest sibling
  (a new tile looks like the existing tiles, a new chart tab is a `CHART_TABS` entry).
- Missing data must degrade: hide the tile or show `DASH`, never `NaN`.
- Async data: race guard (`lastCoords !== target`), best-effort failure → `null`.
- No new files, deps, or refactors beyond the spec. Spotted something else?
  Note it for the final summary instead of fixing it.

## 3. Close out

1. Bump `?v=` on both tags in `index.html` (same number) if `app.js`/`styles.css` changed.
2. Update README (Features / Detail popups / Data sources / thresholds / limitations) as needed.
3. Run `/smoke-test`, focused on the changed area.
4. Report: what changed (file + section), what was verified, what was not,
   and the out-of-scope notes.
5. Ask before committing (CLAUDE.md "Ask first"): propose the commit message and
   wait. Commit only on an explicit "commit" in the user's reply; never push on your own.

If anything turns out to be a breaking change (CLAUDE.md "Ask first" #3) or the spec
no longer fits, stop and ask before continuing.
