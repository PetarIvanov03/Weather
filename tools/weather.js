(() => {
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

    const initWeather = () => {
        const searchInput = document.getElementById('weather-search-input');
        const searchBtn = document.getElementById('weather-search-btn');
        const statusMsg = document.getElementById('weather-status-msg');
        const weatherCard = document.getElementById('weather-card');

        const uiCity = document.getElementById('weather-city');
        const uiCountry = document.getElementById('weather-country');
        const uiTemp = document.getElementById('weather-temp');
        const uiCondition = document.getElementById('weather-condition');
        const uiFeelsLike = document.getElementById('weather-feels-like');
        const uiWind = document.getElementById('weather-wind');
        const uiHumidity = document.getElementById('weather-humidity');
        const uiUv = document.getElementById('weather-uv');
        const uiForecastList = document.getElementById('weather-forecast-list');

        let fetchAbortController = null;

        const updateStatus = (msg, isLoading = false, isError = false) => {
            statusMsg.textContent = msg;
            statusMsg.className = `text-zinc-500 text-sm mb-4 min-h-[1.25rem] ${isLoading ? 'animate-pulse text-zinc-300' : isError ? 'text-red-400' : ''}`;
        };

        const getDayName = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        };

        const renderWeather = (data, city, country) => {
            const current = data.current;
            const daily = data.daily;

            uiCity.textContent = city || 'Unknown City';
            uiCountry.textContent = country || '--';

            uiTemp.textContent = `${Math.round(current.temperature_2m)}°`;
            uiCondition.textContent = getWeatherCondition(current.weather_code);

            uiFeelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
            uiWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
            uiHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`;
            uiUv.textContent = daily.uv_index_max && daily.uv_index_max.length > 0 ? daily.uv_index_max[0] : '--';

            // Render Forecast
            uiForecastList.innerHTML = '';
            for (let i = 1; i < 8 && i < daily.time.length; i++) {
                const dayName = getDayName(daily.time[i]);
                const condition = getWeatherCondition(daily.weather_code[i]);
                const maxTemp = Math.round(daily.temperature_2m_max[i]);
                const minTemp = Math.round(daily.temperature_2m_min[i]);

                const itemHTML = `
                    <div class="flex items-center justify-between text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                        <span class="w-12 text-sm font-medium tracking-wide">${dayName}</span>
                        <span class="flex-1 text-left text-xs text-zinc-500 px-2 truncate">${condition}</span>
                        <div class="w-16 flex justify-end gap-2 text-sm">
                            <span class="text-zinc-900 dark:text-zinc-100">${maxTemp}°</span>
                            <span class="text-zinc-500 dark:text-zinc-600">${minTemp}°</span>
                        </div>
                    </div>
                `;
                uiForecastList.insertAdjacentHTML('beforeend', itemHTML);
            }

            weatherCard.classList.remove('hidden');
            weatherCard.classList.add('flex');
        };

        const fetchWeatherData = async (lat, lon, cityName, countryName) => {
            updateStatus('Fetching weather data...', true);
            weatherCard.classList.add('hidden');
            weatherCard.classList.remove('flex');

            if (fetchAbortController) fetchAbortController.abort();
            fetchAbortController = new AbortController();

            try {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
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
            weatherCard.classList.remove('flex');

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

        const onSearchKeyDown = (e) => {
            if (e.key === 'Enter') handleSearch();
        };

        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keydown', onSearchKeyDown);

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

        // Cleanup
        window.currentCleanup = () => {
            if (fetchAbortController) fetchAbortController.abort();
            searchBtn.removeEventListener('click', handleSearch);
            searchInput.removeEventListener('keydown', onSearchKeyDown);
            weatherCard.classList.add('hidden');
            weatherCard.classList.remove('flex');
            searchInput.value = '';
            updateStatus('');
        };
    };

    // Run init
    initWeather();
})();