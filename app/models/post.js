
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var postSchema = new Schema({
 title: {
    type: String,
    index: true
  },
  slug: {
    type: String
  },
  link: {
    type: String,
    index: true,
    required: true
  },
  blog: {
    type: String,
    index: true,
    required: true
  },
  displayDate: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    es_indexed: true,
    index: true
  },
  content: {
    type: String,
    index: false
  },
  contentSummary: {
    type: String,
    index: false
  },
  tags: {
    type: Array,
    index: true
  }
});

/**
 * Register
 */

mongoose.model('postModel', postSchema);
