var tags = require('../config/tags.json');

function slugify(text) {
  return text.toString().toLowerCase()
    //.replace(/\s+/g, "") // Replace spaces with space
    .replace(/[^\w\-\s]+/g, ' ') // Remove all non-word chars
    .replace(/\-+/g, ' - ') //adds spaces between pre-existant -
    .replace(/\-\-+/g, ' - ') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function NormalizeAccents(s) {
    var r = s.toLowerCase();

    //r = r.replace(new RegExp("\\s", 'g'), "");
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

function capitalize(string) {
  var words = string.split(" ");
  for(var word in words) {
    words[word] = words[word].charAt(0).toUpperCase() + words[word].slice(1);
  }
  return words.join(" ");
}

function tagArticle(post, callback) {

  var postTags = post.tags;
  var articleTitle = slugify(NormalizeAccents(post.title));
  var articleDescription = slugify(NormalizeAccents(post.content));
  for (var tag in tags) {
    var tagSearch = slugify(NormalizeAccents(tags[tag]));
    var regXSearch = new RegExp(tagSearch, "g");
    if(postTags.indexOf(tags[tag]) == -1 && articleTitle.search(regXSearch) != -1) {
      var articleTitleArray = articleTitle.split(" ");
      var tagArray = tagSearch.split(" ");
      for(var i = 0; i < tagArray.length; i++) {
        if(articleTitleArray.indexOf(tagArray[i]) == -1) {
          break;
        }
      }
      if(i == tagArray.length) {
        postTags.push(capitalize(tags[tag]));
      }
    }
    else if (postTags.indexOf(tags[tag]) == -1 && articleDescription.search(regXSearch) != -1) {
      var articleDescriptionArray = articleDescription.split(" ");
      var tagArray = tagSearch.split(" ");
      if(post.title == "Beneficio, Alpujarra, Sierra Nevada I") {
      }
      for(var i = 0; i < tagArray.length; i++) {
        if(articleDescriptionArray.indexOf(tagArray[i]) == -1) {
          break;
        }
      }
      if(i == tagArray.length) {
        postTags.push(capitalize(tags[tag]));
      }
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
