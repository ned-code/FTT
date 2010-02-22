/**
 * @author David Matthey
 */
WebDoc.InspectorFieldsValidator = $.klass(
{
});

$.extend(WebDoc.InspectorFieldsValidator, {
  validateColor: function(color) {
    var re = new RegExp("^#([0-9a-f]{3}|[0-9a-f]{6})$"); // Accepts only strings of type #fff or #ffffff
    if(!color.match(re)) {
      throw("this method needs a valid color (ex: #ffffff or #ddd)"); 
    }
  },

  validateSize: function(size) {
    var re = new RegExp("^\\d+(px|%)$"); // Accepts only string of type <integer>px or <integer>%
    if(!size.match(re)) {
      throw("this method needs a valid pixel value (ex: 200px)");
    }
  },

  validateBackgroundUrl: function(url) {
    var re = new RegExp("^url\((?:\"|')?(.*)(?:\"|')?\)$"); // Accepts string of type url(/images/back.png)
    if(!url.match(re)) {
      throw("this method needs a value of type: url(<url>)");
    }
  },

  validateBackgroundRepeat: function(repeatMode) {
    var re = new RegExp("^(none|repeat-x|repeat-y|no-repeat)$");
    if(!repeatMode.match(re)) {
      throw("this method needs a value among these: none, repeat-x, repeat-y. no-repeat");
    }
  },

  validateBackgroundPosition: function(position) {
    var re = new RegExp("^((top|center|bottom)\\s(left|center|right))|((left|center|right)\\s(top|center|bottom))$");
    if(!position.match(re)) {
      throw("this method needs a combination of the following values: top, center, bottom - left, center, right");
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
