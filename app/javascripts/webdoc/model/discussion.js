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

  refresh: function($super, json, onlyMissingValues) {
    $super(json, onlyMissingValues);



    // if (json.page.items && $.isArray(json.page.items)) {
    //   this.items = [];
    //   for (var i = 0; i < this.data.items.length; i++) {
    //     var itemData = this.data.items[i];
    //     this.createOrUpdateItem({ item: itemData });
    //   }
    // }
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

  createComment: function(commentData) {
    var newComment = new WebDoc.Comment(commentData, this);
    this.addComment(newComment);
  },

  addComment: function(addedComment) {
    this.comments.push(addedComment);
    this.fireCommentAdded(addedComment);
  },

  fireCommentAdded: function(addedComment) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].commentAdded) {
        this.listeners[i].commentAdded(addedComment);
      }
    }
  },

  removeComment: function(comment) {
    comment.destroy();
    var index = jQuery.inArray(comment, this.comments);
    if (index > -1) {
      this.comments.splice(index, 1);
    }
    this.fireCommentRemoved(comment);
  },

  fireCommentRemoved: function(removedComment) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].commentRemoved) {
        this.listeners[i].commentRemoved(removedComment);
      }
    }
  },

  // for xmpp notification, see collaboration manager
  createOrUpdateOrDestroyComment: function(commentData) {
    var comment = this.findCommentByUuid(commentData.comment.uuid);
    if (commentData.action == "delete") {
      this.removeComment(comment);
    }
    else if (!comment) {
      this.createComment(commentData);
    }
  },

  findCommentByUuid: function(uuid) {
    for (var i=0; i<this.comments.length; i++) {
      var aComment = this.comments[i];
      if (aComment.uuid() == uuid) {
        return aComment;
      }
    }
    return null;
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