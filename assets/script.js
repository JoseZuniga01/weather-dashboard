var cities = [];

var cityInfoEl=document.querySelector("#city");
var citySearchEl=document.querySelector("#city-search-input");
var forecastName = document.querySelector("#forecast");
var weatherBoxEl=document.querySelector("#todays-weather-container");
var pastSearchesEl = document.querySelector("#past-searches");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var citySearchNameEl = document.querySelector("#city-searched");

var getWeather = function(city){
  var apiKey = "03d1bf5ede9a237c437a50d463bc00ee"
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var formSumbit = function(event){
  event.preventDefault();
  var city = cityInfoEl.value.trim();
  if(city){
    get5Day(city);
      getWeather(city);
      cityInfoEl.value = "";
      cities.unshift({city});
  } else{
      alert("Enter a valid City");
  }
  saveSearch();
  pastSearch(city);
}

var displayWeather = function(weather, searchCity){
  //delete past content
  weatherBoxEl.textContent= "";  
  citySearchNameEl.textContent=searchCity;

    //Build element to hold temp
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"
    
   //Build element to hold wind info 
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"


  //Build date portion
  var currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchNameEl.appendChild(currentDate);


  //Build element to house humidity info
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item"

    //Build the image portion
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchNameEl.appendChild(weatherIcon);
   


  //append to container
  weatherBoxEl.appendChild(windSpeedEl);
  weatherBoxEl.appendChild(humidityEl);
  weatherBoxEl.appendChild(temperatureEl);
  

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getIndex(lat,lon)

};

//Save citity searches to local storage 
var saveSearch = function(){
  localStorage.setItem("cities", JSON.stringify(cities));
};
 
var displayIndex = function(index){
  var uvIndexEl = document.createElement("div");
  uvIndexEl.classList = "list-group-item"
  uvIndexEl.textContent = "UV Index: "
  
  uvIndexValue.textContent = index.value
  uvIndexValue = document.createElement("span")

  if(index.value <=2){
      uvIndexValue.classList = "favorable"
  }else if(index.value >2 && index.value<=8){
      uvIndexValue.classList = "moderate "
  }
  else if(index.value >8){
      uvIndexValue.classList = "severe"
  };

  uvIndexEl.appendChild(uvIndexValue);

  //append index to most recent weather
  weatherBoxEl.appendChild(uvIndexEl);
}

 var getIndex = function(lat,lon){

     var apiKey = "03d1bf5ede9a237c437a50d463bc00ee"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
     fetch(apiURL)
     .then(function(response){
         response.json().then(function(data){
             displayIndex(data)
         });
     });
 }
  
 
 var get5Day = function(city){
  var apiKey = "03d1bf5ede9a237c437a50d463bc00ee"
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

     fetch(apiURL)
     .then(function(response){
         response.json().then(function(data){
            display5Day(data);
         });
     });
 };
 
 var display5Day = function(weather){
  fiveDayContainerEl.textContent = ""
  forecastName.textContent = "5-Day Forecast:";

  var forecast = weather.list;
      for(var i=5; i < forecast.length; i=i+8){
     var dailyForecast = forecast[i];
      
     
     var forecastEl=document.createElement("div");
     forecastEl.classList = "card bg-primary text-light m-2";

     //Create eleman from humidity 
     var forecastHumEl=document.createElement("span");
     forecastHumEl.classList = "card-body text-center";
     forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

     //create date element
     var forecastDate = document.createElement("h5")
     forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
     forecastDate.classList = "card-header text-center"
     forecastEl.appendChild(forecastDate);

     //create element for temperature 
     var forecastTempEl=document.createElement("span");
     forecastTempEl.classList = "card-body text-center";
     forecastTempEl.textContent = dailyForecast.main.temp + " °F";

     //create an image element
     var weatherIcon = document.createElement("img")
     weatherIcon.classList = "card-body text-center";
     weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

    //Append to container 
     forecastEl.appendChild(forecastTempEl);
     forecastEl.appendChild(forecastHumEl);
     fiveDayContainerEl.appendChild(forecastEl);
     forecastEl.appendChild(weatherIcon);
  }

}
 
 var pastSearchHandler = function(event){
     var city = event.target.getAttribute("data-city")
     if(city){
         getWeather(city);
         get5Day(city);
     }
 }

 var pastSearch = function(pastSearch){
 
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
  pastSearchEl.setAttribute("data-city",pastSearch)
  pastSearchEl.setAttribute("type", "submit");

  pastSearchesEl.prepend(pastSearchEl);
}
 
 citySearchEl.addEventListener("submit", formSumbit);
 pastSearchesEl.addEventListener("click", pastSearchHandler);
 
 
 //recentley searched cities from storage
   function loadWatchList() {
     let watchRow = JSON.parse(localStorage.getItem("favorites"));
 
     if (watchRow) {
       favorites = watchRow;
     } else {
       favorites = [];
     }
   }
 
   loadWatchList()
