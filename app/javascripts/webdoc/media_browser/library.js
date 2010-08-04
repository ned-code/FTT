/**
 * @author Zeno Crivelli
	modified by Jonathan
**/

// Generic class to be used as parent class for every library implementation (Images library, Videos library ,etc).
// Do not instanciate this directly (use one of its subclasses)
WebDoc.Library = $.klass({
  initialize: function(libraryId) {
    this.elementId = libraryId;
    this.element = $('#'+libraryId);
  },

  showSpinner: function(container) {
    //common code to be executed for all subclasses
    container.append($('<div class="loading">Loading</div>'));
  },

  hideSpinner: function(container) {
    //common code to be executed for all subclasses
    container.find('.loading').remove();
  },

	createHandlers: function(domeNode, eventType, obj, context){
    domeNode.delegate('a', eventType, WebDoc.handlers._makeLinkHandler( obj, context ) );
    //NOTE: _makeLinkHandler( obj, context ) is supposed to be private, but it's an easy way to listen the link
  },
});

LibraryUtils = $.klass({
  initialize: function() {},
  timeFromSeconds: function(t) {
    if (t==="") return "n/a";
    
    var h = Math.floor(t / 3600);
    t %= 3600;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    
    h = h>0 ? ( h<10 ? '0'+h : h )+':' : '';
    m = m>0 ? ( m<10 ? '0'+m : m )+':' : '00:';
    s = s>0 ? ( s<10 ? '0'+s : s ) : '00';
    return h+m+s;
  },
  _reverseString: function(string) {
    return string.split('').reverse().join('');
  },
  numberWithThousandsSeparator: function(number, separator) {
    var sep = separator || ",";
    
    // http://www.codeproject.com/KB/scripting/prototypes.aspx
    var reversedNumberString = this._reverseString(""+number);
    var r = '';
    for (var i = 0; i < reversedNumberString.length; i++) {
     r += (i > 0 && i % 3 == 0 ? sep : '') + reversedNumberString.charAt(i);
    }
    return this._reverseString(r);
    
    // old (only working if number < 1'000'000)
    // var regexp = /\d{1,3}(?=(\d{3})+(?!\d))/g;
    // return (""+number).replace(regexp, "$1"+sep);
  },

  buildMediaDragFeedbackElement: function(type, thumbUrl) { //type=image|video
    $("#media_drag_feedback").remove();
    var mediaThumb = $("<img>").attr({ src:thumbUrl }), icon = $("<span>");
    var mediaDragFeedback = $("<div>").attr({ id:"media_drag_feedback", 'class':type })
    .css({ position:"absolute", top:"-500px" }) // because I can't use hide() in this case (or setDragImage won't work)
    .append(icon).append(mediaThumb);
  
    return mediaDragFeedback;
  }
});