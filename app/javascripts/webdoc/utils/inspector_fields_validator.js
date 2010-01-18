/**
 * @author david
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

  validatePixelSize: function(size) {
    var re = new RegExp("^\\d+px$"); // Accepts only string of type <integer>px
    if(!size.match(re)) {
      throw("this method needs a valid pixel value (ex: 200px)");
    }
  },

  validateBackgroundUrl: function(url) {
    var re = new RegExp("^url\((?:\"|')?(.*)(?:\"|')?\)$");
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

  // Takes a string of type "url(/images/background/back.png)" and returns only the file path
  getUrlContent: function(url) {
    var re = new RegExp("^url\((?:\"|')?(.*)(?:\"|')?\)$");
    if(!url.match(re)) {
      throw("this method needs a value of type: url(<url>)");
    }
    return re.exec(url)[1];
  }
});
