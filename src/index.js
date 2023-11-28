import './style.css'
import './reset.css'
import cities from 'cities.json';

const error = document.getElementById('error');
const searchButton = document.getElementById('btn-search')
const searchField = document.getElementById('search');
const toggle = document.getElementById('toggle');
let showingLocation = 'Los Angeles'
let unit = 'f'

toggle.textContent = unit
toggle.addEventListener('click', function() {
  toggle.classList.toggle('c')
  if (toggle.classList.contains('c')) {
    toggle.textContent = 'c'
    unit = 'c'
    getWeather(showingLocation)
  } else {
    toggle.textContent = 'f'
    unit = 'f'
    getWeather(showingLocation)
  }
})


searchButton.addEventListener('click', function() {
  
  // Validate search.value
  if (searchField.value) {
    showingLocation = searchField.value
  }
  getWeather(showingLocation)
})

async function getWeather(city) {
  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=64e203b4a6a54f138eb52839232511&q=${city}`);
  //console.log('response: ', response);

  if (response.status === 401 || response.status === 403) {
    error.textContent = 'Error on the API key';
  } else if (response.status === 400) {
    error.textContent = 'Error on the search parameters';
  } else {
    const obj = await response.json();
    displayWeatherInfo(obj);
    error.textContent = '';
    searchField.value = '';
    getForecast(city)
  }


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
  if (unit == 'f') {
    temp.textContent = obj.current.temp_f + '°F'
  } else {
    temp.textContent = obj.current.temp_c + '°C'
  }
  const description = document.getElementById('text-description');
  description.textContent = obj.current.condition.text;
  const icon = document.getElementById('icon');
  icon.src = obj.current.condition.icon

  error.textContent = ' ';
}

async function getForecast(city) {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=64e203b4a6a54f138eb52839232511&q=${city}&days=3`);
  
  if (response.status === 401 || response.status === 403) {
    error.textContent = 'Error on the API key';
  } else if (response.status === 400) {
    error.textContent = 'Error on the search parameters';
  } else {
    const obj = await response.json();
    displayHourlyForecast(obj);
    displayNextDaysForecast(obj);
  }
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
    time.style.fontSize = '1.25rem'
    const icon = document.createElement('img');
    hour.appendChild(icon);
    icon.src = obj.forecast.forecastday[currentday].hour[currentHour].condition.icon;
    const temp = document.createElement('span');
    hour.appendChild(temp);
    if (unit == 'f') {
      temp.textContent = obj.forecast.forecastday[currentday].hour[currentHour].temp_f + ' °F';
    } else {
      temp.textContent = obj.forecast.forecastday[currentday].hour[currentHour].temp_c + ' °C';
    }

    
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

    const left = document.createElement('div');
    left.classList.add('left');
    day.appendChild(left)
    const date = document.createElement('span');
    date.textContent = (obj.forecast.forecastday[i].date).split('-')[2]
    left.appendChild(date);
    const icon = document.createElement('img');
    icon.src = obj.forecast.forecastday[i].day.condition.icon
    left.appendChild(icon)

    const middle = document.createElement('div');
    middle.classList.add('middle');
    day.appendChild(middle)
    const description = document.createElement('span');
    description.textContent = obj.forecast.forecastday[i].day.condition.text
    middle.appendChild(description)

    const right = document.createElement('div');
    right.classList.add('right');
    day.appendChild(right)
    const maxTemp = document.createElement('span');
    if (unit == 'f') {
      maxTemp.textContent = 'Max temp: ' + obj.forecast.forecastday[i].day.maxtemp_f + ' °F';
    } else {
      maxTemp.textContent = 'Max temp: ' + obj.forecast.forecastday[i].day.maxtemp_c + ' °C';
    }
    right.appendChild(maxTemp)
    const minTemp = document.createElement('span');
    if (unit == 'f') {
      minTemp.textContent = 'Min temp: ' + obj.forecast.forecastday[i].day.mintemp_f + ' °F';
    } else {
      minTemp.textContent = 'Min temp: ' + obj.forecast.forecastday[i].day.mintemp_c + ' °C';
    }
    right.appendChild(minTemp)


    
    //console.log((obj.forecast.forecastday[i].date).split('-')[2])
    console.log(obj.forecast.forecastday[i].astro.sunrise)
    console.log(obj.forecast.forecastday[i].astro.sunset)
    console.log(obj.forecast.forecastday[i].day.maxtemp_f)
    console.log(obj.forecast.forecastday[i].day.mintemp_f)
    console.log(obj.forecast.forecastday[i].day.condition.text)
    console.log(obj.forecast.forecastday[i].day.condition.icon)
  } 
}

// let randomLocation = parseInt(Math.random() * cities.length);
// getWeather(cities[randomLocation].name)
// getForecast(cities[randomLocation].name)

getWeather(showingLocation)


