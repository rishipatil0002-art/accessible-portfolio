const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const statusText = document.getElementById("status");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherCode = document.getElementById("weatherCode");


weatherForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    await getWeather(city);
});


async function getWeather(city) {

    try {

        showStatus("Loading weather...");

        weatherCard.classList.add("hidden");


        // Step 1: Find the city

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        if (!locationResponse.ok) {
            throw new Error("Unable to search for the city.");
        }


        const locationData = await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {
            throw new Error(
                "City not found. Please try another city."
            );
        }


        const location = locationData.results[0];


        // Step 2: Get weather data

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {
            throw new Error(
                "Unable to fetch weather data."
            );
        }


        const weatherData = await weatherResponse.json();


        // Access current weather data

        const current = weatherData.current;


        // Display data

        cityName.textContent = location.name;

        countryName.textContent =
            `${location.admin1 ? location.admin1 + ", " : ""}${location.country}`;

        temperature.textContent =
            current.temperature_2m;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${current.wind_speed_10m} km/h`;

        weatherCode.textContent =
            getWeatherCondition(current.weather_code);


        weatherCard.classList.remove("hidden");

        showStatus("");

    }

    catch (error) {

        showError(error.message);

    }
}


function getWeatherCondition(code) {

    if (code === 0)
        return "Clear";

    if ([1, 2, 3].includes(code))
        return "Cloudy";

    if ([45, 48].includes(code))
        return "Fog";

    if ([51, 53, 55, 56, 57].includes(code))
        return "Drizzle";

    if ([61, 63, 65, 66, 67].includes(code))
        return "Rain";

    if ([71, 73, 75, 77].includes(code))
        return "Snow";

    if ([80, 81, 82].includes(code))
        return "Showers";

    if ([95, 96, 99].includes(code))
        return "Thunderstorm";

    return "Unknown";
}


function showStatus(message) {

    statusText.textContent = message;

    statusText.style.color = "";

}


function showError(message) {

    statusText.textContent = message;

    statusText.style.color = "#dc2626";

}
