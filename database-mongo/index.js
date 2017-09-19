var mongoose = require('mongoose');

mongoose.connect('mongodb://root:12345@ds149603.mlab.com:49603/halfwaze');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

module.exports = db;
