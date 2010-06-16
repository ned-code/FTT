
gadgets.util.registerOnLoadHandler(function() {

  var pollSettings = new PollSettings();
  
}); 


PollSettings = $.klass({
  initialize: function() {
    $('#setting_allow_multiple_selection').bind('change', function() {
      WebDoc.appCall("allowMultipleSelection", this.checked);
    });
  }
});
