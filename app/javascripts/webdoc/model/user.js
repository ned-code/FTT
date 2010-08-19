
//= require <mtools/record>

WebDoc.UserRole = {
  ROLE_NAME_ADMIN: 'admin',
  ROLE_NAME_EDITOR: 'editor',
  ROLE_NAME_CONTRIBUTOR: 'contributor',
  ROLE_NAME_VIEWER_COMMENT: 'viewer_comment',
  ROLE_NAME_VIEWER_ONLY: 'viewer_only'
};

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