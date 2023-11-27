import './style.css'
import './reset.css'
import cities from 'cities.json';

const error = document.getElementById('error');
const searchButton = document.getElementById('btn-search')
const searchField = document.getElementById('search');

searchButton.addEventListener('click', function() {
  
  // Validate search.value
  getWeather(searchField.value)
  getForecast(searchField.value)
})

async function getWeather(city) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=64e203b4a6a54f138eb52839232511&q=${city}`);
  //console.log('response: ', response);

  if (response.status === 401 || response.status === 403) {
    error.textContent = 'Error on the API key';
  } else if (response.status === 400) {
    error.textContent = 'Error on the search parameters';
  }

  const obj = await response.json();
  //console.log('current', obj);
  displayWeatherInfo(obj);
}

function displayWeatherInfo(obj) {
  const city = document.getElementById('text-city');
  city.textContent = obj.location.name;
  const country = document.getElementById('text-country');
  country.textContent = obj.location.country;

  const localTime = (obj.location.localtime).split(' ')[1];
  const time = document.getElementById('text-time');
  time.textContent = localTime;
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
  //console.log('forecast', obj);
  displayHourlyForecast(obj);
  displayNextDaysForecast(obj);
}

function displayHourlyForecast(obj) {
  const hours = document.getElementById('hours');
  while(hours.firstChild) {
    hours.removeChild(hours.firstChild)
  }

  const localtime = (obj.location.localtime).split(' ')[1];
  let currentHour = parseInt(localtime.split(':')[0]);
  let currentday = 0
  for (let i = 0; i < 5; i++) {

    const hour = document.createElement('div');
    hour.classList.add('hour');
    hours.appendChild(hour);
    const time = document.createElement('span');
    hour.appendChild(time);
    time.textContent = ((obj.forecast.forecastday[currentday].hour[currentHour].time).split(' ')[1]).split(':')[0];
    const icon = document.createElement('img');
    hour.appendChild(icon);
    icon.src = obj.forecast.forecastday[currentday].hour[currentHour].condition.icon;
    const temp = document.createElement('span');
    hour.appendChild(temp);
    temp.textContent = obj.forecast.forecastday[currentday].hour[currentHour].temp_f + ' °F';
    
    if (currentHour < 23) {
      currentHour += 1
    } else {
      currentday += 1
      currentHour = 0
    }

  }
}

function displayNextDaysForecast(obj) {
  const days = document.getElementById('days')
  while (days.firstChild) {
    days.removeChild(days.firstChild);
  }

  //console.log(obj);
  for (let i = 0; i < 3; i++) {
    //console.log(obj.forecast.forecastday[i])
    const day = document.createElement('div');
    day.classList.add('day');
    days.appendChild(day)

    const date = document.createElement('span');
    date.textContent = (obj.forecast.forecastday[i].date).split('-')[2]
    day.appendChild(date);
    const icon = document.createElement('img');
    icon.src = obj.forecast.forecastday[i].day.condition.icon
    day.appendChild(icon)
    const description = document.createElement('span');
    description.textContent = obj.forecast.forecastday[i].day.condition.text
    day.appendChild(description)
    const minTemp = document.createElement('span');
    minTemp.textContent = obj.forecast.forecastday[i].day.mintemp_f + ' °F';
    day.appendChild(minTemp)
    const maxTemp = document.createElement('span');
    maxTemp.textContent = obj.forecast.forecastday[i].day.maxtemp_f + ' °F';
    day.appendChild(maxTemp)
    
    //console.log((obj.forecast.forecastday[i].date).split('-')[2])
    console.log(obj.forecast.forecastday[i].astro.sunrise)
    console.log(obj.forecast.forecastday[i].astro.sunset)
    console.log(obj.forecast.forecastday[i].day.maxtemp_f)
    console.log(obj.forecast.forecastday[i].day.mintemp_f)
    console.log(obj.forecast.forecastday[i].day.condition.text)
    console.log(obj.forecast.forecastday[i].day.condition.icon)
  } 
}

let randomLocation = parseInt(Math.random() * cities.length);
getWeather(cities[randomLocation].name)
getForecast(cities[randomLocation].name)



