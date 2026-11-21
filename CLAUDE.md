# CLAUDE.md

Static single-page weather app on GitHub Pages (`ivanovp.site`, see `CNAME`).
Vanilla JS + hand-written CSS, no build, no backend, no API keys. Data from
Open-Meteo (forecast, air quality, ensemble, geocoding) + BigDataCloud
(reverse geocode). README.md is the user-facing spec — read it before features.

## Priority #1: the live app works and people use it daily

`ivanovp.site` is in real daily use (installed as a PWA on phones). Keeping it
working beats any new feature, refactor or cleanup.

- Every change must leave existing behaviour intact unless the user explicitly
  asked to change it. When in doubt, don't ship it — ask.
- Prefer small, reversible changes. No big-bang rewrites; refactors go in steps,
  each verified on its own.
- Nothing reaches `main` unverified: `/smoke-test` (phones + desktop) before
  proposing a commit, `/release` before a push.
- If something could break for existing users (saved location, installed PWA,
  stale cached JS/CSS), call it out first — see "Ask first" #3.
- A regression on the live site is the top priority: fix or revert first,
  everything else waits.

## Hard rules (do not break without asking)

- **No build step, no framework, no npm deps, no bundler.** Plain `<script>`.
  New third-party script/CDN or new API host → ask first.
- **No API that needs a key.** Anything keyed would force a backend; out of scope.
- **Three source files.** `index.html` (markup + meta), `app.js` (all logic),
  `styles.css` (all styling). Don't split into modules/new files unless agreed.
- **Scope discipline.** Change only what the task needs. No drive-by refactors,
  renames, reformatting, or "while I'm here" fixes — list them as suggestions instead.
- **Every `app.js`/`styles.css` change → bump `?v=` on BOTH tags in `index.html`
  to the same new number.** Pages CDN caches JS/CSS ~10 min, `index.html`
  always revalidates; without the bump new HTML pairs with stale JS/CSS.
- **README stays in sync.** Feature, data source, threshold or limitation
  changes → update the matching README section in the same change.

## Ask first (always)

Three things are the user's call, never yours. Ask, wait for the answer, then act.

1. **Commit and push.** Never commit or push on your own, not even at the end of a
   finished task. When the work is done: show what changed (files + a short summary),
   propose a commit message (subject ≤ 60 chars, imperative, body = what & why) and
   ask. Commit only when the user says so in that message ("commit", "къмитни");
   push only when they also say push. One approval = one commit, it does not carry
   over to the next change. Pushing `main` deploys to Pages, so say that when asking.
   `git push` is also denied in `.claude/settings.json`: if the user asks for a
   push, say so and let them run it (or remove the deny), don't work around it.
2. **When unsure.** Unclear request, two reasonable ways to do it, a product or
   wording decision, or something in the existing code that looks wrong → ask one
   short question with your recommendation first. Don't guess and don't build
   both. Pure implementation details you can decide from the code: decide, and
   mention them in the report.
3. **Breaking changes.** Anything that changes what existing users already have:
   - `localStorage['weatherLastLocation']` key or schema (`v: 1`): a change needs
     a migration that reads the old shape;
   - URLs: domain/`CNAME`, file names, `manifest.json` (`start_url`, `scope`, name,
     icons) — an installed PWA keeps the old ones;
   - removing or renaming a feature, changing units, defaults or how a value is computed;
   - a new data host, third-party script or font, or anything in "Hard rules".
   Say what breaks for whom and how you'd migrate, then wait.

Staging and showing diffs is fine. Before editing, check `git status`: there may be
the user's own uncommitted work; leave unrelated changes alone and never revert them.

## Working with the user

- Reply in the user's language (Bulgarian); code, comments, commits and docs in English.
- Short answers. Plan as a task list, then do it; for features use `/feature` (spec first).
- Report honestly: what changed (file + section), what was verified and how, what
  was NOT verified. Never claim a check you didn't run.
- Phones first: check UI at 360, 375 (short, 375×667), 390 and 393 px and on desktop
  ≥ 768 px. Real devices in use include iPhone SE, iPhone 13, Redmi Note 8 Pro,
  Honor 600 Smart.
- The repo is public: no secrets, personal data or private screenshots in it.

## app.js map

One `DOMContentLoaded` closure, sections marked by `/* ===== Title ===== */`
banners (find by title, line numbers drift). In order:

| Section | What lives there |
|---|---|
| UI strings | `TXT` — every user-visible string; `CONDITIONS` (WMO code → name) |
| WMO code groups | `RAIN_/SNOW_/THUNDER_/FOG_CODES` |
| Weather icon set | `ICONS` inline SVG factories, `getIcon(code, isDay, size)` |
| Background selection | `CARD_COLORS`, `BG_FILES`, `GRAD`, `bgCategory`, `timeBucket`, `pickBackground`, `applyBackground` |
| Formatting helpers | UV/compass/time/day-name formatters (24h, API times already local) |
| DOM references / state | `lastRender {data, meta, airQuality, ensemble}`, `lastCoords`, abort controllers |
| Hourly rail controls | wheel→horizontal, chevron paging, scroll-position line, end fade (card widths are CSS) |
| State screens | `showState('loading'|'error'|'empty'|'none')` |
| Rendering | `renderHourly`, `renderDaily`, `renderWeather` |
| Last-location persistence | `localStorage['weatherLastLocation']` (schema `v: 1`) |
| Weather fetch | URL builders, `fetchWeatherData`, `refreshSilently`, lazy `ensureEnsembleLoaded` |
| Detail chart | `CHART_TABS` config, `mountChartTabs` SVG component |
| Detail popup content | **all thresholds/word tables** (`*_WORDS`, `THUNDER_*`, `POLLEN_LEVELS`, `AQI_BANDS`…), hour tiles, AQ/pollen |
| Day popup — aggregation and wording | day-scoped thresholds (`PRECIP_WINDOW_*`, `SUMMARY_*`…), aggregation, summary sentence, day tiles |
| Detail popup (hour/day) | open/close/navigate, focus trap, drag-to-dismiss, delegated triggers |
| Search + autocomplete | geocoding, combobox keyboard/ARIA |
| Geolocation on load | saved location first, else geolocate, else empty state |

## Code conventions (match existing code)

- `const` arrow functions, 4-space indent, single quotes, template-literal HTML
  rendered via `innerHTML`. Event delegation on containers (`rail`,
  `uiForecastList`, `detailBodyEl`) — don't attach per-card listeners.
- **Strings:** new user-visible text goes in `TXT` (English only), including
  aria-labels; word scales in `TXT.words`, their numeric bounds in the threshold tables.
- **Tunables:** new cutoffs/thresholds are named `UPPER_SNAKE` constants at the
  top of "Detail popup content" (hour) or "Day popup" (day-only), word scales as `[upperBound, word]` tables read by `wordFor()`.
- **Null safety:** read API arrays via `hourlyValue`/`dailyValue`/`fmtOr`;
  missing data renders `DASH` or hides the tile (return `''`), never `NaN`/`undefined`.
- **Escaping:** any API/user string into `innerHTML` goes through `escapeHtml`
  (defined in "Search + autocomplete"; geocoding names etc.). `formatUv` can return `<1` → use `uvTextHtml`.
- **Async races:** capture `const target = lastCoords` before awaiting; drop the
  result if `lastCoords !== target`. Main fetch uses `AbortController`.
  Secondary data (AQ, ensemble) is best-effort: failure → `null`, UI still works.
- **New Open-Meteo variable:** add to the URL builder in "Weather fetch", then
  update README "Data sources". Keep request count per location low.
- **CSS:** tokens on `:root`; dark-photo variant via `[data-bg-dark="true"]`
  (set by `applyBackground`, not a theme toggle). Single breakpoint `768px`
  (mobile-first, `@media (min-width: 768px)` desktop). `:hover` only inside
  `@media (hover: hover)`. Animations need a `prefers-reduced-motion` fallback.
  Text is always light on photo — check contrast on bright day and dark night scenes.
- **A11y:** clickable non-buttons get `role="button" tabindex="0"` + Enter/Space;
  popups keep focus trap + Esc + focus restore; combobox keeps `aria-activedescendant`.
- **Mobile/iOS:** inputs stay ≥16px on touch (no zoom-on-focus); respect
  `env(safe-area-inset-*)`; bottom sheet on mobile, centered dialog ≥768px.

## Running / verifying

No test suite. Verify in a browser:

```sh
py -m http.server 8000     # Windows here: `python` is a Store stub, use `py`
```

Open <http://localhost:8000> (geolocation needs localhost/HTTPS, not `file://`).
Use `/smoke-test` for the standard check, `/release` before shipping.

## Known quirks

- No CSS framework. `styles.css` opens with an inlined subset of Tailwind
  Preflight (the page was built on it); keep it first — layout depends on it
  (`line-height: 1.5`, `svg { display: block }`, button/input resets, `p` margins).
- `.gitignore` commits only `.claude/skills/`, `.claude/settings.json`,
  `.claude/launch.json`; `settings.local.json` etc. stay private.
