module.exports = function (app) {
  var feedParser = require('../app/controllers/feedParser');
  var CronJob = require('cron').CronJob;
  feedParser.parse();

  new CronJob('1 1 * * * *', function(){
    console.log('parsing ...');
    feedParser.parse();
  }, null, true);

};
