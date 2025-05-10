"use strict"
const weatherPart = document.querySelector(".weather");
const cityInput = document.querySelector(".search__input");
const searchBtn =  document.querySelector(".search__button");
const searchLabel = document.querySelector(".search__label");

const error_color ='  #eb5757';
const gray_color = ' #676767';

const temperatureValue = document.querySelector(".temperature__value");
const todayPrecipitation = document.querySelector(".today__precipitation");
const todayMaximum = document.querySelector(".today__maximum");
const weatherDescription = document.querySelector(".city__description");
const cityText = document.querySelector(".city__city-text"); 
const boardImag = document.querySelector(".board__imag");
const forecastDay = document.querySelector(".forecast__day");
const forecastImag = document.querySelector(".forecast__imag");
const forecastPrecipitation = document.querySelector(".forecast__precipitation");
const dayTemperature = document.getElementById("day-temperature");
const nightTemperature = document.getElementById("night-temperature");
const forecastWeatherContainer = document.querySelector(".weather__forecast-container");

const zeroTemperature = 0;
const apiSuccessReturn = 200;
const cityLoadName = 'Kyiv';
const ID_TUNDERSTORM = 232;
const ID_DRIZZLE = 531;
const ID_SNOW = 622;
const ID_CLOUDS = 781;
const ID_SUNNY = 800;
const TIME_DAY = '15:00:00';
const TIME_MORNING = '06:00:00';
const TIME_AFTERNOON = '12:00:00';
const TIME_EVENING = '18:00:00';

const API_KEY = '1922124b5359e6ca7c0aecd4698ac8ac';

(function(){
  forecastWeatherContainer.innerHTML = '';
  weatherInfo (cityLoadName);
  weatherForecast(cityLoadName);
})();

cityInput.addEventListener ('keyup', event => {
  const cityName = cityInput.value.trim();
  forecastWeatherContainer.innerHTML = '';

  if (event.code === 'Enter' && cityName) {
    weatherInfo (cityName);
    weatherForecast(cityName);
  }
});

searchBtn.addEventListener ('click', () => {
searchLabel.style.setProperty('color', gray_color);
searchLabel.textContent = 'Celected: ';
cityInput.value = '';
forecastWeatherContainer.innerHTML = '';
})

async function weatherInfo(cityName) {
  const server = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
  const response = await fetch(server);
  const weatherData = await response.json();

  if (weatherData.cod !== apiSuccessReturn) {
      cityNotFound();
  } else {
     getWeather(weatherData);
  }
}

function getForecastTime(nowTime) {
  return nowTime < TIME_DAY ? TIME_DAY : TIME_AFTERNOON;
}

async function weatherForecast(cityName) {
  let tempNight = zeroTemperature;

  const server = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;
  const response = await fetch(server);
  const forecastsData = await response.json();
  
  const timeNight = TIME_MORNING;
  const nowTime = new Date().toLocaleTimeString();
  const timeDay = getForecastTime(nowTime); 

  const date = new Date();
  const todayDate = date.toISOString().split('T')[0];
  
  if (forecastsData.cod != apiSuccessReturn) {
   cityNotFound();
  } else {
    for  (let i = 0; i < forecastsData.list.length; i++){
     if(forecastsData.list[i].dt_txt.includes(timeNight) && !forecastsData.list[i].dt_txt.includes(todayDate)) {
      tempNight = forecastsData.list[i].main.temp;
    }
    if (forecastsData.list[i].dt_txt.includes(timeDay) && !forecastsData.list[i].dt_txt.includes(todayDate)) {
      getWeatherForecast(forecastsData.list[i],tempNight);
    }
 }
 }
}

function cityNotFound() {
  searchLabel.style.setProperty('color', error_color);
  searchLabel.textContent = 'City coordinates not found ';
  forecastWeatherContainer.innerHTML = '';
  cityInput.value = '';
}

function cityFound(location, country) {
  searchLabel.style.setProperty('color', gray_color);
  searchLabel.textContent = `Celected: ${location}, ${country}`;
}

function getWeather(data) {
  const location = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const tempMax = Math.round(data.main.temp_max);
  const tempMin = Math.round(data.main.temp_min);
  const weatherStatus = data.weather[0].main;
  const weatherIcon = getWeatherIcon(data.weather[0].id);

  const nowTime = new Date().toLocaleTimeString();
 
  plusTempText(nowTime < TIME_EVENING ? tempMax : tempMin, todayMaximum);

  plusTempText(temp,  temperatureValue);
  cityFound(location, country);

  weatherDescription.textContent = data.weather[0].description;
  cityText.textContent = `${location}, ${country}`;
  todayPrecipitation.textContent = weatherStatus;
  boardImag.src = `img/icon/${weatherIcon}`;
}

function plusTempText(temp, text) {
  text.textContent = `${temp > zeroTemperature ? '+' : ''}${temp}°C`;
}

function plusTemp(temp) {
  return temp > zeroTemperature ? '+' : '';
}

function getWeatherIcon(id) {
  if(id <= ID_TUNDERSTORM) return 'thunderstorm-rain.svg';
  if(id <= ID_DRIZZLE) return 'drizzle-rain.svg';
  if(id <= ID_SNOW) return 'snow.svg'
  if(id <= ID_CLOUDS) return 'clouds.svg'
  if(id <= ID_SUNNY) return 'sunny.svg'
  else return 'cloudly.svg'
}

function getWeatherForecast(data, tempNight){
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SUT"];
  const currentData = data.dt_txt;
  const day = new Date(currentData);
  let currentDay = days[day.getDay()];

  const tempNightRound = Math.round(tempNight)
  const tempDay = Math.round(data.main.temp);
  const weatherStatus = data.weather[0].main;
  const weatherIcon = getWeatherIcon(data.weather[0].id);

 const tameplate = `
 <div class="weather__forecast forecast">
                <div class="forecast__day">${currentDay}</div>
                <img class="forecast__imag" src="img/icon/${weatherIcon}" alt="weather">
                <div class="forecast__precipitation">${weatherStatus}</div>
                <div class="forecast__temperature list">
                    <ul class="list__items ">
                        <li class="list__item list__item--time">Day</li>
                        <li class="list__item" id="day-temperature">${plusTemp(tempDay)} ${tempDay}°C</li>
                        <li class="list__item" id="night-temperature">${plusTemp(tempNight)} ${tempNightRound}°C</li>
                        <li class="list__item list__item--time">Night</li>
                    </ul>
                </div>
            </div>
 `     
 forecastWeatherContainer.insertAdjacentHTML("beforeend",tameplate);
}

