document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");
    const searchButton = document.getElementById("searchButton");
    const status = document.getElementById("status");
    const weatherResult = document.getElementById("weatherResult");

    const GEOCODING_API =
        "https://geocoding-api.open-meteo.com/v1/search";

    const WEATHER_API =
        "https://api.open-meteo.com/v1/forecast";

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const city = cityInput.value.trim();

        if (city === "") {
            showError("Please enter a city name.");
            return;
        }

        setLoading(true);
        weatherResult.hidden = true;
        status.textContent = "Fetching weather data...";
        status.className = "status";

        try {

            // First API call: get city coordinates
            const locationData = await getLocation(city);

            // Second API call: get current weather
            const weatherData = await getWeather(
                locationData.latitude,
                locationData.longitude
            );

            // Display the JSON data
            displayWeather(locationData, weatherData);

            status.textContent =
                "Weather data loaded successfully.";
            status.className = "status success";

        } catch (error) {

            console.error(error);

            showError(
                error.message ||
                "Unable to fetch weather data."
            );

        } finally {

            setLoading(false);
        }
    });


    // Fetch city name and coordinates
    async function getLocation(city) {

        const url =
            `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Location request failed: ${response.status}`
            );
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error(
                "City not found. Please check the city name."
            );
        }

        // Nested JSON object
        return data.results[0];
    }


    // Fetch current weather
    async function getWeather(latitude, longitude) {

        const url =
            `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Weather request failed: ${response.status}`
            );
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error(
                "Weather information is not available."
            );
        }

        return data;
    }


    // Display data from nested JSON
    function displayWeather(locationData, weatherData) {

        const current = weatherData.current;
        const units = weatherData.current_units;

        document.getElementById("cityName").textContent =
            locationData.name;

        document.getElementById("location").textContent =
            `${locationData.admin1 || ""}, ${locationData.country || ""}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} ${units.temperature_2m}`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}${units.relative_humidity_2m}`;

        document.getElementById("windSpeed").textContent =
            `${current.wind_speed_10m} ${units.wind_speed_10m}`;

        document.getElementById("condition").textContent =
            getWeatherCondition(current.weather_code);

        weatherResult.hidden = false;
    }


    // Convert WMO weather code into readable text
    function getWeatherCondition(code) {

        const conditions = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            61: "Slight Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Slight Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Rain Showers",
            81: "Moderate Rain Showers",
            82: "Heavy Rain Showers",
            95: "Thunderstorm",
            96: "Thunderstorm with Hail",
            99: "Thunderstorm with Heavy Hail"
        };

        return conditions[code] || "Unknown Condition";
    }


    function showError(message) {

        status.textContent = message;
        status.className = "status error";
    }


    function setLoading(loading) {

        searchButton.disabled = loading;
        cityInput.disabled = loading;

        searchButton.textContent =
            loading ? "Loading..." : "Search";
    }

});
