const Forecast = require('forecast');
const config = require('./config.js');


const forecast = new Forecast({
  service: 'darksky',
  key: config.darksky,
  units: 'farenheit',
});

var forecastRequest = (midpoint, callback) => {
  return forecast.get([midpoint.latitude, midpoint.longitude], callback);
}


module.exports.forecastRequest = forecastRequest;


