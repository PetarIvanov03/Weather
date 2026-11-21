---
name: smoke-test
description: Run the weather app locally and check it in the built-in browser — load, search, hourly rail, 14-day list, hour/day popups, mobile and desktop widths, console errors. Use after any change to app.js, styles.css or index.html, or when asked to verify/test/check the app.
argument-hint: [area to focus on]
---

# Smoke test

There are no automated tests; this is the check. Be honest in the report about
what was and wasn't exercised.

## Start

- `preview_start` with name `weather` (from `.claude/launch.json`: `py -m http.server 8000`).
  If it's missing, create it — `python` on this machine is a Store stub, use `py`.
- Open `http://localhost:8000`. Geolocation won't resolve in the pane; use search.

## Checks (desktop width first, then `resize_window` preset `mobile`, reload)

1. **Load**: no errors in `read_console_messages` (onlyErrors). Network: forecast
   + air-quality requests return 200. Note: `index.html` `?v=` matches on both tags.
2. **Search**: type `Sofia` → dropdown with options; ↓/Enter selects; weather renders.
   Then an ambiguous name (`Dimitrovgrad`) shows several countries.
3. **Main screen**: hero temp/condition/H-L, background photo + `data-bg-dark`
   on `<html>`, UV/wind/humidity/sun cards filled (no `--`, `NaN`, `undefined`).
4. **Hourly rail**: 24 cards, first is "Now", scrolls horizontally, cards not cut mid-way.
5. **14-day list**: 14 rows with range bars.
6. **Hour popup**: click an hour → title, chart tabs switch, tiles render,
   ←/→ step hours, Esc closes and focus returns to the card.
7. **Day popup**: click a day → summary, hour strip, tiles; tap an hour in the
   strip → hour view with "← Back"; Back returns. Confidence tile appears once
   the ensemble request lands.
8. **Mobile**: bottom sheet, no horizontal page scroll, text legible. Check the
   smallest phones too: `resize_window` 360×740 and 375×667 (iPhone SE: short screen).
9. **Focus area** (if an argument was given): exercise the changed feature
   on both widths, including a missing-data case if you can reach one.

Grab `get_page_text`/`read_page` for text checks; screenshot only for layout.

## Finish

Reset with `resize_window` preset `desktop`. Report a short pass/fail list,
console errors quoted exactly, and anything not checked.
