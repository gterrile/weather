import './style.css'
import './reset.css'

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

    // console.log(((obj.forecast.forecastday[currentday].hour[currentHour].time).split(' ')[1]).split(':')[0])
    // console.log(obj.forecast.forecastday[currentday].hour[currentHour].condition.icon)
    // console.log(obj.forecast.forecastday[currentday].hour[currentHour].temp_f)
    
    if (currentHour < 23) {
      currentHour += 1
    } else {
      currentday += 1
      currentHour = 0
    }

  }
}



function displayNextDaysForecast(obj) {

}

getWeather('Buenos Aires')
getForecast('Buenos Aires')



