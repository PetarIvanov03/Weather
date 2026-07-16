document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-icon-dark');
    const lightIcon = document.getElementById('theme-icon-light');

    const initTheme = () => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    };

    themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        } else {
            localStorage.theme = 'light';
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    });
    initTheme();

    // Weather
    // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
    const getWeatherCondition = (code) => {
        const conditions = {
            0: 'Clear Sky',
            1: 'Mainly Clear',
            2: 'Partly Cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing Rime Fog',
            51: 'Light Drizzle',
            53: 'Moderate Drizzle',
            55: 'Dense Drizzle',
            56: 'Light Freezing Drizzle',
            57: 'Dense Freezing Drizzle',
            61: 'Slight Rain',
            63: 'Moderate Rain',
            65: 'Heavy Rain',
            66: 'Light Freezing Rain',
            67: 'Heavy Freezing Rain',
            71: 'Slight Snow Fall',
            73: 'Moderate Snow Fall',
            75: 'Heavy Snow Fall',
            77: 'Snow Grains',
            80: 'Slight Rain Showers',
            81: 'Moderate Rain Showers',
            82: 'Violent Rain Showers',
            85: 'Slight Snow Showers',
            86: 'Heavy Snow Showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with Slight Hail',
            99: 'Thunderstorm with Heavy Hail'
        };
        return conditions[code] || 'Unknown Condition';
    };

    // WMO code groups for icon / theme selection
    const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82];
    const SNOW_CODES = [71, 73, 75, 77, 85, 86];
    const THUNDER_CODES = [95, 96, 99];
    const FOG_CODES = [45, 48];

    const getIconType = (code, isDay) => {
        if (SNOW_CODES.includes(code)) return 'snow';
        if (THUNDER_CODES.includes(code)) return 'thunder';
        if (RAIN_CODES.includes(code)) return 'rain';
        if (FOG_CODES.includes(code)) return 'fog';
        if (code === 3) return 'cloud';
        if (code === 2) return isDay ? 'partly' : 'partlyNight';
        return isDay ? 'sun' : 'moon';
    };

    // Soft SVG icon set from the design (sun / cloud / rain / moon),
    // extended in the same style with partly / snow / fog / thunder.
    const ICONS = {
        sun: (w) => `<svg width="${w}" height="${w}" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="7" fill="#ffd97a"></circle>
            <g stroke="#ffd97a" stroke-width="2" stroke-linecap="round">
                <line x1="15" y1="1" x2="15" y2="5"></line><line x1="15" y1="25" x2="15" y2="29"></line>
                <line x1="1" y1="15" x2="5" y2="15"></line><line x1="25" y1="15" x2="29" y2="15"></line>
                <line x1="5.5" y1="5.5" x2="8.2" y2="8.2"></line><line x1="21.8" y1="21.8" x2="24.5" y2="24.5"></line>
                <line x1="5.5" y1="24.5" x2="8.2" y2="21.8"></line><line x1="21.8" y1="8.2" x2="24.5" y2="5.5"></line>
            </g>
        </svg>`,
        moon: (w) => `<svg width="${w * 0.87}" height="${w * 0.87}" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#d9def0"></path>
        </svg>`,
        cloud: (w) => `<svg width="${w}" height="${w * 30 / 34}" viewBox="0 0 34 30">
            <circle cx="12" cy="16" r="8" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="20" cy="13" r="9" fill="#f4f6f9"></circle>
            <circle cx="24" cy="18" r="7" fill="#dfe4ec" opacity="0.9"></circle>
            <rect x="7" y="18" width="22" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        partly: (w) => `<svg width="${w}" height="${w * 30 / 34}" viewBox="0 0 34 30">
            <circle cx="23" cy="9" r="6" fill="#ffd97a"></circle>
            <circle cx="12" cy="17" r="7.5" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="19" cy="15" r="8" fill="#f4f6f9"></circle>
            <rect x="7" y="18" width="21" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        partlyNight: (w) => `<svg width="${w}" height="${w * 30 / 34}" viewBox="0 0 34 30">
            <path d="M28 11.4A6.5 6.5 0 1 1 20.9 4.3 5 5 0 0 0 28 11.4z" fill="#d9def0"></path>
            <circle cx="11" cy="17" r="7.5" fill="#e9edf3" opacity="0.95"></circle>
            <circle cx="18" cy="15" r="8" fill="#f4f6f9"></circle>
            <rect x="6" y="18" width="21" height="8" rx="4" fill="#eef1f5"></rect>
        </svg>`,
        rain: (w) => `<svg width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="12" r="7" fill="#c7cfdb" opacity="0.95"></circle>
            <circle cx="19" cy="10" r="8" fill="#d4dae3"></circle>
            <rect x="7" y="14" width="20" height="7" rx="3.5" fill="#ccd3dd"></rect>
            <g stroke="#9fb3d1" stroke-width="2" stroke-linecap="round">
                <line x1="12" y1="25" x2="10" y2="30"></line>
                <line x1="19" y1="25" x2="17" y2="31"></line>
                <line x1="26" y1="25" x2="24" y2="30"></line>
            </g>
        </svg>`,
        snow: (w) => `<svg width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="12" r="7" fill="#e3e8f0" opacity="0.95"></circle>
            <circle cx="19" cy="10" r="8" fill="#eef1f6"></circle>
            <rect x="7" y="14" width="20" height="7" rx="3.5" fill="#e7ebf2"></rect>
            <g fill="#dfe6f2">
                <circle cx="11" cy="26" r="1.8"></circle>
                <circle cx="18" cy="29" r="1.8"></circle>
                <circle cx="25" cy="26" r="1.8"></circle>
            </g>
        </svg>`,
        fog: (w) => `<svg width="${w}" height="${w * 30 / 34}" viewBox="0 0 34 30">
            <g stroke="#dfe4ec" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
                <line x1="6" y1="9" x2="28" y2="9"></line>
                <line x1="4" y1="15" x2="30" y2="15"></line>
                <line x1="7" y1="21" x2="26" y2="21"></line>
            </g>
        </svg>`,
        thunder: (w) => `<svg width="${w}" height="${w}" viewBox="0 0 34 34">
            <circle cx="12" cy="11" r="7" fill="#c7cfdb" opacity="0.95"></circle>
            <circle cx="19" cy="9" r="8" fill="#d4dae3"></circle>
            <rect x="7" y="13" width="20" height="7" rx="3.5" fill="#ccd3dd"></rect>
            <path d="M19 19l-6 8h4.2L15 34l8-10h-4.4l2.6-5z" fill="#ffd97a"></path>
        </svg>`
    };
    const getIcon = (code, isDay, size) => ICONS[getIconType(code, isDay)](size);

    // Gradient theme selection: current weather code + day/night
    const getTheme = (code, isDay) => {
        if (SNOW_CODES.includes(code)) return 'snow';
        if (RAIN_CODES.includes(code) || THUNDER_CODES.includes(code)) return 'rain';
        if (!isDay) return 'night';
        if (code <= 1) return 'clear';
        if (code === 2) return 'partly-cloudy';
        return 'overcast';
    };

    const getUvLabel = (uv) => uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
    const getCompass = (deg) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

    // Format "2026-07-16T15:00" -> "3PM" (string-based: API times are already in the location's timezone)
    const formatHour = (isoTime) => {
        const h = parseInt(isoTime.slice(11, 13), 10);
        if (h === 0) return '12AM';
        if (h === 12) return '12PM';
        return h < 12 ? `${h}AM` : `${h - 12}PM`;
    };

    // Format "2026-07-16T06:12" -> "6:12 AM" (string-based: API times are already in the location's timezone)
    const formatClock = (isoTime) => {
        let h = parseInt(isoTime.slice(11, 13), 10);
        const m = isoTime.slice(14, 16);
        const ap = h < 12 ? 'AM' : 'PM';
        h = h % 12 || 12;
        return `${h}:${m} ${ap}`;
    };

    const searchInput = document.getElementById('weather-search-input');
    const searchBtn = document.getElementById('weather-search-btn');
    const statusMsg = document.getElementById('weather-status-msg');
    const weatherCard = document.getElementById('weather-card');

    const uiCity = document.getElementById('weather-city');
    const uiCountrySep = document.getElementById('weather-country-sep');
    const uiCountry = document.getElementById('weather-country');
    const uiTemp = document.getElementById('weather-temp');
    const uiCondition = document.getElementById('weather-condition');
    const uiHeroHigh = document.getElementById('hero-high');
    const uiHeroLow = document.getElementById('hero-low');
    const uiFeelsLike = document.getElementById('weather-feels-like');
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

    let fetchAbortController = null;

    // Hourly rail: keep a whole number of centered cards per slide
    // (card width + gap: 84+10 on mobile, 90+12 on desktop, from the design)
    const updateRailWidth = () => {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        const gap = isDesktop ? 12 : 10;
        const cardUnit = (isDesktop ? 90 : 84) + gap;
        const count = Math.max(1, Math.floor((railOuter.clientWidth + gap) / cardUnit));
        rail.style.width = `${count * cardUnit - gap}px`;
        rail.style.margin = '0 auto';
    };
    new ResizeObserver(updateRailWidth).observe(railOuter);

    // Desktop: translate vertical wheel into horizontal rail scroll
    rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            rail.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });

    const updateStatus = (msg, isLoading = false, isError = false) => {
        statusMsg.textContent = msg;
        statusMsg.className = `text-sm mb-4 min-h-[1.25rem] ${isLoading ? 'animate-pulse' : ''}`;
        statusMsg.style.color = isError ? '#f87171' : 'var(--tx2)';
    };

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const renderDaily = (daily) => {
        uiForecastList.innerHTML = '';
        const days = Math.min(7, daily.time.length);

        // Global min/max across the week for the temperature range bars
        let weekLo = Infinity, weekHi = -Infinity;
        for (let i = 0; i < days; i++) {
            weekLo = Math.min(weekLo, daily.temperature_2m_min[i]);
            weekHi = Math.max(weekHi, daily.temperature_2m_max[i]);
        }
        const span = Math.max(1, weekHi - weekLo);

        for (let i = 0; i < days; i++) {
            const dayName = i === 0 ? 'Today' : getDayName(daily.time[i]);
            const icon = getIcon(daily.weather_code[i], true, 22);
            const precip = daily.precipitation_probability_max && daily.precipitation_probability_max[i] != null
                ? daily.precipitation_probability_max[i] : 0;
            const minTemp = Math.round(daily.temperature_2m_min[i]);
            const maxTemp = Math.round(daily.temperature_2m_max[i]);
            const left = ((daily.temperature_2m_min[i] - weekLo) / span * 100).toFixed(0);
            const width = ((daily.temperature_2m_max[i] - daily.temperature_2m_min[i]) / span * 100).toFixed(0);

            const itemHTML = `
                <div class="flex items-center gap-3 py-[7px] md:py-2 ${i > 0 ? 'border-t' : ''}" style="border-color: var(--row-border)">
                    <div class="w-[38px] text-sm font-semibold shrink-0">${dayName}</div>
                    <div class="w-[26px] h-[26px] flex items-center justify-center shrink-0">${icon}</div>
                    <div class="w-[30px] text-xs font-semibold shrink-0" style="color: var(--precip)">${precip}%</div>
                    <div class="flex-1 flex items-center gap-2 min-w-0">
                        <span class="text-[13px] w-[22px] shrink-0" style="color: var(--tx2)">${minTemp}°</span>
                        <div class="flex-1 h-1 rounded-sm relative overflow-hidden" style="background: var(--track)">
                            <div class="absolute top-0 bottom-0 rounded-sm" style="left: ${left}%; width: ${width}%; background: linear-gradient(90deg, #9fb3d1, #ffd97a);"></div>
                        </div>
                        <span class="text-[13px] w-[22px] text-right font-medium shrink-0">${maxTemp}°</span>
                    </div>
                </div>
            `;
            uiForecastList.insertAdjacentHTML('beforeend', itemHTML);
        }
    };

    // Next 24 hours starting from the hour containing "now"
    const renderHourly = (hourly, currentTime) => {
        const times = hourly.time;
        let start = times.findIndex((t) => t > currentTime);
        if (start === -1) start = times.length;
        start = Math.max(0, start - 1);
        const end = Math.min(start + 24, times.length);

        let html = '';
        for (let i = start; i < end; i++) {
            const label = i === start ? 'Now' : formatHour(times[i]);
            const icon = getIcon(hourly.weather_code[i], hourly.is_day[i] === 1, 30);
            const precip = hourly.precipitation_probability && hourly.precipitation_probability[i] != null
                ? hourly.precipitation_probability[i] : 0;
            html += `
                <div class="hour-card glass-card">
                    <div class="text-[13px] font-medium" style="color: var(--tx2)">${label}</div>
                    <div class="w-[34px] h-[34px] flex items-center justify-center">${icon}</div>
                    <div class="text-lg font-medium">${Math.round(hourly.temperature_2m[i])}°</div>
                    <div class="flex items-center gap-[3px] text-[11px] font-semibold" style="color: var(--precip)">
                        <svg width="8" height="10" viewBox="0 0 8 10"><path d="M4 0L8 6H0Z" fill="currentColor"></path></svg>
                        <span>${precip}%</span>
                    </div>
                    <div class="text-[11px] font-medium" style="color: var(--tx2)">${Math.round(hourly.wind_speed_10m[i])} km/h</div>
                    <div class="text-[10px] font-semibold tracking-[0.3px]" style="color: var(--tx3)">UV ${Math.round(hourly.uv_index[i])}</div>
                </div>
            `;
        }
        rail.innerHTML = html;
        rail.scrollLeft = 0;
        updateRailWidth();
    };

    const renderWeather = (data, city, country) => {
        const current = data.current;
        const daily = data.daily;
        const isDay = current.is_day === 1;

        document.body.dataset.theme = getTheme(current.weather_code, isDay);

        uiCity.textContent = city || 'Unknown City';
        uiCountry.textContent = country || '';
        uiCountrySep.style.display = country ? '' : 'none';

        uiTemp.textContent = Math.round(current.temperature_2m);
        uiCondition.textContent = getWeatherCondition(current.weather_code);
        uiHeroHigh.textContent = Math.round(daily.temperature_2m_max[0]);
        uiHeroLow.textContent = Math.round(daily.temperature_2m_min[0]);
        uiFeelsLike.textContent = Math.round(current.apparent_temperature);

        // UV card (today's max)
        const uvToday = daily.uv_index_max && daily.uv_index_max.length > 0 ? daily.uv_index_max[0] : null;
        uiUv.textContent = uvToday != null ? Math.round(uvToday) : '--';
        uiUvLabel.textContent = uvToday != null ? getUvLabel(uvToday) : '';
        uiUvBar.style.width = uvToday != null ? `${Math.min(100, uvToday / 11 * 100)}%` : '0%';

        // Wind card
        uiWind.textContent = Math.round(current.wind_speed_10m);
        uiWindDir.textContent = getCompass(current.wind_direction_10m);
        uiWindArrow.style.transform = `rotate(${Math.round(current.wind_direction_10m)}deg)`;

        // Humidity card
        uiHumidity.textContent = Math.round(current.relative_humidity_2m);
        uiDewPoint.textContent = Math.round(current.dew_point_2m);

        // Sunrise / Sunset card
        uiSunrise.textContent = formatClock(daily.sunrise[0]);
        uiSunset.textContent = formatClock(daily.sunset[0]);

        renderHourly(data.hourly, current.time);
        renderDaily(daily);

        weatherCard.classList.remove('hidden');
    };

    const fetchWeatherData = async (lat, lon, cityName, countryName) => {
        updateStatus('Fetching weather data...', true);
        weatherCard.classList.add('hidden');

        if (fetchAbortController) fetchAbortController.abort();
        fetchAbortController = new AbortController();

        try {
            const url = 'https://api.open-meteo.com/v1/forecast'
                + `?latitude=${lat}&longitude=${lon}`
                + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,dew_point_2m,is_day'
                + '&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m,uv_index,is_day'
                + '&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset,precipitation_probability_max'
                + '&timezone=auto';
            const response = await fetch(url, { signal: fetchAbortController.signal });
            if (!response.ok) throw new Error('Failed to fetch weather data.');
            const data = await response.json();

            renderWeather(data, cityName, countryName);
            updateStatus('', false);

        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            updateStatus('Error fetching weather data. Please try again.', false, true);
        }
    };

    const handleSearch = async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        updateStatus('Searching for city...', true);
        weatherCard.classList.add('hidden');

        if (fetchAbortController) fetchAbortController.abort();
        fetchAbortController = new AbortController();

        try {
            const searchUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1`;
            const response = await fetch(searchUrl, { signal: fetchAbortController.signal });
            if (!response.ok) throw new Error('Geocoding API failed.');
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                updateStatus('City not found. Please try another search.', false, true);
                return;
            }

            const result = data.results[0];
            fetchWeatherData(result.latitude, result.longitude, result.name, result.country || result.admin1 || '--');

        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error(err);
            updateStatus('Error searching for city. Please try again.', false, true);
        }
    };

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    const reverseGeocode = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            if (!response.ok) return { city: 'Your Location', country: 'Local' };
            const data = await response.json();
            const city = data.city || data.locality || 'Your Location';
            const country = data.countryName || 'Local';
            return { city, country };
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return { city: 'Your Location', country: 'Local' };
        }
    };

    // Geolocation on start
    updateStatus('Locating you...', true);
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const locationData = await reverseGeocode(lat, lon);
                fetchWeatherData(lat, lon, locationData.city, locationData.country);
            },
            (error) => {
                console.warn('Geolocation denied or failed:', error);
                updateStatus('Please search for a city above.');
            },
            { timeout: 10000 }
        );
    } else {
        updateStatus('Please search for a city above.');
    }
});
