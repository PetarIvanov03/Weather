# Weather

Single-page weather app. Search any city with autocomplete or use your current location to see live conditions, an hourly rail, and a 14-day forecast. Powered by the free [Open-Meteo](https://open-meteo.com/) API — no API key, no backend, no build step.

![JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E)
![Tailwind](https://img.shields.io/badge/Tailwind-CDN-06B6D4)
![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8)
![Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222)

**Live:** [ivanovp.online](https://ivanovp.online)

## Architecture

No framework, no bundler, no server. Everything runs in the browser.

```
index.html   → markup, PWA/social meta, design tokens (CSS custom properties)
app.js       → fetching, rendering, icons, backgrounds, search, state screens
styles.css   → glass cards, layout, day/night contrast rules
manifest.json → PWA manifest
assets/
  backgrounds/  16 category × time-of-day WebP photos
  icons/        generated favicon / apple-touch / PWA sizes
  og-image.png  social link-preview image
CNAME          custom domain for GitHub Pages
```

**Background system.** `bgCategory()` maps the current WMO weather code to one of six categories (clear, partly cloudy, overcast, fog, rain, snow). `timeBucket()` picks day / night / sunrise / sunset from the current time against that day's sunrise and sunset, using a ±45 minute window. `pickBackground()` resolves `category-bucket` to a file, falling back to `category-day` or `category-night` when no sunrise/sunset photo exists for that category. `applyBackground()` crossfades two stacked layers so the swap has no flash, and sets the `--card` accent from `CARD_COLORS` to match the photo.

## Design decisions

**1. No framework and no build step**
Plain HTML, vanilla JS, and Tailwind via CDN. The app is one page with a handful of components and no shared state beyond the current forecast — a framework would add a build pipeline and a dependency tree for no behaviour that isn't already straightforward here. The cost is manual DOM updates and no type checking; at a larger scope that trade flips.

**2. Fully client-side, because the API needs no key**
Open-Meteo requires no authentication, so there is nothing to hide and no reason for a backend. That makes the whole app a static deploy on GitHub Pages with no server to run, no secrets to manage, and no cold starts. A keyed weather API would have forced a proxy layer purely to keep the key off the client.

**3. Contrast follows the weather, not a theme toggle**
Text is always light because it sits on a real photograph. `[data-bg-dark]` on `<html>` is set from whether the current background is a night scene, and switches scrim opacity plus a few contrast-sensitive rules so both light and dark photos stay legible. There is no separate light/dark switch — the background already determines what the UI needs, and a toggle would let the user pick the unreadable combination.

**4. Cache-busting via `?v=` on GitHub Pages**
The Pages CDN caches `app.js` and `styles.css` for about ten minutes while `index.html` always revalidates. Without intervention, fresh HTML can point at a URL that still resolves to a stale script for up to ten minutes after deploy. Bumping the `?v=` query string on both tags makes it a new URL as far as the CDN is concerned, so the update is fetched immediately.

```html
<link rel="stylesheet" href="styles.css?v=2">
<script src="app.js?v=2"></script>
```

**5. Exact-multiple rail width via `ResizeObserver`**
The hourly rail uses CSS scroll snap, which only lands cleanly if the container is an exact multiple of the card unit (84+6px mobile, 90+10px desktop). A `ResizeObserver` recomputes the width on every resize so each swipe ends on a whole number of cards instead of a sliced one. Vertical wheel input is translated to horizontal scroll on desktop.

## Features

- **Current conditions** — temperature, condition, feels-like, today's high and low
- **Hourly rail** — next 24 hours with icon, temperature, precipitation probability, wind, and UV index; horizontally scrollable with snap
- **14-day forecast** — day, icon, precipitation %, and low/high with a range bar scaled to the forecast's global min and max
- **Detail cards** — UV index (current-hour value, level label, gauge, plus the day's peak), wind (speed, compass direction, rotating arrow), humidity with dew point, sunrise and sunset
- **Hour/day detail popups** — tap an hour or a day for a chart plus a full tile grid: precipitation, wind, humidity, pressure, clouds, visibility, UV, thunderstorm risk, snow, air quality, pollen, and a forecast-confidence rating — see [Detail popups](#detail-popups)
- **Search autocomplete** — debounced, up to 8 disambiguated matches (`name, region, country`) so same-named cities like Dimitrovgrad in Bulgaria and in Russia are both reachable; full keyboard support (↑/↓, Enter, Esc) with `aria-activedescendant` tracking the highlighted option
- **Geolocation on load** — with reverse geocoding for the place name, falling back to search if denied
- **Last location remembered** — the most recent result is saved to `localStorage` and restored on the next visit
- **Auto-refresh on return** — if the tab regains focus more than 10 minutes after the last fetch, the app silently re-fetches in the background; the header clock ticks forward once a minute between fetches so the local time never sits frozen
- **State screens** — designed loading, error with retry, and location-not-found states
- **Responsive** — stacked on mobile, 70/30 split (weather panel / 14-day column) from 768px up

## Detail popups

Clicking an hour on the rail, or a row in the 14-day list, opens a detail popup — a bottom sheet on mobile, a centered dialog from 768px up — built around a shared tabbed chart (`mountChartTabs`) and a grid of tiles.

- **Hour popup** — hero (icon, condition, temperature, feels-like), a confidence badge, a ±12-hour chart, then tiles for precipitation, wind, humidity, pressure (3 h trend), clouds, visibility, UV, an *estimated* thunderstorm risk, and snow (shown only when relevant that hour). Air quality (AQI band, leading pollutant, pollutant chips, dust, haze) and pollen sections follow, when the data covers that hour.
- **Day popup** — hero with a high/low and feels-like range, a one-line comparison with the neighbouring day, a generated summary sentence, the same chart windowed to that day, a horizontally-scrollable hour strip (tapping an hour opens its hour popup, with a "← Back" to return), then daily-aggregate tiles — precipitation with a wet-window list, wind, sun (arc + daylight/sunshine), UV protection window, moon phase, humidity/pressure/cloud aggregates, thunderstorm, snow, and a forecast-confidence tile.

Data source per section: the hero, chart and weather tiles come from the same Forecast request as the main screen (see [Data sources](#data-sources) for the full variable list); the air-quality and pollen sections come from the Air Quality API — pollen stops covering roughly 20 hours before the rest of AQ does, so the two sections can disagree on whether they have data for a given hour; the confidence tile/badge comes from the Ensemble API, fetched lazily (only once a popup is first opened for the current location) and cached per-location on `lastRender.ensemble`.

**Derived client-side**, not returned by any API: thunderstorm risk (from CAPE + lifted index + weather code), the day summary sentence, precipitation windows (merged runs of wet hours), the UV protection window, the comfort/visibility/haze words, the sun-arc position, the moon-phase glyph, the neighbouring-day comparison, and the ensemble spread → confidence level.

**Tuning the approximate thresholds** — every cutoff is a named constant grouped near the top of the "Detail popup content" section of `app.js`:
- Thunderstorm risk: `THUNDER_CAPE_STEPS` / `THUNDER_LI_STEPS` (CAPE in J/kg, lifted index in °C; an explicit thunder `weather_code` floors the result at "moderate")
- Pollen level bands: `POLLEN_LEVELS` (grains/m³ — Open-Meteo publishes no official scale; these are widely-used rough thresholds, not a medical reference)
- Forecast confidence: `ENSEMBLE_SPREAD_HIGH_C` / `ENSEMBLE_SPREAD_MEDIUM_C` (p90−p10 of ensemble members' daily mean temperature, °C), with `LOW_CONFIDENCE_FROM_DAY` as the lead-time fallback used before the ensemble request resolves
- Wind/dew-point/visibility/haze words, the snow-tile cutoff, and the pressure-steady bands sit in the same section as small `[upper bound, word]` tables read by a shared `wordFor()` lookup — edit a table to change a wording or a threshold

**Attribution** — both popups end with a muted credit line: "Weather data by Open-Meteo.com" always, plus "Air quality: CAMS ENSEMBLE (Copernicus) via Open-Meteo" whenever that specific hour or day actually has air-quality or pollen content on screen (not just the "forecast covers ~4–5 days" fallback message).

## Design

The UI implements a Claude Design project (mobile and desktop pages) as one responsive page.

- **Glassmorphism cards** — translucent layered backgrounds with `backdrop-filter: blur(18px)`
- **Soft SVG icon set** — sun, moon, cloud and rain from the design, extended in the same style with partly-cloudy (day and night), snow, fog and thunder to cover all WMO codes
- **Typography** — Inter, thin-weight hero type (100–108px), uppercase tracked labels
- **Branding** — app icon at `assets/icon.png`, with favicon, apple-touch and PWA sizes generated into `assets/icons/`; `manifest.json` plus Open Graph and Twitter tags make the app installable and give it a proper link preview

## Data sources

All client-side, all free, no keys.

| API | Used for |
|---|---|
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | `current`, `hourly` and `daily` conditions for the main screen and both detail popups — temperature, precipitation, wind, humidity, pressure, cloud layers, visibility, UV, CAPE/lifted index, freezing level, sun and moon times — 14 days, `forecast_days=14&timezone=auto` |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | European AQI, pollutant concentrations and pollen — fetched alongside the main forecast, `forecast_days=5`; powers the popups' air-quality and pollen sections |
| [Open-Meteo Ensemble](https://open-meteo.com/en/docs/ensemble-api) | `ecmwf_ifs025` (51-member) hourly temperature, used for the forecast-confidence tile/badge — fetched lazily, only once a detail popup first opens for the current location |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search and autocomplete |
| [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) | Place name for browser geolocation coordinates |

Conditions and icons are mapped from [WMO weather interpretation codes](https://open-meteo.com/en/docs#weather_variable_documentation). In-flight requests are cancelled with `AbortController` when a new search starts.

## Running locally

No build step. Serve the folder with any static server — geolocation needs `http://localhost` or HTTPS, not `file://`:

```sh
python -m http.server 8000
# or: npx serve
```

Then open <http://localhost:8000>.

## Implementation notes

- **iOS Safari** — text inputs are forced to a 16px computed font size on touch viewports, with compensating line-height, to prevent Safari's zoom-on-focus
- **Safe areas** — the viewport meta tag sets `viewport-fit=cover` so `env(safe-area-inset-*)` resolves to real values (without it Safari clamps every inset to 0); the detail popup's bottom sheet uses it for the home-indicator area and, in landscape, the left/right notch
- **Stacking** — the search row is `z-30` because the `animate-fade-in` sections create their own stacking contexts; without it the autocomplete dropdown paints beneath the weather card
- **Localisation** — English only; all strings live in a single `TXT` object in `app.js`

## Known limitations

- No automated tests
- English only, with no language switching
- Forecast accuracy is whatever Open-Meteo provides; there is no second source to cross-check against
