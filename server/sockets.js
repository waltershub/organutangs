//Models
var Meeting = require('../database-mongo/models/meeting.js');
var Match = require('../database-mongo/models/match.js');
const forecast = require('./weather.js');
let prevQuery = '';

//APIs
const gmaps = require('./google-maps.js');
const yelp = require('./yelp.js');

var socketInstance = function(io){
  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('initLocation', function (locationObj) {
      forecast.forecastRequest(locationObj, (err, weather) => {
        io.sockets.emit('initWeather', weather);
      });
    });

    socket.on('user looking for friend', function (meeting) {
      // Room set-up (rooms are naively set as sorted and joined names e.g. 'alicebob')
      var sortedPair = [meeting.friendId, meeting.userId].sort();
      var room = sortedPair.join('');

      socket.join(room, function() {
        // console.log('room', room);
        socket.emit('match status', 'Looking for your friend...');
        socket.to(room).emit('match status', 'Looking for your friend...');

        Meeting.findOne({userId: meeting.friendId, friendId: meeting.userId})
          .exec(function (err, doc) {
            if (err) return console.error('Err querying Meeting table for userId and friendId: ', err);
            if (doc) {
              // Match found! Insert match into the db.
              // socket.broadcast.emit('match status', 'found');
              console.log('Found a match');
              const query = meeting.query || 'food';
              let sameQuery = query === prevQuery;
              let amount = sameQuery ? 10 : 5 ;
              const message = sameQuery ? 'Your match was found!' : 'places found matching both of your searches';
              // console.log('socket.rooms', socket.rooms);
              // socket.emit('match status', message);
              socket.to(room).emit('match status', message);
              socket.to(room).emit('mode', meeting.mode);

              var newMatch = new Match({
                userId1: meeting.userId,
                userId2: meeting.friendId,
                matchFulfilled: true
              });

              socket.to(room).emit('match data', {
                userId1: meeting.userId,
                userId2: meeting.friendId
              });

              // Get location 1
              var friendLocation = doc.userLocation;

              // Get location 2
              // - Pull the friend's geocoded location from db
              Meeting.findOne({userId: meeting.userId})
                .exec(function (err, doc) {
                  var userLocation = doc.userLocation;

                  gmaps.generateMidpoint(userLocation.coordinates, friendLocation.coordinates)
                    .then((midpoint) => {
                      // console.log('Midpoint generated:', midpoint);


                      yelp.yelpRequest(midpoint, query , amount )
                        .then((yelpLocations) => {
                            console.log("locations",yelpLocations);
                          yelp.yelpRequest(midpoint , prevQuery ,5)
                            .then((otherYelpLocs) => {
                              yelp.yelpRequest(midpoint,`${query} ${prevQuery}`,5)
                                .then((mixedLocs) => {
                                    console.log("locations",yelpLocations);
                                    console.log("otherYelpLocs",otherYelpLocs);
                                    if (!sameQuery){
                                      yelpLocations = yelpLocations.concat(otherYelpLocs);
                                      yelpLocations = yelpLocations.concat(mixedLocs);
                                    }

                                // Re-render client
                                // push to the beginning of yelpLocations
                                // var md = { coordinates: midpoint };
                                // yelpLocations.unshift(md);
                                    io.sockets.emit('midpoint', { lat: midpoint.latitude, lng: midpoint.longitude });
                                    io.sockets.emit('meeting locations', yelpLocations);
                                    io.sockets.emit('user locations', {
                                    location1: { lat: userLocation.coordinates[0], lng: userLocation.coordinates[1] },
                                    location2: { lat: friendLocation.coordinates[0], lng: friendLocation.coordinates[1] }
                                  });
                            });
                          });
                        });
                    });
                });

            } else {
              // console.log(`User ${meeting.friendId} and Friend ${meeting.userId} match not found in db.`);
              // TODO somehow print "Looking for your friend"
              // console.log('room', room);
              prevQuery = meeting.query;
              socket.to(room).emit('match status', 'Looking for your friend.');
            }
          }); // End meeting.findOne
      }); // End socket.join room
    }); // End socket on

    socket.on('result click', ({ key, value }) => {
      io.sockets.emit('result click', {key, value});
    });

    socket.on('disconnect', function () {
      // TODO update socket_id db
      console.log('a user disconnected');
    });
  });
};

module.exports = socketInstance;
