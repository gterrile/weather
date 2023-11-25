import './style.css'
import './reset.css'

const cities = require('all-the-cities');


// const icon = document.getElementById('icon');
// icon.src = '//cdn.weatherapi.com/weather/64x64/night/113.png'

const searchButton = document.getElementById('btn-search')
searchButton.addEventListener('click', function() {
  const searchField = document.getElementById('search');
  getWeather(searchField.value)
  getForecast(searchField.value)
})

async function getWeather(city) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=64e203b4a6a54f138eb52839232511&q=${city}`);
  const obj = await response.json();
  console.log('current', obj);
  displayWeatherInfo(obj);
}

function displayWeatherInfo(obj) {
  const city = document.getElementById('text-city');
  city.textContent = obj.location.name;
  const country = document.getElementById('text-country');
  country.textContent = obj.location.country;
  const temp = document.getElementById('text-temp');
  temp.textContent = obj.current.temp_f
  const description = document.getElementById('text-description');
  description.textContent = obj.current.condition.text;
  const icon = document.getElementById('icon');
  icon.src = obj.current.condition.icon
}

async function getForecast(city) {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=64e203b4a6a54f138eb52839232511&q=${city}&days=3`);
  const obj = await response.json();
  console.log('forecast', obj);
}

getWeather('Buenos Aires')
getForecast('Buenos Aires')



