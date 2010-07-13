/**
 * @autor noe
 */

WebDoc.Discussion = $.klass(WebDoc.Record, {

  initialize: function($super, json, associatedType, associatedId) {

    this.hasMany = {
      comments: WebDoc.Comment
    };
    this.comments = [];

    $super(json);

    if(associatedType && associatedId && associatedType === 'page') {
      this.data[associatedType + '_id'] = associatedId;
    }
    else {
      ddd('[Discussion] bad associated type or associated id');
      return false;
    }

    if(this.data.properties === undefined) {
      this.data.properties = {};
    }


  },

  setPosition: function(position, skipSave) {
    this.data.properties.position = position;
    if(!skipSave && !skipSave === true) {
      this.fireObjectChanged({ modifedAttribute: 'position' });
      this.save();
    }
  },

  position: function() {
    if(this.data.properties.position) {
        return this.data.properties.position;
    }
    else {
        return undefined;
    }
  },

  addComment: function(addedComment) {
    this.comments.push(addedComment);
    this.fireCommentAdded(addedComment);
  },

  fireCommentAdded: function(addedComment) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].fireCommentAdded) {
        this.listeners[i].fireCommentAdded(addedComment);
      }
    }
  }

});

$.extend(WebDoc.Discussion, {

  className: function() {
    return "discussion";
  },

  rootUrl: function(args) {
    return "";
  },
  pluralizedClassName: function() {
    return "discussions";
  }
});