var mongoose = require('mongoose');
var tags = require('../config/tags.json');

function getMostRecentArticles(page, perPage, callback) {
  mongoose
    .model('postModel')
    .find()
    .sort({
      'displayDate': 'desc'
    })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .exec(function(err, posts) {
      callback(err, posts);
    });
}

function getCurrentTags(page, perPage, callback) {
  mongoose
    .model('postModel')
    .find()
    .$where('this.tags.length > 0')
    .select('tags')
    .exec(function(err, posts) {
      var existingTags = []
      for(var i = 0; i < posts.length; i++) {
        for(var j = 0; j < posts[i].tags.length; j++) {
          if(existingTags.indexOf(posts[i].tags[j]) == -1) {
            existingTags.push(posts[i].tags[j]);
          }
        }
      }
      callback(err, existingTags.sort());
    });
}

function getArticlesByTags(page, perPage, tags, callback) {
  mongoose
    .model('postModel')
    .find({
      tags: {
        $in: tags
      }
    })
    .sort({
      'displayDate': 'desc'
    })
    .limit(perPage)
    .skip(perPage * (page - 1))
    .exec(function(err, posts) {
      callback(err, posts);
    });
}

function getArticleById(page, perPage, id, callback) {
  mongoose
    .model('postModel')
    .findById(id, function(err, docs) {
      callback(err, docs);
    });
}


exports.getMostRecentArticles = getMostRecentArticles;
exports.getArticlesByTags = getArticlesByTags;
exports.getCurrentTags = getCurrentTags;
exports.getArticleById = getArticleById;
