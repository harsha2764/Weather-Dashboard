
const apiKey = "YOUR API KEY";

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const themeBtn = document.getElementById("themeBtn");

searchBtn.addEventListener("click", () => getWeather());
locationBtn.addEventListener("click", getLocationWeather);
themeBtn.addEventListener("click", toggleTheme);

/* =======================
   THEME TOGGLE
======================= */
function toggleTheme() {
  document.body.classList.toggle("light");
}

/* =======================
   CITY WEATHER
======================= */
async function getWeather(city) {

  const inputCity = city || document.getElementById("cityInput").value;

  if (!inputCity) return showError("Enter city name");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    updateCurrentWeather(data);

    getForecast(data.coord.lat, data.coord.lon);

  } catch (err) {
    showError(err.message);
  }
}

/* =======================
   CURRENT WEATHER UI
======================= */
function updateCurrentWeather(data) {

  document.getElementById("city").textContent =
    `${data.name}, ${data.sys.country}`;

  document.getElementById("temp").textContent =
    `${data.main.temp}°C`;

  document.getElementById("desc").textContent =
    data.weather[0].description;

  document.getElementById("humidity").textContent =
    `Humidity: ${data.main.humidity}%`;

  document.getElementById("wind").textContent =
    `Wind: ${data.wind.speed} m/s`;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

/* =======================
   5-DAY FORECAST
======================= */
async function getForecast(lat, lon) {

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );

  const data = await res.json();

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  const daily = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  daily.forEach(day => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString().slice(0, 10)}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
      <p>${day.main.temp}°C</p>
    `;

    forecastDiv.appendChild(div);
  });
}

/* =======================
   AUTO LOCATION WEATHER
======================= */
function getLocationWeather() {

  navigator.geolocation.getCurrentPosition(async (pos) => {

    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    const data = await res.json();

    updateCurrentWeather(data);

    getForecast(latitude, longitude);

  });
}

/* =======================
   ERROR HANDLING
======================= */
function showError(msg) {
  document.getElementById("error").textContent = msg;
}