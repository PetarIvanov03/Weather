document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* =====================================================================
       i18n — English (default) + Bulgarian
       ===================================================================== */
    const I18N = {
        en: {
            searchPlaceholder: 'Search city…',
            go: 'Go',
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
        },
        bg: {
            searchPlaceholder: 'Търсене на град…',
            go: 'Търси',
            hourly: 'Почасова прогноза',
            forecast14: '14-дневна прогноза',
            uvIndex: 'UV индекс',
            wind: 'Вятър',
            humidity: 'Влажност',
            sunsun: 'Изгрев / Залез',
            dewPoint: 'Точка на роса',
            feelsLike: 'Усеща се като',
            sets: 'Залязва',
            kmh: 'км/ч',
            today: 'Днес',
            now: 'Сега',
            high: 'В',
            low: 'Н',
            uvLevels: ['Нисък', 'Умерен', 'Висок', 'Много висок', 'Екстремен'],
            loadingLocate: 'Определяне на местоположението…',
            loadingFetch: 'Зареждане на данните за времето…',
            errTitle: 'Възникна грешка',
            errMsg: 'Данните за времето не можаха да се заредят. Проверете връзката и опитайте отново.',
            errRetry: 'Опитайте отново',
            searchErr: 'Търсенето на този град не бе успешно. Проверете връзката и опитайте отново.',
            emptyTitle: 'Няма избрано местоположение',
            emptyMsg: 'Потърсете град по-горе, за да видите времето.',
            notFoundTitle: 'Локацията не е намерена',
            notFoundMsg: (q) => `Няма резултати за „${q}“. Опитайте друго търсене.`,
            noMatches: 'Няма съвпадения',
        },
    };

    // WMO weather_code → condition name, per language
    const CONDITIONS = {
        en: {
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
        },
        bg: {
            0: 'Ясно', 1: 'Предимно ясно', 2: 'Променлива облачност', 3: 'Облачно',
            45: 'Мъгла', 48: 'Мъгла с иней',
            51: 'Слаб ръмеж', 53: 'Умерен ръмеж', 55: 'Силен ръмеж',
            56: 'Слаб леден ръмеж', 57: 'Силен леден ръмеж',
            61: 'Слаб дъжд', 63: 'Умерен дъжд', 65: 'Силен дъжд',
            66: 'Слаб леден дъжд', 67: 'Силен леден дъжд',
            71: 'Слаб снеговалеж', 73: 'Умерен снеговалеж', 75: 'Силен снеговалеж', 77: 'Снежни зърна',
            80: 'Слаби дъждовни превалявания', 81: 'Умерени дъждовни превалявания', 82: 'Силни дъждовни превалявания',
            85: 'Слаби снежни превалявания', 86: 'Силни снежни превалявания',
            95: 'Гръмотевична буря', 96: 'Гръмотевична буря със слаб град', 99: 'Гръмотевична буря със силен град',
        },
    };

    // Effective language: a manual toggle (persisted) overrides the auto choice
    // derived from the searched location's country.
    let manualLang = localStorage.getItem('weatherLang');
    if (manualLang !== 'en' && manualLang !== 'bg') manualLang = null;
    let autoLang = 'en';
    const lang = () => manualLang || autoLang;
    const t = () => I18N[lang()];
    const locale = () => (lang() === 'bg' ? 'bg-BG' : 'en-US');

    /* =====================================================================
       WMO code groups
       ===================================================================== */
    const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
    const SNOW_CODES = [71, 73, 75, 77, 85, 86];
    const THUNDER_CODES = [95, 96, 99];
    const FOG_CODES = [45, 48];

    const getWeatherCondition = (code) => CONDITIONS[lang()][code] || CONDITIONS.en[code] || '—';

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
            <circle cx="15" cy="15" r="7" fill="#ffd97a"></circle>
            <g stroke="#ffd97a" stroke-width="2" stroke-linecap="round">
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
            <circle cx="23" cy="9" r="6" fill="#ffd97a"></circle>
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
            <path d="M19 19l-6 8h4.2L15 34l8-10h-4.4l2.6-5z" fill="#ffd97a"></path>
        </svg>`,
    };
    const getIcon = (code, isDay, size) => ICONS[getIconType(code, isDay)](size);

    /* =====================================================================
       Background selection: condition category + time-of-day bucket → photo.
       16 photos exist locally; the four "always day/night" conditions fall
       back sunrise→day, sunset→night. Missing → gradient.
       ===================================================================== */
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
    const getUvLabel = (uv) => t().uvLevels[getUvLevel(uv)];
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
        if (index === 0) return t().today;
        // Noon avoids any date rollover when the locale formats the weekday
        const d = new Date(dateStr + 'T12:00:00');
        return new Intl.DateTimeFormat(locale(), { weekday: 'short' }).format(d);
    };

    /* =====================================================================
       DOM references
       ===================================================================== */
    const searchInput = document.getElementById('weather-search-input');
    const searchBtn = document.getElementById('weather-search-btn');
    const langToggle = document.getElementById('lang-toggle');
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

    let lastRender = null;   // { data, meta } — for language re-render
    let lastAction = null;   // re-run by the error screen's "Try again"
    let fetchAbortController = null;

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
    let currentEmpty = null;   // { title, message } to survive language switch

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

        if (name === 'loading') loadingMessage.textContent = message || t().loadingFetch;
        if (name === 'error') {
            errorTitleEl.textContent = t().errTitle;
            errorMessage.textContent = message || t().errMsg;
        }
        if (name === 'empty') {
            currentEmpty = { title: title || t().emptyTitle, message: message || t().emptyMsg };
            emptyTitle.textContent = currentEmpty.title;
            emptyMessage.textContent = currentEmpty.message;
        }
    };

    /* =====================================================================
       Rendering
       ===================================================================== */
    const renderHourly = (hourly, currentTime) => {
        const times = hourly.time;
        let start = times.findIndex((x) => x > currentTime);
        if (start === -1) start = times.length;
        start = Math.max(0, start - 1);
        const end = Math.min(start + 24, times.length);

        let html = '';
        for (let i = start; i < end; i++) {
            const label = i === start ? t().now : formatHour(times[i]);
            const icon = getIcon(hourly.weather_code[i], hourly.is_day[i] === 1, 34);
            const precip = hourly.precipitation_probability && hourly.precipitation_probability[i] != null
                ? hourly.precipitation_probability[i] : 0;
            html += `
                <div class="hour-card">
                    <div class="t-label">${label}</div>
                    <div class="hour-icon">${icon}</div>
                    <div class="t-value" style="font-weight: 500;">${Math.round(hourly.temperature_2m[i])}°</div>
                    <div style="display: flex; align-items: center; gap: 3px;">
                        <svg width="8" height="10" viewBox="0 0 8 10" style="filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4));"><path d="M4 0L8 6H0Z" fill="var(--accent)"></path></svg>
                        <span class="t-cap-accent">${precip}%</span>
                    </div>
                    <div class="t-cap">${Math.round(hourly.wind_speed_10m[i])} ${t().kmh}</div>
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

            html += `
                <div class="day-row">
                    <div class="t-body-emph" style="line-height: 1;">${dayName}</div>
                    <div class="day-icon">${icon}</div>
                    <div class="t-cap-accent" style="line-height: 1;">${precip}%</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="t-body" style="width: 24px; line-height: 1;">${minTemp}°</span>
                        <div style="flex: 1; height: 4px; border-radius: 2px; background: var(--track); position: relative; overflow: hidden;">
                            <div style="position: absolute; left: ${left}%; width: ${width}%; top: 0; bottom: 0; border-radius: 2px; background: linear-gradient(90deg, #9fb3d1, #ffd97a);"></div>
                        </div>
                        <span class="t-body-emph" style="width: 26px; text-align: right; line-height: 1;">${maxTemp}°</span>
                    </div>
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
        uiHiLo.textContent = `${t().high}:${Math.round(daily.temperature_2m_max[0])}° ${t().low}:${Math.round(daily.temperature_2m_min[0])}°`;
        uiFeels.textContent = `${t().feelsLike} ${Math.round(current.apparent_temperature)}°`;

        const uvToday = daily.uv_index_max && daily.uv_index_max.length ? daily.uv_index_max[0] : null;
        uiUv.textContent = uvToday != null ? Math.round(uvToday) : '--';
        uiUvLabel.textContent = uvToday != null ? getUvLabel(uvToday) : '';
        uiUvBar.style.width = uvToday != null ? `${Math.min(100, uvToday / 11 * 100)}%` : '0%';

        uiWind.textContent = Math.round(current.wind_speed_10m);
        uiWindDir.textContent = getCompass(current.wind_direction_10m);
        uiWindArrow.style.transform = `rotate(${Math.round(current.wind_direction_10m)}deg)`;

        uiHumidity.textContent = Math.round(current.relative_humidity_2m);
        uiDewPoint.textContent = Math.round(current.dew_point_2m);

        uiSunrise.textContent = formatClock(daily.sunrise[0]);
        uiSunset.textContent = formatClock(daily.sunset[0]);

        renderHourly(data.hourly, current.time);
        renderDaily(daily);

        showState('none');
        updateRailWidth();
    };

    /* =====================================================================
       Static-text i18n (labels not driven by weather data)
       ===================================================================== */
    const applyStaticI18n = () => {
        const dict = t();
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        searchInput.setAttribute('placeholder', dict.searchPlaceholder);
        searchBtn.setAttribute('aria-label', dict.go);
        errorRetry.textContent = dict.errRetry;
        langToggle.textContent = lang().toUpperCase();
    };

    const applyLanguage = () => {
        applyStaticI18n();
        if (lastRender) renderWeather(lastRender.data, lastRender.meta);
        if (currentState === 'loading') loadingMessage.textContent = t().loadingFetch;
        if (currentState === 'error') {
            errorTitleEl.textContent = t().errTitle;
            errorMessage.textContent = t().errMsg;
        }
        if (currentState === 'empty' && currentEmpty) {
            // Re-derive the standard empty text in the new language (custom
            // "not found" text is left as-is — it embeds a user query).
            emptyTitle.textContent = t().emptyTitle;
            emptyMessage.textContent = t().emptyMsg;
        }
    };

    langToggle.addEventListener('click', () => {
        manualLang = lang() === 'en' ? 'bg' : 'en';
        localStorage.setItem('weatherLang', manualLang);
        applyLanguage();
    });

    /* =====================================================================
       Weather fetch
       ===================================================================== */
    const fetchWeatherData = async (lat, lon, meta) => {
        lastAction = () => fetchWeatherData(lat, lon, meta);
        showState('loading', t().loadingFetch);

        if (fetchAbortController) fetchAbortController.abort();
        fetchAbortController = new AbortController();

        try {
            const url = 'https://api.open-meteo.com/v1/forecast'
                + `?latitude=${lat}&longitude=${lon}`
                + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,dew_point_2m,is_day'
                + '&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,uv_index,is_day'
                + '&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_max'
                + '&forecast_days=14&timezone=auto';
            const response = await fetch(url, { signal: fetchAbortController.signal });
            if (!response.ok) throw new Error('Failed to fetch weather data.');
            const data = await response.json();

            lastRender = { data, meta };
            renderWeather(data, meta);
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            showState('error', t().errMsg);
        }
    };

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

    const closeDropdown = () => {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        dropdownResults = [];
        highlightIndex = -1;
        searchInput.setAttribute('aria-expanded', 'false');
    };

    const renderDropdown = () => {
        if (dropdownResults.length === 0) {
            dropdown.innerHTML = `<div class="search-option search-muted" style="cursor: default;">${t().noMatches}</div>`;
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
    };

    const moveHighlight = (delta) => {
        if (dropdownResults.length === 0) return;
        highlightIndex = (highlightIndex + delta + dropdownResults.length) % dropdownResults.length;
        dropdown.querySelectorAll('.search-option').forEach((el, i) => {
            el.setAttribute('aria-selected', String(i === highlightIndex));
        });
        const active = dropdown.querySelector(`#search-option-${highlightIndex}`);
        if (active) active.scrollIntoView({ block: 'nearest' });
    };

    const selectResult = (result) => {
        closeDropdown();
        searchInput.value = result.name;
        searchInput.blur();
        // Auto language follows the location unless the user has toggled manually
        if (!manualLang) {
            autoLang = result.country_code === 'BG' ? 'bg' : 'en';
            applyStaticI18n();
        }
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
                showState('empty', t().notFoundMsg(query), t().notFoundTitle);
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
            showState('error', t().searchErr);
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

    // Initial paint
    applyStaticI18n();
    showState('loading', t().loadingLocate);

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const loc = await reverseGeocode(lat, lon);
                if (!manualLang) {
                    autoLang = loc.country_code === 'BG' ? 'bg' : 'en';
                    applyStaticI18n();
                }
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
});
