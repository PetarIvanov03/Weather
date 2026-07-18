# Weather

A single-page weather app. Search any city (with autocomplete) or use your current location to see live conditions, an hourly rail, and a 7-day forecast — powered by the free [Open-Meteo](https://open-meteo.com/) API, no API key required.

**Live:** [ivanovp.online](https://ivanovp.online) (GitHub Pages)

## Features

- **Current conditions** — temperature, condition, feels-like, and today's high/low
- **Hourly forecast rail** — the next 24 hours with per-hour icon, temperature, precipitation probability, wind, and UV index; horizontally scrollable with snap so each swipe lands on a whole number of cards
- **7-day forecast** — day, icon, precipitation %, and low/high with a temperature-range bar scaled to the week's global min/max
- **Detail cards** — UV index (value, label, gauge bar), wind (speed, compass direction, rotating arrow), humidity (+ dew point), sunrise/sunset
- **Search autocomplete** — type (debounced) or submit to get up to 8 disambiguated matches (`name, region, country`), so same-named cities like Dimitrovgrad (Bulgaria) vs. Dimitrovgrad (Russia) are both reachable; full keyboard support (↑/↓, Enter, Esc)
- **Geolocation on load** — with reverse geocoding for the place name; if denied, the app falls back to search
- **Dynamic gradient themes** — the background adapts to current weather + day/night: clear, partly cloudy, overcast, rain, snow, night
- **Dark / light mode** — toggleable, persisted in `localStorage`, defaults to the OS preference
- **State screens** — designed loading, error (with retry), and location-not-found / empty states
- **Responsive** — stacked layout on mobile, 70/30 split (content / 7-day column) from 768px up

## Design

The UI implements a Claude Design project (mobile + desktop pages) as one responsive page:

- **Glassmorphism cards** — translucent layered backgrounds with `backdrop-filter: blur(18px)`
- **Muted oklch gradient themes** — one gradient trio + glow blob per weather condition, in dark and light variants
- **Soft SVG icon set** — sun / moon / cloud / rain from the design, extended in the same style with partly-cloudy (day & night), snow, fog, and thunder to cover all WMO weather codes
- Inter, thin-weight hero type (100–108px), uppercase tracked labels

**Icon / branding** — the app icon (sun with a cloud in front, matching the soft glassmorphism weather theme) lives at `assets/icon.png`, with favicon, apple-touch, and PWA sizes generated into `assets/icons/`.

## Data sources

All client-side, all free, no keys:

| API | Used for |
|---|---|
| [Open-Meteo Forecast](https://open-meteo.com/en/docs) | `current` temperature, humidity, feels-like, weather code, wind speed/direction, dew point, is_day · `hourly` temperature, weather code, precipitation probability, wind, UV, is_day · `daily` weather code, min/max temperature, UV max, sunrise/sunset, precipitation probability |
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
index.html      # markup, design tokens (CSS custom properties), theme gradients
app.js          # all logic: fetching, rendering, icons, themes, search, states
assets/icons/   # generated favicon / apple-touch / PWA icon sizes
CNAME           # GitHub Pages custom domain
```

## Implementation notes

- **Theme system** — `body[data-theme]` selects the gradient variables; `html.dark` selects the dark/light token set (text, glass, tracks). The two axes combine freely, so every weather theme has a light and dark variant.
- **Hourly rail sizing** — a `ResizeObserver` keeps the rail width at an exact multiple of the card unit (84+10px mobile, 90+12px desktop) so snap scrolling always shows whole cards; vertical mouse-wheel input is translated to horizontal scroll on desktop.
- **iOS Safari** — text inputs are forced to a 16px computed font-size on touch/mobile viewports (with compensating line-height) to prevent Safari's zoom-on-focus.
- **Stacking** — the search row is `z-30` because the `animate-fade-in` sections create their own stacking contexts; without it the autocomplete dropdown would paint beneath the weather card.
