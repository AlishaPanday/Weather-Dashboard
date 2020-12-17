
$(document).ready(function () {
    const APIKey = "acfb5588fa124979c9615ae07af4673e";
    const currentDate = moment().format('L');
    console.log(currentDate);

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

        $(".btn").click(currentWeatherForecast);
        $(".btn").click(futureweatherForecast);

    }


    function currentWeatherForecast() {
        if ($(this).attr("id") === "search-button") {
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

            //convert temp to fahrenheit
            var tempF = (response.main.temp - 273.15);
            //var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".current-temp").text("Temperature: " + tempF.toFixed(2) + "°C");

            //Transfering humidity to html
            var wind = (response.wind.speed * 2.237)
            $(".current-humidity").text("Humidity: " + response.main.humidity + "%");

            //Transfering wind to html
            $(".current-wind").text("Wind Speed: " + wind.toFixed(2) + "MPH");
            // UV index goes here 

        });

    }

    function futureweatherForecast() {
        const fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
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
    //listener on btn id
    $("#search-button").click(renderSearchList);


});