/**
 * @autor noe
 */

WebDoc.Comment = $.klass(WebDoc.Record, {

  initialize: function($super, json, discussion, user) {

    this.belongsTo = {
      discussion: WebDoc.Discussion,
      user: WebDoc.User
    };
    this.discussion = discussion;
    this.user = user;

    $super(json);

    this.data.discussion_id = discussion.uuid();

  },

  rootUrlArgs: function() {
    if (this.discussion) {
      return {
        discussion_id: this.discussion.uuid()
      };
    }
    else {
      ddd("[Comment] comment without discussion!");
      return {};
    }
  },

  setContent: function(content, skipSave) {
    this.data.content = content;
    if(!skipSave && !skipSave === true) {
      this.fireObjectChanged({ modifedAttribute: 'content' });
      this.save();
    }
  },

  content: function() {
    if(this.data.content) {
      return this.data.content;
    }
    else {
      return undefined;
    }
  },

  created_at: function() {
    return this.data.created_at;
  }


});

$.extend(WebDoc.Comment, {

  className: function() {
    return "comment";
  },
  
  rootUrl: function(args) {
    return "/discussions/" + args.discussion_id;
  },

  pluralizedClassName: function() {
    return "comments";
  }
});