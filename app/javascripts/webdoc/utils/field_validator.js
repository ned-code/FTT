/**
 * @author David Matthey
 */
WebDoc.FieldValidator = $.klass(
{
});

$.extend(WebDoc.FieldValidator, {
  isValidUrl: function(url) {
    var re = new RegExp("^http\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(/\S*)?"); //(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?
    return re.test(url);
  }
});
