
//= require <mtools/record>

WebDoc.User = $.klass(WebDoc.Record, {
  initialize: function($super, json) {
    $super(json);
  },

  getUsername: function() {
    return this.data.username;
  },

  getAvatarThumbUrl: function() {
    if (this.data.avatar_thumb_url) {
      return this.data.avatar_thumb_url;
    }
    else {
      return "";
    }
  }
});

$.extend(WebDoc.User, {
  
  className: function() {
    return "user";
  },
  
  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return this.className() + "s";
  }    
});