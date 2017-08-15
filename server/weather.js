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


// var yelpRequest = (location, term = 'food', dist = 500) => {
//   const long = location.longitude;
//   const lat = location.latitude;

//   return yelp.searchBusiness({
//       term: term,
//       latitude: lat,
//       longitude: long,
//       radius: dist,
//       limit: 10
//     })
//     .then((res) => {
//       var list = res.businesses;
//       // for (var i = 0; i < res.businesses.length; i++) {
//       //   list.push(res.businesses[i].coordinates);
//       // }
//       return list;
//     })
//   .catch((err) => {
//     console.error(err);
//   });
// };
