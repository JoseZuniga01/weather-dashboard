var cities = [];
var cityInfoEl=document.querySelector("#city");
var citySearchEl=document.querySelector("#city-search-input");
var forecastName = document.querySelector("#forecast");
var weatherBoxEl=document.querySelector("#todays-weather-container");
var pastSearchesEl = document.querySelector("#past-searches");
var fiveDayContainerEl = document.querySelector("#five-day-container");
var citySearchNameEl = document.querySelector("#city-searched");


var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInfoEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInfoEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    var apiKey = "03d1bf5ede9a237c437a50d463bc00ee"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

