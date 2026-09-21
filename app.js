document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* =====================================================================
       UI strings
       ===================================================================== */
    const TXT = {
        searchPlaceholder: 'Search city…',
        go: 'Go',
        locate: 'Use my location',
        hourly: 'Hourly forecast',
        forecast14: '14-Day Forecast',
        uvIndex: 'UV Index',
        wind: 'Wind',
        humidity: 'Humidity',
        sunsun: 'Sunrise / Sunset',
        dewPoint: 'Dew point',
        feelsLike: 'Feels like',
        sets: 'Sets',
        kmh: 'km/h',
        today: 'Today',
        now: 'Now',
        high: 'H',
        low: 'L',
        uvLevels: ['Low', 'Moderate', 'High', 'Very High', 'Extreme'],
        loadingLocate: 'Locating you…',
        loadingFetch: 'Fetching weather data…',
        errTitle: 'Something went wrong',
        errMsg: 'Could not load weather data. Check your connection and try again.',
        errRetry: 'Try again',
        searchErr: 'Could not search for that city. Check your connection and try again.',
        emptyTitle: 'No location set',
        emptyMsg: 'Search for a city above to see the weather.',
        notFoundTitle: 'Location not found',
        notFoundMsg: (q) => `No results for “${q}”. Try a different search.`,
        noMatches: 'No matches found',
        back: 'Back',
        close: 'Close',
        previous: 'Previous',
        next: 'Next',
        chartTabsLabel: 'Chart metric',
        chartNoData: 'No data for this period',
        chartTabs: {
            temperature: 'Temperature',
            precipitation: 'Precipitation',
            wind: 'Wind',
            humidity: 'Humidity',
            pressure: 'Pressure',
            clouds: 'Clouds',
            uv: 'UV',
        },
        detail: {
            feelsLike: 'Feels like',
            confidenceLevels: { high: 'High', medium: 'Medium', low: 'Low' },
            confidenceBadge: {
                medium: 'Medium confidence',
                low: 'Low confidence',
                interpolated: 'Hourly values are interpolated',
            },
            precipitation: 'Precipitation',
            chance: 'Chance',
            dry: 'Dry',
            rain: 'Rain',
            showers: 'Showers',
            snow: 'Snow',
            wind: 'Wind',
            gusts: 'Gusts',
            humidity: 'Humidity',
            dewPoint: 'Dew point',
            pressure: 'Pressure',
            trend3h: '3 h trend',
            rising: 'Rising',
            steady: 'Steady',
            falling: 'Falling',
            clouds: 'Clouds',
            cloudLow: 'Low',
            cloudMid: 'Mid',
            cloudHigh: 'High',
            visibility: 'Visibility',
            uvIndex: 'UV Index',
            clearSky: 'Clear sky',
            thunder: 'Thunderstorm risk',
            estimated: 'Estimated',
            cape: 'CAPE',
            liftedIndex: 'Lifted index',
            thunderLevels: { none: 'None', low: 'Low', moderate: 'Moderate', high: 'High' },
            snowTitle: 'Snow & freezing level',
            snowfall: 'Snowfall',
            snowDepth: 'Snow depth',
            freezingLevel: 'Freezing level',
            airQuality: 'Air quality',
            aqiLabel: 'European AQI',
            aqUnavailable: 'Air quality forecast covers about 4–5 days.',
            leadingPollutant: 'Leading pollutant',
            dust: 'Saharan dust',
            haze: 'Haze',
            pollen: 'Pollen',
            noPollen: 'No significant pollen expected',
            pollenSpecies: {
                alder_pollen: 'Alder',
                birch_pollen: 'Birch',
                grass_pollen: 'Grass',
                mugwort_pollen: 'Mugwort',
                olive_pollen: 'Olive',
                ragweed_pollen: 'Ragweed',
            },
            pollutants: {
                pm2_5: 'PM2.5',
                pm10: 'PM10',
                ozone: 'O₃',
                nitrogen_dioxide: 'NO₂',
                sulphur_dioxide: 'SO₂',
            },
            grainsPerM3: 'grains/m³',
            attribution: {
                weather: 'Weather data by',
                openMeteo: 'Open-Meteo.com',
                airQuality: 'Air quality:',
                cams: 'CAMS ENSEMBLE (Copernicus)',
                viaOpenMeteo: 'via Open-Meteo',
            },
        },
        day: {
            hours: 'Hours',
            summary: {
                base: (cond, range) => `${cond}, ${range}.`,
                baseNoTemp: (cond) => `${cond}.`,
                rainWord: 'Rain',
                snowWord: 'Snow',
                likelyWord: 'likely',
                possibleWord: 'possible',
                precipWindow: (what, word, range, amount) => `${what} ${word} ${range}${amount ? ` (${amount})` : ''}.`,
                smallChance: (p) => `Small chance of rain (${p}%).`,
                gusts: (v) => `Gusts up to ${v} ${TXT.kmh}.`,
                highUv: (v) => `High UV, peaking at ${v}.`,
                thunder: (word) => `${word} thunderstorm risk.`,
                snow: (cm) => `${cm} cm of snow expected.`,
            },
            precipHours: 'Precip. hours',
            maxChance: 'Max chance',
            maxGust: 'Max gust',
            meanWind: 'Mean',
            dominant: 'Dominant',
            sun: 'Sun',
            sunrise: 'Sunrise',
            sunset: 'Sunset',
            daylight: 'Daylight',
            sunshine: 'Sunshine',
            uvClearSky: 'Clear sky max',
            uvPeak: 'Peak',
            protection: (range) => `Protection recommended ${range}`,
            noProtection: 'No protection needed',
            moon: 'Moon',
            moonrise: 'Moonrise',
            moonset: 'Moonset',
            min: 'Min',
            max: 'Max',
            mean: 'Mean',
            dewPointMean: 'Mean dew point',
            change: 'Change',
            cloudsVisibility: 'Clouds & visibility',
            minVisibility: 'Min visibility',
            maxCape: 'Max CAPE',
            atHour: 'At',
            snowfallSum: 'Snowfall',
            maxSnowDepth: 'Max snow depth',
            minFreezingLevel: 'Lowest freezing level',
            aqiMax: 'Max European AQI',
            pm25Range: 'PM2.5 range',
            pollenPeak: 'daily peak',
            confidenceTile: {
                title: 'Forecast confidence',
                range: (n, p10, p90, median) => `Temperature range across ${n} forecasts: ${p10}–${p90}° (median ${median}°)`,
                explain: 'A wider range means less certainty.',
            },
            compare: {
                warmer: (n, ref) => `${n}° warmer than ${ref}`,
                cooler: (n, ref) => `${n}° cooler than ${ref}`,
                same: (ref) => `About the same as ${ref}`,
                refToday: 'today',
                refPrevDay: 'the day before',
                tomorrowWarmer: (n) => `Tomorrow will be ${n}° warmer`,
                tomorrowCooler: (n) => `Tomorrow will be ${n}° cooler`,
                tomorrowSame: 'Tomorrow will be about the same',
            },
        },
        chartSeries: {
            temp: 'Temp',
            feelsLike: 'Feels like',
            precipAmount: 'Amount',
            precipChance: 'Chance',
            wind: 'Wind',
            gusts: 'Gusts',
            humidity: 'Humidity',
            dewPoint: 'Dew point',
            pressure: 'Pressure',
            cloudTotal: 'Total',
            cloudLow: 'Low',
            cloudMid: 'Mid',
            cloudHigh: 'High',
            uv: 'UV',
            uvClearSky: 'Clear sky',
        },
    };

    // WMO weather_code -> condition name
    const CONDITIONS = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing Rime Fog',
        51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        56: 'Light Freezing Drizzle', 57: 'Dense Freezing Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
        71: 'Slight Snow Fall', 73: 'Moderate Snow Fall', 75: 'Heavy Snow Fall', 77: 'Snow Grains',
        80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
        85: 'Slight Snow Showers', 86: 'Heavy Snow Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with Slight Hail', 99: 'Thunderstorm with Heavy Hail',
    };

    /* =====================================================================
       WMO code groups
       ===================================================================== */
    const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
    const SNOW_CODES = [71, 73, 75, 77, 85, 86];
    const THUNDER_CODES = [95, 96, 99];
    const FOG_CODES = [45, 48];

    const getWeatherCondition = (code) => CONDITIONS[code] || '—';

    /* =====================================================================
       Weather icon set (day/night aware) — light glyphs on photo, with a
       drop-shadow (.wx-icon) for legibility. Moon is a single clean glyph.
       ===================================================================== */
    const getIconType = (code, isDay) => {
        if (SNOW_CODES.includes(code)) return 'snow';
        if (THUNDER_CODES.includes(code)) return 'thunder';
        if (RAIN_CODES.includes(code)) return 'rain';
        if (FOG_CODES.includes(code)) return 'fog';
        if (code === 3) return 'cloud';
        if (code === 2) return isDay ? 'partly' : 'partlyNight';
        return isDay ? 'sun' : 'moon';
    };

    const ICONS = {
        sun: (w) => `<svg class="wx-icon" width="${w}" height="${w}" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="7" fill="#ffc531"></circle>
            <g stroke="#ffc531" stroke-width="2.2" stroke-linecap="round">
                <line x1="15" y1="1" x2="15" y2="5"></line><line x1="15" y1="25" x2="15" y2="29"></line>
                <line x1="1" y1="15" x2="5" y2="15"></line><line x1="25" y1="15" x2="29" y2="15"></line>
                <line x1="5.5" y1="5.5" x2="8.2" y2="8.2"></line><line x1="21.8" y1="21.8" x2="24.5" y2="24.5"></line>
                <line x1="5.5" y1="24.5" x2="8.2" y2="21.8"></line><line x1="21.8" y1="8.2" x2="24.5" y2="5.5"></line>
            </g>
        </svg>`,
        moon: (w) => `<svg class="wx-icon" width="${Math.round(w * 0.87)}" height="${Math.round(w * 0.87)}" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#d9def0"></path>
        </svg>`,
        cloud: (w) => `<svg class="wx-icon" width="${w}" height="${Math.round(w * 30 / 34)}" viewBox="0 0 34 30">
            <circle cx="12" cy="16" r="8" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="20" cy="13" r="9" fill="#f4f6f9"></circle>
            <circle cx="24" cy="18" r="7" fill="#dfe4ec" opacity="0.9"></circle>
            <rect x="7" y="18" width="22" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        partly: (w) => `<svg class="wx-icon" width="${w}" height="${Math.round(w * 30 / 34)}" viewBox="0 0 34 30">
            <circle cx="23" cy="9" r="6" fill="#ffc531"></circle>
            <circle cx="12" cy="17" r="7.5" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="19" cy="15" r="8" fill="#f4f6f9"></circle>
            <rect x="7" y="18" width="21" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        partlyNight: (w) => `<svg class="wx-icon" width="${w}" height="${Math.round(w * 30 / 34)}" viewBox="0 0 34 30">
            <path d="M28 11.4A6.5 6.5 0 1 1 20.9 4.3 5 5 0 0 0 28 11.4z" fill="#d9def0"></path>
            <circle cx="11" cy="17" r="7.5" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="18" cy="15" r="8" fill="#f4f6f9"></circle>
            <rect x="6" y="18" width="21" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        rain: (w) => `<svg class="wx-icon" width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="12" r="7" fill="#c7cfdb" opacity="0.95"></circle>
            <circle cx="19" cy="10" r="8" fill="#d4dae3"></circle>
            <rect x="7" y="14" width="20" height="7" rx="3.5" fill="#ccd3dd"></rect>
            <g stroke="#9fb3d1" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="25" x2="10" y2="30"></line>
                <line x1="19" y1="25" x2="17" y2="31"></line>
                <line x1="26" y1="25" x2="24" y2="30"></line>
            </g>
        </svg>`,
        snow: (w) => `<svg class="wx-icon" width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="12" r="7" fill="#e3e8f0" opacity="0.95"></circle>
            <circle cx="19" cy="10" r="8" fill="#eef1f6"></circle>
            <rect x="7" y="14" width="20" height="7" rx="3.5" fill="#e7ebf2"></rect>
            <g fill="#dfe6f2">
                <circle cx="11" cy="26" r="1.8"></circle>
                <circle cx="18" cy="29" r="1.8"></circle>
                <circle cx="25" cy="26" r="1.8"></circle>
            </g>
        </svg>`,
        fog: (w) => `<svg class="wx-icon" width="${w}" height="${Math.round(w * 30 / 34)}" viewBox="0 0 34 30">
            <g stroke="#dfe4ec" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
                <line x1="6" y1="9" x2="28" y2="9"></line>
                <line x1="4" y1="15" x2="30" y2="15"></line>
                <line x1="7" y1="21" x2="26" y2="21"></line>
            </g>
        </svg>`,
        thunder: (w) => `<svg class="wx-icon" width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="11" r="7" fill="#c7cfdb" opacity="0.95"></circle>
            <circle cx="19" cy="9" r="8" fill="#d4dae3"></circle>
            <rect x="7" y="13" width="20" height="7" rx="3.5" fill="#ccd3dd"></rect>
            <path d="M19 19l-6 8h4.2L15 34l8-10h-4.4l2.6-5z" fill="#ffc531"></path>
        </svg>`,
    };
    const getIcon = (code, isDay, size) => ICONS[getIconType(code, isDay)](size);

    /* =====================================================================
       Background selection: condition category + time-of-day bucket → photo.
       16 photos exist locally; the four "always day/night" conditions fall
       back sunrise→day, sunset→night. Missing → gradient.
       ===================================================================== */
    const CARD_COLORS = {
        'clear-day':             '#4576a6',
        'clear-night':           '#1d3049',
        'clear-sunrise':         '#3f5388',
        'clear-sunset':          '#763955',
        'fog-day':               '#3e4956',
        'fog-night':             '#2d353e',
        'overcast-day':          '#726f6d',
        'overcast-night':        '#2e353f',
        'partly-cloudy-day':     '#2a4d6d',
        'partly-cloudy-night':   '#1e304d',
        'partly-cloudy-sunrise': 'rgb(169, 148, 137)',
        'partly-cloudy-sunset':  '#62374c',
        'rain-day':              '#374655',
        'rain-night':            '#2a2f39',
        'snow-day':              '#424c5b',
        'snow-night':            '#2d333e',
    };

    const BG_FILES = new Set([
        'clear-day', 'clear-sunrise', 'clear-sunset', 'clear-night',
        'partly-cloudy-day', 'partly-cloudy-sunrise', 'partly-cloudy-sunset', 'partly-cloudy-night',
        'overcast-day', 'overcast-night',
        'fog-day', 'fog-night',
        'rain-day', 'rain-night',
        'snow-day', 'snow-night',
    ]);

    const GRAD = {
        clear: 'linear-gradient(160deg, oklch(62% 0.045 60), oklch(54% 0.05 40) 55%, oklch(68% 0.03 75))',
        'partly-cloudy': 'linear-gradient(160deg, oklch(55% 0.035 220), oklch(48% 0.04 90) 55%, oklch(60% 0.03 210))',
        overcast: 'linear-gradient(160deg, oklch(45% 0.02 250), oklch(38% 0.018 245) 55%, oklch(50% 0.018 255))',
        rain: 'linear-gradient(160deg, oklch(42% 0.025 245), oklch(33% 0.025 250) 55%, oklch(47% 0.02 240))',
        snow: 'linear-gradient(160deg, oklch(60% 0.012 240), oklch(52% 0.015 235) 55%, oklch(66% 0.008 245))',
        fog: 'linear-gradient(160deg, oklch(50% 0.01 250), oklch(44% 0.01 245) 55%, oklch(55% 0.008 255))',
        night: 'linear-gradient(160deg, oklch(24% 0.02 265), oklch(15% 0.015 260) 55%, oklch(30% 0.025 260))',
    };

    const bgCategory = (code) => {
        if (SNOW_CODES.includes(code)) return 'snow';
        if (RAIN_CODES.includes(code) || THUNDER_CODES.includes(code)) return 'rain';
        if (FOG_CODES.includes(code)) return 'fog';
        if (code === 3) return 'overcast';
        if (code === 2) return 'partly-cloudy';
        return 'clear'; // 0, 1
    };

    // Minutes-since-midnight from an ISO local time "....THH:MM"
    const toMin = (iso) => parseInt(iso.slice(11, 13), 10) * 60 + parseInt(iso.slice(14, 16), 10);

    const timeBucket = (nowMin, srMin, ssMin) => {
        const w = 45; // ± window (minutes) around sunrise / sunset
        if (Math.abs(nowMin - srMin) <= w) return 'sunrise';
        if (Math.abs(nowMin - ssMin) <= w) return 'sunset';
        if (nowMin > srMin && nowMin < ssMin) return 'day';
        return 'night';
    };

    const pickBackground = (category, bucket) => {
        let name = `${category}-${bucket}`;
        if (BG_FILES.has(name)) return name;
        if (bucket === 'sunrise') name = `${category}-day`;
        else if (bucket === 'sunset') name = `${category}-night`;
        if (BG_FILES.has(name)) return name;
        if (BG_FILES.has(`${category}-day`)) return `${category}-day`;
        return null;
    };

    // Crossfade: two stacked layers each for the (mobile) full-bleed / (desktop)
    // blurred surround AND the desktop crisp panel photo. Fades on first load and
    // every image change; a no-op when the same scene is requested (e.g. re-render).
    const surroundLayers = [document.getElementById('bg-a'), document.getElementById('bg-b')];
    const panelLayers = [document.getElementById('pp-a'), document.getElementById('pp-b')];
    let bgFront = 0;
    let currentBgValue = null;

    const applyBackground = (name, category, bucket) => {
        const isDark = name ? /-night$/.test(name) : bucket === 'night';
        const value = name
            ? `url('assets/backgrounds/${name}.webp') center/cover no-repeat`
            : (bucket === 'night' ? GRAD.night : (GRAD[category] || GRAD.overcast));

        root.setAttribute('data-bg-dark', isDark ? 'true' : 'false');
        root.style.setProperty('--card', (name && CARD_COLORS[name]) || '#294969');
        if (value === currentBgValue) return; // no needless re-fade
        currentBgValue = value;

        const back = 1 - bgFront;
        surroundLayers[back].style.background = value;
        panelLayers[back].style.background = value;
        // Force reflow so the opacity transition runs from the new image
        void surroundLayers[back].offsetWidth;
        surroundLayers[back].style.opacity = '1';
        panelLayers[back].style.opacity = '1';
        surroundLayers[bgFront].style.opacity = '0';
        panelLayers[bgFront].style.opacity = '0';
        bgFront = back;
    };

    /* =====================================================================
       Formatting helpers (24-hour everywhere; API times already local)
       ===================================================================== */
    const getUvLevel = (uv) => uv < 3 ? 0 : uv < 6 ? 1 : uv < 8 ? 2 : uv < 11 ? 3 : 4;
    const getUvLabel = (uv) => TXT.uvLevels[getUvLevel(uv)];
    // Round to the nearest integer, but never report a non-zero UV as "0"
    const formatUv = (uv) => (uv > 0 && Math.round(uv) === 0) ? '<1' : String(Math.round(uv));
    const getCompass = (deg) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

    const formatHour = (iso) => iso.slice(11, 13) + ':00';        // "15:00"
    const formatClock = (iso) => iso.slice(11, 16);                // "06:12"

    const formatLocalTime = (iso, offsetSeconds) => {
        const clock = iso.slice(11, 16);
        const oh = offsetSeconds / 3600;
        const sign = oh >= 0 ? '+' : '-';
        const abs = Math.abs(oh);
        const hh = Math.trunc(abs);
        const mm = Math.round((abs - hh) * 60);
        return `${clock} GMT${sign}${hh}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
    };

    const getDayName = (dateStr, index) => {
        if (index === 0) return TXT.today;
        // Noon avoids any date rollover when the locale formats the weekday
        const d = new Date(dateStr + 'T12:00:00');
        return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
    };

    // "Sep 23" from a "YYYY-MM-DD" date string; noon-anchored like getDayName
    const formatMonthDay = (dateStr) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
        .format(new Date(dateStr + 'T12:00:00'));

    /* =====================================================================
       DOM references
       ===================================================================== */
    const searchInput = document.getElementById('weather-search-input');
    const searchBtn = document.getElementById('weather-search-btn');
    const locateBtn = document.getElementById('locate-btn');
    const weatherCard = document.getElementById('weather-card');

    const stateScreen = document.getElementById('state-screen');
    const stateLoading = document.getElementById('state-loading');
    const stateError = document.getElementById('state-error');
    const stateEmpty = document.getElementById('state-empty');
    const loadingMessage = document.getElementById('loading-message');
    const errorTitleEl = document.getElementById('error-title');
    const errorMessage = document.getElementById('error-message');
    const errorRetry = document.getElementById('error-retry');
    const emptyTitle = document.getElementById('empty-title');
    const emptyMessage = document.getElementById('empty-message');

    const uiCity = document.getElementById('weather-city');
    const uiLocalTime = document.getElementById('weather-localtime');
    const uiTemp = document.getElementById('weather-temp');
    const uiCondition = document.getElementById('weather-condition');
    const uiHiLo = document.getElementById('weather-hilo');
    const uiFeels = document.getElementById('weather-feels');
    const uiWind = document.getElementById('weather-wind');
    const uiWindDir = document.getElementById('wind-dir');
    const uiWindArrow = document.getElementById('wind-arrow');
    const uiHumidity = document.getElementById('weather-humidity');
    const uiDewPoint = document.getElementById('dew-point');
    const uiUv = document.getElementById('weather-uv');
    const uiUvLabel = document.getElementById('uv-label');
    const uiUvBar = document.getElementById('uv-bar');
    const uiSunrise = document.getElementById('sunrise');
    const uiSunset = document.getElementById('sunset');
    const uiForecastList = document.getElementById('weather-forecast-list');
    const railOuter = document.getElementById('hourly-rail-outer');
    const rail = document.getElementById('hourly-rail');

    let lastRender = null;   // { data, meta } — last successful payload
    let lastAction = null;   // re-run by the error screen's "Try again"
    let fetchAbortController = null;
    let lastFetchTime = 0;      // Date.now() of the last successful weather fetch
    let lastCoords = null;      // { lat, lon, meta } — target of a background refresh
    let refreshInFlight = false;
    let clockTimer = null;
    let ensembleRequestedFor = null;   // the lastCoords object a fetch has been started/completed for
    let ensembleLoading = false;

    /* =====================================================================
       Hourly rail sizing — keep whole cards per slide (4 on mobile)
       ===================================================================== */
    const railMetrics = () => {
        const desktop = window.matchMedia('(min-width: 768px)').matches;
        return { card: desktop ? 90 : 84, minGap: desktop ? 10 : 6 };
    };
    const updateRailWidth = () => {
        const { card, minGap } = railMetrics();
        const w = railOuter.clientWidth;
        if (!w) return;
        const count = Math.max(1, Math.floor((w + minGap) / (card + minGap)));
        const gap = count > 1 ? Math.max(minGap, (w - count * card) / (count - 1)) : minGap;
        rail.style.gap = gap + 'px';
    };
    new ResizeObserver(updateRailWidth).observe(railOuter);

    // Desktop: vertical wheel scrolls the rail horizontally
    rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            rail.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });

    /* =====================================================================
       State screens
       ===================================================================== */
    let currentState = 'none';

    const showState = (name, message, title) => {
        currentState = name;
        [stateLoading, stateError, stateEmpty].forEach((el) => {
            el.classList.add('hidden');
            el.style.display = '';
        });
        if (name === 'none') {
            stateScreen.classList.add('hidden');
            weatherCard.classList.remove('hidden');
            return;
        }
        weatherCard.classList.add('hidden');
        stateScreen.classList.remove('hidden');
        const panel = { loading: stateLoading, error: stateError, empty: stateEmpty }[name];
        panel.classList.remove('hidden');
        panel.style.display = 'flex';

        if (name === 'loading') loadingMessage.textContent = message || TXT.loadingFetch;
        if (name === 'error') {
            errorTitleEl.textContent = TXT.errTitle;
            errorMessage.textContent = message || TXT.errMsg;
        }
        if (name === 'empty') {
            emptyTitle.textContent = title || TXT.emptyTitle;
            emptyMessage.textContent = message || TXT.emptyMsg;
        }
    };

    /* =====================================================================
       Rendering
       ===================================================================== */
    // Index into an hourly `time` array for the current hour: the last entry
    // at or before `currentTime`, clamped to a valid index.
    const currentHourIndex = (times, currentTime) => {
        let i = times.findIndex((x) => x > currentTime);
        if (i === -1) i = times.length;
        return Math.max(0, Math.min(i - 1, times.length - 1));
    };

    const renderHourly = (hourly, currentTime) => {
        const times = hourly.time;
        const start = currentHourIndex(times, currentTime);
        const end = Math.min(start + 24, times.length);

        let html = '';
        for (let i = start; i < end; i++) {
            const isNow = i === start;
            const label = isNow ? TXT.now : formatHour(times[i]);
            const icon = getIcon(hourly.weather_code[i], hourly.is_day[i] === 1, 34);
            const precip = hourly.precipitation_probability && hourly.precipitation_probability[i] != null
                ? hourly.precipitation_probability[i] : 0;
            const ariaLabel = `${isNow ? TXT.now + ', ' : ''}${formatHour(times[i])}, `
                + `${Math.round(hourly.temperature_2m[i])}°, ${getWeatherCondition(hourly.weather_code[i])}`;
            html += `
                <div class="hour-card glass" data-hour-index="${i}" role="button" tabindex="0" aria-label="${ariaLabel}">
                    <div class="t-label">${label}</div>
                    <div class="hour-icon">${icon}</div>
                    <div class="t-value" style="font-weight: 500;">${Math.round(hourly.temperature_2m[i])}°</div>
                    <div style="display: flex; align-items: center; gap: 3px;">
                        <svg width="8" height="10" viewBox="0 0 8 10" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));"><path d="M4 0.6C4 0.6 7.4 4.7 7.4 6.6A3.4 3.4 0 0 1 0.6 6.6C0.6 4.7 4 0.6 4 0.6Z" fill="var(--accent)"></path></svg>
                        <span class="t-cap-accent">${precip}%</span>
                    </div>
                    <div class="t-cap">${Math.round(hourly.wind_speed_10m[i])} ${TXT.kmh}</div>
                    <div class="t-cap-emph">UV ${Math.round(hourly.uv_index[i])}</div>
                </div>
            `;
        }
        rail.innerHTML = html;
        rail.scrollLeft = 0;
        updateRailWidth();
    };

    const renderDaily = (daily) => {
        uiForecastList.innerHTML = '';
        const days = Math.min(14, daily.time.length);

        let weekLo = Infinity, weekHi = -Infinity;
        for (let i = 0; i < days; i++) {
            weekLo = Math.min(weekLo, daily.temperature_2m_min[i]);
            weekHi = Math.max(weekHi, daily.temperature_2m_max[i]);
        }
        const span = Math.max(1, weekHi - weekLo);

        // Apple-Weather-style temperature color scale: cool ≤14°C → yellow 21°C → warm ≥33°C
        const tempColor = (temp) => {
            const stops = [
                [14, [ 64, 196, 209]],  // cool blue-green
                [21, [255, 210,  63]],  // yellow
                [33, [255,  94,  58]],  // warm red-orange
            ];
            const lerp = (a, b, f) => Math.round(a + (b - a) * f);
            const t = Math.max(stops[0][0], Math.min(stops[stops.length - 1][0], temp));
            for (let i = 0; i < stops.length - 1; i++) {
                const [t0, c0] = stops[i], [t1, c1] = stops[i + 1];
                if (t <= t1) {
                    const f = (t - t0) / (t1 - t0);
                    return `rgb(${lerp(c0[0], c1[0], f)}, ${lerp(c0[1], c1[1], f)}, ${lerp(c0[2], c1[2], f)})`;
                }
            }
            const last = stops[stops.length - 1][1];
            return `rgb(${last[0]}, ${last[1]}, ${last[2]})`;
        };

        let html = '';
        for (let i = 0; i < days; i++) {
            const dayName = getDayName(daily.time[i], i);
            const icon = getIcon(daily.weather_code[i], true, 22);
            const precip = daily.precipitation_probability_max && daily.precipitation_probability_max[i] != null
                ? daily.precipitation_probability_max[i] : 0;
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const left = ((daily.temperature_2m_min[i] - weekLo) / span * 100).toFixed(0);
            const width = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / span * 100).toFixed(0);
            const ariaLabel = `${dayName}, ${getWeatherCondition(daily.weather_code[i])}, high ${maxTemp}°, low ${minTemp}°`;

            html += `
                <div class="day-row" data-day-index="${i}" role="button" tabindex="0" aria-label="${ariaLabel}">
                    <div class="t-body-emph" style="line-height: 1;">${dayName}</div>
                    <div class="day-icon">${icon}</div>
                    <div class="t-cap-accent" style="line-height: 1;">${precip}%</div>
                    <div class="day-bar-wrap">
                        <span class="t-body" style="width: 24px; line-height: 1;">${minTemp}°</span>
                        <div class="temp-track">
                            <div class="temp-fill" style="left: ${left}%; width: ${width}%; background: linear-gradient(90deg, ${tempColor(daily.temperature_2m_min[i])}, ${tempColor(daily.temperature_2m_max[i])});"></div>
                        </div>
                    </div>
                    <span class="t-body-emph day-hi" style="line-height: 1;">${maxTemp}°</span>
                </div>
            `;
        }
        uiForecastList.innerHTML = html;
    };

    const renderWeather = (data, meta) => {
        const current = data.current;
        const daily = data.daily;
        const isDay = current.is_day === 1;

        // Background: condition category + local time-of-day bucket
        const category = bgCategory(current.weather_code);
        const nowMin = toMin(current.time);
        const srMin = toMin(daily.sunrise[0]);
        const ssMin = toMin(daily.sunset[0]);
        const bucket = timeBucket(nowMin, srMin, ssMin);
        applyBackground(pickBackground(category, bucket), category, bucket);

        uiCity.textContent = meta.country ? `${meta.name}, ${meta.country}` : meta.name;
        uiLocalTime.textContent = formatLocalTime(current.time, data.utc_offset_seconds || 0);

        uiTemp.textContent = Math.round(current.temperature_2m);
        uiCondition.textContent = getWeatherCondition(current.weather_code);
        uiHiLo.textContent = `${TXT.high}:${Math.round(daily.temperature_2m_max[0])}° ${TXT.low}:${Math.round(daily.temperature_2m_min[0])}°`;
        uiFeels.textContent = `${TXT.feelsLike} ${Math.round(current.apparent_temperature)}°`;

        // UV reads the current hour; the day's peak stays on the label line
        const hourly = data.hourly;
        const hourIdx = currentHourIndex(hourly.time, current.time);
        const uvMax = daily.uv_index_max && daily.uv_index_max[0] != null ? daily.uv_index_max[0] : null;
        const uvHour = hourly.uv_index && hourly.uv_index[hourIdx] != null ? hourly.uv_index[hourIdx] : null;
        const uvNow = uvHour != null ? uvHour : uvMax;

        uiUv.textContent = uvNow != null ? formatUv(uvNow) : '--';
        uiUvLabel.textContent = uvNow == null ? ''
            : uvMax != null ? `${getUvLabel(uvNow)} · Max ${Math.round(uvMax)}`
            : getUvLabel(uvNow);
        const uvPct = uvNow != null ? Math.min(100, uvNow / 11 * 100) : 0;
        uiUvBar.style.width = `${uvPct}%`;
        uiUvBar.style.backgroundSize = uvPct > 0 ? `${100 / (uvPct / 100)}% 100%` : '100% 100%';

        uiWind.textContent = Math.round(current.wind_speed_10m);
        uiWindDir.textContent = getCompass(current.wind_direction_10m);
        uiWindArrow.style.transform = `rotate(${Math.round(current.wind_direction_10m)}deg)`;

        uiHumidity.textContent = Math.round(current.relative_humidity_2m);
        uiDewPoint.textContent = Math.round(current.dew_point_2m);

        uiSunrise.textContent = formatClock(daily.sunrise[0]);
        uiSunset.textContent = formatClock(daily.sunset[0]);

        renderHourly(hourly, current.time);
        renderDaily(daily);

        showState('none');
        updateRailWidth();
    };

    /* =====================================================================
       Last-location persistence (localStorage — static site, no cookies)
       ===================================================================== */
    const saveLastLocation = (lat, lon, meta) => {
        try {
            localStorage.setItem('weatherLastLocation', JSON.stringify({
                v: 1, lat, lon, name: meta.name, country: meta.country,
            }));
        } catch (e) { /* private mode / quota — non-fatal */ }
    };

    const readLastLocation = () => {
        try {
            const raw = localStorage.getItem('weatherLastLocation');
            if (!raw) return null;
            const p = JSON.parse(raw);
            if (p && p.v === 1 && typeof p.lat === 'number' && typeof p.lon === 'number') return p;
        } catch (e) { /* corrupt entry */ }
        return null;
    };

    /* =====================================================================
       Header clock — ticks between fetches so the time is never frozen
       ===================================================================== */
    const tickClock = () => {
        if (!lastRender || currentState !== 'none') return;
        const offset = lastRender.data.utc_offset_seconds || 0;
        // Shifting UTC by the location's offset gives its local wall clock
        const localIso = new Date(Date.now() + offset * 1000).toISOString();
        uiLocalTime.textContent = formatLocalTime(localIso, offset);
    };

    const stopClock = () => {
        if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    };

    const startClock = () => {
        stopClock();
        if (document.visibilityState === 'hidden') return;
        clockTimer = setInterval(tickClock, 60000);
    };

    /* =====================================================================
       Weather fetch
       ===================================================================== */
    const REFRESH_AFTER_MS = 10 * 60 * 1000;

    const forecastUrl = (lat, lon) => 'https://api.open-meteo.com/v1/forecast'
        + `?latitude=${lat}&longitude=${lon}`
        + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,dew_point_2m,is_day'
        + '&hourly=temperature_2m,apparent_temperature,weather_code,is_day,precipitation,precipitation_probability,rain,showers,snowfall,snow_depth,'
        + 'wind_speed_10m,wind_gusts_10m,wind_direction_10m,relative_humidity_2m,dew_point_2m,pressure_msl,cloud_cover,cloud_cover_low,cloud_cover_mid,'
        + 'cloud_cover_high,visibility,uv_index,uv_index_clear_sky,cape,lifted_index,freezing_level_height'
        + '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,'
        + 'sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,'
        + 'precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,moonrise,moonset,moon_phase'
        + '&forecast_days=14&timezone=auto';

    const airQualityUrl = (lat, lon) => 'https://air-quality-api.open-meteo.com/v1/air-quality'
        + `?latitude=${lat}&longitude=${lon}`
        + '&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_nitrogen_dioxide,european_aqi_ozone,european_aqi_sulphur_dioxide,'
        + 'pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,dust,aerosol_optical_depth,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,'
        + 'olive_pollen,ragweed_pollen'
        + '&forecast_days=5&timezone=auto';

    // Best-effort air quality fetch: failure of any kind (network, non-200,
    // empty body, abort) resolves to null instead of throwing.
    const fetchAirQualityData = async (lat, lon, signal) => {
        try {
            const response = await fetch(airQualityUrl(lat, lon), { signal });
            if (!response.ok) throw new Error('Failed to fetch air quality data.');
            const data = await response.json();
            return data && data.hourly ? data : null;
        } catch (err) {
            if (err.name !== 'AbortError') console.warn('Air quality fetch failed:', err);
            return null;
        }
    };

    // Verified live against Sofia (42.6977, 23.3219): ecmwf_ifs025 returns
    // HTTP 200, 51 members (temperature_2m + _member01..50), full hourly
    // (not 3-/6-hourly) coverage, and honours forecast_days=14 (336 rows).
    const ENSEMBLE_MODEL_ID = 'ecmwf_ifs025';
    const ENSEMBLE_MODEL_LABEL = 'ECMWF IFS (51 members)';

    const ensembleUrl = (lat, lon) => 'https://ensemble-api.open-meteo.com/v1/ensemble'
        + `?latitude=${lat}&longitude=${lon}`
        + `&hourly=temperature_2m&models=${ENSEMBLE_MODEL_ID}`
        + '&forecast_days=14&timezone=auto';

    // Heavy (51 members × 14 days) and only useful once a popup is open, so
    // it is fetched lazily rather than alongside the main forecast. Failure
    // of any kind is silent: ensemble stays null and the lead-time fallback
    // in confidenceForDay keeps both popups working.
    const fetchEnsembleData = async (lat, lon) => {
        try {
            const response = await fetch(ensembleUrl(lat, lon));
            if (!response.ok) throw new Error('Failed to fetch ensemble data.');
            const data = await response.json();
            return data && data.hourly ? data : null;
        } catch (err) {
            console.warn('Ensemble fetch failed:', err);
            return null;
        }
    };

    // Kicks off the ensemble fetch the first time a popup opens for the
    // current location; a no-op on every later render for that same
    // location (guarded by reference identity, same trick as the AQ races).
    const ensureEnsembleLoaded = () => {
        if (!lastCoords || ensembleRequestedFor === lastCoords) return;
        ensembleRequestedFor = lastCoords;
        const target = lastCoords;
        ensembleLoading = true;
        fetchEnsembleData(target.lat, target.lon).then((ensemble) => {
            ensembleLoading = false;
            if (lastCoords !== target || !lastRender) return; // superseded by a newer location
            lastRender.ensemble = ensemble;
            refreshDetail();   // fills in the confidence tile if a popup is open
        });
    };

    const fetchWeatherData = async (lat, lon, meta) => {
        lastAction = () => fetchWeatherData(lat, lon, meta);
        showState('loading', TXT.loadingFetch);

        if (fetchAbortController) fetchAbortController.abort();
        fetchAbortController = new AbortController();
        const signal = fetchAbortController.signal;

        // Fired alongside the forecast request but never awaited before
        // rendering; attached to lastRender once the forecast lands (below).
        const aqPromise = fetchAirQualityData(lat, lon, signal);

        try {
            const response = await fetch(forecastUrl(lat, lon), { signal });
            if (!response.ok) throw new Error('Failed to fetch weather data.');
            const data = await response.json();

            saveLastLocation(lat, lon, meta);
            const target = { lat, lon, meta };
            lastRender = { data, meta, airQuality: null, ensemble: null };
            lastFetchTime = Date.now();
            lastCoords = target;
            closeDetail(); // new location: any open popup's indices no longer apply
            renderWeather(data, meta);
            startClock();

            aqPromise.then((airQuality) => {
                if (lastCoords !== target) return; // a newer location won the race
                lastRender.airQuality = airQuality;
                refreshDetail();   // fills the AQ/pollen sections if a popup is open
            });
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            showState('error', TXT.errMsg);
        }
    };

    // Background refresh when the tab is re-opened: no loading screen, no
    // blanking. On failure whatever is already on screen is left alone.
    const refreshSilently = async () => {
        if (refreshInFlight || !lastCoords || currentState !== 'none') return;
        const target = lastCoords;
        refreshInFlight = true;
        const aqPromise = fetchAirQualityData(target.lat, target.lon);
        try {
            const response = await fetch(forecastUrl(target.lat, target.lon));
            if (!response.ok) throw new Error('Failed to refresh weather data.');
            const data = await response.json();
            if (lastCoords !== target) return;   // a newer location won the race
            // Same location: keep any already-cached ensemble rather than
            // discarding it (it is heavy and does not need a 10-minute refresh)
            lastRender = { data, meta: target.meta, airQuality: null, ensemble: lastRender ? lastRender.ensemble : null };
            lastFetchTime = Date.now();
            renderWeather(data, target.meta);
            refreshDetail(); // no-op unless a popup is open; clamps indices to the fresh data

            aqPromise.then((airQuality) => {
                if (lastCoords !== target) return;
                lastRender.airQuality = airQuality;
                refreshDetail();   // fills the AQ/pollen sections if a popup is open
            });
        } catch (err) {
            console.error('Background weather refresh failed:', err);
        } finally {
            refreshInFlight = false;
        }
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') { stopClock(); return; }
        tickClock();
        startClock();
        if (Date.now() - lastFetchTime > REFRESH_AFTER_MS) refreshSilently();
    });

    /* =====================================================================
       Detail data helpers (pure, no DOM) — power the hour/day detail popups
       ===================================================================== */
    const hourIndicesForDay = (dayIndex) => {
        if (!lastRender) return [];
        const { hourly, daily } = lastRender.data;
        if (!hourly || !hourly.time || !daily || !daily.time || !daily.time[dayIndex]) return [];
        const datePrefix = daily.time[dayIndex];
        const indices = [];
        for (let i = 0; i < hourly.time.length; i++) {
            if (hourly.time[i].slice(0, 10) === datePrefix) indices.push(i);
        }
        return indices;
    };

    const dayIndexForHour = (hourIndex) => {
        if (!lastRender) return -1;
        const { hourly, daily } = lastRender.data;
        if (!hourly || !hourly.time || !hourly.time[hourIndex] || !daily || !daily.time) return -1;
        const datePrefix = hourly.time[hourIndex].slice(0, 10);
        return daily.time.indexOf(datePrefix);
    };

    const aqAt = (hourIndex) => {
        if (!lastRender || !lastRender.airQuality || !lastRender.data.hourly) return null;
        const targetTime = lastRender.data.hourly.time[hourIndex];
        if (!targetTime) return null;
        const aq = lastRender.airQuality.hourly;
        if (!aq || !aq.time) return null;
        const i = aq.time.indexOf(targetTime);
        if (i === -1) return null;
        const result = {};
        for (const key of Object.keys(aq)) {
            if (key === 'time') continue;
            result[key] = aq[key][i];
        }
        return result;
    };

    /* =====================================================================
       Detail chart — dependency-free inline SVG with tabs, shared by the
       hour and day popups. Colours must read on every CARD_COLORS scene
       (dark navy through grey), so every series is white / --accent / warm
       amber AND carries its own dash pattern plus a legend label.
       ===================================================================== */
    const CHART_INK = {
        grid:  'rgba(255, 255, 255, 0.13)',
        axis:  'rgba(242, 239, 233, 0.70)',
        night: 'rgba(0, 0, 0, 0.16)',
        mark:  'rgba(255, 255, 255, 0.55)',
    };

    // --accent is a static token; resolve it once so SVG presentation
    // attributes (which don't accept var()) get a real colour.
    let chartPaletteCache = null;
    const chartPalette = () => {
        if (!chartPaletteCache) {
            const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
            chartPaletteCache = { main: '#ffffff', alt: accent || '#b0d0ff', warm: '#ffc531' };
        }
        return chartPaletteCache;
    };

    const KMH = ` ${TXT.kmh}`;

    // axis options: min/max pin a bound, minMax raises an auto max, minSpan
    // forces a minimum visible range, pad adds headroom to auto bounds.
    const CHART_TABS = [
        {
            id: 'temperature', label: TXT.chartTabs.temperature,
            left: { unit: '°', minSpan: 4, pad: 0.12 },
            series: [
                { key: 'temperature_2m', type: 'line', color: 'main', unit: '°', label: TXT.chartSeries.temp },
                { key: 'apparent_temperature', type: 'line', dash: '6 4', color: 'alt', unit: '°', label: TXT.chartSeries.feelsLike },
            ],
        },
        {
            id: 'precipitation', label: TXT.chartTabs.precipitation,
            left: { unit: ' mm', min: 0, minSpan: 1, pad: 0.12 },
            right: { unit: '%', min: 0, max: 100 },
            series: [
                { key: 'precipitation', type: 'bars', color: 'alt', unit: ' mm', decimals: 1, label: TXT.chartSeries.precipAmount },
                { key: 'precipitation_probability', type: 'line', color: 'warm', axis: 'right', unit: '%', label: TXT.chartSeries.precipChance },
            ],
        },
        {
            id: 'wind', label: TXT.chartTabs.wind,
            left: { unit: KMH, min: 0, minSpan: 10, pad: 0.12 },
            arrows: 'wind_direction_10m',
            series: [
                { key: 'wind_speed_10m', type: 'line', color: 'main', unit: KMH, label: TXT.chartSeries.wind },
                { key: 'wind_gusts_10m', type: 'line', dash: '6 4', color: 'alt', unit: KMH, label: TXT.chartSeries.gusts },
            ],
        },
        {
            id: 'humidity', label: TXT.chartTabs.humidity,
            left: { unit: '%', min: 0, max: 100 },
            right: { unit: '°', minSpan: 4, pad: 0.12 },
            series: [
                { key: 'relative_humidity_2m', type: 'line', color: 'main', unit: '%', label: TXT.chartSeries.humidity },
                { key: 'dew_point_2m', type: 'line', dash: '6 4', color: 'alt', axis: 'right', unit: '°', label: TXT.chartSeries.dewPoint },
            ],
        },
        {
            id: 'pressure', label: TXT.chartTabs.pressure,
            left: { unit: ' hPa', minSpan: 6, pad: 0.15 },
            series: [
                { key: 'pressure_msl', type: 'line', color: 'main', unit: ' hPa', label: TXT.chartSeries.pressure },
            ],
        },
        {
            id: 'clouds', label: TXT.chartTabs.clouds,
            left: { unit: '%', min: 0, max: 100 },
            series: [
                { key: 'cloud_cover', type: 'area', color: 'main', unit: '%', label: TXT.chartSeries.cloudTotal },
                { key: 'cloud_cover_low', type: 'line', thin: true, color: 'alt', unit: '%', label: TXT.chartSeries.cloudLow },
                { key: 'cloud_cover_mid', type: 'line', thin: true, dash: '6 4', color: 'warm', unit: '%', label: TXT.chartSeries.cloudMid },
                { key: 'cloud_cover_high', type: 'line', thin: true, dash: '2 3', color: 'main', unit: '%', label: TXT.chartSeries.cloudHigh },
            ],
        },
        {
            id: 'uv', label: TXT.chartTabs.uv,
            left: { unit: '', min: 0, minMax: 11 },
            series: [
                { key: 'uv_index', type: 'bars', color: 'warm', unit: '', label: TXT.chartSeries.uv },
                { key: 'uv_index_clear_sky', type: 'line', dash: '6 4', color: 'main', unit: '', label: TXT.chartSeries.uvClearSky },
            ],
        },
    ];

    /* ---------- scale helpers ---------- */
    const niceNum = (range, round) => {
        if (!(range > 0)) return 1;
        const exp = Math.floor(Math.log10(range));
        const frac = range / Math.pow(10, exp);
        const nf = round
            ? (frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10)
            : (frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10);
        return nf * Math.pow(10, exp);
    };

    // Round a raw [lo, hi] out to human-friendly tick boundaries.
    const niceTicks = (lo, hi, count) => {
        const step = niceNum(niceNum(hi - lo, false) / Math.max(1, count - 1), true);
        const min = Math.floor(lo / step) * step;
        const max = Math.ceil(hi / step) * step;
        const ticks = [];
        // Re-round each tick: repeated addition of a fractional step drifts
        for (let k = 0; min + k * step <= max + step * 0.001; k++) {
            ticks.push(Number((min + k * step).toFixed(6)));
        }
        return { min, max, step, ticks, decimals: step < 1 ? Math.min(2, Math.ceil(-Math.log10(step))) : 0 };
    };

    const computeAxis = (values, opt) => {
        const o = opt || {};
        const nums = values.filter((v) => v != null && isFinite(v));
        if (!nums.length) return null;
        let lo = o.min != null ? o.min : Math.min.apply(null, nums);
        let hi = o.max != null ? o.max : Math.max.apply(null, nums);
        if (o.minMax != null && hi < o.minMax) hi = o.minMax;
        if (hi < lo) hi = lo;

        const pad = (o.pad || 0) * Math.max(1, hi - lo);
        if (o.min == null) lo -= pad;
        if (o.max == null) hi += pad;

        if (o.minSpan != null && hi - lo < o.minSpan) {
            if (o.min != null) {
                hi = lo + o.minSpan;
            } else if (o.max != null) {
                lo = hi - o.minSpan;
            } else {
                const mid = (hi + lo) / 2;
                lo = mid - o.minSpan / 2;
                hi = mid + o.minSpan / 2;
            }
        }
        if (hi - lo < 1e-9) hi = lo + 1;
        return niceTicks(lo, hi, 5);
    };

    const fmtNum = (v, decimals) => Number(v).toFixed(decimals != null ? decimals : 0);
    const fmtSeriesValue = (v, s) => (v == null ? '—' : fmtNum(v, s.decimals) + (s.unit || ''));

    /* ---------- the component ---------- */
    let chartUid = 0;
    const chartMounts = new Set();
    let lastChartTabId = null;   // keep the chosen metric while stepping hours/days

    const destroyChartMounts = () => {
        chartMounts.forEach((m) => m.destroy());
        chartMounts.clear();
    };

    const mountChartTabs = (containerEl, options) => {
        if (!containerEl) return null;
        const opts = options || {};
        const tabs = opts.tabs || CHART_TABS;
        const indices = (opts.indices || []).filter((i) => Number.isInteger(i));
        const highlightIndex = opts.highlightIndex != null ? opts.highlightIndex : null;
        const uid = `chart-${++chartUid}`;
        const panelId = `${uid}-panel`;

        let activeIndex = Math.max(0, tabs.findIndex((t) => t.id === lastChartTabId));
        let rafId = null;
        let destroyed = false;

        containerEl.innerHTML = `
            <div class="chart-wrap">
                <div class="chart-tabs" role="tablist" aria-label="${TXT.chartTabsLabel}">
                    ${tabs.map((t, k) => `
                        <button type="button" class="chart-tab" role="tab" id="${uid}-tab-${k}"
                            aria-controls="${panelId}" aria-selected="${k === activeIndex}"
                            tabindex="${k === activeIndex ? '0' : '-1'}">${t.label}</button>
                    `).join('')}
                </div>
                <div class="chart-panel" id="${panelId}" role="tabpanel"
                    aria-labelledby="${uid}-tab-${activeIndex}" tabindex="0">
                    <div class="chart-plot"></div>
                    <div class="chart-legend"></div>
                </div>
            </div>
        `;

        const tabEls = Array.from(containerEl.querySelectorAll('.chart-tab'));
        const panelEl = containerEl.querySelector('.chart-panel');
        const plotEl = containerEl.querySelector('.chart-plot');
        const legendEl = containerEl.querySelector('.chart-legend');

        // Swatch that mirrors the series' own stroke style, so the legend
        // identifies each line without relying on colour alone.
        const legendSwatch = (s, colour) => (s.type === 'bars' || s.type === 'area')
            ? `<svg width="18" height="10" aria-hidden="true"><rect x="1" y="2" width="16" height="7" rx="1.5"
                   fill="${colour}" fill-opacity="${s.type === 'area' ? '0.32' : '0.85'}"
                   stroke="${colour}" stroke-width="1"></rect></svg>`
            : `<svg width="18" height="10" aria-hidden="true"><line x1="1" y1="5" x2="17" y2="5"
                   stroke="${colour}" stroke-width="${s.thin ? 1.4 : 2.2}" stroke-linecap="round"
                   ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}></line></svg>`;

        const showEmpty = () => {
            plotEl.innerHTML = `<div class="chart-empty t-cap">${TXT.chartNoData}</div>`;
            legendEl.innerHTML = '';
        };

        const draw = () => {
            if (destroyed) return;
            const hourly = lastRender && lastRender.data ? lastRender.data.hourly : null;
            const n = indices.length;
            if (!hourly || !hourly.time || n === 0) { showEmpty(); return; }

            const w = plotEl.clientWidth;
            const h = plotEl.clientHeight || 190;
            if (!w || w < 80) return;   // not laid out yet; the observer will call back

            const tab = tabs[activeIndex];
            const palette = chartPalette();
            const valuesFor = (key) => {
                const arr = hourly[key];
                if (!arr) return null;
                const out = indices.map((i) => (arr[i] != null && isFinite(arr[i]) ? arr[i] : null));
                return out.some((v) => v != null) ? out : null;
            };

            // Only series that actually carry data in this window are drawn
            const visible = [];
            tab.series.forEach((s) => {
                const vals = valuesFor(s.key);
                if (vals) visible.push({ s, vals, colour: palette[s.color] || palette.main });
            });
            if (!visible.length) { showEmpty(); return; }

            const leftVals = [];
            const rightVals = [];
            visible.forEach((v) => {
                const bucket = v.s.axis === 'right' ? rightVals : leftVals;
                v.vals.forEach((x) => bucket.push(x));
            });

            // A tab whose left series are all missing still needs gridlines —
            // borrow the right scale rather than inventing a meaningless 0..1.
            const axisLeftOwn = leftVals.length ? computeAxis(leftVals, tab.left) : null;
            const axisR = rightVals.length ? computeAxis(rightVals, tab.right) : null;
            const axisL = axisLeftOwn || axisR || niceTicks(0, 1, 5);
            visible.forEach((v) => { v.axis = (v.s.axis === 'right' && axisR) ? axisR : axisL; });

            const padL = 38;
            const padR = axisR ? 42 : 14;
            const padT = 12;
            const arrowsH = tab.arrows && hourly[tab.arrows] ? 18 : 0;
            const padB = 26 + arrowsH;
            const plotW = w - padL - padR;
            const plotH = h - padT - padB;
            if (plotW < 40 || plotH < 40) { showEmpty(); return; }

            const baseY = padT + plotH;
            const step = n > 1 ? plotW / (n - 1) : plotW;
            const xAt = (p) => (n > 1 ? padL + (p / (n - 1)) * plotW : padL + plotW / 2);
            const yOn = (axis, v) => {
                const t = (v - axis.min) / (axis.max - axis.min || 1);
                return Math.max(padT, Math.min(baseY, padT + (1 - t) * plotH));
            };

            const parts = [];

            // Night shading — merge consecutive night hours into one band
            const isDayArr = hourly.is_day;
            if (isDayArr) {
                let runStart = -1;
                for (let p = 0; p <= n; p++) {
                    const night = p < n && isDayArr[indices[p]] === 0;
                    if (night && runStart === -1) runStart = p;
                    if (!night && runStart !== -1) {
                        const x0 = Math.max(padL, xAt(runStart) - step / 2);
                        const x1 = Math.min(padL + plotW, xAt(p - 1) + step / 2);
                        if (x1 > x0) parts.push(`<rect x="${x0.toFixed(1)}" y="${padT}" width="${(x1 - x0).toFixed(1)}" height="${plotH.toFixed(1)}" fill="${CHART_INK.night}"></rect>`);
                        runStart = -1;
                    }
                }
            }

            // Gridlines + left axis labels
            axisL.ticks.forEach((t) => {
                if (t < axisL.min - 1e-9 || t > axisL.max + 1e-9) return;
                const y = yOn(axisL, t);
                parts.push(`<line x1="${padL}" y1="${y.toFixed(1)}" x2="${(padL + plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${CHART_INK.grid}" stroke-width="1"></line>`);
                if (axisLeftOwn) {
                    parts.push(`<text x="${padL - 6}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" font-size="10" fill="${CHART_INK.axis}">${fmtNum(t, axisL.decimals)}</text>`);
                }
            });
            if (axisR) {
                axisR.ticks.forEach((t) => {
                    if (t < axisR.min - 1e-9 || t > axisR.max + 1e-9) return;
                    const y = yOn(axisR, t);
                    parts.push(`<text x="${(padL + plotW + 6).toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="start" font-size="10" fill="${CHART_INK.axis}">${fmtNum(t, axisR.decimals)}</text>`);
                });
            }

            // X labels: every 3 h on short windows, one per day on long ones
            const spansDays = hourly.time[indices[0]].slice(0, 10) !== hourly.time[indices[n - 1]].slice(0, 10);
            let labelPos = [];
            if (n <= 26) {
                for (let p = 0; p < n; p++) {
                    if (parseInt(hourly.time[indices[p]].slice(11, 13), 10) % 3 === 0) labelPos.push(p);
                }
            } else {
                let seen = null;
                for (let p = 0; p < n; p++) {
                    const d = hourly.time[indices[p]].slice(0, 10);
                    if (d !== seen) { labelPos.push(p); seen = d; }
                }
            }
            // Thin out if the labels would collide
            if (labelPos.length > 1 && plotW / labelPos.length < 34) {
                labelPos = labelPos.filter((_, k) => k % 2 === 0);
            }
            labelPos.forEach((p) => {
                const iso = hourly.time[indices[p]];
                const text = n <= 26 ? formatHour(iso) : getDayName(iso.slice(0, 10), -1);
                const x = Math.max(padL + 8, Math.min(padL + plotW - 8, xAt(p)));
                parts.push(`<text x="${x.toFixed(1)}" y="${(baseY + 15).toFixed(1)}" text-anchor="middle" font-size="10" fill="${CHART_INK.axis}">${text}</text>`);
            });

            // Series — nulls break the path instead of plotting as zero
            const linePath = (vals, axis) => {
                let d = '', pen = false;
                for (let p = 0; p < n; p++) {
                    if (vals[p] == null) { pen = false; continue; }
                    d += `${pen ? 'L' : 'M'}${xAt(p).toFixed(1)} ${yOn(axis, vals[p]).toFixed(1)} `;
                    pen = true;
                }
                return d.trim();
            };
            const areaPath = (vals, axis) => {
                let d = '', run = [];
                const flush = () => {
                    if (run.length) {
                        d += `M${xAt(run[0]).toFixed(1)} ${baseY.toFixed(1)} `
                            + run.map((p) => `L${xAt(p).toFixed(1)} ${yOn(axis, vals[p]).toFixed(1)} `).join('')
                            + `L${xAt(run[run.length - 1]).toFixed(1)} ${baseY.toFixed(1)} Z `;
                    }
                    run = [];
                };
                for (let p = 0; p < n; p++) {
                    if (vals[p] == null) flush(); else run.push(p);
                }
                flush();
                return d.trim();
            };

            visible.forEach((v) => {
                const { s, vals, axis, colour } = v;
                if (s.type === 'bars') {
                    const zeroY = yOn(axis, Math.max(axis.min, Math.min(0, axis.max)));
                    const bw = Math.max(2, Math.min(step * 0.62, 26));
                    for (let p = 0; p < n; p++) {
                        if (vals[p] == null) continue;
                        const y = yOn(axis, vals[p]);
                        const top = Math.min(y, zeroY);
                        const hgt = Math.abs(zeroY - y);
                        if (hgt < 0.4) continue;
                        parts.push(`<rect x="${(xAt(p) - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${hgt.toFixed(1)}" rx="${Math.min(2, bw / 3).toFixed(1)}" fill="${colour}" fill-opacity="0.72"></rect>`);
                    }
                } else if (s.type === 'area') {
                    const d = areaPath(vals, axis);
                    if (d) parts.push(`<path d="${d}" fill="${colour}" fill-opacity="0.20" stroke="none"></path>`);
                    const l = linePath(vals, axis);
                    if (l) parts.push(`<path d="${l}" fill="none" stroke="${colour}" stroke-width="1.8" stroke-opacity="0.85" stroke-linecap="round" stroke-linejoin="round"></path>`);
                } else {
                    const d = linePath(vals, axis);
                    if (d) parts.push(`<path d="${d}" fill="none" stroke="${colour}" stroke-width="${s.thin ? 1.4 : 2.2}" stroke-linecap="round" stroke-linejoin="round"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}></path>`);
                }
                // Points with no drawable neighbour would otherwise vanish
                for (let p = 0; p < n; p++) {
                    if (vals[p] == null) continue;
                    const lonely = (p === 0 || vals[p - 1] == null) && (p === n - 1 || vals[p + 1] == null);
                    if (lonely && s.type !== 'bars') {
                        parts.push(`<circle cx="${xAt(p).toFixed(1)}" cy="${yOn(axis, vals[p]).toFixed(1)}" r="2.2" fill="${colour}"></circle>`);
                    }
                }
            });

            // Wind direction arrows (meteorological: points the way the wind
            // comes from, matching the hero card's arrow convention)
            if (arrowsH) {
                const dirs = hourly[tab.arrows];
                const ay = baseY + 15 + 12;
                for (let p = 0; p < n; p++) {
                    if (parseInt(hourly.time[indices[p]].slice(11, 13), 10) % 3 !== 0) continue;
                    const dir = dirs[indices[p]];
                    if (dir == null) continue;
                    const x = Math.max(padL + 6, Math.min(padL + plotW - 6, xAt(p)));
                    parts.push(`<path d="M0 -4.5 L3 4 L0 1.8 L-3 4 Z" fill="${palette.main}" fill-opacity="0.75" transform="translate(${x.toFixed(1)} ${ay.toFixed(1)}) rotate(${Math.round(dir)})"></path>`);
                }
            }

            // Highlighted hour
            const hp = highlightIndex != null ? indices.indexOf(highlightIndex) : -1;
            if (hp !== -1) {
                const x = xAt(hp);
                parts.push(`<line x1="${x.toFixed(1)}" y1="${padT}" x2="${x.toFixed(1)}" y2="${baseY.toFixed(1)}" stroke="${CHART_INK.mark}" stroke-width="1.5" stroke-dasharray="3 3"></line>`);
                visible.forEach((v) => {
                    if (v.vals[hp] == null) return;
                    parts.push(`<circle cx="${x.toFixed(1)}" cy="${yOn(v.axis, v.vals[hp]).toFixed(1)}" r="3.4" fill="${v.colour}" stroke="rgba(0,0,0,0.35)" stroke-width="1"></circle>`);
                });
            }

            // Cursor layer, positioned by the pointer handlers below
            const cursorDots = visible.map((v) => `<circle r="3.6" fill="${v.colour}" stroke="rgba(0,0,0,0.35)" stroke-width="1" cx="0" cy="0"></circle>`).join('');
            parts.push(`<g class="chart-cursor" style="display: none;" pointer-events="none">
                <line class="chart-cursor-line" x1="0" y1="${padT}" x2="0" y2="${baseY.toFixed(1)}" stroke="#fff" stroke-opacity="0.7" stroke-width="1"></line>
                ${cursorDots}
            </g>`);

            const main = visible[0];
            const mainNums = main.vals.filter((v) => v != null);
            const ariaLabel = `${tab.label}. ${main.s.label} `
                + `${fmtSeriesValue(Math.min.apply(null, mainNums), main.s)} to ${fmtSeriesValue(Math.max.apply(null, mainNums), main.s)}, `
                + `${formatHour(hourly.time[indices[0]])} to ${formatHour(hourly.time[indices[n - 1]])}`;

            plotEl.innerHTML = `<svg class="chart-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${ariaLabel}">${parts.join('')}</svg><div class="chart-tooltip" role="presentation"></div>`;

            legendEl.innerHTML = visible.map((v) => `
                <span class="chart-legend-item">${legendSwatch(v.s, v.colour)}<span class="t-cap">${v.s.label}</span></span>
            `).join('');

            /* ---------- crosshair + tooltip ---------- */
            const svg = plotEl.querySelector('.chart-svg');
            const tip = plotEl.querySelector('.chart-tooltip');
            const cursor = svg.querySelector('.chart-cursor');
            const cursorLine = cursor.querySelector('.chart-cursor-line');
            const dotEls = Array.from(cursor.querySelectorAll('circle'));
            let pressing = false;

            const hideCursor = () => {
                pressing = false;
                cursor.style.display = 'none';
                tip.classList.remove('is-visible');
            };

            const moveCursor = (clientX) => {
                const box = svg.getBoundingClientRect();
                if (!box.width) return;
                const px = (clientX - box.left) * (w / box.width);
                const p = n > 1
                    ? Math.max(0, Math.min(n - 1, Math.round((px - padL) / step)))
                    : 0;
                const x = xAt(p);

                cursor.style.display = '';
                cursorLine.setAttribute('x1', x.toFixed(1));
                cursorLine.setAttribute('x2', x.toFixed(1));
                visible.forEach((v, k) => {
                    const dot = dotEls[k];
                    if (!dot) return;
                    if (v.vals[p] == null) { dot.setAttribute('r', '0'); return; }
                    dot.setAttribute('r', '3.6');
                    dot.setAttribute('cx', x.toFixed(1));
                    dot.setAttribute('cy', yOn(v.axis, v.vals[p]).toFixed(1));
                });

                const iso = hourly.time[indices[p]];
                const when = spansDays ? `${getDayName(iso.slice(0, 10), -1)} ${formatHour(iso)}` : formatHour(iso);
                tip.innerHTML = `<div class="chart-tt-time">${when}</div>`
                    + visible.map((v) => `<div class="chart-tt-row">
                            <span class="chart-tt-swatch" style="background: ${v.colour};"></span>
                            <span>${v.s.label} ${fmtSeriesValue(v.vals[p], v.s)}</span>
                        </div>`).join('');
                tip.classList.add('is-visible');

                // Keep the tooltip inside the plot box
                const tw = tip.offsetWidth;
                let left = x + 14;
                if (left + tw > w - 4) left = x - 14 - tw;
                tip.style.left = `${Math.max(4, Math.min(w - tw - 4, left))}px`;
            };

            svg.addEventListener('pointerdown', (e) => {
                if (e.pointerType !== 'mouse') pressing = true;
                moveCursor(e.clientX);
            });
            svg.addEventListener('pointermove', (e) => {
                if (e.pointerType !== 'mouse' && !pressing) return;
                moveCursor(e.clientX);
            });
            svg.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') hideCursor(); });
            svg.addEventListener('pointercancel', hideCursor);
            svg.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hideCursor(); });
        };

        const scheduleDraw = () => {
            if (destroyed || rafId !== null) return;
            rafId = requestAnimationFrame(() => { rafId = null; draw(); });
        };

        const selectTab = (k, focus) => {
            activeIndex = k;
            lastChartTabId = tabs[k].id;
            tabEls.forEach((el, j) => {
                el.setAttribute('aria-selected', String(j === k));
                el.tabIndex = j === k ? 0 : -1;
            });
            panelEl.setAttribute('aria-labelledby', `${uid}-tab-${k}`);
            if (focus) tabEls[k].focus();
            draw();
        };

        tabEls.forEach((el, k) => {
            el.addEventListener('click', () => selectTab(k, false));
            el.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
                // The popup also steps hours/days on arrows — this wins while
                // a tab has focus
                e.preventDefault();
                e.stopPropagation();
                selectTab((k + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length, true);
            });
        });

        const observer = new ResizeObserver(scheduleDraw);
        observer.observe(plotEl);
        draw();

        const handle = {
            // The first mount happens while the dialog is still display:none,
            // so the popup asks for a redraw once it is on screen.
            redraw: scheduleDraw,
            destroy() {
                if (destroyed) return;
                destroyed = true;
                if (rafId !== null) cancelAnimationFrame(rafId);
                observer.disconnect();
                containerEl.innerHTML = '';   // drops every listener with the nodes
                chartMounts.delete(handle);
            },
        };
        chartMounts.add(handle);
        return handle;
    };

    /* =====================================================================
       Detail popup content — thresholds and wording.
       Every descriptive word and cut-off lives here so it is easy to tune.
       ===================================================================== */

    // Beyond this day the models publish 3–6-hourly output that Open-Meteo
    // interpolates back to hourly, so single hours carry less real detail.
    const LOW_CONFIDENCE_FROM_DAY = 7;   // 0-based day index → the 8th day onward

    // Ensemble spread (p90 − p10 of members' daily mean temperature, °C).
    // Sanity-checked live for Sofia: ~0.6–1.2° on days 0–3 (high), ~3.4–4.1°
    // on days 4–9 (medium, day 7 just tips into low), ~5.1–5.6° on days
    // 10–13 (low) — a believable near-monotonic widening with lead time.
    const ENSEMBLE_SPREAD_HIGH_C = 2;
    const ENSEMBLE_SPREAD_MEDIUM_C = 4;

    // [upper bound (exclusive), word] — the last entry is the catch-all
    const WIND_WORDS = [[2, 'Calm'], [12, 'Light'], [20, 'Moderate'], [29, 'Fresh'], [39, 'Strong'], [Infinity, 'Very strong']];
    const DEW_POINT_WORDS = [[10, 'Dry'], [16, 'Comfortable'], [21, 'Humid'], [Infinity, 'Oppressive']];
    const VISIBILITY_WORDS = [[1, 'Very poor'], [4, 'Poor'], [10, 'Moderate'], [Infinity, 'Good']];  // km
    const HAZE_WORDS = [[0.1, 'Clear'], [0.3, 'Light haze'], [Infinity, 'Hazy']];                    // aerosol optical depth

    const PRESSURE_STEADY_HPA = 1;    // ±1 hPa over 3 h still reads as steady
    const PRESSURE_TREND_HOURS = 3;
    const SNOW_TILE_MAX_TEMP = 4;     // °C — show the snow tile at or below this
    const VISIBILITY_DECIMAL_BELOW_KM = 10;

    // Approximate pollen scale (grains/m³). Open-Meteo publishes no official
    // band table for these, so these are widely-used rough thresholds —
    // indicative only, tune freely.
    const POLLEN_LEVELS = [[10, 'Low'], [50, 'Moderate'], [200, 'High'], [Infinity, 'Very high']];
    const POLLEN_BAR_FULL = 200;      // grains/m³ that fills the level bar

    // European AQI bands and their official colours
    const AQI_BANDS = [
        { max: 20,       name: 'Good',            color: '#50f0e6' },
        { max: 40,       name: 'Fair',            color: '#50ccaa' },
        { max: 60,       name: 'Moderate',        color: '#f0e641' },
        { max: 80,       name: 'Poor',            color: '#ff5050' },
        { max: 100,      name: 'Very poor',       color: '#960032' },
        { max: Infinity, name: 'Extremely poor',  color: '#7d2181' },
    ];
    const AQI_SCALE_MAX = 120;        // the open-ended top band is clipped here on the bar
    const AQI_SUB_INDEX_KEYS = ['pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide', 'sulphur_dioxide'];
    const AQI_CHIP_KEYS = ['pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide'];

    // Thunderstorm estimate. CAPE in J/kg (higher = more energy); lifted index
    // in °C (NEGATIVE = unstable). Steps map onto none / low / moderate / high.
    const THUNDER_CAPE_STEPS = [300, 1000, 2500];
    const THUNDER_LI_STEPS = [0, -2, -5];
    const THUNDER_LEVEL_NAMES = ['none', 'low', 'moderate', 'high'];

    /* ---------- small null-safe helpers ---------- */
    const DASH = '—';

    const wordFor = (table, v) => {
        for (let k = 0; k < table.length; k++) if (v < table[k][0]) return table[k][1];
        return table[table.length - 1][1];
    };

    // Any hourly value, or null when absent / non-finite
    const hourlyValue = (key, i) => {
        if (!lastRender) return null;
        const arr = lastRender.data.hourly[key];
        const v = arr ? arr[i] : null;
        return (v != null && isFinite(v)) ? v : null;
    };

    const fmtOr = (v, decimals, unit) => (v == null
        ? DASH
        : Number(v).toFixed(decimals != null ? decimals : 0) + (unit || ''));

    // Linear-interpolated percentile of an already-sorted array
    const quantile = (sorted, q) => {
        const pos = (sorted.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
    };

    // Per-member DAILY MEAN temperature (robust to a coarser ensemble time
    // step than the hourly one), then min/max/p10/median/p90/spread across
    // members. Matches by date prefix against the ensemble's own hourly.time
    // rather than assuming it shares indices with the main forecast.
    const ensembleStatsForDay = (dayIndex) => {
        if (!lastRender || !lastRender.ensemble) return null;
        const dateStr = lastRender.data.daily.time[dayIndex];
        if (!dateStr) return null;
        const ens = lastRender.ensemble.hourly;
        if (!ens || !ens.time) return null;

        const indices = [];
        for (let i = 0; i < ens.time.length; i++) if (ens.time[i].slice(0, 10) === dateStr) indices.push(i);
        if (!indices.length) return null;

        const memberKeys = Object.keys(ens).filter((k) => k === 'temperature_2m' || k.startsWith('temperature_2m_member'));
        const means = [];
        memberKeys.forEach((key) => {
            const arr = ens[key];
            let sum = 0, count = 0;
            indices.forEach((i) => {
                const v = arr[i];
                if (v != null && isFinite(v)) { sum += v; count++; }
            });
            if (count) means.push(sum / count);   // a member missing every hour this day is skipped entirely
        });
        if (!means.length) return null;

        means.sort((a, b) => a - b);
        return {
            min: means[0], max: means[means.length - 1],
            p10: quantile(means, 0.10), median: quantile(means, 0.5), p90: quantile(means, 0.90),
            spread: quantile(means, 0.90) - quantile(means, 0.10),
            members: means.length, model: ENSEMBLE_MODEL_LABEL,
        };
    };

    // Ensemble spread when available (source 'ensemble'); otherwise the
    // lead-time rule (source 'lead-time'). Both popups keep working either way.
    const confidenceForDay = (dayIndex) => {
        const stats = ensembleStatsForDay(dayIndex);
        if (stats) {
            const level = stats.spread <= ENSEMBLE_SPREAD_HIGH_C ? 'high'
                : stats.spread <= ENSEMBLE_SPREAD_MEDIUM_C ? 'medium' : 'low';
            return { level, source: 'ensemble', spread: stats.spread, members: stats.members, model: stats.model };
        }
        return {
            level: (dayIndex != null && dayIndex >= LOW_CONFIDENCE_FROM_DAY) ? 'low' : 'high',
            source: 'lead-time', spread: null, members: null, model: null,
        };
    };

    // Badge for both popups: hidden at 'high', otherwise the level word plus
    // an interpolation note gated purely on lead time (independent of level).
    const confidenceBadgeHtml = (confidence, dayIndex) => {
        if (confidence.level === 'high') return '';
        const interpolated = dayIndex != null && dayIndex >= LOW_CONFIDENCE_FROM_DAY;
        return `<div class="confidence-badge confidence-badge--${confidence.level} t-cap">`
            + `${TXT.detail.confidenceBadge[confidence.level]}${interpolated ? ` · ${TXT.detail.confidenceBadge.interpolated}` : ''}</div>`;
    };

    const aqiBandFor = (aqi) => {
        for (let k = 0; k < AQI_BANDS.length; k++) if (aqi < AQI_BANDS[k].max) return AQI_BANDS[k];
        return AQI_BANDS[AQI_BANDS.length - 1];
    };

    // Highest of CAPE-derived and lifted-index-derived risk; an explicit
    // thunder weather_code floors the result at "moderate".
    const thunderRisk = (cape, liftedIndex, code) => {
        let step = -1;
        if (cape != null) {
            let k = 0;
            while (k < THUNDER_CAPE_STEPS.length && cape >= THUNDER_CAPE_STEPS[k]) k++;
            step = Math.max(step, k);
        }
        if (liftedIndex != null) {
            let k = 0;
            while (k < THUNDER_LI_STEPS.length && liftedIndex <= THUNDER_LI_STEPS[k]) k++;
            step = Math.max(step, k);
        }
        if (THUNDER_CODES.includes(code)) step = Math.max(step, 2);
        if (step < 0) return null;
        return THUNDER_LEVEL_NAMES[Math.min(step, THUNDER_LEVEL_NAMES.length - 1)];
    };

    /* ---------- shared markup fragments ---------- */
    const tileHtml = (title, body, note) => `
        <div class="detail-tile">
            <div class="t-cap-heading">${title}${note ? ` <span class="tile-note">${note}</span>` : ''}</div>
            ${body}
        </div>
    `;

    const windArrowHtml = (deg, size) => `
        <svg width="${size}" height="${size}" viewBox="0 0 30 30" aria-hidden="true" style="transform: rotate(${Math.round(deg)}deg);">
            <circle cx="15" cy="15" r="13" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"></circle>
            <path d="M15 6L20 18H10Z" fill="#f7f5f0"></path>
        </svg>
    `;

    // Same gradient + reveal trick as the main screen's UV bar
    const uvBarHtml = (uv) => {
        const pct = Math.max(0, Math.min(100, uv / 11 * 100));
        const size = pct > 0 ? `${(100 / (pct / 100)).toFixed(1)}% 100%` : '100% 100%';
        return `<div class="bar-track"><div class="uv-fill" style="width: ${pct.toFixed(1)}%; background-size: ${size};"></div></div>`;
    };

    // formatUv can return "<1", which must not look like a tag in innerHTML
    const uvTextHtml = (uv) => formatUv(uv).replace('<', '&lt;');

    const miniBarHtml = (pct, color) => `
        <div class="bar-track mini"><div class="mini-fill" style="width: ${Math.max(0, Math.min(100, pct)).toFixed(0)}%; background: ${color};"></div></div>
    `;

    const OPEN_METEO_URL = 'https://open-meteo.com/';
    const CAMS_URL = 'https://atmosphere.copernicus.eu/';   // Copernicus Atmosphere Monitoring Service

    // Bottom-of-popup credit line. The CAMS half only appears when this
    // hour/day actually has real air-quality or pollen content on screen —
    // not just the muted "forecast covers ~4-5 days" fallback line.
    const attributionHtml = (hasCams) => {
        const A = TXT.detail.attribution;
        const openMeteoLink = `<a href="${OPEN_METEO_URL}" target="_blank" rel="noopener">${A.openMeteo}</a>`;
        const camsLink = `<a href="${CAMS_URL}" target="_blank" rel="noopener">${A.cams}</a>`;
        return `<div class="detail-attribution t-cap">`
            + `${A.weather} ${openMeteoLink}`
            + `${hasCams ? ` · ${A.airQuality} ${camsLink} ${A.viaOpenMeteo}` : ''}`
            + `</div>`;
    };

    /* ---------- tiles ---------- */
    const precipitationTile = (i) => {
        const amount = hourlyValue('precipitation', i);
        const prob = hourlyValue('precipitation_probability', i);
        const rain = hourlyValue('rain', i);
        const showers = hourlyValue('showers', i);
        const snow = hourlyValue('snowfall', i);
        if (amount == null && prob == null) return '';

        const rows = [];
        if (rain != null && rain > 0) rows.push([TXT.detail.rain, fmtOr(rain, 1, ' mm')]);
        if (showers != null && showers > 0) rows.push([TXT.detail.showers, fmtOr(showers, 1, ' mm')]);
        if (snow != null && snow > 0) rows.push([TXT.detail.snow, fmtOr(snow, 1, ' cm')]);

        const headline = (amount != null && amount > 0)
            ? `<span class="t-value">${fmtOr(amount, 1)}</span><span class="tile-unit">mm</span>`
            : `<span class="t-value">${amount == null ? DASH : TXT.detail.dry}</span>`;

        return tileHtml(TXT.detail.precipitation, `
            <div class="tile-value-row">${headline}</div>
            ${prob != null ? `<div class="t-body">${TXT.detail.chance} <span class="t-cap-accent">${fmtOr(prob, 0, '%')}</span></div>` : ''}
            ${rows.map(([k, v]) => `<div class="tile-row"><span class="t-cap">${k}</span><span class="t-cap-emph">${v}</span></div>`).join('')}
        `);
    };

    const windTile = (i) => {
        const speed = hourlyValue('wind_speed_10m', i);
        const gusts = hourlyValue('wind_gusts_10m', i);
        const dir = hourlyValue('wind_direction_10m', i);
        if (speed == null && gusts == null && dir == null) return '';

        return tileHtml(TXT.detail.wind, `
            <div class="tile-value-row">
                <span class="t-value">${fmtOr(speed, 0)}</span><span class="tile-unit">${TXT.kmh}</span>
                ${dir != null ? windArrowHtml(dir, 26) : ''}
            </div>
            ${speed != null ? `<div class="t-body">${wordFor(WIND_WORDS, speed)}</div>` : ''}
            ${dir != null ? `<div class="tile-row"><span class="t-cap">${getCompass(dir)}</span><span class="t-cap-emph">${fmtOr(dir, 0, '°')}</span></div>` : ''}
            ${gusts != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.gusts}</span><span class="t-cap-emph">${fmtOr(gusts, 0, ' ' + TXT.kmh)}</span></div>` : ''}
        `);
    };

    const humidityTile = (i) => {
        const rh = hourlyValue('relative_humidity_2m', i);
        const dp = hourlyValue('dew_point_2m', i);
        if (rh == null && dp == null) return '';

        return tileHtml(TXT.detail.humidity, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(rh, 0)}</span><span class="tile-unit">%</span></div>
            ${dp != null ? `<div class="t-body">${wordFor(DEW_POINT_WORDS, dp)}</div>` : ''}
            ${dp != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.dewPoint}</span><span class="t-cap-emph">${fmtOr(dp, 0, '°')}</span></div>` : ''}
        `);
    };

    const pressureTile = (i) => {
        const p = hourlyValue('pressure_msl', i);
        if (p == null) return '';

        // Trend needs a reading 3 h back; near the array start there isn't one
        let trend = '';
        const prev = i >= PRESSURE_TREND_HOURS ? hourlyValue('pressure_msl', i - PRESSURE_TREND_HOURS) : null;
        if (prev != null) {
            const delta = p - prev;
            const word = Math.abs(delta) <= PRESSURE_STEADY_HPA ? TXT.detail.steady
                : delta > 0 ? TXT.detail.rising : TXT.detail.falling;
            const glyph = Math.abs(delta) <= PRESSURE_STEADY_HPA ? '→' : delta > 0 ? '↑' : '↓';
            trend = `<div class="tile-row"><span class="t-cap">${TXT.detail.trend3h}</span>`
                + `<span class="t-cap-emph">${glyph} ${word} ${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span></div>`;
        }

        return tileHtml(TXT.detail.pressure, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(p, 0)}</span><span class="tile-unit">hPa</span></div>
            ${trend}
        `);
    };

    const cloudsTile = (i) => {
        const total = hourlyValue('cloud_cover', i);
        const layers = [
            [TXT.detail.cloudLow, hourlyValue('cloud_cover_low', i)],
            [TXT.detail.cloudMid, hourlyValue('cloud_cover_mid', i)],
            [TXT.detail.cloudHigh, hourlyValue('cloud_cover_high', i)],
        ].filter(([, v]) => v != null);
        if (total == null && !layers.length) return '';

        return tileHtml(TXT.detail.clouds, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(total, 0)}</span><span class="tile-unit">%</span></div>
            ${layers.map(([name, v]) => `
                <div class="layer-row">
                    <span class="t-cap layer-name">${name}</span>
                    ${miniBarHtml(v, 'rgba(255,255,255,0.75)')}
                    <span class="t-cap-emph layer-value">${fmtOr(v, 0, '%')}</span>
                </div>
            `).join('')}
        `);
    };

    const visibilityTile = (i) => {
        const metres = hourlyValue('visibility', i);   // API reports metres
        if (metres == null) return '';
        const km = metres / 1000;
        const shown = km < VISIBILITY_DECIMAL_BELOW_KM ? km.toFixed(1) : String(Math.round(km));

        return tileHtml(TXT.detail.visibility, `
            <div class="tile-value-row"><span class="t-value">${shown}</span><span class="tile-unit">km</span></div>
            <div class="t-body">${wordFor(VISIBILITY_WORDS, km)}</div>
        `);
    };

    const uvTile = (i) => {
        const uv = hourlyValue('uv_index', i);
        const clear = hourlyValue('uv_index_clear_sky', i);
        const isDay = hourlyValue('is_day', i);
        if (uv == null) return '';
        if (!(isDay === 1 || uv > 0)) return '';   // night with no UV — nothing to say

        return tileHtml(TXT.detail.uvIndex, `
            <div class="tile-value-row"><span class="t-value">${uvTextHtml(uv)}</span></div>
            <div class="uv-bar-wrap">
                <span class="t-body">${getUvLabel(uv)}</span>
                ${uvBarHtml(uv)}
            </div>
            ${clear != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.clearSky}</span><span class="t-cap-emph">${uvTextHtml(clear)}</span></div>` : ''}
        `);
    };

    const thunderTile = (i) => {
        const cape = hourlyValue('cape', i);
        const li = hourlyValue('lifted_index', i);
        const code = hourlyValue('weather_code', i);
        const level = thunderRisk(cape, li, code);
        if (level == null) return '';   // nothing to base an estimate on

        return tileHtml(TXT.detail.thunder, `
            <div class="tile-value-row"><span class="t-value">${TXT.detail.thunderLevels[level]}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.detail.cape}</span><span class="t-cap-emph">${fmtOr(cape, 0, ' J/kg')}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.detail.liftedIndex}</span><span class="t-cap-emph">${fmtOr(li, 1)}</span></div>
        `, TXT.detail.estimated);
    };

    const snowTile = (i) => {
        const snowfall = hourlyValue('snowfall', i);            // cm
        const depthM = hourlyValue('snow_depth', i);            // metres
        const freezing = hourlyValue('freezing_level_height', i);
        const temp = hourlyValue('temperature_2m', i);

        const relevant = (snowfall != null && snowfall > 0)
            || (depthM != null && depthM > 0)
            || (temp != null && temp <= SNOW_TILE_MAX_TEMP);
        if (!relevant) return '';
        if (snowfall == null && depthM == null && freezing == null) return '';

        return tileHtml(TXT.detail.snowTitle, `
            ${snowfall != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.snowfall}</span><span class="t-cap-emph">${fmtOr(snowfall, 1, ' cm')}</span></div>` : ''}
            ${depthM != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.snowDepth}</span><span class="t-cap-emph">${fmtOr(depthM * 100, 1, ' cm')}</span></div>` : ''}
            ${freezing != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.freezingLevel}</span><span class="t-cap-emph">${fmtOr(freezing, 0, ' m')}</span></div>` : ''}
        `);
    };

    /* ---------- air quality + pollen ---------- */
    const airQualitySection = (i) => {
        const aq = aqAt(i);
        const aqi = aq ? aq.european_aqi : null;
        if (!aq || aqi == null) {
            return `<section class="detail-section">
                <div class="t-cap-heading">${TXT.detail.airQuality}</div>
                <div class="t-cap section-muted">${TXT.detail.aqUnavailable}</div>
            </section>`;
        }

        const band = aqiBandFor(aqi);
        const markerPct = Math.max(0, Math.min(100, aqi / AQI_SCALE_MAX * 100));

        // Leading pollutant = whichever sub-index equals the overall maximum
        let leadKey = null, leadValue = -Infinity;
        AQI_SUB_INDEX_KEYS.forEach((key) => {
            const sub = aq[`european_aqi_${key}`];
            if (sub != null && sub > leadValue) { leadValue = sub; leadKey = key; }
        });

        const chips = AQI_CHIP_KEYS.map((key) => {
            const conc = aq[key];
            if (conc == null) return '';
            const sub = aq[`european_aqi_${key}`];
            const tint = sub != null ? aqiBandFor(sub).color : 'rgba(255,255,255,0.5)';
            return `<div class="aq-chip" style="border-color: ${tint};">
                <span class="aq-chip-dot" style="background: ${tint};"></span>
                <span class="t-cap">${TXT.detail.pollutants[key]}</span>
                <span class="t-cap-emph">${fmtOr(conc, 1)}</span>
            </div>`;
        }).join('');

        const dust = aq.dust;
        const aod = aq.aerosol_optical_depth;

        return `<section class="detail-section">
            <div class="t-cap-heading">${TXT.detail.airQuality}</div>
            <div class="aq-head">
                <span class="t-value">${fmtOr(aqi, 0)}</span>
                <span class="aq-band" style="color: ${band.color};">${band.name}</span>
                <span class="t-cap">${TXT.detail.aqiLabel}</span>
            </div>
            <div class="aq-scale">
                ${AQI_BANDS.map((b) => `<span class="aq-scale-band" style="background: ${b.color};"></span>`).join('')}
                <span class="aq-marker" style="left: ${markerPct.toFixed(1)}%;"></span>
            </div>
            ${leadKey ? `<div class="t-cap">${TXT.detail.leadingPollutant}: <span class="t-cap-emph">${TXT.detail.pollutants[leadKey]}</span></div>` : ''}
            ${chips ? `<div class="aq-chips">${chips}</div>` : ''}
            ${dust != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.dust}</span><span class="t-cap-emph">${fmtOr(dust, 1, ' µg/m³')}</span></div>` : ''}
            ${aod != null ? `<div class="tile-row"><span class="t-cap">${TXT.detail.haze}</span><span class="t-cap-emph">${wordFor(HAZE_WORDS, aod)} (${fmtOr(aod, 2)})</span></div>` : ''}
        </section>`;
    };

    const pollenSection = (i) => {
        const aq = aqAt(i);
        if (!aq) return '';
        const keys = Object.keys(TXT.detail.pollenSpecies);
        const present = keys.filter((k) => aq[k] != null);
        if (!present.length) return '';   // out of the pollen forecast range entirely

        const active = present.filter((k) => aq[k] > 0);
        const body = active.length
            ? active.map((k) => {
                const v = aq[k];
                return `<div class="pollen-row">
                    <span class="t-body pollen-name">${TXT.detail.pollenSpecies[k]}</span>
                    ${miniBarHtml(Math.max(2, v / POLLEN_BAR_FULL * 100), 'var(--accent)')}
                    <span class="t-cap pollen-value">${fmtOr(v, 1)} ${TXT.detail.grainsPerM3} · ${wordFor(POLLEN_LEVELS, v)}</span>
                </div>`;
            }).join('')
            : `<div class="t-cap section-muted">${TXT.detail.noPollen}</div>`;

        return `<section class="detail-section">
            <div class="t-cap-heading">${TXT.detail.pollen}</div>
            ${body}
        </section>`;
    };

    /* =====================================================================
       Day popup — aggregation and wording.
       Builds on the hour popup's constants/helpers; only genuinely
       day-scoped thresholds are introduced here.
       ===================================================================== */

    // An hour joins a precipitation window on either trigger
    const PRECIP_WINDOW_MM = 0.2;
    const PRECIP_WINDOW_PROB = 50;
    const PRECIP_WINDOW_MAX_GAP = 1;      // merge windows split by ≤ this many dry hours
    const UV_PROTECTION_FROM = 3;         // uv_index at/above which protection is advised

    // The hour tile's ±1 hPa judges a 3-hour span; a whole day moves more
    // before it is worth calling a trend, hence a separate threshold.
    const DAY_PRESSURE_STEADY_HPA = 2;
    const DAY_COMPARE_SAME_C = 1;         // |Δmax| at/below this reads as "about the same"

    // Summary sentence triggers
    const SUMMARY_GUST_KMH = 45;
    const SUMMARY_UV_HIGH = 6;
    const SUMMARY_SMALL_CHANCE_PCT = 30;
    const SUMMARY_MAX_EXTRAS = 2;         // highlights appended after the base sentence

    // Open-Meteo `moon_phase` is a fraction of the synodic month, verified
    // live as 0–1 (unit "fraction"): 0/1 = new, 0.25 = first quarter,
    // 0.5 = full, 0.75 = last quarter. Bands below are centred on those.
    const MOON_PHASE_NAMES = [
        [0.0625, 'New moon'], [0.1875, 'Waxing crescent'], [0.3125, 'First quarter'],
        [0.4375, 'Waxing gibbous'], [0.5625, 'Full moon'], [0.6875, 'Waning gibbous'],
        [0.8125, 'Last quarter'], [0.9375, 'Waning crescent'], [Infinity, 'New moon'],
    ];

    /* ---------- daily accessors ---------- */
    const dailyValue = (key, d) => {
        if (!lastRender) return null;
        const arr = lastRender.data.daily[key];
        const v = arr ? arr[d] : null;
        return (v != null && isFinite(v)) ? v : null;
    };

    // sunrise / sunset / moonrise / moonset are ISO strings, not numbers
    const dailyText = (key, d) => {
        if (!lastRender) return null;
        const arr = lastRender.data.daily[key];
        const v = arr ? arr[d] : null;
        return (typeof v === 'string' && v) ? v : null;
    };

    // An en-dash between negatives ("-8–-1") is unreadable, so those spell it out
    const formatTempRange = (lo, hi) => (lo < 0 || hi < 0)
        ? `${lo}° to ${hi}°`
        : `${lo}–${hi}°`;

    // "14:00–18:00", or just "14:00" when the window is a single hour
    const formatHourRange = (fromIndex, toIndex) => {
        const times = lastRender.data.hourly.time;
        return fromIndex === toIndex
            ? formatHour(times[fromIndex])
            : `${formatHour(times[fromIndex])}–${formatHour(times[toIndex])}`;
    };

    const formatDuration = (seconds) => {
        if (seconds == null) return DASH;
        const mins = Math.round(seconds / 60);
        return `${Math.floor(mins / 60)} h ${mins % 60} m`;
    };

    /* ---------- aggregation ---------- */
    // min / max / mean over one hourly variable, remembering where the
    // extremes fell (absolute hourly indices), or null when nothing is known.
    const statsOver = (indices, key) => {
        let min = Infinity, max = -Infinity, sum = 0, count = 0, minIndex = -1, maxIndex = -1;
        indices.forEach((i) => {
            const v = hourlyValue(key, i);
            if (v == null) return;
            if (v < min) { min = v; minIndex = i; }
            if (v > max) { max = v; maxIndex = i; }
            sum += v; count++;
        });
        return count ? { min, max, mean: sum / count, minIndex, maxIndex, count } : null;
    };

    const firstLastChange = (indices, key) => {
        let first = null, last = null;
        indices.forEach((i) => {
            const v = hourlyValue(key, i);
            if (v == null) return;
            if (first === null) first = v;
            last = v;
        });
        return first === null ? null : last - first;
    };

    // Consecutive wet hours, merged across short dry gaps.
    // `from`/`to` are absolute hourly indices so callers can format the times.
    const precipitationWindows = (indices) => {
        const wet = indices.map((i) => {
            const mm = hourlyValue('precipitation', i);
            const prob = hourlyValue('precipitation_probability', i);
            return (mm != null && mm >= PRECIP_WINDOW_MM) || (prob != null && prob >= PRECIP_WINDOW_PROB);
        });

        const runs = [];
        let start = -1;
        for (let k = 0; k <= wet.length; k++) {
            if (k < wet.length && wet[k]) { if (start === -1) start = k; }
            else if (start !== -1) { runs.push([start, k - 1]); start = -1; }
        }

        const merged = [];
        runs.forEach((run) => {
            const prev = merged[merged.length - 1];
            if (prev && (run[0] - prev[1] - 1) <= PRECIP_WINDOW_MAX_GAP) prev[1] = run[1];
            else merged.push([run[0], run[1]]);
        });

        return merged.map(([a, b]) => {
            let mm = null, cm = null, maxProb = null;
            for (let k = a; k <= b; k++) {
                const v = hourlyValue('precipitation', indices[k]);
                if (v != null) mm = (mm || 0) + v;
                const s = hourlyValue('snowfall', indices[k]);
                if (s != null) cm = (cm || 0) + s;
                const p = hourlyValue('precipitation_probability', indices[k]);
                if (p != null) maxProb = maxProb === null ? p : Math.max(maxProb, p);
            }
            // cm is the window's snowfall depth; mm is its water equivalent
            return { from: indices[a], to: indices[b], mm, cm, maxProb };
        });
    };

    const aggregateDay = (dayIndex) => {
        const indices = hourIndicesForDay(dayIndex);
        if (!indices.length) return null;

        const humidity = statsOver(indices, 'relative_humidity_2m');
        const dewPoint = statsOver(indices, 'dew_point_2m');
        const pressure = statsOver(indices, 'pressure_msl');
        const cloud = statsOver(indices, 'cloud_cover');
        const visibility = statsOver(indices, 'visibility');
        const wind = statsOver(indices, 'wind_speed_10m');
        const cape = statsOver(indices, 'cape');
        const uv = statsOver(indices, 'uv_index');
        const snowDepth = statsOver(indices, 'snow_depth');
        const freezing = statsOver(indices, 'freezing_level_height');

        // UV protection window: first → last hour at or above the threshold
        let uvFrom = null, uvTo = null;
        indices.forEach((i) => {
            const v = hourlyValue('uv_index', i);
            if (v == null || v < UV_PROTECTION_FROM) return;
            if (uvFrom === null) uvFrom = i;
            uvTo = i;
        });

        // Air quality — a day near the end of the range may be only partly covered
        let aqiMax = null, aqiHourIndex = -1, aqiLeading = null;
        let pm25Min = null, pm25Max = null, aqHours = 0;
        indices.forEach((i) => {
            const aq = aqAt(i);
            if (!aq) return;
            aqHours++;
            if (aq.european_aqi != null && (aqiMax === null || aq.european_aqi > aqiMax)) {
                aqiMax = aq.european_aqi;
                aqiHourIndex = i;
                let best = -Infinity;
                aqiLeading = null;
                AQI_SUB_INDEX_KEYS.forEach((key) => {
                    const sub = aq[`european_aqi_${key}`];
                    if (sub != null && sub > best) { best = sub; aqiLeading = key; }
                });
            }
            if (aq.pm2_5 != null) {
                pm25Min = pm25Min === null ? aq.pm2_5 : Math.min(pm25Min, aq.pm2_5);
                pm25Max = pm25Max === null ? aq.pm2_5 : Math.max(pm25Max, aq.pm2_5);
            }
        });

        // Pollen peak per species, with the hour it peaks
        const pollen = {};
        Object.keys(TXT.detail.pollenSpecies).forEach((key) => {
            let peak = null, hourIndex = -1, seen = false;
            indices.forEach((i) => {
                const aq = aqAt(i);
                const v = aq ? aq[key] : null;
                if (v == null) return;
                seen = true;
                if (peak === null || v > peak) { peak = v; hourIndex = i; }
            });
            if (seen) pollen[key] = { value: peak, hourIndex };
        });

        return {
            indices,
            humidity,
            dewPointMean: dewPoint ? dewPoint.mean : null,
            pressure: pressure ? { min: pressure.min, max: pressure.max, change: firstLastChange(indices, 'pressure_msl') } : null,
            cloudCoverMean: cloud ? cloud.mean : null,
            visibilityMin: visibility ? visibility.min : null,
            windSpeedMean: wind ? wind.mean : null,
            cape: cape ? { max: cape.max, hourIndex: cape.maxIndex } : null,
            uvPeakHour: uv && uv.max > 0 ? uv.maxIndex : null,
            precipitationWindows: precipitationWindows(indices),
            uvProtectionWindow: uvFrom === null ? null : { from: uvFrom, to: uvTo },
            airQuality: aqHours ? { max: aqiMax, hourIndex: aqiHourIndex, leading: aqiLeading, hours: aqHours } : null,
            pm25: pm25Min === null ? null : { min: pm25Min, max: pm25Max },
            pollen,
            snowDepthMax: snowDepth ? snowDepth.max : null,
            freezingLevelMin: freezing ? freezing.min : null,
        };
    };

    /* ---------- summary sentences ---------- */
    const daySummary = (dayIndex, agg) => {
        const code = dailyValue('weather_code', dayIndex);
        const hi = dailyValue('temperature_2m_max', dayIndex);
        const lo = dailyValue('temperature_2m_min', dayIndex);
        const S = TXT.day.summary;

        const parts = [];
        parts.push((hi != null && lo != null)
            ? S.base(getWeatherCondition(code), formatTempRange(Math.round(lo), Math.round(hi)))
            : S.baseNoTemp(getWeatherCondition(code)));

        const extras = [];
        const windows = agg ? agg.precipitationWindows : [];
        const snowSum = dailyValue('snowfall_sum', dayIndex);
        const maxProb = dailyValue('precipitation_probability_max', dayIndex);

        if (windows.length) {
            const w = windows[0];
            const isSnow = snowSum != null && snowSum > 0;
            // A window can be triggered by amount alone, so only call it
            // "likely" when the probability actually backs that up
            const confident = w.maxProb != null && w.maxProb >= PRECIP_WINDOW_PROB;
            // A snow window is quoted as depth, not as water equivalent
            const amount = isSnow
                ? (w.cm > 0 ? `${Math.round(w.cm * 10) / 10} cm` : null)
                : (w.mm > 0 ? `${Math.round(w.mm * 10) / 10} mm` : null);
            extras.push(S.precipWindow(
                isSnow ? S.snowWord : S.rainWord,
                confident ? S.likelyWord : S.possibleWord,
                formatHourRange(w.from, w.to),
                amount
            ));
        } else if (maxProb != null && maxProb >= SUMMARY_SMALL_CHANCE_PCT) {
            extras.push(S.smallChance(Math.round(maxProb)));
        }

        const gust = dailyValue('wind_gusts_10m_max', dayIndex);
        if (gust != null && gust >= SUMMARY_GUST_KMH) extras.push(S.gusts(Math.round(gust)));

        const uvMax = dailyValue('uv_index_max', dayIndex);
        if (uvMax != null && uvMax >= SUMMARY_UV_HIGH) extras.push(S.highUv(Math.round(uvMax)));

        if (agg && agg.cape) {
            const risk = thunderRisk(agg.cape.max, null, code);
            if (risk === 'moderate' || risk === 'high') {
                extras.push(S.thunder(TXT.detail.thunderLevels[risk]));
            }
        }

        if (snowSum != null && snowSum > 0) extras.push(S.snow(Math.round(snowSum * 10) / 10));

        return parts.concat(extras.slice(0, SUMMARY_MAX_EXTRAS)).join(' ');
    };

    /* ---------- day-scoped visuals ---------- */
    const sunArcHtml = (sunriseIso, sunsetIso, nowIso) => {
        const baseY = 52, apex = 10, x0 = 12, x1 = 188;
        let marker = '';
        if (nowIso && sunriseIso && sunsetIso) {
            const sr = toMin(sunriseIso), ss = toMin(sunsetIso), now = toMin(nowIso);
            if (ss > sr && now >= sr && now <= ss) {
                const t = (now - sr) / (ss - sr);
                const x = x0 + (x1 - x0) * t;
                const y = baseY - (baseY - apex) * Math.sin(Math.PI * t);
                marker = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#ffc531" stroke="rgba(0,0,0,0.35)" stroke-width="1"></circle>`;
            }
        }
        return `<svg class="sun-arc" viewBox="0 0 200 64" width="100%" height="64" aria-hidden="true">
            <path d="M${x0} ${baseY} A ${(x1 - x0) / 2} ${baseY - apex} 0 0 1 ${x1} ${baseY}" fill="none"
                stroke="rgba(255,255,255,0.30)" stroke-width="1.5" stroke-dasharray="4 4"></path>
            <line x1="6" y1="${baseY}" x2="194" y2="${baseY}" stroke="rgba(255,255,255,0.25)" stroke-width="1"></line>
            ${marker}
        </svg>`;
    };

    // Lit limb + elliptical terminator. rx shrinks to 0 at the quarters, and
    // the terminator bulges toward the lit side only once past half-lit.
    const moonGlyphHtml = (phase, size) => {
        const r = size / 2 - 1;
        const c = size / 2;
        const angle = 2 * Math.PI * phase;
        const rx = Math.abs(r * Math.cos(angle));
        const litFraction = (1 - Math.cos(angle)) / 2;
        const limbSweep = phase < 0.5 ? 1 : 0;                       // waxing lights the right limb
        const termSweep = litFraction > 0.5 ? limbSweep : 1 - limbSweep;
        return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
            <circle cx="${c}" cy="${c}" r="${r}" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)" stroke-width="1"></circle>
            <path d="M${c} ${c - r} A${r} ${r} 0 0 ${limbSweep} ${c} ${c + r} A${rx.toFixed(2)} ${r} 0 0 ${termSweep} ${c} ${c - r} Z" fill="#d9def0"></path>
        </svg>`;
    };

    /* ---------- day tiles ---------- */
    const dayPrecipitationTile = (d, agg) => {
        const sum = dailyValue('precipitation_sum', d);
        const prob = dailyValue('precipitation_probability_max', d);
        const hours = dailyValue('precipitation_hours', d);
        const rain = dailyValue('rain_sum', d);
        const showers = dailyValue('showers_sum', d);
        const snow = dailyValue('snowfall_sum', d);
        if (sum == null && prob == null) return '';

        const rows = [];
        if (rain != null && rain > 0) rows.push([TXT.detail.rain, fmtOr(rain, 1, ' mm')]);
        if (showers != null && showers > 0) rows.push([TXT.detail.showers, fmtOr(showers, 1, ' mm')]);
        if (snow != null && snow > 0) rows.push([TXT.detail.snow, fmtOr(snow, 1, ' cm')]);
        if (hours != null) rows.push([TXT.day.precipHours, fmtOr(hours, 0, ' h')]);
        if (prob != null) rows.push([TXT.day.maxChance, fmtOr(prob, 0, '%')]);

        const isSnowDay = snow != null && snow > 0;
        const windows = (agg ? agg.precipitationWindows : []).map((w) => {
            // A window can be probability-only, with no accumulation to quote
            const amount = isSnowDay && w.cm > 0 ? fmtOr(w.cm, 1, ' cm')
                : w.mm > 0 ? fmtOr(w.mm, 1, ' mm')
                : fmtOr(w.maxProb, 0, '%');
            return `
            <div class="tile-row">
                <span class="t-cap">${formatHourRange(w.from, w.to)}</span>
                <span class="t-cap-emph">${amount}</span>
            </div>`;
        }).join('');

        const headline = (sum != null && sum > 0)
            ? `<span class="t-value">${fmtOr(sum, 1)}</span><span class="tile-unit">mm</span>`
            : `<span class="t-value">${sum == null ? DASH : TXT.detail.dry}</span>`;

        return tileHtml(TXT.detail.precipitation, `
            <div class="tile-value-row">${headline}</div>
            ${rows.map(([k, v]) => `<div class="tile-row"><span class="t-cap">${k}</span><span class="t-cap-emph">${v}</span></div>`).join('')}
            ${windows ? `<div class="tile-sub">${windows}</div>` : ''}
        `);
    };

    const dayWindTile = (d, agg) => {
        const max = dailyValue('wind_speed_10m_max', d);
        const gust = dailyValue('wind_gusts_10m_max', d);
        const dir = dailyValue('wind_direction_10m_dominant', d);
        const mean = agg ? agg.windSpeedMean : null;
        if (max == null && gust == null && dir == null) return '';

        return tileHtml(TXT.detail.wind, `
            <div class="tile-value-row">
                <span class="t-value">${fmtOr(max, 0)}</span><span class="tile-unit">${TXT.kmh}</span>
                ${dir != null ? windArrowHtml(dir, 26) : ''}
            </div>
            ${max != null ? `<div class="t-body">${wordFor(WIND_WORDS, max)}</div>` : ''}
            ${dir != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.dominant}</span><span class="t-cap-emph">${getCompass(dir)} ${fmtOr(dir, 0, '°')}</span></div>` : ''}
            ${gust != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.maxGust}</span><span class="t-cap-emph">${fmtOr(gust, 0, ' ' + TXT.kmh)}</span></div>` : ''}
            ${mean != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.meanWind}</span><span class="t-cap-emph">${fmtOr(mean, 0, ' ' + TXT.kmh)}</span></div>` : ''}
        `);
    };

    const daySunTile = (d) => {
        const sunrise = dailyText('sunrise', d);
        const sunset = dailyText('sunset', d);
        const daylight = dailyValue('daylight_duration', d);
        const sunshine = dailyValue('sunshine_duration', d);
        if (!sunrise && !sunset && daylight == null) return '';

        const pct = (sunshine != null && daylight != null && daylight > 0)
            ? Math.min(100, sunshine / daylight * 100) : null;
        const nowIso = (d === 0 && lastRender.data.current) ? lastRender.data.current.time : null;

        return tileHtml(TXT.day.sun, `
            ${sunArcHtml(sunrise, sunset, nowIso)}
            <div class="tile-row"><span class="t-cap">${TXT.day.sunrise}</span><span class="t-cap-emph">${sunrise ? formatClock(sunrise) : DASH}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.day.sunset}</span><span class="t-cap-emph">${sunset ? formatClock(sunset) : DASH}</span></div>
            ${daylight != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.daylight}</span><span class="t-cap-emph">${formatDuration(daylight)}</span></div>` : ''}
            ${sunshine != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.sunshine}</span><span class="t-cap-emph">${formatDuration(sunshine)}${pct != null ? ` · ${Math.round(pct)}%` : ''}</span></div>` : ''}
        `);
    };

    const dayUvTile = (d, agg) => {
        const max = dailyValue('uv_index_max', d);
        const clear = dailyValue('uv_index_clear_sky_max', d);
        if (max == null) return '';
        const times = lastRender.data.hourly.time;
        const window = agg ? agg.uvProtectionWindow : null;

        return tileHtml(TXT.detail.uvIndex, `
            <div class="tile-value-row"><span class="t-value">${uvTextHtml(max)}</span></div>
            <div class="uv-bar-wrap">
                <span class="t-body">${getUvLabel(max)}</span>
                ${uvBarHtml(max)}
            </div>
            ${clear != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.uvClearSky}</span><span class="t-cap-emph">${uvTextHtml(clear)}</span></div>` : ''}
            ${agg && agg.uvPeakHour != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.uvPeak}</span><span class="t-cap-emph">${formatHour(times[agg.uvPeakHour])}</span></div>` : ''}
            <div class="t-cap tile-foot">${window
                ? TXT.day.protection(formatHourRange(window.from, window.to))
                : TXT.day.noProtection}</div>
        `);
    };

    const dayMoonTile = (d) => {
        const phase = dailyValue('moon_phase', d);
        const rise = dailyText('moonrise', d);
        const set = dailyText('moonset', d);
        if (phase == null && !rise && !set) return '';

        return tileHtml(TXT.day.moon, `
            <div class="tile-value-row">
                ${phase != null ? moonGlyphHtml(phase, 34) : ''}
                <span class="t-body-emph">${phase != null ? wordFor(MOON_PHASE_NAMES, phase) : DASH}</span>
            </div>
            ${rise ? `<div class="tile-row"><span class="t-cap">${TXT.day.moonrise}</span><span class="t-cap-emph">${formatClock(rise)}</span></div>` : ''}
            ${set ? `<div class="tile-row"><span class="t-cap">${TXT.day.moonset}</span><span class="t-cap-emph">${formatClock(set)}</span></div>` : ''}
        `);
    };

    const dayHumidityTile = (d, agg) => {
        if (!agg || !agg.humidity) return '';
        const h = agg.humidity;
        return tileHtml(TXT.detail.humidity, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(h.mean, 0)}</span><span class="tile-unit">% ${TXT.day.mean.toLowerCase()}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.day.min} / ${TXT.day.max}</span><span class="t-cap-emph">${fmtOr(h.min, 0, '%')} / ${fmtOr(h.max, 0, '%')}</span></div>
            ${agg.dewPointMean != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.dewPointMean}</span><span class="t-cap-emph">${fmtOr(agg.dewPointMean, 0, '°')} · ${wordFor(DEW_POINT_WORDS, agg.dewPointMean)}</span></div>` : ''}
        `);
    };

    const dayPressureTile = (d, agg) => {
        if (!agg || !agg.pressure) return '';
        const p = agg.pressure;
        let trend = '';
        if (p.change != null) {
            const word = Math.abs(p.change) <= DAY_PRESSURE_STEADY_HPA ? TXT.detail.steady
                : p.change > 0 ? TXT.detail.rising : TXT.detail.falling;
            const glyph = Math.abs(p.change) <= DAY_PRESSURE_STEADY_HPA ? '→' : p.change > 0 ? '↑' : '↓';
            trend = `<div class="tile-row"><span class="t-cap">${TXT.day.change}</span>`
                + `<span class="t-cap-emph">${glyph} ${word} ${p.change > 0 ? '+' : ''}${p.change.toFixed(1)}</span></div>`;
        }
        return tileHtml(TXT.detail.pressure, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(p.max, 0)}</span><span class="tile-unit">hPa ${TXT.day.max.toLowerCase()}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.day.min} / ${TXT.day.max}</span><span class="t-cap-emph">${fmtOr(p.min, 0)} / ${fmtOr(p.max, 0)}</span></div>
            ${trend}
        `);
    };

    const dayCloudsTile = (d, agg) => {
        if (!agg) return '';
        const cloud = agg.cloudCoverMean;
        const vis = agg.visibilityMin;
        if (cloud == null && vis == null) return '';
        const visKm = vis != null ? vis / 1000 : null;

        return tileHtml(TXT.day.cloudsVisibility, `
            <div class="tile-value-row"><span class="t-value">${fmtOr(cloud, 0)}</span><span class="tile-unit">% ${TXT.day.mean.toLowerCase()}</span></div>
            ${visKm != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.minVisibility}</span><span class="t-cap-emph">${visKm < VISIBILITY_DECIMAL_BELOW_KM ? visKm.toFixed(1) : Math.round(visKm)} km</span></div>` : ''}
            ${visKm != null ? `<div class="t-body">${wordFor(VISIBILITY_WORDS, visKm)}</div>` : ''}
        `);
    };

    const dayThunderTile = (d, agg) => {
        const code = dailyValue('weather_code', d);
        const capeMax = agg && agg.cape ? agg.cape.max : null;
        const level = thunderRisk(capeMax, null, code);
        if (level == null) return '';
        const times = lastRender.data.hourly.time;
        const at = agg && agg.cape && agg.cape.hourIndex >= 0 ? times[agg.cape.hourIndex] : null;

        return tileHtml(TXT.detail.thunder, `
            <div class="tile-value-row"><span class="t-value">${TXT.detail.thunderLevels[level]}</span></div>
            <div class="tile-row"><span class="t-cap">${TXT.day.maxCape}</span><span class="t-cap-emph">${fmtOr(capeMax, 0, ' J/kg')}</span></div>
            ${at ? `<div class="tile-row"><span class="t-cap">${TXT.day.atHour}</span><span class="t-cap-emph">${formatHour(at)}</span></div>` : ''}
        `, TXT.detail.estimated);
    };

    const daySnowTile = (d, agg) => {
        const snowSum = dailyValue('snowfall_sum', d);
        const minTemp = dailyValue('temperature_2m_min', d);
        const depthMax = agg ? agg.snowDepthMax : null;
        const freezingMin = agg ? agg.freezingLevelMin : null;

        const relevant = (snowSum != null && snowSum > 0)
            || (depthMax != null && depthMax > 0)
            || (minTemp != null && minTemp <= SNOW_TILE_MAX_TEMP);
        if (!relevant) return '';
        if (snowSum == null && depthMax == null && freezingMin == null) return '';

        return tileHtml(TXT.detail.snowTitle, `
            ${snowSum != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.snowfallSum}</span><span class="t-cap-emph">${fmtOr(snowSum, 1, ' cm')}</span></div>` : ''}
            ${depthMax != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.maxSnowDepth}</span><span class="t-cap-emph">${fmtOr(depthMax * 100, 1, ' cm')}</span></div>` : ''}
            ${freezingMin != null ? `<div class="tile-row"><span class="t-cap">${TXT.day.minFreezingLevel}</span><span class="t-cap-emph">${fmtOr(freezingMin, 0, ' m')}</span></div>` : ''}
        `);
    };

    // Shown once real ensemble stats exist for this day; a subtle skeleton
    // while the (lazily-triggered) request is in flight; hidden otherwise
    // (no ensemble support, or the fetch already failed).
    const dayConfidenceTile = (d) => {
        const stats = ensembleStatsForDay(d);
        if (!stats) {
            if (!ensembleLoading) return '';
            return tileHtml(TXT.day.confidenceTile.title, `
                <div class="confidence-skeleton-line" style="width: 40%;"></div>
                <div class="confidence-skeleton-line" style="width: 85%;"></div>
                <div class="confidence-skeleton-line" style="width: 60%;"></div>
            `);
        }

        const level = stats.spread <= ENSEMBLE_SPREAD_HIGH_C ? 'high'
            : stats.spread <= ENSEMBLE_SPREAD_MEDIUM_C ? 'medium' : 'low';

        return tileHtml(TXT.day.confidenceTile.title, `
            <div class="tile-value-row"><span class="t-value confidence-${level}">${TXT.detail.confidenceLevels[level]}</span></div>
            <div class="t-body">${TXT.day.confidenceTile.range(stats.members, Math.round(stats.p10), Math.round(stats.p90), Math.round(stats.median))}</div>
            <div class="t-cap">${stats.model}</div>
            <div class="t-cap tile-foot">${TXT.day.confidenceTile.explain}</div>
        `);
    };

    // One line comparing this day's high with the neighbouring day
    const dayComparisonHtml = (d) => {
        const C = TXT.day.compare;
        const here = dailyValue('temperature_2m_max', d);
        if (here == null) return '';

        const otherIndex = d === 0 ? 1 : d - 1;
        const other = dailyValue('temperature_2m_max', otherIndex);
        if (other == null) return '';

        if (d === 0) {
            const delta = Math.round(other - here);   // how tomorrow differs from today
            const text = Math.abs(delta) <= DAY_COMPARE_SAME_C ? C.tomorrowSame
                : delta > 0 ? C.tomorrowWarmer(delta) : C.tomorrowCooler(Math.abs(delta));
            return `<div class="day-compare t-cap">${text}</div>`;
        }

        const delta = Math.round(here - other);
        const ref = d === 1 ? C.refToday : C.refPrevDay;
        const text = Math.abs(delta) <= DAY_COMPARE_SAME_C ? C.same(ref)
            : delta > 0 ? C.warmer(delta, ref) : C.cooler(Math.abs(delta), ref);
        return `<div class="day-compare t-cap">${text}</div>`;
    };

    /* ---------- day air quality + pollen ---------- */
    const dayAirQualitySection = (d, agg) => {
        const aq = agg ? agg.airQuality : null;
        if (!aq || aq.max == null) {
            return `<section class="detail-section">
                <div class="t-cap-heading">${TXT.detail.airQuality}</div>
                <div class="t-cap section-muted">${TXT.detail.aqUnavailable}</div>
            </section>`;
        }

        const band = aqiBandFor(aq.max);
        const markerPct = Math.max(0, Math.min(100, aq.max / AQI_SCALE_MAX * 100));
        const times = lastRender.data.hourly.time;
        const pm25 = agg.pm25;

        return `<section class="detail-section">
            <div class="t-cap-heading">${TXT.detail.airQuality}</div>
            <div class="aq-head">
                <span class="t-value">${fmtOr(aq.max, 0)}</span>
                <span class="aq-band" style="color: ${band.color};">${band.name}</span>
                <span class="t-cap">${TXT.day.aqiMax}</span>
            </div>
            <div class="aq-scale">
                ${AQI_BANDS.map((b) => `<span class="aq-scale-band" style="background: ${b.color};"></span>`).join('')}
                <span class="aq-marker" style="left: ${markerPct.toFixed(1)}%;"></span>
            </div>
            ${aq.hourIndex >= 0 ? `<div class="tile-row"><span class="t-cap">${TXT.day.atHour}</span><span class="t-cap-emph">${formatHour(times[aq.hourIndex])}</span></div>` : ''}
            ${aq.leading ? `<div class="tile-row"><span class="t-cap">${TXT.detail.leadingPollutant}</span><span class="t-cap-emph">${TXT.detail.pollutants[aq.leading]}</span></div>` : ''}
            ${pm25 ? `<div class="tile-row"><span class="t-cap">${TXT.day.pm25Range}</span><span class="t-cap-emph">${fmtOr(pm25.min, 1)}–${fmtOr(pm25.max, 1)} µg/m³</span></div>` : ''}
        </section>`;
    };

    const dayPollenSection = (d, agg) => {
        if (!agg) return '';
        const keys = Object.keys(agg.pollen);
        if (!keys.length) return '';   // day sits outside the pollen forecast range

        const times = lastRender.data.hourly.time;
        const active = keys.filter((k) => agg.pollen[k].value > 0);
        const body = active.length
            ? active.map((k) => {
                const p = agg.pollen[k];
                return `<div class="pollen-row">
                    <span class="t-body pollen-name">${TXT.detail.pollenSpecies[k]}</span>
                    ${miniBarHtml(Math.max(2, p.value / POLLEN_BAR_FULL * 100), 'var(--accent)')}
                    <span class="t-cap pollen-value">${fmtOr(p.value, 1)} · ${wordFor(POLLEN_LEVELS, p.value)}${p.hourIndex >= 0 ? ` · ${formatHour(times[p.hourIndex])}` : ''}</span>
                </div>`;
            }).join('')
            : `<div class="t-cap section-muted">${TXT.detail.noPollen}</div>`;

        return `<section class="detail-section">
            <div class="t-cap-heading">${TXT.detail.pollen} <span class="tile-note">${TXT.day.pollenPeak}</span></div>
            ${body}
        </section>`;
    };

    /* =====================================================================
       Detail popup (hour / day)
       ===================================================================== */
    const mainEl = document.querySelector('main');
    const detailOverlay = document.getElementById('detail-overlay');
    const detailDialog = document.getElementById('detail-dialog');
    const detailGrabber = document.getElementById('detail-grabber');
    const detailHeader = document.getElementById('detail-header');
    const detailBackBtn = document.getElementById('detail-back');
    const detailPrevBtn = document.getElementById('detail-prev');
    const detailNextBtn = document.getElementById('detail-next');
    const detailCloseBtn = document.getElementById('detail-close');
    const detailTitleEl = document.getElementById('detail-title');
    const detailSubtitleEl = document.getElementById('detail-subtitle');
    const detailBodyEl = document.getElementById('detail-body');

    detailBackBtn.querySelector('span').textContent = TXT.back;
    detailBackBtn.setAttribute('aria-label', TXT.back);
    detailPrevBtn.setAttribute('aria-label', TXT.previous);
    detailNextBtn.setAttribute('aria-label', TXT.next);
    detailCloseBtn.setAttribute('aria-label', TXT.close);

    const DETAIL_ANIM_MS = 260; // matches the CSS transition duration + slack

    let detailState = null;      // { view: 'hour'|'day', hourIndex, dayIndex, fromDay } or null
    let detailOpen = false;
    let detailTriggerEl = null;  // element to restore focus to on close

    // A ±12 h window around the hour, kept at a full 25 points by sliding the
    // window at the array edges rather than letting it shrink.
    const hourWindowIndices = (hourIndex, span) => {
        if (!lastRender) return [];
        const n = lastRender.data.hourly.time.length;
        const width = Math.min(span, n);
        let start = hourIndex - Math.floor(span / 2);
        if (start < 0) start = 0;
        if (start + width > n) start = n - width;
        const out = [];
        for (let i = start; i < start + width; i++) out.push(i);
        return out;
    };

    const renderHourDetail = (hourIndex, bodyEl) => {
        const i = hourIndex;
        const temp = hourlyValue('temperature_2m', i);
        const feels = hourlyValue('apparent_temperature', i);
        const code = hourlyValue('weather_code', i);
        const isDay = hourlyValue('is_day', i) === 1;
        const dayIdx = dayIndexForHour(i);
        const confidence = confidenceForDay(dayIdx);
        const hasCams = aqAt(i) != null;   // same per-hour CAMS row backs both AQ and pollen

        const tiles = [
            precipitationTile(i),
            windTile(i),
            humidityTile(i),
            pressureTile(i),
            cloudsTile(i),
            visibilityTile(i),
            uvTile(i),
            thunderTile(i),
            snowTile(i),
        ].join('');

        bodyEl.innerHTML = `
            <div class="detail-cols">
                <div class="detail-col-main">
                    <div class="detail-hero">
                        <div class="detail-hero-icon">${getIcon(code, isDay, 72)}</div>
                        <div class="detail-hero-text">
                            <div class="t-condition">${getWeatherCondition(code)}</div>
                            <div class="detail-hero-temp">${temp == null ? DASH : Math.round(temp) + '°'}</div>
                            ${feels != null ? `<div class="t-cap">${TXT.detail.feelsLike} ${Math.round(feels)}°</div>` : ''}
                        </div>
                    </div>
                    ${confidenceBadgeHtml(confidence, dayIdx)}
                    <div class="detail-chart-host"></div>
                </div>
                <div class="detail-col-side">
                    <div class="detail-tiles">${tiles}</div>
                    ${airQualitySection(i)}
                    ${pollenSection(i)}
                </div>
            </div>
            ${attributionHtml(hasCams)}
        `;

        mountChartTabs(bodyEl.querySelector('.detail-chart-host'), {
            indices: hourWindowIndices(hourIndex, 25),
            highlightIndex: hourIndex,
        });
    };

    // One scrollable hour per card; same fixed-size discipline as the main
    // rail so re-rendering never shifts the layout.
    const dayHourStripHtml = (indices, currentIndex, scrollTargetIndex) => {
        const times = lastRender.data.hourly.time;
        const cards = indices.map((i) => {
            const temp = hourlyValue('temperature_2m', i);
            const prob = hourlyValue('precipitation_probability', i);
            const wind = hourlyValue('wind_speed_10m', i);
            const code = hourlyValue('weather_code', i);
            const isDay = hourlyValue('is_day', i) === 1;
            const label = `${formatHour(times[i])}, ${temp == null ? DASH : Math.round(temp) + '°'}, ${getWeatherCondition(code)}`;
            return `
                <div class="day-hour-card${i === currentIndex ? ' is-now' : ''}" data-hour-index="${i}"
                    ${i === scrollTargetIndex ? 'data-scroll-target="1"' : ''}
                    role="button" tabindex="0" aria-label="${label}">
                    <div class="t-cap">${i === currentIndex ? TXT.now : formatHour(times[i])}</div>
                    <div class="day-hour-icon">${getIcon(code, isDay, 26)}</div>
                    <div class="t-body-emph">${temp == null ? DASH : Math.round(temp) + '°'}</div>
                    <div class="t-cap-accent">${prob == null ? DASH : Math.round(prob) + '%'}</div>
                    <div class="t-cap">${wind == null ? DASH : Math.round(wind)}</div>
                </div>`;
        }).join('');

        return `<div class="day-hour-strip" role="list">${cards}</div>`;
    };

    const renderDayDetail = (dayIndex, bodyEl) => {
        const d = dayIndex;
        const agg = aggregateDay(d);
        const indices = agg ? agg.indices : [];
        const code = dailyValue('weather_code', d);
        const hi = dailyValue('temperature_2m_max', d);
        const lo = dailyValue('temperature_2m_min', d);
        const feelsHi = dailyValue('apparent_temperature_max', d);
        const feelsLo = dailyValue('apparent_temperature_min', d);
        const confidence = confidenceForDay(d);

        // Today highlights (and scrolls to) the live hour; other days open at sunrise
        const hourly = lastRender.data.hourly;
        const currentIndex = d === 0 ? currentHourIndex(hourly.time, lastRender.data.current.time) : -1;
        let scrollTarget = currentIndex;
        if (scrollTarget < 0 || indices.indexOf(scrollTarget) === -1) {
            const sunrise = dailyText('sunrise', d);
            scrollTarget = sunrise
                ? (indices.find((i) => hourly.time[i].slice(11, 13) === sunrise.slice(11, 13)) ?? indices[0])
                : indices[0];
        }

        const tiles = [
            dayPrecipitationTile(d, agg),
            dayWindTile(d, agg),
            daySunTile(d),
            dayUvTile(d, agg),
            dayMoonTile(d),
            dayHumidityTile(d, agg),
            dayPressureTile(d, agg),
            dayCloudsTile(d, agg),
            dayThunderTile(d, agg),
            daySnowTile(d, agg),
            dayConfidenceTile(d),
        ].join('');

        const feelsText = (feelsHi != null && feelsLo != null)
            ? `${TXT.detail.feelsLike} ${Math.round(feelsLo)}° / ${Math.round(feelsHi)}°`
            : null;

        // AQ and pollen coverage can differ by a day near the end of the AQ
        // range, so either one having real content earns the CAMS credit
        const hasCams = !!(agg && (
            (agg.airQuality && agg.airQuality.max != null) || Object.keys(agg.pollen).length
        ));

        bodyEl.innerHTML = `
            <div class="detail-cols">
                <div class="detail-col-main">
                    <div class="detail-hero">
                        <div class="detail-hero-icon">${getIcon(code, true, 72)}</div>
                        <div class="detail-hero-text">
                            <div class="t-condition">${getWeatherCondition(code)}</div>
                            <div class="detail-hero-temp">${hi == null ? DASH : Math.round(hi) + '°'}<span class="hero-temp-min">${lo == null ? '' : ' / ' + Math.round(lo) + '°'}</span></div>
                            ${feelsText ? `<div class="t-cap">${feelsText}</div>` : ''}
                        </div>
                    </div>
                    ${dayComparisonHtml(d)}
                    <div class="day-summary t-body">${daySummary(d, agg)}</div>
                    ${confidenceBadgeHtml(confidence, d)}
                    <div class="detail-chart-host"></div>
                    ${indices.length ? `
                        <div class="day-hour-block">
                            <div class="t-cap-heading">${TXT.day.hours}</div>
                            ${dayHourStripHtml(indices, currentIndex, scrollTarget)}
                        </div>` : ''}
                </div>
                <div class="detail-col-side">
                    <div class="detail-tiles">${tiles}</div>
                    ${dayAirQualitySection(d, agg)}
                    ${dayPollenSection(d, agg)}
                </div>
            </div>
            ${attributionHtml(hasCams)}
        `;

        mountChartTabs(bodyEl.querySelector('.detail-chart-host'), {
            indices,
            highlightIndex: currentIndex >= 0 ? currentIndex : null,
        });

        // Runs after the dialog is on screen, so offsetLeft is measurable
        // even on the first open (where the body renders while still hidden).
        requestAnimationFrame(() => {
            const strip = bodyEl.querySelector('.day-hour-strip');
            if (!strip) return;
            const target = strip.querySelector('[data-scroll-target="1"]');
            if (!target) return;
            strip.scrollLeft = Math.max(0, target.offsetLeft - strip.clientWidth / 2 + target.clientWidth / 2);
        });
    };

    // preserveScroll keeps the reading position when the body is re-rendered
    // in place (e.g. air quality landing after the popup already opened).
    const renderDetail = (preserveScroll) => {
        if (!detailState || !lastRender) return;
        const { hourly, daily, current } = lastRender.data;
        const keptScroll = preserveScroll ? detailBodyEl.scrollTop : 0;

        ensureEnsembleLoaded();   // lazy: fires once per location, no-op after
        destroyChartMounts();   // the body is about to be replaced wholesale

        detailBackBtn.classList.toggle('hidden', !detailState.fromDay);

        if (detailState.view === 'hour') {
            const i = detailState.hourIndex;
            const iso = hourly.time[i];
            const dateStr = iso.slice(0, 10);
            const isNow = i === currentHourIndex(hourly.time, current.time);
            const weekday = getDayName(dateStr, detailState.dayIndex);
            detailTitleEl.textContent = `${weekday}, ${formatMonthDay(dateStr)} · ${formatHour(iso)}`
                + (isNow ? ` · ${TXT.now}` : '');
            detailSubtitleEl.textContent = getWeatherCondition(hourly.weather_code[i]);
            detailPrevBtn.disabled = i <= 0;
            detailNextBtn.disabled = i >= hourly.time.length - 1;
            renderHourDetail(i, detailBodyEl);
        } else {
            const i = detailState.dayIndex;
            const weekday = getDayName(daily.time[i], i);
            detailTitleEl.textContent = `${weekday}, ${formatMonthDay(daily.time[i])}`;
            detailSubtitleEl.textContent = getWeatherCondition(daily.weather_code[i]);
            detailPrevBtn.disabled = i <= 0;
            detailNextBtn.disabled = i >= daily.time.length - 1;
            renderDayDetail(i, detailBodyEl);
        }
        detailBodyEl.scrollTop = keptScroll;
    };

    const trapDetailTab = (e) => {
        const focusables = Array.from(detailDialog.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) { e.preventDefault(); return; }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    };

    const navigateDetail = (delta) => {
        if (!detailOpen || !detailState || !lastRender) return;
        if (detailState.view === 'hour') {
            const times = lastRender.data.hourly.time;
            const next = detailState.hourIndex + delta;
            if (next < 0 || next >= times.length) return;
            detailState.hourIndex = next;
            detailState.dayIndex = dayIndexForHour(next);
        } else {
            const days = lastRender.data.daily.time;
            const next = detailState.dayIndex + delta;
            if (next < 0 || next >= days.length) return;
            detailState.dayIndex = next;
        }
        renderDetail();
    };

    const onDetailKeydown = (e) => {
        if (e.key === 'Escape') { e.stopPropagation(); closeDetail(); return; }
        if (e.key === 'Tab') { trapDetailTab(e); return; }
        const activeTag = document.activeElement && document.activeElement.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); navigateDetail(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); navigateDetail(1); }
    };

    const openDetail = (view, index, triggerEl) => {
        if (!lastRender) return;
        detailState = view === 'hour'
            ? { view: 'hour', hourIndex: index, dayIndex: dayIndexForHour(index), fromDay: false }
            : { view: 'day', hourIndex: null, dayIndex: index, fromDay: false };
        renderDetail();
        if (detailOpen) return;

        detailOpen = true;
        detailTriggerEl = triggerEl || document.activeElement;
        detailOverlay.classList.remove('hidden');
        detailDialog.classList.remove('hidden');
        document.body.classList.add('detail-open');
        if ('inert' in mainEl) mainEl.inert = true;
        else mainEl.setAttribute('aria-hidden', 'true');
        document.addEventListener('keydown', onDetailKeydown);
        // rAF so the opacity/transform transition runs from the hidden state
        requestAnimationFrame(() => {
            detailOverlay.classList.add('is-open');
            detailDialog.classList.add('is-open');
        });
        // Charts mounted above measured a display:none box — redraw now that
        // the dialog has a real size
        chartMounts.forEach((m) => m.redraw());
        detailDialog.focus({ preventScroll: true });
    };

    const closeDetail = () => {
        if (!detailOpen) return;
        detailOpen = false;
        document.removeEventListener('keydown', onDetailKeydown);
        detailOverlay.classList.remove('is-open');
        detailDialog.classList.remove('is-open');
        detailDialog.style.transform = ''; // let the CSS closed-state transform animate from any drag offset
        document.body.classList.remove('detail-open');
        if ('inert' in mainEl) mainEl.inert = false;
        else mainEl.removeAttribute('aria-hidden');

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hide = () => {
            if (detailOpen) return;   // reopened during the close animation
            detailOverlay.classList.add('hidden');
            detailDialog.classList.add('hidden');
            detailDialog.style.transform = '';
            destroyChartMounts();
            detailBodyEl.innerHTML = '';
        };
        if (reduced) hide(); else setTimeout(hide, DETAIL_ANIM_MS);

        if (detailTriggerEl && document.contains(detailTriggerEl)) detailTriggerEl.focus();
        detailTriggerEl = null;
        detailState = null;
    };

    // Called from within the day view's own content (later task) to drill into
    // one of that day's hours, remembering the day to come "← Back" to.
    const openHourFromDay = (hourIndex) => {
        if (!lastRender || !detailOpen) return;
        const dayIndex = detailState ? detailState.dayIndex : dayIndexForHour(hourIndex);
        detailState = { view: 'hour', hourIndex, dayIndex, fromDay: true };
        renderDetail();
    };

    const refreshDetail = () => {
        if (!detailOpen || !detailState || !lastRender) return;
        if (detailState.view === 'hour') {
            const maxIdx = lastRender.data.hourly.time.length - 1;
            detailState.hourIndex = Math.min(detailState.hourIndex, maxIdx);
            detailState.dayIndex = dayIndexForHour(detailState.hourIndex);
        } else {
            const maxIdx = lastRender.data.daily.time.length - 1;
            detailState.dayIndex = Math.min(detailState.dayIndex, maxIdx);
        }
        renderDetail(true);
    };

    // Day popup hour strip → drill into that hour (delegated, so it survives
    // every re-render of the body)
    detailBodyEl.addEventListener('click', (e) => {
        const card = e.target.closest('.day-hour-card');
        if (!card) return;
        openHourFromDay(Number(card.dataset.hourIndex));
    });
    detailBodyEl.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.day-hour-card');
        if (!card) return;
        e.preventDefault();
        openHourFromDay(Number(card.dataset.hourIndex));
    });

    detailCloseBtn.addEventListener('click', closeDetail);
    detailPrevBtn.addEventListener('click', () => navigateDetail(-1));
    detailNextBtn.addEventListener('click', () => navigateDetail(1));
    detailBackBtn.addEventListener('click', () => {
        if (!detailState || !detailState.fromDay) return;
        detailState = { view: 'day', hourIndex: null, dayIndex: detailState.dayIndex, fromDay: false };
        renderDetail();
    });

    // Close on overlay click, but only if press AND release both landed on the
    // overlay itself — a text selection dragged off the dialog must not close it.
    let overlayPressStartedHere = false;
    detailOverlay.addEventListener('pointerdown', (e) => {
        overlayPressStartedHere = e.target === detailOverlay;
    });
    detailOverlay.addEventListener('pointerup', (e) => {
        if (overlayPressStartedHere && e.target === detailOverlay) closeDetail();
        overlayPressStartedHere = false;
    });

    // Mobile bottom-sheet drag-to-dismiss: only the grabber/header start a
    // drag, so body scrolling elsewhere in the dialog is unaffected.
    const isMobileDetailLayout = () => !window.matchMedia('(min-width: 768px)').matches;
    let dragPointerId = null;
    let dragStartY = 0;
    let dragCurrentY = 0;
    let dragStartTime = 0;

    const onDragStart = (e) => {
        if (!isMobileDetailLayout() || dragPointerId !== null || e.target.closest('button')) return;
        dragPointerId = e.pointerId;
        dragStartY = e.clientY;
        dragCurrentY = 0;
        dragStartTime = performance.now();
        detailDialog.classList.add('is-dragging');
        try { e.currentTarget.setPointerCapture(dragPointerId); } catch (err) { /* unsupported — drag still tracks via listeners */ }
    };
    const onDragMove = (e) => {
        if (dragPointerId === null || e.pointerId !== dragPointerId) return;
        dragCurrentY = Math.max(0, e.clientY - dragStartY);
        detailDialog.style.transform = `translateY(${dragCurrentY}px)`;
    };
    const onDragEnd = (e) => {
        if (dragPointerId === null || e.pointerId !== dragPointerId) return;
        dragPointerId = null;
        detailDialog.classList.remove('is-dragging');
        const elapsed = Math.max(1, performance.now() - dragStartTime);
        const velocity = dragCurrentY / elapsed; // px/ms
        if (dragCurrentY > 120 || (dragCurrentY > 20 && velocity > 0.5)) {
            closeDetail();
        } else {
            detailDialog.style.transform = '';
        }
        dragCurrentY = 0;
    };
    [detailGrabber, detailHeader].forEach((el) => {
        el.addEventListener('pointerdown', onDragStart);
        el.addEventListener('pointermove', onDragMove);
        el.addEventListener('pointerup', onDragEnd);
        el.addEventListener('pointercancel', onDragEnd);
    });

    // Triggers: event delegation so newly-rendered cards/rows stay wired up
    rail.addEventListener('click', (e) => {
        const card = e.target.closest('.hour-card');
        if (!card || !rail.contains(card)) return;
        openDetail('hour', Number(card.dataset.hourIndex), card);
    });
    rail.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target.closest('.hour-card');
        if (!card) return;
        e.preventDefault();
        openDetail('hour', Number(card.dataset.hourIndex), card);
    });
    uiForecastList.addEventListener('click', (e) => {
        const row = e.target.closest('.day-row');
        if (!row) return;
        openDetail('day', Number(row.dataset.dayIndex), row);
    });
    uiForecastList.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const row = e.target.closest('.day-row');
        if (!row) return;
        e.preventDefault();
        openDetail('day', Number(row.dataset.dayIndex), row);
    });

    /* =====================================================================
       Search + autocomplete
       ===================================================================== */
    const dropdown = document.getElementById('search-dropdown');
    let suggestAbortController = null;
    let suggestDebounce = null;
    let dropdownResults = [];
    let highlightIndex = -1;

    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

    const fetchGeocode = async (query, signal) => {
        const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8`;
        const response = await fetch(searchUrl, { signal });
        if (!response.ok) throw new Error('Geocoding API failed.');
        const data = await response.json();
        return data.results || [];
    };

    // Point the combobox at the highlighted option, or at nothing
    const syncActiveDescendant = () => {
        if (highlightIndex >= 0 && highlightIndex < dropdownResults.length) {
            searchInput.setAttribute('aria-activedescendant', `search-option-${highlightIndex}`);
        } else {
            searchInput.removeAttribute('aria-activedescendant');
        }
    };

    const closeDropdown = () => {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        dropdownResults = [];
        highlightIndex = -1;
        searchInput.setAttribute('aria-expanded', 'false');
        syncActiveDescendant();
    };

    const renderDropdown = () => {
        if (dropdownResults.length === 0) {
            dropdown.innerHTML = `<div class="search-option search-muted" style="cursor: default;">${TXT.noMatches}</div>`;
        } else {
            dropdown.innerHTML = dropdownResults.map((r, i) => {
                const region = [r.admin1, r.country].filter(Boolean).join(', ');
                return `
                    <button type="button" class="search-option" role="option" id="search-option-${i}"
                        data-index="${i}" aria-selected="${i === highlightIndex}">
                        <span style="font-weight: 500;">${escapeHtml(r.name)}</span>${region ? `<span class="search-muted">, ${escapeHtml(region)}</span>` : ''}
                    </button>
                `;
            }).join('');
        }
        dropdown.classList.remove('hidden');
        searchInput.setAttribute('aria-expanded', 'true');
        syncActiveDescendant();
    };

    const moveHighlight = (delta) => {
        if (dropdownResults.length === 0) return;
        highlightIndex = (highlightIndex + delta + dropdownResults.length) % dropdownResults.length;
        dropdown.querySelectorAll('.search-option').forEach((el, i) => {
            el.setAttribute('aria-selected', String(i === highlightIndex));
        });
        const active = dropdown.querySelector(`#search-option-${highlightIndex}`);
        if (active) active.scrollIntoView({ block: 'nearest' });
        syncActiveDescendant();
    };

    const selectResult = (result) => {
        closeDropdown();
        searchInput.value = result.name;
        searchInput.blur();
        fetchWeatherData(result.latitude, result.longitude, {
            name: result.name,
            country: result.country || result.admin1 || '',
        });
    };

    const suggest = async (query) => {
        if (suggestAbortController) suggestAbortController.abort();
        suggestAbortController = new AbortController();
        try {
            dropdownResults = await fetchGeocode(query, suggestAbortController.signal);
            highlightIndex = -1;
            renderDropdown();
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            closeDropdown();
        }
    };

    const handleSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        lastAction = handleSearch;
        clearTimeout(suggestDebounce);
        if (suggestAbortController) suggestAbortController.abort();
        suggestAbortController = new AbortController();

        try {
            const results = await fetchGeocode(query, suggestAbortController.signal);
            if (results.length === 0) {
                closeDropdown();
                showState('empty', TXT.notFoundMsg(query), TXT.notFoundTitle);
                return;
            }
            if (results.length === 1) {
                selectResult(results[0]);
                return;
            }
            dropdownResults = results;
            highlightIndex = 0;
            renderDropdown();
            searchInput.focus();
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            closeDropdown();
            showState('error', TXT.searchErr);
        }
    };

    searchBtn.addEventListener('click', handleSearch);

    searchInput.addEventListener('input', () => {
        clearTimeout(suggestDebounce);
        const query = searchInput.value.trim();
        if (query.length < 2) { closeDropdown(); return; }
        suggestDebounce = setTimeout(() => suggest(query), 300);
    });

    searchInput.addEventListener('keydown', (e) => {
        const open = !dropdown.classList.contains('hidden');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (open && dropdownResults.length > 0) {
                e.preventDefault();
                moveHighlight(e.key === 'ArrowDown' ? 1 : -1);
            }
        } else if (e.key === 'Enter') {
            if (open && highlightIndex >= 0 && dropdownResults[highlightIndex]) {
                selectResult(dropdownResults[highlightIndex]);
            } else {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    dropdown.addEventListener('pointerdown', (e) => {
        const option = e.target.closest('.search-option');
        if (!option || option.dataset.index === undefined) return;
        e.preventDefault();
        selectResult(dropdownResults[Number(option.dataset.index)]);
    });

    document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('#search-dropdown') && e.target !== searchInput) closeDropdown();
    });

    errorRetry.addEventListener('click', () => { if (lastAction) lastAction(); });

    /* =====================================================================
       Geolocation on load → graceful fallback to empty state
       ===================================================================== */
    const reverseGeocode = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            if (!response.ok) return { name: 'Your Location', country: '', country_code: '' };
            const data = await response.json();
            return {
                name: data.city || data.locality || 'Your Location',
                country: data.countryName || '',
                country_code: data.countryCode || '',
            };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return { name: 'Your Location', country: '', country_code: '' };
        }
    };

    const locateAndFetch = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const loc = await reverseGeocode(lat, lon);
                    fetchWeatherData(lat, lon, { name: loc.name, country: loc.country });
                },
                (error) => {
                    console.warn('Geolocation denied or failed:', error);
                    showState('empty');
                },
                { timeout: 10000 }
            );
        } else {
            showState('empty');
        }
    };

    locateBtn.addEventListener('click', () => {
        showState('loading', TXT.loadingLocate);
        locateAndFetch();
    });

    // Initial paint
    const savedLocation = readLastLocation();
    if (savedLocation) {
        showState('loading', TXT.loadingFetch);
        fetchWeatherData(savedLocation.lat, savedLocation.lon, { name: savedLocation.name, country: savedLocation.country });
    } else {
        showState('loading', TXT.loadingLocate);
        locateAndFetch();
    }
});
