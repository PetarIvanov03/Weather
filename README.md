# Weather

A single-page weather app. Search any city (with autocomplete) or use your current location to see live conditions, an hourly rail, and a 14-day forecast — powered by the free [Open-Meteo](https://open-meteo.com/) API, no API key required.

**Live:** [ivanovp.online](https://ivanovp.online) (GitHub Pages)

## Features

- **Current conditions** — temperature, condition, feels-like, and today's high/low
- **Hourly forecast rail** — the next 24 hours with per-hour icon, temperature, precipitation probability, wind, and UV index; horizontally scrollable with snap so each swipe lands on a whole number of cards
- **14-day forecast** — day, icon, precipitation %, and low/high with a temperature-range bar scaled to the forecast's global min/max
- **Detail cards** — UV index (current-hour value, level label, gauge bar, with the day's peak shown alongside as "Low · Max 8"), wind (speed, compass direction, rotating arrow), humidity (+ dew point), sunrise/sunset
- **Search autocomplete** — type (debounced) or submit to get up to 8 disambiguated matches (`name, region, country`), so same-named cities like Dimitrovgrad (Bulgaria) vs. Dimitrovgrad (Russia) are both reachable; full keyboard support (↑/↓, Enter, Esc) with `aria-activedescendant` tracking the highlighted option
- **Geolocation on load** — with reverse geocoding for the place name; if denied, the app falls back to search
- **Photographic backgrounds** — 16 real WebP photos in `assets/backgrounds/`, one per weather category (clear, partly cloudy, overcast, fog, rain, snow) × time-of-day bucket (day, night, and — where a photo exists — sunrise/sunset within a ±45min window of the actual sunrise/sunset). A two-layer crossfade swaps images without a flash, and each photo drives a matching `--card` accent color from `CARD_COLORS`. A muted oklch gradient is the fallback for any category/bucket combination without a photo.
- **English-only UI** — no language switching; all strings live in a single `TXT` object in `app.js`
- **Last location remembered** — the most recent search or geolocation result is saved to `localStorage` and reloaded automatically on the next visit
- **Auto-refresh on return** — if the tab regains focus more than 10 minutes after the last fetch, the app silently re-fetches the current location in the background (no loading screen, no flicker); the header clock also ticks forward once a minute between fetches so the displayed local time never sits frozen
- **State screens** — designed loading, error (with retry), and location-not-found / empty states
- **Responsive** — stacked layout on mobile, 70/30 split (weather panel / 14-day column) from 768px up

## Design

The UI implements a Claude Design project (mobile + desktop pages) as one responsive page:

- **Glassmorphism cards** — translucent layered backgrounds with `backdrop-filter: blur(18px)`
- **Photo-driven contrast** — text is always light (it sits on a real photo); `[data-bg-dark]` on `<html>` — set from whether the current background image/bucket is a night scene — switches scrim opacity and a couple of contrast-sensitive rules so light and dark photos both stay legible. There is no separate theme toggle; it follows the weather.
- **Soft SVG icon set** — sun / moon / cloud / rain from the design, extended in the same style with partly-cloudy (day & night), snow, fog, and thunder to cover all WMO weather codes
- Inter, thin-weight hero type (100–108px), uppercase tracked labels

**Icon / branding** — the app icon (sun with a cloud in front, matching the soft glassmorphism weather theme) lives at `assets/icon.png`, with favicon, apple-touch, and PWA sizes generated into `assets/icons/`. `manifest.json` and Open Graph / Twitter card tags in `index.html` make the app installable and give it a proper link-preview image (`assets/og-image.png`).

## Data sources

All client-side, all free, no keys:

| API | Used for |
|---|---|
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | `current`: temperature, relative humidity, apparent temperature, weather code, wind speed/direction, dew point, is_day · `hourly`: temperature, weather code, precipitation probability, wind speed, UV index, is_day · `daily`: weather code, min/max temperature, UV index max, sunrise/sunset, precipitation probability max — 14 days, requested with `forecast_days=14&timezone=auto`. The UV card reads `hourly.uv_index` at the current hour and shows `daily.uv_index_max[0]` alongside it as the day's peak. |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City search / autocomplete (up to 8 matches with name, region, country, lat/lon) |
| [BigDataCloud Reverse Geocoding](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) | Place name for browser geolocation coordinates |

Weather conditions and icons are mapped from [WMO weather interpretation codes](https://open-meteo.com/en/docs#weather_variable_documentation). In-flight requests are cancelled with `AbortController` when a new search starts.

## Running locally

No build step — it's plain HTML + vanilla JS with Tailwind via CDN. Serve the folder with any static server (geolocation needs `http://localhost` or HTTPS, not `file://`):

```sh
python -m http.server 8000
# or: npx serve
```

then open <http://localhost:8000>.

## Project structure

```
index.html            # markup, PWA/social meta tags, design tokens (CSS custom properties)
app.js                 # all logic: fetching, rendering, icons, backgrounds, search, states
styles.css              # design system: glass cards, layout, day/night contrast rules
manifest.json          # PWA manifest (icons, theme/background color, standalone display)
assets/icons/          # generated favicon / apple-touch / PWA icon sizes
assets/backgrounds/    # 16 category × time-of-day WebP photos for the background system
assets/og-image.png    # social link-preview image (Open Graph / Twitter card)
CLAUDE.md               # deploy/cache-busting rule and git conventions for AI-assisted edits
CNAME                  # GitHub Pages custom domain
```

## Deploying

GitHub Pages' CDN caches `app.js` and `styles.css` for about 10 minutes, but `index.html` always revalidates. That means a plain edit to either file can leave old HTML pointing at a URL that still resolves to the stale cached script/stylesheet for up to 10 minutes after deploy.

To force an immediate refresh, bump the `?v=` query string on **both** tags in `index.html` whenever `app.js` or `styles.css` changes:

```html
<link rel="stylesheet" href="styles.css?v=2">
<script src="app.js?v=2"></script>
```

A new `?v=` is a new URL as far as the CDN is concerned, so the updated file is fetched immediately instead of waiting out the cache window.

## Implementation notes

- **Background system** — `bgCategory()` maps the current WMO weather code to one of six categories; `timeBucket()` picks day/night/sunrise/sunset from the current time versus that day's sunrise/sunset (±45min window); `pickBackground()` resolves `category-bucket` to a file in `assets/backgrounds/`, falling back to `category-day`/`category-night` when a sunrise/sunset photo doesn't exist for that category. `applyBackground()` crossfades two stacked layers (mobile full-bleed + desktop blurred surround, and the desktop crisp panel photo) and sets `--card` from `CARD_COLORS` for a matching accent.
- **Hourly rail sizing** — a `ResizeObserver` keeps the rail width at an exact multiple of the card unit (84+6px mobile, 90+10px desktop) so snap scrolling always shows whole cards; vertical mouse-wheel input is translated to horizontal scroll on desktop.
- **iOS Safari** — text inputs are forced to a 16px computed font-size on touch/mobile viewports (with compensating line-height) to prevent Safari's zoom-on-focus.
- **Stacking** — the search row is `z-30` because the `animate-fade-in` sections create their own stacking contexts; without it the autocomplete dropdown would paint beneath the weather card.
