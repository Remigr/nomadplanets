var tags = require('../config/tags.json');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, "") // Replace spaces with space
    .replace(/[^\w\-\s]+/g, ' ') // Remove all non-word chars
    .replace(/\-+/g, ' - ') //adds spaces between pre-existant -
    .replace(/\-\-+/g, ' - ') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function NormalizeAccents(s) {
    var r = s.toLowerCase();

    r = r.replace(new RegExp("\\s", 'g'), "");
    r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
    r = r.replace(new RegExp("æ", 'g'), "ae");
    r = r.replace(new RegExp("ç", 'g'), "c");
    r = r.replace(new RegExp("[èéêë]", 'g'), "e");
    r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
    r = r.replace(new RegExp("ñ", 'g'), "n");
    r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
    r = r.replace(new RegExp("œ", 'g'), "oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
    r = r.replace(new RegExp("[ýÿ]", 'g'), "y");

    return r;
}

function tagArticle(post, callback) {

  var postTags = post.tags;
  var articleTitle = post.title.split(" ");
  for(var i in articleTitle) {
    articleTitle[i] = slugify(NormalizeAccents(articleTitle[i]));
  }
  var articleDescription = post.content.split(" ");
  for(var i in articleDescription) {
    articleDescription[i] = slugify(NormalizeAccents(articleDescription[i]))
  }
  for (var tag in tags) {
    //console.log(country)
    if(postTags.indexOf(tags[tag]) == -1 && (articleTitle.indexOf(slugify(NormalizeAccents(tags[tag]))) != -1 || articleDescription.indexOf(slugify(NormalizeAccents(tags[tag]))) != -1)) {
        postTags.push(tags[tag]);
    }
  }
  if (postTags.length == 0) {
    console.log('Could not generate tags for: ' + articleTitle);
  }
  //used null just to follow convention, but eventually add in err trace

  //console.log(postTags);
  callback(null, postTags);
}

exports.tagArticle = tagArticle;
