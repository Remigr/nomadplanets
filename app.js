/**
 * Module dependencies
 */

var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var config = require('config');

var app = express();
var port = process.env.PORT || 8080;

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});

// express
require('./config/express')(app);

// routes
require('./config/routes')(app);

// Cron
require('./config/cron')(app);

app.listen(port);
console.log('Express app started on port ' + port);
