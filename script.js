const bodyElement = document.body;
bodyElement.style.backgroundColor = "#360369";
bodyElement.style.color = "white";

const fetchWeatherBtn = document.getElementById("fetch-btn");
fetchWeatherBtn.addEventListener("click", retrieveLocation);
const container = document.getElementsByClassName("landing-page")[0];

function retrieveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayPosition, handleError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function handleError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function displayPosition(position) {
    container.remove();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log('Latitude:', latitude, 'Longitude:', longitude);

    const apiKey = "0ad5703a5773a1597f26fc27e287b8f4";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    async function fetchWeatherData() {
        try {
            const response = await fetch(weatherApiUrl);
            const weatherData = await response.json();

            if (response.ok) {
                const weatherInfo = {
                    location: weatherData.name,
                    windSpeed: weatherData.wind.speed,
                    humidity: weatherData.main.humidity,
                    pressure: weatherData.main.pressure,
                    windDirection: weatherData.wind.deg,
                    uvIndex: "N/A",
                    feelsLike: weatherData.main.feels_like,
                    timezone: weatherData.timezone
                };
                renderWeatherData(latitude, longitude, weatherInfo);
            } else {
                console.error("Error fetching weather data:", weatherData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to fetch weather data.');
        }
    }

    fetchWeatherData();
}

function renderWeatherData(latitude, longitude, weatherInfo) {
    const weatherContainer = document.createElement("div");
    weatherContainer.className = "second-landing-page";
    const content = document.createElement("div");
    content.innerHTML = `
        <div class="main-page">
            <div class="weather-map">
                <h2>Welcome To The Weather App</h2>
                <p>${weatherInfo.location} is your current location</p>    
                <div class="box">
                    <div class="map-box">Lat: ${latitude}</div>
                    <div class="map-box">Long: ${longitude}</div>
                </div>
            </div>
            <div id="map" class="map">
                <iframe src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed"></iframe>
            </div>
        </div>
        <section class="weather-data">
            <h2>Your Weather Data</h2>
            <div class="weather-data-box">
                <div class="map-box">Location: ${weatherInfo.location || 'N/A'}</div>
                <div class="map-box">Wind Speed: ${weatherInfo.windSpeed || 'N/A'} kmph</div>
                <div class="map-box">Humidity: ${weatherInfo.humidity || 'N/A'}</div>
                <div class="map-box">Time Zone: GMT ${weatherInfo.timezone ? weatherInfo.timezone / 3600 : 'N/A'}</div>
                <div class="map-box">Pressure: ${weatherInfo.pressure || 'N/A'} atm</div>
                <div class="map-box">Wind Direction: ${weatherInfo.windDirection || 'N/A'}°</div>
                <div class="map-box">UV Index: ${weatherInfo.uvIndex}</div>
                <div class="map-box">Feels like: ${weatherInfo.feelsLike || 'N/A'}°</div>
            </div>
        </section>
    `;
    weatherContainer.appendChild(content);
    document.body.appendChild(weatherContainer);
}
