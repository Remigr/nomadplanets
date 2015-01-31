var CronJob = require('cron').CronJob;
var feedParser = require('feedParser');

module.exports = function (app) {

  feedParser.parse();

  new CronJob('* 15 * * * *', function(){
      feedParser.parse();
  }, null, true);

};
