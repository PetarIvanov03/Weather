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
- **Search autocomplete** — debounced, up to 8 disambiguated matches (`name, region, country`) so same-named cities like Dimitrovgrad in Bulgaria and in Russia are both reachable; full keyboard support (↑/↓, Enter, Esc) with `aria-activedescendant` tracking the highlighted option
- **Geolocation on load** — with reverse geocoding for the place name, falling back to search if denied
- **Last location remembered** — the most recent result is saved to `localStorage` and restored on the next visit
- **Auto-refresh on return** — if the tab regains focus more than 10 minutes after the last fetch, the app silently re-fetches in the background; the header clock ticks forward once a minute between fetches so the local time never sits frozen
- **State screens** — designed loading, error with retry, and location-not-found states
- **Responsive** — stacked on mobile, 70/30 split (weather panel / 14-day column) from 768px up

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
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | `current` (temperature, humidity, apparent temperature, weather code, wind, dew point, is_day), `hourly` (temperature, weather code, precipitation probability, wind, UV index, is_day), `daily` (weather code, min/max temperature, UV max, sunrise/sunset, precipitation probability max) — 14 days, `forecast_days=14&timezone=auto` |
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
- **Stacking** — the search row is `z-30` because the `animate-fade-in` sections create their own stacking contexts; without it the autocomplete dropdown paints beneath the weather card
- **Localisation** — English only; all strings live in a single `TXT` object in `app.js`

## Known limitations

- No automated tests
- English only, with no language switching
- Forecast accuracy is whatever Open-Meteo provides; there is no second source to cross-check against
