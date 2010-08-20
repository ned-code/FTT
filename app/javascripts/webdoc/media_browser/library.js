/**
 * @author Zeno Crivelli
	modified by Jonathan
**/

// Generic class to be used as parent class for every library implementation (Images library, Videos library ,etc).
// Do not instanciate this directly (use one of its subclasses)
WebDoc.Library = $.klass({
  initialize: function(libraryId) {
    this.elementId = libraryId;
    this.element = jQuery('#'+libraryId);
    this.domNode = this.element;
    this.libraryUtils = new LibraryUtils();
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
    var mediaThumb = $("<img>").attr({ src:thumbUrl }),
        icon = $("<span>");
    var mediaDragFeedback = $("<div>").attr({
      id:"media_drag_feedback",
      'class':type
    })
    .css({ position:"absolute", top:"-500px" }) // because I can't use hide() in this case (or setDragImage won't work)
    .append(icon).append(mediaThumb);
    ddd('mediaDragFeedback', mediaDragFeedback);
    return mediaDragFeedback;
  },
  
  buildVideoRow: function(type, videoId, url, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height, uuid) {
      var properties = { 
        type: type,
        video_id: videoId,
        url: url,
        thumb_url: thumbUrl,
        name: name,
        duration: duration,
        view_count: viewCount,
        description: description,
        embed_url: embedUrl,
        embed_type: embedType,
        aspect_ratio: aspectRatio,  //yt
        is_hd: isHd,                //vimeo
        width: width,               //vimeo
        height: height,              //vimeo
        uuid: uuid
      };
  
      var thumb = $("<img>").attr({
        src : thumbUrl,
        style: '-webkit-user-drag:element;-khtml-user-drag: element;',
        draggable: true
      })
      .data("properties", properties);
  
      var thumbWrap = $("<span>").attr({'class':'wrap'});
      thumbWrap.append(thumb);
  
      var titleEl = $("<strong>").addClass("title").text(name);
      var viewCountEl = $("<span>").addClass("view_count").text(this.numberWithThousandsSeparator(viewCount,"'")+" views");
      var durationEl = $("<span>").addClass("duration").text(this.timeFromSeconds(duration));
      var liWrap = $("<li id='" + uuid +"'>").addClass("video_row").addClass(type);
      var aWrap = $("<a/>").attr({
          href: '',
          draggable:true
        });
      if (isHd === "1") thumbWrap.append($("<span>").addClass("hd_icon_overlay"));
      aWrap.append(thumbWrap).append(titleEl).append(durationEl).append(viewCountEl).append($("<span>").attr({'class':'spacer'}));
  
      liWrap.append(aWrap);
      return liWrap;
    },
    
    buildEmbeddedVideo: function(properties) {		
      var url,width,height;

      switch (properties.type) {
        case 'youtube':
          url = properties.embed_url + "&fs=1&hd=1&showinfo=0";
          width = "100%";
          height = "auto";//properties.aspect_ratio === "widescreen" ? 200 : 265;
          break;
        case 'vimeo' :
          url = properties.embed_url;
          width = "100%";
          height = "auto";//parseInt(width * (properties.height / properties.width), 10);
          break;
      }

      var object = $("<object>").attr({
        width: width,
        height: height
      })
      .append($("<param>").attr({ name: "movie", value: url }))
      .append($("<param>").attr({ name: "allowfullscreen", value: "true" }))
      .append($("<param>").attr({ name: "allowscriptaccess", value: "always" }))
      .append($("<embed>").attr({ 
        src: url,
        type: properties.embed_type,
        allowscriptaccess: "always",
        allowfullscreen: "true",
        width: width,
        height: height
      }));

      return object;
    }
});