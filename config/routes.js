
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var post = require('../app/controllers/post');
var home = require('../app/controllers/home');



/**
 * Expose
 */

module.exports = function (app) {
  var pageNum = 1

  app.use(function(req, res, next) {
    pageNum = 1; //resets the pageNum to 1 - this will be changed below if the user specifies a val below

    //validating pageNum
    if (req.query.pageNum) {
      req.pageNum = req.query.pageNum;
    } else {
      req.pageNum = 1;
    }
    //validating perPage
    if (req.query.perPage) {
      req.perPage = req.query.perPage;
    } else {
      req.perPage = 10;
    }
    next();
  });

  app.get('/', home.index);

  app.get('/articles', function(req, res, next) {
    post.getMostRecentArticles(req.pageNum, req.perPage, function(err, posts) {
      if (err) {
        res.send(err);
      } else {
        res.json(posts);
      }
    });
  });
  app.get('/tags', function(req, res, next) {
    post.getCurrentTags(req.pageNum, req.perPage, function(err, posts) {
      if (err) {
        res.send(err);
      } else {
        res.json(posts);
      }
    });
  });
  app.route('/articles/tags/:tags')
//validates searchTag
.all(function(req, res, next) {
  if (req.params.tags) {
    req.tags = req.params.tags.split("+");
    next();
  } else {
    debug('ERROR - Empty tags parameter');
    res.json({
      'error': 'Empty tags parameter'
    });
  }
})
.get(function(req, res, next) {
  post.getArticlesByTags(req.pageNum, req.perPage, req.tags, function(err, posts) {
    if (err) {
      res.send(err);
    } else {
      res.json(posts);
    }
  });
});


app.get('/articles/id/:article_id', function(req, res, next) {
  var articleId = req.params.article_id;
  post.getArticleById(req.pageNum, req.perPage, articleId, function(err, post) {
    if (err) {
      res.send(err);
    } else {
      res.json(post);
    }
  });
});


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
