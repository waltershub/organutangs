
  exports.translate = function(forecastIOIcon) {
    var translationTable = {
      "clear-day" : "../images/weather/clear-day.png",
      "clear-night" : "../images/weather/clear-night.png",
      "rain" : "../images/weather/rain.png",
      "snow" : "../images/weather/snow.png",
      "sleet" : "../images/weather/sleet.png",
      "wind" : "../images/weather/wind.png",
      "fog" : "../images/weather/fog.png",
      "cloudy" : "../images/weather/cloudy.png",
      "partly-cloudy-day" : "../images/weather/partly-cloudy-day.png",
      "partly-cloudy-night" : "../images/weather/partly-cloudy-night.png",
      "loading" : "../images/weather/loading.png"
    };
    var result = translationTable[forecastIOIcon];
    if (result == undefined)
    {
      console.log("Unhandled Forecast.io Icon, please report to developers: '" + forecastIOIcon  + "'");
    }
    return result;
  };
