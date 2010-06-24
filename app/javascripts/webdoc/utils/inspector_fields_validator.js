/**
 * @author David Matthey
 */

(function(undefined){

WebDoc.InspectorFieldsValidator = $.klass({});

$.extend(WebDoc.InspectorFieldsValidator, {

  validateBackgroundUrl: function(url) {
    var re = new RegExp("^url\((?:\"|')?(.*)(?:\"|')?\)$"); // Accepts string of type url(/images/back.png)
    if(url && !url.match(re)) {
      throw("this method needs a value of type: url(<url>)");
    }
  },

  validateBackgroundRepeat: function(repeatMode) {
    var re = new RegExp("^(none|repeat-x|repeat-y|no-repeat)$");
    if(!repeatMode.match(re)) {
      throw("this method needs a value among these: none, repeat-x, repeat-y. no-repeat");
    }
  },
  
  validateUrl: function(url) {
    var re = new RegExp("^http\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(/\S*)?"); 
    if(!url.match(re)) {
      throw("this method requires a valid url");
    }
  },

  // Takes a string of type "url(/images/background/back.png)" and returns only the file path
  getUrlContent: function(url) {
    var re = new RegExp("^url\((?:\"|')?(.*)(?:\"|')?\)$");
    if(!url.match(re)) {
      throw("this method needs a value of type: url(<url>)");
    }
    return re.exec(url)[1];
  }
});

})();