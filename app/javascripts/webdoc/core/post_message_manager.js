/**
 * PostMessageManager is the class to start and process received message from postMessage
 *
 * @author Noe
**/

WebDoc.PostMessageManager = $.klass({
  initialize: function() {
    ddd('initialize message manager');
    this.startListener();
  },

  startListener: function() {
    window.addEventListener("message", function(e){
      ddd('received a new message:' + e.data);
      // e.domain e.data e.source e.origin
      // if (event.origin !== "http://localhost") {
      //   return;
      // }
    }, false);
  }

});
