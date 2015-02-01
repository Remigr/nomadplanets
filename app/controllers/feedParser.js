/*----------------------------------------------------
  Global Variables
 ---------------------------------------------------*/
var feeds = require('../config/feeds.json');
var feedparser = require('feedparser');
var request = require('request');
var mongoose = require('mongoose');
var taggingSystem = require('./tagSystem.js');
var htmlToText = require('html-to-text');

require('../models/post.js');
var postSchema = mongoose.model('postModel');

exports.parse = function () {

  function setup() {
      for (var site in feeds) {
          build(feeds[site], function() {
              console.log(' --done--');
          });
      }
  }

  function build(blog, callback) {
      var counter = 0;
      var req = request(blog.feed);
      var parser = new feedparser();

      req.on('error', function(error) {
          // handle any request errors
          console.log(error);
      });
      req.on('response', function(res) {
          var stream = this;
          if (res.statusCode !== 200) {
              return console.log('error', new Error('Bad status code (' + res.statusCode + ') from: ' + String(blog.link)));
          }
          stream.pipe(parser);
      });
      parser.on('readable', function() {
          // This is where the action is!
          var stream = this;
          var post;
          while (post = stream.read()) {
              parsePost(post, blog);
          }
          counter++;
      });
      parser.on('end', function() {
          counter--;
          if (counter === 0 && callback) {
              callback();
              callback = null;
          }
      });
      parser.on('error', function(err) {
          console.log('%s - build error (%s) - [%s]: %s', new Date(), blog.feed, err, err.code);
          if (callback) callback();
          callback = null;
      });
  }

  function parsePost(post, blog) {
      //does it have everything that we need?
      if (post && post.title != '' && post.title != 'No title' && post.title && post.description) {
          parseText(post.title, function(err, parsedTitle) {
              parseText(post.description, function(err, parsedDescription) {
                  var postObject = new postSchema({
                    title: parsedTitle,
                    slug: slugify(post.title),
                    site: post.blog,
                    displayDate: post.pubdate.toString('MM dd yyyy'),
                    content: parsedDescription,
                    contentSummary: htmlToText.fromString(parsedDescription, {}).replace(/\[(.*?)\]/g, "").substring(0, 500) + ' [...]',
                    link: post.link,
                    author: post.author,
                    blog: blog.link
                  });
                  savePost(postObject);
              });
          });
      } else {
          console.log('Doc does not have all required data: ' + JSON.stringify(post.link));
      }
  }

  function savePost(postObject) {
      //Does the doc already exist? (found by title)
      findPost(postObject, function(err, results) {
          //It does exist - so I will delete it and then save it again with the old ID
          if (results) {
            /*
              var preserveID = results._id;

              removePost(postObject, function(error, results) {
                  if (error) throw error;
                  tagPost(postObject, function(err, tags) {
                      postObject._id = preserveID;
                      postObject.tags = tags;
                      postObject.save(function(err, products, numberAffected) {
                          if (err) {
                              console.log('Error saving document: ' + err);
                          } else {
                              console.log(('rewriting document: ' + postObject.title));
                          }
                      });
                  });
              });
            */
          }
          //It doesnt exist so I will just save it
          else {
              tagPost(postObject, function(err, tags) {
                  postObject.tags = tags;
                  postObject.save(function(err, products, numberAffected) {
                      if (err) {
                          console.log('Error saving document: ' + err);
                      } else {
                          console.log(('Adding the post to DB: ' + postObject.title));
                      }
                  });
              });
          }
      });
  }

  function parseText(text, callback){
      removeScriptTags(text, function(err, results){
          callback(err, results);
      });
  }
  function parseHtml(text, callback){
    var text = htmlToText.fromString(text, {});
    text = text.replace(/\[(.*?)\]/g, "");
    callback(null, text);
  }

  function removeScriptTags(text, callback){
      text.replace(/<script[^>]*>/gi, ' <!-- ');
      text.replace(/<script[^>]*>/gi, ' <!-- ');
      callback(null, text);
  }

  function slugify(text) {
      return text.toString().toLowerCase()
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/[^\w\-]+/g, '') // Remove all non-word chars
          .replace(/\-\-+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, ''); // Trim - from end of text
  }

  function findPost(post, callback) {
      mongoose.model('postModel').findOne({
          title: post.title
      }).exec(function(err, results) {
          callback(null, results);
      });
  }

  function removePost(post, callback) {
      mongoose.model('postModel').remove({
          title: post.title
      }).exec(function(err, results) {
          callback(null, results);
      });
  }

  function tagPost(postObject, callback) {
      taggingSystem.tagArticle(postObject, function(err, tags) {
          callback(err, tags);
      });
  }

  setup();

}
