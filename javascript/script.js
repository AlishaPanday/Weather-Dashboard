
$(document).ready(function () {
    //API key for open weather API
    const APIKey = "acfb5588fa124979c9615ae07af4673e";
    //Momen.js
    const currentDate = moment().format('L');
    console.log(currentDate);
    let city = "";
    const searchHistory = JSON.parse(localStorage.getItem("displayCity")) === null ? [] : JSON.parse(localStorage.getItem("displayCity"));

    renderSearchList();

    function renderSearchList() {

        $("#search-list").empty();
        searchHistory.forEach(function (city) {
            //validation for not repeating same city if it is already in search history 
            let search_history_list = $("<li>");
            search_history_list.addClass("list-group-item btn btn-light");
            search_history_list.text(city);
            $("#search-list").prepend(search_history_list);
        });
        //calling function on button click
        $(".btn").click(currentWeatherForecast);
        $(".btn").click(futureweatherForecast);

        if (searchHistory != null && searchHistory[searchHistory.length - 1] != null) {
            currentWeatherForecast(null, searchHistory[searchHistory.length - 1]);
            futureweatherForecast();
        }
    }

    //Function def for current weather forecast
    function currentWeatherForecast(event, cityParam) {
        if (cityParam != null) {
            city = cityParam;
        }
        else if ($(this).attr("id") === "search-button") {
            city = $("#search-city").val();
        }
        else {
            city = $(this).text();

        }
        var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
        console.log(currentUrl);
        console.log(searchHistory.indexOf(city));

        if (searchHistory.indexOf(city) === -1) {
            searchHistory.push(city);
        }

        console.log(searchHistory);
        localStorage.setItem("displayCity", JSON.stringify(searchHistory));
        //querying the openweather database

        $.ajax({
            url: currentUrl,
            method: "GET",
        }).then(function (response) {
            //store recieved data inside the object called response
            console.log(response);
            //injecting content to html
            $(".city-name").html(response.name + " " + currentDate);
            $("#weather-icon").attr("src","https://openweathermap.org/img/w/" + response.weather[0].icon + ".png");

            //convert temp to celcius
            var tempF = (response.main.temp - 273.15);
            $(".current-temp").text("Temperature: " + tempF.toFixed(2) + "°C");

            //Transfering humidity to html
            var wind = (response.wind.speed * 2.237)
            $(".current-humidity").text("Humidity: " + response.main.humidity + "%");

            //Transfering wind to html
            $(".current-wind").text("Wind Speed: " + wind.toFixed(2) + "MPH");
            // UV index goes here 

            UVIndex(response.coord.lon,response.coord.lat);

        });

    }
    //function def for future weather forecast
    // querying the openweather databse for 5 days forecast 
    function futureweatherForecast() {
        let fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
        let dayCount = 1;
        $.ajax({
            url: fiveDayForecast,
            method: "GET",
        }).then(function (response) {
            //store recieved data inside the object called response
            //for loop to loop through object to get date, temp, humidity for 5 days
            for (let i = 0; i < response.list.length; i++) {
                //initialise dateTime to store dt_txt from object.list
                let dateTime = response.list[i].dt_txt;
                //split method to split the date and time from dt_txt
                let date = dateTime.split(" ")[0];
                let time = dateTime.split(" ")[1];

                if (time === "15:00:00") {
                    let year = date.split("-")[0];
                    let month = date.split("-")[1];
                    let day = date.split("-")[2];
               
                    //transfering date,icon,temp and wind to the html
                    $("#forecast-" + dayCount).children(".card-date").text(month + "/" + day + "/" + year);
                    $("#forecast-" + dayCount).children(".icon").attr("src", "https://api.openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                    $("#forecast-" + dayCount).children(".card-temp").text("Temp: " + ((response.list[i].main.temp - 273.15).toFixed(2) + "°C"));
                    $("#forecast-" + dayCount).children(".card-humidity").text("Humidity: " + response.list[i].main.humidity + "%");
                    dayCount ++;

                }
            }
        });

    }
    //function def for UVindex for current weather forecast 
   // querying open weather UV index data for current weather forecast
    function UVIndex(ln,lt){
        //lets build the url for uvindex.
        var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
        $.ajax({
                url:uvqURL,
                method:"GET"
                }).then(function(response){
                    $("#uv-index").html(response.value);
                });
    }
    
    //listener on btn id
    $("#search-button").click(renderSearchList);

});