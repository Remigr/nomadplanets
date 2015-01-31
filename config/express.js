var path = require('path');
var root = path.normalize(__dirname + '/..');
var express = require('express');

module.exports = function (app) {

  app.use(express.static(root + '/public'));
  app.engine('html', require('ejs').renderFile);
  app.set('views', root+'/public');
  app.set('view engine', 'html');

}
