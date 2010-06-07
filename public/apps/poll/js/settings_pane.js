
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

// gadgets.log("coooooooooooooooo");


// var widgetIframe;
// 
// $(document).ready(function() {
//     // setInterval(heightResize, 100);
//     // widgetIframe = $(parent.document).find("#inspector");
// });
// 
// function heightResize(){
//   var widgetHeight = $('.inspector').height();
//   var widgetIframeHeight = widgetIframe.height();
//   widgetIframe.removeAttr("height").css({ height: widgetHeight+25 });
// }





// 
// newMessage: function(receiver, action) {
//   $('#messages').append($('<li>').html("<li>[to " + receiver + "] : " + action + "</li>"));
//   
//   if(receiver != null) receiver = $('#'+receiver, this.parentWin.document)[0].contentWindow;
//   else receiver = this.parentWin;
//   
//   if(receiver != null) receiver.postMessage(mainId + "," + action, '*');
//   else gadgets.log("receiver is null!");
// },
// onmessage: function(e) {
//   var dataArray_ = e.data.split(',');
//   var origin = e.origin;
//   var fromId = dataArray_[0];
//   var message = dataArray_[1];
//   if(origin == document.location.protocol + "//" + document.location.host) {
//     gadgets.log("in main from same domain, module: " + fromId + ", message: " + message);
//     
//     document.getElementById('messages').innerHTML += "<li>[from " +fromId+ "] " + message + "</li>";
//     gadgets.log(e.source);
//     e.source.postMessage('with e.source','*');
//   }
//   else {
//     gadgets.log("from somewhere else: " + origin);
//   }
// }