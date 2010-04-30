/**
 * @author David Matthey
 */

(function(undefined){


WebDoc.InspectorFieldsValidator = $.klass(
{
});

$.extend(WebDoc.InspectorFieldsValidator, {
  validateColor: function(color) {
    var hex = jQuery.regex.hexColor,
        hsl = jQuery.regex.hslColor,
        rgb = jQuery.regex.rgbColor;
    
    if( !rgb.test(color) && !hsl.test(color) && !hex.test(color) && !(color === '') && !colors[color] ){
      throw("this method needs a valid color");
    }
    
    return true;
  },
  
  validateSize: function(size) {
    var re = jQuery.regex.cssMeasure;
    if( !re.test(size) ) {
      throw("this method needs a valid pixel value (ex: 200px)");
    }
  },

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

// Valid CSS color names
var colors = {
  aqua: true,
  black: true,
  blue: true,
  fuchsia: true,
  gray: true,
  green: true,
  lime: true,
  maroon: true,
  navy: true,
  olive: true,
  purple: true,
  red: true,
  silver: true,
  teal: true,
  white: true,
  yellow: true,
  transparent: true
};


})()